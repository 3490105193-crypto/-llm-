# AI Engineering Workflow

Use this workflow for every non-trivial change:

1. Read `AGENTS.md`.
2. Clarify product goal, user scenarios, core workflow, success metrics, and non-goals before implementation.
3. Inspect the current file tree and relevant docs.
4. State the current architecture, risks, and plan.
5. Make the smallest coherent change.
6. Update repo memory and decision records when boundaries change.
7. Run available validation.
8. Summarize changes, risks, and next steps.

## Change Size

Prefer small changes with one reason to exist. If a task requires multiple concerns, split the work by documentation, tooling, source, and tests.

## Memory Updates

Update `docs/architecture/repo-memory.md` when:

- A runtime is selected.
- A module or service boundary is added.
- A test framework is introduced.
- A security or deployment workflow changes.
- A known constraint is removed.

Also update the primary memory files:

- `docs/repo-memory.md`
- `docs/module-map.md`
