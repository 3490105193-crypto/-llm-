import type { MarketSnapshot } from "../schemas";

export const seedMarketSnapshot = {
  asOf: "2026-06-24T08:00:00-04:00",
  regime: {
    name: "Selective risk-on",
    score: 68,
    confidence: 74,
    summary: "Breadth is mixed, liquidity is stable, and leadership remains concentrated."
  },
  indices: [
    { symbol: "SPX", name: "S&P 500", level: 6264.4, changePct: 0.42, trend: "up" },
    { symbol: "NDX", name: "Nasdaq 100", level: 22910.6, changePct: 0.71, trend: "up" },
    { symbol: "RUT", name: "Russell 2000", level: 2178.8, changePct: -0.18, trend: "down" },
    { symbol: "VIX", name: "Volatility Index", level: 14.8, changePct: -2.3, trend: "down" },
    { symbol: "DXY", name: "Dollar Index", level: 101.2, changePct: 0.08, trend: "flat" }
  ],
  sectors: [
    { name: "Technology", changePct: 0.92, breadth: 66, momentum: 84 },
    { name: "Industrials", changePct: 0.31, breadth: 58, momentum: 61 },
    { name: "Financials", changePct: 0.17, breadth: 55, momentum: 57 },
    { name: "Energy", changePct: -0.28, breadth: 44, momentum: 46 },
    { name: "Healthcare", changePct: -0.11, breadth: 48, momentum: 49 },
    { name: "Consumer", changePct: 0.08, breadth: 51, momentum: 53 },
    { name: "Utilities", changePct: -0.42, breadth: 39, momentum: 41 },
    { name: "Materials", changePct: 0.22, breadth: 54, momentum: 56 }
  ],
  assets: [
    {
      symbol: "NVDA",
      name: "NVIDIA",
      category: "Equity",
      sector: "Technology",
      price: 142.7,
      changePct: 1.48,
      momentum: 93,
      quality: 88,
      volatility: 64,
      liquidity: 96,
      valuation: 81,
      risk: 58,
      thesis: "AI capex leadership remains the clearest earnings revision engine.",
      catalysts: ["Data center order visibility", "Margin resilience", "Supplier checks"],
      watchFlags: ["Crowded positioning", "Multiple compression"]
    },
    {
      symbol: "MSFT",
      name: "Microsoft",
      category: "Equity",
      sector: "Technology",
      price: 486.2,
      changePct: 0.63,
      momentum: 78,
      quality: 92,
      volatility: 38,
      liquidity: 95,
      valuation: 70,
      risk: 32,
      thesis: "Durable cloud and AI platform exposure with lower factor risk.",
      catalysts: ["Azure acceleration", "Copilot monetization", "Enterprise renewals"],
      watchFlags: ["Capex intensity"]
    },
    {
      symbol: "JPM",
      name: "JPMorgan Chase",
      category: "Equity",
      sector: "Financials",
      price: 248.4,
      changePct: 0.22,
      momentum: 61,
      quality: 84,
      volatility: 34,
      liquidity: 90,
      valuation: 47,
      risk: 28,
      thesis: "High-quality balance sheet exposure if credit stays contained.",
      catalysts: ["Net interest income guide", "Credit normalization", "Capital returns"],
      watchFlags: ["Credit card delinquencies"]
    },
    {
      symbol: "XOM",
      name: "Exxon Mobil",
      category: "Equity",
      sector: "Energy",
      price: 112.1,
      changePct: -0.36,
      momentum: 42,
      quality: 76,
      volatility: 43,
      liquidity: 86,
      valuation: 38,
      risk: 39,
      thesis: "Cash returns are strong, but crude momentum is less supportive.",
      catalysts: ["Refining margins", "Crude inventory draws", "Buyback pace"],
      watchFlags: ["Oil demand softness"]
    },
    {
      symbol: "GLD",
      name: "Gold Trust",
      category: "ETF",
      sector: "Macro",
      price: 218.6,
      changePct: 0.27,
      momentum: 67,
      quality: 63,
      volatility: 31,
      liquidity: 91,
      valuation: 50,
      risk: 25,
      thesis: "Portfolio hedge remains useful while real-rate direction is uncertain.",
      catalysts: ["Central bank demand", "Real yield trend", "Dollar weakness"],
      watchFlags: ["Rate repricing"]
    },
    {
      symbol: "TLT",
      name: "20+ Year Treasury ETF",
      category: "ETF",
      sector: "Macro",
      price: 91.4,
      changePct: -0.14,
      momentum: 36,
      quality: 69,
      volatility: 52,
      liquidity: 89,
      valuation: 55,
      risk: 47,
      thesis: "Duration hedge is cheap but needs clearer disinflation confirmation.",
      catalysts: ["Inflation prints", "Fed guidance", "Term premium"],
      watchFlags: ["Yield breakout"]
    },
    {
      symbol: "BTC",
      name: "Bitcoin",
      category: "Crypto",
      sector: "Digital Assets",
      price: 67450,
      changePct: 1.92,
      momentum: 72,
      quality: 44,
      volatility: 89,
      liquidity: 78,
      valuation: 62,
      risk: 82,
      thesis: "Liquidity-sensitive beta with strong trend but high drawdown risk.",
      catalysts: ["ETF flows", "Dollar liquidity", "Risk appetite"],
      watchFlags: ["Weekend gap risk", "Regulatory headlines"]
    }
  ],
  macroSignals: [
    {
      label: "Liquidity",
      value: "Stable",
      trend: "flat",
      severity: "low",
      summary: "Funding stress indicators remain contained."
    },
    {
      label: "Breadth",
      value: "Narrow",
      trend: "down",
      severity: "medium",
      summary: "Leadership is concentrated in large-cap growth."
    },
    {
      label: "Volatility",
      value: "Compressed",
      trend: "down",
      severity: "medium",
      summary: "Low volatility leaves less cushion for negative surprises."
    },
    {
      label: "Rates",
      value: "Range-bound",
      trend: "flat",
      severity: "medium",
      summary: "Duration assets need confirmation from inflation data."
    }
  ],
  scenarios: [
    {
      id: "base",
      name: "Base case",
      horizon: "2-4 weeks",
      probability: 55,
      impact: 4,
      drivers: ["Earnings revisions stay positive", "Volatility remains contained"],
      actions: ["Keep quality growth exposure", "Pair crowded longs with hedges"]
    },
    {
      id: "upside",
      name: "Upside chase",
      horizon: "1-3 weeks",
      probability: 25,
      impact: 9,
      drivers: ["Breadth expands", "Dollar softens", "Rates drift lower"],
      actions: ["Add cyclicals selectively", "Increase small-cap watchlist exposure"]
    },
    {
      id: "downside",
      name: "Volatility reset",
      horizon: "1-2 weeks",
      probability: 20,
      impact: -8,
      drivers: ["Rates reprice higher", "Mega-cap leadership breaks"],
      actions: ["Cut high-volatility beta", "Increase cash and gold hedge weight"]
    }
  ],
  alerts: [
    {
      title: "Leadership concentration",
      severity: "medium",
      detail: "Technology strength is masking weaker breadth in defensive and small-cap areas."
    },
    {
      title: "Volatility compression",
      severity: "medium",
      detail: "Risk budget should account for faster downside convexity if VIX mean-reverts."
    }
  ]
} satisfies MarketSnapshot;
