# Azure 安全部署

## 📋 概述

Azure 安全部署是指在 Azure 云平台上安全地部署和管理前端应用。本指南提供了在 Azure 上部署前端应用的安全最佳实践。

## 🎯 适用场景

Azure 安全部署适用于以下场景：

- 在 Azure 上部署静态网站
- 在 Azure 上部署 SPA 应用
- 使用 Azure Blob Storage 托管静态资源
- 使用 Azure CDN 分发内容
- 使用 Azure Functions 实现服务端功能

## 🔍 实现指南

### 1. Blob Storage 安全配置

安全地配置 Blob Storage。

#### 1.1 存储账户配置

```bash
#!/bin/bash
# scripts/create-secure-storage.sh

STORAGE_ACCOUNT_NAME=$1
RESOURCE_GROUP=$2

if [ -z "$STORAGE_ACCOUNT_NAME" ] || [ -z "$RESOURCE_GROUP" ]; then
    echo "用法: $0 <存储账户名称> <资源组名称>"
    exit 1
fi

echo "创建安全存储账户: ${STORAGE_ACCOUNT_NAME}"

# 创建存储账户
az storage account create \
    --name ${STORAGE_ACCOUNT_NAME} \
    --resource-group ${RESOURCE_GROUP} \
    --location eastus \
    --sku Standard_ZRS \
    --kind StorageV2 \
    --access-tier Hot \
    --https-only true \
    --allow-blob-public-access false \
    --min-tls-version TLS1_2

# 启用静态网站
az storage blob service-properties update \
    --account-name ${STORAGE_ACCOUNT_NAME} \
    --static-website \
    --404-document index.html \
    --index-document index.html

# 获取存储账户密钥
STORAGE_KEY=$(az storage account keys list \
    --account-name ${STORAGE_ACCOUNT_NAME} \
    --resource-group ${RESOURCE_GROUP} \
    --query '[0].value' \
    --output tsv)

# 上传文件
az storage blob upload-batch \
    --account-name ${STORAGE_ACCOUNT_NAME} \
    --account-key ${STORAGE_KEY} \
    --destination '$web' \
    --source dist

# 设置 CORS
az storage cors clear \
    --account-name ${STORAGE_ACCOUNT_NAME} \
    --account-key ${STORAGE_KEY} \
    --services b

az storage cors add \
    --account-name ${STORAGE_ACCOUNT_NAME} \
    --account-key ${STORAGE_KEY} \
    --services b \
    --origins 'https://example.com' \
    --methods GET HEAD OPTIONS \
    --max-age 86400 \
    --exposed-headers '*' \
    --allowed-headers '*'

echo "存储账户创建完成"
```

#### 1.2 存储账户网络规则

```bash
#!/bin/bash
# scripts/configure-network-rules.sh

STORAGE_ACCOUNT_NAME=$1
RESOURCE_GROUP=$2

if [ -z "$STORAGE_ACCOUNT_NAME" ] || [ -z "$RESOURCE_GROUP" ]; then
    echo "用法: $0 <存储账户名称> <资源组名称>"
    exit 1
fi

echo "配置网络规则: ${STORAGE_ACCOUNT_NAME}"

# 启用防火墙
az storage account network-rule add \
    --account-name ${STORAGE_ACCOUNT_NAME} \
    --resource-group ${RESOURCE_GROUP} \
    --subnet /subscriptions/{subscription-id}/resourceGroups/{resource-group}/providers/Microsoft.Network/virtualNetworks/{vnet-name}/subnets/{subnet-name}

# 添加 IP 规则
az storage account network-rule add \
    --account-name ${STORAGE_ACCOUNT_NAME} \
    --resource-group ${RESOURCE_GROUP} \
    --ip-address 192.0.2.0/24

az storage account network-rule add \
    --account-name ${STORAGE_ACCOUNT_NAME} \
    --resource-group ${RESOURCE_GROUP} \
    --ip-address 203.0.113.0/24

# 拒绝默认访问
az storage account update \
    --name ${STORAGE_ACCOUNT_NAME} \
    --resource-group ${RESOURCE_GROUP} \
    --default-action Deny

echo "网络规则配置完成"
```

### 2. CDN 安全配置

安全地配置 Azure CDN。

#### 2.1 CDN 配置文件

