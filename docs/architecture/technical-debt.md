# Technical Debt

## Prioritized Debt

1. Confirm Git, Node, Python, and pnpm are available in the standard developer PATH outside the Codex bundled runtime.
2. Add a real market data adapter once provider, licensing, freshness, and retry requirements are clear.
3. Add persistence for saved watchlists and scenarios if user-specific workflows become required.
4. Add auth only when protected user data exists.
5. Add backend API boundaries if live data, scheduled ingestion, or multi-user workflows are required.
6. Add stronger coverage thresholds after the feature surface grows.

## Not Debt

- Absence of database tooling is not debt until persistent data is required.
- Absence of auth is not debt until user-specific protected data exists.
- Absence of a backend is not debt while the product remains a local market analysis workspace.
