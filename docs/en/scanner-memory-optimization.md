# Scanner Memory Optimization Guide

This guide provides detailed strategies for optimizing memory usage specifically for Vue Security Scanner.

## Overview

Memory optimization is critical for:
- Large Vue.js applications (10,000+ files)
- CI/CD environments with limited resources
- Scanning multiple projects sequentially
- Running the scanner alongside other processes
- Embedded systems and containers with constrained memory

## Memory Usage Analysis

### Memory Allocation

Vue Security Scanner allocates memory for:

- **File System Operations**: Reading and analyzing files
- **AST Construction**: Building Abstract Syntax Trees for code analysis
- **Rule Processing**: Executing security rules against code
- **Result Aggregation**: Collecting and processing scan results
- **Report Generation**: Creating output reports in various formats

### Memory Consumption Patterns

Typical memory consumption patterns:

| Project Size | Memory Usage |
|--------------|--------------|
| Small (100 files) | 256-512 MB |
| Medium (1,000 files) | 512 MB - 1 GB |
| Large (10,000 files) | 1-4 GB |
| Extra Large (100,000+ files) | 4-8 GB |

## Optimization Strategies

### 1. Memory Limit Configuration

Set appropriate Node.js memory limits:

```bash
# For small projects
NODE_OPTIONS=--max-old-space-size=512 vue-security-scanner .

# For medium projects
NODE_OPTIONS=--max-old-space-size=1024 vue-security-scanner .

# For large projects
NODE_OPTIONS=--max-old-space-size=4096 vue-security-scanner .

# For extra large projects
NODE_OPTIONS=--max-old-space-size=8192 vue-security-scanner .
```

### 2. Performance Profiles

Use built-in performance profiles:

```bash
# Fast profile (minimal memory, faster scans)
vue-security-scanner . --performance fast

# Balanced profile (default)
vue-security-scanner . --performance balanced

# Thorough profile (comprehensive, higher memory)
vue-security-scanner . --performance thorough
```

### 3. Batch Processing

Process files in batches to reduce peak memory usage:

```bash
# Small batch size for memory-constrained environments
vue-security-scanner . --batch-size 5

# Medium batch size (default)
vue-security-scanner . --batch-size 10

# Large batch size for memory-rich environments
vue-security-scanner . --batch-size 20
```

### 4. Selective Scanning

Limit scanning to specific directories:

```bash
# Only scan source directories
vue-security-scanner src components views

# Exclude large directories
vue-security-scanner . --ignore-dir node_modules --ignore-dir dist
```

### 5. Incremental Scanning

Use incremental scanning to only process changed files:

```bash
# Enable incremental scanning
vue-security-scanner . --incremental

# With cache directory
vue-security-scanner . --incremental --cache-dir .vue-security-cache
```

### 6. Output Format Optimization

Choose memory-efficient output formats:

```bash
# Console output (minimal memory)
vue-security-scanner . --output console

# JSON output (moderate memory)
vue-security-scanner . --output json

# Avoid HTML output for memory-constrained environments
# vue-security-scanner . --output html  # Higher memory usage
```

### 7. Rule Selection

Disable memory-intensive rules:

```json
{
  "rules": {
    "semantic": {
      "enabled": false  // Disables memory-intensive semantic analysis
    },
    "dependency": {
      "enabled": false  // Disables dependency scanning
    }
  }
}
```

## Advanced Memory Optimization

### Garbage Collection Tuning

Optimize Node.js garbage collection:

```bash
# Enable aggressive garbage collection
NODE_OPTIONS=--expose-gc vue-security-scanner . --gc-interval 3

# Set memory threshold for GC
vue-security-scanner . --memory-threshold 70
```

### Memory Monitoring

Monitor memory usage during scans:

```bash
# With memory monitoring
NODE_OPTIONS=--expose-gc vue-security-scanner . --monitor-memory

# With detailed memory logging
NODE_OPTIONS=--expose-gc vue-security-scanner . --monitor-memory --verbose
```

### Memory Profiling

