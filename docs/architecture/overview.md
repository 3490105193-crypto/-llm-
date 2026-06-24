# Architecture Overview

## Current State

This repository is an empty application workspace with an AI-native engineering baseline. No application runtime, package manager, frontend, backend, database, or deployment target has been selected.

## Baseline Architecture

The current architecture has four layers:

1. Collaboration contract: `AGENTS.md`.
2. Durable memory: `docs/repo-memory.md`, `docs/module-map.md`, `docs/architecture/`, `docs/decisions/`, and `docs/patterns/`.
3. Automation: `tools/ai-quality.ps1` and `.github/workflows/ci.yml`.
4. Test placeholders: `tests/` and `e2e/`.

## Product Discovery Gate

Before implementation, clarify product goal, user scenarios, core business workflow, success metrics, and non-goals. Do not introduce architecture for guessed future requirements.

## Non-Goals

- Do not install Playwright until a frontend exists.
- Do not install Vitest, Jest, pytest, or coverage tooling until application code exists.
- Do not create a backend, database, or deployment target without product requirements.
- Do not add framework boilerplate only to satisfy tooling checklists.

## Evolution Rules

When application code is introduced:

- Confirm the product goal and user workflow first.
- Add unit testing, lint, typecheck, formatter, coverage, and CI updates with the first business module.
- Prefer simple, stable, mature, AI-friendly stack choices.
- Update `docs/module-map.md` and `docs/repo-memory.md`.
- Update `docs/architecture/module-map.md`.
- Add an architecture decision record in `docs/decisions/`.
- Add focused tests in `tests/` or `e2e/`.
- Extend CI to run lint, typecheck, tests, and dependency audit for the selected stack.
- Update `AGENTS.md` with stack-specific rules.