```bash
#!/bin/bash
# scripts/create-secure-cdn.sh

CDN_PROFILE_NAME=$1
CDN_ENDPOINT_NAME=$2
STORAGE_ACCOUNT_NAME=$3
RESOURCE_GROUP=$4

if [ -z "$CDN_PROFILE_NAME" ] || [ -z "$CDN_ENDPOINT_NAME" ] || [ -z "$STORAGE_ACCOUNT_NAME" ] || [ -z "$RESOURCE_GROUP" ]; then
    echo "用法: $0 <CDN 配置文件名称> <CDN 终端名称> <存储账户名称> <资源组名称>"
    exit 1
fi

echo "创建安全 CDN: ${CDN_ENDPOINT_NAME}"

# 创建 CDN 配置文件
az cdn profile create \
    --name ${CDN_PROFILE_NAME} \
    --resource-group ${RESOURCE_GROUP} \
    --sku Standard_Microsoft

# 创建 CDN 终端
az cdn endpoint create \
    --name ${CDN_ENDPOINT_NAME} \
    --profile-name ${CDN_PROFILE_NAME} \
    --resource-group ${RESOURCE_GROUP} \
    --origin-name ${STORAGE_ACCOUNT_NAME} \
    --origin-host-name ${STORAGE_ACCOUNT_NAME}.blob.core.windows.net \
    --https-only true \
    --is-http-allowed false \
    --is-compression-enabled true \
    --query-string-caching IgnoreQueryString

# 启用自定义域 HTTPS
az cdn custom-domain enable-https \
    --endpoint-name ${CDN_ENDPOINT_NAME} \
    --profile-name ${CDN_PROFILE_NAME} \
    --resource-group ${RESOURCE_GROUP} \
    --name www.example.com

echo "CDN 创建完成"
```

#### 2.2 CDN 规则引擎

```json
{
  "rules": [
    {
      "name": "EnforceHTTPS",
      "order": 1,
      "conditions": [
        {
          "name": "RequestProtocol",
          "parameters": {
            "operator": "Equal",
            "matchValues": [
              "HTTP"
            ]
          }
        }
      ],
      "actions": [
        {
          "name": "UrlRedirect",
          "parameters": {
            "redirectType": "Found",
            "destinationProtocol": "Https",
            "customPath": "/{path}",
            "customQueryString": "{query_string}"
          }
        }
      ]
    },
    {
      "name": "SecurityHeaders",
      "order": 2,
      "conditions": [],
      "actions": [
        {
          "name": "ModifyResponseHeader",
          "parameters": {
            "headerAction": "Overwrite",
            "headerName": "Strict-Transport-Security",
            "value": "max-age=31536000; includeSubDomains; preload"
          }
        },
        {
          "name": "ModifyResponseHeader",
          "parameters": {
            "headerAction": "Overwrite",
            "headerName": "X-Content-Type-Options",
            "value": "nosniff"
          }
        },
        {
          "name": "ModifyResponseHeader",
          "parameters": {
            "headerAction": "Overwrite",
            "headerName": "X-Frame-Options",
            "value": "DENY"
          }
        },
        {
          "name": "ModifyResponseHeader",
          "parameters": {
            "headerAction": "Overwrite",
            "headerName": "X-XSS-Protection",
            "value": "1; mode=block"
          }
        },
        {
          "name": "ModifyResponseHeader",
          "parameters": {
            "headerAction": "Overwrite",
            "headerName": "Referrer-Policy",
            "value": "strict-origin-when-cross-origin"
          }
        },
        {
          "name": "ModifyResponseHeader",
          "parameters": {
            "headerAction": "Overwrite",
            "headerName": "Content-Security-Policy",
            "value": "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:; connect-src 'self' https://api.example.com; object-src 'none'; frame-src 'none';"
          }
        }
      ]
    }
  ]
}
```

### 3. Azure Functions 安全配置

安全地配置 Azure Functions。

#### 3.1 Functions 应用配置

```bash
#!/bin/bash
# scripts/create-secure-functions.sh

FUNCTION_APP_NAME=$1
STORAGE_ACCOUNT_NAME=$2
RESOURCE_GROUP=$3

if [ -z "$FUNCTION_APP_NAME" ] || [ -z "$STORAGE_ACCOUNT_NAME" ] || [ -z "$RESOURCE_GROUP" ]; then
    echo "用法: $0 <函数应用名称> <存储账户名称> <资源组名称>"
    exit 1
fi

echo "创建安全函数应用: ${FUNCTION_APP_NAME}"

# 创建函数应用
az functionapp create \
    --name ${FUNCTION_APP_NAME} \
    --resource-group ${RESOURCE_GROUP} \
    --storage-account ${STORAGE_ACCOUNT_NAME} \
    --consumption-plan-location eastus \
    --runtime node \
    --runtime-version 18 \
    --functions-version 4 \
    --https-only true

# 配置应用设置
az functionapp config appsettings set \
    --name ${FUNCTION_APP_NAME} \
    --resource-group ${RESOURCE_GROUP} \
    --settings \
        NODE_ENV=production \
        WEBSITE_RUN_FROM_PACKAGE=1 \
        FUNCTIONS_EXTENSION_VERSION=~4 \
        FUNCTIONS_WORKER_RUNTIME=node

# 配置 CORS
az functionapp cors add \
    --name ${FUNCTION_APP_NAME} \
    --resource-group ${RESOURCE_GROUP} \
    --allowed-origins https://example.com \
    --allowed-methods GET POST OPTIONS \
    --allowed-headers '*' \
    --exposed-headers '*' \
    --max-age 86400

# 配置身份验证
az functionapp auth update \
    --name ${FUNCTION_APP_NAME} \
    --resource-group ${RESOURCE_GROUP} \
    --action LoginWithAzureActiveDirectory \
    --enabled true

echo "函数应用创建完成"
```

