// XPath Injection 漏洞示例文件

// 示例 1: 直接使用用户输入构建 XPath 查询
export function xpathInjectionExample1(username) {
  // 危险：直接将用户输入拼接到 XPath 查询中
  const xpath = `//user[username/text()='${username}']`;
  return xpath;
}

// 示例 2: 不安全的 XPath 认证查询
export function xpathInjectionExample2(userInput, password) {
  // 危险：用户名和密码都来自用户输入
  const xpath = `//user[username/text()='${userInput}' and password/text()='${password}']`;
  return xpath;
}

// 示例 3: 用户输入影响 XPath 函数
export function xpathInjection3(searchTerm) {
  // 危险：搜索项直接用于 XPath contains 函数
  const xpath = `//item[contains(title, '${searchTerm}')]`;
  return xpath;
}

// 示例 4: 不安全的 XPath 数值查询
export function xpathInjectionExample4(value) {
  // 危险：数值直接用于 XPath 查询
  const xpath = `//product[price>${value}]`;
  return xpath;
}

// 示例 5: 用户控制的 XPath 路径
export function xpathInjectionExample5(elementName) {
  // 危险：元素名来自用户输入
  const xpath = `//${elementName}`;
  return xpath;
}

// 示例 6: 不安全的 XPath 属性查询
export function xpathInjectionExample6(attrName, attrValue) {
  // 危险：属性名和值都来自用户输入
  const xpath = `//*[@${attrName}='${attrValue}']`;
  return xpath;
}

// 示例 7: 构建不安全的 XPath 位置查询
export function xpathInjectionExample7(position) {
  // 危险：位置参数来自用户输入
  const xpath = `//item[${position}]`;
  return xpath;
}

// 示例 8: 用户输入影响 XPath 轴向
export function xpathInjectionExample8(axis, nodeTest) {
  // 危险：轴向和节点测试都来自用户输入
  const xpath = `//${axis}::${nodeTest}`;
  return xpath;
}

// 示例 9: 不安全的 XPath 正则表达式查询
export function xpathInjectionExample9(pattern) {
  // 危险：正则模式来自用户输入
  const xpath = `//*[matches(text(), '${pattern}')]`;
  return xpath;
}

// 示例 10: 用户控制的 XPath 函数参数
export function xpathInjectionExample10(funcParam) {
  // 危险：函数参数来自用户输入
  const xpath = `//user[starts-with(name, '${funcParam}')]`;
  return xpath;
}

// 示例 11: 复合条件的 XPath 注入
export function xpathInjectionExample11(field1, value1, field2, value2) {
  // 危险：多个字段和值都来自用户输入
  const xpath = `//record[@${field1}='${value1}' and @${field2}='${value2}']`;
  return xpath;
}

// 示例 12: 不安全的 XPath 子节点查询
export function xpathInjectionExample12(parentNode, childNode) {
  // 危险：父节点和子节点名都来自用户输入
  const xpath = `//${parentNode}/${childNode}`;
  return xpath;
}

// 示例 13: 用户输入影响 XPath 谓词
export function xpathInjectionExample13(predicate) {
  // 危险：谓词来自用户输入
  const xpath = `//item[${predicate}]`;
  return xpath;
}

// 示例 14: 不安全的 XPath 文本查询
export function xpathInjectionExample14(textValue) {
  // 危险：文本值来自用户输入
  const xpath = `//description[text()='${textValue}']`;
  return xpath;
}

// 示例 15: 用户控制的 XPath 通配符查询
export function xpathInjectionExample15(wildcardPattern) {
  // 危险：通配符模式来自用户输入
  const xpath = `//${wildcardPattern}`;
  return xpath;
}

// 示例 16: 不安全的 XPath 比较查询
export function xpathInjectionExample16(comparisonOp, value) {
  // 危险：比较操作符和值都来自用户输入
  const xpath = `//score[@value ${comparisonOp} ${value}]`;
  return xpath;
}

// 示例 17: 用户输入构建 XPath OR 条件
export function xpathInjectionExample17(value1, value2) {
  // 危险：OR 条件值来自用户输入
  const xpath = `//category[text()='${value1}' or text()='${value2}']`;
  return xpath;
}

// 示例 18: 不安全的 XPath 父子关系查询
export function xpathInjectionExample18(parentAttr, parentVal, childAttr, childVal) {
  // 危险：父子节点的所有属性和值都来自用户输入
  const xpath = `//${parentAttr}[${parentAttr}='${parentVal}']/${childAttr}[@${childAttr}='${childVal}']`;
  return xpath;
}

// 示例 19: 用户控制的 XPath 函数调用
export function xpathInjectionExample19(funcName, param) {
  // 危险：函数名和参数都来自用户输入
  const xpath = `//item[${funcName}('${param}')]/title`;
  return xpath;
}

// 示例 20: 复杂的用户输入驱动 XPath 查询
export function xpathInjectionExample20(userXPathFragment) {
  // 危险：XPath 片段完全来自用户输入
  const xpath = `//root/${userXPathFragment}`;
  return xpath;
}

// 辅助函数模拟 XPath 查询
function evaluateXPath(xpathExpression, xmlDoc) {
  // 这是一个模拟函数，实际应用中会使用适当的 XPath 解析库
  console.log('Executing XPath:', xpathExpression);
  return [];
}
