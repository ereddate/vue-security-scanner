const securityRules = require('./security-rules');
const path = require('path');
const ruleOptimizer = require('./rule-optimizer');
const regexOptimizer = require('./regex-optimizer');

const regexCache = new Map();
const contextCache = new Map();

// 初始化规则优化器
ruleOptimizer.initialize(securityRules);

function getCachedRegex(key, pattern, flags = 'gi') {
  if (!regexCache.has(key)) {
    regexCache.set(key, new RegExp(pattern, flags));
  }
  const regex = regexCache.get(key);
  regex.lastIndex = 0;
  return regex;
}

function clearRegexCache() {
  regexCache.clear();
  contextCache.clear();
}

function findAllMatches(str, regex) {
  const matches = [];
  let match;
  
  while ((match = regex.exec(str)) !== null) {
    matches.push(match);
    if (match.index === regex.lastIndex) {
      regex.lastIndex++;
    }
  }
  
  return matches;
}

function getLineNumber(str, index) {
  return str.substring(0, index).split('\n').length;
}

function extractContext(content, matchIndex, contextSize = 3) {
  const lines = content.split('\n');
  const matchLine = getLineNumber(content, matchIndex) - 1;
  
  const startLine = Math.max(0, matchLine - contextSize);
  const endLine = Math.min(lines.length - 1, matchLine + contextSize);
  
  const contextLines = [];
  for (let i = startLine; i <= endLine; i++) {
    contextLines.push({
      lineNumber: i + 1,
      content: lines[i],
      isMatchLine: i === matchLine
    });
  }
  
  return contextLines;
}

function analyzeDataFlow(content, matchIndex) {
  const lines = content.split('\n');
  const matchLine = getLineNumber(content, matchIndex) - 1;
  
  // Check for data flow patterns in surrounding code
  const dataFlowPatterns = [];
  
  // Look for variable assignments and function calls in the vicinity
  for (let i = Math.max(0, matchLine - 5); i <= Math.min(lines.length - 1, matchLine + 5); i++) {
    const line = lines[i];
    
    // Check for user input sources
    if (line.match(/req\.(query|params|body)/)) {
      dataFlowPatterns.push({ type: 'user-input', line: i + 1, content: line.trim() });
    }
    
    // Check for database queries
    if (line.match(/\.(find|query|select|execute)/)) {
      dataFlowPatterns.push({ type: 'database-operation', line: i + 1, content: line.trim() });
    }
    
    // Check for DOM manipulation
    if (line.match(/(innerHTML|outerHTML|insertAdjacentHTML|document\.write)/)) {
      dataFlowPatterns.push({ type: 'dom-manipulation', line: i + 1, content: line.trim() });
    }
  }
  
  return dataFlowPatterns;
}

