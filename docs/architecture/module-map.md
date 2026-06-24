# Module Map

Primary module mapping lives at `docs/module-map.md`. Keep this file synchronized with that path when modules or service boundaries change.

## Current Modules

| Path                                          | Purpose                                                       | Owner Boundary       |
| --------------------------------------------- | ------------------------------------------------------------- | -------------------- |
| `src/main.tsx`                                | React root bootstrap and error boundary mounting              | Frontend runtime     |
| `src/App.tsx`                                 | Application composition and snapshot loading                  | Frontend runtime     |
| `src/features/market/`                        | Market analysis domain, seed data, analysis logic, and UI     | Market feature       |
| `e2e/market-dashboard.spec.ts`                | Desktop and mobile Playwright smoke tests                     | Application tests    |
| `package.json`, `pnpm-lock.yaml`              | pnpm scripts and locked dependency graph                      | Tooling              |
| `pnpm-workspace.yaml`                         | pnpm build approval and Vite security override                | Tooling              |
| `AGENTS.md`                                   | Repo-level AI and contributor rules                           | Engineering workflow |
| `docs/repo-memory.md`                         | Primary durable repo memory                                   | Architecture         |
| `docs/module-map.md`                          | Primary module map and boundaries                             | Architecture         |
| `.codex/skills/project-engineering-workflow/` | Project-local Codex workflow skill                            | AI workflow          |
| `docs/architecture/`                          | Architecture details, risks, dependencies, and technical debt | Architecture         |
| `docs/decisions/`                             | Architecture decision records                                 | Architecture         |
| `docs/patterns/`                              | Reusable engineering patterns                                 | Engineering workflow |
| `tools/ai-quality.ps1`                        | Lightweight validation and secret scan                        | Engineering workflow |
| `.github/workflows/ci.yml`                    | CI quality gate                                               | Automation           |

## Data Flow

1. Seed snapshot is stored in `src/features/market/data/seed-market.ts`.
2. `loadMarketSnapshot` validates input with zod.
3. `analysis.ts` calculates market health, ranking, risk-adjusted score, scenario selection, and formatting.
4. `MarketDashboard` owns local UI state for filters, selected asset, and selected scenario.
5. Presentational components render chart, heatmap, table, metrics, and scenario details.

## Service Boundaries

No backend service boundaries exist yet.

Current frontend boundaries:

- Data validation boundary: `loadMarketSnapshot`.
- Domain calculation boundary: `analysis.ts`.
- UI composition boundary: `MarketDashboard`.
- E2E boundary: browser flows in `e2e/market-dashboard.spec.ts`.
