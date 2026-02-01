const fs = require('fs');
const path = require('path');

class ChinaComplianceReportGenerator {
  /**
   * 生成符合国内法规要求的合规性报告
   * @param {Object} scanResults - 扫描结果
   * @param {Object} options - 报告选项
   * @returns {Object} 合规性报告
   */
  generateChinaComplianceReport(scanResults, options = {}) {
    const report = {
      reportInfo: {
        title: 'Vue 应用安全合规性报告',
        generatedAt: new Date().toISOString(),
        version: '1.0.0',
        application: options.application || 'Vue Application',
        environment: options.environment || 'Production'
      },
      complianceStandards: {
        '网络安全法': this.assessCompliance(scanResults, 'network-security-law'),
        '数据安全法': this.assessCompliance(scanResults, 'data-security-law'),
        '个人信息保护法': this.assessCompliance(scanResults, 'personal-info-protection-law'),
        '密码法': this.assessCompliance(scanResults, 'cryptography-law'),
        'GB/T 28448': this.assessCompliance(scanResults, 'gb-28448-compliance'),
        'GB/T 35273': this.assessCompliance(scanResults, 'gb-35273-compliance'),
        '网络安全等级保护': this.assessCompliance(scanResults, 'cyber-security-level-protection')
      },
      securityAssessment: {
        overallRisk: this.calculateOverallRisk(scanResults),
        vulnerabilities: {
          total: scanResults.summary?.totalVulnerabilities || 0,
          high: scanResults.summary?.highSeverity || 0,
          medium: scanResults.summary?.mediumSeverity || 0,
          low: scanResults.summary?.lowSeverity || 0
        },
        topIssues: this.getTopIssues(scanResults, 5)
      },
      chinaSpecificRequirements: {
        dataLocalization: this.assessDataLocalization(scanResults),
        domesticInfrastructure: this.assessDomesticInfrastructure(scanResults),
        regulatoryCompliance: this.assessRegulatoryCompliance(scanResults),
        securityCertification: this.assessSecurityCertification(scanResults)
      },
      remediationPlan: this.generateRemediationPlan(scanResults),
      conclusion: this.generateConclusion(scanResults)
    };

    return report;
  }

  /**
   * 评估特定合规标准的符合情况
   * @param {Object} scanResults - 扫描结果
   * @param {string} standardId - 标准ID
   * @returns {Object} 合规评估结果
   */
  assessCompliance(scanResults, standardId) {
    const vulnerabilities = scanResults.vulnerabilities || [];
    const relatedIssues = vulnerabilities.filter(vuln => 
      vuln.id.includes(standardId) || 
      vuln.name.includes(standardId) ||
      vuln.description.includes(standardId)
    );

    const severityCount = {
      high: relatedIssues.filter(v => v.severity === 'High' || v.severity === 'Critical').length,
      medium: relatedIssues.filter(v => v.severity === 'Medium').length,
      low: relatedIssues.filter(v => v.severity === 'Low').length
    };

    let status = 'Compliant';
    if (severityCount.high > 0) {
      status = 'Non-Compliant';
    } else if (severityCount.medium > 0) {
      status = 'Partially Compliant';
    }

    return {
      status,
      severityCount,
      relatedIssues: relatedIssues.map(v => ({
        id: v.id,
        name: v.name,
        severity: v.severity,
        description: v.description
      }))
    };
  }

  /**
   * 计算整体风险等级
   * @param {Object} scanResults - 扫描结果
   * @returns {string} 整体风险等级
   */
  calculateOverallRisk(scanResults) {
    const highCount = scanResults.summary?.highSeverity || 0;
    const mediumCount = scanResults.summary?.mediumSeverity || 0;

    if (highCount > 5) {
      return 'Critical';
    } else if (highCount > 0) {
      return 'High';
    } else if (mediumCount > 5) {
      return 'Medium';
    } else {
      return 'Low';
    }
  }

  /**
   * 获取 top N 安全问题
   * @param {Object} scanResults - 扫描结果
   * @param {number} count - 数量
   * @returns {Array} Top 安全问题
   */
  getTopIssues(scanResults, count) {
    const vulnerabilities = scanResults.vulnerabilities || [];
    return vulnerabilities
      .sort((a, b) => {
        const severityOrder = { 'Critical': 0, 'High': 1, 'Medium': 2, 'Low': 3 };
        return severityOrder[a.severity] - severityOrder[b.severity];
      })
      .slice(0, count)
      .map(v => ({
        id: v.id,
        name: v.name,
        severity: v.severity,
        description: v.description
      }));
  }

