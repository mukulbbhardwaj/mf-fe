import { FC, useEffect, useState } from "react";
import Layout from "../Layout";
import useStore from "@/store/userStore";
import PortfolioQuickView from "@/components/dashboardComponents/PortfolioQuickView";
import HoldingsItem from "@/components/dashboardComponents/HoldingsItem";
import SymbolSearch from "@/components/dashboardComponents/SymbolSearch";
import TransactionsSection from "@/components/dashboardComponents/TransactionsSection";
import WatchlistSection from "@/components/dashboardComponents/WatchlistSection";
import getPortfolioInfo from "@/api/getPortfolioInfo";
import { Loader2 } from "lucide-react";
import { formatPrice } from "@/lib/utils";

interface DashboardPageProps {}

type SymbolOwned = {
  averagePrice: number;
  portfolioId: number;
  quantity: number;
  symbolName: string;
};

type HoldingBreakdown = {
  symbolName: string;
  quantity: number;
  averagePrice: number;
  currentPrice: number;
  currentValue: number;
  unrealizedPnL: number;
  unrealizedPnLPercent: number;
};

type PortfolioData = {
  portfolioId: number;
  symbolsOwned: SymbolOwned[];
  totalAmount: number;
  initialAmount: number;
  currentValue: number;
  totalReturn: number;
  totalReturnPercent: number;
  userId: number;
  breakdown?: {
    cash: number;
    holdings: HoldingBreakdown[];
    totalHoldingsValue: number;
  };
};

const DashboardPage: FC<DashboardPageProps> = () => {
  const userStore = useStore();
  const [portfolioInfo, setPortfolioInfo] = useState<PortfolioData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPortfolioData = async () => {
      try {
        setIsLoading(true);
        setError(null);

        if (userStore.user) {
          const data = await getPortfolioInfo();
          setPortfolioInfo(data);
        } else {
          setError("User not found. Please log in.");
        }
      } catch (err) {
        console.error("Error fetching portfolio data:", err);
        setError("Failed to load portfolio data. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };

    if (userStore.user) {
      fetchPortfolioData();
    }
  }, [userStore.user?.id]);

  if (isLoading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <p className="text-destructive mb-4">{error}</p>
          </div>
        </div>
      </Layout>
    );
  }

  const holdingsValue = portfolioInfo?.breakdown?.totalHoldingsValue || 0;
  const cashAmount = portfolioInfo?.totalAmount || 0;
  const holdingsCount = portfolioInfo?.breakdown?.holdings?.length || 0;

  return (
    <Layout>
      <div className="flex flex-col gap-6 pb-8">
        {/* Hero Portfolio Section */}
        <div className="mt-6">
          <PortfolioQuickView
            currentValue={portfolioInfo?.currentValue || 0}
            totalAmount={portfolioInfo?.totalAmount || 0}
            initialAmount={portfolioInfo?.initialAmount || 0}
            totalReturn={portfolioInfo?.totalReturn || 0}
            totalReturnPercent={portfolioInfo?.totalReturnPercent || 0}
          />
        </div>

        {/* Quick Stats Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="border border-border rounded-lg p-4 bg-card hover:shadow-md transition-shadow">
            <p className="text-sm text-muted-foreground mb-1">Holdings Value</p>
            <p className="text-xl font-bold">₹{formatPrice(holdingsValue)}</p>
          </div>
          <div className="border border-border rounded-lg p-4 bg-card hover:shadow-md transition-shadow">
            <p className="text-sm text-muted-foreground mb-1">Cash Balance</p>
            <p className="text-xl font-bold">₹{formatPrice(cashAmount)}</p>
          </div>
          <div className="border border-border rounded-lg p-4 bg-card hover:shadow-md transition-shadow">
            <p className="text-sm text-muted-foreground mb-1">Active Holdings</p>
            <p className="text-xl font-bold">{holdingsCount}</p>
          </div>
          <div className="border border-border rounded-lg p-4 bg-card hover:shadow-md transition-shadow">
            <p className="text-sm text-muted-foreground mb-1">Initial Investment</p>
            <p className="text-xl font-bold">₹{formatPrice(portfolioInfo?.initialAmount || 0)}</p>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Search & Holdings */}
          <div className="lg:col-span-2 space-y-6">
            {/* Search Section */}
            <div className="border border-border rounded-lg p-6 bg-card">
              <h2 className="text-xl font-semibold mb-4">Search & Trade</h2>
              <SymbolSearch />
            </div>

            {/* Holdings Section */}
            <div className="border border-border rounded-lg p-6 bg-card">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold">Your Holdings</h2>
                {holdingsCount > 0 && (
                  <span className="text-sm text-muted-foreground">
                    {holdingsCount} {holdingsCount === 1 ? 'asset' : 'assets'}
                  </span>
                )}
              </div>
              {portfolioInfo?.breakdown?.holdings && portfolioInfo.breakdown.holdings.length > 0 ? (
                <div className="space-y-3">
                  {portfolioInfo.breakdown.holdings.map((holding) => (
                    <HoldingsItem
                      key={holding.symbolName}
                      symbolName={holding.symbolName}
                      avgBuyPrice={holding.averagePrice}
                      quantity={holding.quantity}
                      currentPrice={holding.currentPrice}
                      unrealizedPnL={holding.unrealizedPnL}
                      unrealizedPnLPercent={holding.unrealizedPnLPercent}
                    />
                  ))}
                </div>
              ) : (
                <div className="border-2 border-dashed border-border rounded-lg p-12 text-center bg-muted/30">
                  <div className="max-w-sm mx-auto">
                    <p className="text-lg font-semibold mb-2 text-foreground">
                      No holdings yet
                    </p>
                    <p className="text-sm text-muted-foreground mb-4">
                      Start building your portfolio by searching and buying your first asset!
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Column - Watchlist & Transactions */}
          <div className="space-y-6">
            <WatchlistSection />
            <TransactionsSection />
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default DashboardPage;
