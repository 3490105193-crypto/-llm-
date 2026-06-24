---
name: project-engineering-workflow
description: Apply this repository's AI-native engineering workflow. Use when making or reviewing changes in this repo, updating architecture memory, adding tests or tooling, introducing frontend or backend code, configuring CI, or performing security and dependency audits.
---

# Project Engineering Workflow

## Overview

Use this skill to keep Codex work aligned with the repository contract in `AGENTS.md` and the durable memory in `docs/architecture/`.

## Workflow

1. Read `AGENTS.md`.
2. Clarify product goal, user scenarios, core workflow, success metrics, and non-goals before implementation.
3. Inspect the current file tree and relevant docs before editing.
4. Identify the detected stack and avoid inventing missing technologies.
5. State the plan for non-trivial work.
6. Make the smallest coherent change.
7. Update repo memory when architecture, tooling, modules, data flow, service boundaries, or constraints change.
8. Run `tools/ai-quality.ps1` and any stack-specific tests that exist.
9. Summarize what changed, why, validation run, and remaining risks.

## Current Stack Rules

As of baseline creation, this repo has no application source code, frontend, backend, database, package manager, or runtime-specific test runner.

Do not install Playwright, Vitest, Jest, pytest, or dependency audit tooling until the corresponding runtime exists. When a runtime is introduced, update `AGENTS.md`, `docs/architecture/module-map.md`, `docs/architecture/dependencies.md`, and CI in the same change.

Prefer simple, stable, mature, AI-friendly stack choices. Preferred options are Next.js, React, TypeScript, Tailwind, shadcn/ui, FastAPI or Node.js, PostgreSQL, Prisma or SQLAlchemy, Vitest or Jest, Playwright, pytest, zod, and pydantic when product requirements justify them.

## First Module Gate

When introducing the first real business module, add unit tests, lint, typecheck, formatter, coverage, and CI updates in the same change. Do not expand business code with a promise to add tests later.

## Required Checks

- Validate baseline structure with `tools/ai-quality.ps1`.
- Check for leaked secrets before finalizing changes.
- If source code exists, run the stack-specific lint, typecheck, unit test, e2e, and dependency audit commands documented in the repo.
- If those commands do not exist for new source code, add them before finishing the change.
- If frontend exists, Playwright smoke tests must cover app load, navigation, auth flow when present, and the key user path.

## Documentation Updates

Update docs when:

- New modules or service boundaries are added.
- Runtime, framework, package manager, database, or deployment decisions are made.
- Testing, security, CI, or release workflows change.
- Known constraints or technical debt items are resolved.

Keep docs concise and specific to the current repository state.

Primary memory paths are `docs/repo-memory.md` and `docs/module-map.md`. Keep the mirrored files under `docs/architecture/` synchronized.
