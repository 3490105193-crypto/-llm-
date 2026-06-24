# Technical Debt

## Prioritized Debt

1. Confirm Git, Node, Python, and the selected package manager are available in the standard developer PATH outside the Codex bundled runtime.
2. Confirm product goal, user scenarios, core workflow, success metrics, and non-goals before choosing a stack.
3. Add the first runtime-specific test runner, lint, typecheck, formatter, coverage, and CI updates with the first source module.
4. Add Playwright when a frontend route exists.
5. Add dependency vulnerability auditing when dependencies exist.
6. Replace placeholder `tests/` and `e2e/` docs with executable tests.

## Not Debt

- Absence of Playwright is not debt until a frontend exists.
- Absence of Vitest, Jest, or pytest is not debt until application code exists.
- Absence of database tooling is not debt until persistent data is required.