#### 3.2 Functions 代码示例

```javascript
// functions/index.js
const crypto = require('crypto');

module.exports = async function (context, req) {
    context.log('处理请求');

    try {
        // 验证请求来源
        const allowedOrigins = ['https://example.com'];
        const origin = req.headers['origin'] || req.headers['referer'];
        
        if (!allowedOrigins.some(allowed => origin && origin.includes(allowed))) {
            context.res = {
                status: 403,
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ error: 'Forbidden' })
            };
            return;
        }

        // 验证请求方法
        if (req.method !== 'GET' && req.method !== 'POST') {
            context.res = {
                status: 405,
                headers: {
                    'Content-Type': 'application/json',
                    'Allow': 'GET, POST'
                },
                body: JSON.stringify({ error: 'Method Not Allowed' })
            };
            return;
        }

        // 处理请求
        const responseData = {
            message: 'Hello from Azure Functions!',
            timestamp: new Date().toISOString(),
            requestId: crypto.randomUUID()
        };

        context.res = {
            status: 200,
            headers: {
                'Content-Type': 'application/json',
                'Strict-Transport-Security': 'max-age=31536000; includeSubDomains; preload',
                'X-Content-Type-Options': 'nosniff',
                'X-Frame-Options': 'DENY',
                'X-XSS-Protection': '1; mode=block',
                'Referrer-Policy': 'strict-origin-when-cross-origin'
            },
            body: JSON.stringify(responseData)
        };

    } catch (error) {
        context.log.error('函数错误:', error);
        
        context.res = {
            status: 500,
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ error: 'Internal Server Error' })
        };
    }
};
```

### 4. Application Gateway 安全配置

使用 Application Gateway 保护应用。

#### 4.1 WAF 配置

```bash
#!/bin/bash
# scripts/create-secure-waf.sh

WAF_NAME=$1
RESOURCE_GROUP=$2
VNET_NAME=$3

if [ -z "$WAF_NAME" ] || [ -z "$RESOURCE_GROUP" ] || [ -z "$VNET_NAME" ]; then
    echo "用法: $0 <WAF 名称> <资源组名称> <VNET 名称>"
    exit 1
fi

echo "创建安全 WAF: ${WAF_NAME}"

# 创建公共 IP
az network public-ip create \
    --name ${WAF_NAME}-pip \
    --resource-group ${RESOURCE_GROUP} \
    --sku Standard

# 创建 WAF
az network application-gateway create \
    --name ${WAF_NAME} \
    --resource-group ${RESOURCE_GROUP} \
    --vnet-name ${VNET_NAME} \
    --subnet waf-subnet \
    --public-ip-address ${WAF_NAME}-pip \
    --sku WAF_v2 \
    --capacity 2 \
    --http-settings-cookie-based-affinity Enabled \
    --http-settings-protocol Https \
    --frontend-port 443 \
    --waf-config \
        firewall-mode Prevention \
        rule-set-type OWASP \
        rule-set-version 3.2 \
        disabled-rule-groups \
        REQUEST-942-APPLICATION-ATTACK-SQLI

# 启用 WAF 日志
az monitor diagnostic-settings create \
    --name ${WAF_NAME}-diagnostics \
    --resource /subscriptions/{subscription-id}/resourceGroups/${RESOURCE_GROUP}/providers/Microsoft.Network/applicationGateways/${WAF_NAME} \
    --storage-account ${STORAGE_ACCOUNT_NAME} \
    --logs '[
            {
                "category": "ApplicationGatewayAccessLog",
                "enabled": true
            },
            {
                "category": "ApplicationGatewayFirewallLog",
                "enabled": true
            }
        ]' \
    --metrics '[
            {
                "category": "AllMetrics",
                "enabled": true
            }
        ]'

echo "WAF 创建完成"
```

#### 4.2 WAF 自定义规则

