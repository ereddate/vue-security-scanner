// src/rules/rule-extension-api.js
// 规则扩展API - 提供动态添加、删除和管理安全规则的功能

class RuleExtensionAPI {
  constructor(ruleEngine) {
    this.ruleEngine = ruleEngine;
    this.customRules = [];
    this.ruleCategories = new Map(); // 存储规则分类
    this.activeRules = new Set(); // 存储当前激活的规则ID
  }

  /**
   * 添加自定义规则
   * @param {Object} rule - 规则对象
   * @param {string} rule.id - 规则ID
   * @param {string} rule.name - 规则名称
   * @param {string} rule.description - 规则描述
   * @param {string} rule.category - 规则分类
   * @param {string} rule.severity - 规则严重程度
   * @param {RegExp|string} rule.pattern - 检测模式
   * @param {Function} rule.validator - 自定义验证函数
   * @param {Array} rule.fileTypes - 适用的文件类型
   * @returns {boolean} - 是否成功添加
   */
  addRule(rule) {
    if (!this.validateRule(rule)) {
      console.error(`Invalid rule: ${rule.id}`);
      return false;
    }

    // 检查规则ID是否已存在
    if (this.customRules.some(r => r.id === rule.id)) {
      console.warn(`Rule with ID ${rule.id} already exists, updating...`);
      this.removeRule(rule.id);
    }

    // 设置默认值
    const normalizedRule = {
      id: rule.id,
      name: rule.name || rule.id,
      description: rule.description || 'Custom rule',
      category: rule.category || 'custom',
      severity: rule.severity || 'medium',
      pattern: rule.pattern,
      validator: rule.validator || null,
      fileTypes: rule.fileTypes || ['.vue', '.js', '.jsx', '.ts', '.tsx'],
      enabled: rule.enabled !== false, // 默认启用
      createdAt: new Date().toISOString(),
      ...rule
    };

    this.customRules.push(normalizedRule);
    this.activeRules.add(normalizedRule.id);

    // 将规则添加到分类中
    if (!this.ruleCategories.has(normalizedRule.category)) {
      this.ruleCategories.set(normalizedRule.category, []);
    }
    this.ruleCategories.get(normalizedRule.category).push(normalizedRule);

    console.log(`Added custom rule: ${normalizedRule.id} (${normalizedRule.name})`);
    return true;
  }

  /**
   * 删除规则
   * @param {string} ruleId - 规则ID
   * @returns {boolean} - 是否成功删除
   */
  removeRule(ruleId) {
    const initialLength = this.customRules.length;
    this.customRules = this.customRules.filter(rule => {
      if (rule.id === ruleId) {
        this.activeRules.delete(rule.id);
        // 从分类中移除
        for (const [category, rules] of this.ruleCategories) {
          const filtered = rules.filter(r => r.id !== ruleId);
          this.ruleCategories.set(category, filtered);
        }
        return false;
      }
      return true;
    });

    if (initialLength !== this.customRules.length) {
      console.log(`Removed custom rule: ${ruleId}`);
      return true;
    }

    console.warn(`Rule not found: ${ruleId}`);
    return false;
  }

  /**
   * 启用规则
   * @param {string} ruleId - 规则ID
   * @returns {boolean} - 是否成功启用
   */
  enableRule(ruleId) {
    const rule = this.customRules.find(r => r.id === ruleId);
    if (rule) {
      rule.enabled = true;
      this.activeRules.add(ruleId);
      console.log(`Enabled rule: ${ruleId}`);
      return true;
    }
    console.warn(`Rule not found: ${ruleId}`);
    return false;
  }

  /**
   * 禁用规则
   * @param {string} ruleId - 规则ID
   * @returns {boolean} - 是否成功禁用
   */
  disableRule(ruleId) {
    const rule = this.customRules.find(r => r.id === ruleId);
    if (rule) {
      rule.enabled = false;
      this.activeRules.delete(ruleId);
      console.log(`Disabled rule: ${ruleId}`);
      return true;
    }
    console.warn(`Rule not found: ${ruleId}`);
    return false;
  }

  /**
   * 获取规则
   * @param {string} ruleId - 规则ID
   * @returns {Object|null} - 规则对象或null
   */
  getRule(ruleId) {
    return this.customRules.find(r => r.id === ruleId) || null;
  }

  /**
   * 获取所有规则
   * @param {string} category - 可选的分类过滤
   * @returns {Array} - 规则数组
   */
  getAllRules(category = null) {
    if (category) {
      return this.customRules.filter(rule => rule.category === category);
    }
    return [...this.customRules];
  }

