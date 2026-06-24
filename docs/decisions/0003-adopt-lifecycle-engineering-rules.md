# 0003: Adopt Lifecycle Engineering Rules

Date: 2026-06-24

## Status

Accepted

## Context

The project needs durable rules that keep AI-assisted work product-led, test-backed, secure, and maintainable over the full repository lifecycle.

## Decision

Adopt lifecycle engineering rules in `AGENTS.md`, `docs/repo-memory.md`, `docs/module-map.md`, and the project Codex skill. These rules require product goal clarification before implementation, simple mature stack choices, first-module tooling, continuous testing, dependency audits, security review, ADRs, and repo memory maintenance.

## Alternatives

- Keep rules only in the conversation context.
- Keep only the original baseline rules without product and lifecycle gates.
- Add heavy project scaffolding before product requirements exist.

## Tradeoffs

Persisting rules in repo documents makes future AI work more deterministic and reviewable. It adds documentation maintenance overhead, but avoids implicit process knowledge and premature framework selection.

## Consequences

- Future changes must update repo memory and module maps when boundaries change.
- The first business module must include lint, typecheck, formatter, tests, coverage, and CI updates.
- Playwright and dependency audit tooling remain deferred until a matching runtime exists.
