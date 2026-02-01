const fs = require('fs');
const path = require('path');

class EnhancedRuleEngine {
  constructor() {
    this.ruleCache = new Map();
    this.contextCache = new Map();
    this.whitelist = new Set();
    this.loadWhitelist();
  }

  /**
   * 加载白名单规则
   */
  loadWhitelist() {
    const whitelistPath = path.join(__dirname, '.vue-security-whitelist.json');
    if (fs.existsSync(whitelistPath)) {
      try {
        const whitelist = JSON.parse(fs.readFileSync(whitelistPath, 'utf8'));
        whitelist.forEach(item => {
          if (item.pattern) {
            this.whitelist.add(item.pattern);
          }
          if (item.file) {
            this.whitelist.add(item.file);
          }
          if (item.line) {
            this.whitelist.add(`${item.file}:${item.line}`);
          }
        });
      } catch (error) {
        console.warn('Failed to load whitelist:', error.message);
      }
    }
  }

  /**
   * 检查是否在白名单中
   * @param {string} pattern - 模式或文件路径
   * @param {string} filePath - 文件路径
   * @param {number} lineNumber - 行号
   * @returns {boolean} 是否在白名单中
   */
  isInWhitelist(pattern, filePath, lineNumber) {
    const fileKey = path.basename(filePath);
    const lineKey = `${fileKey}:${lineNumber}`;
    
    return this.whitelist.has(pattern) || 
           this.whitelist.has(fileKey) || 
           this.whitelist.has(lineKey);
  }

  /**
   * 增强的模式匹配，支持上下文感知
   * @param {string} content - 文件内容
   * @param {string} pattern - 正则表达式模式
   * @param {string} filePath - 文件路径
   * @param {number} lineNumber - 行号
   * @returns {Object} 匹配结果
   */
  enhancedPatternMatch(content, pattern, filePath, lineNumber) {
    const matches = [];
    const lines = content.split('\n');
    
    try {
      const regex = new RegExp(pattern, 'gi');
      
      lines.forEach((line, index) => {
        const lineNum = index + 1;
        const match = regex.exec(line);
        
        if (match) {
          const context = this.getContext(lines, index, 3);
          const confidence = this.calculateConfidence(match, context, line, filePath);
          
          matches.push({
            line: lineNum,
            match: match[0],
            context: context,
            confidence: confidence,
            position: match.index
          });
        }
      });
    } catch (error) {
      console.warn(`Invalid regex pattern: ${pattern}`, error.message);
    }
    
    return matches;
  }

  /**
   * 获取上下文信息
   * @param {Array} lines - 所有行
   * @param {number} lineIndex - 当前行索引
   * @param {number} contextSize - 上下文大小
   * @returns {Object} 上下文信息
   */
  getContext(lines, lineIndex, contextSize) {
    const start = Math.max(0, lineIndex - contextSize);
    const end = Math.min(lines.length - 1, lineIndex + contextSize);
    
    return {
      before: lines.slice(start, lineIndex).join('\n'),
      after: lines.slice(lineIndex + 1, end + 1).join('\n'),
      current: lines[lineIndex]
    };
  }

