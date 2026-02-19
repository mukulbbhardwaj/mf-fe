import { FC, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Layout from "@/Layout";
import useStore from "@/store/userStore";
import getPortfolioInfo from "@/api/getPortfolioInfo";
import {
  getChallengeStats,
  getChallengeLeaderboard,
  type ChallengeStats,
} from "@/api/challenge";
import { formatPrice } from "@/lib/utils";
import { cn } from "@/lib/utils";
import {
  Loader2,
  Wallet,
  TrendingUp,
  Target,
  Award,
  ChevronRight,
  BarChart3,
  Gamepad2,
} from "lucide-react";

type PortfolioData = {
  portfolioId: number;
  totalAmount: number;
  initialAmount: number;
  currentValue: number;
  totalReturn: number;
  totalReturnPercent: number;
  symbolsOwned?: { symbolName: string; quantity: number }[];
  breakdown?: {
    cash: number;
    totalHoldingsValue: number;
    holdings: unknown[];
  };
};

const ProfilePage: FC = () => {
  const navigate = useNavigate();
  const userStore = useStore();
  const [portfolio, setPortfolio] = useState<PortfolioData | null>(null);
  const [challengeStats, setChallengeStats] = useState<ChallengeStats | null>(null);
  const [challengeRank, setChallengeRank] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!userStore.user) {
      navigate("/login");
      return;
    }

    let cancelled = false;
    setLoading(true);
    setError(null);

    Promise.all([
      getPortfolioInfo().catch(() => null),
      getChallengeStats().catch(() => null),
      getChallengeLeaderboard(100).then((res) => {
        const me = res.entries.find((e) => e.isCurrentUser);
        return me ? me.rank : null;
      }).catch(() => null),
    ])
      .then(([p, stats, rank]) => {
        if (cancelled) return;
        setPortfolio(p ?? null);
        setChallengeStats(stats ?? null);
        setChallengeRank(rank);
      })
      .catch((e) => {
        if (!cancelled) setError(e instanceof Error ? e.message : "Something went wrong");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => { cancelled = true; };
  }, [userStore.user, navigate]);

  if (!userStore.user) return null;

  const holdingsCount = portfolio?.symbolsOwned?.length ?? portfolio?.breakdown?.holdings?.length ?? 0;
  const returnPercent = portfolio?.totalReturnPercent ?? 0;
  const isPositiveReturn = returnPercent >= 0;

  return (
    <Layout>
      <div className="max-w-4xl mx-auto">
        {/* Profile header */}
        <section className="relative rounded-2xl overflow-hidden mb-8">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-muted/20 to-energy-orange/10" />
          <div className="relative px-6 py-8 sm:px-8 sm:py-10">
            <div className="flex items-center gap-4">
              <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-primary/80 text-2xl font-bold text-primary-foreground shadow-lg">
                {userStore.user.username.slice(0, 2).toUpperCase()}
              </div>
              <div>
                <h1 className="text-2xl font-bold tracking-tight">
                  {userStore.user.username}
                </h1>
                <p className="text-sm text-muted-foreground mt-0.5">
                  {userStore.user.email}
                </p>
                <p className="text-xs text-primary/90 mt-1">Your Monke. Your progress.</p>
              </div>
            </div>
          </div>
        </section>

        {error && (
          <p className="text-destructive text-sm mb-4">{error}</p>
        )}

        {loading ? (
          <div className="flex items-center justify-center py-20 gap-2 text-muted-foreground">
            <Loader2 className="h-6 w-6 animate-spin" />
            <span>Loading your Monke stats…</span>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2">
            {/* Portfolio at a glance */}
            <Link
              to="/dashboard"
              className="group block rounded-2xl border border-border bg-card overflow-hidden hover:bg-card-hovered hover:border-primary/30 transition-all duration-200"
            >
              <div className="p-5 sm:p-6">
                <div className="flex items-center justify-between mb-4">
                  <span className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                    <Wallet className="h-4 w-4 text-primary" />
                    Portfolio
                  </span>
                  <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-0.5 transition-all" />
                </div>
                {portfolio ? (
                  <>
                    <p className="text-2xl sm:text-3xl font-bold tabular-nums">
                      {formatPrice(portfolio.currentValue, true)}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      from {formatPrice(portfolio.initialAmount, true)} initial
                    </p>
                    <div className="mt-4 flex flex-wrap items-center gap-3">
                      <span
                        className={cn(
                          "inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-sm font-medium",
                          isPositiveReturn
                            ? "bg-profit/15 text-profit"
                            : "bg-loss/15 text-loss"
                        )}
                      >
                        <TrendingUp className="h-3.5 w-3.5" />
                        {isPositiveReturn ? "+" : ""}
                        {returnPercent.toFixed(2)}%
                      </span>
                      {holdingsCount > 0 && (
                        <span className="text-sm text-muted-foreground">
                          {holdingsCount} holding{holdingsCount !== 1 ? "s" : ""}
                        </span>
                      )}
                    </div>
                  </>
                ) : (
                  <p className="text-muted-foreground text-sm">
                    No portfolio data yet. Start paper trading to see stats.
                  </p>
                )}
              </div>
            </Link>

            {/* Challenge performance */}
            <Link
              to="/challenge"
              className="group block rounded-2xl border border-border bg-card overflow-hidden hover:bg-card-hovered hover:border-energy-orange/30 transition-all duration-200"
            >
              <div className="p-5 sm:p-6">
                <div className="flex items-center justify-between mb-4">
                  <span className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                    <Gamepad2 className="h-4 w-4 text-energy-orange" />
                    Chart Challenge
                  </span>
                  <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-energy-orange group-hover:translate-x-0.5 transition-all" />
                </div>
                {challengeStats ? (
                  <>
                    <div className="flex items-baseline gap-2">
                      <p className="text-2xl sm:text-3xl font-bold tabular-nums">
                        {challengeStats.totalScore >= 0 ? "+" : ""}
                        {challengeStats.totalScore.toFixed(1)}
                      </p>
                      <span className="text-sm text-muted-foreground">total score</span>
                    </div>
                    <div className="mt-4 flex flex-wrap items-center gap-3">
                      {challengeRank != null && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-energy-orange/15 px-2.5 py-0.5 text-sm font-medium text-energy-orange">
                          <Award className="h-3.5 w-3.5" />
                          {challengeRank === 1 ? "Top Monke" : `Rank #${challengeRank}`}
                        </span>
                      )}
                      <span className="text-sm text-muted-foreground">
                        {challengeStats.correctCount}/{challengeStats.totalAttempts} correct
                      </span>
                      <span className="text-sm text-muted-foreground">
                        avg {challengeStats.averageScore >= 0 ? "+" : ""}
                        {challengeStats.averageScore.toFixed(1)}
                      </span>
                    </div>
                  </>
                ) : (
                  <p className="text-muted-foreground text-sm">
                    Your Monke hasn&apos;t played yet. Play Chart Challenge to get on the board.
                  </p>
                )}
              </div>
            </Link>
          </div>
        )}

        {/* Quick actions */}
        <section className="mt-10">
          <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-4">
            Quick actions
          </h2>
          <div className="flex flex-wrap gap-3">
            <Link
              to="/dashboard"
              className="inline-flex items-center gap-2 rounded-xl border border-border bg-card px-4 py-2.5 text-sm font-medium hover:bg-card-hovered hover:border-primary/30 transition-colors"
            >
              <BarChart3 className="h-4 w-4 text-primary" />
              Full portfolio
            </Link>
            <Link
              to="/challenge"
              className="inline-flex items-center gap-2 rounded-xl border border-border bg-card px-4 py-2.5 text-sm font-medium hover:bg-card-hovered hover:border-energy-orange/30 transition-colors"
            >
              <Target className="h-4 w-4 text-energy-orange" />
              Play Chart Challenge
            </Link>
            <Link
              to="/leaderboard"
              className="inline-flex items-center gap-2 rounded-xl border border-border bg-card px-4 py-2.5 text-sm font-medium hover:bg-card-hovered hover:border-elite/30 transition-colors"
            >
              <Award className="h-4 w-4 text-elite" />
              View leaderboard
            </Link>
          </div>
        </section>
      </div>
    </Layout>
  );
};

export default ProfilePage;
