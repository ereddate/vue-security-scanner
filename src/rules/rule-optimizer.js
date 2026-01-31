// src/rules/rule-optimizer.js
// 规则优化器 - 提供规则分类、预筛选和性能优化功能

const path = require('path');

class RuleOptimizer {
  constructor() {
    this.categorizedRules = new Map();
    this.fileTypeRules = new Map();
    this.frameworkRules = new Map();
    this.rulePriority = new Map();
    this.initialized = false;
  }

  /**
   * 初始化规则优化器
   * @param {Array} rules - 所有规则
   */
  initialize(rules) {
    if (this.initialized) {
      return;
    }

    console.log('Initializing rule optimizer...');
    const startTime = Date.now();

    // 按文件类型分类规则
    this.categorizeByFileType(rules);

    // 按框架分类规则
    this.categorizeByFramework(rules);

    // 设置规则优先级
    this.setRulePriorities(rules);

    this.initialized = true;
    const endTime = Date.now();
    const fileTypeCount = Object.keys(this.fileTypeRules).length;
    const frameworkCount = Object.keys(this.frameworkRules).length;
    console.log(`Rule optimizer initialized in ${endTime - startTime}ms`);
    console.log(`File type categories: ${fileTypeCount}`);
    console.log(`Framework categories: ${frameworkCount}`);
  }

  /**
   * 按文件类型分类规则
   * @param {Array} rules - 所有规则
   */
  categorizeByFileType(rules) {
    const fileTypes = {
      '.vue': [],
      '.js': [],
      '.jsx': [],
      '.ts': [],
      '.tsx': [],
      '.nvue': [],
      '.wxml': [],
      '.wxss': [],
      '.wxs': [],
      '.swan': [],
      '.ttml': [],
      '.qml': [],
      '.html': [],
      '.json': [],
      'default': []
    };

    rules.forEach(rule => {
      let assigned = false;

      // 根据规则ID和模式判断适用的文件类型
      if (rule.id.includes('vue') || rule.id.includes('v-')) {
        fileTypes['.vue'].push(rule);
        fileTypes['.nvue'].push(rule);
        assigned = true;
      }

      if (rule.id.includes('react') || rule.id.includes('jsx')) {
        fileTypes['.jsx'].push(rule);
        fileTypes['.tsx'].push(rule);
        assigned = true;
      }

      if (rule.id.includes('wechat') || rule.id.includes('wx-')) {
        fileTypes['.wxml'].push(rule);
        fileTypes['.wxss'].push(rule);
        fileTypes['.wxs'].push(rule);
        assigned = true;
      }

      if (rule.id.includes('uni-app') || rule.id.includes('uni-')) {
        fileTypes['.vue'].push(rule);
        fileTypes['.nvue'].push(rule);
        fileTypes['.js'].push(rule);
        assigned = true;
      }

      if (rule.id.includes('taro')) {
        fileTypes['.tsx'].push(rule);
        fileTypes['.jsx'].push(rule);
        fileTypes['.js'].push(rule);
        assigned = true;
      }

      // JavaScript通用规则
      if (!assigned && (rule.category === 'injection' || rule.category === 'secrets' || rule.category === 'input')) {
        fileTypes['.js'].push(rule);
        fileTypes['.jsx'].push(rule);
        fileTypes['.ts'].push(rule);
        fileTypes['.tsx'].push(rule);
        fileTypes['.vue'].push(rule);
        fileTypes['.nvue'].push(rule);
        assigned = true;
      }

      // 默认规则适用于所有文件
      if (!assigned) {
        fileTypes['default'].push(rule);
      }
    });

    this.fileTypeRules = fileTypes;
  }

