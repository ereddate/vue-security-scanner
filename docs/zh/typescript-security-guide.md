# TypeScript 安全指南

本指南提供了使用 Vue Security Scanner 进行 TypeScript 项目安全最佳实践和扫描策略。

## 概述

TypeScript 为 JavaScript 添加了类型安全性，但也引入了独特的安全考虑：

- **类型系统滥用**：为安全目的滥用 TypeScript 的类型系统
- **类型断言**：不安全的类型断言绕过类型检查
- **泛型和高级类型**：可能隐藏漏洞的复杂类型结构
- **声明合并**：合并声明可能带来的安全问题
- **模块解析**：模块解析策略的安全影响

## TypeScript 支持

Vue Security Scanner 提供全面的 TypeScript 支持：

- **TypeScript 解析器**：内置支持解析 TypeScript 文件
- **类型感知分析**：利用 TypeScript 的类型信息
- **TSConfig 集成**：尊重 tsconfig.json 设置
- **声明文件支持**：分析 .d.ts 文件的安全问题
- **JSX/TSX 支持**：处理 TypeScript JSX 语法

## 配置

### TypeScript 设置

为 TypeScript 项目配置扫描器：

```json
{
  "scan": {
    "typescript": {
      "enabled": true,
      "tsconfig": "./tsconfig.json",
      "strict": true
    }
  }
}
```

### TypeScript 文件模式

在扫描中包含 TypeScript 文件：

```bash
# 明确扫描 TypeScript 文件
vue-security-scanner . --include "**/*.ts" --include "**/*.tsx"

# 包含 TypeScript 声明文件
vue-security-scanner . --include "**/*.d.ts"

# 排除生成的 TypeScript 文件
vue-security-scanner . --exclude "**/*.generated.ts"
```

## TypeScript 特定安全规则

### 类型断言规则

```javascript
{
  id: 'unsafe-type-assertion',
  name: '不安全的类型断言',
  description: '检测绕过类型检查的不安全类型断言',
  severity: 'medium',
  pattern: /as\s+any/g,
  fix: '使用适当的类型保护而不是 any',
  examples: [
    {
      code: "const user = input as any;",
      message: '检测到不安全的 any 类型断言'
    }
  ]
}
```

### 类型系统滥用规则

```javascript
{
  id: 'type-system-abuse',
  name: '类型系统滥用',
  description: '检测为安全目的滥用 TypeScript 类型系统',
  severity: 'high',
  pattern: /type\s+Password\s*=\s*string/g,
  fix: '使用适当的密码处理而不是类型别名',
  examples: [
    {
      code: "type Password = string;\nconst pass: Password = 'secret';",
      message: '检测到密码处理的类型系统滥用'
    }
  ]
}
```

### 声明合并规则

```javascript
{
  id: 'unsafe-declaration-merging',
  name: '不安全的声明合并',
  description: '检测潜在的不安全声明合并',
  severity: 'medium',
  pattern: /declare\s+namespace\s+window/g,
  fix: '避免修改全局命名空间',
  examples: [
    {
      code: "declare namespace window {\n  let apiKey: string;\n}",
      message: '检测到 window 的不安全声明合并'
    }
  ]
}
```

## TypeScript 安全最佳实践

### 类型安全性

1. **避免 `any` 类型**：使用适当的类型而不是 `any`
2. **使用类型保护**：实现运行时类型检查
3. **严格空检查**：在 tsconfig.json 中启用 strictNullChecks
4. **类型推断**：依赖 TypeScript 的类型推断
5. **接口隔离**：使用小而专注的接口

### 安全模式

1. **安全类型别名**：为安全敏感数据使用类型别名
2. **品牌类型**：为敏感值实现品牌类型
3. **只读类型**：为不可变数据使用 readonly 类型
4. **判别联合**：为安全状态使用判别联合
5. **条件类型**：为类型安全的安全逻辑使用条件类型

### 模块安全

1. **ES 模块**：优先使用 ES 模块而不是 CommonJS
2. **模块解析**：配置安全的模块解析
3. **路径映射**：使用路径映射进行安全导入
4. **声明文件**：维护适当的 .d.ts 文件
5. **模块增强**：谨慎使用模块增强

