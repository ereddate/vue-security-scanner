# Vue Security Scanner Contribution Guide

## 1. Contribution Overview

Thank you for considering contributing to the Vue Security Scanner project! We welcome contributions from the community in various forms, including but not limited to:

- **Code Contributions**: Fix bugs, add new features, improve performance
- **Documentation Contributions**: Improve documentation, translate content, add examples
- **Testing Contributions**: Write test cases, improve test coverage
- **Issue Contributions**: Report bugs, suggest new features
- **Community Contributions**: Answer questions, share usage experience, promote the project

## 2. Contribution Process

### 2.1 Environment Setup

1. **Fork the Repository**
   - Fork the `vue-security-scanner` repository on GitHub to your own account

2. **Clone the Repository**
   ```bash
   git clone https://github.com/your-username/vue-security-scanner.git
   cd vue-security-scanner
   ```

3. **Install Dependencies**
   ```bash
   npm install
   ```

4. **Create a Branch**
   ```bash
   git checkout -b feature/your-feature-name
   # or
   git checkout -b fix/your-bug-fix
   ```

### 2.2 Development and Testing

1. **Write Code**
   - Follow the project's code style guidelines
   - Ensure the code functionality is complete
   - Add necessary comments

2. **Run Tests**
   ```bash
   # Run unit tests
   npm test
   
   # Run integration tests
   npm run test:integration
   
   # Run end-to-end tests
   npm run test:e2e
   ```

3. **Code Quality Check**
   ```bash
   # Run ESLint
   npm run lint
   
   # Run type check
   npm run typecheck
   ```

### 2.3 Commit and Pull Request

1. **Commit Code**
   - Ensure you follow the commit guidelines
   - Write clear and concise commit messages
   ```bash
   git add .
   git commit -m "feat: add new feature"
   ```

2. **Push Branch**
   ```bash
   git push origin feature/your-feature-name
   ```

3. **Create Pull Request**
   - Create a new pull request on GitHub
   - Fill in the detailed description
   - Reference related issues
   - Wait for code review

### 2.4 Code Review

1. **Respond to Review Comments**
   - Respond to code review comments in a timely manner
   - Make adjustments to areas that need modification
   - Maintain patience and professionalism

2. **Update Code**
   - Update code based on review comments
   - Re-run tests to ensure they pass
   - Submit updates

### 2.5 Merge and Release

1. **Code Merge**
   - After code review passes, maintainers will merge your code
   - After merging, your contribution will become part of the project

2. **Release Process**
   - Maintainers will decide whether to release a new version based on the contribution
   - Comprehensive testing will be conducted before release
   - A release record will be created on GitHub after release

## 3. Code Style Guidelines

### 3.1 JavaScript/TypeScript Guidelines

- **Indentation**: Use 2 spaces for indentation
- **Semicolons**: Use semicolons at the end of statements
- **Quotes**: Use single quotes for strings
- **Variable Declaration**: Use `const` and `let`, avoid using `var`
- **Arrow Functions**: Prefer arrow functions
- **Destructuring Assignment**: Prefer destructuring assignment
- **Template Strings**: Use template strings for complex strings
- **Async Code**: Prefer `async/await`

### 3.2 Naming Conventions

- **Variables**: Use camelCase
- **Functions**: Use camelCase
- **Classes**: Use PascalCase
- **Constants**: Use UPPERCASE_WITH_UNDERSCORES
- **Files**: Use kebab-case.js
- **Directories**: Use kebab-case

### 3.3 Comment Guidelines

- **File Headers**: Add file description comments
- **Function Comments**: Add function parameter and return value comments
- **Complex Logic**: Add detailed logic comments
- **TODO Comments**: Use `// TODO:` to mark tasks to be completed
- **FIXME Comments**: Use `// FIXME:` to mark issues that need fixing

### 3.4 Code Structure

- **Modularity**: Follow modular design principles
- **Single Responsibility**: Each function/class should be responsible for one function
- **Code Reuse**: Extract common code into reusable modules
- **Error Handling**: Comprehensive error handling mechanism
- **Logging**: Appropriate logging

## 4. Development Environment Setup

### 4.1 Basic Environment

- **Node.js**: Version 14.0.0 or higher
- **npm**: Version 6.0.0 or higher
- **Git**: Version 2.0.0 or higher

### 4.2 Development Tools

