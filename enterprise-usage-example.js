// enterprise-usage-example.js
// 企业级使用示例

const { SecurityScanner } = require('./src/scanner');
const fs = require('fs');

async function enterpriseUsageExample() {
  console.log('🏢 Vue Security Scanner - Enterprise Usage Example\n');
  
  // 企业级配置
  const enterpriseConfig = {
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
        '*.bundle.js'
      ]
    },
    output: {
      showProgress: true,
      format: 'json',
      reportPath: './reports/security-report.json'
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
      customRulesPath: './enterprise-rules/'
    }
  };

  // 初始化企业级扫描器
  const scanner = new SecurityScanner(enterpriseConfig);
  
  console.log('⚙️  Initialized scanner with enterprise configuration');
  console.log('🔌 Available plugins:');
  
  const pluginsInfo = scanner.detector.getPluginsInfo();
  pluginsInfo.forEach(plugin => {
    console.log(`   - ${plugin.name} (Enabled: ${plugin.enabled})`);
  });
  
  console.log('\n🎯 Enterprise features enabled:');
  console.log('   - Advanced threat detection');
  console.log('   - Compliance reporting');
  console.log('   - Custom rule integration');
  console.log('   - Plugin-based architecture');
  
  // 示例：扫描项目
  // 注意：这只是一个示例，实际使用时请替换为真实的项目路径
  const sampleProjectPath = './sample-project';
  
  // 创建示例项目目录（如果不存在）
  if (!fs.existsSync(sampleProjectPath)) {
    fs.mkdirSync(sampleProjectPath, { recursive: true });
  }
  
  // 创建示例Vue文件
  const sampleVueFile = `<template>
  <div>
    <h1>{{ title }}</h1>
    <div v-html="dynamicContent"></div>  <!-- Potential XSS -->
  </div>
</template>

<script>
export default {
  data() {
    return {
      title: 'Sample App',
      dynamicContent: '', 
      apiKey: 'sk-1234567890abcdef'  // Potential sensitive data exposure
    }
  }
}
</script>`;
  
  const sampleVuePath = `${sampleProjectPath}/SampleComponent.vue`;
  fs.writeFileSync(sampleVuePath, sampleVueFile);
  
  console.log(`\n📄 Created sample file: ${sampleVuePath}`);
  
  try {
    console.log('\n🔍 Starting enterprise security scan...');
    
    // 执行扫描
    const results = await scanner.scanVueProject(sampleProjectPath);
    
    console.log('\n📊 Scan Results Summary:');
    console.log(`   - Files scanned: ${results.scanStats.filesScanned}`);
    console.log(`   - Total vulnerabilities: ${results.vulnerabilities.length}`);
    console.log(`   - Scan duration: ${results.scanStats.durationMs}ms`);
    console.log(`   - Errors encountered: ${results.scanStats.errors}`);
    
    // 按严重程度分类漏洞
    const highVulns = results.vulnerabilities.filter(v => v.severity === 'High');
    const mediumVulns = results.vulnerabilities.filter(v => v.severity === 'Medium');
    const lowVulns = results.vulnerabilities.filter(v => v.severity === 'Low');
    
    console.log('\n🔴 High Severity Issues:', highVulns.length);
    console.log('🟡 Medium Severity Issues:', mediumVulns.length);
    console.log('🟢 Low Severity Issues:', lowVulns.length);
    
    if (results.vulnerabilities.length > 0) {
      console.log('\n📝 Sample vulnerability details:');
      // 显示前3个漏洞详情
      results.vulnerabilities.slice(0, 3).forEach((vuln, idx) => {
        console.log(`\n${idx + 1}. [${vuln.severity}] ${vuln.type}`);
        console.log(`   File: ${vuln.file}:${vuln.line || 'N/A'}`);
        console.log(`   Description: ${vuln.description}`);
        if (vuln.plugin) {
          console.log(`   Detected by: ${vuln.plugin}`);
        }
      });
    } else {
      console.log('\n✅ No vulnerabilities detected!');
    }
    
    // 保存合规报告
    const report = {
      scanDate: new Date().toISOString(),
      projectPath: sampleProjectPath,
      summary: results.summary,
      vulnerabilities: results.vulnerabilities,
      scanStats: results.scanStats,
      pluginsUsed: pluginsInfo
    };
    
    // 确保报告目录存在
    const reportsDir = './reports';
    if (!fs.existsSync(reportsDir)) {
      fs.mkdirSync(reportsDir, { recursive: true });
    }
    
    const reportPath = './reports/compliance-report.json';
    fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
    console.log(`\n📋 Compliance report saved to: ${reportPath}`);
    
  } catch (error) {
    console.error('❌ Enterprise scan failed:', error.message);
  } finally {
    // 清理示例文件
    try {
      fs.unlinkSync(sampleVuePath);
      fs.rmdirSync(sampleProjectPath);
      console.log('\n🧹 Cleaned up sample files');
    } catch (cleanupError) {
      console.warn('⚠️  Could not clean up sample files:', cleanupError.message);
    }
  }
  
  console.log('\n✅ Enterprise usage example completed');
}

// 运行示例
enterpriseUsageExample().catch(console.error);