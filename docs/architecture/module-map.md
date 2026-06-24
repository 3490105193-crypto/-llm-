# Module Map

Primary module mapping lives at `docs/module-map.md`. Keep this file synchronized with that path when modules or service boundaries change.

## Current Modules

| Path                                          | Purpose                                                                                                                                 | Owner Boundary       |
| --------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------- | -------------------- |
| `src/main.tsx`                                | React root bootstrap and error boundary mounting                                                                                        | Frontend runtime     |
| `src/App.tsx`                                 | Application composition and snapshot loading                                                                                            | Frontend runtime     |
| `src/features/market/`                        | Market analysis domain, validated seed data, analysis logic, research workbench UI, AI brief, screener, risk lab, alerts, and scenarios | Market feature       |
| `src/features/market/data/live-llm-client.ts` | Browser client for the local live LLM adapter                                                                                           | Market data adapter  |
| `server/live-llm-server.mjs`                  | Local adapter that submits and polls `daily_stock_analysis` market-review tasks                                                         | Live LLM integration |
| `server/live-llm-server.test.mjs`             | Adapter mapping and status compatibility tests                                                                                          | Integration tests    |
| `e2e/market-dashboard.spec.ts`                | Desktop and mobile Playwright smoke tests for workbench workflows                                                                       | Application tests    |
| `package.json`, `pnpm-lock.yaml`              | pnpm scripts and locked dependency graph                                                                                                | Tooling              |
| `pnpm-workspace.yaml`                         | pnpm build approval and Vite security override                                                                                          | Tooling              |
| `AGENTS.md`                                   | Repo-level AI and contributor rules                                                                                                     | Engineering workflow |
| `docs/repo-memory.md`                         | Primary durable repo memory                                                                                                             | Architecture         |
| `docs/module-map.md`                          | Primary module map and boundaries                                                                                                       | Architecture         |
| `.codex/skills/project-engineering-workflow/` | Project-local Codex workflow skill                                                                                                      | AI workflow          |
| `docs/architecture/`                          | Architecture details, risks, dependencies, and technical debt                                                                           | Architecture         |
| `docs/decisions/`                             | Architecture decision records                                                                                                           | Architecture         |
| `docs/patterns/`                              | Reusable engineering patterns                                                                                                           | Engineering workflow |
| `tools/ai-quality.ps1`                        | Lightweight validation and secret scan                                                                                                  | Engineering workflow |
| `.github/workflows/ci.yml`                    | CI quality gate                                                                                                                         | Automation           |

## Data Flow

1. Seed snapshot is stored in `src/features/market/data/seed-market.ts`.
2. `loadMarketSnapshot` validates input with zod.
3. `analysis.ts` calculates market health, ranking, risk-adjusted score, portfolio risk, scenario stress, LLM brief summary, alert priority, research summary, and formatting.
4. `MarketDashboard` owns local UI state for active workspace, filters, selected asset, and selected scenario.
5. When the user runs live LLM, `live-llm-client.ts` calls the local adapter.
6. `server/live-llm-server.mjs` calls DSA `POST /api/v1/analysis/market-review`, polls `GET /api/v1/analysis/status/{task_id}`, maps DSA output to `LlmMarketBrief`, and returns adapter JSON to the browser.
7. Presentational components render overview, AI brief, screener, asset memo, risk lab, scenario matrix, alert center, research queue, event calendar, chart, heatmap, table, metrics, and scenario details.

## Service Boundaries

The only backend service boundary is the optional local live LLM adapter.

Current frontend boundaries:

- Data validation boundary: `loadMarketSnapshot`.
- Live LLM browser boundary: `live-llm-client.ts`.
- DSA server boundary: `server/live-llm-server.mjs`.
- Domain calculation boundary: `analysis.ts`.
- UI composition boundary: `MarketDashboard`.
- Workbench component boundaries: `AiBriefing`, `AssetDetail`, `RiskLab`, `AlertCenter`, `AssetTable`, `ScenarioPanel`, `MarketPulseChart`, and `SectorHeatmap`.
- E2E boundary: browser flows in `e2e/market-dashboard.spec.ts`.