## TypeScript 项目设置

### 推荐的 tsconfig.json

```json
{
  "compilerOptions": {
    "strict": true,
    "noImplicitAny": true,
    "strictNullChecks": true,
    "strictFunctionTypes": true,
    "strictBindCallApply": true,
    "strictPropertyInitialization": true,
    "noImplicitThis": true,
    "useUnknownInCatchVariables": true,
    "alwaysStrict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noImplicitReturns": true,
    "noFallthroughCasesInSwitch": true,
    "noUncheckedIndexedAccess": true,
    "noImplicitOverride": true,
    "noPropertyAccessFromIndexSignature": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true
  }
}
```

### TypeScript ESLint 配置

集成 ESLint 与 TypeScript：

```json
{
  "parser": "@typescript-eslint/parser",
  "plugins": ["@typescript-eslint"],
  "extends": [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:@typescript-eslint/recommended-requiring-type-checking"
  ],
  "parserOptions": {
    "project": "./tsconfig.json"
  }
}
```

## TypeScript 特定扫描策略

### 增量扫描

为 TypeScript 项目使用增量扫描：

```bash
# 为 TypeScript 启用增量扫描
vue-security-scanner . --incremental --typescript

# 使用 TypeScript 特定缓存
vue-security-scanner . --incremental --cache-dir .vue-security-ts-cache
```

### 类型感知分析

启用类型感知分析：

```bash
# 启用类型感知分析
vue-security-scanner . --typescript --type-aware

# 启用严格类型检查
vue-security-scanner . --typescript --strict
```

### 声明文件扫描

扫描 TypeScript 声明文件：

```bash
# 扫描声明文件
vue-security-scanner . --include "**/*.d.ts"

# 分析 node_modules 类型
vue-security-scanner node_modules --include "**/*.d.ts"
```

## TypeScript 特定漏洞

### 类型断言漏洞

```typescript
// 不安全：绕过类型检查
const user = input as any;
user.admin = true; // 无类型检查

// 安全：使用类型保护
function isUser(input: unknown): input is User {
  return typeof input === 'object' && input !== null && 'id' in input;
}

if (isUser(input)) {
  // 类型安全访问
  console.log(input.id);
}
```

### 类型系统滥用

```typescript
// 不安全：使用类型别名进行安全
 type Password = string;
 const pass: Password = 'secret'; // 仍然只是字符串

// 安全：使用品牌类型
 type Password = string & { readonly brand: unique symbol };
 function createPassword(value: string): Password {
   return value as Password;
 }
 const pass = createPassword('secret');
```

### 模块解析漏洞

```typescript
// 不安全：相对路径遍历
import { secret } from '../../../../secret';

// 安全：绝对导入或路径映射
import { secret } from '@/utils/secret';
```

## TypeScript 测试

### 测试 TypeScript 规则

测试 TypeScript 特定规则：

```bash
# 测试 TypeScript 文件
vue-security-scanner tests/typescript --include "**/*.ts"

# 运行 TypeScript 特定测试
npm run test:typescript
```

### TypeScript 测试模式

创建 TypeScript 测试文件：

```typescript
// test-typescript.ts
const password: string = 'hardcoded-password'; // 应被检测
const apiKey = '1234567890'; // 应被检测

// 不安全的类型断言
const user = {} as any;
user.admin = true;

// 安全代码
const safePassword = process.env.PASSWORD;
```

## TypeScript 性能优化

### TypeScript 解析性能

优化 TypeScript 解析性能：

```bash
# 使用 TypeScript 增量解析
vue-security-scanner . --typescript --incremental

# 限制 TypeScript 严格性以加快扫描速度
vue-security-scanner . --typescript --no-strict

# 使用 TypeScript 程序缓存
vue-security-scanner . --typescript --cache-program
```

### 内存使用

管理大型 TypeScript 项目的内存使用：

