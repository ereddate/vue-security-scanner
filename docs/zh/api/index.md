# Vue Security Scanner API 参考

## 1. 核心 API

### 1.1 VueSecurityScanner 类

**描述**：Vue Security Scanner 的主要类，提供完整的安全扫描功能。

**构造函数**：

```javascript
const { VueSecurityScanner } = require('vue-security-scanner');

const scanner = new VueSecurityScanner(options);
```

**参数**：
- `options` (Object): 配置选项
  - `scanPath` (String): 扫描路径，默认为 `'.'`
  - `exclude` (Array): 排除路径，默认为 `['node_modules', 'dist', 'build', '.git']`
  - `rules` (Object): 规则配置
  - `performance` (Object): 性能配置
  - `reporting` (Object): 报告配置

**示例**：

```javascript
const scanner = new VueSecurityScanner({
  scanPath: './src',
  exclude: ['node_modules', 'dist', '.git'],
  rules: {
    enabled: ['vue', 'javascript', 'china-security']
  },
  performance: {
    enableCache: true
  }
});
```

### 1.2 scan() 方法

**描述**：执行安全扫描。

**签名**：

```javascript
async function scan() {}
```

**返回值**：
- `Object`: 扫描结果
  - `vulnerabilities` (Array): 发现的漏洞
  - `statistics` (Object): 扫描统计信息
  - `duration` (Number): 扫描持续时间（毫秒）
  - `timestamp` (String): 扫描时间戳

**示例**：

```javascript
const results = await scanner.scan();
console.log('扫描发现的漏洞数:', results.vulnerabilities.length);
console.log('扫描时间:', results.duration, 'ms');
```

### 1.3 generateReport() 方法

**描述**：生成安全报告。

**签名**：

```javascript
async function generateReport(results, options) {}
```

**参数**：
- `results` (Object): 扫描结果
- `options` (Object): 报告选项
  - `format` (String): 输出格式 (`'json'`, `'text'`, `'html'`)
  - `outputPath` (String): 输出文件路径
  - `title` (String): 报告标题

**返回值**：
- `Object`: 报告生成结果

**示例**：

```javascript
await scanner.generateReport(results, {
  format: 'html',
  outputPath: './security-report.html',
  title: 'Vue 应用安全报告'
});
```

### 1.4 generateComplianceReport() 方法

**描述**：生成合规性报告。

**签名**：

```javascript
async function generateComplianceReport(results, options) {}
```

**参数**：
- `results` (Object): 扫描结果
- `options` (Object): 合规性报告选项
  - `type` (String): 报告类型 (`'china'`, `'enhanced'`)
  - `format` (String): 输出格式
  - `outputPath` (String): 输出文件路径
  - `application` (String): 应用名称
  - `environment` (String): 环境名称

**返回值**：
- `Object`: 报告生成结果

**示例**：

```javascript
await scanner.generateComplianceReport(results, {
  type: 'china',
  format: 'html',
  outputPath: './china-compliance-report.html',
  application: 'My Vue App',
  environment: 'Production'
});
```

## 2. 高级 API

### 2.1 EnhancedRuleEngine 类

**描述**：增强的规则引擎，提供高级规则匹配功能。

**构造函数**：

```javascript
const { EnhancedRuleEngine } = require('vue-security-scanner/src/rules/enhanced-rule-engine');

const ruleEngine = new EnhancedRuleEngine(options);
```

**参数**：
- `options` (Object): 配置选项
  - `ruleCache` (Boolean): 启用规则缓存
  - `contextCache` (Boolean): 启用上下文缓存

**方法**：

- `enhancedPatternMatch(content, pattern, filePath, lineNumber)`: 增强的模式匹配
- `calculateConfidence(match, context, line, filePath)`: 计算匹配置信度
- `getContext(lines, index, contextSize)`: 获取代码上下文

**示例**：

```javascript
const matches = ruleEngine.enhancedPatternMatch(
  codeContent,
  /eval\(/g,
  'file.js',
  10
);
```

