# AWS 安全部署

## 📋 概述

AWS 安全部署是指在 AWS 云平台上安全地部署和管理前端应用。本指南提供了在 AWS 上部署前端应用的安全最佳实践。

## 🎯 适用场景

AWS 安全部署适用于以下场景：

- 在 AWS 上部署静态网站
- 在 AWS 上部署 SPA 应用
- 使用 AWS S3 托管静态资源
- 使用 AWS CloudFront 分发内容
- 使用 AWS Lambda 实现服务端功能

## 🔍 实现指南

### 1. S3 安全配置

安全地配置 S3 存储桶。

#### 1.1 S3 存储桶配置

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "PublicReadGetObject",
      "Effect": "Allow",
      "Principal": "*",
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::your-bucket-name/*",
      "Condition": {
        "IpAddress": {
          "aws:SourceIp": [
            "192.0.2.0/24",
            "203.0.113.0/24"
          ]
        }
      }
    },
    {
      "Sid": "DenyInsecureConnections",
      "Effect": "Deny",
      "Principal": "*",
      "Action": "s3:*",
      "Resource": [
        "arn:aws:s3:::your-bucket-name",
        "arn:aws:s3:::your-bucket-name/*"
      ],
      "Condition": {
        "Bool": {
          "aws:SecureTransport": "false"
        }
      }
    }
  ]
}
```

#### 1.2 S3 存储桶加密

```bash
#!/bin/bash
# scripts/enable-s3-encryption.sh

BUCKET_NAME=$1

if [ -z "$BUCKET_NAME" ]; then
    echo "用法: $0 <存储桶名称>"
    exit 1
fi

echo "启用 S3 存储桶加密: ${BUCKET_NAME}"

# 启用默认加密
aws s3api put-bucket-encryption \
    --bucket ${BUCKET_NAME} \
    --server-side-encryption-configuration '{
        "Rules": [
            {
                "ApplyServerSideEncryptionByDefault": {
                    "SSEAlgorithm": "AES256"
                }
            }
        ]
    }'

# 启用版本控制
aws s3api put-bucket-versioning \
    --bucket ${BUCKET_NAME} \
    --versioning-configuration Status=Enabled

# 启用日志记录
aws s3api put-bucket-logging \
    --bucket ${BUCKET_NAME} \
    --bucket-logging-status '{
        "LoggingEnabled": {
            "TargetBucket": "${BUCKET_NAME}-logs",
            "TargetPrefix": "logs/"
        }
    }'

echo "S3 存储桶加密配置完成"
```

### 2. CloudFront 安全配置

安全地配置 CloudFront 分发。

#### 2.1 CloudFront 分发配置

```json
{
  "CallerReference": "2024-01-01",
  "DefaultRootObject": "index.html",
  "Origins": {
    "Quantity": 1,
    "Items": [
      {
        "Id": "S3-your-bucket-name",
        "DomainName": "your-bucket-name.s3.amazonaws.com",
        "S3OriginConfig": {
          "OriginAccessIdentity": "origin-access-identity/cloudfront/E127EXAMPLE51Z"
        }
      }
    ]
  },
  "DefaultCacheBehavior": {
    "TargetOriginId": "S3-your-bucket-name",
    "ViewerProtocolPolicy": "redirect-to-https",
    "AllowedMethods": {
      "Quantity": 2,
      "Items": ["GET", "HEAD"],
      "CachedMethods": {
        "Quantity": 2,
        "Items": ["GET", "HEAD"]
      }
    },
    "ForwardedValues": {
      "QueryString": false,
      "Cookies": {
        "Forward": "none"
      }
    },
    "MinTTL": 0,
    "DefaultTTL": 86400,
    "MaxTTL": 31536000,
    "Compress": true,
    "ViewerProtocolPolicy": "https-only"
  },
  "ViewerCertificate": {
    "ACMCertificateArn": "arn:aws:acm:us-east-1:123456789012:certificate/12345678-1234-1234-1234-123456789012",
    "SSLSupportMethod": "sni-only",
    "MinimumProtocolVersion": "TLSv1.2_2021"
  },
  "PriceClass": "PriceClass_All",
  "Enabled": true
}
```

#### 2.2 CloudFront 安全头

```javascript
// cloudfront-functions/security-headers.js
function handler(event) {
  var response = event.response;
  var headers = response.headers;

  headers['strict-transport-security'] = { value: 'max-age=31536000; includeSubDomains; preload' };
  headers['x-content-type-options'] = { value: 'nosniff' };
  headers['x-frame-options'] = { value: 'DENY' };
  headers['x-xss-protection'] = { value: '1; mode=block' };
  headers['referrer-policy'] = { value: 'strict-origin-when-cross-origin' };
  headers['content-security-policy'] = { value: "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:; connect-src 'self' https://api.example.com; object-src 'none'; frame-src 'none';" };
  headers['permissions-policy'] = { value: 'geolocation=(), microphone=(), camera=()' };

  return response;
}
```

### 3. Lambda 安全配置

安全地配置 Lambda 函数。

#### 3.1 Lambda 函数配置

```javascript
// lambda/index.js
const AWS = require('aws-sdk');
const s3 = new AWS.S3();

exports.handler = async (event) => {
  try {
    const request = event.Records[0].cf.request;
    
    // 验证请求来源
    const allowedOrigins = ['https://example.com'];
    const origin = request.headers['origin'] ? request.headers['origin'][0].value : '';
    
    if (!allowedOrigins.includes(origin)) {
      return {
        status: '403',
        statusDescription: 'Forbidden',
        headers: {
          'content-type': [{ value: 'application/json' }]
        },
        body: JSON.stringify({ error: 'Forbidden' })
      };
    }
    
    // 处理请求
    const response = await s3.getObject({
      Bucket: 'your-bucket-name',
      Key: request.uri
    }).promise();
    
    return {
      status: '200',
      statusDescription: 'OK',
      headers: {
        'content-type': [{ value: response.ContentType }]
      },
      body: response.Body.toString('base64'),
      bodyEncoding: 'base64'
    };
    
  } catch (error) {
    console.error('Lambda 函数错误:', error);
    
    return {
      status: '500',
      statusDescription: 'Internal Server Error',
      headers: {
        'content-type': [{ value: 'application/json' }]
      },
      body: JSON.stringify({ error: 'Internal Server Error' })
    };
  }
};
```

#### 3.2 Lambda 安全配置

```bash
#!/bin/bash
# scripts/deploy-lambda.sh

FUNCTION_NAME=$1
ZIP_FILE=$2

if [ -z "$FUNCTION_NAME" ] || [ -z "$ZIP_FILE" ]; then
    echo "用法: $0 <函数名称> <ZIP 文件>"
    exit 1
fi

echo "部署 Lambda 函数: ${FUNCTION_NAME}"

# 创建或更新 Lambda 函数
if aws lambda get-function --function-name ${FUNCTION_NAME} 2>/dev/null; then
    echo "更新现有函数"
    aws lambda update-function-code \
        --function-name ${FUNCTION_NAME} \
        --zip-file fileb://${ZIP_FILE}
else
    echo "创建新函数"
    aws lambda create-function \
        --function-name ${FUNCTION_NAME} \
        --runtime nodejs18.x \
        --role arn:aws:iam::123456789012:role/lambda-role \
        --handler index.handler \
        --zip-file fileb://${ZIP_FILE} \
        --timeout 30 \
        --memory-size 256 \
        --environment Variables={NODE_ENV=production}
fi

# 配置函数 URL
aws lambda create-function-url-config \
    --function-name ${FUNCTION_NAME} \
    --auth-type AWS_IAM \
    --cors '{
        "AllowOrigins": ["https://example.com"],
        "AllowMethods": ["GET", "POST"],
        "AllowHeaders": ["Content-Type", "Authorization"],
        "ExposeHeaders": ["Content-Type"]
    }'

# 添加权限
aws lambda add-permission \
    --function-name ${FUNCTION_NAME} \
    --action lambda:InvokeFunctionUrl \
    --principal '*' \
    --statement-id function-url \
    --function-url-auth-type AWS_IAM

echo "Lambda 函数部署完成"
```

### 4. WAF 安全配置

使用 AWS WAF 保护应用。

#### 4.1 WAF 规则配置

```json
{
  "Name": "WebACL-Security",
  "Scope": "REGIONAL",
  "DefaultAction": {
    "Allow": {}
  },
  "Description": "Web ACL 安全规则",
  "Rules": [
    {
      "Name": "AWSManagedRulesCommonRuleSet",
      "Priority": 1,
      "Statement": {
        "ManagedRuleGroupStatement": {
          "VendorName": "AWS",
          "Name": "AWSManagedRulesCommonRuleSet"
        }
      },
      "OverrideAction": {
        "None": {}
      },
      "VisibilityConfig": {
        "SampledRequestsEnabled": true,
        "CloudWatchMetricsEnabled": true,
        "MetricName": "AWSManagedRulesCommonRuleSet"
      }
    },
    {
      "Name": "AWSManagedRulesKnownBadInputsRuleSet",
      "Priority": 2,
      "Statement": {
        "ManagedRuleGroupStatement": {
          "VendorName": "AWS",
          "Name": "AWSManagedRulesKnownBadInputsRuleSet"
        }
      },
      "OverrideAction": {
        "None": {}
      },
      "VisibilityConfig": {
        "SampledRequestsEnabled": true,
        "CloudWatchMetricsEnabled": true,
        "MetricName": "AWSManagedRulesKnownBadInputsRuleSet"
      }
    },
    {
      "Name": "RateLimitRule",
      "Priority": 3,
      "Statement": {
        "RateBasedStatement": {
          "Limit": 2000,
          "AggregateKeyType": "IP"
        }
      },
      "Action": {
        "Block": {}
      },
      "VisibilityConfig": {
        "SampledRequestsEnabled": true,
        "CloudWatchMetricsEnabled": true,
        "MetricName": "RateLimitRule"
      }
    }
  ],
  "VisibilityConfig": {
    "SampledRequestsEnabled": true,
    "CloudWatchMetricsEnabled": true,
    "MetricName": "WebACL-Security"
  }
}
```

#### 4.2 WAF 部署脚本

```bash
#!/bin/bash
# scripts/deploy-waf.sh

WEB_ACL_NAME=$1
CLOUDFRONT_DISTRIBUTION_ID=$2

if [ -z "$WEB_ACL_NAME" ] || [ -z "$CLOUDFRONT_DISTRIBUTION_ID" ]; then
    echo "用法: $0 <Web ACL 名称> <CloudFront 分发 ID>"
    exit 1
fi

echo "部署 WAF: ${WEB_ACL_NAME}"

# 创建 Web ACL
aws wafv2 create-web-acl \
    --name ${WEB_ACL_NAME} \
    --scope CLOUDFRONT \
    --default-action Allow={} \
    --rules file://waf-rules.json \
    --visibility-config SampledRequestsEnabled=true,CloudWatchMetricsEnabled=true,MetricName=${WEB_ACL_NAME}

# 获取 Web ACL ID
WEB_ACL_ID=$(aws wafv2 list-web-acls --scope CLOUDFRONT --query 'WebACLs[?Name==`'${WEB_ACL_NAME}'`].Id' --output text)

# 关联到 CloudFront 分发
aws wafv2 associate-web-acl \
    --web-acl-arn arn:aws:wafv2:global:123456789012:global/webacl/${WEB_ACL_NAME}/${WEB_ACL_ID} \
    --resource-arn arn:aws:cloudfront::123456789012:distribution/${CLOUDFRONT_DISTRIBUTION_ID}

echo "WAF 部署完成"
```

## 📚 代码示例

### AWS CDK 部署配置

```typescript
// lib/secure-app-stack.ts
import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as cloudfront from 'aws-cdk-lib/aws-cloudfront';
import * as origins from 'aws-cdk-lib/aws-cloudfront-origins';
import * as wafv2 from 'aws-cdk-lib/aws-wafv2';

export class SecureAppStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // 创建 S3 存储桶
    const bucket = new s3.Bucket(this, 'SecureBucket', {
      bucketName: 'secure-app-bucket',
      encryption: s3.BucketEncryption.S3_MANAGED,
      versioned: true,
      publicReadAccess: false,
      blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
      removalPolicy: cdk.RemovalPolicy.RETAIN,
    });

    // 创建 CloudFront OAI
    const oai = new cloudfront.OriginAccessIdentity(this, 'OAI');

    // 授予 OAI 访问权限
    bucket.grantRead(oai);

    // 创建 CloudFront 分发
    const distribution = new cloudfront.Distribution(this, 'Distribution', {
      defaultRootObject: 'index.html',
      defaultBehavior: {
        origin: new origins.S3Origin(bucket, {
          originAccessIdentity: oai,
        }),
        viewerProtocolPolicy: cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
        allowedMethods: cloudfront.AllowedMethods.ALLOW_GET_HEAD,
        cachedMethods: cloudfront.CachedMethods.CACHE_GET_HEAD,
        compress: true,
      },
      certificate: cloudfront.Certificate.fromCertificateArn(
        this,
        'Certificate',
        'arn:aws:acm:us-east-1:123456789012:certificate/12345678-1234-1234-1234-123456789012'
      ),
      minimumProtocolVersion: cloudfront.SecurityPolicyProtocol.TLS_V1_2_2021,
    });

    // 创建 WAF
    const webAcl = new wafv2.CfnWebACL(this, 'WebACL', {
      defaultAction: { allow: {} },
      scope: 'CLOUDFRONT',
      visibilityConfig: {
        sampledRequestsEnabled: true,
        cloudWatchMetricsEnabled: true,
        metricName: 'SecureAppWebACL',
      },
      rules: [
        {
          name: 'AWSManagedRulesCommonRuleSet',
          priority: 1,
          overrideAction: { none: {} },
          statement: {
            managedRuleGroupStatement: {
              vendorName: 'AWS',
              name: 'AWSManagedRulesCommonRuleSet',
            },
          },
          visibilityConfig: {
            sampledRequestsEnabled: true,
            cloudWatchMetricsEnabled: true,
            metricName: 'AWSManagedRulesCommonRuleSet',
          },
        },
        {
          name: 'RateLimitRule',
          priority: 2,
          action: { block: {} },
          statement: {
            rateBasedStatement: {
              limit: 2000,
              aggregateKeyType: 'IP',
            },
          },
          visibilityConfig: {
            sampledRequestsEnabled: true,
            cloudWatchMetricsEnabled: true,
            metricName: 'RateLimitRule',
          },
        },
      ],
    });

    // 关联 WAF 到 CloudFront
    new wafv2.CfnWebACLAssociation(this, 'WebACLAssociation', {
      resourceArn: `arn:aws:cloudfront::${this.account}:distribution/${distribution.distributionId}`,
      webAclArn: webAcl.attrArn,
    });

    new cdk.CfnOutput(this, 'DistributionUrl', {
      value: distribution.distributionDomainName,
    });
  }
}
```

## 🛠️ 工具推荐

- **AWS CLI**：AWS 命令行工具
- **AWS CDK**：AWS 云开发工具包
- **AWS SAM**：AWS 无服务器应用模型
- **Terraform**：基础设施即代码工具
- **AWS Security Hub**：AWS 安全中心

## 📝 验证方法

验证 AWS 安全部署是否正确实施的方法：

1. **安全扫描**：使用 AWS Security Hub 扫描安全配置
2. **渗透测试**：进行渗透测试，测试应用的安全性
3. **合规性检查**：检查是否符合 AWS 安全最佳实践
4. **日志审计**：审计 CloudTrail 和 CloudWatch 日志

## ⚠️ 常见错误

1. **S3 存储桶公开访问**：
   - **错误描述**：S3 存储桶配置为公开访问
   - **风险**：敏感数据可能被未授权访问
   - **解决方案**：禁用公开访问，使用 OAI 或 CloudFront

2. **缺少 HTTPS**：
   - **错误描述**：没有强制使用 HTTPS
   - **风险**：数据可能被窃听
   - **解决方案**：配置 CloudFront 强制 HTTPS

3. **缺少 WAF 保护**：
   - **错误描述**：没有使用 WAF 保护应用
   - **风险**：应用可能受到攻击
   - **解决方案**：配置 WAF 保护应用

4. **缺少安全头**：
   - **错误描述**：没有设置安全头
   - **风险**：可能被 XSS、CSRF 等攻击
   - **解决方案**：使用 CloudFront Functions 添加安全头

## 📚 参考资料

- [AWS 安全最佳实践](https://docs.aws.amazon.com/whitepapers/latest/aws-security-best-practices/)
- [AWS Well-Architected Framework](https://aws.amazon.com/architecture/well-architected/)
- [CIS AWS Benchmark](https://www.cisecurity.org/benchmark/amazon_web_services)
- [AWS Security Hub](https://docs.aws.amazon.com/securityhub/)