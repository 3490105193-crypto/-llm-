# Product Goals

## Product Goal

Market Lens helps a research user quickly evaluate market regime, opportunity, and risk from a single dashboard.

## User Scenarios

- Pre-market scan of regime, breadth, and alerts.
- Watchlist filtering by symbol, company, sector, or asset category.
- Asset review with thesis, catalysts, score, risk, and watch flags.
- Scenario comparison across base, upside, and downside market paths.

## Core Business Workflow

1. Validate market snapshot input.
2. Calculate market health and asset ranking.
3. Render market pulse, macro signals, sector breadth, watchlist, selected asset detail, and scenarios.
4. Let the user filter, navigate, select, and compare without credentials.

## Success Metrics

- Runs locally without API keys.
- Renders key market state on first screen.
- Unit tests protect scoring and filtering.
- E2E tests protect app load, navigation, and asset selection on desktop and mobile.
- Dependency audit has no high or critical findings.

## Non-Goals

- No trading or broker connection.
- No investment advice.
- No live market data feed.
- No auth, backend, persistence, or multi-tenant workflows.
