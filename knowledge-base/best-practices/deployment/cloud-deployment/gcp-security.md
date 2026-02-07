# GCP 安全部署

## 📋 概述

GCP 安全部署是指在 Google Cloud Platform 上安全地部署和管理前端应用。本指南提供了在 GCP 上部署前端应用的安全最佳实践。

## 🎯 适用场景

GCP 安全部署适用于以下场景：

- 在 GCP 上部署静态网站
- 在 GCP 上部署 SPA 应用
- 使用 Cloud Storage 托管静态资源
- 使用 Cloud CDN 分发内容
- 使用 Cloud Functions 实现服务端功能

## 🔍 实现指南

### 1. Cloud Storage 安全配置

安全地配置 Cloud Storage。

#### 1.1 存储桶配置

```bash
#!/bin/bash
# scripts/create-secure-bucket.sh

BUCKET_NAME=$1
PROJECT_ID=$2

if [ -z "$BUCKET_NAME" ] || [ -z "$PROJECT_ID" ]; then
    echo "用法: $0 <存储桶名称> <项目 ID>"
    exit 1
fi

echo "创建安全存储桶: ${BUCKET_NAME}"

# 创建存储桶
gsutil mb -p ${PROJECT_ID} gs://${BUCKET_NAME}

# 启用版本控制
gsutil versioning set on gs://${BUCKET_NAME}

# 启用日志记录
gsutil logging set on -b gs://${BUCKET_NAME}-logs gs://${BUCKET_NAME}

# 配置生命周期
cat > lifecycle.json << EOF
{
  "lifecycle": {
    "rule": [
      {
        "action": {
          "type": "Delete"
        },
        "condition": {
          "age": 90,
          "isLive": false
        }
      }
    ]
  }
}
EOF

gsutil lifecycle set lifecycle.json gs://${BUCKET_NAME}

# 设置默认 ACL
gsutil defacl ch -u AllUsers:R gs://${BUCKET_NAME}

# 启用静态网站
gsutil web set -m index.html -e 404.html gs://${BUCKET_NAME}

# 上传文件
gsutil -m rsync -r dist/ gs://${BUCKET_NAME}

# 设置缓存控制
gsutil setmeta -h "Cache-Control:public, max-age=31536000, immutable" \
    gs://${BUCKET_NAME}/*.js \
    gs://${BUCKET_NAME}/*.css \
    gs://${BUCKET_NAME}/*.png \
    gs://${BUCKET_NAME}/*.jpg \
    gs://${BUCKET_NAME}/*.svg \
    gs://${BUCKET_NAME}/*.woff \
    gs://${BUCKET_NAME}/*.woff2

echo "存储桶创建完成"
```

#### 1.2 IAM 配置

```bash
#!/bin/bash
# scripts/configure-iam.sh

BUCKET_NAME=$1
SERVICE_ACCOUNT=$2

if [ -z "$BUCKET_NAME" ] || [ -z "$SERVICE_ACCOUNT" ]; then
    echo "用法: $0 <存储桶名称> <服务账户>"
    exit 1
fi

echo "配置 IAM: ${BUCKET_NAME}"

# 移除所有访问权限
gsutil iam ch -d AllUsers gs://${BUCKET_NAME}

# 授予服务账户读取权限
gsutil iam ch serviceAccount:${SERVICE_ACCOUNT}:objectViewer gs://${BUCKET_NAME}

# 设置公共读取权限
gsutil iam ch allUsers:objectViewer gs://${BUCKET_NAME}

# 验证 IAM 策略
gsutil iam get gs://${BUCKET_NAME}

echo "IAM 配置完成"
```

### 2. Cloud CDN 安全配置

安全地配置 Cloud CDN。

#### 2.1 CDN 配置

