# Module Map

## Current Modules

| Path                                          | Purpose                                                       | Owner Boundary       |
| --------------------------------------------- | ------------------------------------------------------------- | -------------------- |
| `src/main.tsx`                                | React root bootstrap and error boundary mounting              | Frontend runtime     |
| `src/App.tsx`                                 | Application composition and snapshot loading                  | Frontend runtime     |
| `src/AppErrorBoundary.tsx`                    | Top-level render failure fallback                             | Frontend runtime     |
| `src/styles.css`                              | Tailwind layers and global app shell styling                  | Frontend UI          |
| `src/features/market/schemas.ts`              | zod schemas and inferred market domain types                  | Market domain        |
| `src/features/market/data/`                   | Validated seed market snapshot and loader                     | Market data adapter  |
| `src/features/market/analysis.ts`             | Market health, ranking, scoring, formatting, and signal logic | Market domain        |
| `src/features/market/components/`             | Dashboard, chart, table, heatmap, metric, and scenario UI     | Market UI            |
| `src/features/market/*.test.ts`               | Unit tests for market business logic                          | Application tests    |
| `src/features/market/components/*.test.tsx`   | Component tests for dashboard behavior and error states       | Application tests    |
| `e2e/market-dashboard.spec.ts`                | Playwright desktop/mobile smoke tests                         | Application tests    |
| `package.json`, `pnpm-lock.yaml`              | pnpm scripts and locked dependency graph                      | Tooling              |
| `pnpm-workspace.yaml`                         | pnpm build approval and Vite security override                | Tooling              |
| `vite.config.ts`, `vitest.config.ts`          | Frontend and unit test runtime configuration                  | Tooling              |
| `playwright.config.ts`                        | E2E configuration with local Chrome fallback                  | Tooling              |
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

1. `src/features/market/data/seed-market.ts` stores the current sample market snapshot.
2. `loadMarketSnapshot` validates unknown input with `MarketSnapshotSchema`.
3. `App` passes the validated snapshot to `MarketDashboard`.
4. `MarketDashboard` calculates market health, filtered ranking, selected asset, and active scenario state.
5. Presentational components render the chart, signals, sector heatmap, asset table, selected asset detail, and scenario panel.

## Service Boundaries

No backend service boundaries exist yet.

Current frontend boundaries:

- Data validation boundary: `loadMarketSnapshot`.
- Domain calculation boundary: `analysis.ts`.
- UI composition boundary: `MarketDashboard`.
- E2E boundary: browser flows in `e2e/market-dashboard.spec.ts`.

## Pending Modules

- Real market data adapter.
- Backend API if live data, auth, persistence, or multi-user workflows are required.
- Auth module if user accounts are introduced.
- Persistence module if watchlists or saved scenarios become user-specific.
