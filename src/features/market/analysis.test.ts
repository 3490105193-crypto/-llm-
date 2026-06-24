import { describe, expect, it } from "vitest";
import {
  calculateMarketHealth,
  calculateOpportunityScore,
  choosePrimaryScenario,
  rankAssets
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

    expect(assets.map((asset) => asset.symbol)).toEqual(["GLD", "TLT"]);
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
});
