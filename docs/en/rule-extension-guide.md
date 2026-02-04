# Rule Extension Guide

This guide provides detailed instructions for extending Vue Security Scanner with custom rules and rule modules.

## Overview

Rule extensions allow you to:
- Create custom security rules for specific project needs
- Develop rule modules for specialized security domains
- Integrate third-party security rules
- Implement organization-specific security policies

## Rule Architecture

### Core Rule Components

Each rule consists of several key components:

- **Rule Definition**: Metadata and configuration
- **Detection Logic**: How the rule identifies vulnerabilities
- **Severity Assessment**: How serious the issue is
- **Fix Recommendations**: How to address the issue
- **Examples**: Code samples demonstrating the issue

### Rule Types

Vue Security Scanner supports several types of rules:

- **Pattern-based Rules**: Use regular expressions to match patterns
- **AST-based Rules**: Analyze Abstract Syntax Tree for deeper inspection
- **Semantic Rules**: Understand code context and meaning
- **Dependency Rules**: Analyze package dependencies for vulnerabilities
- **Framework Rules**: Specific to Vue.js and related frameworks

## Creating Custom Rules

### Basic Rule Structure

```javascript
{
  id: 'rule-id',              // Unique identifier
  name: 'Rule Name',          // Human-readable name
  description: 'Rule description', // Detailed description
  severity: 'severity',        // low, medium, high, critical
  pattern: /regex-pattern/,    // For pattern-based rules
  ast: true,                  // For AST-based rules
  check: function(node) {},   // For AST-based rules
  fix: 'Fix recommendation',   // How to fix the issue
  examples: [                  // Example code snippets
    {
      code: 'Example code',    // Code that triggers the rule
      message: 'Expected message' // Message for this example
    }
  ],
  tags: ['tag1', 'tag2'],      // Categorization tags
  cwe: 'CWE-XXX',             // CWE reference
  owasp: 'OWASP-XXX'           // OWASP Top 10 reference
}
```

### Pattern-based Rules

Pattern-based rules use regular expressions to detect vulnerabilities:

```javascript
{
  id: 'hardcoded-password',
  name: 'Hardcoded Password',
  description: 'Detects hardcoded passwords in code',
  severity: 'high',
  pattern: /password\s*[:=]\s*['"]([a-zA-Z0-9!@#$%^&*()_+]{6,})['"]/g,
  fix: 'Use environment variables or secure password management',
  examples: [
    {
      code: "const password = 'MySecretPassword123';",
      message: 'Hardcoded password detected'
    }
  ]
}
```

### AST-based Rules

AST-based rules analyze the Abstract Syntax Tree for more sophisticated detection:

```javascript
{
  id: 'unsafe-eval',
  name: 'Unsafe eval() Usage',
  description: 'Detects unsafe use of eval()',
  severity: 'high',
  ast: true,
  check: function(node) {
    if (node.type === 'CallExpression' && 
        node.callee.type === 'Identifier' && 
        node.callee.name === 'eval') {
      return {
        found: true,
        message: 'Unsafe eval() usage detected'
      };
    }
    return { found: false };
  },
  fix: 'Avoid using eval() - use safer alternatives',
  examples: [
    {
      code: "eval(userInput);",
      message: 'Unsafe eval() usage detected'
    }
  ]
}
```

### Semantic Rules

Semantic rules understand code context and meaning:

```javascript
{
  id: 'insecure-cookie',
  name: 'Insecure Cookie',
  description: 'Detects cookies without secure flags',
  severity: 'medium',
  semantic: true,
  check: function(context) {
    // Analyze cookie settings with context awareness
    return {
      found: true,
      message: 'Insecure cookie detected'
    };
  },
  fix: 'Set secure and httpOnly flags on cookies',
  examples: [
    {
      code: "document.cookie = 'session=123';",
      message: 'Insecure cookie detected'
    }
  ]
}
```

## Creating Rule Modules

### Rule Module Structure

Rule modules organize related rules into cohesive packages:

```javascript
// custom-rule-module.js
module.exports = {
  id: 'custom-module',
  name: 'Custom Rule Module',
  description: 'Contains custom security rules',
  rules: [
    // Rule definitions here
  ],
  dependencies: [
    // Dependencies on other modules
  ],
  init: function() {
    // Initialization code
  }
};
```

### Registering Rule Modules

Register your rule module in the configuration:

```json
{
  "rules": {
    "modules": {
      "custom-module": {
        "enabled": true,
        "path": "./custom-rule-module.js"
      }
    }
  }
}
```

## Advanced Rule Features

### Rule Dependencies

Rules can depend on other rules or modules:

```javascript
{
  id: 'dependent-rule',
  name: 'Dependent Rule',
  description: 'Rule that depends on another rule',
  severity: 'medium',
  dependsOn: ['base-rule'],
  check: function(node) {
    // Rule logic that depends on base-rule
  }
}
```

### Rule Configuration

Rules can be configurable with parameters:

```javascript
{
  id: 'configurable-rule',
  name: 'Configurable Rule',
  description: 'Rule with configurable parameters',
  severity: 'medium',
  config: {
    maxLength: {
      type: 'number',
      default: 100,
      description: 'Maximum allowed length'
    }
  },
  check: function(node, config) {
    // Use config.maxLength in rule logic
  }
}
```

### Rule Optimization

Optimize rules for better performance:

```javascript
{
  id: 'optimized-rule',
  name: 'Optimized Rule',
  description: 'Performance-optimized rule',
  severity: 'medium',
  pattern: /optimized-pattern/g,
  optimize: true, // Enable optimization
  cacheResults: true, // Cache results for same patterns
  check: function(node) {
    // Optimized rule logic
  }
}
```

## Testing Rules

### Rule Testing Framework

Test your rules with the built-in testing framework:

```javascript
const scanner = require('vue-security-scanner');

async function testRule() {
  const rule = {
    id: 'test-rule',
    name: 'Test Rule',
    description: 'Test rule',
    severity: 'medium',
    pattern: /test-pattern/g,
    fix: 'Test fix'
  };

  const testCode = 'const test = "test-pattern";';
  const result = await scanner.testRule(rule, testCode);
  
  console.log('Test Result:', result);
}

testRule();
```

### Test Cases

Create comprehensive test cases for your rules:

```javascript
const testCases = [
  {
    name: 'Positive Test',
    code: 'const password = "MyPassword123";',
    expected: true,
    message: 'Should detect hardcoded password'
  },
  {
    name: 'Negative Test',
    code: 'const username = "user";',
    expected: false,
    message: 'Should not detect non-password'
  },
  {
    name: 'Edge Case Test',
    code: 'const pass = "";',
    expected: false,
    message: 'Should not detect empty string'
  }
];

// Run tests
for (const testCase of testCases) {
  const result = await scanner.testRule(rule, testCase.code);
  console.log(`${testCase.name}: ${result.found === testCase.expected ? 'PASS' : 'FAIL'} - ${testCase.message}`);
}
```

## Rule Module Development

### Creating a Rule Module

```javascript
// my-rule-module.js
module.exports = {
  id: 'my-module',
  name: 'My Rule Module',
  description: 'Custom rule module for specific security concerns',
  rules: [
    {
      id: 'my-rule-1',
      name: 'My Rule 1',
      description: 'First custom rule',
      severity: 'medium',
      pattern: /pattern1/g,
      fix: 'Fix for pattern 1'
    },
    {
      id: 'my-rule-2',
      name: 'My Rule 2',
      description: 'Second custom rule',
      severity: 'high',
      pattern: /pattern2/g,
      fix: 'Fix for pattern 2'
    }
  ],
  init: function() {
    console.log('My rule module initialized');
  },
  dependencies: ['core']
};
```

### Integrating Rule Modules

Add your module to the scanner configuration:

```json
{
  "rules": {
    "modules": {
      "my-module": {
        "enabled": true,
        "path": "./my-rule-module.js"
      }
    }
  }
}
```

## Best Practices

### Rule Development

