import { clsx } from "clsx";
import { formatPct } from "../analysis";
import type { MarketSnapshot } from "../schemas";

type SectorHeatmapProps = {
  snapshot: MarketSnapshot;
};

function sectorTone(changePct: number) {
  if (changePct >= 0.5) {
    return "border-mint/40 bg-mint/15";
  }

  if (changePct >= 0) {
    return "border-ocean/30 bg-ocean/10";
  }

  if (changePct <= -0.35) {
    return "border-coral/35 bg-coral/10";
  }

  return "border-amber/30 bg-amber/10";
}

export function SectorHeatmap({ snapshot }: SectorHeatmapProps) {
  return (
    <section
      id="sectors"
      aria-labelledby="sector-title"
      className="rounded-lg border border-line bg-white p-4 shadow-dashboard"
    >
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase text-slate-500">Sectors</p>
          <h2 id="sector-title" className="mt-2 text-xl font-semibold">
            Breadth map
          </h2>
        </div>
      </div>
      <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4">
        {snapshot.sectors.map((sector) => (
          <article
            key={sector.name}
            className={clsx("min-h-28 rounded-md border p-3", sectorTone(sector.changePct))}
          >
            <div className="flex items-start justify-between gap-2">
              <h3 className="text-sm font-semibold">{sector.name}</h3>
              <span
                className={
                  sector.changePct >= 0
                    ? "text-sm font-semibold text-mint"
                    : "text-sm font-semibold text-coral"
                }
              >
                {formatPct(sector.changePct)}
              </span>
            </div>
            <dl className="mt-4 grid grid-cols-2 gap-2 text-xs text-slate-600">
              <div>
                <dt>Breadth</dt>
                <dd className="font-semibold text-ink">{sector.breadth}</dd>
              </div>
              <div>
                <dt>Momentum</dt>
                <dd className="font-semibold text-ink">{sector.momentum}</dd>
              </div>
            </dl>
          </article>
        ))}
      </div>
    </section>
  );
}
