# Vue Security Scanner Usage Guide

## Basic Usage

### 1. Command Line Scanning

**Basic Scan**: Scan current directory

```bash
vue-security-scanner
```

**Specify Path**: Scan specific directory

```bash
vue-security-scanner ./src
```

**Use Shorthand Command**:

```bash
vsc ./src
```

### 2. Common Command Options

| Option | Description | Example |
|--------|-------------|---------|
| `--version, -v` | Show version information | `vsc -v` |
| `--help, -h` | Show help information | `vsc -h` |
| `--config, -c` | Specify configuration file | `vsc -c config.js` |
| `--format, -f` | Output format (json/text/html) | `vsc -f html` |
| `--output, -o` | Output file | `vsc -o report.json` |
| `--severity, -s` | Severity level (critical/high/medium/low) | `vsc -s high` |
| `--rules, -r` | Specify rule modules | `vsc -r vue,china-security` |
| `--exclude, -e` | Exclude paths | `vsc -e node_modules,dist` |
| `--quiet, -q` | Quiet mode | `vsc -q` |
| `--verbose, -V` | Verbose mode | `vsc -V` |

### 3. Scanning Modes

#### 3.1 Full Scan

Scan entire project:

```bash
vue-security-scanner --verbose
```

#### 3.2 Incremental Scan

Only scan modified files (enabled by default):

```bash
vue-security-scanner --incremental
```

#### 3.3 Quick Scan

Only scan critical rules:

```bash
vue-security-scanner --quick
```

#### 3.4 Custom Scan

Specify rules and severity:

```bash
vue-security-scanner --rules vue,china-security --severity high
```

## Advanced Features

### 1. Compliance Reporting

Generate compliance reports:

```bash
# Generate Chinese compliance report
vue-security-scanner --compliance china --format html --output compliance-report.html

# Generate enhanced compliance report
vue-security-scanner --compliance enhanced --format html --output enhanced-report.html
```

### 2. Threat Intelligence Check

Check dependencies for security threats:

```bash
# Check dependency threats
vue-security-scanner --threat-intelligence

# Update threat intelligence database
vue-security-scanner --threat-intelligence --update

# Search for specific threats
vue-security-scanner --threat-intelligence --search "vue"
```

### 3. Performance Optimization

Configure performance options:

```bash
# Enable cache
vue-security-scanner --cache

# Disable incremental scanning
vue-security-scanner --no-incremental

# Set cache size
vue-security-scanner --cache-size 200
```

### 4. Rule Management

#### 4.1 View Rules

```bash
# View all rules
vue-security-scanner --list-rules

# View specific module rules
vue-security-scanner --list-rules --rules vue
```

#### 4.2 Rule Configuration

Configure rules in `.vue-security-scanner.config.js`:

```javascript
module.exports = {
  rules: {
    // Enabled rules
    enabled: [
      'vue',
      'javascript',
      'china-security',
      'china-api-security',
      'dependency'
    ],
    
    // Custom rule settings
    custom: {
      // Vue rule settings
      vue: {
        no-v-html: 'error',
        no-dangerous-template: 'error',
        no-unsafe-computed: 'warning'
      },
      
      // China security rule settings
      'china-security': {
        'gb-t-28448': 'error',
        'gb-t-31168': 'warning',
        '等级保护': 'error'
      }
    }
  }
};
```

## Project Integration

### 1. Use as Development Dependency

Install and use in project:

```bash
npm install vue-security-scanner --save-dev
```

Add to `package.json`:

```json
{
  "scripts": {
    "test:security": "vue-security-scanner"
  }
}
```

### 2. Programmatic Usage

Use in code:

```javascript
const { VueSecurityScanner } = require('vue-security-scanner');

async function scan() {
  const scanner = new VueSecurityScanner({
    scanPath: './src',
    exclude: ['node_modules', 'dist']
  });
  
  const results = await scanner.scan();
  console.log('Scan results:', results);
  
  // Generate report
  await scanner.generateReport(results, {
    format: 'html',
    outputPath: './security-report.html'
  });
}

scan();
```

### 3. Integration with Other Tools

#### 3.1 Integration with ESLint

Add to ESLint configuration:

```javascript
module.exports = {
  // ...
  plugins: [
    // ...
  ],
  extends: [
    // ...
  ],
  // Add Vue Security Scanner scripts
  scripts: {
    "lint": "eslint .",
    "security": "vue-security-scanner"
  }
};
```

#### 3.2 Integration with Prettier

Add to `package.json`:

```json
{
  "scripts": {
    "format": "prettier --write .",
    "lint": "eslint .",
    "security": "vue-security-scanner",
    "check": "npm run format && npm run lint && npm run security"
  }
}
```

