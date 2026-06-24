# Risk Register

| Risk | Severity | Status | Mitigation |
| --- | --- | --- | --- |
| No application stack exists | Medium | Open | Defer stack-specific tooling until requirements exist. |
| No Git repository detected | Medium | Open | Initialize Git outside this change if version history is needed. |
| Local PATH lacks common developer tools | Medium | Open | Use documented bundled tools or install Git/Node/Python explicitly. |
| No executable app tests exist | Medium | Open | Add tests with the first application module. |
| Security posture is policy-only | Medium | Open | Add dependency audits and input validation tests when code exists. |
| Playwright is not installed | Low | Accepted | Install only when a frontend is introduced. |

