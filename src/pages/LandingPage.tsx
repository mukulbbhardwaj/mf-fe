import { FC } from "react";
import Layout from "../Layout";
import { Link } from "react-router-dom";
import {
  TrendingUp,
  // FileText,
  Gamepad2,
  Trophy,
  ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const exploreCards: {
  title: string;
  description: string;
  url: string;
  icon: FC<{ className?: string }>;
  iconColor: string;
}[] = [
  { title: "Paper Trading", description: "Virtual portfolio, real data. Zero risk.", url: "/dashboard", icon: TrendingUp, iconColor: "text-emerald-400" },
  // { title: "Learn", description: "Lessons that decode markets.", url: "/learn", icon: BookOpen, iconColor: "text-sky-400" },
  { title: "Market Replay", description: "BUY · SELL · HOLD on real charts. Get scored.", url: "/challenge", icon: Gamepad2, iconColor: "text-amber-400" },
  { title: "Leaderboards", description: "Weekly rankings. Climb the board.", url: "/leaderboard", icon: Trophy, iconColor: "text-rose-400" },
];

const LandingPage: FC = () => {
  return (
    <Layout>
      <div className="flex flex-col items-center w-full max-w-3xl mx-auto px-2">
        {/* Hero — centered, subtle teal glow */}
        <section className="relative py-20 lg:py-28 w-full text-center">
          <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_80%_60%_at_50%_-10%,rgba(45,212,191,0.08),transparent_50%)]" />
          <div className="mx-auto max-w-2xl">
            <p className="text-sm font-medium uppercase tracking-widest mb-4 animate-fade-in text-teal-400/80">
              Learn. Trade. Repeat.
            </p>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight leading-[1.05] text-foreground mb-6 animate-fade-in">
              Finance without the fear.
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed mb-10 mx-auto max-w-md animate-fade-in">
              Paper trade, replay historical charts, and learn with lessons built for real decisions.
            </p>
            <div className="flex flex-wrap justify-center gap-3 animate-fade-in">
              <Button
                asChild
                size="lg"
                className="rounded-full px-8 h-12 text-base bg-teal-600 hover:bg-teal-500 text-white border-0"
              >
                <Link to="/challenge">Play Market Replay</Link>
              </Button>
             
            </div>
          </div>
        </section>

        {/* Divider — subtle color */}
        <div className="h-px w-full max-w-md mx-auto bg-gradient-to-r from-transparent via-teal-500/30 to-transparent my-4" />

        {/* Explore — simple list */}
        <section className="py-16 lg:py-20 w-full">
          <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-8 text-center">
            Explore
          </h2>
          <div className="flex flex-col gap-0 max-w-xl mx-auto rounded-xl border border-border/80 overflow-hidden bg-card/30">
            {exploreCards.map((card, i) => {
              const Icon = card.icon;
              const isLast = i === exploreCards.length - 1;
              return (
                <Link
                  key={card.title}
                  to={card.url}
                  className={`group flex items-center gap-4 px-5 py-4 hover:bg-card/80 transition-colors ${!isLast ? "border-b border-border/60" : ""}`}
                >
                  <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-muted/80 ${card.iconColor}`}>
                    <Icon className="h-4 w-4" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <span className="font-medium text-foreground block">{card.title}</span>
                    <span className="text-sm text-muted-foreground block truncate">{card.description}</span>
                  </div>
                  <ArrowRight className="h-4 w-4 shrink-0 text-muted-foreground/40 group-hover:text-teal-400 group-hover:translate-x-0.5 transition-all" />
                </Link>
              );
            })}
          </div>
        </section>

        {/* Bottom CTA — centered, subtle tint */}
        <section className="py-16 lg:py-20 w-full">
          <div className="rounded-2xl border border-teal-500/20 bg-teal-500/5 p-8 sm:p-12 text-center max-w-2xl mx-auto">
            <p className="text-muted-foreground text-lg sm:text-xl max-w-lg mx-auto mb-8">
              Practice with real data. No real money. Just real skills.
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <Button
                asChild
                size="lg"
                className="rounded-full px-8 bg-teal-600 hover:bg-teal-500 text-white border-0"
              >
                <Link to="/challenge">Try Market Replay</Link>
              </Button>
              <Button
                asChild
                variant="ghost"
                size="lg"
                className="rounded-full px-8 text-slate-400 hover:text-foreground hover:bg-slate-500/10"
              >
                <Link to="/dashboard">Open paper portfolio</Link>
              </Button>
            </div>
          </div>
        </section>
      </div>
    </Layout>
  );
};

export default LandingPage;
