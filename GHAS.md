# GitHub Advanced Security (GHAS)

GitHub Advanced Security (GHAS) provides a suite of security features to help protect your code and software supply chain. This repository leverages several GHAS features through its GitHub Actions workflows:

## Features Enabled

### 1. Code Scanning (Static Application Security Testing)
- **Tool Used:** CodeQL
- **Description:** Automatically scans code for security vulnerabilities and coding errors using GitHub's CodeQL engine.
- **Workflow Integration:**
  - Runs on every push, pull request, and on a schedule.
  - Generates a SARIF report uploaded as an artifact.

### 2. Secret Scanning
- **Tool Used:** Trufflehog
- **Description:** Scans the repository for accidentally committed secrets (API keys, credentials, etc.).
- **Workflow Integration:**
  - Runs on every push, pull request, and on a schedule.
  - Generates a JSON report uploaded as an artifact.

### 3. Dependency Scanning
- **Tool Used:** npm audit
- **Description:** Checks for known vulnerabilities in project dependencies.
- **Workflow Integration:**
  - Runs on every push, pull request, and on a schedule.
  - Generates a JSON report uploaded as an artifact.

### 4. Linting with Security Rules
- **Tool Used:** ESLint with eslint-plugin-security
- **Description:** Enforces secure coding practices and detects potential security issues in JavaScript code.
- **Workflow Integration:**
  - Runs on every push, pull request, and on a schedule.
  - Generates a JSON report uploaded as an artifact.

### 5. Container Scanning
- **Tool Used:** Trivy
- **Description:** Scans Docker images for vulnerabilities.
- **Workflow Integration:**
  - Builds and scans Docker images on every push, pull request, and on a schedule.
  - Generates a JSON report uploaded as an artifact.

### 6. SonarQube Analysis (Optional/Local)
- **Tool Used:** SonarQube
- **Description:** Performs static code analysis for code quality and security issues.
- **Workflow Integration:**
  - Runs as a separate job in the workflow.
  - Requires a running SonarQube server accessible to the runner.

## How to Access Reports
- All security scan reports are uploaded as workflow artifacts and can be downloaded from the GitHub Actions run summary.
- Review the reports for details on vulnerabilities, secrets, and code quality issues.

## References
- [GitHub Advanced Security Documentation](https://docs.github.com/en/code-security/github-advanced-security)
- [CodeQL](https://codeql.github.com/)
- [Trufflehog](https://github.com/trufflesecurity/trufflehog)
- [npm audit](https://docs.npmjs.com/cli/v8/commands/npm-audit)
- [ESLint Security Plugin](https://github.com/nodesecurity/eslint-plugin-security)
- [Trivy](https://github.com/aquasecurity/trivy)
- [SonarQube](https://www.sonarqube.org/) 