## CI/CD Integration

### 1. GitHub Actions

```yaml
name: Security Scan

on: [push, pull_request]

jobs:
  security-scan:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: '16'
      - run: npm install
      - run: npm install -g vue-security-scanner
      - run: vue-security-scanner --format json --output security-report.json
      - name: Upload security report
        uses: actions/upload-artifact@v2
        with:
          name: security-report
          path: security-report.json
```

### 2. GitLab CI

```yaml
security_scan:
  stage: test
  script:
    - npm install -g vue-security-scanner
    - vue-security-scanner --format html --output security-report.html
  artifacts:
    paths:
      - security-report.html
  only:
    - merge_requests
    - main
```

## Best Practices

### 1. Scanning Strategy

- **Development Phase**: Use quick scan, focus on critical issues
- **Pre-commit**: Use full scan, ensure code quality
- **Pre-build**: Use compliance scan, ensure regulatory requirements
- **Regular Scanning**: Weekly or monthly comprehensive scan

### 2. Result Processing

**Analyze Report**:
1. Prioritize high severity issues
2. Focus on issues with large impact
3. Establish issue tracking and fix plan

**Fix Process**:
1. Analyze issue cause
2. Implement fix solution
3. Verify fix effect
4. Record fix process

### 3. Custom Configuration

Customize based on project characteristics:

```javascript
// Configuration for large projects
module.exports = {
  scanPath: './src',
  exclude: [
    'node_modules',
    'dist',
    'build',
    '.git',
    'test',
    'coverage'
  ],
  rules: {
    enabled: ['vue', 'javascript', 'china-security'],
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
    maxCacheSize: 200 * 1024 * 1024 // 200MB
  },
  reporting: {
    formats: ['json', 'html'],
    outputDir: './security-reports'
  }
};
```

## Common Scenarios

### 1. Vue Project Scan

```bash
# Scan Vue project
vue-security-scanner ./src --rules vue,javascript

# Generate Vue security report
vue-security-scanner ./src --format html --output vue-security-report.html
```

### 2. China Compliance Scan

```bash
# Scan China compliance
vue-security-scanner ./src --rules china-security,china-api-security

# Generate China compliance report
vue-security-scanner ./src --compliance china --format html --output china-compliance-report.html
```

### 3. Dependency Security Check

```bash
# Check dependency security
vue-security-scanner --rules dependency

# Check with threat intelligence
vue-security-scanner --rules dependency --threat-intelligence
```

### 4. Emergency Security Check

```bash
# Quick check for critical vulnerabilities
vue-security-scanner --quick --severity critical

# Detailed check for specific module
vue-security-scanner --rules vue --verbose
```

## Troubleshooting

### 1. Slow Scanning

**Solutions**:
- Enable cache: `vue-security-scanner --cache`
- Use incremental scan: `vue-security-scanner --incremental`
- Exclude unnecessary directories: `vue-security-scanner --exclude node_modules,dist`

### 2. False Positives

**Solutions**:
- Adjust rule configuration: Set rule levels in config file
- Use whitelist: Add `// vue-security-disable-next-line` comment in code
- Report false positives: Submit GitHub Issue

### 3. Scan Failure

**Solutions**:
- Check Node.js version
- Check dependencies completeness
- View detailed errors: `vue-security-scanner --verbose`

### 4. Report Generation Failure

**Solutions**:
- Check output directory permissions
- Ensure sufficient disk space
- Use different format: `vue-security-scanner --format json`

## Advanced Tips

### 1. Batch Scanning

Create scan script:

```bash
#!/bin/bash

# Scan multiple projects
projects=("project1" "project2" "project3")

for project in "${projects[@]}"; do
  echo "Scanning $project..."
  vue-security-scanner "$project/src" --format html --output "$project-security-report.html"
done

echo "All scans completed!"
```

### 2. Automated Monitoring

Set up scheduled tasks:

**Linux/macOS** (crontab):

```bash
# Scan at 2 AM daily
0 2 * * * cd /path/to/project && vue-security-scanner --format html --output daily-security-report.html
```

**Windows** (Task Scheduler):

Create task to execute:
```
npm run security:report
```

### 3. Integration with Development Tools

**VS Code Integration**:
1. Install Vue Security Scanner extension
2. Use keyboard shortcuts to trigger scans in VS Code
3. View real-time security suggestions

**WebStorm Integration**:
1. Add npm script in WebStorm
2. Use toolbar button to trigger scan
3. View scan results

## Next Steps

- Check [Rules Documentation](./rules/index.md) for detailed rules
- Check [API Reference](./api/index.md) for programming interface
- Check [Compliance Guide](./compliance/index.md) for regulatory requirements