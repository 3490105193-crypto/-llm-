import { z } from "zod";

export const TrendSchema = z.enum(["up", "down", "flat"]);
export const SeveritySchema = z.enum(["low", "medium", "high"]);
export const AssetCategorySchema = z.enum([
  "Equity",
  "ETF",
  "Macro",
  "Crypto",
  "Fixed Income",
  "Commodity"
]);
export const RegionSchema = z.enum(["US", "Global", "Europe", "Asia", "Emerging Markets"]);
export const ResearchStatusSchema = z.enum(["Todo", "In review", "Done"]);
export const LlmDecisionSchema = z.enum(["Buy", "Watch", "Hold", "Reduce", "Avoid"]);

export const IndexSchema = z.object({
  symbol: z.string().min(1),
  name: z.string().min(1),
  level: z.number(),
  changePct: z.number(),
  trend: TrendSchema
});

export const SectorSchema = z.object({
  name: z.string().min(1),
  changePct: z.number(),
  breadth: z.number().min(0).max(100),
  momentum: z.number().min(0).max(100)
});

export const AssetSchema = z.object({
  symbol: z.string().min(1),
  name: z.string().min(1),
  category: AssetCategorySchema,
  region: RegionSchema,
  sector: z.string().min(1),
  price: z.number().positive(),
  changePct: z.number(),
  marketCapUsdBn: z.number().nonnegative(),
  momentum: z.number().min(0).max(100),
  quality: z.number().min(0).max(100),
  volatility: z.number().min(0).max(100),
  liquidity: z.number().min(0).max(100),
  valuation: z.number().min(0).max(100),
  risk: z.number().min(0).max(100),
  earningsRevision: z.number().min(-100).max(100),
  sentiment: z.number().min(0).max(100),
  relativeVolume: z.number().positive(),
  beta: z.number().min(-3).max(5),
  factorExposure: z.object({
    growth: z.number().min(-100).max(100),
    value: z.number().min(-100).max(100),
    quality: z.number().min(-100).max(100),
    momentum: z.number().min(-100).max(100),
    rates: z.number().min(-100).max(100),
    usd: z.number().min(-100).max(100)
  }),
  thesis: z.string().min(1),
  catalysts: z.array(z.string().min(1)).min(1),
  watchFlags: z.array(z.string().min(1)),
  decisionChecklist: z.array(z.string().min(1)).min(1)
});

export const MacroSignalSchema = z.object({
  label: z.string().min(1),
  value: z.string().min(1),
  trend: TrendSchema,
  severity: SeveritySchema,
  summary: z.string().min(1)
});

export const ScenarioSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  horizon: z.string().min(1),
  probability: z.number().min(0).max(100),
  impact: z.number().min(-100).max(100),
  assetImpacts: z.record(z.string(), z.number().min(-100).max(100)),
  drivers: z.array(z.string().min(1)).min(1),
  actions: z.array(z.string().min(1)).min(1)
});

export const PortfolioPositionSchema = z.object({
  symbol: z.string().min(1),
  weight: z.number().min(0).max(100),
  benchmarkWeight: z.number().min(0).max(100),
  conviction: z.number().min(0).max(100),
  note: z.string().min(1)
});

export const AlertSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1),
  severity: SeveritySchema,
  category: z.enum(["Price", "Risk", "Macro", "Research", "Event"]),
  affectedSymbols: z.array(z.string().min(1)).min(1),
  trigger: z.string().min(1),
  detail: z.string().min(1),
  suggestedAction: z.string().min(1),
  acknowledged: z.boolean()
});

export const ResearchTaskSchema = z.object({
  id: z.string().min(1),
  symbol: z.string().min(1),
  title: z.string().min(1),
  status: ResearchStatusSchema,
  priority: SeveritySchema,
  due: z.string().min(1),
  owner: z.string().min(1)
});

export const MarketEventSchema = z.object({
  id: z.string().min(1),
  date: z.string().min(1),
  type: z.enum(["Earnings", "Macro", "Policy", "Company", "Flow"]),
  title: z.string().min(1),
  symbols: z.array(z.string().min(1)),
  severity: SeveritySchema
});

