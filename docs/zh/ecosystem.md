# Vue 安全扫描工具生态系统集成指南

本指南介绍如何将 Vue 安全扫描工具与各种开发工具和平台集成。

## 目录

- [概述](#概述)
- [VSCode 插件](#vscode-插件)
- [Vite 插件](#vite-插件)
- [Webpack 插件](#webpack-插件)
- [Nuxt.js 模块](#nuxtjs-模块)
- [Docker 集成](#docker-集成)
- [Jenkins 插件](#jenkins-插件)
- [Trae CN 集成](#trae-cn-集成)
- [CI/CD 集成](#ci/cd-集成)
- [API 集成](#api-集成)

## 概述

Vue 安全扫描工具提供了一个全面的工具生态系统，可与不同的开发和部署环境无缝集成：

- **VSCode 插件**：在编辑器中提供实时安全反馈
- **Vite 插件**：编译时安全扫描
- **Webpack 插件**：构建时安全扫描
- **Nuxt.js 模块**：SSR 和静态生成支持
- **Docker 集成**：容器化扫描环境
- **Jenkins 插件**：CI/CD 自动化
- **Trae CN 集成**：自动化漏洞报告
- **CI/CD 集成**：多平台支持

## VSCode 插件

### 安装

1. 下载插件包（.vsix 文件）
2. 在 VSCode 中，按 `Ctrl+Shift+P`（Mac 上为 `Cmd+Shift+P`）
3. 输入 "Extensions: Install from VSIX..."
4. 选择下载的 .vsix 文件

或者在发布后直接从 VSCode 商店安装。

### 功能

- **上下文菜单选项**：右键单击 Vue 文件或文件夹以扫描
- **集成面板**：在专用面板中查看安全报告
- **实时诊断**：直接在编辑器中查看安全警告
- **快速操作**：从命令面板访问安全命令
- **自动检测**：自动检测 Vue 项目并建议扫描

### 可用命令

- `Vue Security: Scan Current Project` - 扫描整个工作区的安全问题
- `Vue Security: Scan Current File` - 扫描当前打开的 Vue 文件
- `Vue Security: Show Security Report` - 打开安全报告面板
- `Vue Security: Configure Settings` - 打开插件设置

### 配置

插件提供了几个可以在 VSCode 设置中配置的选项：

```json
{
  "vueSecurityScanner.enableOnOpen": false,
  "vueSecurityScanner.scanOnSave": true,
  "vueSecurityScanner.maxFileSize": 10,
  "vueSecurityScanner.ignoredFolders": [
    "node_modules",
    "dist",
    "build",
    ".git"
  ],
  "vueSecurityScanner.reportOutputPath": "./security-report.html"
}
```

### 配置选项

| 选项 | 类型 | 默认值 | 描述 |
|---------|-------|----------|-------------|
| `enableOnOpen` | 布尔值 | `false` | 打开 Vue 文件时启用安全扫描 |
| `scanOnSave` | 布尔值 | `false` | 保存 Vue 文件时扫描文件 |
| `maxFileSize` | 数字 | `10` | 要扫描的最大文件大小（MB） |
| `ignoredFolders` | 数组 | `["node_modules", "dist", "build", ".git"]` | 扫描期间要忽略的文件夹 |
| `reportOutputPath` | 字符串 | `"./security-report.html"` | 保存安全报告的路径 |

### 使用方法

1. 在 VSCode 中打开 Vue 项目
2. 右键单击文件或文件夹
3. 选择 "Vue Security: Scan Current File" 或 "Vue Security: Scan Current Project"
4. 在安全报告面板中查看结果

## Vite 插件

### 安装

```bash
npm install --save-dev vite-plugin-vue-security
```

### 配置

将插件添加到您的 `vite.config.js`：

```javascript
import { defineConfig } from 'vite';
import vueSecurity from 'vite-plugin-vue-security';

export default defineConfig({
  plugins: [
    vueSecurity({
      // 配置选项
      enable: true,
      reportPath: './security-report.json',
      format: 'json',
      level: 'detailed'
    })
  ]
});
```

### 配置选项

| 选项 | 类型 | 默认值 | 描述 |
|---------|-------|----------|-------------|
| `enable` | 布尔值 | `true` | 启用插件 |
| `reportPath` | 字符串 | `'./security-report.json'` | 保存安全报告的路径 |
| `format` | 字符串 | `'json'` | 报告格式：`json`、`html`、`text` |
| `level` | 字符串 | `'basic'` | 扫描级别：`basic`、`detailed` |
| `failOnError` | 布尔值 | `false` | 在安全问题上失败构建 |
| `failOnSeverity` | 字符串 | `'critical'` | 失败构建的最低严重性 |

### 高级配置

```javascript
import { defineConfig } from 'vite';
import vueSecurity from 'vite-plugin-vue-security';

export default defineConfig({
  plugins: [
    vueSecurity({
      enable: true,
      reportPath: './security-report.json',
      format: 'json',
      level: 'detailed',
      failOnError: true,
      failOnSeverity: 'high',
      performance: {
        enableSemanticAnalysis: true,
        enableCache: true
      },
      rules: {
        enabled: ['vue', 'javascript', 'dependency'],
        severity: {
          critical: true,
          high: true,
          medium: true,
          low: false
        }
      },
      threatIntelligence: {
        enabled: true,
        sources: {
          cncert: true,
          cnnvd: true,
          nvd: true
        }
      },
      traeCN: {
        enable: true,
        apiKey: 'your-api-key',
        projectId: 'your-project-id',
        autoReport: true,
        realtimePush: true
      }
    })
  ]
});
```

### 使用方法

插件在构建过程中自动运行：

```bash
# 开发环境
npm run dev

# 生产构建
npm run build
```

## Webpack 插件

### 安装

```bash
npm install --save-dev webpack-plugin-vue-security
```

### 配置

将插件添加到您的 `webpack.config.js`：

```javascript
const VueSecurityWebpackPlugin = require('webpack-plugin-vue-security');

module.exports = {
  plugins: [
    new VueSecurityWebpackPlugin({
      // 配置选项
      enable: true,
      reportPath: './security-report.json',
      format: 'json',
      level: 'detailed'
    })
  ]
};
```

### 配置选项

| 选项 | 类型 | 默认值 | 描述 |
|---------|-------|----------|-------------|
| `enable` | 布尔值 | `true` | 启用插件 |
| `reportPath` | 字符串 | `'./security-report.json'` | 保存安全报告的路径 |
| `format` | 字符串 | `'json'` | 报告格式：`json`、`html`、`text` |
| `level` | 字符串 | `'basic'` | 扫描级别：`basic`、`detailed` |
| `failOnError` | 布尔值 | `false` | 在安全问题上失败构建 |
| `failOnSeverity` | 字符串 | `'critical'` | 失败构建的最低严重性 |

### 高级配置

```javascript
const VueSecurityWebpackPlugin = require('webpack-plugin-vue-security');

module.exports = {
  plugins: [
    new VueSecurityWebpackPlugin({
      enable: true,
      reportPath: './security-report.json',
      format: 'json',
      level: 'detailed',
      failOnError: true,
      failOnSeverity: 'high',
      performance: {
        enableSemanticAnalysis: true,
        enableCache: true
      },
      rules: {
        enabled: ['vue', 'javascript', 'dependency'],
        severity: {
          critical: true,
          high: true,
          medium: true,
          low: false
        }
      },
      threatIntelligence: {
        enabled: true,
        sources: {
          cncert: true,
          cnnvd: true,
          nvd: true
        }
      },
      traeCN: {
        enable: true,
        apiKey: 'your-api-key',
        projectId: 'your-project-id',
        autoReport: true,
        realtimePush: true
      }
    })
  ]
};
```

### 使用方法

插件在构建过程中自动运行：

```bash
# 开发环境
npm run dev

# 生产构建
npm run build
```

## Nuxt.js 模块

### 安装

```bash
npm install --save-dev @vue-security/nuxt
```

### 配置

将模块添加到您的 `nuxt.config.ts`：

```typescript
export default defineNuxtConfig({
  modules: ['@vue-security/nuxt'],
  vueSecurity: {
    // 配置选项
    enable: true,
    reportPath: './security-report.json',
    format: 'json',
    level: 'detailed'
  }
});
```

### 配置选项

| 选项 | 类型 | 默认值 | 描述 |
|---------|-------|----------|-------------|
| `enable` | 布尔值 | `true` | 启用模块 |
| `reportPath` | 字符串 | `'./security-report.json'` | 保存安全报告的路径 |
| `format` | 字符串 | `'json'` | 报告格式：`json`、`html`、`text` |
| `level` | 字符串 | `'basic'` | 扫描级别：`basic`、`detailed` |
| `failOnError` | 布尔值 | `false` | 在安全问题上失败构建 |
| `failOnSeverity` | 字符串 | `'critical'` | 失败构建的最低严重性 |

### 高级配置

```typescript
export default defineNuxtConfig({
  modules: ['@vue-security/nuxt'],
  vueSecurity: {
    enable: true,
    reportPath: './security-report.json',
    format: 'json',
    level: 'detailed',
    failOnError: true,
    failOnSeverity: 'high',
    performance: {
      enableSemanticAnalysis: true,
      enableCache: true
    },
    rules: {
      enabled: ['vue', 'javascript', 'dependency'],
      severity: {
        critical: true,
        high: true,
        medium: true,
        low: false
      }
    },
    threatIntelligence: {
      enabled: true,
      sources: {
        cncert: true,
        cnnvd: true,
        nvd: true
      }
    },
    traeCN: {
      enable: true,
      apiKey: 'your-api-key',
      projectId: 'your-project-id',
      autoReport: true,
      realtimePush: true
    }
  }
});
```

### 使用方法

模块在构建和开发过程中自动运行：

```bash
# 开发环境
npm run dev

# 生产构建
npm run build

# 生成静态站点
npm run generate
```

## Docker 集成

### 构建 Docker 镜像

```bash
docker build -t vue-security-scanner .
```

### 在 Docker 中运行扫描器

```bash
docker run -v $(pwd):/workspace/project vue-security-scanner /workspace/project --level detailed
```

### Docker Compose

创建 `docker-compose.yml`：

```yaml
version: '3.8'

services:
  security-scanner:
    image: vue-security-scanner
    volumes:
      - ./:/workspace/project
    command: /workspace/project --level detailed --report security-report.json
    environment:
      - VUE_SECURITY_THREADS=4
      - VUE_SECURITY_MEMORY_LIMIT=1024
```

使用 Docker Compose 运行：

```bash
docker-compose up
```

### 配置

您可以在 Docker 中使用环境变量配置扫描器：

```yaml
version: '3.8'

services:
  security-scanner:
    image: vue-security-scanner
    volumes:
      - ./:/workspace/project
      - ./config:/workspace/config
    command: /workspace/project --config /workspace/config/config.json
    environment:
      - VUE_SECURITY_THREADS=4
      - VUE_SECURITY_MEMORY_LIMIT=1024
      - VUE_SECURITY_OUTPUT_FORMAT=json
      - VUE_SECURITY_LOG_LEVEL=info
```

## Jenkins 插件

### 安装

通过 Jenkins 插件管理器安装或手动部署 `.hpi` 文件。

### 流水线配置

创建 `Jenkinsfile`：

```groovy
pipeline {
    agent any
    
    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }
        
        stage('Security Scan') {
            steps {
                script {
                    sh 'vue-security-scanner . --output json --report security-report.json'
                }
            }
        }
        
        stage('Publish Report') {
            steps {
                publishHTML([
                    reportDir: '.',
                    reportFiles: 'security-report.html',
                    reportName: 'Security Scan Report',
                    keepAll: true,
                    alwaysLinkToLastBuild: true
                ])
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

### 声明式流水线

```groovy
pipeline {
    agent any
    
    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }
        
        stage('Security Scan') {
            steps {
                sh '''
                    npm install -g vue-security-scanner
                    vue-security-scanner . \
                        --output json \
                        --report security-report.json \
                        --level detailed \
                        --advanced-report
                '''
            }
        }
        
        stage('Publish Report') {
            steps {
                publishHTML target: [
                    reportDir: '.',
                    reportFiles: 'security-report.html',
                    reportName: 'Security Scan Report',
                    keepAll: true,
                    alwaysLinkToLastBuild: true
                ]
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

## Trae CN 集成

### 概述

与 Trae CN 无缝集成，实现自动化漏洞报告和跟踪。

### 功能

- **自动化漏洞报告**：自动将检测到的漏洞报告到 Trae CN
- **实时扫描结果**：实时将扫描结果推送到 Trae CN
- **工单创建**：为高严重性漏洞创建工单
- **项目跟踪**：跨多个项目跟踪漏洞
- **API 集成**：完整的 REST API 集成，支持重试逻辑和错误处理

### 配置

#### Vite 配置

```javascript
import { defineConfig } from 'vite';
import vueSecurity from 'vite-plugin-vue-security';

export default defineConfig({
  plugins: [
    vueSecurity({
      enableTraeCN: true,
      traeCNApiKey: 'your-api-key',
      traeCNProjectId: 'your-project-id',
      traeCNAutoReport: true,
      traeCNRealtimePush: true
    })
  ]
});
```

#### Webpack 配置

```javascript
const VueSecurityWebpackPlugin = require('webpack-plugin-vue-security');

module.exports = {
  plugins: [
    new VueSecurityWebpackPlugin({
      enableTraeCN: true,
      traeCNApiKey: 'your-api-key',
      traeCNProjectId: 'your-project-id',
      traeCNAutoReport: true,
      traeCNRealtimePush: true
    })
  ]
};
```

#### Nuxt 配置

```typescript
export default defineNuxtConfig({
  modules: ['@vue-security/nuxt'],
  vueSecurity: {
    enableTraeCN: true,
    traeCNApiKey: 'your-api-key',
    traeCNProjectId: 'your-project-id',
    traeCNAutoReport: true,
    traeCNRealtimePush: true
  }
});
```

### 配置选项

| 选项 | 类型 | 默认值 | 描述 |
|---------|-------|----------|-------------|
| `enableTraeCN` | 布尔值 | `false` | 启用 Trae CN 集成 |
| `traeCNApiKey` | 字符串 | `''` | Trae CN API 密钥 |
| `traeCNProjectId` | 字符串 | `''` | Trae CN 项目 ID |
| `traeCNAutoReport` | 布尔值 | `false` | 自动报告漏洞 |
| `traeCNRealtimePush` | 布尔值 | `false` | 实时推送结果 |

## CI/CD 集成

### GitHub Actions

创建 `.github/workflows/security.yml`：

```yaml
name: 安全扫描

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main ]
  schedule:
    - cron: '0 0 * * *' # 每天午夜

jobs:
  security-scan:
    runs-on: ubuntu-latest
    
    steps:
      - name: 检出代码
        uses: actions/checkout@v3
      
      - name: 设置 Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '16'
      
      - name: 安装扫描器
        run: npm install -g vue-security-scanner
      
      - name: 运行安全扫描
        run: |
          vue-security-scanner . \
            --output json \
            --report security-report.json \
            --level detailed \
            --advanced-report
      
      - name: 上传结果
        uses: actions/upload-artifact@v3
        with:
          name: security-results
          path: security-report.json
      
      - name: 评论 PR
        if: github.event_name == 'pull_request'
        uses: actions/github-script@v6
        with:
          script: |
            const fs = require('fs');
            const report = JSON.parse(fs.readFileSync('security-report.json', 'utf8'));
            const summary = `发现 ${report.summary.totalIssues} 个安全问题（${report.summary.critical} 个严重，${report.summary.high} 个高）`;
            github.rest.issues.createComment({
              issue_number: context.issue.number,
              owner: context.repo.owner,
              repo: context.repo.repo,
              body: summary
            });
```

### GitLab CI/CD

创建 `.gitlab-ci.yml`：

```yaml
stages:
  - security

security_scan:
  stage: security
  image: node:16
  
  before_script:
    - npm install -g vue-security-scanner
  
  script:
    - vue-security-scanner . --output json --report security-report.json --level detailed
  
  artifacts:
    paths:
      - security-report.json
    expire_in: 1 week
  
  only:
    - merge_requests
    - main
    - develop
  
  allow_failure: false
```

### Azure DevOps

创建 `azure-pipelines.yml`：

```yaml
trigger:
  branches:
    include:
      - main
      - develop

pool:
  vmImage: 'ubuntu-latest'

steps:
  - task: NodeTool@0
    inputs:
      versionSpec: '16.x'
    displayName: '安装 Node.js'
  
  - script: |
      npm install -g vue-security-scanner
    displayName: '安装扫描器'
  
  - script: |
      vue-security-scanner . --output json --report security-report.json --level detailed
    displayName: '运行安全扫描'
  
  - task: PublishBuildArtifacts@1
    inputs:
      PathtoPublish: 'security-report.json'
      ArtifactName: 'security-results'
      publishLocation: 'Container'
```

### Bitbucket Pipelines

创建 `bitbucket-pipelines.yml`：

```yaml
image: node:16

pipelines:
  default:
    - step:
        name: 安全扫描
        script:
          - npm install -g vue-security-scanner
          - vue-security-scanner . --output json --report security-report.json --level detailed
        artifacts:
          - security-report.json
```

### CircleCI

创建 `.circleci/config.yml`：

```yaml
version: 2.1

orbs:
  node: circleci/node@4.7

jobs:
  security-scan:
    docker:
      - image: cimg/node:16.10
    steps:
      - checkout
      - run:
          name: 安装扫描器
          command: npm install -g vue-security-scanner
      - run:
          name: 运行安全扫描
          command: |
            vue-security-scanner . \
              --output json \
              --report security-report.json \
              --level detailed \
              --advanced-report
      - store_artifacts:
          path: security-report.json
          destination: security-results
```

### Travis CI

创建 `.travis.yml`：

```yaml
language: node_js
node_js:
  - '16'

install:
  - npm install -g vue-security-scanner

script:
  - vue-security-scanner . --output json --report security-report.json --level detailed

after_success:
  - bash <(curl -s https://codecov.io/bash)

notifications:
  email:
    recipients:
      - your-email@example.com
```

## API 集成

### 基本使用

```javascript
const { VueSecurityScanner } = require('vue-security-scanner');

const scanner = new VueSecurityScanner({
  scanPath: './src',
  rules: {
    enabled: ['vue', 'javascript', 'dependency']
  },
  output: {
    format: 'json',
    reportPath: './security-report.json'
  }
});

const results = await scanner.scan();
console.log(results);
```

### 高级使用

```javascript
const { VueSecurityScanner } = require('vue-security-scanner');

const scanner = new VueSecurityScanner({
  scanPath: './src',
  exclude: ['node_modules', 'dist'],
  rules: {
    enabled: ['vue', 'javascript', 'dependency'],
    severity: {
      critical: true,
      high: true,
      medium: true,
      low: false
    }
  },
  performance: {
    enableSemanticAnalysis: true,
    enableCache: true,
    enableIncremental: true,
    threads: 4
  },
  threatIntelligence: {
    enabled: true,
    sources: {
      cncert: true,
      cnnvd: true,
      nvd: true
    }
  },
  traeCN: {
    enable: true,
    apiKey: 'your-api-key',
    projectId: 'your-project-id',
    autoReport: true,
    realtimePush: true
  }
});

const results = await scanner.scan();
console.log(results);
```

### API 方法

详细的 API 文档，请参阅 [API 参考](./api/index.md)。

---

如需更多信息，请参阅：
- [快速入门指南](./quickstart.md)
- [配置指南](./configuration.md)
- [使用教程](./usage.md)
- [API 参考](./api/index.md)
