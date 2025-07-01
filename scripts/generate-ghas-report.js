const fs = require('fs');
const path = require('path');

const reports = [
  { name: 'Code Scanning (CodeQL)', file: 'codeql-report.sarif', parser: parseSarif },
  { name: 'Dependency Scanning (npm audit)', file: 'npm-audit-report.json', parser: parseNpmAudit },
  { name: 'Secret Scanning (Trufflehog)', file: 'trufflehog-report.json', parser: parseTrufflehog },
  { name: 'Linting with Security Rules (ESLint)', file: 'eslint-report.json', parser: parseEslint },
  { name: 'Container Scanning (Trivy)', file: 'trivy-report.json', parser: parseTrivy },
  // Add SonarQube if you have a report file
];

function parseSarif(filePath) {
  try {
    const sarif = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    const runs = sarif.runs || [];
    let findings = [];
    runs.forEach(run => {
      (run.results || []).forEach(result => {
        findings.push({
          rule: result.ruleId,
          message: result.message && result.message.text,
          file: result.locations && result.locations[0]?.physicalLocation?.artifactLocation?.uri,
          line: result.locations && result.locations[0]?.physicalLocation?.region?.startLine,
          severity: result.level
        });
      });
    });
    return findings.length ? findings.slice(0, 3) : null;
  } catch {
    return null;
  }
}

function parseNpmAudit(filePath) {
  try {
    const audit = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    const advisories = audit.vulnerabilities || audit.advisories || {};
    let findings = [];
    Object.entries(advisories).forEach(([pkg, vuln]) => {
      findings.push({
        package: pkg,
        title: vuln.title || vuln.name,
        severity: vuln.severity,
        via: vuln.via ? vuln.via.map(v => v.title || v.source).join(', ') : '',
        patched: vuln.patched_versions || vuln.fixAvailable || ''
      });
    });
    return findings.length ? findings.slice(0, 3) : null;
  } catch {
    return null;
  }
}

function parseTrufflehog(filePath) {
  try {
    const lines = fs.readFileSync(filePath, 'utf8').split('\n').filter(Boolean);
    const findings = lines.map(line => {
      try {
        const obj = JSON.parse(line);
        return {
          type: obj.SourceMetadata?.DataType || obj.reason || 'Secret',
          file: obj.SourceMetadata?.SourceFile || obj.path,
          line: obj.SourceMetadata?.SourceLine || obj.start,
        };
      } catch {
        return null;
      }
    }).filter(Boolean);
    return findings.length ? findings.slice(0, 3) : null;
  } catch {
    return null;
  }
}

function parseEslint(filePath) {
  try {
    const results = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    let findings = [];
    (results || []).forEach(res => {
      (res.messages || []).forEach(msg => {
        findings.push({
          rule: msg.ruleId,
          file: res.filePath,
          line: msg.line,
          severity: msg.severity === 2 ? 'Error' : 'Warning',
          message: msg.message
        });
      });
    });
    return findings.length ? findings.slice(0, 3) : null;
  } catch {
    return null;
  }
}

function parseTrivy(filePath) {
  try {
    const trivy = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    let findings = [];
    (trivy.Results || []).forEach(result => {
      (result.Vulnerabilities || []).forEach(vuln => {
        findings.push({
          id: vuln.VulnerabilityID,
          pkg: vuln.PkgName,
          severity: vuln.Severity,
          title: vuln.Title
        });
      });
    });
    return findings.length ? findings.slice(0, 3) : null;
  } catch {
    return null;
  }
}

function section(title, findings, exampleFormat) {
  if (!findings) return `## ${title}\n_No findings or report not found._\n`;
  let out = `## ${title}\n`;
  findings.forEach(f => {
    out += '- ' + Object.entries(f).map(([k, v]) => `**${k}:** ${v}`).join(', ') + '\n';
  });
  return out + '\n';
}

function main() {
  let report = '# GHAS Vulnerability Report\n\nThis report summarizes the vulnerabilities and issues detected by the GitHub Advanced Security (GHAS) workflow in this repository.\n\n---\n\n';
  reports.forEach(r => {
    const filePath = path.join(process.cwd(), r.file);
    const findings = fs.existsSync(filePath) ? r.parser(filePath) : null;
    report += section(r.name, findings);
    report += '\n---\n\n';
  });
  report += '> **Note:** For full details, download the respective reports from the GitHub Actions run artifacts.\n';
  fs.writeFileSync(path.join(process.cwd(), 'GHAS-Report.md'), report, 'utf8');
  console.log('GHAS-Report.md generated.');
}

main(); 