import { formatPrice } from "@/lib/utils";
import { FC } from "react";
import InfoToolTip from "../miscComponents/InfoToolTip";
import { TrendingUp, TrendingDown, Wallet } from "lucide-react";

interface PortfolioQuickViewProps {
  currentValue: number;
  totalAmount: number;
  initialAmount: number;
  totalReturn: number;
  totalReturnPercent: number;
}

const PortfolioQuickView: FC<PortfolioQuickViewProps> = ({
  currentValue,
  totalAmount,
  totalReturn,
  totalReturnPercent,
}) => {

  return (
    <div className="flex flex-col border border-border rounded-xl w-full bg-gradient-to-br from-card to-card/50 p-8 shadow-lg">
      <div className="flex items-center gap-3 mb-8">
        <div className="p-2 rounded-lg bg-primary/10">
          <Wallet className="h-6 w-6 text-primary" />
        </div>
        <h1 className="text-2xl font-bold">Portfolio Overview</h1>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <h2 className="text-sm font-medium text-muted-foreground flex items-center gap-1">
              Total Portfolio Value
              <InfoToolTip description="Total Portfolio Value (Cash + Holdings)" />
            </h2>
          </div>
          <p className="text-3xl font-bold tracking-tight">
            ₹{formatPrice(currentValue)}
          </p>
        </div>
        
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <h2 className="text-sm font-medium text-muted-foreground flex items-center gap-1">
              Available Cash
              <InfoToolTip description="Available Cash in Your Account" />
            </h2>
          </div>
          <p className="text-3xl font-bold tracking-tight">
            ₹{formatPrice(totalAmount)}
          </p>
        </div>
        
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <h2 className="text-sm font-medium text-muted-foreground flex items-center gap-1">
              Total Returns
              <InfoToolTip description="Total Returns on Initial Investment" />
            </h2>
          </div>
          <div className="flex items-center gap-3">
            {totalReturn >= 0 ? (
              <TrendingUp className="h-6 w-6 text-profit flex-shrink-0" />
            ) : (
              <TrendingDown className="h-6 w-6 text-loss flex-shrink-0" />
            )}
            <div>
              <p className={`text-3xl font-bold tracking-tight ${totalReturn >= 0 ? 'text-profit' : 'text-loss'}`}>
                {totalReturn >= 0 ? '+' : ''}₹{formatPrice(Math.abs(totalReturn))}
              </p>
              <p className={`text-sm font-semibold mt-1 ${totalReturn >= 0 ? 'text-profit' : 'text-loss'}`}>
                {totalReturn >= 0 ? '+' : ''}{totalReturnPercent.toFixed(2)}%
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PortfolioQuickView;
