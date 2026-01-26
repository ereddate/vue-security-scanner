#!/usr/bin/env node

/**
 * Vue Security MCP Command Line Tool
 * 用于在命令行中使用MCP功能
 */

const fs = require('fs');
const path = require('path');
const readline = require('readline');
const VueSecurityMCP = require('./mcp-vue-security-scanner.js');

const mcp = new VueSecurityMCP();

// 解析命令行参数
const args = process.argv.slice(2);

async function main() {
  if (args.length === 0) {
    showHelp();
    return;
  }

  const command = args[0];

  switch (command) {
    case 'scan':
      await handleScan(args.slice(1));
      break;
    case 'generate':
      await handleGenerate(args.slice(1));
      break;
    case 'batch':
      await handleBatch(args.slice(1));
      break;
    case 'report':
      await handleReport(args.slice(1));
      break;
    case 'interactive':
      await handleInteractive();
      break;
    case '-h':
    case '--help':
      showHelp();
      break;
    default:
      console.error(`Unknown command: ${command}`);
      showHelp();
      break;
  }
}

function showHelp() {
  console.log(`
Vue Security MCP Tool - Help

Usage: node mcp-cli.js <command> [options]

Commands:
  scan <file>                    Scan a single Vue file
  generate <prompt>              Generate code with security scan (simulated)
  batch <files...>               Batch scan multiple files
  report <file>                  Generate security report
  interactive                    Start interactive mode
  -h, --help                     Show this help message

Examples:
  node mcp-cli.js scan mycomponent.vue
  node mcp-cli.js batch *.vue
  node mcp-cli.js interactive
  `);
}

async function handleScan(fileArgs) {
  if (fileArgs.length === 0) {
    console.error('Please specify a file to scan');
    return;
  }

  const filePath = fileArgs[0];
  
  if (!fs.existsSync(filePath)) {
    console.error(`File does not exist: ${filePath}`);
    return;
  }

  try {
    console.log(`Scanning file: ${filePath}`);
    const results = await mcp.scanFile(filePath);
    console.log(mcp.generateSecurityReport(results, 'text'));
  } catch (error) {
    console.error('Scan error:', error.message);
  }
}

async function handleGenerate(promptArgs) {
  if (promptArgs.length === 0) {
    console.error('Please provide a generation prompt');
    return;
  }

  const prompt = promptArgs.join(' ');
  console.log(`Generating code for prompt: "${prompt}"`);
  
  // 模拟AI生成代码的函数
  const mockAIGenerate = async (p) => {
    // 简单的模拟，实际应用中这里会调用真实的AI API
    if (p.toLowerCase().includes('dangerous') || p.toLowerCase().includes('xss')) {
      return `<template>\n  <div v-html="dangerousContent"></div>\n</template>`;
    } else {
      return `<template>\n  <div>{{ safeContent }}</div>\n</template>`;
    }
  };

  try {
    const result = await mcp.generateWithSecurity(mockAIGenerate, prompt);
    console.log('Generated Code:');
    console.log(result.code);
    console.log('\nSecurity Scan Results:');
    console.log(mcp.generateSecurityReport(result.securityScan, 'text'));
  } catch (error) {
    console.error('Generation error:', error.message);
  }
}

async function handleBatch(fileArgs) {
  if (fileArgs.length === 0) {
    console.error('Please specify files to batch scan');
    return;
  }

  const codeSnippets = fileArgs.map(fileName => {
    if (!fs.existsSync(fileName)) {
      console.error(`File does not exist: ${fileName}`);
      return null;
    }
    
    const code = fs.readFileSync(fileName, 'utf8');
    return { code, fileName: path.basename(fileName) };
  }).filter(Boolean);

  if (codeSnippets.length === 0) {
    console.error('No valid files to scan');
    return;
  }

  try {
    console.log(`Batch scanning ${codeSnippets.length} files...`);
    const results = await mcp.batchScan(codeSnippets);
    
    let totalVulnerabilities = 0;
    results.forEach((result, index) => {
      totalVulnerabilities += result.summary.totalVulnerabilities;
      console.log(`${codeSnippets[index].fileName}: ${result.summary.totalVulnerabilities} vulnerabilities`);
    });
    
    console.log(`\nTotal vulnerabilities found: ${totalVulnerabilities}`);
  } catch (error) {
    console.error('Batch scan error:', error.message);
  }
}

async function handleReport(fileArgs) {
  if (fileArgs.length === 0) {
    console.error('Please specify a file to generate report for');
    return;
  }

  const filePath = fileArgs[0];
  
  if (!fs.existsSync(filePath)) {
    console.error(`File does not exist: ${filePath}`);
    return;
  }

  try {
    const results = await mcp.scanFile(filePath);
    const report = mcp.generateSecurityReport(results, 'html');
    
    const reportPath = filePath.replace(/\.[^/.]+$/, '') + '_security_report.html';
    fs.writeFileSync(reportPath, report);
    
    console.log(`Security report saved to: ${reportPath}`);
  } catch (error) {
    console.error('Report generation error:', error.message);
  }
}

async function handleInteractive() {
  console.log('Vue Security MCP Interactive Mode');
  console.log('Type "help" for commands, "exit" to quit\n');

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  const askQuestion = (question) => {
    return new Promise((resolve) => {
      rl.question(question, resolve);
    });
  };

  while (true) {
    const input = await askQuestion('> ');

    if (input.toLowerCase() === 'exit' || input.toLowerCase() === 'quit') {
      break;
    }

    if (input.toLowerCase() === 'help') {
      console.log('Commands:');
      console.log('  scan <file> - Scan a Vue file');
      console.log('  paste - Paste code for scanning');
      console.log('  help - Show this help');
      console.log('  exit - Exit interactive mode');
      continue;
    }

    if (input.toLowerCase() === 'paste') {
      console.log('Paste your Vue code (type "END" on a new line to finish):');
      let code = '';
      
      while (true) {
        const line = await askQuestion('');
        if (line === 'END') {
          break;
        }
        code += line + '\n';
      }

      if (code.trim()) {
        try {
          const results = await mcp.scanCode(code, 'pasted-code.vue');
          console.log('\nScan Results:');
          console.log(mcp.generateSecurityReport(results, 'text'));
        } catch (error) {
          console.error('Scan error:', error.message);
        }
      }
      continue;
    }

    const parts = input.trim().split(/\s+/);
    if (parts[0] === 'scan' && parts.length > 1) {
      const filePath = parts[1];
      
      if (!fs.existsSync(filePath)) {
        console.log(`File does not exist: ${filePath}`);
        continue;
      }

      try {
        console.log(`Scanning: ${filePath}`);
        const results = await mcp.scanFile(filePath);
        console.log(mcp.generateSecurityReport(results, 'text'));
      } catch (error) {
        console.error('Scan error:', error.message);
      }
      continue;
    }

    console.log(`Unknown command: ${input}. Type "help" for available commands.`);
  }

  rl.close();
  console.log('Goodbye!');
}

// 运行主函数
main().catch(console.error);