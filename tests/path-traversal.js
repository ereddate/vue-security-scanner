// Path Traversal 漏洞示例文件

import fs from 'fs';
import path from 'path';
import { readFile, readFileSync } from 'fs';

// 示例 1: 不安全的文件路径拼接
export function pathTraversalExample1(filePath) {
  // 危险：直接使用用户输入构建文件路径
  const fullPath = path.join('/var/www/uploads/', filePath);
  return fs.readFileSync(fullPath, 'utf8');
}

// 示例 2: 不安全的文件访问
export function pathTraversalExample2(fileName) {
  // 危险：未验证文件路径
  const filePath = `/home/user/docs/${fileName}`;
  return fs.readFile(filePath, (err, data) => {
    return data;
  });
}

// 示例 3: 不安全的路径操作
export function pathTraversalExample3(inputPath) {
  // 危险：未规范化路径
  const fullPath = '/app/data/' + inputPath;
  return fs.existsSync(fullPath);
}

// 示例 4: 不安全的路径解析
export function pathTraversalExample4(userPath) {
  // 危险：未正确处理相对路径
  const resolvedPath = path.resolve('/secure/folder', userPath);
  return readFileSync(resolvedPath);
}

// 示例 5: 不安全的文件服务
export function pathTraversalExample5(req, res) {
  // 危险：直接使用 URL 参数作为文件路径
  const fileName = req.params.filename;
  const filePath = `./public/${fileName}`;
  res.sendFile(filePath);
}

// 示例 6: 不安全的路径构造
export function pathTraversalExample6(imageName) {
  // 危险：未验证路径包含 '..'
  const imagePath = './images/' + imageName;
  return fs.statSync(imagePath);
}

// 示例 7: 不安全的路径访问
export function pathTraversalExample7(configFile) {
  // 危险：允许访问任意配置文件
  const pathToConfig = '../' + configFile;
  return fs.readFileSync(pathToConfig, 'utf8');
}

// 示例 8: 不安全的目录遍历
export function pathTraversalExample8(dir, fileName) {
  // 危险：未限制目录访问范围
  const fullPath = path.join(dir, fileName);
  return fs.readdirSync(fullPath);
}

// 示例 9: 不安全的路径规范化
export function pathTraversalExample9(inputPath) {
  // 危险：虽然使用了 normalize，但仍可能存在问题
  const normalizedPath = path.normalize('/restricted/' + inputPath);
  return fs.createReadStream(normalizedPath);
}

// 示例 10: 不安全的路径拼接
export function pathTraversalExample10(subdir, filename) {
  // 危险：多个用户输入参与路径构建
  const fullPath = `/app/storage/${subdir}/${filename}`;
  return fs.accessSync(fullPath);
}

// 示例 11: 不安全的文件下载功能
export function pathTraversalExample11(filePath) {
  // 危险：未验证文件路径是否在允许范围内
  const safePath = path.join(process.cwd(), 'uploads', filePath);
  return fs.createReadStream(safePath);
}

// 示例 12: 不安全的模块加载
export function pathTraversalExample12(moduleName) {
  // 危险：使用用户输入动态构建模块路径
  const modulePath = `../modules/${moduleName}.js`;
  return require(modulePath);
}

// 示例 13: 不安全的静态资源服务
export function pathTraversalExample13(assetPath) {
  // 危险：未对静态资源路径进行适当限制
  const resourcePath = path.join(__dirname, 'assets', assetPath);
  return fs.readFileSync(resourcePath);
}

// 示例 14: 不安全的日志文件访问
export function pathTraversalExample14(logFileName) {
  // 危险：允许访问任意日志文件
  const logPath = path.join('/var/log/app/', logFileName);
  return fs.appendFileSync(logPath, 'log entry');
}

// 示例 15: 不安全的临时文件访问
export function pathTraversalExample15(tempFileName) {
  // 危险：未验证临时文件名
  const tempPath = `/tmp/${tempFileName}`;
  return fs.writeFileSync(tempPath, 'data');
}

// 示例 16: 使用 replaceAll 进行路径清理（不安全的方法）
export function pathTraversalExample16(filePath) {
  // 危险：简单的字符串替换无法处理所有情况
  let cleanPath = filePath.replaceAll('../', '').replaceAll('./', '');
  cleanPath = path.join('/safe/dir/', cleanPath);
  return fs.readFileSync(cleanPath);
}

// 示例 17: 不安全的路径检查
export function pathTraversalExample17(filePath) {
  // 危险：只检查开头，不全面
  if (filePath.startsWith('../')) {
    throw new Error('Invalid path');
  }
  const fullPath = path.join('/app/data/', filePath);
  return fs.readFileSync(fullPath);
}

// 示例 18: 不安全的路径处理
export function pathTraversalExample18(filePath) {
  // 危险：多重编码绕过检查
  const decodedPath = decodeURIComponent(filePath);
  const fullPath = `/safe/dir/${decodedPath}`;
  return fs.readFileSync(fullPath);
}

// 示例 19: 不安全的路径验证
export function pathTraversalExample19(userPath) {
  // 危险：错误的验证方式
  if (!userPath.includes('../') && !userPath.startsWith('/')) {
    const fullPath = path.join('data', userPath);
    return fs.readFileSync(fullPath);
  }
}

// 示例 20: 不安全的路径拼接与编码
export function pathTraversalExample20(baseDir, filePath) {
  // 危险：未充分验证的路径拼接
  const combinedPath = baseDir + '/' + filePath;
  const resolved = path.resolve(combinedPath);
  return fs.readFileSync(resolved);
}
