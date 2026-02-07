# CI/CD 管道安全

## 📋 概述

CI/CD 管道安全是指在持续集成和持续部署过程中实施安全措施，确保代码从开发到部署的整个流程都是安全的。本指南提供了在前端应用 CI/CD 管道中实施安全的最佳实践。

## 🎯 适用场景

CI/CD 管道安全适用于以下场景：

- 持续集成流程
- 持续部署流程
- 代码提交和合并
- 自动化测试和构建
- 生产环境部署

## 🔍 实现指南

### 1. 代码提交安全

确保代码提交过程是安全的。

#### 1.1 Git 钩子配置

```bash
#!/bin/bash
# .git/hooks/pre-commit

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo "运行提交前检查..."

# 检查是否有暂存的文件
if git diff --cached --quiet; then
    echo -e "${YELLOW}没有暂存的文件${NC}"
    exit 0
fi

# 运行 ESLint
echo "运行 ESLint..."
npm run lint -- --staged
if [ $? -ne 0 ]; then
    echo -e "${RED}ESLint 检查失败${NC}"
    exit 1
fi

# 运行类型检查
echo "运行类型检查..."
npm run typecheck
if [ $? -ne 0 ]; then
    echo -e "${RED}类型检查失败${NC}"
    exit 1
fi

# 运行单元测试
echo "运行单元测试..."
npm test -- --passWithNoTests
if [ $? -ne 0 ]; then
    echo -e "${RED}单元测试失败${NC}"
    exit 1
fi

echo -e "${GREEN}提交前检查通过${NC}"
exit 0
```

#### 1.2 提交信息验证

```bash
#!/bin/bash
# .git/hooks/commit-msg

# 提交信息格式验证
commit_regex='^(feat|fix|docs|style|refactor|perf|test|chore|revert)(\(.+\))?: .{1,50}'

if ! grep -qE "$commit_regex" "$1"; then
    echo "提交信息格式不正确"
    echo "格式: type(scope): subject"
    echo "类型: feat, fix, docs, style, refactor, perf, test, chore, revert"
    echo "示例: feat(auth): add login functionality"
    exit 1
fi
```

### 2. 持续集成安全

在持续集成过程中实施安全措施。

#### 2.1 GitHub Actions 安全配置

```yaml
# .github/workflows/ci.yml
name: Continuous Integration

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main, develop]

jobs:
  security-scan:
    runs-on: ubuntu-latest
    
    steps:
      - name: Checkout code
        uses: actions/checkout@v3
        with:
          fetch-depth: 0
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Run npm audit
        run: npm audit --audit-level=moderate
        continue-on-error: true
      
      - name: Run Snyk security scan
        uses: snyk/actions/node@master
        env:
          SNYK_TOKEN: ${{ secrets.SNYK_TOKEN }}
        with:
          args: --severity-threshold=high
      
      - name: Run CodeQL analysis
        uses: github/codeql-action/analyze@v2
        with:
          languages: javascript
          queries: security-extended,security-and-quality
  
  code-quality:
    runs-on: ubuntu-latest
    
    steps:
      - name: Checkout code
        uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Run ESLint
        run: npm run lint
      
      - name: Run type check
        run: npm run typecheck
      
      - name: Upload ESLint results
        if: always()
        uses: actions/upload-artifact@v3
        with:
          name: eslint-results
          path: eslint-report.json
  
  test:
    runs-on: ubuntu-latest
    
    strategy:
      matrix:
        node-version: [16.x, 18.x, 20.x]
    
    steps:
      - name: Checkout code
        uses: actions/checkout@v3
      
      - name: Setup Node.js ${{ matrix.node-version }}
        uses: actions/setup-node@v3
        with:
          node-version: ${{ matrix.node-version }}
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Run tests
        run: npm test -- --coverage
      
      - name: Upload coverage to Codecov
        uses: codecov/codecov-action@v3
        with:
          files: ./coverage/lcov.info
          flags: unittests
          name: codecov-umbrella
          fail_ci_if_error: false
  
  build:
    runs-on: ubuntu-latest
    needs: [security-scan, code-quality, test]
    
    steps:
      - name: Checkout code
        uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Build application
        run: npm run build
      
      - name: Upload build artifacts
        uses: actions/upload-artifact@v3
        with:
          name: build
          path: dist/
      
      - name: Generate build report
        run: |
          echo "## 构建报告" > $GITHUB_STEP_SUMMARY
          echo "" >> $GITHUB_STEP_SUMMARY
          echo "- 构建时间: $(date)" >> $GITHUB_STEP_SUMMARY
          echo "- Node 版本: $(node --version)" >> $GITHUB_STEP_SUMMARY
          echo "- NPM 版本: $(npm --version)" >> $GITHUB_STEP_SUMMARY
          echo "- 构建大小: $(du -sh dist/ | cut -f1)" >> $GITHUB_STEP_SUMMARY
```