- **Editor**: VS Code is recommended
- **Extensions**:
  - ESLint
  - Prettier
  - TypeScript
  - Vue Language Features

### 4.3 Configuration Files

- **ESLint Configuration**: `.eslintrc.js`
- **Prettier Configuration**: `.prettierrc.js`
- **TypeScript Configuration**: `tsconfig.json`
- **Babel Configuration**: `babel.config.js`
- **Jest Configuration**: `jest.config.js`

### 4.4 Development Commands

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development mode |
| `npm run build` | Build the project |
| `npm run lint` | Run code quality check |
| `npm run test` | Run unit tests |
| `npm run test:integration` | Run integration tests |
| `npm run test:e2e` | Run end-to-end tests |
| `npm run typecheck` | Run type check |
| `npm run docs` | Generate documentation |
| `npm run release` | Release a new version |

## 5. Testing Guide

### 5.1 Test Types

- **Unit Tests**: Test individual functions or components
- **Integration Tests**: Test interactions between multiple modules
- **End-to-End Tests**: Test complete user flows
- **Performance Tests**: Test performance metrics
- **Security Tests**: Test security features

### 5.2 Test Frameworks

- **Jest**: For unit tests and integration tests
- **Playwright**: For end-to-end tests
- **Lighthouse**: For performance tests

### 5.3 Test File Naming

- **Unit Tests**: `*.test.js` or `*.spec.js`
- **Integration Tests**: `*.integration.test.js`
- **End-to-End Tests**: `*.e2e.test.js`

### 5.4 Test Writing Guidelines

- **Test Descriptions**: Clearly describe test content
- **Test Coverage**: Cover normal cases and edge cases
- **Test Isolation**: Each test should be independent
- **Test Speed**: Tests should run quickly
- **Test Reliability**: Tests should be stable and reliable

### 5.5 Test Execution

```bash
# Run all tests
npm test

# Run specific test file
npm test -- test/unit/example.test.js

# Run tests with coverage report
npm test -- --coverage

# Run tests with file watching
npm test -- --watch
```

## 6. Commit Guidelines

### 6.1 Commit Message Format

```
<type>(<scope>): <description>

<body>

<footer>
```

### 6.2 Type Descriptions

| Type | Description |
|------|-------------|
| `feat` | New feature |
| `fix` | Bug fix |
| `docs` | Documentation modification |
| `style` | Code style modification |
| `refactor` | Code refactoring |
| `perf` | Performance optimization |
| `test` | Test modification |
| `build` | Build tool modification |
| `ci` | CI configuration modification |
| `chore` | Other modifications |

### 6.3 Scope Descriptions

Scope should be a short identifier indicating the scope of the modification, for example:

- `core`: Core functionality
- `cli`: Command line tool
- `rules`: Rule modules
- `reporter`: Report modules
- `threat-intel`: Threat intelligence
- `performance`: Performance optimization
- `docs`: Documentation

### 6.4 Description Guidelines

- Description should be concise (no more than 50 characters)
- Description should use imperative mood
- Description should start with a lowercase letter
- Description should not end with a period

### 6.5 Body Guidelines

- Body should detail the content of the modification
- Body should explain the reason for the modification
- Body should explain the impact of the modification
- Body should not exceed 72 characters per line

### 6.6 Footer Guidelines

- **Close Issue**: `Closes #123`
- **Related Issue**: `Relates to #123`
- **Breaking Change**: `BREAKING CHANGE: ...`
- **Contributor**: `Co-authored-by: Name <email>`

### 6.7 Commit Examples

```
feat(rules): add new XSS detection rule

Add a new rule to detect XSS vulnerabilities in Vue templates.
The rule checks for unescaped user input in template expressions.

Closes #123
```

```
fix(core): resolve memory leak in scanner

Fix a memory leak that occurred when scanning large projects.
The issue was caused by not properly cleaning up regex objects.

Relates to #456
```

## 7. Pull Request Guidelines

### 7.1 Pull Request Title

- Title should be concise and clear
- Title should describe the content of the modification
- Title should use imperative mood
- Title should not exceed 50 characters

### 7.2 Pull Request Description

- **Overview**: Briefly describe the content of the modification
- **Details**: Detail the reason and impact of the modification
- **Testing**: Explain the tests that have been performed
- **Screenshots**: Provide screenshots if there are UI modifications
- **Related Issues**: Reference related issues
- **Breaking Changes**: Indicate if there are breaking changes
- **Migration Guide**: Provide a migration guide if there are breaking changes

