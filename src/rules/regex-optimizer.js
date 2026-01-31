// src/rules/regex-optimizer.js
// 正则表达式优化器 - 提供快速失败和性能优化功能

class RegexOptimizer {
  constructor() {
    this.quickMatchCache = new Map();
    this.patternComplexity = new Map();
  }

  /**
   * 计算正则表达式模式的复杂度
   * @param {string} pattern - 正则表达式模式
   * @returns {number} - 复杂度分数（0-100）
   */
  calculatePatternComplexity(pattern) {
    if (this.patternComplexity.has(pattern)) {
      return this.patternComplexity.get(pattern);
    }

    let complexity = 0;

    // 计算特殊字符的数量
    const specialChars = pattern.match(/[\\^$*+?{}[\]().|]/g);
    if (specialChars) {
      complexity += specialChars.length * 2;
    }

    // 计算量词的数量
    const quantifiers = pattern.match(/[?*+{]/g);
    if (quantifiers) {
      complexity += quantifiers.length * 3;
    }

    // 计算捕获组的数量
    const groups = pattern.match(/\(/g);
    if (groups) {
      complexity += groups.length * 2;
    }

    // 计算字符类的数量
    const charClasses = pattern.match(/\[.*?\]/g);
    if (charClasses) {
      complexity += charClasses.length * 3;
    }

    // 计算交替的数量
    const alternations = pattern.match(/\|/g);
    if (alternations) {
      complexity += alternations.length * 5;
    }

    // 限制最大复杂度为100
    complexity = Math.min(complexity, 100);

    this.patternComplexity.set(pattern, complexity);
    return complexity;
  }

  /**
   * 生成快速匹配模式
   * @param {string} pattern - 原始正则表达式模式
   * @returns {string|null} - 快速匹配模式，如果不能生成则返回null
   */
  generateQuickMatchPattern(pattern) {
    if (this.quickMatchCache.has(pattern)) {
      return this.quickMatchCache.get(pattern);
    }

    // 提取模式中的固定字符串部分
    let quickMatch = null;

    // 查找连续的字母数字字符（至少3个字符）
    const fixedStringMatch = pattern.match(/[a-zA-Z0-9]{3,}/);
    if (fixedStringMatch) {
      quickMatch = fixedStringMatch[0];
    }

    // 查找API调用模式
    const apiMatch = pattern.match(/\b[a-zA-Z]+\.[a-zA-Z]+\s*\(/);
    if (apiMatch) {
      const apiPattern = apiMatch[0].replace(/\s*\(/, '');
      // 优先使用API模式，因为它更具体
      quickMatch = apiPattern;
    }

    // 查找标签模式
    const tagMatch = pattern.match(/<\s*[a-zA-Z][a-zA-Z0-9]*/);
    if (tagMatch) {
      const tagPattern = tagMatch[0];
      // 如果快速匹配模式太短，使用标签模式
      if (!quickMatch || quickMatch.length < tagPattern.length) {
        quickMatch = tagPattern;
      }
    }

    this.quickMatchCache.set(pattern, quickMatch);
    return quickMatch;
  }

  /**
   * 快速检查内容是否可能匹配模式
   * @param {string} content - 文件内容
   * @param {string} pattern - 正则表达式模式
   * @returns {boolean} - 是否可能匹配
   */
  quickCheck(content, pattern) {
    const quickMatch = this.generateQuickMatchPattern(pattern);

    if (!quickMatch) {
      // 如果不能生成快速匹配模式，返回true，表示需要完整匹配
      return true;
    }

    // 执行快速字符串匹配
    return content.includes(quickMatch);
  }

  /**
   * 批量快速检查
   * @param {string} content - 文件内容
   * @param {Array} patterns - 正则表达式模式数组
   * @returns {Array} - 可能匹配的模式索引数组
   */
  batchQuickCheck(content, patterns) {
    const possibleMatches = [];

    patterns.forEach((pattern, index) => {
      if (this.quickCheck(content, pattern)) {
        possibleMatches.push(index);
      }
    });

    return possibleMatches;
  }

  /**
   * 优化正则表达式模式
   * @param {string} pattern - 原始模式
   * @returns {string} - 优化后的模式
   */
  optimizePattern(pattern) {
    let optimized = pattern;

    // 移除不必要的捕获组
    optimized = optimized.replace(/\(\?:([^)]+)\)/g, '($1)');

    // 简化字符类
    optimized = optimized.replace(/\[a-zA-Z\]/g, '[a-zA-Z]');
    optimized = optimized.replace(/\[0-9\]/g, '\\d');
    optimized = optimized.replace(/\[ \t\n\r\]/g, '\\s');

    // 简化量词
    optimized = optimized.replace(/\{0,1\}/g, '?');
    optimized = optimized.replace(/\{0,\}/g, '*');
    optimized = optimized.replace(/\{1,\}/g, '+');

    return optimized;
  }

  /**
   * 获取模式统计信息
   * @returns {Object} - 统计信息
   */
  getStats() {
    return {
      quickMatchCacheSize: this.quickMatchCache.size,
      patternComplexityCacheSize: this.patternComplexity.size
    };
  }

  /**
   * 清除缓存
   */
  clearCache() {
    this.quickMatchCache.clear();
    this.patternComplexity.clear();
  }
}

module.exports = new RegexOptimizer();