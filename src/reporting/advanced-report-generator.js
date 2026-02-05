const fs = require('fs');
const path = require('path');
const IntelligentVulnerabilityAnalyzer = require('../ai/intelligent-vulnerability-analyzer');

class AdvancedReportGenerator {
  constructor(config = {}) {
    this.config = config;
    this.reportHistoryPath = config.reportHistoryPath || path.join(process.cwd(), '.vue-security-reports');
    this.maxHistorySize = config.maxHistorySize || 100;
    this.complianceStandards = config.complianceStandards || ['OWASP', 'GDPR', 'HIPAA', 'PCI-DSS', 'SOX'];
    
    // 初始化智能漏洞分析器以使用LLM功能
    this.intelligentAnalyzer = new IntelligentVulnerabilityAnalyzer({
      ...config.ai,
      enableLLMIntegration: config.enableLLMIntegration !== false
    });
  }

  async generateAdvancedReport(scanResult, options = {}) {
    // 增强漏洞信息，添加AI驱动的解释和修复建议
    const enhancedVulnerabilities = await this.enhanceVulnerabilitiesWithAI(scanResult.vulnerabilities || []);
    
    const report = {
      ...scanResult,
      vulnerabilities: enhancedVulnerabilities,
      advancedAnalysis: this.performAdvancedAnalysis({ ...scanResult, vulnerabilities: enhancedVulnerabilities }),
      compliance: this.performComplianceCheck({ ...scanResult, vulnerabilities: enhancedVulnerabilities }),
      trends: this.analyzeTrends({ ...scanResult, vulnerabilities: enhancedVulnerabilities }),
      recommendations: this.generateRecommendations({ ...scanResult, vulnerabilities: enhancedVulnerabilities }),
      aiAnalysis: this.performAIAnalysis(enhancedVulnerabilities),
      metadata: {
        generatedAt: new Date().toISOString(),
        scannerVersion: '1.2.1',
        reportType: 'advanced',
        aiEnhanced: enhancedVulnerabilities.some(v => v.aiExplanation || v.aiRecommendation)
      }
    };

    return report;
  }

  /**
   * 使用AI增强漏洞信息
   * @param {Array} vulnerabilities - 漏洞数组
   * @returns {Promise<Array>} 增强后的漏洞数组
   */
  async enhanceVulnerabilitiesWithAI(vulnerabilities) {
    if (!this.intelligentAnalyzer || vulnerabilities.length === 0) {
      return vulnerabilities;
    }

    const enhancedVulnerabilities = [];
    
    // 限制并发处理，避免API速率限制
    const concurrencyLimit = 3;
    const batches = [];
    
    for (let i = 0; i < vulnerabilities.length; i += concurrencyLimit) {
      batches.push(vulnerabilities.slice(i, i + concurrencyLimit));
    }

    for (const batch of batches) {
      const batchPromises = batch.map(async (vuln) => {
        try {
          // 生成漏洞解释
          const explanation = await this.intelligentAnalyzer.generateVulnerabilityExplanation(
            vuln, 
            vuln.matchedContent || ''
          );
          
          // 生成修复建议
          const recommendation = await this.intelligentAnalyzer.generateFixRecommendation(
            vuln, 
            vuln.matchedContent || ''
          );
          
          // 生成智能规则
          const intelligentRule = await this.intelligentAnalyzer.generateIntelligentRule(
            vuln, 
            vuln.matchedContent || ''
          );
          
          return {
            ...vuln,
            aiExplanation: explanation,
            aiRecommendation: recommendation,
            aiGeneratedRule: intelligentRule
          };
        } catch (error) {
          console.warn('Error enhancing vulnerability with AI:', error.message);
          return vuln;
        }
      });

      const batchResults = await Promise.all(batchPromises);
      enhancedVulnerabilities.push(...batchResults);
    }

    return enhancedVulnerabilities;
  }

  /**
   * 执行AI分析
   * @param {Array} vulnerabilities - 增强后的漏洞数组
   * @returns {Object} AI分析结果
   */
  performAIAnalysis(vulnerabilities) {
    const aiEnhancedVulns = vulnerabilities.filter(v => v.aiExplanation || v.aiRecommendation);
    const aiRuleGeneratedVulns = vulnerabilities.filter(v => v.aiGeneratedRule);
    
    return {
      enhancedVulnerabilitiesCount: aiEnhancedVulns.length,
      ruleGeneratedVulnerabilitiesCount: aiRuleGeneratedVulns.length,
      totalVulnerabilities: vulnerabilities.length,
      enhancementRate: vulnerabilities.length > 0 
        ? ((aiEnhancedVulns.length / vulnerabilities.length) * 100).toFixed(2)
        : '0.00',
      ruleGenerationRate: vulnerabilities.length > 0
        ? ((aiRuleGeneratedVulns.length / vulnerabilities.length) * 100).toFixed(2)
        : '0.00',
      summary: `AI enhanced ${aiEnhancedVulns.length} out of ${vulnerabilities.length} vulnerabilities with detailed explanations and fix recommendations. Generated ${aiRuleGeneratedVulns.length} intelligent rules for future detection.`
    };
  }

