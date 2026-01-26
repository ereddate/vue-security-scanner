/**
 * 示例：AI集成与Vue Security MCP的使用
 * 展示如何在AI生成代码时进行实时安全扫描
 */

const VueSecurityMCP = require('./mcp-vue-security-scanner.js');
const fs = require('fs');

// 模拟AI代码生成函数
async function mockAIGenerateCode(prompt, options = {}) {
  console.log(`AI正在生成代码: "${prompt}"`);
  
  // 根据提示生成不同的示例代码
  if (prompt.toLowerCase().includes('xss') || prompt.toLowerCase().includes('dangerous')) {
    // 生成包含XSS漏洞的代码
    return `
<template>
  <div>
    <h1>危险的Vue组件</h1>
    <div v-html="userInput"></div>
    <input v-model="userInput" placeholder="输入内容" />
  </div>
</template>

<script>
export default {
  data() {
    return {
      userInput: ''
    }
  },
  methods: {
    dangerousMethod() {
      eval(this.userInput);
    }
  }
}
</script>
`;
  } else if (prompt.toLowerCase().includes('secure') || prompt.toLowerCase().includes('safe')) {
    // 生成安全的代码
    return `
<template>
  <div>
    <h1>安全的Vue组件</h1>
    <p>{{ safeContent }}</p>
    <input v-model="userInput" placeholder="输入内容" @input="sanitizeInput" />
  </div>
</template>

<script>
export default {
  data() {
    return {
      userInput: '',
      safeContent: ''
    }
  },
  methods: {
    sanitizeInput() {
      // 安全地处理用户输入
      this.safeContent = this.userInput.replace(/[<>]/g, '');
    }
  }
}
</script>
`;
  } else {
    // 默认生成一般代码
    return `
<template>
  <div>
    <h1>{{ title }}</h1>
    <p>{{ description }}</p>
    <button @click="handleClick">点击我</button>
  </div>
</template>

<script>
export default {
  data() {
    return {
      title: '我的Vue组件',
      description: '这是一个示例组件',
      count: 0
    }
  },
  methods: {
    handleClick() {
      this.count++;
      console.log('按钮被点击了', this.count);
    }
  }
}
</script>
`;
  }
}

// 创建MCP实例
const mcp = new VueSecurityMCP({
  batchSize: 3,
  enableMemoryOptimization: true
});

// 示例1: 直接扫描代码
async function example1() {
  console.log('=== 示例1: 直接扫描代码 ===');
  
  const vulnerableCode = `
<template>
  <div>
    <div v-html="rawHtml"></div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      rawHtml: '<script>alert("XSS")</script>'
    }
  }
}
</script>
`;

  try {
    const results = await mcp.scanCode(vulnerableCode, 'example.vue');
    console.log('扫描结果:');
    console.log(mcp.generateSecurityReport(results, 'text'));
  } catch (error) {
    console.error('扫描错误:', error.message);
  }
}

// 示例2: 与AI集成生成代码
async function example2() {
  console.log('\n=== 示例2: 与AI集成生成代码 ===');
  
  const prompts = [
    '创建一个带有潜在XSS漏洞的Vue组件',
    '创建一个安全的Vue组件',
    '创建一个包含危险eval操作的Vue组件'
  ];
  
  for (const prompt of prompts) {
    try {
      console.log(`\n处理提示: "${prompt}"`);
      const result = await mcp.generateWithSecurity(mockAIGenerateCode, prompt);
      
      console.log(`生成的代码安全状态: ${result.isSafe ? '安全' : '存在风险'}`);
      console.log(`发现漏洞数量: ${result.securityScan.summary.totalVulnerabilities}`);
      
      if (result.highRiskIssues.length > 0) {
        console.log('高风险问题:');
        result.highRiskIssues.forEach(issue => {
          console.log(`- ${issue.name}: ${issue.description}`);
        });
      }
      
      if (result.warnings.length > 0) {
        console.log(`中等风险问题: ${result.warnings.length}个`);
      }
      
      if (result.infos.length > 0) {
        console.log(`低风险问题: ${result.infos.length}个`);
      }
    } catch (error) {
      console.error('处理错误:', error.message);
    }
  }
}

// 示例3: 批量扫描
async function example3() {
  console.log('\n=== 示例3: 批量扫描多个代码片段 ===');
  
  const codeSnippets = [
    { code: '<template><div v-html="dangerous"></div></template>', fileName: 'snippet1.vue' },
    { code: '<template><p>{{ safe }}</p></template>', fileName: 'snippet2.vue' },
    { code: '<template><input :value="eval(userInput)"></template>', fileName: 'snippet3.vue' },
    { code: '<template><div :inner-html="content"></div></template>', fileName: 'snippet4.vue' },
    { code: '<template><p>Normal content</p></template>', fileName: 'snippet5.vue' }
  ];
  
  try {
    const results = await mcp.batchScan(codeSnippets);
    console.log(`批量扫描完成，共扫描 ${codeSnippets.length} 个代码片段`);
    
    let totalVulnerabilities = 0;
    results.forEach((result, index) => {
      totalVulnerabilities += result.summary.totalVulnerabilities;
      console.log(`片段 ${index + 1} (${codeSnippets[index].fileName}): ${result.summary.totalVulnerabilities} 个漏洞`);
    });
    
    console.log(`总计发现漏洞: ${totalVulnerabilities} 个`);
  } catch (error) {
    console.error('批量扫描错误:', error.message);
  }
}

// 示例4: 保存安全报告
async function example4() {
  console.log('\n=== 示例4: 生成并保存安全报告 ===');
  
  const dangerousCode = `
<template>
  <div>
    <div v-html="userContent"></div>
    <input v-model="userContent" />
  </div>
</template>

<script>
export default {
  data() {
    return {
      userContent: '<img src=x onerror=alert("XSS")>'
    }
  }
}
</script>
`;

  try {
    const results = await mcp.scanCode(dangerousCode, 'report-example.vue');
    
    // 生成不同格式的报告
    const jsonReport = mcp.generateSecurityReport(results, 'json');
    const textReport = mcp.generateSecurityReport(results, 'text');
    const htmlReport = mcp.generateSecurityReport(results, 'html');
    
    // 保存报告到文件
    fs.writeFileSync('security-report.json', jsonReport);
    fs.writeFileSync('security-report.txt', textReport);
    fs.writeFileSync('security-report.html', htmlReport);
    
    console.log('安全报告已生成并保存到:');
    console.log('- security-report.json');
    console.log('- security-report.txt');
    console.log('- security-report.html');
  } catch (error) {
    console.error('生成报告错误:', error.message);
  }
}

// 运行所有示例
async function runAllExamples() {
  await example1();
  await example2();
  await example3();
  await example4();
  
  console.log('\n=== 所有示例运行完成 ===');
}

// 如果直接运行此文件，则执行示例
if (require.main === module) {
  runAllExamples().catch(console.error);
}

module.exports = {
  VueSecurityMCP,
  mockAIGenerateCode
};