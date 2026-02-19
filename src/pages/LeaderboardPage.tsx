import { FC, useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import Layout from "../Layout";
import useStore from "@/store/userStore";
import {
  getLeaderboard,
  getMyRank,
  type LeaderboardEntry,
  type MyRankEntry,
} from "@/api/leaderboard";
import { getChallengeLeaderboard, type ChallengeLeaderboardEntry } from "@/api/challenge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Loader2, ChevronLeft, ChevronRight, Trophy } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

function formatWeekLabel(isoDate: string): string {
  const d = new Date(isoDate);
  return d.toLocaleDateString("en-IN", {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function weekToISO(weekStart: string, deltaDays: number): string {
  const d = new Date(weekStart);
  d.setUTCDate(d.getUTCDate() + deltaDays);
  return d.toISOString().slice(0, 10);
}

function getCurrentWeekMondayUTC(): Date {
  const now = new Date();
  const d = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
  const day = d.getUTCDay();
  const diff = day === 0 ? -6 : 1 - day;
  d.setUTCDate(d.getUTCDate() + diff);
  return d;
}

function isCurrentOrPastWeek(weekStartISO: string): boolean {
  const monday = new Date(weekStartISO + "T00:00:00.000Z");
  const currentMonday = getCurrentWeekMondayUTC();
  return monday.getTime() <= currentMonday.getTime();
}

const LeaderboardPage: FC = () => {
  const navigate = useNavigate();
  const userStore = useStore();
  const [selectedWeek, setSelectedWeek] = useState<string | null>(null);
  const [weekStartDate, setWeekStartDate] = useState<string | null>(null);
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [myRank, setMyRank] = useState<MyRankEntry | null | "none">(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [challengeEntries, setChallengeEntries] = useState<ChallengeLeaderboardEntry[]>([]);
  const [challengeLoading, setChallengeLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const params = selectedWeek ? { week: selectedWeek } : undefined;
      const [boardRes, meRes] = await Promise.all([
        getLeaderboard({ limit: 50, ...(params && { week: params.week }) }),
        getMyRank(params?.week),
      ]);
      setWeekStartDate(boardRes.weekStartDate);
      setEntries(boardRes.entries);
      setMyRank(meRes.entry ?? "none");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load leaderboard");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!userStore.user) {
      navigate("/login");
      return;
    }
    load();
  }, [selectedWeek]);

  useEffect(() => {
    if (!userStore.user) return;
    setChallengeLoading(true);
    getChallengeLeaderboard(50)
      .then((res) => setChallengeEntries(res.entries))
      .catch(() => setChallengeEntries([]))
      .finally(() => setChallengeLoading(false));
  }, [userStore.user]);

  const goPrevWeek = () => {
    if (!weekStartDate) return;
    setSelectedWeek(weekToISO(weekStartDate, -7));
  };

  const goNextWeek = () => {
    if (!weekStartDate) return;
    const next = weekToISO(weekStartDate, 7);
    if (!isCurrentOrPastWeek(next)) return;
    setSelectedWeek(next);
  };

  const nextWeekStart = weekStartDate ? weekToISO(weekStartDate, 7) : null;
  const canGoNext =
    nextWeekStart && isCurrentOrPastWeek(nextWeekStart);

  if (!userStore.user) return null;

  return (
    <Layout>
      <div className="max-w-4xl mx-auto space-y-8">
        <section>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <Trophy className="h-8 w-8 text-amber-500" />
            Leaderboard
          </h1>
          <p className="text-muted-foreground mt-2 max-w-xl">
            Weekly crypto paper trading rankings. Score = Total Return % − Max Drawdown %. Higher is better.
          </p>
          <Link to="/challenge" className="text-sm text-primary hover:underline mt-2 inline-block">
            Play Market Replay →
          </Link>
        </section>

        {weekStartDate && (
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-sm text-muted-foreground">Week of</span>
            <span className="font-medium">{formatWeekLabel(weekStartDate)}</span>
            <div className="flex gap-1 ml-2">
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8"
                onClick={goPrevWeek}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8"
                onClick={goNextWeek}
                disabled={!canGoNext}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
            {selectedWeek && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSelectedWeek(null)}
              >
                Current week
              </Button>
            )}
          </div>
        )}

        {myRank !== null && myRank !== "none" && (
          <section className="rounded-2xl border border-border bg-card p-4 sm:p-6">
            <h2 className="text-sm font-medium text-muted-foreground mb-2">
              Your rank
            </h2>
            <div className="flex flex-wrap items-center gap-4">
              <span className="text-xl font-semibold">#{myRank.rank}</span>
              <span className="text-muted-foreground">{myRank.username}</span>
              <span>
                Return:{" "}
                <span
                  className={cn(
                    myRank.totalReturn >= 0 ? "text-profit" : "text-loss"
                  )}
                >
                  {myRank.totalReturn >= 0 ? "+" : ""}
                  {myRank.totalReturn.toFixed(2)}%
                </span>
              </span>
              <span className="text-muted-foreground">
                Max DD: {myRank.maxDrawdown.toFixed(2)}%
              </span>
              <span className="font-medium">
                Score: {myRank.score >= 0 ? "+" : ""}
                {myRank.score.toFixed(2)}
              </span>
            </div>
          </section>
        )}

        {myRank === "none" && weekStartDate && (
          <p className="text-muted-foreground text-sm">
            No stats for this week yet. Trade to get ranked.
          </p>
        )}

        {error && (
          <p className="text-destructive">{error}</p>
        )}

        {loading ? (
          <div className="flex items-center justify-center py-12 gap-2">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            <span className="text-muted-foreground">Loading…</span>
          </div>
        ) : (
          <section className="rounded-2xl border border-border overflow-hidden">
            <h2 className="text-sm font-medium text-muted-foreground px-4 pt-4">
              Crypto paper trading · Weekly
            </h2>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-16">Rank</TableHead>
                  <TableHead>Username</TableHead>
                  <TableHead className="text-right">Return %</TableHead>
                  <TableHead className="text-right">Max DD %</TableHead>
                  <TableHead className="text-right">Score</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {entries.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                      No entries for this week.
                    </TableCell>
                  </TableRow>
                ) : (
                  entries.map((entry) => (
                    <TableRow
                      key={entry.userId}
                      className={cn(
                        entry.isCurrentUser && "bg-primary/10 border-primary/30"
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
                      <TableCell
                        className={cn(
                          "text-right",
                          entry.totalReturn >= 0 ? "text-profit" : "text-loss"
                        )}
                      >
                        {entry.totalReturn >= 0 ? "+" : ""}
                        {entry.totalReturn.toFixed(2)}%
                      </TableCell>
                      <TableCell className="text-right text-muted-foreground">
                        {entry.maxDrawdown.toFixed(2)}%
                      </TableCell>
                      <TableCell className="text-right font-medium">
                        {entry.score >= 0 ? "+" : ""}
                        {entry.score.toFixed(2)}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </section>
        )}

        {/* Market Replay leaderboard */}
        <section className="pt-8 border-t border-border">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Trophy className="h-5 w-5 text-amber-500" />
            Market Replay
          </h2>
          <p className="text-muted-foreground text-sm mb-4">
            Top players by total challenge score (BUY/SELL/HOLD on historical Indian stocks).
          </p>
          {challengeLoading ? (
            <div className="flex items-center gap-2 py-8 text-muted-foreground">
              <Loader2 className="h-5 w-5 animate-spin" />
              <span>Loading…</span>
            </div>
          ) : (
            <div className="rounded-2xl border border-border overflow-hidden">
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
                  {challengeEntries.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                        No entries yet.
                      </TableCell>
                    </TableRow>
                  ) : (
                    challengeEntries.map((entry) => (
                      <TableRow
                        key={entry.userId}
                        className={cn(
                          entry.isCurrentUser && "bg-primary/10 border-primary/30"
                        )}
                      >
                        <TableCell className="font-medium">#{entry.rank}</TableCell>
                        <TableCell>
                          {entry.username}
                          {entry.isCurrentUser && (
                            <span className="ml-2 text-xs text-muted-foreground">(you)</span>
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
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          )}
        </section>
      </div>
    </Layout>
  );
};

export default LeaderboardPage;
