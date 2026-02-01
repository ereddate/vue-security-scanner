# Memory Optimization Guide

This guide provides strategies for optimizing memory usage when running Vue Security Scanner on large projects.

## Overview

Memory optimization is crucial for:
- Large codebases (10,000+ files)
- CI/CD environments with limited resources
- Scanning multiple projects sequentially
- Running the scanner alongside other processes

## Memory Usage Factors

Several factors affect memory usage:

- **Project Size**: Number of files and total code size
- **Scan Depth**: How deep the scanner traverses directories
- **Rule Complexity**: Number and complexity of security rules
- **Output Format**: Detailed formats require more memory
- **Semantic Analysis**: AST-based analysis is memory-intensive

## Configuration Options

### Memory Limit

Set the Node.js memory limit:

```bash
# Increase memory limit to 4GB
NODE_OPTIONS=--max-old-space-size=4096 vue-security-scanner .

# Increase memory limit to 8GB
NODE_OPTIONS=--max-old-space-size=8192 vue-security-scanner .
```

### Performance Profile

Use a performance profile optimized for memory:

```bash
# Use fast profile (minimal memory usage)
vue-security-scanner . --performance fast

# Use balanced profile (default)
vue-security-scanner . --performance balanced

# Use thorough profile (higher memory usage)
vue-security-scanner . --performance thorough
```

### Batch Processing

Process files in batches to reduce memory usage:

```bash
# Set batch size to 10 files
vue-security-scanner . --batch-size 10

# Set batch size to 5 files for very large projects
vue-security-scanner . --batch-size 5
```

### Memory Threshold

Set a memory threshold to trigger garbage collection:

```bash
# Trigger GC when memory usage reaches 80%
vue-security-scanner . --memory-threshold 80

# More aggressive GC
vue-security-scanner . --memory-threshold 70
```

### Garbage Collection Interval

Set how often to run garbage collection:

```bash
# Run GC every 5 batches
vue-security-scanner . --gc-interval 5

# Run GC every 3 batches
vue-security-scanner . --gc-interval 3
```

## Advanced Options

### Incremental Scanning

Only scan modified files to reduce memory usage:

```bash
# Enable incremental scanning
vue-security-scanner . --incremental
```

### Selective Scanning

Limit scanning to specific directories:

```bash
# Only scan src directory
vue-security-scanner src

# Only scan specific subdirectories
vue-security-scanner src/components src/views
```

### Reduced Rule Set

Disable memory-intensive rules:

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

### Output Format Optimization

Use memory-efficient output formats:

```bash
# Use console output (minimal memory)
vue-security-scanner . --output console

# Use JSON output (moderate memory)
vue-security-scanner . --output json

# Avoid HTML output for memory-constrained environments
# vue-security-scanner . --output html  # Higher memory usage
```

## Distributed Scanning

For very large projects, use distributed scanning:

1. Start workers on multiple machines
2. Distribute scan tasks
3. Aggregate results

See the [Distributed Scanning Guide](./distributed-scanning.md) for details.

## CI/CD Optimization

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

## Monitoring Memory Usage

### Process Monitoring

Monitor memory usage during scanning:

```bash
# Run with memory monitoring
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

### Memory Profiling

Use Node.js built-in profiler:

```bash
# Generate memory profile
node --heapsnapshot-signal=SIGUSR2 -e "
  const scanner = require('vue-security-scanner');
  scanner.scan('.').then(() => {
    console.log('Scan completed');
  });
"
```

Then send SIGUSR2 signal to generate heap snapshot.

## Best Practices

### For Large Projects

1. **Use distributed scanning** for very large codebases
2. **Increase memory limit** based on project size
3. **Use batch processing** to reduce peak memory usage
4. **Enable incremental scanning** for subsequent scans
5. **Monitor memory usage** during CI/CD runs

### For CI/CD Environments

1. **Set appropriate memory limits** in CI configuration
2. **Use fast performance profile** for quicker scans
3. **Adjust batch size** based on available memory
4. **Implement memory thresholds** to prevent OOM errors
5. **Consider resource class** upgrades for very large projects

### For Development Machines

1. **Use balanced profile** for best balance of speed and memory
2. **Set reasonable memory limits** based on system RAM
3. **Enable semantic analysis** for more accurate results
4. **Use incremental scanning** for faster development cycles

## Troubleshooting

### Out of Memory Errors

If you encounter "JavaScript heap out of memory" errors:

1. **Increase memory limit**: `NODE_OPTIONS=--max-old-space-size=4096`
2. **Use fast profile**: `--performance fast`
3. **Reduce batch size**: `--batch-size 5`
4. **Enable incremental scanning**: `--incremental`
5. **Use distributed scanning** for very large projects

### Memory Leaks

If memory usage grows indefinitely:

1. **Enable garbage collection**: `--gc-interval 3`
2. **Set memory threshold**: `--memory-threshold 70`
3. **Check for infinite loops** in custom rules
4. **Update to latest version** of the scanner

### Slow Scanning

If scanning is too slow due to memory constraints:

1. **Use fast profile**: `--performance fast`
2. **Increase batch size**: `--batch-size 20`
3. **Disable semantic analysis**: Set `enableSemanticAnalysis: false` in config
4. **Use incremental scanning**: `--incremental`

## Memory Optimization Checklist

- [ ] Set appropriate Node.js memory limit
- [ ] Choose the right performance profile
- [ ] Configure batch processing for large projects
- [ ] Enable incremental scanning for frequent scans
- [ ] Monitor memory usage during scans
- [ ] Adjust settings based on project size
- [ ] Consider distributed scanning for very large projects

## Support

For additional memory optimization assistance, please open an issue in the GitHub repository.
