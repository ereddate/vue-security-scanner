# TypeScript 安全最佳实践

## 1. 类型安全

### 避免使用 `any` 类型
- ❌ 错误做法：
```typescript
function processUserInput(input: any) {
  // 绕过类型检查，可能导致安全问题
  return input.dangerousMethod();
}
```

- ✅ 正确做法：
```typescript
function processUserInput(input: { validate: () => boolean }) {
  if (typeof input.validate === 'function') {
    return input.validate();
  }
  throw new Error('Invalid input');
}
```

### 安全的类型断言
- ❌ 错误做法：
```typescript
const userInput = rawData as User; // 不安全的类型断言
```

- ✅ 正确做法：
```typescript
// 使用类型守卫
function isValidUser(data: unknown): data is User {
  return typeof data === 'object' && 
         data !== null && 
         typeof (data as User).id === 'string';
}

if (isValidUser(rawData)) {
  const user: User = rawData; // 安全的类型转换
}
```

## 2. 泛型安全

### 使用约束泛型
- ❌ 错误做法：
```typescript
function processData<T>(data: T): T {
  // 没有对T进行约束，可能存在安全隐患
  return data;
}
```

- ✅ 正确做法：
```typescript
interface Validatable {
  validate(): boolean;
}

function processData<T extends Validatable>(data: T): T {
  if (!data.validate()) {
    throw new Error('Invalid data');
  }
  return data;
}
```

## 3. 装饰器安全

### 谨慎使用装饰器
- 装饰器可以修改类和方法的行为，可能引入安全风险
- 始终验证装饰器的来源和行为
- 避免在装饰器中执行不安全的操作

## 4. 与外部库交互

### 类型安全的外部调用
- ❌ 错误做法：
```typescript
declare function externalApi(data: { trusted: boolean }): void;

// 不安全：直接将用户输入传给外部API
externalApi(userInput as { trusted: boolean });
```

- ✅ 正确做法：
```typescript
// 验证并构造安全的数据对象
const safeData = {
  trusted: false, // 明确设置可信状态
  ...pick(userInput, ['name', 'email']) // 只提取必要的、已知的字段
};
externalApi(safeData);
```

## 5. 运行时类型检查

即使使用了TypeScript，也要在关键位置添加运行时类型检查：

```typescript
function safeProcessData(input: unknown) {
  // 运行时验证
  if (!isExpectedFormat(input)) {
    throw new Error('Unexpected input format');
  }
  
  // 类型断言后的安全处理
  const validatedInput = input as ExpectedType;
  return performOperation(validatedInput);
}
```

## 6. 配置安全

### tsconfig.json 安全配置
```json
{
  "compilerOptions": {
    "strict": true,
    "noImplicitAny": true,
    "strictNullChecks": true,
    "noImplicitReturns": true,
    "noFallthroughCasesInSwitch": true
  }
}
```

这些配置可以帮助在编译时捕获更多潜在的安全问题。

---

使用我们的Vue安全扫描工具可以自动检测上述大部分TypeScript安全问题，帮助开发者在早期发现并修复安全漏洞。