/**
 * Vue Security Scanner - 企业级插件使用示例
 * 
 * 演示如何使用插件系统进行企业级安全扫描
 */

const { SecurityScanner } = require('./src/scanner');
const fs = require('fs');
const path = require('path');

class EnterpriseSecurityDemo {
  constructor() {
    this.demoProjectPath = './demo-enterprise-project';
    this.reportsPath = './reports';
  }

  /**
   * 创建演示项目
   */
  createDemoProject() {
    console.log('🏢 Creating demo enterprise project...');
    
    // 创建项目目录
    if (!fs.existsSync(this.demoProjectPath)) {
      fs.mkdirSync(this.demoProjectPath, { recursive: true });
    }
    
    // 创建带有安全问题的Vue组件
    const riskyComponent = `<template>
  <div>
    <!-- XSS漏洞 -->
    <div v-html="userInput"></div>
    
    <!-- 不安全的内联事件处理器 -->
    <button @click="executeCode(userInput)">Submit</button>
    
    <!-- 潜在的数据泄露 -->
    <div>{{ apiKey }}</div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      userInput: '',
      apiKey: 'sk-1234567890abcdef', // 硬编码的API密钥
      password: 'admin123' // 硬编码的密码
    }
  },
  methods: {
    // 潜在的代码注入
    executeCode(code) {
      // 危险的eval使用
      eval(code);
    },
    
    // 不安全的数据库查询
    getUserById(userId) {
      // SQL注入风险
      const query = 'SELECT * FROM users WHERE id = ' + userId;
      // 执行查询...
    }
  }
}
</script>

<style>
/* 样式文件 */
</style>`;

    fs.writeFileSync(path.join(this.demoProjectPath, 'RiskyComponent.vue'), riskyComponent);
    
    // 创建有问题的package.json
    const riskyPackageJson = {
      "name": "demo-enterprise-app",
      "version": "1.0.0",
      "dependencies": {
        "lodash": "4.17.20",      // 已知漏洞版本
        "moment": "2.29.1",       // 已知漏洞版本
        "express": "4.17.1",      // 已知漏洞版本
        "axios": "0.21.1"         // 已知漏洞版本
      },
      "devDependencies": {
        "jest": "^26.0.0"
      },
      "vue": {
        "productionTip": true,     // 泄露Vue版本信息
        "performance": true        // 性能数据泄露
      }
    };
    
    fs.writeFileSync(
      path.join(this.demoProjectPath, 'package.json'),
      JSON.stringify(riskyPackageJson, null, 2)
    );
    
    // 创建服务器端代码
    const serverCode = `// 潜在安全问题的服务器端代码
const express = require('express');
const app = express();

// 潜在的SQL注入
app.get('/user/:id', (req, res) => {
  const userId = req.params.id;
  // 直接拼接SQL查询，存在SQL注入风险
  const query = 'SELECT * FROM users WHERE id = ' + userId;
  db.query(query, (err, results) => {
    res.send(results);
  });
});

// 潜在的信息泄露
app.post('/login', (req, res) => {
  const credentials = req.body;
  console.log('Login attempt:', credentials); // 日志中泄露敏感信息
  // 认证逻辑...
});

// 硬编码的密钥
const API_KEY = 'sk-internal-key-12345';

module.exports = app;`;

    fs.writeFileSync(path.join(this.demoProjectPath, 'server.js'), serverCode);
    
    console.log(`✅ Demo project created at: ${this.demoProjectPath}`);
    console.log('📁 Files created:');
    console.log('   - RiskyComponent.vue (with XSS and other issues)');
    console.log('   - package.json (with vulnerable dependencies)');
    console.log('   - server.js (with backend security issues)');
  }

