# 容器网络安全

## 📋 概述

容器网络安全是指在容器环境中实施网络安全措施，确保容器之间的通信是安全的。本指南提供了在容器环境中实施网络安全的最佳实践。

## 🎯 适用场景

容器网络安全适用于以下场景：

- 容器网络隔离
- 容器间通信控制
- 容器网络策略
- 容器网络监控
- 容器网络加密

## 🔍 实现指南

### 1. 网络隔离

实施容器网络隔离。

#### 1.1 Docker 网络隔离

```bash
#!/bin/bash
# scripts/create-secure-network.sh

NETWORK_NAME=$1

if [ -z "$NETWORK_NAME" ]; then
    echo "用法: $0 <网络名称>"
    exit 1
fi

echo "创建安全网络: ${NETWORK_NAME}"

# 创建隔离网络
docker network create \
    --driver bridge \
    --internal \
    --subnet 172.20.0.0/16 \
    --ip-range 172.20.10.0/24 \
    --gateway 172.20.0.1 \
    ${NETWORK_NAME}

echo "安全网络创建完成"
```

#### 1.2 Docker Compose 网络隔离

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

  database:
    image: postgres:15-alpine
    networks:
      - backend-network
    expose:
      - "5432"

networks:
  frontend-network:
    driver: bridge
    internal: false
    ipam:
      config:
        - subnet: 172.20.0.0/16
          ip_range: 172.20.10.0/24
  
  backend-network:
    driver: bridge
    internal: true
    ipam:
      config:
        - subnet: 172.21.0.0/16
          ip_range: 172.21.10.0/24
```

### 2. 网络策略

实施网络策略控制容器间通信。

#### 2.1 Kubernetes 网络策略

```yaml
# k8s/network-policy.yaml
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: deny-all
spec:
  podSelector: {}
  policyTypes:
  - Ingress
  - Egress
---
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: allow-dns
spec:
  podSelector: {}
  policyTypes:
  - Egress
  egress:
  - to:
    - namespaceSelector:
        matchLabels:
          name: kube-system
    ports:
    - protocol: UDP
      port: 53
    - protocol: TCP
      port: 53
---
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

#### 2.2 Istio 网络策略

```yaml
# k8s/istio-network-policy.yaml
apiVersion: security.istio.io/v1beta1
kind: PeerAuthentication
metadata:
  name: default
spec:
  mtls:
    mode: STRICT
---
apiVersion: security.istio.io/v1beta1
kind: AuthorizationPolicy
metadata:
  name: secure-app-authz
spec:
  selector:
    matchLabels:
      app: secure-app
  action: ALLOW
  rules:
  - from:
    - source:
        principals:
        - cluster.local/ns/ingress-nginx/sa/ingress-nginx
    to:
    - operation:
        methods:
        - GET
        - HEAD
---
apiVersion: networking.istio.io/v1beta1
kind: DestinationRule
metadata:
  name: secure-app
spec:
  host: secure-app
  trafficPolicy:
    tls:
      mode: ISTIO_MUTUAL
    loadBalancer:
      simple: LEAST_CONN
    connectionPool:
      tcp:
        maxConnections: 100
      http:
        http1MaxPendingRequests: 50
        http2MaxRequests: 100
        maxRequestsPerConnection: 10
    outlierDetection:
      consecutiveErrors: 3
      interval: 30s
      baseEjectionTime: 30s
      maxEjectionPercent: 50
```

### 3. 网络加密

加密容器网络通信。

#### 3.1 TLS 加密配置

```yaml
# k8s/tls-config.yaml
apiVersion: v1
kind: Secret
metadata:
  name: tls-cert
type: kubernetes.io/tls
data:
  tls.crt: <base64-encoded-cert>
  tls.key: <base64-encoded-key>
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
```

#### 3.2 mTLS 加密配置

```yaml
# k8s/mtls-config.yaml
apiVersion: cert-manager.io/v1
kind: Certificate
metadata:
  name: secure-app-cert
spec:
  secretName: secure-app-tls
  duration: 2160h
  renewBefore: 360h
  commonName: secure-app
  isCA: false
  privateKey:
    algorithm: RSA
    encoding: PKCS1
    size: 2048
  usages:
    - server auth
    - client auth
  dnsNames:
    - secure-app
    - secure-app.default.svc.cluster.local
---
apiVersion: security.istio.io/v1beta1
kind: PeerAuthentication
metadata:
  name: secure-app
spec:
  selector:
    matchLabels:
      app: secure-app
  mtls:
    mode: STRICT
  portLevelMtls:
    80:
      mode: PERMISSIVE
    443:
      mode: STRICT
```

### 4. 网络监控

监控容器网络活动。

#### 4.1 网络监控配置