  /**
   * 评估数据本地化情况
   * @param {Object} scanResults - 扫描结果
   * @returns {Object} 数据本地化评估结果
   */
  assessDataLocalization(scanResults) {
    const vulnerabilities = scanResults.vulnerabilities || [];
    const dataIssues = vulnerabilities.filter(vuln => 
      vuln.id.includes('data-localization') ||
      vuln.name.includes('数据本地化') ||
      vuln.description.includes('数据本地化')
    );

    return {
      status: dataIssues.length === 0 ? 'Compliant' : 'Non-Compliant',
      issues: dataIssues.length,
      recommendation: dataIssues.length === 0 
        ? '数据本地化措施符合要求' 
        : '需要加强数据本地化措施，确保数据存储在国内'
    };
  }

  /**
   * 评估国内基础设施使用情况
   * @param {Object} scanResults - 扫描结果
   * @returns {Object} 国内基础设施评估结果
   */
  assessDomesticInfrastructure(scanResults) {
    const vulnerabilities = scanResults.vulnerabilities || [];
    const infraIssues = vulnerabilities.filter(vuln => 
      vuln.id.includes('china-deployment') ||
      vuln.name.includes('国产化部署') ||
      vuln.description.includes('国产化部署')
    );

    return {
      status: infraIssues.length === 0 ? 'Compliant' : 'Non-Compliant',
      issues: infraIssues.length,
      recommendation: infraIssues.length === 0 
        ? '国内基础设施使用符合要求' 
        : '需要加强国内基础设施的使用，包括服务器、数据库和中间件'
    };
  }

  /**
   * 评估法规合规情况
   * @param {Object} scanResults - 扫描结果
   * @returns {Object} 法规合规评估结果
   */
  assessRegulatoryCompliance(scanResults) {
    const vulnerabilities = scanResults.vulnerabilities || [];
    const regulatoryIssues = vulnerabilities.filter(vuln => 
      vuln.id.includes('china-regulatory') ||
      vuln.name.includes('法规合规') ||
      vuln.description.includes('法规合规')
    );

    return {
      status: regulatoryIssues.length === 0 ? 'Compliant' : 'Non-Compliant',
      issues: regulatoryIssues.length,
      recommendation: regulatoryIssues.length === 0 
        ? '法规合规情况良好' 
        : '需要加强法规合规措施，确保符合国内相关法律法规'
    };
  }

  /**
   * 评估安全认证情况
   * @param {Object} scanResults - 扫描结果
   * @returns {Object} 安全认证评估结果
   */
  assessSecurityCertification(scanResults) {
    const vulnerabilities = scanResults.vulnerabilities || [];
    const certIssues = vulnerabilities.filter(vuln => 
      vuln.id.includes('china-certification') ||
      vuln.name.includes('安全认证') ||
      vuln.description.includes('安全认证')
    );

    return {
      status: certIssues.length === 0 ? 'Compliant' : 'Non-Compliant',
      issues: certIssues.length,
      recommendation: certIssues.length === 0 
        ? '安全认证情况良好' 
        : '需要加强安全认证措施，确保符合国内相关安全认证要求'
    };
  }

  /**
   * 生成 remediation 计划
   * @param {Object} scanResults - 扫描结果
   * @returns {Array}  remediation 计划
   */
  generateRemediationPlan(scanResults) {
    const vulnerabilities = scanResults.vulnerabilities || [];
    const plan = [];

    // 按严重性分组
    const highIssues = vulnerabilities.filter(v => v.severity === 'High' || v.severity === 'Critical');
    const mediumIssues = vulnerabilities.filter(v => v.severity === 'Medium');
    const lowIssues = vulnerabilities.filter(v => v.severity === 'Low');

    if (highIssues.length > 0) {
      plan.push({
        priority: 'High',
        description: '修复高危安全问题',
        items: highIssues.map(v => v.name),
        timeframe: '1-2周',
        responsible: 'Security Team'
      });
    }

    if (mediumIssues.length > 0) {
      plan.push({
        priority: 'Medium',
        description: '修复中危安全问题',
        items: mediumIssues.map(v => v.name),
        timeframe: '3-4周',
        responsible: 'Development Team'
      });
    }

    if (lowIssues.length > 0) {
      plan.push({
        priority: 'Low',
        description: '修复低危安全问题',
        items: lowIssues.map(v => v.name),
        timeframe: '1-2个月',
        responsible: 'Development Team'
      });
    }

    // 添加中国特定的 remediation 项
    plan.push({
      priority: 'Medium',
      description: '加强数据本地化措施',
      items: ['确保数据存储在国内', '使用国内云服务提供商', '避免依赖国外服务'],
      timeframe: '1个月',
      responsible: 'Infrastructure Team'
    });

    plan.push({
      priority: 'Medium',
      description: '加强国内法规合规',
      items: ['符合网络安全法要求', '符合数据安全法要求', '符合个人信息保护法要求'],
      timeframe: '2个月',
      responsible: 'Legal & Compliance Team'
    });

    return plan;
  }

