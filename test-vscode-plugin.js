// 用于测试VSCode插件的简单脚本
// test-vscode-plugin.js

const fs = require('fs');
const path = require('path');

console.log('🧪 Testing VSCode Plugin Structure...\n');

// 检查插件目录结构
const pluginDir = './vue-security-scanner-vscode';
const requiredFiles = [
  'package.json',
  'tsconfig.json',
  'README.md',
  'resources/icon.svg',
  'src/extension.ts'
];

console.log('📁 Checking plugin directory structure...');
let allFilesExist = true;

for (const file of requiredFiles) {
  const fullPath = path.join(pluginDir, file);
  const exists = fs.existsSync(fullPath);
  console.log(`  ${exists ? '✅' : '❌'} ${file}`);
  if (!exists) allFilesExist = false;
}

console.log('');

if (allFilesExist) {
  console.log('✅ All required files exist');
  
  // 读取package.json验证内容
  const packageJsonPath = path.join(pluginDir, 'package.json');
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
  
  console.log('\n📦 Package.json validation:');
  console.log(`  Name: ${packageJson.name}`);
  console.log(`  Version: ${packageJson.version}`);
  console.log(`  Description: ${packageJson.description}`);
  console.log(`  Publisher: ${packageJson.publisher}`);
  
  // 检查激活事件
  console.log(`\n🔌 Activation events: ${packageJson.activationEvents.length}`);
  packageJson.activationEvents.forEach(event => {
    console.log(`  - ${event}`);
  });
  
  // 检查命令
  console.log(`\n⌨️  Commands: ${packageJson.contributes.commands.length}`);
  packageJson.contributes.commands.forEach(cmd => {
    console.log(`  - ${cmd.title} (${cmd.command})`);
  });
  
  // 检查配置
  console.log(`\n⚙️  Configuration properties: ${Object.keys(packageJson.contributes.configuration.properties).length}`);
  
  console.log('\n✅ VSCode Plugin structure validated successfully!');
  console.log('\n📝 To complete the plugin setup:');
  console.log('   1. Run `npm install` in the vue-security-scanner-vscode directory');
  console.log('   2. Run `npm run compile` to build the extension');
  console.log('   3. Use VSCode Extension Development Host to test the extension');
  console.log('   4. Package with `vsce package` command to create .vsix file');
  
} else {
  console.log('❌ Some required files are missing');
  process.exit(1);
}