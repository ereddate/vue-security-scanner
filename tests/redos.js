// ReDoS (Regular Expression Denial of Service) 漏洞示例文件

// 示例 1: 易受 ReDoS 攻击的正则表达式
export function redosExample1(input) {
  // 危险：易受 ReDoS 攻击的正则表达式
  const regex = /^(a+)+$/;
  return regex.test(input);
}

// 示例 2: 易受 ReDoS 攻击的正则表达式
export function redosExample2(input) {
  // 危险：嵌套量词导致的 ReDoS
  const regex = /(a|aa)+/;
  return regex.test(input);
}

// 示例 3: 易受 ReDoS 攻击的正则表达式
export function redosExample3(input) {
  // 危险：复杂的回溯正则表达式
  const regex = /^([a-zA-Z0-9]+\.)*[a-zA-Z0-9]+\.[a-zA-Z]{2,}$/;
  return regex.test(input);
}

// 示例 4: 易受 ReDoS 攻击的正则表达式
export function redosExample4(input) {
  // 危险：重叠的字符类导致的 ReDoS
  const regex = /(x+x+)+y/;
  return regex.test(input);
}

// 示例 5: 易受 ReDoS 攻击的正则表达式
export function redosExample5(input) {
  // 危险：复杂的嵌套组
  const regex = /((?:(?:^|,)\s*-?\d+){1,})$/;
  return regex.test(input);
}

// 示例 6: 易受 ReDoS 攻击的正则表达式
export function redosExample6(input) {
  // 危险：贪婪量词的复杂组合
  const regex = /^(a?){25}(a){25}$/;
  return regex.test(input);
}

// 示例 7: 易受 ReDoS 攻击的正则表达式
export function redosExample7(input) {
  // 危险：复杂的模式匹配
  const regex = /(\w+\s*){20,}/;
  return regex.test(input);
}

// 示例 8: 易受 ReDoS 攻击的正则表达式
export function redosExample8(input) {
  // 危险：嵌套的可选模式
  const regex = /^([abc]*[def]*)*$/;
  return regex.test(input);
}

// 示例 9: 易受 ReDoS 攻击的正则表达式
export function redosExample9(input) {
  // 危险：复杂的 URL 验证正则
  const regex = /^(https?:\/\/)?([a-z0-9\-]+\.)*[a-z0-9\-]+\.([a-z]{2,6})(:[0-9]+)?(\/.*)?$/i;
  return regex.test(input);
}

// 示例 10: 易受 ReDoS 攻击的正则表达式
export function redosExample10(input) {
  // 危险：复杂的邮箱验证正则
  const regex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
  return regex.test(input);
}

// 示例 11: 易受 ReDoS 攻击的正则表达式
export function redosExample11(input) {
  // 危险：复杂的路径验证
  const regex = /^\/(?:[^\/\0]*\/)*[^\/\0]*$/;
  return regex.test(input);
}

// 示例 12: 易受 ReDoS 攻击的正则表达式
export function redosExample12(input) {
  // 危险：复杂的 JSON 解析预验证
  const regex = /^\s*\[(?:\s*\{(?:\s*"[^"]+"\s*:\s*"[^"]*"\s*,?)*\}\s*,?)*\]\s*$/;
  return regex.test(input);
}

// 示例 13: 易受 ReDoS 攻击的正则表达式
export function redosExample13(input) {
  // 危险：复杂的标签解析
  const regex = /<([a-z][a-z0-9]*)\b[^>]*>(.*?)<\/\1>/gi;
  return regex.test(input);
}

// 示例 14: 易受 ReDoS 攻击的正则表达式
export function redosExample14(input) {
  // 危险：复杂的日期时间验证
  const regex = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2}(?:\.\d*)?)Z?$/;
  return regex.test(input);
}

// 示例 15: 易受 ReDoS 攻击的正则表达式
export function redosExample15(input) {
  // 危险：复杂的 IP 地址验证
  const regex = /^(([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\.){3}([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])$/;
  return regex.test(input);
}

// 示例 16: 使用 match 方法的 ReDoS 易感代码
export function redosExample16(input) {
  // 危险：使用易受 ReDoS 攻击的正则表达式进行匹配
  const regex = /^(a+)+$/;
  return input.match(regex);
}

// 示例 17: 使用 replace 方法的 ReDoS 易感代码
export function redosExample17(input) {
  // 危险：使用易受 ReDoS 攻击的正则表达式进行替换
  const regex = /(a|aa)+/;
  return input.replace(regex, '');
}

// 示例 18: 使用 search 方法的 ReDoS 易感代码
export function redosExample18(input) {
  // 危险：使用易受 ReDoS 攻击的正则表达式进行搜索
  const regex = /(x+x+)+y/;
  return input.search(regex);
}

// 示例 19: 使用 split 方法的 ReDoS 易感代码
export function redosExample19(input) {
  // 危险：使用易受 ReDoS 攻击的正则表达式进行分割
  const regex = /(a+)+/;
  return input.split(regex);
}

// 示例 20: 构造的复杂 ReDoS 模式
export function redosExample20(input) {
  // 危险：多层嵌套的复杂正则
  const regex = /^(([0-9a-zA-Z]([-.\w]*[0-9a-zA-Z])*@([0-9a-zA-Z][-\w]*[0-9a-zA-Z]\.)+[a-zA-Z]{2,9}))$/;
  return regex.test(input);
}
