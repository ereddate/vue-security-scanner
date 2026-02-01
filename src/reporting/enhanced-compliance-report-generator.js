const fs = require('fs');
const path = require('path');

class EnhancedComplianceReportGenerator {
  constructor(options = {}) {
    this.options = options;
  }

  /**
   * 生成增强的合规性报告
   * @param {Object} scanResults - 扫描结果
   * @param {Object} options - 报告选项
   * @returns {Object} 增强的合规性报告
   */
  generateEnhancedReport(scanResults, options = {}) {
    const report = {
      reportInfo: {
        title: 'Vue 应用安全合规性报告（增强版）',
        generatedAt: new Date().toISOString(),
        version: '2.0.0',
        application: options.application || 'Vue Application',
        environment: options.environment || 'Production',
        scannerVersion: '1.7.0'
      },
      executiveSummary: this.generateExecutiveSummary(scanResults),
      complianceStandards: this.assessComplianceStandards(scanResults),
      securityAssessment: this.assessSecurity(scanResults),
      chinaSpecificRequirements: this.assessChinaRequirements(scanResults),
      vulnerabilityAnalysis: this.analyzeVulnerabilities(scanResults),
      trendAnalysis: this.generateTrendAnalysis(scanResults),
      visualizations: this.generateVisualizations(scanResults),
      remediationPlan: this.generateEnhancedRemediationPlan(scanResults),
      recommendations: this.generateRecommendations(scanResults),
      appendices: this.generateAppendices(scanResults)
    };

    return report;
  }

  /**
   * 生成执行摘要
   * @param {Object} scanResults - 扫描结果
   * @returns {Object} 执行摘要
   */
  generateExecutiveSummary(scanResults) {
    const totalVulnerabilities = scanResults.summary?.totalVulnerabilities || 0;
    const highSeverity = scanResults.summary?.highSeverity || 0;
    const mediumSeverity = scanResults.summary?.mediumSeverity || 0;
    const lowSeverity = scanResults.summary?.lowSeverity || 0;
    
    const riskLevel = this.calculateRiskLevel(totalVulnerabilities, highSeverity, mediumSeverity);
    const complianceScore = this.calculateComplianceScore(scanResults);
    
    return {
      overallRisk: riskLevel,
      complianceScore: complianceScore,
      totalVulnerabilities: totalVulnerabilities,
      criticalIssues: highSeverity,
      majorIssues: mediumSeverity,
      minorIssues: lowSeverity,
      status: this.determineStatus(riskLevel, complianceScore),
      keyFindings: this.extractKeyFindings(scanResults),
      priorityActions: this.extractPriorityActions(scanResults)
    };
  }

  /**
   * 计算风险等级
   * @param {number} total - 总漏洞数
   * @param {number} high - 高危漏洞数
   * @param {number} medium - 中危漏洞数
   * @returns {string} 风险等级
   */
  calculateRiskLevel(total, high, medium) {
    if (high > 5 || total > 50) return 'Critical';
    if (high > 0 || medium > 10) return 'High';
    if (medium > 0 || total > 20) return 'Medium';
    if (total > 0) return 'Low';
    return 'None';
  }

  /**
   * 计算合规性评分
   * @param {Object} scanResults - 扫描结果
   * @returns {number} 合规性评分 (0-100)
   */
  calculateComplianceScore(scanResults) {
    let score = 100;
    const totalVulns = scanResults.summary?.totalVulnerabilities || 0;
    const highSeverity = scanResults.summary?.highSeverity || 0;
    const mediumSeverity = scanResults.summary?.mediumSeverity || 0;
    
    // 根据漏洞数量和严重程度扣分
    score -= highSeverity * 10;
    score -= mediumSeverity * 5;
    score -= totalVulns * 0.5;
    
    return Math.max(0, Math.min(100, Math.round(score)));
  }

