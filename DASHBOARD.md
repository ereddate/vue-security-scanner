# Vue Security Dashboard Guide

This guide explains how to use the Vue Security Dashboard for real-time security monitoring and vulnerability tracking.

## Overview

The Vue Security Dashboard provides:
- Real-time vulnerability statistics
- Interactive trend charts
- Scan result management
- Project-level security tracking
- RESTful API for integration

## Quick Start

### 1. Start the Dashboard Server

```bash
npm run dashboard
```

Or directly:

```bash
node dashboard/server.js
```

Output:
```
Vue Security Dashboard API running on port 3000
Dashboard: http://localhost:3000
API: http://localhost:3000/api
```

### 2. Open the Dashboard

Open your browser and navigate to:

```
http://localhost:3000
```

You'll see:
- Total scans count
- Total vulnerabilities
- High/Medium/Low severity breakdown
- 30-day vulnerability trend
- Severity distribution chart
- Recent scans table

## Dashboard Features

### Statistics Overview

The dashboard displays key security metrics:

- **Total Scans**: Number of security scans performed
- **Total Vulnerabilities**: Total vulnerabilities found across all scans
- **High Severity**: Count of high-severity vulnerabilities
- **Average per Scan**: Average vulnerabilities per scan

### Vulnerability Trend

A line chart showing vulnerability trends over the last 30 days:
- Total vulnerabilities per day
- High-severity vulnerabilities per day
- Scan count per day

### Severity Distribution

A doughnut chart showing the distribution of vulnerabilities by severity:
- High (red)
- Medium (orange)
- Low (green)

### Recent Scans Table

A table showing the most recent scans:
- Scan ID
- Date and time
- Total vulnerabilities
- High/Medium/Low breakdown
- Actions (view details, delete)

## API Reference

### Base URL

```
http://localhost:3000/api
```

### Endpoints

#### GET /api/health

Check API health status.

**Response:**
```json
{
  "status": "healthy",
  "timestamp": "2024-01-15T10:30:00.000Z",
  "version": "1.3.1"
}
```

#### GET /api/scans

Get list of scan results.

**Query Parameters:**
- `limit` (optional): Number of results to return (default: 10)
- `offset` (optional): Offset for pagination (default: 0)

**Example:**
```bash
curl http://localhost:3000/api/scans?limit=20&offset=0
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "scanId": "scan-1234567890-0",
      "scannedAt": "2024-01-15T10:30:00.000Z",
      "summary": {
        "filesScanned": 1500,
        "totalVulnerabilities": 45,
        "highSeverity": 12,
        "mediumSeverity": 23,
        "lowSeverity": 10
      },
      "projectPath": "/projects/my-vue-app"
    }
  ],
  "count": 1
}
```

#### GET /api/scans/:scanId

Get details of a specific scan.

**Example:**
```bash
curl http://localhost:3000/api/scans/scan-1234567890-0
```

**Response:**
```json
{
  "success": true,
  "data": {
    "scanId": "scan-1234567890-0",
    "summary": {
      "filesScanned": 1500,
      "totalVulnerabilities": 45,
      "highSeverity": 12,
      "mediumSeverity": 23,
      "lowSeverity": 10
    },
    "vulnerabilities": [
      {
        "ruleId": "xss-v-html",
        "severity": "High",
        "file": "/projects/my-vue-app/src/components/UserInput.vue",
        "line": 25,
        "description": "Using v-html can lead to XSS vulnerabilities",
        "recommendation": "Avoid using v-html with user-provided content"
      }
    ],
    "scannedAt": "2024-01-15T10:30:00.000Z",
    "projectPath": "/projects/my-vue-app",
    "workers": [
      {
        "id": "worker-1",
        "status": "idle",
        "lastSeen": "2024-01-15T10:35:00.000Z"
      }
    ],
    "progress": {
      "total": 150,
      "completed": 150,
      "failed": 0,
      "running": 0,
      "pending": 0,
      "progress": "100.00"
    }
  }
}
```

#### POST /api/scans

Start a new scan.

**Request Body:**
```json
{
  "projectPath": "/path/to/vue-project",
  "options": {
    "output": {
      "format": "json",
      "showProgress": true
    },
    "distributed": {
      "batchSize": 10
    }
  }
}
```

