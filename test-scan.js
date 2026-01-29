const { analyzeWithRules, getRulesCount } = require('./src/rules/rule-engine');

// 测试代码示例
const testCode = `
// XSS 测试
const userInput = req.query.input;
document.write(userInput);

// 密码测试
const password = 'password123';

// 敏感信息测试
const apiKey = 'sk-1234567890abcdef';

// 随机数测试
const random = Math.random();

// 动态导入测试
const module = await import(userInput);
`;

console.log('=== 测试扫描 ===');
console.log('测试代码长度:', testCode.length);
console.log('使用规则数:', getRulesCount());

try {
  const results = analyzeWithRules('test.js', testCode);
  console.log('\n=== 扫描结果 ===');
  console.log(`发现问题数: ${results.length}`);
  
  if (results.length > 0) {
    console.log('\n详细结果:');
    results.forEach((result, index) => {
      console.log(`${index + 1}. [${result.severity}] ${result.name}`);
      console.log(`   规则ID: ${result.ruleId}`);
      console.log(`   位置: 行 ${result.line}`);
      console.log(`   建议: ${result.recommendation}`);
      console.log('');
    });
  } else {
    console.log('未发现安全问题');
  }
  
  console.log('\n=== 测试完成 ===');
} catch (error) {
  console.error('测试失败:', error.message);
  console.error(error.stack);
}
