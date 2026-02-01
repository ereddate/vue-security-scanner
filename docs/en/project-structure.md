# Project Structure Guide

This guide explains the directory structure and organization of Vue Security Scanner project.

## Overview

Understanding the project structure is essential for:
- Contributing to the codebase
- Extending the scanner with custom rules
- Integrating with other tools and frameworks
- Debugging and troubleshooting issues

## Root Directory Structure

```
vue-security-scanner/
├── .github/                # GitHub workflows and configuration
├── .vue-security-data/     # Scanner data storage
├── bin/                    # CLI executable files
├── config/                 # Configuration files
├── dashboard/              # Security dashboard
├── docker/                 # Docker configuration
├── docs/                   # Documentation
│   ├── en/                 # English documentation
│   └── zh/                 # Chinese documentation
├── examples/               # Example files and configurations
├── jenkins-plugin-vue-security/  # Jenkins plugin
├── mcp/                    # MCP integration
├── nuxt-module-vue-security/     # Nuxt module
├── src/                    # Source code
├── taro-plugin-vue-security/     # Taro plugin
├── tests/                  # Test files
├── .gitignore              # Git ignore rules
├── .gitlab-ci.yml          # GitLab CI configuration
├── .npmignore              # npm ignore rules
├── Jenkinsfile             # Jenkins pipeline configuration
├── LICENSE                 # License file
├── README.md               # Main README
├── README_CN.md            # Chinese README
├── package.json            # npm package configuration
└── security-report.json    # Example security report
```

## Key Directories

### bin/

Contains CLI executable files:

- `vue-security-scanner.js`: Main scanner executable
- `vue-security-distributed.js`: Distributed scanning executable

### config/

Configuration files for different environments:

- `enterprise-config.json`: Enterprise edition configuration

### dashboard/

Security dashboard implementation:

- `public/`: Frontend files for the dashboard
- `server.js`: Backend server for the dashboard

### docker/

Docker-related files:

- `Dockerfile`: Docker image definition
- `README.md`: Docker usage documentation
- `docker-compose.yml`: Docker Compose configuration

### docs/

Comprehensive documentation:

- `en/`: English documentation
- `zh/`: Chinese documentation
- Subdirectories for specific topics (api, compliance, performance, rules, threat-intelligence)

### examples/

Example files and configurations:

- `.vue-security-ignore.example`: Example ignore file

### jenkins-plugin-vue-security/

Jenkins plugin for Vue Security Scanner:

- `src/`: Plugin source code
- `README.md`: Plugin documentation
- `pom.xml`: Maven configuration

### mcp/

MCP (Module Control Plane) integration:

- Various MCP-related files and examples

### nuxt-module-vue-security/

Nuxt.js module for Vue Security Scanner:

- `index.js`: Module implementation
- `README.md`: Module documentation
- `package.json`: Module configuration

### src/

Main source code directory:

- `analysis/`: Code analysis utilities
- `checks/`: Security check implementations
- `config/`: Default configuration
- `core/`: Core scanner functionality
- `distributed/`: Distributed scanning implementation
- `integration/`: Third-party integrations
- `reporting/`: Report generation utilities
- `rules/`: Security rules implementation
- `threat-intelligence/`: Threat intelligence integration
- `utils/`: Utility functions
- `scanner.js`: Main scanner module

### taro-plugin-vue-security/

Taro plugin for Vue Security Scanner:

- `index.js`: Plugin implementation
- `README.md`: Plugin documentation
- `package.json`: Plugin configuration

### tests/

Test files and fixtures:

- Various test files for different vulnerability types
- Test configurations and examples

## Source Code Structure

### src/analysis/

Code analysis utilities:

- `ast-analyzer.js`: Abstract Syntax Tree analyzer
- `dast-scanner.js`: Dynamic Application Security Testing
- `dependency-scanner.js`: Dependency vulnerability scanner

### src/checks/

Security check implementations:

- `security-checks.js`: Core security checks

### src/config/

Default configuration:

- `default-config.json`: Default scanner configuration

### src/core/

Core scanner functionality:

- `vulnerability-detector.js`: Vulnerability detection engine

### src/distributed/

Distributed scanning implementation:

- `distributed-scanner.js`: Distributed scanner coordinator
- `result-aggregator.js`: Results aggregation from multiple workers
- `task-distributor.js`: Task distribution to workers

### src/integration/

Third-party integrations:

- `trae-cn-integration.js`: Trae CN integration

### src/reporting/

Report generation utilities:

- `advanced-report-generator.js`: Advanced report generator
- `china-compliance-report-generator.js`: China compliance report generator
- `enhanced-compliance-report-generator.js`: Enhanced compliance report generator

### src/rules/

Security rules implementation:

- `modules/`: Rule modules organized by security category
- `custom-rules.js`: Custom rules support
- `enhanced-rule-engine.js`: Enhanced rule engine
- `parallel-rule-engine.js`: Parallel rule execution engine
- `regex-optimizer.js`: Regular expression optimizer
- `rule-engine.js`: Core rule engine
- `rule-optimizer.js`: Rule optimization utilities
- `security-rules.js`: Main security rules collection

