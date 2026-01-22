// TypeScript 安全问题测试文件
import { Ref, ref } from 'vue';

// 1. 不安全的类型断言 - 可能绕过类型检查导致安全问题
function unsafeTypeAssertion(input: any) {
  // 危险：强制类型转换可能引入安全漏洞
  const riskyCast = input as HTMLElement;
  riskyCast.innerHTML = input.value; // XSS风险
}

// 2. 泛型滥用导致的安全问题
function genericSecurityIssue<T>(data: T): T {
  // 没有适当验证T的类型
  return data;
}

// 3. 类型守卫绕过
function bypassTypeGuard(obj: unknown) {
  // 不安全的类型断言绕过了应有的类型检查
  const unsafeObj = obj as { dangerousMethod: () => void };
  if (typeof unsafeObj.dangerousMethod === 'function') {
    unsafeObj.dangerousMethod(); // 潜在的安全风险
  }
}

// 4. 不安全的装饰器使用
function dangerousDecorator(target: Object, propertyKey: string, descriptor: PropertyDescriptor) {
  // 装饰器可以修改函数行为，可能导致安全问题
  const originalMethod = descriptor.value;
  descriptor.value = function (...args: any[]) {
    // 在这里可以注入恶意代码
    return originalMethod.apply(this, args);
  };
}

// 5. 不安全的类型推断结合用户输入
function unsafeTypeInference(userData: Record<string, any>) {
  // TypeScript可能会推断类型，但仍可能受到恶意输入影响
  const result = userData.method(); // 如果userData被篡改
  return result;
}

// 6. 不当使用any类型处理用户数据
function useAnyType(userInput: any) {
  // 使用any类型完全绕过了TypeScript的安全检查
  const dangerousOp = userInput.constructor.prototype;
  dangerousOp.newProperty = 'malicious code';
}

// 7. TypeScript枚举安全问题
enum UserRole {
  Admin = 'admin',
  User = 'user'
}

function checkRole(role: string) {
  // 不安全：直接使用字符串作为枚举值
  if (role === UserRole.Admin) {
    // 可能被绕过
    return true;
  }
  return false;
}

// 8. 泛型类型污染
class UnsafeGenericClass<T> {
  private data: T;
  
  setData(input: any) {
    // 没有验证input是否真的是T类型
    this.data = input as T;
  }
  
  getData() {
    return this.data;
  }
}

// 9. 不安全的交叉类型合并
type UserInput = { input: string };
type SystemConfig = { isAdmin: boolean; permissions: string[] };

function unsafeMerge(a: UserInput, b: SystemConfig) {
  // 不安全的类型合并可能导致权限提升
  return { ...a, ...b } as UserInput & SystemConfig;
}

// 10. 类型推断漏洞与外部库交互
declare function externalLibCall(data: { safe: boolean }): void;

function unsafeExternalCall(userProvided: Record<string, any>) {
  // 不安全：将用户提供的数据强制转换为期望类型
  externalLibCall(userProvided as { safe: boolean });
}

export { 
  unsafeTypeAssertion, 
  genericSecurityIssue, 
  bypassTypeGuard, 
  dangerousDecorator, 
  unsafeTypeInference,
  useAnyType,
  checkRole,
  UnsafeGenericClass,
  unsafeMerge,
  unsafeExternalCall
};