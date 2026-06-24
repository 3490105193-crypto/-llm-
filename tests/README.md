# Tests

This directory is reserved for cross-module unit and integration tests.

The frontend unit test runner is Vitest. Feature-local unit tests currently live next to the source under `src/`.

Run:

```powershell
pnpm test
pnpm test:coverage
```

Add tests for core business logic, validation, utility functions, API routes, database behavior, and auth flow when those surfaces exist.

Avoid snapshot-heavy tests and fragile implementation-detail tests.
