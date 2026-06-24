import { z } from "zod";

export const TrendSchema = z.enum(["up", "down", "flat"]);
export const SeveritySchema = z.enum(["low", "medium", "high"]);

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
  category: z.enum(["Equity", "ETF", "Macro", "Crypto"]),
  sector: z.string().min(1),
  price: z.number().positive(),
  changePct: z.number(),
  momentum: z.number().min(0).max(100),
  quality: z.number().min(0).max(100),
  volatility: z.number().min(0).max(100),
  liquidity: z.number().min(0).max(100),
  valuation: z.number().min(0).max(100),
  risk: z.number().min(0).max(100),
  thesis: z.string().min(1),
  catalysts: z.array(z.string().min(1)).min(1),
  watchFlags: z.array(z.string().min(1))
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
  drivers: z.array(z.string().min(1)).min(1),
  actions: z.array(z.string().min(1)).min(1)
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
  alerts: z.array(
    z.object({
      title: z.string().min(1),
      severity: SeveritySchema,
      detail: z.string().min(1)
    })
  )
});

export type MarketSnapshot = z.infer<typeof MarketSnapshotSchema>;
export type MarketAsset = z.infer<typeof AssetSchema>;
export type MarketScenario = z.infer<typeof ScenarioSchema>;
