# 容器镜像安全

## 📋 概述

容器镜像安全是指在构建和使用容器镜像时实施安全措施，确保镜像不包含安全漏洞和恶意代码。本指南提供了在前端应用容器化过程中实施镜像安全的最佳实践。

## 🎯 适用场景

容器镜像安全适用于以下场景：

- Docker 镜像构建
- 容器镜像存储
- 容器镜像分发
- 容器镜像扫描
- 容器镜像更新

## 🔍 实现指南

### 1. 基础镜像选择

选择安全的基础镜像。

#### 1.1 使用官方镜像

```dockerfile
# 使用官方 Node.js 镜像
FROM node:18-alpine AS builder

# 使用官方 Nginx 镜像
FROM nginx:alpine
```

#### 1.2 使用最小化镜像

```dockerfile
# 使用 Alpine Linux 镜像（更小、更安全）
FROM node:18-alpine AS builder

# 不推荐：使用完整版镜像
# FROM node:18
```

#### 1.3 使用特定版本标签

```dockerfile
# 使用特定版本标签（不推荐 latest）
FROM node:18.17.0-alpine AS builder

# 不推荐：使用 latest 标签
# FROM node:alpine
```

### 2. 镜像构建安全

在构建镜像时实施安全措施。

#### 2.1 多阶段构建

```dockerfile
# 多阶段构建示例
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

# 删除默认的 nginx 文件
RUN rm -rf /usr/share/nginx/html/* && \
    rm -rf /etc/nginx/conf.d/*

# 设置文件权限
RUN chown -R nginx:nginx /usr/share/nginx/html && \
    chmod -R 755 /usr/share/nginx/html

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

#### 2.2 安全的 Dockerfile 最佳实践

```dockerfile
# 安全的 Dockerfile 示例
FROM node:18-alpine AS builder

# 设置环境变量
ENV NODE_ENV=production
ENV npm_config_rollback=false
ENV npm_config_update_notifier=false

# 创建非 root 用户
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001

# 设置工作目录
WORKDIR /app

# 复制 package 文件
COPY package*.json ./

# 安装依赖
RUN npm ci --only=production && \
    npm cache clean --force && \
    rm -rf ~/.npm

# 复制源代码
COPY --chown=nodejs:nodejs . .

# 构建应用
RUN npm run build && \
    rm -rf node_modules src

# 生产镜像
FROM nginx:alpine

