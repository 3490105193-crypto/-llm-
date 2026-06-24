# Repo Memory

Primary repo memory lives at `docs/repo-memory.md`. Keep this file synchronized with that path when architecture memory changes.

## Architecture Summary

The repository currently stores an AI-native engineering workflow baseline. It intentionally does not choose an application stack before product goals are clear.

Durable coordination files:

- `AGENTS.md`: contributor and agent operating rules.
- `docs/repo-memory.md`: primary durable repo memory.
- `docs/module-map.md`: primary module map and service boundary record.
- `docs/architecture/overview.md`: current architecture and evolution rules.
- `docs/architecture/module-map.md`: module ownership and boundaries.
- `docs/architecture/dependencies.md`: dependency inventory.
- `docs/architecture/risk-register.md`: active risks.
- `docs/architecture/technical-debt.md`: prioritized debt.
- `docs/decisions/`: architecture decision records.
- `docs/patterns/`: repeatable implementation patterns.

## Important Decisions

- Adopt documentation-first AI collaboration before application code.
- Defer runtime-specific test tooling until a runtime exists.
- Require product goal, user scenarios, core workflow, success metrics, and non-goals before implementation.
- Require the first application module to include unit testing, lint, typecheck, formatter, coverage, and CI updates.
- Use a lightweight PowerShell quality gate because the current local and CI environments can run `pwsh`.
- Keep Playwright reserved for a real frontend.
- Prefer simple, stable, mature, AI-friendly technology choices.

## Known Constraints

- The working directory was not a Git repository during baseline creation.
- The repository is now initialized on `main`.
- The default shell PATH did not include Git, Node, npm, pnpm, yarn, or a usable Python runtime.
- Codex desktop supplied bundled Git, Node, Python, and pnpm paths for local validation.
- There is no application code to lint, typecheck, test, or security-audit yet.
- Runtime-specific tooling must be added with the first source module.

## Future Agent Instructions

- Read `AGENTS.md` first.
- Read `docs/module-map.md` before editing or adding source files.
- Update repo memory whenever architecture, workflows, or module boundaries change.
- Add ADRs for important architecture choices.
- Prefer minimal stack-specific tooling over generic boilerplate.
- Run `tools/ai-quality.ps1` before finalizing changes.
