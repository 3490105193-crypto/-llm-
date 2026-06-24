import type { ReactNode } from "react";
import { clsx } from "clsx";

type MetricCardProps = {
  label: string;
  value: string;
  detail: string;
  tone?: "positive" | "warning" | "danger" | "neutral";
  icon: ReactNode;
};

const toneClasses = {
  positive: "border-mint/30 bg-mint/10 text-mint",
  warning: "border-amber/30 bg-amber/10 text-amber",
  danger: "border-coral/30 bg-coral/10 text-coral",
  neutral: "border-line bg-white text-ink"
};

export function MetricCard({ label, value, detail, tone = "neutral", icon }: MetricCardProps) {
  return (
    <section className="rounded-lg border border-line bg-white p-4 shadow-dashboard">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase text-slate-500">{label}</p>
          <p className="mt-2 text-2xl font-semibold text-ink">{value}</p>
        </div>
        <div
          className={clsx(
            "grid h-10 w-10 shrink-0 place-items-center rounded-md border",
            toneClasses[tone]
          )}
        >
          {icon}
        </div>
      </div>
      <p className="mt-3 min-h-10 text-sm leading-5 text-slate-600">{detail}</p>
    </section>
  );
}
