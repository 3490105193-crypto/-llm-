# Module Map

## Current Modules

| Path | Purpose | Owner Boundary |
| --- | --- | --- |
| `AGENTS.md` | Repo-level AI and contributor rules | Engineering workflow |
| `docs/repo-memory.md` | Primary durable repo memory | Architecture |
| `docs/module-map.md` | Primary module map and boundaries | Architecture |
| `.codex/skills/project-engineering-workflow/` | Project-local Codex workflow skill | AI workflow |
| `docs/architecture/` | Architecture details, risks, dependencies, and technical debt | Architecture |
| `docs/decisions/` | Architecture decision records | Architecture |
| `docs/patterns/` | Reusable engineering patterns | Engineering workflow |
| `tools/ai-quality.ps1` | Lightweight validation and secret scan | Engineering workflow |
| `tests/` | Future unit and integration tests | Application tests |
| `e2e/` | Future frontend e2e tests | Application tests |
| `.github/workflows/ci.yml` | CI quality gate | Automation |

## Data Flow

No application data flow exists yet.

When data flow is introduced, document:

- Source.
- Validation boundary.
- Transformation.
- Persistence.
- External integrations.
- Security constraints.

## Service Boundaries

No service boundaries exist yet.

When a service boundary is introduced, document:

- Interface.
- Owned data.
- Side effects.
- Retry and idempotency behavior.
- Auth and authorization assumptions.
- Tests that protect the boundary.

## Pending Modules

No application modules exist yet.

When a module is added, record:

- Module path.
- Runtime or framework.
- Public entry points.
- Owned data or side effects.
- Tests that protect it.
- Security boundaries.

