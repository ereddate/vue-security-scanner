// plugins/example-plugin.js
// 插件开发示例 - 演示如何创建自定义安全检测插件

class ExampleSecurityPlugin {
  constructor() {
    this.name = 'Example Security Plugin';    // 插件名称
    this.description = '示例安全检测插件';    // 插件描述
    this.version = '1.0.0';                 // 插件版本
    this.enabled = true;                    // 是否启用
    this.severity = 'Medium';               // 默认严重性
  }

  /**
   * 分析文件内容，检测安全漏洞
   * @param {string} filePath - 要分析的文件路径
   * @param {string} content - 文件内容
   * @returns {Array} 检测到的漏洞数组
   */
  async analyze(filePath, content) {
    const vulnerabilities = [];
    
    // 示例1: 检测硬编码的密码
    const passwordPattern = /password\s*[:=]\s*['"`][^'"`]+['"`]/gi;
    let match;
    while ((match = passwordPattern.exec(content)) !== null) {
      vulnerabilities.push({
        id: 'example-password-' + Date.now() + Math.random().toString(36).substr(2, 5),
        type: 'Hardcoded Password',
        severity: this.severity,
        file: filePath,
        line: content.substring(0, match.index).split('\n').length,
        description: `Hardcoded password detected: ${match[0]}`,
        codeSnippet: match[0],
        recommendation: 'Move passwords to environment variables or secure vault systems.',
        plugin: this.name
      });
    }
    
    // 示例2: 检测不安全的eval使用
    const evalPattern = /\beval\s*\([^)]*\)/gi;
    while ((match = evalPattern.exec(content)) !== null) {
      vulnerabilities.push({
        id: 'example-eval-' + Date.now() + Math.random().toString(36).substr(2, 5),
        type: 'Unsafe Eval Usage',
        severity: 'High',
        file: filePath,
        line: content.substring(0, match.index).split('\n').length,
        description: `Unsafe eval usage detected: ${match[0]}`,
        codeSnippet: match[0],
        recommendation: 'Avoid using eval() as it can execute arbitrary code. Use safer alternatives.',
        plugin: this.name
      });
    }
    
    return vulnerabilities;
  }
}

// 导出插件实例
module.exports = new ExampleSecurityPlugin();