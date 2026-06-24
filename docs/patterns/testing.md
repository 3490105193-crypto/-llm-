# Testing Pattern

## Current Gates

Run:

```powershell
pnpm quality
pnpm lint
pnpm typecheck
pnpm format
pnpm test:coverage
pnpm build
pnpm audit:deps
pnpm e2e
```

`pnpm quality` validates the AI-native baseline and scans for obvious leaked secrets. Package scripts protect the React/Vite application. `server/live-llm-server.test.mjs` protects live DSA adapter mapping without requiring a running DSA service.

## Unit And Component Tests

- Use Vitest.
- Use React Testing Library for React components.
- Keep unit tests near feature code under `src/`.
- Test business behavior, validation, filtering, scoring, and error states.
- Avoid snapshot-heavy tests and implementation-detail tests.
- For live adapter code, test task status normalization and payload mapping with fixtures instead of calling real LLM providers.

## E2E Tests

- Use Playwright.
- Keep smoke tests under `e2e/`.
- Cover app load, navigation, and the key market analysis path.
- Add auth coverage when auth exists.
- Keep desktop and mobile coverage.

## Future Backend Tests

When Python is added:

- Add pytest.
- Add coverage with `pytest-cov`.
- Test validation, error handling, and side effects.

When Node backend code is added:

- Add a mature test runner.
- Test validation, API routes, auth flow, persistence, and retry-sensitive operations.

The current local live adapter uses Vitest because it is small, dependency-light, and shares the existing JavaScript quality gate.

## First Business Module Gate

The first real business module has added unit testing, lint, typecheck, formatter, coverage, build verification, dependency audit, CI updates, and Playwright smoke tests. Preserve these gates.