  performAdvancedAnalysis(scanResult) {
    const vulnerabilities = scanResult.vulnerabilities || [];
    const summary = scanResult.summary || {};

    return {
      vulnerabilityDistribution: this.analyzeVulnerabilityDistribution(vulnerabilities),
      severityBreakdown: this.analyzeSeverityBreakdown(vulnerabilities),
      topVulnerableFiles: this.getTopVulnerableFiles(vulnerabilities),
      vulnerabilityTypes: this.analyzeVulnerabilityTypes(vulnerabilities),
      cweMapping: this.analyzeCWEMapping(vulnerabilities),
      owaspMapping: this.analyzeOWASPMapping(vulnerabilities),
      fixComplexity: this.analyzeFixComplexity(vulnerabilities),
      confidenceAnalysis: this.analyzeConfidence(vulnerabilities)
    };
  }

  analyzeVulnerabilityDistribution(vulnerabilities) {
    const distribution = {};

    vulnerabilities.forEach(vuln => {
      const ruleId = vuln.ruleId || 'unknown';
      distribution[ruleId] = (distribution[ruleId] || 0) + 1;
    });

    return Object.entries(distribution)
      .sort((a, b) => b[1] - a[1])
      .map(([ruleId, count]) => ({ ruleId, count }));
  }

  analyzeSeverityBreakdown(vulnerabilities) {
    const breakdown = {
      critical: 0,
      high: 0,
      medium: 0,
      low: 0
    };

    vulnerabilities.forEach(vuln => {
      const severity = (vuln.severity || 'low').toLowerCase();
      if (breakdown[severity] !== undefined) {
        breakdown[severity]++;
      }
    });

    const total = vulnerabilities.length || 1;
    return {
      ...breakdown,
      percentages: {
        critical: ((breakdown.critical / total) * 100).toFixed(2),
        high: ((breakdown.high / total) * 100).toFixed(2),
        medium: ((breakdown.medium / total) * 100).toFixed(2),
        low: ((breakdown.low / total) * 100).toFixed(2)
      }
    };
  }

  getTopVulnerableFiles(vulnerabilities, limit = 10) {
    const fileCounts = {};

    vulnerabilities.forEach(vuln => {
      const file = vuln.file || 'unknown';
      fileCounts[file] = (fileCounts[file] || 0) + 1;
    });

    return Object.entries(fileCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, limit)
      .map(([file, count]) => ({ file, count }));
  }

  analyzeVulnerabilityTypes(vulnerabilities) {
    const types = {};

    vulnerabilities.forEach(vuln => {
      const type = this.categorizeVulnerability(vuln);
      types[type] = (types[type] || 0) + 1;
    });

    return Object.entries(types)
      .sort((a, b) => b[1] - a[1])
      .map(([type, count]) => ({ type, count }));
  }

  categorizeVulnerability(vuln) {
    const ruleId = vuln.ruleId || '';
    const name = vuln.name || '';

    if (ruleId.includes('xss') || name.includes('XSS')) return 'Cross-Site Scripting (XSS)';
    if (ruleId.includes('sql') || name.includes('SQL')) return 'SQL Injection';
    if (ruleId.includes('csrf') || name.includes('CSRF')) return 'Cross-Site Request Forgery (CSRF)';
    if (ruleId.includes('injection') || name.includes('Injection')) return 'Injection';
    if (ruleId.includes('hardcoded') || ruleId.includes('secret') || ruleId.includes('password')) return 'Hardcoded Secrets';
    if (ruleId.includes('dependency') || ruleId.includes('outdated')) return 'Dependency Issues';
    if (ruleId.includes('cookie') || ruleId.includes('session')) return 'Session/Cookie Security';
    if (ruleId.includes('crypto') || ruleId.includes('encryption') || ruleId.includes('random')) return 'Cryptography';
    if (ruleId.includes('memory') || ruleId.includes('leak')) return 'Memory Issues';
    if (ruleId.includes('prototype') || ruleId.includes('pollution')) return 'Prototype Pollution';
    if (ruleId.includes('vue')) return 'Vue.js Specific';
    if (ruleId.includes('api')) return 'API Security';
    if (ruleId.includes('auth') || ruleId.includes('authentication')) return 'Authentication';
    if (ruleId.includes('authorization') || ruleId.includes('access')) return 'Authorization';

    return 'Other';
  }

