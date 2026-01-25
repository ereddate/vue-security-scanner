// JWT Algorithm Confusion 漏洞示例文件

import jwt from 'jsonwebtoken';

// 示例 1: 不安全的 JWT 验证，接受 "none" 算法
export function jwtAlgorithmConfusionExample1(token) {
  // 危险：未明确指定算法
  return jwt.verify(token, 'secret');
}

// 示例 2: 不安全的 JWT 验证，未指定算法
export function jwtAlgorithmConfusionExample2(token, secret) {
  // 危险：未指定算法
  const decoded = jwt.verify(token, secret);
  return decoded;
}

// 示例 3: 不安全的 JWT 验证，允许 "none" 算法
export function jwtAlgorithmConfusionExample3(token, secret) {
  // 危险：显式允许 "none" 算法
  const decoded = jwt.verify(token, secret, {
    algorithms: ['HS256', 'RS256', 'none']
  });
  return decoded;
}

// 示例 4: 不安全的 JWT 验证，算法从配置获取
export function jwtAlgorithmConfusionExample4(token, secret, algorithm) {
  // 危险：算法可被外部控制
  return jwt.verify(token, secret, {
    algorithm: algorithm
  });
}

// 示例 5: 不安全的 JWT 验证，未检查算法
export function jwtAlgorithmConfusionExample5(token, secret) {
  // 危险：没有指定预期的算法
  const decoded = jwt.verify(token, secret, {});
  return decoded;
}

// 示例 6: 不安全的 JWT 解码，不验证签名
export function jwtAlgorithmConfusionExample6(token) {
  // 危险：仅解码而不验证
  const decoded = jwt.decode(token);
  return decoded;
}

// 示例 7: 不安全的 JWT 验证，使用不安全的密钥
export function jwtAlgorithmConfusionExample7(token) {
  // 危险：使用空密钥或容易猜测的密钥
  return jwt.verify(token, '');
}

// 示例 8: 不安全的 JWT 验证，动态算法
export function jwtAlgorithmConfusionExample8(token, secret, algo) {
  // 危险：算法从用户输入获取
  return jwt.verify(token, secret, {
    algorithms: [algo]
  });
}

// 示例 9: 不安全的 JWT 验证，宽松的算法配置
export function jwtAlgorithmConfusionExample9(token, secret) {
  // 危险：允许过多的算法
  return jwt.verify(token, secret, {
    algorithms: ['HS256', 'HS384', 'HS512', 'RS256', 'RS384', 'RS512', 'ES256', 'ES384', 'ES512', 'PS256', 'PS384', 'PS512', 'none']
  });
}

// 示例 10: 不安全的 JWT 验证，使用变量算法
export function jwtAlgorithmConfusionExample10(token, secret, options) {
  // 危险：算法选项完全可配置
  return jwt.verify(token, secret, options);
}

// 示例 11: 从 token 头部提取算法（危险做法）
export function jwtAlgorithmConfusionExample11(token, secret) {
  try {
    // 危险：从 token header 获取算法
    const parts = token.split('.');
    const header = JSON.parse(atob(parts[0]));
    const algorithm = header.alg;
    
    // 然后使用这个可能被篡改的算法
    return jwt.verify(token, secret, { algorithms: [algorithm] });
  } catch (err) {
    return null;
  }
}

// 示例 12: 不安全的 JWT 验证，允许任意算法
export function jwtAlgorithmConfusionExample12(token, secret, allowedAlgorithms) {
  // 危险：允许外部控制的算法列表
  return jwt.verify(token, secret, {
    algorithms: allowedAlgorithms
  });
}
