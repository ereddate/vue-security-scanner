/**
 * Vue Security MCP (Multi-Modal Co-Pilot) Tool
 * 用于在使用AI时对Vue代码进行实时安全扫描
 */

const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');

class VueSecurityMCP {
  constructor(config = {}) {
    // 支持配置文件加载
    this.loadConfig(config);
    
    // 尝试多种方式找到扫描器
    this.scannerPath = this.findScannerPath();
    
    // 尝试加载规则，优先使用本地规则，如果不可用则尝试从npm包加载
    try {
      this.rules = require('../src/rules/security-rules.js');
    } catch (e) {
      try {
        // 尝试从npm包加载规则
        this.rules = require('vue-security-scanner/src/rules/security-rules.js');
      } catch (e2) {
        // 如果都失败了，抛出错误
        console.warn('无法加载安全规则:', e.message, e2.message);
        this.rules = [];
      }
    }
    
    this.config = {
      batchSize: this.config.batchSize || config.batchSize || 5,
      enableMemoryOptimization: this.config.enableMemoryOptimization || config.enableMemoryOptimization || true,
      reportFormat: this.config.reportFormat || config.reportFormat || 'json',
      outputDir: this.config.outputDir || config.outputDir || path.join(__dirname, 'output'),
      tempDir: this.config.tempDir || config.tempDir || path.join(__dirname, 'temp'),
      gcThreshold: this.config.gcThreshold || config.gcThreshold || 100,
      maxBuffer: this.config.maxBuffer || config.maxBuffer || 10 * 1024 * 1024, // 10MB
      ...config
    };
    
    // 确保输出目录存在
    if (!fs.existsSync(this.config.outputDir)) {
      fs.mkdirSync(this.config.outputDir, { recursive: true });
    }
  }

  /**
   * 查找扫描器路径，支持多种安装方式
   */
  findScannerPath() {
    // 1. 尝试从node_modules加载（npm安装）
    try {
      return require.resolve('vue-security-scanner/bin/vue-security-scanner.js');
    } catch (e) {
      // 2. 如果node_modules中没有，尝试本地路径
      const localPaths = [
        path.join(__dirname, '..', 'bin', 'vue-security-scanner.js'),  // 本地开发
        path.join(__dirname, '..', 'dist', 'bin', 'vue-security-scanner.js'),  // dist目录
        path.join(__dirname, '..', 'build', 'bin', 'vue-security-scanner.js'),  // build目录
        path.join(__dirname, '..', 'src', 'bin', 'vue-security-scanner.js'),  // src目录
        path.resolve(__dirname, '..', 'bin', 'vue-security-scanner.js')  // 绝对路径
      ];
      
      for (const p of localPaths) {
        if (fs.existsSync(p)) {
          return p;
        }
      }
      
      // 3. 如果以上都不行，尝试全局安装或其他常见路径
      try {
        const globalPath = require.resolve('vue-security-scanner');
        const binPath = path.join(path.dirname(globalPath), 'bin', 'vue-security-scanner.js');
        if (fs.existsSync(binPath)) {
          return binPath;
        }
      } catch (e3) {
        // 最后的尝试：检查当前目录的父级是否有vue-security-scanner
        const parentPath = path.join(__dirname, '..', 'node_modules', 'vue-security-scanner', 'bin', 'vue-security-scanner.js');
        if (fs.existsSync(parentPath)) {
          return parentPath;
        }
      }
    }
    
    // 如果所有方法都失败了，抛出错误
    throw new Error('无法找到vue-security-scanner，请确保已安装: npm install vue-security-scanner');
  }

