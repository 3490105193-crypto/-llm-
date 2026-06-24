"use client";

import { clsx } from "clsx";
import { AlertTriangle, CalendarClock, CheckSquare, ListChecks } from "lucide-react";
import { prioritizeAlerts, severityTone, summarizeResearchQueue } from "../analysis";
import type { MarketSnapshot } from "../schemas";

type AlertCenterProps = {
  snapshot: MarketSnapshot;
};

const statusClasses = {
  Todo: "border-amber/30 bg-amber/10 text-amber",
  "In review": "border-ocean/30 bg-ocean/10 text-ocean",
  Done: "border-mint/30 bg-mint/10 text-mint"
};

const toneClasses = {
  positive: "border-mint/30 bg-mint/10 text-mint",
  warning: "border-amber/30 bg-amber/10 text-amber",
  danger: "border-coral/30 bg-coral/10 text-coral",
  neutral: "border-line bg-white text-ink"
};

export function AlertCenter({ snapshot }: AlertCenterProps) {
  const alerts = prioritizeAlerts(snapshot.alerts);
  const researchSummary = summarizeResearchQueue(snapshot.researchQueue);

  return (
    <section className="grid gap-4 xl:grid-cols-[1.05fr_0.95fr]" aria-label="Alerts and research">
      <div className="rounded-lg border border-line bg-white p-4 shadow-dashboard">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase text-slate-500">Alert center</p>
            <h2 className="mt-1 text-xl font-semibold">Triage queue</h2>
          </div>
          <div className="grid h-10 w-10 place-items-center rounded-md border border-coral/30 bg-coral/10 text-coral">
            <AlertTriangle aria-hidden="true" size={20} />
          </div>
        </div>

        <div className="mt-4 space-y-3">
          {alerts.map((alert) => (
            <article key={alert.id} className="rounded-md border border-line bg-paper p-3">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="font-semibold">{alert.title}</h3>
                    <span
                      className={clsx(
                        "rounded-full border px-2 py-1 text-xs font-semibold",
                        toneClasses[severityTone(alert.severity)]
                      )}
                    >
                      {alert.severity}
                    </span>
                    {alert.acknowledged ? (
                      <span className="rounded-full border border-line bg-white px-2 py-1 text-xs font-semibold text-slate-500">
                        Ack
                      </span>
                    ) : null}
                  </div>
                  <p className="mt-2 text-sm leading-5 text-slate-700">{alert.detail}</p>
                </div>
                <span className="shrink-0 rounded-md border border-line bg-white px-2 py-1 text-xs font-semibold">
                  {alert.category}
                </span>
              </div>
              <dl className="mt-3 grid gap-2 text-sm sm:grid-cols-3">
                <div>
                  <dt className="text-xs uppercase text-slate-500">Trigger</dt>
                  <dd className="mt-1 text-slate-700">{alert.trigger}</dd>
                </div>
                <div>
                  <dt className="text-xs uppercase text-slate-500">Affected</dt>
                  <dd className="mt-1 font-semibold">{alert.affectedSymbols.join(", ")}</dd>
                </div>
                <div>
                  <dt className="text-xs uppercase text-slate-500">Action</dt>
                  <dd className="mt-1 text-slate-700">{alert.suggestedAction}</dd>
                </div>
              </dl>
            </article>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        <div className="rounded-lg border border-line bg-white p-4 shadow-dashboard">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase text-slate-500">Research</p>
              <h2 className="mt-1 text-xl font-semibold">Due diligence</h2>
            </div>
            <div className="grid h-10 w-10 place-items-center rounded-md border border-ocean/30 bg-ocean/10 text-ocean">
              <ListChecks aria-hidden="true" size={20} />
            </div>
          </div>

          <dl className="mt-4 grid grid-cols-4 gap-2 text-sm">
            <Summary label="Open" value={researchSummary.open} />
            <Summary label="Review" value={researchSummary.inReview} />
            <Summary label="Done" value={researchSummary.done} />
            <Summary label="High" value={researchSummary.highPriorityOpen} />
          </dl>

          <div className="mt-4 space-y-2">
            {snapshot.researchQueue.map((task) => (
              <article key={task.id} className="rounded-md border border-line bg-paper p-3">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <CheckSquare aria-hidden="true" className="text-ocean" size={16} />
                      <h3 className="text-sm font-semibold">{task.title}</h3>
                    </div>
                    <p className="mt-2 text-xs text-slate-500">
                      {task.symbol} / {task.owner} / due {task.due}
                    </p>
                  </div>
                  <span
                    className={clsx(
                      "rounded-full border px-2 py-1 text-xs font-semibold",
                      statusClasses[task.status]
                    )}
                  >
                    {task.status}
                  </span>
                </div>
              </article>
            ))}
          </div>
        </div>

        <div className="rounded-lg border border-line bg-white p-4 shadow-dashboard">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase text-slate-500">Calendar</p>
              <h2 className="mt-1 text-xl font-semibold">Event risk</h2>
            </div>
            <div className="grid h-10 w-10 place-items-center rounded-md border border-amber/30 bg-amber/10 text-amber">
              <CalendarClock aria-hidden="true" size={20} />
            </div>
          </div>
          <div className="mt-4 space-y-2">
            {snapshot.events.map((event) => (
              <article
                key={event.id}
                className="grid grid-cols-[92px_1fr_auto] gap-3 rounded-md border border-line bg-paper p-3 text-sm"
              >
                <time className="font-semibold" dateTime={event.date}>
                  {event.date.slice(5)}
                </time>
                <div>
                  <h3 className="font-semibold">{event.title}</h3>
                  <p className="mt-1 text-xs text-slate-500">{event.symbols.join(", ")}</p>
                </div>
                <span
                  className={clsx(
                    "h-fit rounded-full border px-2 py-1 text-xs font-semibold",
                    toneClasses[severityTone(event.severity)]
                  )}
                >
                  {event.type}
                </span>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function Summary({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-md border border-line bg-paper p-3 text-center">
      <dt className="text-xs text-slate-500">{label}</dt>
      <dd className="mt-1 font-semibold">{value}</dd>
    </div>
  );
}
