# Security Policy

## Supported Versions

Use this section to tell people about which versions of your project are
currently being supported with security updates.

| Version | Supported          |
| ------- | ------------------ |
| 5.1.x   | :white_check_mark: |
| 5.0.x   | :x:                |
| 4.0.x   | :white_check_mark: |
| < 4.0   | :x:                |

## Reporting a Vulnerability

Use this section to tell people how to report a vulnerability.

Tell them where to go, how often they can expect to get an update on a
reported vulnerability, what to expect if the vulnerability is accepted or
declined, etc.

# CI/CD Security Checks

This project uses GitHub Actions to automate several security checks on every pull request, push to main, and on a weekly schedule. The following tools and checks are implemented:

## Implemented Security Tools

1. **Static Application Security Testing (SAST) - CodeQL**
   - **Configuration:** Runs CodeQL analysis for JavaScript/Node.js code.
   - **Why:** Detects common vulnerabilities and coding errors in source code.
   - **Results:** Issues are reported in the GitHub Security tab and as workflow annotations.
   - **Custom Rules:** Default CodeQL rules for JavaScript.

2. **Dependency Scanning - npm audit**
   - **Configuration:** Runs `npm audit --audit-level=high` after installing dependencies.
   - **Why:** Identifies known vulnerabilities in project dependencies.
   - **Results:** Vulnerabilities are shown in the workflow logs. High/critical issues should be addressed promptly.
   - **Custom Rules:** Audit level set to 'high' to focus on severe vulnerabilities.

3. **Secret Scanning - TruffleHog**
   - **Configuration:** Uses `trufflesecurity/trufflehog` to scan for secrets in the codebase.
   - **Why:** Prevents accidental commits of sensitive information (API keys, passwords, etc.).
   - **Results:** Any detected secrets are reported in the workflow logs.
   - **Custom Rules:** Uses regex scanning; entropy checks are disabled for speed.

4. **Linting with Security Rules - ESLint + eslint-plugin-security**
   - **Configuration:** Installs ESLint and the security plugin, then lints all `.js` files.
   - **Why:** Enforces secure coding practices and flags insecure patterns.
   - **Results:** Linting errors/warnings are shown in the workflow logs.
   - **Custom Rules:** Uses recommended rules from `eslint-plugin-security`.

5. **Container Scanning - Trivy**
   - **Configuration:** Builds the Docker image and scans it using `aquasecurity/trivy-action`.
   - **Why:** Detects vulnerabilities in OS packages and application dependencies in the container image.
   - **Results:** Vulnerabilities are reported in the workflow logs.
   - **Custom Rules:** Default Trivy scan.

## How to Interpret Results
- **GitHub Security Tab:** SAST results are aggregated here for easy review.
- **Workflow Logs:** All other tool results are available in the Actions tab under the relevant job name.
- **Failing Jobs:** If a job fails, review the logs for details and address the reported issues.

## Customization
- You can adjust the severity threshold for `npm audit` or add custom ESLint rules in a `.eslintrc` file.
- To add more secret patterns, update the TruffleHog configuration in the workflow.

## File Location
- The workflow file is located at `.github/workflows/security.yml`.

# References

I took ideas and how to explode it in NodeJS using these references:

- https://blog.risingstack.com/node-js-security-checklist/
- https://github.com/substack/safe-regex

# License

This project is released under license BSD.

