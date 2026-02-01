# Vue 安全仪表板指南

本指南解释了如何使用 Vue 安全仪表板进行实时安全监控和漏洞跟踪。

## 概述

Vue 安全仪表板提供：
- 实时漏洞统计
- 交互式趋势图表
- 扫描结果管理
- 项目级安全跟踪
- 用于集成的 RESTful API

## 快速开始

### 1. 启动仪表板服务器

```bash
npm run dashboard
```

或直接运行：

```bash
node dashboard/server.js
```

输出：
```
Vue Security Dashboard API running on port 3000
Dashboard: http://localhost:3000
API: http://localhost:3000/api
```

### 2. 打开仪表板

打开浏览器并导航到：

```
http://localhost:3000
```

您将看到：
- 总扫描次数
- 总漏洞数
- 高/中/低严重性分类
- 30天漏洞趋势
- 严重性分布图表
- 最近扫描表格

## 功能

### 仪表板概览

主仪表板提供了项目安全状态的全面视图：

- **摘要卡片**：快速访问关键指标
- **趋势图表**：随时间变化的安全状态可视化表示
- **严重性分布**：按严重性分类的漏洞细分
- **最近扫描**：带有详细信息的最近扫描结果表格

### 扫描管理

仪表板允许您管理扫描结果：

- **查看详情**：点击扫描查看详细发现
- **导出报告**：以各种格式下载扫描
- **删除扫描**：移除旧的或测试扫描
- **比较扫描**：比较不同扫描之间的结果

### 项目跟踪

对于拥有多个项目的团队：

- **项目选择**：在不同项目之间切换
- **项目指标**：查看特定项目的安全指标
- **跨项目比较**：比较项目之间的安全状态

## API 端点

仪表板提供用于集成的 RESTful API：

### 健康检查

```
GET /api/health
```

返回仪表板 API 的状态。

### 扫描

```
GET /api/scans
```

返回所有扫描的列表。

```
GET /api/scans/:scanId
```

返回特定扫描的详细信息。

```
POST /api/scans
```

触发新扫描。接受：

```json
{
  "projectPath": "/path/to/project",
  "options": {
    "level": "detailed",
    "output": "json"
  }
}
```

```
DELETE /api/scans/:scanId
```

删除特定扫描。

### 统计

```
GET /api/stats
```

返回整体安全统计信息。

```
GET /api/trend?days=30
```

返回指定天数的漏洞趋势数据。

### 项目

```
GET /api/projects
```

返回跟踪的项目列表。

```
POST /api/projects
```

添加新项目。接受：

```json
{
  "name": "Project Name",
  "path": "/path/to/project"
}
```

```
DELETE /api/projects/:projectId
```

从跟踪中移除项目。

## 配置

### 服务器配置

仪表板服务器可以使用环境变量进行配置：

```bash
# 设置自定义端口
PORT=8080 node dashboard/server.js

# 设置数据目录
DATA_DIR="./custom-data" node dashboard/server.js

# 设置用于认证的 API 密钥
API_KEY="your-secret-key" node dashboard/server.js
```

### 仪表板配置

可以通过修改 `dashboard/server.js` 中的配置来自定义仪表板 UI：

```javascript
const config = {
  port: process.env.PORT || 3000,
  dataDir: process.env.DATA_DIR || '.vue-security-data',
  apiKey: process.env.API_KEY || null,
  maxScans: 1000,
  scanTimeout: 300000, // 5 minutes
  cors: {
    origin: '*'
  }
};
```

## 集成

### CI/CD 集成

要将仪表板与 CI/CD 管道集成：

1. 将仪表板服务器作为持久服务运行
2. 使用 API 提交扫描结果
3. 配置高严重性问题的警报

### CI 集成示例

```yaml
# GitHub Actions 示例
- name: Run security scan
  run: vue-security-scanner . --output json --report security-report.json

- name: Submit to dashboard
  run: |
    curl -X POST http://dashboard-server:3000/api/scans \
      -H "Content-Type: application/json" \
      -d '{"projectPath": "$GITHUB_WORKSPACE", "scanResults": $(cat security-report.json)}'
```

### 警报

您可以通过向仪表板添加 webhook 来配置警报：

```javascript
// 添加到 dashboard/server.js
const webhookUrl = process.env.WEBHOOK_URL;

function sendAlert(scan) {
  if (scan.highSeverity > 0 && webhookUrl) {
    fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        project: scan.projectPath,
        highSeverity: scan.highSeverity,
        scanId: scan.id
      })
    });
  }
}
```

## 故障排除

### 仪表板无法启动

如果仪表板无法启动：

1. 检查端口是否被占用
2. 验证数据目录是否有写入权限
3. 检查控制台输出中的错误

### 扫描不显示

如果扫描未在仪表板中显示：

1. 检查扫描是否成功完成
2. 验证 API 请求是否成功
3. 检查仪表板日志中的错误

### API 认证问题

如果您在 API 认证方面遇到问题：

1. 检查 API 密钥是否正确
2. 验证 API 密钥是否在标头中发送
3. 检查仪表板配置中的认证设置

## 性能优化

### 对于大型项目

- **增加内存限制**：使用 `NODE_OPTIONS=--max-old-space-size=4096`
- **调整扫描超时**：增加配置中的 `scanTimeout`
- **启用缓存**：设置 Redis 或其他缓存系统

### 对于高流量

- **使用反向代理**：在仪表板前配置 Nginx 或 Apache
- **启用压缩**：为 API 响应添加 gzip 压缩
- **速率限制**：为 API 请求实现速率限制

## 支持

如需仪表板的其他帮助：

1. 查看 [README.md](../README.md) 获取一般信息
2. 在 GitHub 仓库中打开问题
3. 联系维护者获取企业支持