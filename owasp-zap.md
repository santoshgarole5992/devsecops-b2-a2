# 🧰 Dynamic Application Security Testing (DAST) with OWASP ZAP

---

## 1. 🧾 Introduction

Dynamic Application Security Testing (DAST) is a black-box security testing method used to evaluate running applications by simulating attacks on exposed interfaces. Unlike SAST, which inspects the source code, DAST identifies runtime vulnerabilities such as SQL Injection, Cross-Site Scripting (XSS), and broken authentication by observing actual behavior.

---

## 2. 🎯 Objective

The objective of this assignment is to integrate OWASP ZAP (Zed Attack Proxy) — a popular open-source DAST tool — into the CI/CD pipeline. This enables automated security scans of live applications and helps identify vulnerabilities early in the development lifecycle.

---

## 3. 🔍 How DAST Works

- **Black-box methodology**: No access to internal code; tests via external interactions.
- **Simulated attacks**: Uses crafted inputs to discover exploitable flaws.
- **Dynamic analysis**: Captures vulnerabilities that are only detectable during execution.
- **Scan reporting**: Outputs comprehensive findings with severity and fix suggestions.

---

## 4. 🛠️ Tool Selection: OWASP ZAP

OWASP ZAP was chosen because it provides:

- Automated and manual scanning capabilities.
- Support for both websites and APIs.
- CI/CD-friendly integrations (like GitHub Actions).
- Community-driven extensibility through scripts and plugins.

---

## 5. 🧪 Integration Steps

### 5.1 🖥️ Local Installation & Manual Testing

- Installed ZAP desktop app locally.
- Performed exploratory scans on OWASP Juice Shop.
- Observed results through manual attack exploration.

#### ZAP Local Installation Screenshot
![ZAP Local Installation](</zap-local-installation.PNG>)

#### Manual Scan Screenshot
![Manual Scan](</zap-manual-run.PNG>)

#### Manual Scan Alerts (XSS, SQLi, etc.)
![Manual Alerts](</zap-manual-alerts.PNG>)

#### Automated Scan Screenshot
![Automated Scan](</zap-local-automated-scan.PNG>)

#### Automated Alerts Screenshot
![Automated Alerts](</zap-local-automated-scan-alerts.PNG>)

---

### 5.2 🚀 Automated Scan using GitHub Actions

- Set up GitHub Actions pipeline for running OWASP ZAP DAST scans.
- Used ZAP’s full-scan GitHub Action for seamless automation.
- Scanned the Juice Shop demo site (`https://juice-shop.herokuapp.com`).
- Disabled SSL validation and enabled full alerts in dev environments.

#### GitHub Actions Workflow Configuration

```yaml
name: ZAP DAST Scan

on:
  push:
    branches:
      - owasp-zap
  pull_request:
    branches:
      - owasp-zap
  workflow_dispatch:

jobs:
  zap_scan:
    runs-on: ubuntu-latest
    name: ZAP DAST Scan on Juice Shop

    steps:
      - name: Checkout Repository
        uses: actions/checkout@v4
        with:
          ref: owasp-zap

      - name: Run ZAP Full Scan
        id: zap
        uses: zaproxy/action-full-scan@v0.12.0
        with:
          token: ${{ secrets.GITHUB_TOKEN }}
          docker_name: 'ghcr.io/zaproxy/zaproxy:stable'
          target: 'https://juice-shop.herokuapp.com'
          cmd_options: '-a -z "-config connection.ssl_cert_validation=false"'
          allow_issue_writing: false

      - name: Upload ZAP Report Artifacts
        uses: actions/upload-artifact@v4
        with:
          name: zap-dast-reports
          path: |
            report_html.html
            report_json.json
            zap.out
```

# 🧾 6. Findings and Remediation Plan

## 6.1 Key Vulnerabilities Identified (from ZAP Manual + Automated Scans)

