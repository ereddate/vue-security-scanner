// plugins/test-plugin.js
// 测试插件

class TestPlugin {
  constructor() {
    this.name = 'Test Plugin';
    this.description = '用于测试插件系统的功能';
    this.version = '1.0.0';
    this.enabled = true;
    this.severity = 'Medium';
  }

  /**
   * 分析文件内容
   * @param {string} filePath - 文件路径
   * @param {string} content - 文件内容
   * @returns {Array} - 漏洞数组
   */
  analyze(filePath, content) {
    const vulnerabilities = [];
    
    // 检查是否包含特定测试字符串
    if (content.toLowerCase().includes('test') && content.toLowerCase().includes('vulnerability')) {
      vulnerabilities.push({
        id: 'test-vulnerability-' + Date.now(),
        type: 'Test Vulnerability Found',
        severity: this.severity,
        file: filePath,
        line: 1,
        description: 'Test vulnerability pattern found in file',
        codeSnippet: 'Test vulnerability detected',
        recommendation: 'This is a test vulnerability for plugin system verification',
        plugin: this.name
      });
    }
    
    return vulnerabilities;
  }
}

module.exports = new TestPlugin();