  /**
   * 获取所有激活的规则
   * @param {string} category - 可选的分类过滤
   * @returns {Array} - 激活的规则数组
   */
  getActiveRules(category = null) {
    const active = this.customRules.filter(rule => rule.enabled && this.activeRules.has(rule.id));
    if (category) {
      return active.filter(rule => rule.category === category);
    }
    return active;
  }

  /**
   * 验证规则对象的有效性
   * @param {Object} rule - 规则对象
   * @returns {boolean} - 是否有效
   */
  validateRule(rule) {
    if (!rule || !rule.id) {
      console.error('Rule must have an ID');
      return false;
    }

    if (!rule.name && !rule.description) {
      console.error(`Rule ${rule.id} must have a name or description`);
      return false;
    }

    if (rule.pattern && typeof rule.pattern !== 'string' && !(rule.pattern instanceof RegExp)) {
      console.error(`Rule ${rule.id} pattern must be a string or RegExp`);
      return false;
    }

    if (rule.validator && typeof rule.validator !== 'function') {
      console.error(`Rule ${rule.id} validator must be a function`);
      return false;
    }

    return true;
  }

  /**
   * 批量添加规则
   * @param {Array} rules - 规则数组
   * @returns {Object} - 结果统计
   */
  addRules(rules) {
    let successCount = 0;
    let failCount = 0;
    const errors = [];

    for (const rule of rules) {
      if (this.addRule(rule)) {
        successCount++;
      } else {
        failCount++;
        errors.push(`Failed to add rule: ${rule.id}`);
      }
    }

    return {
      total: rules.length,
      success: successCount,
      failed: failCount,
      errors
    };
  }

  /**
   * 获取规则统计信息
   * @returns {Object} - 统计信息
   */
  getStatistics() {
    const total = this.customRules.length;
    const active = this.getActiveRules().length;
    const categories = Array.from(this.ruleCategories.keys());

    return {
      total,
      active,
      inactive: total - active,
      categories: categories.length,
      categoriesList: categories
    };
  }

  /**
   * 清空所有自定义规则
   */
  clearAllRules() {
    this.customRules = [];
    this.activeRules.clear();
    this.ruleCategories.clear();
    console.log('Cleared all custom rules');
  }

  /**
   * 导出自定义规则
   * @returns {Array} - 可序列化的规则数组
   */
  exportRules() {
    return this.customRules.map(rule => {
      // 移除函数属性，只保留可序列化的数据
      const serializableRule = { ...rule };
      if (serializableRule.validator) {
        delete serializableRule.validator;
      }
      return serializableRule;
    });
  }

  /**
   * 从JSON导入规则
   * @param {Array} rules - 规则数组
   * @param {Function} validators - 验证函数映射
   * @returns {Object} - 导入结果
   */
  importRules(rules, validators = {}) {
    const importedRules = [];
    
    for (const rule of rules) {
      // 如果提供了对应的验证函数，将其附加到规则上
      if (validators[rule.id]) {
        rule.validator = validators[rule.id];
      }
      importedRules.push(rule);
    }
    
    return this.addRules(importedRules);
  }

  /**
   * 保存规则到文件
   * @param {string} filePath - 文件路径
   * @returns {boolean} - 是否成功保存
   */
  saveToFile(filePath) {
    try {
      const fs = require('fs');
      const path = require('path');
      
      const rulesToSave = this.exportRules();
      const dir = path.dirname(filePath);
      
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      
      fs.writeFileSync(filePath, JSON.stringify(rulesToSave, null, 2), 'utf8');
      console.log(`Saved ${rulesToSave.length} rules to ${filePath}`);
      return true;
    } catch (error) {
      console.error(`Failed to save rules to ${filePath}:`, error.message);
      return false;
    }
  }

  /**
   * 从文件加载规则
   * @param {string} filePath - 文件路径
   * @returns {Object} - 加载结果
   */
  loadFromFile(filePath) {
    try {
      const fs = require('fs');
      if (!fs.existsSync(filePath)) {
        console.error(`Rules file not found: ${filePath}`);
        return { success: false, error: 'File not found' };
      }
      
      const content = fs.readFileSync(filePath, 'utf8');
      const rules = JSON.parse(content);
      
      return this.addRules(rules);
    } catch (error) {
      console.error(`Failed to load rules from ${filePath}:`, error.message);
      return { success: false, error: error.message };
    }
  }
}

module.exports = RuleExtensionAPI;