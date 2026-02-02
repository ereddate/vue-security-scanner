# GPU加速安装和使用指南

## 快速开始

### 1. 测试当前GPU状态

```bash
npm run test:gpu
```

这将显示：
- 系统信息（CPU、内存等）
- GPU是否可用
- 性能测试结果

### 2. 安装GPU.js库

如果测试显示GPU不可用，可以尝试安装GPU.js：

```bash
npm install gpu.js --save
```

### 3. 重新测试

安装完成后，再次运行测试：

```bash
npm run test:gpu
```

## 配置GPU加速

### 方法1: 使用配置文件

编辑 `vue-security-scanner.config.json`：

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

### 方法2: 使用命令行参数

```bash
npm run scan -- --gpu.enabled=true --gpu.maxMemory=1024
```

## 使用GPU加速扫描

### 启用GPU扫描

```bash
npm run scan
```

扫描器会自动检测GPU并使用它进行加速。

### 查看GPU状态

扫描时会显示GPU状态：

```
GPU accelerator status: GPU enabled  # GPU可用
GPU accelerator status: CPU fallback   # GPU不可用，使用CPU
```

## 常见问题

### Q: GPU不可用怎么办？

A: 系统会自动回退到CPU模式，扫描仍然可以正常进行。如果需要GPU加速：

1. 确认显卡支持WebGL
2. 更新显卡驱动
3. 安装GPU.js库
4. 检查Node.js版本（需要14.0+）

### Q: 如何确认GPU正在使用？

A: 运行测试脚本，查看输出中的"GPU状态"：

```bash
npm run test:gpu
```

如果显示"使用GPU"，则GPU加速正在工作。

### Q: GPU加速能提升多少性能？

A: 根据测试，GPU加速通常能提升2-3倍的性能。具体提升取决于：

- 文件大小和数量
- 正则表达式复杂度
- GPU性能
- 系统配置

### Q: 安装GPU.js失败怎么办？

A: 如果安装失败，系统会自动使用CPU模式。你可以：

1. 安装Visual Studio Build Tools（Windows）
2. 运行 `xcode-select --install`（macOS）
3. 安装 `build-essential`（Linux）

或者直接使用CPU模式，功能完全正常。

## 性能优化

### 调整批处理大小

对于小文件：
```json
{
  "performance": {
    "gpu": {
      "batchSize": 50
    }
  }
}
```

对于大文件：
```json
{
  "performance": {
    "gpu": {
      "batchSize": 20
    }
  }
}
```

### 调整内存限制

如果遇到内存不足：
```json
{
  "performance": {
    "gpu": {
      "maxMemory": 512
    }
  }
}
```

## 测试命令总结

```bash
# 测试GPU功能
npm run test:gpu

# 运行扫描（自动使用GPU）
npm run scan

# 查看GPU状态
npm run scan 2>&1 | grep GPU
```

## 更多信息

详细的GPU测试指南请参考：[GPU_TESTING_GUIDE.md](GPU_TESTING_GUIDE.md)