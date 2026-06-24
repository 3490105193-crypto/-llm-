---
name: project-engineering-workflow
description: Apply this repository's AI-native engineering workflow. Use when making or reviewing changes in this repo, updating architecture memory, adding tests or tooling, introducing frontend or backend code, configuring CI, or performing security and dependency audits.
---

# Project Engineering Workflow

## Overview

Use this skill to keep Codex work aligned with the repository contract in `AGENTS.md` and the durable memory in `docs/architecture/`.

## Workflow

1. Read `AGENTS.md`.
2. Inspect the current file tree and relevant docs before editing.
3. Identify the detected stack and avoid inventing missing technologies.
4. State the plan for non-trivial work.
5. Make the smallest coherent change.
6. Update repo memory when architecture, tooling, modules, or constraints change.
7. Run `tools/ai-quality.ps1` and any stack-specific tests that exist.
8. Summarize what changed, why, validation run, and remaining risks.

## Current Stack Rules

As of baseline creation, this repo has no application source code, frontend, backend, database, package manager, or runtime-specific test runner.

Do not install Playwright, Vitest, Jest, pytest, or dependency audit tooling until the corresponding runtime exists. When a runtime is introduced, update `AGENTS.md`, `docs/architecture/module-map.md`, `docs/architecture/dependencies.md`, and CI in the same change.

## Required Checks

- Validate baseline structure with `tools/ai-quality.ps1`.
- Check for leaked secrets before finalizing changes.
- If source code exists, run the stack-specific lint, typecheck, unit test, e2e, and dependency audit commands documented in the repo.
- If those commands do not exist for new source code, add them before finishing the change.

## Documentation Updates

Update docs when:

- New modules or service boundaries are added.
- Runtime, framework, package manager, database, or deployment decisions are made.
- Testing, security, CI, or release workflows change.
- Known constraints or technical debt items are resolved.

Keep docs concise and specific to the current repository state.