### 2.2 PerformanceOptimizer 类

**描述**：性能优化器，提供缓存和增量扫描功能。

**构造函数**：

```javascript
const { PerformanceOptimizer } = require('vue-security-scanner/src/utils/performance-optimizer');

const optimizer = new PerformanceOptimizer(options);
```

**参数**：
- `options` (Object): 配置选项
  - `cacheDir` (String): 缓存目录
  - `maxCacheSize` (Number): 最大缓存大小（字节）
  - `cacheTTL` (Number): 缓存过期时间（毫秒）
  - `enableCache` (Boolean): 启用缓存
  - `enableIncremental` (Boolean): 启用增量扫描

**方法**：

- `getFilesToScan(allFiles, scanHistory)`: 获取需要扫描的文件
- `isFileModified(filePath, lastHash)`: 检查文件是否修改
- `getCacheKey(filePath)`: 获取缓存键
- `getCachedResult(filePath)`: 获取缓存结果
- `setCachedResult(filePath, result)`: 设置缓存结果

**示例**：

```javascript
const filesToScan = optimizer.getFilesToScan(
  allProjectFiles,
  previousScanHistory
);
```

### 2.3 ThreatIntelligenceIntegration 类

**描述**：威胁情报集成，提供威胁数据收集和分析功能。

**构造函数**：

```javascript
const { ThreatIntelligenceIntegration } = require('vue-security-scanner/src/threat-intelligence/threat-intelligence-integration');

const threatIntel = new ThreatIntelligenceIntegration(options);
```

**参数**：
- `options` (Object): 配置选项
  - `cacheDir` (String): 缓存目录
  - `cacheTTL` (Number): 缓存过期时间（毫秒）
  - `enableCache` (Boolean): 启用缓存
  - `threatSources` (Object): 威胁情报源配置

**方法**：

- `checkDependenciesAgainstThreats(dependencies)`: 检查依赖项是否受到威胁
- `searchThreats(query)`: 搜索威胁情报
- `getAllThreats()`: 获取所有威胁情报
- `updateThreatDatabase()`: 更新威胁数据库
- `getThreatStatistics()`: 获取威胁统计信息

**示例**：

```javascript
const affectedDependencies = await threatIntel.checkDependenciesAgainstThreats(
  projectDependencies
);
```

### 2.4 UserExperienceOptimizer 类

**描述**：用户体验优化器，提供详细的错误信息和修复建议。

**构造函数**：

```javascript
const { UserExperienceOptimizer } = require('vue-security-scanner/src/utils/user-experience-optimizer');

const uxOptimizer = new UserExperienceOptimizer(options);
```

**参数**：
- `options` (Object): 配置选项

**方法**：

- `generateUserFriendlyReport(vulnerabilities)`: 生成用户友好的报告
- `getDetailedError(errorType)`: 获取详细错误信息
- `getFixSuggestions(errorType)`: 获取修复建议
- `inferErrorType(vulnerability)`: 推断错误类型
- `generateRecommendations(vulnerabilities)`: 生成建议

**示例**：

```javascript
const userFriendlyReport = uxOptimizer.generateUserFriendlyReport(
  scanResults.vulnerabilities
);
```

### 2.5 EnhancedComplianceReportGenerator 类

**描述**：增强的合规性报告生成器，提供可视化和多格式导出功能。

**构造函数**：

```javascript
const { EnhancedComplianceReportGenerator } = require('vue-security-scanner/src/reporting/enhanced-compliance-report-generator');

const reportGenerator = new EnhancedComplianceReportGenerator();
```

**方法**：

- `generateEnhancedReport(scanResults, options)`: 生成增强的报告
- `generateExecutiveSummary(scanResults)`: 生成执行摘要
- `assessComplianceStandards(scanResults)`: 评估合规性标准
- `generateVisualizations(scanResults)`: 生成可视化数据
- `saveReport(report, outputPath, format)`: 保存报告

**示例**：

