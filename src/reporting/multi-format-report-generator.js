const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

class MultiFormatReportGenerator {
  constructor(config = {}) {
    this.config = config;
    this.supportedFormats = ['json', 'text', 'html', 'csv', 'xml', 'sarif', 'junit', 'markdown'];
  }

  generateReport(scanResult, format = 'json', options = {}) {
    if (!this.supportedFormats.includes(format.toLowerCase())) {
      throw new Error(`Unsupported format: ${format}. Supported formats: ${this.supportedFormats.join(', ')}`);
    }

    switch (format.toLowerCase()) {
      case 'json':
        return this.generateJSONReport(scanResult, options);
      case 'text':
        return this.generateTextReport(scanResult, options);
      case 'html':
        return this.generateHTMLReport(scanResult, options);
      case 'csv':
        return this.generateCSVReport(scanResult, options);
      case 'xml':
        return this.generateXMLReport(scanResult, options);
      case 'sarif':
        return this.generateSARIFReport(scanResult, options);
      case 'junit':
        return this.generateJUnitReport(scanResult, options);
      case 'markdown':
        return this.generateMarkdownReport(scanResult, options);
      default:
        return this.generateJSONReport(scanResult, options);
    }
  }

  generateJSONReport(scanResult, options = {}) {
    return JSON.stringify(scanResult, null, 2);
  }

  generateTextReport(scanResult, options = {}) {
    const { vulnerabilities = [], summary = {} } = scanResult;
    const lines = [];
    
    lines.push('Vue Security Scanner Report');
    lines.push('==========================');
    lines.push('');
    lines.push(`Scan Time: ${new Date().toISOString()}`);
    lines.push(`Total Files Scanned: ${summary.totalFiles || 0}`);
    lines.push(`Total Vulnerabilities: ${vulnerabilities.length}`);
    lines.push('');

    // Group vulnerabilities by severity
    const groupedBySeverity = this.groupVulnerabilitiesBySeverity(vulnerabilities);
    
    for (const [severity, vulns] of Object.entries(groupedBySeverity)) {
      if (vulns.length > 0) {
        lines.push(`${severity.toUpperCase()} VULNERABILITIES (${vulns.length}):`);
        lines.push('');
        
        vulns.forEach(vuln => {
          lines.push(`  File: ${vuln.file}`);
          lines.push(`  Line: ${vuln.line || 'N/A'}`);
          lines.push(`  Type: ${vuln.ruleId}`);
          lines.push(`  Description: ${vuln.description}`);
          lines.push(`  Severity: ${vuln.severity || 'medium'}`);
          lines.push('');
        });
      }
    }

    return lines.join('\n');
  }

