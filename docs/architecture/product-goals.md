# Product Goals

## Product Goal

Market Lens Pro helps an investment research user evaluate market regime, find opportunities, inspect asset-level context, stress a portfolio, and triage research work from one validated research workbench.

## User Scenarios

- Pre-market scan of regime, breadth, and alerts.
- Screener filtering by symbol, company, sector, region, asset category, signal score, quality, and risk.
- Asset review with thesis, catalysts, factor exposure, decision checklist, related alerts, events, and research tasks.
- Portfolio risk review with exposure, active weight, beta, hedge weight, factor profile, and top positions.
- Scenario stress testing with portfolio-level impact and position-level contribution.
- LLM market briefing that summarizes regime stance, index narrative, sector rotation, stock decisions, risk warnings, and data quality.
- Alert and research triage across risk, macro, event, and diligence queues.

## Core Business Workflow

1. Validate market snapshot input with zod.
2. Calculate market health, asset ranking, portfolio risk, scenario impacts, LLM brief summary, alert priority, and research queue state.
3. Render workspaces for overview, AI brief, screener, portfolio risk, scenarios, and alerts/research.
4. Let the user filter, navigate, select assets, inspect research context, and compare stress outcomes without credentials.

## Success Metrics

- Runs locally without API keys.
- Renders key market state on first screen.
- Unit tests protect scoring, filtering, portfolio risk, scenario stress, and alert prioritization.
- Component tests protect workspace navigation, AI brief, screener filtering, risk lab, alert center, and error state.
- E2E tests protect app load, navigation, screener selection, scenario matrix, and alert/research workflow on desktop and mobile.
- Dependency audit has no high or critical findings.

## Non-Goals

- No trading or broker connection.
- No investment advice.
- No live market data feed.
- No auth, backend, persistence, or multi-tenant workflows.
- No portfolio accounting, order management, tax, compliance surveillance, or paid data licensing layer.