  /**
   * 加载配置文件
   * @param {Object} config - 初始配置
   */
  loadConfig(config) {
    // 检查是否存在配置文件
    const configPaths = [
      path.join(__dirname, 'mcp-config.json'),
      path.join(__dirname, '..', 'mcp-config.json'),
      path.join(process.cwd(), 'mcp-config.json'),
      path.join(__dirname, 'vue-security-mcp.config.json'),
      path.join(__dirname, '..', 'vue-security-mcp.config.json'),
      path.join(process.cwd(), 'vue-security-mcp.config.json')
    ];
    
    for (const configPath of configPaths) {
      if (fs.existsSync(configPath)) {
        try {
          const configFile = JSON.parse(fs.readFileSync(configPath, 'utf8'));
          this.config = { ...this.config, ...configFile, ...config };
          return;
        } catch (error) {
          console.warn(`Could not load config from ${configPath}: ${error.message}`);
        }
      }
    }
    
    // 如果没有外部配置文件，使用默认配置
    this.config = config;
  }

  /**
   * 扫描单个代码字符串
   * @param {string} code - 要扫描的代码
   * @param {string} fileName - 文件名（用于上下文识别）
   * @returns {Promise<Object>} 扫描结果
   */
  async scanCode(code, fileName = 'temp.vue') {
    // 创建唯一的临时目录
    const tempDir = path.join(this.config.tempDir, `scan_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`);
    const tempFilePath = path.join(tempDir, fileName);
    
    try {
      // 确保临时目录存在
      if (!fs.existsSync(this.config.tempDir)) {
        fs.mkdirSync(this.config.tempDir, { recursive: true });
      }
      
      // 创建扫描专用的临时目录
      if (!fs.existsSync(tempDir)) {
        fs.mkdirSync(tempDir, { recursive: true });
      }
      
      // 写入临时代码文件
      fs.writeFileSync(tempFilePath, code);
      
      // 执行安全扫描
      const { execSync } = require('child_process');
      const output = execSync(`node "${this.scannerPath}" "${tempDir}"`, {
        encoding: 'utf8',
        maxBuffer: this.config.maxBuffer,
        env: { ...process.env, NODE_OPTIONS: this.config.enableMemoryOptimization ? '--expose-gc' : '' }
      });

      // 解析输出结果
      const results = this.parseScanOutput(output);
      return results;
    } catch (error) {
      // 清理临时目录
      if (fs.existsSync(tempDir)) {
        try {
          const files = fs.readdirSync(tempDir);
          for (const file of files) {
            const filePath = path.join(tempDir, file);
            fs.unlinkSync(filePath);
          }
          fs.rmdirSync(tempDir);
        } catch (cleanupError) {
          // 忽略清理错误
        }
      }
      
      if (error.stdout) {
        // 尝试解析输出，即使有错误
        try {
          const results = this.parseScanOutput(error.stdout);
          return results;
        } catch (parseError) {
          throw new Error(`Scanner error: ${error.message}`);
        }
      }
      
      throw new Error(`Scanner error: ${error.message}`);
    }
  }

  /**
   * 扫描代码文件
   * @param {string} filePath - 文件路径
   * @returns {Promise<Object>} 扫描结果
   */
  async scanFile(filePath) {
    const code = fs.readFileSync(filePath, 'utf8');
    return this.scanCode(code, path.basename(filePath));
  }

  /**
   * 解析扫描输出
   * @param {string} output - 扫描输出
   * @returns {Object} 解析后的结果
   */
  parseScanOutput(output) {
    const lines = output.split('\n');
    const vulnerabilities = [];
    let totalVulnerabilities = 0;
    let highSeverity = 0;
    let mediumSeverity = 0;
    let lowSeverity = 0;

    // 正则表达式匹配漏洞详情
    const vulnRegex = /(\d+)\.\s+([^-\n]+)\s*-\s*(\w+)\s+SEVERITY\s*\n\s*File:\s*(.+?)\s*\n\s*Line:\s*(\d+)\s*\n\s*Description:\s*(.+?)(?=\n\s*(?:File:|\d+\.|$))/gs;
    
    let match;
    while ((match = vulnRegex.exec(output)) !== null) {
      const [, id, name, severity, file, line, description] = match;
      vulnerabilities.push({
        id: id,
        name: name.trim(),
        severity: severity,
        description: description.trim(),
        recommendation: 'Follow security best practices for this type of vulnerability',
        line: line,
        file: file
      });
    }
    
    // 查找摘要信息
    const totalMatch = output.match(/Total Vulnerabilities:\s*(\d+)/);
    if (totalMatch) {
      totalVulnerabilities = parseInt(totalMatch[1]);
    }
    
    const highMatch = output.match(/High Severity:\s*(\d+)/);
    if (highMatch) {
      highSeverity = parseInt(highMatch[1]);
    }
    
    const mediumMatch = output.match(/Medium Severity:\s*(\d+)/);
    if (mediumMatch) {
      mediumSeverity = parseInt(mediumMatch[1]);
    }
    
    const lowMatch = output.match(/Low Severity:\s*(\d+)/);
    if (lowMatch) {
      lowSeverity = parseInt(lowMatch[1]);
    }

    return {
      vulnerabilities,
      summary: {
        totalVulnerabilities,
        highSeverity,
        mediumSeverity,
        lowSeverity,
        scanTime: new Date().toISOString()
      }
    };
  }

