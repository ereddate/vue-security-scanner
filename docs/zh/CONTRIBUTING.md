# Vue Security Scanner 贡献指南

## 1. 贡献概述

感谢您考虑为 Vue Security Scanner 项目做出贡献！我们欢迎来自社区的各种形式的贡献，包括但不限于：

- **代码贡献**：修复 bug、添加新功能、改进性能
- **文档贡献**：完善文档、翻译内容、添加示例
- **测试贡献**：编写测试用例、改进测试覆盖
- **问题贡献**：报告 bug、提出新功能建议
- **社区贡献**：回答问题、分享使用经验、推广项目

## 2. 贡献流程

### 2.1 环境准备

1. **Fork 仓库**
   - 在 GitHub 上 fork `vue-security-scanner` 仓库到您自己的账号

2. **克隆仓库**
   ```bash
   git clone https://github.com/your-username/vue-security-scanner.git
   cd vue-security-scanner
   ```

3. **安装依赖**
   ```bash
   npm install
   ```

4. **创建分支**
   ```bash
   git checkout -b feature/your-feature-name
   # 或
   git checkout -b fix/your-bug-fix
   ```

### 2.2 开发与测试

1. **编写代码**
   - 遵循项目的代码规范
   - 确保代码功能完整
   - 添加必要的注释

2. **运行测试**
   ```bash
   # 运行单元测试
   npm test
   
   # 运行集成测试
   npm run test:integration
   
   # 运行端到端测试
   npm run test:e2e
   ```

3. **代码质量检查**
   ```bash
   # 运行 ESLint
   npm run lint
   
   # 运行类型检查
   npm run typecheck
   ```

### 2.3 提交与拉取请求

1. **提交代码**
   - 确保遵循提交规范
   - 提交信息清晰明了
   ```bash
   git add .
   git commit -m "feat: add new feature"
   ```

2. **推送分支**
   ```bash
   git push origin feature/your-feature-name
   ```

3. **创建拉取请求**
   - 在 GitHub 上创建新的拉取请求
   - 填写详细的描述
   - 引用相关的 issue
   - 等待代码审查

### 2.4 代码审查

1. **响应审查意见**
   - 及时响应代码审查意见
   - 对需要修改的地方进行调整
   - 保持耐心和专业态度

2. **更新代码**
   - 根据审查意见更新代码
   - 重新运行测试确保通过
   - 提交更新

### 2.5 合并与发布

1. **代码合并**
   - 代码审查通过后，维护者会合并您的代码
   - 合并后您的贡献将成为项目的一部分

2. **发布流程**
   - 维护者会根据贡献内容决定是否发布新版本
   - 发布前会进行全面测试
   - 发布后会在 GitHub 上创建发布记录

## 3. 代码规范

### 3.1 JavaScript/TypeScript 规范

- **缩进**：使用 2 个空格进行缩进
- **分号**：语句结束使用分号
- **引号**：字符串使用单引号
- **变量声明**：使用 `const` 和 `let`，避免使用 `var`
- **箭头函数**：优先使用箭头函数
- **解构赋值**：优先使用解构赋值
- **模板字符串**：复杂字符串使用模板字符串
- **异步代码**：优先使用 `async/await`

### 3.2 命名规范

- **变量名**：使用驼峰命名法 `camelCase`
- **函数名**：使用驼峰命名法 `camelCase`
- **类名**：使用帕斯卡命名法 `PascalCase`
- **常量**：使用全大写命名 `UPPERCASE_WITH_UNDERSCORES`
- **文件命名**：使用短横线分隔 `kebab-case.js`
- **目录命名**：使用短横线分隔 `kebab-case`

### 3.3 注释规范

- **文件头部**：添加文件描述注释
- **函数注释**：添加函数参数、返回值注释
- **复杂逻辑**：添加详细的逻辑注释
- **TODO 注释**：使用 `// TODO:` 标记待完成的任务
- **FIXME 注释**：使用 `// FIXME:` 标记需要修复的问题

### 3.4 代码结构

- **模块化**：遵循模块化设计原则
- **单一职责**：每个函数/类只负责一个功能
- **代码复用**：提取公共代码为可复用模块
- **错误处理**：完善的错误处理机制
- **日志记录**：适当的日志记录

