"use client";

import { clsx } from "clsx";
import { CalendarDays, CheckCircle2, Flag, Newspaper, ShieldAlert } from "lucide-react";
import type { ReactNode } from "react";
import type { RankedAsset } from "../analysis";
import { formatPct, formatUsdBn } from "../analysis";
import type { MarketAlert, MarketEvent, ResearchTask } from "../schemas";

type AssetDetailProps = {
  asset?: RankedAsset;
  context: {
    tasks: ResearchTask[];
    alerts: MarketAlert[];
    events: MarketEvent[];
  };
};

const factorLabels: Record<keyof RankedAsset["factorExposure"], string> = {
  growth: "Growth",
  value: "Value",
  quality: "Quality",
  momentum: "Momentum",
  rates: "Rates",
  usd: "USD"
};

export function AssetDetail({ asset, context }: AssetDetailProps) {
  if (!asset) {
    return (
      <section
        aria-labelledby="asset-detail-title"
        className="rounded-lg border border-line bg-white p-4 shadow-dashboard"
      >
        <h2 id="asset-detail-title" className="text-lg font-semibold">
          Asset detail
        </h2>
        <p className="mt-3 text-sm text-slate-600" role="status">
          No asset selected.
        </p>
      </section>
    );
  }

  return (
    <section
      aria-labelledby="asset-detail-title"
      className="min-w-0 rounded-lg border border-line bg-white p-4 shadow-dashboard"
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase text-slate-500">Asset memo</p>
          <h2 id="asset-detail-title" className="mt-1 text-2xl font-semibold">
            {asset.symbol}
          </h2>
          <p className="text-sm text-slate-600">{asset.name}</p>
        </div>
        <span
          className={clsx(
            "rounded-md px-2 py-1 text-sm font-semibold",
            asset.changePct >= 0 ? "bg-mint/10 text-mint" : "bg-coral/10 text-coral"
          )}
        >
          {formatPct(asset.changePct)}
        </span>
      </div>

      <p className="mt-4 text-sm leading-6 text-slate-700">{asset.thesis}</p>

      <dl className="mt-5 grid grid-cols-2 gap-2 text-sm sm:grid-cols-4">
        <Metric label="Signal" value={`${asset.opportunityScore}`} />
        <Metric label="Risk-adj." value={`${asset.riskAdjustedScore}`} />
        <Metric label="Market cap" value={formatUsdBn(asset.marketCapUsdBn)} />
        <Metric label="Beta" value={asset.beta.toFixed(2)} />
        <Metric label="Revision" value={`${asset.earningsRevision}`} />
        <Metric label="Sentiment" value={`${asset.sentiment}`} />
        <Metric label="Rel. volume" value={`${asset.relativeVolume.toFixed(2)}x`} />
        <Metric label="Risk" value={`${asset.risk}`} />
      </dl>

      <div className="mt-5">
        <h3 className="text-sm font-semibold">Factor profile</h3>
        <div className="mt-3 space-y-3">
          {Object.entries(asset.factorExposure).map(([factor, value]) => {
            const normalized = (value + 100) / 2;

            return (
              <div key={factor}>
                <div className="flex items-center justify-between gap-3 text-xs">
                  <span className="font-semibold text-slate-600">
                    {factorLabels[factor as keyof RankedAsset["factorExposure"]]}
                  </span>
                  <span
                    className={value >= 0 ? "font-semibold text-mint" : "font-semibold text-coral"}
                  >
                    {value > 0 ? "+" : ""}
                    {value}
                  </span>
                </div>
                <div className="mt-1 h-2 overflow-hidden rounded-full bg-paper">
                  <div
                    aria-hidden="true"
                    className={clsx("h-full rounded-full", value >= 0 ? "bg-mint" : "bg-coral")}
                    style={{ width: `${normalized}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="mt-5 grid gap-4 md:grid-cols-2">
        <ListBlock
          icon={<CheckCircle2 aria-hidden="true" size={18} />}
          title="Catalysts"
          items={asset.catalysts}
        />
        <ListBlock
          icon={<Flag aria-hidden="true" size={18} />}
          title="Watch flags"
          items={asset.watchFlags}
        />
      </div>

      <div className="mt-5">
        <h3 className="text-sm font-semibold">Decision checklist</h3>
        <ul className="mt-2 space-y-2 text-sm text-slate-700">
          {asset.decisionChecklist.map((item) => (
            <li key={item} className="flex gap-2">
              <CheckCircle2 aria-hidden="true" className="mt-0.5 shrink-0 text-ocean" size={16} />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-5 grid gap-3">
        <ContextBlock
          icon={<ShieldAlert aria-hidden="true" size={18} />}
          title="Related alerts"
          items={context.alerts.map((alert) => `${alert.title}: ${alert.suggestedAction}`)}
        />
        <ContextBlock
          icon={<Newspaper aria-hidden="true" size={18} />}
          title="Research tasks"
          items={context.tasks.map((task) => `${task.status}: ${task.title}`)}
        />
        <ContextBlock
          icon={<CalendarDays aria-hidden="true" size={18} />}
          title="Upcoming events"
          items={context.events.map((event) => `${event.date}: ${event.title}`)}
        />
      </div>
    </section>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md border border-line bg-paper p-3">
      <dt className="text-xs text-slate-500">{label}</dt>
      <dd className="mt-1 font-semibold">{value}</dd>
    </div>
  );
}

function ListBlock({ icon, title, items }: { icon: ReactNode; title: string; items: string[] }) {
  return (
    <div>
      <div className="flex items-center gap-2 text-sm font-semibold">
        <span className="text-ocean">{icon}</span>
        <h3>{title}</h3>
      </div>
      <ul className="mt-2 space-y-2 text-sm text-slate-700">
        {items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </div>
  );
}

function ContextBlock({ icon, title, items }: { icon: ReactNode; title: string; items: string[] }) {
  if (items.length === 0) {
    return null;
  }

  return (
    <div className="rounded-md border border-line bg-paper p-3">
      <div className="flex items-center gap-2 text-sm font-semibold">
        <span className="text-ocean">{icon}</span>
        <h3>{title}</h3>
      </div>
      <ul className="mt-2 space-y-2 text-sm text-slate-700">
        {items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </div>
  );
}
