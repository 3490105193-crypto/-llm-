# AI Engineering Workflow

Use this workflow for every non-trivial change:

1. Read `AGENTS.md`.
2. Inspect the current file tree and relevant docs.
3. State the current architecture, risks, and plan.
4. Make the smallest coherent change.
5. Update repo memory and decision records when boundaries change.
6. Run available validation.
7. Summarize changes, risks, and next steps.

## Change Size

Prefer small changes with one reason to exist. If a task requires multiple concerns, split the work by documentation, tooling, source, and tests.

## Memory Updates

Update `docs/architecture/repo-memory.md` when:

- A runtime is selected.
- A module or service boundary is added.
- A test framework is introduced.
- A security or deployment workflow changes.
- A known constraint is removed.

