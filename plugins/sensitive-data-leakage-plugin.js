/**
 * 敏感数据泄露检测插件
 * 企业级安全扫描插件，用于检测潜在的敏感数据泄露
 */

class SensitiveDataLeakagePlugin {
  constructor() {
    this.name = 'Sensitive Data Leakage Detector';
    this.description = 'Detects potential sensitive data leakage in code';
    this.version = '1.0.0';
    this.severity = 'High';
  }

  /**
   * 分析文件内容以查找敏感数据泄露
   */
  async analyze(filePath, content) {
    const vulnerabilities = [];
    
    // 检查文件类型，只处理相关文件
    if (!this.isRelevantFile(filePath)) {
      return vulnerabilities;
    }

    // 敏感数据泄露检测规则
    const sensitiveDataPatterns = [
      {
        pattern: /\b(accessToken|access_token|secret|client_secret|password|pwd|passwd|pass|token|auth|authorization|bearer|api_key|api-key|apikey|privateKey|private_key|ssh_key|ssh-key|secretKey|secret_key|db_password|database_password|jwt_secret|jwt_secret_key|encryption_key|crypto_key|oauth_token|refresh_token)\b/gi,
        description: 'Potential sensitive credential or token exposure',
        severity: 'High'
      },
      {
        pattern: /console\.(log|warn|error|info|debug)\s*\(\s*['"][^\r\n'"]*(password|token|key|secret|credential|auth)[^\r\n'"]*['"]/gi,
        description: 'Sensitive data logged to console',
        severity: 'High'
      },
      {
        pattern: /localStorage\.(setItem|set)\s*\(\s*['"][^\r\n'"]*(password|token|key|secret|credential|auth)[^\r\n'"]*['"][,\s]+/gi,
        description: 'Storing sensitive data in localStorage',
        severity: 'High'
      },
      {
        pattern: /sessionStorage\.(setItem|set)\s*\(\s*['"][^\r\n'"]*(password|token|key|secret|credential|auth)[^\r\n'"]*['"][,\s]+/gi,
        description: 'Storing sensitive data in sessionStorage',
        severity: 'Medium'
      },
      {
        pattern: /\b\d{4}[-\s]?\d{4}[-\s]?\d{4}[-\s]?\d{4}\b/, // Credit card pattern
        description: 'Potential credit card number exposure',
        severity: 'High'
      },
      {
        pattern: /\b\d{3}-\d{2}-\d{4}\b/, // SSN pattern
        description: 'Potential Social Security Number exposure',
        severity: 'High'
      },
      {
        pattern: /['"`]([a-zA-Z0-9]{20,})['"`]/g, // Long alphanumeric strings
        description: 'Potential API key or long token exposed as string literal',
        severity: 'High'
      }
    ];

    for (const rule of sensitiveDataPatterns) {
      const matches = content.match(rule.pattern);
      if (matches) {
        matches.forEach((match, index) => {
          const lines = content.split('\n');
          let lineNumber = 0;
          
          // 找到匹配所在的行号
          for (let i = 0; i < lines.length; i++) {
            if (lines[i].includes(match.trim())) {
              lineNumber = i + 1;
              break;
            }
          }
          
          vulnerabilities.push({
            id: `sensitive-data-${Date.now()}-${index}`,
            type: 'Sensitive Data Exposure',
            severity: rule.severity,
            file: filePath,
            line: lineNumber,
            description: rule.description,
            codeSnippet: match.substring(0, 100),
            recommendation: 'Never store or transmit sensitive data in plain text. Use secure storage mechanisms and encrypt sensitive data.',
            plugin: this.name
          });
        });
      }
    }

    // 检查是否存在密码字段的不安全处理
    const insecurePasswordHandling = /(?<!\/\/.*)password\s*[:=]\s*['"][^'"]+['"]/g;
    const passwordMatches = content.match(insecurePasswordHandling);
    if (passwordMatches) {
      passwordMatches.forEach((match, index) => {
        const lines = content.split('\n');
        let lineNumber = 0;
        
        for (let i = 0; i < lines.length; i++) {
          if (lines[i].includes(match.trim())) {
            lineNumber = i + 1;
            break;
          }
        }
        
        vulnerabilities.push({
          id: `insecure-password-${Date.now()}-${index}`,
          type: 'Insecure Password Handling',
          severity: 'High',
          file: filePath,
          line: lineNumber,
          description: 'Hardcoded password in source code',
          codeSnippet: match.substring(0, 100),
          recommendation: 'Use environment variables or secure vaults to store passwords. Never hardcode credentials.',
          plugin: this.name
        });
      });
    }

    return vulnerabilities;
  }

  /**
   * 判断文件是否需要扫描
   */
  isRelevantFile(filePath) {
    const relevantExtensions = ['.js', '.ts', '.vue', '.jsx', '.tsx', '.json', '.env', '.config.js'];
    const extension = filePath.slice(filePath.lastIndexOf('.')).toLowerCase();
    return relevantExtensions.includes(extension);
  }
}

module.exports = new SensitiveDataLeakagePlugin();