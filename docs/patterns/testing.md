# Testing Pattern

## Current Gate

Run:

```powershell
./tools/ai-quality.ps1
```

This validates the AI-native baseline and scans for obvious leaked secrets.

## When JavaScript or TypeScript Is Added

- Add Vitest unless the selected framework standardizes on Jest.
- Add package scripts for `test`, `test:coverage`, `lint`, and `typecheck`.
- Keep unit tests near behavior and avoid testing implementation details.
- Add coverage thresholds only after meaningful tests exist.

## When Python Is Added

- Add pytest.
- Add coverage with `pytest-cov`.
- Test validation, error handling, and side effects.

## When Frontend Is Added

- Install Playwright.
- Add smoke tests under `e2e/`.
- Cover the primary route, loading state, and one error path.

