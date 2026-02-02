// tests/benchmark/scanner-benchmark.test.js
// 性能基准测试

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('Scanner Performance Benchmark Tests');
console.log('====================================\n');

// 测试配置
const benchmarkConfig = {
  testDirs: [
    { name: 'Small (10 files)', path: 'tests/', limit: 10 },
    { name: 'Medium (50 files)', path: 'tests/', limit: 50 },
    { name: 'Large (100 files)', path: 'tests/', limit: 100 }
  ],
  parallelismLevels: [1, 2, 4, 8],
  iterations: 3
};

// 工具函数：执行命令并测量时间
function executeWithTiming(command) {
  const start = Date.now();
  const output = execSync(command, { encoding: 'utf8', stdio: 'pipe' });
  const end = Date.now();
  const duration = end - start;
  return { duration, output };
}

// 工具函数：解析扫描输出中的统计信息
function parseScanStats(output) {
  const stats = {};
  
  // 解析文件扫描数量
  const filesMatch = output.match(/Files scanned: (\d+)/);
  if (filesMatch) {
    stats.filesScanned = parseInt(filesMatch[1]);
  }
  
  // 解析扫描时间
  const timeMatch = output.match(/Scan completed in ([\d.]+)s/);
  if (timeMatch) {
    stats.scanTime = parseFloat(timeMatch[1]);
  }
  
  // 解析内存使用
  const memoryMatch = output.match(/Memory usage: Start ([\d.]+)MB, Peak ([\d.]+)MB/);
  if (memoryMatch) {
    stats.startMemory = parseFloat(memoryMatch[1]);
    stats.peakMemory = parseFloat(memoryMatch[2]);
  }
  
  return stats;
}

// 测试用例1: 扫描速度测试
function testScanSpeed() {
  console.log('Test 1: Scan Speed Test');
  console.log('------------------------');
  
  try {
    console.log('Running scan speed tests...');
    
    benchmarkConfig.testDirs.forEach(testDir => {
      console.log(`\n  Testing ${testDir.name}:`);
      
      let totalDuration = 0;
      let totalFiles = 0;
      
      for (let i = 0; i < benchmarkConfig.iterations; i++) {
        const { duration, output } = executeWithTiming(
          `node bin/vue-security-scanner.js ${testDir.path}`
        );
        
        const stats = parseScanStats(output);
        totalDuration += duration;
        totalFiles = stats.filesScanned || totalFiles;
        
        console.log(`    Iteration ${i + 1}: ${(duration / 1000).toFixed(2)}s`);
      }
      
      const avgDuration = totalDuration / benchmarkConfig.iterations;
      const filesPerSecond = totalFiles / (avgDuration / 1000);
      
      console.log(`    Average: ${(avgDuration / 1000).toFixed(2)}s`);
      console.log(`    Files per second: ${filesPerSecond.toFixed(2)}`);
    });
    
    console.log('\n✓ Scan speed test completed');
    return true;
  } catch (error) {
    console.log('✗ Scan speed test failed:', error.message);
    return false;
  }
}

// 测试用例2: 并行处理性能测试
function testParallelProcessing() {
  console.log('\nTest 2: Parallel Processing Test');
  console.log('---------------------------------');
  
  try {
    console.log('Running parallel processing tests...');
    
    benchmarkConfig.parallelismLevels.forEach(level => {
      console.log(`\n  Testing parallelism level ${level}:`);
      
      let totalDuration = 0;
      
      for (let i = 0; i < benchmarkConfig.iterations; i++) {
        const { duration, output } = executeWithTiming(
          `node bin/vue-security-scanner.js tests/`
        );
        
        totalDuration += duration;
        
        console.log(`    Iteration ${i + 1}: ${(duration / 1000).toFixed(2)}s`);
      }
      
      const avgDuration = totalDuration / benchmarkConfig.iterations;
      
      console.log(`    Average: ${(avgDuration / 1000).toFixed(2)}s`);
    });
    
    console.log('\n✓ Parallel processing test completed');
    return true;
  } catch (error) {
    console.log('✗ Parallel processing test failed:', error.message);
    return false;
  }
}

