const securityRules = require('./security-rules');

const regexCache = new Map();

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

function analyzeWithRules(filePath, content) {
  const vulnerabilities = [];
  
  for (const rule of securityRules) {
    for (const patternConfig of rule.patterns) {
      const { key, pattern, flags } = patternConfig;
      const regex = getCachedRegex(key, pattern, flags);
      const matches = findAllMatches(content, regex);
      
      for (const match of matches) {
        vulnerabilities.push({
          id: `${rule.id}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          type: rule.name,
          severity: rule.severity,
          file: filePath,
          line: getLineNumber(content, match.index),
          description: rule.description,
          codeSnippet: match[0].substring(0, 100),
          recommendation: rule.recommendation,
          ruleId: rule.id
        });
      }
    }
  }
  
  return vulnerabilities;
}

function analyzeWithRulesLimited(filePath, content, maxVulnerabilities = 100) {
  const vulnerabilities = [];
  let count = 0;
  
  for (const rule of securityRules) {
    if (count >= maxVulnerabilities) break;
    
    for (const patternConfig of rule.patterns) {
      if (count >= maxVulnerabilities) break;
      
      const { key, pattern, flags } = patternConfig;
      const regex = getCachedRegex(key, pattern, flags);
      const matches = findAllMatches(content, regex);
      
      for (const match of matches) {
        if (count >= maxVulnerabilities) break;
        
        vulnerabilities.push({
          id: `${rule.id}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          type: rule.name,
          severity: rule.severity,
          file: filePath,
          line: getLineNumber(content, match.index),
          description: rule.description,
          codeSnippet: match[0].substring(0, 100),
          recommendation: rule.recommendation,
          ruleId: rule.id
        });
        
        count++;
      }
    }
  }
  
  return vulnerabilities;
}

function getRulesCount() {
  return securityRules.length;
}

function getRuleById(ruleId) {
  return securityRules.find(rule => rule.id === ruleId);
}

module.exports = {
  analyzeWithRules,
  analyzeWithRulesLimited,
  clearRegexCache,
  getRulesCount,
  getRuleById,
  getCachedRegex
};