```javascript
const enhancedReport = reportGenerator.generateEnhancedReport(
  scanResults, {
    application: 'My App',
    environment: 'Production'
  }
);
```

## 3. 工具 API

### 3.1 文件工具

**描述**：文件操作相关工具函数。

**导入**：

```javascript
const { fileUtils } = require('vue-security-scanner/src/utils/file-utils');
```

**方法**：

- `getFilesToScan(basePath, exclude)`: 获取需要扫描的文件
- `readFile(filePath)`: 读取文件内容
- `writeFile(filePath, content)`: 写入文件内容
- `getRelativePath(filePath, basePath)`: 获取相对路径
- `isIgnored(filePath, ignorePatterns)`: 检查文件是否被忽略

**示例**：

```javascript
const files = fileUtils.getFilesToScan('./src', ['node_modules']);
```

### 3.2 规则工具

**描述**：规则相关工具函数。

**导入**：

```javascript
const { ruleUtils } = require('vue-security-scanner/src/utils/rule-utils');
```

**方法**：

- `loadRules(ruleModules)`: 加载规则模块
- `validateRule(rule)`: 验证规则格式
- `normalizeRuleSeverity(severity)`: 标准化规则严重性
- `filterRulesBySeverity(rules, severity)`: 按严重性过滤规则

**示例**：

```javascript
const rules = ruleUtils.loadRules(['vue', 'javascript']);
```

### 3.3 报告工具

**描述**：报告相关工具函数。

**导入**：

```javascript
const { reportUtils } = require('vue-security-scanner/src/utils/report-utils');
```

**方法**：

- `formatVulnerability(vulnerability)`: 格式化漏洞信息
- `calculateSeverityScore(vulnerabilities)`: 计算严重性得分
- `groupVulnerabilitiesByType(vulnerabilities)`: 按类型分组漏洞
- `generateSummary(vulnerabilities)`: 生成摘要

**示例**：

```javascript
const summary = reportUtils.generateSummary(vulnerabilities);
```

### 3.4 安全工具

**描述**：安全相关工具函数。

**导入**：

```javascript
const { securityUtils } = require('vue-security-scanner/src/utils/security-utils');
```

**方法**：

- `detectHardcodedSecrets(content)`: 检测硬编码密钥
- `validatePasswordStrength(password)`: 验证密码强度
- `sanitizeHtml(input)`: 清理 HTML 输入
- `generateRandomToken(length)`: 生成随机令牌

**示例**：

```javascript
const secrets = securityUtils.detectHardcodedSecrets(codeContent);
```

## 4. 配置 API

### 4.1 配置加载

**描述**：加载和解析配置文件。

**导入**：

```javascript
const { loadConfig } = require('vue-security-scanner/src/config/config-loader');
```

**使用**：

```javascript
const config = loadConfig(configPath);
```

**参数**：
- `configPath` (String): 配置文件路径

**返回值**：
- `Object`: 加载的配置

### 4.2 配置默认值

**描述**：获取默认配置。

**导入**：

```javascript
const { getDefaultConfig } = require('vue-security-scanner/src/config/default-config');
```

**使用**：

```javascript
const defaultConfig = getDefaultConfig();
```

**返回值**：
- `Object`: 默认配置

## 5. 错误处理 API

### 5.1 错误类

**描述**：自定义错误类。

**导入**：

```javascript
const { 
  ScannerError, 
  ConfigError, 
  RuleError, 
  ReportError 
} = require('vue-security-scanner/src/errors');
```

**使用**：

```javascript
try {
  // 扫描代码
} catch (error) {
  if (error instanceof ScannerError) {
    console.error('扫描错误:', error.message);
  } else if (error instanceof ConfigError) {
    console.error('配置错误:', error.message);
  }
}
```

### 5.2 错误处理工具

**描述**：错误处理工具函数。

**导入**：

```javascript
const { errorUtils } = require('vue-security-scanner/src/utils/error-utils');
```

**方法**：

