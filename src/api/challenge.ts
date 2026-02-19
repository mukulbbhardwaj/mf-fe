import apiClient from "../lib/api";

export interface Candle {
  time: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export interface Challenge {
  id: string;
  symbol: string;
  market: string;
  timeframe: string;
  snapshotStart: string;
  snapshotEnd: string;
  snapshotCandles: Candle[];
}

export interface SubmitResult {
  attemptId: string;
  correctDirection: "BUY" | "SELL" | "HOLD";
  userDirection: "BUY" | "SELL" | "HOLD";
  correct: boolean;
  score: number;
  profitPercent: number;
  maxProfitPercent: number;
  maxLossPercent: number;
  explanation: string;
  /** Forward window candles (max 250) after snapshot; use for replay. */
  forwardCandles: Candle[];
}

export type Decision = "BUY" | "SELL" | "HOLD";

export interface ChallengeStats {
  totalAttempts: number;
  correctCount: number;
  wrongCount: number;
  totalScore: number;
  averageScore: number;
}

export interface ChallengeLeaderboardEntry {
  rank: number;
  userId: number;
  username: string;
  totalAttempts: number;
  correctCount: number;
  totalScore: number;
  averageScore: number;
  isCurrentUser?: boolean;
}

export type DifficultyFilter = "Easy" | "Medium" | "Hard";

const BASE = "/api/direction-challenge";

export const getRandomChallenge = async (): Promise<Challenge> => {
  const res = await apiClient.get(`${BASE}/random`);
  if (res.data.success && res.data.data) {
    return res.data.data;
  }
  throw new Error(res.data.message || "Failed to fetch challenge");
};

export const getChallengeByFilter = async (
  difficulty?: DifficultyFilter
): Promise<Challenge> => {
  const params = difficulty ? { difficulty } : undefined;
  const res = await apiClient.get(`${BASE}/filter`, { params });
  if (res.data.success && res.data.data) {
    return res.data.data;
  }
  throw new Error(res.data.message || "Failed to fetch challenge");
};

export const getChallengeById = async (id: string): Promise<Challenge> => {
  const res = await apiClient.get(`${BASE}/${id}`);
  if (res.data.success && res.data.data) {
    return res.data.data;
  }
  throw new Error(res.data.message || "Failed to fetch challenge");
};

export const submitChallenge = async (
  challengeId: string,
  decision: Decision
): Promise<SubmitResult> => {
  const res = await apiClient.post(`${BASE}/submit`, {
    challengeId,
    decision,
  });
  if (res.data.success && res.data.data) {
    return res.data.data;
  }
  throw new Error(res.data.message || "Failed to submit");
};

export const getChallengeResult = async (
  attemptId: string
): Promise<Omit<SubmitResult, "attemptId">> => {
  const res = await apiClient.get(`${BASE}/result/${attemptId}`);
  if (res.data.success && res.data.data) {
    return res.data.data;
  }
  throw new Error(res.data.message || "Failed to fetch result");
};

export const getChallengeStats = async (): Promise<ChallengeStats> => {
  const res = await apiClient.get(`${BASE}/stats`);
  if (res.data.success && res.data.data) {
    return res.data.data;
  }
  throw new Error(res.data.message || "Failed to fetch challenge stats");
};

export const getChallengeLeaderboard = async (
  limit?: number
): Promise<{ entries: ChallengeLeaderboardEntry[] }> => {
  const params = limit != null ? { limit } : undefined;
  const res = await apiClient.get(`${BASE}/leaderboard`, { params });
  if (res.data.success && res.data.data) {
    return res.data.data;
  }
  throw new Error(res.data.message || "Failed to fetch challenge leaderboard");
};
