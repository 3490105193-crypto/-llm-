# 0004: Build Market Lens As A React Vite Frontend

Date: 2026-06-24

## Status

Accepted

## Context

The user asked for a strong market analysis app. The product goal is a fast local market research workspace, not a backend service, trading system, live data terminal, or authenticated multi-user app.

The preferred stack list includes Next.js, React, TypeScript, Tailwind, Vitest, Playwright, and zod. Next.js was considered first, but `next@latest` installation repeatedly stalled on large native packages in the local environment. The first product version does not need SSR, server actions, image optimization, routing complexity, or backend integration.

## Decision

Use React, TypeScript, Vite, Tailwind CSS, zod, Vitest, React Testing Library, Playwright, and pnpm.

Use a local seed market snapshot validated by zod. Keep backend, auth, database, live market data, and broker integration out of scope.

## Alternatives

- Next.js app router with React and Tailwind.
- Backend-first FastAPI or Node.js app.
- Static HTML without a package toolchain.
- Full data platform with database ingestion.

## Tradeoffs

Vite is simpler and faster for a frontend-only analytical workspace. It avoids unnecessary framework surface while preserving strong typing, tests, build verification, and e2e coverage.

The tradeoff is that future SSR, server-side data fetching, auth, or backend workflows would require adding a backend or migrating to a framework with server capabilities.

## Consequences

- CI runs pnpm install, quality gate, lint, typecheck, format, coverage, build, dependency audit, and Playwright e2e.
- `pnpm-workspace.yaml` forces Vite to patched `6.4.3` to keep dependency audit clean.
- Playwright uses installed Chrome locally on Windows when browser CDN download is unavailable; CI installs Chromium.
- Real market data requires a future data adapter and an ADR covering provider, licensing, freshness, retries, and validation.