- `handleError(error, options)`: 处理错误
- `formatError(error)`: 格式化错误信息
- `logError(error)`: 记录错误
- `exitWithError(error, code)`: 以错误退出

**示例**：

```javascript
try {
  // 操作
} catch (error) {
  errorUtils.handleError(error, {
    verbose: true
  });
}
```

## 6. 命令行 API

### 6.1 CLI 解析器

**描述**：命令行参数解析器。

**导入**：

```javascript
const { parseCLIArgs } = require('vue-security-scanner/src/cli/cli-parser');
```

**使用**：

```javascript
const args = parseCLIArgs(process.argv);
```

**返回值**：
- `Object`: 解析后的命令行参数

### 6.2 CLI 执行器

**描述**：命令行命令执行器。

**导入**：

```javascript
const { executeCLI } = require('vue-security-scanner/src/cli/cli-executor');
```

**使用**：

```javascript
executeCLI(args);
```

**参数**：
- `args` (Object): 命令行参数

## 7. 模块 API

### 7.1 规则模块

**描述**：规则模块加载和管理。

**导入**：

```javascript
const { loadRuleModule } = require('vue-security-scanner/src/rules/rule-loader');
```

**使用**：

```javascript
const ruleModule = loadRuleModule('vue');
```

**参数**：
- `moduleName` (String): 模块名称

**返回值**：
- `Object`: 规则模块

### 7.2 报告模块

**描述**：报告模块加载和管理。

**导入**：

```javascript
const { loadReportModule } = require('vue-security-scanner/src/reporting/report-loader');
```

**使用**：

```javascript
const reportModule = loadReportModule('china');
```

**参数**：
- `moduleName` (String): 模块名称

**返回值**：
- `Object`: 报告模块

## 8. 编程示例

### 8.1 基本扫描

```javascript
const { VueSecurityScanner } = require('vue-security-scanner');

async function basicScan() {
  try {
    const scanner = new VueSecurityScanner({
      scanPath: './src',
      exclude: ['node_modules', 'dist']
    });
    
    console.log('开始扫描...');
    const results = await scanner.scan();
    console.log('扫描完成！');
    
    console.log('=== 扫描结果 ===');
    console.log(`发现漏洞数: ${results.vulnerabilities.length}`);
    console.log(`扫描时间: ${results.duration} ms`);
    console.log(`严重漏洞: ${results.vulnerabilities.filter(v => v.severity === 'Critical').length}`);
    console.log(`高危漏洞: ${results.vulnerabilities.filter(v => v.severity === 'High').length}`);
    console.log(`中危漏洞: ${results.vulnerabilities.filter(v => v.severity === 'Medium').length}`);
    console.log(`低危漏洞: ${results.vulnerabilities.filter(v => v.severity === 'Low').length}`);
    
    // 生成报告
    console.log('\n生成报告...');
    await scanner.generateReport(results, {
      format: 'html',
      outputPath: './security-report.html',
      title: 'Vue 应用安全扫描报告'
    });
    console.log('报告生成完成: ./security-report.html');
    
  } catch (error) {
    console.error('扫描失败:', error.message);
  }
}

basicScan();
```

### 8.2 高级扫描

```javascript
const { VueSecurityScanner } = require('vue-security-scanner');

async function advancedScan() {
  const scanner = new VueSecurityScanner({
    scanPath: './src',
    exclude: ['node_modules', 'dist'],
    rules: {
      enabled: ['vue', 'javascript', 'china-security', 'china-api-security', 'dependency'],
      severity: {
        critical: true,
        high: true,
        medium: true,
        low: false
      }
    },
    performance: {
      enableCache: true,
      enableIncremental: true,
      maxCacheSize: 100 * 1024 * 1024 // 100MB
    }
  });
  
  // 执行扫描
  const results = await scanner.scan();
  
  // 生成多种报告
  await Promise.all([
    // 基本安全报告
    scanner.generateReport(results, {
      format: 'html',
      outputPath: './security-report.html'
    }),
    
    // 中国合规性报告
    scanner.generateComplianceReport(results, {
      type: 'china',
      format: 'html',
      outputPath: './china-compliance-report.html'
    }),
    
    // 增强版合规性报告
    scanner.generateComplianceReport(results, {
      type: 'enhanced',
      format: 'html',
      outputPath: './enhanced-compliance-report.html'
    }),
    
    // JSON 格式报告（用于集成）
    scanner.generateReport(results, {
      format: 'json',
      outputPath: './security-report.json'
    })
  ]);
  
  console.log('所有报告生成完成！');
}

advancedScan();
```

