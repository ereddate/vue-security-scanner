// 测试MCP包的完整性
const assert = require('assert');

try {
  // 测试能否正确引入MCP模块
  const VueSecurityMCP = require('./dist/mcp-vue-security-scanner.js');
  console.log('✅ 成功引入VueSecurityMCP');

  // 测试能否创建实例（即使没有扫描器也能创建实例）
  const mcp = new VueSecurityMCP();
  console.log('✅ 成功创建MCP实例');

  // 检查必要的方法是否存在
  assert(typeof mcp.scanCode === 'function', 'scanCode方法应该存在');
  assert(typeof mcp.generateSecurityReport === 'function', 'generateSecurityReport方法应该存在');
  assert(typeof mcp.batchScan === 'function', 'batchScan方法应该存在');
  console.log('✅ 所有必要的方法都存在');

  console.log('\n🎉 MCP包基本结构完整，可以发布到npm');
  console.log('\n注意：实际扫描功能需要安装vue-security-scanner才能使用');
  
} catch (error) {
  console.error('❌ 测试失败:', error.message);
  process.exit(1);
}