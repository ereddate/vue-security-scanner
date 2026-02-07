# 基于属性的授权测试

## 📋 概述

基于属性的授权（Attribute-Based Authorization）是一种灵活的授权方法，它通过评估用户属性、资源属性和环境属性来决定是否授予访问权限。本指南提供了全面的测试策略和方法，帮助开发者验证基于属性的授权实现是否安全、有效。

## 🎯 适用场景

基于属性的授权测试适用于以下场景：

- 开发新的基于属性的授权系统时
- 修改现有授权系统时
- 定期安全审计时
- 应用部署前的安全检查时
- 授权策略变更后

## 🔍 测试指南

### 步骤 1：测试准备

在开始测试前，需要进行充分的准备工作。

1. **确定测试范围**：明确需要测试的授权功能和资源
2. **创建测试用户**：创建具有不同属性的测试用户账号
3. **准备测试资源**：准备具有不同属性的测试资源
4. **定义测试环境**：定义不同的测试环境属性，如时间、位置等
5. **制定测试计划**：制定详细的测试计划，包括测试用例、测试步骤和预期结果

### 步骤 2：功能测试

测试授权系统的基本功能是否正常工作。

1. **登录测试**：测试不同属性用户的登录功能
2. **属性获取测试**：测试用户是否正确获取到预期属性
3. **策略评估测试**：测试策略评估引擎是否正确评估授权请求
4. **访问控制测试**：测试系统是否正确控制对资源的访问

### 步骤 3：属性组合测试

测试不同属性组合的授权结果是否符合预期。

1. **用户属性组合测试**：测试不同用户属性组合的授权结果
2. **资源属性组合测试**：测试不同资源属性组合的授权结果
3. **环境属性组合测试**：测试不同环境属性组合的授权结果
4. **多属性组合测试**：测试用户属性、资源属性和环境属性组合的授权结果

### 步骤 4：边界测试

测试授权系统在边界情况下的表现。

1. **属性缺失测试**：测试属性缺失时的授权行为
2. **属性值边界测试**：测试属性值在边界情况下的授权行为
3. **策略冲突测试**：测试策略冲突时的处理逻辑
4. **策略优先级测试**：测试策略优先级的正确性

### 步骤 5：安全性测试

测试授权系统的安全性，确保无法被绕过。

1. **前端绕过测试**：测试是否可以通过修改前端代码或存储来绕过授权控制
2. **API测试**：测试API是否正确验证用户属性和资源属性
3. **会话管理测试**：测试会话过期、注销等情况下的授权行为
4. **跨站请求伪造(CSRF)测试**：测试是否可以通过CSRF攻击绕过授权控制

### 步骤 6：性能测试

测试授权系统的性能，确保在高负载下仍能正常工作。

1. **策略评估性能测试**：测试策略评估的响应时间
2. **并发测试**：测试多个用户同时访问时的系统性能
3. **负载测试**：测试系统在高负载下的授权处理能力

### 步骤 7：策略管理测试

测试授权策略的管理功能是否正常工作。

1. **策略创建测试**：测试创建新策略的功能
2. **策略修改测试**：测试修改现有策略的功能
3. **策略删除测试**：测试删除策略的功能
4. **策略导入导出测试**：测试策略导入导出的功能

## 📚 代码示例

### 单元测试示例（使用Jest）

```javascript
// src/__tests__/attributeAuth.test.js
import { useAttributeAuth } from '../composables/useAttributeAuth';

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

describe('useAttributeAuth', () => {
  beforeEach(() => {
    // 清除localStorage
    localStorage.clear();
    // 清除fetch模拟
    fetch.mockClear();
  });

  test('should login successfully and set user attributes', async () => {
    // 模拟登录成功响应
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        success: true,
        attributes: {
          id: '1',
          name: 'Admin User',
          role: 'admin',
          department: 'IT',
          location: 'Beijing'
        }
      })
    });

    const { login, userAttributes, isAuthenticated } = useAttributeAuth();
    
    // 执行登录
    const result = await login({ username: 'admin', password: 'admin123' });
    
    // 验证登录结果
    expect(result).toBe(true);
    expect(userAttributes.value).toEqual({
      id: '1',
      name: 'Admin User',
      role: 'admin',
      department: 'IT',
      location: 'Beijing'
    });
    expect(isAuthenticated.value).toBe(true);
  });

  test('should evaluate policy correctly', async () => {
    // 设置用户属性
    localStorage.setItem('userAttributes', JSON.stringify({
      id: '1',
      name: 'Admin User',
      role: 'admin',
      department: 'IT',
      location: 'Beijing'
    }));
    
    const { evaluatePolicy } = useAttributeAuth();
    
    // 测试管理员访问管理面板
    expect(evaluatePolicy('access-admin-panel')).toBe(true);
    
    // 测试查看自己的信息
    expect(evaluatePolicy('view-user', { userId: '1' })).toBe(true);
    
    // 测试查看其他用户的信息
    expect(evaluatePolicy('view-user', { userId: '2' })).toBe(true); // 管理员可以查看所有用户
  });

  test('should check permission correctly', async () => {
    // 设置用户属性
    localStorage.setItem('userAttributes', JSON.stringify({
      id: '1',
      name: 'Regular User',
      role: 'user',
      department: 'HR',
      location: 'Shanghai'
    }));
    
    const { hasPermission } = useAttributeAuth();
    
    // 测试查看自己的信息
    expect(hasPermission('user:read', { userId: '1' })).toBe(true);
    
    // 测试编辑自己的信息
    expect(hasPermission('user:write', { userId: '1' })).toBe(true);
    
    // 测试查看其他用户的信息
    expect(hasPermission('user:read', { userId: '2' })).toBe(false); // 普通用户只能查看自己的信息
    
    // 测试删除用户
    expect(hasPermission('user:delete', { userId: '1' })).toBe(false); // 普通用户不能删除用户
  });

  test('should logout and clear user attributes', () => {
    // 设置用户属性
    localStorage.setItem('userAttributes', JSON.stringify({
      id: '1',
      name: 'Admin User',
      role: 'admin',
      department: 'IT',
      location: 'Beijing'
    }));
    
    const { logout, userAttributes, isAuthenticated } = useAttributeAuth();
    
    // 执行登出
    logout();
    
    // 验证登出结果
    expect(userAttributes.value).toBe(null);
    expect(isAuthenticated.value).toBe(false);
    expect(localStorage.removeItem).toHaveBeenCalledWith('userAttributes');
  });

  test('should handle attribute missing correctly', () => {
    // 设置用户属性（缺少role属性）
    localStorage.setItem('userAttributes', JSON.stringify({
      id: '1',
      name: 'User Without Role',
      department: 'IT',
      location: 'Beijing'
    }));
    
    const { evaluatePolicy } = useAttributeAuth();
    
    // 测试缺少role属性时的授权行为
    expect(evaluatePolicy('access-admin-panel')).toBe(false);
    expect(evaluatePolicy('view-user', { userId: '1' })).toBe(false);
  });
});
```

