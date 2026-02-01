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
    - cron: '0 0 * * 0'  # Weekly scan

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
    - run: vue-security-scanner . --output json --report security-report.json --level detailed --advanced-report
    - uses: actions/upload-artifact@v4
      with:
        name: security-report
        path: security-report.json

  # Optional: PR comment integration
  pr-comment:
    needs: security-scan
    runs-on: ubuntu-latest
    if: github.event_name == 'pull_request'
    steps:
    - uses: actions/checkout@v4
    - uses: actions/download-artifact@v4
      with:
        name: security-report
    - run: npm install -g vue-security-scanner
    - run: node -e "
        const report = require('./security-report.json');
        const comment = `## Security Scan Results\n\n` +
                       `**Total Issues**: ${report.totalIssues}\n` +
                       `**High Severity**: ${report.highSeverity}\n` +
                       `**Medium Severity**: ${report.mediumSeverity}\n` +
                       `**Low Severity**: ${report.lowSeverity}\n\n` +
                       `Full report available as artifact.`;
        console.log(comment);
        // Use GitHub API to post comment
      "
```

## GitLab CI/CD

### Basic Setup

Add the following to your `.gitlab-ci.yml` file:

```yaml
stages:
  - test
  - security

security-scan:
  stage: security
  image: node:18-alpine
  script:
    - npm install -g vue-security-scanner
    - vue-security-scanner . --output json --report security-report.json
  artifacts:
    paths:
      - security-report.json
    expire_in: 1 week
  rules:
    - if: '$CI_PIPELINE_SOURCE == "merge_request_event"'
      when: always
    - if: '$CI_COMMIT_BRANCH == "main"'
      when: always
```

### Advanced Configuration

For multi-stage scanning and trend analysis:

```yaml
stages:
  - test
  - security
  - report

security-scan:
  stage: security
  image: node:18-alpine
  script:
    - npm install -g vue-security-scanner
    - vue-security-scanner . --output json --report security-report.json --level detailed --advanced-report
  artifacts:
    paths:
      - security-report.json
    expire_in: 1 week

security-trend:
  stage: report
  image: node:18-alpine
  needs: [security-scan]
  script:
    - npm install -g vue-security-scanner
    - node -e "
        const report = require('./security-report.json');
        console.log('Security Scan Trend Analysis:');
        console.log('- Total Issues:', report.totalIssues);
        console.log('- High Severity:', report.highSeverity);
        console.log('- Medium Severity:', report.mediumSeverity);
        console.log('- Low Severity:', report.lowSeverity);
      "
```

## Jenkins

### Basic Setup

Add the following to your `Jenkinsfile`:

```groovy
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

### Advanced Configuration

For HTML reports and build blocking:

```groovy
pipeline {
    agent any
    stages {
        stage('Security Scan') {
            steps {
                sh 'npm install -g vue-security-scanner'
                sh 'vue-security-scanner . --output html --report security-report.html --level detailed --advanced-report'
            }
        }
        stage('Security Analysis') {
            steps {
                script {
                    def report = readJSON file: 'security-report.json'
                    if (report.highSeverity > 0) {
                        error "Security scan found ${report.highSeverity} high severity issues"
                    }
                }
            }
        }
    }
    post {
        always {
            archiveArtifacts artifacts: 'security-report.*', fingerprint: true
        }
    }
}
```

## Azure DevOps

### Basic Setup

Add the following to your `azure-pipelines.yml` file:

```yaml
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

## Bitbucket Pipelines

### Basic Setup

Add the following to your `bitbucket-pipelines.yml` file:

```yaml
image: node:18

pipelines:
  default:
    - step:
        name: Security Scan
        script:
          - npm install -g vue-security-scanner
          - vue-security-scanner . --output json --report security-report.json
        artifacts:
          - security-report.json

  pull-requests:
    '**':
      - step:
          name: Security Scan
          script:
            - npm install -g vue-security-scanner
            - vue-security-scanner . --output json --report security-report.json
          artifacts:
            - security-report.json
```

## CircleCI

### Basic Setup

Add the following to your `.circleci/config.yml` file:

```yaml
version: 2.1

jobs:
  security-scan:
    docker:
      - image: circleci/node:18
    steps:
      - checkout
      - run:
          name: Install Vue Security Scanner
          command: npm install -g vue-security-scanner
      - run:
          name: Run Security Scan
          command: vue-security-scanner . --output json --report security-report.json
      - store_artifacts:
          path: security-report.json

workflows:
  version: 2
  scan:
    jobs:
      - security-scan
```

## Travis CI

### Basic Setup

Add the following to your `.travis.yml` file:

```yaml
language: node_js
node_js:
  - '18'

script:
  - npm test
  - npm install -g vue-security-scanner
  - vue-security-scanner . --output json --report security-report.json

artifacts:
  paths:
    - security-report.json
```

## Common Configuration

### Environment Variables

You can configure the scanner using environment variables:

```bash
# Set custom configuration
VUE_SECURITY_CONFIG="/path/to/config.json" vue-security-scanner .

# Set performance profile
VUE_SECURITY_PERFORMANCE="fast" vue-security-scanner .

# Enable incremental scanning
VUE_SECURITY_INCREMENTAL="true" vue-security-scanner .
```

### Security Gates

To implement security gates in your CI/CD pipeline:

```bash
# Check for high severity issues
vue-security-scanner . --output json --report security-report.json

# Fail build on high severity issues
HIGH_SEVERITY=$(node -e "console.log(require('./security-report.json').highSeverity)")
if [ "$HIGH_SEVERITY" -gt 0 ]; then
  echo "Security scan found $HIGH_SEVERITY high severity issues"
  exit 1
fi
```

### Trend Analysis

For trend analysis across builds:

1. Store security reports in a persistent location
2. Use the `--advanced-report` flag for detailed metrics
3. Compare current report with historical data

## Troubleshooting

### Common Issues

- **Node.js Version**: Ensure you're using Node.js 14 or higher
- **Memory Limits**: For large projects, increase memory limits with `NODE_OPTIONS=--max-old-space-size=4096`
- **Timeouts**: For complex scans, increase CI timeout settings

### Debugging

To enable debug output:

```bash
DEBUG=vue-security-scanner vue-security-scanner .
```

## Support

For additional support with CI/CD integration, please open an issue in the GitHub repository.
