# Risk Register

| Risk                                             | Severity | Status    | Mitigation                                                                                                              |
| ------------------------------------------------ | -------- | --------- | ----------------------------------------------------------------------------------------------------------------------- |
| Market data is static sample data                | Medium   | Open      | Treat current data as demo input; add a real data adapter only after provider requirements are clear.                   |
| Live LLM depends on local DSA availability       | Medium   | Open      | Keep sample brief fallback; adapter health reports DSA reachability; document DSA startup separately.                   |
| No backend or persistence                        | Low      | Accepted  | Current product works as local analysis workspace; add backend only for live data, saved state, auth, or collaboration. |
| DSA output shape can be partial or markdown-only | Medium   | Open      | Adapter maps markdown and structured payloads defensively; add stronger DSA contract tests when DSA stabilizes.         |
| LLM/data secrets could leak into browser code    | High     | Mitigated | Browser calls only local adapter; DSA credentials stay in `daily_stock_analysis`; `.env.example` documents boundaries.  |
| Local PATH lacks common developer tools          | Medium   | Open      | Use documented bundled tools or install Git/Node/Python explicitly.                                                     |
| Playwright CDN download was slow locally         | Low      | Mitigated | Local config uses installed Chrome on Windows; CI installs Playwright Chromium.                                         |
| No auth exists                                   | Low      | Accepted  | Auth is out of scope until user-specific workflows exist.                                                               |