**Example:**
```bash
curl -X POST http://localhost:3000/api/scans \
  -H "Content-Type: application/json" \
  -d '{
    "projectPath": "/projects/my-vue-app",
    "options": {
      "output": {
        "format": "json"
      }
    }
  }'
```

**Response:**
```json
{
  "success": true,
  "data": {
    "scanId": "scan-1234567890-1",
    "summary": {
      "filesScanned": 1500,
      "totalVulnerabilities": 45,
      "highSeverity": 12,
      "mediumSeverity": 23,
      "lowSeverity": 10
    },
    "vulnerabilities": [...],
    "scannedAt": "2024-01-15T10:40:00.000Z"
  }
}
```

#### GET /api/stats

Get vulnerability statistics.

**Example:**
```bash
curl http://localhost:3000/api/stats
```

**Response:**
```json
{
  "success": true,
  "data": {
    "totalScans": 25,
    "totalVulnerabilities": 1234,
    "totalHighSeverity": 156,
    "totalMediumSeverity": 456,
    "totalLowSeverity": 622,
    "avgVulnerabilitiesPerScan": 49.36,
    "mostVulnerableProjects": [
      {
        "projectPath": "/projects/app-frontend",
        "count": 234
      },
      {
        "projectPath": "/projects/admin-panel",
        "count": 189
      }
    ],
    "vulnerabilityTrend": [
      {
        "date": "2024-01-10",
        "totalVulnerabilities": 45,
        "highSeverity": 12,
        "mediumSeverity": 23,
        "lowSeverity": 10,
        "scans": 3
      }
    ]
  }
}
```

#### GET /api/trend

Get vulnerability trend data.

**Query Parameters:**
- `days` (optional): Number of days to include (default: 30)

**Example:**
```bash
curl http://localhost:3000/api/trend?days=30
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "date": "2024-01-10",
      "totalVulnerabilities": 45,
      "highSeverity": 12,
      "mediumSeverity": 23,
      "lowSeverity": 10,
      "scans": 3
    },
    {
      "date": "2024-01-11",
      "totalVulnerabilities": 52,
      "highSeverity": 15,
      "mediumSeverity": 25,
      "lowSeverity": 12,
      "scans": 4
    }
  ]
}
```

#### GET /api/projects

Get list of all scanned projects.

**Example:**
```bash
curl http://localhost:3000/api/projects
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "projectPath": "/projects/my-vue-app",
      "scans": 5,
      "totalVulnerabilities": 234,
      "highSeverity": 56,
      "mediumSeverity": 123,
      "lowSeverity": 55,
      "lastScan": "2024-01-15T10:30:00.000Z"
    },
    {
      "projectPath": "/projects/admin-panel",
      "scans": 3,
      "totalVulnerabilities": 189,
      "highSeverity": 45,
      "mediumSeverity": 89,
      "lowSeverity": 55,
      "lastScan": "2024-01-14T15:20:00.000Z"
    }
  ]
}
```

#### DELETE /api/scans/:scanId

Delete a specific scan result.

**Example:**
```bash
curl -X DELETE http://localhost:3000/api/scans/scan-1234567890-0
```

**Response:**
```json
{
  "success": true,
  "message": "Scan scan-1234567890-0 deleted"
}
```

#### POST /api/cleanup

Clean up old scan results.

**Request Body:**
```json
{
  "days": 90
}
```

**Example:**
```bash
curl -X POST http://localhost:3000/api/cleanup \
  -H "Content-Type: application/json" \
  -d '{"days": 90}'
```

**Response:**
```json
{
  "success": true,
  "message": "Cleaned up 15 old scan results"
}
```

## Usage Examples

### Starting a New Scan from Dashboard

1. Click "New Scan" button
2. Enter project path (e.g., `/projects/my-vue-app`)
3. Click "Start Scan"
4. Monitor progress in real-time
5. View results when scan completes

### Viewing Scan Details

1. Find scan in "Recent Scans" table
2. Click scan ID to view details
3. Review vulnerabilities by severity
4. Check file locations and recommendations

### Deleting a Scan

1. Find scan in "Recent Scans" table
2. Click "Delete" button
3. Confirm deletion
4. Scan is removed from database

