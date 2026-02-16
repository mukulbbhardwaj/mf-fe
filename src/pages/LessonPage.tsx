import { FC, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import Layout from "@/Layout";
import {
  getLesson,
  startLesson,
  updateLessonProgress,
  type Lesson,
} from "@/api/lessons";
import useStore from "@/store/userStore";
import { Button } from "@/components/ui/button";
import { Loader2, Check, BookOpen } from "lucide-react";

function formatCategoryName(category: string): string {
  return category
    .split("_")
    .map((w) => w.charAt(0) + w.slice(1).toLowerCase())
    .join(" ");
}

const LessonPage: FC = () => {
  const { id } = useParams<{ id: string }>();
  const userStore = useStore();
  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [completed, setCompleted] = useState(false);
  const [completing, setCompleting] = useState(false);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    if (!id) return;
    let cancelled = false;
    setLoading(true);
    setError(null);
    getLesson(id)
      .then((data) => {
        if (cancelled) return;
        setLesson(data);
      })
      .catch((e) => {
        if (!cancelled) setError(e instanceof Error ? e.message : "Failed to load lesson");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [id]);

  useEffect(() => {
    if (!lesson || !userStore.user || started) return;
    startLesson(lesson.id)
      .then(() => setStarted(true))
      .catch(() => {});
  }, [lesson?.id, userStore.user, started]);

  const handleMarkComplete = async () => {
    if (!lesson || !userStore.user) return;
    setCompleting(true);
    try {
      await updateLessonProgress(lesson.id, { progress: 100, isCompleted: true });
      setCompleted(true);
    } finally {
      setCompleting(false);
    }
  };

  if (loading && !lesson) {
    return (
      <Layout>
        <div className="flex flex-col items-center justify-center min-h-[40vh] gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          <p className="text-muted-foreground">Loading lesson…</p>
        </div>
      </Layout>
    );
  }

  if (error || !lesson) {
    return (
      <Layout>
        <div className="flex flex-col items-center justify-center min-h-[40vh] gap-4">
          <p className="text-destructive">{error ?? "Lesson not found"}</p>
          <Button asChild variant="outline">
            <Link to="/learn">Back to Learn</Link>
          </Button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="flex flex-col justify-between lg:flex-row border-b">
        <div>
          <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground mb-2">
            <Link to="/learn" className="hover:text-foreground">
              Learn
            </Link>
            <span>/</span>
            <Link
              to={`/modules/${encodeURIComponent(lesson.category)}`}
              className="hover:text-foreground"
            >
              {formatCategoryName(lesson.category)}
            </Link>
          </div>
          <h1 className="text-3xl font-bold my-2">{lesson.title}</h1>
          {lesson.estimatedTime > 0 && (
            <p className="text-sm text-muted-foreground">
              ~{lesson.estimatedTime} min read
            </p>
          )}
        </div>
        {userStore.user && (
          <div className="flex items-center gap-2 mt-4 lg:mt-0">
            {completed ? (
              <span className="flex items-center gap-2 text-profit text-sm">
                <Check className="h-4 w-4" />
                Completed
              </span>
            ) : (
              <Button
                size="sm"
                variant="outline"
                onClick={handleMarkComplete}
                disabled={completing}
              >
                {completing ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <>
                    <BookOpen className="h-4 w-4 mr-1" />
                    Mark as complete
                  </>
                )}
              </Button>
            )}
          </div>
        )}
      </div>
      <div className="flex justify-center">
        <div className="w-full max-w-3xl my-8">
          <ReactMarkdown className="markdown">{lesson.content}</ReactMarkdown>
        </div>
      </div>
    </Layout>
  );
};

export default LessonPage;
