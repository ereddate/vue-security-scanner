// plugins/xss-detection.js
// XSS检测插件

class XSSDetectionPlugin {
  constructor() {
    this.name = 'XSS Detection';
    this.description = '检测潜在的跨站脚本(XSS)漏洞';
    this.version = '1.0.0';
    this.enabled = true;
    this.severity = 'High';
  }

  /**
   * 分析文件内容
   * @param {string} filePath - 文件路径
   * @param {string} content - 文件内容
   * @returns {Array} - 漏洞数组
   */
  analyze(filePath, content) {
    const vulnerabilities = [];
    
    // 检查v-html的使用
    const vHtmlRegex = /v-html\s*=\s*["'`](.*?)["'`]/gi;
    let match;
    while ((match = vHtmlRegex.exec(content)) !== null) {
      vulnerabilities.push({
        id: 'xss-v-html-' + Date.now() + Math.random(),
        type: 'Potential XSS via v-html',
        severity: this.severity,
        file: filePath,
        line: this.getLineNumber(content, match.index),
        description: 'Using v-html can lead to XSS vulnerabilities if not properly sanitized',
        codeSnippet: match[0],
        recommendation: 'Avoid using v-html with user-provided content. If necessary, sanitize the content using a library like DOMPurify.',
        plugin: this.name
      });
    }
    
    // 检查模板插值
    const interpolationRegex = /\{\{(.*?)\}\}/g;
    while ((match = interpolationRegex.exec(content)) !== null) {
      if (this.containsUserInput(match[1])) {
        vulnerabilities.push({
          id: 'xss-interpolation-' + Date.now() + Math.random(),
          type: 'Potential XSS via template interpolation',
          severity: this.severity,
          file: filePath,
          line: this.getLineNumber(content, match.index),
          description: 'Unsafe use of template interpolation with potential user input',
          codeSnippet: match[0],
          recommendation: 'Sanitize user input before using in templates or use v-text instead of raw interpolation.',
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

  /**
   * 检查字符串是否包含用户输入相关的标识
   * @param {string} str - 要检查的字符串
   * @returns {boolean} - 是否包含用户输入
   */
  containsUserInput(str) {
    const userInputPatterns = [
      /req\.|request\.|params|query|userInput|formData|payload/i,
      /this\.\$route\.|this\.\$router\.|location\.|window\./i
    ];
    
    return userInputPatterns.some(pattern => pattern.test(str));
  }
}

module.exports = new XSSDetectionPlugin();