### 8.3 自定义规则扫描

```javascript
const { VueSecurityScanner, EnhancedRuleEngine } = require('vue-security-scanner');

async function customRuleScan() {
  // 创建自定义规则
  const customRules = {
    rules: [
      {
        id: 'custom-no-console-log',
        name: '禁止使用 console.log',
        description: '生产环境中禁止使用 console.log',
        severity: 'medium',
        pattern: /console\.log\(/g,
        fix: '使用专业的日志系统',
        test: (content, filePath) => {
          return content.includes('console.log(');
        }
      },
      {
        id: 'custom-no-hardcoded-api-key',
        name: '禁止硬编码 API 密钥',
        description: '禁止在代码中硬编码 API 密钥',
        severity: 'high',
        pattern: /api[_-]?key|api[_-]?secret|access[_-]?token/gi,
        fix: '使用环境变量或配置文件',
        test: (content, filePath) => {
          return /api[_-]?key|api[_-]?secret|access[_-]?token/gi.test(content);
        }
      }
    ]
  };
  
  // 创建扫描器
  const scanner = new VueSecurityScanner({
    scanPath: './src',
    rules: {
      enabled: ['vue', 'javascript', customRules]
    }
  });
  
  // 执行扫描
  const results = await scanner.scan();
  
  // 生成报告
  await scanner.generateReport(results, {
    format: 'html',
    outputPath: './custom-rules-report.html',
    title: '自定义规则扫描报告'
  });
  
  console.log('自定义规则扫描完成！');
}

customRuleScan();
```

### 8.4 威胁情报检查

```javascript
const { ThreatIntelligenceIntegration } = require('vue-security-scanner/src/threat-intelligence/threat-intelligence-integration');

async function checkThreatIntelligence() {
  const threatIntel = new ThreatIntelligenceIntegration({
    enableCache: true,
    cacheTTL: 86400000 // 24小时
  });
  
  // 更新威胁数据库
  console.log('更新威胁数据库...');
  await threatIntel.updateThreatDatabase();
  console.log('威胁数据库更新完成！');
  
  // 检查依赖项
  const dependencies = {
    'vue': '3.2.0',
    'axios': '0.27.2',
    'lodash': '4.17.21'
  };
  
  console.log('检查依赖项威胁...');
  const affectedDependencies = await threatIntel.checkDependenciesAgainstThreats(dependencies);
  
  console.log('受影响的依赖项:');
  affectedDependencies.forEach(dep => {
    console.log(`- ${dep.dependency}@${dep.version}: ${dep.threat.title} (${dep.severity})`);
  });
  
  // 获取威胁统计
  const stats = await threatIntel.getThreatStatistics();
  console.log('\n威胁统计:');
  console.log(`总威胁数: ${stats.total}`);
  console.log(`严重威胁: ${stats.severity.critical}`);
  console.log(`高危威胁: ${stats.severity.high}`);
  console.log(`中危威胁: ${stats.severity.medium}`);
  console.log(`低危威胁: ${stats.severity.low}`);
}

checkThreatIntelligence();
```

## 9. 集成示例

### 9.1 与 Express 集成

