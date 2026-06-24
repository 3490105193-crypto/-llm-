# Technical Debt

## Prioritized Debt

1. Initialize a real Git repository and confirm Git is available in PATH.
2. Select an application stack only after product requirements are known.
3. Add the first runtime-specific test runner with the first source module.
4. Add Playwright when a frontend route exists.
5. Add dependency vulnerability auditing when dependencies exist.
6. Add linting and typechecking when a language stack exists.
7. Replace placeholder `tests/` and `e2e/` docs with executable tests.

## Not Debt

- Absence of Playwright is not debt until a frontend exists.
- Absence of Vitest, Jest, or pytest is not debt until application code exists.
- Absence of database tooling is not debt until persistent data is required.

