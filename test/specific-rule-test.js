// 测试特定规则的匹配
const { analyzeWithRulesLimited } = require('../src/rules/rule-engine');

// 测试SSRF和命令注入的检测
const testContent = `
const express = require('express');
const { exec } = require('child_process');

const app = express();

// SSRF漏洞: 使用用户输入发起请求
app.get('/fetch', (req, res) => {
  const url = req.query.url;
  fetch(url)
    .then(response => response.text())
    .then(data => res.send(data))
    .catch(err => res.status(500).send(err.message));
});

// 命令注入漏洞
app.get('/exec', (req, res) => {
  const command = req.query.cmd;
  exec(command, (error, stdout, stderr) => {
    if (error) {
      return res.status(500).send(error.message);
    }
    res.send(stdout);
  });
});
`;

console.log('测试SSRF和命令注入检测...\n');

// 获取所有漏洞
const allVulnerabilities = analyzeWithRulesLimited('test.js', testContent, 100);

// 筛选出SSRF和命令注入相关的漏洞
const ssrfVulns = allVulnerabilities.filter(v => v.ruleId === 'ssrf-vulnerable-request');
const commandInjectionVulns = allVulnerabilities.filter(v => v.ruleId === 'command-injection');

console.log(`总漏洞数: ${allVulnerabilities.length}`);
console.log(`SSRF漏洞数: ${ssrfVulns.length}`);
console.log(`命令注入漏洞数: ${commandInjectionVulns.length}\n`);

// 显示SSRF漏洞详情
if (ssrfVulns.length > 0) {
  console.log('SSRF漏洞详情:');
  ssrfVulns.forEach(vuln => {
    console.log(`  类型: ${vuln.type}`);
    console.log(`  行号: ${vuln.line}`);
    console.log(`  代码片段: ${vuln.codeSnippet}`);
    console.log('  ---');
  });
} else {
  console.log('未检测到SSRF漏洞');
}

// 显示命令注入漏洞详情
if (commandInjectionVulns.length > 0) {
  console.log('\n命令注入漏洞详情:');
  commandInjectionVulns.forEach(vuln => {
    console.log(`  类型: ${vuln.type}`);
    console.log(`  行号: ${vuln.line}`);
    console.log(`  代码片段: ${vuln.codeSnippet}`);
    console.log('  ---');
  });
} else {
  console.log('\n未检测到命令注入漏洞');
}

// 显示所有漏洞类型
const vulnTypes = {};
allVulnerabilities.forEach(vuln => {
  if (!vulnTypes[vuln.type]) {
    vulnTypes[vuln.type] = 0;
  }
  vulnTypes[vuln.type]++;
});

console.log('\n所有漏洞类型:');
Object.keys(vulnTypes).forEach(type => {
  console.log(`  ${type}: ${vulnTypes[type]}`);
});