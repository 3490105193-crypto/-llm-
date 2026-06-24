# Market Lens

Market Lens is a financial market analysis workspace for scanning market regime, macro signals, asset opportunity, sector breadth, and scenario risk.

The application is local-data first. It uses a validated seed market snapshot so the product can run without API keys, broker credentials, or paid real-time market data.

## Stack

- React
- TypeScript
- Vite
- Tailwind CSS
- zod
- Vitest and React Testing Library
- Playwright
- pnpm

## Scripts

```powershell
pnpm dev
pnpm lint
pnpm typecheck
pnpm format
pnpm test:coverage
pnpm build
pnpm audit:deps
pnpm e2e
pnpm quality
```

## AI-Native Workflow

- Project collaboration rules live in `AGENTS.md`.
- Repo memory lives in `docs/repo-memory.md`.
- Module boundaries live in `docs/module-map.md`.
- Architecture details live in `docs/architecture/`.
- Decision records live in `docs/decisions/`.
- Implementation patterns live in `docs/patterns/`.
- The project-local Codex skill lives in `.codex/skills/project-engineering-workflow/`.
