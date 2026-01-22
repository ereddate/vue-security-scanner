#!/usr/bin/env node

const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

const pluginDir = path.join(__dirname, 'vue-security-scanner-vscode');

console.log('📦 Installing VSCode Plugin Dependencies...\n');

try {
  // 检查是否已安装vsce (Visual Studio Code Extension Manager)
  let vsceInstalled = false;
  try {
    execSync('npm list -g vsce', { stdio: 'pipe' });
    vsceInstalled = true;
  } catch (e) {
    // vsce not installed globally
  }

  if (!vsceInstalled) {
    console.log('🔄 Installing vsce (VS Code Extension Manager)...');
    execSync('npm install -g vsce', { stdio: 'inherit' });
    console.log('✅ vsce installed successfully\n');
  } else {
    console.log('✅ vsce is already installed\n');
  }

  // 进入插件目录并安装依赖
  console.log('🔄 Installing plugin dependencies...');
  execSync('npm install', { 
    cwd: pluginDir,
    stdio: 'inherit'
  });
  console.log('✅ Plugin dependencies installed successfully\n');

  // 构建插件
  console.log('🔨 Building the extension...');
  execSync('npm run compile', { 
    cwd: pluginDir,
    stdio: 'inherit'
  });
  console.log('✅ Extension built successfully\n');

  console.log('🎉 VSCode Plugin setup completed!');
  console.log('\n💡 Next steps:');
  console.log('   1. Open VSCode');
  console.log('   2. Press Ctrl+Shift+P (Cmd+Shift+P on Mac)');
  console.log('   3. Type "Developer: Install Extension from Location..."');
  console.log('   4. Navigate to the vue-security-scanner-vscode directory and select it');
  console.log('   5. Or run `code --install-extension vue-security-scanner-1.0.0.vsix` to install packaged extension');
  console.log('');
  console.log('🔧 To package the extension:');
  console.log('   cd vue-security-scanner-vscode');
  console.log('   vsce package');
  console.log('');

} catch (error) {
  console.error('❌ Error during setup:', error.message);
  process.exit(1);
}