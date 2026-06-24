import type {
  MarketAlert,
  MarketAsset,
  MarketEvent,
  LlmDecision,
  LlmMarketBrief,
  MarketScenario,
  MarketSnapshot,
  PortfolioPosition,
  ResearchTask
} from "./schemas";

export type AssetFilters = {
  query?: string;
  category?: MarketAsset["category"] | "All";
  region?: MarketAsset["region"] | "All";
  sector?: string;
  minimumScore?: number;
  maximumRisk?: number;
  minimumQuality?: number;
};

export type RankedAsset = MarketAsset & {
  opportunityScore: number;
  riskAdjustedScore: number;
};

export type ExposureBucket = {
  name: string;
  weight: number;
  benchmarkWeight: number;
  activeWeight: number;
};

export type PortfolioRiskSummary = {
  grossExposure: number;
  cashWeight: number;
  weightedRisk: number;
  weightedBeta: number;
  activeShare: number;
  concentrationScore: number;
  hedgeWeight: number;
  sectorExposure: ExposureBucket[];
  categoryExposure: ExposureBucket[];
  factorExposure: MarketAsset["factorExposure"];
  topPositions: Array<PortfolioPosition & { asset: MarketAsset; activeWeight: number }>;
};

export type ScenarioImpact = {
  scenario: MarketScenario;
  totalImpact: number;
  stressedValue: number;
  rows: Array<{
    symbol: string;
    name: string;
    weight: number;
    impact: number;
    contribution: number;
  }>;
  biggestDrag?: { symbol: string; contribution: number };
  biggestOffset?: { symbol: string; contribution: number };
};

export type LlmBriefSummary = {
  totalDecisions: number;
  riskActions: number;
  highestConviction?: LlmMarketBrief["stockDecisions"][number];
  defensiveActions: Array<LlmMarketBrief["stockDecisions"][number]>;
};

const severityRank: Record<MarketAlert["severity"], number> = {
  high: 3,
  medium: 2,
  low: 1
};

const decisionRank: Record<LlmDecision, number> = {
  Buy: 5,
  Hold: 4,
  Watch: 3,
  Reduce: 2,
  Avoid: 1
};

function clampScore(value: number): number {
  return Math.max(0, Math.min(100, Math.round(value)));
}

function normalizeRevision(value: number): number {
  return (value + 100) / 2;
}

function round(value: number, precision = 1): number {
  const factor = 10 ** precision;
  return Math.round(value * factor) / factor;
}

function createAssetMap(assets: MarketAsset[]): Map<string, MarketAsset> {
  return new Map(assets.map((asset) => [asset.symbol, asset]));
}

export function calculateOpportunityScore(asset: MarketAsset): number {
  const score =
    asset.momentum * 0.24 +
    asset.quality * 0.18 +
    asset.liquidity * 0.12 +
    normalizeRevision(asset.earningsRevision) * 0.14 +
    asset.sentiment * 0.1 +
    (100 - asset.risk) * 0.1 +
    (100 - asset.valuation) * 0.07 +
    (100 - asset.volatility) * 0.05;

  return clampScore(score);
}

export function calculateRiskAdjustedScore(asset: MarketAsset): number {
  const betaPenalty = Math.max(0, asset.beta - 1) * 4;
  const score = calculateOpportunityScore(asset) - asset.risk * 0.22 - betaPenalty;
  return clampScore(score);
}

