# Code Style Guide

This document outlines the code style guidelines for the Vue Security Scanner project. Following these guidelines helps maintain consistency and readability across the codebase.

## Table of Contents

- [General Principles](#general-principles)
- [File Structure](#file-structure)
- [Naming Conventions](#naming-conventions)
- [Code Formatting](#code-formatting)
- [Comments](#comments)
- [Error Handling](#error-handling)
- [Performance Considerations](#performance-considerations)
- [Security Best Practices](#security-best-practices)

## General Principles

1. **Readability over cleverness**: Write code that is easy to understand and maintain.
2. **Consistency**: Follow the established patterns and conventions in the codebase.
3. **Modularity**: Break down complex functionality into smaller, reusable modules.
4. **Testability**: Write code that is easy to test.
5. **Performance**: Consider performance implications, especially for scanning large codebases.

## File Structure

### Directory Organization

```
vue-security-scanner/
├── bin/              # Command-line tools
├── src/              # Source code
│   ├── analysis/     # Code analysis modules
│   ├── config/       # Configuration files
│   ├── core/         # Core scanning functionality
│   ├── rules/        # Security rules
│   ├── reporting/    # Report generation
│   └── utils/        # Utility functions
├── docs/             # Documentation
├── examples/         # Example files
└── tests/            # Test files
```

### File Naming

- **JavaScript files**: Use kebab-case (e.g., `file-type-analyzer.js`)
- **Class files**: Use PascalCase for the class name, but kebab-case for the file name
- **Test files**: Use `.test.js` extension (e.g., `scanner.test.js`)
- **Configuration files**: Use `.json` extension

## Naming Conventions

### Variables and Functions

- **Variables**: Use camelCase (e.g., `filePath`, `memoryLimit`)
- **Constants**: Use UPPER_SNAKE_CASE (e.g., `MAX_MEMORY_LIMIT`)
- **Functions**: Use camelCase (e.g., `scanFiles`, `analyzeCode`)
- **Methods**: Use camelCase (e.g., `processFile`, `generateReport`)
- **Classes**: Use PascalCase (e.g., `SecurityScanner`, `ASTAnalyzer`)

### Parameters

- Use descriptive parameter names
- Keep parameter lists short (prefer 3 or fewer parameters)
- Use object destructuring for functions with multiple parameters

### Private Members

- Use underscore prefix for private properties and methods (e.g., `_privateMethod`)

## Code Formatting

### Indentation

- Use 2 spaces for indentation
- Do not use tabs

### Line Length

- Keep lines under 80 characters when possible
- Break long lines at logical points

### Braces

- Use K&R style braces (opening brace on the same line)
- Always use braces for control structures, even for single-line blocks

```javascript
// Good
if (condition) {
  doSomething();
}

// Bad
if (condition)
  doSomething();
```

### Semicolons

- Always use semicolons to terminate statements

### Quotations

- Use single quotes for strings
- Use template literals for multi-line strings or when interpolating variables

```javascript
// Good
const name = 'Vue Security Scanner';
const message = `Scanning ${filePath}...`;

// Bad
const name = "Vue Security Scanner";
```

### Whitespace

- Use spaces around operators
- Use spaces after commas
- Use spaces inside parentheses and brackets
- Use empty lines to separate logical blocks

```javascript
// Good
const result = a + b;
const array = [1, 2, 3];
const object = { key: 'value' };

// Bad
const result=a+b;
const array=[1,2,3];
const object={key:'value'};
```

## Comments

### Inline Comments

- Use inline comments sparingly
- Explain why something is done, not what is done
- Keep inline comments short

### Block Comments

- Use block comments for complex explanations
- Use JSDoc for function documentation

### JSDoc

```javascript
/**
 * Scans a Vue project for security vulnerabilities
 * @param {string} projectPath - The path to the Vue project
 * @returns {Object} An object containing vulnerabilities and scan stats
 */
async scanVueProject(projectPath) {
  // Implementation
}
```

## Error Handling

### Try-Catch

- Use try-catch for error-prone operations
- Be specific about the errors you catch
- Log errors appropriately

### Error Objects

- Create meaningful error messages
- Include context information in error messages
- Use consistent error handling patterns

```javascript
try {
  // Risky operation
} catch (error) {
  console.error(`Error scanning file ${filePath}: ${error.message}`);
  // Handle error gracefully
}
```

## Performance Considerations

### Memory Management

- Be mindful of memory usage when scanning large projects
- Use streaming and batching for large files
- Avoid unnecessary object creation
- Clean up resources when done

### Caching

- Use caching strategically to improve performance
- Set appropriate cache expiration times
- Limit cache size to prevent memory issues

### Parallel Processing

- Use parallel processing for independent tasks
- Be mindful of concurrency limits
- Use proper synchronization for shared resources

## Security Best Practices

### Input Validation

- Validate all user inputs
- Sanitize file paths to prevent path traversal
- Use safe methods for file operations

### Dependency Management

- Keep dependencies up to date
- Regularly check for vulnerable dependencies
- Use minimal dependencies

### Code Quality

- Avoid using deprecated APIs
- Use secure coding practices
- Regularly run security scans on the codebase itself

## Tools

- **Linter**: Use ESLint to enforce code style
- **Formatter**: Use Prettier for consistent formatting
- **Type Checker**: Use TypeScript for type safety where appropriate

## Conclusion

Following these code style guidelines helps maintain a clean, consistent, and maintainable codebase. Remember that these guidelines are not absolute rules, but rather recommendations to help improve code quality. When in doubt, follow the existing patterns in the codebase.