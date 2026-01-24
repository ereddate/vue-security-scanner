// src/utils/ignore-manager.js
// 忽略规则管理器

const fs = require('fs');
const path = require('path');

class IgnoreManager {
  constructor(projectPath) {
    this.projectPath = projectPath;
    this.ignoreRules = [];
    this.loadIgnoreRules();
  }

  /**
   * 加载忽略规则
   */
  loadIgnoreRules() {
    // 查找项目中的忽略规则文件
    const ignoreFilePaths = [
      path.join(this.projectPath, '.vue-security-ignore'),
      path.join(this.projectPath, '.security-ignore'),
      path.join(process.cwd(), '.vue-security-ignore'),
      path.join(process.cwd(), '.security-ignore')
    ];

    for (const ignorePath of ignoreFilePaths) {
      if (fs.existsSync(ignorePath)) {
        this.parseIgnoreFile(ignorePath);
        break; // 使用找到的第一个文件
      }
    }
  }

  /**
   * 解析忽略文件
   * @param {string} filePath - 忽略文件路径
   */
  parseIgnoreFile(filePath) {
    try {
      const content = fs.readFileSync(filePath, 'utf8');
      const lines = content.split('\n');
      
      for (const line of lines) {
        const trimmedLine = line.trim();
        
        // 忽略空行和注释
        if (!trimmedLine || trimmedLine.startsWith('#')) {
          continue;
        }
        
        // 添加到忽略规则
        this.ignoreRules.push(trimmedLine);
      }
    } catch (error) {
      console.warn(`Could not read ignore file: ${filePath}`, error.message);
    }
  }

  /**
   * 检查文件是否应被忽略
   * @param {string} filePath - 文件路径
   * @returns {boolean} - 是否应被忽略
   */
  shouldIgnoreFile(filePath) {
    const relativePath = path.relative(this.projectPath, filePath);
    
    for (const rule of this.ignoreRules) {
      if (this.matchesRule(relativePath, rule)) {
        return true;
      }
    }
    
    return false;
  }

  /**
   * 检查漏洞是否应被忽略
   * @param {Object} vulnerability - 漏洞对象
   * @returns {boolean} - 是否应被忽略
   */
  shouldIgnoreVulnerability(vulnerability) {
    // 检查基于文件路径的忽略规则
    if (this.shouldIgnoreFile(vulnerability.file)) {
      return true;
    }
    
    // 检查基于漏洞类型的忽略规则
    for (const rule of this.ignoreRules) {
      // 检查漏洞类型
      if (rule.startsWith('type:') && vulnerability.type.includes(rule.substring(5))) {
        return true;
      }
      
      // 检查规则ID
      if (rule.startsWith('rule:') && vulnerability.ruleId && vulnerability.ruleId.includes(rule.substring(5))) {
        return true;
      }
      
      // 检查插件（向后兼容）
      if (rule.startsWith('plugin:') && vulnerability.plugin && vulnerability.plugin.includes(rule.substring(7))) {
        return true;
      }
      
      // 检查严重性
      if (rule.startsWith('severity:') && vulnerability.severity.toLowerCase().includes(rule.substring(9).toLowerCase())) {
        return true;
      }
      
      // 检查直接匹配规则ID（简化语法）
      if (vulnerability.ruleId && rule === vulnerability.ruleId) {
        return true;
      }
      
      // 检查直接匹配漏洞类型（简化语法）
      if (vulnerability.type && rule === vulnerability.type) {
        return true;
      }
    }
    
    return false;
  }

  /**
   * 检查路径是否匹配规则
   * @param {string} filePath - 文件路径
   * @param {string} rule - 忽略规则
   * @returns {boolean} - 是否匹配
   */
  matchesRule(filePath, rule) {
    // 简单的glob模式匹配实现
    // 支持 * 和 ** 模式
    const regexPattern = this.globToRegExp(rule);
    const regex = new RegExp(regexPattern, 'i');
    return regex.test(filePath);
  }

  /**
   * 将glob模式转换为正则表达式
   * @param {string} glob - glob模式
   * @returns {string} - 正则表达式模式
   */
  globToRegExp(glob) {
    let regex = '^';
    
    for (let i = 0; i < glob.length; i++) {
      const c = glob.charAt(i);
      
      switch (c) {
        case '*':
          // 检查是否是 **
          if (i < glob.length - 1 && glob.charAt(i + 1) === '*') {
            regex += '.*';
            i++; // 跳过下一个 *
          } else {
            regex += '[^/]*';
          }
          break;
        case '?':
          regex += '.';
          break;
        case '.':
        case '+':
        case '$':
        case '^':
        case '{':
        case '}':
        case '(':
        case ')':
        case '[':
        case ']':
        case '\\':
          regex += '\\' + c;
          break;
        default:
          regex += c;
      }
    }
    
    return regex + '$';
  }
}

module.exports = IgnoreManager;