  analyzeCWEMapping(vulnerabilities) {
    const cweMap = {};

    vulnerabilities.forEach(vuln => {
      const cwe = vuln.cwe || 'CWE-16';
      cweMap[cwe] = (cweMap[cwe] || 0) + 1;
    });

    return Object.entries(cweMap)
      .sort((a, b) => b[1] - a[1])
      .map(([cwe, count]) => ({ cwe, count }));
  }

  analyzeOWASPMapping(vulnerabilities) {
    const owaspMap = {};

    vulnerabilities.forEach(vuln => {
      const category = vuln.owaspCategory || 'A05:2021 – Security Misconfiguration';
      owaspMap[category] = (owaspMap[category] || 0) + 1;
    });

    return Object.entries(owaspMap)
      .sort((a, b) => b[1] - a[1])
      .map(([category, count]) => ({ category, count }));
  }

  analyzeFixComplexity(vulnerabilities) {
    const complexity = {
      high: 0,
      medium: 0,
      low: 0
    };

    vulnerabilities.forEach(vuln => {
      const fixComplexity = (vuln.fixComplexity || 'low').toLowerCase();
      if (complexity[fixComplexity] !== undefined) {
        complexity[fixComplexity]++;
      }
    });

    return complexity;
  }

  analyzeConfidence(vulnerabilities) {
    const confidence = {
      high: 0,
      medium: 0,
      low: 0
    };

    vulnerabilities.forEach(vuln => {
      const conf = (vuln.confidence || 'medium').toLowerCase();
      if (confidence[conf] !== undefined) {
        confidence[conf]++;
      }
    });

    return confidence;
  }

  performComplianceCheck(scanResult) {
    const vulnerabilities = scanResult.vulnerabilities || [];
    const summary = scanResult.summary || {};

    return {
      owasp: this.checkOWASPCompliance(vulnerabilities),
      gdpr: this.checkGDPRCompliance(vulnerabilities),
      hipaa: this.checkHIPAACompliance(vulnerabilities),
      pciDss: this.checkPCIDSSCompliance(vulnerabilities),
      sox: this.checkSOXCompliance(vulnerabilities),
      overallScore: this.calculateOverallComplianceScore(vulnerabilities)
    };
  }

  checkOWASPCompliance(vulnerabilities) {
    const criticalVulns = vulnerabilities.filter(v => 
      v.severity === 'Critical' || v.severity === 'High'
    );

    const owaspCategories = this.analyzeOWASPMapping(vulnerabilities);
    
    return {
      compliant: criticalVulns.length === 0,
      score: this.calculateComplianceScore(criticalVulns.length, vulnerabilities.length),
      criticalVulnerabilities: criticalVulns.length,
      topRisks: owaspCategories.slice(0, 3),
      recommendations: this.getOWASPRecommendations(vulnerabilities)
    };
  }

  checkGDPRCompliance(vulnerabilities) {
    const gdprRelevantVulns = vulnerabilities.filter(v => {
      const ruleId = v.ruleId || '';
      const name = v.name || '';
      return ruleId.includes('information-disclosure') ||
             ruleId.includes('sensitive-data') ||
             name.includes('sensitive') ||
             name.includes('PII') ||
             name.includes('personal');
    });

    return {
      compliant: gdprRelevantVulns.length === 0,
      score: this.calculateComplianceScore(gdprRelevantVulns.length, vulnerabilities.length),
      relevantVulnerabilities: gdprRelevantVulns.length,
      recommendations: this.getGDPRRecommendations(vulnerabilities)
    };
  }

  checkHIPAACompliance(vulnerabilities) {
    const hipaaRelevantVulns = vulnerabilities.filter(v => {
      const ruleId = v.ruleId || '';
      const name = v.name || '';
      return ruleId.includes('insecure-storage') ||
             ruleId.includes('insecure-communication') ||
             ruleId.includes('encryption') ||
             name.includes('HIPAA') ||
             name.includes('health');
    });

    return {
      compliant: hipaaRelevantVulns.length === 0,
      score: this.calculateComplianceScore(hipaaRelevantVulns.length, vulnerabilities.length),
      relevantVulnerabilities: hipaaRelevantVulns.length,
      recommendations: this.getHIPAARecommendations(vulnerabilities)
    };
  }

  checkPCIDSSCompliance(vulnerabilities) {
    const pciRelevantVulns = vulnerabilities.filter(v => {
      const ruleId = v.ruleId || '';
      const name = v.name || '';
      return ruleId.includes('xss') ||
             ruleId.includes('injection') ||
             ruleId.includes('crypto') ||
             ruleId.includes('authentication') ||
             name.includes('PCI');
    });

    return {
      compliant: pciRelevantVulns.length === 0,
      score: this.calculateComplianceScore(pciRelevantVulns.length, vulnerabilities.length),
      relevantVulnerabilities: pciRelevantVulns.length,
      recommendations: this.getPCIDSSRecommendations(vulnerabilities)
    };
  }