  generateHTMLReport(scanResult, options = {}) {
    const { vulnerabilities = [], summary = {} } = scanResult;
    const groupedBySeverity = this.groupVulnerabilitiesBySeverity(vulnerabilities);

    const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Vue Security Scanner Report</title>
  <style>
    body { font-family: Arial, sans-serif; margin: 20px; background-color: #f5f5f5; }
    .container { background-color: white; padding: 20px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
    h1 { color: #333; border-bottom: 2px solid #4CAF50; }
    .summary { background-color: #e3f2fd; padding: 15px; border-radius: 5px; margin: 15px 0; }
    .vulnerability { border: 1px solid #ddd; margin: 10px 0; padding: 15px; border-radius: 5px; }
    .critical { border-left: 5px solid #f44336; }
    .high { border-left: 5px solid #ff9800; }
    .medium { border-left: 5px solid #ffeb3b; }
    .low { border-left: 5px solid #4CAF50; }
    .severity-critical { color: #f44336; font-weight: bold; }
    .severity-high { color: #ff9800; font-weight: bold; }
    .severity-medium { color: #ffeb3b; font-weight: bold; }
    .severity-low { color: #4CAF50; font-weight: bold; }
    table { width: 100%; border-collapse: collapse; margin: 15px 0; }
    th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
    th { background-color: #f2f2f2; }
  </style>
</head>
<body>
  <div class="container">
    <h1>Vue Security Scanner Report</h1>
    
    <div class="summary">
      <h2>Summary</h2>
      <p><strong>Total Files Scanned:</strong> ${summary.totalFiles || 0}</p>
      <p><strong>Total Vulnerabilities Found:</strong> ${vulnerabilities.length}</p>
      <p><strong>Scan Time:</strong> ${new Date().toISOString()}</p>
    </div>

    <h2>Vulnerability Details</h2>
`;

    let content = html;

    for (const [severity, vulns] of Object.entries(groupedBySeverity)) {
      if (vulns.length > 0) {
        content += `<h3>${severity.toUpperCase()} Severity (${vulns.length} vulnerabilities)</h3>\n`;
        
        vulns.forEach(vuln => {
          const severityClass = `severity-${vuln.severity || severity}`;
          const vulnClass = severity.toLowerCase();
          
          content += `
    <div class="vulnerability ${vulnClass}">
      <h4><span class="${severityClass}">${vuln.severity || severity.toUpperCase()}</span>: ${vuln.ruleId}</h4>
      <p><strong>File:</strong> ${vuln.file}</p>
      <p><strong>Line:</strong> ${vuln.line || 'N/A'}</p>
      <p><strong>Description:</strong> ${vuln.description}</p>
    </div>
`;
        });
      }
    }

    content += `
  </div>
</body>
</html>`;

    return content;
  }

  generateCSVReport(scanResult, options = {}) {
    const { vulnerabilities = [] } = scanResult;
    const lines = [];
    
    // CSV header
    lines.push(['File', 'Line', 'Rule ID', 'Description', 'Severity', 'Category'].join(','));
    
    // CSV rows
    vulnerabilities.forEach(vuln => {
      lines.push([
        `"${vuln.file.replace(/"/g, '""')}"`,
        vuln.line || '',
        `"${vuln.ruleId.replace(/"/g, '""')}"`,
        `"${vuln.description.replace(/"/g, '""')}"`,
        vuln.severity || 'medium',
        vuln.category || 'general'
      ].join(','));
    });

    return lines.join('\n');
  }

  generateXMLReport(scanResult, options = {}) {
    const { vulnerabilities = [], summary = {} } = scanResult;
    const xmlParts = [
      '<?xml version="1.0" encoding="UTF-8"?>',
      '<security-report>',
      `  <generated-at>${new Date().toISOString()}</generated-at>`,
      `  <total-files>${summary.totalFiles || 0}</total-files>`,
      `  <total-vulnerabilities>${vulnerabilities.length}</total-vulnerabilities>`,
      '  <vulnerabilities>'
    ];

    vulnerabilities.forEach(vuln => {
      xmlParts.push('    <vulnerability>');
      xmlParts.push(`      <file><![CDATA[${vuln.file}]]></file>`);
      xmlParts.push(`      <line>${vuln.line || 0}</line>`);
      xmlParts.push(`      <rule-id><![CDATA[${vuln.ruleId}]]></rule-id>`);
      xmlParts.push(`      <description><![CDATA[${vuln.description}]]></description>`);
      xmlParts.push(`      <severity>${vuln.severity || 'medium'}</severity>`);
      xmlParts.push(`      <category><![CDATA[${vuln.category || 'general'}]]></category>`);
      xmlParts.push('    </vulnerability>');
    });

    xmlParts.push('  </vulnerabilities>');
    xmlParts.push('</security-report>');

    return xmlParts.join('\n');
  }

  generateSARIFReport(scanResult, options = {}) {
    const { vulnerabilities = [], summary = {} } = scanResult;
    
    const sarifReport = {
      $schema: "https://json.schemastore.org/sarif-2.1.0.json",
      version: "2.1.0",
      runs: [{
        tool: {
          driver: {
            name: "Vue Security Scanner",
            informationUri: "https://github.com/ereddate/vue-security-scanner",
            version: "1.7.2",
            rules: []
          }
        },
        results: vulnerabilities.map(vuln => ({
          ruleId: vuln.ruleId,
          level: this.convertSeverityToSARIFLevel(vuln.severity),
          message: {
            text: vuln.description
          },
          locations: [{
            physicalLocation: {
              artifactLocation: {
                uri: vuln.file
              },
              region: {
                startLine: vuln.line || 1
              }
            }
          }]
        }))
      }]
    };

    return JSON.stringify(sarifReport, null, 2);
  }

  generateJUnitReport(scanResult, options = {}) {
    const { vulnerabilities = [], summary = {} } = scanResult;
    const testCases = [];
    
    // Group by file
    const byFile = {};
    vulnerabilities.forEach(vuln => {
      if (!byFile[vuln.file]) {
        byFile[vuln.file] = [];
      }
      byFile[vuln.file].push(vuln);
    });

    const suites = Object.entries(byFile).map(([file, vulns]) => {
      const failures = vulns.length;
      const errors = 0; // We treat all as failures, not errors
      
      const testCaseXml = vulns.map(vuln => 
        `    <testcase name="${vuln.ruleId}" classname="${file}">
      <failure type="${vuln.severity}" message="${vuln.description.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')}"/>
    </testcase>`
      ).join('\n');
      
      return `<testsuite name="${file}" tests="${vulns.length}" failures="${failures}" errors="${errors}">
${testCaseXml}
  </testsuite>`;
    });

    return `<?xml version="1.0" encoding="UTF-8"?>
<testsuites>
${suites.join('\n')}
</testsuites>`;
  }

  generateMarkdownReport(scanResult, options = {}) {
    const { vulnerabilities = [], summary = {} } = scanResult;
    const groupedBySeverity = this.groupVulnerabilitiesBySeverity(vulnerabilities);
    
    const lines = [];
    lines.push('# Vue Security Scanner Report');
    lines.push('');
    lines.push(`**Scan Time:** ${new Date().toISOString()}`);
    lines.push(`**Total Files Scanned:** ${summary.totalFiles || 0}`);
    lines.push(`**Total Vulnerabilities:** ${vulnerabilities.length}`);
    lines.push('');

    for (const [severity, vulns] of Object.entries(groupedBySeverity)) {
      if (vulns.length > 0) {
        lines.push(`## ${severity.toUpperCase()} Severity (${vulns.length} vulnerabilities)`);
        lines.push('');
        
        vulns.forEach(vuln => {
          lines.push(`### ${vuln.ruleId}`);
          lines.push(`- **File:** \`${vuln.file}\``);
          lines.push(`- **Line:** ${vuln.line || 'N/A'}`);
          lines.push(`- **Severity:** ${vuln.severity || severity}`);
          lines.push(`- **Description:** ${vuln.description}`);
          lines.push('');
        });
      }
    }

    return lines.join('\n');
  }

  groupVulnerabilitiesBySeverity(vulnerabilities) {
    const grouped = {
      critical: [],
      high: [],
      medium: [],
      low: []
    };

    vulnerabilities.forEach(vuln => {
      const severity = (vuln.severity || 'medium').toLowerCase();
      if (grouped[severity]) {
        grouped[severity].push(vuln);
      } else {
        // Default to medium if unknown severity
        grouped.medium.push(vuln);
      }
    });

    return grouped;
  }

  convertSeverityToSARIFLevel(severity) {
    switch ((severity || 'medium').toLowerCase()) {
      case 'critical':
      case 'high':
        return 'error';
      case 'medium':
        return 'warning';
      case 'low':
        return 'note';
      default:
        return 'warning';
    }
  }

  saveReportToFile(reportContent, format, outputPath) {
    const fullPath = path.resolve(outputPath);
    const dir = path.dirname(fullPath);
    
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    
    fs.writeFileSync(fullPath, reportContent, 'utf8');
    return fullPath;
  }
}

module.exports = MultiFormatReportGenerator;