### 3. 持续部署安全

在持续部署过程中实施安全措施。

#### 3.1 分阶段部署策略

```yaml
# .github/workflows/deploy.yml
name: Continuous Deployment

on:
  push:
    branches: [main, develop]
  workflow_dispatch:

env:
  REGISTRY: ghcr.io
  IMAGE_NAME: ${{ github.repository }}

jobs:
  build-and-push:
    runs-on: ubuntu-latest
    permissions:
      contents: read
      packages: write
    
    steps:
      - name: Checkout code
        uses: actions/checkout@v3
      
      - name: Set up Docker Buildx
        uses: docker/setup-buildx-action@v2
      
      - name: Log in to Container Registry
        uses: docker/login-action@v2
        with:
          registry: ${{ env.REGISTRY }}
          username: ${{ github.actor }}
          password: ${{ secrets.GITHUB_TOKEN }}
      
      - name: Extract metadata
        id: meta
        uses: docker/metadata-action@v4
        with:
          images: ${{ env.REGISTRY }}/${{ env.IMAGE_NAME }}
          tags: |
            type=ref,event=branch
            type=ref,event=pr
            type=semver,pattern={{version}}
            type=semver,pattern={{major}}.{{minor}}
            type=sha,prefix={{branch}}-
      
      - name: Build and push Docker image
        uses: docker/build-push-action@v4
        with:
          context: .
          push: true
          tags: ${{ steps.meta.outputs.tags }}
          labels: ${{ steps.meta.outputs.labels }}
          cache-from: type=gha
          cache-to: type=gha,mode=max
      
      - name: Scan image for vulnerabilities
        uses: aquasecurity/trivy-action@master
        with:
          image-ref: ${{ env.REGISTRY }}/${{ env.IMAGE_NAME }}:${{ github.sha }}
          format: 'sarif'
          output: 'trivy-results.sarif'
      
      - name: Upload Trivy results to GitHub Security
        uses: github/codeql-action/upload-sarif@v2
        with:
          sarif_file: 'trivy-results.sarif'
  
  deploy-staging:
    runs-on: ubuntu-latest
    needs: build-and-push
    if: github.ref == 'refs/heads/develop'
    environment:
      name: staging
      url: https://staging.example.com
    
    steps:
      - name: Checkout code
        uses: actions/checkout@v3
      
      - name: Deploy to staging
        run: |
          echo "部署到测试环境"
          # 这里添加实际的部署命令
      
      - name: Run smoke tests
        run: |
          curl -f https://staging.example.com/health || exit 1
      
      - name: Notify team
        uses: 8398a7/action-slack@v3
        with:
          status: ${{ job.status }}
          text: '部署到测试环境完成'
          webhook_url: ${{ secrets.SLACK_WEBHOOK }}
  
  deploy-production:
    runs-on: ubuntu-latest
    needs: [build-and-push, deploy-staging]
    if: github.ref == 'refs/heads/main'
    environment:
      name: production
      url: https://example.com
    
    steps:
      - name: Checkout code
        uses: actions/checkout@v3
      
      - name: Create deployment
        uses: chrnorm/deployment-action@v2
        with:
          token: '${{ github.token }}'
          environment-url: https://example.com
          environment: production
      
      - name: Deploy to production
        run: |
          echo "部署到生产环境"
          # 这里添加实际的部署命令
      
      - name: Run smoke tests
        run: |
          curl -f https://example.com/health || exit 1
      
      - name: Monitor deployment
        run: |
          sleep 30
          curl -f https://example.com/health || exit 1
      
      - name: Update deployment status
        if: always()
        uses: chrnorm/deployment-status@v2
        with:
          token: '${{ github.token }}'
          environment-url: https://example.com
          environment: production
          state: ${{ job.status }}
      
      - name: Notify team
        if: always()
        uses: 8398a7/action-slack@v3
        with:
          status: ${{ job.status }}
          text: '部署到生产环境完成'
          webhook_url: ${{ secrets.SLACK_WEBHOOK }}
```

### 4. 密钥管理

安全地管理 CI/CD 管道中的密钥。

#### 4.1 GitHub Secrets 配置

