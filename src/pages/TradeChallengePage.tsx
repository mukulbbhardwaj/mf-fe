import { FC, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Layout from "../Layout";
import useStore from "@/store/userStore";
import CandlestickChart from "@/components/challenge/CandlestickChart";
import {
  getRandomTradeChallenge,
  submitTradeChallenge,
  type TradeChallenge,
  type TradeSubmitResult,
  type PositionType,
} from "@/api/tradeChallenge";
import { Button } from "@/components/ui/button";
import { Loader2, TrendingUp, TrendingDown, Target } from "lucide-react";
import { cn } from "@/lib/utils";

const TradeChallengePage: FC = () => {
  const navigate = useNavigate();
  const userStore = useStore();
  const [challenge, setChallenge] = useState<TradeChallenge | null>(null);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<TradeSubmitResult | null>(null);
  const [positionType, setPositionType] = useState<PositionType>("LONG");
  const [entryPrice, setEntryPrice] = useState("");
  const [stopLoss, setStopLoss] = useState("");
  const [takeProfit, setTakeProfit] = useState("");

  const loadChallenge = async () => {
    setLoading(true);
    setError(null);
    setResult(null);
    setEntryPrice("");
    setStopLoss("");
    setTakeProfit("");
    try {
      const data = await getRandomTradeChallenge();
      setChallenge(data);
      const candles = data.snapshotCandles;
      if (candles.length > 0) {
        const lastClose = candles[candles.length - 1].close;
        setEntryPrice(String(lastClose));
        setStopLoss(String((lastClose * 0.98).toFixed(2)));
        setTakeProfit(String((lastClose * 1.02).toFixed(2)));
      }
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
  }, [userStore.user, navigate]);

  const handleSubmit = async () => {
    if (!challenge) return;
    const entry = parseFloat(entryPrice);
    const sl = parseFloat(stopLoss);
    const tp = parseFloat(takeProfit);
    if (Number.isNaN(entry) || Number.isNaN(sl) || Number.isNaN(tp)) {
      setError("Enter valid entry, stop loss, and take profit.");
      return;
    }
    setSubmitting(true);
    setError(null);
    try {
      const data = await submitTradeChallenge({
        challengeId: challenge.id,
        position_type: positionType,
        entry_price: entry,
        stop_loss: sl,
        take_profit: tp,
      });
      setResult(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to submit trade");
    } finally {
      setSubmitting(false);
    }
  };

  if (!userStore.user) return null;

  if (loading && !challenge) {
    return (
      <Layout>
        <div className="flex flex-col items-center justify-center min-h-[40vh] gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          <p className="text-muted-foreground">Monke is loading the chart…</p>
        </div>
      </Layout>
    );
  }

  if (error && !challenge) {
    return (
      <Layout>
        <div className="max-w-2xl mx-auto space-y-6">
          <h1 className="text-3xl font-bold tracking-tight">Trade Challenge</h1>
          <p className="text-destructive">{error}</p>
          <Button onClick={loadChallenge}>Try again</Button>
          <Link to="/challenge" className="block text-sm text-primary hover:underline">
            ← Chart Challenge
          </Link>
        </div>
      </Layout>
    );
  }

  if (!challenge) return null;

  const allCandles = result
    ? [...challenge.snapshotCandles, ...(result.forward_candles ?? [])]
    : challenge.snapshotCandles;
  const outcomeStartIndex = result ? challenge.snapshotCandles.length : undefined;

  return (
    <Layout>
      <div className="max-w-4xl mx-auto space-y-8">
        <section>
          <h1 className="text-3xl font-bold tracking-tight">Trade Challenge</h1>
          <p className="text-muted-foreground mt-2 max-w-xl">
            Set LONG or SHORT with entry, stop loss, and take profit. See how the trade would have played out on historical Indian stock data.
          </p>
          <Link to="/challenge" className="text-sm text-primary hover:underline mt-2 inline-block">
            ← Chart Challenge (BUY/SELL/HOLD)
          </Link>
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
              Forward window after your trade (replay)
            </p>
          )}
        </section>

        {!result ? (
          <section className="rounded-2xl border border-border bg-card p-4 sm:p-6 space-y-6">
            <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-widest">
              Your trade
            </h2>
            <div className="flex flex-wrap gap-3">
              <Button
                variant={positionType === "LONG" ? "default" : "outline"}
                size="lg"
                onClick={() => setPositionType("LONG")}
                className={cn(
                  positionType === "LONG" && "bg-profit hover:bg-profit/90 text-primary-foreground"
                )}
              >
                <TrendingUp className="mr-2 h-4 w-4" />
                LONG
              </Button>
              <Button
                variant={positionType === "SHORT" ? "default" : "outline"}
                size="lg"
                onClick={() => setPositionType("SHORT")}
                className={cn(
                  positionType === "SHORT" && "bg-loss hover:bg-loss/90 text-primary-foreground"
                )}
              >
                <TrendingDown className="mr-2 h-4 w-4" />
                SHORT
              </Button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <label className="space-y-1">
                <span className="text-sm text-muted-foreground">Entry price</span>
                <input
                  type="number"
                  step="any"
                  value={entryPrice}
                  onChange={(e) => setEntryPrice(e.target.value)}
                  className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
                />
              </label>
              <label className="space-y-1">
                <span className="text-sm text-muted-foreground">Stop loss</span>
                <input
                  type="number"
                  step="any"
                  value={stopLoss}
                  onChange={(e) => setStopLoss(e.target.value)}
                  className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
                />
              </label>
              <label className="space-y-1">
                <span className="text-sm text-muted-foreground">Take profit</span>
                <input
                  type="number"
                  step="any"
                  value={takeProfit}
                  onChange={(e) => setTakeProfit(e.target.value)}
                  className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
                />
              </label>
            </div>
            {error && <p className="text-destructive text-sm">{error}</p>}
            <Button
              onClick={handleSubmit}
              disabled={submitting}
              className="rounded-full px-8 bg-primary hover:bg-primary/90 text-primary-foreground"
            >
              {submitting ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : null}
              Submit trade
            </Button>
          </section>
        ) : (
          <section className="rounded-2xl border border-border bg-card p-4 sm:p-6 space-y-4">
            <div className="flex items-center gap-3 flex-wrap">
              <span
                className={cn(
                  "text-2xl font-bold",
                  result.score >= 0 ? "text-profit" : "text-loss"
                )}
              >
                Score: {result.score >= 0 ? "+" : ""}
                {result.score.toFixed(1)}
              </span>
              <span className="text-muted-foreground">
                P&amp;L: {result.profit_percent >= 0 ? "+" : ""}
                {result.profit_percent.toFixed(2)}%
              </span>
            </div>
            <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
              <span>Exit: {result.exit_type}</span>
              <span>Entry triggered: {result.entry_triggered ? "Yes" : "No"}</span>
              {result.resolution_index >= 0 && (
                <span>Resolved at candle {result.resolution_index + 1}</span>
              )}
            </div>
            <div className="flex flex-wrap gap-2">
              <Button onClick={loadChallenge} className="rounded-full px-6">
                Play again
              </Button>
              <Button variant="outline" asChild className="rounded-full px-6">
                <Link to="/challenge">
                  <Target className="mr-2 h-4 w-4" />
                  Chart Challenge
                </Link>
              </Button>
            </div>
          </section>
        )}
      </div>
    </Layout>
  );
};

export default TradeChallengePage;