### 7.3 Pull Request Checklist

Before creating a pull request, ensure:

- [ ] Code has passed all tests
- [ ] Code has passed code quality checks
- [ ] Code has followed project guidelines
- [ ] Commit messages have followed commit guidelines
- [ ] Necessary documentation has been added
- [ ] Necessary tests have been added

### 7.4 Pull Request Example

**Title**:
```
feat: add support for custom rules
```

**Description**:
```
## Overview
Add support for custom rules in Vue Security Scanner.

## Details
- Add `customRules` configuration option
- Add `RuleLoader` class to load custom rules
- Add documentation for custom rules
- Add tests for custom rule functionality

## Testing
- [x] Unit tests pass
- [x] Integration tests pass
- [x] E2E tests pass
- [x] Code quality checks pass

## Related Issues
Closes #789

## Breaking Changes
No breaking changes.
```

## 8. Code Review Guide

### 8.1 Review Focus

- **Code Quality**: Whether the code meets standards
- **Functionality Completeness**: Whether the functionality is fully implemented
- **Security**: Whether there are security risks
- **Performance**: Whether there are performance issues
- **Maintainability**: Whether the code is easy to maintain
- **Test Coverage**: Whether tests are adequately covered

### 8.2 Review Comment Guidelines

- **Positive Feedback**: Acknowledge good code
- **Constructive Criticism**: Provide specific improvement suggestions
- **Question Markers**: Use `QUESTION:` to mark questions
- **Suggestion Markers**: Use `SUGGESTION:` to mark suggestions
- **Warning Markers**: Use `WARNING:` to mark potential issues
- **Error Markers**: Use `ERROR:` to mark errors

### 8.3 Review Process

1. **Initial Review**: Review code structure and main logic
2. **Detailed Review**: Review code details line by line
3. **Test Verification**: Run tests to verify functionality
4. **Performance Evaluation**: Evaluate code performance
5. **Security Check**: Check for potential security issues
6. **Suggestions**: Provide improvement suggestions
7. **Final Decision**: Decide whether to pass the review

### 8.4 Review Feedback

- **Timely Feedback**: Provide review feedback as soon as possible
- **Specific Feedback**: Provide specific improvement suggestions
- **Respectful Feedback**: Respect the contributor's work
- **Open Discussion**: Encourage open discussion
- **Clear Decision**: Clearly express the review result

## 9. Release Process

### 9.1 Versioning

Use Semantic Versioning:

- **Major Version**: Incompatible API changes
- **Minor Version**: Backward-compatible feature additions
- **Patch Version**: Backward-compatible bug fixes

### 9.2 Release Preparation

1. **Update Version Number**:
   ```bash
   npm version patch # or minor, major
   ```

2. **Update CHANGELOG**:
   - Record all important changes
   - Organize by version number and date
   - Categorize different types of changes

3. **Run Tests**:
   ```bash
   npm test
   ```

4. **Build Project**:
   ```bash
   npm run build
   ```

### 9.3 Release Steps

1. **Commit Version Update**:
   ```bash
   git push
   git push --tags
   ```

2. **Publish to npm**:
   ```bash
   npm publish
   ```

3. **Create GitHub Release**:
   - Create a new release on GitHub
   - Fill in version number and release notes
   - Upload build artifacts
   - Mark as pre-release or official release

### 9.4 Release Checklist

- [ ] Version number updated
- [ ] CHANGELOG updated
- [ ] All tests pass
- [ ] Code quality checks pass
- [ ] Build successful
- [ ] Documentation updated
- [ ] Examples updated
- [ ] Release notes prepared

## 10. Code of Conduct

### 10.1 Core Values

- **Respect**: Respect every contributor
- **Inclusivity**: Be inclusive of different perspectives and backgrounds
- **Collaboration**: Actively collaborate to solve problems
- **Professionalism**: Maintain professional attitude and behavior
- **Integrity**: Be honest and transparent in communication

### 10.2 Behavioral Guidelines

- **Friendly Communication**: Use friendly and respectful language
- **Accept Criticism**: Gracefully accept constructive criticism
- **Focus on Issues**: Discuss issues themselves, not individuals
- **Help Others**: Be willing to help other contributors
- **Share Knowledge**: Share experiences and knowledge

### 10.3 Unacceptable Behavior

