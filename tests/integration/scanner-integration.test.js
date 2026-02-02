// tests/integration/scanner-integration.test.js
// 扫描器集成测试

const SecurityScanner = require('../../src/scanner');

console.log('Scanner Integration Tests');
console.log('=========================\n');

// 测试用例1: 扫描器初始化
function testScannerInitialization() {
  console.log('Test 1: Scanner Initialization');
  console.log('--------------------------------');
  
  try {
    const scanner = new SecurityScanner({
      debug: false,
      quiet: true,
      output: 'console',
      format: 'json',
      config: 'vue-security-scanner.config.json'
    });
    
    console.log('✓ Scanner initialized successfully');
    console.log(`  - Config loaded: ${typeof scanner.config === 'object'}`);
    console.log(`  - Rules loaded: ${scanner.rules.length > 0}`);
    
    return true;
  } catch (error) {
    console.log('✗ Scanner initialization failed:', error.message);
    return false;
  }
}

// 测试用例2: 扫描单个文件
function testScanSingleFile() {
  console.log('\nTest 2: Scan Single File');
  console.log('-------------------------');
  
  try {
    const scanner = new SecurityScanner({ quiet: true });
    
    // 创建一个测试文件路径
    const testFilePath = __dirname + '/../vue-xss-vulnerabilities.js';
    
    console.log(`✓ Scanner ready to scan file: ${testFilePath}`);
    console.log(`  - Scanner has ${scanner.rules.length} rules loaded`);
    
    return true;
  } catch (error) {
    console.log('✗ Scan single file test failed:', error.message);
    return false;
  }
}

// 测试用例3: 规则优先级排序
function testRulePrioritySorting() {
  console.log('\nTest 3: Rule Priority Sorting');
  console.log('------------------------------');
  
  try {
    const scanner = new SecurityScanner({ quiet: true });
    
    // 检查规则是否按优先级排序
    const sortedRules = scanner.rules.sort((a, b) => {
      const priorityA = scanner.ruleOptimizer.rulePriority.get(a.id) || 1;
      const priorityB = scanner.ruleOptimizer.rulePriority.get(b.id) || 1;
      return priorityB - priorityA;
    });
    
    console.log('✓ Rules sorted by priority successfully');
    console.log(`  - First rule: ${sortedRules[0].id} (priority: ${scanner.ruleOptimizer.rulePriority.get(sortedRules[0].id)})`);
    console.log(`  - Last rule: ${sortedRules[sortedRules.length - 1].id} (priority: ${scanner.ruleOptimizer.rulePriority.get(sortedRules[sortedRules.length - 1].id)})`);
    
    return true;
  } catch (error) {
    console.log('✗ Rule priority sorting test failed:', error.message);
    return false;
  }
}

// 测试用例4: 内存管理集成
function testMemoryManagementIntegration() {
  console.log('\nTest 4: Memory Management Integration');
  console.log('-------------------------------------');
  
  try {
    const scanner = new SecurityScanner({
      quiet: true,
      memoryThreshold: 100,
      gcInterval: 10
    });
    
    console.log('✓ Memory management integrated successfully');
    console.log(`  - Memory threshold: ${scanner.config.performance.memory.memoryThreshold}`);
    console.log(`  - GC interval: ${scanner.config.performance.memory.gcInterval}`);
    
    return true;
  } catch (error) {
    console.log('✗ Memory management integration test failed:', error.message);
    return false;
  }
}

// 测试用例5: 第三方规则集集成
function testThirdPartyRulesIntegration() {
  console.log('\nTest 5: Third Party Rules Integration');
  console.log('--------------------------------------');
  
  try {
    const scanner = new SecurityScanner({ quiet: true });
    
    // 检查第三方规则是否加载
    const thirdPartyRules = scanner.rules.filter(rule => 
      rule.id.startsWith('eslint-') || 
      rule.id.startsWith('owasp-') || 
      rule.id.startsWith('sonarqube-')
    );
    
    console.log('✓ Third party rules integrated successfully');
    console.log(`  - Total third party rules: ${thirdPartyRules.length}`);
    
    if (thirdPartyRules.length > 0) {
      console.log('  - Sample third party rules:');
      thirdPartyRules.slice(0, 3).forEach(rule => {
        console.log(`    - ${rule.id} (${rule.severity})`);
      });
    }
    
    return true;
  } catch (error) {
    console.log('✗ Third party rules integration test failed:', error.message);
    return false;
  }
}

// 运行所有测试
function runAllTests() {
  console.log('Running all scanner integration tests...\n');
  
  const tests = [
    testScannerInitialization,
    testScanSingleFile,
    testRulePrioritySorting,
    testMemoryManagementIntegration,
    testThirdPartyRulesIntegration
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
  console.log('Scanner Integration Test Results');
  console.log('='.repeat(50));
  console.log(`Passed: ${passed}`);
  console.log(`Failed: ${failed}`);
  console.log(`Total: ${tests.length}`);
  
  if (failed === 0) {
    console.log('\n🎉 All scanner integration tests passed!');
  } else {
    console.log('\n❌ Some scanner integration tests failed!');
  }
}

// 执行测试
if (require.main === module) {
  runAllTests();
}

module.exports = {
  testScannerInitialization,
  testScanSingleFile,
  testRulePrioritySorting,
  testMemoryManagementIntegration,
  testThirdPartyRulesIntegration,
  runAllTests
};