## 4. 开发环境设置

### 4.1 基本环境

- **Node.js**：版本 14.0.0 或更高
- **npm**：版本 6.0.0 或更高
- **Git**：版本 2.0.0 或更高

### 4.2 开发工具

- **编辑器**：推荐使用 VS Code
- **插件**：
  - ESLint
  - Prettier
  - TypeScript
  - Vue Language Features

### 4.3 配置文件

- **ESLint 配置**：`.eslintrc.js`
- **Prettier 配置**：`.prettierrc.js`
- **TypeScript 配置**：`tsconfig.json`
- **Babel 配置**：`babel.config.js`
- **Jest 配置**：`jest.config.js`

### 4.4 开发命令

| 命令 | 描述 |
|------|------|
| `npm run dev` | 启动开发模式 |
| `npm run build` | 构建项目 |
| `npm run lint` | 运行代码质量检查 |
| `npm run test` | 运行单元测试 |
| `npm run test:integration` | 运行集成测试 |
| `npm run test:e2e` | 运行端到端测试 |
| `npm run typecheck` | 运行类型检查 |
| `npm run docs` | 生成文档 |
| `npm run release` | 发布新版本 |

## 5. 测试指南

### 5.1 测试类型

- **单元测试**：测试单个函数或组件
- **集成测试**：测试多个模块的交互
- **端到端测试**：测试完整的用户流程
- **性能测试**：测试性能指标
- **安全测试**：测试安全功能

### 5.2 测试框架

- **Jest**：用于单元测试和集成测试
- **Playwright**：用于端到端测试
- **Lighthouse**：用于性能测试

### 5.3 测试文件命名

- **单元测试**：`*.test.js` 或 `*.spec.js`
- **集成测试**：`*.integration.test.js`
- **端到端测试**：`*.e2e.test.js`

### 5.4 测试编写规范

- **测试描述**：清晰描述测试内容
- **测试覆盖**：覆盖正常情况和边界情况
- **测试隔离**：每个测试应该是独立的
- **测试速度**：测试应该快速运行
- **测试可靠性**：测试应该稳定可靠

### 5.5 测试运行

```bash
# 运行所有测试
npm test

# 运行特定测试文件
npm test -- test/unit/example.test.js

# 运行测试并生成覆盖率报告
npm test -- --coverage

# 运行测试并监视文件变化
npm test -- --watch
```

## 6. 提交规范

### 6.1 提交信息格式

```
<type>(<scope>): <description>

<body>

<footer>
```

### 6.2 类型说明

| 类型 | 描述 |
|------|------|
| `feat` | 新功能 |
| `fix` | 修复 bug |
| `docs` | 文档修改 |
| `style` | 代码风格修改 |
| `refactor` | 代码重构 |
| `perf` | 性能优化 |
| `test` | 测试修改 |
| `build` | 构建工具修改 |
| `ci` | CI 配置修改 |
| `chore` | 其他修改 |

### 6.3 范围说明

范围应该是一个简短的标识符，说明修改的范围，例如：

- `core`：核心功能
- `cli`：命令行工具
- `rules`：规则模块
- `reporter`：报告模块
- `threat-intel`：威胁情报
- `performance`：性能优化
- `docs`：文档

### 6.4 描述说明

- 描述应该简短明了（不超过 50 个字符）
- 描述应该使用祈使句
- 描述的第一个字母应该小写
- 描述不应该以句号结尾

### 6.5 正文说明

- 正文应该详细说明修改的内容
- 正文应该说明修改的原因
- 正文应该说明修改的影响
- 正文每行不超过 72 个字符

### 6.6 页脚说明

- **关闭 issue**：`Closes #123`
- **关联 issue**：`Relates to #123`
- **破坏性变更**：`BREAKING CHANGE: ...`
- **贡献者**：`Co-authored-by: Name <email>`

### 6.7 提交示例

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

## 7. 拉取请求规范

### 7.1 拉取请求标题

- 标题应该简洁明了
- 标题应该说明修改的内容
- 标题应该使用祈使句
- 标题不应该超过 50 个字符

### 7.2 拉取请求描述

