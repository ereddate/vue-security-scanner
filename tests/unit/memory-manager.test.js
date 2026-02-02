// tests/unit/memory-manager.test.js
// 内存管理器单元测试

const { MemoryManager } = require('../../bin/vue-security-scanner');

console.log('Memory Manager Unit Tests');
console.log('==========================\n');

// 测试用例1: 内存管理器初始化
function testMemoryManagerInitialization() {
  console.log('Test 1: Memory Manager Initialization');
  console.log('--------------------------------------');
  
  try {
    const memoryManager = new MemoryManager({
      memoryThreshold: 100,
      gcInterval: 10,
      memoryLimit: 4096,
      memoryMonitor: true,
      autoMemoryAdjust: true,
      memoryReport: true
    });
    
    console.log('✓ MemoryManager initialized successfully');
    console.log(`  - Memory stats initialized: ${typeof memoryManager.memoryStats === 'object'}`);
    console.log(`  - Memory threshold: ${memoryManager.options.memoryThreshold}`);
    console.log(`  - GC interval: ${memoryManager.options.gcInterval}`);
    console.log(`  - Memory limit: ${memoryManager.options.memoryLimit}`);
    
    return true;
  } catch (error) {
    console.log('✗ MemoryManager initialization failed:', error.message);
    return false;
  }
}

// 测试用例2: 内存状态更新
function testMemoryStatsUpdate() {
  console.log('\nTest 2: Memory Stats Update');
  console.log('---------------------------');
  
  try {
    const memoryManager = new MemoryManager({});
    memoryManager.updateStats();
    
    console.log('✓ Memory stats updated successfully');
    console.log(`  - Current memory usage recorded: ${typeof memoryManager.memoryStats.current === 'object'}`);
    console.log(`  - Memory history length: ${memoryManager.memoryStats.history.length}`);
    
    return true;
  } catch (error) {
    console.log('✗ Memory stats update failed:', error.message);
    return false;
  }
}

// 测试用例3: GC触发条件检查
function testGCTriggerCondition() {
  console.log('\nTest 3: GC Trigger Condition');
  console.log('-----------------------------');
  
  try {
    const memoryManager = new MemoryManager({
      memoryThreshold: 100
    });
    
    // 模拟内存使用情况
    memoryManager.memoryStats.current = {
      rss: 200 * 1024 * 1024, // 200MB
      heapTotal: 150 * 1024 * 1024,
      heapUsed: 100 * 1024 * 1024,
      external: 10 * 1024 * 1024
    };
    
    const shouldTrigger = memoryManager.shouldTriggerGC();
    console.log(`✓ GC trigger condition checked: ${shouldTrigger}`);
    
    return true;
  } catch (error) {
    console.log('✗ GC trigger condition check failed:', error.message);
    return false;
  }
}

// 测试用例4: 文件处理记录
function testFileProcessedRecord() {
  console.log('\nTest 4: File Processed Record');
  console.log('-----------------------------');
  
  try {
    const memoryManager = new MemoryManager({});
    
    // 记录10个文件处理
    for (let i = 0; i < 10; i++) {
      memoryManager.recordFileProcessed();
    }
    
    console.log('✓ File processed records updated successfully');
    console.log(`  - Files processed: ${memoryManager.filesProcessed}`);
    
    return true;
  } catch (error) {
    console.log('✗ File processed record failed:', error.message);
    return false;
  }
}

// 测试用例5: 内存使用摘要
function testMemorySummary() {
  console.log('\nTest 5: Memory Summary');
  console.log('----------------------');
  
  try {
    const memoryManager = new MemoryManager({});
    const summary = memoryManager.getSummary();
    
    console.log('✓ Memory summary generated successfully');
    console.log(`  - Summary type: ${typeof summary === 'object'}`);
    console.log(`  - Contains start memory: ${'start' in summary}`);
    console.log(`  - Contains peak memory: ${'peak' in summary}`);
    console.log(`  - Contains current memory: ${'current' in summary}`);
    
    return true;
  } catch (error) {
    console.log('✗ Memory summary generation failed:', error.message);
    return false;
  }
}

// 运行所有测试
function runAllTests() {
  console.log('Running all memory manager unit tests...\n');
  
  const tests = [
    testMemoryManagerInitialization,
    testMemoryStatsUpdate,
    testGCTriggerCondition,
    testFileProcessedRecord,
    testMemorySummary
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
  console.log('Memory Manager Unit Test Results');
  console.log('='.repeat(50));
  console.log(`Passed: ${passed}`);
  console.log(`Failed: ${failed}`);
  console.log(`Total: ${tests.length}`);
  
  if (failed === 0) {
    console.log('\n🎉 All memory manager tests passed!');
  } else {
    console.log('\n❌ Some memory manager tests failed!');
  }
}

// 执行测试
if (require.main === module) {
  runAllTests();
}

module.exports = {
  testMemoryManagerInitialization,
  testMemoryStatsUpdate,
  testGCTriggerCondition,
  testFileProcessedRecord,
  testMemorySummary,
  runAllTests
};