  /**
   * 企业级安全扫描配置
   */
  getEnterpriseConfig() {
    return {
      rules: {
        xss: { enabled: true },
        dependencies: { enabled: true },
        configSecurity: { enabled: true }
      },
      scan: {
        maxSize: 10, // 10MB最大文件大小
        ignorePatterns: [
          'node_modules',
          'dist',
          'build',
          '.git',
          'coverage',
          'public',
          '*.min.js',
          '*.bundle.js',
          '*.map'
        ]
      },
      output: {
        showProgress: true,
        format: 'json',
        reportPath: path.join(this.reportsPath, 'enterprise-security-report.json')
      },
      plugins: {
        enabled: true,
        directory: './plugins',
        settings: {
          'sql-injection-plugin': {
            enabled: true,
            severityThreshold: 'High'
          },
          'sensitive-data-leakage-plugin': {
            enabled: true,
            severityThreshold: 'Medium'
          },
          'third-party-library-security-plugin': {
            enabled: true,
            severityThreshold: 'High'
          }
        }
      },
      enterpriseFeatures: {
        enableAdvancedThreatDetection: true,
        generateComplianceReports: true,
        sendAlertsToSIEM: false,
        customRulesPath: './enterprise-rules/',
        complianceStandards: ['OWASP', 'PCI-DSS', 'SOX']
      }
    };
  }

  /**
   * 执行企业级安全扫描
   */
  async runEnterpriseScan() {
    console.log('\n🔍 Running enterprise security scan...');
    
    // 确保报告目录存在
    if (!fs.existsSync(this.reportsPath)) {
      fs.mkdirSync(this.reportsPath, { recursive: true });
    }
    
    try {
      // 初始化扫描器
      const config = this.getEnterpriseConfig();
      const scanner = new SecurityScanner(config);
      
      console.log('\n⚙️  Scanner initialized with enterprise configuration');
      
      // 显示加载的插件
      const pluginsInfo = scanner.detector.getPluginsInfo();
      console.log('\n🔌 Loaded security plugins:');
      pluginsInfo.forEach(plugin => {
        console.log(`   • ${plugin.name} (Enabled: ${plugin.enabled})`);
      });
      
      // 执行扫描
      console.log('\n🚀 Starting security scan...');
      const startTime = Date.now();
      
      const results = await scanner.scanVueProject(this.demoProjectPath);
      
      const duration = Date.now() - startTime;
      console.log(`\n⏱️  Scan completed in ${duration}ms`);
      
      // 输出扫描结果
      this.displayResults(results);
      
      // 生成合规报告
      this.generateComplianceReport(results, pluginsInfo);
      
      return results;
      
    } catch (error) {
      console.error('❌ Enterprise scan failed:', error.message);
      throw error;
    }
  }

  /**
   * 显示扫描结果
   */
  displayResults(results) {
    console.log('\n📊 SCAN RESULTS SUMMARY:');
    console.log(`   Files scanned: ${results.scanStats.filesScanned}`);
    console.log(`   Total vulnerabilities: ${results.vulnerabilities.length}`);
    console.log(`   Scan duration: ${results.scanStats.durationMs}ms`);
    console.log(`   Errors encountered: ${results.scanStats.errors}`);
    
    // 按严重程度分类
    const highVulns = results.vulnerabilities.filter(v => 
      v.severity === 'High' || v.severity === 'Critical'
    );
    const mediumVulns = results.vulnerabilities.filter(v => 
      v.severity === 'Medium'
    );
    const lowVulns = results.vulnerabilities.filter(v => 
      v.severity === 'Low'
    );
    
    console.log('\n🔴 High Severity: ', highVulns.length);
    console.log('🟡 Medium Severity: ', mediumVulns.length);
    console.log('🟢 Low Severity: ', lowVulns.length);
    
    // 显示前几个漏洞详情
    if (results.vulnerabilities.length > 0) {
      console.log('\n📝 DETAILED VULNERABILITY REPORT:');
      
      results.vulnerabilities.slice(0, 10).forEach((vuln, index) => {
        console.log(`\n${index + 1}. [${vuln.severity}] ${vuln.type}`);
        console.log(`   File: ${vuln.file}:${vuln.line || 'N/A'}`);
        console.log(`   Description: ${vuln.description}`);
        if (vuln.plugin) {
          console.log(`   Detected by: ${vuln.plugin}`);
        }
        if (vuln.codeSnippet) {
          console.log(`   Code: ${vuln.codeSnippet.substring(0, 100)}...`);
        }
        console.log(`   Recommendation: ${vuln.recommendation}`);
      });
      
      if (results.vulnerabilities.length > 10) {
        console.log(`\n... and ${results.vulnerabilities.length - 10} more vulnerabilities`);
      }
    } else {
      console.log('\n✅ No vulnerabilities detected!');
    }
  }