### src/threat-intelligence/

Threat intelligence integration:

- `threat-intelligence-integration.js`: Threat intelligence integration module

### src/utils/

Utility functions:

- `error-handler.js`: Error handling utilities
- `helpers.js`: General helper functions
- `ignore-manager.js`: Ignore rules management
- `performance-optimizer.js`: Performance optimization utilities
- `user-experience-optimizer.js`: User experience optimization

## Plugin Structure

### Jenkins Plugin

```
jenkins-plugin-vue-security/
├── src/                    # Source code
├── README.md               # Documentation
└── pom.xml                 # Maven configuration
```

### Nuxt Module

```
nuxt-module-vue-security/
├── index.js                # Module implementation
├── README.md               # Documentation
└── package.json            # npm configuration
```

### Taro Plugin

```
taro-plugin-vue-security/
├── index.js                # Plugin implementation
├── README.md               # Documentation
└── package.json            # npm configuration
```

## Docker Structure

```
docker/
├── Dockerfile              # Docker image definition
├── README.md               # Documentation
└── docker-compose.yml      # Docker Compose configuration
```

## Dashboard Structure

```
dashboard/
├── public/                 # Frontend files
│   └── index.html          # Dashboard HTML
└── server.js               # Backend server
```

## Documentation Structure

### English Documentation

```
docs/en/
├── api/                    # API documentation
├── compliance/             # Compliance documentation
├── performance/            # Performance documentation
├── rules/                  # Rules documentation
├── threat-intelligence/    # Threat intelligence documentation
├── CONTRIBUTING.md         # Contribution guidelines
├── FAQ.md                  # Frequently asked questions
├── changelog.md            # Changelog
├── ci-cd-integration.md    # CI/CD integration
├── configuration.md        # Configuration guide
├── dashboard.md            # Dashboard guide
├── development.md          # Development guide
├── distributed-scanning.md # Distributed scanning guide
├── ecosystem.md            # Ecosystem integration
├── features.md             # Features documentation
├── ignore-guide.md         # Ignore rules guide
├── installation.md         # Installation guide
├── memory-optimization.md  # Memory optimization
├── quickstart.md           # Quick start guide
├── release-notes.md        # Release notes
├── security-coverage.md    # Security coverage
├── testing.md              # Testing guide
├── usage.md                # Usage guide
└── vue-features.md         # Vue features support
```

### Chinese Documentation

```
docs/zh/
├── api/                    # API documentation
├── compliance/             # Compliance documentation
├── performance/            # Performance documentation
├── rules/                  # Rules documentation
├── threat-intelligence/    # Threat intelligence documentation
├── CONTRIBUTING.md         # Contribution guidelines
├── FAQ.md                  # Frequently asked questions
├── configuration.md        # Configuration guide
├── development.md          # Development guide
├── ecosystem.md            # Ecosystem integration
├── features.md             # Features documentation
├── installation.md         # Installation guide
├── quickstart.md           # Quick start guide
├── release-notes.md        # Release notes
├── security-coverage.md    # Security coverage
├── testing.md              # Testing guide
├── usage.md                # Usage guide
└── vue-features.md         # Vue features support
```

## Configuration Files

### package.json

The main package.json file contains:
- Project metadata
- Dependency management
- Scripts for development and testing
- CLI configuration

### Configuration Files

- `config/enterprise-config.json`: Enterprise-specific configuration
- `.vue-security-data/index.json`: Scanner data and state

## Test Structure

The tests directory contains:
- Various test files for different vulnerability types
- Test fixtures and examples
- Compliance test data

## Best Practices for Project Structure

### For Contributors

1. **Follow existing patterns**: Maintain consistency with the existing codebase
2. **Organize by functionality**: Group related code together
3. **Use clear naming conventions**: Choose descriptive names for files and directories
4. **Document new additions**: Update documentation for any new features
5. **Test thoroughly**: Add tests for new functionality

### For Extenders

1. **Use plugin architecture**: Create plugins rather than modifying core code
2. **Follow API contracts**: Adhere to the established plugin API
3. **Document extensions**: Provide clear documentation for your extensions
4. **Test compatibility**: Ensure compatibility with different scanner versions
5. **Follow security best practices**: Maintain security in your extensions

## Troubleshooting

### Finding Files

Use the following commands to find files:

```bash
# Find files by name
find . -name "*.js" | grep "rule"

# Find files by content
grep -r "vulnerability" src/ --include="*.js"

# List directory structure
tree -L 2
```

### Understanding Module Relationships

To understand how modules interact:

1. **Start with the main entry point**: `bin/vue-security-scanner.js`
2. **Follow the import chain**: Trace imports to understand dependencies
3. **Examine test files**: Tests often show how modules are used
4. **Read documentation**: Documentation explains module purposes

## Support

For questions about the project structure:

1. **Check the documentation**: This guide and other documentation files
2. **Open an issue**: Ask questions in the GitHub repository
3. **Contact maintainers**: For enterprise support
