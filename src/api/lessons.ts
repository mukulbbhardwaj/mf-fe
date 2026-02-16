import apiClient from "../lib/api";

export interface Lesson {
  id: number;
  title: string;
  description: string;
  content: string;
  category: string;
  difficulty: string;
  order: number;
  estimatedTime: number;
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface UserLessonProgress {
  lessonId: number;
  title: string;
  progress: number;
  isCompleted: boolean;
  completedAt: string | null;
  startedAt: string | null;
}

export interface UserProgressResponse {
  totalLessons: number;
  completedLessons: number;
  inProgressLessons: number;
  notStartedLessons: number;
  completionRate: number;
  lessons: UserLessonProgress[];
}

export interface UserLessonWithProgress {
  lesson: Pick<Lesson, "id" | "title" | "description" | "category" | "difficulty" | "estimatedTime">;
  userLesson: {
    progress: number;
    isCompleted: boolean;
    completedAt: string | null;
    startedAt: string | null;
  };
}

export const getLessons = async (params?: {
  category?: string;
  difficulty?: string;
}): Promise<Lesson[]> => {
  const res = await apiClient.get("/api/lessons", { params: params ?? {} });
  if (res.data.success && Array.isArray(res.data.data)) {
    return res.data.data;
  }
  throw new Error(res.data.message || "Failed to fetch lessons");
};

export const getLesson = async (id: string | number): Promise<Lesson> => {
  const res = await apiClient.get(`/api/lessons/${id}`);
  if (res.data.success && res.data.data) {
    return res.data.data;
  }
  throw new Error(res.data.message || "Failed to fetch lesson");
};

export const getUserProgress = async (): Promise<UserProgressResponse> => {
  const res = await apiClient.get("/api/lessons/user/progress");
  if (res.data.success && res.data.data) {
    return res.data.data;
  }
  throw new Error(res.data.message || "Failed to fetch progress");
};

export const getUserLessons = async (): Promise<UserLessonWithProgress[]> => {
  const res = await apiClient.get("/api/lessons/user/lessons");
  if (res.data.success && Array.isArray(res.data.data)) {
    return res.data.data;
  }
  throw new Error(res.data.message || "Failed to fetch user lessons");
};

export const startLesson = async (id: number): Promise<void> => {
  const res = await apiClient.post(`/api/lessons/${id}/start`);
  if (!res.data.success) {
    throw new Error(res.data.message || "Failed to start lesson");
  }
};

export const updateLessonProgress = async (
  id: number,
  body: { progress: number; isCompleted?: boolean }
): Promise<void> => {
  const res = await apiClient.patch(`/api/lessons/${id}/progress`, body);
  if (!res.data.success) {
    throw new Error(res.data.message || "Failed to update progress");
  }
};