- **概述**：简要说明修改的内容
- **详细说明**：详细说明修改的原因和影响
- **测试**：说明已经进行的测试
- **截图**：如果有 UI 修改，提供截图
- **相关 issue**：引用相关的 issue
- **破坏性变更**：说明是否有破坏性变更
- **迁移指南**：如果有破坏性变更，提供迁移指南

### 7.3 拉取请求检查

在创建拉取请求前，确保：

- [ ] 代码已经通过所有测试
- [ ] 代码已经通过代码质量检查
- [ ] 代码已经遵循项目规范
- [ ] 提交信息已经遵循提交规范
- [ ] 已经添加了必要的文档
- [ ] 已经添加了必要的测试

### 7.4 拉取请求示例

**标题**：
```
feat: add support for custom rules
```

**描述**：
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

## 8. 代码审查指南

### 8.1 审查重点

- **代码质量**：代码是否符合规范
- **功能完整性**：功能是否完整实现
- **安全性**：是否存在安全隐患
- **性能**：是否存在性能问题
- **可维护性**：代码是否易于维护
- **测试覆盖**：测试是否覆盖充分

### 8.2 审查注释规范

- **正面反馈**：对好的代码给予肯定
- **建设性批评**：提出具体的改进建议
- **问题标记**：使用 `QUESTION:` 标记疑问
- **建议标记**：使用 `SUGGESTION:` 标记建议
- **警告标记**：使用 `WARNING:` 标记潜在问题
- **错误标记**：使用 `ERROR:` 标记错误

### 8.3 审查流程

1. **初步审查**：查看代码结构和主要逻辑
2. **详细审查**：逐行审查代码细节
3. **测试验证**：运行测试验证功能
4. **性能评估**：评估代码性能
5. **安全性检查**：检查潜在安全问题
6. **提出建议**：提出改进建议
7. **最终决策**：决定是否通过审查

### 8.4 审查反馈

- **及时反馈**：尽快提供审查反馈
- **具体反馈**：提供具体的改进建议
- **尊重反馈**：尊重贡献者的工作
- **开放讨论**：鼓励开放讨论
- **最终决策**：明确表达审查结果

## 9. 发布流程

### 9.1 版本规范

使用语义化版本规范（Semantic Versioning）：

- **主版本号**：不兼容的 API 变更
- **次版本号**：向下兼容的功能添加
- **修订号**：向下兼容的问题修正

### 9.2 发布准备

1. **更新版本号**：
   ```bash
   npm version patch # 或 minor, major
   ```

2. **更新 CHANGELOG**：
   - 记录所有重要变更
   - 按版本号和日期组织
   - 分类记录不同类型的变更

3. **运行测试**：
   ```bash
   npm test
   ```

4. **构建项目**：
   ```bash
   npm run build
   ```

### 9.3 发布步骤

1. **提交版本更新**：
   ```bash
   git push
   git push --tags
   ```

2. **发布到 npm**：
   ```bash
   npm publish
   ```

3. **创建 GitHub 发布**：
   - 在 GitHub 上创建新的发布
   - 填写版本号和发布说明
   - 上传构建产物
   - 标记为预发布或正式发布

### 9.4 发布检查清单

- [ ] 版本号已更新
- [ ] CHANGELOG 已更新
- [ ] 所有测试通过
- [ ] 代码质量检查通过
- [ ] 构建成功
- [ ] 文档已更新
- [ ] 示例已更新
- [ ] 发布说明已准备

## 10. 行为准则

### 10.1 核心价值观

- **尊重**：尊重每一位贡献者
- **包容**：包容不同的观点和背景
- **协作**：积极协作解决问题
- **专业**：保持专业的态度和行为
- **诚信**：诚实和透明的沟通

### 10.2 行为规范

- **友好交流**：使用友好和尊重的语言
- **接受批评**：优雅地接受建设性批评
- **关注问题**：讨论问题本身，不针对个人
- **帮助他人**：乐于帮助其他贡献者
- **分享知识**：分享经验和知识

### 10.3 不允许的行为