| Vulnerability              | Severity | Description                                                 | Remediation Strategy                                                                 |
|---------------------------|----------|-------------------------------------------------------------|--------------------------------------------------------------------------------------|
| Cross-Site Scripting (XSS)| High     | Input fields allow unsanitized scripts                      | Sanitize user input, use HTML encoding, and apply CSP headers                       |
| SQL Injection             | High     | Malicious SQL queries accepted via input fields             | Use parameterized queries and ORM frameworks                                        |
| Content Security Missing  | Medium   | Absence of CSP/secure headers in responses                  | Add security headers like `Content-Security-Policy`, `X-Frame-Options`              |
| Information Disclosure    | Medium   | Stack traces or server banners reveal tech stack info       | Suppress verbose errors and disable server tokens                                   |
| Missing Secure Flags      | Medium   | Cookies lack Secure/HttpOnly/SameSite flags                 | Set appropriate cookie flags to enhance session security                            |

---

## 6.2 Screenshots of Zap Reports

### 🔍 Automated Scan Summary Report

![Automated ZAP Scan Report](</zap-local-automated-scan-report.PNG>)

---

### 📝 CI/CD Pipeline Reports

#### ZAP Scan Execution via GitHub Actions

![Github DAST Pipeline Execution](</pipeline-run.PNG>)

#### ZAP Scan Report Artifacts

![Github DAST Pipeline Artifacts](</pipeline-scan-artifacts.PNG>)

#### Final ZAP Report

![ZAP Report](</pipeline-scan-report.PNG>)

---

# ⚖️ 7. Pros and Cons of DAST with OWASP ZAP

| Pros                                                                 | Cons                                                                    |
|----------------------------------------------------------------------|-------------------------------------------------------------------------|
| Simulates real-world attacks on a running application                | May produce false positives requiring manual verification               |
| Does not need access to source code                                  | Cannot detect logical or code-level flaws                              |
| Easy CI/CD integration and automation                                | Requires proper target availability and authentication configuration   |
| Scans APIs and web interfaces                                        | Can be time-consuming for large/complex apps                           |
| Open-source and actively maintained (OWASP-backed)                   | Limited visibility into internal code paths                            |

---

# 🚫 8. Limitations of DAST Scanning

- **Surface-level testing only** – unexposed routes or internal logic aren't scanned.
- **Authentication-dependent** – scans may miss issues behind login forms if auth isn't configured.
- **False positives** – requires manual triage to verify results.
- **Slow scans** – large apps or deeply nested pages increase scan time significantly.
- **No context of internal code** – lacks data/control flow insight like SAST tools provide.

---

# 📚 9. Lessons Learned

- OWASP ZAP is a powerful free alternative to commercial DAST tools with strong automation support.
- DAST integration with GitHub Actions allows **shift-left security** by testing every code push.
- Both **manual exploratory scans** and **automated scans** are necessary for complete coverage.
- Ensuring **authentication handling**, **custom headers**, and **SSL flags** is crucial for real-world scan efficacy.
- Reports generated by ZAP are detailed and help prioritize fixes based on severity.

---

# ⚠️ 10. Why DAST Matters in Modern DevSecOps

- Applications face constant exposure to internet-based threats — runtime testing is essential.
- DAST complements SAST and Secret Scanning for a **defense-in-depth** security posture.
- Security validation within CI/CD enables **early detection**, reducing fix costs and delays.
- Helps teams meet **compliance requirements** (e.g., OWASP Top 10, ISO 27001).
- Encourages a **security-first mindset** across development and DevOps teams.

---

# 🔗 11. References

- [🔗 OWASP ZAP Documentation](https://www.zaproxy.org/docs/)
- [🔗 GitHub Actions: OWASP ZAP Full Scan](https://github.com/marketplace/actions/owasp-zap-full-scan)
- [🔗 OWASP Juice Shop](https://owasp.org/www-project-juice-shop/)
- [🔗 OWASP Top 10 Vulnerabilities](https://owasp.org/www-project-top-ten/)
- [🔗 ZAP Docker Usage Guide](https://www.zaproxy.org/docs/docker/about/)

---