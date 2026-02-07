# 容器编排安全

## 📋 概述

容器编排安全是指在容器编排平台（如 Kubernetes）上实施安全措施，确保容器集群的安全运行。本指南提供了在 Kubernetes 上部署前端应用的编排安全最佳实践。

## 🎯 适用场景

容器编排安全适用于以下场景：

- Kubernetes 集群安全配置
- 容器编排安全策略
- Pod 安全配置
- 网络策略配置
- 访问控制配置

## 🔍 实现指南

### 1. 集群安全配置

安全地配置 Kubernetes 集群。

#### 1.1 集群配置

```yaml
# k8s/cluster-config.yaml
apiVersion: cluster.x-k8s.io/v1beta1
kind: Cluster
metadata:
  name: secure-cluster
  namespace: default
spec:
  clusterNetwork:
    pods:
      cidrBlocks:
        - 10.244.0.0/16
    services:
      cidrBlocks:
        - 10.96.0.0/12
  controlPlaneEndpoint:
    host: api.example.com
    port: 6443
  infrastructureRef:
    apiVersion: infrastructure.cluster.x-k8s.io/v1beta1
    kind: AWSCluster
    name: secure-cluster
---
apiVersion: infrastructure.cluster.x-k8s.io/v1beta1
kind: AWSCluster
metadata:
  name: secure-cluster
  namespace: default
spec:
  region: us-east-1
  sshKeyName: secure-cluster-key
  networkSpec:
    vpc:
      id: vpc-12345678
    subnets:
      - id: subnet-12345678
      - id: subnet-87654321
  controlPlane:
    instanceType: t3.medium
    volumeSize: 100
  nodeGroups:
    - name: worker-nodes
      instanceType: t3.small
      volumeSize: 50
      minSize: 3
      maxSize: 10
      desiredCapacity: 3
```

#### 1.2 集群安全策略

```yaml
# k8s/cluster-policy.yaml
apiVersion: kyverno.io/v1
kind: ClusterPolicy
metadata:
  name: require-non-root
spec:
  validationFailureAction: enforce
  background: true
  rules:
    - name: require-non-root
      match:
        resources:
          kinds:
            - Pod
      validate:
        message: "Containers must run as non-root"
        pattern:
          spec:
            containers:
              - securityContext:
                  runAsNonRoot: true
---
apiVersion: kyverno.io/v1
kind: ClusterPolicy
metadata:
  name: require-read-only-root
spec:
  validationFailureAction: enforce
  background: true
  rules:
    - name: require-read-only-root
      match:
        resources:
          kinds:
            - Pod
      validate:
        message: "Containers must have read-only root filesystem"
        pattern:
          spec:
            containers:
              - securityContext:
                  readOnlyRootFilesystem: true
---
apiVersion: kyverno.io/v1
kind: ClusterPolicy
metadata:
  name: drop-all-capabilities
spec:
  validationFailureAction: enforce
  background: true
  rules:
    - name: drop-all-capabilities
      match:
        resources:
          kinds:
            - Pod
      validate:
        message: "Containers must drop all capabilities"
        pattern:
          spec:
            containers:
              - securityContext:
                  capabilities:
                    drop:
                      - ALL
```

### 2. Pod 安全配置

安全地配置 Pod。

#### 2.1 Pod 安全上下文

```yaml
# k8s/pod-security.yaml
apiVersion: v1
kind: Pod
metadata:
  name: secure-pod
spec:
  securityContext:
    runAsNonRoot: true
    runAsUser: 1001
    fsGroup: 1001
    seccompProfile:
      type: RuntimeDefault
  containers:
  - name: app
    image: secure-app:latest
    securityContext:
      allowPrivilegeEscalation: false
      readOnlyRootFilesystem: true
      runAsNonRoot: true
      runAsUser: 1001
      capabilities:
        drop:
        - ALL
        add:
        - NET_BIND_SERVICE
    resources:
      requests:
        memory: "128Mi"
        cpu: "100m"
      limits:
        memory: "256Mi"
        cpu: "200m"
    volumeMounts:
    - name: tmp
      mountPath: /tmp
    - name: cache
      mountPath: /var/cache/nginx
    - name: ssl
      mountPath: /etc/nginx/ssl
      readOnly: true
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

#### 2.2 Pod 安全策略

```yaml
# k8s/pod-security-policy.yaml
apiVersion: policy/v1beta1
kind: PodSecurityPolicy
metadata:
  name: restricted
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

### 3. 网络策略配置

安全地配置网络策略。

#### 3.1 网络策略

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
    - namespaceSelector: {}
    ports:
    - protocol: UDP
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

#### 3.2 服务网格配置

