// test-plugin-integration.js
// 测试插件集成

const { SecurityScanner } = require('./src/scanner');
const SqlInjectionPlugin = require('./plugins/example-plugin');

async function testPluginIntegration() {
  console.log('Testing plugin integration...\n');
  
  // 创建扫描器实例
  const scanner = new SecurityScanner();
  
  // 创建并注册插件
  const sqlPlugin = new SqlInjectionPlugin();
  scanner.detector.registerPlugin('sql-injection', sqlPlugin);
  
  console.log('Available plugins:', scanner.detector.getPluginsInfo());
  console.log('Number of enabled plugins:', scanner.detector.getPluginsInfo().filter(p => p.enabled).length);
  
  // 创建一个临时测试文件，包含潜在的SQL注入漏洞
  const testFilePath = './temp-test-file.js';
  const testContent = `
    // This would be a potential SQL injection
    const query = "SELECT * FROM users WHERE id=" + userInput;
    db.execute(query);
  `;
  
  console.log('\nTesting vulnerability detection with plugin...');
  
  // 直接测试漏洞检测器
  const vulns = await scanner.detector.detectVulnerabilities(testFilePath, testContent);
  console.log(`Found ${vulns.length} vulnerabilities:`);
  vulns.forEach((vuln, index) => {
    console.log(`${index + 1}. ${vuln.type} in ${vuln.file} - ${vuln.severity}`);
  });
  
  console.log('\nPlugin integration test completed successfully!');
}

// 运行测试
testPluginIntegration().catch(console.error);