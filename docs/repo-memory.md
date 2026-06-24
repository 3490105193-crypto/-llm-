# Repo Memory

## Architecture Summary

Market Lens is a frontend-only financial market analysis workspace. It helps a research user scan market regime, macro signals, sector breadth, ranked assets, selected-asset thesis, and scenario risk from a validated local market snapshot.

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

Build a market analysis app that lets a research user judge risk regime, scan opportunities, inspect asset-level risk, and test near-term market scenarios quickly.

## User Scenarios

- A researcher opens the dashboard before market open and checks regime, alerts, and breadth.
- A user filters the watchlist by symbol, name, sector, or category.
- A user selects an asset and reviews thesis, catalysts, risk, and momentum.
- A user compares base, upside, and downside scenarios before changing exposure.

## Core Business Workflow

1. Load a validated market snapshot.
2. Calculate market health, opportunity scores, and risk-adjusted rankings.
3. Present regime, signals, sector breadth, watchlist, selected-asset detail, and scenarios.
4. Let the user filter, navigate, and select assets without requiring external credentials.

## Success Metrics

- Dashboard renders locally without API keys.
- User can identify market regime and top ranked assets from the first screen.
- Unit tests cover ranking, filtering, health calculation, and error states.
- Playwright smoke tests cover app load, navigation, and the key asset selection path on desktop and mobile.
- CI runs lint, typecheck, format, tests, build, audit, and e2e.

## Non-Goals

- No trading, order routing, broker integration, or investment advice.
- No live market data, paid feeds, auth, user accounts, or backend persistence.
- No portfolio accounting or tax workflow.

## Important Decisions

- Adopt documentation-first AI collaboration before application code.
- Use React, TypeScript, Vite, Tailwind CSS, zod, Vitest, React Testing Library, and Playwright for the first frontend module.
- Use a local seed market snapshot with zod validation until real data provider requirements are clear.
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

- Market data is static sample data and must not be treated as live or investment advice.
- No backend, persistence, auth, or external market data adapter exists.
- Local shell PATH originally lacked common developer tools; Codex desktop bundled Git, Node, Python, and pnpm were used for setup and validation.
- Playwright browser download from CDN was slow locally; tests passed by using installed system Chrome.

## Future Agent Instructions

- Read `AGENTS.md` first.
- Read `docs/module-map.md` before editing or adding source files.
- Update repo memory whenever architecture, workflows, modules, data flow, constraints, or risks change.
- Add ADRs for important architecture choices.
- Run `tools/ai-quality.ps1` and all package quality scripts before finalizing changes.
