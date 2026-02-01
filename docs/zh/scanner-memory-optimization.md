# 扫描器内存优化指南

本指南提供了专门针对 Vue Security Scanner 优化内存使用的详细策略。

## 概述

内存优化对于以下情况至关重要：
- 大型 Vue.js 应用程序（10,000+ 文件）
- 资源有限的 CI/CD 环境
- 顺序扫描多个项目
- 与其他进程一起运行扫描器
- 内存受限的嵌入式系统和容器

## 内存使用分析

### 内存分配

Vue Security Scanner 为以下操作分配内存：

- **文件系统操作**：读取和分析文件
- **AST 构建**：构建用于代码分析的抽象语法树
- **规则处理**：对代码执行安全规则
- **结果聚合**：收集和处理扫描结果
- **报告生成**：创建各种格式的输出报告

### 内存消耗模式

典型的内存消耗模式：

| 项目大小 | 内存使用 |
|----------|----------|
| 小型（100 文件） | 256-512 MB |
| 中型（1,000 文件） | 512 MB - 1 GB |
| 大型（10,000 文件） | 1-4 GB |
| 超大型（100,000+ 文件） | 4-8 GB |

## 优化策略

### 1. 内存限制配置

设置适当的 Node.js 内存限制：

```bash
# 小型项目
NODE_OPTIONS=--max-old-space-size=512 vue-security-scanner .

# 中型项目
NODE_OPTIONS=--max-old-space-size=1024 vue-security-scanner .

# 大型项目
NODE_OPTIONS=--max-old-space-size=4096 vue-security-scanner .

# 超大型项目
NODE_OPTIONS=--max-old-space-size=8192 vue-security-scanner .
```

### 2. 性能配置文件

使用内置的性能配置文件：

```bash
# 快速配置文件（最小内存，更快的扫描）
vue-security-scanner . --performance fast

# 平衡配置文件（默认）
vue-security-scanner . --performance balanced

# 全面配置文件（全面，更高内存）
vue-security-scanner . --performance thorough
```

### 3. 批处理

分批处理文件以减少峰值内存使用：

```bash
# 内存受限环境的小批处理大小
vue-security-scanner . --batch-size 5

# 中批处理大小（默认）
vue-security-scanner . --batch-size 10

# 内存丰富环境的大批处理大小
vue-security-scanner . --batch-size 20
```

### 4. 选择性扫描

限制扫描到特定目录：

```bash
# 仅扫描源目录
vue-security-scanner src components views

# 排除大型目录
vue-security-scanner . --ignore-dir node_modules --ignore-dir dist
```

### 5. 增量扫描

使用增量扫描仅处理更改的文件：

```bash
# 启用增量扫描
vue-security-scanner . --incremental

# 使用缓存目录
vue-security-scanner . --incremental --cache-dir .vue-security-cache
```

### 6. 输出格式优化

选择内存高效的输出格式：

```bash
# 控制台输出（最小内存）
vue-security-scanner . --output console

# JSON 输出（中等内存）
vue-security-scanner . --output json

# 内存受限环境避免 HTML 输出
# vue-security-scanner . --output html  # 更高的内存使用
```

### 7. 规则选择

禁用内存密集型规则：

```json
{
  "rules": {
    "semantic": {
      "enabled": false  // 禁用内存密集型语义分析
    },
    "dependency": {
      "enabled": false  // 禁用依赖项扫描
    }
  }
}
```

## 高级内存优化

### 垃圾回收调优

优化 Node.js 垃圾回收：

```bash
# 启用积极的垃圾回收
NODE_OPTIONS=--expose-gc vue-security-scanner . --gc-interval 3

# 设置 GC 的内存阈值
vue-security-scanner . --memory-threshold 70
```

### 内存监控

监控扫描期间的内存使用：

```bash
# 启用内存监控
NODE_OPTIONS=--expose-gc vue-security-scanner . --monitor-memory

# 启用详细内存日志
NODE_OPTIONS=--expose-gc vue-security-scanner . --monitor-memory --verbose
```

### 内存分析

分析内存使用以识别瓶颈：

```bash
# 生成内存配置文件
node --heapsnapshot-signal=SIGUSR2 bin/vue-security-scanner.js .

# 然后发送 SIGUSR2 信号以生成堆快照
```

### 分布式扫描

对于非常大的项目，使用分布式扫描：

```bash
# 启动工作节点
vue-security-distributed worker --port 3001
vue-security-distributed worker --port 3002

# 运行分布式扫描
vue-security-distributed scan . --workers workers.json --batch-size 10
```

## 容器化优化

### Docker 内存限制

优化 Docker 容器内存使用：

