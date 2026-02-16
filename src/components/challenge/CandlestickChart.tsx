import { FC, useMemo } from "react";
import { cn } from "@/lib/utils";

export interface CandleData {
  time: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume?: number;
}

interface CandlestickChartProps {
  candles: CandleData[];
  height?: number;
  showOutcomeFromIndex?: number;
  className?: string;
}

const CandlestickChart: FC<CandlestickChartProps> = ({
  candles,
  height = 320,
  showOutcomeFromIndex,
  className,
}) => {
  const { minPrice, maxPrice, candleWidth, gap, padding } = useMemo(() => {
    if (!candles.length) {
      return { minPrice: 0, maxPrice: 100, candleWidth: 8, gap: 4, padding: 40 };
    }
    const minP = Math.min(...candles.map((c) => c.low));
    const maxP = Math.max(...candles.map((c) => c.high));
    const range = maxP - minP || 1;
    const pad = range * 0.05;
    const totalWidth = 400;
    const gap = 4;
    const candleWidth = Math.max(
      4,
      (totalWidth - gap * (candles.length - 1) - 60) / candles.length
    );
    return {
      minPrice: minP - pad,
      maxPrice: maxP + pad,
      candleWidth,
      gap,
      padding: 40,
    };
  }, [candles]);

  const chartHeight = height - padding * 2;

  const scaleY = (price: number) => {
    const range = maxPrice - minPrice;
    const y = ((price - minPrice) / range) * chartHeight;
    return padding + chartHeight - y;
  };

  if (!candles.length) {
    return (
      <div
        className={cn("flex items-center justify-center bg-muted/30 rounded-lg", className)}
        style={{ height }}
      >
        <p className="text-muted-foreground">No chart data</p>
      </div>
    );
  }

  return (
    <div className={cn("w-full overflow-x-auto", className)}>
      <svg
        width={Math.max(400, candles.length * (candleWidth + gap) + 60)}
        height={height}
        className="min-w-full"
      >
        {candles.map((candle, i) => {
          const isGreen = candle.close >= candle.open;
          const bodyTop = scaleY(Math.max(candle.open, candle.close));
          const bodyBottom = scaleY(Math.min(candle.open, candle.close));
          const bodyHeight = Math.max(2, Math.abs(bodyBottom - bodyTop));
          const x = padding + i * (candleWidth + gap);
          const isOutcome = showOutcomeFromIndex !== undefined && i >= showOutcomeFromIndex;

          return (
            <g key={`${candle.time}-${i}`}>
              {/* Wick */}
              <line
                x1={x + candleWidth / 2}
                y1={scaleY(candle.high)}
                x2={x + candleWidth / 2}
                y2={scaleY(candle.low)}
                stroke={isGreen ? "hsl(var(--profit))" : "hsl(var(--loss))"}
                strokeWidth={1}
                opacity={isOutcome ? 0.7 : 1}
              />
              {/* Body */}
              <rect
                x={x}
                y={bodyTop}
                width={candleWidth}
                height={bodyHeight}
                fill={isGreen ? "hsl(var(--profit))" : "hsl(var(--loss))"}
                stroke={isGreen ? "hsl(var(--profit))" : "hsl(var(--loss))"}
                strokeWidth={1}
                opacity={isOutcome ? 0.7 : 1}
              />
            </g>
          );
        })}
      </svg>
    </div>
  );
};

export default CandlestickChart;
