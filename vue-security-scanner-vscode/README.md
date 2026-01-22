# Vue Security Scanner for VSCode

A VSCode extension that integrates the Vue Security Scanner tool directly into the editor, allowing developers to identify potential security vulnerabilities in Vue.js projects without leaving the IDE.

## Features

- **Project-wide security scanning**: Scan entire Vue.js projects for security vulnerabilities
- **File-level scanning**: Scan individual Vue files for security issues
- **Real-time diagnostics**: View security warnings directly in the editor
- **Integrated report panel**: Visualize security scan results in a dedicated panel
- **Context menus**: Right-click options for quick scanning
- **Configurable settings**: Customize scanning behavior to fit your workflow

## Commands

- `Vue Security: Scan Current Project`: Scans the entire workspace for security issues
- `Vue Security: Scan Current File`: Scans the currently open Vue file
- `Vue Security: Show Security Report`: Opens the security report panel
- `Vue Security: Configure Settings`: Opens the extension settings

## Configuration

The extension provides several configuration options:

- `vueSecurityScanner.enableOnOpen`: Enable security scanning when opening Vue files
- `vueSecurityScanner.scanOnSave`: Scan file when saving Vue files
- `vueSecurityScanner.maxFileSize`: Maximum file size to scan in MB
- `vueSecurityScanner.ignoredFolders`: Folders to ignore during scanning
- `vueSecurityScanner.reportOutputPath`: Path to save security report

## How to Use

1. Open a Vue.js project in VSCode
2. Right-click on a Vue file or the project root and select "Vue Security: Scan Current Project" or "Vue Security: Scan Current File"
3. View security warnings directly in the editor
4. Open the "Vue Security" panel in the activity bar to see the full report

## Security Issues Detected

The scanner detects various security vulnerabilities including:

- Cross-Site Scripting (XSS) vulnerabilities
- Insecure dependencies
- Hardcoded secrets and credentials
- Misconfigurations
- Potential code injection issues
- Other Vue-specific security concerns

## Requirements

- VSCode version 1.74 or higher
- A Vue.js project with `.vue` files

## Contributing

Please see the main Vue Security Scanner repository for contribution guidelines.