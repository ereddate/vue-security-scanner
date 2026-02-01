# Vue Security Scanner Quick Start Guide

Welcome to Vue Security Scanner! This guide will help you get started quickly with scanning your Vue.js projects for security vulnerabilities.

## Table of Contents

- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Basic Usage](#basic-usage)
- [Understanding Results](#understanding-results)
- [Common Scenarios](#common-scenarios)
- [Next Steps](#next-steps)

## Prerequisites

Before you begin, ensure you have:

- **Node.js**: Version 14.0.0 or higher
- **npm**: Version 6.0.0 or higher
- **A Vue.js project**: Any Vue 2.x or Vue 3.x project

Check your versions:

```bash
node -v
npm -v
```

## Installation

### Option 1: Global Installation (Recommended)

Install globally for easy access from any directory:

```bash
npm install -g vue-security-scanner
```

Verify installation:

```bash
vue-security-scanner --version
```

### Option 2: Local Installation

Install locally in your project:

```bash
npm install --save-dev vue-security-scanner
```

Run with npx:

```bash
npx vue-security-scanner
```

### Option 3: Run Without Installation

Use npx to run without installing:

```bash
npx vue-security-scanner [project-path]
```

## Basic Usage

### Scan Current Directory

The simplest way to scan your project:

```bash
vue-security-scanner .
```

This will:
- Scan all Vue files in the current directory
- Use default configuration
- Display results in the console
- Generate a basic security report

### Scan Specific Project

Scan a specific project directory:

```bash
vue-security-scanner /path/to/your-vue-project
```

### Generate Detailed Report

Generate a detailed report in JSON format:

```bash
vue-security-scanner . --report security-report.json --output json
```

### Scan with Detailed Level

Get more detailed information:

```bash
vue-security-scanner . --level detailed
```

### Use Custom Configuration

Use a custom configuration file:

```bash
vue-security-scanner . --config my-config.json
```

## Understanding Results

### Console Output

The scanner displays results in the console with color-coded severity levels:

```
🔴 CRITICAL: XSS vulnerability in component.vue:15
  - Using v-html with user input without sanitization
  - Recommendation: Use a sanitization library like DOMPurify

🟡 MEDIUM: Hardcoded API key in config.js:10
  - API key exposed in source code
  - Recommendation: Move to environment variables
```

### Severity Levels

- **🔴 CRITICAL**: Immediate action required
- **🟠 HIGH**: Should be fixed soon
- **🟡 MEDIUM**: Should be addressed
- **🟢 LOW**: Nice to fix, but not urgent

### JSON Report Structure

```json
{
  "summary": {
    "totalIssues": 15,
    "critical": 2,
    "high": 5,
    "medium": 6,
    "low": 2
  },
  "issues": [
    {
      "id": "xss-v-html",
      "severity": "CRITICAL",
      "file": "src/components/UserInput.vue",
      "line": 15,
      "description": "Using v-html with user input without sanitization",
      "recommendation": "Use a sanitization library like DOMPurify"
    }
  ]
}
```

## Common Scenarios

### Scenario 1: New Vue Project

Just created a new Vue project? Scan it before adding features:

```bash
# Create new project
vue create my-project
cd my-project

# Scan for security issues
vue-security-scanner .
```

### Scenario 2: CI/CD Integration

Add security scanning to your CI/CD pipeline:

```yaml
# .github/workflows/security.yml
name: Security Scan

on: [push, pull_request]

jobs:
  security-scan:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Install scanner
        run: npm install -g vue-security-scanner
      - name: Run security scan
        run: vue-security-scanner . --output json --report security-report.json
      - name: Upload results
        uses: actions/upload-artifact@v2
        with:
          name: security-results
          path: security-report.json
```

### Scenario 3: Development Workflow

Scan regularly during development:

```bash
# Before committing changes
vue-security-scanner .

# Or use git pre-commit hook
# .git/hooks/pre-commit
#!/bin/bash
vue-security-scanner . --output json --report security-report.json
if [ $? -ne 0 ]; then
  echo "Security scan failed. Please fix issues before committing."
  exit 1
fi
```

### Scenario 4: Large Project Optimization

For large projects, use performance optimizations:

```bash
# Use incremental scanning (only scan changed files)
vue-security-scanner . --incremental

# Use fast mode
vue-security-scanner . --performance fast

# Combine both
vue-security-scanner . --performance fast --incremental
```

### Scenario 5: Compliance Reporting

Generate compliance reports for regulatory requirements:

```bash
# Generate compliance report
vue-security-scanner . --compliance OWASP --report compliance-report.html
```

## Configuration

### Basic Configuration File

Create a `vue-security-scanner.config.json` file in your project root:

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
    }
  },
  "scan": {
    "ignoreDirs": ["node_modules", "dist", "build"],
    "maxSize": 10
  },
  "output": {
    "format": "json",
    "showDetails": true
  }
}
```

### Ignore Specific Issues

Create a `.vue-security-ignore` file:

```
# Ignore directories
node_modules/
dist/

# Ignore specific rules
rule:deprecated-dependency

# Ignore by severity
severity:low
```

## Command-Line Options

### Basic Options

| Option | Description | Example |
|--------|-------------|----------|
| `--help` | Show help information | `vue-security-scanner --help` |
| `--version` | Show version information | `vue-security-scanner --version` |
| `--config` | Use custom configuration file | `--config my-config.json` |
| `--output` | Output format (json, html, text) | `--output json` |
| `--report` | Report file path | `--report report.json` |
| `--level` | Scan level (basic, detailed) | `--level detailed` |

### Performance Options

| Option | Description | Example |
|--------|-------------|----------|
| `--performance` | Performance profile (fast, balanced, thorough) | `--performance fast` |
| `--incremental` | Enable incremental scanning | `--incremental` |
| `--threads` | Number of threads for parallel processing | `--threads 4` |
| `--batch-size` | Batch size for large projects | `--batch-size 10` |

### Advanced Options

| Option | Description | Example |
|--------|-------------|----------|
| `--advanced-report` | Enable advanced reporting with trends | `--advanced-report` |
| `--semantic-analysis` | Enable AST-based semantic analysis | `--semantic-analysis` |
| `--compliance` | Compliance standard (OWASP, GDPR, etc.) | `--compliance OWASP` |
| `--threat-intelligence` | Enable threat intelligence integration | `--threat-intelligence` |

## Troubleshooting

### Common Issues

#### Issue: Command Not Found

**Problem**: `vue-security-scanner: command not found`

**Solution**:
- Ensure global installation: `npm install -g vue-security-scanner`
- Check npm global bin directory is in PATH
- Try using npx: `npx vue-security-scanner`

#### Issue: Slow Scanning

**Problem**: Scanning takes too long

**Solution**:
- Use incremental scanning: `--incremental`
- Use fast mode: `--performance fast`
- Increase thread count: `--threads 8`
- Exclude unnecessary directories: `--exclude node_modules,dist`

#### Issue: Too Many False Positives

**Problem**: Scanner reports issues that aren't real vulnerabilities

**Solution**:
- Enable semantic analysis: `--semantic-analysis`
- Adjust severity thresholds in config
- Use `.vue-security-ignore` to ignore false positives
- Report false positives to help improve the scanner

#### Issue: Memory Issues

**Problem**: Scanner runs out of memory

**Solution**:
- Reduce batch size: `--batch-size 5`
- Reduce thread count: `--threads 2`
- Use fast mode: `--performance fast`
- Increase Node.js memory limit: `NODE_OPTIONS="--max-old-space-size=4096" vue-security-scanner .`

## Next Steps

### Learn More

- **[Installation Guide](./installation.md)** - Detailed installation instructions
- **[Usage Tutorial](./usage.md)** - Comprehensive usage guide
- **[Configuration Guide](./configuration.md)** - Advanced configuration options
- **[Rule Documentation](./rules/index.md)** - All available security rules

### Advanced Features

- **[Performance Optimization](./performance/index.md)** - Optimize scanning performance
- **[Compliance Guide](./compliance/index.md)** - Generate compliance reports
- **[Threat Intelligence](./threat-intelligence/index.md)** - Integrate threat intelligence
- **[API Reference](./api/index.md)** - Programmatic usage

### Integration

- **[CI/CD Integration](../usage.md#ci/cd-integration)** - Integrate with CI/CD pipelines
- **[VSCode Extension](../usage.md#vscode-extension)** - Use with VSCode
- **[Vite Plugin](../usage.md#vite-plugin)** - Integrate with Vite
- **[Webpack Plugin](../usage.md#webpack-plugin)** - Integrate with Webpack

### Community

- **[Contributing Guide](./CONTRIBUTING.md)** - How to contribute to the project
- **[FAQ](./FAQ.md)** - Frequently asked questions
- **[GitHub Issues](https://github.com/vue-security-scanner/vue-security-scanner/issues)** - Report issues and request features

## Quick Reference

### Essential Commands

```bash
# Basic scan
vue-security-scanner .

# Detailed scan with report
vue-security-scanner . --level detailed --report security-report.json

# Fast scan for development
vue-security-scanner . --performance fast

# Incremental scan (only changed files)
vue-security-scanner . --incremental

# Compliance report
vue-security-scanner . --compliance OWASP --report compliance-report.html
```

### Configuration Files

- `vue-security-scanner.config.json` - Main configuration file
- `.vue-security-ignore` - Ignore rules and files
- `.vue-security-reports/` - Report history directory

### Common Configurations

```json
{
  "rules": {
    "xss": { "enabled": true, "severity": "high" },
    "dependencies": { "enabled": true, "severity": "high" }
  },
  "scan": {
    "ignoreDirs": ["node_modules", "dist", "build"]
  },
  "output": {
    "format": "json",
    "showDetails": true
  }
}
```

---

**Ready to secure your Vue.js application?** Start scanning now and make your application more secure!

For more detailed information, check out our comprehensive [documentation](../README.md#-documentation).
