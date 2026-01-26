/**
 * Vue Security MCP 使用示例
 */

const VueSecurityMCP = require('./mcp-vue-security-scanner.js');

async function demo() {
  console.log('Vue Security MCP 演示\n');
  
  // 创建MCP实例
  const mcp = new VueSecurityMCP({
    batchSize: 3,
    enableMemoryOptimization: true,
    reportFormat: 'text'
  });
  
  console.log('1. 扫描包含安全漏洞的代码:');
  const vulnerableCode = `
<template>
  <div>
    <div v-html="userInput"></div>
    <button @click="executeCode">执行代码</button>
  </div>
</template>

<script>
export default {
  data() {
    return {
      userInput: '<img src=x onerror=alert("XSS")>'
    }
  },
  methods: {
    executeCode() {
      // 危险：使用eval执行用户输入
      eval(this.userInput);
    }
  }
}
</script>
`;

  const results = await mcp.scanCode(vulnerableCode, 'vulnerable-component.vue');
  console.log(`发现 ${results.summary.totalVulnerabilities} 个漏洞:`);
  console.log(`- 高危: ${results.summary.highSeverity}`);
  console.log(`- 中危: ${results.summary.mediumSeverity}`);
  console.log(`- 低危: ${results.summary.lowSeverity}\n`);

  console.log('2. 生成安全报告 (JSON格式):');
  const jsonReport = mcp.generateSecurityReport(results, 'json');
  console.log(jsonReport.substring(0, 200) + '...'); // 只显示前200个字符

  console.log('\n3. 生成安全报告 (HTML格式):');
  const htmlReport = mcp.generateSecurityReport(results, 'html');
  console.log('HTML报告已生成 (截取头部):');
  console.log(htmlReport.substring(0, 150) + '...');

  console.log('\n4. 模拟AI集成 - 生成带安全扫描的代码:');
  
  // 模拟AI生成代码的函数
  const aiGenerateFunction = async (prompt) => {
    console.log(`  AI生成代码: "${prompt}"`);
    
    if (prompt.toLowerCase().includes('dangerous') || prompt.toLowerCase().includes('unsafe')) {
      return `
<template>
  <div v-html="rawContent"></div>
</template>

<script>
export default {
  data() {
    return {
      rawContent: '<script>alert("XSS")</script>'
    }
  }
}
</script>
      `.trim();
    } else {
      return `
<template>
  <div>{{ safeContent }}</div>
</template>

<script>
export default {
  data() {
    return {
      safeContent: 'Hello World'
    }
  }
}
</script>
      `.trim();
    }
  };
  
  // 生成安全代码
  const secureResult = await mcp.generateWithSecurity(aiGenerateFunction, 'Create a safe Vue component');
  console.log(`  生成的代码安全: ${secureResult.isSafe}`);
  console.log(`  发现漏洞: ${secureResult.securityScan.summary.totalVulnerabilities}`);

  // 生成不安全代码
  const insecureResult = await mcp.generateWithSecurity(aiGenerateFunction, 'Create a dangerous Vue component');
  console.log(`  生成的代码安全: ${insecureResult.isSafe}`);
  console.log(`  发现漏洞: ${insecureResult.securityScan.summary.totalVulnerabilities}`);

  console.log('\n5. 批量扫描:');
  const codeSnippets = [
    { code: '<template><div v-html="danger"></div></template>', fileName: 'snippet1.vue' },
    { code: '<template><p>{{ safe }}</p></template>', fileName: 'snippet2.vue' },
    { code: '<template><input :value="eval(input)">', fileName: 'snippet3.vue' }
  ];
  
  const batchResults = await mcp.batchScan(codeSnippets);
  console.log(`  批量扫描完成，共 ${codeSnippets.length} 个代码片段`);
  batchResults.forEach((result, index) => {
    console.log(`  - 片段 ${index + 1}: ${result.summary.totalVulnerabilities} 个漏洞`);
  });

  console.log('\n演示完成！');
}

// 如果直接运行此文件，则执行演示
if (require.main === module) {
  demo().catch(console.error);
}

module.exports = { demo };