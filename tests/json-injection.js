// JSON Injection 漏洞示例文件

// 示例 1: 直接将用户输入拼接到 JSON 字符串中
export function jsonInjectionExample1(userInput) {
  // 危险：用户输入直接拼接到 JSON 字符串
  const jsonString = `{"username": "${userInput}", "role": "user"}`;
  return jsonString;
}

// 示例 2: 不安全的 JSON 字符串构建
export function jsonInjectionExample2(data) {
  // 危险：用户数据直接用于构建 JSON
  return `{"message": "${data}"}`;
}

// 示例 3: 使用用户输入构建 JSON 对象键
export function jsonInjectionExample3(key, value) {
  // 危险：键和值都来自用户输入
  const obj = {};
  obj[key] = value;
  return JSON.stringify(obj);
}

// 示例 4: 将用户输入作为 JSON 属性名
export function jsonInjectionExample4(propName, propValue) {
  // 危险：属性名来自用户输入
  return `{ "${propName}": "${propValue}" }`;
}

// 示例 5: 不安全的 JSON 数组构建
export function jsonInjectionExample5(userInputs) {
  // 危险：数组元素来自用户输入
  let jsonArray = "[";
  for (let i = 0; i < userInputs.length; i++) {
    if (i > 0) jsonArray += ",";
    jsonArray += `"${userInputs[i]}"`;
  }
  jsonArray += "]";
  return jsonArray;
}

// 示例 6: 用户输入影响 JSON 结构
export function jsonInjectionExample6(jsonFragment) {
  // 危险：JSON 片段来自用户输入
  return `{"data": {${jsonFragment}}}`;
}

// 示例 7: 使用模板字面量构建 JSON
export function jsonInjectionExample7(type, payload) {
  // 危险：类型和负载都来自用户输入
  return `{
    "type": "${type}",
    "payload": "${payload}"
  }`;
}

// 示例 8: 不安全的 JSON 配置构建
export function jsonInjectionExample8(settingName, settingValue) {
  // 危险：配置名和值来自用户输入
  return `{
    "${settingName}": "${settingValue}"
  }`;
}

// 示例 9: 用户输入构建 JSON 嵌套结构
export function jsonInjectionExample9(parentProp, childProp, childValue) {
  // 危险：多层属性名和值都来自用户输入
  return `{
    "${parentProp}": {
      "${childProp}": "${childValue}"
    }
  }`;
}

// 示例 10: 不安全的 JSON 错误消息构建
export function jsonInjectionExample10(errorMessage, errorCode) {
  // 危险：错误消息和代码来自用户输入
  return `{
    "error": {
      "code": "${errorCode}",
      "message": "${errorMessage}"
    }
  }`;
}

// 示例 11: 用户输入构建 JSON API 响应
export function jsonInjectionExample11(status, message, data) {
  // 危险：状态、消息和数据都来自用户输入
  return `{
    "status": "${status}",
    "message": "${message}",
    "data": "${data}"
  }`;
}

// 示例 12: 使用用户输入构建 JSON 查询参数
export function jsonInjectionExample12(paramName, paramValue) {
  // 危险：查询参数名和值来自用户输入
  return `{
    "query": {
      "${paramName}": "${paramValue}"
    }
  }`;
}

// 示例 13: 不安全的 JSON 表单数据构建
export function jsonInjectionExample13(formData) {
  // 危险：表单数据来自用户输入
  let jsonStr = "{";
  for (const [key, value] of Object.entries(formData)) {
    jsonStr += `"${key}": "${value}",`;
  }
  jsonStr = jsonStr.slice(0, -1); // 移除最后的逗号
  jsonStr += "}";
  return jsonStr;
}

// 示例 14: 用户输入构建 JSON 验证响应
export function jsonInjectionExample14(validationResult, fieldName) {
  // 危险：验证结果和字段名来自用户输入
  return `{
    "${fieldName}_valid": ${validationResult},
    "message": "Validation result for ${fieldName}"
  }`;
}

// 示例 15: 不安全的 JSON 日志条目构建
export function jsonInjectionExample15(level, event, details) {
  // 危险：日志级别、事件和详情都来自用户输入
  return `{
    "level": "${level}",
    "event": "${event}",
    "details": "${details}",
    "timestamp": "${new Date().toISOString()}"
  }`;
}

// 示例 16: 用户输入影响 JSON 认证令牌结构
export function jsonInjectionExample16(tokenType, tokenPayload) {
  // 危险：令牌类型和负载来自用户输入
  return `{
    "typ": "${tokenType}",
    "payload": "${tokenPayload}"
  }`;
}

// 示例 17: 不安全的 JSON 消息构建
export function jsonInjectionExample17(sender, recipient, content) {
  // 危险：发送者、接收者和内容都来自用户输入
  return `{
    "from": "${sender}",
    "to": "${recipient}",
    "content": "${content}"
  }`;
}

// 示例 18: 用户输入构建 JSON 配置节
export function jsonInjectionExample18(sectionName, configValues) {
  // 危险：配置节名和值来自用户输入
  return `{
    "${sectionName}": ${configValues}
  }`;
}

// 示例 19: 不安全的 JSON 状态更新构建
export function jsonInjectionExample19(entityId, newState, updateTime) {
  // 危险：实体 ID、新状态和更新时间都来自用户输入
  return `{
    "entityId": "${entityId}",
    "state": "${newState}",
    "updatedAt": "${updateTime}"
  }`;
}

// 示例 20: 用户输入构建复杂 JSON 结构
export function jsonInjectionExample20(userJsonStructure) {
  // 危险：整个 JSON 结构来自用户输入
  return `{
    "userProvided": ${userJsonStructure}
  }`;
}

// 辅助函数演示如何安全地处理 JSON
function safeJsonStringify(obj) {
  // 应该使用适当的转义和验证
  try {
    return JSON.stringify(obj);
  } catch (e) {
    return JSON.stringify({ error: "Invalid JSON" });
  }
}
