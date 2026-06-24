# Dependency Analysis

## Application Dependencies

None detected.

## Tooling Dependencies

| Tool | Current Use | Required Now |
| --- | --- | --- |
| PowerShell / `pwsh` | Runs `tools/ai-quality.ps1` locally and in CI | Yes |
| GitHub Actions | Runs baseline quality gate | Optional until repository is hosted |
| Codex project skill | Provides project workflow guidance | Optional but recommended |
| Playwright | Future frontend e2e testing | No |
| Vitest or Jest | Future JavaScript or TypeScript unit testing | No |
| pytest | Future Python unit testing | No |

## Dependency Rules

- Add dependencies only after the runtime or framework is selected.
- Prefer one package manager per language ecosystem.
- Commit lockfiles once a package manager exists.
- Add dependency audit commands to CI in the same change that introduces dependencies.
- Document why a major framework or runtime is selected in `docs/decisions/`.
- Prefer simple, stable, mature, AI-friendly packages.
- Avoid abandoned packages and unnecessary dependencies.
- Treat critical and high vulnerabilities as priority work.

## Preferred Stack Options

These are preferred options for future product work, not current dependencies:

- Frontend: Next.js, React, TypeScript, Tailwind, shadcn/ui.
- Backend: FastAPI or Node.js.
- Database: PostgreSQL.
- ORM: Prisma or SQLAlchemy.
- Testing: Vitest or Jest, Playwright, pytest.
- Validation: zod or pydantic.