```bash
#!/bin/bash
# scripts/create-secure-cdn.sh

CDN_NAME=$1
BUCKET_NAME=$2
ORIGIN=$3

if [ -z "$CDN_NAME" ] || [ -z "$BUCKET_NAME" ] || [ -z "$ORIGIN" ]; then
    echo "用法: $0 <CDN 名称> <存储桶名称> <源地址>"
    exit 1
fi

echo "创建安全 CDN: ${CDN_NAME}"

# 创建 CDN
gcloud compute url-maps create ${CDN_NAME} \
    --default-service ${BUCKET_NAME}

# 创建 HTTPS 负载均衡器
gcloud compute target-https-proxies create ${CDN_NAME}-https \
    --url-map ${CDN_NAME} \
    --ssl-certificates $(gcloud compute ssl-certificates list --format='value(name)' --limit=1)

# 创建转发规则
gcloud compute forwarding-rules create ${CDN_NAME} \
    --global \
    --target-https-proxy ${CDN_NAME}-https \
    --ports 443 \
    --address ${CDN_NAME}-ip

# 创建 CDN 缓存键策略
gcloud compute backend-buckets update ${BUCKET_NAME} \
    --cache-key-policy=include-query-string,include-http-header,include-named-cookie \
    --custom-request-header='Host: ${ORIGIN}'

# 启用 CDN
gcloud compute backend-buckets update ${BUCKET_NAME} \
    --enable-cdn \
    --cache-mode=force-cache-all \
    --default-ttl=3600 \
    --max-ttl=86400 \
    --client-ttl=3600

# 获取 IP 地址
IP_ADDRESS=$(gcloud compute addresses describe ${CDN_NAME}-ip --global --format='value(address)')

echo "CDN 创建完成"
echo "IP 地址: ${IP_ADDRESS}"
```

#### 2.2 CDN 安全策略

```bash
#!/bin/bash
# scripts/configure-cdn-security.sh

CDN_NAME=$1

if [ -z "$CDN_NAME" ]; then
    echo "用法: $0 <CDN 名称>"
    exit 1
fi

echo "配置 CDN 安全策略: ${CDN_NAME}"

# 创建安全策略
gcloud compute security-policies create ${CDN_NAME}-security \
    --description "Security policy for ${CDN_NAME}"

# 配置速率限制
gcloud compute security-policies rules create 1000 \
    --security-policy ${CDN_NAME}-security \
    --description "Rate limit" \
    --expression "evaluatePreconfiguredExpr('expr_1')" \
    --action throttle(1000, 60) \
    --preview

# 配置 IP 白名单
gcloud compute security-policies rules create 1001 \
    --security-policy ${CDN_NAME}-security \
    --description "IP whitelist" \
    --expression "inIpRange(origin.ip, '192.0.2.0/24')" \
    --action allow

# 配置 IP 黑名单
gcloud compute security-policies rules create 1002 \
    --security-policy ${CDN_NAME}-security \
    --description "IP blacklist" \
    --expression "inIpRange(origin.ip, '203.0.113.0/24')" \
    --action deny

# 关联到负载均衡器
gcloud compute backend-buckets update ${CDN_NAME} \
    --security-policy ${CDN_NAME}-security

echo "CDN 安全策略配置完成"
```

### 3. Cloud Functions 安全配置

安全地配置 Cloud Functions。

#### 3.1 Functions 配置

```bash
#!/bin/bash
# scripts/deploy-functions.sh

FUNCTION_NAME=$1
REGION=${2:-us-central1}
RUNTIME=${3:-nodejs18}

if [ -z "$FUNCTION_NAME" ]; then
    echo "用法: $0 <函数名称> [区域] [运行时]"
    exit 1
fi

echo "部署函数: ${FUNCTION_NAME}"

# 部署函数
gcloud functions deploy ${FUNCTION_NAME} \
    --region ${REGION} \
    --runtime ${RUNTIME} \
    --trigger-http \
    --allow-unauthenticated \
    --memory 256MB \
    --timeout 30s \
    --max-instances 10 \
    --min-instances 0 \
    --entry-point handler \
    --source functions/

# 获取函数 URL
FUNCTION_URL=$(gcloud functions describe ${FUNCTION_NAME} \
    --region ${REGION} \
    --format='value(httpsTrigger.url)')

echo "函数部署完成"
echo "函数 URL: ${FUNCTION_URL}"
```

#### 3.2 Functions 代码示例

