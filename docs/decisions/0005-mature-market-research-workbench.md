# 0005: Mature Market Lens Into A Research Workbench

Date: 2026-06-24

## Status

Accepted

## Context

The first product version proved the React/Vite engineering baseline but felt too close to an MVP dashboard. The target user is an investment researcher, portfolio manager, or analyst who needs a daily workflow, not a decorative market summary.

A market-ready research app needs connected workflows: opportunity discovery, asset memo, portfolio risk, scenario stress, alert triage, research tasks, and event awareness. The repository still has no requirements for live data, auth, persistence, broker integration, or regulated portfolio accounting.

## Decision

Mature the current frontend into a multi-workspace research workbench while keeping the same simple stack.

Add validated domain structures for:

- Multi-asset instruments.
- Portfolio positions and benchmark weights.
- Factor exposure.
- Scenario asset impacts.
- Alert triage.
- Research tasks.
- Market events.
- Saved screener views.

Add deterministic analysis functions for:

- Asset ranking.
- Portfolio risk summary.
- Scenario stress contribution.
- Alert priority.
- Research queue summary.

Keep backend, auth, database, live data, and broker workflows out of scope until product requirements justify them.

## Alternatives

- Add a backend and database immediately.
- Integrate a live market data API immediately.
- Switch to Next.js for server-side data workflows.
- Keep the basic dashboard and only polish visual styling.

## Tradeoffs

The selected path makes the app feel materially more mature without increasing infrastructure complexity. It keeps local development deterministic, testable, and AI-friendly.

The tradeoff is that data remains a validated sample snapshot. Real-time accuracy, user-specific persistence, account security, provider licensing, retries, and operational monitoring are deferred.

## Consequences

- Future product changes should preserve the research-workbench boundaries: overview, screener, asset memo, portfolio risk lab, scenario matrix, alert center, research queue, and event calendar.
- Any live data provider requires a new data-adapter ADR covering provider, licensing, freshness, retries, validation, caching, and failure states.
- Any user account or saved workflow requires auth and persistence ADRs.
- Tests must cover domain calculations and user workflows, not only visual rendering.
