const VueSecurityMCP = require('../mcp/mcp-vue-security-scanner');

async function testChinaComplianceReport() {
  console.log('测试中国合规性报告生成功能...');
  
  const mcp = new VueSecurityMCP();
  
  // 模拟扫描结果
  const mockScanResults = {
    summary: {
      totalVulnerabilities: 5,
      highSeverity: 2,
      mediumSeverity: 2,
      lowSeverity: 1
    },
    vulnerabilities: [
      {
        id: 'gb-28448-compliance',
        name: 'GB/T 28448 信息安全技术 网络安全等级保护测评要求',
        severity: 'Critical',
        description: '未符合GB/T 28448网络安全等级保护测评要求',
        recommendation: '按照GB/T 28448标准要求实施网络安全等级保护',
        line: '3',
        file: 'test.js'
      },
      {
        id: 'gb-35273-compliance',
        name: 'GB/T 35273 信息安全技术 个人信息安全规范',
        severity: 'High',
        description: '未符合GB/T 35273个人信息安全规范要求',
        recommendation: '按照GB/T 35273标准要求实施个人信息保护措施',
        line: '15',
        file: 'test.js'
      },
      {
        id: 'china-api-key-management',
        name: '国内 API 密钥管理安全检测',
        severity: 'Critical',
        description: '国内 API 密钥管理中的潜在安全问题',
        recommendation: '确保国内 API 密钥的管理符合安全最佳实践',
        line: '45',
        file: 'test.js'
      },
      {
        id: 'china-development-environment',
        name: '国产化开发环境适配',
        severity: 'Medium',
        description: '未适配国产化开发环境',
        recommendation: '优化代码以适配国产化开发环境',
        line: '60',
        file: 'test.js'
      },
      {
        id: 'china-deployment-environment',
        name: '国产化部署环境适配',
        severity: 'Medium',
        description: '未适配国产化部署环境',
        recommendation: '优化代码以适配国产化部署环境',
        line: '70',
        file: 'test.js'
      }
    ]
  };
  
  try {
    // 生成中国合规性报告
    const reportResult = await mcp.generateChinaComplianceReport(mockScanResults, {
      application: '测试应用',
      environment: '生产环境'
    });
    
    if (reportResult.success) {
      console.log('中国合规性报告生成成功！');
      console.log('报告标题:', reportResult.report.reportInfo.title);
      console.log('生成时间:', reportResult.report.reportInfo.generatedAt);
      console.log('整体风险:', reportResult.report.securityAssessment.overallRisk);
      console.log('漏洞总数:', reportResult.report.securityAssessment.vulnerabilities.total);
      console.log('合规性标准数量:', Object.keys(reportResult.report.complianceStandards).length);
      console.log('修复计划项数:', reportResult.report.remediationPlan.length);
      console.log('报告结论:', reportResult.report.conclusion);
      
      // 保存报告为JSON文件
      const fs = require('fs');
      const path = require('path');
      const outputPath = path.join(__dirname, 'china-compliance-report.json');
      fs.writeFileSync(outputPath, JSON.stringify(reportResult.report, null, 2));
      console.log(`报告已保存到: ${outputPath}`);
      
      console.log('\n测试完成！中国合规性报告生成功能正常工作。');
    } else {
      console.error('报告生成失败:', reportResult.error);
    }
  } catch (error) {
    console.error('测试失败:', error);
  }
}

// 运行测试
testChinaComplianceReport();