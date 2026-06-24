# Repo Memory

Primary repo memory lives at `docs/repo-memory.md`. Keep this file synchronized with that path when architecture memory changes.

## Architecture Summary

Market Lens Pro is a financial market analysis workbench built with React, TypeScript, Vite, Tailwind CSS, zod, Vitest, React Testing Library, Playwright, and pnpm. It includes an optional local Node.js adapter for live broad-market LLM review through `daily_stock_analysis`.

The product currently supports overview, AI brief, screener, asset memo, portfolio risk lab, scenario matrix, alert center, research queue, and event calendar workflows over a validated sample snapshot. When DSA and the adapter are running, AI Brief can replace the sample brief with a live DSA market-review result.

Durable coordination files:

- `AGENTS.md`: contributor and agent operating rules.
- `docs/repo-memory.md`: primary durable repo memory.
- `docs/module-map.md`: primary module map and service boundary record.
- `docs/architecture/product-goals.md`: product goal, user scenarios, workflow, success metrics, and non-goals.
- `docs/architecture/overview.md`: current architecture and evolution rules.
- `docs/architecture/module-map.md`: mirrored module ownership and boundaries.
- `docs/architecture/dependencies.md`: dependency inventory.
- `docs/architecture/risk-register.md`: active risks.
- `docs/architecture/technical-debt.md`: prioritized debt.
- `docs/decisions/`: architecture decision records.
- `docs/patterns/`: repeatable implementation patterns.

## Important Decisions

- Adopt documentation-first AI collaboration before application code.
- Build Market Lens as a frontend-only React/Vite app because the first product version does not need backend or SSR capabilities.
- Validate market input with zod before rendering or analysis.
- Mature the product by deepening the frontend research workflow before adding backend, live data, auth, or persistence.
- Add an LLM market brief contract inspired by `3490105193-crypto/daily_stock_analysis`; keep real LLM execution server-side.
- Add a local server-side DSA adapter so live market-review tasks can run without exposing LLM provider keys in browser code.
- Use Vitest, React Testing Library, and Playwright from the first business module.
- Force Vite to patched `6.4.3` through pnpm override to keep dependency audit clean.
- Use installed Chrome for local Playwright runs on Windows when browser CDN download is unavailable; CI installs Playwright Chromium.

## Known Constraints

- Market data is static validated sample data and must not be treated as live or investment advice.
- Portfolio risk and scenario stress are deterministic front-end analytics over sample positions, not regulated risk certification or portfolio accounting.
- LLM market brief data starts as a validated sample contract and can be replaced by a live DSA result through the local adapter.
- No persistence, auth, broker integration, general backend API, or production market data adapter exists.
- The live DSA adapter maps partial markdown or structured payloads heuristically; a stronger DSA output contract would improve fidelity.
- The repository is initialized on `main`.
- The default shell PATH did not include Git, Node, npm, pnpm, yarn, or a usable Python runtime.
- Codex desktop supplied bundled Git, Node, Python, and pnpm paths for setup and validation.

## Future Agent Instructions

- Read `AGENTS.md` first.
- Read `docs/module-map.md` before editing or adding source files.
- Update repo memory whenever architecture, workflows, modules, data flow, constraints, or risks change.
- Add ADRs for important architecture choices.
- Prefer minimal stack-specific tooling over generic boilerplate.
- Run `tools/ai-quality.ps1` and all package scripts before finalizing changes.
