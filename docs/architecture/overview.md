# Architecture Overview

## Current State

This repository contains Market Lens Pro, a financial market analysis workbench, plus an AI-native engineering baseline. The application uses React, TypeScript, Vite, Tailwind CSS, zod, Vitest, React Testing Library, Playwright, and pnpm. It also includes an optional local Node.js live LLM adapter for `daily_stock_analysis`.

The product is intentionally a mature research workflow over validated sample data by default. It includes overview, AI brief, screener, asset memo, portfolio risk lab, scenario matrix, alert center, research queue, and event calendar surfaces. When the local adapter and DSA FastAPI service are running, the AI Brief workspace can submit a live broad-market LLM review and render the mapped result. It is not a live data terminal, broker, portfolio accounting system, or investment advice product.

## Baseline Architecture

The current architecture has six layers:

1. Collaboration contract: `AGENTS.md`.
2. Frontend app: `src/main.tsx`, `src/App.tsx`, and `src/features/market/`.
3. Optional local live adapter: `server/live-llm-server.mjs`.
4. Durable memory: `docs/repo-memory.md`, `docs/module-map.md`, `docs/architecture/`, `docs/decisions/`, and `docs/patterns/`.
5. Automation: `tools/ai-quality.ps1`, package scripts, and `.github/workflows/ci.yml`.
6. Tests: Vitest tests under `src/` and `server/`, plus Playwright tests under `e2e/`.

## Product Discovery Gate

Before implementation, clarify product goal, user scenarios, core business workflow, success metrics, and non-goals. Do not introduce architecture for guessed future requirements.

## Non-Goals

- Do not add a general backend, auth, persistence, broker integration, or live data feeds until requirements justify them.
- Do not create a database or deployment target without product requirements.
- Do not add framework boilerplate only to satisfy tooling checklists.
- Do not present deterministic sample analytics as certified live market data, investment advice, or regulated risk output.
- Do not run live LLM providers or paid market data directly from the browser. Keep the DSA integration behind `server/live-llm-server.mjs` or a stronger server-side boundary.

## Evolution Rules

When application code changes:

- Confirm the product goal and user workflow first.
- Keep lint, typecheck, formatter, coverage, build, audit, and e2e working.
- Prefer simple, stable, mature, AI-friendly stack choices.
- Update `docs/module-map.md` and `docs/repo-memory.md`.
- Update `docs/architecture/module-map.md` if mirrored module memory changes.
- Add an architecture decision record in `docs/decisions/` for important decisions.
- Add focused tests in `src/`, `tests/`, or `e2e/`.
- Extend CI to run any new stack-specific checks.
