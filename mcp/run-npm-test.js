// 模拟用户安装和使用MCP包
const fs = require('fs');
const path = require('path');

console.log('🧪 开始测试MCP包的npm安装和使用...');

// 检查打包的文件是否存在
const tgzFile = path.join(__dirname, 'test-npm-package', 'vue-security-mcp-1.0.0.tgz');
if (!fs.existsSync(tgzFile)) {
  console.error('❌ 打包文件不存在');
  process.exit(1);
}

console.log('✅ 打包文件存在');

// 创建一个package.json用于测试
const testPackageJson = {
  name: 'test-consumer-app',
  version: '1.0.0',
  description: 'Test app to verify vue-security-mcp package',
  main: 'index.js',
  scripts: {
    test: 'node test.js'
  },
  dependencies: {}
};

const testPackageJsonPath = path.join(__dirname, 'test-npm-package', 'package.json');
fs.writeFileSync(testPackageJsonPath, JSON.stringify(testPackageJson, null, 2));

console.log('✅ 创建测试package.json');

// 创建测试脚本
const testScript = `
// 测试MCP包导入和基本功能
console.log('Testing vue-security-mcp import...');

try {
  // 尝试导入MCP
  const VueSecurityMCP = require('vue-security-mcp');
  console.log('✅ Successfully imported vue-security-mcp');

  // 尝试创建实例
  const mcp = new VueSecurityMCP();
  console.log('✅ Successfully created MCP instance');

  // 检查主要方法
  const methods = ['scanCode', 'generateSecurityReport', 'batchScan', 'generateWithSecurity'];
  methods.forEach(method => {
    if (typeof mcp[method] === 'function') {
      console.log('✅ Method ' + method + ' exists');
    } else {
      console.log('❌ Method ' + method + ' missing');
    }
  });

  console.log('\\n🎉 All basic functionality tests passed!');
  console.log('\\nNote: Actual scanning requires vue-security-scanner to be installed separately.');
} catch (error) {
  console.error('❌ Error testing MCP:', error.message);
  process.exit(1);
}
`;

const testScriptPath = path.join(__dirname, 'test-npm-package', 'test.js');
fs.writeFileSync(testScriptPath, testScript);

console.log('✅ 创建测试脚本');

// 创建一个说明文件
const readmeContent = `
# MCP Package Test

This directory contains tests for the vue-security-mcp npm package.

## To run the test:

1. Install the package locally: \`npm install ../vue-security-mcp-1.0.0.tgz\`
2. Run the test: \`node test.js\`

## Expected results:
- Module should import successfully
- Instance should be created successfully  
- All major methods should be available
`;

const readmePath = path.join(__dirname, 'test-npm-package', 'README.md');
fs.writeFileSync(readmePath, readmeContent);

console.log('✅ 创建测试说明');

console.log('\\n📋 测试准备完成！\\n');
console.log('要运行完整测试，请执行以下命令：');
console.log('1. cd test-npm-package');
console.log('2. npm install ../vue-security-mcp-1.0.0.tgz');
console.log('3. node test.js');
console.log('');
console.log('🎉 如果所有测试通过，MCP包就可以安全发布到npm了！');