  checkSOXCompliance(vulnerabilities) {
    const soxRelevantVulns = vulnerabilities.filter(v => {
      const ruleId = v.ruleId || '';
      const name = v.name || '';
      return ruleId.includes('hardcoded-secret') ||
             ruleId.includes('access-control') ||
             ruleId.includes('audit') ||
             name.includes('SOX');
    });

    return {
      compliant: soxRelevantVulns.length === 0,
      score: this.calculateComplianceScore(soxRelevantVulns.length, vulnerabilities.length),
      relevantVulnerabilities: soxRelevantVulns.length,
      recommendations: this.getSOXRecommendations(vulnerabilities)
    };
  }

  calculateComplianceScore(criticalCount, totalCount) {
    if (totalCount === 0) return 100;
    const score = ((totalCount - criticalCount) / totalCount) * 100;
    return Math.max(0, Math.min(100, score)).toFixed(2);
  }

  calculateOverallComplianceScore(vulnerabilities) {
    const criticalVulns = vulnerabilities.filter(v => 
      v.severity === 'Critical' || v.severity === 'High'
    ).length;

    const highVulns = vulnerabilities.filter(v => v.severity === 'High').length;
    const mediumVulns = vulnerabilities.filter(v => v.severity === 'Medium').length;
    const total = vulnerabilities.length || 1;

    const score = 100 - ((criticalVulns * 10) + (highVulns * 5) + (mediumVulns * 2)) / total;
    return Math.max(0, Math.min(100, score)).toFixed(2);
  }

  getOWASPRecommendations(vulnerabilities) {
    const recommendations = [];
    const criticalVulns = vulnerabilities.filter(v => 
      v.severity === 'Critical' || v.severity === 'High'
    );

    if (criticalVulns.length > 0) {
      recommendations.push('Address all Critical and High severity vulnerabilities immediately');
      recommendations.push('Implement input validation and output encoding');
      recommendations.push('Use parameterized queries for database access');
      recommendations.push('Implement proper authentication and authorization');
    }

    return recommendations;
  }

  getGDPRRecommendations(vulnerabilities) {
    const recommendations = [];
    const gdprVulns = vulnerabilities.filter(v => 
      v.ruleId.includes('information-disclosure') ||
      v.ruleId.includes('sensitive-data')
    );

    if (gdprVulns.length > 0) {
      recommendations.push('Implement data encryption at rest and in transit');
      recommendations.push('Ensure proper data access controls');
      recommendations.push('Implement data minimization principles');
      recommendations.push('Conduct regular data protection impact assessments');
    }

    return recommendations;
  }

  getHIPAARecommendations(vulnerabilities) {
    const recommendations = [];
    const hipaaVulns = vulnerabilities.filter(v => 
      v.ruleId.includes('insecure-storage') ||
      v.ruleId.includes('insecure-communication')
    );

    if (hipaaVulns.length > 0) {
      recommendations.push('Implement strong encryption for PHI storage');
      recommendations.push('Use secure communication channels (TLS 1.2+)');
      recommendations.push('Implement audit logging for all PHI access');
      recommendations.push('Conduct regular security assessments');
    }

    return recommendations;
  }

  getPCIDSSRecommendations(vulnerabilities) {
    const recommendations = [];
    const pciVulns = vulnerabilities.filter(v => 
      v.ruleId.includes('xss') ||
      v.ruleId.includes('injection')
    );

    if (pciVulns.length > 0) {
      recommendations.push('Implement web application firewall (WAF)');
      recommendations.push('Regularly update and patch systems');
      recommendations.push('Implement secure coding practices');
      recommendations.push('Conduct regular penetration testing');
    }

    return recommendations;
  }

  getSOXRecommendations(vulnerabilities) {
    const recommendations = [];
    const soxVulns = vulnerabilities.filter(v => 
      v.ruleId.includes('hardcoded-secret') ||
      v.ruleId.includes('access-control')
    );

    if (soxVulns.length > 0) {
      recommendations.push('Implement proper access controls');
      recommendations.push('Remove hardcoded credentials');
      recommendations.push('Implement audit trails');
      recommendations.push('Conduct regular security audits');
    }

    return recommendations;
  }