  /**
   * 生成合规报告
   */
  generateComplianceReport(results, pluginsInfo) {
    const complianceReport = {
      reportMetadata: {
        timestamp: new Date().toISOString(),
        scannerVersion: '1.0.0',
        complianceStandards: ['OWASP Top 10', 'PCI-DSS', 'SOX'],
        scanConfiguration: this.getEnterpriseConfig()
      },
      projectInfo: {
        path: results.projectPath,
        scannedAt: results.scannedAt
      },
      scanSummary: results.summary,
      scanStats: results.scanStats,
      vulnerabilities: results.vulnerabilities,
      pluginsUsed: pluginsInfo,
      riskAssessment: this.calculateRiskAssessment(results.vulnerabilities),
      remediationGuide: this.generateRemediationGuide(results.vulnerabilities)
    };
    
    const reportPath = path.join(this.reportsPath, 'compliance-report.json');
    fs.writeFileSync(reportPath, JSON.stringify(complianceReport, null, 2));
    
    console.log(`\n📋 Compliance report generated: ${reportPath}`);
  }

  /**
   * 计算风险评估
   */
  calculateRiskAssessment(vulnerabilities) {
    const totalVulns = vulnerabilities.length;
    const highSev = vulnerabilities.filter(v => v.severity === 'High' || v.severity === 'Critical').length;
    const mediumSev = vulnerabilities.filter(v => v.severity === 'Medium').length;
    const lowSev = vulnerabilities.filter(v => v.severity === 'Low').length;
    
    let riskLevel = 'Low';
    if (highSev > 0) {
      riskLevel = 'High';
    } else if (mediumSev > 5 || highSev > 0) {
      riskLevel = 'Medium';
    }
    
    return {
      level: riskLevel,
      score: (highSev * 3 + mediumSev * 2 + lowSev * 1) / Math.max(1, totalVulns),
      highSeverityCount: highSev,
      mediumSeverityCount: mediumSev,
      lowSeverityCount: lowSev,
      totalVulnerabilities: totalVulns
    };
  }

  /**
   * 生成修复指南
   */
  generateRemediationGuide(vulnerabilities) {
    const recommendations = {};
    
    vulnerabilities.forEach(vuln => {
      const type = vuln.type;
      if (!recommendations[type]) {
        recommendations[type] = {
          description: vuln.description,
          recommendation: vuln.recommendation,
          affectedFiles: [],
          count: 0
        };
      }
      recommendations[type].affectedFiles.push(vuln.file);
      recommendations[type].count++;
    });
    
    return {
      uniqueIssueTypes: Object.keys(recommendations).length,
      issueCategories: recommendations,
      priorityFixes: this.getIdentifyPriorityFixes(vulnerabilities)
    };
  }

  /**
   * 识别优先修复项
   */
  getIdentifyPriorityFixes(vulnerabilities) {
    // 按严重程度和影响排序
    return vulnerabilities
      .filter(v => v.severity === 'High' || v.severity === 'Critical')
      .sort((a, b) => {
        if (a.severity === 'Critical' && b.severity !== 'Critical') return -1;
        if (b.severity === 'Critical' && a.severity !== 'Critical') return 1;
        return 0;
      })
      .slice(0, 5); // 返回前5个最高优先级的修复项
  }

  /**
   * 清理演示项目
   */
  cleanup() {
    console.log('\n🧹 Cleaning up demo project...');
    
    try {
      if (fs.existsSync(this.demoProjectPath)) {
        fs.rmSync(this.demoProjectPath, { recursive: true, force: true });
        console.log('✅ Demo project cleaned up');
      }
    } catch (error) {
      console.warn('⚠️  Could not clean up demo project:', error.message);
    }
  }

  /**
   * 运行完整演示
   */
  async runDemo() {
    console.log('🏢 Vue Security Scanner - Enterprise Plugin System Demo');
    console.log('=' .repeat(60));
    
    try {
      // 创建演示项目
      this.createDemoProject();
      
      // 运行企业级扫描
      const results = await this.runEnterpriseScan();
      
      console.log('\n🎉 Enterprise security scan completed successfully!');
      console.log('📋 Reports generated in ./reports/ directory');
      
      return results;
    } catch (error) {
      console.error('❌ Demo failed:', error.message);
      throw error;
    } finally {
      // 清理资源
      this.cleanup();
    }
  }
}

// 运行演示
if (require.main === module) {
  const demo = new EnterpriseSecurityDemo();
  demo.runDemo().catch(console.error);
}

module.exports = EnterpriseSecurityDemo;