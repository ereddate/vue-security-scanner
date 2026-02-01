# CI/CD 集成指南

本指南提供了将 Vue Security Scanner 集成到各种 CI/CD 平台的全面说明。

## 目录

- [GitHub Actions](#github-actions)
- [GitLab CI/CD](#gitlab-ci-cd)
- [Jenkins](#jenkins)
- [Azure DevOps](#azure-devops)
- [Bitbucket Pipelines](#bitbucket-pipelines)
- [CircleCI](#circleci)
- [Travis CI](#travis-ci)

## GitHub Actions

### 基本设置

1. 在您的仓库中创建 `.github/workflows/vue-security-scan.yml` 文件：

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

### 高级配置

对于包括 PR 评论和趋势分析在内的高级功能：

```yaml
name: Vue Security Scanner

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main, develop ]
  schedule:
    - cron: '0 0 * * 0'  # 每周扫描

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

  # 可选：PR 评论集成
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
        // 使用 GitHub API 发布评论
      "
```

## GitLab CI/CD

### 基本设置

将以下内容添加到您的 `.gitlab-ci.yml` 文件中：

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

### 高级配置

对于多阶段扫描和趋势分析：

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

### 基本设置

将以下内容添加到您的 `Jenkinsfile` 中：

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

### 高级配置

对于 HTML 报告和构建阻塞：

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

### 基本设置

将以下内容添加到您的 `azure-pipelines.yml` 文件中：

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

### 基本设置

将以下内容添加到您的 `bitbucket-pipelines.yml` 文件中：

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

### 基本设置

将以下内容添加到您的 `.circleci/config.yml` 文件中：

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

### 基本设置

将以下内容添加到您的 `.travis.yml` 文件中：

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

## 通用配置

### 环境变量

您可以使用环境变量配置扫描器：

```bash
# 设置自定义配置
VUE_SECURITY_CONFIG="/path/to/config.json" vue-security-scanner .

# 设置性能配置
VUE_SECURITY_PERFORMANCE="fast" vue-security-scanner .

# 启用增量扫描
VUE_SECURITY_INCREMENTAL="true" vue-security-scanner .
```

### 安全门控

在 CI/CD 管道中实现安全门控：

```bash
# 检查高严重性问题
vue-security-scanner . --output json --report security-report.json

# 高严重性问题导致构建失败
HIGH_SEVERITY=$(node -e "console.log(require('./security-report.json').highSeverity)")
if [ "$HIGH_SEVERITY" -gt 0 ]; then
  echo "Security scan found $HIGH_SEVERITY high severity issues"
  exit 1
fi
```

### 趋势分析

对于构建间的趋势分析：

1. 将安全报告存储在持久位置
2. 使用 `--advanced-report` 标志获取详细指标
3. 将当前报告与历史数据进行比较

## 故障排除

### 常见问题

- **Node.js 版本**：确保您使用的是 Node.js 14 或更高版本
- **内存限制**：对于大型项目，使用 `NODE_OPTIONS=--max-old-space-size=4096` 增加内存限制
- **超时**：对于复杂扫描，增加 CI 超时设置

### 调试

要启用调试输出：

```bash
DEBUG=vue-security-scanner vue-security-scanner .
```

## 支持

如需 CI/CD 集成的其他支持，请在 GitHub 仓库中打开一个问题。