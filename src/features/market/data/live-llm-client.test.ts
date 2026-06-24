import { afterEach, describe, expect, it, vi } from "vitest";
import { loadMarketSnapshot } from "./load-market-snapshot";
import { getLiveMarketBriefStatus, startLiveMarketBrief } from "./live-llm-client";

describe("live LLM client", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("starts a live market brief task", async () => {
    const fetchMock = vi.fn().mockResolvedValue(
      new Response(
        JSON.stringify({
          status: "accepted",
          taskId: "task-123456",
          message: "accepted"
        }),
        { status: 202, headers: { "content-type": "application/json" } }
      )
    );
    vi.stubGlobal("fetch", fetchMock);

    const accepted = await startLiveMarketBrief();

    expect(accepted.taskId).toBe("task-123456");
    expect(fetchMock).toHaveBeenCalledWith(
      "http://127.0.0.1:8787/api/live-llm/market-brief",
      expect.objectContaining({ method: "POST" })
    );
  });

  it("validates completed live market brief payloads", async () => {
    const snapshot = loadMarketSnapshot();
    const fetchMock = vi.fn().mockResolvedValue(
      new Response(
        JSON.stringify({
          status: "completed",
          taskId: "task-123456",
          progress: 100,
          brief: snapshot.llmBrief
        }),
        { status: 200, headers: { "content-type": "application/json" } }
      )
    );
    vi.stubGlobal("fetch", fetchMock);

    const status = await getLiveMarketBriefStatus("task-123456");

    expect(status.status).toBe("completed");
    if (status.status === "completed") {
      expect(status.brief.sourceSystem).toBe(snapshot.llmBrief.sourceSystem);
    }
  });

  it("returns DSA cancel_requested as a terminal live status", async () => {
    const fetchMock = vi.fn().mockResolvedValue(
      new Response(
        JSON.stringify({
          status: "cancel_requested",
          taskId: "task-123456",
          progress: 34,
          error: "cancelled by operator"
        }),
        { status: 200, headers: { "content-type": "application/json" } }
      )
    );
    vi.stubGlobal("fetch", fetchMock);

    const status = await getLiveMarketBriefStatus("task-123456");

    expect(status.status).toBe("cancel_requested");
    if (status.status === "cancel_requested") {
      expect(status.error).toBe("cancelled by operator");
    }
  });
});
