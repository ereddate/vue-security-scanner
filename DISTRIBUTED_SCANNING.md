# Distributed Scanning Guide

This guide explains how to use Vue Security Scanner's distributed scanning capabilities for large-scale enterprise projects.

## Overview

Distributed scanning allows you to:
- Scan large projects (10,000+ files) efficiently by distributing work across multiple workers
- Reduce scan time through parallel processing
- Scale scanning capacity by adding more workers
- Monitor scan progress in real-time
- Aggregate results from multiple workers

## Architecture

```
┌─────────────────┐
│  Coordinator    │
│  (Main Scanner) │
└────────┬────────┘
         │
         ├─────────────┬─────────────┬─────────────┐
         │             │             │             │
    ┌────▼────┐  ┌───▼────┐  ┌───▼────┐  ┌───▼────┐
    │ Worker 1│  │Worker 2│  │Worker 3│  │Worker N│
    └─────────┘  └────────┘  └────────┘  └────────┘
         │             │             │             │
         └─────────────┴─────────────┴─────────────┘
                            │
                    ┌───────▼────────┐
                    │ Result Aggregator│
                    └────────────────┘
```

## Installation

```bash
npm install -g vue-security-scanner
```

## Quick Start

### 1. Start a Worker

Start a distributed scan worker on port 3001:

```bash
vue-security-distributed worker --port 3001 --worker-id worker-1
```

Output:
```
Distributed scan worker started: worker-1
Listening on port: 3001
Health check: http://localhost:3001/health
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
    },
    {
      "id": "worker-3",
      "url": "http://localhost:3003"
    }
  ]
}
```

### 3. Run Distributed Scan

Scan a project using distributed workers:

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
Starting distributed security scan...
Found 1500 files to scan
Created 150 tasks
Distributed tasks across 3 workers
Executing 50 tasks on worker worker-1
Executing 50 tasks on worker worker-2
Executing 50 tasks on worker worker-3
...
Scan report saved to: distributed-scan.json
Scan result saved to database: scan-1234567890-0
```

## CLI Commands

### scan

Scan a Vue project using distributed workers.

```bash
vue-security-distributed scan <project-path> [options]
```

**Options:**
- `-w, --workers <workers>`: Number of workers or worker config file (default: 1)
- `-b, --batch-size <size>`: Batch size for task distribution (default: 10)
- `-o, --output <format>`: Output format - json or text (default: json)
- `-r, --report <path>`: Report file path (default: security-report.json)
- `--save-results`: Save scan results to database

**Examples:**

```bash
# Use 4 local workers
vue-security-distributed scan ./my-project --workers 4

# Use worker configuration file
vue-security-distributed scan ./my-project --workers workers.json

# Custom batch size and save results
vue-security-distributed scan ./my-project \
  --workers workers.json \
  --batch-size 20 \
  --save-results
```

### worker

Start a distributed scan worker.

```bash
vue-security-distributed worker [options]
```

**Options:**
- `-p, --port <port>`: Worker port (default: 3001)
- `-i, --worker-id <id>`: Worker ID (default: worker-1)

**Examples:**

```bash
# Start worker on default port
vue-security-distributed worker

# Start worker on custom port
vue-security-distributed worker --port 4000 --worker-id worker-2
```

### status

Get status of a distributed scan.

```bash
vue-security-distributed status <scan-id>
```

**Example:**

```bash
vue-security-distributed status scan-1234567890-0
```

Output:
```
=== Scan Status ===
Scan ID: scan-1234567890-0
Scanned At: 2024-01-15T10:30:00.000Z
Files Scanned: 1500
Total Vulnerabilities: 45
High Severity: 12
Medium Severity: 23
Low Severity: 10
Workers: 3
Progress: 100.00%
```

### list

List all scan results.

```bash
vue-security-distributed list [options]
```

**Options:**
- `-l, --limit <limit>`: Limit results (default: 10)
- `-o, --offset <offset>`: Offset results (default: 0)

**Example:**

```bash
# List last 10 scans
vue-security-distributed list

# List 50 scans with offset
vue-security-distributed list --limit 50 --offset 10
```

### stats

Get vulnerability statistics.

```bash
vue-security-distributed stats
```

Output:
```
=== Vulnerability Statistics ===
Total Scans: 25
Total Vulnerabilities: 1,234
High Severity: 156
Medium Severity: 456
Low Severity: 622
Average per Scan: 49.36

=== Most Vulnerable Projects ===
1. /projects/app-frontend: 234 vulnerabilities
2. /projects/admin-panel: 189 vulnerabilities
3. /projects/user-portal: 156 vulnerabilities

=== 30-Day Trend ===
2024-01-10: 45 vulnerabilities (3 scans)
2024-01-11: 52 vulnerabilities (4 scans)
2024-01-12: 38 vulnerabilities (2 scans)
...
```

### cleanup

Clean up old scan results.

```bash
vue-security-distributed cleanup [options]
```

**Options:**
- `-d, --days <days>`: Days to keep (default: 90)

**Example:**

```bash
# Keep results from last 30 days only
vue-security-distributed cleanup --days 30
```

## Worker Configuration

### Local Workers

For local parallel processing without network overhead:

```bash
# Start 4 local workers
vue-security-distributed scan ./my-project --workers 4
```

### Remote Workers

For distributed scanning across multiple machines:

1. Start workers on different machines:

```bash
# Machine 1
vue-security-distributed worker --port 3001 --worker-id worker-1

