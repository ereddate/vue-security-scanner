# 部署安全

## 📋 概述

部署安全是指在应用部署过程中实施安全措施，确保应用在生产环境中安全运行。本指南提供了在前端应用部署过程中实施安全的最佳实践，帮助开发者安全地部署应用。

## 🎯 适用场景

部署安全适用于以下场景：

- 生产环境部署
- CI/CD 流水线
- 容器化部署
- 云平台部署
- 服务器配置

## 🔍 实现指南

### 1. 安全的部署流程

实施安全的部署流程。

#### 1.1 部署前检查

```javascript
// 部署前检查脚本
const fs = require('fs')
const path = require('path')
const crypto = require('crypto')

class DeploymentPreCheck {
  constructor() {
    this.checks = []
    this.errors = []
    this.warnings = []
  }
  
  // 添加检查项
  addCheck(name, checkFn) {
    this.checks.push({ name, checkFn })
  }
  
  // 运行所有检查
  async runChecks() {
    console.log('开始部署前检查...\n')
    
    for (const check of this.checks) {
      try {
        await check.checkFn()
        console.log(`✓ ${check.name}`)
      } catch (error) {
        if (error.isWarning) {
          this.warnings.push({ check: check.name, message: error.message })
          console.log(`⚠ ${check.name}: ${error.message}`)
        } else {
          this.errors.push({ check: check.name, message: error.message })
          console.log(`✗ ${check.name}: ${error.message}`)
        }
      }
    }
    
    console.log('\n检查完成')
    console.log(`错误: ${this.errors.length}`)
    console.log(`警告: ${this.warnings.length}`)
    
    return {
      success: this.errors.length === 0,
      errors: this.errors,
      warnings: this.warnings
    }
  }
  
  // 检查文件完整性
  checkFileIntegrity(filePath, expectedHash) {
    this.addCheck('检查文件完整性', () => {
      if (!fs.existsSync(filePath)) {
        throw new Error(`文件不存在: ${filePath}`)
      }
      
      const content = fs.readFileSync(filePath)
      const hash = crypto.createHash('sha256').update(content).digest('hex')
      
      if (hash !== expectedHash) {
        throw new Error(`文件哈希不匹配: ${filePath}`)
      }
    })
  }
  
  // 检查环境变量
  checkEnvironmentVariables(requiredVars) {
    this.addCheck('检查环境变量', () => {
      const missing = requiredVars.filter(varName => !process.env[varName])
      
      if (missing.length > 0) {
        throw new Error(`缺少环境变量: ${missing.join(', ')}`)
      }
    })
  }
  
  // 检查依赖安全
  checkDependencySecurity() {
    this.addCheck('检查依赖安全', () => {
      const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'))
      const vulnerabilities = packageJson.vulnerabilities || {}
      
      if (Object.keys(vulnerabilities).length > 0) {
        throw new Error(`发现 ${Object.keys(vulnerabilities).length} 个依赖漏洞`)
      }
    })
  }
  
  // 检查构建产物
  checkBuildArtifacts(distDir) {
    this.addCheck('检查构建产物', () => {
      if (!fs.existsSync(distDir)) {
        throw new Error(`构建产物目录不存在: ${distDir}`)
      }
      
      const files = fs.readdirSync(distDir)
      if (files.length === 0) {
        throw new Error(`构建产物目录为空: ${distDir}`)
      }
      
      // 检查是否包含敏感文件
      const sensitiveFiles = ['.env', '.env.local', '.env.*.local']
      const foundSensitive = files.filter(file => 
        sensitiveFiles.some(pattern => new RegExp(pattern.replace('*', '.*')).test(file))
      )
      
      if (foundSensitive.length > 0) {
        throw new Error(`构建产物包含敏感文件: ${foundSensitive.join(', ')}`)
      }
    })
  }
  
  // 检查文件权限
  checkFilePermissions(filePath, expectedMode) {
    this.addCheck('检查文件权限', () => {
      const stats = fs.statSync(filePath)
      const mode = (stats.mode & parseInt('777', 8)).toString(8)
      
      if (mode !== expectedMode) {
        throw new Warning(`文件权限不正确: ${filePath} (期望: ${expectedMode}, 实际: ${mode})`)
      }
    })
  }
  
  // 检查 SSL 证书
  checkSSLCertificate(certPath, keyPath) {
    this.addCheck('检查 SSL 证书', () => {
      if (!fs.existsSync(certPath)) {
        throw new Error(`SSL 证书不存在: ${certPath}`)
      }
      
      if (!fs.existsSync(keyPath)) {
        throw new Error(`SSL 密钥不存在: ${keyPath}`)
      }
      
      // 检查证书有效期
      const cert = fs.readFileSync(certPath, 'utf8')
      const certInfo = this.parseCertificate(cert)
      const now = new Date()
      const expiry = new Date(certInfo.validTo)
      
      const daysUntilExpiry = Math.floor((expiry - now) / (1000 * 60 * 60 * 24))
      
      if (daysUntilExpiry < 30) {
        throw new Warning(`SSL 证书即将过期: ${daysUntilExpiry} 天`)
      }
    })
  }
  
  // 解析证书
  parseCertificate(cert) {
    const lines = cert.split('\n')
    const info = {}
    
    for (const line of lines) {
      if (line.startsWith('notBefore=')) {
        info.validFrom = new Date(line.substring(10))
      } else if (line.startsWith('notAfter=')) {
        info.validTo = new Date(line.substring(9))
      }
    }
    
    return info
  }
}

class Warning extends Error {
  constructor(message) {
    super(message)
    this.isWarning = true
  }
}

// 使用示例
async function runDeploymentChecks() {
  const preCheck = new DeploymentPreCheck()
  
  // 添加检查项
  preCheck.checkEnvironmentVariables([
    'NODE_ENV',
    'API_BASE_URL',
    'DATABASE_URL'
  ])
  
  preCheck.checkDependencySecurity()
  
  preCheck.checkBuildArtifacts('dist')
  
  preCheck.checkFilePermissions('dist/index.html', '644')
  
  preCheck.checkSSLCertificate('/etc/nginx/ssl/cert.pem', '/etc/nginx/ssl/key.pem')
  
  // 运行检查
  const result = await preCheck.runChecks()
  
  if (!result.success) {
    console.error('部署前检查失败，请修复错误后重试')
    process.exit(1)
  }
  
  console.log('部署前检查通过')
}

runDeploymentChecks()
```

