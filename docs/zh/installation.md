# Vue Security Scanner 安装指南

## 系统要求

- **Node.js**: v14.0.0 或更高版本
- **npm**: v6.0.0 或更高版本
- **操作系统**: Windows、macOS、Linux
- **内存**: 至少 4GB RAM
- **磁盘空间**: 至少 100MB 可用空间

## 安装方法

### 1. 全局安装（推荐）

全局安装可以在任何项目中使用：

```bash
npm install -g vue-security-scanner
```

### 2. 项目本地安装

在特定项目中安装：

```bash
npm install vue-security-scanner --save-dev
```

### 3. 从源代码安装

克隆仓库并安装依赖：

```bash
# 从 GitHub 克隆
git clone https://github.com/ereddate/vue-security-scanner.git

# 或从 Gitee 克隆
git clone https://gitee.com/ereddate2017/vue-security-scanner.git

# 进入目录
cd vue-security-scanner

# 安装依赖
npm install

# 链接为全局工具
npm link
```

## 验证安装

安装完成后，运行以下命令验证：

```bash
vue-security-scanner --version
```

或使用简写命令：

```bash
vsc --version
```

如果安装成功，将显示版本信息：

```
vue-security-scanner version 1.8.0
```

## 环境配置

### 1. 配置文件

Vue Security Scanner 支持通过配置文件自定义设置。在项目根目录创建 `.vue-security-scanner.config.js` 文件：

```javascript
module.exports = {
  // 扫描路径
  scanPath: './src',
  
  // 排除路径
  exclude: [
    'node_modules',
    'dist',
    'build',
    '.git'
  ],
  
  // 规则配置
  rules: {
    // 启用的规则模块
    enabled: [
      'vue',
      'javascript',
      'china-security',
      'china-api-security'
    ],
    
    // 自定义规则配置
    severity: {
      critical: true,
      high: true,
      medium: true,
      low: false
    }
  },
  
  // 性能配置
  performance: {
    enableCache: true,
    enableIncremental: true,
    maxCacheSize: 100 * 1024 * 1024 // 100MB
  },
  
  // 报告配置
  reporting: {
    formats: ['json', 'html', 'text'],
    outputDir: './security-reports'
  }
};
```

### 2. 环境变量

支持以下环境变量：

- `VUE_SECURITY_SCANNER_CACHE_DIR`: 缓存目录路径
- `VUE_SECURITY_SCANNER_MAX_CACHE_SIZE`: 最大缓存大小（字节）
- `VUE_SECURITY_SCANNER_TIMEOUT`: 扫描超时时间（毫秒）
- `VUE_SECURITY_SCANNER_THREADS`: 并行处理线程数

## 升级

### 全局安装升级

```bash
npm update -g vue-security-scanner
```

### 本地安装升级

```bash
npm update vue-security-scanner --save-dev
```

### 从源代码升级

```bash
# 进入目录
cd vue-security-scanner

# 拉取最新代码
git pull

# 重新安装依赖
npm install

# 重新链接
npm link
```

## 卸载

### 全局安装卸载

```bash
npm uninstall -g vue-security-scanner
```

### 本地安装卸载

```bash
npm uninstall vue-security-scanner
```

## 常见安装问题

### 1. 权限问题

**症状**: 安装时出现权限错误

**解决方案**: 
- Windows: 以管理员身份运行命令提示符
- macOS/Linux: 使用 `sudo` 命令

### 2. 网络问题

**症状**: 安装时下载缓慢或失败

**解决方案**: 
- 使用 npm 镜像：`npm install -g vue-security-scanner --registry=https://registry.npmmirror.com`
- 检查网络连接

### 3. Node.js 版本问题

**症状**: 安装成功但运行失败

**解决方案**: 
- 检查 Node.js 版本：`node --version`
- 升级到推荐版本

### 4. 依赖冲突

**症状**: 安装时出现依赖冲突

**解决方案**: 
- 清理 npm 缓存：`npm cache clean --force`
- 重新安装：`npm install -g vue-security-scanner`

## 下一步

安装完成后，您可以：

- 查看 [使用教程](./usage.md) 了解如何使用
- 查看 [规则文档](./rules/index.md) 了解支持的规则
- 查看 [API 参考](./api/index.md) 了解编程接口

## 联系我们

如果遇到安装问题，请通过以下方式联系：

- **GitHub Issues**: https://github.com/ereddate/vue-security-scanner/issues
- **Gitee Issues**: https://gitee.com/ereddate2017/vue-security-scanner/issues