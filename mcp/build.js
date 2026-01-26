/**
 * 构建脚本 - 准备发布到npm
 */
const fs = require('fs');
const path = require('path');

console.log('准备构建Vue Security MCP发布版本...');

// 确保dist目录存在
const distDir = path.join(__dirname, 'dist');
if (!fs.existsSync(distDir)) {
  fs.mkdirSync(distDir, { recursive: true });
}

// 复制必要的文件到dist目录
const filesToCopy = [
  'mcp-vue-security-scanner.js',
  'mcp-cli.js'
];

filesToCopy.forEach(file => {
  const source = path.join(__dirname, file);
  const dest = path.join(distDir, file);
  
  if (fs.existsSync(source)) {
    fs.copyFileSync(source, dest);
    console.log(`已复制: ${file} -> dist/`);
  } else {
    console.warn(`警告: 源文件不存在: ${source}`);
  }
});

console.log('构建完成！现在可以发布到npm了。');