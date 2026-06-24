// @vitest-environment node

import { describe, expect, it } from "vitest";
import { buildBriefFromDsaStatus, normalizeDsaTaskStatus } from "./live-llm-server.mjs";

describe("live LLM server adapter", () => {
  it("maps a completed daily_stock_analysis market review into a Market Lens brief", () => {
    const brief = buildBriefFromDsaStatus({
      task_id: "dsa-task-123456",
      status: "completed",
      progress: 100,
      market_review_report:
        "Liquidity improved while risk remains moderate. Breadth expanded across large caps.",
      market_review_payload: {
        generated_at: "2026-06-25T01:15:00.000Z",
        indices: [
          {
            code: "SH000001",
            name: "SSE Composite",
            current: "3040",
            change_pct: 1.24
          }
        ],
        breadth: {
          up_count: 3100,
          down_count: 1200,
          limit_up_count: 64,
          limit_down_count: 8
        },
        sectors: {
          top: [{ name: "AI Infrastructure", change_pct: 2.7 }],
          bottom: [{ name: "Coal", change_pct: -1.1 }]
        }
      }
    });

    expect(brief.engine).toBe("daily_stock_analysis live");
    expect(brief.marketView.stance).toBe("Risk-on");
    expect(brief.indexNarrative[0]).toMatchObject({
      symbol: "SH000001"
    });
    expect(brief.sectorRotation).toHaveLength(2);
    expect(brief.dataQuality.missingInputs).toEqual([]);
  });

  it("normalizes DSA terminal status names", () => {
    expect(normalizeDsaTaskStatus("cancel_requested")).toBe("cancel_requested");
    expect(normalizeDsaTaskStatus("cancel_request")).toBe("cancel_requested");
    expect(normalizeDsaTaskStatus("unexpected")).toBe("unknown");
  });
});
