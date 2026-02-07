# 基于角色的授权测试

## 📋 概述

基于角色的授权测试是确保授权系统正确工作的重要环节。本指南提供了全面的测试策略和方法，帮助开发者验证基于角色的授权实现是否安全、有效。

## 🎯 适用场景

基于角色的授权测试适用于以下场景：

- 开发新的基于角色的授权系统时
- 修改现有授权系统时
- 定期安全审计时
- 应用部署前的安全检查时

## 🔍 测试指南

### 步骤 1：测试准备

在开始测试前，需要进行充分的准备工作。

1. **确定测试范围**：明确需要测试的授权功能和资源
2. **创建测试用户**：为每个角色创建测试用户账号
3. **准备测试环境**：搭建与生产环境相似的测试环境
4. **制定测试计划**：制定详细的测试计划，包括测试用例、测试步骤和预期结果

### 步骤 2：功能测试

测试授权系统的基本功能是否正常工作。

1. **登录测试**：测试不同角色用户的登录功能
2. **角色分配测试**：测试用户是否正确分配到预期角色
3. **权限验证测试**：测试每个角色是否具有预期的权限
4. **访问控制测试**：测试系统是否正确控制对资源的访问

### 步骤 3：边界测试

测试授权系统在边界情况下的表现。

1. **未登录用户测试**：测试未登录用户的访问权限
2. **角色变更测试**：测试用户角色变更后的权限变化
3. **权限继承测试**：测试角色权限的继承关系
4. **权限冲突测试**：测试角色权限冲突时的处理逻辑

### 步骤 4：安全性测试

测试授权系统的安全性，确保无法被绕过。

1. **前端绕过测试**：测试是否可以通过修改前端代码或存储来绕过授权控制
2. **API测试**：测试API是否正确验证用户权限
3. **会话管理测试**：测试会话过期、注销等情况下的授权行为
4. **跨站请求伪造(CSRF)测试**：测试是否可以通过CSRF攻击绕过授权控制

### 步骤 5：性能测试

测试授权系统的性能，确保在高负载下仍能正常工作。

1. **响应时间测试**：测试授权检查的响应时间
2. **并发测试**：测试多个用户同时访问时的系统性能
3. **负载测试**：测试系统在高负载下的授权处理能力

### 步骤 6：兼容性测试

测试授权系统在不同环境和浏览器中的兼容性。

1. **浏览器兼容性测试**：测试在不同浏览器中的表现
2. **设备兼容性测试**：测试在不同设备上的表现
3. **网络环境测试**：测试在不同网络环境下的表现

## 📚 代码示例

### 单元测试示例（使用Jest）

```javascript
// src/__tests__/auth.test.js
import { useAuth } from '../composables/useAuth';

// 模拟localStorage
const mockLocalStorage = (() => {
  let store = {};
  return {
    getItem: jest.fn(key => store[key] || null),
    setItem: jest.fn((key, value) => {
      store[key] = value.toString();
    }),
    removeItem: jest.fn(key => {
      delete store[key];
    }),
    clear: jest.fn(() => {
      store = {};
    })
  };
})();

global.localStorage = mockLocalStorage;

// 模拟fetch
global.fetch = jest.fn();

describe('useAuth', () => {
  beforeEach(() => {
    // 清除localStorage
    localStorage.clear();
    // 清除fetch模拟
    fetch.mockClear();
  });

  test('should login successfully and set user role', async () => {
    // 模拟登录成功响应
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ success: true, role: 'admin' })
    });

    const { login, currentRole, isAuthenticated } = useAuth();
    
    // 执行登录
    const result = await login({ username: 'test', password: 'test' });
    
    // 验证登录结果
    expect(result).toBe(true);
    expect(currentRole.value).toBe('admin');
    expect(isAuthenticated.value).toBe(true);
    expect(localStorage.setItem).toHaveBeenCalledWith('userRole', 'admin');
  });

  test('should fail login with invalid credentials', async () => {
    // 模拟登录失败响应
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ success: false })
    });

    const { login, currentRole, isAuthenticated } = useAuth();
    
    // 执行登录
    const result = await login({ username: 'test', password: 'wrong' });
    
    // 验证登录结果
    expect(result).toBe(false);
    expect(currentRole.value).toBe(null);
    expect(isAuthenticated.value).toBe(false);
  });

  test('should check user role correctly', () => {
    // 设置用户角色
    localStorage.setItem('userRole', 'admin');
    
    const { hasRole } = useAuth();
    
    // 验证角色检查
    expect(hasRole('admin')).toBe(true);
    expect(hasRole('user')).toBe(false);
    expect(hasRole('guest')).toBe(false);
  });

  test('should check user permission correctly', () => {
    // 设置用户角色
    localStorage.setItem('userRole', 'admin');
    
    const { hasPermission } = useAuth();
    
    // 验证权限检查
    expect(hasPermission('read')).toBe(true);
    expect(hasPermission('write')).toBe(true);
    expect(hasPermission('delete')).toBe(true);
    expect(hasPermission('manage')).toBe(true);
  });

  test('should logout and clear user role', () => {
    // 设置用户角色
    localStorage.setItem('userRole', 'admin');
    
    const { logout, currentRole, isAuthenticated } = useAuth();
    
    // 执行登出
    logout();
    
    // 验证登出结果
    expect(currentRole.value).toBe(null);
    expect(isAuthenticated.value).toBe(false);
    expect(localStorage.removeItem).toHaveBeenCalledWith('userRole');
  });
});
```

