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
  },
  {
    id: 'gb-22239-compliance',
    name: 'GB/T 22239 信息安全技术 网络安全等级保护基本要求',
    severity: 'Critical',
    description: '未符合GB/T 22239网络安全等级保护基本要求',
    recommendation: '按照GB/T 22239标准要求实施网络安全等级保护，包括安全通用要求和安全扩展要求，覆盖安全物理环境、安全通信网络、安全区域边界、安全计算环境、安全管理中心等方面。',
    patterns: [
      { key: 'gb22239', pattern: 'GB/T 22239|等级保护基本要求|网络安全等级保护基本要求' },
      { key: 'level-protection-basic', pattern: '等级保护基本|等保基本|level protection basic' }
    ]
  },
  {
    id: 'gb-25069-compliance',
    name: 'GB/T 25069 信息安全技术 术语',
    severity: 'Low',
    description: '未使用符合GB/T 25069标准的术语',
    recommendation: '按照GB/T 25069标准要求使用信息安全技术术语，确保术语使用的规范性和一致性。',
    patterns: [
      { key: 'gb25069', pattern: 'GB/T 25069|信息安全术语|security terminology' },
      { key: 'terminology', pattern: '术语|terminology|glossary' }
    ]
  },
  {
    id: 'gb-30276-compliance',
    name: 'GB/T 30276 信息安全技术 网络安全等级保护安全设计技术要求',
    severity: 'High',
    description: '未符合GB/T 30276网络安全等级保护安全设计技术要求',
    recommendation: '按照GB/T 30276标准要求进行网络安全等级保护的安全设计，包括安全需求分析、安全架构设计、安全功能设计、安全配置设计等方面。',
    patterns: [
      { key: 'gb30276', pattern: 'GB/T 30276|安全设计技术要求|security design requirements' },
      { key: 'security-design', pattern: '安全设计|security design|secure design' }
    ]
  },
  {
    id: 'gb-35274-compliance',
    name: 'GB/T 35274 信息安全技术 大数据服务安全能力要求',
    severity: 'High',
    description: '未符合GB/T 35274大数据服务安全能力要求',
    recommendation: '按照GB/T 35274标准要求实施大数据服务安全措施，包括数据采集安全、数据存储安全、数据处理安全、数据交换安全、数据销毁安全等方面。',
    patterns: [
      { key: 'gb35274', pattern: 'GB/T 35274|大数据服务安全|big data security' },
      { key: 'big-data', pattern: '大数据|big data|data analytics|数据分析' }
    ]
  },
  {
    id: 'gb-39786-compliance',
    name: 'GB/T 39786 信息安全技术 信息系统密码应用基本要求',
    severity: 'High',
    description: '未符合GB/T 39786信息系统密码应用基本要求',
    recommendation: '按照GB/T 39786标准要求实施信息系统密码应用，包括密码应用架构、密码算法、密码协议、密钥管理、密码应用安全等方面。',
    patterns: [
      { key: 'gb39786', pattern: 'GB/T 39786|密码应用基本要求|cryptography application' },
      { key: 'crypto-application', pattern: '密码应用|cryptography application|crypto implementation' }
    ]
  },
  {
    id: 'gb-37988-compliance',
    name: 'GB/T 37988 信息安全技术 数据安全能力成熟度模型',
    severity: 'Medium',
    description: '未符合GB/T 37988数据安全能力成熟度模型要求',
    recommendation: '按照GB/T 37988标准要求建立数据安全能力成熟度模型，评估和提升数据安全能力水平。',
    patterns: [
      { key: 'gb37988', pattern: 'GB/T 37988|数据安全能力成熟度|DSMM' },
      { key: 'maturity-model', pattern: '成熟度模型|maturity model|capability maturity' }
    ]
  },
  {
    id: 'gb-25070-compliance',
    name: 'GB/T 25070 信息安全技术 网络安全等级保护安全设计技术要求',
    severity: 'High',
    description: '未符合GB/T 25070网络安全等级保护安全设计技术要求',
    recommendation: '按照GB/T 25070标准要求进行网络安全等级保护的安全设计，包括安全架构设计、安全功能设计、安全配置设计等方面。',
    patterns: [
      { key: 'gb25070', pattern: 'GB/T 25070|安全设计技术|security design' },
      { key: 'design-requirements', pattern: '设计要求|design requirements|security architecture' }
    ]
  },
  {
    id: 'gb-39786-encryption-compliance',
    name: '加密算法合规要求',
    severity: 'High',
    description: '使用的加密算法不符合国家密码管理要求',
    recommendation: '使用国家密码管理部门批准的加密算法，如SM2、SM3、SM4、SM9等国产密码算法，避免使用已被禁止的弱加密算法。',
    patterns: [
      { key: 'weak-encryption', pattern: 'DES|RC4|MD5|SHA1|weak encryption' },
      { key: 'encryption-algorithm', pattern: '加密算法|encryption algorithm|cipher|crypto' }
    ]
  },
  {
    id: 'china-cloud-service-compliance',
    name: '中国云服务安全合规要求',
    severity: 'High',
    description: '未符合中国云服务安全合规要求',
    recommendation: '使用通过云计算服务安全评估的云服务商，确保云服务符合中国网络安全等级保护要求和数据本地化要求。',
    patterns: [
      { key: 'cloud-compliance', pattern: '云服务合规|cloud service compliance|云安全评估' },
      { key: 'cloud-security', pattern: '云安全|cloud security|云平台安全' }
    ]
  }
];

module.exports = chinaSecurityRules;