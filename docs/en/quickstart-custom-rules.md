# Quickstart: Custom Rules

This guide provides a quickstart for creating custom security rules for Vue Security Scanner.

## Overview

Custom rules allow you to:
- Define project-specific security policies
- Extend the scanner with your own security checks
- Implement organization-specific compliance requirements
- Add custom vulnerability detection logic

## Getting Started

### 1. Create a Custom Rules File

Create a file named `custom-rules.js` in your project root:

```javascript
module.exports = {
  rules: [
    {
      id: 'custom-api-key',
      name: 'Custom API Key Check',
      description: 'Detects hardcoded API keys in custom patterns',
      severity: 'high',
      pattern: /api[_-]key\s*[:=]\s*['"]([a-zA-Z0-9]{20,})['"]/g,
      fix: 'Use environment variables for API keys',
      examples: [
        {
          code: "const api_key = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';",
          message: 'Hardcoded API key detected'
        }
      ]
    },
    {
      id: 'custom-secret-check',
      name: 'Custom Secret Check',
      description: 'Detects custom secret patterns',
      severity: 'medium',
      pattern: /secret[_-]token\s*[:=]\s*['"]([a-zA-Z0-9]{15,})['"]/g,
      fix: 'Use secure secret management',
      examples: [
        {
          code: "const secret_token = 'SECRET123456789';",
          message: 'Hardcoded secret token detected'
        }
      ]
    }
  ]
};
```

### 2. Configure the Scanner to Use Custom Rules

Create a configuration file named `vue-security-scanner.config.json`:

```json
{
  "rules": {
    "custom": {
      "enabled": true,
      "path": "./custom-rules.js"
    }
  }
}
```

### 3. Run the Scanner with Custom Rules

```bash
vue-security-scanner . --config vue-security-scanner.config.json
```

Output:
```
🔍 Starting Vue Security Scanner v1.3.1
📁 Scanning directory: /path/to/project
📝 Using configuration: vue-security-scanner.config.json
🔧 Loading custom rules from: ./custom-rules.js
✅ Custom rules loaded: 2 rules

📊 Scan Results:

┌───────────────┬──────────┬─────────────┬──────────────────────────────┐
│ Severity      │ Count    │ Rule ID     │ Description                  │
├───────────────┼──────────┼─────────────┼──────────────────────────────┤
│ high          │ 1        │ custom-api-key │ Hardcoded API key detected  │
│ medium        │ 1        │ custom-secret-check │ Hardcoded secret token     │
└───────────────┴──────────┴─────────────┴──────────────────────────────┘

🔒 Total vulnerabilities found: 2
📋 Detailed report saved to: security-report.json
✨ Scan completed in 2.4 seconds
```

## Rule Structure

### Basic Rule Structure

```javascript
{
  id: 'rule-id',              // Unique rule identifier
  name: 'Rule Name',          // Human-readable rule name
  description: 'Rule description', // Detailed rule description
  severity: 'severity',        // Severity: low, medium, high, critical
  pattern: /regex-pattern/,    // Regular expression pattern to match
  fix: 'Fix recommendation',   // Suggested fix
  examples: [                  // Example code snippets
    {
      code: 'Example code',    // Code that triggers the rule
      message: 'Expected message' // Message for this example
    }
  ]
}
```

### Supported Properties

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| id | string | ✅ | Unique rule identifier |
| name | string | ✅ | Human-readable rule name |
| description | string | ✅ | Detailed rule description |
| severity | string | ✅ | Severity level |
| pattern | RegExp | ✅ | Regular expression to match |
| fix | string | ✅ | Suggested fix |
| examples | array | ❌ | Example code snippets |
| tags | array | ❌ | Rule categorization tags |
| cwe | string | ❌ | CWE reference |
| owasp | string | ❌ | OWASP Top 10 reference |
| enabled | boolean | ❌ | Enable/disable rule |

## Advanced Rule Features

### AST-Based Rules

For more complex rules, you can use AST-based analysis:

```javascript
{
  id: 'custom-ast-rule',
  name: 'Custom AST Rule',
  description: 'Detects custom patterns using AST analysis',
  severity: 'medium',
  ast: true,
  check: (node, filename) => {
    if (node.type === 'VariableDeclaration') {
      // Custom AST analysis logic
      return {
        found: true,
        message: 'Custom AST pattern detected'
      };
    }
    return { found: false };
  },
  fix: 'Fix recommendation',
  examples: [
    {
      code: 'const unsafe = true;',
      message: 'Custom AST pattern detected'
    }
  ]
}
```

### File-Specific Rules

Target rules to specific file types:

```javascript
{
  id: 'custom-file-rule',
  name: 'Custom File Rule',
  description: 'Detects issues only in specific files',
  severity: 'low',
  pattern: /unsafe-pattern/g,
  files: ['*.js', '*.vue'], // Only apply to JavaScript and Vue files
  fix: 'Fix recommendation'
}
```

### Path-Specific Rules

Limit rules to specific directories:

```javascript
{
  id: 'custom-path-rule',
  name: 'Custom Path Rule',
  description: 'Detects issues only in specific paths',
  severity: 'medium',
  pattern: /path-specific-pattern/g,
  paths: ['src/components/', 'src/views/'], // Only apply to these paths
  fix: 'Fix recommendation'
}
```

## Testing Custom Rules

### Test Your Rules

Create a test file to verify your custom rules work correctly:

```javascript
const scanner = require('vue-security-scanner');

async function testCustomRules() {
  const result = await scanner.scan('.', {
    config: './vue-security-scanner.config.json',
    output: 'json'
  });
  
  console.log('Test Results:', result);
  console.log('Found', result.totalIssues, 'issues');
}

testCustomRules();
```

### Validate Rule Syntax

Use the scanner's built-in validation:

```bash
vue-security-scanner . --config vue-security-scanner.config.json --validate-rules
```

Output:
```
🔍 Validating custom rules...
✅ Custom rules syntax is valid
✅ All required properties present
✅ Regular expressions are valid
✅ Severity levels are correct

📋 Rule Validation Results:

┌─────────────┬───────────┬──────────┐
│ Rule ID     │ Status    │ Message  │
├─────────────┼───────────┼──────────┤
│ custom-api-key │ Valid     │ OK       │
│ custom-secret-check │ Valid     │ OK       │
└─────────────┴───────────┴──────────┘
```

## Best Practices

### Rule Design

- **Be specific**: Target specific patterns rather than general ones
- **Set appropriate severity**: Use severity levels that match the actual risk
- **Provide clear fixes**: Give actionable fix recommendations
- **Include examples**: Provide code examples for better understanding
- **Test thoroughly**: Verify rules work as expected

### Performance

- **Optimize regex**: Use efficient regular expressions
- **Limit scope**: Target rules to specific files or paths
- **Avoid backtracking**: Use non-greedy quantifiers where possible
- **Test performance**: Monitor rule execution time

### Maintenance

- **Document rules**: Add comments explaining rule logic
- **Version control**: Store custom rules in version control
- **Update regularly**: Review and update rules as needed
- **Share across projects**: Reuse rules across multiple projects

## Example: Comprehensive Custom Rules

```javascript
module.exports = {
  rules: [
    {
      id: 'custom-api-key',
      name: 'Custom API Key Check',
      description: 'Detects hardcoded API keys in custom patterns',
      severity: 'high',
      pattern: /api[_-]key\s*[:=]\s*['"]([a-zA-Z0-9]{20,})['"]/g,
      fix: 'Use environment variables for API keys',
      examples: [
        {
          code: "const api_key = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';",
          message: 'Hardcoded API key detected'
        }
      ]
    },
    {
      id: 'custom-secret-check',
      name: 'Custom Secret Check',
      description: 'Detects custom secret patterns',
      severity: 'medium',
      pattern: /secret[_-]token\s*[:=]\s*['"]([a-zA-Z0-9]{15,})['"]/g,
      fix: 'Use secure secret management',
      examples: [
        {
          code: "const secret_token = 'SECRET123456789';",
          message: 'Hardcoded secret token detected'
        }
      ]
    },
    {
      id: 'custom-ast-rule',
      name: 'Custom AST Rule',
      description: 'Detects custom patterns using AST analysis',
      severity: 'medium',
      ast: true,
      check: (node, filename) => {
        if (node.type === 'VariableDeclaration') {
          // Custom AST analysis logic
          return {
            found: true,
            message: 'Custom AST pattern detected'
          };
        }
        return { found: false };
      },
      fix: 'Fix recommendation',
      examples: [
        {
          code: 'const unsafe = true;',
          message: 'Custom AST pattern detected'
        }
      ]
    }
  ]
};
```

## Support

For additional help with custom rules:

1. **Check documentation**: Review the official documentation
2. **Use examples**: Start with the provided examples
3. **Test incrementally**: Build and test rules one at a time
4. **Ask the community**: Seek help from the community

## Next Steps

- **Explore rule types**: Experiment with different rule types
- **Build a rule library**: Create a library of reusable rules
- **Share rules**: Contribute useful rules to the community
- **Automate rule testing**: Set up automated tests for your rules