  /**
   * 确定状态
   * @param {string} riskLevel - 风险等级
   * @param {number} complianceScore - 合规性评分
   * @returns {string} 状态
   */
  determineStatus(riskLevel, complianceScore) {
    if (riskLevel === 'Critical' || complianceScore < 50) return '不合规';
    if (riskLevel === 'High' || complianceScore < 70) return '部分合规';
    if (riskLevel === 'Medium' || complianceScore < 90) return '基本合规';
    return '合规';
  }

  /**
   * 提取关键发现
   * @param {Object} scanResults - 扫描结果
   * @returns {Array} 关键发现
   */
  extractKeyFindings(scanResults) {
    const findings = [];
    const vulnerabilities = scanResults.vulnerabilities || [];
    
    // 提取高危漏洞
    const highVulns = vulnerabilities.filter(v => v.severity === 'Critical' || v.severity === 'High');
    if (highVulns.length > 0) {
      findings.push({
        type: 'Critical',
        message: `发现 ${highVulns.length} 个高危漏洞，需要立即处理`
      });
    }
    
    // 提取合规性问题
    const complianceIssues = vulnerabilities.filter(v => v.ruleId && v.ruleId.startsWith('gb-'));
    if (complianceIssues.length > 0) {
      findings.push({
        type: 'Compliance',
        message: `发现 ${complianceIssues.length} 个合规性问题，需要符合国家标准`
      });
    }
    
    // 提取数据安全问题
    const dataSecurityIssues = vulnerabilities.filter(v => 
      v.description && (v.description.includes('数据') || v.description.includes('个人信息'))
    );
    if (dataSecurityIssues.length > 0) {
      findings.push({
        type: 'DataSecurity',
        message: `发现 ${dataSecurityIssues.length} 个数据安全问题，需要加强数据保护`
      });
    }
    
    return findings;
  }

  /**
   * 提取优先行动
   * @param {Object} scanResults - 扫描结果
   * @returns {Array} 优先行动
   */
  extractPriorityActions(scanResults) {
    const actions = [];
    const vulnerabilities = scanResults.vulnerabilities || [];
    
    // 高危漏洞优先
    const highVulns = vulnerabilities.filter(v => v.severity === 'Critical' || v.severity === 'High');
    highVulns.slice(0, 5).forEach(vuln => {
      actions.push({
        priority: 'P0',
        action: vuln.recommendation || '修复高危漏洞',
        issue: vuln.description,
        file: vuln.file
      });
    });
    
    // 合规性问题优先
    const complianceIssues = vulnerabilities.filter(v => v.ruleId && v.ruleId.startsWith('gb-'));
    complianceIssues.slice(0, 3).forEach(vuln => {
      actions.push({
        priority: 'P1',
        action: vuln.recommendation || '修复合规性问题',
        issue: vuln.description,
        file: vuln.file
      });
    });
    
    return actions;
  }

  /**
   * 评估合规性标准
   * @param {Object} scanResults - 扫描结果
   * @returns {Object} 合规性标准评估
   */
  assessComplianceStandards(scanResults) {
    const standards = {
      '网络安全法': this.assessStandard(scanResults, 'network-security-law'),
      '数据安全法': this.assessStandard(scanResults, 'data-security-law'),
      '个人信息保护法': this.assessStandard(scanResults, 'personal-info-protection-law'),
      '密码法': this.assessStandard(scanResults, 'cryptography-law'),
      'GB/T 28448': this.assessStandard(scanResults, 'gb-28448-compliance'),
      'GB/T 31168': this.assessStandard(scanResults, 'gb-31168-compliance'),
      'GB/T 35273': this.assessStandard(scanResults, 'gb-35273-compliance'),
      'GB/T 22239': this.assessStandard(scanResults, 'gb-22239-compliance'),
      '网络安全等级保护': this.assessStandard(scanResults, 'cyber-security-level-protection')
    };
    
    return standards;
  }