### 2. 容器化部署安全

实施安全的容器化部署。

#### 2.1 Docker 安全配置

```dockerfile
# Dockerfile
# 使用官方 Node.js 镜像
FROM node:18-alpine AS builder

# 设置工作目录
WORKDIR /app

# 复制 package 文件
COPY package*.json ./

# 安装依赖
RUN npm ci --only=production && \
    npm cache clean --force

# 复制源代码
COPY . .

# 构建应用
RUN npm run build

# 生产镜像
FROM nginx:alpine

# 安装安全工具
RUN apk add --no-cache curl

# 复制构建产物
COPY --from=builder /app/dist /usr/share/nginx/html

# 复制 nginx 配置
COPY nginx.conf /etc/nginx/nginx.conf

# 复制 SSL 证书
COPY ssl/ /etc/nginx/ssl/

# 设置文件权限
RUN chmod -R 644 /usr/share/nginx/html && \
    chmod 600 /etc/nginx/ssl/* && \
    chown -R nginx:nginx /usr/share/nginx/html

# 暴露端口
EXPOSE 443

# 健康检查
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f https://localhost/health || exit 1

# 使用非 root 用户运行
USER nginx

# 启动 nginx
CMD ["nginx", "-g", "daemon off;"]
```

#### 2.2 Docker Compose 安全配置

