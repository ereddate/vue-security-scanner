# Distributed Scanning Guide

This guide explains how to use the distributed scanning feature of Vue Security Scanner for large projects.

## Overview

Distributed scanning allows you to distribute scan tasks across multiple workers, significantly improving performance for large codebases (10,000+ files).

## Quick Start

### 1. Start Worker(s)

```bash
# Start a worker on port 3001
vue-security-distributed worker --port 3001 --worker-id worker-1

# Start another worker on port 3002
vue-security-distributed worker --port 3002 --worker-id worker-2
```

Output:
```
Worker worker-1 starting on port 3001
Worker ready for tasks
```

### 2. Create Worker Configuration

Create a `workers.json` file:

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

### 3. Run Distributed Scan

```bash
vue-security-distributed scan /path/to/vue-project \
  --workers workers.json \
  --batch-size 10 \
  --output json \
  --report distributed-scan.json \
  --save-results
```

Output:
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

## Architecture

### Components

- **Master**: Coordinates the scan, distributes tasks, and aggregates results
- **Workers**: Execute scan tasks on assigned files
- **Task Distribution**: Smart allocation of files based on worker capacity
- **Result Aggregation**: Collects and merges results from all workers

### Flow

1. Master analyzes the project structure
2. Master creates tasks for each file
3. Master distributes tasks to workers
4. Workers process files and return results
5. Master aggregates results and generates report

## Configuration

### Worker Configuration

Workers can be configured with various options:

```bash
# With custom memory limit
vue-security-distributed worker --port 3001 --worker-id worker-1 --memory-limit 2048

# With custom concurrency
vue-security-distributed worker --port 3001 --worker-id worker-1 --concurrency 5

# With custom timeout
vue-security-distributed worker --port 3001 --worker-id worker-1 --timeout 60000
```

### Master Configuration

The master process can be configured for optimal performance:

```bash
# With custom batch size
vue-security-distributed scan /path/to/project --workers workers.json --batch-size 20

# With task timeout
vue-security-distributed scan /path/to/project --workers workers.json --task-timeout 30000

# With retry attempts
vue-security-distributed scan /path/to/project --workers workers.json --retry-attempts 3

# With result timeout
vue-security-distributed scan /path/to/project --workers workers.json --result-timeout 60000
```

## Advanced Usage

### Remote Workers

Workers can run on different machines:

1. Start workers on remote machines
2. Update `workers.json` with remote URLs
3. Run scan from master machine

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

### Load Balancing

The master automatically balances tasks based on:

- Worker availability
- Worker performance history
- File size and complexity

### Fault Tolerance

The system includes built-in fault tolerance:

- **Worker Failure**: Automatically redistributes tasks if a worker fails
- **Task Timeout**: Retries tasks that exceed time limits
- **Result Validation**: Verifies results from workers

### Monitoring

You can monitor the distributed scan process:

```bash
# With verbose output
vue-security-distributed scan /path/to/project --workers workers.json --verbose

# With progress updates every 5 seconds
vue-security-distributed scan /path/to/project --workers workers.json --progress-interval 5000
```

## Performance Optimization

### Worker Count

- **Small Projects** (100-1000 files): 1-2 workers
- **Medium Projects** (1000-10,000 files): 2-4 workers
- **Large Projects** (10,000+ files): 4+ workers

### Batch Size

- **Fast Workers**: Larger batch size (20-50)
- **Slow Workers**: Smaller batch size (5-10)
- **Network Constraints**: Smaller batch size to reduce network traffic

### Memory Management

- **Set appropriate memory limits** for workers
- **Monitor memory usage** during scans
- **Adjust concurrency** based on available memory

## API Endpoints

### Worker API

Workers expose the following endpoints:

```
GET /api/health
```

Returns the worker's health status.

```
POST /api/task
```

Accepts a task and returns results:

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

### Master API

The master provides endpoints for monitoring:

```
GET /api/scans
```

Returns a list of distributed scans.

```
GET /api/scans/:scanId
```

Returns details for a specific distributed scan.

## Troubleshooting

### Worker Connection Issues

If workers can't connect to the master:

1. Check network connectivity between machines
2. Verify firewall settings allow the configured ports
3. Ensure workers are running and responsive
4. Test worker endpoints with curl

### Task Distribution Issues

If tasks aren't being distributed properly:

1. Check that workers are registered correctly in workers.json
2. Verify worker health status
3. Check for errors in worker logs
4. Adjust batch size and timeout settings

### Result Aggregation Issues

If results aren't being aggregated correctly:

1. Check that all workers completed their tasks
2. Verify network connectivity during result submission
3. Check for errors in master logs
4. Increase result timeout if network is slow

## Best Practices

### For Teams

- **Dedicated Workers**: Set up dedicated worker machines for consistent performance
- **Automated Startup**: Use systemd or Docker to ensure workers start automatically
- **Monitoring**: Set up monitoring for worker health and performance
- **Scaling**: Add workers during peak scanning periods

### For Large Projects

- **Pre-Scan Analysis**: Analyze project structure before distributed scan
- **Optimized Batch Size**: Adjust batch size based on file types and sizes
- **Incremental Scanning**: Use incremental scanning for frequent updates
- **Report Aggregation**: Generate summary reports from distributed results

## Support

For additional help with distributed scanning:

1. Check the [README.md](../README.md) for general information
2. Open an issue in the GitHub repository
3. Contact the maintainers for enterprise support
