import http from "node:http";
import { pathToFileURL } from "node:url";

const defaultConfig = readConfig();

export function createLiveLlmServer(config = defaultConfig) {
  return http.createServer(async (request, response) => {
    try {
      if (request.method === "OPTIONS") {
        writeJson(config, response, 204, null, request);
        return;
      }

      const url = new URL(
        request.url || "/",
        `http://${request.headers.host || `${config.host}:${config.port}`}`
      );

      if (request.method === "GET" && url.pathname === "/api/live-llm/health") {
        await handleHealth(config, request, response);
        return;
      }

      if (request.method === "POST" && url.pathname === "/api/live-llm/market-brief") {
        await handleStartMarketBrief(config, request, response);
        return;
      }

      const statusMatch = url.pathname.match(/^\/api\/live-llm\/market-brief\/([^/]+)$/);
      if (request.method === "GET" && statusMatch) {
        await handleMarketBriefStatus(
          config,
          request,
          response,
          decodeURIComponent(statusMatch[1])
        );
        return;
      }

      writeJson(config, response, 404, { error: "not_found", message: "Route not found" }, request);
    } catch (error) {
      if (error instanceof AdapterHttpError) {
        writeJson(
          config,
          response,
          error.statusCode,
          { error: error.code, message: error.message },
          request
        );
        return;
      }

      const message = error instanceof Error ? error.message : "Unexpected live LLM adapter error";
      writeJson(config, response, 500, { error: "internal_error", message }, request);
    }
  });
}

export function startLiveLlmServer(config = defaultConfig) {
  const server = createLiveLlmServer(config);
  server.listen(config.port, config.host, () => {
    console.log(`Live LLM adapter listening on http://${config.host}:${config.port}`);
    console.log(`Forwarding market-review jobs to ${config.dsaBaseUrl}`);
  });
  return server;
}

if (isMainModule()) {
  startLiveLlmServer();
}

async function handleHealth(config, request, response) {
  const dsaHealth = await probeDsaHealth(config);
  writeJson(
    config,
    response,
    200,
    {
      status: "ok",
      adapter: "market-lens-live-llm",
      dsaBaseUrl: config.dsaBaseUrl,
      dsa: dsaHealth
    },
    request
  );
}

async function handleStartMarketBrief(config, request, response) {
  const body = await readJsonBody(request);
  validatePlainObject(body, "Request body must be a JSON object");

  if (body.sendNotification !== undefined && typeof body.sendNotification !== "boolean") {
    throw new AdapterHttpError(
      400,
      "invalid_send_notification",
      "sendNotification must be boolean"
    );
  }

  const reportLanguage = normalizeReportLanguage(body.reportLanguage, config.reportLanguage);
  const accepted = await dsaFetch(config, "/api/v1/analysis/market-review", {
    method: "POST",
    body: JSON.stringify({
      send_notification: body.sendNotification === true,
      report_language: reportLanguage
    })
  });

  const taskId = stringValue(accepted.task_id) || stringValue(accepted.taskId);
  const traceId = stringValue(accepted.trace_id) || stringValue(accepted.traceId);

  if (!taskId) {
    writeJson(
      config,
      response,
      502,
      {
        status: "failed",
        error: "missing_task_id",
        message: "daily_stock_analysis accepted the request but did not return task_id"
      },
      request
    );
    return;
  }

  writeJson(
    config,
    response,
    202,
    {
      status: "accepted",
      taskId,
      traceId,
      message:
        stringValue(accepted.message) || "Market review task accepted by daily_stock_analysis"
    },
    request
  );
}