export function rankAssets(snapshot: MarketSnapshot, filters: AssetFilters = {}): RankedAsset[] {
  const query = filters.query?.trim().toLowerCase();
  const minimumScore = filters.minimumScore ?? 0;
  const maximumRisk = filters.maximumRisk ?? 100;
  const minimumQuality = filters.minimumQuality ?? 0;

  return snapshot.assets
    .filter((asset) => {
      const matchesCategory =
        !filters.category || filters.category === "All" || asset.category === filters.category;
      const matchesRegion =
        !filters.region || filters.region === "All" || asset.region === filters.region;
      const matchesSector =
        !filters.sector || filters.sector === "All" || asset.sector === filters.sector;
      const matchesQuery =
        !query ||
        asset.symbol.toLowerCase().includes(query) ||
        asset.name.toLowerCase().includes(query) ||
        asset.sector.toLowerCase().includes(query) ||
        asset.thesis.toLowerCase().includes(query);

      return (
        matchesCategory &&
        matchesRegion &&
        matchesSector &&
        matchesQuery &&
        asset.risk <= maximumRisk &&
        asset.quality >= minimumQuality
      );
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
    snapshot.regime.score * 0.42 +
    sectorBreadth * 0.23 +
    sectorMomentum * 0.18 +
    (100 - riskPenalty) * 0.12 +
    snapshot.regime.confidence * 0.05;

  return clampScore(score);
}

export function choosePrimaryScenario(scenarios: MarketScenario[]): MarketScenario {
  return scenarios.reduce((current, candidate) =>
    candidate.probability > current.probability ? candidate : current
  );
}

export function calculatePortfolioRisk(snapshot: MarketSnapshot): PortfolioRiskSummary {
  const assetMap = createAssetMap(snapshot.assets);
  const positions = snapshot.portfolio.positions
    .map((position) => {
      const asset = assetMap.get(position.symbol);

      if (!asset) {
        return null;
      }

      return { ...position, asset, activeWeight: position.weight - position.benchmarkWeight };
    })
    .filter(
      (position): position is PortfolioPosition & { asset: MarketAsset; activeWeight: number } =>
        Boolean(position)
    );

  const grossExposure = positions.reduce((total, position) => total + position.weight, 0);
  const weightedRisk = positions.reduce(
    (total, position) => total + position.asset.risk * (position.weight / grossExposure),
    0
  );
  const weightedBeta = positions.reduce(
    (total, position) => total + position.asset.beta * (position.weight / grossExposure),
    0
  );
  const activeShare =
    positions.reduce((total, position) => total + Math.abs(position.activeWeight), 0) / 2;
  const concentrationScore = positions.reduce(
    (total, position) => total + (position.weight / grossExposure) ** 2 * 100,
    0
  );
  const hedgeWeight =
    snapshot.portfolio.cashWeight +
    positions
      .filter((position) => position.asset.beta <= 0.2 || position.asset.factorExposure.rates < -60)
      .reduce((total, position) => total + position.weight, 0);

  return {
    grossExposure: round(grossExposure),
    cashWeight: snapshot.portfolio.cashWeight,
    weightedRisk: round(weightedRisk),
    weightedBeta: round(weightedBeta, 2),
    activeShare: round(activeShare),
    concentrationScore: round(concentrationScore),
    hedgeWeight: round(hedgeWeight),
    sectorExposure: buildExposureBuckets(positions, "sector"),
    categoryExposure: buildExposureBuckets(positions, "category"),
    factorExposure: buildPortfolioFactorExposure(positions, grossExposure),
    topPositions: positions.sort((left, right) => right.weight - left.weight).slice(0, 5)
  };
}

function buildExposureBuckets(
  positions: Array<PortfolioPosition & { asset: MarketAsset; activeWeight: number }>,
  key: "sector" | "category"
): ExposureBucket[] {
  const buckets = new Map<string, ExposureBucket>();

  positions.forEach((position) => {
    const name = position.asset[key];
    const current = buckets.get(name) ?? {
      name,
      weight: 0,
      benchmarkWeight: 0,
      activeWeight: 0
    };

    buckets.set(name, {
      name,
      weight: current.weight + position.weight,
      benchmarkWeight: current.benchmarkWeight + position.benchmarkWeight,
      activeWeight: current.activeWeight + position.activeWeight
    });
  });

  return Array.from(buckets.values())
    .map((bucket) => ({
      ...bucket,
      weight: round(bucket.weight),
      benchmarkWeight: round(bucket.benchmarkWeight),
      activeWeight: round(bucket.activeWeight)
    }))
    .sort((left, right) => right.weight - left.weight);
}

function buildPortfolioFactorExposure(
  positions: Array<PortfolioPosition & { asset: MarketAsset }>,
  grossExposure: number
): MarketAsset["factorExposure"] {
  const factors: Array<keyof MarketAsset["factorExposure"]> = [
    "growth",
    "value",
    "quality",
    "momentum",
    "rates",
    "usd"
  ];

  return factors.reduce(
    (summary, factor) => ({
      ...summary,
      [factor]: round(
        positions.reduce(
          (total, position) =>
            total + position.asset.factorExposure[factor] * (position.weight / grossExposure),
          0
        )
      )
    }),
    {
      growth: 0,
      value: 0,
      quality: 0,
      momentum: 0,
      rates: 0,
      usd: 0
    }
  );
}

export function calculateScenarioImpact(
  snapshot: MarketSnapshot,
  scenario: MarketScenario
): ScenarioImpact {
  const assetMap = createAssetMap(snapshot.assets);
  const rows = snapshot.portfolio.positions
    .map((position) => {
      const asset = assetMap.get(position.symbol);

      if (!asset) {
        return null;
      }

      const impact = scenario.assetImpacts[position.symbol] ?? scenario.impact;
      const contribution = (position.weight * impact) / 100;

      return {
        symbol: position.symbol,
        name: asset.name,
        weight: position.weight,
        impact,
        contribution: round(contribution, 2)
      };
    })
    .filter(
      (
        row
      ): row is {
        symbol: string;
        name: string;
        weight: number;
        impact: number;
        contribution: number;
      } => Boolean(row)
    )
    .sort((left, right) => left.contribution - right.contribution);

  const totalImpact = round(
    rows.reduce((total, row) => total + row.contribution, 0),
    2
  );
  const biggestDrag = rows[0]
    ? { symbol: rows[0].symbol, contribution: rows[0].contribution }
    : undefined;
  const biggestOffset = rows.at(-1)
    ? { symbol: rows.at(-1)!.symbol, contribution: rows.at(-1)!.contribution }
    : undefined;

  return {
    scenario,
    totalImpact,
    stressedValue: round(100 + totalImpact, 2),
    rows,
    biggestDrag,
    biggestOffset
  };
}

export function buildScenarioImpacts(snapshot: MarketSnapshot): ScenarioImpact[] {
  return snapshot.scenarios.map((scenario) => calculateScenarioImpact(snapshot, scenario));
}

export function prioritizeAlerts(alerts: MarketAlert[]): MarketAlert[] {
  return [...alerts].sort((left, right) => {
    const severityDelta = severityRank[right.severity] - severityRank[left.severity];

    if (severityDelta !== 0) {
      return severityDelta;
    }

    return Number(left.acknowledged) - Number(right.acknowledged);
  });
}

export function summarizeResearchQueue(tasks: ResearchTask[]): {
  open: number;
  inReview: number;
  done: number;
  highPriorityOpen: number;
} {
  return {
    open: tasks.filter((task) => task.status !== "Done").length,
    inReview: tasks.filter((task) => task.status === "In review").length,
    done: tasks.filter((task) => task.status === "Done").length,
    highPriorityOpen: tasks.filter((task) => task.priority === "high" && task.status !== "Done")
      .length
  };
}

export function getAssetResearchContext(
  snapshot: MarketSnapshot,
  symbol: string
): { tasks: ResearchTask[]; alerts: MarketAlert[]; events: MarketEvent[] } {
  return {
    tasks: snapshot.researchQueue.filter((task) => task.symbol === symbol),
    alerts: snapshot.alerts.filter((alert) => alert.affectedSymbols.includes(symbol)),
    events: snapshot.events.filter((event) => event.symbols.includes(symbol))
  };
}

export function summarizeLlmBrief(brief: LlmMarketBrief): LlmBriefSummary {
  const totalDecisions = Object.values(brief.actionSummary).reduce(
    (total, count) => total + count,
    0
  );
  const rankedDecisions = [...brief.stockDecisions].sort((left, right) => {
    const rankDelta = decisionRank[right.decision] - decisionRank[left.decision];

    if (rankDelta !== 0) {
      return rankDelta;
    }

    return right.score - left.score;
  });

  return {
    totalDecisions,
    riskActions: brief.stockDecisions.filter((decision) =>
      ["Reduce", "Avoid"].includes(decision.decision)
    ).length,
    highestConviction: rankedDecisions[0],
    defensiveActions: brief.stockDecisions.filter((decision) =>
      ["Reduce", "Avoid"].includes(decision.decision)
    )
  };
}

export function rankLlmDecisions(
  decisions: LlmMarketBrief["stockDecisions"]
): LlmMarketBrief["stockDecisions"] {
  return [...decisions].sort((left, right) => {
    if (right.score !== left.score) {
      return right.score - left.score;
    }

    return decisionRank[right.decision] - decisionRank[left.decision];
  });
}

export function formatPct(value: number): string {
  const prefix = value > 0 ? "+" : "";
  return `${prefix}${value.toFixed(2)}%`;
}

export function formatWeight(value: number): string {
  return `${value.toFixed(1)}%`;
}

export function formatUsdBn(value: number): string {
  if (value >= 1000) {
    return `$${(value / 1000).toFixed(2)}T`;
  }

  return `$${value.toFixed(0)}B`;
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
