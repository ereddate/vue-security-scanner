# Usage Examples Guide

This guide provides comprehensive examples of how to use Vue Security Scanner in various scenarios.

## Overview

Usage examples demonstrate:
- Basic scanning techniques
- Advanced configuration options
- Integration with other tools
- Specialized scanning scenarios
- Real-world use cases

## Basic Usage Examples

### Simple Scan

```bash
# Scan current directory
vue-security-scanner .

# Scan specific directory
vue-security-scanner src

# Scan multiple directories
vue-security-scanner src components views
```

### Output Formats

```bash
# Console output (default)
vue-security-scanner . --output console

# JSON output
vue-security-scanner . --output json --report security-report.json

# HTML output
vue-security-scanner . --output html --report security-report.html

# CSV output
vue-security-scanner . --output csv --report security-report.csv
```

### Severity Filtering

```bash
# Only high and critical severity issues
vue-security-scanner . --severity high,critical

# Only critical issues
vue-security-scanner . --severity critical

# Exclude low severity issues
vue-security-scanner . --exclude-severity low
```

## Advanced Usage Examples

### Custom Configuration

```bash
# Use custom configuration file
vue-security-scanner . --config vue-security-scanner.config.json

# Override specific configuration
vue-security-scanner . --config vue-security-scanner.config.json --level detailed
```

### Performance Optimization

```bash
# Use fast performance profile
vue-security-scanner . --performance fast

# Use thorough performance profile
vue-security-scanner . --performance thorough

# Set batch size
vue-security-scanner . --batch-size 10

# Enable incremental scanning
vue-security-scanner . --incremental
```

### Ignore Rules

```bash
# Use ignore file
vue-security-scanner . --ignore-file .vue-security-ignore

# Ignore specific directories
vue-security-scanner . --ignore-dir node_modules --ignore-dir dist

# Ignore specific patterns
vue-security-scanner . --ignore-pattern "**/*.min.js" --ignore-pattern "**/vendor/**"
```

## Integration Examples

### npm Scripts

```json
{
  "scripts": {
    "security": "vue-security-scanner . --output json --report security-report.json",
    "security:html": "vue-security-scanner . --output html --report security-report.html",
    "security:detailed": "vue-security-scanner . --level detailed --output json --report security-report-detailed.json"
  }
}
```

### Git Hooks

```bash
# pre-commit hook
#!/bin/sh
vue-security-scanner . --severity high,critical --output console
if [ $? -ne 0 ]; then
  echo "Security issues found. Please fix them before committing."
  exit 1
fi
```

### Editor Integration

#### Visual Studio Code

Add to `tasks.json`:

```json
{
  "version": "2.0.0",
  "tasks": [
    {
      "label": "security-scan",
      "type": "shell",
      "command": "vue-security-scanner . --output json --report security-report.json",
      "problemMatcher": [],
      "group": {
        "kind": "build",
        "isDefault": true
      }
    }
  ]
}
```

## Framework-Specific Examples

### Vue 2

```bash
# Scan Vue 2 project
vue-security-scanner . --vue2

# With Vue 2 specific rules
vue-security-scanner . --vue2 --rules vue2
```

### Vue 3

```bash
# Scan Vue 3 project
vue-security-scanner . --vue3

# With Vue 3 specific rules
vue-security-scanner . --vue3 --rules vue3
```

### Nuxt.js

```bash
# Scan Nuxt.js project
vue-security-scanner . --nuxt

# With Nuxt specific rules
vue-security-scanner . --nuxt --rules nuxt
```

### Vite

```bash
# Scan Vite project
vue-security-scanner . --vite

# With Vite specific rules
vue-security-scanner . --vite --rules vite
```

## CI/CD Integration Examples

### GitHub Actions

```yaml
# .github/workflows/vue-security-scan.yml
name: Vue Security Scan

on: [push, pull_request]

jobs:
  security-scan:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '18'
      - name: Install Vue Security Scanner
        run: npm install -g vue-security-scanner
      - name: Run Security Scan
        run: vue-security-scanner . --output json --report security-report.json
      - name: Upload Security Report
        uses: actions/upload-artifact@v3
        with:
          name: security-report
          path: security-report.json
```

### GitLab CI/CD

```yaml
# .gitlab-ci.yml
security-scan:
  image: node:18-alpine
  stage: test
  script:
    - npm install -g vue-security-scanner
    - vue-security-scanner . --output json --report security-report.json
  artifacts:
    paths:
      - security-report.json
    expire_in: 1 week
```

### Jenkins

```groovy
// Jenkinsfile
pipeline {
    agent any
    stages {
        stage('Security Scan') {
            steps {
                sh 'npm install -g vue-security-scanner'
                sh 'vue-security-scanner . --output json --report security-report.json'
            }
        }
    }
    post {
        always {
            archiveArtifacts artifacts: 'security-report.json', fingerprint: true
        }
    }
}
```

## Docker Examples

### Run in Docker Container

```bash
# Pull latest image
docker pull vuesecurityscanner/vue-security-scanner:latest

# Run scan in container
docker run --rm -v "$(pwd):/app" vuesecurityscanner/vue-security-scanner:latest /app

# Run with custom configuration
docker run --rm -v "$(pwd):/app" vuesecurityscanner/vue-security-scanner:latest /app --config vue-security-scanner.config.json
```

### Docker Compose

