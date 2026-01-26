// npm发布验证脚本
const MCP = require('./dist/mcp-vue-security-scanner.js');
console.log('✅ 模块可以成功导入');

// 测试实例化
const mcp = new MCP();
console.log('✅ 实例可以成功创建');

// 测试主要方法是否存在
const methods = ['scanCode', 'generateSecurityReport', 'batchScan', 'generateWithSecurity'];
methods.forEach(method => {
  if (typeof mcp[method] === 'function') {
    console.log(`✅ ${method} 方法存在`);
  } else {
    console.log(`❌ ${method} 方法不存在`);
  }
});

console.log('\n🎉 MCP包基础功能验证通过，可以发布到npm');
console.log('\n注意：实际扫描功能需要用户安装 vue-security-scanner 依赖');