  /**
   * 生成报告结论
   * @param {Object} scanResults - 扫描结果
   * @returns {string} 报告结论
   */
  generateConclusion(scanResults) {
    const totalVulnerabilities = scanResults.summary?.totalVulnerabilities || 0;
    const highVulnerabilities = scanResults.summary?.highSeverity || 0;

    if (totalVulnerabilities === 0) {
      return '本次安全扫描未发现安全漏洞，应用符合国内法规和标准要求。建议定期进行安全扫描，保持安全状态。';
    } else if (highVulnerabilities > 0) {
      return '本次安全扫描发现高危安全漏洞，需要立即采取措施进行修复。同时，需要加强对国内法规和标准的合规性，确保应用符合要求。';
    } else {
      return '本次安全扫描发现中低危安全漏洞，需要在规定时间内进行修复。应用基本符合国内法规和标准要求，但仍需持续改进。';
    }
  }

  /**
   * 将合规报告保存为文件
   * @param {Object} report - 合规报告
   * @param {string} filePath - 文件路径
   * @param {string} format - 格式 (json, html, text)
   */
  saveReport(report, filePath, format = 'json') {
    let content;

    switch (format.toLowerCase()) {
      case 'json':
        content = JSON.stringify(report, null, 2);
        break;
      case 'html':
        content = this.generateHtmlReport(report);
        break;
      case 'text':
        content = this.generateTextReport(report);
        break;
      default:
        throw new Error(`Unsupported format: ${format}`);
    }

    fs.writeFileSync(filePath, content);
  }

  /**
   * 生成 HTML 格式的报告
   * @param {Object} report - 合规报告
   * @returns {string} HTML 报告内容
   */
  generateHtmlReport(report) {
    return `<!DOCTYPE html>
<html>
<head>
    <title>Vue 应用安全合规性报告</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 20px; }
        h1, h2, h3 { color: #333; }
        .section { margin-bottom: 30px; padding: 20px; border: 1px solid #ddd; border-radius: 5px; }
        .summary { background-color: #f5f5f5; }
        .compliance-item { margin-bottom: 10px; padding: 10px; border-left: 4px solid #4CAF50; }
        .non-compliant { border-left-color: #f44336; }
        .partially-compliant { border-left-color: #ff9800; }
        .issue { margin-bottom: 8px; padding: 8px; background-color: #f9f9f9; border-radius: 3px; }
        .high { background-color: #ffebee; }
        .medium { background-color: #fff3e0; }
        .low { background-color: #e3f2fd; }
        table { border-collapse: collapse; width: 100%; margin-top: 10px; }
        th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
        th { background-color: #f2f2f2; }
    </style>
</head>
<body>
    <h1>Vue 应用安全合规性报告</h1>
    
    <div class="section summary">
        <h2>报告信息</h2>
        <p>生成时间: ${report.reportInfo.generatedAt}</p>
        <p>应用名称: ${report.reportInfo.application}</p>
        <p>环境: ${report.reportInfo.environment}</p>
    </div>

    <div class="section">
        <h2>安全评估</h2>
        <p>整体风险: ${report.securityAssessment.overallRisk}</p>
        <p>漏洞总数: ${report.securityAssessment.vulnerabilities.total}</p>
        <p>高危: ${report.securityAssessment.vulnerabilities.high}</p>
        <p>中危: ${report.securityAssessment.vulnerabilities.medium}</p>
        <p>低危: ${report.securityAssessment.vulnerabilities.low}</p>
        
        <h3>主要问题</h3>
        ${report.securityAssessment.topIssues.map(issue => 
            `<div class="issue ${issue.severity.toLowerCase()}">
                <strong>${issue.name}</strong> (${issue.severity})
                <p>${issue.description}</p>
            </div>`
        ).join('')}
    </div>

    <div class="section">
        <h2>合规性评估</h2>
        ${Object.entries(report.complianceStandards).map(([standard, assessment]) => 
            `<div class="compliance-item ${assessment.status.toLowerCase().replace(' ', '-')}">
                <strong>${standard}</strong>
                <p>状态: ${assessment.status}</p>
                <p>相关问题: ${assessment.relatedIssues.length}</p>
            </div>`
        ).join('')}
    </div>

    <div class="section">
        <h2>中国特定要求</h2>
        <h3>数据本地化</h3>
        <p>状态: ${report.chinaSpecificRequirements.dataLocalization.status}</p>
        <p>建议: ${report.chinaSpecificRequirements.dataLocalization.recommendation}</p>
        
        <h3>国内基础设施</h3>
        <p>状态: ${report.chinaSpecificRequirements.domesticInfrastructure.status}</p>
        <p>建议: ${report.chinaSpecificRequirements.domesticInfrastructure.recommendation}</p>
        
        <h3>法规合规</h3>
        <p>状态: ${report.chinaSpecificRequirements.regulatoryCompliance.status}</p>
        <p>建议: ${report.chinaSpecificRequirements.regulatoryCompliance.recommendation}</p>
        
        <h3>安全认证</h3>
        <p>状态: ${report.chinaSpecificRequirements.securityCertification.status}</p>
        <p>建议: ${report.chinaSpecificRequirements.securityCertification.recommendation}</p>
    </div>

    <div class="section">
        <h2>修复计划</h2>
        ${report.remediationPlan.map(plan => 
            `<div class="issue ${plan.priority.toLowerCase()}">
                <strong>${plan.priority} - ${plan.description}</strong>
                <p>时间框架: ${plan.timeframe}</p>
                <p>责任团队: ${plan.responsible}</p>
                <ul>
                    ${plan.items.map(item => `<li>${item}</li>`).join('')}
                </ul>
            </div>`
        ).join('')}
    </div>

    <div class="section">
        <h2>结论</h2>
        <p>${report.conclusion}</p>
    </div>
</body>
</html>`;
  }