```javascript
// functions/index.js
const crypto = require('crypto');

exports.handler = async (req, res) => {
    console.log('处理请求');

    try {
        // 验证请求来源
        const allowedOrigins = ['https://example.com'];
        const origin = req.headers['origin'] || req.headers['referer'];
        
        if (!allowedOrigins.some(allowed => origin && origin.includes(allowed))) {
            res.status(403).json({ error: 'Forbidden' });
            return;
        }

        // 验证请求方法
        if (req.method !== 'GET' && req.method !== 'POST') {
            res.status(405)
                .header('Allow', 'GET, POST')
                .json({ error: 'Method Not Allowed' });
            return;
        }

        // 处理请求
        const responseData = {
            message: 'Hello from Cloud Functions!',
            timestamp: new Date().toISOString(),
            requestId: crypto.randomUUID()
        };

        res.status(200)
            .header('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload')
            .header('X-Content-Type-Options', 'nosniff')
            .header('X-Frame-Options', 'DENY')
            .header('X-XSS-Protection', '1; mode=block')
            .header('Referrer-Policy', 'strict-origin-when-cross-origin')
            .json(responseData);

    } catch (error) {
        console.error('函数错误:', error);
        
        res.status(500).json({ error: 'Internal Server Error' });
    }
};
```

### 4. Cloud Armor 安全配置

使用 Cloud Armor 保护应用。

#### 4.1 安全策略配置

```bash
#!/bin/bash
# scripts/create-cloud-armor.sh

POLICY_NAME=$1
BACKEND_NAME=$2

if [ -z "$POLICY_NAME" ] || [ -z "$BACKEND_NAME" ]; then
    echo "用法: $0 <策略名称> <后端名称>"
    exit 1
fi

echo "创建 Cloud Armor 策略: ${POLICY_NAME}"

# 创建安全策略
gcloud compute security-policies create ${POLICY_NAME} \
    --description "Security policy for ${BACKEND_NAME}"

# 配置预配置规则
gcloud compute security-policies rules create 1000 \
    --security-policy ${POLICY_NAME} \
    --description "XSS attack" \
    --expression "evaluatePreconfiguredExpr('xss-stable')" \
    --action deny

gcloud compute security-policies rules create 1001 \
    --security-policy ${POLICY_NAME} \
    --description "SQL injection attack" \
    --expression "evaluatePreconfiguredExpr('sqli-stable')" \
    --action deny

# 配置速率限制
gcloud compute security-policies rules create 1002 \
    --security-policy ${POLICY_NAME} \
    --description "Rate limit" \
    --expression "evaluatePreconfiguredExpr('expr_1')" \
    --action throttle(1000, 60)

# 关联到后端
gcloud compute backend-buckets update ${BACKEND_NAME} \
    --security-policy ${POLICY_NAME}

echo "Cloud Armor 策略创建完成"
```

#### 4.2 自定义规则配置

```bash
#!/bin/bash
# scripts/configure-custom-rules.sh

POLICY_NAME=$1

if [ -z "$POLICY_NAME" ]; then
    echo "用法: $0 <策略名称>"
    exit 1
fi

echo "配置自定义规则: ${POLICY_NAME}"

# 配置恶意 User-Agent 拦截
gcloud compute security-policies rules create 2000 \
    --security-policy ${POLICY_NAME} \
    --description "Block malicious user agents" \
    --expression "request.headers['User-Agent'].matches('(?i)(sqlmap|nikto|nmap|w3af|acunetix|burpsuite|metasploit)')" \
    --action deny

# 配置 IP 白名单
gcloud compute security-policies rules create 2001 \
    --security-policy ${POLICY_NAME} \
    --description "IP whitelist" \
    --expression "inIpRange(origin.ip, '192.0.2.0/24')" \
    --action allow

# 配置 IP 黑名单
gcloud compute security-policies rules create 2002 \
    --security-policy ${POLICY_NAME} \
    --description "IP blacklist" \
    --expression "inIpRange(origin.ip, '203.0.113.0/24')" \
    --action deny

# 配置地理封锁
gcloud compute security-policies rules create 2003 \
    --security-policy ${POLICY_NAME} \
    --description "Geo blocking" \
    --expression "origin.region_code in ['CN', 'RU', 'KP']" \
    --action deny

echo "自定义规则配置完成"
```

## 📚 代码示例

### Terraform 配置

