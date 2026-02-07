# 容器运行时安全

## 📋 概述

容器运行时安全是指在容器运行过程中实施安全措施，确保容器在运行时的安全性。本指南提供了在前端应用容器运行时实施安全的最佳实践。

## 🎯 适用场景

容器运行时安全适用于以下场景：

- 容器运行时监控
- 容器资源限制
- 容器网络隔离
- 容器访问控制
- 容器日志审计

## 🔍 实现指南

### 1. 容器隔离

实施容器隔离以防止攻击扩散。

#### 1.1 使用用户命名空间

```dockerfile
# Dockerfile
FROM node:18-alpine

# 创建非 root 用户
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001

# 设置工作目录
WORKDIR /app

# 复制文件
COPY --chown=nodejs:nodejs . .

# 使用非 root 用户运行
USER nodejs

CMD ["node", "index.js"]
```

#### 1.2 使用只读文件系统

```yaml
# docker-compose.yml
version: '3.8'

services:
  app:
    image: secure-app:latest
    read_only: true
    tmpfs:
      - /tmp
      - /var/cache
    security_opt:
      - no-new-privileges:true
```

#### 1.3 使用安全选项

```yaml
# docker-compose.yml
version: '3.8'

services:
  app:
    image: secure-app:latest
    security_opt:
      - no-new-privileges:true
      - apparmor:docker-default
      - seccomp:seccomp-profile.json
    cap_drop:
      - ALL
    cap_add:
      - NET_BIND_SERVICE
```

### 2. 资源限制

限制容器使用的资源。

#### 2.1 CPU 限制

```yaml
# docker-compose.yml
version: '3.8'

services:
  app:
    image: secure-app:latest
    deploy:
      resources:
        limits:
          cpus: '0.50'
        reservations:
          cpus: '0.25'
```

#### 2.2 内存限制

```yaml
# docker-compose.yml
version: '3.8'

services:
  app:
    image: secure-app:latest
    deploy:
      resources:
        limits:
          memory: 256M
        reservations:
          memory: 128M
```

#### 2.3 磁盘限制

```yaml
# docker-compose.yml
version: '3.8'

services:
  app:
    image: secure-app:latest
    volumes:
      - app-data:/app/data
    tmpfs:
      - /tmp:size=100M
      - /var/cache:size=50M

volumes:
  app-data:
    driver: local
    driver_opts:
      type: none
      o: size=1G
      device: /mnt/data
```

### 3. 网络隔离

隔离容器网络以防止攻击扩散。

#### 3.1 使用自定义网络

```yaml
# docker-compose.yml
version: '3.8'

services:
  app:
    image: secure-app:latest
    networks:
      - frontend-network
    ports:
      - "80:80"
      - "443:443"

  api:
    image: secure-api:latest
    networks:
      - backend-network
    expose:
      - "3000"

networks:
  frontend-network:
    driver: bridge
    internal: false
  
  backend-network:
    driver: bridge
    internal: true
```

#### 3.2 使用网络策略

```yaml
# k8s/network-policy.yaml
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: secure-app-network-policy
spec:
  podSelector:
    matchLabels:
      app: secure-app
  policyTypes:
  - Ingress
  - Egress
  ingress:
  - from:
    - namespaceSelector:
        matchLabels:
          name: ingress-nginx
    ports:
    - protocol: TCP
      port: 80
    - protocol: TCP
      port: 443
  egress:
  - to:
    - namespaceSelector:
        matchLabels:
          name: api
    ports:
    - protocol: TCP
      port: 3000
  - to:
    - namespaceSelector: {}
    ports:
    - protocol: TCP
      port: 53
    - protocol: UDP
      port: 53
```

### 4. 访问控制

实施容器访问控制。

#### 4.1 使用 RBAC

```yaml
# k8s/rbac.yaml
apiVersion: v1
kind: ServiceAccount
metadata:
  name: secure-app-sa
---
apiVersion: rbac.authorization.k8s.io/v1
kind: Role
metadata:
  name: secure-app-role
rules:
- apiGroups: [""]
  resources: ["configmaps", "secrets"]
  verbs: ["get", "list"]
---
apiVersion: rbac.authorization.k8s.io/v1
kind: RoleBinding
metadata:
  name: secure-app-rolebinding
subjects:
- kind: ServiceAccount
  name: secure-app-sa
roleRef:
  kind: Role
  name: secure-app-role
  apiGroup: rbac.authorization.k8s.io
```

#### 4.2 使用 Pod Security Policy