function analyzeWithAdvancedRules(filePath, content, maxVulnerabilities = 100) {
  const vulnerabilities = [];
  let count = 0;
  
  // Get file extension for specialized analysis
  const fileExtension = path.extname(filePath).toLowerCase();
  
  // 使用规则优化器获取适用的规则
  const applicableRules = ruleOptimizer.getApplicableRules(filePath);
  
  // 应用优先级阈值过滤
  const priorityThreshold = 2; // 默认阈值
  const filteredRules = applicableRules.filter(rule => {
    const priority = ruleOptimizer.rulePriority.get(rule.id) || 1;
    return priority >= priorityThreshold;
  });
  
  // 限制每个文件的最大规则数
  const maxRulesPerFile = 100;
  const rulesToCheck = filteredRules.slice(0, maxRulesPerFile);
  
  // 快速检查：过滤掉不可能匹配的规则
  const possibleRuleIndices = [];
  const rulePatterns = [];
  
  rulesToCheck.forEach((rule, index) => {
    rule.patterns.forEach(patternConfig => {
      if (regexOptimizer.quickCheck(content, patternConfig.pattern)) {
        possibleRuleIndices.push({ ruleIndex: index, patternIndex: rule.patterns.indexOf(patternConfig) });
        rulePatterns.push(patternConfig.pattern);
      }
    });
  });
  
  // 如果没有可能的匹配，直接返回
  if (possibleRuleIndices.length === 0) {
    return vulnerabilities;
  }
  
  // 只对可能匹配的规则进行完整匹配
  for (const { ruleIndex, patternIndex } of possibleRuleIndices) {
    if (count >= maxVulnerabilities) break;
    
    const rule = rulesToCheck[ruleIndex];
    const patternConfig = rule.patterns[patternIndex];
    
    const { key, pattern, flags } = patternConfig;
    const regex = getCachedRegex(key, pattern, flags);
    const matches = findAllMatches(content, regex);
    
    for (const match of matches) {
      if (count >= maxVulnerabilities) break;
      
      const lineNumber = getLineNumber(content, match.index);
      const context = extractContext(content, match.index);
      const dataFlow = analyzeDataFlow(content, match.index);
      
      // Enhanced vulnerability analysis
      const severity = assessSeverity(rule, match, context, dataFlow, fileExtension);
      const confidence = assessConfidence(match, context, dataFlow);
      
      vulnerabilities.push({
        id: `${rule.id}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        type: rule.name,
        severity,
        confidence,
        file: filePath,
        line: lineNumber,
        description: rule.description,
        codeSnippet: match[0].substring(0, 100),
        recommendation: rule.recommendation,
        ruleId: rule.id,
        context,
        dataFlow,
        fileExtension
      });
      
      count++;
    }
  }
  
  return vulnerabilities;
}

function assessSeverity(rule, match, context, dataFlow, fileExtension) {
  // Base severity from rule
  let severity = rule.severity;
  
  // Adjust severity based on context
  const hasUserInput = dataFlow.some(pattern => pattern.type === 'user-input');
  const hasDomManipulation = dataFlow.some(pattern => pattern.type === 'dom-manipulation');
  const hasDatabaseOperation = dataFlow.some(pattern => pattern.type === 'database-operation');
  
  // Upgrade severity for critical combinations
  if (hasUserInput && hasDomManipulation && severity !== 'Critical') {
    severity = 'Critical';
  } else if (hasUserInput && hasDatabaseOperation && severity === 'Low') {
    severity = 'Medium';
  } else if (hasUserInput && severity === 'Medium') {
    severity = 'High';
  }
  
  // Adjust for file type
  if (fileExtension === '.vue' && rule.id.includes('xss')) {
    // XSS in Vue files is more critical
    if (severity === 'Medium') severity = 'High';
    else if (severity === 'High') severity = 'Critical';
  }
  
  return severity;
}

function assessConfidence(match, context, dataFlow) {
  let confidence = 'Medium'; // Default confidence
  
  // Increase confidence based on context indicators
  const hasUserInput = dataFlow.some(pattern => pattern.type === 'user-input');
  const hasExplicitDangerousPattern = match[0].match(/(innerHTML|eval|v-html|document\.write)/);
  
  if (hasUserInput && hasExplicitDangerousPattern) {
    confidence = 'High';
  } else if (hasUserInput || hasExplicitDangerousPattern) {
    confidence = 'Medium';
  } else {
    confidence = 'Low';
  }
  
  return confidence;
}

function analyzeWithRules(filePath, content) {
  return analyzeWithAdvancedRules(filePath, content, Infinity);
}

function analyzeWithRulesLimited(filePath, content, maxVulnerabilities = 100) {
  return analyzeWithAdvancedRules(filePath, content, maxVulnerabilities);
}

function getRulesCount() {
  return securityRules.length;
}

function getRuleById(ruleId) {
  return securityRules.find(rule => rule.id === ruleId);
}

function getRulesByCategory(category) {
  return securityRules.filter(rule => rule.category === category);
}

function getRulesBySeverity(severity) {
  return securityRules.filter(rule => rule.severity === severity);
}

module.exports = {
  analyzeWithRules,
  analyzeWithRulesLimited,
  analyzeWithAdvancedRules,
  clearRegexCache,
  getRulesCount,
  getRuleById,
  getRulesByCategory,
  getRulesBySeverity,
  getCachedRegex
};