```hcl
# main.tf
provider "google" {
  project = var.project_id
  region  = var.region
}

# 创建存储桶
resource "google_storage_bucket" "static" {
  name          = "${var.project_id}-static"
  location      = var.region
  force_destroy = false

  uniform_bucket_level_access = true
  versioning {
    enabled = true
  }

  website {
    main_page_suffix = "index.html"
    not_found_page   = "404.html"
  }

  cors {
    origin          = ["https://example.com"]
    method          = ["GET", "HEAD", "OPTIONS"]
    response_header = ["Content-Type", "Access-Control-Allow-Origin"]
    max_age_seconds = 3600
  }

  lifecycle_rule {
    condition {
      age        = 90
      with_state = "ARCHIVED"
    }
    action {
      type = "Delete"
    }
  }
}

# 上传文件
resource "google_storage_bucket_object" "static_files" {
  for_each = fileset("${path.module}/dist", "**/*")
  
  name   = each.value
  bucket = google_storage_bucket.static.name
  source = "${path.module}/dist/${each.value}"
  
  content_type = lookup({
    ".html" = "text/html",
    ".css"  = "text/css",
    ".js"   = "application/javascript",
    ".json" = "application/json",
    ".png"  = "image/png",
    ".jpg"  = "image/jpeg",
    ".svg"  = "image/svg+xml",
    ".woff" = "font/woff",
    ".woff2" = "font/woff2"
  }, regex("\\.[^.]+$", each.value), "application/octet-stream")
}

# 创建 CDN
resource "google_compute_backend_bucket" "cdn" {
  name        = "${var.project_id}-cdn"
  bucket_name = google_storage_bucket.static.name
  enable_cdn  = true

  cdn_policy {
    cache_mode        = "FORCE_CACHE_ALL"
    default_ttl       = 3600
    max_ttl          = 86400
    client_ttl        = 3600
    negative_caching  = false
  }
}

# 创建 URL 映射
resource "google_compute_url_map" "cdn" {
  name            = "${var.project_id}-url-map"
  default_service = google_compute_backend_bucket.cdn.self_link
}

# 创建 HTTPS 代理
resource "google_compute_target_https_proxy" "cdn" {
  name             = "${var.project_id}-https-proxy"
  url_map          = google_compute_url_map.cdn.self_link
  ssl_certificates = [google_compute_managed_ssl_certificate.cdn.self_link]
}

# 创建 SSL 证书
resource "google_compute_managed_ssl_certificate" "cdn" {
  name = "${var.project_id}-ssl-cert"
  managed {
    domains = ["example.com"]
  }
}

# 创建转发规则
resource "google_compute_global_forwarding_rule" "cdn" {
  name       = "${var.project_id}-forwarding-rule"
  target     = google_compute_target_https_proxy.cdn.self_link
  port_range = "443"
  ip_address = google_compute_global_address.cdn.address
}

# 创建全局 IP 地址
resource "google_compute_global_address" "cdn" {
  name = "${var.project_id}-ip"
}

# 输出
output "cdn_url" {
  value = "https://${google_compute_global_address.cdn.address}"
}
```

## 🛠️ 工具推荐

- **Google Cloud CLI**：GCP 命令行工具
- **Cloud SDK**：GCP 开发工具包
- **Terraform**：基础设施即代码工具
- **Cloud Deployment Manager**：GCP 部署管理工具
- **Cloud Security Command Center**：GCP 安全中心

## 📝 验证方法

验证 GCP 安全部署是否正确实施的方法：

1. **安全扫描**：使用 Cloud Security Command Center 扫描安全配置
2. **渗透测试**：进行渗透测试，测试应用的安全性
3. **合规性检查**：检查是否符合 GCP 安全最佳实践
4. **日志审计**：审计 Cloud Logging 和 Cloud Monitoring 日志

## ⚠️ 常见错误

1. **存储桶公开访问**：
   - **错误描述**：存储桶配置为公开访问
   - **风险**：敏感数据可能被未授权访问
   - **解决方案**：使用 IAM 控制访问权限

2. **缺少 HTTPS**：
   - **错误描述**：没有强制使用 HTTPS
   - **风险**：数据可能被窃听
   - **解决方案**：配置 CDN 强制 HTTPS

3. **缺少 Cloud Armor 保护**：
   - **错误描述**：没有使用 Cloud Armor 保护应用
   - **风险**：应用可能受到攻击
   - **解决方案**：配置 Cloud Armor 保护应用

4. **缺少安全头**：
   - **错误描述**：没有设置安全头
   - **风险**：可能被 XSS、CSRF 等攻击
   - **解决方案**：使用 Cloud Functions 或 CDN 添加安全头

## 📚 参考资料

- [GCP 安全最佳实践](https://cloud.google.com/security/best-practices)
- [GCP Well-Architected Framework](https://cloud.google.com/architecture/framework)
- [CIS Google Cloud Platform Benchmark](https://www.cisecurity.org/benchmark/google_cloud_platform)
- [Cloud Security Command Center](https://cloud.google.com/security-command-center)