### 端到端测试示例（使用Cypress）

```javascript
// cypress/integration/auth.spec.js
describe('基于角色的授权测试', () => {
  beforeEach(() => {
    // 访问应用首页
    cy.visit('/');
  });

  it('管理员用户应能访问所有页面', () => {
    // 登录管理员账号
    cy.login('admin', 'admin123');
    
    // 访问管理页面
    cy.visit('/admin');
    cy.url().should('include', '/admin');
    cy.contains('管理员面板').should('be.visible');
    
    // 访问用户页面
    cy.visit('/user');
    cy.url().should('include', '/user');
    cy.contains('用户页面').should('be.visible');
    
    // 访问公共页面
    cy.visit('/public');
    cy.url().should('include', '/public');
    cy.contains('公共页面').should('be.visible');
  });

  it('普通用户应能访问用户页面和公共页面，但不能访问管理页面', () => {
    // 登录普通用户账号
    cy.login('user', 'user123');
    
    // 尝试访问管理页面
    cy.visit('/admin');
    cy.url().should('not.include', '/admin');
    cy.contains('访问被拒绝').should('be.visible');
    
    // 访问用户页面
    cy.visit('/user');
    cy.url().should('include', '/user');
    cy.contains('用户页面').should('be.visible');
    
    // 访问公共页面
    cy.visit('/public');
    cy.url().should('include', '/public');
    cy.contains('公共页面').should('be.visible');
  });

  it('未登录用户应只能访问公共页面', () => {
    // 尝试访问管理页面
    cy.visit('/admin');
    cy.url().should('include', '/login');
    
    // 尝试访问用户页面
    cy.visit('/user');
    cy.url().should('include', '/login');
    
    // 访问公共页面
    cy.visit('/public');
    cy.url().should('include', '/public');
    cy.contains('公共页面').should('be.visible');
  });
});

// cypress/support/commands.js
Cypress.Commands.add('login', (username, password) => {
  cy.visit('/login');
  cy.get('input[name="username"]').type(username);
  cy.get('input[name="password"]').type(password);
  cy.get('button[type="submit"]').click();
  cy.url().should('not.include', '/login');
});
```

## 🛠️ 工具推荐

- **Jest**：JavaScript测试框架，适用于单元测试
- **Cypress**：端到端测试框架，适用于功能测试和集成测试
- **Puppeteer**：无头浏览器测试工具，适用于自动化测试
- **Postman**：API测试工具，适用于测试API授权
- **OWASP ZAP**：安全测试工具，适用于测试授权系统的安全性
- **JMeter**：性能测试工具，适用于测试授权系统的性能

## 📝 验证方法

验证基于角色的授权测试是否有效的方法：

1. **测试覆盖率**：确保测试覆盖了所有授权功能和场景
2. **缺陷跟踪**：跟踪并修复测试中发现的缺陷
3. **回归测试**：定期运行回归测试，确保授权功能没有回归
4. **安全审计**：定期进行安全审计，确保授权系统的安全性
5. **用户反馈**：收集用户反馈，了解授权系统的实际使用情况

## ⚠️ 常见错误

1. **测试覆盖不足**：
   - **错误描述**：测试用例覆盖不全，遗漏某些授权场景
   - **风险**：未测试的场景可能存在安全漏洞
   - **解决方案**：制定详细的测试计划，确保覆盖所有授权场景

2. **测试环境与生产环境不一致**：
   - **错误描述**：测试环境与生产环境差异较大
   - **风险**：测试结果可能无法反映生产环境的实际情况
   - **解决方案**：搭建与生产环境相似的测试环境

3. **仅测试前端授权**：
   - **错误描述**：只测试前端授权，忽略后端授权
   - **风险**：后端授权漏洞可能被忽略
   - **解决方案**：同时测试前端和后端授权

4. **测试数据不安全**：
   - **错误描述**：测试使用真实用户数据或敏感信息
   - **风险**：测试数据可能被泄露或滥用
   - **解决方案**：使用模拟数据或脱敏数据进行测试

5. **测试结果未及时更新**：
   - **错误描述**：系统变更后未及时更新测试用例
   - **风险**：测试结果可能不准确
   - **解决方案**：系统变更后及时更新测试用例和测试计划

## 📚 参考资料

- [Jest官方文档](https://jestjs.io/)
- [Cypress官方文档](https://www.cypress.io/)
- [Puppeteer官方文档](https://pptr.dev/)
- [Postman官方文档](https://www.postman.com/)
- [OWASP ZAP官方文档](https://www.zaproxy.org/)
- [JMeter官方文档](https://jmeter.apache.org/)
- [OWASP测试指南](https://owasp.org/www-project-web-security-testing-guide/)