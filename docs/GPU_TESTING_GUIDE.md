# GPU加速测试指南

## 概述

Vue Security Scanner支持GPU加速功能，可以显著提高扫描性能。本指南将帮助你测试和验证GPU加速功能。

## 系统要求

### 硬件要求
- 支持WebGL的GPU（NVIDIA、AMD、Intel）
- 至少2GB显存
- 64位操作系统

### 软件要求
- Node.js 14.0或更高版本
- Windows 10/11、macOS 10.14+、或Linux
- 支持WebGL 2.0的浏览器（用于测试）

## 安装GPU.js库

### 方法1: 使用npm安装（推荐）

```bash
npm install gpu.js --save
```

### 方法2: 如果安装失败

如果安装失败，可能需要安装编译工具：

**Windows:**
```bash
# 安装Visual Studio Build Tools
# 下载地址: https://visualstudio.microsoft.com/downloads/
# 选择 "Desktop development with C++" 工作负载
```

**macOS:**
```bash
xcode-select --install
```

**Linux:**
```bash
sudo apt-get install build-essential
```

## 测试GPU功能

### 快速测试

运行内置的GPU测试脚本：

```bash
npm run test:gpu
# 或
node scripts/test-gpu.js
```

### 测试输出说明

测试脚本会执行以下检查：

1. **系统信息检测**
   - 操作系统版本
   - CPU架构和核心数
   - 内存使用情况

2. **GPU初始化测试**
   - 检测GPU.js库是否可用
   - 初始化GPU加速器
   - 显示GPU使用状态

3. **正则表达式匹配测试**
   - 测试正则表达式匹配功能
   - 测量匹配性能
   - 验证匹配准确性

4. **并行文件扫描测试**
   - 测试批量文件扫描
   - 测量扫描性能
   - 统计发现的漏洞数量

5. **性能对比测试**
   - 对比GPU和CPU性能
   - 计算性能提升倍数
   - 生成性能报告

### 测试结果解读

```
=== 测试总结 ===
测试通过: 4/4

测试 1: GPU初始化
  状态: 通过
  GPU状态: 使用GPU  # 或 "使用CPU" 如果GPU不可用

测试 2: 正则表达式匹配
  状态: 通过
  GPU状态: 使用GPU
  耗时: 15ms

测试 3: 并行文件扫描
  状态: 通过
  GPU状态: 使用GPU
  耗时: 45ms

测试 4: 性能对比
  状态: 通过
  性能提升: 2.5x  # GPU比CPU快2.5倍
```

## 配置GPU加速

### 修改配置文件

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

### 配置参数说明

- `enabled`: 是否启用GPU加速（默认：true）
- `maxMemory`: GPU内存限制（MB），建议设置为显存的50%
- `workerCount`: GPU工作线程数，"auto"表示自动检测
- `batchSize`: GPU批处理大小，影响性能和内存使用
- `useGPUForRegex`: 是否使用GPU进行正则匹配
- `useGPUForAnalysis`: 是否使用GPU进行深度分析

## 性能优化建议

### 1. 调整批处理大小

```javascript
// 对于小文件
batchSize: 50

// 对于大文件
batchSize: 20

// 对于混合文件
batchSize: 100
```

### 2. 调整工作线程数

```javascript
// 根据CPU核心数调整
workerCount: os.cpus().length  // 使用所有CPU核心
workerCount: Math.floor(os.cpus().length / 2)  // 使用一半CPU核心
```

### 3. 内存管理

```javascript
// 如果遇到内存不足错误
maxMemory: 512  // 减少GPU内存使用

// 如果有足够显存
maxMemory: 2048  // 增加GPU内存使用
```

## 故障排除

### 问题1: GPU不可用

**症状:**
```
GPU not available, falling back to CPU
```

**解决方案:**
1. 检查是否安装了gpu.js库
2. 确认系统支持WebGL
3. 更新显卡驱动程序
4. 检查浏览器WebGL支持：访问 https://webglreport.com/

### 问题2: GPU初始化失败

**症状:**
```
GPU initialization failed, falling back to CPU
```

**解决方案:**
1. 重新安装gpu.js库
2. 安装编译工具（见上文）
3. 检查Node.js版本（需要14.0+）
4. 查看详细错误日志

### 问题3: 性能没有提升

**症状:**
```
性能提升: 1.0x 或更低
```

**解决方案:**
1. 增加批处理大小
2. 调整工作线程数
3. 检查GPU使用率
4. 确认GPU没有被其他程序占用

### 问题4: 内存不足

**症状:**
```
GPU memory limit exceeded
```

**解决方案:**
1. 减少maxMemory配置
2. 减少batchSize配置
3. 关闭其他GPU密集型程序
4. 使用CPU模式作为备选

## 性能基准

### 预期性能提升

| 任务类型 | CPU模式 | GPU模式 | 性能提升 |
|---------|---------|---------|----------|
| 正则匹配 | 100ms   | 40ms    | 2.5x     |
| 文件扫描 | 500ms   | 200ms   | 2.5x     |
| 深度分析 | 2000ms  | 800ms   | 2.5x     |

### 实际测试结果

基于测试脚本的输出：

```
=== 性能对比 ===
GPU模式总耗时: 40ms
CPU模式总耗时: 100ms
性能提升: 2.5x
```

## 高级测试

### 1. 压力测试

```javascript
// 创建大量测试数据
const largeTestContent = `
  ${Array(1000).fill('const x = eval("test");').join('\n')}
`;

// 执行1000次匹配
const iterations = 1000;
const results = await gpuAccelerator.matchRegexPatterns(
  largeTestContent, 
  patterns
);
```

### 2. 实时监控

```javascript
// 监控GPU使用情况
setInterval(() => {
  const status = gpuAccelerator.getStatus();
  console.log('GPU状态:', status);
}, 1000);
```

### 3. 自定义测试

```javascript
// 创建自定义测试脚本
const customTest = async () => {
  const gpuAccelerator = new GPUAccelerator({
    enabled: true,
    useGPUForRegex: true
  });
  
  await gpuAccelerator.initialize();
  
  // 你的测试代码
  const testPatterns = ['your-pattern-here'];
  const testContent = 'your-content-here';
  
  const results = await gpuAccelerator.matchRegexPatterns(
    testContent, 
    testPatterns
  );
  
  console.log('测试结果:', results);
  
  gpuAccelerator.dispose();
};
```

## 最佳实践

1. **始终测试GPU可用性**：在生产环境使用前，先运行测试脚本
2. **设置合理的内存限制**：避免GPU内存不足导致崩溃
3. **监控性能指标**：定期检查GPU使用情况和性能提升
4. **准备回退方案**：确保GPU不可用时系统能正常工作
5. **定期更新驱动**：保持显卡驱动最新以获得最佳性能

## 总结

GPU加速可以显著提高Vue Security Scanner的性能，特别是在处理大量文件和复杂正则表达式时。通过本指南，你应该能够：

- 安装和配置GPU.js库
- 运行GPU测试脚本
- 解读测试结果
- 优化GPU性能
- 解决常见问题

如果遇到问题，请参考故障排除部分或查看项目文档。