```yaml
# docker-compose.yml
version: '3.8'

services:
  app:
    build:
      context: .
      dockerfile: Dockerfile
    container_name: secure-app
    restart: unless-stopped
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./ssl:/etc/nginx/ssl:ro
      - ./logs:/var/log/nginx
    environment:
      - NODE_ENV=production
      - API_BASE_URL=https://api.example.com
    networks:
      - secure-network
    security_opt:
      - no-new-privileges:true
    read_only: true
    tmpfs:
      - /tmp
      - /var/cache/nginx
    cap_drop:
      - ALL
    cap_add:
      - NET_BIND_SERVICE
      - CHOWN
      - SETGID
      - SETUID
    logging:
      driver: "json-file"
      options:
        max-size: "10m"
        max-file: "3"

networks:
  secure-network:
    driver: bridge
    internal: false
```

### 3. Kubernetes 部署安全

实施安全的 Kubernetes 部署。

#### 3.1 Kubernetes 安全配置

```yaml
# deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: secure-app
  labels:
    app: secure-app
spec:
  replicas: 3
  selector:
    matchLabels:
      app: secure-app
  template:
    metadata:
      labels:
        app: secure-app
    spec:
      securityContext:
        runAsNonRoot: true
        runAsUser: 101
        fsGroup: 101
        seccompProfile:
          type: RuntimeDefault
      containers:
      - name: app
        image: secure-app:latest
        imagePullPolicy: Always
        ports:
        - containerPort: 80
          protocol: TCP
        - containerPort: 443
          protocol: TCP
        resources:
          requests:
            memory: "128Mi"
            cpu: "100m"
          limits:
            memory: "256Mi"
            cpu: "200m"
        securityContext:
          allowPrivilegeEscalation: false
          readOnlyRootFilesystem: true
          runAsNonRoot: true
          runAsUser: 101
          capabilities:
            drop:
            - ALL
            add:
            - NET_BIND_SERVICE
        volumeMounts:
        - name: tmp
          mountPath: /tmp
        - name: cache
          mountPath: /var/cache/nginx
        - name: ssl
          mountPath: /etc/nginx/ssl
          readOnly: true
        livenessProbe:
          httpGet:
            path: /health
            port: 80
            scheme: HTTPS
          initialDelaySeconds: 30
          periodSeconds: 10
          timeoutSeconds: 5
          failureThreshold: 3
        readinessProbe:
          httpGet:
            path: /ready
            port: 80
            scheme: HTTPS
          initialDelaySeconds: 5
          periodSeconds: 5
          timeoutSeconds: 3
          failureThreshold: 3
      volumes:
      - name: tmp
        emptyDir: {}
      - name: cache
        emptyDir: {}
      - name: ssl
        secret:
          secretName: ssl-cert
          defaultMode: 0400

---
apiVersion: v1
kind: Service
metadata:
  name: secure-app-service
spec:
  selector:
    app: secure-app
  ports:
  - name: http
    port: 80
    targetPort: 80
    protocol: TCP
  - name: https
    port: 443
    targetPort: 443
    protocol: TCP
  type: ClusterIP

---
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: secure-app-ingress
  annotations:
    cert-manager.io/cluster-issuer: "letsencrypt-prod"
    nginx.ingress.kubernetes.io/ssl-redirect: "true"
    nginx.ingress.kubernetes.io/force-ssl-redirect: "true"
    nginx.ingress.kubernetes.io/strict-transport-security: "max-age=31536000; includeSubDomains; preload"
    nginx.ingress.kubernetes.io/content-security-policy: "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:; connect-src 'self' https://api.example.com; object-src 'none'; frame-src 'none';"
    nginx.ingress.kubernetes.io/x-frame-options: "DENY"
    nginx.ingress.kubernetes.io/x-content-type-options: "nosniff"
    nginx.ingress.kubernetes.io/referrer-policy: "strict-origin-when-cross-origin"
spec:
  ingressClassName: nginx
  tls:
  - hosts:
    - example.com
    secretName: tls-cert
  rules:
  - host: example.com
    http:
      paths:
      - path: /
        pathType: Prefix
        backend:
          service:
            name: secure-app-service
            port:
              number: 443

---
apiVersion: v1
kind: Secret
metadata:
  name: ssl-cert
type: Opaque
data:
  cert.pem: <base64-encoded-cert>
  key.pem: <base64-encoded-key>
```

