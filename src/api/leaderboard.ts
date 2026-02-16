import apiClient from "../lib/api";

export interface LeaderboardEntry {
  rank: number;
  userId: number;
  username: string;
  totalReturn: number;
  maxDrawdown: number;
  score: number;
  isCurrentUser?: boolean;
}

export interface LeaderboardResponse {
  weekStartDate: string;
  entries: LeaderboardEntry[];
}

export interface MyRankEntry extends LeaderboardEntry {
  weekStartDate?: string;
}

export interface MyRankResponse {
  weekStartDate: string;
  entry: MyRankEntry | null;
  message?: string;
}

export const getLeaderboard = async (
  options?: { limit?: number; week?: string }
): Promise<LeaderboardResponse> => {
  const params = new URLSearchParams();
  if (options?.limit != null) params.set("limit", String(options.limit));
  if (options?.week != null) params.set("week", options.week);
  const res = await apiClient.get("/api/leaderboard", { params });
  if (res.data.success && res.data.data) {
    return res.data.data;
  }
  throw new Error(res.data.message || "Failed to fetch leaderboard");
};

export const getMyRank = async (week?: string): Promise<MyRankResponse> => {
  const params = week ? { week } : undefined;
  const res = await apiClient.get("/api/leaderboard/me", { params });
  if (res.data.success && res.data.data) {
    return res.data.data;
  }
  throw new Error(res.data.message || "Failed to fetch your rank");
};
