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

Do not invent a frontend, backend, database, or package manager unless the task explicitly requires building application functionality.

## Architecture

Current architecture is a documentation-first baseline:

- `AGENTS.md` defines contribution rules.
- `docs/architecture/` stores durable repo memory, module maps, risks, dependencies, and technical debt.
- `docs/decisions/` stores architecture decision records.
- `docs/patterns/` stores repeatable engineering patterns.
- `tests/` is reserved for unit and integration tests once a runtime exists.
- `e2e/` is reserved for Playwright or equivalent end-to-end tests once a frontend exists.
- `.codex/skills/project-engineering-workflow/` stores the project-local Codex workflow skill.
- `tools/ai-quality.ps1` validates the baseline structure and scans for obvious leaked secrets.

Every new application module must update `docs/architecture/module-map.md` in the same change.

## Coding Rules

- Prefer readable, explicit code over cleverness.
- Keep files focused and avoid giant functions.
- Add abstractions only when they remove real duplication or isolate a stable boundary.
- Use strong typing when the selected language supports it.
- Validate all external input at system boundaries.
- Keep generated code, build artifacts, and dependency folders out of version control.
- Do not add broad rewrites alongside feature work unless the task is explicitly refactoring.

## Frontend Rules

No frontend exists yet. When one is introduced:

- Use a mobile-first layout.
- Meet accessibility basics: semantic HTML, visible focus states, labels for inputs, keyboard navigation, and sufficient contrast.
- Provide loading, empty, and error states for user-facing async flows.
- Keep spacing consistent through shared tokens or a small layout scale.
- Avoid unnecessary re-renders with stable props, local state boundaries, and measured memoization.
- Add Playwright smoke tests for the primary route before merging.
- Update `e2e/README.md` and CI scripts in the same change.

## Backend Rules

No backend exists yet. When one is introduced:

- Validate request payloads, route params, query strings, headers, and environment configuration.
- Use structured logging at service boundaries.
- Return typed, consistent errors without leaking secrets or stack traces to clients.
- Keep operations retry-safe where network, queues, payments, or writes are involved.
- Separate transport, validation, service, persistence, and integration boundaries.
- Add tests for validation, authorization, error handling, and idempotency-sensitive paths.

## Testing Strategy

Current state:

- `tools/ai-quality.ps1` is the only runnable quality gate.
- `tests/` and `e2e/` are placeholders because there is no application runtime.

When JavaScript or TypeScript application code is added:

- Prefer Vitest for unit tests unless the framework already standardizes on Jest.
- Add `test`, `test:coverage`, `lint`, and `typecheck` package scripts.
- Add coverage thresholds only after meaningful tests exist.

When Python application code is added:

- Prefer pytest.
- Add coverage with `pytest-cov` once modules exist.

When a frontend is added:

- Install and configure Playwright.
- Put smoke tests under `e2e/`.
- Test the first meaningful user path, not only page load.

## Security Rules

- Never commit secrets, credentials, private keys, production tokens, or real `.env` files.
- Provide `.env.example` when environment variables become required.
- Treat all external input as untrusted.
- Keep dependency audit commands documented with the selected package manager.
- Fail closed for authentication and authorization.
- Avoid logging tokens, cookies, credentials, personal data, or raw request bodies.
- Run `tools/ai-quality.ps1` before proposing a change.

## PR Rules

Every PR or AI-authored change should include:

- What changed.
- Why it changed.
- Tests or validation run.
- User-facing or operational risks.
- Architecture memory updates when module boundaries or workflows change.

Do not merge changes that add application code without a matching test strategy.

## Refactoring Principles

- Refactor in small, reviewable steps.
- Preserve behavior unless the change explicitly modifies behavior.
- Prefer characterization tests before changing unclear code.
- Keep public interfaces stable unless the migration is documented.
- Do not combine unrelated cleanup with feature delivery.

