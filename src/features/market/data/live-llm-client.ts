import { LlmMarketBriefSchema, type LlmMarketBrief } from "../schemas";

const defaultLiveLlmApiBase = "http://127.0.0.1:8787";
const liveLlmApiBase =
  import.meta.env.VITE_LIVE_LLM_API_BASE?.replace(/\/+$/, "") || defaultLiveLlmApiBase;

export type LiveBriefAccepted = {
  status: "accepted";
  taskId: string;
  traceId?: string;
  message?: string;
};

export type LiveBriefStatus =
  | {
      status: "pending" | "processing" | "unknown";
      taskId: string;
      progress: number;
      message?: string;
    }
  | {
      status: "completed";
      taskId: string;
      progress: number;
      brief: LlmMarketBrief;
    }
  | {
      status: "failed" | "cancelled" | "cancel_requested";
      taskId: string;
      progress: number;
      error: string;
    };

export async function startLiveMarketBrief(): Promise<LiveBriefAccepted> {
  const data = await requestJson(`${liveLlmApiBase}/api/live-llm/market-brief`, {
    method: "POST",
    body: JSON.stringify({
      sendNotification: false,
      reportLanguage: "en"
    })
  });

  if (data.status !== "accepted" || typeof data.taskId !== "string" || !data.taskId) {
    throw new Error("Live LLM adapter did not return an accepted task");
  }

  return {
    status: "accepted",
    taskId: data.taskId,
    traceId: typeof data.traceId === "string" ? data.traceId : undefined,
    message: typeof data.message === "string" ? data.message : undefined
  };
}

export async function getLiveMarketBriefStatus(taskId: string): Promise<LiveBriefStatus> {
  if (!/^[A-Za-z0-9._-]{6,128}$/.test(taskId)) {
    throw new Error("Invalid live LLM task id");
  }

  const data = await requestJson(
    `${liveLlmApiBase}/api/live-llm/market-brief/${encodeURIComponent(taskId)}`,
    { method: "GET" }
  );
  const status = typeof data.status === "string" ? data.status : "unknown";
  const progress = typeof data.progress === "number" ? data.progress : 0;

  if (status === "completed") {
    return {
      status,
      taskId: typeof data.taskId === "string" ? data.taskId : taskId,
      progress,
      brief: LlmMarketBriefSchema.parse(data.brief)
    };
  }

  if (status === "failed" || status === "cancelled" || status === "cancel_requested") {
    return {
      status,
      taskId: typeof data.taskId === "string" ? data.taskId : taskId,
      progress,
      error: typeof data.error === "string" ? data.error : "Live LLM market review failed"
    };
  }

  return {
    status: status === "pending" || status === "processing" ? status : "unknown",
    taskId: typeof data.taskId === "string" ? data.taskId : taskId,
    progress,
    message: typeof data.message === "string" ? data.message : undefined
  };
}

async function requestJson(url: string, init: RequestInit): Promise<Record<string, unknown>> {
  let response: Response;
  try {
    response = await fetch(url, {
      ...init,
      headers: {
        "content-type": "application/json",
        accept: "application/json",
        ...init.headers
      }
    });
  } catch {
    throw new Error("Live LLM adapter is not reachable. Start it with `pnpm dev:live-api`.");
  }

  const data = await parseJsonResponse(response);

  if (!response.ok) {
    const message =
      (typeof data.message === "string" && data.message) ||
      (typeof data.error === "string" && data.error) ||
      `Live LLM adapter returned HTTP ${response.status}`;
    throw new Error(message);
  }

  return data;
}

async function parseJsonResponse(response: Response): Promise<Record<string, unknown>> {
  try {
    const data = (await response.json()) as unknown;
    return data && typeof data === "object" && !Array.isArray(data)
      ? (data as Record<string, unknown>)
      : {};
  } catch {
    return {};
  }
}
