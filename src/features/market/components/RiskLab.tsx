"use client";

import { clsx } from "clsx";
import { BarChart3, ShieldCheck, TrendingDown } from "lucide-react";
import type { PortfolioRiskSummary, ScenarioImpact } from "../analysis";
import { formatPct, formatWeight } from "../analysis";

type RiskLabProps = {
  summary: PortfolioRiskSummary;
  scenarioImpacts: ScenarioImpact[];
  activeScenarioId: string;
  onSelectScenario: (scenarioId: string) => void;
};

export function RiskLab({
  summary,
  scenarioImpacts,
  activeScenarioId,
  onSelectScenario
}: RiskLabProps) {
  const activeImpact =
    scenarioImpacts.find((impact) => impact.scenario.id === activeScenarioId) ?? scenarioImpacts[0];

  return (
    <section className="grid gap-4 xl:grid-cols-[0.95fr_1.05fr]" aria-label="Portfolio risk lab">
      <div className="rounded-lg border border-line bg-white p-4 shadow-dashboard">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase text-slate-500">Portfolio</p>
            <h2 className="mt-1 text-xl font-semibold">Risk lab</h2>
          </div>
          <div className="grid h-10 w-10 place-items-center rounded-md border border-ocean/30 bg-ocean/10 text-ocean">
            <ShieldCheck aria-hidden="true" size={20} />
          </div>
        </div>

        <dl className="mt-4 grid grid-cols-2 gap-2 text-sm">
          <Metric label="Gross exposure" value={formatWeight(summary.grossExposure)} />
          <Metric label="Cash" value={formatWeight(summary.cashWeight)} />
          <Metric label="Weighted risk" value={`${summary.weightedRisk}/100`} />
          <Metric label="Weighted beta" value={`${summary.weightedBeta}`} />
          <Metric label="Active share" value={formatWeight(summary.activeShare)} />
          <Metric label="Hedge weight" value={formatWeight(summary.hedgeWeight)} />
        </dl>

        <div className="mt-5">
          <h3 className="text-sm font-semibold">Top active positions</h3>
          <div className="mt-3 space-y-2">
            {summary.topPositions.map((position) => (
              <div
                key={position.symbol}
                className="grid grid-cols-[72px_1fr_64px] items-center gap-3 text-sm"
              >
                <span className="font-semibold">{position.symbol}</span>
                <div className="h-2 overflow-hidden rounded-full bg-paper">
                  <div
                    aria-hidden="true"
                    className="h-full rounded-full bg-ocean"
                    style={{ width: `${Math.min(100, position.weight * 5)}%` }}
                  />
                </div>
                <span className="text-right font-semibold">{formatWeight(position.weight)}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-5 grid gap-4 md:grid-cols-2">
          <ExposureList title="Sector exposure" buckets={summary.sectorExposure.slice(0, 6)} />
          <ExposureList title="Category exposure" buckets={summary.categoryExposure.slice(0, 6)} />
        </div>
      </div>

      <div className="rounded-lg border border-line bg-white p-4 shadow-dashboard">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase text-slate-500">Stress test</p>
            <h2 className="mt-1 text-xl font-semibold">{activeImpact.scenario.name}</h2>
          </div>
          <div className="grid h-10 w-10 place-items-center rounded-md border border-coral/30 bg-coral/10 text-coral">
            <TrendingDown aria-hidden="true" size={20} />
          </div>
        </div>

        <div
          className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4"
          role="tablist"
          aria-label="Stress scenarios"
        >
          {scenarioImpacts.map((impact) => (
            <button
              key={impact.scenario.id}
              className={clsx(
                "min-h-11 rounded-md border px-3 py-2 text-sm font-semibold",
                impact.scenario.id === activeScenarioId
                  ? "border-ink bg-ink text-white"
                  : "border-line bg-paper text-ink"
              )}
              type="button"
              role="tab"
              aria-selected={impact.scenario.id === activeScenarioId}
              onClick={() => onSelectScenario(impact.scenario.id)}
            >
              {impact.scenario.name}
            </button>
          ))}
        </div>

        <dl className="mt-5 grid grid-cols-3 gap-2 text-sm">
          <Metric label="Probability" value={formatWeight(activeImpact.scenario.probability)} />
          <Metric
            label="Portfolio impact"
            value={formatPct(activeImpact.totalImpact)}
            tone={activeImpact.totalImpact >= 0 ? "positive" : "danger"}
          />
          <Metric label="Stressed value" value={`${activeImpact.stressedValue.toFixed(2)}`} />
        </dl>

        <div className="mt-5 overflow-x-auto">
          <table className="min-w-[620px] w-full border-collapse text-left text-sm">
            <thead className="bg-paper text-xs uppercase text-slate-500">
              <tr>
                <th className="px-3 py-3">Position</th>
                <th className="px-3 py-3">Weight</th>
                <th className="px-3 py-3">Shock</th>
                <th className="px-3 py-3">Contribution</th>
              </tr>
            </thead>
            <tbody>
              {activeImpact.rows.map((row) => (
                <tr key={row.symbol} className="border-t border-line">
                  <td className="px-3 py-3">
                    <span className="block font-semibold">{row.symbol}</span>
                    <span className="block text-xs text-slate-500">{row.name}</span>
                  </td>
                  <td className="px-3 py-3">{formatWeight(row.weight)}</td>
                  <td className={row.impact >= 0 ? "px-3 py-3 text-mint" : "px-3 py-3 text-coral"}>
                    {formatPct(row.impact)}
                  </td>
                  <td
                    className={
                      row.contribution >= 0
                        ? "px-3 py-3 font-semibold text-mint"
                        : "px-3 py-3 font-semibold text-coral"
                    }
                  >
                    {formatPct(row.contribution)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-5">
          <div className="flex items-center gap-2 text-sm font-semibold">
            <BarChart3 aria-hidden="true" className="text-ocean" size={18} />
            <h3>Portfolio factor exposure</h3>
          </div>
          <div className="mt-3 grid grid-cols-2 gap-2 text-sm sm:grid-cols-3">
            {Object.entries(summary.factorExposure).map(([factor, value]) => (
              <div key={factor} className="rounded-md border border-line bg-paper p-3">
                <p className="text-xs capitalize text-slate-500">{factor}</p>
                <p
                  className={
                    value >= 0 ? "mt-1 font-semibold text-mint" : "mt-1 font-semibold text-coral"
                  }
                >
                  {value > 0 ? "+" : ""}
                  {value}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function Metric({
  label,
  value,
  tone = "neutral"
}: {
  label: string;
  value: string;
  tone?: "positive" | "danger" | "neutral";
}) {
  return (
    <div className="rounded-md border border-line bg-paper p-3">
      <dt className="text-xs text-slate-500">{label}</dt>
      <dd
        className={clsx(
          "mt-1 font-semibold",
          tone === "positive" && "text-mint",
          tone === "danger" && "text-coral"
        )}
      >
        {value}
      </dd>
    </div>
  );
}

function ExposureList({
  title,
  buckets
}: {
  title: string;
  buckets: Array<{ name: string; weight: number; activeWeight: number }>;
}) {
  return (
    <div>
      <h3 className="text-sm font-semibold">{title}</h3>
      <div className="mt-3 space-y-2">
        {buckets.map((bucket) => (
          <div key={bucket.name} className="text-sm">
            <div className="flex items-center justify-between gap-3">
              <span className="truncate text-slate-700">{bucket.name}</span>
              <span className="font-semibold">{formatWeight(bucket.weight)}</span>
            </div>
            <div className="mt-1 h-2 overflow-hidden rounded-full bg-paper">
              <div
                aria-hidden="true"
                className={clsx(
                  "h-full rounded-full",
                  bucket.activeWeight >= 0 ? "bg-ocean" : "bg-amber"
                )}
                style={{ width: `${Math.min(100, bucket.weight * 2)}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
