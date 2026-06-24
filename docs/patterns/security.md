# Security Workflow

## Current Gate

`tools/ai-quality.ps1` scans tracked workspace files for common secret formats and validates required workflow files.

## Required Audits For Application Code

When code is added, audit:

- Input validation at every external boundary.
- Authentication and authorization checks.
- Secret handling and logging.
- Dependency vulnerabilities.
- Error responses and stack trace exposure.
- Retry safety for writes and external calls.
- Injection risks.
- Least privilege assumptions.

For the live DSA adapter:

- Browser code may call only `VITE_LIVE_LLM_API_BASE`.
- The adapter may call only the configured `DSA_BASE_URL`.
- DSA provider credentials and paid data keys must stay in `daily_stock_analysis`.
- Validate task IDs, JSON bodies, report language, and CORS origins.
- Return typed errors without stack traces or raw provider responses.

## Dependency Audit Commands

Add the appropriate command with the selected stack:

- npm: `npm audit`
- pnpm: `pnpm audit`
- yarn: `yarn npm audit`
- Python: `pip-audit` or equivalent project-approved scanner

Document the chosen command in CI.

Critical and high vulnerabilities are priority work. Do not ignore them long term.