  /**
   * 与AI集成，在AI生成代码时进行实时安全扫描
   * @param {Function} aiGenerateFn - AI代码生成函数
   * @param {string} prompt - 用户提示
   * @param {Object} options - 生成选项
   * @returns {Promise<Object>} 包含安全扫描结果的生成结果
   */
  async generateWithSecurity(aiGenerateFn, prompt, options = {}) {
    try {
      // 生成代码
      const generatedCode = await aiGenerateFn(prompt, options);
      
      // 扫描生成的代码
      const scanResults = await this.scanCode(generatedCode, `generated-${Date.now()}.vue`);
      
      // 如果发现高危漏洞，提供修复建议
      const securityIssues = scanResults.vulnerabilities.filter(v => v.severity.toLowerCase() === 'high');
      const warnings = scanResults.vulnerabilities.filter(v => v.severity.toLowerCase() === 'medium');
      const infos = scanResults.vulnerabilities.filter(v => v.severity.toLowerCase() === 'low');
      
      return {
        code: generatedCode,
        securityScan: scanResults,
        hasSecurityIssues: scanResults.summary.totalVulnerabilities > 0,
        highRiskIssues: securityIssues,
        warnings,
        infos,
        isSafe: scanResults.summary.highSeverity === 0 && scanResults.summary.mediumSeverity === 0
      };
    } catch (error) {
      throw new Error(`Security MCP error: ${error.message}`);
    }
  }

  /**
   * 批量扫描多个代码片段
   * @param {Array<{code: string, fileName: string}>} codeSnippets - 代码片段数组
   * @returns {Promise<Array>} 扫描结果数组
   */
  async batchScan(codeSnippets) {
    const results = [];
    
    for (let i = 0; i < codeSnippets.length; i += this.config.batchSize) {
      const batch = codeSnippets.slice(i, i + this.config.batchSize);
      const batchPromises = batch.map(snippet => this.scanCode(snippet.code, snippet.fileName));
      
      const batchResults = await Promise.all(batchPromises);
      results.push(...batchResults);
      
      // 如果启用了内存优化，执行垃圾回收
      if (this.config.enableMemoryOptimization && global.gc) {
        global.gc();
      }
    }
    
    return results;
  }