  /**
   * 生成文本格式的报告
   * @param {Object} report - 合规报告
   * @returns {string} 文本报告内容
   */
  generateTextReport(report) {
    let content = `Vue 应用安全合规性报告
`;
    content += `========================

`;
    
    content += `报告信息
--------
`;
    content += `生成时间: ${report.reportInfo.generatedAt}
`;
    content += `应用名称: ${report.reportInfo.application}
`;
    content += `环境: ${report.reportInfo.environment}

`;
    
    content += `安全评估
--------
`;
    content += `整体风险: ${report.securityAssessment.overallRisk}
`;
    content += `漏洞总数: ${report.securityAssessment.vulnerabilities.total}
`;
    content += `高危: ${report.securityAssessment.vulnerabilities.high}
`;
    content += `中危: ${report.securityAssessment.vulnerabilities.medium}
`;
    content += `低危: ${report.securityAssessment.vulnerabilities.low}

`;
    
    content += `主要问题
--------
`;
    report.securityAssessment.topIssues.forEach((issue, index) => {
      content += `${index + 1}. ${issue.name} (${issue.severity})
`;
      content += `   ${issue.description}

`;
    });
    
    content += `合规性评估
----------
`;
    Object.entries(report.complianceStandards).forEach(([standard, assessment]) => {
      content += `${standard}: ${assessment.status}
`;
      content += `   相关问题: ${assessment.relatedIssues.length}

`;
    });
    
    content += `中国特定要求
------------
`;
    content += `数据本地化: ${report.chinaSpecificRequirements.dataLocalization.status}
`;
    content += `   建议: ${report.chinaSpecificRequirements.dataLocalization.recommendation}

`;
    content += `国内基础设施: ${report.chinaSpecificRequirements.domesticInfrastructure.status}
`;
    content += `   建议: ${report.chinaSpecificRequirements.domesticInfrastructure.recommendation}

`;
    content += `法规合规: ${report.chinaSpecificRequirements.regulatoryCompliance.status}
`;
    content += `   建议: ${report.chinaSpecificRequirements.regulatoryCompliance.recommendation}

`;
    content += `安全认证: ${report.chinaSpecificRequirements.securityCertification.status}
`;
    content += `   建议: ${report.chinaSpecificRequirements.securityCertification.recommendation}

`;
    
    content += `修复计划
--------
`;
    report.remediationPlan.forEach(plan => {
      content += `${plan.priority} - ${plan.description}
`;
      content += `   时间框架: ${plan.timeframe}
`;
      content += `   责任团队: ${plan.responsible}
`;
      content += `   项目:
`;
      plan.items.forEach(item => {
        content += `     - ${item}
`;
      });
      content += `
`;
    });
    
    content += `结论
----
`;
    content += `${report.conclusion}
`;
    
    return content;
  }
}

module.exports = ChinaComplianceReportGenerator;