  /**
   * 计算匹配置信度
   * @param {Array} match - 匹配结果
   * @param {Object} context - 上下文信息
   * @param {string} line - 当前行
   * @param {string} filePath - 文件路径
   * @returns {string} 置信度 (High/Medium/Low)
   */
  calculateConfidence(match, context, line, filePath) {
    let confidenceScore = 0;
    
    // 检查是否在注释中
    const isComment = line.trim().startsWith('//') || 
                     line.trim().startsWith('#') || 
                     line.trim().startsWith('*') ||
                     line.includes('/*') || 
                     line.includes('*/');
    if (isComment) {
      confidenceScore -= 30;
    }
    
    // 检查是否在字符串中
    const isInString = (line.match(/["']/g) || []).length % 2 === 1;
    if (isInString) {
      confidenceScore -= 20;
    }
    
    // 检查上下文是否包含安全关键词
    const securityKeywords = ['password', 'secret', 'key', 'token', 'auth', 'credential'];
    const hasSecurityKeyword = securityKeywords.some(keyword => 
      line.toLowerCase().includes(keyword) || 
      context.before.toLowerCase().includes(keyword) ||
      context.after.toLowerCase().includes(keyword)
    );
    if (hasSecurityKeyword) {
      confidenceScore += 40;
    }
    
    // 检查是否在配置文件中
    const isConfigFile = filePath.endsWith('.json') || 
                        filePath.endsWith('.yaml') || 
                        filePath.endsWith('.yml') ||
                        filePath.endsWith('.config.js') ||
                        filePath.includes('config');
    if (isConfigFile) {
      confidenceScore += 20;
    }
    
    // 检查匹配长度
    if (match[0] && match[0].length > 10) {
      confidenceScore += 10;
    }
    
    // 计算最终置信度
    if (confidenceScore >= 50) {
      return 'High';
    } else if (confidenceScore >= 20) {
      return 'Medium';
    } else {
      return 'Low';
    }
  }

  /**
   * 缓存规则编译结果
   * @param {string} ruleId - 规则ID
   * @param {RegExp} compiledPattern - 编译后的正则表达式
   */
  cacheRule(ruleId, compiledPattern) {
    this.ruleCache.set(ruleId, {
      pattern: compiledPattern,
      timestamp: Date.now()
    });
  }

  /**
   * 获取缓存的规则
   * @param {string} ruleId - 规则ID
   * @param {number} maxAge - 最大缓存时间（毫秒）
   * @returns {RegExp|null} 编译后的正则表达式
   */
  getCachedRule(ruleId, maxAge = 3600000) {
    const cached = this.ruleCache.get(ruleId);
    if (cached && (Date.now() - cached.timestamp) < maxAge) {
      return cached.pattern;
    }
    return null;
  }

  /**
   * 清理过期缓存
   * @param {number} maxAge - 最大缓存时间（毫秒）
   */
  clearExpiredCache(maxAge = 3600000) {
    const now = Date.now();
    for (const [key, value] of this.ruleCache.entries()) {
      if ((now - value.timestamp) > maxAge) {
        this.ruleCache.delete(key);
      }
    }
  }

  /**
   * 增强的规则执行
   * @param {Array} rules - 规则数组
   * @param {string} content - 文件内容
   * @param {string} filePath - 文件路径
   * @returns {Array} 检测结果
   */
  executeRules(rules, content, filePath) {
    const results = [];
    const lines = content.split('\n');
    
    rules.forEach(rule => {
      if (!rule.patterns) return;
      
      rule.patterns.forEach(patternConfig => {
        const pattern = patternConfig.pattern;
        
        // 检查白名单
        if (this.isInWhitelist(pattern, filePath, 0)) {
          return;
        }
        
        // 使用缓存的规则
        let regex = this.getCachedRule(rule.id + '_' + patternConfig.key);
        if (!regex) {
          try {
            regex = new RegExp(pattern, 'gi');
            this.cacheRule(rule.id + '_' + patternConfig.key, regex);
          } catch (error) {
            console.warn(`Invalid regex in rule ${rule.id}:`, error.message);
            return;
          }
        }
        
        // 执行匹配
        let match;
        let lineIndex = 0;
        while ((match = regex.exec(content)) !== null) {
          const lineNumber = this.getLineNumber(content, match.index);
          const context = this.getContext(lines, lineNumber - 1, 3);
          const confidence = this.calculateConfidence(match, context, lines[lineNumber - 1], filePath);
          
          // 只添加高置信度的结果
          if (confidence !== 'Low') {
            results.push({
              ruleId: rule.id,
              ruleName: rule.name,
              severity: rule.severity,
              description: rule.description,
              recommendation: rule.recommendation,
              patternKey: patternConfig.key,
              match: match[0],
              line: lineNumber,
              file: filePath,
              context: context,
              confidence: confidence
            });
          }
          
          // 防止无限循环
          regex.lastIndex = match.index + 1;
          lineIndex++;
          
          // 限制每个规则的最大匹配数
          if (lineIndex > 100) break;
        }
      });
    });
    
    return results;
  }

  /**
   * 获取匹配的行号
   * @param {string} content - 文件内容
   * @param {number} index - 匹配位置
   * @returns {number} 行号
   */
  getLineNumber(content, index) {
    const beforeMatch = content.substring(0, index);
    return beforeMatch.split('\n').length;
  }

  /**
   * 去重结果
   * @param {Array} results - 检测结果
   * @returns {Array} 去重后的结果
   */
  deduplicateResults(results) {
    const seen = new Set();
    return results.filter(result => {
      const key = `${result.ruleId}:${result.file}:${result.line}:${result.match}`;
      if (seen.has(key)) {
        return false;
      }
      seen.add(key);
      return true;
    });
  }

  /**
   * 按置信度过滤结果
   * @param {Array} results - 检测结果
   * @param {string} minConfidence - 最小置信度
   * @returns {Array} 过滤后的结果
   */
  filterByConfidence(results, minConfidence = 'Medium') {
    const confidenceOrder = { 'High': 3, 'Medium': 2, 'Low': 1 };
    const minScore = confidenceOrder[minConfidence] || 2;
    
    return results.filter(result => {
      const score = confidenceOrder[result.confidence] || 0;
      return score >= minScore;
    });
  }
}

module.exports = EnhancedRuleEngine;