```yaml
# 使用 GitHub Secrets
name: Secure Deployment

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    
    steps:
      - name: Checkout code
        uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Build application
        run: |
          # 使用 GitHub Secrets 作为环境变量
          export NODE_ENV=production
          export API_BASE_URL=${{ secrets.API_BASE_URL }}
          export DATABASE_URL=${{ secrets.DATABASE_URL }}
          export JWT_SECRET=${{ secrets.JWT_SECRET }}
          
          npm run build
      
      - name: Deploy
        run: |
          # 使用 SSH 密钥进行部署
          mkdir -p ~/.ssh
          echo "${{ secrets.SSH_PRIVATE_KEY }}" > ~/.ssh/deploy_key
          chmod 600 ~/.ssh/deploy_key
          
          ssh-keyscan -H ${{ secrets.DEPLOY_HOST }} >> ~/.ssh/known_hosts
          
          scp -i ~/.ssh/deploy_key -r dist/* ${{ secrets.DEPLOY_USER }}@${{ secrets.DEPLOY_HOST }}:/var/www/html/
```

## 📚 代码示例

### 自定义 CI/CD 脚本

```bash
#!/bin/bash
# scripts/ci.sh

set -e

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

# 日志函数
log_info() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

log_warn() {
    echo -e "${YELLOW}[WARN]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# 检查环境
check_environment() {
    log_info "检查环境..."
    
    if [ -z "$NODE_ENV" ]; then
        log_error "NODE_ENV 未设置"
        exit 1
    fi
    
    if [ -z "$CI" ]; then
        log_warn "未在 CI 环境中运行"
    fi
}

# 安装依赖
install_dependencies() {
    log_info "安装依赖..."
    npm ci
}

# 运行安全扫描
run_security_scan() {
    log_info "运行安全扫描..."
    
    # npm audit
    npm audit --audit-level=moderate
    
    # Snyk
    if command -v snyk &> /dev/null; then
        snyk test --severity-threshold=high
    fi
}

# 运行代码检查
run_code_checks() {
    log_info "运行代码检查..."
    
    # ESLint
    npm run lint
    
    # 类型检查
    npm run typecheck
}

# 运行测试
run_tests() {
    log_info "运行测试..."
    npm test -- --coverage
}

# 构建应用
build_app() {
    log_info "构建应用..."
    npm run build
}

# 生成报告
generate_report() {
    log_info "生成报告..."
    
    cat > ci-report.md << EOF
# CI 报告

## 环境
- NODE_ENV: $NODE_ENV
- Node 版本: $(node --version)
- NPM 版本: $(npm --version)

## 检查结果
- 安全扫描: 通过
- 代码检查: 通过
- 测试: 通过
- 构建: 通过

## 构建信息
- 构建时间: $(date)
- 构建大小: $(du -sh dist/ | cut -f1)
EOF
    
    cat ci-report.md
}

# 主函数
main() {
    log_info "开始 CI 流程..."
    
    check_environment
    install_dependencies
    run_security_scan
    run_code_checks
    run_tests
    build_app
    generate_report
    
    log_info "CI 流程完成"
}

# 执行主函数
main
```

## 🛠️ 工具推荐

- **GitHub Actions**：GitHub 的 CI/CD 平台
- **GitLab CI/CD**：GitLab 的 CI/CD 平台
- **CircleCI**：云 CI/CD 平台
- **Travis CI**：云 CI/CD 平台
- **Jenkins**：开源 CI/CD 平台

## 📝 验证方法

验证 CI/CD 管道安全是否正确实施的方法：

1. **安全扫描**：定期扫描 CI/CD 管道的安全漏洞
2. **渗透测试**：进行渗透测试，测试 CI/CD 管道的安全性
3. **合规性检查**：检查是否符合相关法律法规要求
4. **日志审计**：审计日志，检查是否存在异常活动

## ⚠️ 常见错误

1. **缺少安全扫描**：
   - **错误描述**：没有在 CI/CD 管道中实施安全扫描
   - **风险**：可能部署不安全的代码
   - **解决方案**：在 CI/CD 管道中实施安全扫描

2. **密钥泄露**：
   - **错误描述**：密钥被硬编码在代码中或泄露到日志中
   - **风险**：密钥可能被攻击者利用
   - **解决方案**：使用安全的密钥管理方案

3. **缺少测试**：
   - **错误描述**：没有在 CI/CD 管道中运行测试
   - **风险**：可能部署有缺陷的代码
   - **解决方案**：在 CI/CD 管道中运行完整的测试套件

4. **缺少回滚机制**：
   - **错误描述**：没有回滚机制
   - **风险**：部署失败后无法快速恢复
   - **解决方案**：实施回滚机制，确保可以快速恢复

## 📚 参考资料

- [OWASP CI/CD 安全备忘单](https://cheatsheetseries.owasp.org/cheatsheets/CI_CD_Security_Cheat_Sheet.html)
- [GitHub Actions 安全最佳实践](https://docs.github.com/en/actions/security-guides/security-hardening-for-github-actions)
- [NIST 安全软件开发框架](https://www.nist.gov/itl/ssd/software-quality-group/ssdf)
- [SLSA 框架](https://slsa.dev/)