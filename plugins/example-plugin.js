// plugins/example-plugin.js
// 示例插件：检测潜在的SQL注入漏洞

class SqlInjectionPlugin {
  constructor() {
    this.metadata = {
      name: 'SQL Injection Detector',
      version: '1.0.0',
      description: 'Detects potential SQL injection vulnerabilities in code',
      author: 'Vue Security Scanner Team',
      severity: 'high'
    };
  }

  /**
   * 分析文件内容以查找漏洞
   * @param {string} filePath - 文件路径
   * @param {string} content - 文件内容
   * @returns {Array} - 漏洞数组
   */
  async analyze(filePath, content) {
    const vulnerabilities = [];
    
    // 检查是否存在潜在的SQL注入点
    const sqlPatterns = [
      /execute\s*\(\s*["'`][^"'`]*\s+(?:union|select|insert|update|delete|drop|create|alter|exec|execute)\s+/gi,
      /query\s*\(\s*["'`][^"'`]*\s+(?:union|select|insert|update|delete|drop|create|alter|exec|execute)\s+/gi,
      /mysql_query\s*\([^"')]*["'`][^"'`]*\s+(?:union|select|insert|update|delete|drop|create|alter|exec|execute)\s+/gi,
      /SELECT\s+.*FROM\s+.*WHERE\s+.*["'`][^"'`]*\s*\+\s*/gi,
      /INSERT\s+INTO\s+.*VALUES\s*\([^)]*\s*\+\s*/gi
    ];
    
    for (const [index, pattern] of sqlPatterns.entries()) {
      let match;
      while ((match = pattern.exec(content)) !== null) {
        vulnerabilities.push({
          type: 'Potential SQL Injection',
          severity: 'High',
          file: filePath,
          line: this.getLineNumber(content, match.index),
          description: `Potential SQL injection vulnerability: ${match[0].substring(0, 50)}...`,
          recommendation: 'Use parameterized queries or prepared statements instead of concatenating user input into SQL queries.'
        });
      }
    }
    
    return vulnerabilities;
  }

  /**
   * 获取匹配位置的行号
   * @param {string} str - 字符串
   * @param {number} index - 索引位置
   * @returns {number} - 行号
   */
  getLineNumber(str, index) {
    const lines = str.substring(0, index).split('\n');
    return lines.length;
  }
}

module.exports = SqlInjectionPlugin;