# Vue Security Scanner for VSCode

A VSCode extension that integrates the Vue Security Scanner tool directly into the editor, allowing developers to identify potential security vulnerabilities in Vue.js projects without leaving the IDE.

## Features

- **Project-wide security scanning**: Scan entire Vue.js projects for security vulnerabilities
- **File-level scanning**: Scan individual Vue files for security issues
- **Dependency scanning**: Analyze project dependencies for known vulnerabilities
- **Real-time diagnostics**: View security warnings directly in the editor
- **Integrated report panel**: Visualize security scan results in a dedicated panel
- **Advanced reporting**: Generate comprehensive security reports with trends and compliance analysis
- **Context menus**: Right-click options for quick scanning
- **Configurable settings**: Customize scanning behavior to fit your workflow

## Commands

- `Vue Security: Scan Current Project`: Scans the entire workspace for security issues
- `Vue Security: Scan Current File`: Scans the currently open Vue file
- `Vue Security: Scan Dependencies`: Scans project dependencies for vulnerabilities
- `Vue Security: Show Security Report`: Opens the security report panel
- `Vue Security: Show Advanced Report`: Opens the advanced security report with trends and compliance
- `Vue Security: Configure Settings`: Opens the extension settings

## Configuration

The extension provides several configuration options:

- `vueSecurityScanner.enableOnOpen`: Enable security scanning when opening Vue files
- `vueSecurityScanner.scanOnSave`: Scan file when saving Vue files
- `vueSecurityScanner.maxFileSize`: Maximum file size to scan in MB
- `vueSecurityScanner.ignoredFolders`: Folders to ignore during scanning
- `vueSecurityScanner.reportOutputPath`: Path to save security report
- `vueSecurityScanner.enableSemanticAnalysis`: Enable AST-based semantic analysis for improved accuracy
- `vueSecurityScanner.enableDependencyScanning`: Enable dependency vulnerability scanning with npm audit
- `vueSecurityScanner.enableAdvancedReport`: Enable advanced reporting with trends and compliance analysis
- `vueSecurityScanner.reportHistoryPath`: Path to store report history for trend analysis
- `vueSecurityScanner.complianceStandards`: Compliance standards to check in reports

## How to Use

1. Open a Vue.js project in VSCode
2. Right-click on a Vue file or the project root and select "Vue Security: Scan Current Project" or "Vue Security: Scan Current File"
3. View security warnings directly in the editor
4. Open the "Vue Security" panel in the activity bar to see the full report
5. Use "Vue Security: Scan Dependencies" to check for vulnerable dependencies
6. Use "Vue Security: Show Advanced Report" for comprehensive security analysis

## Security Issues Detected

The scanner detects various security vulnerabilities including:

- Cross-Site Scripting (XSS) vulnerabilities
- Insecure dependencies
- Hardcoded secrets and credentials
- Misconfigurations
- Potential code injection issues
- Vue-specific security concerns
- Vue 3.7+ features security issues
- TypeScript integration security issues
- i18n deep security issues
- Build tool security issues
- Advanced attack vectors
- Ecosystem library security issues
- State management plugin security issues
- Form validation security issues

## Requirements

- VSCode version 1.74 or higher
- A Vue.js project with `.vue` files

## Contributing

Please see the main Vue Security Scanner repository for contribution guidelines.