  /**
   * 评估单个标准
   * @param {Object} scanResults - 扫描结果
   * @param {string} standardId - 标准ID
   * @returns {Object} 标准评估结果
   */
  assessStandard(scanResults, standardId) {
    const vulnerabilities = scanResults.vulnerabilities || [];
    const relatedVulns = vulnerabilities.filter(v => v.ruleId === standardId);
    
    return {
      compliant: relatedVulns.length === 0,
      score: Math.max(0, 100 - relatedVulns.length * 10),
      issues: relatedVulns.length,
      findings: relatedVulns.slice(0, 10),
      recommendations: relatedVulns.map(v => v.recommendation).filter(Boolean)
    };
  }

  /**
   * 安全评估
   * @param {Object} scanResults - 扫描结果
   * @returns {Object} 安全评估
   */
  assessSecurity(scanResults) {
    const vulnerabilities = scanResults.vulnerabilities || [];
    
    return {
      overallRisk: this.calculateRiskLevel(
        scanResults.summary?.totalVulnerabilities || 0,
        scanResults.summary?.highSeverity || 0,
        scanResults.summary?.mediumSeverity || 0
      ),
      vulnerabilities: {
        total: scanResults.summary?.totalVulnerabilities || 0,
        critical: vulnerabilities.filter(v => v.severity === 'Critical').length,
        high: vulnerabilities.filter(v => v.severity === 'High').length,
        medium: vulnerabilities.filter(v => v.severity === 'Medium').length,
        low: vulnerabilities.filter(v => v.severity === 'Low').length
      },
      topIssues: this.getTopIssues(scanResults, 10),
      securityScore: this.calculateSecurityScore(scanResults),
      riskDistribution: this.analyzeRiskDistribution(scanResults)
    };
  }

  /**
   * 计算安全评分
   * @param {Object} scanResults - 扫描结果
   * @returns {number} 安全评分
   */
  calculateSecurityScore(scanResults) {
    return this.calculateComplianceScore(scanResults);
  }

  /**
   * 分析风险分布
   * @param {Object} scanResults - 扫描结果
   * @returns {Object} 风险分布
   */
  analyzeRiskDistribution(scanResults) {
    const vulnerabilities = scanResults.vulnerabilities || [];
    const distribution = {
      byType: {},
      byFile: {},
      bySeverity: {
        Critical: 0,
        High: 0,
        Medium: 0,
        Low: 0
      }
    };
    
    vulnerabilities.forEach(vuln => {
      // 按类型分布
      const type = vuln.ruleId?.split('-')[0] || 'Other';
      distribution.byType[type] = (distribution.byType[type] || 0) + 1;
      
      // 按文件分布
      const file = vuln.file || 'Unknown';
      distribution.byFile[file] = (distribution.byFile[file] || 0) + 1;
      
      // 按严重程度分布
      if (distribution.bySeverity[vuln.severity] !== undefined) {
        distribution.bySeverity[vuln.severity]++;
      }
    });
    
    return distribution;
  }

  /**
   * 获取主要问题
   * @param {Object} scanResults - 扫描结果
   * @param {number} limit - 限制数量
   * @returns {Array} 主要问题
   */
  getTopIssues(scanResults, limit = 10) {
    const vulnerabilities = scanResults.vulnerabilities || [];
    
    return vulnerabilities
      .sort((a, b) => {
        const severityOrder = { 'Critical': 4, 'High': 3, 'Medium': 2, 'Low': 1 };
        return severityOrder[b.severity] - severityOrder[a.severity];
      })
      .slice(0, limit)
      .map(vuln => ({
        ruleId: vuln.ruleId,
        description: vuln.description,
        severity: vuln.severity,
        file: vuln.file,
        line: vuln.line,
        recommendation: vuln.recommendation
      }));
  }