```bash
# 为 TypeScript 增加内存限制
NODE_OPTIONS=--max-old-space-size=4096 vue-security-scanner . --typescript

# 为 TypeScript 使用批处理
vue-security-scanner . --typescript --batch-size 5

# 为特定目录禁用 TypeScript
vue-security-scanner . --typescript --exclude "node_modules/**"
```

## TypeScript 与 Vue 集成

### Vue 3 + TypeScript

扫描 Vue 3 + TypeScript 项目：

```bash
# 扫描 Vue 3 TypeScript 项目
vue-security-scanner . --include "**/*.vue" --include "**/*.ts"

# 使用 Vue 特定规则
vue-security-scanner . --vue --typescript
```

### Nuxt 3 + TypeScript

扫描 Nuxt 3 + TypeScript 项目：

```bash
# 扫描 Nuxt 3 TypeScript 项目
vue-security-scanner . --include "**/*.vue" --include "**/*.ts" --include "**/*.server.ts"

# 使用 Nuxt 特定规则
vue-security-scanner . --nuxt --typescript
```

## 最佳实践

### 对于 TypeScript 项目

1. **启用严格模式**：使用 TypeScript 的严格模式
2. **使用类型保护**：实现适当的类型保护
3. **避免 `any`**：使用 unknown 和适当的类型代替
4. **品牌类型**：为敏感数据使用品牌类型
5. **类型别名**：使用类型别名提高清晰度，而非安全性
6. **模块解析**：使用路径映射进行一致的导入
7. **声明文件**：维护准确的 .d.ts 文件
8. **ESLint 集成**：使用 @typescript-eslint/eslint-plugin
9. **Prettier**：使用 Prettier 保持一致的格式化
10. **定期扫描**：定期扫描 TypeScript 文件

### 对于安全团队

1. **TypeScript 培训**：培训开发人员 TypeScript 安全知识
2. **TypeScript 规则**：创建 TypeScript 特定的安全规则
3. **TSConfig 审查**：审查 tsconfig.json 的安全设置
4. **TypeScript 审计**：进行 TypeScript 特定的安全审计
5. **声明文件分析**：分析第三方 .d.ts 文件

## 故障排除

### TypeScript 解析错误

如果遇到 TypeScript 解析错误：

1. **检查 tsconfig.json**：确保 tsconfig.json 有效
2. **更新 TypeScript**：使用最新的 TypeScript 版本
3. **检查文件扩展名**：确保文件有正确的扩展名
4. **启用 SkipLibCheck**：在 tsconfig.json 中添加 "skipLibCheck": true
5. **检查语法**：验证 TypeScript 语法是否正确

### 类型感知分析问题

如果类型感知分析不起作用：

1. **启用 TypeScript**：在配置中设置 "typescript": { "enabled": true }
2. **指定 tsconfig**：提供 tsconfig.json 的路径
3. **检查 TypeScript 版本**：确保兼容的 TypeScript 版本
4. **启用严格模式**：在 TypeScript 配置中设置 "strict": true

### 性能问题

如果 TypeScript 扫描速度慢：

1. **增加内存限制**：设置 NODE_OPTIONS=--max-old-space-size=4096
2. **使用增量扫描**：启用 --incremental 标志
3. **调整批处理大小**：为 TypeScript 使用较小的批处理大小
4. **禁用类型感知分析**：使用 --no-type-aware 加快扫描速度
5. **排除 node_modules**：添加 --exclude "node_modules/**"

## 支持

如需其他 TypeScript 安全帮助：

1. **TypeScript 文档**：查阅官方 TypeScript 文档
2. **Vue TypeScript 指南**：遵循 Vue 的 TypeScript 建议
3. **GitHub Issues**：报告 TypeScript 特定问题
4. **企业支持**：联系企业支持处理 TypeScript 项目

## 后续步骤

- **配置 TypeScript 支持**：为 TypeScript 项目设置扫描器
- **创建 TypeScript 规则**：开发 TypeScript 特定的安全规则
- **集成 CI/CD**：将 TypeScript 扫描添加到 CI/CD 管道
- **培训开发人员**：教育团队 TypeScript 安全最佳实践
- **定期扫描**：实现定期 TypeScript 安全扫描