```yaml
# k8s/network-monitoring.yaml
apiVersion: v1
kind: Service
metadata:
  name: prometheus
spec:
  selector:
    app: prometheus
  ports:
  - port: 9090
    targetPort: 9090
---
apiVersion: v1
kind: Service
metadata:
  name: grafana
spec:
  selector:
    app: grafana
  ports:
  - port: 3000
    targetPort: 3000
---
apiVersion: apps/v1
kind: Deployment
metadata:
  name: prometheus
spec:
  replicas: 1
  selector:
    matchLabels:
      app: prometheus
  template:
    metadata:
      labels:
        app: prometheus
    spec:
      containers:
      - name: prometheus
        image: prom/prometheus:latest
        ports:
        - containerPort: 9090
        volumeMounts:
        - name: config
          mountPath: /etc/prometheus
        - name: data
          mountPath: /prometheus
      volumes:
      - name: config
        configMap:
          name: prometheus-config
      - name: data
        emptyDir: {}
---
apiVersion: v1
kind: ConfigMap
metadata:
  name: prometheus-config
data:
  prometheus.yml: |
    global:
      scrape_interval: 15s
      evaluation_interval: 15s
    
    scrape_configs:
      - job_name: 'kubernetes-pods'
        kubernetes_sd_configs:
          - role: pod
        relabel_configs:
          - source_labels: [__meta_kubernetes_pod_annotation_prometheus_io_scrape]
            action: keep
            regex: true
          - source_labels: [__meta_kubernetes_pod_annotation_prometheus_io_path]
            action: replace
            target_label: __metrics_path__
            regex: (.+)
          - source_labels: [__address__, __meta_kubernetes_pod_annotation_prometheus_io_port]
            action: replace
            regex: ([^:]+)(?::\d+)?;(\d+)
            replacement: $1:$2
            target_label: __address__
```

#### 4.2 网络流量分析

```bash
#!/bin/bash
# scripts/analyze-network-traffic.sh

NAMESPACE=${1:-default}
DURATION=${2:-60}

echo "分析网络流量: ${NAMESPACE} (${DURATION}秒)"

# 安装 tcpdump
kubectl run tcpdump \
    --namespace ${NAMESPACE} \
    --image=corfr/tcpdump \
    --restart=Never \
    --rm -it \
    -- tcpdump -i any -w /tmp/capture.pcap &
TCPDUMP_PID=$!

# 等待捕获
sleep ${DURATION}

# 停止捕获
kill ${TCPDUMP_PID}

# 下载捕获文件
kubectl cp ${NAMESPACE}/tcpdump:/tmp/capture.pcap capture.pcap

# 分析捕获文件
tshark -r capture.pcap -q -z io,phs

echo "网络流量分析完成"
```

## 📚 代码示例

### 网络安全测试脚本

```bash
#!/bin/bash
# scripts/test-network-security.sh

NAMESPACE=${1:-default}

echo "测试网络安全: ${NAMESPACE}"

# 测试网络隔离
echo "测试网络隔离..."
POD1=$(kubectl run test-pod-1 \
    --namespace ${NAMESPACE} \
    --image=busybox \
    --restart=Never \
    -- sleep 3600 \
    --output=jsonpath='{.metadata.name}')

POD2=$(kubectl run test-pod-2 \
    --namespace ${NAMESPACE} \
    --image=busybox \
    --restart=Never \
    -- sleep 3600 \
    --output=jsonpath='{.metadata.name}')

# 等待 Pod 启动
kubectl wait --for=condition=ready pod/${POD1} --namespace ${NAMESPACE} --timeout=60s
kubectl wait --for=condition=ready pod/${POD2} --namespace ${NAMESPACE} --timeout=60s

# 测试 Pod 间通信
echo "测试 Pod 间通信..."
kubectl exec ${POD1} --namespace ${NAMESPACE} -- ping -c 3 ${POD2}

# 清理测试 Pod
kubectl delete pod ${POD1} --namespace ${NAMESPACE}
kubectl delete pod ${POD2} --namespace ${NAMESPACE}

echo "网络安全测试完成"
```

### 网络策略验证脚本

```bash
#!/bin/bash
# scripts/validate-network-policy.sh

POLICY_FILE=$1

if [ -z "$POLICY_FILE" ]; then
    echo "用法: $0 <网络策略文件>"
    exit 1
fi

echo "验证网络策略: ${POLICY_FILE}"

# 使用 kube-score 验证
docker run --rm -v $(pwd):/project zegl/kube-score score ${POLICY_FILE}

# 使用 kubectl 验证
kubectl apply --dry-run=server -f ${POLICY_FILE}

echo "网络策略验证完成"
```

## 🛠️ 工具推荐

- **Calico**：容器网络插件
- **Cilium**：容器网络插件
- **Flannel**：容器网络插件
- **Weave Net**：容器网络插件
- **Istio**：服务网格

## 📝 验证方法

验证容器网络安全是否正确实施的方法：

1. **网络隔离测试**：测试容器网络隔离是否有效
2. **网络策略测试**：测试网络策略是否正确执行
3. **加密测试**：测试网络加密是否正常工作
4. **监控测试**：测试网络监控是否正常工作

## ⚠️ 常见错误

1. **缺少网络隔离**：
   - **错误描述**：容器网络没有隔离
   - **风险**：容器可能相互访问
   - **解决方案**：实施网络隔离策略

2. **缺少网络策略**：
   - **错误描述**：没有配置网络策略
   - **风险**：容器间可能不受限制地通信
   - **解决方案**：配置网络策略限制容器间通信

3. **缺少网络加密**：
   - **错误描述**：容器网络通信没有加密
   - **风险**：网络流量可能被窃听
   - **解决方案**：启用 TLS/mTLS 加密

4. **缺少网络监控**：
   - **错误描述**：没有监控容器网络活动
   - **风险**：无法及时发现网络攻击
   - **解决方案**：实施网络监控

## 📚 参考资料

- [CIS Docker Benchmark](https://www.cisecurity.org/benchmark/docker)
- [CIS Kubernetes Benchmark](https://www.cisecurity.org/benchmark/kubernetes)
- [Kubernetes 网络策略](https://kubernetes.io/docs/concepts/services-networking/network-policies/)
- [Istio 安全](https://istio.io/latest/docs/concepts/security/)