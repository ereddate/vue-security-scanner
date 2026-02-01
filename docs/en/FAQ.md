# Vue Security Scanner Frequently Asked Questions

## 1. Installation Issues

### 1.1 Installation Failure

**Problem**: Installation fails when executing `npm install -g vue-security-scanner`.

**Solutions**:
- **Permission Issue**: Try running the command with administrator privileges
  ```bash
  # Windows
  npm install -g vue-security-scanner --unsafe-perm
  
  # Linux/Mac
  sudo npm install -g vue-security-scanner
  ```
- **Network Issue**: Use a mirror registry
  ```bash
  npm install -g vue-security-scanner --registry=https://registry.npmmirror.com
  ```
- **Node.js Version Issue**: Ensure using Node.js 14.0.0 or higher
  ```bash
  node -v
  # If version is too low, update Node.js
  ```

### 1.2 Command Not Available After Global Installation

**Problem**: After global installation, executing `vue-security-scanner` command prompts "command not found".

**Solutions**:
- **Check Environment Variables**: Ensure npm global installation directory is in system PATH
  ```bash
  # View npm global installation directory
  npm prefix -g
  # Add the output directory to system PATH
  ```
- **Reinstall**: Reinstall with `--force` option
  ```bash
  npm install -g vue-security-scanner --force
  ```
- **Use npx**: Run directly with npx
  ```bash
  npx vue-security-scanner
  ```

### 1.3 Local Installation Issues

**Problem**: Dependency conflicts occur when installing locally in a project.

**Solutions**:
- **Use --legacy-peer-deps**:
  ```bash
  npm install vue-security-scanner --save-dev --legacy-peer-deps
  ```
- **Use yarn**:
  ```bash
  yarn add vue-security-scanner --dev
  ```
- **Check Dependency Versions**: Check for version conflicts in the project
  ```bash
  npm ls
  ```

## 2. Usage Issues

### 2.1 Slow Scanning Speed

**Problem**: Scanning large projects is very slow.

**Solutions**:
- **Enable Cache**:
  ```bash
  vue-security-scanner --cache
  ```
- **Enable Incremental Scanning**:
  ```bash
  vue-security-scanner --incremental
  ```
- **Increase Thread Count**:
  ```bash
  vue-security-scanner --threads 8
  ```
- **Exclude Unnecessary Directories**:
  ```bash
  vue-security-scanner --exclude node_modules,dist,build
  ```
- **Use Quick Mode**:
  ```bash
  vue-security-scanner --quick
  ```

### 2.2 False Positive Issues

**Problem**: There are false positives in scan results.

**Solutions**:
- **Configure Rule Severity**:
  ```javascript
  // .vue-security-scanner.config.js
  module.exports = {
    rules: {
      severity: {
        critical: true,
        high: true,
        medium: false,
        low: false
      }
    }
  };
  ```
- **Disable Specific Rules**:
  ```javascript
  module.exports = {
    rules: {
      disabled: ['vue:no-raw-html', 'javascript:eval']
    }
  };
  ```
- **Add Exclude Patterns**:
  ```javascript
  module.exports = {
    excludePatterns: [
      'src/test/**',
      'src/mock/**'
    ]
  };
  ```
- **Report False Positives**: Report false positives to project maintainers to help improve rules

### 2.3 False Negative Issues

**Problem**: Known security issues are not detected.

**Solutions**:
- **Update to Latest Version**:
  ```bash
  npm update vue-security-scanner
  ```
- **Enable All Rules**:
  ```bash
  vue-security-scanner --rules all
  ```
- **Check Rule Configuration**: Ensure relevant rules are enabled
  ```javascript
  module.exports = {
    rules: {
      enabled: ['vue', 'javascript', 'dependency', 'china-security']
    }
  };
  ```
- **Report False Negatives**: Report false negatives to project maintainers to help improve rules

### 2.4 Scan Command Error

**Problem**: Error occurs when executing scan command.

