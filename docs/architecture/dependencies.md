# Dependency Analysis

## Application Dependencies

| Dependency            | Purpose                                      |
| --------------------- | -------------------------------------------- |
| `react` / `react-dom` | Frontend UI runtime                          |
| `vite`                | Frontend dev server and production build     |
| `typescript`          | Static typing                                |
| `tailwindcss`         | Styling system                               |
| `zod`                 | Runtime validation for market snapshot input |
| `lucide-react`        | UI icons                                     |
| `clsx`                | Conditional class composition                |

## Runtime Integration Dependencies

| Dependency                         | Purpose                                                            |
| ---------------------------------- | ------------------------------------------------------------------ |
| Node.js built-in `http`            | Runs the local live LLM adapter without adding server dependencies |
| `daily_stock_analysis` FastAPI app | External live broad-market LLM engine                              |

## Tooling Dependencies

| Tool                  | Current Use                                   | Required Now |
| --------------------- | --------------------------------------------- | ------------ |
| pnpm                  | Package manager and script runner             | Yes          |
| PowerShell / `pwsh`   | Runs `tools/ai-quality.ps1` locally and in CI | Yes          |
| GitHub Actions        | Runs quality, tests, build, audit, and e2e    | Yes          |
| Codex project skill   | Provides project workflow guidance            | Recommended  |
| Vitest                | Unit and component tests                      | Yes          |
| React Testing Library | Component behavior tests                      | Yes          |
| Playwright            | Desktop and mobile e2e smoke tests            | Yes          |
| Prettier              | Formatting gate                               | Yes          |
| ESLint                | Lint gate                                     | Yes          |
| Node.js               | Vite runtime and local live adapter           | Yes          |

## Dependency Rules

- Add dependencies only when product requirements justify them.
- Prefer one package manager per language ecosystem.
- Commit lockfiles once a package manager exists.
- Add dependency audit commands to CI in the same change that introduces dependencies.
- Document why a major framework or runtime is selected in `docs/decisions/`.
- Prefer simple, stable, mature, AI-friendly packages.
- Avoid abandoned packages and unnecessary dependencies.
- Treat critical and high vulnerabilities as priority work.

## Preferred Stack Options

These remain preferred options for future product work:

- Frontend: Next.js, React, TypeScript, Tailwind, shadcn/ui.
- Backend: FastAPI or Node.js.
- Database: PostgreSQL.
- ORM: Prisma or SQLAlchemy.
- Testing: Vitest or Jest, Playwright, pytest.
- Validation: zod or pydantic.

The current frontend uses React with Vite because the first product version is a frontend-only analytical workspace and does not need server-side framework capabilities.