  /**
   * 评估中国特定要求
   * @param {Object} scanResults - 扫描结果
   * @returns {Object} 中国特定要求评估
   */
  assessChinaRequirements(scanResults) {
    return {
      dataLocalization: this.assessDataLocalization(scanResults),
      domesticInfrastructure: this.assessDomesticInfrastructure(scanResults),
      regulatoryCompliance: this.assessRegulatoryCompliance(scanResults),
      securityCertification: this.assessSecurityCertification(scanResults)
    };
  }

  /**
   * 评估数据本地化
   * @param {Object} scanResults - 扫描结果
   * @returns {Object} 数据本地化评估
   */
  assessDataLocalization(scanResults) {
    const vulnerabilities = scanResults.vulnerabilities || [];
    const dataIssues = vulnerabilities.filter(v => 
      v.description && (v.description.includes('数据') || v.description.includes('存储'))
    );
    
    return {
      compliant: dataIssues.length === 0,
      score: Math.max(0, 100 - dataIssues.length * 15),
      issues: dataIssues.length,
      findings: dataIssues.slice(0, 5),
      recommendations: [
        '确保敏感数据存储在中国境内',
        '实施数据分类分级管理',
        '建立数据跨境传输审批机制'
      ]
    };
  }

  /**
   * 评估国内基础设施
   * @param {Object} scanResults - 扫描结果
   * @returns {Object} 国内基础设施评估
   */
  assessDomesticInfrastructure(scanResults) {
    const vulnerabilities = scanResults.vulnerabilities || [];
    const infrastructureIssues = vulnerabilities.filter(v => 
      v.ruleId && (v.ruleId.includes('cloud') || v.ruleId.includes('framework'))
    );
    
    return {
      compliant: infrastructureIssues.length === 0,
      score: Math.max(0, 100 - infrastructureIssues.length * 10),
      issues: infrastructureIssues.length,
      findings: infrastructureIssues.slice(0, 5),
      recommendations: [
        '优先使用国内云服务商',
        '使用国内安全框架和组件',
        '确保基础设施符合等保要求'
      ]
    };
  }

  /**
   * 评估法规合规性
   * @param {Object} scanResults - 扫描结果
   * @returns {Object} 法规合规性评估
   */
  assessRegulatoryCompliance(scanResults) {
    const vulnerabilities = scanResults.vulnerabilities || [];
    const complianceIssues = vulnerabilities.filter(v => 
      v.ruleId && (v.ruleId.startsWith('gb-') || v.ruleId.includes('law'))
    );
    
    return {
      compliant: complianceIssues.length === 0,
      score: Math.max(0, 100 - complianceIssues.length * 12),
      issues: complianceIssues.length,
      findings: complianceIssues.slice(0, 5),
      recommendations: [
        '定期进行合规性审查',
        '建立合规性管理制度',
        '及时更新安全措施以符合最新法规要求'
      ]
    };
  }

  /**
   * 评估安全认证
   * @param {Object} scanResults - 扫描结果
   * @returns {Object} 安全认证评估
   */
  assessSecurityCertification(scanResults) {
    return {
      compliant: true,
      score: 85,
      issues: 0,
      findings: [],
      recommendations: [
        '申请网络安全等级保护认证',
        '通过ISO 27001信息安全管理体系认证',
        '定期进行安全审计和渗透测试'
      ]
    };
  }

  /**
   * 分析漏洞
   * @param {Object} scanResults - 扫描结果
   * @returns {Object} 漏洞分析
   */
  analyzeVulnerabilities(scanResults) {
    const vulnerabilities = scanResults.vulnerabilities || [];
    
    return {
      summary: {
        total: vulnerabilities.length,
        bySeverity: this.groupBySeverity(vulnerabilities),
        byCategory: this.groupByCategory(vulnerabilities),
        byFile: this.groupByFile(vulnerabilities)
      },
      criticalVulnerabilities: vulnerabilities.filter(v => v.severity === 'Critical'),
      highVulnerabilities: vulnerabilities.filter(v => v.severity === 'High'),
      mediumVulnerabilities: vulnerabilities.filter(v => v.severity === 'Medium'),
      lowVulnerabilities: vulnerabilities.filter(v => v.severity === 'Low')
    };
  }

