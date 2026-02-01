const chinaSecurityRules = [
  {
    id: 'gb-28448-compliance',
    name: 'GB/T 28448 信息安全技术 网络安全等级保护测评要求',
    severity: 'Critical',
    description: '未符合GB/T 28448网络安全等级保护测评要求',
    recommendation: '按照GB/T 28448标准要求实施网络安全等级保护，包括安全物理环境、安全通信网络、安全区域边界、安全计算环境和安全管理中心等五个方面。',
    patterns: [
      { key: 'gb28448', pattern: 'GB/T 28448|等级保护|等保测评' },
      { key: 'network-security', pattern: '网络安全|信息安全|security|cybersecurity' }
    ]
  },
  {
    id: 'gb-31168-compliance',
    name: 'GB/T 31168 信息安全技术 云计算服务安全能力要求',
    severity: 'High',
    description: '未符合GB/T 31168云计算服务安全能力要求',
    recommendation: '按照GB/T 31168标准要求实施云计算服务安全措施，包括系统开发与供应链安全、系统与通信保护、访问控制、配置管理、维护等方面。',
    patterns: [
      { key: 'gb31168', pattern: 'GB/T 31168|云计算安全|云服务安全' },
      { key: 'cloud', pattern: 'cloud|云计算|云服务|云平台' }
    ]
  },
  {
    id: 'gb-35273-compliance',
    name: 'GB/T 35273 信息安全技术 个人信息安全规范',
    severity: 'High',
    description: '未符合GB/T 35273个人信息安全规范要求',
    recommendation: '按照GB/T 35273标准要求实施个人信息保护措施，包括收集、存储、使用、共享、转让、公开披露等个人信息处理活动的安全要求。',
    patterns: [
      { key: 'gb35273', pattern: 'GB/T 35273|个人信息安全|个人信息保护' },
      { key: 'personal-data', pattern: '个人信息|个人数据|隐私|privacy' }
    ]
  },
  {
    id: 'gb-50174-compliance',
    name: 'GB 50174 电子信息系统机房设计规范',
    severity: 'Medium',
    description: '未符合GB 50174电子信息系统机房设计规范要求',
    recommendation: '按照GB 50174标准要求设计和建设电子信息系统机房，包括机房位置选择、环境要求、建筑与结构、空气调节、电气技术、电磁屏蔽、安全防范等方面。',
    patterns: [
      { key: 'gb50174', pattern: 'GB 50174|机房设计|数据中心' },
      { key: 'facility', pattern: '机房|数据中心|server room|data center' }
    ]
  },
  {
    id: 'cyber-security-level-protection',
    name: '网络安全等级保护制度要求',
    severity: 'Critical',
    description: '未符合网络安全等级保护制度要求',
    recommendation: '按照网络安全等级保护制度要求，根据信息系统的重要程度和安全风险，实施相应等级的安全保护措施，包括安全技术措施和安全管理措施。',
    patterns: [
      { key: 'level-protection', pattern: '等级保护|等保|网络安全等级|security level' },
      { key: 'compliance', pattern: '合规|要求|标准|regulation|compliance' }
    ]
  },
  {
    id: 'china-specific-network-requirements',
    name: '中国特定网络环境安全要求',
    severity: 'High',
    description: '未考虑中国特定网络环境的安全要求',
    recommendation: '考虑中国特定网络环境的安全要求，包括网络访问控制、数据本地化、网络安全审查等方面的要求。',
    patterns: [
      { key: 'china-network', pattern: '中国网络|国内网络|local network|domestic network' },
      { key: 'network-requirements', pattern: '网络要求|网络环境|network environment|network requirements' }
    ]
  },
  {
    id: 'data-localization-compliance',
    name: '数据本地化合规要求',
    severity: 'High',
    description: '未符合数据本地化合规要求',
    recommendation: '按照中国法律法规要求，实施数据本地化措施，确保敏感数据存储在中国境内，并采取适当的安全保护措施。',
    patterns: [
      { key: 'data-localization', pattern: '数据本地化|本地存储|local storage|data localization' },
      { key: 'data-storage', pattern: '数据存储|存储位置|storage location|data storage' }
    ]
  },
  {
    id: 'network-security-review-compliance',
    name: '网络安全审查合规要求',
    severity: 'Critical',
    description: '未符合网络安全审查合规要求',
    recommendation: '按照网络安全审查制度要求，对于影响或可能影响国家安全的网络产品和服务，应当进行网络安全审查。',
    patterns: [
      { key: 'security-review', pattern: '网络安全审查|安全审查|security review|cybersecurity review' },
      { key: 'national-security', pattern: '国家安全|national security|state security' }
    ]
  },
  {
    id: 'critical-information-infrastructure-protection',
    name: '关键信息基础设施保护要求',
    severity: 'Critical',
    description: '未符合关键信息基础设施保护要求',
    recommendation: '按照关键信息基础设施保护要求，对能源、交通、水利、金融、公共服务、电子政务等重要行业和领域的关键信息基础设施实施重点保护。',
    patterns: [
      { key: 'critical-infrastructure', pattern: '关键信息基础设施|关基保护|critical infrastructure|CII' },
      { key: 'infrastructure', pattern: '基础设施|infrastructure|essential services' }
    ]
  },
  {
    id: 'cryptography-compliance',
    name: '密码法合规要求',
    severity: 'High',
    description: '未符合密码法合规要求',
    recommendation: '按照《中华人民共和国密码法》要求，使用国家密码管理部门批准的密码算法和密码产品，确保信息系统的安全。',
    patterns: [
      { key: 'cryptography-law', pattern: '密码法|商用密码|cryptography law|commercial cryptography' },
      { key: 'encryption', pattern: '加密|encryption|cryptography|密码' }
    ]
  }
];

module.exports = chinaSecurityRules;