async function handleMarketBriefStatus(config, request, response, taskId) {
  if (!isValidTaskId(taskId)) {
    writeJson(config, response, 400, { status: "failed", error: "invalid_task_id" }, request);
    return;
  }

  const status = await dsaFetch(config, `/api/v1/analysis/status/${encodeURIComponent(taskId)}`, {
    method: "GET"
  });
  const normalizedStatus = normalizeDsaTaskStatus(status.status);

  if (normalizedStatus === "completed") {
    const brief = buildBriefFromDsaStatus(status);
    writeJson(
      config,
      response,
      200,
      {
        status: "completed",
        taskId,
        progress: numberValue(status.progress, 100),
        brief
      },
      request
    );
    return;
  }

  if (["failed", "cancelled", "cancel_requested"].includes(normalizedStatus)) {
    writeJson(
      config,
      response,
      200,
      {
        status: normalizedStatus,
        taskId,
        progress: numberValue(status.progress, 0),
        error: stringValue(status.error) || "daily_stock_analysis task failed"
      },
      request
    );
    return;
  }

  writeJson(
    config,
    response,
    200,
    {
      status: normalizedStatus,
      taskId,
      progress: numberValue(status.progress, 0),
      message: stringValue(status.message) || "daily_stock_analysis task is still running"
    },
    request
  );
}

async function probeDsaHealth(config) {
  const paths = ["/api/v1/health", "/api/v1/system/health", "/docs"];

  for (const path of paths) {
    try {
      const result = await dsaRawFetch(config, path, { method: "GET" }, 3000);
      if (result.response.ok) {
        return {
          reachable: true,
          path,
          statusCode: result.response.status,
          detail: result.data || {
            contentType: result.response.headers.get("content-type") || "unknown"
          }
        };
      }
    } catch {
      // Try the next known DSA probe path.
    }
  }

  return {
    reachable: false,
    message:
      "daily_stock_analysis is not reachable. Start it with `python main.py --serve-only` and keep DSA_BASE_URL pointed at that server."
  };
}

async function dsaFetch(config, path, init, timeoutMs = config.requestTimeoutMs) {
  const result = await dsaRawFetch(config, path, init, timeoutMs);

  if (!result.response.ok) {
    const message =
      stringValue(result.data?.message) ||
      stringValue(result.data?.detail?.message) ||
      stringValue(result.data?.detail) ||
      `daily_stock_analysis returned HTTP ${result.response.status}`;
    const statusCode = result.response.status === 409 ? 409 : 502;
    const code = result.response.status === 409 ? "dsa_conflict" : "dsa_request_failed";
    throw new AdapterHttpError(statusCode, code, message);
  }

  return result.data || {};
}

async function dsaRawFetch(config, path, init, timeoutMs = config.requestTimeoutMs) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(`${config.dsaBaseUrl}${path}`, {
      ...init,
      signal: controller.signal,
      headers: {
        accept: "application/json",
        ...(init.body ? { "content-type": "application/json" } : {}),
        ...(init.headers || {})
      }
    });
    const text = await response.text();
    const data = text ? parseJsonOrNull(text) : null;
    return { response, data, text };
  } catch (error) {
    if (error instanceof Error && error.name === "AbortError") {
      throw new AdapterHttpError(
        504,
        "dsa_timeout",
        `daily_stock_analysis request timed out after ${timeoutMs}ms`
      );
    }
    const message = error instanceof Error ? error.message : "daily_stock_analysis request failed";
    throw new AdapterHttpError(502, "dsa_unreachable", message);
  } finally {
    clearTimeout(timeout);
  }
}