- **骚扰**：任何形式的骚扰行为
- **歧视**：基于种族、性别、宗教等的歧视
- **辱骂**：使用辱骂性或冒犯性语言
- **威胁**：任何形式的威胁行为
- **侵犯隐私**：公开他人的私人信息
- **垃圾内容**：发布与项目无关的内容
- **恶意行为**：故意破坏项目或干扰他人工作

### 10.4 举报机制

如果您遇到任何违反行为准则的情况，请通过以下方式举报：

- **邮件**：contact@vue-security-scanner.com
- **GitHub Issues**：创建保密 issue
- **Discord**：联系项目维护者

所有举报将被保密处理，并由项目维护团队进行调查。

## 11. 贡献者激励

### 11.1 贡献者认可

- **贡献者列表**：在 README 中列出贡献者
- **GitHub 徽章**：为活跃贡献者提供徽章
- **技术博客**：邀请贡献者撰写技术博客
- **演讲机会**：推荐贡献者在技术会议上演讲

### 11.2 贡献者奖励

- **开源奖励**：为重要贡献提供开源奖励
- **学习资源**：提供学习资源和培训机会
- **社区活动**：邀请参加社区活动
- **职业机会**：推荐职业机会

### 11.3 贡献者等级

| 等级 | 贡献要求 | 权益 |
|------|----------|------|
| **新手** | 首次贡献 | 加入贡献者列表 |
| **活跃贡献者** | 多次有意义的贡献 | 获得贡献者徽章 |
| **核心贡献者** | 持续的重要贡献 | 参与项目决策 |
| **维护者** | 长期维护项目 | 拥有代码合并权限 |

## 12. 常见问题

### 12.1 如何开始贡献？

- **查看 issue 列表**：寻找标记为 `good first issue` 的问题
- **改善文档**：完善文档是一个很好的开始
- **修复小 bug**：从简单的 bug 修复开始
- **添加测试**：为现有功能添加测试

### 12.2 如何获得帮助？

- **GitHub Discussions**：在讨论区提问
- **Discord**：加入 Discord 社区
- **邮件**：联系项目维护者
- **文档**：查阅项目文档

### 12.3 贡献被拒绝怎么办？

- **理解原因**：了解贡献被拒绝的原因
- **改进代码**：根据反馈改进代码
- **重新提交**：改进后重新提交
- **寻求帮助**：如果有疑问，寻求帮助

### 12.4 如何成为维护者？

- **持续贡献**：持续为项目做出重要贡献
- **专业知识**：展示相关领域的专业知识
- **社区参与**：积极参与社区讨论
- **可靠性**：按时完成承诺的工作
- **申请成为维护者**：向现有维护者表达意愿

## 13. 联系我们

### 13.1 项目维护者

- **GitHub**：[@vue-security-scanner](https://github.com/vue-security-scanner)
- **邮件**：contact@vue-security-scanner.com
- **Discord**：[Vue Security Scanner Discord](https://discord.gg/vue-security)
- **Twitter**：[@VueSecurityScan](https://twitter.com/VueSecurityScan)

### 13.2 社区资源

- **GitHub Issues**：[https://github.com/vue-security-scanner/vue-security-scanner/issues](https://github.com/vue-security-scanner/vue-security-scanner/issues)
- **GitHub Discussions**：[https://github.com/vue-security-scanner/vue-security-scanner/discussions](https://github.com/vue-security-scanner/vue-security-scanner/discussions)
- **Documentation**：[https://vue-security-scanner.com/docs](https://vue-security-scanner.com/docs)
- **Blog**：[https://vue-security-scanner.com/blog](https://vue-security-scanner.com/blog)

### 13.3 贡献统计

- **贡献者数量**：超过 100 位贡献者
- **代码提交**：超过 1000 次提交
- **问题解决**：超过 500 个 issue 已解决
- **拉取请求**：超过 800 个 PR 已合并

## 14. 结语

感谢您对 Vue Security Scanner 项目的关注和支持！我们相信，通过社区的共同努力，Vue Security Scanner 将成为 Vue 生态系统中最强大的安全扫描工具。

无论您是经验丰富的开发者还是刚刚开始学习的新手，我们都欢迎您的贡献。每一个贡献，无论大小，都对项目的发展至关重要。

让我们一起构建更安全的 Vue 应用！

**Vue Security Scanner 团队**