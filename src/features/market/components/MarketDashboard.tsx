"use client";

import {
  Activity,
  AlertTriangle,
  Bell,
  LineChart,
  RefreshCw,
  ShieldAlert,
  SlidersHorizontal
} from "lucide-react";
import { useMemo, useState, useTransition } from "react";
import {
  calculateMarketHealth,
  choosePrimaryScenario,
  formatPct,
  rankAssets,
  severityTone
} from "../analysis";
import type { MarketAsset, MarketSnapshot } from "../schemas";
import { AssetTable } from "./AssetTable";
import { MarketPulseChart } from "./MarketPulseChart";
import { MetricCard } from "./MetricCard";
import { ScenarioPanel } from "./ScenarioPanel";
import { SectorHeatmap } from "./SectorHeatmap";

type MarketDashboardProps = {
  snapshot: MarketSnapshot | null;
};

const categories: Array<MarketAsset["category"] | "All"> = [
  "All",
  "Equity",
  "ETF",
  "Macro",
  "Crypto"
];

export function MarketDashboard({ snapshot }: MarketDashboardProps) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<MarketAsset["category"] | "All">("All");
  const [selectedSymbol, setSelectedSymbol] = useState(snapshot?.assets[0]?.symbol ?? "");
  const [activeScenarioId, setActiveScenarioId] = useState(
    snapshot ? choosePrimaryScenario(snapshot.scenarios).id : ""
  );
  const [isRefreshing, startRefresh] = useTransition();

  const rankedAssets = useMemo(() => {
    if (!snapshot) {
      return [];
    }

    return rankAssets(snapshot, { query, category });
  }, [category, query, snapshot]);

  const selectedAsset =
    rankedAssets.find((asset) => asset.symbol === selectedSymbol) ?? rankedAssets[0];
  const marketHealth = snapshot ? calculateMarketHealth(snapshot) : 0;

  if (!snapshot) {
    return (
      <main className="grid min-h-screen place-items-center bg-paper px-4 text-ink">
        <section
          className="w-full max-w-xl rounded-lg border border-coral/30 bg-white p-6 shadow-dashboard"
          role="alert"
        >
          <p className="text-sm font-semibold text-coral">Data status</p>
          <h1 className="mt-2 text-2xl font-semibold">Market data unavailable</h1>
          <p className="mt-3 text-sm text-slate-600">Validated market snapshot failed to load.</p>
        </section>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-paper px-4 py-4 text-ink sm:px-6 lg:px-8">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-4">
        <header className="rounded-lg border border-line bg-white p-4 shadow-dashboard">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase text-slate-500">Market Lens</p>
              <h1 className="mt-2 text-3xl font-semibold sm:text-4xl">Market command center</h1>
              <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600">
                {snapshot.regime.summary}
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <a
                className="rounded-md border border-line px-3 py-2 text-sm font-semibold"
                href="#signals"
              >
                Signals
              </a>
              <a
                className="rounded-md border border-line px-3 py-2 text-sm font-semibold"
                href="#watchlist"
              >
                Watchlist
              </a>
              <a
                className="rounded-md border border-line px-3 py-2 text-sm font-semibold"
                href="#scenarios"
              >
                Scenarios
              </a>
              <button
                className="inline-flex min-h-11 items-center gap-2 rounded-md bg-ink px-4 py-2 text-sm font-semibold text-white disabled:opacity-70"
                type="button"
                disabled={isRefreshing}
                onClick={() => startRefresh(() => setQuery((current) => current))}
              >
                <RefreshCw
                  aria-hidden="true"
                  className={isRefreshing ? "animate-spin" : ""}
                  size={18}
                />
                {isRefreshing ? "Refreshing" : "Refresh"}
              </button>
            </div>
          </div>
        </header>

        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4" aria-label="Market metrics">
          <MetricCard
            label="Health"
            value={`${marketHealth}/100`}
            detail="Composite of regime, breadth, momentum, and average risk."
            tone="positive"
            icon={<Activity aria-hidden="true" size={20} />}
          />
          <MetricCard
            label="Confidence"
            value={`${snapshot.regime.confidence}%`}
            detail={`Snapshot timestamp: ${new Date(snapshot.asOf).toLocaleString("en-US", {
              month: "short",
              day: "numeric",
              hour: "numeric",
              minute: "2-digit"
            })}`}
            tone="neutral"
            icon={<LineChart aria-hidden="true" size={20} />}
          />
          <MetricCard
            label="Alerts"
            value={`${snapshot.alerts.length}`}
            detail={snapshot.alerts[0]?.detail ?? "No active alerts."}
            tone={severityTone(snapshot.alerts[0]?.severity ?? "low")}
            icon={<Bell aria-hidden="true" size={20} />}
          />
          <MetricCard
            label="Risk control"
            value={selectedAsset ? `${selectedAsset.risk}/100` : "N/A"}
            detail={
              selectedAsset
                ? `${selectedAsset.symbol}: ${selectedAsset.watchFlags.join(", ")}`
                : "No asset selected."
            }
            tone={selectedAsset && selectedAsset.risk > 65 ? "danger" : "warning"}
            icon={<ShieldAlert aria-hidden="true" size={20} />}
          />
        </section>

        <section className="grid gap-4 xl:grid-cols-[1.3fr_0.7fr]">
          <MarketPulseChart snapshot={snapshot} />

          <section
            id="signals"
            aria-labelledby="signals-title"
            className="rounded-lg border border-line bg-white p-4 shadow-dashboard"
          >
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase text-slate-500">Signals</p>
                <h2 id="signals-title" className="mt-2 text-xl font-semibold">
                  Macro stack
                </h2>
              </div>
              <div className="grid h-10 w-10 place-items-center rounded-md border border-amber/30 bg-amber/10 text-amber">
                <AlertTriangle aria-hidden="true" size={20} />
              </div>
            </div>
            <div className="mt-4 space-y-3">
              {snapshot.macroSignals.map((signal) => (
                <article key={signal.label} className="rounded-md border border-line bg-paper p-3">
                  <div className="flex items-center justify-between gap-3">
                    <h3 className="font-semibold">{signal.label}</h3>
                    <span className="rounded-full border border-line bg-white px-2 py-1 text-xs font-semibold">
                      {signal.value}
                    </span>
                  </div>
                  <p className="mt-2 text-sm leading-5 text-slate-600">{signal.summary}</p>
                </article>
              ))}
            </div>
          </section>
        </section>

        <section
          className="rounded-lg border border-line bg-white p-4 shadow-dashboard"
          aria-labelledby="filter-title"
        >
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <div className="grid h-10 w-10 place-items-center rounded-md border border-line bg-paper text-ink">
                <SlidersHorizontal aria-hidden="true" size={20} />
              </div>
              <div>
                <p className="text-xs font-semibold uppercase text-slate-500">Universe</p>
                <h2 id="filter-title" className="text-lg font-semibold">
                  {category}
                </h2>
              </div>
            </div>
            <div className="grid grid-cols-5 gap-2" role="group" aria-label="Asset category">
              {categories.map((item) => (
                <button
                  key={item}
                  className={
                    item === category
                      ? "min-h-11 rounded-md bg-ink px-3 py-2 text-sm font-semibold text-white"
                      : "min-h-11 rounded-md border border-line bg-paper px-3 py-2 text-sm font-semibold"
                  }
                  type="button"
                  onClick={() => setCategory(item)}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>
        </section>

        <section className="grid min-w-0 gap-4 xl:grid-cols-[1.2fr_0.8fr]">
          <AssetTable
            assets={rankedAssets}
            query={query}
            selectedSymbol={selectedAsset?.symbol ?? selectedSymbol}
            onQueryChange={setQuery}
            onSelectAsset={setSelectedSymbol}
          />

          <section
            aria-labelledby="asset-detail-title"
            className="min-w-0 rounded-lg border border-line bg-white p-4 shadow-dashboard"
          >
            {selectedAsset ? (
              <>
                <p className="text-xs font-semibold uppercase text-slate-500">Selected asset</p>
                <div className="mt-2 flex items-start justify-between gap-3">
                  <div>
                    <h2 id="asset-detail-title" className="text-2xl font-semibold">
                      {selectedAsset.symbol}
                    </h2>
                    <p className="text-sm text-slate-600">{selectedAsset.name}</p>
                  </div>
                  <span
                    className={
                      selectedAsset.changePct >= 0
                        ? "text-lg font-semibold text-mint"
                        : "text-lg font-semibold text-coral"
                    }
                  >
                    {formatPct(selectedAsset.changePct)}
                  </span>
                </div>
                <p className="mt-4 text-sm leading-6 text-slate-600">{selectedAsset.thesis}</p>
                <dl className="mt-5 grid grid-cols-3 gap-2 text-sm">
                  <div className="rounded-md border border-line bg-paper p-3">
                    <dt className="text-xs text-slate-500">Momentum</dt>
                    <dd className="mt-1 font-semibold">{selectedAsset.momentum}</dd>
                  </div>
                  <div className="rounded-md border border-line bg-paper p-3">
                    <dt className="text-xs text-slate-500">Quality</dt>
                    <dd className="mt-1 font-semibold">{selectedAsset.quality}</dd>
                  </div>
                  <div className="rounded-md border border-line bg-paper p-3">
                    <dt className="text-xs text-slate-500">Liquidity</dt>
                    <dd className="mt-1 font-semibold">{selectedAsset.liquidity}</dd>
                  </div>
                </dl>
                <div className="mt-5">
                  <h3 className="text-sm font-semibold">Catalysts</h3>
                  <ul className="mt-2 space-y-2 text-sm text-slate-600">
                    {selectedAsset.catalysts.map((catalyst) => (
                      <li key={catalyst}>{catalyst}</li>
                    ))}
                  </ul>
                </div>
              </>
            ) : (
              <div role="status" className="text-sm text-slate-600">
                No asset selected.
              </div>
            )}
          </section>
        </section>

        <section className="grid gap-4 xl:grid-cols-[0.95fr_1.05fr]">
          <SectorHeatmap snapshot={snapshot} />
          <ScenarioPanel
            scenarios={snapshot.scenarios}
            activeScenarioId={activeScenarioId}
            onSelectScenario={setActiveScenarioId}
          />
        </section>
      </div>
    </main>
  );
}