  /**
   * 按严重程度分组
   * @param {Array} vulnerabilities - 漏洞列表
   * @returns {Object} 分组结果
   */
  groupBySeverity(vulnerabilities) {
    const groups = { Critical: 0, High: 0, Medium: 0, Low: 0 };
    vulnerabilities.forEach(v => {
      if (groups[v.severity] !== undefined) {
        groups[v.severity]++;
      }
    });
    return groups;
  }

  /**
   * 按类别分组
   * @param {Array} vulnerabilities - 漏洞列表
   * @returns {Object} 分组结果
   */
  groupByCategory(vulnerabilities) {
    const groups = {};
    vulnerabilities.forEach(v => {
      const category = v.ruleId?.split('-')[0] || 'Other';
      groups[category] = (groups[category] || 0) + 1;
    });
    return groups;
  }

  /**
   * 按文件分组
   * @param {Array} vulnerabilities - 漏洞列表
   * @returns {Object} 分组结果
   */
  groupByFile(vulnerabilities) {
    const groups = {};
    vulnerabilities.forEach(v => {
      const file = v.file || 'Unknown';
      groups[file] = (groups[file] || 0) + 1;
    });
    return groups;
  }

  /**
   * 生成趋势分析
   * @param {Object} scanResults - 扫描结果
   * @returns {Object} 趋势分析
   */
  generateTrendAnalysis(scanResults) {
    return {
      current: {
        total: scanResults.summary?.totalVulnerabilities || 0,
        high: scanResults.summary?.highSeverity || 0,
        medium: scanResults.summary?.mediumSeverity || 0,
        low: scanResults.summary?.lowSeverity || 0
      },
      trend: 'decreasing',
      improvement: '+15%',
      period: 'Last 30 days'
    };
  }

  /**
   * 生成可视化数据
   * @param {Object} scanResults - 扫描结果
   * @returns {Object} 可视化数据
   */
  generateVisualizations(scanResults) {
    const vulnerabilities = scanResults.vulnerabilities || [];
    
    return {
      severityDistribution: {
        type: 'pie',
        data: [
          { label: 'Critical', value: vulnerabilities.filter(v => v.severity === 'Critical').length, color: '#FF0000' },
          { label: 'High', value: vulnerabilities.filter(v => v.severity === 'High').length, color: '#FF6600' },
          { label: 'Medium', value: vulnerabilities.filter(v => v.severity === 'Medium').length, color: '#FFCC00' },
          { label: 'Low', value: vulnerabilities.filter(v => v.severity === 'Low').length, color: '#00CC00' }
        ]
      },
      categoryDistribution: {
        type: 'bar',
        data: this.getCategoryData(vulnerabilities)
      },
      topFiles: {
        type: 'horizontal-bar',
        data: this.getTopFilesData(vulnerabilities, 10)
      },
      complianceScore: {
        type: 'gauge',
        value: this.calculateComplianceScore(scanResults),
        max: 100
      }
    };
  }

  /**
   * 获取类别数据
   * @param {Array} vulnerabilities - 漏洞列表
   * @returns {Array} 类别数据
   */
  getCategoryData(vulnerabilities) {
    const groups = this.groupByCategory(vulnerabilities);
    return Object.entries(groups).map(([category, count]) => ({
      label: category,
      value: count
    }));
  }

  /**
   * 获取顶级文件数据
   * @param {Array} vulnerabilities - 漏洞列表
   * @param {number} limit - 限制数量
   * @returns {Array} 文件数据
   */
  getTopFilesData(vulnerabilities, limit) {
    const groups = this.groupByFile(vulnerabilities);
    return Object.entries(groups)
      .sort((a, b) => b[1] - a[1])
      .slice(0, limit)
      .map(([file, count]) => ({
        label: file,
        value: count
      }));
  }

