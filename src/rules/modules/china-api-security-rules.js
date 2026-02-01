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
  },
  {
    id: 'qiniu-cloud-api-security',
    name: '七牛云 API 安全检测',
    severity: 'High',
    description: '七牛云 API 使用中的潜在安全问题',
    recommendation: '确保七牛云 API 的使用符合安全最佳实践，特别是 API 密钥的安全管理、请求签名的正确实现和权限的最小化配置。',
    patterns: [
      { key: 'qiniu-cloud', pattern: 'qiniu|七牛云|@qiniu' },
      { key: 'qiniu-sdk', pattern: 'qiniu-sdk|@qiniu/sdk|@qiniu/client' },
      { key: 'qiniu-access', pattern: 'accessKey|secretKey|bucket|domain' }
    ]
  },
  {
    id: 'upyun-cloud-api-security',
    name: '又拍云 API 安全检测',
    severity: 'High',
    description: '又拍云 API 使用中的潜在安全问题',
    recommendation: '确保又拍云 API 的使用符合安全最佳实践，特别是 API 密钥的安全管理、请求签名的正确实现和权限的最小化配置。',
    patterns: [
      { key: 'upyun-cloud', pattern: 'upyun|又拍云|@upyun' },
      { key: 'upyun-sdk', pattern: 'upyun-sdk|@upyun/sdk|@upyun/client' },
      { key: 'upyun-access', pattern: 'bucket|operator|password|api-key' }
    ]
  },
  {
    id: 'kingsoft-cloud-api-security',
    name: '金山云 API 安全检测',
    severity: 'High',
    description: '金山云 API 使用中的潜在安全问题',
    recommendation: '确保金山云 API 的使用符合安全最佳实践，特别是 API 密钥的安全管理、请求签名的正确实现和权限的最小化配置。',
    patterns: [
      { key: 'kingsoft-cloud', pattern: 'ksyun|金山云|@ksyun' },
      { key: 'kingsoft-sdk', pattern: 'ksyun-sdk|@ksyun/sdk|@ksyun/client' },
      { key: 'kingsoft-access', pattern: 'accessKeyId|secretAccessKey|region' }
    ]
  },
  {
    id: 'qingcloud-api-security',
    name: '青云 API 安全检测',
    severity: 'High',
    description: '青云 API 使用中的潜在安全问题',
    recommendation: '确保青云 API 的使用符合安全最佳实践，特别是 API 密钥的安全管理、请求签名的正确实现和权限的最小化配置。',
    patterns: [
      { key: 'qingcloud', pattern: 'qingcloud|青云|@qingcloud' },
      { key: 'qingcloud-sdk', pattern: 'qingcloud-sdk|@qingcloud/sdk|@qingcloud/client' },
      { key: 'qingcloud-access', pattern: 'access_key_id|secret_access_key|zone' }
    ]
  },
  {
    id: 'ucloud-api-security',
    name: 'UCloud API 安全检测',
    severity: 'High',
    description: 'UCloud API 使用中的潜在安全问题',
    recommendation: '确保UCloud API 的使用符合安全最佳实践，特别是 API 密钥的安全管理、请求签名的正确实现和权限的最小化配置。',
    patterns: [
      { key: 'ucloud', pattern: 'ucloud|UCloud|@ucloud' },
      { key: 'ucloud-sdk', pattern: 'ucloud-sdk|@ucloud/sdk|@ucloud/client' },
      { key: 'ucloud-access', pattern: 'PublicKey|PrivateKey|ProjectId|Region' }
    ]
  },
  {
    id: 'meituan-cloud-api-security',
    name: '美团云 API 安全检测',
    severity: 'High',
    description: '美团云 API 使用中的潜在安全问题',
    recommendation: '确保美团云 API 的使用符合安全最佳实践，特别是 API 密钥的安全管理、请求签名的正确实现和权限的最小化配置。',
    patterns: [
      { key: 'meituan-cloud', pattern: 'meituan|美团云|@meituan' },
      { key: 'meituan-sdk', pattern: 'meituan-sdk|@meituan/sdk|@meituan/client' },
      { key: 'meituan-access', pattern: 'appKey|appSecret|accessToken' }
    ]
  },
  {
    id: 'jdcloud-api-security',
    name: '京东云 API 安全检测',
    severity: 'High',
    description: '京东云 API 使用中的潜在安全问题',
    recommendation: '确保京东云 API 的使用符合安全最佳实践，特别是 API 密钥的安全管理、请求签名的正确实现和权限的最小化配置。',
    patterns: [
      { key: 'jdcloud', pattern: 'jdcloud|京东云|@jdcloud' },
      { key: 'jdcloud-sdk', pattern: 'jdcloud-sdk|@jdcloud/sdk|@jdcloud/client' },
      { key: 'jdcloud-access', pattern: 'accessKeyId|secretAccessKey|regionId' }
    ]
  },
  {
    id: 'volcengine-api-security',
    name: '火山引擎 API 安全检测',
    severity: 'High',
    description: '火山引擎 API 使用中的潜在安全问题',
    recommendation: '确保火山引擎 API 的使用符合安全最佳实践，特别是 API 密钥的安全管理、请求签名的正确实现和权限的最小化配置。',
    patterns: [
      { key: 'volcengine', pattern: 'volcengine|火山引擎|@volcengine' },
      { key: 'volcengine-sdk', pattern: 'volcengine-sdk|@volcengine/sdk|@volcengine/client' },
      { key: 'volcengine-access', pattern: 'AccessKeyId|SecretAccessKey|Region' }
    ]
  },
  {
    id: 'netease-cloud-api-security',
    name: '网易云 API 安全检测',
    severity: 'High',
    description: '网易云 API 使用中的潜在安全问题',
    recommendation: '确保网易云 API 的使用符合安全最佳实践，特别是 API 密钥的安全管理、请求签名的正确实现和权限的最小化配置。',
    patterns: [
      { key: 'netease-cloud', pattern: 'netease|网易云|@netease' },
      { key: 'netease-sdk', pattern: 'netease-sdk|@netease/sdk|@netease/client' },
      { key: 'netease-access', pattern: 'appKey|appSecret|accessToken' }
    ]
  },
  {
    id: 'sina-cloud-api-security',
    name: '新浪云 API 安全检测',
    severity: 'High',
    description: '新浪云 API 使用中的潜在安全问题',
    recommendation: '确保新浪云 API 的使用符合安全最佳实践，特别是 API 密钥的安全管理、请求签名的正确实现和权限的最小化配置。',
    patterns: [
      { key: 'sina-cloud', pattern: 'sina|新浪云|@sina' },
      { key: 'sina-sdk', pattern: 'sina-sdk|@sina/sdk|@sina/client' },
      { key: 'sina-access', pattern: 'accessKey|secretKey|appKey|appSecret' }
    ]
  },
  {
    id: 'baidu-ai-api-security',
    name: '百度 AI API 安全检测',
    severity: 'High',
    description: '百度 AI API 使用中的潜在安全问题',
    recommendation: '确保百度 AI API 的使用符合安全最佳实践，特别是 API 密钥的安全管理、请求签名的正确实现和权限的最小化配置。',
    patterns: [
      { key: 'baidu-ai', pattern: 'baidu-ai|百度AI|@baidu/ai' },
      { key: 'baidu-ai-sdk', pattern: 'baidu-aip-sdk|@baidu/aip-sdk' },
      { key: 'baidu-ai-access', pattern: 'APP_ID|API_KEY|SECRET_KEY' }
    ]
  },
  {
    id: 'tencent-ai-api-security',
    name: '腾讯 AI API 安全检测',
    severity: 'High',
    description: '腾讯 AI API 使用中的潜在安全问题',
    recommendation: '确保腾讯 AI API 的使用符合安全最佳实践，特别是 API 密钥的安全管理、请求签名的正确实现和权限的最小化配置。',
    patterns: [
      { key: 'tencent-ai', pattern: 'tencent-ai|腾讯AI|@tencentcloud/ai' },
      { key: 'tencent-ai-sdk', pattern: 'tencentcloud-ai-sdk|@tencentcloud/ai-sdk' },
      { key: 'tencent-ai-access', pattern: 'SecretId|SecretKey|Region' }
    ]
  },
  {
    id: 'aliyun-ai-api-security',
    name: '阿里云 AI API 安全检测',
    severity: 'High',
    description: '阿里云 AI API 使用中的潜在安全问题',
    recommendation: '确保阿里云 AI API 的使用符合安全最佳实践，特别是 API 密钥的安全管理、请求签名的正确实现和权限的最小化配置。',
    patterns: [
      { key: 'aliyun-ai', pattern: 'aliyun-ai|阿里云AI|@alicloud/ai' },
      { key: 'aliyun-ai-sdk', pattern: 'aliyun-ai-sdk|@alicloud/ai-sdk' },
      { key: 'aliyun-ai-access', pattern: 'accessKeyId|accessKeySecret|Region' }
    ]
  },
  {
    id: 'qcloud-iot-api-security',
    name: '腾讯云 IoT API 安全检测',
    severity: 'High',
    description: '腾讯云 IoT API 使用中的潜在安全问题',
    recommendation: '确保腾讯云 IoT API 的使用符合安全最佳实践，特别是 API 密钥的安全管理、设备认证的正确实现和权限的最小化配置。',
    patterns: [
      { key: 'tencent-iot', pattern: 'tencent-iot|腾讯云IoT|@tencentcloud/iot' },
      { key: 'tencent-iot-sdk', pattern: 'tencentcloud-iot-sdk|@tencentcloud/iot-sdk' },
      { key: 'tencent-iot-access', pattern: 'ProductId|DeviceName|DeviceSecret|SecretId|SecretKey' }
    ]
  },
  {
    id: 'aliyun-iot-api-security',
    name: '阿里云 IoT API 安全检测',
    severity: 'High',
    description: '阿里云 IoT API 使用中的潜在安全问题',
    recommendation: '确保阿里云 IoT API 的使用符合安全最佳实践，特别是 API 密钥的安全管理、设备认证的正确实现和权限的最小化配置。',
    patterns: [
      { key: 'aliyun-iot', pattern: 'aliyun-iot|阿里云IoT|@alicloud/iot' },
      { key: 'aliyun-iot-sdk', pattern: 'aliyun-iot-sdk|@alicloud/iot-sdk' },
      { key: 'aliyun-iot-access', pattern: 'ProductKey|DeviceName|DeviceSecret|accessKeyId|accessKeySecret' }
    ]
  }
];

module.exports = chinaApiSecurityRules;