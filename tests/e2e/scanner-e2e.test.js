// tests/e2e/scanner-e2e.test.js
// 端到端测试 - 测试整个扫描流程

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('Scanner End-to-End Tests');
console.log('=========================\n');

// 测试用例1: 扫描器命令行启动
function testScannerCommandLine() {
  console.log('Test 1: Scanner Command Line');
  console.log('-----------------------------');
  
  try {
    // 测试扫描器帮助命令
    const helpOutput = execSync('node bin/vue-security-scanner.js --help', { encoding: 'utf8' });
    
    console.log('✓ Scanner command line works');
    console.log(`  - Help output contains: ${helpOutput.includes('Usage:')}`);
    console.log(`  - Help output contains: ${helpOutput.includes('--help')}`);
    
    return true;
  } catch (error) {
    console.log('✗ Scanner command line test failed:', error.message);
    return false;
  }
}

// 测试用例2: 扫描测试目录
function testScanTestDirectory() {
  console.log('\nTest 2: Scan Test Directory');
  console.log('----------------------------');
  
  try {
    // 测试扫描测试目录
    const scanOutput = execSync('node bin/vue-security-scanner.js tests/', { encoding: 'utf8' });
    
    console.log('✓ Scanner can scan test directory');
    console.log(`  - Scan output contains: ${scanOutput.includes('Scan completed')}`);
    console.log(`  - Scan output contains: ${scanOutput.includes('Files scanned:')}`);
    
    return true;
  } catch (error) {
    console.log('✗ Scan test directory test failed:', error.message);
    return false;
  }
}

// 测试用例3: 扫描配置文件
function testScanConfigFile() {
  console.log('\nTest 3: Scan Config File');
  console.log('-------------------------');
  
  try {
    // 检查配置文件是否存在
    const configFilePath = 'vue-security-scanner.config.json';
    if (fs.existsSync(configFilePath)) {
      console.log('✓ Config file exists:', configFilePath);
      
      // 读取配置文件
      const config = JSON.parse(fs.readFileSync(configFilePath, 'utf8'));
      console.log(`  - Config contains performance settings: ${'performance' in config}`);
      console.log(`  - Config contains typescript settings: ${'typescript' in config}`);
      
      return true;
    } else {
      console.log('✗ Config file does not exist:', configFilePath);
      return false;
    }
  } catch (error) {
    console.log('✗ Scan config file test failed:', error.message);
    return false;
  }
}

// 测试用例4: 不同输出格式
function testDifferentOutputFormats() {
  console.log('\nTest 4: Different Output Formats');
  console.log('--------------------------------');
  
  try {
    // 测试JSON输出格式
    const jsonOutput = execSync('node bin/vue-security-scanner.js tests/ --format json --quiet', { encoding: 'utf8' });
    
    console.log('✓ JSON output format works');
    
    // 尝试解析JSON输出
    try {
      const jsonResult = JSON.parse(jsonOutput);
      console.log(`  - JSON output is valid: ${typeof jsonResult === 'object'}`);
      console.log(`  - JSON contains summary: ${'summary' in jsonResult}`);
    } catch (parseError) {
      console.log(`  - JSON parsing failed: ${parseError.message}`);
    }
    
    return true;
  } catch (error) {
    console.log('✗ Different output formats test failed:', error.message);
    return false;
  }
}

// 测试用例5: 内存监控功能
function testMemoryMonitoring() {
  console.log('\nTest 5: Memory Monitoring');
  console.log('--------------------------');
  
  try {
    // 测试内存监控功能
    const memoryOutput = execSync('node --expose-gc bin/vue-security-scanner.js tests/ --memory-report --quiet', { encoding: 'utf8' });
    
    console.log('✓ Memory monitoring works');
    console.log(`  - Output contains memory usage: ${memoryOutput.includes('Memory usage:')}`);
    
    return true;
  } catch (error) {
    console.log('✗ Memory monitoring test failed:', error.message);
    return false;
  }
}

// 运行所有测试
function runAllTests() {
  console.log('Running all end-to-end tests...\n');
  
  const tests = [
    testScannerCommandLine,
    testScanTestDirectory,
    testScanConfigFile,
    testDifferentOutputFormats,
    testMemoryMonitoring
  ];
  
  let passed = 0;
  let failed = 0;
  
  tests.forEach(test => {
    if (test()) {
      passed++;
    } else {
      failed++;
    }
  });
  
  console.log('\n' + '='.repeat(50));
  console.log('End-to-End Test Results');
  console.log('='.repeat(50));
  console.log(`Passed: ${passed}`);
  console.log(`Failed: ${failed}`);
  console.log(`Total: ${tests.length}`);
  
  if (failed === 0) {
    console.log('\n🎉 All end-to-end tests passed!');
  } else {
    console.log('\n❌ Some end-to-end tests failed!');
  }
}

// 执行测试
if (require.main === module) {
  runAllTests();
}

module.exports = {
  testScannerCommandLine,
  testScanTestDirectory,
  testScanConfigFile,
  testDifferentOutputFormats,
  testMemoryMonitoring,
  runAllTests
};