### 端到端测试示例（使用Cypress）

```javascript
// cypress/integration/attributeAuth.spec.js
describe('基于属性的授权测试', () => {
  beforeEach(() => {
    // 访问应用首页
    cy.visit('/');
  });

  it('管理员用户应能访问管理面板', () => {
    // 登录管理员账号
    cy.login('admin', 'admin123');
    
    // 访问管理页面
    cy.visit('/admin');
    cy.url().should('include', '/admin');
    cy.contains('管理员面板').should('be.visible');
  });

  it('普通用户不应能访问管理面板', () => {
    // 登录普通用户账号
    cy.login('user', 'user123');
    
    // 尝试访问管理页面
    cy.visit('/admin');
    cy.url().should('include', '/unauthorized');
    cy.contains('访问被拒绝').should('be.visible');
  });

  it('用户应能查看自己的资料', () => {
    // 登录普通用户账号
    cy.login('user', 'user123');
    
    // 访问自己的资料页面
    cy.visit('/user/profile/1');
    cy.url().should('include', '/user/profile/1');
    cy.contains('用户资料').should('be.visible');
  });

  it('用户不应能查看其他用户的资料', () => {
    // 登录普通用户账号
    cy.login('user', 'user123');
    
    // 尝试访问其他用户的资料页面
    cy.visit('/user/profile/2');
    cy.url().should('include', '/unauthorized');
    cy.contains('访问被拒绝').should('be.visible');
  });

  it('管理员应能查看所有用户的资料', () => {
    // 登录管理员账号
    cy.login('admin', 'admin123');
    
    // 访问其他用户的资料页面
    cy.visit('/user/profile/2');
    cy.url().should('include', '/user/profile/2');
    cy.contains('用户资料').should('be.visible');
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
- **OPA Test**：Open Policy Agent的测试工具，适用于测试授权策略
- **XACML Test**：XACML的测试工具，适用于测试基于XACML的授权系统

## 📝 验证方法

验证基于属性的授权测试是否有效的方法：

1. **测试覆盖率**：确保测试覆盖了所有授权功能和场景
2. **缺陷跟踪**：跟踪并修复测试中发现的缺陷
3. **回归测试**：定期运行回归测试，确保授权功能没有回归
4. **安全审计**：定期进行安全审计，确保授权系统的安全性
5. **用户反馈**：收集用户反馈，了解授权系统的实际使用情况

## ⚠️ 常见错误

1. **测试覆盖不足**：
   - **错误描述**：测试用例覆盖不全，遗漏某些属性组合或场景
   - **风险**：未测试的场景可能存在安全漏洞
   - **解决方案**：制定详细的测试计划，确保覆盖所有授权场景和属性组合

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

5. **策略测试不充分**：
   - **错误描述**：策略测试不充分，遗漏某些策略或策略组合
   - **风险**：策略漏洞可能被忽略
   - **解决方案**：对每个策略和策略组合进行详细测试

## 📚 参考资料

- [Jest官方文档](https://jestjs.io/)
- [Cypress官方文档](https://www.cypress.io/)
- [OPA官方文档](https://www.openpolicyagent.org/docs/)
- [XACML官方文档](https://docs.oasis-open.org/xacml/xacml-core/v3.0/xacml-core-v3.0.html)
- [OWASP测试指南](https://owasp.org/www-project-web-security-testing-guide/)
- [NIST基于属性的访问控制指南](https://csrc.nist.gov/publications/detail/sp/800-162/final)