# 发布 VSCode 扩展到 Visual Studio Marketplace

## 发布前准备

1. 确保所有依赖都已正确配置
2. 确保 TypeScript 代码已成功编译
3. 确保包已成功打包为 .vsix 文件
4. 确保 package.json 包含必要字段（repository, license, etc.）

## 当前状态

- ✅ TypeScript 代码已编译
- ✅ 扩展已打包为 `vue-security-scanner-1.0.0.vsix`
- ✅ 包含 LICENSE 文件
- ✅ package.json 包含 repository 字段

## 发布步骤

要将扩展发布到 Visual Studio Marketplace，请按照以下步骤操作：

1. 访问 https://marketplace.visualstudio.com/manage/publishers/ 并创建或登录发布者账户

2. 获取 Personal Access Token (PAT)：
   - 访问 https://dev.azure.com/
   - 进入个人资料 -> 安全性 -> 个人访问令牌
   - 创建新令牌，设置为 "Marketplace (Publish)" 范围，权限级别为 "Full"

3. 使用 vsce 工具发布：
   ```bash
   # 登录发布者账户
   vsce login <publisher-name>
   
   # 输入上面获取的 PAT
   
   # 发布扩展
   vsce publish
   ```

## 替代方法

也可以使用以下命令发布特定版本：
```bash
vsce publish -p <personal-access-token>
```

## 验证发布

发布后，扩展将在 https://marketplace.visualstudio.com/ 可见，用户可以通过 VSCode 扩展面板搜索并安装。

## 注意事项

- 确保发布者名称与 package.json 中的 publisher 字段匹配
- 发布后可能需要几分钟时间才能在 Marketplace 上显示
- 如果更新扩展，确保增加 package.json 中的版本号