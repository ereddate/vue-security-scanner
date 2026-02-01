# 分布式扫描指南

本指南解释了如何使用 Vue Security Scanner 的分布式扫描功能来处理大型项目。

## 概述

分布式扫描允许您将扫描任务分配给多个工作节点，显著提高大型代码库（10,000+ 文件）的性能。

## 快速开始

### 1. 启动工作节点

```bash
# 在端口 3001 上启动工作节点
vue-security-distributed worker --port 3001 --worker-id worker-1

# 在端口 3002 上启动另一个工作节点
vue-security-distributed worker --port 3002 --worker-id worker-2
```

输出：
```
Worker worker-1 starting on port 3001
Worker ready for tasks
```

### 2. 创建工作节点配置

创建 `workers.json` 文件：

```json
{
  "workers": [
    {
      "id": "worker-1",
      "url": "http://localhost:3001"
    },
    {
      "id": "worker-2",
      "url": "http://localhost:3002"
    }
  ]
}
```

### 3. 运行分布式扫描

```bash
vue-security-distributed scan /path/to/vue-project \
  --workers workers.json \
  --batch-size 10 \
  --output json \
  --report distributed-scan.json \
  --save-results
```

输出：
```
Starting distributed scan
Connecting to workers: 2 workers found
Distributing tasks...
Worker worker-1: assigned 50 files
Worker worker-2: assigned 48 files
Monitoring progress...
Worker worker-1: 10/50 files completed
Worker worker-2: 10/48 files completed
...
Scan completed in 45 seconds
Generating report...
Report saved to distributed-scan.json
```

## 架构

### 组件

- **主控节点**：协调扫描、分配任务并聚合结果
- **工作节点**：在分配的文件上执行扫描任务
- **任务分配**：基于工作节点容量的智能文件分配
- **结果聚合**：收集并合并所有工作节点的结果

### 流程

1. 主控节点分析项目结构
2. 主控节点为每个文件创建任务
3. 主控节点将任务分配给工作节点
4. 工作节点处理文件并返回结果
5. 主控节点聚合结果并生成报告

## 配置

### 工作节点配置

工作节点可以使用各种选项进行配置：

```bash
# 自定义内存限制
vue-security-distributed worker --port 3001 --worker-id worker-1 --memory-limit 2048

# 自定义并发数
vue-security-distributed worker --port 3001 --worker-id worker-1 --concurrency 5

# 自定义超时
vue-security-distributed worker --port 3001 --worker-id worker-1 --timeout 60000
```

### 主控节点配置

主控节点进程可以配置为获得最佳性能：

```bash
# 自定义批处理大小
vue-security-distributed scan /path/to/project --workers workers.json --batch-size 20

# 任务超时
vue-security-distributed scan /path/to/project --workers workers.json --task-timeout 30000

# 重试次数
vue-security-distributed scan /path/to/project --workers workers.json --retry-attempts 3

# 结果超时
vue-security-distributed scan /path/to/project --workers workers.json --result-timeout 60000
```

## 高级用法

### 远程工作节点

工作节点可以在不同的机器上运行：

1. 在远程机器上启动工作节点
2. 使用远程 URL 更新 `workers.json`
3. 从主控机器运行扫描

```json
{
  "workers": [
    {
      "id": "worker-1",
      "url": "http://worker1.example.com:3001"
    },
    {
      "id": "worker-2",
      "url": "http://worker2.example.com:3002"
    }
  ]
}
```

### 负载均衡

主控节点会根据以下因素自动平衡任务：

- 工作节点可用性
- 工作节点性能历史
- 文件大小和复杂度

### 容错

系统包含内置的容错机制：

- **工作节点故障**：如果工作节点失败，自动重新分配任务
- **任务超时**：重试超过时间限制的任务
- **结果验证**：验证工作节点的结果

### 监控

您可以监控分布式扫描过程：

```bash
# 详细输出
vue-security-distributed scan /path/to/project --workers workers.json --verbose

# 每 5 秒更新一次进度
vue-security-distributed scan /path/to/project --workers workers.json --progress-interval 5000
```

## 性能优化

### 工作节点数量

- **小型项目**（100-1000 文件）：1-2 个工作节点
- **中型项目**（1000-10,000 文件）：2-4 个工作节点
- **大型项目**（10,000+ 文件）：4+ 个工作节点

### 批处理大小

- **快速工作节点**：较大的批处理大小（20-50）
- **慢速工作节点**：较小的批处理大小（5-10）
- **网络限制**：较小的批处理大小以减少网络流量

### 内存管理

- **为工作节点设置适当的内存限制**
- **扫描期间监控内存使用情况**
- **根据可用内存调整并发度**

## API 端点

### 工作节点 API

工作节点公开以下端点：

```
GET /api/health
```

返回工作节点的健康状态。

```
POST /api/task
```

接受任务并返回结果：

```json
{
  "taskId": "task-1",
  "files": [
    "/path/to/file1.js",
    "/path/to/file2.vue"
  ],
  "options": {
    "level": "detailed"
  }
}
```

### 主控节点 API

主控节点提供用于监控的端点：

```
GET /api/scans
```

返回分布式扫描的列表。

```
GET /api/scans/:scanId
```

返回特定分布式扫描的详细信息。

## 故障排除

### 工作节点连接问题

如果工作节点无法连接到主控节点：

1. 检查机器之间的网络连接
2. 验证防火墙设置是否允许配置的端口
3. 确保工作节点正在运行且响应正常
4. 使用 curl 测试工作节点端点

### 任务分配问题

如果任务未正确分配：

1. 检查工作节点是否在 workers.json 中正确注册
2. 验证工作节点健康状态
3. 检查工作节点日志中的错误
4. 调整批处理大小和超时设置

### 结果聚合问题

如果结果未正确聚合：

1. 检查所有工作节点是否完成了任务
2. 验证结果提交期间的网络连接
3. 检查主控节点日志中的错误
4. 如果网络速度慢，增加结果超时

## 最佳实践

### 对于团队

- **专用工作节点**：设置专用工作节点机器以获得一致的性能
- **自动启动**：使用 systemd 或 Docker 确保工作节点自动启动
- **监控**：设置工作节点健康和性能监控
- **扩展**：在扫描高峰期添加工作节点

### 对于大型项目

- **预扫描分析**：在分布式扫描之前分析项目结构
- **优化批处理大小**：根据文件类型和大小调整批处理大小
- **增量扫描**：对频繁更新使用增量扫描
- **报告聚合**：从分布式结果生成摘要报告

## 支持

如需分布式扫描的其他帮助：

1. 查看 [README.md](../README.md) 获取一般信息
2. 在 GitHub 仓库中打开问题
3. 联系维护者获取企业支持