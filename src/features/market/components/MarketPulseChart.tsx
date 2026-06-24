import { formatPct } from "../analysis";
import type { MarketSnapshot } from "../schemas";

type MarketPulseChartProps = {
  snapshot: MarketSnapshot;
};

export function MarketPulseChart({ snapshot }: MarketPulseChartProps) {
  const points = snapshot.indices.map((index, position) => {
    const x = 12 + position * (276 / Math.max(1, snapshot.indices.length - 1));
    const y = 74 - Math.max(-2.5, Math.min(2.5, index.changePct)) * 18;
    return { x, y, index };
  });

  const path = points.map((point) => `${point.x},${point.y}`).join(" ");

  return (
    <section
      aria-labelledby="market-pulse-title"
      className="rounded-lg border border-line bg-white p-4 shadow-dashboard"
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase text-slate-500">Market pulse</p>
          <h2 id="market-pulse-title" className="mt-2 text-xl font-semibold">
            {snapshot.regime.name}
          </h2>
        </div>
        <div className="rounded-md border border-mint/30 bg-mint/10 px-3 py-2 text-right text-sm text-mint">
          <span className="block font-semibold">{snapshot.regime.score}/100</span>
          <span className="text-xs">Regime</span>
        </div>
      </div>

      <div className="mt-5 overflow-hidden rounded-md border border-line bg-paper">
        <svg
          className="h-48 w-full"
          viewBox="0 0 300 120"
          role="img"
          aria-label="Index performance line chart"
        >
          <line x1="10" x2="290" y1="74" y2="74" stroke="#d7dde5" strokeWidth="1" />
          <polyline
            points={path}
            fill="none"
            stroke="#0b7285"
            strokeWidth="4"
            strokeLinecap="round"
          />
          {points.map((point) => (
            <g key={point.index.symbol}>
              <circle
                cx={point.x}
                cy={point.y}
                r="5"
                fill="#ffffff"
                stroke="#0b7285"
                strokeWidth="3"
              />
              <text
                x={point.x}
                y="108"
                textAnchor="middle"
                className="fill-slate-600 text-[8px] font-semibold"
              >
                {point.index.symbol}
              </text>
            </g>
          ))}
        </svg>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-5">
        {snapshot.indices.map((index) => (
          <div key={index.symbol} className="rounded-md border border-line bg-white px-3 py-2">
            <p className="text-xs font-semibold text-slate-500">{index.symbol}</p>
            <p
              className={
                index.changePct >= 0
                  ? "text-sm font-semibold text-mint"
                  : "text-sm font-semibold text-coral"
              }
            >
              {formatPct(index.changePct)}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
