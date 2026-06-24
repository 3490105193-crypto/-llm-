# Security Policy

## Reporting

Report suspected vulnerabilities through the repository's private maintainer channel once one exists. Do not disclose secrets or exploit details in public issues.

## Baseline Rules

- Do not commit real secrets or private keys.
- Use `.env.example` for required environment variables.
- Validate external input before use.
- Avoid logging credentials, tokens, cookies, personal data, or raw request bodies.
- Add dependency audits when a package manager is introduced.

## Local Check

Run:

```powershell
./tools/ai-quality.ps1
```
