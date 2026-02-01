# Configuration Guide

Vue Security Scanner supports customizing scanning behavior through configuration files, including ignoring specific detection items or files.

## Configuration File Formats

The tool supports the following configuration files (in order of priority):

1. `vue-security-scanner.config.json` (project root)
2. `.vue-security.json` (project root)
3. `vue-security-scanner.config.json` (current working directory)
4. `.vue-security.json` (current working directory)

You can also specify a configuration file path using the `-c` or `--config` command line argument:

```bash
vue-security-scanner -c /path/to/custom-config.json
```

## Configuration Options

### scan - Scanning Options

```json
{
  "scan": {
    "ignoreDirs": [
      "node_modules",
      "dist",
      "build",
      ".git",
      "coverage",
      "public"
    ],
    "ignorePatterns": [
      "**/*.min.js",
      "**/vendor/**",
      "**/lib/**"
    ],
    "maxDepth": 10,
    "maxSize": 10
  }
}
```

- `ignoreDirs`: Directories to ignore during scanning
- `ignorePatterns`: File patterns to ignore (glob format)
- `maxDepth`: Maximum directory depth to scan
- `maxSize`: Maximum file size to scan (MB)

### rules - Rule Configuration

```json
{
  "rules": {
    "xss": {
      "enabled": true,
      "severity": "high"
    },
    "dependencies": {
      "enabled": true,
      "severity": "high"
    },
    "csrf": {
      "enabled": true,
      "severity": "medium"
    }
  }
}
```

- `enabled`: Whether to enable the rule category
- `severity`: Minimum severity to report (high/medium/low)

### output - Output Configuration

```json
{
  "output": {
    "showProgress": true,
    "format": "console",
    "showDetails": true,
    "maxIssuesToShow": 100,
    "advancedReport": false,
    "reportPath": "security-report.json"
  }
}
```

- `showProgress`: Whether to show scanning progress
- `format`: Output format (console/json/html/text/xml/sarif)
- `showDetails`: Whether to show detailed issue information
- `maxIssuesToShow`: Maximum number of issues to display
- `advancedReport`: Whether to generate advanced report with trends
- `reportPath`: Path to save the report

### performance - Performance Configuration

```json
{
  "performance": {
    "maxConcurrentFiles": 10,
    "timeout": 30000,
    "enableSemanticAnalysis": true,
    "enableNpmAudit": true,
    "enableVulnerabilityDB": true
  }
}
```

- `maxConcurrentFiles`: Maximum number of files to scan concurrently
- `timeout`: Timeout for scanning individual files (ms)
- `enableSemanticAnalysis`: Enable AST-based semantic analysis
- `enableNpmAudit`: Enable npm audit integration
- `enableVulnerabilityDB`: Enable built-in vulnerability database

### reportHistory - Report History Configuration

```json
{
  "reportHistory": {
    "enabled": true,
    "path": ".vue-security-reports",
    "maxSize": 100
  }
}
```

- `enabled`: Whether to enable report history for trend analysis
- `path`: Directory to store report history
- `maxSize`: Maximum number of reports to keep

### compliance - Compliance Configuration

```json
{
  "compliance": {
    "enabled": true,
    "standards": ["OWASP", "GDPR", "HIPAA", "PCI-DSS", "SOX"]
  }
}
```

- `enabled`: Whether to enable compliance checks
- `standards`: Compliance standards to check against

## Example Configuration

Here's a complete example configuration file:

