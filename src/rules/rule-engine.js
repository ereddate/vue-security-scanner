const securityRules = require('./security-rules');
const path = require('path');

const regexCache = new Map();
const contextCache = new Map();

function getCachedRegex(key, pattern, flags = 'gi') {
  if (!regexCache.has(key)) {
    try {
      regexCache.set(key, new RegExp(pattern, flags));
    } catch (error) {
      console.error(`Invalid regex pattern for key "${key}": ${pattern}`);
      console.error(`Error: ${error.message}`);
      // Return a safe regex that won't match anything
      regexCache.set(key, new RegExp('^$'));
    }
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
  
  for (const rule of securityRules) {
    if (count >= maxVulnerabilities) break;
    
    for (const patternConfig of rule.patterns) {
      if (count >= maxVulnerabilities) break;
      
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