# 内存优化指南

本指南提供了在大型项目上运行 Vue Security Scanner 时优化内存使用的策略。

## 概述

内存优化对于以下情况至关重要：
- 大型代码库（10,000+ 文件）
- 资源有限的 CI/CD 环境
- 顺序扫描多个项目
- 与其他进程一起运行扫描器

## 内存使用因素

影响内存使用的几个因素：

- **项目大小**：文件数量和总代码大小
- **扫描深度**：扫描器遍历目录的深度
- **规则复杂度**：安全规则的数量和复杂度
- **输出格式**：详细格式需要更多内存
- **语义分析**：基于 AST 的分析是内存密集型的

## 配置选项

### 内存限制

设置 Node.js 内存限制：

```bash
# 增加内存限制到 4GB
NODE_OPTIONS=--max-old-space-size=4096 vue-security-scanner .

# 增加内存限制到 8GB
NODE_OPTIONS=--max-old-space-size=8192 vue-security-scanner .
```

### 性能配置

使用针对内存优化的性能配置：

```bash
# 使用快速配置（最小内存使用）
vue-security-scanner . --performance fast

# 使用平衡配置（默认）
vue-security-scanner . --performance balanced

# 使用全面配置（更高内存使用）
vue-security-scanner . --performance thorough
```

### 批处理

分批处理文件以减少内存使用：

```bash
# 设置批处理大小为 10 个文件
vue-security-scanner . --batch-size 10

# 对于非常大的项目，设置批处理大小为 5 个文件
vue-security-scanner . --batch-size 5
```

### 内存阈值

设置内存阈值以触发垃圾回收：

```bash
# 当内存使用达到 80% 时触发 GC
vue-security-scanner . --memory-threshold 80

# 更积极的 GC
vue-security-scanner . --memory-threshold 70
```

### 垃圾回收间隔

设置运行垃圾回收的频率：

```bash
# 每 5 批运行一次 GC
vue-security-scanner . --gc-interval 5

# 每 3 批运行一次 GC
vue-security-scanner . --gc-interval 3
```

## 高级选项

### 增量扫描

仅扫描修改的文件以减少内存使用：

```bash
# 启用增量扫描
vue-security-scanner . --incremental
```

### 选择性扫描

限制扫描到特定目录：

```bash
# 仅扫描 src 目录
vue-security-scanner src

# 仅扫描特定子目录
vue-security-scanner src/components src/views
```

### 减少规则集

禁用内存密集型规则：

```json
{
  "rules": {
    "dependencies": {
      "enabled": false
    },
    "semantic": {
      "enabled": false
    }
  }
}
```

### 输出格式优化

使用内存高效的输出格式：

```bash
# 使用控制台输出（最小内存）
vue-security-scanner . --output console

# 使用 JSON 输出（中等内存）
vue-security-scanner . --output json

# 避免在内存受限环境中使用 HTML 输出
# vue-security-scanner . --output html  # 更高内存使用
```

## 分布式扫描

对于非常大的项目，使用分布式扫描：

1. 在多台机器上启动工作节点
2. 分配扫描任务
3. 聚合结果

有关详细信息，请参阅 [分布式扫描指南](./distributed-scanning.md)。

## CI/CD 优化

### GitHub Actions

```yaml
jobs:
  security-scan:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v4
    - uses: actions/setup-node@v4
      with:
        node-version: '18'
    - name: Increase memory limit
      run: export NODE_OPTIONS=--max-old-space-size=4096
    - name: Run security scan
      run: vue-security-scanner . --performance fast --batch-size 10
```

### GitLab CI/CD

```yaml
security-scan:
  image: node:18-alpine
  variables:
    NODE_OPTIONS: "--max-old-space-size=4096"
  script:
    - npm install -g vue-security-scanner
    - vue-security-scanner . --performance fast --batch-size 10
```

## 监控内存使用

### 进程监控

扫描期间监控内存使用：

```bash
# 运行带内存监控的扫描
node --expose-gc -e "
  const scanner = require('vue-security-scanner');
  
  function logMemory() {
    const used = process.memoryUsage();
    console.log(`Memory: ${Math.round(used.heapUsed / 1024 / 1024)}MB`);
  }
  
  setInterval(logMemory, 5000);
  
  scanner.scan('.').then(() => {
    console.log('Scan completed');
  });
"
```

### 内存分析

使用 Node.js 内置分析器：

```bash
# 生成内存分析
node --heapsnapshot-signal=SIGUSR2 -e "
  const scanner = require('vue-security-scanner');
  scanner.scan('.').then(() => {
    console.log('Scan completed');
  });
"
```

然后发送 SIGUSR2 信号以生成堆快照。

## 最佳实践

### 对于大型项目

1. **使用分布式扫描**处理非常大的代码库
2. **增加内存限制**，基于项目大小
3. **使用批处理**减少峰值内存使用
4. **启用增量扫描**进行后续扫描
5. **监控 CI/CD 运行期间的内存使用**

### 对于 CI/CD 环境

1. **在 CI 配置中设置适当的内存限制**
2. **使用快速性能配置**进行更快的扫描
3. **基于可用内存调整批处理大小**
4. **实现内存阈值**以防止 OOM 错误
5. **考虑为非常大的项目升级资源类**

### 对于开发机器

1. **使用平衡配置**以获得速度和内存的最佳平衡
2. **基于系统 RAM 设置合理的内存限制**
3. **启用语义分析**以获得更准确的结果
4. **使用增量扫描**以加快开发周期

## 故障排除

### 内存不足错误

如果遇到 "JavaScript heap out of memory" 错误：

1. **增加内存限制**：`NODE_OPTIONS=--max-old-space-size=4096`
2. **使用快速配置**：`--performance fast`
3. **减少批处理大小**：`--batch-size 5`
4. **启用增量扫描**：`--incremental`
5. **对于非常大的项目使用分布式扫描**

### 内存泄漏

如果内存使用无限增长：

1. **启用垃圾回收**：`--gc-interval 3`
2. **设置内存阈值**：`--memory-threshold 70`
3. **检查自定义规则中的无限循环**
4. **更新到最新版本的扫描器**

### 扫描缓慢

如果由于内存限制导致扫描太慢：

1. **使用快速配置**：`--performance fast`
2. **增加批处理大小**：`--batch-size 20`
3. **禁用语义分析**：在配置中设置 `enableSemanticAnalysis: false`
4. **使用增量扫描**：`--incremental`

## 内存优化清单

- [ ] 设置适当的 Node.js 内存限制
- [ ] 选择正确的性能配置
- [ ] 为大型项目配置批处理
- [ ] 为频繁扫描启用增量扫描
- [ ] 扫描期间监控内存使用
- [ ] 根据项目大小调整设置
- [ ] 考虑为非常大的项目使用分布式扫描

## 支持

如需内存优化的其他帮助，请在 GitHub 仓库中打开问题。