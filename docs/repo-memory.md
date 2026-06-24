# Repo Memory

## Architecture Summary

The repository currently stores an AI-native engineering workflow baseline. It intentionally does not choose an application stack before product goals are clear.

Current layers:

- Collaboration contract: `AGENTS.md`.
- Repo memory: `docs/repo-memory.md`.
- Module map: `docs/module-map.md`.
- Architecture details: `docs/architecture/`.
- Decisions: `docs/decisions/`.
- Patterns: `docs/patterns/`.
- Quality gate: `tools/ai-quality.ps1`.
- Project Codex workflow skill: `.codex/skills/project-engineering-workflow/`.

## Product Gate

Before implementation, clarify:

- Product goal.
- User scenarios.
- Core business workflow.
- Success metrics.
- Non-goals.

Do not code through unclear product intent.

## Important Decisions

- Adopt documentation-first AI collaboration before application code.
- Defer runtime-specific test tooling until a runtime exists.
- Require the first application module to include unit testing, lint, typecheck, formatter, coverage, and CI updates.
- Keep Playwright reserved for the first real frontend.
- Prefer simple, stable, mature, AI-friendly technology choices.

## Preferred Stack Options

- Frontend: Next.js, React, TypeScript, Tailwind, shadcn/ui.
- Backend: FastAPI or Node.js.
- Database: PostgreSQL.
- ORM: Prisma or SQLAlchemy.
- Testing: Vitest or Jest, Playwright, pytest.
- Validation: zod or pydantic.

These are preferences, not current dependencies.

## Known Constraints

- There is no application code to lint, typecheck, test, build, or security-audit yet.
- No package manager is selected yet.
- Runtime-specific tooling must be added with the first source module.
- The repository is initialized on `main`.
- The local shell PATH originally lacked common developer tools; Codex desktop bundled Git, Node, Python, and pnpm were used for setup and validation.

## Future Agent Instructions

- Read `AGENTS.md` first.
- Read `docs/module-map.md` before editing or adding source files.
- Update repo memory whenever architecture, workflows, modules, data flow, constraints, or risks change.
- Add ADRs for important architecture choices.
- Run `tools/ai-quality.ps1` before finalizing changes.
