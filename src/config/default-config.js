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
    profile: 'balanced', // 性能配置文件：fast, balanced, thorough
    maxConcurrentFiles: 10,
    timeout: 30000, // 30秒超时
    enableSemanticAnalysis: true, // 启用AST语义分析
    enableNpmAudit: true, // 启用npm audit
    enableVulnerabilityDB: true, // 启用漏洞数据库
    memoryLimit: 256, // 内存使用限制（MB）
    batchSize: 10, // 批处理大小
    gcInterval: 10, // 垃圾回收间隔（文件数）
    
    // 性能配置文件
    profiles: {
      fast: {
        memoryLimit: 128,
        batchSize: 20,
        ruleOptimization: {
          priorityThreshold: 3, // 只运行高优先级规则
          maxRulesPerFile: 50,
          maxVulnerabilitiesPerFile: 30
        },
        incrementalScan: {
          enabled: true
        }
      },
      balanced: {
        memoryLimit: 256,
        batchSize: 10,
        ruleOptimization: {
          priorityThreshold: 2,
          maxRulesPerFile: 100,
          maxVulnerabilitiesPerFile: 50
        },
        incrementalScan: {
          enabled: false
        }
      },
      thorough: {
        memoryLimit: 512,
        batchSize: 5,
        ruleOptimization: {
          priorityThreshold: 1, // 运行所有规则
          maxRulesPerFile: 200,
          maxVulnerabilitiesPerFile: 100
        },
        incrementalScan: {
          enabled: false
        }
      }
    },
    
    // 规则优化配置
    ruleOptimization: {
      enabled: true, // 启用规则优化
      enableQuickCheck: true, // 启用快速检查
      enableRuleFiltering: true, // 启用规则过滤
      enableParallelMatching: true, // 启用并行匹配（实验性）
      maxWorkers: 'auto', // 最大worker数量 ('auto' 表示根据CPU核心数自动调整)
      priorityThreshold: 2, // 优先级阈值（0-4），只运行优先级>=阈值的规则
      maxRulesPerFile: 100, // 每个文件最大规则数
      maxVulnerabilitiesPerFile: 50, // 每个文件最大漏洞数
      cacheEnabled: true, // 启用缓存
      cacheSize: 1000 // 缓存大小
    },
    
    // 增量扫描配置
    incrementalScan: {
      enabled: false, // 启用增量扫描
      cacheFile: '.vue-security-cache.json' // 缓存文件路径
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