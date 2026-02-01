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

## Features

### Dashboard Overview

The main dashboard provides a comprehensive view of your project's security status:

- **Summary Cards**: Quick access to key metrics
- **Trend Charts**: Visual representation of security over time
- **Severity Distribution**: Breakdown of vulnerabilities by severity
- **Recent Scans**: Table of recent scan results with details

### Scan Management

The dashboard allows you to manage scan results:

- **View Details**: Click on a scan to see detailed findings
- **Export Reports**: Download scans in various formats
- **Delete Scans**: Remove old or test scans
- **Compare Scans**: Compare results between different scans

### Project Tracking

For teams with multiple projects:

- **Project Selection**: Switch between different projects
- **Project Metrics**: View project-specific security metrics
- **Cross-Project Comparison**: Compare security status across projects

## API Endpoints

The dashboard provides a RESTful API for integration:

### Health Check

```
GET /api/health
```

Returns the status of the dashboard API.

### Scans

```
GET /api/scans
```

Returns a list of all scans.

```
GET /api/scans/:scanId
```

Returns details for a specific scan.

```
POST /api/scans
```

Triggers a new scan. Accepts:

```json
{
  "projectPath": "/path/to/project",
  "options": {
    "level": "detailed",
    "output": "json"
  }
}
```

```
DELETE /api/scans/:scanId
```

Deletes a specific scan.

### Statistics

```
GET /api/stats
```

Returns overall security statistics.

```
GET /api/trend?days=30
```

Returns vulnerability trend data for the specified number of days.

### Projects

```
GET /api/projects
```

Returns a list of tracked projects.

```
POST /api/projects
```

Adds a new project. Accepts:

```json
{
  "name": "Project Name",
  "path": "/path/to/project"
}
```

```
DELETE /api/projects/:projectId
```

Removes a project from tracking.

## Configuration

### Server Configuration

The dashboard server can be configured using environment variables:

```bash
# Set custom port
PORT=8080 node dashboard/server.js

# Set data directory
DATA_DIR="./custom-data" node dashboard/server.js

# Set API key for authentication
API_KEY="your-secret-key" node dashboard/server.js
```

### Dashboard Configuration

The dashboard UI can be customized by modifying the configuration in `dashboard/server.js`:

```javascript
const config = {
  port: process.env.PORT || 3000,
  dataDir: process.env.DATA_DIR || '.vue-security-data',
  apiKey: process.env.API_KEY || null,
  maxScans: 1000,
  scanTimeout: 300000, // 5 minutes
  cors: {
    origin: '*'
  }
};
```

## Integration

### CI/CD Integration

To integrate the dashboard with your CI/CD pipeline:

1. Run the dashboard server as a persistent service
2. Use the API to submit scan results
3. Configure alerts for high-severity issues

### Example CI Integration

```yaml
# GitHub Actions example
- name: Run security scan
  run: vue-security-scanner . --output json --report security-report.json

- name: Submit to dashboard
  run: |
    curl -X POST http://dashboard-server:3000/api/scans \
      -H "Content-Type: application/json" \
      -d "{\"projectPath\": \"$GITHUB_WORKSPACE\", \"scanResults\": $(cat security-report.json)}"
```

### Alerting

You can configure alerting by adding a webhook to the dashboard:

```javascript
// Add to dashboard/server.js
const webhookUrl = process.env.WEBHOOK_URL;

function sendAlert(scan) {
  if (scan.highSeverity > 0 && webhookUrl) {
    fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        project: scan.projectPath,
        highSeverity: scan.highSeverity,
        scanId: scan.id
      })
    });
  }
}
```

## Troubleshooting

### Dashboard Not Starting

If the dashboard fails to start:

1. Check that the port is not in use
2. Verify that the data directory has write permissions
3. Check for errors in the console output

### Scans Not Appearing

If scans don't appear in the dashboard:

1. Check that the scan completed successfully
2. Verify that the API request was successful
3. Check the dashboard logs for errors

### API Authentication Issues

If you're having authentication issues with the API:

1. Check that the API key is correct
2. Verify that the API key is being sent in the headers
3. Check the dashboard configuration for authentication settings

## Performance Optimization

### For Large Projects

- **Increase Memory Limit**: Use `NODE_OPTIONS=--max-old-space-size=4096`
- **Adjust Scan Timeout**: Increase `scanTimeout` in configuration
- **Enable Caching**: Set up Redis or another caching system

### For High Traffic

- **Use a Reverse Proxy**: Configure Nginx or Apache in front of the dashboard
- **Enable Compression**: Add gzip compression for API responses
- **Rate Limiting**: Implement rate limiting for API requests

## Support

For additional help with the dashboard:

1. Check the [README.md](../README.md) for general information
2. Open an issue in the GitHub repository
3. Contact the maintainers for enterprise support