## Integration Examples

### JavaScript/Node.js

```javascript
const API_BASE = 'http://localhost:3000/api';

async function startScan(projectPath) {
  const response = await fetch(`${API_BASE}/scans`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ projectPath })
  });
  return await response.json();
}

async function getScanResults(scanId) {
  const response = await fetch(`${API_BASE}/scans/${scanId}`);
  return await response.json();
}

async function getStats() {
  const response = await fetch(`${API_BASE}/stats`);
  return await response.json();
}

// Usage
const scan = await startScan('/projects/my-vue-app');
console.log('Scan started:', scan.data.scanId);

const stats = await getStats();
console.log('Total vulnerabilities:', stats.data.totalVulnerabilities);
```

### Python

```python
import requests

API_BASE = 'http://localhost:3000/api'

def start_scan(project_path):
    response = requests.post(f'{API_BASE}/scans', json={
        'projectPath': project_path
    })
    return response.json()

def get_scan_results(scan_id):
    response = requests.get(f'{API_BASE}/scans/{scan_id}')
    return response.json()

def get_stats():
    response = requests.get(f'{API_BASE}/stats')
    return response.json()

# Usage
scan = start_scan('/projects/my-vue-app')
print(f'Scan started: {scan["data"]["scanId"]}')

stats = get_stats()
print(f'Total vulnerabilities: {stats["data"]["totalVulnerabilities"]}')
```

### cURL

```bash
# Start a scan
curl -X POST http://localhost:3000/api/scans \
  -H "Content-Type: application/json" \
  -d '{"projectPath": "/projects/my-vue-app"}'

# Get scan results
curl http://localhost:3000/api/scans/scan-1234567890-0

# Get statistics
curl http://localhost:3000/api/stats

# Get trend data
curl http://localhost:3000/api/trend?days=30

# Delete a scan
curl -X DELETE http://localhost:3000/api/scans/scan-1234567890-0
```

## Configuration

### Environment Variables

- `PORT`: Dashboard server port (default: 3000)

Example:
```bash
PORT=8080 npm run dashboard
```

### Storage Configuration

Scan results are stored in `.vue-security-data` directory by default.

To customize storage:

```javascript
const aggregator = new ResultAggregator({
  storagePath: '/custom/path/to/data',
  maxIndexSize: 1000
});
```

## Deployment

### Docker

Create `Dockerfile.dashboard`:

```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install --production

COPY . .

EXPOSE 3000

CMD ["node", "dashboard/server.js"]
```

Build and run:

```bash
docker build -f Dockerfile.dashboard -t vue-security-dashboard .
docker run -p 3000:3000 -v $(pwd)/.vue-security-data:/app/.vue-security-data vue-security-dashboard
```

### Docker Compose

```yaml
version: '3.8'

services:
  dashboard:
    build:
      context: .
      dockerfile: Dockerfile.dashboard
    ports:
      - "3000:3000"
    volumes:
      - ./data:/app/.vue-security-data
    environment:
      - PORT=3000
    restart: unless-stopped
```

Run:

```bash
docker-compose up -d
```

### Production Deployment

For production deployment:

1. Use a reverse proxy (nginx, Apache)
2. Enable HTTPS
3. Set up authentication
4. Configure CORS appropriately
5. Use a process manager (PM2, systemd)

Example nginx configuration:

```nginx
server {
    listen 80;
    server_name security-dashboard.example.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

## Security Considerations

1. **Authentication**: Add authentication to protect the API
2. **CORS**: Configure CORS appropriately for your environment
3. **HTTPS**: Use HTTPS in production
4. **Rate Limiting**: Implement rate limiting to prevent abuse
5. **Input Validation**: Validate all input parameters

## Troubleshooting

### Dashboard Not Loading

Check if the server is running:

```bash
curl http://localhost:3000/api/health
```

### Scan Results Not Showing

Check if results are being saved:

```bash
ls -la .vue-security-data/
```

### API Errors

Check server logs for error messages.

## Support

For issues and questions:
- GitHub Issues: https://github.com/ereddate/vue-security-scanner/issues
- Documentation: https://github.com/ereddate/vue-security-scanner#readme
