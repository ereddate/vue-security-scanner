// XXE (XML External Entity) 漏洞示例文件

import { parseString, parse } from 'xml2js';
import { DOMParser } from 'xmldom';
import xml2js from 'xml2js';
import sax from 'sax';

// 示例 1: 不安全的 XML 解析，允许外部实体
export function xxeExample1(xmlString) {
  // 危险：未禁用外部实体
  const parser = new DOMParser();
  const doc = parser.parseFromString(xmlString, 'text/xml');
  return doc;
}

// 示例 2: 不安全的 xml2js 解析
export function xxeExample2(xmlString) {
  // 危险：未配置安全选项
  return parseString(xmlString, (err, result) => {
    return result;
  });
}

// 示例 3: 不安全的 XML 解析，未设置安全标志
export function xxeExample3(xmlString) {
  const parser = new DOMParser({
    // 危险：未禁用不安全的特性
  });
  return parser.parseFromString(xmlString, 'text/xml');
}

// 示例 4: 使用 sax 解析器，未配置安全选项
export function xxeExample4(xmlString) {
  // 危险：未禁用外部实体
  const saxParser = sax.parser(true); // true 表示启用严格模式，但不足以防御 XXE
  saxParser.write(xmlString).close();
  return saxParser;
}

// 示例 5: 不安全的 XML 解析配置
export function xxeExample5(xmlString) {
  const options = {
    // 危险：未禁用外部实体
  };
  const parser = new DOMParser(options);
  return parser.parseFromString(xmlString, 'text/xml');
}

// 示例 6: 不安全的 xml2js 解析，未禁用外部实体
export function xxeExample6(xmlString) {
  // 危险：未设置安全配置
  const parser = new xml2js.Parser();
  return parser.parseString(xmlString);
}

// 示例 7: 不安全的 XML 处理，接受任意 DTD
export function xxeExample7(xmlString) {
  // 危险：允许任意 DTD 声明
  const parser = new DOMParser({
    locator: {},
    errorHandler: {}
  });
  return parser.parseFromString(xmlString, 'text/xml');
}

// 示例 8: 不安全的 XML 解析，未验证输入来源
export function xxeExample8(xmlData) {
  // 危险：直接解析外部输入的 XML
  return parseString(xmlData, {
    // 危险：未设置安全选项
  }, (err, result) => {
    return result;
  });
}

// 示例 9: 不安全的 XML 解析器配置
export function xxeExample9(xmlString) {
  // 危险：未禁用外部实体和参数实体
  const parser = sax.parser(true, {
    // 未设置安全选项
  });
  parser.write(xmlString);
  return parser;
}

// 示例 10: 不安全的 XML 解析，未限制实体大小
export function xxeExample10(xmlString) {
  // 危险：未设置实体大小限制
  const parser = new DOMParser({
    // 未配置安全选项
  });
  return parser.parseFromString(xmlString, 'application/xml');
}

// 示例 11: 不安全的 XML 解析，未设置实体解析限制
export function xxeExample11(xmlString) {
  // 危险：未设置实体递归限制
  return parseString(xmlString, {
    explicitRoot: true,
    explicitArray: false
    // 危险：未禁用外部实体
  }, (err, result) => {
    return result;
  });
}

// 示例 12: 不安全的 XML 解析，未验证文档类型定义
export function xxeExample12(xmlString) {
  const parser = new DOMParser();
  // 危险：直接解析可能包含恶意 DTD 的 XML
  const xmlDoc = parser.parseFromString(xmlString, 'text/xml');
  return xmlDoc.documentElement.textContent;
}

// 示例 13: 不安全的 XML 流解析
export function xxeExample13(xmlStream) {
  // 危险：未配置安全选项的流解析
  const saxStream = sax.createStream(true);
  xmlStream.pipe(saxStream);
  return saxStream;
}

// 示例 14: 不安全的 XML 解析，未禁用参数实体
export function xxeExample14(xmlString) {
  // 危险：未设置选项来阻止参数实体
  const parser = new xml2js.Parser({
    // 危险：未设置安全选项
  });
  return parser.parseStringPromise(xmlString);
}

// 示例 15: 不安全的 XML 解析，未验证外部实体
export function xxeExample15(xmlString) {
  const parser = new DOMParser({
    // 危险：未设置禁止外部实体的选项
  });
  const doc = parser.parseFromString(xmlString, 'text/xml');
  // 危险：进一步处理可能触发外部实体
  return doc.getElementsByTagName('*')[0].textContent;
}

// 辅助函数模拟
function parseStringPromise(xmlString) {
  return new Promise((resolve, reject) => {
    parseString(xmlString, (err, result) => {
      if (err) reject(err);
      else resolve(result);
    });
  });
}
