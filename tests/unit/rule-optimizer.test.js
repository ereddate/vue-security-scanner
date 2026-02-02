// tests/unit/rule-optimizer.test.js
// 规则优化器单元测试

const ruleOptimizer = require('../../src/rules/rule-optimizer');
const securityRules = require('../../src/rules/security-rules');

console.log('Rule Optimizer Unit Tests');
console.log('=========================\n');

// 测试用例1: 规则优化器初始化
function testRuleOptimizerInitialization() {
  console.log('Test 1: Rule Optimizer Initialization');
  console.log('--------------------------------------');
  
  try {
    ruleOptimizer.initialize(securityRules);
    console.log('✓ Rule optimizer initialized successfully');
    return true;
  } catch (error) {
    console.log('✗ Rule optimizer initialization failed:', error.message);
    return false;
  }
}

// 测试用例2: 规则优先级设置
function testRulePriorities() {
  console.log('\nTest 2: Rule Priorities');
  console.log('------------------------');
  
  try {
    ruleOptimizer.initialize(securityRules);
    
    // 检查一些规则的优先级
    const testRules = ['xss-detection', 'secrets-detection', 'vue-directive'];
    let allPrioritiesSet = true;
    
    testRules.forEach(ruleId => {
      const priority = ruleOptimizer.rulePriority.get(ruleId);
      if (priority) {
        console.log(`✓ Rule ${ruleId} has priority: ${priority}`);
      } else {
        console.log(`✗ Rule ${ruleId} has no priority set`);
        allPrioritiesSet = false;
      }
    });
    
    return allPrioritiesSet;
  } catch (error) {
    console.log('✗ Rule priorities test failed:', error.message);
    return false;
  }
}

// 测试用例3: 文件类型规则分类
function testFileTypeRules() {
  console.log('\nTest 3: File Type Rules');
  console.log('------------------------');
  
  try {
    ruleOptimizer.initialize(securityRules);
    
    const testFileTypes = ['.vue', '.js', '.ts', 'default'];
    let allFileTypesValid = true;
    
    testFileTypes.forEach(fileType => {
      if (ruleOptimizer.fileTypeRules[fileType]) {
        console.log(`✓ File type ${fileType} has ${ruleOptimizer.fileTypeRules[fileType].length} rules`);
      } else {
        console.log(`✗ File type ${fileType} has no rules`);
        allFileTypesValid = false;
      }
    });
    
    return allFileTypesValid;
  } catch (error) {
    console.log('✗ File type rules test failed:', error.message);
    return false;
  }
}

// 测试用例4: 框架规则分类
function testFrameworkRules() {
  console.log('\nTest 4: Framework Rules');
  console.log('------------------------');
  
  try {
    ruleOptimizer.initialize(securityRules);
    
    const testFrameworks = ['vue', 'react', 'uni-app', 'default'];
    let allFrameworksValid = true;
    
    testFrameworks.forEach(framework => {
      if (ruleOptimizer.frameworkRules[framework]) {
        console.log(`✓ Framework ${framework} has ${ruleOptimizer.frameworkRules[framework].length} rules`);
      } else {
        console.log(`✗ Framework ${framework} has no rules`);
        allFrameworksValid = false;
      }
    });
    
    return allFrameworksValid;
  } catch (error) {
    console.log('✗ Framework rules test failed:', error.message);
    return false;
  }
}

// 测试用例5: 规则冲突检测
function testRuleConflictDetection() {
  console.log('\nTest 5: Rule Conflict Detection');
  console.log('--------------------------------');
  
  try {
    ruleOptimizer.initialize(securityRules);
    
    // 模拟一些冲突规则
    const testRules = [
      {
        id: 'test-rule-1',
        name: 'Test Rule 1',
        severity: 'High',
        description: 'Test rule 1',
        recommendation: 'Test recommendation 1',
        patterns: [
          { key: 'test-pattern', pattern: 'test' }
        ]
      },
      {
        id: 'test-rule-2',
        name: 'Test Rule 2',
        severity: 'Low',
        description: 'Test rule 2',
        recommendation: 'Test recommendation 2',
        patterns: [
          { key: 'test-pattern', pattern: 'test' }
        ]
      }
    ];
    
    const conflicts = ruleOptimizer.detectRuleConflicts(testRules);
    console.log(`✓ Rule conflict detection completed`);
    console.log(`  - Conflicts found: ${conflicts.length}`);
    
    if (conflicts.length > 0) {
      console.log(`  - First conflict: ${conflicts[0].ruleA} vs ${conflicts[0].ruleB}`);
      console.log(`  - Conflict reason: ${conflicts[0].reason}`);
    }
    
    return true;
  } catch (error) {
    console.log('✗ Rule conflict detection test failed:', error.message);
    return false;
  }
}

// 测试用例6: 规则复杂度计算
function testRuleComplexityCalculation() {
  console.log('\nTest 6: Rule Complexity Calculation');
  console.log('------------------------------------');
  
  try {
    const testRules = [
      {
        id: 'simple-rule',
        patterns: [
          { key: 'simple', pattern: 'test' }
        ]
      },
      {
        id: 'complex-rule',
        patterns: [
          { key: 'complex', pattern: 'test.*pattern.*with.*many.*parts' }
        ]
      }
    ];
    
    testRules.forEach(rule => {
      const complexity = ruleOptimizer.calculateRuleComplexity(rule);
      console.log(`✓ Rule ${rule.id} complexity: ${complexity}`);
    });
    
    return true;
  } catch (error) {
    console.log('✗ Rule complexity calculation test failed:', error.message);
    return false;
  }
}

// 运行所有测试
function runAllTests() {
  console.log('Running all rule optimizer unit tests...\n');
  
  const tests = [
    testRuleOptimizerInitialization,
    testRulePriorities,
    testFileTypeRules,
    testFrameworkRules,
    testRuleConflictDetection,
    testRuleComplexityCalculation
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
  console.log('Rule Optimizer Unit Test Results');
  console.log('='.repeat(50));
  console.log(`Passed: ${passed}`);
  console.log(`Failed: ${failed}`);
  console.log(`Total: ${tests.length}`);
  
  if (failed === 0) {
    console.log('\n🎉 All rule optimizer tests passed!');
  } else {
    console.log('\n❌ Some rule optimizer tests failed!');
  }
}

// 执行测试
if (require.main === module) {
  runAllTests();
}

module.exports = {
  testRuleOptimizerInitialization,
  testRulePriorities,
  testFileTypeRules,
  testFrameworkRules,
  testRuleConflictDetection,
  testRuleComplexityCalculation,
  runAllTests
};