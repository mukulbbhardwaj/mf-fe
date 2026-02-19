import { FC } from "react";
import { Link } from "react-router-dom";

const footerLinks: { label: string; to: string }[] = [
  { label: "Learn", to: "/learn" },
  // { label: "Blogs", to: "/blogs" },
  { label: "Chart Challenge", to: "/challenge" },
  { label: "Trade Challenge", to: "/challenge/trade" },
  { label: "Leaderboard", to: "/leaderboard" },
];

const Footer: FC = () => {
  const year = new Date().getFullYear();
  return (
    <footer className="border-t border-border mt-16 py-8 text-muted-foreground text-sm">
      <div className="container mx-auto px-4">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-6">
          <p>© {year} Monke Finance. All rights reserved.</p>
          <nav className="flex flex-wrap items-center justify-center gap-6">
            {footerLinks.map(({ label, to }) => (
              <Link
                key={to}
                to={to}
                className="hover:text-foreground transition-colors"
              >
                {label}
              </Link>
            ))}
            <a
              href="https://github.com/mukulbbhardwaj"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-foreground transition-colors"
            >
              GitHub
            </a>
          </nav>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
