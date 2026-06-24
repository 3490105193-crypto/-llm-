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

## Dependency Audit Commands

Add the appropriate command with the selected stack:

- npm: `npm audit`
- pnpm: `pnpm audit`
- yarn: `yarn npm audit`
- Python: `pip-audit` or equivalent project-approved scanner

Document the chosen command in CI.