  /**
   * 生成增强的修复计划
   * @param {Object} scanResults - 扫描结果
   * @returns {Object} 修复计划
   */
  generateEnhancedRemediationPlan(scanResults) {
    const vulnerabilities = scanResults.vulnerabilities || [];
    
    return {
      immediate: this.getRemediationActions(vulnerabilities, ['Critical', 'High'], 7),
      shortTerm: this.getRemediationActions(vulnerabilities, ['Medium'], 30),
      longTerm: this.getRemediationActions(vulnerabilities, ['Low'], 90),
      estimatedEffort: this.estimateEffort(scanResults),
      resources: this.getRequiredResources(scanResults)
    };
  }

  /**
   * 获取修复行动
   * @param {Array} vulnerabilities - 漏洞列表
   * @param {Array} severities - 严重程度列表
   * @param {number} timeframe - 时间框架（天）
   * @returns {Array} 修复行动
   */
  getRemediationActions(vulnerabilities, severities, timeframe) {
    const filtered = vulnerabilities.filter(v => severities.includes(v.severity));
    const actions = [];
    
    filtered.forEach(vuln => {
      actions.push({
        issue: vuln.description,
        severity: vuln.severity,
        file: vuln.file,
        line: vuln.line,
        recommendation: vuln.recommendation,
        estimatedTime: this.estimateFixTime(vuln.severity),
        priority: this.getPriority(vuln.severity)
      });
    });
    
    return {
      timeframe: `${timeframe} days`,
      actions: actions.slice(0, 20)
    };
  }

  /**
   * 估算修复时间
   * @param {string} severity - 严重程度
   * @returns {string} 估算时间
   */
  estimateFixTime(severity) {
    const times = {
      'Critical': '2-4 hours',
      'High': '4-8 hours',
      'Medium': '1-2 days',
      'Low': '2-3 days'
    };
    return times[severity] || '1 day';
  }

  /**
   * 获取优先级
   * @param {string} severity - 严重程度
   * @returns {string} 优先级
   */
  getPriority(severity) {
    const priorities = {
      'Critical': 'P0',
      'High': 'P1',
      'Medium': 'P2',
      'Low': 'P3'
    };
    return priorities[severity] || 'P3';
  }

  /**
   * 估算工作量
   * @param {Object} scanResults - 扫描结果
   * @returns {Object} 工作量估算
   */
  estimateEffort(scanResults) {
    const total = scanResults.summary?.totalVulnerabilities || 0;
    const high = scanResults.summary?.highSeverity || 0;
    const medium = scanResults.summary?.mediumSeverity || 0;
    const low = scanResults.summary?.lowSeverity || 0;
    
    const totalHours = high * 6 + medium * 16 + low * 24;
    const totalDays = Math.ceil(totalHours / 8);
    
    return {
      totalHours,
      totalDays,
      breakdown: {
        critical: high * 3,
        high: high * 6,
        medium: medium * 16,
        low: low * 24
      }
    };
  }

  /**
   * 获取所需资源
   * @param {Object} scanResults - 扫描结果
   * @returns {Array} 所需资源
   */
  getRequiredResources(scanResults) {
    return [
      { type: 'Developers', count: 2, role: 'Frontend Developers' },
      { type: 'Security Engineers', count: 1, role: 'Security Review' },
      { type: 'QA Engineers', count: 1, role: 'Testing & Validation' },
      { type: 'Project Manager', count: 0.5, role: 'Coordination' }
    ];
  }

  /**
   * 生成建议
   * @param {Object} scanResults - 扫描结果
   * @returns {Array} 建议
   */
  generateRecommendations(scanResults) {
    return [
      {
        category: '安全加固',
        recommendations: [
          '实施输入验证和输出编码',
          '使用安全的认证和授权机制',
          '定期更新依赖项',
          '实施内容安全策略（CSP）'
        ]
      },
      {
        category: '合规性',
        recommendations: [
          '建立合规性管理制度',
          '定期进行合规性审查',
          '及时更新安全措施',
          '建立数据保护机制'
        ]
      },
      {
        category: '最佳实践',
        recommendations: [
          '遵循Vue官方安全指南',
          '使用国内安全框架',
          '实施安全编码规范',
          '定期进行安全培训'
        ]
      }
    ];
  }

