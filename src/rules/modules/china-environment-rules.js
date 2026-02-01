const chinaEnvironmentRules = [
  {
    id: 'china-development-environment',
    name: '国产化开发环境适配',
    severity: 'Medium',
    description: '未适配国产化开发环境',
    recommendation: '优化代码以适配国产化开发环境，包括支持国产操作系统（如统信UOS、麒麟OS等）、国产浏览器（如360浏览器、搜狗浏览器等）和国产开发工具。',
    patterns: [
      { key: 'china-os', pattern: 'UOS|统信|麒麟|Kylin|红旗|Red Flag' },
      { key: 'china-browser', pattern: '360浏览器|搜狗浏览器|百度浏览器|QQ浏览器|UC浏览器' },
      { key: 'china-devtools', pattern: '国产开发工具|国产化IDE|东方通|中创|金蝶' }
    ]
  },
  {
    id: 'china-deployment-environment',
    name: '国产化部署环境适配',
    severity: 'High',
    description: '未适配国产化部署环境',
    recommendation: '优化代码以适配国产化部署环境，包括支持国产服务器（如浪潮、曙光等）、国产数据库（如达梦、人大金仓、神通等）和国产中间件（如东方通TongWeb、中创InforSuite等）。',
    patterns: [
      { key: 'china-server', pattern: '浪潮|曙光|联想|华为服务器|国产服务器' },
      { key: 'china-database', pattern: '达梦|DM|人大金仓|Kingbase|神通|OSCAR|南大通用|GBase' },
      { key: 'china-middleware', pattern: '东方通|TongWeb|中创|InforSuite|金蝶|Apusic|华为云|阿里云' }
    ]
  },
  {
    id: 'china-network-environment',
    name: '中国网络环境适配',
    severity: 'Medium',
    description: '未适配中国网络环境',
    recommendation: '优化代码以适配中国网络环境，包括处理网络延迟、支持国内CDN、避免依赖国外服务等。',
    patterns: [
      { key: 'china-cdn', pattern: '阿里云CDN|腾讯云CDN|百度云加速|网宿科技|蓝汛' },
      { key: 'foreign-service', pattern: 'googleapis\.com|github\.io|aws\.com|azure\.com|cloudflare\.com' },
      { key: 'network-adapter', pattern: '网络适配|网络优化|延迟处理' }
    ]
  },
  {
    id: 'china-certification',
    name: '国产化认证要求',
    severity: 'High',
    description: '未满足国产化认证要求',
    recommendation: '确保产品满足国产化认证要求，包括软件产品登记证书、软件著作权登记证书等。',
    patterns: [
      { key: 'china-cert', pattern: '软件产品登记|软件著作权|国产化认证|自主可控' },
      { key: 'copyright', pattern: '著作权|版权|copyright' },
      { key: 'certificate', pattern: '证书|certificate|license' }
    ]
  },
  {
    id: 'china-data-center',
    name: '国内数据中心部署',
    severity: 'High',
    description: '未在国内数据中心部署',
    recommendation: '确保服务在国内数据中心部署，满足数据本地化要求，遵守中国法律法规。',
    patterns: [
      { key: 'china-datacenter', pattern: '阿里云|腾讯云|华为云|百度云|京东云|天翼云|移动云|联通云' },
      { key: 'data-localization', pattern: '数据本地化|本地部署|国内部署' },
      { key: 'foreign-datacenter', pattern: 'AWS|Azure|GCP|Google Cloud|Oracle Cloud|IBM Cloud' }
    ]
  },
  {
    id: 'china-compliance-report',
    name: '国内合规性报告',
    severity: 'Medium',
    description: '缺少符合国内法规要求的合规性报告',
    recommendation: '生成符合国内法规要求的合规性报告，包括网络安全等级保护测评报告、软件产品测试报告等。',
    patterns: [
      { key: 'compliance-report', pattern: '合规性报告|测评报告|测试报告|security report|audit report' },
      { key: '等级保护', pattern: '等级保护|等保测评|等保备案' },
      { key: 'software-test', pattern: '软件测试|产品测试|功能测试|安全测试' }
    ]
  },
  {
    id: 'china-threat-intelligence',
    name: '国内威胁情报整合',
    severity: 'Medium',
    description: '未整合国内威胁情报',
    recommendation: '接入国内安全威胁情报源，及时更新漏洞库，应对国内特定的安全威胁。',
    patterns: [
      { key: 'threat-intel', pattern: '威胁情报|安全情报|漏洞库|vulnerability database' },
      { key: 'china-cert', pattern: '国家CERT|CNCERT|中国信息安全测评中心|安全漏洞' },
      { key: 'vulnerability', pattern: '漏洞|vulnerability|exploit' }
    ]
  },
  {
    id: 'china-regulatory-compliance',
    name: '国内法规合规',
    severity: 'High',
    description: '未符合国内法规要求',
    recommendation: '确保产品符合国内法规要求，包括《网络安全法》、《数据安全法》、《个人信息保护法》等。',
    patterns: [
      { key: 'china-law', pattern: '网络安全法|数据安全法|个人信息保护法|密码法' },
      { key: 'regulatory', pattern: '法规|regulation|compliance|合规' },
      { key: 'security-law', pattern: 'Security Law|Data Security Law|Personal Information Protection Law' }
    ]
  },
  {
    id: 'china-standard-compliance',
    name: '国内标准合规',
    severity: 'Medium',
    description: '未符合国内标准要求',
    recommendation: '确保产品符合国内标准要求，包括GB/T系列标准、行业标准等。',
    patterns: [
      { key: 'china-standard', pattern: 'GB/T|国家标准|行业标准|China Standard' },
      { key: 'standard-compliance', pattern: '标准合规|标准要求|standard compliance' },
      { key: 'industry-standard', pattern: '行业标准|sector standard|专业标准' }
    ]
  },
  {
    id: 'china-privacy-protection',
    name: '国内隐私保护要求',
    severity: 'High',
    description: '未满足国内隐私保护要求',
    recommendation: '确保产品满足国内隐私保护要求，包括《个人信息保护法》、《数据安全法》等相关法规要求。',
    patterns: [
      { key: 'china-privacy', pattern: '个人信息保护|数据安全|隐私政策|隐私协议' },
      { key: 'privacy-law', pattern: 'Personal Information Protection Law|Data Security Law' },
      { key: 'privacy-policy', pattern: 'privacy policy|隐私政策|隐私声明' }
    ]
  }
];

module.exports = chinaEnvironmentRules;