  /**
   * 生成安全报告
   * @param {Object} scanResults - 扫描结果
   * @param {string} format - 报告格式 ('json', 'text', 'html')
   * @returns {string} 安全报告
   */
  generateSecurityReport(scanResults, format = 'json') {
    switch (format.toLowerCase()) {
      case 'json':
        return JSON.stringify(scanResults, null, 2);
      
      case 'text':
        let report = `Vue Security Scan Report\n`;
        report += `Generated: ${scanResults.summary.scanTime}\n`;
        report += `Total Vulnerabilities: ${scanResults.summary.totalVulnerabilities}\n`;
        report += `High Severity: ${scanResults.summary.highSeverity}\n`;
        report += `Medium Severity: ${scanResults.summary.mediumSeverity}\n`;
        report += `Low Severity: ${scanResults.summary.lowSeverity}\n\n`;
        
        if (scanResults.vulnerabilities.length > 0) {
          report += `Vulnerabilities Found:\n`;
          scanResults.vulnerabilities.forEach((vuln, idx) => {
            report += `\n${idx + 1}. ${vuln.name} (${vuln.severity})\n`;
            report += `   Description: ${vuln.description}\n`;
            report += `   Recommendation: ${vuln.recommendation}\n`;
            report += `   File: ${vuln.file}:${vuln.line}\n`;
          });
        } else {
          report += '\nNo vulnerabilities found. Code appears to be secure.';
        }
        
        return report;
      
      case 'html':
        let htmlReport = `<!DOCTYPE html>
<html>
<head>
    <title>Vue Security Scan Report</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 20px; }
        .vulnerability { margin-bottom: 20px; padding: 10px; border-left: 4px solid; }
        .high { border-color: #e74c3c; background-color: #fadbd8; }
        .medium { border-color: #f39c12; background-color: #fdebd0; }
        .low { border-color: #3498db; background-color: #d6eaf8; }
        .summary { background-color: #ecf0f1; padding: 15px; margin-bottom: 20px; }
    </style>
</head>
<body>
    <h1>Vue Security Scan Report</h1>
    <div class="summary">
        <p><strong>Generated:</strong> ${scanResults.summary.scanTime}</p>
        <p><strong>Total Vulnerabilities:</strong> ${scanResults.summary.totalVulnerabilities}</p>
        <p><strong>High Severity:</strong> ${scanResults.summary.highSeverity}</p>
        <p><strong>Medium Severity:</strong> ${scanResults.summary.mediumSeverity}</p>
        <p><strong>Low Severity:</strong> ${scanResults.summary.lowSeverity}</p>
    </div>`;
        
        if (scanResults.vulnerabilities.length > 0) {
          scanResults.vulnerabilities.forEach(vuln => {
            const severityClass = vuln.severity.toLowerCase();
            htmlReport += `
        <div class="vulnerability ${severityClass}">
            <h3>${vuln.name} <span style="font-weight: normal; font-size: 0.9em;">(${vuln.severity} Severity)</span></h3>
            <p><strong>Description:</strong> ${vuln.description}</p>
            <p><strong>Recommendation:</strong> ${vuln.recommendation}</p>
            <p><strong>Location:</strong> ${vuln.file}:${vuln.line}</p>
        </div>`;
          });
        } else {
          htmlReport += `<p>No vulnerabilities found. Code appears to be secure.</p>`;
        }
        
        htmlReport += `
</body>
</html>`;
        return htmlReport;
      
      default:
        throw new Error(`Unsupported format: ${format}`);
    }
  }
}

module.exports = VueSecurityMCP;

// 如果直接运行此文件，提供一个简单的命令行界面
if (require.main === module) {
  const mcp = new VueSecurityMCP();
  
  // 简单的命令行参数处理
  const args = process.argv.slice(2);
  
  if (args.length === 0) {
    console.log('Vue Security MCP Tool');
    console.log('Usage:');
    console.log('  node mcp-vue-security-scanner.js <file-path>    # Scan a file');
    console.log('  echo "<code>" | node mcp-vue-security-scanner.js -  # Scan code from stdin');
    process.exit(0);
  }
  
  if (args[0] === '-') {
    // 从标准输入读取代码
    let input = '';
    process.stdin.setEncoding('utf8');
    process.stdin.on('readable', () => {
      let chunk;
      while ((chunk = process.stdin.read()) !== null) {
        input += chunk;
      }
    });
    process.stdin.on('end', async () => {
      try {
        const results = await mcp.scanCode(input, 'stdin.vue');
        console.log(mcp.generateSecurityReport(results, 'text'));
      } catch (error) {
        console.error('Error:', error.message);
        process.exit(1);
      }
    });
  } else {
    // 扫描文件
    const filePath = args[0];
    if (!fs.existsSync(filePath)) {
      console.error(`File does not exist: ${filePath}`);
      process.exit(1);
    }
    
    mcp.scanFile(filePath)
      .then(results => {
        console.log(mcp.generateSecurityReport(results, 'text'));
      })
      .catch(error => {
        console.error('Error:', error.message);
        process.exit(1);
      });
  }
}