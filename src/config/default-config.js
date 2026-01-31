// config/default-config.js
// 默认配置文件

const defaultConfig = {
  // 扫描选项
  scan: {
    // 要扫描的文件类型
    fileTypes: ['.vue', '.js', '.jsx', '.ts', '.tsx', '.json'],
    
    // 要忽略的目录
    ignoreDirs: [
      'node_modules',
      'dist',
      'build',
      '.git',
      'coverage',
      'public',
      '.next',
      '.nuxt'
    ],
    
    // 要忽略的文件模式
    ignorePatterns: [
      '**/*.min.js',
      '**/vendor/**',
      '**/lib/**'
    ],
    
    // 扫描深度限制
    maxDepth: 10,
    
    // 文件大小限制（MB）
    maxSize: 10
  },
  
  // 规则配置
  rules: {
    // XSS相关规则
    xss: {
      enabled: true,
      severity: 'high',
      options: {
        checkVHtml: true,
        checkTemplateInterpolation: true,
        checkEventHandlers: true
      }
    },
    
    // 依赖安全规则
    dependencies: {
      enabled: true,
      severity: 'high',
      options: {
        checkKnownVulnerabilities: true,
        checkDeprecated: true,
        checkOutdated: true,
        checkSecurityAdvisories: true
      }
    },
    
    // 敏感信息规则
    secrets: {
      enabled: true,
      severity: 'high',
      options: {
        patterns: [
          /password\s*[:=]\s*['"`][^'"`]+['"`]/gi,
          /secret\s*[:=]\s*['"`][^'"`]+['"`]/gi,
          /token\s*[:=]\s*['"`][^'"`]+['"`]/gi,
          /api[_-]?key\s*[:=]\s*['"`][^'"`]+['"`]/gi,
          /private[_-]?key\s*[:=]\s*['"`][^'"`]+['"`]/gi,
          /auth[_-]?token\s*[:=]\s*['"`][^'"`]+['"`]/gi,
          /access[_-]?token\s*[:=]\s*['"`][^'"`]+['"`]/gi,
          /client[_-]?secret\s*[:=]\s*['"`][^'"`]+['"`]/gi
        ]
      }
    },
    
    // 代码安全规则
    codeSecurity: {
      enabled: true,
      severity: 'high',
      options: {
        checkEvalUsage: true,
        checkPrototypePollution: true,
        checkDynamicImports: true,
        checkRouteParams: true
      }
    },
    
    // 配置安全规则
    configSecurity: {
      enabled: true,
      severity: 'medium',
      options: {
        checkCorsSettings: true,
        checkVueConfigs: true
      }
    }
  },
  
  // 输出选项
  output: {
    format: 'text', // text, json, html
    showProgress: true,
    showDetails: true,
    maxIssuesToShow: 100,
    advancedReport: false, // 启用高级报告（趋势分析、合规性报告）
    reportPath: 'security-report.json'
  },
  
  // 性能选项
  performance: {
    maxConcurrentFiles: 10,
    timeout: 30000, // 30秒超时
    enableSemanticAnalysis: true, // 启用AST语义分析
    enableNpmAudit: true, // 启用npm audit
    enableVulnerabilityDB: true, // 启用漏洞数据库
    
    // 规则优化配置
    ruleOptimization: {
      enabled: true, // 启用规则优化
      enableQuickCheck: true, // 启用快速检查
      enableRuleFiltering: true, // 启用规则过滤
      enableParallelMatching: false, // 启用并行匹配（实验性）
      maxWorkers: 4, // 最大worker数量
      priorityThreshold: 2, // 优先级阈值（0-4），只运行优先级>=阈值的规则
      maxRulesPerFile: 100, // 每个文件最大规则数
      maxVulnerabilitiesPerFile: 50, // 每个文件最大漏洞数
      cacheEnabled: true, // 启用缓存
      cacheSize: 1000 // 缓存大小
    }
  },
  
  // 报告历史配置
  reportHistory: {
    enabled: true,
    path: '.vue-security-reports',
    maxSize: 100
  },
  
  // 合规性检查配置
  compliance: {
    enabled: true,
    standards: ['OWASP', 'GDPR', 'HIPAA', 'PCI-DSS', 'SOX']
  },
  
  // DAST配置
  dast: {
    enabled: false, // 默认禁用DAST扫描
    baseUrl: 'http://localhost:3000',
    timeout: 30000,
    maxRequests: 1000,
    concurrency: 5,
    scanDepth: 2,
    auth: {},
    headers: {},
    options: {
      testApi: true
    }
  }
};

module.exports = defaultConfig;