**Solutions**:
- **Check Command Format**: Ensure command format is correct
  ```bash
  # Correct format
  vue-security-scanner ./src
  ```
- **View Detailed Error**: Use `--verbose` option to view detailed error information
  ```bash
  vue-security-scanner --verbose
  ```
- **Check Configuration File**: Ensure configuration file format is correct
  ```bash
  vue-security-scanner --validate-config
  ```
- **Check Project Structure**: Ensure scan directory exists and is accessible

### 2.5 Report Generation Failure

**Problem**: Report generation fails.

**Solutions**:
- **Check Output Directory Permissions**: Ensure output directory exists and is writable
- **Use Absolute Path**:
  ```bash
  vue-security-scanner --output /path/to/report.html
  ```
- **Check Report Format**: Ensure specified report format is supported
  ```bash
  # Supported formats: text, json, html, xml, sarif
  vue-security-scanner --format html
  ```
- **Check Scan Results**: Ensure scan successfully generates results

## 3. Rule Issues

### 3.1 Rule Configuration Not Effective

**Problem**: After modifying rule configuration, the configuration is not effective.

**Solutions**:
- **Check Configuration File Path**: Ensure configuration file is in the correct location
  ```bash
  # Configuration file should be in project root
  ./.vue-security-scanner.config.js
  ```
- **Validate Configuration File**: Use `--validate-config` option to validate configuration
  ```bash
  vue-security-scanner --validate-config
  ```
- **Restart Terminal**: Restart terminal after modifying configuration
- **Use --config Option**: Explicitly specify configuration file path
  ```bash
  vue-security-scanner --config /path/to/config.js
  ```

### 3.2 Custom Rules Not Working

**Problem**: Added custom rules are not working.

**Solutions**:
- **Check Rule Format**: Ensure custom rule format is correct
  ```javascript
  // Custom rule format example
  module.exports = {
    id: 'custom-rule',
    name: 'Custom Rule',
    description: 'Custom rule description',
    severity: 'medium',
    patterns: [
      /unsafe-pattern/g
    ],
    fix: 'Use safe alternative'
  };
  ```
- **Check Rule Path**: Ensure rule file path is correct
- **Enable Custom Rules**: Enable custom rules in configuration
  ```javascript
  module.exports = {
    rules: {
      customRules: ['./path/to/custom-rules.js']
    }
  };
  ```
- **View Rule Logs**: Use `--debug` option to view rule loading logs
  ```bash
  vue-security-scanner --debug
  ```

### 3.3 Rule Conflicts

**Problem**: Conflicts exist between different rules.

**Solutions**:
- **Adjust Rule Priority**: Set rule priority in configuration
  ```javascript
  module.exports = {
    rules: {
      priority: {
        'vue:no-raw-html': 10,
        'javascript:eval': 5
      }
    }
  };
  ```
- **Disable Conflicting Rules**: Disable conflicting rules
  ```javascript
  module.exports = {
    rules: {
      disabled: ['rule1', 'rule2']
    }
  };
  ```
- **Report Conflicts**: Report rule conflicts to project maintainers

### 3.4 Rule Update Issues

**Problem**: Rules are not automatically updated.

**Solutions**:
- **Update to Latest Version**:
  ```bash
  npm update vue-security-scanner
  ```
- **Manual Rule Update**:
  ```bash
  vue-security-scanner --update-rules
  ```
- **Check Network Connection**: Ensure network connection is normal and can access rule update sources
- **Clean Rule Cache**:
  ```bash
  vue-security-scanner --clear-rule-cache
  ```

## 4. Performance Issues

### 4.1 High Memory Usage

**Problem**: High memory usage during scanning causes system lag or crash.

**Solutions**:
- **Set Memory Limit**:
  ```javascript
  module.exports = {
    performance: {
      memoryLimit: 512 * 1024 * 1024 // 512MB
    }
  };
  ```
- **Reduce Thread Count**:
  ```bash
  vue-security-scanner --threads 4
  ```