export function buildBriefFromDsaStatus(status) {
  const payload =
    objectValue(status.market_review_payload) || objectValue(status.marketReviewPayload);
  const sections = flattenPayloadSections(payload);
  const markdown =
    stringValue(status.market_review_report) ||
    stringValue(status.marketReviewReport) ||
    stringValue(payload?.markdownReport) ||
    stringValue(payload?.markdown_report) ||
    sections.join("\n\n");
  const plain = stripMarkdown(markdown || JSON.stringify(payload || status));
  const indices = getPayloadIndices(payload);
  const breadth = getPayloadObject(payload, ["breadth", "market_breadth", "marketBreadth"]);
  const sectors = getPayloadSectors(payload);
  const generatedAt =
    getPayloadString(payload, ["generatedAt", "generated_at", "createdAt", "created_at"]) ||
    stringValue(status.completed_at) ||
    stringValue(status.completedAt) ||
    new Date().toISOString();

  return {
    generatedAt,
    engine: "daily_stock_analysis live",
    model: "DSA configured LLM",
    sourceSystem: "daily_stock_analysis FastAPI",
    marketView: {
      stance: inferStance(plain, breadth),
      confidence: inferConfidence(payload, markdown),
      summary: firstSentence(plain, "Live DSA market review completed."),
      liquidityRead:
        findSection(sections, liquidityKeywords()) ||
        findText(plain, liquidityKeywords()) ||
        fallbackText(plain),
      breadthRead: describeBreadth(breadth, plain),
      riskBudget:
        findSection(sections, riskKeywords()) ||
        "Use DSA live review with current portfolio stress before increasing exposure."
    },
    actionSummary: {
      buy: 0,
      watch: 0,
      hold: 0,
      reduce: 0,
      avoid: 0
    },
    indexNarrative: buildIndexNarrative(indices, plain),
    sectorRotation: buildSectorRotation(sectors, sections),
    stockDecisions: [],
    riskWarnings: buildRiskWarnings(sections, plain),
    dataQuality: {
      freshness: `Live daily_stock_analysis task ${
        stringValue(status.task_id) || stringValue(status.taskId) || "unknown"
      } completed at ${generatedAt}.`,
      missingInputs: buildMissingInputs(payload),
      confidenceNotes: [
        "This brief is generated from the live daily_stock_analysis FastAPI market-review task.",
        "LLM provider credentials and paid data keys remain server-side in daily_stock_analysis.",
        "Market Lens validates the returned report shape before rendering it."
      ]
    }
  };
}

function buildIndexNarrative(indices, plain) {
  if (indices.length > 0) {
    return indices.slice(0, 6).map((index) => {
      const symbol =
        stringValue(index.code) || stringValue(index.symbol) || stringValue(index.name) || "INDEX";
      const name = stringValue(index.name) || symbol;
      const current =
        stringValue(index.current) ||
        stringValue(index.level) ||
        stringValue(index.close) ||
        stringValue(index.latest);
      const change = index.changePct ?? index.change_pct ?? index.pct_chg ?? index.change;

      return {
        symbol,
        view: `${name} ${formatChange(change)} at ${current || "latest level unavailable"}.`,
        drivers: [
          "daily_stock_analysis live market data",
          "index price action",
          "market-review report"
        ]
      };
    });
  }

  return [
    {
      symbol: "MARKET",
      view: firstSentence(plain, "Live DSA market narrative returned without structured indices."),
      drivers: ["daily_stock_analysis markdown report"]
    }
  ];
}

function buildSectorRotation(sectors, sections) {
  const items = [];
  const top = Array.isArray(sectors?.top) ? sectors.top : [];
  const bottom = Array.isArray(sectors?.bottom) ? sectors.bottom : [];

  top.slice(0, 4).forEach((sector) => {
    items.push({
      sector: stringValue(sector.name) || stringValue(sector.sector) || "Leading sector",
      stance: "Watch",
      reason: `Live DSA top sector ${formatChange(sector.changePct ?? sector.change_pct)}.`
    });
  });

  bottom.slice(0, 4).forEach((sector) => {
    items.push({
      sector: stringValue(sector.name) || stringValue(sector.sector) || "Lagging sector",
      stance: "Reduce",
      reason: `Live DSA lagging sector ${formatChange(sector.changePct ?? sector.change_pct)}.`
    });
  });

  if (items.length > 0) {
    return items;
  }

  const rotation = findSection(sections, sectorKeywords());
  return [
    {
      sector: "Market rotation",
      stance: "Watch",
      reason: rotation || "Structured sector rotation was not returned by daily_stock_analysis."
    }
  ];
}

function buildRiskWarnings(sections, plain) {
  const riskSection = findSection(sections, riskKeywords());
  const source = riskSection || plain;

  return [
    {
      title: "Live DSA risk read",
      severity: inferRiskSeverity(source),
      detail: firstSentence(source, "daily_stock_analysis returned a live market risk section."),
      action: "Review the live brief alongside portfolio stress before increasing exposure."
    }
  ];
}

