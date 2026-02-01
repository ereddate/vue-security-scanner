# Vue 安全扫描工具测试指南

本全面指南涵盖了 Vue 安全扫描工具的测试策略和最佳实践。

## 目录

- [测试概述](#测试概述)
- [测试结构](#测试结构)
- [单元测试](#单元测试)
- [集成测试](#集成测试)
- [端到端测试](#端到端测试)
- [性能测试](#性能测试)
- [安全测试](#安全测试)
- [测试数据和夹具](#测试数据和夹具)
- [持续测试](#持续测试)
- [最佳实践](#最佳实践)

## 测试概述

Vue 安全扫描工具使用全面的测试方法来确保可靠性和准确性：

- **单元测试**：测试单个函数和模块
- **集成测试**：测试组件之间的交互
- **端到端测试**：测试完整的工作流程
- **性能测试**：验证性能特征
- **安全测试**：验证安全扫描的准确性

### 测试工具

- **Jest**：主要测试框架
- **Mocha**：替代测试框架
- **Chai**：断言库
- **Supertest**：HTTP 端点测试
- **Benchmark.js**：性能测试

## 测试结构

```
tests/
├── unit/                    # 单元测试
│   ├── analysis/
│   │   ├── ast-analyzer.test.js
│   │   ├── dast-scanner.test.js
│   │   └── dependency-scanner.test.js
│   ├── rules/
│   │   ├── xss-rules.test.js
│   │   ├── dependency-rules.test.js
│   │   └── vue-specific-rules.test.js
│   ├── reporting/
│   │   ├── report-generator.test.js
│   │   └── compliance-report.test.js
│   └── utils/
│       ├── helpers.test.js
│       └── performance-optimizer.test.js
├── integration/             # 集成测试
│   ├── scanner-integration.test.js
│   ├── rule-engine-integration.test.js
│   └── reporting-integration.test.js
├── e2e/                    # 端到端测试
│   ├── full-scan.test.js
│   ├── cli-commands.test.js
│   └── distributed-scanning.test.js
├── performance/            # 性能测试
│   ├── scan-performance.test.js
│   ├── memory-usage.test.js
│   └── concurrency.test.js
└── fixtures/               # 测试夹具
    ├── vue-files/
    ├── javascript-files/
    ├── config-files/
    └── expected-results/
```

## 单元测试

### 编写单元测试

单元测试专注于隔离测试单个函数和模块。

#### 示例：XSS 检测测试

```javascript
const { detectXSS } = require('../../src/analysis/ast-analyzer');

describe('XSS 检测', () => {
  describe('v-html 指令', () => {
    it('应该检测通过 v-html 的 XSS', () => {
      const code = '<div v-html="userInput"></div>';
      const result = detectXSS(code);
      
      expect(result.vulnerabilities).toHaveLength(1);
      expect(result.vulnerabilities[0].ruleId).toBe('vue:xss-v-html');
      expect(result.vulnerabilities[0].severity).toBe('High');
    });

    it('不应标记安全的 v-text 使用', () => {
      const code = '<div v-text="sanitizedInput"></div>';
      const result = detectXSS(code);
      
      expect(result.vulnerabilities).toHaveLength(0);
    });

    it('应该检测复杂表达式中的 XSS', () => {
      const code = '<div v-html="userContent + additionalContent"></div>';
      const result = detectXSS(code);
      
      expect(result.vulnerabilities).toHaveLength(1);
    });
  });

  describe('内联事件处理器', () => {
    it('应该检测通过内联事件处理器的 XSS', () => {
      const code = '<button @click="eval(userInput)">点击</button>';
      const result = detectXSS(code);
      
      expect(result.vulnerabilities).toHaveLength(1);
      expect(result.vulnerabilities[0].ruleId).toBe('vue:dangerous-inline-handler');
    });
  });
});
```

#### 示例：依赖扫描器测试

```javascript
const { scanDependencies } = require('../../src/analysis/dependency-scanner');

describe('依赖扫描器', () => {
  it('应该检测已知易受攻击的软件包', () => {
    const packageJson = {
      dependencies: {
        'lodash': '4.17.15',
        'axios': '0.19.0'
      }
    };
    
    const result = scanDependencies(packageJson);
    
    expect(result.vulnerabilities.length).toBeGreaterThan(0);
    expect(result.vulnerabilities[0].package).toBe('lodash');
  });

  it('应该优雅地处理缺失的 package.json', () => {
    const result = scanDependencies(null);
    
    expect(result.vulnerabilities).toHaveLength(0);
    expect(result.errors).toHaveLength(1);
  });
});
```

### 运行单元测试

```bash
# 运行所有单元测试
npm test -- tests/unit

# 运行特定测试文件
npm test -- tests/unit/analysis/ast-analyzer.test.js

# 运行匹配模式的测试
npm test -- --testNamePattern="XSS 检测"

# 以监视模式运行测试
npm test -- --watch

# 运行测试并生成覆盖率报告
npm test -- --coverage
```

## 集成测试

### 编写集成测试

集成测试验证不同组件是否正确协同工作。

#### 示例：扫描器集成测试

```javascript
const { VueSecurityScanner } = require('../../src/scanner');

describe('扫描器集成', () => {
  let scanner;

  beforeEach(() => {
    scanner = new VueSecurityScanner({
      scanPath: './tests/fixtures/vue-files',
      rules: {
        enabled: ['vue', 'javascript']
      }
    });
  });

  afterEach(async () => {
    await scanner.cleanup();
  });

  it('应该扫描目录中的所有 Vue 文件', async () => {
    const result = await scanner.scan();
    
    expect(result.filesScanned).toBeGreaterThan(0);
    expect(result.summary.totalIssues).toBeGreaterThanOrEqual(0);
  });

  it('应该以指定格式生成报告', async () => {
    const result = await scanner.scan({
      output: {
        format: 'json',
        reportPath: './test-report.json'
      }
    });
    
    expect(result.reportPath).toBe('./test-report.json');
    
    // 验证报告文件存在
    const fs = require('fs');
    expect(fs.existsSync('./test-report.json')).toBe(true);
  });
});
```

#### 示例：规则引擎集成测试

```javascript
const { RuleEngine } = require('../../src/rules/rule-engine');

describe('规则引擎集成', () => {
  it('应该对代码应用多个规则', async () => {
    const engine = new RuleEngine({
      rules: ['vue:xss-v-html', 'javascript:eval']
    });
    
    const code = `
      <div v-html="userInput"></div>
      <script>
        eval(userCode);
      </script>
    `;
    
    const result = await engine.analyze(code);
    
    expect(result.vulnerabilities).toHaveLength(2);
    expect(result.vulnerabilities[0].ruleId).toBe('vue:xss-v-html');
    expect(result.vulnerabilities[1].ruleId).toBe('javascript:eval');
  });
});
```

### 运行集成测试

```bash
# 运行所有集成测试
npm test -- tests/integration

# 运行特定集成测试
npm test -- tests/integration/scanner-integration.test.js

# 运行带有超时的集成测试
npm test -- --timeout=10000
```

## 端到端测试

### 编写 E2E 测试

E2E 测试验证从头到尾的完整工作流程。

#### 示例：完整扫描 E2E 测试

```javascript
const { execSync } = require('child_process');
const fs = require('fs');

describe('完整扫描 E2E', () => {
  const testProjectPath = './tests/fixtures/test-project';
  const reportPath = './test-security-report.json';

  afterEach(() => {
    // 清理
    if (fs.existsSync(reportPath)) {
      fs.unlinkSync(reportPath);
    }
  });

  it('应该完成完整扫描并生成报告', () => {
    const command = `vue-security-scanner ${testProjectPath} --output json --report ${reportPath}`;
    
    execSync(command, { stdio: 'inherit' });
    
    // 验证报告已生成
    expect(fs.existsSync(reportPath)).toBe(true);
    
    // 验证报告内容
    const report = JSON.parse(fs.readFileSync(reportPath, 'utf-8'));
    expect(report).toHaveProperty('summary');
    expect(report).toHaveProperty('issues');
    expect(report.summary).toHaveProperty('totalIssues');
  });

  it('应该正确处理命令行选项', () => {
    const command = `vue-security-scanner ${testProjectPath} --level detailed --performance fast`;
    
    const output = execSync(command, { encoding: 'utf-8' });
    
    expect(output).toContain('扫描');
    expect(output).toContain('完成');
  });
});
```

#### 示例：CLI 命令 E2E 测试

```javascript
describe('CLI 命令 E2E', () => {
  it('应该显示帮助消息', () => {
    const output = execSync('vue-security-scanner --help', { encoding: 'utf-8' });
    
    expect(output).toContain('用法:');
    expect(output).toContain('选项:');
  });

  it('应该显示版本', () => {
    const output = execSync('vue-security-scanner --version', { encoding: 'utf-8' });
    
    expect(output).toMatch(/\d+\.\d+\.\d+/);
  });
});
```

### 运行 E2E 测试

```bash
# 运行所有 E2E 测试
npm test -- tests/e2e

# 运行特定 E2E 测试
npm test -- tests/e2e/full-scan.test.js

# 运行带有更长超时的 E2E 测试
npm test -- --timeout=30000
```

## 性能测试

### 编写性能测试

性能测试确保扫描器在各种条件下高效运行。

#### 示例：扫描性能测试

```javascript
const { VueSecurityScanner } = require('../../src/scanner');
const { performance } = require('perf_hooks');

describe('扫描性能', () => {
  it('应该在可接受的时间内完成扫描', async () => {
    const scanner = new VueSecurityScanner({
      scanPath: './tests/fixtures/large-project'
    });
    
    const startTime = performance.now();
    const result = await scanner.scan();
    const endTime = performance.now();
    
    const duration = endTime - startTime;
    
    expect(duration).toBeLessThan(30000); // 30 秒
    expect(result.filesScanned).toBeGreaterThan(0);
  });

  it('应该高效处理并行处理', async () => {
    const scanner = new VueSecurityScanner({
      scanPath: './tests/fixtures/parallel-test',
      performance: {
        threads: 4
      }
    });
    
    const startTime = performance.now();
    const result = await scanner.scan();
    const endTime = performance.now();
    
    const duration = endTime - startTime;
    
    expect(duration).toBeLessThan(15000); // 4 线程 15 秒
  });
});
```

#### 示例：内存使用测试

```javascript
describe('内存使用', () => {
  it('不应超过内存限制', async () => {
    const scanner = new VueSecurityScanner({
      scanPath: './tests/fixtures/memory-test',
      performance: {
        memoryLimit: 512 * 1024 * 1024 // 512MB
      }
    });
    
    const memoryBefore = process.memoryUsage().heapUsed;
    await scanner.scan();
    const memoryAfter = process.memoryUsage().heapUsed;
    
    const memoryIncrease = memoryAfter - memoryBefore;
    
    expect(memoryIncrease).toBeLessThan(256 * 1024 * 1024); // 256MB 增加
  });
});
```

### 运行性能测试

```bash
# 运行所有性能测试
npm test -- tests/performance

# 运行特定性能测试
npm test -- tests/performance/scan-performance.test.js

# 运行带有基准测试的性能测试
npm test -- --benchmark
```

## 安全测试

### 编写安全测试

安全测试验证扫描器是否准确检测安全漏洞。

#### 示例：XSS 检测准确性测试

```javascript
describe('XSS 检测准确性', () => {
  const testCases = [
    {
      name: '带有用户输入的 v-html',
      code: '<div v-html="userInput"></div>',
      shouldDetect: true,
      ruleId: 'vue:xss-v-html'
    },
    {
      name: '带有清理输入的 v-text',
      code: '<div v-text="sanitizedInput"></div>',
      shouldDetect: false
    },
    {
      name: '带有用户输入的内联 eval',
      code: '<script>eval(userCode)</script>',
      shouldDetect: true,
      ruleId: 'javascript:eval'
    }
  ];

  testCases.forEach(({ name, code, shouldDetect, ruleId }) => {
    it(`应该${shouldDetect ? '检测' : '不检测'}${name}中的 XSS`, () => {
      const result = detectXSS(code);
      
      if (shouldDetect) {
        expect(result.vulnerabilities.length).toBeGreaterThan(0);
        expect(result.vulnerabilities[0].ruleId).toBe(ruleId);
      } else {
        expect(result.vulnerabilities).toHaveLength(0);
      }
    });
  });
});
```

#### 示例：误报测试

```javascript
describe('误报预防', () => {
  it('不应标记安全的 v-html 使用', () => {
    const code = '<div v-html="staticHtml"></div>';
    const result = detectXSS(code);
    
    expect(result.vulnerabilities).toHaveLength(0);
  });

  it('不应标记带有静态内容的模板字面量', () => {
    const code = '<div v-html="`<p>静态内容</p>`"></div>';
    const result = detectXSS(code);
    
    expect(result.vulnerabilities).toHaveLength(0);
  });
});
```

### 运行安全测试

```bash
# 运行所有安全测试
npm test -- tests/security

# 运行特定安全测试
npm test -- tests/security/xss-detection-accuracy.test.js

# 运行带有详细输出的安全测试
npm test -- --verbose
```

## 测试数据和夹具

### 组织测试数据

使用夹具提供一致的测试数据：

```
tests/fixtures/
├── vue-files/
│   ├── xss-vulnerable.vue
│   ├── safe-component.vue
│   └── complex-component.vue
├── javascript-files/
│   ├── dangerous-eval.js
│   └── safe-code.js
├── config-files/
│   ├── valid-config.json
│   └── invalid-config.json
└── expected-results/
    ├── xss-detection.json
    └── dependency-scan.json
```

### 在测试中使用夹具

```javascript
const fs = require('fs');
const path = require('path');

describe('使用夹具的 XSS 检测', () => {
  it('应该在易受攻击的 Vue 文件中检测 XSS', () => {
    const fixturePath = path.join(__dirname, '../fixtures/vue-files/xss-vulnerable.vue');
    const code = fs.readFileSync(fixturePath, 'utf-8');
    
    const result = detectXSS(code);
    
    expect(result.vulnerabilities).toHaveLength(1);
  });

  it('不应在安全的 Vue 文件中检测 XSS', () => {
    const fixturePath = path.join(__dirname, '../fixtures/vue-files/safe-component.vue');
    const code = fs.readFileSync(fixturePath, 'utf-8');
    
    const result = detectXSS(code);
    
    expect(result.vulnerabilities).toHaveLength(0);
  });
});
```

## 持续测试

### CI/CD 集成

在 CI/CD 流水线中自动化测试：

#### GitHub Actions 示例

```yaml
name: 测试

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v3
      
      - name: 设置 Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '16'
      
      - name: 安装依赖
        run: npm ci
      
      - name: 运行单元测试
        run: npm test -- tests/unit
      
      - name: 运行集成测试
        run: npm test -- tests/integration
      
      - name: 运行 E2E 测试
        run: npm test -- tests/e2e
      
      - name: 生成覆盖率报告
        run: npm test -- --coverage
      
      - name: 上传覆盖率
        uses: codecov/codecov-action@v3
```

#### GitLab CI/CD 示例

```yaml
stages:
  - test

test:
  stage: test
  image: node:16
  
  before_script:
    - npm ci
  
  script:
    - npm test -- tests/unit
    - npm test -- tests/integration
    - npm test -- tests/e2e
    - npm test -- --coverage
  
  coverage: '/All files[^|]*\|[^|]*\s+([\d\.]+)/'
  artifacts:
    reports:
      coverage_report:
        coverage_format: cobertura
        path: coverage/cobertura-coverage.xml
```

### Pre-commit Hooks

使用 husky 进行 pre-commit 测试：

```json
{
  "husky": {
    "hooks": {
      "pre-commit": "npm test -- tests/unit",
      "pre-push": "npm test"
    }
  }
}
```

## 最佳实践

### 测试组织

1. **分组相关测试**：使用 `describe` 块组织测试
2. **使用描述性名称**：使测试名称清晰且具体
3. **保持测试独立**：每个测试应该独立运行
4. **遵循 AAA 模式**：Arrange（准备）、Act（执行）、Assert（断言）

### 测试覆盖率

1. **目标 80%+ 覆盖率**：高覆盖率增加信心
2. **专注于关键路径**：优先测试核心功能
3. **测试边缘情况**：包括边界条件和错误情况
4. **审查覆盖率报告**：识别未测试的代码

### 性能

1. **保持测试快速**：单元测试应该在毫秒内运行
2. **使用模拟和存根**：避免外部依赖
3. **并行化测试**：尽可能并发运行测试
4. **优化设置**：最小化测试设置时间

### 维护

1. **与代码一起更新测试**：保持测试与实现同步
2. **删除过时的测试**：删除已删除功能的测试
3. **重构测试**：随时间改进测试质量
4. **记录复杂测试**：为测试逻辑添加注释

---

如需更多信息，请参阅：
- [开发指南](./development.md)
- [API 参考](./api/index.md)
- [功能指南](./features.md)