# 安装安全工具
RUN apk add --no-cache \
    curl \
    ca-certificates && \
    rm -rf /var/cache/apk/*

# 复制构建产物
COPY --from=builder --chown=nginx:nginx /app/dist /usr/share/nginx/html

# 复制 nginx 配置
COPY --chown=nginx:nginx nginx.conf /etc/nginx/nginx.conf

# 设置文件权限
RUN chmod -R 644 /usr/share/nginx/html && \
    find /usr/share/nginx/html -type d -exec chmod 755 {} \; && \
    chmod 600 /etc/nginx/nginx.conf

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

### 3. 镜像扫描

扫描镜像中的安全漏洞。

#### 3.1 使用 Trivy 扫描

```bash
#!/bin/bash
# scripts/scan-image.sh

IMAGE_NAME=$1
IMAGE_TAG=${2:-latest}

if [ -z "$IMAGE_NAME" ]; then
    echo "用法: $0 <镜像名称> [标签]"
    exit 1
fi

echo "扫描镜像: ${IMAGE_NAME}:${IMAGE_TAG}"

# 使用 Trivy 扫描镜像
trivy image \
    --severity HIGH,CRITICAL \
    --exit-code 1 \
    --no-progress \
    ${IMAGE_NAME}:${IMAGE_TAG}

if [ $? -eq 0 ]; then
    echo "镜像扫描通过"
    exit 0
else
    echo "镜像扫描失败"
    exit 1
fi
```

#### 3.2 使用 Snyk 扫描

```bash
#!/bin/bash
# scripts/scan-image-snyk.sh

IMAGE_NAME=$1
IMAGE_TAG=${2:-latest}

if [ -z "$IMAGE_NAME" ]; then
    echo "用法: $0 <镜像名称> [标签]"
    exit 1
fi

echo "扫描镜像: ${IMAGE_NAME}:${IMAGE_TAG}"

# 使用 Snyk 扫描镜像
snyk container test \
    ${IMAGE_NAME}:${IMAGE_TAG} \
    --severity-threshold=high \
    --json \
    > snyk-report.json

if [ $? -eq 0 ]; then
    echo "镜像扫描通过"
    exit 0
else
    echo "镜像扫描失败"
    cat snyk-report.json
    exit 1
fi
```

### 4. 镜像签名

对镜像进行签名以确保完整性。

#### 4.1 使用 Docker Content Trust

```bash
#!/bin/bash
# scripts/sign-image.sh

IMAGE_NAME=$1
IMAGE_TAG=${2:-latest}

if [ -z "$IMAGE_NAME" ]; then
    echo "用法: $0 <镜像名称> [标签]"
    exit 1
fi

echo "签名镜像: ${IMAGE_NAME}:${IMAGE_TAG}"

# 启用 Docker Content Trust
export DOCKER_CONTENT_TRUST=1

# 推送并签名镜像
docker push ${IMAGE_NAME}:${IMAGE_TAG}

if [ $? -eq 0 ]; then
    echo "镜像签名成功"
    exit 0
else
    echo "镜像签名失败"
    exit 1
fi
```

#### 4.2 使用 Cosign 签名

```bash
#!/bin/bash
# scripts/sign-image-cosign.sh

IMAGE_NAME=$1
IMAGE_TAG=${2:-latest}

if [ -z "$IMAGE_NAME" ]; then
    echo "用法: $0 <镜像名称> [标签]"
    exit 1
fi

echo "签名镜像: ${IMAGE_NAME}:${IMAGE_TAG}"

# 使用 Cosign 签名镜像
cosign sign \
    --key cosign.key \
    ${IMAGE_NAME}:${IMAGE_TAG}

if [ $? -eq 0 ]; then
    echo "镜像签名成功"
    exit 0
else
    echo "镜像签名失败"
    exit 1
fi
```

## 📚 代码示例

### Docker Compose 安全配置

```yaml
# docker-compose.yml
version: '3.8'

services:
  app:
    build:
      context: .
      dockerfile: Dockerfile
    image: secure-app:latest
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
    healthcheck:
      test: ["CMD", "curl", "-f", "https://localhost/health"]
      interval: 30s
      timeout: 3s
      retries: 3
      start_period: 5s

networks:
  secure-network:
    driver: bridge
    internal: false
```

### Kubernetes 安全配置

```yaml
# k8s/deployment.yaml
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
```

## 🛠️ 工具推荐

- **Trivy**：容器镜像安全扫描工具
- **Snyk**：容器镜像安全扫描工具
- **Clair**：容器镜像静态分析工具
- **Docker Bench**：Docker 安全基准测试工具
- **Cosign**：容器镜像签名工具

## 📝 验证方法

验证容器镜像安全是否正确实施的方法：

1. **镜像扫描**：定期扫描镜像中的安全漏洞
2. **签名验证**：验证镜像签名是否有效
3. **权限检查**：检查容器运行权限是否最小化
4. **漏洞修复**：及时修复发现的安全漏洞

## ⚠️ 常见错误

1. **使用不安全的基础镜像**：
   - **错误描述**：使用包含已知漏洞的基础镜像
   - **风险**：容器可能包含安全漏洞
   - **解决方案**：使用官方镜像和特定版本标签

2. **以 root 用户运行容器**：
   - **错误描述**：容器以 root 用户运行
   - **风险**：攻击者可能获得 root 权限
   - **解决方案**：使用非 root 用户运行容器

3. **缺少镜像扫描**：
   - **错误描述**：没有扫描镜像中的安全漏洞
   - **风险**：可能部署包含漏洞的镜像
   - **解决方案**：在构建和部署前扫描镜像

4. **缺少镜像签名**：
   - **错误描述**：没有对镜像进行签名
   - **风险**：镜像可能被篡改
   - **解决方案**：对镜像进行签名并验证

## 📚 参考资料

- [CIS Docker Benchmark](https://www.cisecurity.org/benchmark/docker)
- [Docker 安全最佳实践](https://docs.docker.com/engine/security/)
- [Kubernetes 安全最佳实践](https://kubernetes.io/docs/concepts/security/security-checklist/)
- [NIST 容器安全指南](https://csrc.nist.gov/publications/detail/sp/800-190/final)