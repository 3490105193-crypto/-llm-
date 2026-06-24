import { describe, expect, it } from "vitest";
import {
  calculateMarketHealth,
  calculateOpportunityScore,
  calculatePortfolioRisk,
  calculateScenarioImpact,
  choosePrimaryScenario,
  prioritizeAlerts,
  rankLlmDecisions,
  rankAssets,
  summarizeLlmBrief
} from "./analysis";
import { loadMarketSnapshot } from "./data/load-market-snapshot";

describe("market analysis", () => {
  const snapshot = loadMarketSnapshot();

  it("ranks assets by risk-adjusted opportunity", () => {
    const assets = rankAssets(snapshot);

    expect(assets[0]?.symbol).toBe("MSFT");
    expect(assets.every((asset) => asset.opportunityScore >= asset.riskAdjustedScore)).toBe(true);
  });

  it("filters assets by query and category", () => {
    const assets = rankAssets(snapshot, { query: "macro", category: "ETF" });

    expect(assets.map((asset) => asset.symbol)).toEqual(["GLD"]);
    expect(rankAssets(snapshot, { category: "Fixed Income" }).map((asset) => asset.symbol)).toEqual(
      ["TLT"]
    );
  });

  it("calculates bounded market health", () => {
    const health = calculateMarketHealth(snapshot);

    expect(health).toBeGreaterThanOrEqual(0);
    expect(health).toBeLessThanOrEqual(100);
  });

  it("keeps high risk assets from dominating adjusted rank", () => {
    const bitcoin = snapshot.assets.find((asset) => asset.symbol === "BTC");

    expect(bitcoin).toBeDefined();
    expect(calculateOpportunityScore(bitcoin!)).toBeGreaterThan(50);
    expect(rankAssets(snapshot)[0]?.symbol).not.toBe("BTC");
  });

  it("selects the highest probability scenario", () => {
    const scenario = choosePrimaryScenario(snapshot.scenarios);

    expect(scenario.id).toBe("base");
  });

  it("summarizes portfolio risk from validated positions", () => {
    const summary = calculatePortfolioRisk(snapshot);

    expect(summary.grossExposure).toBe(84.5);
    expect(summary.weightedRisk).toBeGreaterThan(0);
    expect(summary.weightedRisk).toBeLessThanOrEqual(100);
    expect(summary.hedgeWeight).toBeGreaterThan(snapshot.portfolio.cashWeight);
    expect(summary.topPositions[0]?.symbol).toBe("MSFT");
  });

  it("calculates scenario stress contribution by position weight", () => {
    const scenario = snapshot.scenarios.find((item) => item.id === "vol-reset");

    expect(scenario).toBeDefined();

    const impact = calculateScenarioImpact(snapshot, scenario!);

    expect(impact.totalImpact).toBeLessThan(0);
    expect(impact.biggestDrag?.symbol).toBe("NVDA");
    expect(impact.biggestOffset?.symbol).toBe("GLD");
  });

  it("prioritizes high severity alerts before acknowledged items", () => {
    const alerts = prioritizeAlerts(snapshot.alerts);

    expect(alerts[0]?.id).toBe("alert-unh");
    expect(alerts.at(-1)?.acknowledged).toBe(true);
  });

  it("summarizes LLM market brief decisions", () => {
    const summary = summarizeLlmBrief(snapshot.llmBrief);

    expect(summary.totalDecisions).toBe(12);
    expect(summary.riskActions).toBe(2);
    expect(summary.highestConviction?.symbol).toBe("MSFT");
  });

  it("ranks LLM decisions by score", () => {
    const decisions = rankLlmDecisions(snapshot.llmBrief.stockDecisions);

    expect(decisions[0]?.symbol).toBe("MSFT");
    expect(decisions.at(-1)?.decision).toBe("Reduce");
  });
});