Profile memory usage to identify bottlenecks:

```bash
# Generate memory profile
node --heapsnapshot-signal=SIGUSR2 bin/vue-security-scanner.js .

# Then send SIGUSR2 signal to generate heap snapshot
```

### Distributed Scanning

For very large projects, use distributed scanning:

```bash
# Start workers
vue-security-distributed worker --port 3001
vue-security-distributed worker --port 3002

# Run distributed scan
vue-security-distributed scan . --workers workers.json --batch-size 10
```

## Containerization Optimization

### Docker Memory Limits

Optimize Docker container memory usage:

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

### Kubernetes Memory Requests

Configure Kubernetes memory requests and limits:

```yaml
# kubernetes-deployment.yaml
resources:
  requests:
    memory: "512Mi"
  limits:
    memory: "1Gi"
```

## CI/CD Memory Optimization

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

## Memory Optimization Checklist

### Before Scanning

- [ ] Set appropriate memory limit based on project size
- [ ] Choose the right performance profile
- [ ] Configure batch size based on available memory
- [ ] Enable incremental scanning for repeated scans
- [ ] Exclude unnecessary directories
- [ ] Disable memory-intensive rules if not needed

### During Scanning

- [ ] Monitor memory usage to detect leaks
- [ ] Adjust batch size if memory usage is too high
- [ ] Use garbage collection tuning for long scans
- [ ] Consider distributed scanning for very large projects

### After Scanning

- [ ] Analyze memory usage patterns
- [ ] Optimize scan configuration for future runs
- [ ] Document optimal settings for your project
- [ ] Share best practices with your team

## Troubleshooting Memory Issues

### Out of Memory Errors

If you encounter "JavaScript heap out of memory" errors:

1. **Increase memory limit**: `NODE_OPTIONS=--max-old-space-size=4096`
2. **Use faster profile**: `--performance fast`
3. **Reduce batch size**: `--batch-size 5`
4. **Enable incremental scanning**: `--incremental`
5. **Use distributed scanning**: For very large projects

### Memory Leaks

If memory usage grows indefinitely:

1. **Enable garbage collection**: `--gc-interval 3`
2. **Set memory threshold**: `--memory-threshold 70`
3. **Update scanner**: Ensure you're using the latest version
4. **Report issue**: If leak persists, report to maintainers

### Slow Scanning

If scanning is too slow due to memory constraints:

1. **Increase memory limit**: If possible
2. **Use faster profile**: `--performance fast`
3. **Adjust batch size**: Larger batch size for more memory
4. **Enable caching**: `--cache-dir .vue-security-cache`

## Best Practices by Project Size

### Small Projects (100-1,000 files)

- **Memory Limit**: 512 MB
- **Performance Profile**: balanced
- **Batch Size**: 10
- **Incremental Scanning**: Optional

### Medium Projects (1,000-10,000 files)

- **Memory Limit**: 1-2 GB
- **Performance Profile**: balanced or fast
- **Batch Size**: 10-15
- **Incremental Scanning**: Recommended

### Large Projects (10,000+ files)

- **Memory Limit**: 4+ GB
- **Performance Profile**: fast for CI, thorough for development
- **Batch Size**: 5-10 (smaller for better memory management)
- **Incremental Scanning**: Required
- **Distributed Scanning**: Recommended

## Enterprise Memory Optimization

### Dedicated Scanning Infrastructure

For enterprise environments:

1. **Dedicated Servers**: Allocate dedicated resources for scanning
2. **Memory Monitoring**: Implement memory usage monitoring
3. **Auto-Scaling**: Scale resources based on project size
4. **Distributed Architecture**: Use multiple workers for large codebases
5. **Caching Strategy**: Implement comprehensive caching

### Enterprise Configuration

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

## Support

For additional memory optimization assistance:

1. **Documentation**: Review this guide and other optimization docs
2. **GitHub Issues**: Report memory-related issues
3. **Enterprise Support**: Contact enterprise support for premium assistance
4. **Community Forum**: Ask questions in the community forum
