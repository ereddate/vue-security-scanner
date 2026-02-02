# 代码规范指南

本文档概述了 Vue Security Scanner 项目的代码风格指南。遵循这些指南有助于保持代码库的一致性和可读性。

## 目录

- [通用原则](#通用原则)
- [文件结构](#文件结构)
- [命名约定](#命名约定)
- [代码格式](#代码格式)
- [注释](#注释)
- [错误处理](#错误处理)
- [性能考虑](#性能考虑)
- [安全最佳实践](#安全最佳实践)

## 通用原则

1. **可读性优先**：编写易于理解和维护的代码。
2. **一致性**：遵循代码库中已建立的模式和约定。
3. **模块化**：将复杂功能分解为更小、可重用的模块。
4. **可测试性**：编写易于测试的代码。
5. **性能**：考虑性能影响，尤其是在扫描大型代码库时。

## 文件结构

### 目录组织

```
vue-security-scanner/
├── bin/              # 命令行工具
├── src/              # 源代码
│   ├── analysis/     # 代码分析模块
│   ├── config/       # 配置文件
│   ├── core/         # 核心扫描功能
│   ├── rules/        # 安全规则
│   ├── reporting/    # 报告生成
│   └── utils/        # 工具函数
├── docs/             # 文档
├── examples/         # 示例文件
└── tests/            # 测试文件
```

### 文件命名

- **JavaScript 文件**：使用 kebab-case（例如：`file-type-analyzer.js`）
- **类文件**：类名使用 PascalCase，但文件名使用 kebab-case
- **测试文件**：使用 `.test.js` 扩展名（例如：`scanner.test.js`）
- **配置文件**：使用 `.json` 扩展名

## 命名约定

### 变量和函数

- **变量**：使用 camelCase（例如：`filePath`、`memoryLimit`）
- **常量**：使用 UPPER_SNAKE_CASE（例如：`MAX_MEMORY_LIMIT`）
- **函数**：使用 camelCase（例如：`scanFiles`、`analyzeCode`）
- **方法**：使用 camelCase（例如：`processFile`、`generateReport`）
- **类**：使用 PascalCase（例如：`SecurityScanner`、`ASTAnalyzer`）

### 参数

- 使用描述性参数名称
- 保持参数列表简短（优先使用 3 个或更少参数）
- 对具有多个参数的函数使用对象解构

### 私有成员

- 对私有属性和方法使用下划线前缀（例如：`_privateMethod`）

## 代码格式

### 缩进

- 使用 2 个空格进行缩进
- 不要使用制表符

### 行长度

- 尽可能保持行长度在 80 个字符以内
- 在逻辑点处换行

### 大括号

- 使用 K&R 风格的大括号（开始大括号在同一行）
- 始终为控制结构使用大括号，即使是单行块

```javascript
// 推荐
if (condition) {
  doSomething();
}

// 不推荐
if (condition)
  doSomething();
```

### 分号

- 始终使用分号终止语句

### 引号

- 对字符串使用单引号
- 对多行字符串或插值变量使用模板字面量

```javascript
// 推荐
const name = 'Vue Security Scanner';
const message = `Scanning ${filePath}...`;

// 不推荐
const name = "Vue Security Scanner";
```

### 空白

- 在运算符周围使用空格
- 在逗号后使用空格
- 在括号和方括号内使用空格
- 使用空行分隔逻辑块

```javascript
// 推荐
const result = a + b;
const array = [1, 2, 3];
const object = { key: 'value' };

// 不推荐
const result=a+b;
const array=[1,2,3];
const object={key:'value'};
```

## 注释

### 行内注释

- 谨慎使用行内注释
- 解释为什么要做某事，而不是做了什么
- 保持行内注释简短

### 块注释

- 对复杂解释使用块注释
- 对函数文档使用 JSDoc

### JSDoc

```javascript
/**
 * 扫描 Vue 项目的安全漏洞
 * @param {string} projectPath - Vue 项目的路径
 * @returns {Object} 包含漏洞和扫描统计信息的对象
 */
async scanVueProject(projectPath) {
  // 实现
}
```

## 错误处理

### Try-Catch

- 对容易出错的操作使用 try-catch
- 具体说明你捕获的错误
- 适当地记录错误

### 错误对象

- 创建有意义的错误消息
- 在错误消息中包含上下文信息
- 使用一致的错误处理模式

```javascript
try {
  // 风险操作
} catch (error) {
  console.error(`扫描文件 ${filePath} 时出错: ${error.message}`);
  // 优雅地处理错误
}
```

## 性能考虑

### 内存管理

- 在扫描大型项目时注意内存使用
- 对大文件使用流式处理和批处理
- 避免不必要的对象创建
- 完成后清理资源

### 缓存

- 战略性地使用缓存来提高性能
- 设置适当的缓存过期时间
- 限制缓存大小以防止内存问题

### 并行处理

- 对独立任务使用并行处理
- 注意并发限制
- 对共享资源使用适当的同步

## 安全最佳实践

### 输入验证

- 验证所有用户输入
- 清理文件路径以防止路径遍历
- 使用安全的文件操作方法

### 依赖管理

- 保持依赖项更新
- 定期检查易受攻击的依赖项
- 使用最少的依赖项

### 代码质量

- 避免使用已弃用的 API
- 使用安全的编码实践
- 定期对代码库本身运行安全扫描

## 工具

- **代码检查器**：使用 ESLint 强制执行代码风格
- **格式化工具**：使用 Prettier 进行一致的格式化
- **类型检查器**：在适当的地方使用 TypeScript 进行类型安全检查

## 结论

遵循这些代码风格指南有助于保持代码库的清洁、一致和可维护性。请记住，这些指南不是绝对规则，而是有助于提高代码质量的建议。如有疑问，请遵循代码库中的现有模式。