- **Batch Scanning**: Split large projects into multiple parts for scanning
  ```bash
  vue-security-scanner ./src/components
  vue-security-scanner ./src/views
  ```
- **Enable Memory Monitoring**:
  ```bash
  vue-security-scanner --memory-monitor
  ```

### 4.2 Cache Issues

**Problem**: Cache causes inaccurate scan results.

**Solutions**:
- **Clean Cache**:
  ```bash
  vue-security-scanner --clear-cache
  ```
- **Disable Cache**:
  ```bash
  vue-security-scanner --no-cache
  ```
- **Adjust Cache Time**:
  ```javascript
  module.exports = {
    performance: {
      cache: {
        ttl: 3600000 // 1 hour
      }
    }
  };
  ```

### 4.3 Incremental Scanning Issues

**Problem**: Incremental scanning does not detect all changes.

**Solutions**:
- **Clean Scan History**:
  ```bash
  rm ./.vue-security-scan-history.json
  ```
- **Disable Incremental Scanning**:
  ```bash
  vue-security-scanner --no-incremental
  ```
- **Check File System**: Ensure file system correctly reports file changes
- **Use Full Scan**: Perform full scan regularly
  ```bash
  vue-security-scanner --full-scan
  ```

## 5. Threat Intelligence Issues

### 5.1 Threat Intelligence Update Failure

**Problem**: Threat intelligence database update fails.

**Solutions**:
- **Check Network Connection**: Ensure network connection is normal
- **Use Proxy**:
  ```bash
  # Set proxy
  export HTTP_PROXY=http://proxy.example.com:8080
  export HTTPS_PROXY=http://proxy.example.com:8080
  vue-security-scanner --threat-intelligence --update
  ```
- **Adjust Update Sources**: Adjust threat intelligence sources in configuration
  ```javascript
  module.exports = {
    threatIntelligence: {
      sources: {
        cncert: true,
        cnnvd: true,
        nvd: true,
        cve: true
      }
    }
  };
  ```
- **Manual Update**:
  ```bash
  vue-security-scanner --threat-intelligence --update --force
  ```

### 5.2 Threat Intelligence False Positives

**Problem**: Threat intelligence reports non-existent threats.

**Solutions**:
- **Verify Threat Intelligence**: Manually verify the accuracy of threat intelligence
- **Adjust Severity Threshold**:
  ```javascript
  module.exports = {
    threatIntelligence: {
      severityThreshold: 'high'
    }
  };
  ```
- **Disable Specific Intelligence Sources**:
  ```javascript
  module.exports = {
    threatIntelligence: {
      sources: {
        'exploit-db': false
      }
    }
  };
  ```
- **Report False Positives**: Report false positives to project maintainers

### 5.3 Threat Intelligence False Negatives

**Problem**: Known security threats are not detected.

**Solutions**:
- **Update Threat Intelligence**:
  ```bash
  vue-security-scanner --threat-intelligence --update
  ```
- **Enable More Intelligence Sources**:
  ```javascript
  module.exports = {
    threatIntelligence: {
      sources: {
        cncert: true,
        cnnvd: true,
        cnvd: true,
        nvd: true,
        cve: true,
        owasp: true
      }
    }
  };
  ```
- **Check Dependency Versions**: Ensure dependency version information is correct
- **Report False Negatives**: Report false negatives to project maintainers

## 6. Compliance Issues

### 6.1 Compliance Report Generation Failure

**Problem**: Compliance report generation fails.

**Solutions**:
- **Check Compliance Configuration**: Ensure compliance configuration is correct
  ```javascript
  module.exports = {
    compliance: {
      standard: 'china',
      report: {
        format: 'html',
        outputPath: './compliance-report.html'
      }
    }
  };
  ```
- **Update Threat Intelligence**: Ensure threat intelligence database is up to date
  ```bash
  vue-security-scanner --threat-intelligence --update
  ```
- **Check Network Connection**: Ensure able to access compliance standard data
- **Use Default Configuration**: Try using default compliance configuration
  ```bash
  vue-security-scanner --compliance china
  ```

