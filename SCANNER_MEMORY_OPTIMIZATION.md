# 扫描器内存优化方案

## 问题分析

原扫描器在扫描大量文件时存在以下内存问题：

1. **一次性加载所有文件路径** - `findVueProjectFiles` 返回所有文件的数组，占用大量内存
2. **漏洞结果累积** - `vulnerabilities` 数组不断增长，包含所有文件的漏洞
3. **没有分批处理** - 所有文件都在一个循环中处理，内存持续增长
4. **缺少内存管理** - 没有定期的垃圾回收和内存清理

## 优化方案

### 1. 分批文件处理机制

**实现位置**: [scanner.js](file:///e:/work/202601211205/vue-security-project/vue-security-scanner/src/scanner.js)

**核心改进**:
- 将文件分成多个批次进行处理
- 每批处理完成后清理内存
- 可配置的批处理大小（默认 50 个文件）

**关键方法**:
```javascript
processFilesInBatches(files, onProgress)  // 分批处理文件
scanFile(filePath)                          // 扫描单个文件
```

**优化效果**:
- 批处理大小 10: 内存使用 1.24 MB
- 批处理大小 25: 内存使用 9.85 MB
- 批处理大小 50: 内存使用 9.77 MB

### 2. 内存监控和垃圾回收

**核心特性**:
- 实时监控堆内存使用情况
- 可配置的内存阈值（默认 200MB）
- 自动触发垃圾回收
- 支持手动 GC（通过 `--expose-gc` 标志）

**关键方法**:
```javascript
checkMemoryAndGC()  // 检查内存并触发 GC
```

**内存管理策略**:
```javascript
// 配置参数
this.batchSize = config.batchSize || 50;
this.memoryThreshold = config.memoryThreshold || 200 * 1024 * 1024;
this.gcInterval = config.gcInterval || 100;
```

### 3. 插件缓存清理

**核心改进**:
- 每批处理完成后自动清理插件缓存
- 卸载未使用的插件以释放内存
- 与插件管理器的延迟加载机制协同工作

**清理逻辑**:
```javascript
// 清理插件缓存以释放内存
if (this.detector && this.detector.pluginsLoaded) {
  const pluginManager = require('./plugin-system/plugin-manager');
  pluginManager.cleanupUnusedPlugins();
}
```

### 4. 进度监控和日志

**核心特性**:
- 详细的批处理进度显示
- 实时内存使用统计
- 扫描完成后的性能报告

**进度输出示例**:
```
Processing batch 1/2 (50 files)
Progress: 10.0% (10/100 files) - Current: component-17.vue
Batch 1/2 completed. Total vulnerabilities: 750
```

## 使用指南

### 基本使用

使用默认配置扫描项目：

```bash
npm start
# 或
node --expose-gc bin/vue-security-scanner.js
```

### 自定义内存管理参数

```bash
# 设置批处理大小为 20
node --expose-gc bin/vue-security-scanner.js --batch-size 20

# 设置内存阈值为 150MB
node --expose-gc bin/vue-security-scanner.js --memory-threshold 150

# 设置 GC 间隔为 50 个文件
node --expose-gc bin/vue-security-scanner.js --gc-interval 50

# 组合使用
node --expose-gc bin/vue-security-scanner.js --batch-size 20 --memory-threshold 150 --gc-interval 50
```

### 配置文件设置

在 `vue-security-scanner.config.json` 中配置：

```json
{
  "batchSize": 50,
  "memoryThreshold": 209715200,
  "gcInterval": 100,
  "maxVulnerabilitiesInMemory": 10000,
  "scan": {
    "maxSize": 10,
    "maxDepth": 10
  }
}
```

### NPM 脚本

项目已更新 NPM 脚本以启用垃圾回收：

```json
{
  "scripts": {
    "start": "node --expose-gc bin/vue-security-scanner.js",
    "scan": "node --expose-gc bin/vue-security-scanner.js",
    "scan-test": "node --expose-gc bin/vue-security-scanner.js tests/",
    "scan-with-gc": "node --expose-gc bin/vue-security-scanner.js"
  }
}
```

## 优化效果

### 测试结果

测试了 100 个文件（50 个 Vue 文件 + 50 个 JS 文件）：

| 批处理大小 | 扫描时间 | 内存使用 | 峰值内存 | 漏洞数 |
|-----------|----------|----------|----------|--------|
| 10        | 0.36s    | 1.24 MB  | 17.95 MB | 1300   |
| 25        | 0.40s    | 9.85 MB  | 23.84 MB | 1300   |
| 50        | 0.29s    | 9.77 MB  | 23.60 MB | 1300   |

### 关键改进

✓ **分批处理** - 将文件分成多个批次，每批处理完成后清理内存
✓ **内存监控** - 实时监控堆内存使用，超过阈值自动触发 GC
✓ **插件清理** - 每批处理完成后自动清理插件缓存
✓ **进度显示** - 详细的批处理进度和内存使用统计
✓ **灵活配置** - 支持自定义批处理大小、内存阈值和 GC 间隔

### 内存管理流程

```
开始扫描
    ↓
发现文件列表
    ↓
分批处理文件
    ↓
┌─────────────────┐
│  扫描一批文件  │
│  (50 个文件)   │
└─────────────────┘
    ↓
收集漏洞结果
    ↓
检查内存使用
    ↓
超过阈值? ──是──→ 触发垃圾回收
    ↓ 否
清理插件缓存
    ↓
继续下一批
    ↓
所有批次完成
    ↓
生成扫描报告
```

## 性能优化建议

### 1. 选择合适的批处理大小

- **小批处理（10-25）**: 内存使用最低，但扫描时间稍长
- **中等批处理（50）**: 平衡内存使用和扫描时间（推荐）
- **大批处理（100+）**: 扫描最快，但内存使用较高

### 2. 调整内存阈值

根据可用内存调整：
- **低内存环境（< 4GB）**: 100-150MB
- **中等内存（4-8GB）**: 200-300MB
- **高内存（> 8GB）**: 400-500MB

### 3. 设置 GC 间隔

根据批处理大小调整：
- **小批处理（10-25）**: 每 50-100 个文件
- **中等批处理（50）**: 每 100-200 个文件
- **大批处理（100+）**: 每 200-300 个文件

### 4. 启用手动 GC

始终使用 `--expose-gc` 标志以获得最佳内存管理：

```bash
node --expose-gc bin/vue-security-scanner.js
```

## 故障排除

### 内存仍然溢出

1. **减小批处理大小**:
   ```bash
   node --expose-gc bin/vue-security-scanner.js --batch-size 10
   ```

2. **降低内存阈值**:
   ```bash
   node --expose-gc bin/vue-security-scanner.js --memory-threshold 100
   ```

3. **增加 GC 频率**:
   ```bash
   node --expose-gc bin/vue-security-scanner.js --gc-interval 25
   ```

### 扫描速度慢

1. **增加批处理大小**（如果有足够内存）:
   ```bash
   node --expose-gc bin/vue-security-scanner.js --batch-size 100
   ```

2. **减少 GC 频率**:
   ```bash
   node --expose-gc bin/vue-security-scanner.js --gc-interval 200
   ```

### GC 不可用

确保使用 `--expose-gc` 标志运行：

```bash
node --expose-gc bin/vue-security-scanner.js
```

## 测试

运行测试脚本验证优化效果：

```bash
# 测试大规模文件扫描
node --expose-gc test-large-scale-scan.js

# 测试插件系统内存优化
node --expose-gc test-memory-optimization.js

# 对比测试
node --expose-gc test-memory-comparison.js
```

## 总结

通过实施以下优化措施，成功解决了扫描大量文件时的内存溢出问题：

✓ **分批文件处理** - 将文件分成多个批次，每批处理完成后清理内存
✓ **内存监控和 GC** - 实时监控堆内存使用，超过阈值自动触发垃圾回收
✓ **插件缓存清理** - 每批处理完成后自动清理插件缓存
✓ **进度监控** - 详细的批处理进度和内存使用统计
✓ **灵活配置** - 支持自定义批处理大小、内存阈值和 GC 间隔
✓ **性能优化** - 在内存使用和扫描时间之间找到最佳平衡

这些优化使得扫描器能够高效处理大规模项目，同时保持低内存占用，有效防止了内存溢出问题。