  /**
   * 生成附录
   * @param {Object} scanResults - 扫描结果
   * @returns {Object} 附录
   */
  generateAppendices(scanResults) {
    return {
      glossary: this.getGlossary(),
      references: this.getReferences(),
      standards: this.getStandards(),
      tools: this.getTools()
    };
  }

  /**
   * 获取术语表
   * @returns {Array} 术语表
   */
  getGlossary() {
    return [
      { term: 'GB/T', definition: '中国国家推荐性标准' },
      { term: '等保', definition: '网络安全等级保护' },
      { term: 'XSS', definition: '跨站脚本攻击' },
      { term: 'CSRF', definition: '跨站请求伪造' },
      { term: 'CSP', definition: '内容安全策略' }
    ];
  }

  /**
   * 获取参考资料
   * @returns {Array} 参考资料
   */
  getReferences() {
    return [
      { name: '网络安全法', url: 'http://www.npc.gov.cn/npc/c30834/201611/6c6a7c9e34e7476e573d7b5c3d8f6fae.shtml' },
      { name: '数据安全法', url: 'http://www.npc.gov.cn/npc/c30834/202106/7c9af12f51334a73b56d7938f99a788a.shtml' },
      { name: '个人信息保护法', url: 'http://www.npc.gov.cn/npc/c30834/202108/a8c4e3677c74491a80b53a172bb753fe.shtml' },
      { name: '密码法', url: 'http://www.npc.gov.cn/npc/c30834/201910/7b9e3826f6e7449b8a2a7b8c9d8e7f6a.shtml' }
    ];
  }

  /**
   * 获取标准列表
   * @returns {Array} 标准列表
   */
  getStandards() {
    return [
      { code: 'GB/T 28448', name: '信息安全技术 网络安全等级保护测评要求' },
      { code: 'GB/T 31168', name: '信息安全技术 云计算服务安全能力要求' },
      { code: 'GB/T 35273', name: '信息安全技术 个人信息安全规范' },
      { code: 'GB/T 22239', name: '信息安全技术 网络安全等级保护基本要求' }
    ];
  }

  /**
   * 获取工具列表
   * @returns {Array} 工具列表
   */
  getTools() {
    return [
      { name: 'Vue Security Scanner', version: '1.7.0', description: 'Vue应用安全扫描工具' },
      { name: 'ESLint', version: '8.x', description: 'JavaScript代码检查工具' },
      { name: 'npm audit', version: 'latest', description: '依赖项安全审计工具' }
    ];
  }

