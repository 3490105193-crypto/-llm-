# Market Lens

Market Lens is a financial market analysis workspace for scanning market regime, macro signals, asset opportunity, sector breadth, and scenario risk.

The application is local-data first. It uses a validated seed market snapshot so the product can run without API keys, broker credentials, or paid real-time market data.

Live LLM market review is available through an optional local adapter for `daily_stock_analysis`. The browser calls the local adapter, and the adapter calls the DSA FastAPI service. LLM provider credentials and paid data keys stay in `daily_stock_analysis`, not in the Vite frontend.

See `docs/features.md` for a Chinese feature walkthrough.

## Stack

- React
- TypeScript
- Vite
- Tailwind CSS
- zod
- Vitest and React Testing Library
- Playwright
- pnpm
- Optional live adapter: Node.js built-in `http`
- Optional LLM engine: `3490105193-crypto/daily_stock_analysis`

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

## Live LLM Setup

Run the three processes separately:

```powershell
# 1. In the daily_stock_analysis repository
python main.py --serve-only

# 2. In this repository
pnpm dev:live-api

# 3. In this repository
pnpm dev
```

Default endpoints:

- Frontend: `http://127.0.0.1:5173`
- Market Lens live adapter: `http://127.0.0.1:8787`
- daily_stock_analysis FastAPI: `http://127.0.0.1:8000`

Environment variables are documented in `.env.example`. Use `VITE_LIVE_LLM_API_BASE` for the browser-to-adapter URL and `DSA_BASE_URL` for the adapter-to-DSA URL.

## AI-Native Workflow

- Project collaboration rules live in `AGENTS.md`.
- Repo memory lives in `docs/repo-memory.md`.
- Module boundaries live in `docs/module-map.md`.
- Architecture details live in `docs/architecture/`.
- Decision records live in `docs/decisions/`.
- Implementation patterns live in `docs/patterns/`.
- The project-local Codex skill lives in `.codex/skills/project-engineering-workflow/`.
