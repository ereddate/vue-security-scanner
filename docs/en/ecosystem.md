# Ecosystem Integration Guide

This guide explains how to integrate Vue Security Scanner with various tools and platforms in your development ecosystem.

## Table of Contents

- [Package Managers](#package-managers)
- [Build Tools](#build-tools)
- [IDEs and Editors](#ides-and-editors)
- [CI/CD Platforms](#cicd-platforms)
- [Monitoring Tools](#monitoring-tools)
- [Security Tools](#security-tools)
- [Cloud Services](#cloud-services)

## Package Managers

### npm

```bash
# Global installation
npm install -g vue-security-scanner

# Project-specific installation
npm install --save-dev vue-security-scanner

# Run from project
npx vue-security-scanner .
```

### Yarn

```bash
# Global installation
yarn global add vue-security-scanner

# Project-specific installation
yarn add --dev vue-security-scanner

# Run from project
yarn vue-security-scanner .
```

### pnpm

```bash
# Global installation
pnpm add -g vue-security-scanner

# Project-specific installation
pnpm add -D vue-security-scanner

# Run from project
pnpm exec vue-security-scanner .
```

## Build Tools

### Vite

Install the Vite plugin:

```bash
npm install --save-dev vite-plugin-vue-security
```

Add to `vite.config.js`:

```javascript
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueSecurity from 'vite-plugin-vue-security'

export default defineConfig({
  plugins: [
    vue(),
    vueSecurity({
      // Plugin options
      scanOnBuild: true,
      output: 'json',
      reportPath: 'security-report.json',
      level: 'detailed'
    })
  ]
})
```

### Webpack

Install the Webpack plugin:

```bash
npm install --save-dev webpack-plugin-vue-security
```

Add to `webpack.config.js`:

```javascript
const VueSecurityWebpackPlugin = require('webpack-plugin-vue-security');

module.exports = {
  // ... other webpack config
  plugins: [
    new VueSecurityWebpackPlugin({
      // Plugin options
      scanOnBuild: true,
      output: 'json',
      reportPath: 'security-report.json',
      level: 'detailed'
    })
  ]
};
```

### Rollup

Install the Rollup plugin:

```bash
npm install --save-dev rollup-plugin-vue-security
```

Add to `rollup.config.js`:

```javascript
import vue from '@rollup/plugin-vue';
import vueSecurity from 'rollup-plugin-vue-security';

export default {
  input: 'src/main.js',
  output: {
    file: 'dist/bundle.js',
    format: 'esm'
  },
  plugins: [
    vue(),
    vueSecurity({
      // Plugin options
      scanOnBuild: true,
      output: 'json',
      reportPath: 'security-report.json',
      level: 'detailed'
    })
  ]
};
```

## IDEs and Editors

### Visual Studio Code

Install the VSCode extension:

1. Download the `.vsix` file from the releases page
2. In VSCode, press `Ctrl+Shift+P` (Windows/Linux) or `Cmd+Shift+P` (Mac)
3. Type "Extensions: Install from VSIX..."
4. Select the downloaded `.vsix` file

The extension provides:
- Right-click menu options for scanning files/folders
- Integrated security report panel
- Real-time security diagnostics in the editor
- Command palette integration

### JetBrains IDEs (WebStorm, IntelliJ IDEA)

Use the built-in terminal to run the scanner:

```bash
# Add to package.json scripts
"scripts": {
  "security": "vue-security-scanner . --output json --report security-report.json"
}

# Run from IDE
npm run security
```

### Sublime Text

Install the `Terminus` plugin for terminal integration, then run:

```bash
vue-security-scanner .
```

## CI/CD Platforms

For detailed CI/CD integration instructions, see the [CI/CD Integration Guide](./ci-cd-integration.md).

## Monitoring Tools

### Prometheus

You can expose security metrics to Prometheus:

```javascript
const promClient = require('prom-client');
const scanner = require('vue-security-scanner');

// Create metrics
const securityIssuesGauge = new promClient.Gauge({
  name: 'vue_security_issues_total',
  help: 'Total security issues detected',
  labelNames: ['severity', 'type']
});

// Run scan and update metrics
async function updateSecurityMetrics() {
  const result = await scanner.scan('./src');
  
  // Update metrics
  securityIssuesGauge.reset();
  result.issues.forEach(issue => {
    securityIssuesGauge.labels(issue.severity, issue.type).inc();
  });
}

// Expose metrics
const express = require('express');
const app = express();

app.get('/metrics', async (req, res) => {
  await updateSecurityMetrics();
  res.set('Content-Type', promClient.register.contentType);
  res.end(await promClient.register.metrics());
});

app.listen(3000);
```

### Grafana

Create a Grafana dashboard to visualize security metrics:

1. Add Prometheus as a data source
2. Create a dashboard with panels for:
   - Total security issues by severity
   - Security issues trend over time
   - Security issues by type
   - Project comparison

## Security Tools

### OWASP ZAP

Integrate with OWASP Zed Attack Proxy:

```bash
# Run Vue Security Scanner
vue-security-scanner . --output json --report security-report.json

# Import results into ZAP
zap-cli import --format json security-report.json
```

### SonarQube

Use the SonarQube Scanner to import results:

```bash
# Run Vue Security Scanner
vue-security-scanner . --output json --report security-report.json

# Convert to SonarQube format
node scripts/convert-to-sonar.js security-report.json sonar-report.json

# Run SonarQube Scanner
sonar-scanner -Dsonar.sources=. -Dsonar.security.sources=sonar-report.json
```

### Snyk

Combine with Snyk for comprehensive security:

```bash
# Run Vue Security Scanner for code issues
vue-security-scanner . --output json --report code-security.json

# Run Snyk for dependency issues
snyk test --json > dependency-security.json

# Combine results
node scripts/combine-reports.js code-security.json dependency-security.json combined-security.json
```

## Cloud Services

### AWS

Use AWS CodeBuild to run security scans:

```yaml
# buildspec.yml
version: 0.2

phases:
  install:
    runtime-versions:
      nodejs: 18
    commands:
      - npm install -g vue-security-scanner
  build:
    commands:
      - vue-security-scanner . --output json --report security-report.json
artifacts:
  files:
    - security-report.json
```

### Azure DevOps

Add a security scan task to your pipeline:

```yaml
# azure-pipelines.yml
jobs:
- job: SecurityScan
  pool:
    vmImage: 'ubuntu-latest'
  steps:
  - task: NodeTool@0
    inputs:
      versionSpec: '18.x'
  - script: npm install -g vue-security-scanner
    displayName: 'Install Vue Security Scanner'
  - script: vue-security-scanner . --output json --report security-report.json
    displayName: 'Run Security Scan'
  - task: PublishBuildArtifacts@1
    inputs:
      pathtoPublish: 'security-report.json'
      artifactName: 'security-report'
```

### Google Cloud Build

Create a Cloud Build configuration:

```yaml
# cloudbuild.yaml
steps:
- name: 'node:18'
  entrypoint: 'npm'
  args: ['install', '-g', 'vue-security-scanner']
- name: 'node:18'
  entrypoint: 'vue-security-scanner'
  args: ['.', '--output', 'json', '--report', 'security-report.json']
artifacts:
  objects:
    location: 'gs://${_BUCKET_NAME}/'
    paths: ['security-report.json']
```

## Custom Integrations

### API Integration

You can integrate the scanner programmatically:

```javascript
const scanner = require('vue-security-scanner');

// Run scan
const result = await scanner.scan('./src', {
  level: 'detailed',
  output: 'json',
  config: './vue-security-scanner.config.json'
});

// Process results
console.log(`Found ${result.totalIssues} issues`);
result.issues.forEach(issue => {
  console.log(`${issue.severity}: ${issue.description} in ${issue.file}:${issue.line}`);
});
```

### Webhooks

Send scan results to webhooks:

```javascript
const scanner = require('vue-security-scanner');
const fetch = require('node-fetch');

// Run scan
const result = await scanner.scan('./src');

// Send to webhook
await fetch('https://webhook.example.com/security', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify(result)
});
```

## Best Practices

### Integration Strategy

1. **Pre-commit Hooks**: Run lightweight scans before commits
2. **CI Pipeline**: Run comprehensive scans in CI
3. **Scheduled Scans**: Run deep scans on a schedule
4. **Monitoring**: Continuously monitor security status

### Performance Optimization

- **Incremental Scanning**: Use `--incremental` for faster scans
- **Performance Profiles**: Use `--performance fast` for development
- **Selective Scanning**: Focus on critical directories

### Security Automation

- **Automated Remediation**: Integrate with tools that can automatically fix issues
- **Security Gates**: Block builds with high-severity issues
- **Alerting**: Set up alerts for new security issues

## Support

For additional integration assistance, please open an issue in the GitHub repository.
