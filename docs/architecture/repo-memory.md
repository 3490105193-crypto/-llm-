# Repo Memory

## Architecture Summary

The repository currently stores an AI-native engineering workflow baseline. It intentionally does not choose an application stack.

Durable coordination files:

- `AGENTS.md`: contributor and agent operating rules.
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
- Use a lightweight PowerShell quality gate because the current local and CI environments can run `pwsh`.
- Keep Playwright reserved for a real frontend.

## Known Constraints

- The working directory was not a Git repository during baseline creation.
- The default shell PATH did not include Git, Node, npm, pnpm, yarn, or a usable Python runtime.
- Codex desktop supplied bundled Git, Node, Python, and pnpm paths for local validation.
- There is no application code to lint, typecheck, test, or security-audit yet.

## Future Agent Instructions

- Read `AGENTS.md` first.
- Read `docs/architecture/module-map.md` before editing or adding source files.
- Update repo memory whenever architecture, workflows, or module boundaries change.
- Prefer minimal stack-specific tooling over generic boilerplate.
- Run `tools/ai-quality.ps1` before finalizing changes.

