# Risk Register

| Risk                                     | Severity | Status    | Mitigation                                                                                                              |
| ---------------------------------------- | -------- | --------- | ----------------------------------------------------------------------------------------------------------------------- |
| Market data is static sample data        | Medium   | Open      | Treat current data as demo input; add a real data adapter only after provider requirements are clear.                   |
| No backend or persistence                | Low      | Accepted  | Current product works as local analysis workspace; add backend only for live data, saved state, auth, or collaboration. |
| Local PATH lacks common developer tools  | Medium   | Open      | Use documented bundled tools or install Git/Node/Python explicitly.                                                     |
| Playwright CDN download was slow locally | Low      | Mitigated | Local config uses installed Chrome on Windows; CI installs Playwright Chromium.                                         |
| No auth exists                           | Low      | Accepted  | Auth is out of scope until user-specific workflows exist.                                                               |
