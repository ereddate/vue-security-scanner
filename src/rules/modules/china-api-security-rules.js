const chinaApiSecurityRules = [
  {
    id: 'aliyun-api-security',
    name: '阿里云 API 安全检测',
    severity: 'High',
    description: '阿里云 API 使用中的潜在安全问题',
    recommendation: '确保阿里云 API 的使用符合安全最佳实践，特别是 API 密钥的安全管理、请求签名的正确实现和权限的最小化配置。',
    patterns: [
      { key: 'aliyun-api', pattern: 'aliyun|阿里云|@alicloud|@aliyun' },
      { key: 'aliyun-sdk', pattern: 'aliyun-sdk|@alicloud/sdk|@aliyun/client' },
      { key: 'aliyun-access', pattern: 'accessKeyId|accessKeySecret|securityToken' }
    ]
  },
  {
    id: 'tencent-cloud-api-security',
    name: '腾讯云 API 安全检测',
    severity: 'High',
    description: '腾讯云 API 使用中的潜在安全问题',
    recommendation: '确保腾讯云 API 的使用符合安全最佳实践，特别是 API 密钥的安全管理、请求签名的正确实现和权限的最小化配置。',
    patterns: [
      { key: 'tencent-cloud', pattern: 'tencentcloud|腾讯云|@tencentcloud' },
      { key: 'tencent-sdk', pattern: 'tencentcloud-sdk|@tencentcloud/sdk|@tencentcloud/client' },
      { key: 'tencent-access', pattern: 'SecretId|SecretKey|Token' }
    ]
  },
  {
    id: 'huawei-cloud-api-security',
    name: '华为云 API 安全检测',
    severity: 'High',
    description: '华为云 API 使用中的潜在安全问题',
    recommendation: '确保华为云 API 的使用符合安全最佳实践，特别是 API 密钥的安全管理、请求签名的正确实现和权限的最小化配置。',
    patterns: [
      { key: 'huawei-cloud', pattern: 'huaweicloud|华为云|@huaweicloud' },
      { key: 'huawei-sdk', pattern: 'huaweicloud-sdk|@huaweicloud/sdk|@huaweicloud/client' },
      { key: 'huawei-access', pattern: 'AK|SK|AccessKeyId|SecretAccessKey' }
    ]
  },
  {
    id: 'baidu-cloud-api-security',
    name: '百度云 API 安全检测',
    severity: 'High',
    description: '百度云 API 使用中的潜在安全问题',
    recommendation: '确保百度云 API 的使用符合安全最佳实践，特别是 API 密钥的安全管理、请求签名的正确实现和权限的最小化配置。',
    patterns: [
      { key: 'baidu-cloud', pattern: 'baidubce|百度云|@baidubce' },
      { key: 'baidu-sdk', pattern: 'baidubce-sdk|@baidubce/sdk|@baidubce/client' },
      { key: 'baidu-access', pattern: 'AK|SK|AccessKeyId|SecretAccessKey' }
    ]
  },
  {
    id: 'wechat-api-security',
    name: '微信 API 安全检测',
    severity: 'High',
    description: '微信 API 使用中的潜在安全问题',
    recommendation: '确保微信 API 的使用符合安全最佳实践，特别是 AppID 和 AppSecret 的安全管理、微信支付的安全配置和用户信息的保护。',
    patterns: [
      { key: 'wechat-api', pattern: 'wechat|微信|@wechat|wx\.|weixin\.' },
      { key: 'wechat-sdk', pattern: 'wechat-sdk|wx-sdk|@wechat/sdk' },
      { key: 'wechat-access', pattern: 'appId|appSecret|wx\.config|wx\.ready' }
    ]
  },
  {
    id: 'alipay-api-security',
    name: '支付宝 API 安全检测',
    severity: 'High',
    description: '支付宝 API 使用中的潜在安全问题',
    recommendation: '确保支付宝 API 的使用符合安全最佳实践，特别是 APPID 和私钥的安全管理、支付签名的正确实现和交易数据的保护。',
    patterns: [
      { key: 'alipay-api', pattern: 'alipay|支付宝|@alipay' },
      { key: 'alipay-sdk', pattern: 'alipay-sdk|@alipay/sdk|@alipay/client' },
      { key: 'alipay-access', pattern: 'appId|privateKey|publicKey|appSecret' }
    ]
  },
  {
    id: 'amap-api-security',
    name: '高德地图 API 安全检测',
    severity: 'Medium',
    description: '高德地图 API 使用中的潜在安全问题',
    recommendation: '确保高德地图 API 的使用符合安全最佳实践，特别是 API Key 的安全管理和请求参数的验证。',
    patterns: [
      { key: 'amap-api', pattern: 'amap|高德地图|@amap' },
      { key: 'amap-sdk', pattern: 'amap-sdk|@amap/sdk|@amap/client' },
      { key: 'amap-access', pattern: 'key|ak|apiKey|appKey' }
    ]
  },
  {
    id: 'baidu-map-api-security',
    name: '百度地图 API 安全检测',
    severity: 'Medium',
    description: '百度地图 API 使用中的潜在安全问题',
    recommendation: '确保百度地图 API 的使用符合安全最佳实践，特别是 AK 和 SK 的安全管理和请求参数的验证。',
    patterns: [
      { key: 'baidu-map', pattern: 'baidu-map|百度地图|@baidu/map' },
      { key: 'baidu-map-sdk', pattern: 'baidu-map-sdk|@baidu/map-sdk|@baidu/map' },
      { key: 'baidu-map-access', pattern: 'ak|sk|apiKey|secretKey' }
    ]
  },
  {
    id: 'aliyun-oss-security',
    name: '阿里云 OSS 安全检测',
    severity: 'High',
    description: '阿里云 OSS 使用中的潜在安全问题',
    recommendation: '确保阿里云 OSS 的使用符合安全最佳实践，特别是访问密钥的安全管理、存储桶权限的正确配置和数据传输的加密。',
    patterns: [
      { key: 'aliyun-oss', pattern: 'oss|AliyunOSS|@alicloud/oss' },
      { key: 'oss-sdk', pattern: 'ali-oss|@alicloud/oss-sdk|oss-client' },
      { key: 'oss-access', pattern: 'accessKeyId|accessKeySecret|bucket|endpoint' }
    ]
  },
  {
    id: 'tencent-cos-security',
    name: '腾讯云 COS 安全检测',
    severity: 'High',
    description: '腾讯云 COS 使用中的潜在安全问题',
    recommendation: '确保腾讯云 COS 的使用符合安全最佳实践，特别是访问密钥的安全管理、存储桶权限的正确配置和数据传输的加密。',
    patterns: [
      { key: 'tencent-cos', pattern: 'cos|TencentCOS|@tencentcloud/cos' },
      { key: 'cos-sdk', pattern: 'cos-js-sdk|@tencentcloud/cos-sdk|cos-client' },
      { key: 'cos-access', pattern: 'SecretId|SecretKey|Bucket|Region' }
    ]
  },
  {
    id: 'huawei-obs-security',
    name: '华为云 OBS 安全检测',
    severity: 'High',
    description: '华为云 OBS 使用中的潜在安全问题',
    recommendation: '确保华为云 OBS 的使用符合安全最佳实践，特别是访问密钥的安全管理、存储桶权限的正确配置和数据传输的加密。',
    patterns: [
      { key: 'huawei-obs', pattern: 'obs|HuaweiOBS|@huaweicloud/obs' },
      { key: 'obs-sdk', pattern: 'obs-sdk|@huaweicloud/obs-sdk|obs-client' },
      { key: 'obs-access', pattern: 'AccessKeyId|SecretAccessKey|Bucket|Endpoint' }
    ]
  },
  {
    id: 'aliyun-sms-security',
    name: '阿里云短信 API 安全检测',
    severity: 'Medium',
    description: '阿里云短信 API 使用中的潜在安全问题',
    recommendation: '确保阿里云短信 API 的使用符合安全最佳实践，特别是 API 密钥的安全管理、短信内容的审核和发送频率的控制。',
    patterns: [
      { key: 'aliyun-sms', pattern: 'dysms|阿里云短信|@alicloud/dysms' },
      { key: 'sms-sdk', pattern: 'aliyun-dysms-sdk|@alicloud/dysms-sdk' },
      { key: 'sms-access', pattern: 'accessKeyId|accessKeySecret|SignName|TemplateCode' }
    ]
  },
  {
    id: 'tencent-sms-security',
    name: '腾讯云短信 API 安全检测',
    severity: 'Medium',
    description: '腾讯云短信 API 使用中的潜在安全问题',
    recommendation: '确保腾讯云短信 API 的使用符合安全最佳实践，特别是 API 密钥的安全管理、短信内容的审核和发送频率的控制。',
    patterns: [
      { key: 'tencent-sms', pattern: 'sms|腾讯云短信|@tencentcloud/sms' },
      { key: 'sms-sdk', pattern: 'tencentcloud-sms-sdk|@tencentcloud/sms-sdk' },
      { key: 'sms-access', pattern: 'SecretId|SecretKey|SmsSdkAppId|SignName' }
    ]
  },
  {
    id: 'aliyun-cdn-security',
    name: '阿里云 CDN 安全检测',
    severity: 'Medium',
    description: '阿里云 CDN 使用中的潜在安全问题',
    recommendation: '确保阿里云 CDN 的使用符合安全最佳实践，特别是访问控制的正确配置、HTTPS 的启用和缓存策略的安全设置。',
    patterns: [
      { key: 'aliyun-cdn', pattern: 'cdn|阿里云CDN|@alicloud/cdn' },
      { key: 'cdn-sdk', pattern: 'aliyun-cdn-sdk|@alicloud/cdn-sdk' },
      { key: 'cdn-config', pattern: 'CdnDomain|DomainName|HTTPS|Cache' }
    ]
  },
  {
    id: 'tencent-cdn-security',
    name: '腾讯云 CDN 安全检测',
    severity: 'Medium',
    description: '腾讯云 CDN 使用中的潜在安全问题',
    recommendation: '确保腾讯云 CDN 的使用符合安全最佳实践，特别是访问控制的正确配置、HTTPS 的启用和缓存策略的安全设置。',
    patterns: [
      { key: 'tencent-cdn', pattern: 'cdn|腾讯云CDN|@tencentcloud/cdn' },
      { key: 'cdn-sdk', pattern: 'tencentcloud-cdn-sdk|@tencentcloud/cdn-sdk' },
      { key: 'cdn-config', pattern: 'Domain|Https|Cache|Access' }
    ]
  },
  {
    id: 'aliyun-rds-security',
    name: '阿里云 RDS 安全检测',
    severity: 'High',
    description: '阿里云 RDS 使用中的潜在安全问题',
    recommendation: '确保阿里云 RDS 的使用符合安全最佳实践，特别是数据库密码的安全管理、访问白名单的正确配置和数据加密的启用。',
    patterns: [
      { key: 'aliyun-rds', pattern: 'rds|阿里云RDS|@alicloud/rds' },
      { key: 'rds-sdk', pattern: 'aliyun-rds-sdk|@alicloud/rds-sdk' },
      { key: 'rds-access', pattern: 'DBInstanceIdentifier|MasterUserPassword|SecurityIPs' }
    ]
  },
  {
    id: 'tencent-cdb-security',
    name: '腾讯云 CDB 安全检测',
    severity: 'High',
    description: '腾讯云 CDB 使用中的潜在安全问题',
    recommendation: '确保腾讯云 CDB 的使用符合安全最佳实践，特别是数据库密码的安全管理、访问白名单的正确配置和数据加密的启用。',
    patterns: [
      { key: 'tencent-cdb', pattern: 'cdb|腾讯云CDB|@tencentcloud/cdb' },
      { key: 'cdb-sdk', pattern: 'tencentcloud-cdb-sdk|@tencentcloud/cdb-sdk' },
      { key: 'cdb-access', pattern: 'InstanceId|Password|SecurityGroups|VpcId' }
    ]
  },
  {
    id: 'china-api-key-management',
    name: '国内 API 密钥管理安全检测',
    severity: 'Critical',
    description: '国内 API 密钥管理中的潜在安全问题',
    recommendation: '确保国内 API 密钥的管理符合安全最佳实践，特别是避免硬编码 API 密钥、使用环境变量或密钥管理服务存储密钥，以及定期轮换密钥。',
    patterns: [
      { key: 'hardcoded-key', pattern: 'accessKeyId\s*[:=]\s*[\'\"][^\'\"]*[\'\"]|accessKeySecret\s*[:=]\s*[\'\"][^\'\"]*[\'\"]' },
      { key: 'api-key', pattern: 'apiKey|appKey|appId|appSecret|SecretId|SecretKey|ak|sk' },
      { key: 'key-management', pattern: '环境变量|密钥管理|key vault|secrets manager' }
    ]
  },
  {
    id: 'china-api-permission-security',
    name: '国内 API 权限安全检测',
    severity: 'High',
    description: '国内 API 权限配置中的潜在安全问题',
    recommendation: '确保国内 API 的权限配置符合最小权限原则，只授予必要的权限，避免使用管理员权限或过于宽松的权限策略。',
    patterns: [
      { key: 'permission', pattern: '权限|permission|policy|role|角色' },
      { key: 'admin', pattern: 'admin|管理员|root|超级用户' },
      { key: 'policy', pattern: 'Policy|策略|权限策略|访问控制' }
    ]
  },
  {
    id: 'china-api-request-security',
    name: '国内 API 请求安全检测',
    severity: 'Medium',
    description: '国内 API 请求中的潜在安全问题',
    recommendation: '确保国内 API 请求的安全，特别是使用 HTTPS 协议、验证服务器证书、设置合理的超时时间和重试策略，以及避免在请求中包含敏感信息。',
    patterns: [
      { key: 'http-request', pattern: 'http:\/\/|axios\.get|axios\.post|fetch\s*\(' },
      { key: 'request-config', pattern: 'timeout|retry|headers|auth' },
      { key: 'sensitive-data', pattern: 'password|token|secret|key' }
    ]
  }
];

module.exports = chinaApiSecurityRules;