  analyzeTrends(scanResult) {
    const history = this.loadReportHistory();
    const currentReport = this.createHistoryEntry(scanResult);
    
    this.saveReportHistory(currentReport);

    if (history.length === 0) {
      return {
        trend: 'stable',
        change: 0,
        period: 'No historical data available',
        recommendations: ['Continue monitoring security posture']
      };
    }

    const previousReport = history[history.length - 1];
    const currentCount = scanResult.summary.totalVulnerabilities || 0;
    const previousCount = previousReport.summary.totalVulnerabilities || 0;

    const change = currentCount - previousCount;
    const changePercent = previousCount > 0 ? ((change / previousCount) * 100).toFixed(2) : 0;

    let trend = 'stable';
    if (change > 0) trend = 'increasing';
    else if (change < 0) trend = 'decreasing';

    return {
      trend,
      change,
      changePercent,
      period: `Compared to previous scan (${previousReport.scannedAt})`,
      currentCount,
      previousCount,
      recommendations: this.getTrendRecommendations(trend, changePercent)
    };
  }

  createHistoryEntry(scanResult) {
    return {
      scannedAt: new Date().toISOString(),
      summary: scanResult.summary,
      vulnerabilities: scanResult.vulnerabilities.map(v => ({
        ruleId: v.ruleId,
        severity: v.severity,
        file: v.file
      }))
    };
  }

  loadReportHistory() {
    try {
      if (!fs.existsSync(this.reportHistoryPath)) {
        return [];
      }

      const historyFile = path.join(this.reportHistoryPath, 'history.json');
      if (!fs.existsSync(historyFile)) {
        return [];
      }

      const history = JSON.parse(fs.readFileSync(historyFile, 'utf8'));
      return history.slice(-this.maxHistorySize);
    } catch (error) {
      console.error('Error loading report history:', error.message);
      return [];
    }
  }

  saveReportHistory(entry) {
    try {
      if (!fs.existsSync(this.reportHistoryPath)) {
        fs.mkdirSync(this.reportHistoryPath, { recursive: true });
      }

      const historyFile = path.join(this.reportHistoryPath, 'history.json');
      const history = this.loadReportHistory();
      history.push(entry);

      fs.writeFileSync(historyFile, JSON.stringify(history, null, 2));
    } catch (error) {
      console.error('Error saving report history:', error.message);
    }
  }

  getTrendRecommendations(trend, changePercent) {
    const recommendations = [];

    if (trend === 'increasing') {
      recommendations.push('Security posture is deteriorating - immediate action required');
      recommendations.push('Review recent code changes for security issues');
      recommendations.push('Consider implementing stricter code review processes');
      recommendations.push('Schedule additional security training for team');
    } else if (trend === 'decreasing') {
      recommendations.push('Security posture is improving - continue current practices');
      recommendations.push('Document successful security improvements');
      recommendations.push('Share best practices with team');
    } else {
      recommendations.push('Security posture is stable - maintain current practices');
      recommendations.push('Continue regular security scanning');
    }

    return recommendations;
  }

  generateRecommendations(scanResult) {
    const vulnerabilities = scanResult.vulnerabilities || [];
    const summary = scanResult.summary || {};
    const recommendations = [];

    // 优先级排序
    const criticalVulns = vulnerabilities.filter(v => v.severity === 'Critical');
    const highVulns = vulnerabilities.filter(v => v.severity === 'High');
    const mediumVulns = vulnerabilities.filter(v => v.severity === 'Medium');
    const lowVulns = vulnerabilities.filter(v => v.severity === 'Low');

    // 关键建议
    if (criticalVulns.length > 0) {
      recommendations.push({
        priority: 'Critical',
        category: 'Immediate Action',
        title: 'Address Critical Vulnerabilities',
        description: `Found ${criticalVulns.length} critical vulnerabilities that require immediate attention`,
        actions: criticalVulns.slice(0, 5).map(v => ({
          file: v.file,
          issue: v.name,
          recommendation: v.aiRecommendation || v.recommendation
        }))
      });
    }

    // 高危建议
    if (highVulns.length > 0) {
      recommendations.push({
        priority: 'High',
        category: 'High Priority',
        title: 'Address High Severity Vulnerabilities',
        description: `Found ${highVulns.length} high severity vulnerabilities`,
        actions: highVulns.slice(0, 5).map(v => ({
          file: v.file,
          issue: v.name,
          recommendation: v.aiRecommendation || v.recommendation
        }))
      });
    }

    // 中危建议
    if (mediumVulns.length > 0) {
      recommendations.push({
        priority: 'Medium',
        category: 'Medium Priority',
        title: 'Address Medium Severity Vulnerabilities',
        description: `Found ${mediumVulns.length} medium severity vulnerabilities`,
        actions: mediumVulns.slice(0, 5).map(v => ({
          file: v.file,
          issue: v.name,
          recommendation: v.aiRecommendation || v.recommendation
        }))
      });
    }

    // AI驱动建议
    const aiEnhancedVulns = vulnerabilities.filter(v => v.aiRecommendation);
    if (aiEnhancedVulns.length > 0) {
      recommendations.push({
        priority: 'High',
        category: 'AI-Driven',
        title: 'AI-Recommended Fixes',
        description: `AI has generated specific fix recommendations for ${aiEnhancedVulns.length} vulnerabilities`,
        actions: aiEnhancedVulns.slice(0, 5).map(v => ({
          file: v.file,
          issue: v.name,
          recommendation: v.aiRecommendation
        }))
      });
    }

    // 智能规则建议
    const aiRuleGeneratedVulns = vulnerabilities.filter(v => v.aiGeneratedRule);
    if (aiRuleGeneratedVulns.length > 0) {
      recommendations.push({
        priority: 'Medium',
        category: 'Intelligent Rules',
        title: 'AI-Generated Detection Rules',
        description: `AI has generated ${aiRuleGeneratedVulns.length} intelligent rules to detect similar vulnerabilities in the future`,
        actions: [
          'Review and validate AI-generated rules',
          'Add validated rules to your security scanning configuration',
          'Regularly update rules based on new vulnerability patterns',
          'Leverage AI to continuously improve detection capabilities'
        ]
      });
    }

    // 最佳实践建议
    recommendations.push({
      priority: 'Informational',
      category: 'Best Practices',
      title: 'Security Best Practices',
      description: 'General security recommendations for Vue.js applications',
      actions: [
        'Implement Content Security Policy (CSP)',
        'Use HTTPS for all communications',
        'Keep dependencies up to date',
        'Implement proper authentication and authorization',
        'Use secure cookie settings',
        'Sanitize all user input',
        'Implement rate limiting',
        'Regular security audits and penetration testing'
      ]
    });

    return recommendations;
  }