```javascript
const express = require('express');
const { VueSecurityScanner } = require('vue-security-scanner');

const app = express();
const port = 3000;

app.use(express.json());

// 安全扫描 API
app.post('/api/security-scan', async (req, res) => {
  try {
    const { scanPath, options } = req.body;
    
    const scanner = new VueSecurityScanner({
      scanPath: scanPath || './src',
      ...options
    });
    
    const results = await scanner.scan();
    
    res.json({
      success: true,
      results: {
        vulnerabilities: results.vulnerabilities,
        statistics: results.statistics,
        duration: results.duration
      }
    });
    
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// 报告生成 API
app.post('/api/generate-report', async (req, res) => {
  try {
    const { results, reportOptions } = req.body;
    
    const scanner = new VueSecurityScanner();
    await scanner.generateReport(results, reportOptions);
    
    res.json({
      success: true,
      message: '报告生成成功'
    });
    
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

app.listen(port, () => {
  console.log(`安全扫描服务运行在 http://localhost:${port}`);
});
```

### 9.2 与 Electron 集成

```javascript
const { app, BrowserWindow, ipcMain } = require('electron');
const { VueSecurityScanner } = require('vue-security-scanner');
const path = require('path');

function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js')
    }
  });
  
  mainWindow.loadFile('index.html');
}

