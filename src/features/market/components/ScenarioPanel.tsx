"use client";

import { clsx } from "clsx";
import { Gauge } from "lucide-react";
import type { MarketScenario } from "../schemas";

type ScenarioPanelProps = {
  scenarios: MarketScenario[];
  activeScenarioId: string;
  onSelectScenario: (scenarioId: string) => void;
};

export function ScenarioPanel({
  scenarios,
  activeScenarioId,
  onSelectScenario
}: ScenarioPanelProps) {
  const activeScenario =
    scenarios.find((scenario) => scenario.id === activeScenarioId) ?? scenarios[0];

  return (
    <section
      id="scenarios"
      aria-labelledby="scenario-title"
      className="rounded-lg border border-line bg-white p-4 shadow-dashboard"
    >
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase text-slate-500">Scenarios</p>
          <h2 id="scenario-title" className="mt-2 text-xl font-semibold">
            {activeScenario.name}
          </h2>
        </div>
        <div className="grid h-10 w-10 place-items-center rounded-md border border-ocean/30 bg-ocean/10 text-ocean">
          <Gauge aria-hidden="true" size={20} />
        </div>
      </div>

      <div
        className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4"
        role="tablist"
        aria-label="Market scenarios"
      >
        {scenarios.map((scenario) => (
          <button
            key={scenario.id}
            className={clsx(
              "min-h-11 rounded-md border px-3 py-2 text-sm font-semibold",
              scenario.id === activeScenarioId
                ? "border-ink bg-ink text-white"
                : "border-line bg-paper text-ink"
            )}
            type="button"
            role="tab"
            aria-selected={scenario.id === activeScenarioId}
            onClick={() => onSelectScenario(scenario.id)}
          >
            {scenario.name}
          </button>
        ))}
      </div>

      <dl className="mt-5 grid grid-cols-3 gap-2 text-sm">
        <div className="rounded-md border border-line bg-paper p-3">
          <dt className="text-xs text-slate-500">Horizon</dt>
          <dd className="mt-1 font-semibold">{activeScenario.horizon}</dd>
        </div>
        <div className="rounded-md border border-line bg-paper p-3">
          <dt className="text-xs text-slate-500">Probability</dt>
          <dd className="mt-1 font-semibold">{activeScenario.probability}%</dd>
        </div>
        <div className="rounded-md border border-line bg-paper p-3">
          <dt className="text-xs text-slate-500">Impact</dt>
          <dd
            className={
              activeScenario.impact >= 0
                ? "mt-1 font-semibold text-mint"
                : "mt-1 font-semibold text-coral"
            }
          >
            {activeScenario.impact > 0 ? "+" : ""}
            {activeScenario.impact}%
          </dd>
        </div>
      </dl>

      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        <div>
          <h3 className="text-sm font-semibold">Drivers</h3>
          <ul className="mt-2 space-y-2 text-sm text-slate-600">
            {activeScenario.drivers.map((driver) => (
              <li key={driver}>{driver}</li>
            ))}
          </ul>
        </div>
        <div>
          <h3 className="text-sm font-semibold">Actions</h3>
          <ul className="mt-2 space-y-2 text-sm text-slate-600">
            {activeScenario.actions.map((action) => (
              <li key={action}>{action}</li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
