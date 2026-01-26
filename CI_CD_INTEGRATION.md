# CI/CD Integration Guide

This guide provides comprehensive instructions for integrating Vue Security Scanner into various CI/CD platforms.

## Table of Contents

- [GitHub Actions](#github-actions)
- [GitLab CI/CD](#gitlab-cicd)
- [Jenkins](#jenkins)
- [Azure DevOps](#azure-devops)
- [Bitbucket Pipelines](#bitbucket-pipelines)
- [CircleCI](#circleci)
- [Travis CI](#travis-ci)

## GitHub Actions

### Basic Setup

1. Create `.github/workflows/vue-security-scan.yml` in your repository:

```yaml
name: Vue Security Scanner

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main, develop ]

jobs:
  security-scan:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v4
    - uses: actions/setup-node@v4
      with:
        node-version: '18'
    - run: npm ci
    - run: npm install -g vue-security-scanner
    - run: vue-security-scanner . --output json --report security-report.json
    - uses: actions/upload-artifact@v4
      with:
        name: security-report
        path: security-report.json
```

### Advanced Configuration

For advanced features including PR comments and trend analysis:

```yaml
name: Vue Security Scanner

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main, develop ]
  schedule:
    - cron: '0 2 * * *'

jobs:
  security-scan:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v4
      with:
        fetch-depth: 0
    - uses: actions/setup-node@v4
      with:
        node-version: '18'
        cache: 'npm'
    - run: npm ci
    - run: npm install -g vue-security-scanner
    - run: |
        vue-security-scanner . \
          --output json \
          --report security-report.json \
          --level detailed \
          --advanced-report
      continue-on-error: true
    - uses: actions/upload-artifact@v4
      if: always()
      with:
        name: security-report
        path: |
          security-report.json
          security-report-advanced.html
        retention-days: 30
```

### PR Comments

To automatically comment on PRs with scan results:

```yaml
    - name: Comment PR with results
      if: github.event_name == 'pull_request'
      uses: actions/github-script@v7
      with:
        script: |
          const fs = require('fs');
          const report = JSON.parse(fs.readFileSync('security-report.json', 'utf8'));
          const summary = report.summary;
          
          const comment = `## 🔒 Security Scan Results
          
          - **Total Vulnerabilities**: ${summary.totalVulnerabilities}
          - **Critical/High**: ${summary.highSeverity}
          - **Medium**: ${summary.mediumSeverity}
          - **Low**: ${summary.lowSeverity}
          
          ${summary.totalVulnerabilities > 0 ? '⚠️ Security issues detected.' : '✅ No security issues found!'}
          `;
          
          github.rest.issues.createComment({
            issue_number: context.issue.number,
            owner: context.repo.owner,
            repo: context.repo.repo,
            body: comment
          });
```

## GitLab CI/CD

### Basic Setup

Create `.gitlab-ci.yml` in your repository:

```yaml
stages:
  - security-scan

security-scan:
  stage: security-scan
  image: node:18
  before_script:
    - npm ci
    - npm install -g vue-security-scanner
  script:
    - vue-security-scan . --output json --report security-report.json
  artifacts:
    paths:
      - security-report.json
    expire_in: 30 days
  allow_failure: true
```

### Advanced Configuration

```yaml
stages:
  - security-scan
  - security-report

variables:
  NODE_VERSION: "18"
  SECURITY_SCAN_LEVEL: "detailed"

security-scan:
  stage: security-scan
  image: node:${NODE_VERSION}
  before_script:
    - npm ci
    - npm install -g vue-security-scanner
  script:
    - vue-security-scan . --output json --report security-report.json --level $SECURITY_SCAN_LEVEL --advanced-report
  artifacts:
    paths:
      - security-report.json
      - security-report-advanced.html
    expire_in: 30 days
    reports:
      sast: security-report.json
  allow_failure: true

security-report:
  stage: security-report
  image: node:${NODE_VERSION}
  dependencies:
    - security-scan
  script:
    - echo "Generating security summary..."
  only:
    - main
    - develop
```

### Merge Request Comments

To automatically comment on merge requests:

```yaml
mr-security-check:
  stage: security-scan
  image: node:18
  before_script:
    - npm ci
    - npm install -g vue-security-scanner
  script:
    - vue-security-scan . --output json --report security-report-mr.json --level detailed
    - |
      node -e "
        const fs = require('fs');
        const report = JSON.parse(fs.readFileSync('security-report-mr.json', 'utf8'));
        const criticalCount = report.vulnerabilities.filter(v => v.severity === 'Critical').length;
        const highCount = report.vulnerabilities.filter(v => v.severity === 'High').length;
        
        if (criticalCount > 0 || highCount > 0) {
          console.error(\`Found \${criticalCount} Critical and \${highCount} High severity vulnerabilities\`);
          process.exit(1);
        }
      "
  only:
    - merge_requests
```

## Jenkins

### Basic Setup

Create `Jenkinsfile` in your repository:

```groovy
pipeline {
    agent any
    
    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }
        
        stage('Install Dependencies') {
            steps {
                sh 'npm ci'
            }
        }
        
        stage('Install Vue Security Scanner') {
            steps {
                sh 'npm install -g vue-security-scanner'
            }
        }
        
        stage('Run Security Scan') {
            steps {
                sh 'vue-security-scan . --output json --report security-report.json'
            }
        }
        
        stage('Archive Reports') {
            steps {
                archiveArtifacts artifacts: 'security-report.json', fingerprint: true
            }
        }
    }
}
```

### Advanced Configuration

See the provided `Jenkinsfile` for a comprehensive Jenkins pipeline with:
- Multiple Node.js versions
- Advanced report generation
- HTML report publishing
- PR-style checks
- Failure handling

### Jenkins Plugin

For deeper integration, use the Vue Security Scanner Jenkins Plugin:

1. Install the plugin from the Jenkins Plugin Manager
2. Configure the plugin in System Configuration
3. Add "Vue Security Scan" build step to your pipeline

## Azure DevOps

### Basic Setup

Create `azure-pipelines.yml`:

```yaml
trigger:
- main
- develop

pool:
  vmImage: 'ubuntu-latest'

steps:
- task: NodeTool@0
  inputs:
    versionSpec: '18.x'
  displayName: 'Install Node.js'

- script: |
    npm ci
    npm install -g vue-security-scanner
  displayName: 'Install dependencies'

- script: |
    vue-security-scan . --output json --report security-report.json
  displayName: 'Run security scan'
  continueOnError: true

- task: PublishBuildArtifacts@1
  inputs:
    PathtoPublish: 'security-report.json'
    ArtifactName: 'security-report'
    publishLocation: 'Container'
```

## Bitbucket Pipelines

### Basic Setup

Create `bitbucket-pipelines.yml`:

```yaml
image: node:18

pipelines:
  default:
    - step:
        name: Security Scan
        script:
          - npm ci
          - npm install -g vue-security-scanner
          - vue-security-scan . --output json --report security-report.json
        artifacts:
          - security-report.json
```

## CircleCI

### Basic Setup

Create `.circleci/config.yml`:

```yaml
version: 2.1

jobs:
  security-scan:
    docker:
      - image: cimg/node:18.0
    steps:
      - checkout
      - run: npm ci
      - run: npm install -g vue-security-scanner
      - run: vue-security-scan . --output json --report security-report.json
      - store_artifacts:
          path: security-report.json

workflows:
  version: 2
  security-scan:
    jobs:
      - security-scan
```

## Travis CI

### Basic Setup

Create `.travis.yml`:

```yaml
language: node_js
node_js:
  - '18'

install:
  - npm ci
  - npm install -g vue-security-scanner

script:
  - vue-security-scan . --output json --report security-report.json

after_success:
  - echo "Security scan completed successfully"

after_failure:
  - echo "Security scan failed - check reports"
```

## Configuration Options

### Command Line Options

```bash
vue-security-scan [project-path] [options]

Options:
  --output <format>      Output format: text, json, html
  --report <path>         Report file path
  --level <level>         Scan level: basic, detailed
  --config <path>         Configuration file path
  --advanced-report        Enable advanced reporting (trends, compliance)
  --batch-size <number>   Batch size for large projects
  --memory-threshold <MB> Memory threshold for GC
  --gc-interval <number>  GC interval in files
```

### Configuration File

Create `vue-security-scanner.config.json`:

```json
{
  "output": {
    "format": "json",
    "advancedReport": true,
    "reportPath": "security-report.json"
  },
  "performance": {
    "enableSemanticAnalysis": true,
    "enableNpmAudit": true,
    "enableVulnerabilityDB": true
  },
  "compliance": {
    "enabled": true,
    "standards": ["OWASP", "GDPR", "HIPAA", "PCI-DSS", "SOX"]
  }
}
```

## Best Practices

### 1. Fail on Critical Vulnerabilities

```bash
vue-security-scan . --output json --report report.json || exit 1
```

### 2. Schedule Regular Scans

- GitHub Actions: Use `schedule` trigger
- GitLab CI: Use `only: variables: $CI_PIPELINE_SOURCE == "schedule"`
- Jenkins: Use periodic triggers

### 3. Store Historical Data

Enable report history for trend analysis:

```json
{
  "reportHistory": {
    "enabled": true,
    "path": ".vue-security-reports",
    "maxSize": 100
  }
}
```

### 4. Integrate with Issue Trackers

Use scripts to automatically create issues for vulnerabilities:

```javascript
const report = JSON.parse(fs.readFileSync('security-report.json', 'utf8'));
const criticalVulns = report.vulnerabilities.filter(v => v.severity === 'Critical');

criticalVulns.forEach(vuln => {
  // Create GitHub issue
  // Create Jira ticket
  // Create GitLab issue
});
```

### 5. Use Advanced Reports

Enable advanced reports for comprehensive analysis:

```bash
vue-security-scan . --advanced-report --output html
```

This includes:
- Trend analysis
- Compliance reports (OWASP, GDPR, HIPAA, PCI-DSS, SOX)
- Vulnerability distribution
- Fix complexity assessment
- Priority recommendations

## Troubleshooting

### Common Issues

1. **Scanner not found**
   - Ensure `npm install -g vue-security-scanner` is run
   - Check Node.js version (>= 14.0.0)

2. **Memory issues**
   - Use `--batch-size` and `--memory-threshold` options
   - Enable GC with `--gc-interval`

3. **False positives**
   - Use `.vue-security-ignore` file
   - Adjust severity thresholds in config

4. **Slow scans**
   - Use `--level basic` for faster scans
   - Ignore unnecessary directories
   - Use batch processing for large projects

## Support

For issues and questions:
- GitHub Issues: https://github.com/ereddate/vue-security-scanner/issues
- Documentation: https://github.com/ereddate/vue-security-scanner#readme
- Examples: See `examples/` directory