function flattenPayloadSections(payload) {
  if (!payload) {
    return [];
  }

  if (payload.markets && typeof payload.markets === "object") {
    return Object.values(payload.markets).flatMap((marketPayload) =>
      flattenPayloadSections(marketPayload)
    );
  }

  const sectionCandidates = [
    payload.sections,
    payload.report_sections,
    payload.reportSections,
    payload.market_sections,
    payload.marketSections
  ].find(Array.isArray);
  const sections = Array.isArray(sectionCandidates) ? sectionCandidates : [];

  return sections
    .map((section) => {
      if (typeof section === "string") {
        return section;
      }

      const title = stringValue(section.title) || stringValue(section.name);
      const content =
        stringValue(section.markdown) ||
        stringValue(section.content) ||
        stringValue(section.text) ||
        stringValue(section.summary);
      return [title, content].filter(Boolean).join("\n");
    })
    .filter(Boolean);
}

function getPayloadIndices(payload) {
  if (!payload) {
    return [];
  }

  if (payload.markets && typeof payload.markets === "object") {
    return Object.values(payload.markets).flatMap((marketPayload) =>
      getPayloadIndices(marketPayload)
    );
  }

  const candidates = [
    payload.indices,
    payload.indexes,
    payload.market_indices,
    payload.marketIndices,
    payload.index_data,
    payload.indexData
  ];
  const indices = candidates.find(Array.isArray);
  return Array.isArray(indices) ? indices : [];
}

function getPayloadSectors(payload) {
  if (!payload) {
    return {};
  }

  const sectors =
    objectValue(payload.sectors) ||
    objectValue(payload.sectorRotation) ||
    objectValue(payload.sector_rotation) ||
    objectValue(payload.sector_rankings) ||
    {};

  const top =
    arrayValue(sectors.top) ||
    arrayValue(sectors.top_sectors) ||
    arrayValue(sectors.topSectors) ||
    arrayValue(payload.top_sectors) ||
    arrayValue(payload.topSectors) ||
    [];
  const bottom =
    arrayValue(sectors.bottom) ||
    arrayValue(sectors.bottom_sectors) ||
    arrayValue(sectors.bottomSectors) ||
    arrayValue(payload.bottom_sectors) ||
    arrayValue(payload.bottomSectors) ||
    [];

  return { top, bottom };
}

function describeBreadth(breadth, plain) {
  if (!breadth) {
    return (
      findText(plain, breadthKeywords()) ||
      "Structured breadth data was not returned by daily_stock_analysis."
    );
  }

  const upCount = breadth.upCount ?? breadth.up_count ?? breadth.advancers;
  const downCount = breadth.downCount ?? breadth.down_count ?? breadth.decliners;
  const limitUp = breadth.limitUpCount ?? breadth.limit_up_count ?? breadth.limit_up;
  const limitDown = breadth.limitDownCount ?? breadth.limit_down_count ?? breadth.limit_down;

  return `Advancers ${numberValue(upCount, 0)}, decliners ${numberValue(
    downCount,
    0
  )}, limit up/down ${numberValue(limitUp, 0)}/${numberValue(limitDown, 0)}.`;
}

function inferStance(plain, breadth) {
  const lower = plain.toLowerCase();
  const upCount = numberValue(breadth?.upCount ?? breadth?.up_count ?? breadth?.advancers, 0);
  const downCount = numberValue(breadth?.downCount ?? breadth?.down_count ?? breadth?.decliners, 0);

  if (containsAny(lower, defensiveKeywords()) || (downCount > 0 && downCount > upCount * 1.25)) {
    return "Defensive";
  }

  if (containsAny(lower, riskOnKeywords()) || (upCount > 0 && upCount > downCount * 1.5)) {
    return "Risk-on";
  }

  if (containsAny(lower, neutralKeywords())) {
    return "Neutral";
  }

  return "Selective";
}

function inferConfidence(payload, markdown) {
  if (payload && markdown) {
    return 78;
  }
  if (payload || markdown) {
    return 68;
  }
  return 45;
}

function inferRiskSeverity(text) {
  const lower = text.toLowerCase();
  if (containsAny(lower, highRiskKeywords())) {
    return "high";
  }
  if (containsAny(lower, mediumRiskKeywords())) {
    return "medium";
  }
  return "low";
}

