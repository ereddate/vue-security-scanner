# GPU Acceleration

Vue Security Scanner now supports GPU acceleration to significantly improve scanning performance. This guide explains how to use and configure GPU acceleration.

## 🚀 Quick Start

### Enable GPU Acceleration

GPU acceleration is enabled by default. The scanner will automatically detect if GPU is available and use it for acceleration.

```bash
# Run scan with GPU acceleration (default)
npm run scan

# Check GPU status during scan
npm run scan 2>&1 | grep GPU
```

### Test GPU Functionality

```bash
# Run comprehensive GPU test
npm run test:gpu

# Run GPU demo
npm run demo:gpu
```

## ⚙️ Configuration

### Configuration Options

Add GPU configuration to your `vue-security-scanner.config.json`:

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

### Configuration Parameters

| Parameter | Description | Default |
|-----------|-------------|---------|
| `enabled` | Whether to enable GPU acceleration | `true` |
| `maxMemory` | GPU memory limit (MB) | `1024` |
| `workerCount` | Number of GPU workers | `"auto"` |
| `batchSize` | GPU batch size | `100` |
| `useGPUForRegex` | Use GPU for regex matching | `true` |
| `useGPUForAnalysis` | Use GPU for deep analysis | `false` |

## 📊 Performance Benefits

### Expected Performance Improvement

| Task Type | CPU Mode | GPU Mode | Improvement |
|-----------|----------|----------|-------------|
| Regex Matching | 100ms | 40ms | 2.5x |
| File Scanning | 500ms | 200ms | 2.5x |
| Deep Analysis | 2000ms | 800ms | 2.5x |

### Real-world Benefits

- **Large Projects**: 2-3x faster scanning for projects with 100+ files
- **Complex Regex**: Significantly faster matching for complex security patterns
- **CI/CD Integration**: Reduced build times in continuous integration pipelines

## 🔧 Installation (Optional)

To enable GPU acceleration, you may need to install the GPU.js library:

```bash
npm install gpu.js --save
```

### System Requirements

- **Hardware**: GPU with WebGL support
- **Software**: Node.js 14.0+
- **Operating System**: Windows 10/11, macOS 10.14+, Linux

### Fallback Mechanism

If GPU is not available or GPU.js installation fails, the scanner will automatically fallback to CPU mode. All functionality remains fully operational.

## 🛠️ Troubleshooting

### Common Issues

1. **GPU Not Available**
   - **Symptom**: `GPU not available, falling back to CPU`
   - **Solution**: Install GPU.js or use CPU mode (recommended)

2. **Installation Failed**
   - **Symptom**: npm install gpu.js fails with compilation errors
   - **Solution**: Install build tools for your platform
     - **Windows**: Visual Studio Build Tools with C++
     - **macOS**: `xcode-select --install`
     - **Linux**: `sudo apt-get install build-essential`

3. **No Performance Improvement**
   - **Symptom**: Performance improvement close to 1.0x
   - **Solution**: Increase batch size, adjust worker count

4. **Memory Issues**
   - **Symptom**: `GPU memory limit exceeded`
   - **Solution**: Reduce maxMemory and batchSize configuration

## 📈 Testing

### Test Commands

```bash
# Comprehensive GPU test
npm run test:gpu

# GPU functionality demo
npm run demo:gpu

# Performance comparison
npm run test:gpu
```

### Test Results Example

```
=== GPU Initialization ===
GPU accelerator initialized successfully
GPU status: GPU enabled

=== Performance Comparison ===
GPU mode total time: 40ms
CPU mode total time: 100ms
Performance improvement: 2.5x
```

## 🎯 Use Cases

### When to Use GPU Acceleration

- **Large Projects**: Projects with 100+ files
- **Frequent Scans**: CI/CD pipelines, regular security checks
- **Complex Applications**: Applications with complex security patterns
- **Performance-Critical Environments**: Where scan speed is important

### When to Use CPU Mode

- **Small Projects**: Projects with < 50 files
- **Occasional Scans**: One-time security checks
- **GPU Unavailable**: Systems without GPU support
- **Resource-Constrained Environments**: Low-memory systems

## 📚 Related Documentation

- [Performance Optimization](./performance/index.md) - General performance tuning
- [Configuration Guide](./configuration.md) - Complete configuration options
- [Features Guide](./features.md) - All scanner features

## ✅ Best Practices

1. **Test First**: Run `npm run test:gpu` to check GPU availability
2. **Start with Defaults**: Use default GPU configuration
3. **Monitor Performance**: Check performance improvement
4. **Adjust as Needed**: Tune batch size and memory settings
5. **Fallback Ready**: CPU mode is always available as backup

GPU acceleration is a powerful feature that can significantly improve scanning performance, especially for large projects and complex security patterns. With automatic fallback to CPU mode, you get the best of both worlds - GPU speed when available, and reliable CPU performance when not.