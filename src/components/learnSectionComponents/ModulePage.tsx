import { FC, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import Layout from "@/Layout";
import { getLessons, getUserLessons, type Lesson } from "@/api/lessons";
import useStore from "@/store/userStore";
import { Loader2, Check } from "lucide-react";
import { cn } from "@/lib/utils";

const CATEGORY_COLORS: Record<string, string> = {
  BASICS: "green",
  TECHNICAL_ANALYSIS: "blue",
  FUNDAMENTAL_ANALYSIS: "violet",
  RISK_MANAGEMENT: "amber",
};

const BORDER_CLASS: Record<string, string> = {
  green: "border-green-500",
  blue: "border-blue-500",
  violet: "border-violet-500",
  amber: "border-amber-500",
};

function formatCategoryName(category: string): string {
  return category
    .split("_")
    .map((w) => w.charAt(0) + w.slice(1).toLowerCase())
    .join(" ");
}

const ModulePage: FC = () => {
  const { id: categoryParam } = useParams<{ id: string }>();
  const userStore = useStore();
  const category = categoryParam ? decodeURIComponent(categoryParam) : "";
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [completedIds, setCompletedIds] = useState<Set<number>>(new Set());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!category) return;
    let cancelled = false;
    setLoading(true);
    setError(null);
    getLessons({ category })
      .then((list) => {
        if (cancelled) return;
        const sorted = [...list].sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
        setLessons(sorted);
      })
      .catch((e) => {
        if (!cancelled) setError(e instanceof Error ? e.message : "Failed to load lessons");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [category]);

  useEffect(() => {
    if (!userStore.user) return;
    let cancelled = false;
    getUserLessons()
      .then((userLessons) => {
        if (cancelled) return;
        const set = new Set(
          userLessons
            .filter((ul) => ul.userLesson.isCompleted)
            .map((ul) => ul.lesson.id)
        );
        setCompletedIds(set);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [userStore.user]);

  const colorKey = CATEGORY_COLORS[category] ?? "border";
  const borderClass = BORDER_CLASS[colorKey] ?? "border-border";

  return (
    <Layout>
      <div className="flex flex-col items-center">
        <div className="lg:w-9/12">
          <div className="border-b py-8 my-16">
            <div className="flex gap-4 items-center">
              <div className="text-6xl font-bold capitalize">
                {formatCategoryName(category).slice(0, 1)}
              </div>
              <div className={cn("w-1/2 border-2", borderClass)} />
            </div>
            <h2 className="text-4xl">{formatCategoryName(category)}</h2>
          </div>

          {loading && (
            <div className="flex items-center gap-2 text-muted-foreground my-8">
              <Loader2 className="h-5 w-5 animate-spin" />
              Loading…
            </div>
          )}
          {error && <p className="text-destructive my-4">{error}</p>}
          {!loading && !error &&
            lessons.map((lesson, index) => (
              <div key={lesson.id} className="m-4 flex items-start gap-2">
                {completedIds.has(lesson.id) && (
                  <span className="text-profit mt-1" title="Completed">
                    <Check className="h-5 w-5" />
                  </span>
                )}
                <div className="flex-1 min-w-0">
                  <Link to={`/lessons/${lesson.id}`}>
                    <div className="text-2xl w-max link">
                      {index + 1}. {lesson.title}
                    </div>
                  </Link>
                <div className="text-secondary-foreground m-2">
                  {lesson.description}
                </div>
                {lesson.estimatedTime > 0 && (
                  <div className="text-sm text-muted-foreground m-2">
                    ~{lesson.estimatedTime} min
                  </div>
                )}
                </div>
              </div>
            ))}
        </div>
      </div>
    </Layout>
  );
};

export default ModulePage;
