# Vue Security Scanner Testing Guide

This comprehensive guide covers testing strategies and best practices for Vue Security Scanner.

## Table of Contents

- [Testing Overview](#testing-overview)
- [Test Structure](#test-structure)
- [Unit Testing](#unit-testing)
- [Integration Testing](#integration-testing)
- [End-to-End Testing](#end-to-end-testing)
- [Performance Testing](#performance-testing)
- [Security Testing](#security-testing)
- [Test Data and Fixtures](#test-data-and-fixtures)
- [Continuous Testing](#continuous-testing)
- [Best Practices](#best-practices)

## Testing Overview

Vue Security Scanner uses a comprehensive testing approach to ensure reliability and accuracy:

- **Unit Tests**: Test individual functions and modules
- **Integration Tests**: Test interactions between components
- **End-to-End Tests**: Test complete workflows
- **Performance Tests**: Validate performance characteristics
- **Security Tests**: Verify security scanning accuracy

### Testing Tools

- **Jest**: Primary testing framework
- **Mocha**: Alternative testing framework
- **Chai**: Assertion library
- **Supertest**: HTTP endpoint testing
- **Benchmark.js**: Performance testing

## Test Structure

```
tests/
├── unit/                    # Unit tests
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
├── integration/             # Integration tests
│   ├── scanner-integration.test.js
│   ├── rule-engine-integration.test.js
│   └── reporting-integration.test.js
├── e2e/                    # End-to-end tests
│   ├── full-scan.test.js
│   ├── cli-commands.test.js
│   └── distributed-scanning.test.js
├── performance/            # Performance tests
│   ├── scan-performance.test.js
│   ├── memory-usage.test.js
│   └── concurrency.test.js
└── fixtures/               # Test fixtures
    ├── vue-files/
    ├── javascript-files/
    ├── config-files/
    └── expected-results/
```

## Unit Testing

### Writing Unit Tests

Unit tests focus on testing individual functions and modules in isolation.

#### Example: XSS Detection Test

```javascript
const { detectXSS } = require('../../src/analysis/ast-analyzer');

describe('XSS Detection', () => {
  describe('v-html directive', () => {
    it('should detect XSS via v-html', () => {
      const code = '<div v-html="userInput"></div>';
      const result = detectXSS(code);
      
      expect(result.vulnerabilities).toHaveLength(1);
      expect(result.vulnerabilities[0].ruleId).toBe('vue:xss-v-html');
      expect(result.vulnerabilities[0].severity).toBe('High');
    });

    it('should not flag safe v-text usage', () => {
      const code = '<div v-text="sanitizedInput"></div>';
      const result = detectXSS(code);
      
      expect(result.vulnerabilities).toHaveLength(0);
    });

    it('should detect XSS with complex expressions', () => {
      const code = '<div v-html="userContent + additionalContent"></div>';
      const result = detectXSS(code);
      
      expect(result.vulnerabilities).toHaveLength(1);
    });
  });

  describe('inline event handlers', () => {
    it('should detect XSS via inline event handlers', () => {
      const code = '<button @click="eval(userInput)">Click</button>';
      const result = detectXSS(code);
      
      expect(result.vulnerabilities).toHaveLength(1);
      expect(result.vulnerabilities[0].ruleId).toBe('vue:dangerous-inline-handler');
    });
  });
});
```

#### Example: Dependency Scanner Test

```javascript
const { scanDependencies } = require('../../src/analysis/dependency-scanner');

describe('Dependency Scanner', () => {
  it('should detect known vulnerable packages', () => {
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

  it('should handle missing package.json gracefully', () => {
    const result = scanDependencies(null);
    
    expect(result.vulnerabilities).toHaveLength(0);
    expect(result.errors).toHaveLength(1);
  });
});
```

### Running Unit Tests

```bash
# Run all unit tests
npm test -- tests/unit

# Run specific test file
npm test -- tests/unit/analysis/ast-analyzer.test.js

# Run tests matching a pattern
npm test -- --testNamePattern="XSS Detection"

# Run tests in watch mode
npm test -- --watch

# Run tests with coverage
npm test -- --coverage
```

## Integration Testing

### Writing Integration Tests

Integration tests verify that different components work together correctly.

#### Example: Scanner Integration Test

```javascript
const { VueSecurityScanner } = require('../../src/scanner');

describe('Scanner Integration', () => {
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

  it('should scan all Vue files in directory', async () => {
    const result = await scanner.scan();
    
    expect(result.filesScanned).toBeGreaterThan(0);
    expect(result.summary.totalIssues).toBeGreaterThanOrEqual(0);
  });

  it('should generate report in specified format', async () => {
    const result = await scanner.scan({
      output: {
        format: 'json',
        reportPath: './test-report.json'
      }
    });
    
    expect(result.reportPath).toBe('./test-report.json');
    
    // Verify report file exists
    const fs = require('fs');
    expect(fs.existsSync('./test-report.json')).toBe(true);
  });
});
```

#### Example: Rule Engine Integration Test

```javascript
const { RuleEngine } = require('../../src/rules/rule-engine');

describe('Rule Engine Integration', () => {
  it('should apply multiple rules to code', async () => {
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

### Running Integration Tests

```bash
# Run all integration tests
npm test -- tests/integration

# Run specific integration test
npm test -- tests/integration/scanner-integration.test.js

# Run integration tests with timeout
npm test -- --timeout=10000
```

## End-to-End Testing

### Writing E2E Tests

E2E tests verify complete workflows from start to finish.

#### Example: Full Scan E2E Test

```javascript
const { execSync } = require('child_process');
const fs = require('fs');

describe('Full Scan E2E', () => {
  const testProjectPath = './tests/fixtures/test-project';
  const reportPath = './test-security-report.json';

  afterEach(() => {
    // Cleanup
    if (fs.existsSync(reportPath)) {
      fs.unlinkSync(reportPath);
    }
  });

  it('should complete full scan and generate report', () => {
    const command = `vue-security-scanner ${testProjectPath} --output json --report ${reportPath}`;
    
    execSync(command, { stdio: 'inherit' });
    
    // Verify report was generated
    expect(fs.existsSync(reportPath)).toBe(true);
    
    // Verify report content
    const report = JSON.parse(fs.readFileSync(reportPath, 'utf-8'));
    expect(report).toHaveProperty('summary');
    expect(report).toHaveProperty('issues');
    expect(report.summary).toHaveProperty('totalIssues');
  });

  it('should handle command-line options correctly', () => {
    const command = `vue-security-scanner ${testProjectPath} --level detailed --performance fast`;
    
    const output = execSync(command, { encoding: 'utf-8' });
    
    expect(output).toContain('Scanning');
    expect(output).toContain('completed');
  });
});
```

#### Example: CLI Commands E2E Test

```javascript
describe('CLI Commands E2E', () => {
  it('should show help message', () => {
    const output = execSync('vue-security-scanner --help', { encoding: 'utf-8' });
    
    expect(output).toContain('Usage:');
    expect(output).toContain('Options:');
  });

  it('should show version', () => {
    const output = execSync('vue-security-scanner --version', { encoding: 'utf-8' });
    
    expect(output).toMatch(/\d+\.\d+\.\d+/);
  });
});
```

### Running E2E Tests

```bash
# Run all E2E tests
npm test -- tests/e2e

# Run specific E2E test
npm test -- tests/e2e/full-scan.test.js

# Run E2E tests with longer timeout
npm test -- --timeout=30000
```

## Performance Testing

### Writing Performance Tests

Performance tests ensure the scanner performs efficiently under various conditions.

#### Example: Scan Performance Test

```javascript
const { VueSecurityScanner } = require('../../src/scanner');
const { performance } = require('perf_hooks');

describe('Scan Performance', () => {
  it('should complete scan within acceptable time', async () => {
    const scanner = new VueSecurityScanner({
      scanPath: './tests/fixtures/large-project'
    });
    
    const startTime = performance.now();
    const result = await scanner.scan();
    const endTime = performance.now();
    
    const duration = endTime - startTime;
    
    expect(duration).toBeLessThan(30000); // 30 seconds
    expect(result.filesScanned).toBeGreaterThan(0);
  });

  it('should handle parallel processing efficiently', async () => {
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
    
    expect(duration).toBeLessThan(15000); // 15 seconds with 4 threads
  });
});
```

#### Example: Memory Usage Test

```javascript
describe('Memory Usage', () => {
  it('should not exceed memory limit', async () => {
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
    
    expect(memoryIncrease).toBeLessThan(256 * 1024 * 1024); // 256MB increase
  });
});
```

### Running Performance Tests

```bash
# Run all performance tests
npm test -- tests/performance

# Run specific performance test
npm test -- tests/performance/scan-performance.test.js

# Run performance tests with benchmark
npm test -- --benchmark
```

## Security Testing

### Writing Security Tests

Security tests verify that the scanner accurately detects security vulnerabilities.

#### Example: XSS Detection Accuracy Test

```javascript
describe('XSS Detection Accuracy', () => {
  const testCases = [
    {
      name: 'v-html with user input',
      code: '<div v-html="userInput"></div>',
      shouldDetect: true,
      ruleId: 'vue:xss-v-html'
    },
    {
      name: 'v-text with sanitized input',
      code: '<div v-text="sanitizedInput"></div>',
      shouldDetect: false
    },
    {
      name: 'inline eval with user input',
      code: '<script>eval(userCode)</script>',
      shouldDetect: true,
      ruleId: 'javascript:eval'
    }
  ];

  testCases.forEach(({ name, code, shouldDetect, ruleId }) => {
    it(`should ${shouldDetect ? 'detect' : 'not detect'} XSS in ${name}`, () => {
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

#### Example: False Positive Test

```javascript
describe('False Positive Prevention', () => {
  it('should not flag safe v-html usage', () => {
    const code = '<div v-html="staticHtml"></div>';
    const result = detectXSS(code);
    
    expect(result.vulnerabilities).toHaveLength(0);
  });

  it('should not flag template literals with static content', () => {
    const code = '<div v-html="`<p>Static content</p>`"></div>';
    const result = detectXSS(code);
    
    expect(result.vulnerabilities).toHaveLength(0);
  });
});
```

### Running Security Tests

```bash
# Run all security tests
npm test -- tests/security

# Run specific security test
npm test -- tests/security/xss-detection-accuracy.test.js

# Run security tests with detailed output
npm test -- --verbose
```

## Test Data and Fixtures

### Organizing Test Data

Use fixtures to provide consistent test data:

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

### Using Fixtures in Tests

```javascript
const fs = require('fs');
const path = require('path');

describe('XSS Detection with Fixtures', () => {
  it('should detect XSS in vulnerable Vue file', () => {
    const fixturePath = path.join(__dirname, '../fixtures/vue-files/xss-vulnerable.vue');
    const code = fs.readFileSync(fixturePath, 'utf-8');
    
    const result = detectXSS(code);
    
    expect(result.vulnerabilities).toHaveLength(1);
  });

  it('should not detect XSS in safe Vue file', () => {
    const fixturePath = path.join(__dirname, '../fixtures/vue-files/safe-component.vue');
    const code = fs.readFileSync(fixturePath, 'utf-8');
    
    const result = detectXSS(code);
    
    expect(result.vulnerabilities).toHaveLength(0);
  });
});
```

## Continuous Testing

### CI/CD Integration

Automate testing in CI/CD pipelines:

#### GitHub Actions Example

```yaml
name: Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '16'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Run unit tests
        run: npm test -- tests/unit
      
      - name: Run integration tests
        run: npm test -- tests/integration
      
      - name: Run E2E tests
        run: npm test -- tests/e2e
      
      - name: Generate coverage report
        run: npm test -- --coverage
      
      - name: Upload coverage
        uses: codecov/codecov-action@v3
```

#### GitLab CI/CD Example

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

Use husky for pre-commit testing:

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

## Best Practices

### Test Organization

1. **Group related tests**: Use `describe` blocks to organize tests
2. **Use descriptive names**: Make test names clear and specific
3. **Keep tests independent**: Each test should run independently
4. **Follow AAA pattern**: Arrange, Act, Assert

### Test Coverage

1. **Aim for 80%+ coverage**: High coverage increases confidence
2. **Focus on critical paths**: Prioritize testing core functionality
3. **Test edge cases**: Include boundary conditions and error cases
4. **Review coverage reports**: Identify untested code

### Performance

1. **Keep tests fast**: Unit tests should run in milliseconds
2. **Use mocks and stubs**: Avoid external dependencies
3. **Parallelize tests**: Run tests concurrently when possible
4. **Optimize setup**: Minimize test setup time

### Maintenance

1. **Update tests with code**: Keep tests in sync with implementation
2. **Remove obsolete tests**: Delete tests for removed features
3. **Refactor tests**: Improve test quality over time
4. **Document complex tests**: Add comments for test logic

---

For more information, see:
- [Development Guide](./development.md)
- [API Reference](./api/index.md)
- [Features Guide](./features.md)