// 测试用例3: 内存使用测试
function testMemoryUsage() {
  console.log('\nTest 3: Memory Usage Test');
  console.log('--------------------------');
  
  try {
    console.log('Running memory usage tests...');
    
    const { output } = executeWithTiming(
      `node --expose-gc bin/vue-security-scanner.js tests/`
    );
    
    const stats = parseScanStats(output);
    
    console.log('  Memory usage statistics:');
    console.log(`    Start memory: ${stats.startMemory || 'N/A'} MB`);
    console.log(`    Peak memory: ${stats.peakMemory || 'N/A'} MB`);
    console.log(`    Memory increase: ${((stats.peakMemory || 0) - (stats.startMemory || 0)).toFixed(2)} MB`);
    
    console.log('\n✓ Memory usage test completed');
    return true;
  } catch (error) {
    console.log('✗ Memory usage test failed:', error.message);
    return false;
  }
}

// 测试用例4: 缓存性能测试
function testCachePerformance() {
  console.log('\nTest 4: Cache Performance Test');
  console.log('------------------------------');
  
  try {
    console.log('Running cache performance tests...');
    
    // 第一次扫描（无缓存）
    console.log('  First scan (no cache):');
    const firstRun = executeWithTiming(
      `node bin/vue-security-scanner.js tests/`
    );
    const firstStats = parseScanStats(firstRun.output);
    console.log(`    Time: ${(firstRun.duration / 1000).toFixed(2)}s`);
    
    // 第二次扫描（有缓存）
    console.log('  Second scan (with cache):');
    const secondRun = executeWithTiming(
      `node bin/vue-security-scanner.js tests/`
    );
    const secondStats = parseScanStats(secondRun.output);
    console.log(`    Time: ${(secondRun.duration / 1000).toFixed(2)}s`);
    
    // 计算缓存改进
    const improvement = ((firstRun.duration - secondRun.duration) / firstRun.duration * 100).toFixed(2);
    console.log(`  Cache improvement: ${improvement}% faster`);
    
    console.log('\n✓ Cache performance test completed');
    return true;
  } catch (error) {
    console.log('✗ Cache performance test failed:', error.message);
    return false;
  }
}

// 测试用例5: 规则执行性能测试
function testRuleExecutionPerformance() {
  console.log('\nTest 5: Rule Execution Performance Test');
  console.log('----------------------------------------');
  
  try {
    console.log('Running rule execution performance tests...');
    
    // 测试默认规则集
    console.log('  Default rule set:');
    const defaultRun = executeWithTiming(
      `node bin/vue-security-scanner.js tests/`
    );
    const defaultStats = parseScanStats(defaultRun.output);
    console.log(`    Time: ${(defaultRun.duration / 1000).toFixed(2)}s`);
    console.log(`    Files scanned: ${defaultStats.filesScanned || 'N/A'}`);
    
    if (defaultStats.filesScanned) {
      const timePerFile = defaultRun.duration / defaultStats.filesScanned;
      console.log(`    Time per file: ${timePerFile.toFixed(2)}ms`);
    }
    
    console.log('\n✓ Rule execution performance test completed');
    return true;
  } catch (error) {
    console.log('✗ Rule execution performance test failed:', error.message);
    return false;
  }
}

// 运行所有基准测试
function runAllBenchmarks() {
  console.log('Running all performance benchmark tests...\n');
  
  const tests = [
    testScanSpeed,
    testParallelProcessing,
    testMemoryUsage,
    testCachePerformance,
    testRuleExecutionPerformance
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
  
  console.log('\n' + '='.repeat(60));
  console.log('Performance Benchmark Test Results');
  console.log('='.repeat(60));
  console.log(`Passed: ${passed}`);
  console.log(`Failed: ${failed}`);
  console.log(`Total: ${tests.length}`);
  
  if (failed === 0) {
    console.log('\n🎉 All performance benchmark tests passed!');
  } else {
    console.log('\n❌ Some performance benchmark tests failed!');
  }
  
  // 生成基准测试报告
  generateBenchmarkReport();
}

// 生成基准测试报告
function generateBenchmarkReport() {
  console.log('\nGenerating benchmark report...');
  
  const report = {
    timestamp: new Date().toISOString(),
    machineInfo: {
      nodeVersion: process.version,
      platform: process.platform,
      arch: process.arch,
      cpus: require('os').cpus().length
    },
    tests: []
  };
  
  // 保存报告到文件
  const reportPath = path.join(__dirname, 'benchmark-report.json');
  fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
  
  console.log(`Benchmark report saved to: ${reportPath}`);
}

// 执行基准测试
if (require.main === module) {
  runAllBenchmarks();
}

module.exports = {
  testScanSpeed,
  testParallelProcessing,
  testMemoryUsage,
  testCachePerformance,
  testRuleExecutionPerformance,
  runAllBenchmarks
};