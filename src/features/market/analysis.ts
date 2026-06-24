import type { MarketAsset, MarketScenario, MarketSnapshot } from "./schemas";

export type AssetFilters = {
  query?: string;
  category?: MarketAsset["category"] | "All";
  minimumScore?: number;
};

export type RankedAsset = MarketAsset & {
  opportunityScore: number;
  riskAdjustedScore: number;
};

export function calculateOpportunityScore(asset: MarketAsset): number {
  const score =
    asset.momentum * 0.32 +
    asset.quality * 0.22 +
    asset.liquidity * 0.16 +
    (100 - asset.risk) * 0.16 +
    (100 - asset.valuation) * 0.08 +
    (100 - asset.volatility) * 0.06;

  return Math.round(score);
}

export function calculateRiskAdjustedScore(asset: MarketAsset): number {
  const score = calculateOpportunityScore(asset) - Math.round(asset.risk * 0.28);
  return Math.max(0, Math.min(100, score));
}

export function rankAssets(snapshot: MarketSnapshot, filters: AssetFilters = {}): RankedAsset[] {
  const query = filters.query?.trim().toLowerCase();
  const minimumScore = filters.minimumScore ?? 0;

  return snapshot.assets
    .filter((asset) => {
      const matchesCategory =
        !filters.category || filters.category === "All" || asset.category === filters.category;
      const matchesQuery =
        !query ||
        asset.symbol.toLowerCase().includes(query) ||
        asset.name.toLowerCase().includes(query) ||
        asset.sector.toLowerCase().includes(query);
      return matchesCategory && matchesQuery;
    })
    .map((asset) => ({
      ...asset,
      opportunityScore: calculateOpportunityScore(asset),
      riskAdjustedScore: calculateRiskAdjustedScore(asset)
    }))
    .filter((asset) => asset.opportunityScore >= minimumScore)
    .sort((left, right) => right.riskAdjustedScore - left.riskAdjustedScore);
}

export function calculateMarketHealth(snapshot: MarketSnapshot): number {
  const sectorBreadth =
    snapshot.sectors.reduce((total, sector) => total + sector.breadth, 0) / snapshot.sectors.length;
  const sectorMomentum =
    snapshot.sectors.reduce((total, sector) => total + sector.momentum, 0) /
    snapshot.sectors.length;
  const riskPenalty =
    snapshot.assets.reduce((total, asset) => total + asset.risk, 0) / snapshot.assets.length;

  const score =
    snapshot.regime.score * 0.45 +
    sectorBreadth * 0.25 +
    sectorMomentum * 0.2 +
    (100 - riskPenalty) * 0.1;

  return Math.round(score);
}

export function choosePrimaryScenario(scenarios: MarketScenario[]): MarketScenario {
  return scenarios.reduce((current, candidate) =>
    candidate.probability > current.probability ? candidate : current
  );
}

export function formatPct(value: number): string {
  const prefix = value > 0 ? "+" : "";
  return `${prefix}${value.toFixed(2)}%`;
}

export function severityTone(
  severity: "low" | "medium" | "high"
): "positive" | "warning" | "danger" {
  if (severity === "high") {
    return "danger";
  }

  if (severity === "medium") {
    return "warning";
  }

  return "positive";
}
