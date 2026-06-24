# 0002: Defer Runtime-Specific Test Tooling

Date: 2026-06-24

## Status

Accepted

## Context

No frontend, backend, package manager, or application runtime exists. Installing Playwright, Vitest, Jest, pytest, or coverage tooling would create an unsupported stack assumption.

## Decision

Use `tools/ai-quality.ps1` as the initial quality gate. Defer runtime-specific tools until source code exists.

## Alternatives

- Install Playwright, Vitest, Jest, pytest, and audit tools immediately.
- Leave the repository without any automated validation.

## Tradeoffs

Deferring runtime tooling avoids unsupported stack assumptions. The tradeoff is that the repository currently validates structure and obvious secrets, not application behavior.

## Consequences

- CI can validate baseline structure immediately.
- Future code changes must add their own lint, typecheck, test, coverage, and dependency audit scripts.
- Playwright must be installed with the first frontend route.