  generateHTMLReport(advancedReport, outputPath) {
    const html = this.buildHTMLReport(advancedReport);
    fs.writeFileSync(outputPath, html);
    return outputPath;
  }

  buildHTMLReport(report) {
    const { advancedAnalysis, compliance, trends, recommendations, aiAnalysis } = report;

    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Vue Security Scanner - Advanced Report</title>
    <style>
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            margin: 0;
            padding: 20px;
            background-color: #f5f5f5;
        }
        .container {
            max-width: 1200px;
            margin: 0 auto;
            background-color: white;
            padding: 30px;
            border-radius: 8px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }
        h1 {
            color: #333;
            border-bottom: 3px solid #4CAF50;
            padding-bottom: 10px;
        }
        h2 {
            color: #555;
            margin-top: 30px;
        }
        h3 {
            color: #666;
            margin-top: 20px;
        }
        .summary {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 20px;
            margin: 20px 0;
        }
        .summary-card {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 20px;
            border-radius: 8px;
            text-align: center;
        }
        .summary-card.critical {
            background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
        }
        .summary-card.high {
            background: linear-gradient(135deg, #fa709a 0%, #fee140 100%);
        }
        .summary-card.medium {
            background: linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%);
            color: #333;
        }
        .summary-card.low {
            background: linear-gradient(135deg, #a8edea 0%, #fed6e3 100%);
            color: #333;
        }
        .summary-card.ai {
            background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
            color: white;
        }
        .summary-card h3 {
            margin: 0;
            font-size: 2em;
            color: inherit;
        }
        .summary-card p {
            margin: 5px 0 0;
            opacity: 0.9;
        }
        .compliance-section {
            margin: 30px 0;
        }
        .compliance-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 20px;
        }
        .compliance-card {
            border: 2px solid #ddd;
            border-radius: 8px;
            padding: 20px;
        }
        .compliance-card.compliant {
            border-color: #4CAF50;
            background-color: #f1f8f4;
        }
        .compliance-card.non-compliant {
            border-color: #f44336;
            background-color: #fef5f5;
        }
        .compliance-score {
            font-size: 2em;
            font-weight: bold;
            text-align: center;
        }
        .compliance-score.high {
            color: #4CAF50;
        }
        .compliance-score.medium {
            color: #ff9800;
        }
        .compliance-score.low {
            color: #f44336;
        }
        .trends-section {
            background-color: #e3f2fd;
            padding: 20px;
            border-radius: 8px;
            margin: 30px 0;
        }
        .ai-section {
            background-color: #e8f4fd;
            padding: 20px;
            border-radius: 8px;
            margin: 30px 0;
            border-left: 4px solid #4facfe;
        }
        .trend-indicator {
            display: inline-block;
            padding: 5px 15px;
            border-radius: 20px;
            font-weight: bold;
            margin: 10px 0;
        }
        .trend-indicator.increasing {
            background-color: #f44336;
            color: white;
        }
        .trend-indicator.decreasing {
            background-color: #4CAF50;
            color: white;
        }
        .trend-indicator.stable {
            background-color: #ff9800;
            color: white;
        }
        .recommendations {
            margin: 30px 0;
        }
        .recommendation-item {
            background-color: #fff3e0;
            border-left: 4px solid #ff9800;
            padding: 15px;
            margin: 10px 0;
            border-radius: 4px;
        }
        .recommendation-item.critical {
            background-color: #ffebee;
            border-left-color: #f44336;
        }
        .recommendation-item.high {
            background-color: #fff3e0;
            border-left-color: #ff9800;
        }
        .recommendation-item.medium {
            background-color: #e8f5e9;
            border-left-color: #4CAF50;
        }
        .recommendation-item.ai {
            background-color: #e8f4fd;
            border-left-color: #4facfe;
        }
        .vulnerability-table {
            width: 100%;
            border-collapse: collapse;
            margin: 20px 0;
            overflow-x: auto;
            display: block;
        }
        .vulnerability-table th,
        .vulnerability-table td {
            border: 1px solid #ddd;
            padding: 12px;
            text-align: left;
            min-width: 120px;
        }
        .vulnerability-table th {
            background-color: #4CAF50;
            color: white;
            position: sticky;
            top: 0;
        }
        .vulnerability-table tr:nth-child(even) {
            background-color: #f9f9f9;
        }
        .severity-badge {
            display: inline-block;
            padding: 3px 10px;
            border-radius: 12px;
            font-size: 0.85em;
            font-weight: bold;
        }
        .severity-badge.critical {
            background-color: #f44336;
            color: white;
        }
        .severity-badge.high {
            background-color: #ff9800;
            color: white;
        }
        .severity-badge.medium {
            background-color: #ffeb3b;
            color: #333;
        }
        .severity-badge.low {
            background-color: #4CAF50;
            color: white;
        }
        .ai-badge {
            display: inline-block;
            padding: 3px 10px;
            border-radius: 12px;
            font-size: 0.85em;
            font-weight: bold;
            background-color: #4facfe;
            color: white;
        }
        .rule-badge {
            display: inline-block;
            padding: 3px 10px;
            border-radius: 12px;
            font-size: 0.85em;
            font-weight: bold;
            background-color: #9c27b0;
            color: white;
        }
        .ai-details {
            margin-top: 10px;
            padding: 10px;
            background-color: #f8f9fa;
            border-radius: 4px;
            font-size: 0.9em;
        }
        .ai-details h4 {
            margin-top: 0;
            color: #4facfe;
        }
        .ai-details pre {
            white-space: pre-wrap;
            word-wrap: break-word;
            margin: 5px 0;
            padding: 10px;
            background-color: #f0f0f0;
            border-radius: 4px;
        }
        .footer {
            margin-top: 50px;
            text-align: center;
            color: #666;
            font-size: 0.9em;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>🔒 Vue Security Scanner - Advanced Report</h1>
        <p>Generated at: ${report.metadata.generatedAt}</p>
        <p>Scanner Version: ${report.metadata.scannerVersion}</p>
        ${report.metadata.aiEnhanced ? '<p><span class="ai-badge">AI Enhanced</span></p>' : ''}

        <div class="summary">
            <div class="summary-card critical">
                <h3>${report.summary.highSeverity}</h3>
                <p>Critical/High</p>
            </div>
            <div class="summary-card medium">
                <h3>${report.summary.mediumSeverity}</h3>
                <p>Medium</p>
            </div>
            <div class="summary-card low">
                <h3>${report.summary.lowSeverity}</h3>
                <p>Low</p>
            </div>
            <div class="summary-card">
                <h3>${report.summary.totalVulnerabilities}</h3>
                <p>Total</p>
            </div>
            ${aiAnalysis ? `
            <div class="summary-card ai">
                <h3>${aiAnalysis.enhancedVulnerabilitiesCount}</h3>
                <p>AI Enhanced</p>
            </div>
            <div class="summary-card ai">
                <h3>${aiAnalysis.ruleGeneratedVulnerabilitiesCount}</h3>
                <p>Rules Generated</p>
            </div>
            ` : ''}
        </div>

        ${aiAnalysis ? `
        <div class="ai-section">
            <h2>🤖 AI Analysis</h2>
            <p>${aiAnalysis.summary}</p>
            <p>Enhancement Rate: ${aiAnalysis.enhancementRate}%</p>
            <p>Rule Generation Rate: ${aiAnalysis.ruleGenerationRate}%</p>
            <p>AI has provided detailed explanations and fix recommendations for ${aiAnalysis.enhancedVulnerabilitiesCount} vulnerabilities, and generated ${aiAnalysis.ruleGeneratedVulnerabilitiesCount} intelligent rules for future detection.</p>
        </div>
        ` : ''}

        <h2>📊 Compliance Status</h2>
        <div class="compliance-section">
            <div class="compliance-grid">
                <div class="compliance-card ${compliance.owasp.compliant ? 'compliant' : 'non-compliant'}">
                    <h3>OWASP Top 10</h3>
                    <div class="compliance-score ${this.getScoreClass(compliance.owasp.score)}">${compliance.owasp.score}%</div>
                    <p>${compliance.owasp.compliant ? '✅ Compliant' : '❌ Non-Compliant'}</p>
                </div>
                <div class="compliance-card ${compliance.gdpr.compliant ? 'compliant' : 'non-compliant'}">
                    <h3>GDPR</h3>
                    <div class="compliance-score ${this.getScoreClass(compliance.gdpr.score)}">${compliance.gdpr.score}%</div>
                    <p>${compliance.gdpr.compliant ? '✅ Compliant' : '❌ Non-Compliant'}</p>
                </div>
                <div class="compliance-card ${compliance.hipaa.compliant ? 'compliant' : 'non-compliant'}">
                    <h3>HIPAA</h3>
                    <div class="compliance-score ${this.getScoreClass(compliance.hipaa.score)}">${compliance.hipaa.score}%</div>
                    <p>${compliance.hipaa.compliant ? '✅ Compliant' : '❌ Non-Compliant'}</p>
                </div>
                <div class="compliance-card ${compliance.pciDss.compliant ? 'compliant' : 'non-compliant'}">
                    <h3>PCI-DSS</h3>
                    <div class="compliance-score ${this.getScoreClass(compliance.pciDss.score)}">${compliance.pciDss.score}%</div>
                    <p>${compliance.pciDss.compliant ? '✅ Compliant' : '❌ Non-Compliant'}</p>
                </div>
            </div>
        </div>

        <div class="trends-section">
            <h2>📈 Security Trends</h2>
            <span class="trend-indicator ${trends.trend}">${trends.trend.toUpperCase()}</span>
            <p>${trends.period}</p>
            <p>Change: ${trends.change} vulnerabilities (${trends.changePercent}%)</p>
            <p>Current: ${trends.currentCount} | Previous: ${trends.previousCount}</p>
        </div>

        <h2>💡 Recommendations</h2>
        <div class="recommendations">
            ${recommendations.map(rec => `
                <div class="recommendation-item ${rec.priority.toLowerCase()}">
                    <strong>${rec.category}: ${rec.title}</strong>
                    <p>${rec.description}</p>
                    <ul>
                        ${rec.actions.map(action => `<li>${typeof action === 'string' ? action : `${action.file}: ${action.issue}`}</li>`).join('')}
                    </ul>
                </div>
            `).join('')}
        </div>

        ${report.vulnerabilities && report.vulnerabilities.length > 0 ? `
        <h2>🔍 Detailed Vulnerabilities</h2>
        <table class="vulnerability-table">
            <thead>
                <tr>
                    <th>File</th>
                    <th>Line</th>
                    <th>Type</th>
                    <th>Severity</th>
                    <th>Description</th>
                    <th>AI Analysis</th>
                </tr>
            </thead>
            <tbody>
                ${report.vulnerabilities.map(vuln => `
                <tr>
                    <td>${vuln.file}</td>
                    <td>${vuln.line}</td>
                    <td>${vuln.ruleId || vuln.name}</td>
                    <td><span class="severity-badge ${vuln.severity.toLowerCase()}">${vuln.severity}</span></td>
                    <td>${vuln.description}</td>
                    <td>
                        ${vuln.aiExplanation || vuln.aiRecommendation || vuln.aiGeneratedRule ? `
                        <div>
                            ${vuln.aiExplanation || vuln.aiRecommendation ? '<span class="ai-badge">Enhanced</span>' : ''}
                            ${vuln.aiGeneratedRule ? '<span class="rule-badge">Rule Generated</span>' : ''}
                        </div>
                        <div class="ai-details">
                            ${vuln.aiExplanation ? `
                            <h4>AI Explanation</h4>
                            <pre>${vuln.aiExplanation}</pre>
                            ` : ''}
                            ${vuln.aiRecommendation ? `
                            <h4>AI Recommendation</h4>
                            <pre>${vuln.aiRecommendation}</pre>
                            ` : ''}
                            ${vuln.aiGeneratedRule ? `
                            <h4>AI Generated Rule</h4>
                            <pre>${JSON.stringify(vuln.aiGeneratedRule, null, 2)}</pre>
                            ` : ''}
                        </div>
                        ` : 'No'}
                    </td>
                </tr>
                `).join('')}
            </tbody>
        </table>
        ` : ''}

        <div class="footer">
            <p>Generated by Vue Security Scanner v${report.metadata.scannerVersion}</p>
            <p>For more information, visit: https://github.com/ereddate/vue-security-scanner</p>
        </div>
    </div>
</body>
</html>`;
  }

  getScoreClass(score) {
    const numScore = parseFloat(score);
    if (numScore >= 80) return 'high';
    if (numScore >= 50) return 'medium';
    return 'low';
  }
}

module.exports = AdvancedReportGenerator;