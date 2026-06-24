# Technical Debt

## Prioritized Debt

1. Confirm Git, Node, Python, and pnpm are available in the standard developer PATH outside the Codex bundled runtime.
2. Add a real market data adapter once provider, licensing, freshness, and retry requirements are clear.
3. Add persistence for saved screens, research tasks, alert acknowledgements, and scenarios if user-specific workflows become required.
4. Add auth only when protected user data exists.
5. Add production backend API boundaries if live data, scheduled ingestion, auth, persistence, or multi-user workflows are required.
6. Add a formal DSA output contract or fixture suite so live LLM payload mapping is less heuristic.
7. Add observability for the live adapter if it becomes long-running or shared by multiple users.
8. Add a formal risk-model adapter only if certified risk, VaR, factor model, or portfolio accounting requirements appear.
9. Add stronger coverage thresholds after the feature surface grows.

## Not Debt

- Absence of database tooling is not debt until persistent data is required.
- Absence of auth is not debt until user-specific protected data exists.
- Absence of a general backend is not debt while the product remains a local market analysis workspace.
- The local DSA adapter is intentionally small and not a production multi-user backend.
