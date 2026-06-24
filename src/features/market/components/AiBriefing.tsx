"use client";

import { clsx } from "clsx";
import {
  BrainCircuit,
  CheckCircle2,
  DatabaseZap,
  RefreshCw,
  ShieldAlert,
  Sparkles,
  TrendingUp
} from "lucide-react";
import { rankLlmDecisions, severityTone, summarizeLlmBrief } from "../analysis";
import type { LlmDecision, LlmMarketBrief } from "../schemas";

type AiBriefingProps = {
  brief: LlmMarketBrief;
  liveState?: {
    mode: "sample" | "submitting" | "running" | "live" | "failed";
    taskId?: string;
    progress?: number;
    error?: string;
    updatedAt?: string;
  };
  onRunLive?: () => void;
};

const decisionTone: Record<LlmDecision, string> = {
  Buy: "border-mint/30 bg-mint/10 text-mint",
  Hold: "border-ocean/30 bg-ocean/10 text-ocean",
  Watch: "border-amber/30 bg-amber/10 text-amber",
  Reduce: "border-coral/30 bg-coral/10 text-coral",
  Avoid: "border-coral/30 bg-coral/10 text-coral"
};

const severityClasses = {
  positive: "border-mint/30 bg-mint/10 text-mint",
  warning: "border-amber/30 bg-amber/10 text-amber",
  danger: "border-coral/30 bg-coral/10 text-coral",
  neutral: "border-line bg-white text-ink"
};