### 6.2 Inaccurate Compliance Check

**Problem**: Compliance check results are inaccurate.

**Solutions**:
- **Update to Latest Version**:
  ```bash
  npm update vue-security-scanner
  ```
- **Use Correct Compliance Standard**:
  ```bash
  # China compliance standard
  vue-security-scanner --compliance china
  
  # International compliance standard
  vue-security-scanner --compliance international
  ```
- **Check Rule Configuration**: Ensure relevant rules are enabled
  ```javascript
  module.exports = {
    rules: {
      enabled: ['vue', 'javascript', 'dependency', 'china-security']
    }
  };
  ```
- **Report Issues**: Report compliance check issues to project maintainers

### 6.3 Missing Compliance Documentation

**Problem**: Compliance reports are missing necessary documentation.

**Solutions**:
- **Check Project Documentation**: Ensure project contains necessary compliance documentation
- **Generate Compliance Documentation**:
  ```bash
  vue-security-scanner --generate-compliance-docs
  ```
- **Manually Add Documentation**: Manually add necessary documentation according to compliance standard requirements
- **Consult Compliance Experts**: If unsure about what documentation is needed, consult compliance experts

## 7. API Issues

### 7.1 API Call Failure

**Problem**: API calls fail when using the API.

**Solutions**:
- **Check API Version**: Ensure API version matches installed version
- **Check Parameter Format**: Ensure API parameter format is correct
  ```javascript
  // Correct API call example
  const scanner = new VueSecurityScanner({
    scanPath: './src',
    rules: {
      enabled: ['vue', 'javascript']
    }
  });
  ```
- **View API Documentation**: Reference examples in API documentation
- **Enable Debug Mode**:
  ```javascript
  const scanner = new VueSecurityScanner({
    debug: true
  });
  ```

### 7.2 Incomplete API Documentation

**Problem**: API documentation is incomplete, missing descriptions for some methods.

**Solutions**:
- **View Source Code**: View API implementation in source code
- **Use TypeScript**: Use TypeScript for type hints
- **Report Documentation Issues**: Report documentation issues to project maintainers
- **Contribute Documentation**: Help improve API documentation

### 7.3 API Performance Issues

**Problem**: Poor performance when using the API.

**Solutions**:
- **Use Cache**:
  ```javascript
  const scanner = new VueSecurityScanner({
    performance: {
      cache: {
        enabled: true
      }
    }
  });
  ```
- **Use Incremental Scanning**:
  ```javascript
  const scanner = new VueSecurityScanner({
    performance: {
      enableIncremental: true
    }
  });
  ```
- **Optimize Calling Method**: Avoid repeatedly creating scanner instances
  ```javascript
  // Incorrect way
  for (const path of paths) {
    const scanner = new VueSecurityScanner({ scanPath: path });
    await scanner.scan();
  }
  
  // Correct way
  const scanner = new VueSecurityScanner();
  for (const path of paths) {
    scanner.options.scanPath = path;
    await scanner.scan();
  }
  ```

## 8. CI/CD Integration Issues

### 8.1 CI/CD Build Failure

**Problem**: Build fails when integrating in CI/CD.

**Solutions**:
- **Use Cache**: Cache dependencies and scan results in CI/CD
  ```yaml
  # GitHub Actions example
  jobs:
    security-scan:
      runs-on: ubuntu-latest
      steps:
        - uses: actions/checkout@v2
        - uses: actions/setup-node@v2
          with:
            node-version: '16'
        - name: Cache dependencies
          uses: actions/cache@v2
          with:
            path: ~/.npm
            key: ${{ runner.os }}-node-${{ hashFiles('**/package-lock.json') }}
            restore-keys: |
              ${{ runner.os }}-node-
        - name: Cache security scanner
          uses: actions/cache@v2
          with:
            path: ./.vue-security-cache
            key: ${{ runner.os }}-vue-security-${{ github.sha }}
            restore-keys: |
              ${{ runner.os }}-vue-security-
        - run: npm install
        - run: npm run security-scan
  ```
