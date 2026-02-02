#!/usr/bin/env node

const GPUAccelerator = require('../src/core/gpu-accelerator');
const os = require('os');

class GPUTester {
  constructor() {
    this.testResults = [];
  }

  log(message, type = 'info') {
    const colors = {
      info: '\x1b[36m',
      success: '\x1b[32m',
      warning: '\x1b[33m',
      error: '\x1b[31m',
      reset: '\x1b[0m'
    };
    console.log(`${colors[type]}${message}${colors.reset}`);
  }

  async testGPUInitialization() {
    this.log('\n=== 测试1: GPU初始化 ===', 'info');
    
    const gpuAccelerator = new GPUAccelerator({
      enabled: true,
      maxMemory: 1024,
      workerCount: 'auto',
      batchSize: 100,
      useGPUForRegex: true,
      useGPUForAnalysis: false
    });

    try {
      await gpuAccelerator.initialize();
      const status = gpuAccelerator.getStatus();
      
      this.log(`GPU初始化状态: ${status.initialized ? '成功' : '失败'}`, 
        status.initialized ? 'success' : 'error');
      this.log(`GPU使用状态: ${status.useGPU ? '使用GPU' : '回退到CPU'}`, 
        status.useGPU ? 'success' : 'warning');
      
      if (status.error) {
        this.log(`错误信息: ${status.error}`, 'error');
      }
      
      this.testResults.push({
        test: 'GPU初始化',
        passed: status.initialized,
        useGPU: status.useGPU,
        error: status.error
      });

      return gpuAccelerator;
    } catch (error) {
      this.log(`GPU初始化异常: ${error.message}`, 'error');
      this.testResults.push({
        test: 'GPU初始化',
        passed: false,
        useGPU: false,
        error: error.message
      });
      return null;
    }
  }

  async testRegexMatching(gpuAccelerator) {
    this.log('\n=== 测试2: 正则表达式匹配 ===', 'info');
    
    const testContent = `
      const x = eval('alert("test")');
      const y = new Function('return "hello"');
      const z = setTimeout('alert(1)', 1000);
    `;

    const patterns = [
      'eval\\s*\\(',
      'new\\s+Function\\s*\\(',
      'setTimeout\\s*\\(\\s*["\']'
    ];

    try {
      const startTime = Date.now();
      const results = await gpuAccelerator.matchRegexPatterns(testContent, patterns);
      const endTime = Date.now();
      
      const duration = endTime - startTime;
      this.log(`匹配完成，耗时: ${duration}ms`, 'info');
      this.log(`匹配结果:`, 'info');
      
      patterns.forEach((pattern, index) => {
        const matched = results[index] === 1;
        this.log(`  - ${pattern}: ${matched ? '匹配成功' : '未匹配'}`, 
          matched ? 'success' : 'warning');
      });

      this.testResults.push({
        test: '正则表达式匹配',
        passed: results.every(r => r === 1),
        duration: duration,
        useGPU: gpuAccelerator.isGPUAvailable()
      });

      return duration;
    } catch (error) {
      this.log(`正则匹配失败: ${error.message}`, 'error');
      this.testResults.push({
        test: '正则表达式匹配',
        passed: false,
        error: error.message
      });
      return null;
    }
  }

  async testParallelFileScanning(gpuAccelerator) {
    this.log('\n=== 测试3: 并行文件扫描 ===', 'info');
    
    const mockFiles = Array.from({ length: 50 }, (_, i) => ({
      path: `test-file-${i}.js`,
      content: `
        // Test file ${i}
        const func${i} = function() {
          return ${i};
        };
        const eval${i} = eval('console.log("test")');
      `
    }));

    const scanFunction = async (file) => {
      const patterns = ['eval\\s*\\(', 'function\\s*\\('];
      const results = await gpuAccelerator.matchRegexPatterns(file.content, patterns);
      return {
        file: file.path,
        vulnerabilities: results.filter(r => r === 1).length
      };
    };

    try {
      const startTime = Date.now();
      const results = await gpuAccelerator.scanFilesInParallel(mockFiles, scanFunction);
      const endTime = Date.now();
      
      const duration = endTime - startTime;
      this.log(`扫描完成，文件数: ${mockFiles.length}, 耗时: ${duration}ms`, 'info');
      this.log(`平均每文件耗时: ${(duration / mockFiles.length).toFixed(2)}ms`, 'info');
      
      const totalVulnerabilities = results.reduce((sum, r) => sum + r.vulnerabilities, 0);
      this.log(`发现漏洞总数: ${totalVulnerabilities}`, 'info');

      this.testResults.push({
        test: '并行文件扫描',
        passed: results.length === mockFiles.length,
        duration: duration,
        filesScanned: mockFiles.length,
        avgTimePerFile: duration / mockFiles.length,
        useGPU: gpuAccelerator.isGPUAvailable()
      });

      return duration;
    } catch (error) {
      this.log(`并行扫描失败: ${error.message}`, 'error');
      this.testResults.push({
        test: '并行文件扫描',
        passed: false,
        error: error.message
      });
      return null;
    }
  }

