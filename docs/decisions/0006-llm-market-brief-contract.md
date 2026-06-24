# 0006: Add LLM Market Brief As A Validated Contract

Date: 2026-06-25

## Status

Accepted

## Context

The user pointed to `3490105193-crypto/daily_stock_analysis` as a GitHub CLI clone target and asked whether its LLM-driven broad market analysis could be added to this program.

The external repository is a Python/FastAPI-oriented LLM stock and market analysis system with modules such as `src/llm`, `market_analyzer.py`, `stock_analyzer.py`, `api/`, and `server.py`. The current app is a frontend-only React/Vite workbench with no backend, auth, persistence, or secret management.

Directly embedding the Python service into the browser app would mix runtimes, expose future API-key risk, and make local validation less deterministic.

## Decision

Add an `llmBrief` domain contract to the validated market snapshot and render it as an `AI Brief` workspace.

The contract covers:

- Market stance and confidence.
- Liquidity, breadth, and risk-budget reads.
- Index narrative.
- Sector rotation.
- Stock-level decisions.
- LLM risk warnings.
- Data quality and missing-input boundaries.

Keep the external Python/LLM engine out of the browser runtime. A future server-side adapter can translate `daily_stock_analysis` output into this contract.

## Alternatives

- Vendor the external Python repository into the current Vite app.
- Add a backend immediately and call the external LLM engine live.
- Ignore the external repository and keep only non-LLM analytics.

## Tradeoffs

The selected path gives users a mature LLM-driven market-analysis surface now while keeping the current app deterministic, testable, and free of secrets.

The tradeoff is that LLM analysis is sample data until a server-side adapter, provider configuration, secret handling, retries, observability, and live data contracts are implemented.

## Consequences

- `MarketSnapshotSchema` validates `llmBrief`.
- `AiBriefing` renders LLM market stance, decisions, risk warnings, and data quality.
- Future live LLM integration must be server-side and needs an ADR covering provider, credentials, prompt/versioning, output validation, caching, retries, rate limits, logging, and failure states.
- The frontend must never embed LLM provider keys or paid market data credentials.
