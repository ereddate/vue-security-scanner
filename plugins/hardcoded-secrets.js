// plugins/hardcoded-secrets.js
// 硬编码密钥检测插件

class HardcodedSecretsPlugin {
  constructor() {
    this.name = 'Hardcoded Secrets Detection';
    this.description = '检测硬编码的敏感信息和密钥';
    this.version = '1.0.0';
    this.enabled = true;
    this.severity = 'High';
    
    // 定义敏感信息的正则表达式模式
    this.secretPatterns = [
      {
        name: 'API Key',
        pattern: /(?:api[_-]?key|apikey)\s*[:=]\s*['"`]([A-Za-z0-9_\-]{20,})['"`]/gi,
        severity: 'High'
      },
      {
        name: 'Password',
        pattern: /(?:password|passwd|pwd)\s*[:=]\s*['"`]([^'"`]{6,})['"`]/gi,
        severity: 'High'
      },
      {
        name: 'Secret Token',
        pattern: /(?:secret|token)\s*[:=]\s*['"`]([A-Za-z0-9_\-]{16,})['"`]/gi,
        severity: 'High'
      },
      {
        name: 'JWT Token',
        pattern: /eyJ[A-Za-z0-9_\-]*\.eyJ[A-Za-z0-9_\-]*\.[A-Za-z0-9_\-]*/g,
        severity: 'High'
      },
      {
        name: 'Database Credentials',
        pattern: /(?:username|user)\s*[:=]\s*['"`]([^'"`]+)['"`].*?(?:password|passwd)\s*[:=]\s*['"`]([^'"`]+)['"`]/gs,
        severity: 'High'
      }
    ];
  }

  /**
   * 分析文件内容
   * @param {string} filePath - 文件路径
   * @param {string} content - 文件内容
   * @returns {Array} - 漏洞数组
   */
  analyze(filePath, content) {
    const vulnerabilities = [];
    
    for (const secretPattern of this.secretPatterns) {
      let match;
      while ((match = secretPattern.pattern.exec(content)) !== null) {
        // 确定具体的严重性，优先使用检测到的模式的严重性
        const severity = secretPattern.severity || this.severity;
        
        vulnerabilities.push({
          id: 'hardcoded-secret-' + Date.now() + Math.random(),
          type: `Hardcoded ${secretPattern.name}`,
          severity: severity,
          file: filePath,
          line: this.getLineNumber(content, match.index),
          description: `Possible hardcoded ${secretPattern.name.toLowerCase()}: ${match[0].substring(0, 50)}...`,
          codeSnippet: match[0],
          recommendation: 'Move sensitive credentials to environment variables or secure vault systems.',
          plugin: this.name
        });
      }
    }
    
    return vulnerabilities;
  }

  /**
   * 获取行号
   * @param {string} content - 文件内容
   * @param {number} index - 字符索引
   * @returns {number} - 行号
   */
  getLineNumber(content, index) {
    return content.substring(0, index).split('\n').length;
  }
}

module.exports = new HardcodedSecretsPlugin();