# Machine 2
vue-security-distributed worker --port 3002 --worker-id worker-2

# Machine 3
vue-security-distributed worker --port 3003 --worker-id worker-3
```

2. Create `workers.json`:

```json
{
  "workers": [
    {
      "id": "worker-1",
      "url": "http://machine1:3001"
    },
    {
      "id": "worker-2",
      "url": "http://machine2:3002"
    },
    {
      "id": "worker-3",
      "url": "http://machine3:3003"
    }
  ]
}
```

3. Run distributed scan:

```bash
vue-security-distributed scan ./my-project --workers workers.json
```

## Performance Tuning

### Batch Size

Adjust batch size based on file size and worker capacity:

```bash
# Small files (< 100KB): larger batches
vue-security-distributed scan ./my-project --workers 4 --batch-size 20

# Large files (> 100KB): smaller batches
vue-security-distributed scan ./my-project --workers 4 --batch-size 5
```

### Worker Count

Optimal worker count depends on:
- Number of CPU cores
- Available memory
- Network bandwidth (for remote workers)

```bash
# CPU-bound: use number of cores
vue-security-distributed scan ./my-project --workers 8

# Memory-bound: use fewer workers
vue-security-distributed scan ./my-project --workers 4
```

### Memory Management

Workers automatically manage memory, but you can tune:

```javascript
// In worker configuration
{
  "distributed": {
    "batchSize": 10,
    "taskTimeout": 300000,  // 5 minutes
    "maxRetries": 3
  }
}
```

## Advanced Configuration

### Custom Worker Configuration

Create `vue-security-distributed.config.json`:

```json
{
  "distributed": {
    "batchSize": 10,
    "taskTimeout": 300000,
    "maxRetries": 3
  },
  "storage": {
    "storagePath": ".vue-security-data",
    "maxIndexSize": 1000
  }
}
```

### Task Distribution Strategy

The scanner uses round-robin distribution by default. You can customize:

```javascript
const scanner = new DistributedScanner({
  distributed: {
    batchSize: 10,
    taskTimeout: 300000,
    maxRetries: 3
  }
});
```

## Monitoring

### Real-time Progress

Monitor scan progress using the dashboard:

```bash
npm run dashboard
```

Or check status via CLI:

```bash
vue-security-distributed status <scan-id>
```

### Worker Health

Check worker health:

```bash
curl http://localhost:3001/health
```

Response:
```json
{
  "status": "healthy",
  "workerId": "worker-1",
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

## Troubleshooting

### Worker Not Responding

If a worker times out:

```bash
# Check worker status
curl http://localhost:3001/health

# Restart worker
vue-security-distributed worker --port 3001 --worker-id worker-1
```

### Scan Fails

If scan fails, check:

1. Worker logs for errors
2. Network connectivity (for remote workers)
3. Disk space for result storage
4. Memory usage

### Slow Scans

To improve scan speed:

1. Increase batch size (if memory allows)
2. Add more workers
3. Use local workers instead of remote
4. Exclude unnecessary directories

## Best Practices

1. **Start with local workers** for testing
2. **Use remote workers** for large projects
3. **Monitor worker health** regularly
4. **Clean up old results** periodically
5. **Save scan results** for trend analysis
6. **Use appropriate batch sizes** based on file sizes

## Integration with CI/CD

### GitHub Actions

```yaml
name: Distributed Security Scan

on:
  push:
    branches: [ main ]

jobs:
  security-scan:
    runs-on: ubuntu-latest
    strategy:
      matrix:
        worker: [1, 2, 3]
    steps:
    - uses: actions/checkout@v4
    - run: npm install -g vue-security-scanner
    - run: vue-security-distributed worker --port ${{ matrix.worker * 1000 + 2000 }} --worker-id worker-${{ matrix.worker }} &
    - run: sleep 10
    - run: |
        vue-security-distributed scan . \
          --workers 3 \
          --save-results \
          --report security-report.json
```

## API Reference

### Worker API

#### POST /api/scan

Execute a scan task.

**Request:**
```json
{
  "task": {
    "id": "task-123",
    "files": ["/path/to/file1.vue", "/path/to/file2.vue"]
  },
  "options": {
    "output": {
      "format": "json"
    }
  }
}
```

**Response:**
```json
{
  "success": true,
  "taskId": "task-123",
  "vulnerabilities": [...],
  "scannedAt": "2024-01-15T10:30:00.000Z"
}
```

#### GET /health

Check worker health.

**Response:**
```json
{
  "status": "healthy",
  "workerId": "worker-1",
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

## Support

For issues and questions:
- GitHub Issues: https://github.com/ereddate/vue-security-scanner/issues
- Documentation: https://github.com/ereddate/vue-security-scanner#readme
