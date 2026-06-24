# AGENTS.md

This file is the operating contract for AI and human contributors working in this repository.

## Repository State

As of 2026-06-24, this repository contains an AI-native engineering baseline and no application source code.

Detected stack:

- Frontend: none detected.
- Backend: none detected.
- Database: none detected.
- Package manager: none detected.
- Test runner: none detected.
- GitHub Actions: configured for repository quality checks.

Do not invent a frontend, backend, database, package manager, or deployment target unless the task explicitly requires application functionality.

## Product Goal Gate

Before starting any implementation, clarify and record:

- Product goal.
- User scenarios.
- Core business workflow.
- Success metrics.
- Non-goals and out-of-scope work.

Do not code when the goal is unclear. Do not design complex architecture for guessed future requirements.

## Architecture

Current architecture is a documentation-first baseline:

- `AGENTS.md` defines contribution rules.
- `docs/repo-memory.md` is the primary durable repo memory.
- `docs/module-map.md` is the primary module and boundary map.
- `docs/architecture/` stores architecture details, risks, dependencies, and technical debt.
- `docs/decisions/` stores architecture decision records.
- `docs/patterns/` stores repeatable engineering patterns.
- `tests/` is reserved for unit and integration tests once a runtime exists.
- `e2e/` is reserved for Playwright tests once a frontend exists.
- `.codex/skills/project-engineering-workflow/` stores the project-local Codex workflow skill.
- `tools/ai-quality.ps1` validates the baseline structure and scans for obvious leaked secrets.

Every new application module must update `docs/module-map.md` and `docs/repo-memory.md` in the same change.

## Technology Stack Principles

Choose technology that is simple, stable, maintainable, AI-friendly, and community mature.

Preferred options when product requirements justify them:

- Frontend: Next.js, React, TypeScript, Tailwind, shadcn/ui.
- Backend: FastAPI or Node.js.
- Database: PostgreSQL.
- ORM: Prisma or SQLAlchemy.
- Testing: Vitest or Jest, Playwright, pytest.
- Validation: zod or pydantic.

Avoid:

- Premature microservices.
- Niche frameworks without strong community support.
- Unnecessary global state management.
- Unnecessary abstraction layers.

## First Application Module Rule

The first real business module must include the engineering toolchain in the same change:

- Unit test framework.
- Lint.
- Typecheck.
- Formatter.
- Coverage command.
- CI workflow that can run locally and in GitHub Actions.

Minimum frontend test stack:

- Vitest or Jest.
- React Testing Library when React is used.

Minimum backend test stack:

- pytest for Python.
- Jest or an equivalent mature runner for Node.js.

Do not expand business code with a promise to add tests later.

## Coding Rules

- Prefer explicit, readable code over cleverness.
- Avoid magic, deep nesting, giant files, and giant functions.
- Keep files focused and functions small.
- Add abstractions only when they remove real duplication or isolate a stable boundary.
- Use strong typing when the selected language supports it.
- Validate all external input at system boundaries.
- Remove dead code when it is clearly unused.
- Optimize only when necessary and measured.
- Keep generated code, build artifacts, and dependency folders out of version control.
- Do not add broad rewrites alongside feature work unless the task is explicitly refactoring.

## Frontend Rules

No frontend exists yet. When one is introduced:

- Install and configure Playwright.
- Add smoke tests under `e2e/`.
- Test that the app loads, navigation works, auth flow works if auth exists, and the key user path works.
- Use mobile-first layout.
- Meet accessibility basics: semantic HTML, visible focus states, labels for inputs, keyboard navigation, and sufficient contrast.
- Provide loading, empty, and error states for user-facing async flows.
- Avoid obvious layout shift.
- Keep spacing consistent through shared tokens or a small layout scale.
- Avoid unnecessary re-renders with stable props, local state boundaries, and measured memoization.

Do not ship only happy-path UI. Do not add user-facing async UI without loading and error states.

## Backend Rules

No backend exists yet. When one is introduced:

- Validate request bodies, params, headers, query strings, and environment variables.
- Use schema validation at boundaries.
- Add auth tests when auth exists.
- Add error handling tests.
- Use structured logging at service boundaries.
- Return typed, consistent errors without leaking secrets or stack traces to clients.
- Keep operations retry-safe where network, queues, payments, or writes are involved.
- Separate transport, validation, service, persistence, and integration boundaries.

Do not trust client state. Do not swallow failures silently. Do not use generic catches without logging and typed error handling.

## Testing Strategy

Current state:

- `tools/ai-quality.ps1` is the only runnable quality gate.
- `tests/` and `e2e/` are placeholders because there is no application runtime.

Once application code exists, tests must continuously protect:

- Core business logic.
- Validation.
- Utility functions.
- Database access where applicable.
- API routes where applicable.
- Auth flow where applicable.
- Critical user paths.

Avoid snapshot-heavy tests that do not assert behavior. Avoid fragile tests tied to implementation details.

## Dependency Audit

When dependencies are introduced:

- Enable the relevant audit command in CI.
- Use `npm audit`, `pnpm audit`, `yarn npm audit`, `pip-audit`, or another documented project-approved scanner.
- Treat critical and high vulnerabilities as priority work.
- Avoid abandoned packages.
- Reduce dependency count and prefer mature community packages.

## Security Rules

- Treat all input as untrusted.
- Sanitize and validate schemas at boundaries.
- Protect secrets and never commit real `.env` files.
- Provide `.env.example` when environment variables become required.
- Avoid leaking stack traces, credentials, tokens, cookies, personal data, or raw request bodies.
- Use least privilege for tokens, database access, and service accounts.
- Check for auth bypass, injection risks, insecure dependencies, and secret exposure.
- Fail closed for authentication and authorization.
- Run `tools/ai-quality.ps1` before proposing a change.

## CI/CD Rules

Current CI runs the baseline quality gate. When application code exists, CI must include:

- Lint.
- Typecheck.
- Tests.
- Coverage command.
- Build verification.
- Dependency audit.
- Playwright e2e when a frontend exists.

Pull requests must not break tests, reduce meaningful coverage without explanation, or introduce obvious security risks.

## Repo Memory Rules

Keep these paths current:

- `docs/module-map.md`
- `docs/repo-memory.md`
- `docs/architecture/`
- `docs/decisions/`

Record:

- Module responsibilities.
- Data flow.
- Service boundaries.
- Important patterns.
- Constraints.
- Known risks.

## ADR Rules

Record important architecture decisions in `docs/decisions/` using:

- Context.
- Decision.
- Alternatives.
- Tradeoffs.
- Consequences.

ADR-triggering changes include framework, database, auth, caching, deployment, major testing, and security strategy changes.

## PR Rules

Every PR or AI-authored change should include:

- What changed.
- Why it changed.
- Tests or validation run.
- User-facing or operational risks.
- Architecture memory updates when module boundaries or workflows change.

## Refactoring Principles

- Refactor in small, reviewable steps.
- Preserve behavior unless the change explicitly modifies behavior.
- Prefer characterization tests before changing unclear code.
- Keep public interfaces stable unless the migration is documented.
- Do not combine unrelated cleanup with feature delivery.

## AI Collaboration Rules

- Keep changes small and scoped.
- Explain reasoning before meaningful implementation.
- Preserve architecture consistency.
- Prefer predictable patterns and deterministic workflows.
- Update `docs/module-map.md`, `docs/repo-memory.md`, and ADRs when needed.
- Make the repository easy for future AI agents to understand, modify, and evolve.