```json
{
  "customRules": [
    {
      "name": "BlockMaliciousUserAgents",
      "priority": 1,
      "ruleType": "MatchRule",
      "action": "Block",
      "matchConditions": [
        {
          "matchVariables": [
            {
              "variableName": "RequestHeaders",
              "selector": "User-Agent"
            }
          ],
          "operator": "Contains",
          "negationConditon": false,
          "matchValues": [
            "sqlmap",
            "nikto",
            "nmap",
            "w3af",
            "acunetix",
            "burpsuite",
            "metasploit"
          ]
        }
      ]
    },
    {
      "name": "RateLimitByIP",
      "priority": 2,
      "ruleType": "RateLimitRule",
      "action": "Block",
      "matchConditions": [
        {
          "matchVariables": [
            {
              "variableName": "RemoteAddr"
            }
          ],
          "operator": "Any",
          "negationConditon": false,
          "matchValues": []
        }
      ],
      "rateLimitDurationInMinutes": 1,
      "rateLimitThreshold": 100
    }
  ]
}
```

## 📚 代码示例

### Azure CLI 部署脚本

```bash
#!/bin/bash
# scripts/deploy-to-azure.sh

RESOURCE_GROUP=$1
LOCATION=${2:-eastus}
STORAGE_ACCOUNT_NAME=$3
CDN_PROFILE_NAME=$4
CDN_ENDPOINT_NAME=$5

if [ -z "$RESOURCE_GROUP" ] || [ -z "$STORAGE_ACCOUNT_NAME" ] || [ -z "$CDN_PROFILE_NAME" ] || [ -z "$CDN_ENDPOINT_NAME" ]; then
    echo "用法: $0 <资源组名称> [位置] <存储账户名称> <CDN 配置文件名称> <CDN 终端名称>"
    exit 1
fi

echo "部署到 Azure..."

# 创建资源组
az group create \
    --name ${RESOURCE_GROUP} \
    --location ${LOCATION}

# 创建存储账户
bash scripts/create-secure-storage.sh ${STORAGE_ACCOUNT_NAME} ${RESOURCE_GROUP}

# 创建 CDN
bash scripts/create-secure-cdn.sh ${CDN_PROFILE_NAME} ${CDN_ENDPOINT_NAME} ${STORAGE_ACCOUNT_NAME} ${RESOURCE_GROUP}

# 获取 CDN 终端 URL
CDN_URL=$(az cdn endpoint show \
    --name ${CDN_ENDPOINT_NAME} \
    --profile-name ${CDN_PROFILE_NAME} \
    --resource-group ${RESOURCE_GROUP} \
    --query hostName \
    --output tsv)

echo "部署完成"
echo "CDN URL: https://${CDN_URL}"
```

## 🛠️ 工具推荐

- **Azure CLI**：Azure 命令行工具
- **Azure PowerShell**：Azure PowerShell 模块
- **Azure DevOps**：Azure DevOps 平台
- **Terraform**：基础设施即代码工具
- **Azure Security Center**：Azure 安全中心

## 📝 验证方法

验证 Azure 安全部署是否正确实施的方法：

1. **安全扫描**：使用 Azure Security Center 扫描安全配置
2. **渗透测试**：进行渗透测试，测试应用的安全性
3. **合规性检查**：检查是否符合 Azure 安全最佳实践
4. **日志审计**：审计 Azure Monitor 和 Log Analytics 日志

## ⚠️ 常见错误

1. **存储账户公开访问**：
   - **错误描述**：存储账户配置为公开访问
   - **风险**：敏感数据可能被未授权访问
   - **解决方案**：禁用公开访问，使用 CDN 或 Functions

2. **缺少 HTTPS**：
   - **错误描述**：没有强制使用 HTTPS
   - **风险**：数据可能被窃听
   - **解决方案**：配置 CDN 强制 HTTPS

3. **缺少 WAF 保护**：
   - **错误描述**：没有使用 WAF 保护应用
   - **风险**：应用可能受到攻击
   - **解决方案**：配置 Application Gateway WAF

4. **缺少安全头**：
   - **错误描述**：没有设置安全头
   - **风险**：可能被 XSS、CSRF 等攻击
   - **解决方案**：使用 CDN 规则引擎添加安全头

## 📚 参考资料

- [Azure 安全最佳实践](https://docs.microsoft.com/azure/security/fundamentals/best-practices)
- [Azure Well-Architected Framework](https://docs.microsoft.com/azure/architecture/framework/)
- [CIS Microsoft Azure Benchmark](https://www.cisecurity.org/benchmark/microsoft_azure)
- [Azure Security Center](https://docs.microsoft.com/azure/security-center/)