```yaml
# docker-compose.yml
version: '3'
services:
  vue-security-scanner:
    image: vuesecurityscanner/vue-security-scanner
    mem_limit: 1g
    mem_reservation: 512m
    command: [".", "--performance", "fast", "--batch-size", "5"]
```

### Kubernetes 内存请求

配置 Kubernetes 内存请求和限制：

```yaml
# kubernetes-deployment.yaml
resources:
  requests:
    memory: "512Mi"
  limits:
    memory: "1Gi"
```

## CI/CD 内存优化

### GitHub Actions

```yaml
# .github/workflows/vue-security-scan.yml
jobs:
  security-scan:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '18'
      - name: Install scanner
        run: npm install -g vue-security-scanner
      - name: Run security scan
        run: |
          NODE_OPTIONS=--max-old-space-size=2048 vue-security-scanner . \
            --performance fast \
            --batch-size 5 \
            --output json \
            --report security-report.json
```

### GitLab CI/CD

```yaml
# .gitlab-ci.yml
security-scan:
  image: node:18-alpine
  variables:
    NODE_OPTIONS: "--max-old-space-size=2048"
  script:
    - npm install -g vue-security-scanner
    - vue-security-scanner . --performance fast --batch-size 5 --output json --report security-report.json
  artifacts:
    paths:
      - security-report.json
```

## 内存优化清单

### 扫描前

- [ ] 根据项目大小设置适当的内存限制
- [ ] 选择正确的性能配置文件
- [ ] 根据可用内存配置批处理大小
- [ ] 对重复扫描启用增量扫描
- [ ] 排除不必要的目录
- [ ] 如果不需要，禁用内存密集型规则

### 扫描期间

- [ ] 监控内存使用以检测泄漏
- [ ] 如果内存使用过高，调整批处理大小
- [ ] 对长时间扫描使用垃圾回收调优
- [ ] 对非常大的项目考虑分布式扫描

### 扫描后

- [ ] 分析内存使用模式
- [ ] 为未来运行优化扫描配置
- [ ] 记录项目的最佳设置
- [ ] 与团队分享最佳实践

## 内存问题故障排除

### 内存不足错误

如果遇到 "JavaScript heap out of memory" 错误：

1. **增加内存限制**：`NODE_OPTIONS=--max-old-space-size=4096`
2. **使用更快的配置文件**：`--performance fast`
3. **减少批处理大小**：`--batch-size 5`
4. **启用增量扫描**：`--incremental`
5. **使用分布式扫描**：对于非常大的项目

### 内存泄漏

如果内存使用无限增长：

1. **启用垃圾回收**：`--gc-interval 3`
2. **设置内存阈值**：`--memory-threshold 70`
3. **更新扫描器**：确保使用最新版本
4. **报告问题**：如果泄漏持续存在，向维护者报告

### 扫描缓慢

如果由于内存限制导致扫描太慢：

1. **增加内存限制**：如果可能
2. **使用更快的配置文件**：`--performance fast`
3. **调整批处理大小**：更大的批处理大小用于更多内存
4. **启用缓存**：`--cache-dir .vue-security-cache`

## 按项目大小的最佳实践

### 小型项目（100-1,000 文件）

- **内存限制**：512 MB
- **性能配置文件**：balanced
- **批处理大小**：10
- **增量扫描**：可选

### 中型项目（1,000-10,000 文件）

- **内存限制**：1-2 GB
- **性能配置文件**：balanced 或 fast
- **批处理大小**：10-15
- **增量扫描**：推荐

### 大型项目（10,000+ 文件）

- **内存限制**：4+ GB
- **性能配置文件**：CI 使用 fast，开发使用 thorough
- **批处理大小**：5-10（更小以更好地管理内存）
- **增量扫描**：必需
- **分布式扫描**：推荐

## 企业内存优化

### 专用扫描基础设施

对于企业环境：

1. **专用服务器**：为扫描分配专用资源
2. **内存监控**：实施内存使用监控
3. **自动扩展**：根据项目大小扩展资源
4. **分布式架构**：对大型代码库使用多个工作节点
5. **缓存策略**：实施全面的缓存

### 企业配置

```json
{
  "scan": {
    "memoryOptimization": {
      "enabled": true,
      "maxMemory": "4g",
      "batchSize": 10,
      "gcInterval": 3,
      "memoryThreshold": 70
    }
  }
}
```

## 支持

如需其他内存优化帮助：

1. **文档**：查阅本指南和其他优化文档
2. **GitHub Issues**：报告内存相关问题
3. **企业支持**：联系企业支持获取高级帮助
4. **社区论坛**：在社区论坛中提问