- **Adjust Timeout**: Increase timeout in CI/CD
- **Use Quick Mode**: Use quick scan mode in CI/CD
  ```bash
  vue-security-scanner --quick
  ```
- **Set Environment Variables**: Set necessary environment variables in CI/CD

### 8.2 Inconsistent CI/CD Scan Results

**Problem**: Scan results in CI/CD are inconsistent with local results.

**Solutions**:
- **Use Same Version**: Ensure same version is used in CI/CD as locally
- **Use Same Configuration**: Ensure same configuration is used in CI/CD as locally
- **Disable Cache**: Disable cache in CI/CD to ensure full scan every time
  ```bash
  vue-security-scanner --no-cache
  ```
- **Check Environment Differences**: Check differences between CI/CD environment and local environment

### 8.3 CI/CD Integration Configuration

**Problem**: Don't know how to properly configure in CI/CD.

**Solutions**:
- **Reference Documentation**: Reference CI/CD integration examples in documentation
- **Use Templates**: Use CI/CD templates provided by the project
- **Example Configurations**:
  ```yaml
  # GitHub Actions configuration example
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
        - run: npx vue-security-scanner --format json --output security-results.json
        - name: Upload results
          uses: actions/upload-artifact@v2
          with:
            name: security-results
            path: security-results.json
  ```
  
  ```yaml
  # GitLab CI configuration example
  security_scan:
    stage: test
    script:
      - npm install
      - npx vue-security-scanner --format html --output security-report.html
    artifacts:
      paths:
        - security-report.html
    only:
      - merge_requests
      - main
  ```

## 9. Other Issues

### 9.1 Language Support Issues

**Problem**: Certain languages or frameworks are not supported.

**Solutions**:
- **Check Supported Languages**: Check the list of supported languages in documentation
- **Use Custom Rules**: Create custom rules for unsupported languages
- **Request Support**: Request addition of support for specific languages from project maintainers
- **Contribute Code**: Help add support for new languages

### 9.2 Configuration File Issues

**Problem**: Configuration file is not effective or has format errors.

**Solutions**:
- **Validate Configuration File**:
  ```bash
  vue-security-scanner --validate-config
  ```
- **View Configuration Examples**: Reference configuration examples in documentation
- **Use Default Configuration**: Delete configuration file and use default configuration
- **Check Syntax Errors**: Ensure configuration file has no syntax errors

### 9.3 Logging and Debugging

**Problem**: Need to view detailed logs and debugging information.

**Solutions**:
- **Enable Debug Mode**:
  ```bash
  vue-security-scanner --debug
  ```
- **Enable Verbose Output**:
  ```bash
  vue-security-scanner --verbose
  ```
- **View Log Files**:
  ```bash
  # View log files
  cat ./.vue-security-cache/scanner.log
  ```
- **Set Log Level**:
  ```javascript
  module.exports = {
    logging: {
      level: 'debug'
    }
  };
  ```

### 9.4 Custom Integration

**Problem**: Need to integrate with other tools or systems.

**Solutions**:
- **Use API**: Use API to integrate with other tools
- **Use Output Format**: Use machine-readable output format
  ```bash
  vue-security-scanner --format json
  ```
- **Use Webhook**: Configure webhook to send scan results
  ```javascript
  module.exports = {
    reporting: {
      webhook: {
        enabled: true,
        url: 'https://example.com/webhook'
      }
    }
  };
  ```
- **Contribute Integration**: Help add integration support for other tools

### 9.5 License Issues

**Problem**: Questions about project license.

**Solutions**:
- **View LICENSE File**: LICENSE file in project root contains detailed license information
- **Consult Legal Counsel**: If unsure about license, consult legal counsel
- **Comply with License**: Ensure compliance with license requirements when using and modifying the project

### 9.6 Community Support

**Problem**: Need community support and help.

