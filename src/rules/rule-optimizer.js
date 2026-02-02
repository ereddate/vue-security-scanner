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

    // 检测和解决规则冲突
    this.detectAndResolveRuleConflicts(rules);

    this.initialized = true;
    const endTime = Date.now();
    const fileTypeCount = Object.keys(this.fileTypeRules).length;
    const frameworkCount = Object.keys(this.frameworkRules).length;
    console.log(`Rule optimizer initialized in ${endTime - startTime}ms`);
    console.log(`File type categories: ${fileTypeCount}`);
    console.log(`Framework categories: ${frameworkCount}`);
  }

  /**
   * 检测和解决规则冲突
   * @param {Array} rules - 所有规则
   */
  detectAndResolveRuleConflicts(rules) {
    console.log('Detecting and resolving rule conflicts...');
    const startTime = Date.now();

    // 检测冲突
    const conflicts = this.detectRuleConflicts(rules);
    
    // 解决冲突
    if (conflicts.length > 0) {
      console.log(`Found ${conflicts.length} rule conflicts`);
      this.resolveRuleConflicts(conflicts, rules);
    } else {
      console.log('No rule conflicts detected');
    }

    const endTime = Date.now();
    console.log(`Conflict resolution completed in ${endTime - startTime}ms`);
  }

  /**
   * 检测规则冲突
   * @param {Array} rules - 所有规则
   * @returns {Array} 冲突列表
   */
  detectRuleConflicts(rules) {
    const conflicts = [];
    const ruleMap = new Map();

    // 构建规则映射
    rules.forEach(rule => {
      ruleMap.set(rule.id, rule);
    });

    // 检测冲突
    for (let i = 0; i < rules.length; i++) {
      const ruleA = rules[i];
      
      for (let j = i + 1; j < rules.length; j++) {
        const ruleB = rules[j];
        
        if (this.areRulesConflicting(ruleA, ruleB)) {
          conflicts.push({
            ruleA: ruleA.id,
            ruleB: ruleB.id,
            severity: this.calculateConflictSeverity(ruleA, ruleB),
            reason: this.getConflictReason(ruleA, ruleB)
          });
        }
      }
    }

    return conflicts;
  }

  /**
   * 检查两个规则是否冲突
   * @param {Object} ruleA - 规则A
   * @param {Object} ruleB - 规则B
   * @returns {boolean} 是否冲突
   */
  areRulesConflicting(ruleA, ruleB) {
    // 检查规则ID冲突
    if (ruleA.id === ruleB.id) {
      return true;
    }

    // 检查模式冲突
    if (ruleA.patterns && ruleB.patterns) {
      for (const patternA of ruleA.patterns) {
        for (const patternB of ruleB.patterns) {
          if (this.arePatternsConflicting(patternA, patternB)) {
            return true;
          }
        }
      }
    }

    // 检查文件类型冲突
    if (ruleA.fileTypes && ruleB.fileTypes) {
      const commonFileTypes = ruleA.fileTypes.filter(type => ruleB.fileTypes.includes(type));
      if (commonFileTypes.length > 0) {
        // 检查严重程度冲突
        if (this.areSeveritiesConflicting(ruleA.severity, ruleB.severity)) {
          return true;
        }
      }
    }

    return false;
  }

  /**
   * 检查两个模式是否冲突
   * @param {Object} patternA - 模式A
   * @param {Object} patternB - 模式B
   * @returns {boolean} 是否冲突
   */
  arePatternsConflicting(patternA, patternB) {
    if (!patternA.pattern || !patternB.pattern) {
      return false;
    }

    // 检查模式是否过于相似
    const similarity = this.calculatePatternSimilarity(patternA.pattern, patternB.pattern);
    return similarity > 0.8; // 相似度超过80%视为冲突
  }

  /**
   * 计算模式相似度
   * @param {string} pattern1 - 模式1
   * @param {string} pattern2 - 模式2
   * @returns {number} 相似度 (0-1)
   */
  calculatePatternSimilarity(pattern1, pattern2) {
    const len1 = pattern1.length;
    const len2 = pattern2.length;
    const maxLen = Math.max(len1, len2);
    
    if (maxLen === 0) {
      return 1;
    }

    // 简单的字符串相似度计算
    let matches = 0;
    for (let i = 0; i < Math.min(len1, len2); i++) {
      if (pattern1[i] === pattern2[i]) {
        matches++;
      }
    }

    return matches / maxLen;
  }

  /**
   * 检查两个严重程度是否冲突
   * @param {string} severityA - 严重程度A
   * @param {string} severityB - 严重程度B
   * @returns {boolean} 是否冲突
   */
  areSeveritiesConflicting(severityA, severityB) {
    const severityOrder = {
      'Critical': 4,
      'High': 3,
      'Medium': 2,
      'Low': 1
    };

    const levelA = severityOrder[severityA] || 0;
    const levelB = severityOrder[severityB] || 0;

    // 严重程度差异超过1级视为冲突
    return Math.abs(levelA - levelB) > 1;
  }

  /**
   * 计算冲突严重程度
   * @param {Object} ruleA - 规则A
   * @param {Object} ruleB - 规则B
   * @returns {string} 冲突严重程度
   */
  calculateConflictSeverity(ruleA, ruleB) {
    const severityOrder = {
      'Critical': 4,
      'High': 3,
      'Medium': 2,
      'Low': 1
    };

    const levelA = severityOrder[ruleA.severity] || 0;
    const levelB = severityOrder[ruleB.severity] || 0;
    const maxLevel = Math.max(levelA, levelB);

    const severityMap = {
      4: 'Critical',
      3: 'High',
      2: 'Medium',
      1: 'Low'
    };

    return severityMap[maxLevel] || 'Low';
  }

  /**
   * 获取冲突原因
   * @param {Object} ruleA - 规则A
   * @param {Object} ruleB - 规则B
   * @returns {string} 冲突原因
   */
  getConflictReason(ruleA, ruleB) {
    if (ruleA.id === ruleB.id) {
      return 'Duplicate rule ID';
    }

    if (ruleA.patterns && ruleB.patterns) {
      for (const patternA of ruleA.patterns) {
        for (const patternB of ruleB.patterns) {
          if (this.arePatternsConflicting(patternA, patternB)) {
            return 'Similar patterns';
          }
        }
      }
    }

    if (ruleA.fileTypes && ruleB.fileTypes) {
      const commonFileTypes = ruleA.fileTypes.filter(type => ruleB.fileTypes.includes(type));
      if (commonFileTypes.length > 0) {
        if (this.areSeveritiesConflicting(ruleA.severity, ruleB.severity)) {
          return 'Conflicting severities for same file types';
        }
      }
    }

    return 'Unknown conflict';
  }

  /**
   * 解决规则冲突
   * @param {Array} conflicts - 冲突列表
   * @param {Array} rules - 所有规则
   */
  resolveRuleConflicts(conflicts, rules) {
    const resolvedConflicts = [];

    conflicts.forEach(conflict => {
      const ruleA = rules.find(r => r.id === conflict.ruleA);
      const ruleB = rules.find(r => r.id === conflict.ruleB);

      if (!ruleA || !ruleB) {
        return;
      }

      // 应用冲突解决策略
      const resolution = this.applyConflictResolutionStrategy(ruleA, ruleB, conflict);
      resolvedConflicts.push({ ...conflict, resolution });
    });

    if (resolvedConflicts.length > 0) {
      console.log(`Resolved ${resolvedConflicts.length} rule conflicts`);
      // 可以在这里记录详细的冲突解决信息
    }
  }

  /**
   * 应用冲突解决策略
   * @param {Object} ruleA - 规则A
   * @param {Object} ruleB - 规则B
   * @param {Object} conflict - 冲突信息
   * @returns {string} 解决策略
   */
  applyConflictResolutionStrategy(ruleA, ruleB, conflict) {
    const priorityA = this.rulePriority.get(ruleA.id) || 0;
    const priorityB = this.rulePriority.get(ruleB.id) || 0;

    // 基于优先级解决冲突
    if (priorityA > priorityB) {
      return `Prioritized ${ruleA.id} over ${ruleB.id}`;
    } else if (priorityB > priorityA) {
      return `Prioritized ${ruleB.id} over ${ruleA.id}`;
    }

    // 基于严重程度解决冲突
    const severityOrder = {
      'Critical': 4,
      'High': 3,
      'Medium': 2,
      'Low': 1
    };

    const levelA = severityOrder[ruleA.severity] || 0;
    const levelB = severityOrder[ruleB.severity] || 0;

    if (levelA > levelB) {
      return `Prioritized ${ruleA.id} (${ruleA.severity}) over ${ruleB.id} (${ruleB.severity})`;
    } else if (levelB > levelA) {
      return `Prioritized ${ruleB.id} (${ruleB.severity}) over ${ruleA.id} (${ruleA.severity})`;
    }

    // 基于规则复杂度解决冲突（简单的优先）
    const complexityA = this.calculateRuleComplexity(ruleA);
    const complexityB = this.calculateRuleComplexity(ruleB);

    const complexityOrder = {
      'low': 1,
      'medium': 2,
      'high': 3
    };

    if (complexityOrder[complexityA] < complexityOrder[complexityB]) {
      return `Prioritized ${ruleA.id} (lower complexity) over ${ruleB.id}`;
    } else if (complexityOrder[complexityB] < complexityOrder[complexityA]) {
      return `Prioritized ${ruleB.id} (lower complexity) over ${ruleA.id}`;
    }

    // 基于规则ID解决冲突（保持稳定性）
    if (ruleA.id < ruleB.id) {
      return `Prioritized ${ruleA.id} over ${ruleB.id} (alphabetical)`;
    } else {
      return `Prioritized ${ruleB.id} over ${ruleA.id} (alphabetical)`;
    }
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
        priority = 10;
      } else if (rule.severity === 'High') {
        priority = 8;
      } else if (rule.severity === 'Medium') {
        priority = 5;
      } else if (rule.severity === 'Low') {
        priority = 3;
      }

      // 根据规则类型调整优先级
      const categoryPriority = {
        'injection': 3,
        'xss': 3,
        'secrets': 2,
        'authentication': 2,
        'authorization': 2,
        'csrf': 2,
        'input': 1,
        'memory': 1,
        'dom': 1,
        'business': 1
      };
      
      if (rule.category && categoryPriority[rule.category]) {
        priority += categoryPriority[rule.category];
      }

      // 根据规则复杂度调整优先级（复杂度低的优先执行）
      if (rule.patterns) {
        const complexity = this.calculateRuleComplexity(rule);
        if (complexity === 'low') {
          priority += 2;
        } else if (complexity === 'medium') {
          priority += 1;
        }
      }

      // 根据文件类型相关性调整优先级
      if (rule.fileTypes) {
        priority += 1;
      }

      this.rulePriority.set(rule.id, priority);
    });
  }

  /**
   * 计算规则复杂度
   * @param {Object} rule - 规则对象
   * @returns {string} 复杂度级别 (low, medium, high)
   */
  calculateRuleComplexity(rule) {
    if (!rule.patterns || rule.patterns.length === 0) {
      return 'low';
    }

    let complexity = 0;
    
    rule.patterns.forEach(patternConfig => {
      const pattern = patternConfig.pattern;
      // 基于正则表达式长度和复杂度指标计算
      if (pattern.length > 50) {
        complexity += 2;
      } else if (pattern.length > 20) {
        complexity += 1;
      }
      
      // 检查复杂正则特性
      if (pattern.includes('(?=') || pattern.includes('(?!') || pattern.includes('(?<=') || pattern.includes('(?<!')) {
        complexity += 2;
      }
      if (pattern.includes('*') || pattern.includes('+') || pattern.includes('{')) {
        complexity += 1;
      }
    });

    if (complexity >= 5) {
      return 'high';
    } else if (complexity >= 2) {
      return 'medium';
    } else {
      return 'low';
    }
  }

  /**
   * 根据文件路径获取适用的规则
   * @param {string} filePath - 文件路径
   * @param {Object} options - 选项
   * @returns {Array} - 适用的规则
   */
  getApplicableRules(filePath, options = {}) {
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

    // 过滤规则（如果有过滤条件）
    if (options.filter) {
      rules = rules.filter(options.filter);
    }

    // 根据优先级排序规则
    rules.sort((a, b) => {
      const priorityA = this.rulePriority.get(a.id) || 1;
      const priorityB = this.rulePriority.get(b.id) || 1;
      
      // 主要按优先级排序
      if (priorityA !== priorityB) {
        return priorityB - priorityA; // 降序排列，高优先级在前
      }
      
      // 优先级相同时，按复杂度排序（简单的在前）
      const complexityA = this.calculateRuleComplexity(a);
      const complexityB = this.calculateRuleComplexity(b);
      
      const complexityOrder = { 'low': 0, 'medium': 1, 'high': 2 };
      if (complexityOrder[complexityA] !== complexityOrder[complexityB]) {
        return complexityOrder[complexityA] - complexityOrder[complexityB];
      }
      
      // 复杂度相同时，按规则ID排序（保持稳定性）
      return a.id.localeCompare(b.id);
    });

    // 分组规则（用于批量处理）
    if (options.group) {
      return this.groupRulesByPriority(rules);
    }

    return rules;
  }

  /**
   * 按优先级分组规则
   * @param {Array} rules - 规则数组
   * @returns {Array} - 分组后的规则
   */
  groupRulesByPriority(rules) {
    const groups = [];
    let currentGroup = [];
    let currentPriority = null;

    rules.forEach(rule => {
      const priority = this.rulePriority.get(rule.id) || 1;
      
      if (currentPriority === null) {
        currentPriority = priority;
      }
      
      if (priority === currentPriority) {
        currentGroup.push(rule);
      } else {
        if (currentGroup.length > 0) {
          groups.push({
            priority: currentPriority,
            rules: currentGroup
          });
        }
        currentGroup = [rule];
        currentPriority = priority;
      }
    });

    if (currentGroup.length > 0) {
      groups.push({
        priority: currentPriority,
        rules: currentGroup
      });
    }

    return groups;
  }

  /**
   * 分析规则依赖关系
   * @param {Array} rules - 规则数组
   * @returns {Object} - 依赖关系图
   */
  analyzeRuleDependencies(rules) {
    const dependencies = {};
    
    rules.forEach(rule => {
      dependencies[rule.id] = {
        dependsOn: [],
        requiredBy: []
      };
      
      // 分析规则间的依赖关系
      // 例如：某些规则可能需要在其他规则执行后再执行
      if (rule.category === 'business') {
        // 业务逻辑规则可能依赖于安全规则
        dependencies[rule.id].dependsOn = rules
          .filter(r => r.category === 'injection' || r.category === 'xss')
          .map(r => r.id);
      }
    });
    
    // 反向依赖
    rules.forEach(rule => {
      const ruleDeps = dependencies[rule.id];
      ruleDeps.dependsOn.forEach(depId => {
        if (dependencies[depId]) {
          dependencies[depId].requiredBy.push(rule.id);
        }
      });
    });
    
    return dependencies;
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