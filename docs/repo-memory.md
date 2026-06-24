# Repo Memory

## Architecture Summary

Market Lens Pro is a frontend-only financial market analysis workbench. It helps an investment research user scan market regime, review an LLM market brief, screen opportunities, inspect asset-level research context, review portfolio risk, stress scenarios, and triage alerts from a validated local market snapshot.

Current layers:

- Collaboration contract: `AGENTS.md`.
- React app entry: `src/main.tsx` and `src/App.tsx`.
- Market domain: `src/features/market/`.
- Repo memory: `docs/repo-memory.md`.
- Module map: `docs/module-map.md`.
- Architecture details: `docs/architecture/`.
- Decisions: `docs/decisions/`.
- Patterns: `docs/patterns/`.
- Quality gate: `tools/ai-quality.ps1`.
- Project Codex workflow skill: `.codex/skills/project-engineering-workflow/`.

## Product Goal

Build a mature market analysis app that lets a research user judge risk regime, scan opportunities, inspect asset-level risk, review portfolio exposure, test near-term market scenarios, and maintain a research queue quickly.

## User Scenarios

- A researcher opens the workbench before market open and checks regime, alerts, events, and breadth.
- A user reviews an LLM-driven market briefing with regime stance, index narrative, sector rotation, stock decisions, risk warnings, and data quality notes.
- A user filters the screener by symbol, name, sector, category, region, score, quality, and risk.
- A user selects an asset and reviews thesis, catalysts, factor profile, decision checklist, alerts, events, and research tasks.
- A user checks portfolio exposure, beta, hedge weight, top positions, active share, and factor exposure.
- A user compares scenario stress outcomes and position-level contribution before changing exposure.
- A user triages alert and research queues.

## Core Business Workflow

1. Load a validated market snapshot.
2. Calculate market health, opportunity scores, risk-adjusted rankings, portfolio risk, scenario stress, LLM brief summary, alert priority, and research queue state.
3. Present overview, AI brief, screener, asset memo, portfolio risk lab, scenarios, alert center, research queue, and event calendar.
4. Let the user filter, navigate, select assets, inspect context, and compare stress outcomes without requiring external credentials.

## Success Metrics

- Dashboard renders locally without API keys.
- User can identify regime, research workload, event risk, and portfolio risk from the first screen.
- Unit tests cover ranking, filtering, health calculation, portfolio risk, scenario stress, alert prioritization, and error states.
- Component tests cover workspace navigation, AI brief, screener filtering, risk lab, scenario matrix, alert center, and error state.
- Playwright smoke tests cover app load, navigation, screener selection, scenario matrix, and alert/research workflow on desktop and mobile.
- CI runs lint, typecheck, format, tests, build, audit, and e2e.

## Non-Goals

- No trading, order routing, broker integration, or investment advice.
- No live market data, paid feeds, auth, user accounts, or backend persistence.
- No live market data, paid feeds, auth, user accounts, backend persistence, order management, portfolio accounting, tax, or compliance surveillance workflow.

## Important Decisions

- Adopt documentation-first AI collaboration before application code.
- Use React, TypeScript, Vite, Tailwind CSS, zod, Vitest, React Testing Library, and Playwright for the first frontend module.
- Use a local seed market snapshot with zod validation until real data provider requirements are clear.
- Mature the product by deepening the frontend research workflow first: screener, asset memo, risk lab, scenario matrix, alert center, research queue, and event calendar.
- Add an LLM market brief contract inspired by `3490105193-crypto/daily_stock_analysis`; keep external LLM execution server-side for any real API keys or paid data.
- Force Vite to patched `6.4.3` through pnpm override so dependency audit stays clean.
- Use local Chrome for Playwright on Windows when Playwright browser download is unavailable; CI installs Playwright Chromium.

## Current Stack

- Frontend: React 19, TypeScript, Vite, Tailwind CSS.
- Validation: zod.
- Unit/component testing: Vitest and React Testing Library.
- E2E: Playwright.
- Package manager: pnpm.
- Backend: none.
- Database: none.

## Known Constraints

- Market data is static validated sample data and must not be treated as live or investment advice.
- No backend, persistence, auth, or external market data adapter exists.
- Portfolio risk and scenario stress calculations are deterministic front-end analytics over sample positions; they are not portfolio accounting or risk-model certification.
- LLM market brief data is a validated sample contract. It is not a live LLM call, and no API keys are exposed in the frontend.
- Local shell PATH originally lacked common developer tools; Codex desktop bundled Git, Node, Python, and pnpm were used for setup and validation.
- Playwright browser download from CDN was slow locally; tests passed by using installed system Chrome.

## Future Agent Instructions

- Read `AGENTS.md` first.
- Read `docs/module-map.md` before editing or adding source files.
- Update repo memory whenever architecture, workflows, modules, data flow, constraints, or risks change.
- Add ADRs for important architecture choices.
- Run `tools/ai-quality.ps1` and all package quality scripts before finalizing changes.