  async testPerformanceComparison() {
    this.log('\n=== 测试4: 性能对比 ===', 'info');
    
    const testContent = `
      const x = eval('alert("test")');
      const y = new Function('return "hello"');
      const z = setTimeout('alert(1)', 1000);
      const a = setInterval('console.log("test")', 1000);
      const b = exec('ls -la');
    `;

    const patterns = [
      'eval\\s*\\(',
      'new\\s+Function\\s*\\(',
      'setTimeout\\s*\\(\\s*["\']',
      'setInterval\\s*\\(\\s*["\']',
      'exec\\s*\\('
    ];

    const iterations = 100;

    this.log(`执行 ${iterations} 次匹配测试...`, 'info');

    const gpuAccelerator = new GPUAccelerator({
      enabled: true,
      useGPUForRegex: true
    });
    await gpuAccelerator.initialize();

    const gpuTime = await this.measurePerformance(gpuAccelerator, testContent, patterns, iterations);
    this.log(`GPU模式总耗时: ${gpuTime}ms`, gpuAccelerator.isGPUAvailable() ? 'success' : 'warning');

    const cpuAccelerator = new GPUAccelerator({
      enabled: false,
      useGPUForRegex: false
    });
    await cpuAccelerator.initialize();

    const cpuTime = await this.measurePerformance(cpuAccelerator, testContent, patterns, iterations);
    this.log(`CPU模式总耗时: ${cpuTime}ms`, 'info');

    const speedup = cpuTime / gpuTime;
    this.log(`性能提升: ${speedup.toFixed(2)}x`, speedup > 1 ? 'success' : 'warning');

    this.testResults.push({
      test: '性能对比',
      passed: true,
      gpuTime: gpuTime,
      cpuTime: cpuTime,
      speedup: speedup,
      gpuAvailable: gpuAccelerator.isGPUAvailable()
    });

    gpuAccelerator.dispose();
    cpuAccelerator.dispose();
  }

  async measurePerformance(accelerator, content, patterns, iterations) {
    const startTime = Date.now();
    
    for (let i = 0; i < iterations; i++) {
      await accelerator.matchRegexPatterns(content, patterns);
    }
    
    return Date.now() - startTime;
  }

  displaySystemInfo() {
    this.log('\n=== 系统信息 ===', 'info');
    this.log(`操作系统: ${os.type()} ${os.release()}`, 'info');
    this.log(`CPU架构: ${os.arch()}`, 'info');
    this.log(`CPU核心数: ${os.cpus().length}`, 'info');
    this.log(`总内存: ${(os.totalmem() / 1024 / 1024 / 1024).toFixed(2)} GB`, 'info');
    this.log(`空闲内存: ${(os.freemem() / 1024 / 1024 / 1024).toFixed(2)} GB`, 'info');
  }

  displaySummary() {
    this.log('\n=== 测试总结 ===', 'info');
    
    const passedTests = this.testResults.filter(r => r.passed).length;
    const totalTests = this.testResults.length;
    
    this.log(`测试通过: ${passedTests}/${totalTests}`, 
      passedTests === totalTests ? 'success' : 'warning');

    this.testResults.forEach((result, index) => {
      this.log(`\n测试 ${index + 1}: ${result.test}`, 'info');
      this.log(`  状态: ${result.passed ? '通过' : '失败'}`, 
        result.passed ? 'success' : 'error');
      
      if (result.useGPU !== undefined) {
        this.log(`  GPU状态: ${result.useGPU ? '使用GPU' : '使用CPU'}`, 
          result.useGPU ? 'success' : 'warning');
      }
      
      if (result.duration) {
        this.log(`  耗时: ${result.duration}ms`, 'info');
      }
      
      if (result.speedup) {
        this.log(`  性能提升: ${result.speedup.toFixed(2)}x`, 
          result.speedup > 1 ? 'success' : 'warning');
      }
      
      if (result.error) {
        this.log(`  错误: ${result.error}`, 'error');
      }
    });
  }

  async runAllTests() {
    this.log('🚀 开始GPU加速器测试', 'info');
    this.displaySystemInfo();

    const gpuAccelerator = await this.testGPUInitialization();
    
    if (gpuAccelerator) {
      await this.testRegexMatching(gpuAccelerator);
      await this.testParallelFileScanning(gpuAccelerator);
      gpuAccelerator.dispose();
    }

    await this.testPerformanceComparison();
    this.displaySummary();

    this.log('\n✅ 测试完成', 'success');
  }
}

const tester = new GPUTester();
tester.runAllTests().catch(error => {
  console.error('测试失败:', error);
  process.exit(1);
});