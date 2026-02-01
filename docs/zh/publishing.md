# 发布指南

本指南解释了如何发布 Vue Security Scanner 包和更新。

## 概述

发布是一个关键过程，包括：
- 准备发布版本
- 构建包
- 测试发布候选版本
- 发布到包注册表
- 向用户分发更新

## 发布流程

### 1. 版本更新

更新 package.json 中的版本：

```bash
# 补丁版本（错误修复）
npm version patch

# 次版本（新功能）
npm version minor

# 主版本（破坏性更改）
npm version major
```

### 2. 发布准备

通过以下步骤准备发布：

1. 使用发布说明更新 CHANGELOG.md
2. 运行测试以确保稳定性
3. 构建项目
4. 创建发布候选版本

### 3. 测试

测试发布候选版本：

```bash
# 运行完整测试套件
npm test

# 运行安全扫描
npm run security

# 测试 CLI 功能
node bin/vue-security-scanner.js --version

# 测试分布式扫描
node bin/vue-security-distributed.js --version
```

### 4. 发布

发布到 npm：

```bash
# 登录到 npm（如果尚未登录）
npm login

# 发布包
npm publish

# 使用标签发布（用于预发布）
npm publish --tag beta
npm publish --tag alpha
```

## 包注册表

### npm

主要包注册表：

- **注册表 URL**：https://registry.npmjs.org/
- **包名称**：vue-security-scanner
- **访问级别**：公开

### GitHub Packages

替代包注册表：

- **注册表 URL**：https://npm.pkg.github.com/
- **包名称**：@vue-security-project/vue-security-scanner
- **访问级别**：公开

### 企业注册表

面向企业客户：

- **注册表 URL**：自定义企业注册表
- **包名称**：vue-security-scanner-enterprise
- **访问级别**：私有

## 分发渠道

### npm

- **全局安装**：`npm install -g vue-security-scanner`
- **项目安装**：`npm install --save-dev vue-security-scanner`

### GitHub Releases

- **发布资产**：预构建的二进制文件和包
- **发布说明**：每个版本的详细更新日志
- **下载**：离线安装的直接下载

### Docker Hub

- **镜像名称**：vuesecurityscanner/vue-security-scanner
- **标签**：版本特定和最新标签
- **拉取命令**：`docker pull vuesecurityscanner/vue-security-scanner:latest`

### 企业门户

- **企业下载**：高级包和插件
- **许可证管理**：企业许可证激活
- **优先支持**：企业客户的直接支持

## 发布最佳实践

### 版本控制

- **遵循语义化版本控制**：Major.Minor.Patch
- **记录破坏性更改**：清楚地记录任何破坏性更改
- **使用预发布标签**：alpha、beta、rc 用于测试版本
- **维护版本历史**：保持准确的更新日志

### 测试

- **运行完整测试套件**：确保所有测试通过
- **在多个环境中测试**：不同的操作系统、Node.js 版本
- **测试边缘情况**：大型项目、复杂配置
- **验证安全性**：对发布版本运行安全扫描

### 文档

- **更新文档**：保持文档与代码更改同步
- **更新示例**：确保示例与新版本一起工作
- **更新 README**：在主要文档中反映更改
- **更新 API 文档**：记录任何 API 更改

### 沟通

- **宣布发布**：通知用户新版本
- **突出功能**：强调新功能和改进
- **解决弃用问题**：传达已弃用的功能
- **提供迁移指南**：帮助用户顺利升级

## CI/CD 集成

### GitHub Actions

项目使用 GitHub Actions 进行 CI/CD：

- **发布工作流**：`.github/workflows/release.yml`
- **独立发布工作流**：`.github/workflows/release-independent.yml`
- **安全扫描工作流**：`.github/workflows/vue-security-scan.yml`

### 自动发布

自动发布过程：

1. **触发**：推送到主分支或标签创建
2. **构建**：构建项目
3. **测试**：运行测试套件
4. **发布**：如果测试通过，发布到 npm
5. **部署**：部署文档和更新

## 企业发布

### 企业版本控制

企业版本遵循不同的方案：

- **格式**：`X.Y.Z-enterprise.W`
- **示例**：`1.3.1-enterprise.2`
- **发布周期**：独立于社区版本

### 企业分发

企业包通过以下方式分发：

- **企业门户**：安全下载门户
- **私有注册表**：企业 npm 注册表
- **许可证密钥**：每用户或每服务器许可
- **支持渠道**：企业客户的专用支持

## 发布故障排除

### npm 发布失败

如果 npm 发布失败：

1. **检查 npm 凭据**：确保您使用正确的权限登录
2. **验证包名称**：确保包名称可用
3. **检查版本**：确保版本尚未发布过
4. **查看 npm 日志**：检查特定错误消息

### 注册表问题

如果存在注册表问题：

1. **验证注册表 URL**：确保您使用的是正确的注册表
2. **检查网络连接**：确保您可以访问注册表
3. **清除 npm 缓存**：`npm cache clean --force`
4. **尝试详细输出**：`npm publish --verbose`

### 版本冲突

如果存在版本冲突：

1. **检查 git 标签**：确保标签与 package.json 版本匹配
2. **验证更新日志**：确保更新日志有该版本的条目
3. **检查发布历史**：确保版本以前未发布过
4. **使用唯一版本**：如有必要，选择不同的版本号

## 发布清单

### 发布前

- [ ] 更新 package.json 版本
- [ ] 使用发布说明更新 CHANGELOG.md
- [ ] 运行完整测试套件
- [ ] 构建项目
- [ ] 测试 CLI 功能
- [ ] 验证文档是否最新

### 发布

- [ ] 登录到 npm
- [ ] 发布到 npm
- [ ] 创建 GitHub 发布
- [ ] 发布 Docker 镜像
- [ ] 更新企业门户

### 发布后

- [ ] 宣布发布
- [ ] 更新文档链接
- [ ] 监控问题
- [ ] 处理用户反馈

## 支持

如需发布帮助：

1. **查看文档**：检查本指南和其他发布文档
2. **联系维护者**：联系核心团队成员
3. **检查 GitHub 问题**：查找类似的发布问题
4. **企业支持**：对于企业发布问题