1. **Start Simple**: Begin with pattern-based rules before moving to AST-based rules
2. **Test Thoroughly**: Create comprehensive test cases for each rule
3. **Optimize Performance**: Ensure rules don't slow down scans
4. **Be Specific**: Target specific vulnerabilities rather than general patterns
5. **Provide Clear Fixes**: Give actionable recommendations

### Rule Organization

1. **Categorize Rules**: Group related rules into modules
2. **Use Consistent Naming**: Follow naming conventions for rule IDs and names
3. **Document Thoroughly**: Explain what each rule does and why it matters
4. **Version Rules**: Track changes to rules over time
5. **Reuse Logic**: Share common detection logic between rules

### Performance Optimization

1. **Use Efficient Patterns**: Optimize regular expressions
2. **Limit AST Traversal**: Avoid deep AST traversal when possible
3. **Cache Results**: Cache expensive operations
4. **Batch Processing**: Process multiple patterns together
5. **Prioritize Rules**: Run high-severity rules first

## Troubleshooting

### Rule Issues

If your rule isn't working as expected:

1. **Check Pattern Syntax**: Ensure regular expressions are correct
2. **Test with Simple Cases**: Start with basic test cases
3. **Verify AST Structure**: Check the AST structure for your code
4. **Enable Debugging**: Use `--debug` flag to see rule execution
5. **Check Dependencies**: Ensure all dependencies are met

### Performance Issues

If your rule is causing performance problems:

1. **Optimize Regular Expressions**: Avoid complex regex patterns
2. **Limit Scope**: Restrict rule to specific file types or directories
3. **Reduce AST Depth**: Limit how deep the AST is traversed
4. **Add Caching**: Cache results for repeated patterns
5. **Split Complex Rules**: Break large rules into smaller ones

## Deployment

### Sharing Rules

Share your custom rules with the community:

1. **Publish as npm Package**: Create an npm package for your rules
2. **Contribute to Core**: Submit useful rules to the main repository
3. **Document Usage**: Provide clear instructions for using your rules
4. **Maintain Compatibility**: Ensure rules work with multiple scanner versions

### Enterprise Deployment

For enterprise environments:

1. **Central Rule Repository**: Maintain a central repository of rules
2. **Version Control**: Use Git to track rule changes
3. **Automated Testing**: Test rules against codebase regularly
4. **Access Control**: Restrict who can modify rules
5. **Audit Logging**: Track when rules are changed and by whom

## Support

For additional help with rule extensions:

1. **Documentation**: Review the official documentation
2. **Community Forum**: Ask questions in the community forum
3. **GitHub Issues**: Report bugs and request features
4. **Enterprise Support**: Contact enterprise support for premium assistance

## Rule Extension API

### Using the Rule Extension API

The scanner provides a flexible API for extending rules programmatically:

```javascript
const { RuleExtensionAPI } = require('./src/rules/rule-extension-api');

// Initialize the API
const ruleAPI = new RuleExtensionAPI();

// Add a custom rule dynamically
ruleAPI.addRule({
  id: 'custom-security-rule',
  name: 'Custom Security Rule',
  description: 'A custom rule added via API',
  severity: 'high',
  pattern: /custom-pattern/,
  fix: 'Apply custom fix',
  examples: [
    {
      code: 'custom code example',
      message: 'Custom vulnerability detected'
    }
  ]
});

// Register a rule module
ruleAPI.registerModule({
  id: 'my-custom-module',
  name: 'My Custom Module',
  rules: [/* rule definitions */],
  init: function() {
    // initialization code
  }
});
```

### Advanced Features

The Rule Extension API supports:

- **Dynamic Rule Loading**: Add rules at runtime without restarting the scanner
- **Rule Validation**: Built-in validation to ensure rule correctness
- **Rule Conflict Detection**: Identify potential conflicts between rules
- **Performance Monitoring**: Track rule performance and impact
- **Hot Reloading**: Automatically reload rules when they change

## Next Steps

- **Explore Existing Rules**: Study the built-in rules to understand patterns
- **Start Small**: Create a simple rule first
- **Test Rigorously**: Ensure your rule works correctly
- **Optimize Performance**: Make sure your rule doesn't slow down scans
- **Share Your Work**: Contribute useful rules to the community
