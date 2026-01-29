// 测试DAST扫描器
const { SecurityScanner } = require('./src/scanner');

async function testDASTScanner() {
  console.log('Testing DAST Scanner...');
  
  // 创建扫描器实例，启用DAST
  const scanner = new SecurityScanner({
    dast: {
      enabled: true,
      baseUrl: 'http://example.com', // 测试用的基础URL
      timeout: 10000,
      maxRequests: 100,
      scanDepth: 1,
      options: {
        testApi: false
      }
    }
  });
  
  try {
    // 执行扫描
    const results = await scanner.scanVueProject('.', {
      config: {
        dast: {
          enabled: true
        }
      }
    });
    
    console.log('\nScan Results:');
    console.log('Files Scanned:', results.summary.filesScanned);
    console.log('Total Vulnerabilities:', results.summary.totalVulnerabilities);
    console.log('Critical:', results.summary.criticalSeverity);
    console.log('High:', results.summary.highSeverity);
    console.log('Medium:', results.summary.mediumSeverity);
    console.log('Low:', results.summary.lowSeverity);
    
    // 检查是否有DAST漏洞
    const dastVulnerabilities = results.vulnerabilities.filter(vuln => 
      vuln.ruleId && vuln.ruleId.startsWith('DAST_')
    );
    
    console.log('\nDAST Vulnerabilities Found:', dastVulnerabilities.length);
    if (dastVulnerabilities.length > 0) {
      console.log('DAST Vulnerabilities:');
      dastVulnerabilities.forEach((vuln, index) => {
        console.log(`${index + 1}. ${vuln.type} (${vuln.severity}): ${vuln.url}`);
        console.log(`   Evidence: ${vuln.evidence}`);
      });
    }
    
    console.log('\nDAST Scanner test completed successfully!');
  } catch (error) {
    console.error('Error during DAST scan:', error);
  }
}

testDASTScanner();
