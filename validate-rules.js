const securityRules = require('./src/rules/security-rules');

console.log('=== 规则验证 ===');
console.log(`总规则数: ${securityRules.length}`);

// 检查重复规则
const ruleIds = new Set();
const duplicateIds = [];

securityRules.forEach(rule => {
  if (ruleIds.has(rule.id)) {
    duplicateIds.push(rule.id);
  } else {
    ruleIds.add(rule.id);
  }
});

console.log(`唯一规则数: ${ruleIds.size}`);

if (duplicateIds.length > 0) {
  console.log('重复的规则ID:', duplicateIds);
} else {
  console.log('无重复规则');
}

// 按模块分组统计
const moduleCounts = {};
securityRules.forEach(rule => {
  const moduleName = rule.module || 'unknown';
  if (!moduleCounts[moduleName]) {
    moduleCounts[moduleName] = 0;
  }
  moduleCounts[moduleName]++;
});

console.log('\n=== 模块规则统计 ===');
Object.entries(moduleCounts).forEach(([module, count]) => {
  console.log(`${module}: ${count} 条规则`);
});

console.log('\n=== 验证完成 ===');
