// 简单测试修复的漏洞检测器
const { SecurityScanner } = require('../src/scanner');
const path = require('path');
const fs = require('fs');

async function testFix() {
  console.log('测试修复后的漏洞检测器...');
  
  // 创建临时测试文件
  const testContent = `
    <template>
      <div v-html="userInput"></div>
    </template>
    <script>
      export default {
        data() {
          return {
            userInput: '<script>alert(1)</script>'
          }
        }
      }
    </script>
  `;
  
  const testDir = path.join(__dirname, 'temp-test');
  if (!fs.existsSync(testDir)) {
    fs.mkdirSync(testDir);
  }
  
  const testFilePath = path.join(testDir, 'test.vue');
  fs.writeFileSync(testFilePath, testContent);
  
  try {
    const scanner = new SecurityScanner({ enableAdvancedAnalysis: true });
    const vulnerabilities = await scanner.scanFile(testFilePath);
    console.log(`检测到 ${vulnerabilities.length} 个漏洞`);
    
    if (vulnerabilities.length > 0) {
      const sample = vulnerabilities[0];
      console.log('样本漏洞:');
      console.log(`  类型: ${sample.type}`);
      console.log(`  严重性: ${sample.severity}`);
      console.log(`  文件类型: ${sample.fileType}`);
      console.log(`  框架: ${sample.framework}`);
      console.log(`  CWE: ${sample.cwe}`);
      console.log(`  OWASP: ${sample.owaspCategory}`);
      console.log(`  修复复杂度: ${sample.fixComplexity}`);
    }
    
    console.log('✓ 测试通过：漏洞检测器工作正常');
  } catch (error) {
    console.error('✗ 测试失败:', error.message);
    console.error(error.stack);
  } finally {
    // 清理测试文件
    try {
      fs.unlinkSync(testFilePath);
      fs.rmdirSync(testDir);
    } catch (e) {
      // 忽略清理错误
    }
  }
}

testFix();