function buildMissingInputs(payload) {
  const missing = [];
  if (!payload) missing.push("Structured DSA market_review_payload");
  if (!getPayloadIndices(payload).length) missing.push("Structured index data");
  if (!getPayloadObject(payload, ["breadth", "market_breadth", "marketBreadth"])) {
    missing.push("Structured breadth data");
  }
  const sectors = getPayloadSectors(payload);
  if (!sectors.top.length && !sectors.bottom.length) missing.push("Structured sector rankings");
  return missing;
}

export function normalizeDsaTaskStatus(value) {
  const status = stringValue(value);
  if (
    ["pending", "processing", "completed", "failed", "cancelled", "cancel_requested"].includes(
      status
    )
  ) {
    return status;
  }
  if (status === "cancel_request") {
    return "cancel_requested";
  }
  return "unknown";
}

function liquidityKeywords() {
  return ["fund", "capital", "liquidity", "volume", "turnover", "\u8d44\u91d1", "\u6210\u4ea4"];
}

function riskKeywords() {
  return ["risk", "watch", "volatility", "\u98ce\u9669", "\u89c2\u5bdf", "\u8b66\u60d5"];
}

function sectorKeywords() {
  return ["rotation", "sector", "theme", "\u677f\u5757", "\u884c\u4e1a", "\u8f6e\u52a8"];
}

function breadthKeywords() {
  return ["breadth", "advancers", "decliners", "\u4e0a\u6da8", "\u4e0b\u8dcc"];
}

function defensiveKeywords() {
  return ["defensive", "bearish", "risk-off", "\u8c28\u614e", "\u9632\u5fa1", "\u770b\u7a7a"];
}

function riskOnKeywords() {
  return ["risk-on", "bullish", "\u4e50\u89c2", "\u5f3a\u52bf", "\u770b\u591a"];
}

function neutralKeywords() {
  return ["neutral", "mixed", "range-bound", "\u9707\u8361", "\u5206\u5316", "\u89c2\u671b"];
}

function highRiskKeywords() {
  return ["critical", "severe", "high", "\u9ad8\u98ce\u9669", "\u91cd\u5927", "\u8b66\u60d5"];
}

function mediumRiskKeywords() {
  return ["medium", "watch", "moderate", "\u89c2\u5bdf", "\u8c28\u614e", "\u6ce2\u52a8"];
}

function findSection(sections, keywords) {
  return (
    sections.find((section) =>
      keywords.some((keyword) => section.toLowerCase().includes(keyword.toLowerCase()))
    ) || ""
  );
}

function findText(text, keywords) {
  return text
    .split(/(?<=[.!?])\s+/)
    .find((sentence) =>
      keywords.some((keyword) => sentence.toLowerCase().includes(keyword.toLowerCase()))
    );
}

function firstSentence(text, fallback) {
  return truncate(text.split(/(?<=[.!?])\s+/).find(Boolean) || fallback, 420);
}

function fallbackText(text) {
  return truncate(text || "daily_stock_analysis returned no text detail.", 320);
}

