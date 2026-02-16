import { FC, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Layout from "../Layout";
import useStore from "@/store/userStore";
import CandlestickChart from "@/components/challenge/CandlestickChart";
import {
  getRandomChallenge,
  getChallengeById,
  submitChallenge,
  getChallengeStats,
  getChallengeLeaderboard,
  type Challenge,
  type SubmitResult,
  type Decision,
  type ChallengeStats,
  type ChallengeLeaderboardEntry,
} from "@/api/challenge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Loader2, TrendingUp, TrendingDown, Minus, Trophy } from "lucide-react";
import { cn } from "@/lib/utils";

const ChallengePage: FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const userStore = useStore();
  const [challenge, setChallenge] = useState<Challenge | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<SubmitResult | null>(null);
  const [selectedDecision, setSelectedDecision] = useState<Decision | null>(null);
  const [stats, setStats] = useState<ChallengeStats | null>(null);
  const [leaderboard, setLeaderboard] = useState<ChallengeLeaderboardEntry[]>([]);
  const [statsLeaderboardLoading, setStatsLeaderboardLoading] = useState(false);

  const loadStatsAndLeaderboard = async () => {
    setStatsLeaderboardLoading(true);
    try {
      const [statsRes, boardRes] = await Promise.all([
        getChallengeStats(),
        getChallengeLeaderboard(50),
      ]);
      setStats(statsRes);
      setLeaderboard(boardRes.entries);
    } catch {
      setStats(null);
      setLeaderboard([]);
    } finally {
      setStatsLeaderboardLoading(false);
    }
  };

  const loadChallenge = async () => {
    setLoading(true);
    setError(null);
    setResult(null);
    setSelectedDecision(null);
    try {
      const data = id
        ? await getChallengeById(id)
        : await getRandomChallenge();
      setChallenge(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load challenge");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!userStore.user) {
      navigate("/login");
      return;
    }
    loadChallenge();
    loadStatsAndLeaderboard();
  }, [id]);

  const handleSubmit = async () => {
    if (!challenge || !selectedDecision) return;
    setSubmitting(true);
    setError(null);
    try {
      const data = await submitChallenge(challenge.id, selectedDecision);
      setResult(data);
      loadStatsAndLeaderboard();
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
      const data = await getRandomChallenge();
      setChallenge(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load challenge");
    } finally {
      setLoading(false);
    }
  };

  if (!userStore.user) return null;

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
          <p className="text-destructive">{error}</p>
          <Button variant="outline" onClick={() => loadChallenge()}>
            Try again
          </Button>
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
      <div className="max-w-4xl mx-auto space-y-6">
        <div>
          <h1 className="text-2xl font-semibold">Trading Challenge</h1>
          <p className="text-muted-foreground mt-1">
            Practice with historical Indian stock data. Choose BUY, SELL, or HOLD based on the chart.
          </p>
        </div>

        <div className="rounded-lg border border-border bg-card p-4">
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
        </div>

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
          <div className="rounded-lg border border-border bg-card p-4 space-y-4">
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
            <Button onClick={handleNext}>Next challenge</Button>
          </div>
        )}

        {/* Your challenge stats */}
        {!statsLeaderboardLoading && (stats || leaderboard.length > 0) && (
          <div className="space-y-4 pt-4 border-t border-border">
            {stats && (
              <div className="rounded-lg border border-border bg-card p-4">
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
              </div>
            )}

            {/* Challenge leaderboard */}
            {leaderboard.length > 0 && (
              <div className="rounded-lg border border-border overflow-hidden">
                <h2 className="text-sm font-medium text-muted-foreground px-4 pt-4 flex items-center gap-2">
                  <Trophy className="h-4 w-4 text-amber-500" />
                  Challenge leaderboard
                </h2>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-14">Rank</TableHead>
                      <TableHead>Username</TableHead>
                      <TableHead className="text-right">Total score</TableHead>
                      <TableHead className="text-right">Correct</TableHead>
                      <TableHead className="text-right">Attempts</TableHead>
                      <TableHead className="text-right">Avg score</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {leaderboard.map((entry) => (
                      <TableRow
                        key={entry.userId}
                        className={cn(
                          entry.isCurrentUser &&
                            "bg-primary/10 border-primary/30"
                        )}
                      >
                        <TableCell className="font-medium">
                          #{entry.rank}
                        </TableCell>
                        <TableCell>
                          {entry.username}
                          {entry.isCurrentUser && (
                            <span className="ml-2 text-xs text-muted-foreground">
                              (you)
                            </span>
                          )}
                        </TableCell>
                        <TableCell className="text-right font-medium">
                          {entry.totalScore >= 0 ? "+" : ""}
                          {entry.totalScore.toFixed(1)}
                        </TableCell>
                        <TableCell className="text-right text-muted-foreground">
                          {entry.correctCount}/{entry.totalAttempts}
                        </TableCell>
                        <TableCell className="text-right text-muted-foreground">
                          {entry.totalAttempts}
                        </TableCell>
                        <TableCell className="text-right text-muted-foreground">
                          {entry.averageScore >= 0 ? "+" : ""}
                          {entry.averageScore.toFixed(2)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default ChallengePage;