### 4. CI/CD 安全配置

实施安全的 CI/CD 流程。

#### 4.1 GitHub Actions 安全配置

```yaml
# .github/workflows/deploy.yml
name: Deploy to Production

on:
  push:
    branches: [main]
  workflow_dispatch:

jobs:
  deploy:
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
      
      - name: Run security audit
        run: npm audit --audit-level=moderate
      
      - name: Run Snyk test
        run: npx snyk test --severity-threshold=high
        env:
          SNYK_TOKEN: ${{ secrets.SNYK_TOKEN }}
      
      - name: Run linter
        run: npm run lint
      
      - name: Run type check
        run: npm run typecheck
      
      - name: Run tests
        run: npm test -- --coverage
      
      - name: Build application
        run: npm run build
      
      - name: Run deployment pre-checks
        run: node scripts/deployment-pre-check.js
        env:
          NODE_ENV: production
          API_BASE_URL: ${{ secrets.API_BASE_URL }}
          DATABASE_URL: ${{ secrets.DATABASE_URL }}
      
      - name: Build Docker image
        run: |
          docker build -t secure-app:${{ github.sha }} .
          docker tag secure-app:${{ github.sha }} secure-app:latest
      
      - name: Login to Docker registry
        run: echo "${{ secrets.DOCKER_PASSWORD }}" | docker login -u "${{ secrets.DOCKER_USERNAME }}" --password-stdin
      
      - name: Push Docker image
        run: |
          docker push secure-app:${{ github.sha }}
          docker push secure-app:latest
      
      - name: Deploy to Kubernetes
        run: |
          kubectl set image deployment/secure-app app=secure-app:${{ github.sha }}
          kubectl rollout status deployment/secure-app
        env:
          KUBECONFIG: ${{ secrets.KUBECONFIG }}
      
      - name: Verify deployment
        run: |
          curl -f https://example.com/health || exit 1
      
      - name: Notify on success
        if: success()
        run: |
          echo "部署成功"
          # 发送通知到 Slack/Teams 等
      
      - name: Notify on failure
        if: failure()
        run: |
          echo "部署失败"
          # 发送通知到 Slack/Teams 等
```

## 📚 代码示例

### 部署脚本示例

