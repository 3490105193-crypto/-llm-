# Architecture Overview

## Current State

This repository contains Market Lens, a frontend-only financial market analysis workspace, plus an AI-native engineering baseline. The application uses React, TypeScript, Vite, Tailwind CSS, zod, Vitest, React Testing Library, Playwright, and pnpm.

## Baseline Architecture

The current architecture has five layers:

1. Collaboration contract: `AGENTS.md`.
2. Frontend app: `src/main.tsx`, `src/App.tsx`, and `src/features/market/`.
3. Durable memory: `docs/repo-memory.md`, `docs/module-map.md`, `docs/architecture/`, `docs/decisions/`, and `docs/patterns/`.
4. Automation: `tools/ai-quality.ps1`, package scripts, and `.github/workflows/ci.yml`.
5. Tests: Vitest tests under `src/` and Playwright tests under `e2e/`.

## Product Discovery Gate

Before implementation, clarify product goal, user scenarios, core business workflow, success metrics, and non-goals. Do not introduce architecture for guessed future requirements.

## Non-Goals

- Do not add backend, auth, persistence, broker integration, or live data feeds until requirements justify them.
- Do not create a database or deployment target without product requirements.
- Do not add framework boilerplate only to satisfy tooling checklists.

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