export const SavedViewSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  category: AssetCategorySchema.or(z.literal("All")),
  minimumScore: z.number().min(0).max(100),
  maximumRisk: z.number().min(0).max(100),
  minimumQuality: z.number().min(0).max(100)
});

export const LlmMarketBriefSchema = z.object({
  generatedAt: z.string().min(1),
  engine: z.string().min(1),
  model: z.string().min(1),
  sourceSystem: z.string().min(1),
  marketView: z.object({
    stance: z.enum(["Risk-on", "Selective", "Neutral", "Defensive"]),
    confidence: z.number().min(0).max(100),
    summary: z.string().min(1),
    liquidityRead: z.string().min(1),
    breadthRead: z.string().min(1),
    riskBudget: z.string().min(1)
  }),
  actionSummary: z.object({
    buy: z.number().int().nonnegative(),
    watch: z.number().int().nonnegative(),
    hold: z.number().int().nonnegative(),
    reduce: z.number().int().nonnegative(),
    avoid: z.number().int().nonnegative()
  }),
  indexNarrative: z.array(
    z.object({
      symbol: z.string().min(1),
      view: z.string().min(1),
      drivers: z.array(z.string().min(1)).min(1)
    })
  ),
  sectorRotation: z.array(
    z.object({
      sector: z.string().min(1),
      stance: LlmDecisionSchema,
      reason: z.string().min(1)
    })
  ),
  stockDecisions: z.array(
    z.object({
      symbol: z.string().min(1),
      decision: LlmDecisionSchema,
      score: z.number().min(0).max(100),
      timeHorizon: z.string().min(1),
      thesis: z.string().min(1),
      reasons: z.array(z.string().min(1)).min(1),
      risks: z.array(z.string().min(1)).min(1),
      invalidation: z.string().min(1),
      nextCheck: z.string().min(1)
    })
  ),
  riskWarnings: z.array(
    z.object({
      title: z.string().min(1),
      severity: SeveritySchema,
      detail: z.string().min(1),
      action: z.string().min(1)
    })
  ),
  dataQuality: z.object({
    freshness: z.string().min(1),
    missingInputs: z.array(z.string().min(1)),
    confidenceNotes: z.array(z.string().min(1)).min(1)
  })
});

export const MarketSnapshotSchema = z.object({
  asOf: z.string().min(1),
  regime: z.object({
    name: z.string().min(1),
    score: z.number().min(0).max(100),
    confidence: z.number().min(0).max(100),
    summary: z.string().min(1)
  }),
  indices: z.array(IndexSchema).min(1),
  sectors: z.array(SectorSchema).min(1),
  assets: z.array(AssetSchema).min(1),
  macroSignals: z.array(MacroSignalSchema).min(1),
  scenarios: z.array(ScenarioSchema).min(1),
  portfolio: z.object({
    name: z.string().min(1),
    benchmark: z.string().min(1),
    cashWeight: z.number().min(0).max(100),
    positions: z.array(PortfolioPositionSchema).min(1)
  }),
  alerts: z.array(AlertSchema),
  researchQueue: z.array(ResearchTaskSchema),
  events: z.array(MarketEventSchema),
  savedViews: z.array(SavedViewSchema),
  llmBrief: LlmMarketBriefSchema
});

export type MarketSnapshot = z.infer<typeof MarketSnapshotSchema>;
export type MarketAsset = z.infer<typeof AssetSchema>;
export type MarketScenario = z.infer<typeof ScenarioSchema>;
export type PortfolioPosition = z.infer<typeof PortfolioPositionSchema>;
export type MarketAlert = z.infer<typeof AlertSchema>;
export type ResearchTask = z.infer<typeof ResearchTaskSchema>;
export type MarketEvent = z.infer<typeof MarketEventSchema>;
export type SavedView = z.infer<typeof SavedViewSchema>;
export type LlmMarketBrief = z.infer<typeof LlmMarketBriefSchema>;
export type LlmDecision = z.infer<typeof LlmDecisionSchema>;
