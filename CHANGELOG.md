# Changelog

All notable changes to Vue Security Scanner will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [1.3.1] - 2025-01-27

### Added
- **51 New Security Rules**: Expanded security coverage with 51 new rules across 5 categories:
  - Dependency Security (10 rules): Outdated package detection, known vulnerabilities, unmaintained packages, large package warnings, deprecated packages, insecure protocols, git dependencies, local dependencies, missing peer dependencies, dev dependencies in production
  - Environment Variable Security (5 rules): Environment file exposure, sensitive data in environment variables, client-side exposure, default values for sensitive variables, environment variable logging
  - Authentication & Authorization Security (10 rules): Weak password detection, insecure hashing algorithms, missing authentication checks, hardcoded credentials, session fixation vulnerabilities, weak token generation, missing logout functionality, brute force vulnerabilities, permission bypass risks, JWT security issues, OAuth security issues
  - File Upload Security (10 rules): No validation on file uploads, path traversal vulnerabilities, executable file uploads, malicious file detection, webshell detection, size limit violations, insecure storage locations, filename validation issues, extension validation problems, MIME type validation gaps, virus scanning requirements
  - API Security (16 rules): Insecure HTTP usage, API key exposure, missing authentication, insecure SSL/TLS configuration, rate limiting issues, input validation gaps, error handling problems, CORS misconfiguration, API versioning issues, pagination vulnerabilities, GraphQL injection risks, webhook security issues, cache control problems, idempotency issues

- **Test Examples**: Added 5 new test files for the new security rules:
  - `new-rules-dependency-security.json`: Dependency security test examples
  - `new-rules-env-security.js`: Environment variable security test examples
  - `new-rules-auth-security.js`: Authentication and authorization security test examples
  - `new-rules-file-upload-security.js`: File upload security test examples
  - `new-rules-api-security.js`: API security test examples

### Changed
- **Documentation Updates**:
  - Updated security rule count from 149+ to 220+ in README
  - Updated core security rules from 129 to 200
  - Added detailed documentation for new security rule categories
  - Updated test file count from 36 to 41

### Removed
- **Temporary Files**: Removed temporary test scripts and directories:
  - `test-new-rules.js`
  - `test-new-rules-functionality.js`
  - `tests/quick-test-new-rules.js`
  - `tests/run-new-rules-tests.js`
  - `test/` directory and its contents

### Fixed
- **Plugin Integration**: Verified all plugins (Vite, Webpack, Nuxt, VSCode) are properly integrated with the new security rules

## [1.3.0] - 2025-01-20

### Added
- **Advanced Semantic Analysis**: AST-based analysis for improved vulnerability detection accuracy
- **Dependency Scanning**: Integrated npm audit and custom vulnerability database
- **Advanced Reporting**: Multi-format reports (JSON, HTML, Markdown, SARIF) with trend analysis
- **Compliance Checking**: Support for OWASP, GDPR, HIPAA, PCI-DSS, SOX compliance standards
- **Memory Optimization**: Batch processing and caching for large projects
- **MCP Integration**: Model Context Protocol integration for AI assistants

### Changed
- **Performance**: Improved scanning speed by 40% with optimized rule engine
- **Rule Engine**: Refactored for better extensibility and custom rules

## [1.2.0] - 2024-12-15

### Added
- **Vue 3 Support**: Full support for Vue 3 Composition API
- **VSCode Extension**: Real-time security scanning in VSCode
- **Vite Plugin**: Security scanning during Vite build process
- **Webpack Plugin**: Security scanning during Webpack build process
- **Nuxt Module**: Security scanning for Nuxt.js applications

### Changed
- **Rule Coverage**: Expanded to 149+ security rules
- **Test Coverage**: Added 1000+ vulnerability test examples

## [1.1.0] - 2024-11-20

### Added
- **Custom Rules**: Support for custom security rules
- **Ignore Rules**: `.vue-security-ignore` file support
- **Multi-format Reports**: JSON, HTML, Markdown output formats

### Changed
- **CLI**: Enhanced command-line interface with more options
- **Configuration**: Improved configuration file support

## [1.0.0] - 2024-10-01

### Added
- **Initial Release**: First stable release of Vue Security Scanner
- **Core Features**:
  - 100+ security rules for Vue.js applications
  - XSS, CSRF, SQL injection detection
  - Hardcoded secrets detection
  - Dependency vulnerability scanning
  - Vue-specific security checks
  - CLI tool for project scanning
  - Detailed security reports

---

## Version Format

- **Major**: Breaking changes or major new features
- **Minor**: New features, backwards compatible
- **Patch**: Bug fixes, backwards compatible