**Solutions**:
- **GitHub Issues**: Ask questions in GitHub Issues
- **Discord Community**: Join Discord community for help
- **Stack Overflow**: Ask questions on Stack Overflow with `vue-security-scanner` tag
- **Mailing List**: Join project mailing list
- **Contributors**: Contact project contributors for help

## 10. Contact Support

If the problem you encounter is not answered in this FAQ, you can contact support through:

### 10.1 GitHub Issues

- **Create Issue**: Create a new Issue on GitHub
  [https://github.com/vue-security-scanner/vue-security-scanner/issues](https://github.com/vue-security-scanner/vue-security-scanner/issues)
- **Issue Template**: Use the provided issue template, including detailed problem description and environment information

### 10.2 Discord Community

- **Join Discord**：[https://discord.gg/vue-security](https://discord.gg/vue-security)
- **Support Channel**: Ask questions in `#support` channel
- **Community Members**: Community members and contributors will try their best to answer your questions

### 10.3 Email Support

- **Send Email**: contact@vue-security-scanner.com
- **Email Content**: Include detailed problem description, environment information, and reproduction steps
- **Response Time**: Usually reply within 1-3 business days

### 10.4 Enterprise Support

For enterprise users, we provide professional technical support services:

- **Enterprise Support**: Priority handling of enterprise user issues
- **Customization Services**: Provide customized services according to enterprise needs
- **Security Consulting**: Provide professional security consulting services
- **Training Services**: Provide security scanning training services

## 11. Troubleshooting Guide

### 11.1 Basic Troubleshooting Steps

1. **Check Version**: Ensure using the latest version
   ```bash
   vue-security-scanner --version
   ```

2. **Run Diagnostics**: Run diagnostic command to check system status
   ```bash
   vue-security-scanner --diagnose
   ```

3. **View Logs**: View scan logs
   ```bash
   vue-security-scanner --verbose
   ```

4. **Check Environment**: Check system environment and dependencies
   ```bash
   node -v
   npm -v
   ```

5. **Try Default Configuration**: Run with default configuration
   ```bash
   vue-security-scanner --default-config
   ```

### 11.2 Common Error Codes

| Error Code | Description | Solution |
|------------|-------------|----------|
| `E001` | Scan path does not exist | Check if scan path exists |
| `E002` | Configuration file format error | Check configuration file syntax |
| `E003` | Missing dependencies | Reinstall dependencies |
| `E004` | Insufficient memory | Increase memory limit or reduce thread count |
| `E005` | Network connection failed | Check network connection |
| `E006` | Rule loading failed | Check rule configuration |
| `E007` | Report generation failed | Check output directory permissions |
| `E008` | API call failed | Check API parameters |

### 11.3 Advanced Troubleshooting

**If basic troubleshooting steps cannot solve the problem, you can try the following advanced troubleshooting methods:**

1. **Enable Full Debug**:
   ```bash
   vue-security-scanner --debug --verbose --log-file debug.log
   ```

2. **Use strace (Linux)**:
   ```bash
   strace -f -o strace.log vue-security-scanner
   ```

3. **Use Process Monitor (Windows)**:
   - Download and run Process Monitor
   - Filter `vue-security-scanner` process
   - View detailed system calls

4. **Create Minimal Reproduction Case**:
   - Create a minimal project that can reproduce the issue
   - Provide it to project maintainers to help them diagnose the problem

5. **Submit Complete Error Report**:
   - Include error messages, logs, environment information
   - Include reproduction steps and minimal reproduction case
   - Include expected behavior and actual behavior

## 12. Conclusion

This FAQ covers common issues and solutions for Vue Security Scanner. If the problem you encounter is not answered in this FAQ, or if you have any suggestions and feedback, please contact us through the above methods.

We are committed to continuously improving Vue Security Scanner to provide you with a safer and more efficient Vue application development experience. Your feedback is very important to us and helps us continuously improve the product.

Thank you for using Vue Security Scanner!