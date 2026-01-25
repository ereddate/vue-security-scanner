// LDAP Injection 漏洞示例文件

import ldap from 'ldapjs';

// 示例 1: 直接使用用户输入构建 LDAP 查询
export function ldapInjectionExample1(username) {
  // 危险：直接将用户输入拼接到 LDAP 查询中
  const filter = `(uid=${username})`;
  return filter;
}

// 示例 2: 不安全的 LDAP 登录验证
export function ldapInjectionExample2(userInput, password) {
  // 危险：用户输入未经过滤
  const client = ldap.createClient({
    url: 'ldap://ldap.example.com:389'
  });
  
  const searchFilter = `(cn=${userInput})`;
  return { client, searchFilter };
}

// 示例 3: 构建不安全的搜索过滤器
export function ldapInjectionExample3(searchTerm) {
  // 危险：搜索条件直接来自用户输入
  const filter = `(&(objectClass=user)(|(cn=*${searchTerm}*)(mail=*${searchTerm}*)))`;
  return filter;
}

// 示例 4: 不安全的 LDAP 绑定操作
export function ldapInjectionExample4(bindDN, credentials) {
  // 危险：绑定 DN 来自用户输入
  const filter = `(bindDN=${bindDN})`;
  return filter;
}

// 示例 5: 用户可控的 LDAP 属性查询
export function ldapInjectionExample5(attribute, value) {
  // 危险：属性和值都来自用户输入
  const filter = `(${attribute}=${value})`;
  return filter;
}

// 示例 6: 不安全的 LDAP 搜索
export function ldapInjectionExample6(baseDN, searchQuery) {
  // 危险：基础 DN 和搜索查询都来自用户输入
  const filter = `(description=${searchQuery})`;
  return { base: baseDN, filter };
}

// 示例 7: 构造易受攻击的复合过滤器
export function ldapInjectionExample7(firstName, lastName) {
  // 危险：多个用户输入字段组合成过滤器
  const filter = `(&(givenName=${firstName})(sn=${lastName}))`;
  return filter;
}

// 示例 8: 不安全的用户认证过滤器
export function ldapInjectionExample8(userId) {
  // 危险：用户 ID 直接用于过滤器
  const filter = `(employeeNumber=${userId})`;
  return filter;
}

// 示例 9: 用户控制的组成员查询
export function ldapInjectionExample9(groupName, memberAttribute) {
  // 危险：组名和成员属性都来自用户输入
  const filter = `(&(objectClass=group)(cn=${groupName})(${memberAttribute}=*))`;
  return filter;
}

// 示例 10: 不安全的邮箱查询
export function ldapInjectionExample10(emailAddress) {
  // 危险：邮箱地址直接用于查询
  const filter = `(mail=${emailAddress})`;
  return filter;
}

// 示例 11: 动态构建的 LDAP 过滤器
export function ldapInjectionExample11(objectClass, attributeName, attributeValue) {
  // 危险：对象类、属性名和属性值都来自用户输入
  const filter = `(${objectClass}=${attributeValue})`;
  return filter;
}

// 示例 12: 不安全的角色查询
export function ldapInjectionExample12(roleName) {
  // 危险：角色名直接用于过滤器
  const filter = `(memberOf=cn=${roleName},ou=roles,dc=example,dc=com)`;
  return filter;
}

// 示例 13: 用户可控的组织单元查询
export function ldapInjectionExample13(organizationUnit, criteria) {
  // 危险：组织单元和查询条件来自用户输入
  const filter = `(&(objectClass=person)(ou=${organizationUnit})(${criteria}))`;
  return filter;
}

// 示例 14: 不安全的管理员权限检查
export function ldapInjectionExample14(adminGroup, userDN) {
  // 危险：管理员组和用户 DN 来自用户输入
  const filter = `(&(objectClass=group)(cn=${adminGroup})(member=${userDN}))`;
  return filter;
}

// 示例 15: 构建复杂的用户搜索过滤器
export function ldapInjectionExample15(department, location, title) {
  // 危险：多个用户输入参数用于复杂查询
  const filter = `(&(department=${department})(l=${location})(title=${title}))`;
  return filter;
}

// 示例 16: 不安全的用户属性更新查询
export function ldapInjectionExample16(userId, attributeName) {
  // 危险：用户 ID 和属性名来自用户输入
  const filter = `(&(objectClass=user)(sAMAccountName=${userId}))`;
  return filter;
}

// 示例 17: 可注入的登录名查询
export function ldapInjectionExample17(loginName) {
  // 危险：登录名直接用于过滤器
  const filter = `(userPrincipalName=${loginName}@example.com)`;
  return filter;
}

// 示例 18: 不安全的员工编号查询
export function ldapInjectionExample18(empId) {
  // 危险：员工编号直接用于过滤器
  const filter = `(employeeID=${empId})`;
  return filter;
}

// 示例 19: 用户控制的身份验证过滤器
export function ldapInjectionExample19(authType, authValue) {
  // 危险：认证类型和值都来自用户输入
  const filter = `(${authType}=${authValue})`;
  return filter;
}

// 示例 20: 不安全的多条件查询
export function ldapInjectionExample20(condition1, condition2, condition3) {
  // 危险：多个条件来自用户输入
  const filter = `(&(${condition1})(${condition2})(${condition3}))`;
  return filter;
}

// 辅助函数模拟 LDAP 特殊字符转义
function escapeLDAPSpecialChars(input) {
  // 这个函数应该实现适当的 LDAP 特殊字符转义
  // 但在示例中故意不实现以展示漏洞
  return input;
}