function stripMarkdown(value) {
  return String(value || "")
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/[#>*_`[\]()]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function formatChange(value) {
  const number = Number(value);
  if (!Number.isFinite(number)) {
    return "";
  }
  return `${number > 0 ? "+" : ""}${number.toFixed(2)}%`;
}

function truncate(value, maxLength) {
  const text = String(value || "").trim();
  if (text.length <= maxLength) {
    return text;
  }
  return `${text.slice(0, Math.max(0, maxLength - 3))}...`;
}

function getPayloadObject(payload, keys) {
  if (!payload) {
    return null;
  }
  const value = keys.map((key) => payload[key]).find((candidate) => objectValue(candidate));
  return objectValue(value);
}

function getPayloadString(payload, keys) {
  if (!payload) {
    return "";
  }
  return keys.map((key) => stringValue(payload[key])).find(Boolean) || "";
}

function validatePlainObject(value, message) {
  if (!objectValue(value)) {
    throw new AdapterHttpError(400, "invalid_json_body", message);
  }
}

function normalizeReportLanguage(value, fallback) {
  const language = stringValue(value) || fallback;
  if (language === "zh" || language === "en") {
    return language;
  }
  throw new AdapterHttpError(400, "invalid_report_language", "reportLanguage must be zh or en");
}

function isValidTaskId(taskId) {
  return /^[A-Za-z0-9._-]{6,128}$/.test(taskId);
}

function containsAny(text, keywords) {
  return keywords.some((keyword) => text.includes(keyword.toLowerCase()));
}

function objectValue(value) {
  return value && typeof value === "object" && !Array.isArray(value) ? value : null;
}

function arrayValue(value) {
  return Array.isArray(value) ? value : null;
}

function stringValue(value) {
  return typeof value === "string" && value.trim() ? value.trim() : "";
}

function numberValue(value, fallback) {
  const number = Number(value);
  return Number.isFinite(number) ? number : fallback;
}

function parseJsonOrNull(value) {
  try {
    return JSON.parse(value);
  } catch {
    return null;
  }
}

function trimTrailingSlash(value) {
  return value.replace(/\/+$/, "");
}

async function readJsonBody(request) {
  const chunks = [];
  let length = 0;

  for await (const chunk of request) {
    length += chunk.length;
    if (length > 16_384) {
      throw new AdapterHttpError(413, "request_body_too_large", "Request body too large");
    }
    chunks.push(chunk);
  }

  const text = Buffer.concat(chunks).toString("utf8").trim();
  if (!text) {
    return {};
  }

  const parsed = parseJsonOrNull(text);
  if (!parsed) {
    throw new AdapterHttpError(400, "invalid_json", "Request body must be valid JSON");
  }

  return parsed;
}

function writeJson(config, response, statusCode, payload, request) {
  const origin = request.headers.origin;
  if (origin && config.allowedOrigins.has(origin)) {
    response.setHeader("access-control-allow-origin", origin);
    response.setHeader("vary", "Origin");
  }
  response.setHeader("access-control-allow-methods", "GET,POST,OPTIONS");
  response.setHeader("access-control-allow-headers", "content-type");

  if (statusCode === 204) {
    response.writeHead(204);
    response.end();
    return;
  }

  response.writeHead(statusCode, { "content-type": "application/json; charset=utf-8" });
  response.end(JSON.stringify(payload));
}

function readConfig() {
  return {
    host: process.env.LIVE_LLM_HOST || "127.0.0.1",
    port: readPositiveInteger("LIVE_LLM_PORT", 8787),
    dsaBaseUrl: normalizeHttpUrl(
      process.env.DSA_BASE_URL || "http://127.0.0.1:8000",
      "DSA_BASE_URL"
    ),
    requestTimeoutMs: readPositiveInteger("LIVE_LLM_REQUEST_TIMEOUT_MS", 20000),
    reportLanguage: normalizeStaticReportLanguage(process.env.LIVE_LLM_REPORT_LANGUAGE || "en"),
    allowedOrigins: new Set(
      (process.env.LIVE_LLM_ALLOWED_ORIGINS || "http://127.0.0.1:5173,http://localhost:5173")
        .split(",")
        .map((origin) => origin.trim())
        .filter(Boolean)
    )
  };
}

function readPositiveInteger(name, fallback) {
  const raw = process.env[name];
  if (!raw) {
    return fallback;
  }

  const value = Number(raw);
  if (Number.isInteger(value) && value > 0) {
    return value;
  }

  throw new Error(`${name} must be a positive integer`);
}

function normalizeHttpUrl(value, name) {
  try {
    const url = new URL(value);
    if (url.protocol !== "http:" && url.protocol !== "https:") {
      throw new Error("unsupported protocol");
    }
    return trimTrailingSlash(url.toString());
  } catch {
    throw new Error(`${name} must be a valid http or https URL`);
  }
}

function normalizeStaticReportLanguage(value) {
  return value === "zh" || value === "en" ? value : "en";
}

function isMainModule() {
  return Boolean(process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href);
}

class AdapterHttpError extends Error {
  constructor(statusCode, code, message) {
    super(message);
    this.name = "AdapterHttpError";
    this.statusCode = statusCode;
    this.code = code;
  }
}
