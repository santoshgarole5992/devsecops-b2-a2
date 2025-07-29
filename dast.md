# Dynamic Application Security Testing (DAST) Integration

## Objective
Integrate a Dynamic Application Security Testing (DAST) tool into the deployment pipeline and report the findings.

---

## What is DAST?
DAST (Dynamic Application Security Testing) is a black-box security testing method that analyzes a running application from the outside, simulating real-world attacks to find vulnerabilities. Unlike SAST (Static Application Security Testing), DAST does not require access to source code and tests the application in its deployed state.

**How DAST Works:**
- The DAST tool (e.g., OWASP ZAP) crawls and scans the running web application.
- It sends various requests to identify vulnerabilities such as XSS, SQL injection, security misconfigurations, etc.
- Results are reported with severity and suggested mitigations.

---

## Integration Steps (with OWASP ZAP)
1. **Select Tool:** OWASP ZAP (community edition, open source)
2. **Install & Configure:** Use the official ZAP Docker image in CI/CD.
3. **Pipeline Integration:**
   - Build and start the application container (on port 3000)
   - Run ZAP baseline scan against `http://localhost:3000`
   - Save the ZAP report as a CI artifact
   - Stop the application container after scan
4. **Automation:** The scan runs automatically on every push or pull request to the master branch.

---

## Example Findings and Mitigation
| Vulnerability           | Severity | Mitigation Suggestion                  |
|------------------------|----------|----------------------------------------|
| X-Frame-Options Header | Low      | Add `X-Frame-Options: DENY` header     |
| XSS (Reflected)        | High     | Sanitize user input, use CSP headers   |
| Cookie Without Secure  | Medium   | Set `Secure` and `HttpOnly` flags      |

---

## Pros and Cons of DAST
**Pros:**
- Finds real, exploitable vulnerabilities in running apps
- No need for source code
- Simulates attacker behavior
- Can be automated in CI/CD

**Cons:**
- May miss issues not exposed at runtime
- Can generate false positives/negatives
- Needs a running/stable environment
- Slower than SAST for large apps

---

## Limitations
- Cannot find vulnerabilities in code not exposed via HTTP endpoints
- Limited by authentication/authorization barriers
- May not cover all application logic or hidden endpoints
- Requires the app to be running and accessible during scan
- Community edition tools may have feature limitations

---

## CI/CD Pipeline Demonstration
- The provided GitHub Actions workflow (`dast.yaml`) builds and runs the app, then scans it with OWASP ZAP.
- The ZAP report is uploaded as an artifact for review.
- Logs and history from the scan are available in the workflow run.
- **Screenshots:**
  - Include screenshots of ZAP running locally and in CI/CD (attach separately as required).
- **Logs/Evidence:**
  - Attach ZAP scan logs and report files as evidence of findings.

---

**References:**
- [OWASP ZAP Project](https://www.zaproxy.org/)
- [OWASP ZAP GitHub Action](https://github.com/marketplace/actions/owasp-zap-baseline-scan) 