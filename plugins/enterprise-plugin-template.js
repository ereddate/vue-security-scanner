/**
 * Vue Security Scanner - 企业级插件开发模板
 * 
 * 此模板展示了如何创建符合企业级标准的安全检测插件
 * 包含最佳实践、错误处理和性能优化建议
 */

class EnterpriseSecurityPluginTemplate {
  constructor(options = {}) {
    // 插件元数据
    this.name = options.name || 'Enterprise Security Plugin';
    this.description = options.description || 'Custom security checks for enterprise requirements';
    this.version = options.version || '1.0.0';
    this.author = options.author || 'Enterprise Security Team';
    this.license = options.license || 'UNLICENSED';
    
    // 安全配置
    this.severity = options.severity || 'High'; // High, Medium, Low
    this.category = options.category || 'Custom Security'; // XSS, Injection, Misconfiguration, etc.
    this.cweId = options.cweId || []; // CWE标识符数组
    
    // 性能配置
    this.timeout = options.timeout || 5000; // 插件执行超时时间(ms)
    this.maxFileSize = options.maxFileSize || 10 * 1024 * 1024; // 最大处理文件大小(bytes)
    
    // 企业特定配置
    this.enterpriseRules = options.enterpriseRules || [];
    this.complianceStandards = options.complianceStandards || ['OWASP', 'PCI-DSS']; // 遵循的标准
  }

  /**
   * 核心分析方法 - 执行安全检测
   * @param {string} filePath - 被扫描的文件路径
   * @param {string} content - 文件内容
   * @returns {Promise<Array>} - 检测到的安全漏洞数组
   */
  async analyze(filePath, content) {
    // 性能检查：跳过过大文件
    if (content.length > this.maxFileSize) {
      console.warn(`Skipping large file for plugin ${this.name}: ${filePath}`);
      return [];
    }

    // 类型检查：只处理相关文件
    if (!this.isRelevantFile(filePath)) {
      return [];
    }

    const vulnerabilities = [];
    
    try {
      // 执行具体的检测逻辑
      const detectedIssues = await this.performSecurityChecks(filePath, content);
      vulnerabilities.push(...detectedIssues);
      
      // 执行企业特定规则
      const enterpriseIssues = await this.checkEnterpriseRules(filePath, content);
      vulnerabilities.push(...enterpriseIssues);
      
    } catch (error) {
      console.error(`Error in plugin ${this.name} for file ${filePath}:`, error.message);
      // 不抛出错误，避免中断整个扫描过程
    }

    return vulnerabilities;
  }