```yaml
# k8s/istio-gateway.yaml
apiVersion: networking.istio.io/v1beta1
kind: Gateway
metadata:
  name: secure-app-gateway
spec:
  selector:
    istio: ingressgateway
  servers:
  - port:
      number: 443
      name: https
      protocol: HTTPS
    tls:
      mode: SIMPLE
      credentialName: tls-cert
    hosts:
    - example.com
---
apiVersion: networking.istio.io/v1beta1
kind: VirtualService
metadata:
  name: secure-app
spec:
  hosts:
  - example.com
  gateways:
  - secure-app-gateway
  http:
  - match:
    - uri:
        prefix: /
    route:
    - destination:
        host: secure-app
        port:
          number: 80
    timeout: 30s
    retries:
      attempts: 3
      perTryTimeout: 10s
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
```

### 4. 访问控制配置

安全地配置访问控制。

#### 4.1 RBAC 配置

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
- apiGroups: [""]
  resources: ["pods"]
  verbs: ["get", "list", "watch"]
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
---
apiVersion: rbac.authorization.k8s.io/v1
kind: ClusterRole
metadata:
  name: secure-app-clusterrole
rules:
- apiGroups: [""]
  resources: ["nodes", "namespaces"]
  verbs: ["get", "list", "watch"]
---
apiVersion: rbac.authorization.k8s.io/v1
kind: ClusterRoleBinding
metadata:
  name: secure-app-clusterrolebinding
subjects:
- kind: ServiceAccount
  name: secure-app-sa
  namespace: default
roleRef:
  kind: ClusterRole
  name: secure-app-clusterrole
  apiGroup: rbac.authorization.k8s.io
```

#### 4.2 准入控制

```yaml
# k8s/validating-webhook.yaml
apiVersion: admissionregistration.k8s.io/v1
kind: ValidatingWebhookConfiguration
metadata:
  name: secure-app-validator
webhooks:
- name: validator.secure-app.io
  rules:
  - operations: ["CREATE", "UPDATE"]
    apiGroups: [""]
    apiVersions: ["v1"]
    resources: ["pods"]
  clientConfig:
    service:
      name: secure-app-validator
      namespace: default
      path: "/validate"
  admissionReviewVersions: ["v1"]
  sideEffects: None
  timeoutSeconds: 5
---
apiVersion: v1
kind: Service
metadata:
  name: secure-app-validator
spec:
  ports:
  - port: 443
    targetPort: 8443
  selector:
    app: secure-app-validator
---
apiVersion: apps/v1
kind: Deployment
metadata:
  name: secure-app-validator
spec:
  replicas: 1
  selector:
    matchLabels:
      app: secure-app-validator
  template:
    metadata:
      labels:
        app: secure-app-validator
    spec:
      containers:
      - name: validator
        image: secure-app-validator:latest
        ports:
        - containerPort: 8443
        resources:
          requests:
            memory: "64Mi"
            cpu: "50m"
          limits:
            memory: "128Mi"
            cpu: "100m"
```

## 📚 代码示例

### Kubernetes 部署脚本

```bash
#!/bin/bash
# scripts/deploy-to-k8s.sh

NAMESPACE=${1:-default}
CONTEXT=${2:-default}

echo "部署到 Kubernetes 集群: ${CONTEXT}/${NAMESPACE}"

# 创建命名空间
kubectl create namespace ${NAMESPACE} --dry-run=client -o yaml | kubectl apply -f -

# 应用 RBAC 配置
kubectl apply -f k8s/rbac.yaml --context ${CONTEXT}

# 应用网络策略
kubectl apply -f k8s/network-policy.yaml --context ${CONTEXT}

# 应用 Pod 安全策略
kubectl apply -f k8s/pod-security-policy.yaml --context ${CONTEXT}

# 应用部署配置
kubectl apply -f k8s/deployment.yaml --context ${CONTEXT}

# 应用服务配置
kubectl apply -f k8s/service.yaml --context ${CONTEXT}

# 应用 Ingress 配置
kubectl apply -f k8s/ingress.yaml --context ${CONTEXT}

# 等待部署完成
kubectl rollout status deployment/secure-app -n ${NAMESPACE} --context ${CONTEXT}

echo "部署完成"
```

### Helm Chart 配置

```yaml
# helm/secure-app/Chart.yaml
apiVersion: v2
name: secure-app
description: A Helm chart for secure app
type: application
version: 1.0.0
appVersion: "1.0.0"
```

```yaml
# helm/secure-app/values.yaml
replicaCount: 3

image:
  repository: secure-app
  pullPolicy: Always
  tag: "latest"

serviceAccount:
  create: true
  annotations: {}
  name: ""

podAnnotations: {}

podSecurityContext:
  runAsNonRoot: true
  runAsUser: 1001
  fsGroup: 1001

securityContext:
  allowPrivilegeEscalation: false
  readOnlyRootFilesystem: true
  runAsNonRoot: true
  runAsUser: 1001
  capabilities:
    drop:
    - ALL
    add:
    - NET_BIND_SERVICE

