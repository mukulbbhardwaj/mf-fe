import { FC, useEffect, useState } from "react";
import ModulesList from "@/components/learnSectionComponents/ModulesList";
import Layout from "@/Layout";
import { getLessons, type Lesson } from "@/api/lessons";
import { Loader2 } from "lucide-react";

const CATEGORY_COLORS: Record<string, string> = {
  BASICS: "primary",
  TECHNICAL_ANALYSIS: "energy-orange",
  FUNDAMENTAL_ANALYSIS: "elite",
  RISK_MANAGEMENT: "border",
};

function formatCategoryName(category: string): string {
  return category
    .split("_")
    .map((w) => w.charAt(0) + w.slice(1).toLowerCase())
    .join(" ");
}

export interface CategoryInfo {
  id: string;
  name: string;
  desc: string;
  color: string;
  lessonCount: number;
}

const LearnSectionPage: FC = () => {
  const [categories, setCategories] = useState<CategoryInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    getLessons()
      .then((lessons) => {
        if (cancelled) return;
        const byCategory = lessons.reduce<Record<string, Lesson[]>>((acc, lesson) => {
          const c = lesson.category || "OTHER";
          if (!acc[c]) acc[c] = [];
          acc[c].push(lesson);
          return acc;
        }, {});
        const list: CategoryInfo[] = Object.entries(byCategory)
          .filter(([, ls]) => ls.length > 0)
          .map(([category]) => ({
            id: category,
            name: formatCategoryName(category),
            desc: `${byCategory[category].length} lesson${byCategory[category].length === 1 ? "" : "s"}`,
            color: CATEGORY_COLORS[category] ?? "border",
            lessonCount: byCategory[category].length,
          }));
        setCategories(list);
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
  }, []);

  return (
    <div>
      <Layout>
        <div className="text-6xl font-bold my-16">Modules</div>
        {loading && (
          <div className="flex items-center gap-2 text-muted-foreground">
            <Loader2 className="h-5 w-5 animate-spin" />
            Loading…
          </div>
        )}
        {error && <p className="text-destructive">{error}</p>}
        {!loading && !error && (
          <ModulesList categories={categories} />
        )}
      </Layout>
    </div>
  );
};

export default LearnSectionPage;