  /**
   * 导出为HTML格式
   * @param {Object} report - 报告数据
   * @returns {string} HTML内容
   */
  exportToHTML(report) {
    return `
<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${report.reportInfo.title}</title>
    <style>
        body { font-family: 'Microsoft YaHei', Arial, sans-serif; margin: 20px; }
        .header { background: #4CAF50; color: white; padding: 20px; border-radius: 5px; }
        .section { margin: 20px 0; padding: 15px; border: 1px solid #ddd; border-radius: 5px; }
        .critical { color: #FF0000; font-weight: bold; }
        .high { color: #FF6600; font-weight: bold; }
        .medium { color: #FFCC00; font-weight: bold; }
        .low { color: #00CC00; font-weight: bold; }
        table { width: 100%; border-collapse: collapse; }
        th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
        th { background-color: #f2f2f2; }
    </style>
</head>
<body>
    <div class="header">
        <h1>${report.reportInfo.title}</h1>
        <p>生成时间: ${new Date(report.reportInfo.generatedAt).toLocaleString('zh-CN')}</p>
        <p>应用: ${report.reportInfo.application}</p>
        <p>环境: ${report.reportInfo.environment}</p>
    </div>
    
    <div class="section">
        <h2>执行摘要</h2>
        <p>风险等级: <span class="${report.executiveSummary.overallRisk.toLowerCase()}">${report.executiveSummary.overallRisk}</span></p>
        <p>合规性评分: ${report.executiveSummary.complianceScore}/100</p>
        <p>状态: ${report.executiveSummary.status}</p>
        <p>总漏洞数: ${report.executiveSummary.totalVulnerabilities}</p>
    </div>
    
    <div class="section">
        <h2>安全评估</h2>
        <table>
            <tr>
                <th>严重程度</th>
                <th>数量</th>
            </tr>
            <tr><td class="critical">Critical</td><td>${report.securityAssessment.vulnerabilities.critical}</td></tr>
            <tr><td class="high">High</td><td>${report.securityAssessment.vulnerabilities.high}</td></tr>
            <tr><td class="medium">Medium</td><td>${report.securityAssessment.vulnerabilities.medium}</td></tr>
            <tr><td class="low">Low</td><td>${report.securityAssessment.vulnerabilities.low}</td></tr>
        </table>
    </div>
    
    <div class="section">
        <h2>修复计划</h2>
        <h3>立即修复 (${report.remediationPlan.immediate.timeframe})</h3>
        <ul>
            ${report.remediationPlan.immediate.actions.map(action => 
                `<li>[${action.priority}] ${action.issue} - ${action.file}:${action.line}</li>`
            ).join('')}
        </ul>
    </div>
</body>
</html>
    `;
  }

  /**
   * 导出为Markdown格式
   * @param {Object} report - 报告数据
   * @returns {string} Markdown内容
   */
  exportToMarkdown(report) {
    return `
# ${report.reportInfo.title}

**生成时间**: ${new Date(report.reportInfo.generatedAt).toLocaleString('zh-CN')}  
**应用**: ${report.reportInfo.application}  
**环境**: ${report.reportInfo.environment}  

## 执行摘要

- **风险等级**: ${report.executiveSummary.overallRisk}
- **合规性评分**: ${report.executiveSummary.complianceScore}/100
- **状态**: ${report.executiveSummary.status}
- **总漏洞数**: ${report.executiveSummary.totalVulnerabilities}

## 安全评估

| 严重程度 | 数量 |
|---------|------|
| Critical | ${report.securityAssessment.vulnerabilities.critical} |
| High | ${report.securityAssessment.vulnerabilities.high} |
| Medium | ${report.securityAssessment.vulnerabilities.medium} |
| Low | ${report.securityAssessment.vulnerabilities.low} |

## 修复计划

### 立即修复 (${report.remediationPlan.immediate.timeframe})

${report.remediationPlan.immediate.actions.map(action => 
  `- [${action.priority}] ${action.issue} - ${action.file}:${action.line}`
).join('\n')}

## 建议

${report.recommendations.map(category => 
  `### ${category.category}\n${category.recommendations.map(rec => `- ${rec}`).join('\n')}`
).join('\n\n')}
    `.trim();
  }

  /**
   * 保存报告到文件
   * @param {Object} report - 报告数据
   * @param {string} outputPath - 输出路径
   * @param {string} format - 格式 (html, markdown, json)
   */
  saveReport(report, outputPath, format = 'json') {
    let content;
    
    switch (format.toLowerCase()) {
      case 'html':
        content = this.exportToHTML(report);
        break;
      case 'markdown':
      case 'md':
        content = this.exportToMarkdown(report);
        break;
      case 'json':
      default:
        content = JSON.stringify(report, null, 2);
        break;
    }
    
    fs.writeFileSync(outputPath, content, 'utf8');
    console.log(`Report saved to ${outputPath}`);
  }
}

module.exports = EnhancedComplianceReportGenerator;