app.whenReady().then(() => {
  createWindow();
  
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// 扫描处理
ipcMain.handle('scan', async (event, options) => {
  const scanner = new VueSecurityScanner(options);
  return await scanner.scan();
});

// 报告生成处理
ipcMain.handle('generate-report', async (event, { results, reportOptions }) => {
  const scanner = new VueSecurityScanner();
  return await scanner.generateReport(results, reportOptions);
});

// 合规性报告生成处理
ipcMain.handle('generate-compliance-report', async (event, { results, reportOptions }) => {
  const scanner = new VueSecurityScanner();
  return await scanner.generateComplianceReport(results, reportOptions);
});
```

## 10. API 版本兼容性

### 10.1 版本变更

| 版本 | 变更 |
|------|------|
| 1.8.0 | 新增增强规则引擎、性能优化、威胁情报集成等API |
| 1.7.0 | 新增中国合规性报告API |
| 1.6.0 | 新增批量扫描API |
| 1.5.0 | 新增编程方式API |
| 1.0.0 | 初始版本 |

### 10.2 向后兼容性

Vue Security Scanner API 保持向后兼容，新版本会：

- 保留所有现有API
- 新增功能通过新方法添加
- 废弃的API会在文档中标记
- 重大变更会在主版本升级时进行

### 10.3 错误处理最佳实践

```javascript
try {
  // API 调用
} catch (error) {
  // 区分错误类型
  if (error.code === 'E_CONFIG') {
    console.error('配置错误:', error.message);
  } else if (error.code === 'E_SCAN') {
    console.error('扫描错误:', error.message);
  } else if (error.code === 'E_REPORT') {
    console.error('报告错误:', error.message);
  } else {
    console.error('未知错误:', error.message);
  }
  
  // 记录错误详情
  if (error.stack) {
    console.debug(error.stack);
  }
}
```

## 11. 性能最佳实践

### 11.1 扫描性能优化

```javascript
// 优化配置
const scanner = new VueSecurityScanner({
  // 限制扫描范围
  scanPath: './src',
  
  // 排除不必要的目录
  exclude: ['node_modules', 'dist', 'build', '.git', 'tests'],
  
  // 启用性能优化
  performance: {
    enableCache: true,
    enableIncremental: true,
    maxCacheSize: 200 * 1024 * 1024 // 200MB
  },
  
  // 只启用必要的规则
  rules: {
    enabled: ['vue', 'javascript'],
    severity: {
      critical: true,
      high: true,
      medium: false,
      low: false
    }
  }
});
```

### 11.2 内存使用优化

```javascript
// 分批处理大项目
async function scanLargeProject() {
  const pathsToScan = [
    './src/components',
    './src/views',
    './src/utils',
    './src/api'
  ];
  
  const allResults = {
    vulnerabilities: [],
    statistics: {
      filesScanned: 0,
      linesScanned: 0
    }
  };
  
  for (const path of pathsToScan) {
    const scanner = new VueSecurityScanner({ scanPath: path });
    const results = await scanner.scan();
    
    // 合并结果
    allResults.vulnerabilities.push(...results.vulnerabilities);
    allResults.statistics.filesScanned += results.statistics.filesScanned;
    allResults.statistics.linesScanned += results.statistics.linesScanned;
    
    // 清理内存
    scanner.clearCache();
  }
  
  return allResults;
}
```

### 11.3 并发处理

```javascript
// 并发扫描多个项目
async function scanMultipleProjects() {
  const projects = [
    { name: 'project1', path: './project1/src' },
    { name: 'project2', path: './project2/src' },
    { name: 'project3', path: './project3/src' }
  ];
  
  const scanPromises = projects.map(project => {
    const scanner = new VueSecurityScanner({ scanPath: project.path });
    return scanner.scan().then(results => ({
      project: project.name,
      results
    }));
  });
  
  const results = await Promise.all(scanPromises);
  return results;
}
```

## 12. 故障排除

### 12.1 常见 API 错误

| 错误 | 原因 | 解决方案 |
|------|------|----------|
| `E_CONFIG` | 配置错误 | 检查配置格式和参数 |
| `E_SCAN` | 扫描错误 | 检查扫描路径和文件权限 |
| `E_REPORT` | 报告错误 | 检查输出路径权限和格式 |
| `E_RULE` | 规则错误 | 检查规则配置和格式 |
| `E_PERM` | 权限错误 | 确保有足够的文件系统权限 |
| `E_MEMORY` | 内存不足 | 减少扫描范围或增加内存 |

### 12.2 调试技巧

```javascript
// 启用调试模式
const scanner = new VueSecurityScanner({
  debug: true
});

// 详细日志
console.log('开始扫描:', new Date().toISOString());
try {
  const results = await scanner.scan();
  console.log('扫描完成:', {
    vulnerabilities: results.vulnerabilities.length,
    duration: results.duration
  });
} catch (error) {
  console.error('错误详情:', {
    message: error.message,
    stack: error.stack,
    code: error.code
  });
}
```

### 12.3 性能问题排查

```javascript
// 性能监控
const startTime = Date.now();
const scanner = new VueSecurityScanner({
  performance: {
    enableCache: true,
    enableIncremental: true
  }
});

const results = await scanner.scan();
const endTime = Date.now();

console.log('性能分析:');
console.log(`总时间: ${endTime - startTime} ms`);
console.log(`扫描时间: ${results.duration} ms`);
console.log(`文件数: ${results.statistics.filesScanned}`);
console.log(`代码行数: ${results.statistics.linesScanned}`);
console.log(`平均速度: ${(results.statistics.linesScanned / (results.duration / 1000)).toFixed(2)} 行/秒`);
```

## 13. 总结

Vue Security Scanner 提供了丰富的 API，支持：

- **核心扫描功能**：完整的安全扫描和报告生成
- **高级功能**：增强规则引擎、性能优化、威胁情报集成
- **工具函数**：文件操作、规则管理、报告生成
- **配置管理**：灵活的配置加载和默认值
- **错误处理**：完善的错误类型和处理机制
- **命令行集成**：命令行参数解析和执行
- **模块系统**：可扩展的规则和报告模块

通过这些 API，您可以：

1. **集成到现有系统**：与 CI/CD、监控系统等集成
2. **构建自定义工具**：基于核心功能构建专用工具
3. **扩展功能**：添加自定义规则和报告格式
4. **自动化工作流**：实现安全扫描的自动化

Vue Security Scanner API 设计遵循以下原则：

- **易用性**：简单直观的接口
- **灵活性**：丰富的配置选项
- **可扩展性**：模块化的架构
- **性能**：优化的实现
- **可靠性**：完善的错误处理

无论您是构建小型应用还是大型企业系统，Vue Security Scanner API 都能满足您的安全扫描需求。