```json
{
  "rules": {
    "xss": { "enabled": true, "severity": "high" },
    "dependencies": { "enabled": true, "severity": "high" },
    "csrf": { "enabled": true, "severity": "medium" },
    "input": { "enabled": true, "severity": "medium" },
    "injection": { "enabled": true, "severity": "high" },
    "authentication": { "enabled": true, "severity": "high" },
    "session": { "enabled": true, "severity": "medium" },
    "encryption": { "enabled": true, "severity": "medium" },
    "logging": { "enabled": true, "severity": "low" },
    "error": { "enabled": true, "severity": "medium" },
    "file": { "enabled": true, "severity": "medium" },
    "network": { "enabled": true, "severity": "medium" },
    "memory": { "enabled": true, "severity": "low" },
    "cookie": { "enabled": true, "severity": "medium" },
    "http": { "enabled": true, "severity": "medium" },
    "header": { "enabled": true, "severity": "medium" },
    "third-party": { "enabled": true, "severity": "medium" },
    "vue-specific": { "enabled": true, "severity": "medium" }
  },
  "scan": {
    "ignoreDirs": [
      "node_modules",
      "dist",
      "build",
      ".git",
      "coverage",
      "public"
    ],
    "ignorePatterns": [
      "**/*.min.js",
      "**/vendor/**",
      "**/lib/**"
    ],
    "maxDepth": 10,
    "maxSize": 10
  },
  "output": {
    "showProgress": true,
    "format": "console",
    "showDetails": true,
    "maxIssuesToShow": 100,
    "advancedReport": false,
    "reportPath": "security-report.json"
  },
  "performance": {
    "maxConcurrentFiles": 10,
    "timeout": 30000,
    "enableSemanticAnalysis": true,
    "enableNpmAudit": true,
    "enableVulnerabilityDB": true
  },
  "reportHistory": {
    "enabled": true,
    "path": ".vue-security-reports",
    "maxSize": 100
  },
  "compliance": {
    "enabled": true,
    "standards": ["OWASP", "GDPR", "HIPAA", "PCI-DSS", "SOX"]
  }
}
```

## Command Line Overrides

You can override configuration options using command line arguments:

```bash
# Override output format
vue-security-scanner . --output html

# Override report path
vue-security-scanner . --report my-report.html

# Override performance profile
vue-security-scanner . --performance fast

# Override max concurrent files
vue-security-scanner . --max-concurrent-files 5
```

## Environment Variables

You can also configure the scanner using environment variables:

```bash
# Set custom configuration
VUE_SECURITY_CONFIG="/path/to/config.json" vue-security-scanner .

# Set performance profile
VUE_SECURITY_PERFORMANCE="fast" vue-security-scanner .

# Enable incremental scanning
VUE_SECURITY_INCREMENTAL="true" vue-security-scanner .
```

## Ignore Rules

In addition to configuration files, you can use `.vue-security-ignore` files to specify files, directories, or vulnerability types to ignore. See the [Ignore Guide](./ignore-guide.md) for more information.

## Best Practices

### For Development

```json
{
  "performance": {
    "enableSemanticAnalysis": false,
    "enableNpmAudit": false,
    "enableVulnerabilityDB": false
  },
  "output": {
    "format": "console",
    "showDetails": false
  }
}
```

### For Production

```json
{
  "performance": {
    "enableSemanticAnalysis": true,
    "enableNpmAudit": true,
    "enableVulnerabilityDB": true
  },
  "output": {
    "format": "json",
    "advancedReport": true,
    "reportPath": "security-report.json"
  },
  "compliance": {
    "enabled": true,
    "standards": ["OWASP", "GDPR", "HIPAA", "PCI-DSS", "SOX"]
  }
}
```

## Troubleshooting

### Configuration Not Applied

If your configuration doesn't seem to be applied:

1. Check that the file is in the correct location
2. Verify the JSON syntax is valid
3. Use the `--verbose` flag to see which configuration file is being used
4. Try specifying the configuration file path explicitly with `-c`

### Performance Issues

If you're experiencing performance issues:

1. Reduce `maxConcurrentFiles`
2. Disable `enableSemanticAnalysis` for faster scans
3. Increase `timeout` for large files
4. Use a performance profile with `--performance fast`

## Support

For additional configuration assistance, please open an issue in the GitHub repository.
