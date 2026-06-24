# Tests

This directory is reserved for unit and integration tests.

No test runner is configured because no application runtime exists yet.

When application code is added:

- Choose the runner that matches the stack.
- Add runnable scripts to the package or project config.
- Add coverage once meaningful tests exist.
- Keep tests focused on behavior and boundaries.
- Cover core business logic, validation, utility functions, API routes, database behavior, and auth flow when those surfaces exist.
- Avoid snapshot-heavy tests and fragile implementation-detail tests.
