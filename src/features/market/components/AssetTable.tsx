"use client";

import { ArrowDown, ArrowUp, Search } from "lucide-react";
import type { RankedAsset } from "../analysis";
import { formatPct, formatUsdBn } from "../analysis";

type AssetTableProps = {
  assets: RankedAsset[];
  query: string;
  selectedSymbol: string;
  onQueryChange: (query: string) => void;
  onSelectAsset: (symbol: string) => void;
};

export function AssetTable({
  assets,
  query,
  selectedSymbol,
  onQueryChange,
  onSelectAsset
}: AssetTableProps) {
  return (
    <section
      id="watchlist"
      aria-labelledby="asset-table-title"
      className="min-w-0 overflow-hidden rounded-lg border border-line bg-white shadow-dashboard"
    >
      <div className="flex flex-col gap-3 border-b border-line p-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase text-slate-500">Screener</p>
          <h2 id="asset-table-title" className="mt-2 text-xl font-semibold">
            Signal rank
          </h2>
        </div>
        <label className="relative block w-full sm:max-w-xs">
          <span className="sr-only">Search assets</span>
          <Search
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            size={18}
          />
          <input
            className="min-h-11 w-full rounded-md border border-line bg-paper py-2 pl-10 pr-3 text-sm"
            value={query}
            onChange={(event) => onQueryChange(event.target.value)}
            placeholder="Symbol, sector, name"
            type="search"
          />
        </label>
      </div>

      <div className="w-full overflow-x-auto">
        <table className="min-w-[1080px] w-full border-collapse text-left text-sm">
          <thead className="bg-paper text-xs uppercase text-slate-500">
            <tr>
              <th className="px-4 py-3">Asset</th>
              <th className="px-4 py-3">Move</th>
              <th className="px-4 py-3">Signal</th>
              <th className="px-4 py-3">Risk-adj.</th>
              <th className="px-4 py-3">Quality</th>
              <th className="px-4 py-3">Revision</th>
              <th className="px-4 py-3">Sentiment</th>
              <th className="px-4 py-3">Risk</th>
              <th className="px-4 py-3">Cap</th>
              <th className="px-4 py-3">Category</th>
              <th className="px-4 py-3">Sector</th>
            </tr>
          </thead>
          <tbody>
            {assets.map((asset) => (
              <tr
                key={asset.symbol}
                className={
                  asset.symbol === selectedSymbol
                    ? "border-t border-line bg-ocean/5"
                    : "border-t border-line"
                }
              >
                <td className="px-4 py-3">
                  <button
                    className="min-h-11 text-left"
                    type="button"
                    aria-label={`${asset.symbol} ${asset.name}`}
                    aria-pressed={asset.symbol === selectedSymbol}
                    onClick={() => onSelectAsset(asset.symbol)}
                  >
                    <span className="block font-semibold text-ink">{asset.symbol}</span>
                    <span className="block text-xs text-slate-500">{asset.name}</span>
                  </button>
                </td>
                <td
                  className={
                    asset.changePct >= 0
                      ? "px-4 py-3 font-semibold text-mint"
                      : "px-4 py-3 font-semibold text-coral"
                  }
                >
                  <span className="inline-flex items-center gap-1">
                    {asset.changePct >= 0 ? (
                      <ArrowUp aria-hidden="true" size={14} />
                    ) : (
                      <ArrowDown aria-hidden="true" size={14} />
                    )}
                    {formatPct(asset.changePct)}
                  </span>
                </td>
                <td className="px-4 py-3 font-semibold">{asset.opportunityScore}</td>
                <td className="px-4 py-3 font-semibold">{asset.riskAdjustedScore}</td>
                <td className="px-4 py-3">{asset.quality}</td>
                <td
                  className={
                    asset.earningsRevision >= 0 ? "px-4 py-3 text-mint" : "px-4 py-3 text-coral"
                  }
                >
                  {asset.earningsRevision > 0 ? "+" : ""}
                  {asset.earningsRevision}
                </td>
                <td className="px-4 py-3">{asset.sentiment}</td>
                <td className="px-4 py-3">{asset.risk}</td>
                <td className="px-4 py-3">{formatUsdBn(asset.marketCapUsdBn)}</td>
                <td className="px-4 py-3">{asset.category}</td>
                <td className="px-4 py-3">{asset.sector}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {assets.length === 0 ? (
        <div className="border-t border-line p-6 text-sm text-slate-600" role="status">
          No assets match the current filters.
        </div>
      ) : null}
    </section>
  );
}