  /**
   * 按框架分类规则
   * @param {Array} rules - 所有规则
   */
  categorizeByFramework(rules) {
    const frameworks = {
      'vue': [],
      'react': [],
      'uni-app': [],
      'wechat': [],
      'taro': [],
      'default': []
    };

    rules.forEach(rule => {
      let assigned = false;

      if (rule.id.includes('vue') || rule.id.includes('v-')) {
        frameworks['vue'].push(rule);
        assigned = true;
      }

      if (rule.id.includes('react') || rule.id.includes('jsx')) {
        frameworks['react'].push(rule);
        assigned = true;
      }

      if (rule.id.includes('uni-app') || rule.id.includes('uni-')) {
        frameworks['uni-app'].push(rule);
        assigned = true;
      }

      if (rule.id.includes('wechat') || rule.id.includes('wx-')) {
        frameworks['wechat'].push(rule);
        assigned = true;
      }

      if (rule.id.includes('taro')) {
        frameworks['taro'].push(rule);
        assigned = true;
      }

      if (!assigned) {
        frameworks['default'].push(rule);
      }
    });

    this.frameworkRules = frameworks;
  }

  /**
   * 设置规则优先级
   * @param {Array} rules - 所有规则
   */
  setRulePriorities(rules) {
    rules.forEach(rule => {
      let priority = 1; // 默认优先级

      // 根据严重程度设置优先级
      if (rule.severity === 'Critical') {
        priority = 4;
      } else if (rule.severity === 'High') {
        priority = 3;
      } else if (rule.severity === 'Medium') {
        priority = 2;
      }

      // 根据规则类型调整优先级
      if (rule.category === 'injection' || rule.category === 'xss') {
        priority += 1;
      }

      this.rulePriority.set(rule.id, priority);
    });
  }

  /**
   * 根据文件路径获取适用的规则
   * @param {string} filePath - 文件路径
   * @returns {Array} - 适用的规则
   */
  getApplicableRules(filePath) {
    if (!this.initialized) {
      throw new Error('Rule optimizer not initialized');
    }

    const ext = path.extname(filePath).toLowerCase();
    let rules = [];

    // 获取特定文件类型的规则
    if (this.fileTypeRules.hasOwnProperty(ext)) {
      rules = [...this.fileTypeRules[ext]];
    }

    // 获取默认规则
    if (this.fileTypeRules.hasOwnProperty('default')) {
      rules = [...rules, ...this.fileTypeRules['default']];
    }

    // 根据优先级排序规则
    rules.sort((a, b) => {
      const priorityA = this.rulePriority.get(a.id) || 1;
      const priorityB = this.rulePriority.get(b.id) || 1;
      return priorityB - priorityA; // 降序排列，高优先级在前
    });

    return rules;
  }

  /**
   * 根据框架获取适用的规则
   * @param {string} framework - 框架名称
   * @returns {Array} - 适用的规则
   */
  getFrameworkRules(framework) {
    if (!this.initialized) {
      throw new Error('Rule optimizer not initialized');
    }

    let rules = [];

    if (this.frameworkRules.hasOwnProperty(framework)) {
      rules = [...this.frameworkRules[framework]];
    }

    if (this.frameworkRules.hasOwnProperty('default')) {
      rules = [...rules, ...this.frameworkRules['default']];
    }

    return rules;
  }

  /**
   * 获取规则统计信息
   * @returns {Object} - 统计信息
   */
  getStats() {
    if (!this.initialized) {
      return { initialized: false };
    }

    const stats = {
      initialized: true,
      fileTypes: {},
      frameworks: {}
    };

    // 遍历fileTypeRules对象
    for (const fileType in this.fileTypeRules) {
      if (this.fileTypeRules.hasOwnProperty(fileType)) {
        stats.fileTypes[fileType] = this.fileTypeRules[fileType].length;
      }
    }

    // 遍历frameworkRules对象
    for (const framework in this.frameworkRules) {
      if (this.frameworkRules.hasOwnProperty(framework)) {
        stats.frameworks[framework] = this.frameworkRules[framework].length;
      }
    }

    return stats;
  }

  /**
   * 清除缓存
   */
  clearCache() {
    this.categorizedRules.clear();
    this.fileTypeRules.clear();
    this.frameworkRules.clear();
    this.rulePriority.clear();
    this.initialized = false;
  }
}

module.exports = new RuleOptimizer();