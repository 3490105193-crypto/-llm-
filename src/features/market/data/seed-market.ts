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
    { name: "Materials", changePct: 0.22, breadth: 54, momentum: 56 },
    { name: "Credit", changePct: 0.05, breadth: 52, momentum: 48 },
    { name: "Digital Assets", changePct: 1.18, breadth: 57, momentum: 68 }
  ],
  assets: [
    {
      symbol: "NVDA",
      name: "NVIDIA",
      category: "Equity",
      region: "US",
      sector: "Technology",
      price: 142.7,
      changePct: 1.48,
      marketCapUsdBn: 3508,
      momentum: 93,
      quality: 88,
      volatility: 64,
      liquidity: 96,
      valuation: 81,
      risk: 58,
      earningsRevision: 64,
      sentiment: 82,
      relativeVolume: 1.24,
      beta: 1.78,
      factorExposure: { growth: 93, value: -38, quality: 71, momentum: 89, rates: -32, usd: -12 },
      thesis: "AI capex leadership remains the clearest earnings revision engine.",
      catalysts: ["Data center order visibility", "Margin resilience", "Supplier checks"],
      watchFlags: ["Crowded positioning", "Multiple compression"],
      decisionChecklist: [
        "Confirm backlog durability",
        "Track gross margin mix",
        "Size around drawdown risk"
      ]
    },
    {
      symbol: "MSFT",
      name: "Microsoft",
      category: "Equity",
      region: "US",
      sector: "Technology",
      price: 486.2,
      changePct: 0.63,
      marketCapUsdBn: 3614,
      momentum: 78,
      quality: 92,
      volatility: 38,
      liquidity: 95,
      valuation: 70,
      risk: 32,
      earningsRevision: 43,
      sentiment: 78,
      relativeVolume: 0.94,
      beta: 1.02,
      factorExposure: { growth: 76, value: -18, quality: 91, momentum: 64, rates: -21, usd: -9 },
      thesis: "Durable cloud and AI platform exposure with lower factor risk.",
      catalysts: ["Azure acceleration", "Copilot monetization", "Enterprise renewals"],
      watchFlags: ["Capex intensity"],
      decisionChecklist: [
        "Monitor Azure share",
        "Validate operating leverage",
        "Compare AI revenue conversion"
      ]
    },
    {
      symbol: "AVGO",
      name: "Broadcom",
      category: "Equity",
      region: "US",
      sector: "Technology",
      price: 184.1,
      changePct: 1.06,
      marketCapUsdBn: 862,
      momentum: 87,
      quality: 84,
      volatility: 55,
      liquidity: 89,
      valuation: 76,
      risk: 47,
      earningsRevision: 52,
      sentiment: 79,
      relativeVolume: 1.18,
      beta: 1.42,
      factorExposure: { growth: 81, value: -24, quality: 77, momentum: 79, rates: -26, usd: -14 },
      thesis: "Custom silicon and infrastructure software support durable earnings breadth.",
      catalysts: ["AI networking demand", "VMware margin capture", "Hyperscaler order cycle"],
      watchFlags: ["Integration execution", "Semiconductor beta"],
      decisionChecklist: [
        "Separate chip and software drivers",
        "Watch inventory commentary",
        "Confirm cash conversion"
      ]
    },
    {
      symbol: "AAPL",
      name: "Apple",
      category: "Equity",
      region: "US",
      sector: "Technology",
      price: 211.4,
      changePct: -0.21,
      marketCapUsdBn: 3240,
      momentum: 48,
      quality: 86,
      volatility: 31,
      liquidity: 96,
      valuation: 72,
      risk: 34,
      earningsRevision: -9,
      sentiment: 57,
      relativeVolume: 0.86,
      beta: 0.92,
      factorExposure: { growth: 51, value: -16, quality: 87, momentum: 22, rates: -14, usd: -18 },
      thesis: "High-quality cash compounder, but product-cycle evidence is still uneven.",
      catalysts: ["Services growth", "Device replacement cycle", "AI feature adoption"],
      watchFlags: ["China demand", "Upgrade-cycle timing"],
      decisionChecklist: [
        "Check channel inventory",
        "Measure services mix",
        "Avoid adding before revision turn"
      ]
    },
    {
      symbol: "JPM",
      name: "JPMorgan Chase",
      category: "Equity",
      region: "US",
      sector: "Financials",
      price: 248.4,
      changePct: 0.22,
      marketCapUsdBn: 689,
      momentum: 61,
      quality: 84,
      volatility: 34,
      liquidity: 90,
      valuation: 47,
      risk: 28,
      earningsRevision: 21,
      sentiment: 66,
      relativeVolume: 0.98,
      beta: 1.08,
      factorExposure: { growth: 5, value: 52, quality: 76, momentum: 38, rates: 34, usd: 8 },
      thesis: "High-quality balance sheet exposure if credit stays contained.",
      catalysts: ["Net interest income guide", "Credit normalization", "Capital returns"],
      watchFlags: ["Credit card delinquencies"],
      decisionChecklist: [
        "Check reserve build",
        "Watch deposit beta",
        "Compare capital return assumptions"
      ]
    },
    {
      symbol: "CAT",
      name: "Caterpillar",
      category: "Equity",
      region: "US",
      sector: "Industrials",
      price: 341.9,
      changePct: 0.34,
      marketCapUsdBn: 165,
      momentum: 55,
      quality: 74,
      volatility: 41,
      liquidity: 82,
      valuation: 49,
      risk: 37,
      earningsRevision: 12,
      sentiment: 61,
      relativeVolume: 0.91,
      beta: 1.21,
      factorExposure: { growth: 14, value: 41, quality: 58, momentum: 36, rates: 18, usd: -7 },
      thesis: "Cyclical exposure is useful if breadth expands beyond megacap growth.",
      catalysts: ["Dealer inventory", "Infrastructure orders", "Mining capex"],
      watchFlags: ["China demand", "Margin normalization"],
      decisionChecklist: [
        "Validate order backlog",
        "Check channel inventory",
        "Pair with lower beta exposure"
      ]
    },
    {
      symbol: "UNH",
      name: "UnitedHealth Group",
      category: "Equity",
      region: "US",
      sector: "Healthcare",
      price: 316.8,
      changePct: -0.62,
      marketCapUsdBn: 292,
      momentum: 28,
      quality: 69,
      volatility: 58,
      liquidity: 87,
      valuation: 36,
      risk: 61,
      earningsRevision: -44,
      sentiment: 31,
      relativeVolume: 1.31,
      beta: 0.71,
      factorExposure: { growth: -5, value: 36, quality: 51, momentum: -38, rates: -3, usd: 2 },
      thesis:
        "Valuation reset is visible, but revision risk and policy uncertainty remain unresolved.",
      catalysts: ["Utilization trend", "Medicare Advantage commentary", "Policy headlines"],
      watchFlags: ["Guidance credibility", "Regulatory pressure"],
      decisionChecklist: [
        "Wait for revision floor",
        "Stress margin assumptions",
        "Track policy calendar"
      ]
    },
    {
      symbol: "XOM",
      name: "Exxon Mobil",
      category: "Equity",
      region: "US",
      sector: "Energy",
      price: 112.1,
      changePct: -0.36,
      marketCapUsdBn: 486,
      momentum: 42,
      quality: 76,
      volatility: 43,
      liquidity: 86,
      valuation: 38,
      risk: 39,
      earningsRevision: -6,
      sentiment: 52,
      relativeVolume: 0.88,
      beta: 0.86,
      factorExposure: { growth: -18, value: 58, quality: 63, momentum: -7, rates: 8, usd: 24 },
      thesis: "Cash returns are strong, but crude momentum is less supportive.",
      catalysts: ["Refining margins", "Crude inventory draws", "Buyback pace"],
      watchFlags: ["Oil demand softness"],
      decisionChecklist: [
        "Track crude curve",
        "Review production guide",
        "Use as inflation hedge only when trend improves"
      ]
    },
    {
      symbol: "GLD",
      name: "Gold Trust",
      category: "ETF",
      region: "Global",
      sector: "Macro",
      price: 218.6,
      changePct: 0.27,
      marketCapUsdBn: 61,
      momentum: 67,
      quality: 63,
      volatility: 31,
      liquidity: 91,
      valuation: 50,
      risk: 25,
      earningsRevision: 0,
      sentiment: 68,
      relativeVolume: 1.05,
      beta: 0.12,
      factorExposure: { growth: -20, value: 12, quality: 36, momentum: 54, rates: -72, usd: -66 },
      thesis: "Portfolio hedge remains useful while real-rate direction is uncertain.",
      catalysts: ["Central bank demand", "Real yield trend", "Dollar weakness"],
      watchFlags: ["Rate repricing"],
      decisionChecklist: [
        "Size as hedge",
        "Watch real yields",
        "Avoid chasing after dollar reversal"
      ]
    },
    {
      symbol: "TLT",
      name: "20+ Year Treasury ETF",
      category: "Fixed Income",
      region: "US",
      sector: "Credit",
      price: 91.4,
      changePct: -0.14,
      marketCapUsdBn: 49,
      momentum: 36,
      quality: 69,
      volatility: 52,
      liquidity: 89,
      valuation: 55,
      risk: 47,
      earningsRevision: 0,
      sentiment: 44,
      relativeVolume: 0.97,
      beta: -0.22,
      factorExposure: { growth: -44, value: 14, quality: 46, momentum: -22, rates: -95, usd: -11 },
      thesis: "Duration hedge is cheap but needs clearer disinflation confirmation.",
      catalysts: ["Inflation prints", "Fed guidance", "Term premium"],
      watchFlags: ["Yield breakout"],
      decisionChecklist: [
        "Do not average into yield breakout",
        "Pair with cash",
        "Review CPI sensitivity"
      ]
    },
    {
      symbol: "EEM",
      name: "Emerging Markets ETF",
      category: "ETF",
      region: "Emerging Markets",
      sector: "Global Equity",
      price: 43.8,
      changePct: 0.18,
      marketCapUsdBn: 19,
      momentum: 53,
      quality: 49,
      volatility: 46,
      liquidity: 84,
      valuation: 34,
      risk: 52,
      earningsRevision: 8,
      sentiment: 55,
      relativeVolume: 0.93,
      beta: 1.09,
      factorExposure: { growth: 25, value: 48, quality: 23, momentum: 18, rates: 12, usd: -63 },
      thesis: "Valuation support is real, but dollar and China sensitivity cap conviction.",
      catalysts: ["Dollar trend", "China policy support", "Global PMI breadth"],
      watchFlags: ["Currency pressure", "Policy disappointment"],
      decisionChecklist: [
        "Tie sizing to dollar trend",
        "Confirm earnings breadth",
        "Use stop around FX stress"
      ]
    },
    {
      symbol: "BTC",
      name: "Bitcoin",
      category: "Crypto",
      region: "Global",
      sector: "Digital Assets",
      price: 67450,
      changePct: 1.92,
      marketCapUsdBn: 1327,
      momentum: 72,
      quality: 44,
      volatility: 89,
      liquidity: 78,
      valuation: 62,
      risk: 82,
      earningsRevision: 0,
      sentiment: 73,
      relativeVolume: 1.4,
      beta: 2.34,
      factorExposure: { growth: 62, value: -54, quality: -35, momentum: 72, rates: -18, usd: -46 },
      thesis: "Liquidity-sensitive beta with strong trend but high drawdown risk.",
      catalysts: ["ETF flows", "Dollar liquidity", "Risk appetite"],
      watchFlags: ["Weekend gap risk", "Regulatory headlines"],
      decisionChecklist: [
        "Hard cap position size",
        "Watch ETF flows",
        "Avoid adding into volatility spike"
      ]
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
    },
    {
      label: "Dollar",
      value: "Firm",
      trend: "up",
      severity: "medium",
      summary: "A firmer dollar is the main constraint on emerging markets and crypto beta."
    }
  ],
  scenarios: [
    {
      id: "base",
      name: "Base case",
      horizon: "2-4 weeks",
      probability: 48,
      impact: 4,
      assetImpacts: {
        NVDA: 7,
        MSFT: 4,
        AVGO: 6,
        AAPL: 2,
        JPM: 3,
        CAT: 2,
        UNH: -2,
        XOM: 0,
        GLD: 1,
        TLT: -1,
        EEM: 2,
        BTC: 5
      },
      drivers: ["Earnings revisions stay positive", "Volatility remains contained"],
      actions: ["Keep quality growth exposure", "Pair crowded longs with hedges"]
    },
    {
      id: "breadth-expansion",
      name: "Breadth expansion",
      horizon: "1-3 weeks",
      probability: 24,
      impact: 8,
      assetImpacts: {
        NVDA: 4,
        MSFT: 3,
        AVGO: 5,
        AAPL: 2,
        JPM: 6,
        CAT: 8,
        UNH: 2,
        XOM: 4,
        GLD: -2,
        TLT: -3,
        EEM: 7,
        BTC: 6
      },
      drivers: ["Cyclicals participate", "Dollar softens", "Rates drift lower"],
      actions: ["Add cyclicals selectively", "Increase small-cap and EM watchlist exposure"]
    },
    {
      id: "rates-shock",
      name: "Rates shock",
      horizon: "3-10 days",
      probability: 16,
      impact: -6,
      assetImpacts: {
        NVDA: -9,
        MSFT: -5,
        AVGO: -8,
        AAPL: -4,
        JPM: 1,
        CAT: -3,
        UNH: -2,
        XOM: 2,
        GLD: -4,
        TLT: -10,
        EEM: -6,
        BTC: -12
      },
      drivers: ["Inflation surprise", "Term premium widens", "Dollar firms"],
      actions: ["Reduce duration and high-multiple beta", "Keep cash available for dislocation"]
    },
    {
      id: "vol-reset",
      name: "Volatility reset",
      horizon: "1-2 weeks",
      probability: 12,
      impact: -10,
      assetImpacts: {
        NVDA: -13,
        MSFT: -7,
        AVGO: -10,
        AAPL: -6,
        JPM: -5,
        CAT: -7,
        UNH: -4,
        XOM: -3,
        GLD: 5,
        TLT: 4,
        EEM: -9,
        BTC: -18
      },
      drivers: ["Mega-cap leadership breaks", "Volatility mean-reverts", "Credit spreads widen"],
      actions: ["Cut high-volatility beta", "Increase cash, gold, and duration hedge weight"]
    }
  ],
  portfolio: {
    name: "Core growth with macro hedge",
    benchmark: "60% SPX / 20% NDX / 10% T-bills / 10% Gold",
    cashWeight: 15.5,
    positions: [
      {
        symbol: "MSFT",
        weight: 14,
        benchmarkWeight: 7.2,
        conviction: 86,
        note: "Anchor quality compounder"
      },
      {
        symbol: "NVDA",
        weight: 12,
        benchmarkWeight: 6.8,
        conviction: 82,
        note: "AI revision leader"
      },
      {
        symbol: "AVGO",
        weight: 8.5,
        benchmarkWeight: 2.1,
        conviction: 78,
        note: "AI infrastructure breadth"
      },
      {
        symbol: "JPM",
        weight: 8,
        benchmarkWeight: 1.5,
        conviction: 74,
        note: "Quality financial ballast"
      },
      {
        symbol: "AAPL",
        weight: 7,
        benchmarkWeight: 6,
        conviction: 55,
        note: "Hold pending product cycle proof"
      },
      { symbol: "GLD", weight: 7, benchmarkWeight: 10, conviction: 71, note: "Real-rate hedge" },
      {
        symbol: "TLT",
        weight: 6,
        benchmarkWeight: 5,
        conviction: 47,
        note: "Small duration hedge only"
      },
      {
        symbol: "CAT",
        weight: 5,
        benchmarkWeight: 0.4,
        conviction: 59,
        note: "Breadth expansion option"
      },
      {
        symbol: "XOM",
        weight: 5,
        benchmarkWeight: 3.8,
        conviction: 52,
        note: "Inflation hedge and cash return"
      },
      {
        symbol: "UNH",
        weight: 4.5,
        benchmarkWeight: 1,
        conviction: 34,
        note: "Turnaround watch, not add"
      },
      {
        symbol: "EEM",
        weight: 4.5,
        benchmarkWeight: 0,
        conviction: 50,
        note: "Dollar-sensitive value option"
      },
      {
        symbol: "BTC",
        weight: 3,
        benchmarkWeight: 0,
        conviction: 44,
        note: "Strictly capped liquid beta"
      }
    ]
  },
  alerts: [
    {
      id: "alert-concentration",
      title: "Leadership concentration",
      severity: "medium",
      category: "Risk",
      affectedSymbols: ["NVDA", "MSFT", "AVGO"],
      trigger: "Top three active positions contribute more than 38% of portfolio beta.",
      detail: "Technology strength is masking weaker breadth in defensive and small-cap areas.",
      suggestedAction: "Keep exposure, but pair new adds with GLD, cash, or lower-beta financials.",
      acknowledged: false
    },
    {
      id: "alert-vol",
      title: "Volatility compression",
      severity: "medium",
      category: "Macro",
      affectedSymbols: ["BTC", "NVDA", "AVGO"],
      trigger: "VIX remains below 15 while high-beta assets lead.",
      detail:
        "Risk budget should account for faster downside convexity if volatility mean-reverts.",
      suggestedAction: "Recheck stop levels and do not increase BTC above capped weight.",
      acknowledged: false
    },
    {
      id: "alert-unh",
      title: "Revision risk unresolved",
      severity: "high",
      category: "Research",
      affectedSymbols: ["UNH"],
      trigger: "Earnings revision score below -40 with above-average event risk.",
      detail: "The valuation reset is not enough without a clearer margin and utilization floor.",
      suggestedAction:
        "Move UNH to review, freeze adds, and require evidence before raising weight.",
      acknowledged: false
    },
    {
      id: "alert-dollar",
      title: "Dollar pressure",
      severity: "medium",
      category: "Macro",
      affectedSymbols: ["EEM", "BTC", "GLD"],
      trigger: "Dollar signal is firm while EM and crypto beta remain long.",
      detail: "A stronger dollar can compress global risk appetite and pressure non-US exposures.",
      suggestedAction: "Tie any EM add to dollar weakness confirmation.",
      acknowledged: true
    }
  ],
  researchQueue: [
    {
      id: "research-nvda-supply",
      symbol: "NVDA",
      title: "Validate data center supply chain checks",
      status: "In review",
      priority: "high",
      due: "2026-06-26",
      owner: "AI Analyst"
    },
    {
      id: "research-msft-azure",
      symbol: "MSFT",
      title: "Compare Azure growth assumptions versus consensus",
      status: "Todo",
      priority: "medium",
      due: "2026-06-27",
      owner: "AI Analyst"
    },
    {
      id: "research-unh-revisions",
      symbol: "UNH",
      title: "Build revision floor checklist",
      status: "Todo",
      priority: "high",
      due: "2026-06-25",
      owner: "PM"
    },
    {
      id: "research-tlt-cpi",
      symbol: "TLT",
      title: "Stress duration sleeve against CPI surprise",
      status: "In review",
      priority: "medium",
      due: "2026-06-28",
      owner: "Risk"
    },
    {
      id: "research-eem-dollar",
      symbol: "EEM",
      title: "Map EM sensitivity to dollar trend",
      status: "Todo",
      priority: "medium",
      due: "2026-07-01",
      owner: "AI Analyst"
    },
    {
      id: "research-jpm-credit",
      symbol: "JPM",
      title: "Review credit card delinquency trend",
      status: "Done",
      priority: "low",
      due: "2026-06-23",
      owner: "PM"
    }
  ],
  events: [
    {
      id: "event-pce",
      date: "2026-06-26",
      type: "Macro",
      title: "Core PCE inflation",
      symbols: ["TLT", "GLD", "NVDA", "BTC"],
      severity: "high"
    },
    {
      id: "event-msft",
      date: "2026-07-02",
      type: "Company",
      title: "Microsoft partner channel checks",
      symbols: ["MSFT"],
      severity: "medium"
    },
    {
      id: "event-nvda",
      date: "2026-07-08",
      type: "Company",
      title: "AI server supply survey",
      symbols: ["NVDA", "AVGO"],
      severity: "high"
    },
    {
      id: "event-bank",
      date: "2026-07-12",
      type: "Earnings",
      title: "Large-bank earnings window",
      symbols: ["JPM"],
      severity: "medium"
    },
    {
      id: "event-fed",
      date: "2026-07-29",
      type: "Policy",
      title: "FOMC decision",
      symbols: ["TLT", "GLD", "EEM", "BTC"],
      severity: "high"
    }
  ],
  savedViews: [
    {
      id: "view-quality-growth",
      name: "Quality growth",
      category: "Equity",
      minimumScore: 65,
      maximumRisk: 65,
      minimumQuality: 75
    },
    {
      id: "view-hedges",
      name: "Hedges",
      category: "All",
      minimumScore: 40,
      maximumRisk: 50,
      minimumQuality: 45
    },
    {
      id: "view-high-conviction",
      name: "High conviction",
      category: "All",
      minimumScore: 68,
      maximumRisk: 60,
      minimumQuality: 70
    },
    {
      id: "view-dislocation",
      name: "Dislocation watch",
      category: "All",
      minimumScore: 25,
      maximumRisk: 85,
      minimumQuality: 30
    }
  ],
  llmBrief: {
    generatedAt: "2026-06-24T08:15:00-04:00",
    engine: "daily_stock_analysis-compatible",
    model: "LLM market reasoning pipeline",
    sourceSystem: "3490105193-crypto/daily_stock_analysis",
    marketView: {
      stance: "Selective",
      confidence: 72,
      summary:
        "The LLM read is constructive but not broad enough for blanket beta exposure. AI infrastructure remains the strongest earnings revision pocket, while healthcare and duration need confirmation before adding risk.",
      liquidityRead:
        "Liquidity conditions are supportive enough for quality growth but not strong enough to ignore volatility compression.",
      breadthRead:
        "Breadth is still narrow. Cyclical participation would be the confirmation signal for a stronger risk-on stance.",
      riskBudget:
        "Keep gross exposure below the current cap, preserve cash, and fund any new high-beta add with a trim from weaker revision names."
    },
    actionSummary: {
      buy: 2,
      watch: 5,
      hold: 3,
      reduce: 1,
      avoid: 1
    },
    indexNarrative: [
      {
        symbol: "SPX",
        view: "Supported by earnings revisions, but vulnerable to leadership concentration.",
        drivers: ["Large-cap quality", "Stable liquidity", "Compressed volatility"]
      },
      {
        symbol: "NDX",
        view: "Still the leadership index, but position sizing matters more than direction.",
        drivers: ["AI capex", "Cloud platform durability", "High multiple sensitivity"]
      },
      {
        symbol: "RUT",
        view: "Needs breadth expansion and lower real-rate pressure before leadership improves.",
        drivers: ["Credit conditions", "Rate path", "Domestic cyclicals"]
      },
      {
        symbol: "DXY",
        view: "A firm dollar remains the main constraint on EM, crypto beta, and gold upside.",
        drivers: ["Rate differential", "Safe-haven demand", "Global growth divergence"]
      }
    ],
    sectorRotation: [
      {
        sector: "Technology",
        stance: "Hold",
        reason: "Leadership is intact, but concentration and valuation argue for disciplined adds."
      },
      {
        sector: "Industrials",
        stance: "Watch",
        reason: "Useful breadth confirmation candidate if PMIs and order commentary improve."
      },
      {
        sector: "Financials",
        stance: "Hold",
        reason: "Quality banks can balance growth exposure while credit risk remains contained."
      },
      {
        sector: "Healthcare",
        stance: "Reduce",
        reason: "Revision pressure is not yet resolved and policy risk is elevated."
      },
      {
        sector: "Macro",
        stance: "Watch",
        reason: "Gold and duration are hedge tools, but rates and dollar direction still dominate."
      }
    ],
    stockDecisions: [
      {
        symbol: "MSFT",
        decision: "Buy",
        score: 84,
        timeHorizon: "4-8 weeks",
        thesis:
          "Best balance of quality, AI monetization, and lower factor risk among mega-cap growth.",
        reasons: [
          "High quality score",
          "Cloud durability",
          "Lower volatility than AI hardware peers"
        ],
        risks: ["Capex intensity", "Consensus expectations already firm"],
        invalidation: "Azure growth decelerates while AI capex pressure rises.",
        nextCheck: "Enterprise renewal and Azure channel checks"
      },
      {
        symbol: "AVGO",
        decision: "Buy",
        score: 79,
        timeHorizon: "3-6 weeks",
        thesis:
          "AI infrastructure breadth and software margin capture create a cleaner second-line AI setup.",
        reasons: [
          "Positive revisions",
          "Custom silicon demand",
          "Infrastructure software margin story"
        ],
        risks: ["Integration execution", "Semiconductor beta"],
        invalidation: "AI networking order checks weaken or VMware margin capture stalls.",
        nextCheck: "Hyperscaler order cycle and VMware margin update"
      },
      {
        symbol: "NVDA",
        decision: "Hold",
        score: 77,
        timeHorizon: "2-6 weeks",
        thesis:
          "Fundamental leadership is still strongest, but crowding and valuation make sizing the main risk.",
        reasons: ["Best momentum", "Strong revisions", "Clear AI capex leadership"],
        risks: ["Crowded positioning", "Multiple compression", "Volatility shock"],
        invalidation: "Gross margin or backlog commentary weakens.",
        nextCheck: "Supply chain checks and data center order visibility"
      },
      {
        symbol: "JPM",
        decision: "Hold",
        score: 70,
        timeHorizon: "4-8 weeks",
        thesis: "Quality financial exposure balances high-growth factor concentration.",
        reasons: ["Balance sheet quality", "Capital return potential", "Moderate valuation"],
        risks: ["Credit card delinquencies", "Deposit beta"],
        invalidation: "Credit normalization accelerates beyond reserve assumptions.",
        nextCheck: "Large-bank earnings and delinquency trend"
      },
      {
        symbol: "UNH",
        decision: "Reduce",
        score: 39,
        timeHorizon: "1-4 weeks",
        thesis: "Valuation reset is not enough while revisions and policy risk remain unresolved.",
        reasons: ["Negative revisions", "Elevated event risk", "Weak sentiment"],
        risks: ["Guidance credibility", "Regulatory headlines", "Utilization pressure"],
        invalidation: "Revision floor and margin recovery become visible.",
        nextCheck: "Medicare Advantage utilization commentary"
      },
      {
        symbol: "BTC",
        decision: "Avoid",
        score: 44,
        timeHorizon: "1-3 weeks",
        thesis:
          "Trend is positive, but volatility and dollar sensitivity are too high for incremental risk.",
        reasons: ["High drawdown risk", "Dollar pressure", "Already capped portfolio exposure"],
        risks: ["Weekend gap risk", "ETF flow reversal", "Regulatory headlines"],
        invalidation: "Dollar weakens and volatility normalizes with sustained ETF inflows.",
        nextCheck: "ETF flows and dollar liquidity"
      }
    ],
    riskWarnings: [
      {
        title: "Do not confuse narrow leadership with durable breadth",
        severity: "medium",
        detail: "A few AI infrastructure names are carrying most of the positive signal.",
        action: "Require breadth confirmation before raising gross exposure."
      },
      {
        title: "Volatility compression makes stops more important",
        severity: "medium",
        detail: "Low volatility can reverse quickly when positioning is crowded.",
        action: "Use scenario stress before adding high-beta positions."
      },
      {
        title: "Healthcare revision floor is still missing",
        severity: "high",
        detail: "The LLM read aligns with the quantitative alert on UNH revision risk.",
        action: "Freeze adds and keep the name in active review."
      }
    ],
    dataQuality: {
      freshness: "Validated sample snapshot; not a live market feed.",
      missingInputs: [
        "Real-time quotes",
        "Broker positions",
        "News provider feed",
        "LLM API trace"
      ],
      confidenceNotes: [
        "LLM conclusions are constrained to the provided market snapshot.",
        "Recommendations are research workflow labels, not investment advice.",
        "External Python engine should run server-side when live keys or paid data are introduced."
      ]
    }
  }
} satisfies MarketSnapshot;