```yaml
# k8s/psp.yaml
apiVersion: policy/v1beta1
kind: PodSecurityPolicy
metadata:
  name: secure-app-psp
spec:
  privileged: false
  allowPrivilegeEscalation: false
  requiredDropCapabilities:
    - ALL
  volumes:
    - 'configMap'
    - 'emptyDir'
    - 'projected'
    - 'secret'
    - 'downwardAPI'
    - 'persistentVolumeClaim'
  hostNetwork: false
  hostIPC: false
  hostPID: false
  runAsUser:
    rule: 'MustRunAsNonRoot'
  seLinux:
    rule: 'RunAsAny'
  fsGroup:
    rule: 'MustRunAs'
    ranges:
      - min: 1
        max: 65535
  supplementalGroups:
    rule: 'MustRunAs'
    ranges:
      - min: 1
        max: 65535
  readOnlyRootFilesystem: true
```

## 📚 代码示例

### Docker 运行时安全配置

```bash
#!/bin/bash
# scripts/run-secure-container.sh

IMAGE_NAME=$1
CONTAINER_NAME=${2:-secure-app}

if [ -z "$IMAGE_NAME" ]; then
    echo "用法: $0 <镜像名称> [容器名称]"
    exit 1
fi

echo "运行安全容器: ${CONTAINER_NAME}"

docker run -d \
    --name ${CONTAINER_NAME} \
    --restart unless-stopped \
    --read-only \
    --tmpfs /tmp \
    --tmpfs /var/cache \
    --security-opt no-new-privileges:true \
    --security-opt apparmor:docker-default \
    --cap-drop ALL \
    --cap-add NET_BIND_SERVICE \
    --memory 256m \
    --memory-swap 256m \
    --cpus 0.5 \
    --pids-limit 100 \
    --network secure-network \
    -p 80:80 \
    -p 443:443 \
    -v $(pwd)/ssl:/etc/nginx/ssl:ro \
    -v $(pwd)/logs:/var/log/nginx \
    ${IMAGE_NAME}

if [ $? -eq 0 ]; then
    echo "容器启动成功"
    exit 0
else
    echo "容器启动失败"
    exit 1
fi
```

### Kubernetes 运行时安全配置

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
      serviceAccountName: secure-app-sa
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

### 容器监控脚本

```bash
#!/bin/bash
# scripts/monitor-container.sh

CONTAINER_NAME=$1

if [ -z "$CONTAINER_NAME" ]; then
    echo "用法: $0 <容器名称>"
    exit 1
fi

echo "监控容器: ${CONTAINER_NAME}"

while true; do
    clear
    echo "容器状态: $(docker inspect -f '{{.State.Status}}' ${CONTAINER_NAME})"
    echo "CPU 使用率: $(docker stats --no-stream --format '{{.CPUPerc}}' ${CONTAINER_NAME})"
    echo "内存使用: $(docker stats --no-stream --format '{{.MemUsage}}' ${CONTAINER_NAME})"
    echo "网络 I/O: $(docker stats --no-stream --format '{{.NetIO}}' ${CONTAINER_NAME})"
    echo "磁盘 I/O: $(docker stats --no-stream --format '{{.BlockIO}}' ${CONTAINER_NAME})"
    echo "进程数: $(docker inspect -f '{{.State.Pids}}' ${CONTAINER_NAME})"
    echo "重启次数: $(docker inspect -f '{{.RestartCount}}' ${CONTAINER_NAME})"
    echo ""
    echo "最近日志:"
    docker logs --tail 10 ${CONTAINER_NAME}
    
    sleep 5
done
```

## 🛠️ 工具推荐

- **Falco**：容器运行时安全监控工具
- **Sysdig**：容器安全监控和调试工具
- **Aqua Security**：容器安全平台
- **Twistlock**：容器安全平台
- **NeuVector**：容器安全平台

## 📝 验证方法

验证容器运行时安全是否正确实施的方法：

1. **隔离测试**：测试容器隔离是否有效
2. **资源限制测试**：测试资源限制是否生效
3. **网络隔离测试**：测试网络隔离是否有效
4. **访问控制测试**：测试访问控制是否正确

## ⚠️ 常见错误

1. **以 root 用户运行容器**：
   - **错误描述**：容器以 root 用户运行
   - **风险**：攻击者可能获得 root 权限
   - **解决方案**：使用非 root 用户运行容器

2. **缺少资源限制**：
   - **错误描述**：没有限制容器使用的资源
   - **风险**：容器可能耗尽系统资源
   - **解决方案**：设置合理的资源限制

3. **缺少网络隔离**：
   - **错误描述**：容器网络没有隔离
   - **风险**：攻击可能扩散到其他容器
   - **解决方案**：实施网络隔离策略

4. **缺少访问控制**：
   - **错误描述**：没有实施访问控制
   - **风险**：容器可能被未授权访问
   - **解决方案**：实施 RBAC 和其他访问控制机制

## 📚 参考资料

- [CIS Docker Benchmark](https://www.cisecurity.org/benchmark/docker)
- [CIS Kubernetes Benchmark](https://www.cisecurity.org/benchmark/kubernetes)
- [Docker 安全最佳实践](https://docs.docker.com/engine/security/)
- [Kubernetes 安全最佳实践](https://kubernetes.io/docs/concepts/security/security-checklist/)