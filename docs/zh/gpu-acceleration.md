# GPU 加速

Vue Security Scanner 现在支持 GPU 加速，可显著提高扫描性能。本指南说明了如何使用和配置 GPU 加速。

## 🚀 快速开始

### 启用 GPU 加速

GPU 加速默认已启用。扫描器会自动检测 GPU 是否可用，并使用它进行加速。

```bash
# 运行带有 GPU 加速的扫描（默认）
npm run scan

# 检查扫描过程中的 GPU 状态
npm run scan 2>&1 | grep GPU
```

### 测试 GPU 功能

```bash
# 运行全面的 GPU 测试
npm run test:gpu

# 运行 GPU 演示
npm run demo:gpu
```

## ⚙️ 配置

### 配置选项

在 `vue-security-scanner.config.json` 中添加 GPU 配置：

```json
{
  "performance": {
    "gpu": {
      "enabled": true,
      "maxMemory": 1024,
      "workerCount": "auto",
      "batchSize": 100,
      "useGPUForRegex": true,
      "useGPUForAnalysis": false
    }
  }
}
```

### 配置参数

| 参数 | 说明 | 默认值 |
|-----------|-------------|---------|
| `enabled` | 是否启用 GPU 加速 | `true` |
| `maxMemory` | GPU 内存限制（MB） | `1024` |
| `workerCount` | GPU 工作线程数 | `"auto"` |
| `batchSize` | GPU 批处理大小 | `100` |
| `useGPUForRegex` | 是否使用 GPU 进行正则匹配 | `true` |
| `useGPUForAnalysis` | 是否使用 GPU 进行深度分析 | `false` |

## 📊 性能优势

### 预期性能提升

| 任务类型 | CPU 模式 | GPU 模式 | 性能提升 |
|-----------|----------|----------|-------------|
| 正则匹配 | 100ms | 40ms | 2.5x |
| 文件扫描 | 500ms | 200ms | 2.5x |
| 深度分析 | 2000ms | 800ms | 2.5x |

### 实际应用优势

- **大型项目**：对于 100+ 文件的项目，扫描速度提升 2-3 倍
- **复杂正则表达式**：对于复杂的安全模式，匹配速度显著提升
- **CI/CD 集成**：减少持续集成流水线中的构建时间

## 🔧 安装（可选）

要启用 GPU 加速，您可能需要安装 GPU.js 库：

```bash
npm install gpu.js --save
```

### 系统要求

- **硬件**：支持 WebGL 的 GPU
- **软件**：Node.js 14.0+
- **操作系统**：Windows 10/11、macOS 10.14+、Linux

### 自动回退机制

如果 GPU 不可用或 GPU.js 安装失败，扫描器会自动回退到 CPU 模式。所有功能仍然完全可用。

## 🛠️ 故障排除

### 常见问题

1. **GPU 不可用**
   - **症状**：`GPU not available, falling back to CPU`
   - **解决方案**：安装 GPU.js 或使用 CPU 模式（推荐）

2. **安装失败**
   - **症状**：npm install gpu.js 失败，出现编译错误
   - **解决方案**：为您的平台安装构建工具
     - **Windows**：带有 C++ 的 Visual Studio Build Tools
     - **macOS**：`xcode-select --install`
     - **Linux**：`sudo apt-get install build-essential`

3. **性能没有提升**
   - **症状**：性能提升接近 1.0x
   - **解决方案**：增加批处理大小，调整工作线程数

4. **内存问题**
   - **症状**：`GPU memory limit exceeded`
   - **解决方案**：减少 maxMemory 和 batchSize 配置

## 📈 测试

### 测试命令

```bash
# 全面的 GPU 测试
npm run test:gpu

# GPU 功能演示
npm run demo:gpu

# 性能对比
npm run test:gpu
```

### 测试结果示例

```
=== GPU 初始化 ===
GPU accelerator initialized successfully
GPU 状态: GPU enabled

=== 性能对比 ===
GPU 模式总耗时: 40ms
CPU 模式总耗时: 100ms
性能提升: 2.5x
```

## 🎯 使用场景

### 适合使用 GPU 加速的场景

- **大型项目**：100+ 文件的项目
- **频繁扫描**：CI/CD 流水线、定期安全检查
- **复杂应用**：具有复杂安全模式的应用
- **性能关键环境**：扫描速度重要的环境

### 适合使用 CPU 模式的场景

- **小型项目**：< 50 文件的项目
- **偶尔扫描**：一次性安全检查
- **GPU 不可用**：不支持 GPU 的系统
- **资源受限环境**：低内存系统

## 📚 相关文档

- [性能优化](./performance/index.md) - 一般性能调优
- [配置指南](./configuration.md) - 完整配置选项
- [功能特性详解](./features.md) - 所有扫描器功能

## ✅ 最佳实践

1. **先测试**：运行 `npm run test:gpu` 检查 GPU 可用性
2. **使用默认值**：使用默认的 GPU 配置
3. **监控性能**：检查性能提升
4. **按需调整**：调整批处理大小和内存设置
5. **准备回退**：CPU 模式始终作为备份可用

GPU 加速是一项强大的功能，可以显著提高扫描性能，特别是对于大型项目和复杂的安全模式。通过自动回退到 CPU 模式，您可以获得两全其美 - 有 GPU 时享受速度，无 GPU 时保持可靠的 CPU 性能。