```yaml
# docker-compose.yml
version: '3'
services:
  vue-security-scanner:
    image: vuesecurityscanner/vue-security-scanner:latest
    volumes:
      - .:/app
    command: ["/app", "--output", "json", "--report", "/app/security-report.json"]
```

## Distributed Scanning Examples

### Start Workers

```bash
# Start worker 1
vue-security-distributed worker --port 3001 --worker-id worker-1

# Start worker 2
vue-security-distributed worker --port 3002 --worker-id worker-2

# Start worker with custom memory limit
vue-security-distributed worker --port 3003 --worker-id worker-3 --memory-limit 2048
```

### Run Distributed Scan

```bash
# Create workers configuration
cat > workers.json << EOF
{
  "workers": [
    {
      "id": "worker-1",
      "url": "http://localhost:3001"
    },
    {
      "id": "worker-2",
      "url": "http://localhost:3002"
    }
  ]
}
EOF

# Run distributed scan
vue-security-distributed scan . --workers workers.json --batch-size 10 --output json --report distributed-security-report.json
```

## Enterprise Usage Examples

### Enterprise Configuration

```bash
# Use enterprise configuration
vue-security-scanner . --config config/enterprise-config.json

# Enterprise scan with compliance checks
vue-security-scanner . --config config/enterprise-config.json --compliance pci-dss,gdpr
```

### License Activation

```bash
# Activate enterprise license
vue-security-scanner . --license activate --license-key "YOUR_LICENSE_KEY"

# Check license status
vue-security-scanner . --license status
```

## Specialized Scanning Examples

### Incremental Scanning

```bash
# Enable incremental scanning
vue-security-scanner . --incremental

# With custom cache directory
vue-security-scanner . --incremental --cache-dir .vue-security-cache

# Force full scan
vue-security-scanner . --incremental --force-full
```

### Dependency Scanning

```bash
# Enable dependency scanning
vue-security-scanner . --dependencies

# With vulnerability database update
vue-security-scanner . --dependencies --update-db

# Dependency-only scan
vue-security-scanner . --dependencies --only-dependencies
```

### TypeScript Scanning

```bash
# Enable TypeScript scanning
vue-security-scanner . --typescript

# With tsconfig.json
vue-security-scanner . --typescript --tsconfig tsconfig.json

# TypeScript-specific rules
vue-security-scanner . --typescript --rules typescript
```

## Real-World Examples

### Large Monorepo

```bash
# Scan large monorepo
vue-security-scanner . --batch-size 5 --memory-threshold 70 --performance fast

# Distributed scan for monorepo
vue-security-distributed scan . --workers workers.json --batch-size 10 --output json --report monorepo-security-report.json
```

### Microservices Architecture

```bash
# Scan multiple microservices
for service in services/*; do
  echo "Scanning $service..."
  vue-security-scanner $service --output json --report "security-report-${service##*/}.json"
done

# Aggregate results
vue-security-scanner . --aggregate-reports "security-report-*.json" --output json --report aggregated-security-report.json
```

### Legacy Application

```bash
# Scan legacy Vue 2 application
vue-security-scanner . --vue2 --level basic

# With legacy compatibility mode
vue-security-scanner . --vue2 --compatibility legacy
```

## Troubleshooting Examples

### Debug Mode

```bash
# Enable debug output
vue-security-scanner . --debug

# Verbose output
vue-security-scanner . --verbose

# Trace level output
vue-security-scanner . --trace
```

### Validation

```bash
# Validate configuration file
vue-security-scanner . --config vue-security-scanner.config.json --validate-config

# Validate custom rules
vue-security-scanner . --config vue-security-scanner.config.json --validate-rules

# Test specific rule
vue-security-scanner . --test-rule hardcoded-password
```

## Best Practices Examples

### Development Workflow

```bash
# Pre-commit scan (fast)
vue-security-scanner . --performance fast --severity high,critical

# Daily scan (thorough)
vue-security-scanner . --performance thorough --output json --report daily-security-report.json

# Weekly compliance scan
vue-security-scanner . --compliance all --output html --report weekly-compliance-report.html
```

### CI/CD Pipeline

```bash
# Pull request scan (fast)
vue-security-scanner . --performance fast --severity high,critical --output json --report pr-security-report.json

# Master branch scan (thorough)
vue-security-scanner . --performance thorough --output json --report master-security-report.json

# Release scan (comprehensive)
vue-security-scanner . --performance thorough --compliance all --output html --report release-security-report.html
```

## Integration Examples

### With ESLint

```bash
# Run ESLint first, then security scan
eslint . && vue-security-scanner .

# Combine results
vue-security-scanner . --output json --report security-report.json && eslint . --format json > eslint-report.json && node scripts/combine-reports.js
```

### With Prettier

```bash
# Format code with Prettier, then scan
prettier --write . && vue-security-scanner .
```

### With Jest

```bash
# Run tests, then security scan
jest && vue-security-scanner .

# Security scan as part of test suite
# Add to package.json scripts
"scripts": {
  "test": "jest",
  "security": "vue-security-scanner .",
  "test:all": "npm run test && npm run security"
}
```

## Support

For additional usage examples and help:

1. **Documentation**: Review the official documentation
2. **GitHub Issues**: Ask questions and share examples
3. **Community Forum**: Join the Vue Security community
4. **Enterprise Support**: Contact enterprise support for custom examples
