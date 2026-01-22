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
    maxIssuesToShow: 100
  },
  
  // 性能选项
  performance: {
    maxConcurrentFiles: 10,
    timeout: 30000 // 30秒超时
  }
};

module.exports = defaultConfig;