- **Harassment**: Any form of harassment
- **Discrimination**: Discrimination based on race, gender, religion, etc.
- **Abuse**: Using abusive or offensive language
- **Threats**: Any form of threatening behavior
- **Privacy Violation**: Publicly disclosing others' private information
- **Spam**: Posting content unrelated to the project
- **Malicious Behavior**: Deliberately disrupting the project or interfering with others' work

### 10.4 Reporting Mechanism

If you encounter any behavior that violates the code of conduct, please report it through:

- **Email**: contact@vue-security-scanner.com
- **GitHub Issues**: Create a confidential issue
- **Discord**: Contact project maintainers

All reports will be handled confidentially and investigated by the project maintenance team.

## 11. Contributor Recognition

### 11.1 Contributor Acknowledgment

- **Contributor List**: List contributors in README
- **GitHub Badges**: Provide badges for active contributors
- **Technical Blog**: Invite contributors to write technical blogs
- **Speaking Opportunities**: Recommend contributors to speak at technical conferences

### 11.2 Contributor Rewards

- **Open Source Rewards**: Provide open source rewards for important contributions
- **Learning Resources**: Provide learning resources and training opportunities
- **Community Events**: Invite to participate in community events
- **Career Opportunities**: Recommend career opportunities

### 11.3 Contributor Levels

| Level | Contribution Requirements | Benefits |
|-------|---------------------------|----------|
| **Newcomer** | First contribution | Added to contributor list |
| **Active Contributor** | Multiple meaningful contributions | Receive contributor badge |
| **Core Contributor** | Continuous important contributions | Participate in project decisions |
| **Maintainer** | Long-term project maintenance | Have code merge permissions |

## 12. Frequently Asked Questions

### 12.1 How to Start Contributing?

- **Check Issue List**: Look for issues marked as `good first issue`
- **Improve Documentation**: Improving documentation is a good start
- **Fix Small Bugs**: Start with simple bug fixes
- **Add Tests**: Add tests for existing functionality

### 12.2 How to Get Help?

- **GitHub Discussions**: Ask questions in the discussion area
- **Discord**: Join the Discord community
- **Email**: Contact project maintainers
- **Documentation**: Consult project documentation

### 12.3 What to Do If Contribution Is Rejected?

- **Understand Reasons**: Understand why the contribution was rejected
- **Improve Code**: Improve code based on feedback
- **Resubmit**: Resubmit after improvements
- **Seek Help**: If you have questions, seek help

### 12.4 How to Become a Maintainer?

- **Continuous Contribution**: Continuously make important contributions to the project
- **Professional Knowledge**: Demonstrate professional knowledge in relevant fields
- **Community Participation**: Actively participate in community discussions
- **Reliability**: Complete promised work on time
- **Apply to Be a Maintainer**: Express your willingness to existing maintainers

## 13. Contact Us

### 13.1 Project Maintainers

- **GitHub**: [@vue-security-scanner](https://github.com/vue-security-scanner)
- **Email**: contact@vue-security-scanner.com
- **Discord**: [Vue Security Scanner Discord](https://discord.gg/vue-security)
- **Twitter**: [@VueSecurityScan](https://twitter.com/VueSecurityScan)

### 13.2 Community Resources

- **GitHub Issues**: [https://github.com/vue-security-scanner/vue-security-scanner/issues](https://github.com/vue-security-scanner/vue-security-scanner/issues)
- **GitHub Discussions**: [https://github.com/vue-security-scanner/vue-security-scanner/discussions](https://github.com/vue-security-scanner/vue-security-scanner/discussions)
- **Documentation**: [https://vue-security-scanner.com/docs](https://vue-security-scanner.com/docs)
- **Blog**: [https://vue-security-scanner.com/blog](https://vue-security-scanner.com/blog)

### 13.3 Contribution Statistics

- **Contributors**: Over 100 contributors
- **Commits**: Over 1000 commits
- **Issues Resolved**: Over 500 issues resolved
- **Pull Requests**: Over 800 PRs merged

## 14. Conclusion

Thank you for your interest and support in the Vue Security Scanner project! We believe that through the joint efforts of the community, Vue Security Scanner will become the most powerful security scanning tool in the Vue ecosystem.

Whether you are an experienced developer or a beginner just starting to learn, we welcome your contributions. Every contribution, no matter how small, is crucial to the development of the project.

Let's build more secure Vue applications together!

**Vue Security Scanner Team**