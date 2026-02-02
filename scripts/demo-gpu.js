#!/usr/bin/env node

const GPUAccelerator = require('../src/core/gpu-accelerator');

async function demonstrateGPU() {
  console.log('🎮 GPU加速功能演示\n');
  
  // 1. 创建GPU加速器
  console.log('1. 创建GPU加速器...');
  const gpuAccelerator = new GPUAccelerator({
    enabled: true,
    maxMemory: 1024,
    workerCount: 'auto',
    batchSize: 100,
    useGPUForRegex: true
  });
  
  // 2. 初始化GPU
  console.log('2. 初始化GPU...');
  await gpuAccelerator.initialize();
  
  const status = gpuAccelerator.getStatus();
  console.log(`   初始化状态: ${status.initialized ? '✅ 成功' : '❌ 失败'}`);
  console.log(`   GPU状态: ${status.useGPU ? '🎮 使用GPU' : '💻 使用CPU'}`);
  
  if (status.error) {
    console.log(`   错误信息: ${status.error}`);
  }
  
  // 3. 演示正则表达式匹配
  console.log('\n3. 演示正则表达式匹配...');
  const sampleCode = `
    // 示例代码
    const x = eval('alert("test")');
    const y = new Function('return "hello"');
    const z = setTimeout('console.log(1)', 1000);
    const a = setInterval('console.log(2)', 1000);
  `;
  
  const securityPatterns = [
    'eval\\s*\\(',
    'new\\s+Function\\s*\\(',
    'setTimeout\\s*\\(\\s*["\']',
    'setInterval\\s*\\(\\s*["\']'
  ];
  
  console.log('   检测的安全模式:');
  securityPatterns.forEach((pattern, index) => {
    console.log(`   ${index + 1}. ${pattern}`);
  });
  
  console.log('\n   执行匹配...');
  const results = await gpuAccelerator.matchRegexPatterns(sampleCode, securityPatterns);
  
  console.log('   匹配结果:');
  securityPatterns.forEach((pattern, index) => {
    const matched = results[index] === 1;
    console.log(`   ${matched ? '✅' : '❌'} ${pattern}: ${matched ? '检测到' : '未检测到'}`);
  });
  
  // 4. 演示并行文件扫描
  console.log('\n4. 演示并行文件扫描...');
  const testFiles = [
    {
      path: 'app.js',
      content: 'const x = eval("alert(1)");'
    },
    {
      path: 'utils.js',
      content: 'const y = new Function("return 1");'
    },
    {
      path: 'main.js',
      content: 'setTimeout("console.log(1)", 1000);'
    }
  ];
  
  const scanFunction = async (file) => {
    const patterns = ['eval\\s*\\(', 'new\\s+Function\\s*\\(', 'setTimeout\\s*\\(\\s*["\']'];
    const results = await gpuAccelerator.matchRegexPatterns(file.content, patterns);
    const vulnerabilities = results.filter(r => r === 1).length;
    return {
      file: file.path,
      vulnerabilities: vulnerabilities
    };
  };
  
  console.log('   扫描文件:');
  testFiles.forEach(file => {
    console.log(`   - ${file.path}`);
  });
  
  console.log('\n   执行扫描...');
  const scanResults = await gpuAccelerator.scanFilesInParallel(testFiles, scanFunction);
  
  console.log('   扫描结果:');
  scanResults.forEach(result => {
    console.log(`   ${result.vulnerabilities > 0 ? '⚠️' : '✅'} ${result.file}: 发现 ${result.vulnerabilities} 个安全问题`);
  });
  
  // 5. 性能对比
  console.log('\n5. 性能对比演示...');
  const iterations = 10;
  const testContent = sampleCode;
  
  console.log(`   执行 ${iterations} 次匹配测试...`);
  
  const startTime = Date.now();
  for (let i = 0; i < iterations; i++) {
    await gpuAccelerator.matchRegexPatterns(testContent, securityPatterns);
  }
  const duration = Date.now() - startTime;
  
  console.log(`   总耗时: ${duration}ms`);
  console.log(`   平均耗时: ${(duration / iterations).toFixed(2)}ms`);
  console.log(`   使用模式: ${status.useGPU ? '🎮 GPU' : '💻 CPU'}`);
  
  // 6. 清理资源
  console.log('\n6. 清理资源...');
  gpuAccelerator.dispose();
  console.log('   ✅ 资源已释放');
  
  console.log('\n🎉 演示完成！');
  console.log('\n💡 提示:');
  console.log('   - 运行 "npm run test:gpu" 进行完整GPU测试');
  console.log('   - 查看 "docs/GPU_TESTING_GUIDE.md" 了解详细信息');
  console.log('   - 查看 "docs/GPU_QUICK_START.md" 了解快速开始');
}

demonstrateGPU().catch(error => {
  console.error('演示失败:', error);
  process.exit(1);
});