service:
  type: ClusterIP
  port: 80
  targetPort: 80

ingress:
  enabled: true
  className: "nginx"
  annotations:
    cert-manager.io/cluster-issuer: "letsencrypt-prod"
    nginx.ingress.kubernetes.io/ssl-redirect: "true"
  hosts:
    - host: example.com
      paths:
        - path: /
          pathType: Prefix
  tls:
    - secretName: tls-cert
      hosts:
        - example.com

resources:
  limits:
    cpu: 200m
    memory: 256Mi
  requests:
    cpu: 100m
    memory: 128Mi

autoscaling:
  enabled: true
  minReplicas: 3
  maxReplicas: 10
  targetCPUUtilizationPercentage: 80
  targetMemoryUtilizationPercentage: 80

nodeSelector: {}

tolerations: []

affinity: {}
```

```yaml
# helm/secure-app/templates/deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: {{ include "secure-app.fullname" . }}
  labels:
    {{- include "secure-app.labels" . | nindent 4 }}
spec:
  {{- if not .Values.autoscaling.enabled }}
  replicas: {{ .Values.replicaCount }}
  {{- end }}
  selector:
    matchLabels:
      {{- include "secure-app.selectorLabels" . | nindent 6 }}
  template:
    metadata:
      annotations:
        checksum/config: {{ include (print $.Template.BasePath "/configmap.yaml") . | sha256sum }}
      labels:
        {{- include "secure-app.selectorLabels" . | nindent 8 }}
    spec:
      {{- with .Values.imagePullSecrets }}
      imagePullSecrets:
        {{- toYaml . | nindent 8 }}
      {{- end }}
      serviceAccountName: {{ include "secure-app.serviceAccountName" . }}
      securityContext:
        {{- toYaml .Values.podSecurityContext | nindent 8 }}
      containers:
      - name: {{ .Chart.Name }}
        securityContext:
          {{- toYaml .Values.securityContext | nindent 12 }}
        image: "{{ .Values.image.repository }}:{{ .Values.image.tag | default .Chart.AppVersion }}"
        imagePullPolicy: {{ .Values.image.pullPolicy }}
        ports:
        - name: http
          containerPort: {{ .Values.service.targetPort }}
          protocol: TCP
        resources:
          {{- toYaml .Values.resources | nindent 12 }}
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
            port: http
            scheme: HTTPS
          initialDelaySeconds: 30
          periodSeconds: 10
          timeoutSeconds: 5
          failureThreshold: 3
        readinessProbe:
          httpGet:
            path: /ready
            port: http
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
          secretName: tls-cert
          defaultMode: 0400
      {{- with .Values.nodeSelector }}
      nodeSelector:
        {{- toYaml . | nindent 8 }}
      {{- end }}
      {{- with .Values.affinity }}
      affinity:
        {{- toYaml . | nindent 8 }}
      {{- end }}
      {{- with .Values.tolerations }}
      tolerations:
        {{- toYaml . | nindent 8 }}
      {{- end }}
```

## 🛠️ 工具推荐

- **Kubernetes**：容器编排平台
- **Helm**：Kubernetes 包管理器
- **Istio**：服务网格
- **Kyverno**：Kubernetes 策略引擎
- **OPA Gatekeeper**：Kubernetes 策略引擎

## 📝 验证方法

验证容器编排安全是否正确实施的方法：

1. **策略测试**：测试安全策略是否正确执行
2. **网络测试**：测试网络隔离是否有效
3. **访问控制测试**：测试 RBAC 是否正确配置
4. **渗透测试**：进行渗透测试，测试集群安全性

## ⚠️ 常见错误

1. **以 root 用户运行 Pod**：
   - **错误描述**：Pod 以 root 用户运行
   - **风险**：攻击者可能获得 root 权限
   - **解决方案**：配置 Pod 以非 root 用户运行

2. **缺少网络策略**：
   - **错误描述**：没有配置网络策略
   - **风险**：Pod 之间可能相互访问
   - **解决方案**：配置网络策略限制 Pod 间通信

3. **缺少 RBAC**：
   - **错误描述**：没有配置 RBAC
   - **风险**：可能存在权限滥用
   - **解决方案**：配置 RBAC 限制访问权限

4. **缺少准入控制**：
   - **错误描述**：没有配置准入控制
   - **风险**：可能部署不安全的 Pod
   - **解决方案**：配置准入控制验证 Pod 配置

## 📚 参考资料

- [CIS Kubernetes Benchmark](https://www.cisecurity.org/benchmark/kubernetes)
- [Kubernetes 安全最佳实践](https://kubernetes.io/docs/concepts/security/security-checklist/)
- [NIST SP 800-190](https://csrc.nist.gov/publications/detail/sp/800-190/final)
- [Pod Security Standards](https://kubernetes.io/docs/concepts/security/pod-security-standards/)