import { FC } from "react";
import Layout from "../Layout";
import { Link } from "react-router-dom";
import {
  TrendingUp,
  // FileText,
  Gamepad2,
  Trophy,
  ArrowRight,
  Target,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const exploreCards: {
  title: string;
  description: string;
  url: string;
  icon: FC<{ className?: string }>;
  iconColor: string;
}[] = [
  { title: "Paper Trading", description: "Virtual portfolio, real data. Zero risk.", url: "/dashboard", icon: TrendingUp, iconColor: "text-primary" },
  // { title: "Learn", description: "Lessons that decode markets.", url: "/learn", icon: BookOpen, iconColor: "text-primary" },
  { title: "Chart Challenge", description: "BUY · SELL · HOLD on real charts. Get scored.", url: "/challenge", icon: Gamepad2, iconColor: "text-energy-orange" },
  { title: "Trade Challenge", description: "LONG/SHORT with entry, SL & TP. See the replay.", url: "/challenge/trade", icon: Target, iconColor: "text-elite" },
  { title: "Leaderboards", description: "Top Monke rankings. Climb the board.", url: "/leaderboard", icon: Trophy, iconColor: "text-elite" },
];

const LandingPage: FC = () => {
  return (
    <Layout>
      <div className="flex flex-col items-center w-full max-w-3xl mx-auto px-2">
        {/* Hero — centered, subtle primary (neon green) glow */}
        <section className="relative py-20 lg:py-28 w-full text-center">
          <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_80%_60%_at_50%_-10%,rgba(0,255,156,0.08),transparent_50%)]" />
          <div className="mx-auto max-w-2xl">
            <p className="text-sm font-medium uppercase tracking-widest mb-4 animate-fade-in text-primary/90">
              Learn. Trade. Repeat.
            </p>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight leading-[1.05] text-foreground mb-6 animate-fade-in">
              Finance without the fear.
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed mb-2 mx-auto max-w-md animate-fade-in">
              Paper trade, replay historical charts, and learn with lessons built for real decisions.
            </p>
            <p className="text-base text-primary font-medium mb-10 animate-fade-in">
              Ready to train? Charts waiting.
            </p>
            <div className="flex flex-wrap justify-center gap-3 animate-fade-in">
              <Button
                asChild
                size="lg"
                className="rounded-full px-8 h-12 text-base bg-primary hover:bg-primary/90 text-primary-foreground border-0"
              >
                <Link to="/challenge">Play Chart Challenge</Link>
              </Button>
             
            </div>
          </div>
        </section>

        {/* Divider — subtle color */}
        <div className="h-px w-full max-w-md mx-auto bg-gradient-to-r from-transparent via-primary/30 to-transparent my-4" />

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
                  <ArrowRight className="h-4 w-4 shrink-0 text-muted-foreground/40 group-hover:text-primary group-hover:translate-x-0.5 transition-all" />
                </Link>
              );
            })}
          </div>
        </section>

        {/* Bottom CTA — centered, subtle tint */}
        <section className="py-16 lg:py-20 w-full">
          <div className="rounded-2xl border border-primary/20 bg-primary/5 p-8 sm:p-12 text-center max-w-2xl mx-auto">
            <p className="text-muted-foreground text-lg sm:text-xl max-w-lg mx-auto mb-8">
              Practice with real data. No real money. Just real skills. Train your Monke.
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <Button
                asChild
                size="lg"
                className="rounded-full px-8 bg-primary hover:bg-primary/90 text-primary-foreground border-0"
              >
                <Link to="/challenge">Try Chart Challenge</Link>
              </Button>
              <Button
                asChild
                variant="ghost"
                size="lg"
                className="rounded-full px-8 text-muted-foreground hover:text-foreground hover:bg-muted"
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
