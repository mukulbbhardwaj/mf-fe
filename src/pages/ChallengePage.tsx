import { FC, useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import Layout from "../Layout";
import useStore from "@/store/userStore";
import CandlestickChart from "@/components/challenge/CandlestickChart";
import {
  getChallengeByFilter,
  getChallengeById,
  submitChallenge,
  getChallengeStats,
  type Challenge,
  type SubmitResult,
  type Decision,
  type ChallengeStats,
  type DifficultyFilter,
} from "@/api/challenge";
import { Button } from "@/components/ui/button";
import { Loader2, TrendingUp, TrendingDown, Minus, Zap, Target } from "lucide-react";
import { cn } from "@/lib/utils";

const DIFFICULTIES: { value: DifficultyFilter | null; label: string }[] = [
  { value: "Easy", label: "Easy" },
  { value: "Medium", label: "Medium" },
  { value: "Hard", label: "Hard" },
  { value: null, label: "Any" },
];

const ChallengePage: FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const userStore = useStore();
  const [challenge, setChallenge] = useState<Challenge | null>(null);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<SubmitResult | null>(null);
  const [selectedDecision, setSelectedDecision] = useState<Decision | null>(null);
  const [stats, setStats] = useState<ChallengeStats | null>(null);
  const [statsLoading, setStatsLoading] = useState(false);
  const [selectedDifficulty, setSelectedDifficulty] = useState<DifficultyFilter | null>(null);
  const [showDifficultyPicker, setShowDifficultyPicker] = useState(true);

  const loadStats = async () => {
    setStatsLoading(true);
    try {
      const statsRes = await getChallengeStats();
      setStats(statsRes);
    } catch {
      setStats(null);
    } finally {
      setStatsLoading(false);
    }
  };

  const loadChallengeByFilter = async (difficulty: DifficultyFilter | null) => {
    setLoading(true);
    setError(null);
    setResult(null);
    setSelectedDecision(null);
    setShowDifficultyPicker(false);
    try {
      const data = difficulty
        ? await getChallengeByFilter(difficulty)
        : await getChallengeByFilter();
      setChallenge(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load challenge");
      setShowDifficultyPicker(true);
    } finally {
      setLoading(false);
    }
  };

  const loadChallengeById = async (challengeId: string) => {
    setLoading(true);
    setError(null);
    setResult(null);
    setSelectedDecision(null);
    setShowDifficultyPicker(false);
    try {
      const data = await getChallengeById(challengeId);
      setChallenge(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load challenge");
      setShowDifficultyPicker(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!userStore.user) {
      navigate("/login");
      return;
    }
    loadStats();
    if (id) {
      loadChallengeById(id);
    } else {
      setChallenge(null);
      setShowDifficultyPicker(true);
      setLoading(false);
    }
  }, [id]);

  const handleSubmit = async () => {
    if (!challenge || !selectedDecision) return;
    setSubmitting(true);
    setError(null);
    try {
      const data = await submitChallenge(challenge.id, selectedDecision);
      setResult(data);
      loadStats();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to submit");
    } finally {
      setSubmitting(false);
    }
  };

  const handleNext = async () => {
    setResult(null);
    setSelectedDecision(null);
    setLoading(true);
    setError(null);
    navigate("/challenge");
    try {
      const data = await getChallengeByFilter(selectedDifficulty ?? undefined);
      setChallenge(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load challenge");
    } finally {
      setLoading(false);
    }
  };

  const handleChangeDifficulty = () => {
    setChallenge(null);
    setResult(null);
    setSelectedDecision(null);
    setError(null);
    setShowDifficultyPicker(true);
    navigate("/challenge");
  };

  if (!userStore.user) return null;

  if (showDifficultyPicker && !id) {
    return (
      <Layout>
        <div className="max-w-2xl mx-auto space-y-8">
          <section className="text-center">
            <h1 className="text-3xl font-bold tracking-tight">Market Replay</h1>
            <p className="text-muted-foreground mt-2">
              Choose a difficulty, then get a random chart to practice BUY, SELL, or HOLD.
            </p>
          </section>
          <section className="rounded-2xl border border-border bg-card p-6 sm:p-8">
            <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-widest mb-4">
              Difficulty
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {DIFFICULTIES.map(({ value, label }) => (
                <button
                  key={label}
                  type="button"
                  onClick={() => setSelectedDifficulty(value)}
                  className={cn(
                    "rounded-xl border-2 py-3 px-4 text-sm font-medium transition-all",
                    selectedDifficulty === value
                      ? "border-teal-500 bg-teal-500/15 text-teal-400"
                      : "border-border bg-card hover:border-muted-foreground/50 hover:bg-card-hovered"
                  )}
                >
                  {label}
                </button>
              ))}
            </div>
            {error && <p className="text-destructive text-sm mt-4">{error}</p>}
            <Button
              size="lg"
              className="mt-6 w-full sm:w-auto rounded-full px-8 bg-teal-600 hover:bg-teal-500"
              onClick={() => loadChallengeByFilter(selectedDifficulty)}
            >
              <Zap className="mr-2 h-4 w-4" />
              Start challenge
            </Button>
          </section>
        </div>
      </Layout>
    );
  }

  if (loading && !challenge) {
    return (
      <Layout>
        <div className="flex flex-col items-center justify-center min-h-[40vh] gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          <p className="text-muted-foreground">Loading challenge…</p>
        </div>
      </Layout>
    );
  }

  if (error && !challenge) {
    return (
      <Layout>
        <div className="flex flex-col items-center justify-center min-h-[40vh] gap-4">
          <p className="text-destructive text-center">{error}</p>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => loadChallengeByFilter(selectedDifficulty)}>
              Try again
            </Button>
            <Button variant="ghost" onClick={handleChangeDifficulty}>
              Change difficulty
            </Button>
          </div>
        </div>
      </Layout>
    );
  }

  if (!challenge) return null;

  const allCandles = result
    ? [...challenge.snapshotCandles, ...result.outcomeCandles]
    : challenge.snapshotCandles;
  const outcomeStartIndex = result ? challenge.snapshotCandles.length : undefined;

  return (
    <Layout>
      <div className="max-w-4xl mx-auto space-y-8">
        <section>
          <h1 className="text-3xl font-bold tracking-tight">Market Replay</h1>
          <p className="text-muted-foreground mt-2 max-w-xl">
            Practice with historical Indian stock data. View the chart, choose BUY, SELL, or HOLD, then see how you scored.
          </p>
        </section>

        <section className="rounded-2xl border border-border bg-card p-4 sm:p-6">
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
            <span className="font-medium text-foreground">{challenge.symbol}</span>
            <span>·</span>
            <span>{challenge.timeframe}</span>
            {challenge.market && (
              <>
                <span>·</span>
                <span>{challenge.market}</span>
              </>
            )}
          </div>
          <CandlestickChart
            candles={allCandles}
            height={320}
            showOutcomeFromIndex={outcomeStartIndex}
            className="rounded border border-border bg-muted/20 p-2"
          />
          {outcomeStartIndex !== undefined && (
            <p className="text-xs text-muted-foreground mt-2">
              Faded area = outcome after your decision
            </p>
          )}
        </section>

        {!result ? (
          <>
            <div className="flex flex-wrap gap-3">
              {(["BUY", "SELL", "HOLD"] as const).map((d) => (
                <Button
                  key={d}
                  variant={selectedDecision === d ? "default" : "outline"}
                  size="lg"
                  onClick={() => setSelectedDecision(d)}
                  className={cn(
                    selectedDecision === d &&
                      (d === "BUY"
                        ? "bg-profit hover:bg-profit/90"
                        : d === "SELL"
                        ? "bg-loss hover:bg-loss/90"
                        : "bg-muted-foreground hover:bg-muted-foreground/90")
                  )}
                >
                  {d === "BUY" && <TrendingUp className="mr-2 h-4 w-4" />}
                  {d === "SELL" && <TrendingDown className="mr-2 h-4 w-4" />}
                  {d === "HOLD" && <Minus className="mr-2 h-4 w-4" />}
                  {d}
                </Button>
              ))}
            </div>
            {error && <p className="text-destructive text-sm">{error}</p>}
            <Button
              onClick={handleSubmit}
              disabled={!selectedDecision || submitting}
            >
              {submitting ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : null}
              Submit decision
            </Button>
          </>
        ) : (
          <section className="rounded-2xl border border-border bg-card p-4 sm:p-6 space-y-4">
            <div className="flex items-center gap-3 flex-wrap">
              <span
                className={cn(
                  "text-2xl font-bold",
                  result.correct ? "text-profit" : "text-loss"
                )}
              >
                {result.correct ? "Correct" : "Incorrect"}
              </span>
              <span className="text-2xl font-semibold">
                Score: {result.score >= 0 ? "+" : ""}
                {result.score.toFixed(1)}
              </span>
            </div>
            <p className="text-muted-foreground">{result.explanation}</p>
            <div className="flex gap-4 text-sm">
              <span>Your choice: {result.userDirection}</span>
              <span>Correct direction: {result.correctDirection}</span>
              <span>
                Profit potential: {result.profitPercent >= 0 ? "+" : ""}
                {result.profitPercent.toFixed(2)}%
              </span>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button onClick={handleNext} className="rounded-full px-6">
                Next challenge
              </Button>
              <Button variant="outline" onClick={handleChangeDifficulty} className="rounded-full px-6">
                <Target className="mr-2 h-4 w-4" />
                Change difficulty
              </Button>
            </div>
          </section>
        )}

        {/* Your challenge stats */}
        {!statsLoading && stats && (
          <section className="pt-6 border-t border-border">
            <div className="rounded-2xl border border-border bg-card p-4 sm:p-6">
              <h2 className="text-sm font-medium text-muted-foreground mb-2">
                Your challenge stats
              </h2>
              <div className="flex flex-wrap gap-4">
                <span className="font-semibold">
                  Total score: {stats.totalScore >= 0 ? "+" : ""}
                  {stats.totalScore.toFixed(1)}
                </span>
                <span className="text-muted-foreground">
                  Correct: {stats.correctCount}/{stats.totalAttempts}
                </span>
                <span className="text-muted-foreground">
                  Avg score: {stats.averageScore >= 0 ? "+" : ""}
                  {stats.averageScore.toFixed(2)}
                </span>
              </div>
              <Link to="/leaderboard" className="text-sm text-teal-400 hover:underline mt-2 inline-block">
                View leaderboard →
              </Link>
            </div>
          </section>
        )}
      </div>
    </Layout>
  );
};

export default ChallengePage;
