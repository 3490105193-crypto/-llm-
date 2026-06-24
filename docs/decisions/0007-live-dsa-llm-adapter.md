# 0007: Add Local Live DSA LLM Adapter

Date: 2026-06-25

## Status

Accepted

## Context

The user asked for a live LLM integration, not only a sample AI brief. The referenced `3490105193-crypto/daily_stock_analysis` repository is a Python/FastAPI system with an asynchronous broad-market review endpoint:

- `POST /api/v1/analysis/market-review`
- `GET /api/v1/analysis/status/{task_id}`

The Market Lens browser app should not hold LLM provider credentials, paid market data keys, or Python service internals.

## Decision

Add a small local Node.js adapter at `server/live-llm-server.mjs`.

The adapter:

- Exposes `POST /api/live-llm/market-brief`.
- Exposes `GET /api/live-llm/market-brief/{taskId}`.
- Calls DSA `POST /api/v1/analysis/market-review`.
- Polls DSA `GET /api/v1/analysis/status/{task_id}`.
- Maps DSA markdown or `market_review_payload` into the existing `LlmMarketBrief` contract.
- Keeps DSA credentials and provider configuration server-side.

The frontend calls the adapter through `VITE_LIVE_LLM_API_BASE`. DSA location is configured separately through `DSA_BASE_URL`.

## Alternatives

- Vendor `daily_stock_analysis` Python code into the current frontend repository.
- Call DSA directly from the browser.
- Replace the current app with the DSA web app.
- Build a full production backend before adding live LLM.

## Tradeoffs

The selected adapter is simple, dependency-light, and works with the existing React/Vite product. It avoids exposing secrets and avoids a large backend rewrite.

The tradeoff is that it is a local integration boundary, not a production multi-user backend. DSA output mapping is defensive because DSA can return either structured payloads or markdown-heavy reports.

## Consequences

- `pnpm dev:live-api` starts the local adapter.
- `.env.example` documents browser-to-adapter and adapter-to-DSA configuration.
- `src/features/market/data/live-llm-client.ts` owns browser calls to the adapter.
- `AiBriefing` can submit and display live DSA task status.
- `server/live-llm-server.test.mjs` covers DSA status compatibility and brief mapping.
- Future production use should add auth, rate limits, observability, stronger DSA fixtures, and a deployment decision.