  /**
   * 执行核心安全检测
   * @param {string} filePath - 文件路径
   * @param {string} content - 文件内容
   * @returns {Promise<Array>} - 检测到的问题
   */
  async performSecurityChecks(filePath, content) {
    const vulnerabilities = [];
    
    // 示例：检测常见的安全问题模式
    const securityPatterns = [
      {
        id: 'dangerous-eval-usage',
        pattern: /\beval\s*\(/gi,
        type: 'Code Injection',
        severity: 'High',
        description: 'Dangerous eval() usage can lead to code injection',
        recommendation: 'Avoid eval() usage. Consider using safer alternatives like JSON.parse() for JSON parsing.'
      },
      {
        id: 'xss-vulnerable-template',
        pattern: /{{\s*.*req\.[\w.]+\s*}}/gi,
        type: 'Cross-Site Scripting',
        severity: 'High',
        description: 'Unsanitized user input in template can lead to XSS',
        recommendation: 'Sanitize user input before rendering in templates.'
      },
      {
        id: 'hardcoded-secret',
        pattern: /password\s*[:=]\s*["'][^"']+["']/gi,
        type: 'Hardcoded Credential',
        severity: 'High',
        description: 'Hardcoded password detected in source code',
        recommendation: 'Use environment variables or secure credential storage.'
      }
    ];

    for (const rule of securityPatterns) {
      const matches = content.match(new RegExp(rule.pattern, 'gi'));
      if (matches) {
        matches.forEach((match, index) => {
          const lineNo = this.findLineNumber(content, match);
          
          vulnerabilities.push({
            id: `${rule.id}-${Date.now()}-${index}`,
            type: rule.type,
            severity: rule.severity,
            file: filePath,
            line: lineNo,
            description: rule.description,
            codeSnippet: this.extractCodeContext(content, lineNo, match),
            recommendation: rule.recommendation,
            plugin: this.name,
            category: this.category,
            cweIds: this.cweId
          });
        });
      }
    }

    return vulnerabilities;
  }

  /**
   * 检查企业特定安全规则
   * @param {string} filePath - 文件路径
   * @param {string} content - 文件内容
   * @returns {Promise<Array>} - 企业特定问题
   */
  async checkEnterpriseRules(filePath, content) {
    const vulnerabilities = [];
    
    // 遍历企业特定规则
    for (const rule of this.enterpriseRules) {
      if (rule.enabled !== false) { // 默认启用，除非明确禁用
        const matches = content.match(new RegExp(rule.pattern, rule.flags || 'gi'));
        if (matches) {
          matches.forEach((match, index) => {
            const lineNo = this.findLineNumber(content, match);
            
            vulnerabilities.push({
              id: `${rule.id || 'enterprise-rule'}-${Date.now()}-${index}`,
              type: rule.type || 'Enterprise Security Rule Violation',
              severity: rule.severity || this.severity,
              file: filePath,
              line: lineNo,
              description: rule.description || 'Violates enterprise security policy',
              codeSnippet: this.extractCodeContext(content, lineNo, match),
              recommendation: rule.recommendation || 'Follow enterprise security guidelines',
              plugin: this.name,
              category: this.category,
              complianceStandard: rule.complianceStandard || this.complianceStandards[0],
              enterpriseRule: true
            });
          });
        }
      }
    }

    return vulnerabilities;
  }

  /**
   * 判断文件是否需要扫描
   * @param {string} filePath - 文件路径
   * @returns {boolean} - 是否扫描此文件
   */
  isRelevantFile(filePath) {
    // 只扫描特定类型的文件
    const relevantExtensions = ['.js', '.ts', '.vue', '.jsx', '.tsx', '.html', '.htm', '.json', '.config.js'];
    const extension = filePath.slice(filePath.lastIndexOf('.')).toLowerCase();
    
    // 排除特定目录
    const excludePaths = ['/node_modules/', '/dist/', '/build/', '/.git/', '/coverage/'];
    
    const isRelevantExtension = relevantExtensions.includes(extension);
    const isIncludedPath = !excludePaths.some(excludePath => filePath.includes(excludePath));
    
    return isRelevantExtension && isIncludedPath;
  }

  /**
   * 查找匹配项所在的行号
   * @param {string} content - 文件内容
   * @param {string} match - 匹配的文本
   * @returns {number|string} - 行号或'N/A'
   */
  findLineNumber(content, match) {
    const lines = content.split('\n');
    for (let i = 0; i < lines.length; i++) {
      if (lines[i].includes(match.trim())) {
        return i + 1;
      }
    }
    return 'N/A';
  }

  /**
   * 提取代码上下文
   * @param {string} content - 文件内容
   * @param {number} lineNo - 行号
   * @param {string} match - 匹配的文本
   * @returns {string} - 代码片段
   */
  extractCodeContext(content, lineNo, match) {
    const lines = content.split('\n');
    const start = Math.max(0, lineNo - 2);
    const end = Math.min(lines.length, lineNo + 1);
    
    let contextLines = [];
    for (let i = start; i < end; i++) {
      contextLines.push(`${i + 1}| ${lines[i]}`);
    }
    
    return contextLines.join('\n');
  }

  /**
   * 验证插件配置
   * @returns {Array} - 验证错误列表
   */
  validateConfig() {
    const errors = [];
    
    if (!this.name || typeof this.name !== 'string') {
      errors.push('Plugin name is required and must be a string');
    }
    
    if (!this.description || typeof this.description !== 'string') {
      errors.push('Plugin description is required and must be a string');
    }
    
    if (!this.analyze || typeof this.analyze !== 'function') {
      errors.push('Plugin must implement analyze() method');
    }
    
    return errors;
  }

  /**
   * 获取插件信息摘要
   * @returns {Object} - 插件信息
   */
  getInfo() {
    return {
      name: this.name,
      description: this.description,
      version: this.version,
      author: this.author,
      license: this.license,
      severity: this.severity,
      category: this.category,
      cweIds: this.cweId,
      complianceStandards: this.complianceStandards,
      rulesCount: this.enterpriseRules.length,
      enabled: true
    };
  }
}

// 使用示例
/*
const enterprisePlugin = new EnterpriseSecurityPluginTemplate({
  name: 'My Company Security Policy Checker',
  description: 'Enforces company-specific security policies',
  severity: 'High',
  enterpriseRules: [
    {
      id: 'company-data-leakage',
      pattern: /COMPANY_SECRET_KEY|INTERNAL_API_TOKEN/,
      type: 'Internal Secret Exposure',
      severity: 'Critical',
      description: 'Company internal secrets detected',
      recommendation: 'Remove internal secrets from code',
      complianceStandard: 'SOX'
    }
  ],
  complianceStandards: ['SOX', 'GDPR', 'HIPAA']
});
*/

module.exports = EnterpriseSecurityPluginTemplate;