```bash
#!/bin/bash
# deploy.sh

set -e

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

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

# 检查环境变量
check_env_vars() {
    log_info "检查环境变量..."
    
    local required_vars=("NODE_ENV" "API_BASE_URL" "DATABASE_URL")
    local missing_vars=()
    
    for var in "${required_vars[@]}"; do
        if [ -z "${!var}" ]; then
            missing_vars+=("$var")
        fi
    done
    
    if [ ${#missing_vars[@]} -gt 0 ]; then
        log_error "缺少环境变量: ${missing_vars[*]}"
        exit 1
    fi
    
    log_info "环境变量检查通过"
}

# 检查依赖
check_dependencies() {
    log_info "检查依赖..."
    
    if ! command -v node &> /dev/null; then
        log_error "Node.js 未安装"
        exit 1
    fi
    
    if ! command -v npm &> /dev/null; then
        log_error "npm 未安装"
        exit 1
    fi
    
    log_info "依赖检查通过"
}

# 安装依赖
install_dependencies() {
    log_info "安装依赖..."
    npm ci --only=production
    log_info "依赖安装完成"
}

# 运行测试
run_tests() {
    log_info "运行测试..."
    npm test -- --coverage
    
    if [ $? -ne 0 ]; then
        log_error "测试失败"
        exit 1
    fi
    
    log_info "测试通过"
}

# 构建应用
build_app() {
    log_info "构建应用..."
    npm run build
    
    if [ $? -ne 0 ]; then
        log_error "构建失败"
        exit 1
    fi
    
    log_info "构建完成"
}

# 备份当前版本
backup_current_version() {
    log_info "备份当前版本..."
    
    local backup_dir="/var/backups/secure-app/$(date +%Y%m%d_%H%M%S)"
    mkdir -p "$backup_dir"
    
    if [ -d "/var/www/html" ]; then
        cp -r /var/www/html/* "$backup_dir/" 2>/dev/null || true
    fi
    
    log_info "备份完成: $backup_dir"
}

# 部署新版本
deploy_new_version() {
    log_info "部署新版本..."
    
    # 停止服务
    systemctl stop nginx || true
    
    # 复制新版本
    rm -rf /var/www/html/*
    cp -r dist/* /var/www/html/
    
    # 设置权限
    chown -R nginx:nginx /var/www/html
    chmod -R 644 /var/www/html
    find /var/www/html -type d -exec chmod 755 {} \;
    
    # 启动服务
    systemctl start nginx
    
    log_info "部署完成"
}

# 健康检查
health_check() {
    log_info "健康检查..."
    
    local max_attempts=30
    local attempt=0
    
    while [ $attempt -lt $max_attempts ]; do
        if curl -f https://localhost/health > /dev/null 2>&1; then
            log_info "健康检查通过"
            return 0
        fi
        
        attempt=$((attempt + 1))
        sleep 2
    done
    
    log_error "健康检查失败"
    return 1
}

# 回滚
rollback() {
    log_warn "开始回滚..."
    
    local latest_backup=$(ls -t /var/backups/secure-app/ | head -1)
    
    if [ -z "$latest_backup" ]; then
        log_error "没有找到备份"
        exit 1
    fi
    
    # 停止服务
    systemctl stop nginx
    
    # 恢复备份
    rm -rf /var/www/html/*
    cp -r "/var/backups/secure-app/$latest_backup"/* /var/www/html/
    
    # 启动服务
    systemctl start nginx
    
    log_info "回滚完成"
}

# 主函数
main() {
    log_info "开始部署..."
    
    check_env_vars
    check_dependencies
    install_dependencies
    run_tests
    build_app
    backup_current_version
    deploy_new_version
    
    if ! health_check; then
        log_error "部署失败，开始回滚..."
        rollback
        exit 1
    fi
    
    log_info "部署成功"
}

# 执行主函数
main
```

## 🛠️ 工具推荐

- **Docker**：容器化平台
- **Kubernetes**：容器编排平台
- **GitHub Actions**：CI/CD 平台
- **Travis CI**：CI/CD 平台
- **CircleCI**：CI/CD 平台

## 📝 验证方法

验证部署安全是否正确实施的方法：

1. **安全扫描**：扫描部署环境的安全漏洞
2. **渗透测试**：进行渗透测试，测试系统的安全性
3. **合规性检查**：检查是否符合相关法律法规要求
4. **日志审计**：审计日志，检查是否存在异常活动

## ⚠️ 常见错误

1. **缺少部署前检查**：
   - **错误描述**：没有进行部署前检查
   - **风险**：可能部署不安全的代码
   - **解决方案**：实施严格的部署前检查流程

2. **使用不安全的配置**：
   - **错误描述**：使用不安全的配置，如以 root 用户运行
   - **风险**：可能被攻击者利用
   - **解决方案**：使用安全的配置，如非 root 用户运行

3. **缺少备份**：
   - **错误描述**：没有备份当前版本
   - **风险**：部署失败后无法回滚
   - **解决方案**：在部署前备份当前版本

4. **缺少健康检查**：
   - **错误描述**：没有进行健康检查
   - **风险**：可能部署失败但未及时发现
   - **解决方案**：实施健康检查，确保部署成功

## 📚 参考资料

- [OWASP 部署安全备忘单](https://cheatsheetseries.owasp.org/cheatsheets/Deployment_Security_Cheat_Sheet.html)
- [NIST 安全软件开发框架](https://www.nist.gov/itl/ssd/software-quality-group/ssdf)
- [Docker 安全最佳实践](https://docs.docker.com/engine/security/)
- [Kubernetes 安全最佳实践](https://kubernetes.io/docs/concepts/security/security-checklist/)