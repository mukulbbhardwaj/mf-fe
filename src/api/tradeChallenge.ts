import apiClient from "../lib/api";

export interface Candle {
  time: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume?: number;
}

/** Same shape as direction challenge: snapshot only. */
export interface TradeChallenge {
  id: string;
  symbol: string;
  market: string;
  timeframe: string;
  snapshotStart: string;
  snapshotEnd: string;
  snapshotCandles: Candle[];
}

export type PositionType = "LONG" | "SHORT";

export interface TradeSubmitBody {
  challengeId: string;
  position_type: PositionType;
  entry_price: number;
  stop_loss: number;
  take_profit: number;
}

export interface TradeSubmitResult {
  attemptId: string;
  entry_triggered: boolean;
  exit_type: string;
  resolution_index: number;
  forward_candles: Candle[];
  profit_percent: number;
  score: number;
}

const BASE = "/api/trade-challenge";

function normalizeResult(data: Record<string, unknown>): TradeSubmitResult {
  return {
    attemptId: (data.attemptId ?? data.attempt_id) as string,
    entry_triggered: (data.entry_triggered ?? data.entryTriggered) as boolean,
    exit_type: (data.exit_type ?? data.exitType) as string,
    resolution_index: (data.resolution_index ?? data.resolutionIndex) as number,
    forward_candles: (data.forward_candles ?? data.forwardCandles ?? []) as Candle[],
    profit_percent: (data.profit_percent ?? data.profitPercent) as number,
    score: (data.score as number) ?? 0,
  };
}

export const getRandomTradeChallenge = async (): Promise<TradeChallenge> => {
  const res = await apiClient.get(`${BASE}/random`);
  if (res.data.success && res.data.data) {
    return res.data.data;
  }
  throw new Error(res.data.message || "Failed to fetch trade challenge");
};

export const submitTradeChallenge = async (
  body: TradeSubmitBody
): Promise<TradeSubmitResult> => {
  const res = await apiClient.post(`${BASE}/submit`, body);
  if (res.data.success && res.data.data) {
    return normalizeResult(res.data.data as Record<string, unknown>);
  }
  throw new Error(res.data.message || "Failed to submit trade");
};

export const getTradeChallengeResult = async (
  attemptId: string
): Promise<Omit<TradeSubmitResult, "attemptId">> => {
  const res = await apiClient.get(`${BASE}/result/${attemptId}`);
  if (res.data.success && res.data.data) {
    const raw = res.data.data as Record<string, unknown>;
    const full = normalizeResult({ ...raw, attemptId });
    const { attemptId: _a, ...rest } = full;
    return rest;
  }
  throw new Error(res.data.message || "Failed to fetch trade result");
};
