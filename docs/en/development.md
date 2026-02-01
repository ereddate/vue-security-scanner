# Vue Security Scanner Development Guide

This comprehensive guide covers everything you need to know about contributing to and developing Vue Security Scanner.

## Table of Contents

- [Project Overview](#project-overview)
- [Development Environment Setup](#development-environment-setup)
- [Project Structure](#project-structure)
- [Development Workflow](#development-workflow)
- [Code Standards](#code-standards)
- [Testing](#testing)
- [Building](#building)
- [Debugging](#debugging)
- [Performance Optimization](#performance-optimization)
- [Documentation](#documentation)
- [Contributing](#contributing)

## Project Overview

Vue Security Scanner is a comprehensive security analysis tool for Vue.js applications. It provides:

- Static Application Security Testing (SAST)
- Dynamic Application Security Testing (DAST)
- Dependency vulnerability scanning
- Compliance reporting (OWASP, GDPR, HIPAA, PCI-DSS, SOX, China standards)
- Threat intelligence integration
- Enterprise-grade features (distributed scanning, dashboard, etc.)

### Key Technologies

- **Node.js**: Runtime environment
- **JavaScript/TypeScript**: Primary development languages
- **AST Analysis**: @babel/parser, @babel/traverse for code analysis
- **Vue Support**: Vue 2/3, Nuxt.js, uni-app, Taro
- **Testing**: Jest, Mocha, or other testing frameworks
- **Build Tools**: Webpack, Vite
- **CI/CD**: GitHub Actions, GitLab CI/CD, Jenkins, etc.

## Development Environment Setup

### Prerequisites

- Node.js 16.x or higher
- npm 8.x or higher
- Git 2.x or higher
- A code editor (VSCode recommended)

### Installation

1. Clone the repository:

```bash
git clone https://github.com/your-org/vue-security-scanner.git
cd vue-security-scanner
```

2. Install dependencies:

```bash
npm install
```

3. Link the package globally (for development):

```bash
npm link
```

### VSCode Setup

Install recommended extensions:

- ESLint
- Prettier
- GitLens
- Vue Language Features (Volar)

Configure VSCode settings:

```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  }
}
```

## Project Structure

```
vue-security-scanner/
├── bin/                          # CLI executables
│   ├── vue-security-scanner.js    # Main CLI entry point
│   └── vue-security-distributed.js # Distributed scanner CLI
├── src/                          # Source code
│   ├── analysis/                 # Analysis modules
│   │   ├── ast-analyzer.js       # AST-based code analysis
│   │   ├── dast-scanner.js       # Dynamic application security testing
│   │   └── dependency-scanner.js # Dependency vulnerability scanning
│   ├── checks/                   # Security checks
│   │   └── security-checks.js    # Security check implementations
│   ├── config/                   # Configuration
│   │   └── default-config.js     # Default configuration
│   ├── core/                     # Core functionality
│   │   └── vulnerability-detector.js # Vulnerability detection
│   ├── distributed/              # Distributed scanning
│   │   ├── distributed-scanner.js
│   │   ├── result-aggregator.js
│   │   └── task-distributor.js
│   ├── integration/              # Integrations
│   │   └── trae-cn-integration.js # Trae CN integration
│   ├── reporting/                # Reporting
│   │   ├── advanced-report-generator.js
│   │   ├── china-compliance-report-generator.js
│   │   └── enhanced-compliance-report-generator.js
│   ├── rules/                    # Security rules
│   │   ├── modules/              # Rule modules
│   │   ├── custom-rules.js
│   │   ├── enhanced-rule-engine.js
│   │   ├── parallel-rule-engine.js
│   │   └── rule-engine.js
│   ├── threat-intelligence/      # Threat intelligence
│   │   └── threat-intelligence-integration.js
│   ├── utils/                    # Utilities
│   │   ├── error-handler.js
│   │   ├── helpers.js
│   │   ├── ignore-manager.js
│   │   ├── performance-optimizer.js
│   │   └── user-experience-optimizer.js
│   └── scanner.js                # Main scanner
├── tests/                        # Test files
├── docs/                         # Documentation
├── dashboard/                    # Web dashboard
├── docker/                       # Docker configuration
├── mcp/                          # MCP integration
├── nuxt-module-vue-security/     # Nuxt.js module
├── taro-plugin-vue-security/     # Taro plugin
├── jenkins-plugin-vue-security/  # Jenkins plugin
├── config/                       # Configuration files
├── .github/                      # GitHub workflows
├── package.json                  # Package configuration
└── README.md                     # Project README
```

## Development Workflow

### Branch Strategy

- `main` - Production-ready code
- `develop` - Integration branch for features
- `feature/*` - Feature branches
- `bugfix/*` - Bug fix branches
- `hotfix/*` - Hotfixes for production

### Workflow Steps

1. Create a new branch from `develop`:

```bash
git checkout develop
git pull origin develop
git checkout -b feature/your-feature-name
```

2. Make your changes

3. Run tests:

```bash
npm test
```

4. Commit your changes:

```bash
git add .
git commit -m "feat: add your feature description"
```

5. Push to remote:

```bash
git push origin feature/your-feature-name
```

6. Create a Pull Request

### Commit Message Convention

Follow [Conventional Commits](https://www.conventionalcommits.org/):

```
<type>(<scope>): <subject>

<body>

<footer>
```

Types:
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, etc.)
- `refactor`: Code refactoring
- `perf`: Performance improvements
- `test`: Test changes
- `chore`: Build process or auxiliary tool changes

Examples:

```
feat(rules): add new XSS detection rule

Add comprehensive XSS detection for Vue templates including
v-html, v-bind, and inline event handlers.

Closes #123
```

```
fix(scanner): resolve memory leak in file scanning

Fixed memory leak caused by unclosed file handles in the
dependency scanner. Added proper cleanup in finally block.

Fixes #456
```

## Code Standards

### JavaScript/TypeScript

- Use ES6+ features
- Follow Airbnb JavaScript Style Guide
- Use meaningful variable and function names
- Add JSDoc comments for functions and classes
- Keep functions small and focused

Example:

```javascript
/**
 * Scans a Vue file for security vulnerabilities
 * @param {string} filePath - Path to the Vue file
 * @param {Object} options - Scanning options
 * @returns {Promise<Object>} Scan results
 */
async function scanVueFile(filePath, options) {
  const content = await fs.readFile(filePath, 'utf-8');
  const vulnerabilities = await detectVulnerabilities(content, options);
  return {
    filePath,
    vulnerabilities,
    timestamp: Date.now()
  };
}
```

### Security Rules

When creating security rules:

1. Define clear rule metadata:

```javascript
const rule = {
  id: 'vue:xss-v-html',
  name: 'XSS via v-html',
  severity: 'High',
  description: 'Detects potential XSS vulnerabilities using v-html',
  recommendation: 'Use v-text or properly sanitize input before using v-html',
  patterns: [
    {
      key: 'v-html-usage',
      pattern: /v-html\s*=\s*["']([^"']+)["']/,
      message: 'Potential XSS vulnerability via v-html directive'
    }
  ]
};
```

2. Include test cases for each rule
3. Document the vulnerability type and remediation
4. Consider false positives and add confidence scoring

### Error Handling

Always handle errors gracefully:

```javascript
try {
  const result = await performScan();
  return result;
} catch (error) {
  logger.error('Scan failed', { error: error.message, stack: error.stack });
  throw new SecurityScanError('Scan failed', { cause: error });
}
```

## Testing

### Test Structure

```
tests/
├── unit/              # Unit tests
├── integration/       # Integration tests
├── e2e/              # End-to-end tests
└── fixtures/         # Test fixtures
```

### Writing Tests

Use Jest or Mocha for testing:

```javascript
describe('XSS Detection', () => {
  it('should detect XSS via v-html', () => {
    const code = '<div v-html="userInput"></div>';
    const result = detectXSS(code);
    expect(result.vulnerabilities).toHaveLength(1);
    expect(result.vulnerabilities[0].ruleId).toBe('vue:xss-v-html');
  });

  it('should not flag safe v-text usage', () => {
    const code = '<div v-text="sanitizedInput"></div>';
    const result = detectXSS(code);
    expect(result.vulnerabilities).toHaveLength(0);
  });
});
```

### Running Tests

```bash
# Run all tests
npm test

# Run specific test file
npm test -- tests/unit/xss-detection.test.js

# Run tests in watch mode
npm test -- --watch

# Run tests with coverage
npm test -- --coverage
```

### Test Coverage

Aim for at least 80% code coverage. Check coverage report:

```bash
npm test -- --coverage
```

## Building

### Development Build

```bash
npm run build:dev
```

### Production Build

```bash
npm run build
```

### Build Output

The build process creates:
- Compiled JavaScript in `dist/`
- Optimized bundles
- Source maps (in development)

## Debugging

### Using VSCode Debugger

1. Create `.vscode/launch.json`:

```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "type": "node",
      "request": "launch",
      "name": "Debug Scanner",
      "program": "${workspaceFolder}/bin/vue-security-scanner.js",
      "args": ["${workspaceFolder}/example-vue-app"],
      "console": "integratedTerminal"
    }
  ]
}
```

2. Set breakpoints in your code
3. Press F5 to start debugging

### Logging

Use the built-in logger:

```javascript
const logger = require('./src/utils/logger');

logger.debug('Debug message', { data });
logger.info('Info message');
logger.warn('Warning message');
logger.error('Error message', { error });
```

### Debug Mode

Run scanner in debug mode:

```bash
vue-security-scanner . --debug
```

## Performance Optimization

### Profiling

Use Node.js profiler:

```bash
node --prof bin/vue-security-scanner.js .
node --prof-process isolate-*.log > profile.txt
```

### Memory Optimization

- Use streams for large files
- Implement proper garbage collection
- Cache frequently used data
- Use worker threads for parallel processing

### Code Optimization

- Minimize regular expression complexity
- Use efficient data structures
- Avoid unnecessary object creation
- Implement lazy loading where appropriate

## Documentation

### Code Documentation

Add JSDoc comments to all public APIs:

```javascript
/**
 * Scans a project for security vulnerabilities
 * @param {string} projectPath - Path to the project
 * @param {Object} options - Scan options
 * @param {string[]} [options.rules] - Rules to enable
 * @param {string} [options.output] - Output format
 * @returns {Promise<Object>} Scan results
 */
async function scanProject(projectPath, options = {}) {
  // Implementation
}
```

### User Documentation

Update documentation in the `docs/` directory:

- `docs/en/` - English documentation
- `docs/zh/` - Chinese documentation

### API Documentation

Keep API documentation up to date in `docs/en/api/index.md` and `docs/zh/api/index.md`.

## Contributing

### Before Contributing

1. Read the [Contributing Guide](./CONTRIBUTING.md)
2. Check existing issues and pull requests
3. Discuss your changes in an issue first

### Pull Request Process

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Ensure all tests pass
6. Update documentation
7. Submit a pull request

### Code Review Guidelines

- Keep pull requests focused and small
- Address all review comments
- Update tests and documentation
- Ensure CI/CD passes

### Release Process

Releases are managed by maintainers:

1. Update version in `package.json`
2. Update `CHANGELOG.md`
3. Create a git tag
4. Publish to npm
5. Create GitHub release

## Additional Resources

- [Contributing Guide](./CONTRIBUTING.md)
- [API Reference](./api/index.md)
- [Configuration Guide](./configuration.md)
- [Features Guide](./features.md)
- [FAQ](./FAQ.md)

---

For questions or support, please open an issue on GitHub.
