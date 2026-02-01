# Ignore Guide

This guide explains how to use ignore rules to exclude specific files, directories, or vulnerability types from Vue Security Scanner scans.

## Ignore File Format

Create a `.vue-security-ignore` file in your project root directory to specify what to ignore during scanning.

The file format is similar to `.gitignore`, with additional support for ignoring specific vulnerability types and rules.

## Basic Usage

### Ignore Directories

```bash
# Ignore node_modules directory
node_modules/

# Ignore dist directory
dist/

# Ignore build directory
build/

# Ignore .git directory
.git/

# Ignore coverage directory
coverage/

# Ignore public directory
public/
```

### Ignore File Patterns

```bash
# Ignore all minified JavaScript files
**/*.min.js

# Ignore all files in vendor directories
**/vendor/**

# Ignore all files in lib directories
**/lib/**

# Ignore specific file
config/secret.js

# Ignore files with specific pattern
src/**/*test*.js
```

### Ignore Vulnerability Types

```bash
# Ignore XSS vulnerabilities
type:XSS

# Ignore memory leak vulnerabilities
type:Memory Leak

# Ignore CSRF vulnerabilities
type:CSRF

# Ignore SQL injection vulnerabilities
type:SQL Injection
```

### Ignore Specific Rules

```bash
# Ignore custom API key rule
rule:custom-api-key

# Ignore hardcoded password rule
rule:hardcoded-password

# Ignore insecure JWT rule
rule:insecure-jwt

# Ignore missing CSP rule
rule:missing-csp
```

### Ignore by Severity

```bash
# Ignore low severity vulnerabilities
severity:low

# Ignore medium severity vulnerabilities
severity:medium

# Ignore both low and medium severity vulnerabilities
severity:low
severity:medium
```

## Advanced Patterns

### Glob Patterns

The ignore file supports glob patterns:

- `*` matches any characters except `/`
- `**` matches any characters including `/`
- `?` matches a single character
- `[abc]` matches any character in the set
- `[!abc]` matches any character not in the set

### Negation Patterns

You can negate patterns using `!`:

```bash
# Ignore all JavaScript files except app.js
**/*.js
!app.js

# Ignore all files in src except src/utils
src/**
!src/utils/**
```

### Directory vs File Patterns

- Patterns ending with `/` match directories only
- Patterns not ending with `/` match both files and directories

### Case Insensitivity

To make patterns case-insensitive, add `i` at the end:

```bash
# Ignore files regardless of case
**/*.JS

# Case-insensitive pattern
**/*.js
```

## Multiple Ignore Files

You can use multiple ignore files:

1. `.vue-security-ignore` in project root
2. `.vue-security-ignore` in subdirectories
3. Custom ignore file specified with `--ignore-file`

## Command Line Options

You can also specify ignore patterns via command line:

```bash
# Ignore specific directory
vue-security-scanner . --ignore-dir node_modules --ignore-dir dist

# Ignore specific file pattern
vue-security-scanner . --ignore-pattern "**/*.min.js" --ignore-pattern "**/vendor/**"

# Use custom ignore file
vue-security-scanner . --ignore-file custom-ignore.txt
```

## Configuration File Options

You can configure ignore patterns in the configuration file:

```json
{
  "scan": {
    "ignoreDirs": [
      "node_modules",
      "dist",
      "build",
      ".git",
      "coverage",
      "public"
    ],
    "ignorePatterns": [
      "**/*.min.js",
      "**/vendor/**",
      "**/lib/**"
    ]
  }
}
```

## Best Practices

### For Development

```bash
# Ignore test files
test/
__tests__/
**/*test*.js
**/*spec*.js

# Ignore development tools
.vscode/
.idea/
*.swp
*.swo
*~

# Ignore environment files
.env
.env.local
.env.development.local
.env.test.local
.env.production.local
```

### For Production

```bash
# Ignore development dependencies
node_modules/

# Ignore build artifacts
dist/
build/

# Ignore source maps
**/*.map

# Ignore documentation
docs/
README.md
CHANGELOG.md
```

### For Security

```bash
# Never ignore security-critical directories
src/

# Only ignore specific vulnerability types if necessary
# severity:low

# Always review ignore rules periodically
```

## Troubleshooting

### Patterns Not Working

If your ignore patterns aren't working:

1. Check the pattern syntax
2. Ensure you're using the correct glob patterns
3. Verify the pattern matches the correct paths
4. Check if negation patterns are overriding your rules

### Specific Files Still Being Scanned

If specific files are still being scanned:

1. Check if the file is matched by multiple patterns
2. Verify the file path is correct
3. Check if the file is in a subdirectory with its own ignore file
4. Use `--verbose` to see which files are being scanned

### Too Many False Positives

To reduce false positives:

1. Ignore specific rules that are causing false positives
2. Use severity filters to focus on important issues
3. Create more specific patterns to ignore only the problematic code

## Examples

### Example 1: Basic Ignore File

```bash
# Dependencies
node_modules/

# Build artifacts
dist/
build/

# Version control
.git/

# Coverage reports
coverage/

# Environment files
.env
.env.local
.env.development.local
.env.test.local
.env.production.local

# IDE files
.vscode/
.idea/
*.swp
*.swo
*~

# Minified files
**/*.min.js

# Test files
**/*test*.js
**/*spec*.js
test/
__tests__/

# Low severity issues
severity:low
```

### Example 2: Advanced Ignore File

```bash
# Directories
node_modules/
dist/
build/
.git/
coverage/
public/

# File patterns
**/*.min.js
**/vendor/**
**/lib/**
**/*.map

# Environment files
.env
.env.local
.env.*.local

# IDE files
.vscode/
.idea/
*.swp
*.swo
*~

# Test files
test/
__tests__/
**/*test*.js
**/*spec*.js

# Vulnerability types
type:Memory Leak

# Specific rules
rule:custom-api-key
rule:hardcoded-password

# Severity
severity:low

# Negation patterns
!src/utils/security.js
!src/components/auth/
```

## Support

For additional help with ignore rules, please open an issue in the GitHub repository.
