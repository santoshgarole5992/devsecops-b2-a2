# GHAS Vulnerability Report

This report summarizes the vulnerabilities and issues detected by the GitHub Advanced Security (GHAS) workflow in this repository.

---

## 1. Code Scanning (CodeQL)
**Example Finding:**
- **Type:** SQL Injection
- **File:** `src/controllers/user.js`
- **Line:** 42
- **Severity:** High
- **Description:** Unsanitized user input used in SQL query.

---

## 2. Dependency Scanning (npm audit)
**Example Finding:**
- **Package:** `lodash`
- **Vulnerability:** Prototype Pollution
- **Severity:** High
- **Patched Version:** 4.17.21

---

## 3. Secret Scanning (Trufflehog)
**Example Finding:**
- **Type:** AWS Secret Key
- **File:** `src/config.js`
- **Line:** 10
- **Description:** Potential AWS secret key found in code.

---

## 4. Linting with Security Rules (ESLint)
**Example Finding:**
- **Rule:** detect-non-literal-fs-filename
- **File:** `src/utils/file.js`
- **Line:** 15
- **Severity:** Warning
- **Description:** Non-literal filename used in `fs` operation.

---

## 5. Container Scanning (Trivy)
**Example Finding:**
- **Vulnerability ID:** CVE-2021-3450
- **Package:** openssl
- **Severity:** Critical
- **Description:** OpenSSL vulnerability in Docker image.

---

## 6. SonarQube Analysis
**Example Finding:**
- **Type:** Code Smell
- **File:** `src/index.js`
- **Line:** 5
- **Severity:** Minor
- **Description:** Use of console.log in production code.

---

> **Note:** For full details, download the respective reports from the GitHub Actions run artifacts. 