export function AiBriefing({ brief, liveState, onRunLive }: AiBriefingProps) {
  const summary = summarizeLlmBrief(brief);
  const decisions = rankLlmDecisions(brief.stockDecisions);
  const isLoading = liveState?.mode === "submitting" || liveState?.mode === "running";
  const statusLabel = getLiveStatusLabel(liveState);

  return (
    <section className="space-y-4" aria-label="AI market briefing">
      <div className="rounded-lg border border-line bg-white p-4 shadow-dashboard">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase text-slate-500">{brief.engine}</p>
            <h2 className="mt-1 text-2xl font-semibold">DSA LLM market briefing</h2>
            <p className="mt-2 max-w-4xl text-sm leading-6 text-slate-700">
              {brief.marketView.summary}
            </p>
            <div className="mt-3 flex flex-wrap items-center gap-2">
              <span
                className={clsx(
                  "rounded-full border px-2 py-1 text-xs font-semibold",
                  liveState?.mode === "live"
                    ? "border-mint/30 bg-mint/10 text-mint"
                    : liveState?.mode === "failed"
                      ? "border-coral/30 bg-coral/10 text-coral"
                      : "border-amber/30 bg-amber/10 text-amber"
                )}
              >
                {statusLabel}
              </span>
              {liveState?.taskId ? (
                <span className="rounded-full border border-line bg-paper px-2 py-1 text-xs font-semibold text-slate-500">
                  Task {liveState.taskId.slice(0, 8)}
                </span>
              ) : null}
              {liveState?.updatedAt ? (
                <span className="rounded-full border border-line bg-paper px-2 py-1 text-xs font-semibold text-slate-500">
                  {new Date(liveState.updatedAt).toLocaleTimeString()}
                </span>
              ) : null}
            </div>
            {liveState?.error ? (
              <p className="mt-3 rounded-md border border-coral/30 bg-coral/10 p-3 text-sm font-semibold text-coral">
                {liveState.error}
              </p>
            ) : null}
          </div>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 lg:min-w-[560px]">
            <Metric label="Stance" value={brief.marketView.stance} />
            <Metric label="Confidence" value={`${brief.marketView.confidence}%`} />
            <Metric label="Decisions" value={`${summary.totalDecisions}`} />
            <Metric
              label="Progress"
              value={isLoading ? `${liveState?.progress ?? 0}%` : `${summary.riskActions} risks`}
              tone={summary.riskActions > 0 ? "danger" : "neutral"}
            />
            <button
              className="col-span-2 inline-flex min-h-11 items-center justify-center gap-2 rounded-md bg-ink px-4 py-2 text-sm font-semibold text-white disabled:opacity-70 sm:col-span-4"
              type="button"
              onClick={onRunLive}
              disabled={!onRunLive || isLoading}
            >
              <RefreshCw aria-hidden="true" className={isLoading ? "animate-spin" : ""} size={18} />
              {isLoading ? "Running DSA review" : "Run DSA live market review"}
            </button>
          </div>
        </div>
      </div>

      <div className="grid gap-4 xl:grid-cols-[0.9fr_1.1fr]">
        <div className="space-y-4">
          <section
            className="rounded-lg border border-line bg-white p-4 shadow-dashboard"
            aria-labelledby="ai-read-title"
          >
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase text-slate-500">Market read</p>
                <h3 id="ai-read-title" className="mt-1 text-xl font-semibold">
                  Regime diagnostics
                </h3>
              </div>
              <div className="grid h-10 w-10 place-items-center rounded-md border border-ocean/30 bg-ocean/10 text-ocean">
                <BrainCircuit aria-hidden="true" size={20} />
              </div>
            </div>
            <dl className="mt-4 space-y-3 text-sm">
              <Readout label="Liquidity" value={brief.marketView.liquidityRead} />
              <Readout label="Breadth" value={brief.marketView.breadthRead} />
              <Readout label="Risk budget" value={brief.marketView.riskBudget} />
            </dl>
          </section>

          <section
            className="rounded-lg border border-line bg-white p-4 shadow-dashboard"
            aria-labelledby="index-narrative-title"
          >
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase text-slate-500">Index narrative</p>
                <h3 id="index-narrative-title" className="mt-1 text-xl font-semibold">
                  Big market map
                </h3>
              </div>
              <div className="grid h-10 w-10 place-items-center rounded-md border border-mint/30 bg-mint/10 text-mint">
                <TrendingUp aria-hidden="true" size={20} />
              </div>
            </div>
            <div className="mt-4 space-y-3">
              {brief.indexNarrative.map((item) => (
                <article key={item.symbol} className="rounded-md border border-line bg-paper p-3">
                  <div className="flex items-center justify-between gap-3">
                    <h4 className="font-semibold">{item.symbol}</h4>
                    <span className="rounded-full border border-line bg-white px-2 py-1 text-xs font-semibold">
                      {item.drivers.length} drivers
                    </span>
                  </div>
                  <p className="mt-2 text-sm leading-5 text-slate-700">{item.view}</p>
                </article>
              ))}
            </div>
          </section>

          <section
            className="rounded-lg border border-line bg-white p-4 shadow-dashboard"
            aria-labelledby="data-quality-title"
          >
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase text-slate-500">Controls</p>
                <h3 id="data-quality-title" className="mt-1 text-xl font-semibold">
                  Data quality
                </h3>
              </div>
              <div className="grid h-10 w-10 place-items-center rounded-md border border-amber/30 bg-amber/10 text-amber">
                <DatabaseZap aria-hidden="true" size={20} />
              </div>
            </div>
            <p className="mt-3 text-sm leading-6 text-slate-700">{brief.dataQuality.freshness}</p>
            <div className="mt-4 grid gap-4 md:grid-cols-2">
              <List title="Missing inputs" items={brief.dataQuality.missingInputs} />
              <List title="Confidence notes" items={brief.dataQuality.confidenceNotes} />
            </div>
          </section>
        </div>

        <div className="space-y-4">
          <section
            className="rounded-lg border border-line bg-white p-4 shadow-dashboard"
            aria-labelledby="decision-title"
          >
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase text-slate-500">Decisions</p>
                <h3 id="decision-title" className="mt-1 text-xl font-semibold">
                  Stock action board
                </h3>
              </div>
              <div className="grid h-10 w-10 place-items-center rounded-md border border-mint/30 bg-mint/10 text-mint">
                <Sparkles aria-hidden="true" size={20} />
              </div>
            </div>

            <div className="mt-4 overflow-x-auto">
              <table className="min-w-[820px] w-full border-collapse text-left text-sm">
                <thead className="bg-paper text-xs uppercase text-slate-500">
                  <tr>
                    <th className="px-3 py-3">Symbol</th>
                    <th className="px-3 py-3">Decision</th>
                    <th className="px-3 py-3">Score</th>
                    <th className="px-3 py-3">Horizon</th>
                    <th className="px-3 py-3">Next check</th>
                  </tr>
                </thead>
                <tbody>
                  {decisions.map((decision) => (
                    <tr key={decision.symbol} className="border-t border-line">
                      <td className="px-3 py-3">
                        <span className="block font-semibold">{decision.symbol}</span>
                        <span className="block text-xs text-slate-500">{decision.thesis}</span>
                      </td>
                      <td className="px-3 py-3">
                        <span
                          className={clsx(
                            "rounded-full border px-2 py-1 text-xs font-semibold",
                            decisionTone[decision.decision]
                          )}
                        >
                          {decision.decision}
                        </span>
                      </td>
                      <td className="px-3 py-3 font-semibold">{decision.score}</td>
                      <td className="px-3 py-3">{decision.timeHorizon}</td>
                      <td className="px-3 py-3">{decision.nextCheck}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <section
            className="rounded-lg border border-line bg-white p-4 shadow-dashboard"
            aria-labelledby="rotation-title"
          >
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase text-slate-500">Rotation</p>
                <h3 id="rotation-title" className="mt-1 text-xl font-semibold">
                  Sector calls
                </h3>
              </div>
              <div className="grid h-10 w-10 place-items-center rounded-md border border-ocean/30 bg-ocean/10 text-ocean">
                <CheckCircle2 aria-hidden="true" size={20} />
              </div>
            </div>
            <div className="mt-4 grid gap-3 md:grid-cols-2">
              {brief.sectorRotation.map((sector) => (
                <article key={sector.sector} className="rounded-md border border-line bg-paper p-3">
                  <div className="flex items-center justify-between gap-3">
                    <h4 className="font-semibold">{sector.sector}</h4>
                    <span
                      className={clsx(
                        "rounded-full border px-2 py-1 text-xs font-semibold",
                        decisionTone[sector.stance]
                      )}
                    >
                      {sector.stance}
                    </span>
                  </div>
                  <p className="mt-2 text-sm leading-5 text-slate-700">{sector.reason}</p>
                </article>
              ))}
            </div>
          </section>

          <section
            className="rounded-lg border border-line bg-white p-4 shadow-dashboard"
            aria-labelledby="llm-risk-title"
          >
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase text-slate-500">Risk</p>
                <h3 id="llm-risk-title" className="mt-1 text-xl font-semibold">
                  LLM warnings
                </h3>
              </div>
              <div className="grid h-10 w-10 place-items-center rounded-md border border-coral/30 bg-coral/10 text-coral">
                <ShieldAlert aria-hidden="true" size={20} />
              </div>
            </div>
            <div className="mt-4 space-y-3">
              {brief.riskWarnings.map((warning) => (
                <article key={warning.title} className="rounded-md border border-line bg-paper p-3">
                  <div className="flex items-center justify-between gap-3">
                    <h4 className="font-semibold">{warning.title}</h4>
                    <span
                      className={clsx(
                        "rounded-full border px-2 py-1 text-xs font-semibold",
                        severityClasses[severityTone(warning.severity)]
                      )}
                    >
                      {warning.severity}
                    </span>
                  </div>
                  <p className="mt-2 text-sm leading-5 text-slate-700">{warning.detail}</p>
                  <p className="mt-2 text-sm font-semibold text-ink">{warning.action}</p>
                </article>
              ))}
            </div>
          </section>
        </div>
      </div>
    </section>
  );
}

function getLiveStatusLabel(liveState: AiBriefingProps["liveState"]): string {
  if (!liveState || liveState.mode === "sample") {
    return "Sample brief";
  }

  if (liveState.mode === "submitting") {
    return "Submitting to DSA";
  }

  if (liveState.mode === "running") {
    return "DSA running";
  }

  if (liveState.mode === "live") {
    return "Live DSA brief";
  }

  return "Live run failed";
}

function Metric({
  label,
  value,
  tone = "neutral"
}: {
  label: string;
  value: string;
  tone?: "danger" | "neutral";
}) {
  return (
    <div className="rounded-md border border-line bg-paper p-3">
      <dt className="text-xs uppercase text-slate-500">{label}</dt>
      <dd className={clsx("mt-1 font-semibold", tone === "danger" && "text-coral")}>{value}</dd>
    </div>
  );
}

function Readout({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md border border-line bg-paper p-3">
      <dt className="text-xs font-semibold uppercase text-slate-500">{label}</dt>
      <dd className="mt-2 leading-6 text-slate-700">{value}</dd>
    </div>
  );
}

function List({ title, items }: { title: string; items: string[] }) {
  return (
    <div>
      <h4 className="text-sm font-semibold">{title}</h4>
      <ul className="mt-2 space-y-2 text-sm text-slate-700">
        {items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </div>
  );
}
