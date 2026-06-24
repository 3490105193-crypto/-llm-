# 0001: Adopt AI-Native Baseline Before Application Code

Date: 2026-06-24

## Status

Accepted

## Context

The workspace did not contain application source code, a package manager, a Git repository, CI, tests, or architecture documentation.

## Decision

Create an AI-native baseline before selecting an application stack. The baseline includes:

- `AGENTS.md`
- Architecture memory
- Decision records
- Engineering patterns
- Test placeholders
- A lightweight quality gate
- A project-local Codex skill

## Alternatives

- Start with a full application framework immediately.
- Keep the repository empty until product requirements are clearer.

## Tradeoffs

The baseline improves future AI collaboration and avoids premature stack lock-in. It does not provide application behavior or runtime-specific tests yet.

## Consequences

- Future agents can understand the project before code exists.
- The repository avoids unnecessary framework boilerplate.
- Stack-specific quality tools must be added later with the first real application module.
