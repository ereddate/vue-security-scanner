// Template Injection 漏洞示例文件

// 示例 1: 直接将用户输入插入模板引擎
export function templateInjectionExample1(userInput) {
  // 危险：用户输入直接插入到模板中
  return `Hello {{ ${userInput} }}!`;
}

// 示例 2: 不安全的模板字符串构建
export function templateInjectionExample2(templateVar) {
  // 危险：模板变量来自用户输入
  return `{{ ${templateVar} }}`;
}

// 示例 3: 使用用户输入构建模板表达式
export function templateInjectionExample3(expression) {
  // 危险：表达式来自用户输入
  return `{{ ${expression} }}`;
}

// 示例 4: 不安全的模板条件语句
export function templateInjectionExample4(condition) {
  // 危险：条件语句来自用户输入
  return `{% if ${condition} %}Content{% endif %}`;
}

// 示例 5: 用户输入影响模板循环
export function templateInjectionExample5(loopVariable) {
  // 危险：循环变量来自用户输入
  return `{% for item in ${loopVariable} %}{{ item }}{% endfor %}`;
}

// 示例 6: 不安全的模板函数调用
export function templateInjectionExample6(functionCall) {
  // 危险：函数调用来自用户输入
  return `{{ ${functionCall} }}`;
}

// 示例 7: 用户输入构建模板过滤器
export function templateInjectionExample7(filterName, variable) {
  // 危险：过滤器名和变量都来自用户输入
  return `{{ ${variable} | ${filterName} }}`;
}

// 示例 8: 不安全的模板宏定义
export function templateInjectionExample8(macroName, params) {
  // 危险：宏名和参数来自用户输入
  return `{% macro ${macroName}(${params}) %}{% endmacro %}`;
}

// 示例 9: 用户输入影响模板继承
export function templateInjectionExample9(baseTemplate) {
  // 危险：基础模板来自用户输入
  return `{% extends "${baseTemplate}" %}`;
}

// 示例 10: 不安全的模板包含
export function templateInjectionExample10(includeTemplate) {
  // 危险：包含的模板来自用户输入
  return `{% include "${includeTemplate}" %}`;
}

// 示例 11: 用户输入构建模板块
export function templateInjectionExample11(blockName) {
  // 危险：块名来自用户输入
  return `{% block ${blockName} %}{% endblock %}`;
}

// 示例 12: 不安全的模板赋值
export function templateInjectionExample12(varName, value) {
  // 危险：变量名和值都来自用户输入
  return `{% set ${varName} = ${value} %}`;
}

// 示例 13: 用户输入构建复杂模板表达式
export function templateInjectionExample13(leftOperand, operator, rightOperand) {
  // 危险：操作数和操作符都来自用户输入
  return `{{ ${leftOperand} ${operator} ${rightOperand} }}`;
}

// 示例 14: 不安全的模板导入
export function templateInjectionExample14(importPath, alias) {
  // 危险：导入路径和别名来自用户输入
  return `{% from "${importPath}" import ${alias} %}`;
}

// 示例 15: 用户输入影响模板测试
export function templateInjectionExample15(testExpression) {
  // 危险：测试表达式来自用户输入
  return `{% if ${testExpression} %}True{% else %}False{% endif %}`;
}

// 示例 16: 不安全的模板注释注入
export function templateInjectionExample16(commentContent) {
  // 危险：注释内容来自用户输入
  return `{# ${commentContent} #}`;
}

// 示例 17: 用户输入构建模板变量路径
export function templateInjectionExample17(objectPath) {
  // 危险：对象路径来自用户输入
  return `{{ ${objectPath} }}`;
}

// 示例 18: 不安全的模板三元运算符
export function templateInjectionExample18(condition, trueValue, falseValue) {
  // 危险：条件和真/假值都来自用户输入
  return `{{ ${condition} and ${trueValue} or ${falseValue} }}`;
}

// 示例 19: 用户输入构建模板列表推导式
export function templateInjectionExample19(iterable, condition) {
  // 危险：迭代对象和条件来自用户输入
  return `{{ [item for item in ${iterable} if ${condition}] }}`;
}

// 示例 20: 复杂的用户输入驱动模板结构
export function templateInjectionExample20(userTemplateFragment) {
  // 危险：整个模板片段来自用户输入
  return `${userTemplateFragment}`;
}

// 示例 21: 使用用户输入构建模板字典
export function templateInjectionExample21(dictKey, dictValue) {
  // 危险：字典键和值来自用户输入
  return `{{ {'${dictKey}': ${dictValue}} }}`;
}

// 示例 22: 不安全的模板对象访问
export function templateInjectionExample22(objectName, propertyName) {
  // 危险：对象名和属性名都来自用户输入
  return `{{ ${objectName}.${propertyName} }}`;
}

// 示例 23: 用户输入影响模板内置函数
export function templateInjectionExample23(builtInFunction, argument) {
  // 危险：内置函数和参数都来自用户输入
  return `{{ ${builtInFunction}(${argument}) }}`;
}

// 示例 24: 不安全的模板命名空间访问
export function templateInjectionExample24(namespace, variable) {
  // 危险：命名空间和变量来自用户输入
  return `{{ ${namespace}.${variable} }}`;
}

// 示例 25: 用户输入构建模板逻辑运算
export function templateInjectionExample25(leftExpr, logicalOp, rightExpr) {
  // 危险：左右表达式和逻辑操作符都来自用户输入
  return `{{ ${leftExpr} ${logicalOp} ${rightExpr} }}`;
}

// 辅助函数模拟模板引擎行为
function simulateTemplateRender(templateString, context) {
  // 这是一个模拟函数，实际应用中会使用具体的模板引擎
  console.log('Rendering template:', templateString);
  return templateString;
}
