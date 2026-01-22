# Docker Integration for Vue Security Scanner

Docker integration for Vue Security Scanner that allows scanning Vue.js projects in containerized environments.

## Quick Start

### Scan a Project

```bash
# Build the Docker image
docker build -t vue-security-scanner .

# Scan a project mounted from the current directory
docker run -v $(pwd):/workspace/project vue-security-scanner /workspace/project --level detailed
```

### Using Docker Compose

```bash
# Create a project directory structure
mkdir project reports
cp -r /path/to/your/vue/project/* project/

# Run the scan
docker-compose up vue-security-scanner
```

## Docker Images

### Base Image
The base image includes:
- Node.js 18
- Vue Security Scanner CLI tool
- Non-root user for security
- Volume mount points for projects and reports

### Pre-built Variants

#### Standard Scanner
```dockerfile
FROM vue-security-scanner:latest
```

#### With Custom Plugins
```dockerfile
FROM vue-security-scanner:latest
COPY custom-plugins/ /app/plugins/
```

## Docker Compose Services

### vue-security-scanner
Full-featured scanner service with detailed output.

### vue-security-scanner-light
Lightweight scanner service for basic checks.

### vue-security-api
REST API service for programmatic scanning.

## Configuration

### Environment Variables

- `SCAN_LEVEL`: Security scan level (basic, standard, detailed)
- `OUTPUT_FORMAT`: Output format (json, html, text)
- `REPORT_FILE`: Output report file path
- `SERVER_PORT`: API server port (when running in API mode)
- `SCAN_TIMEOUT`: Scan timeout in milliseconds

### Volume Mounts

- `/workspace/project`: Mount point for the Vue.js project to scan (read-only)
- `/home/scanner/reports`: Mount point for scan reports output

## Advanced Usage

### Scan with Custom Configuration
```bash
docker run \
  -v /path/to/your/project:/workspace/project:ro \
  -v /local/reports:/home/scanner/reports \
  -e SCAN_LEVEL=detailed \
  vue-security-scanner \
  /workspace/project --config /workspace/project/vue-security-scanner.config.json
```

### API Mode
```bash
docker run -p 3000:3000 vue-security-scanner --api --port 3000
```

Then scan via API:
```bash
curl -X POST http://localhost:3000/scan \
  -H "Content-Type: application/json" \
  -d '{"projectPath": "/workspace/project", "level": "detailed"}'
```

### Multi-stage Scan
```dockerfile
# First stage: scan the project
FROM vue-security-scanner:latest as scanner
COPY . /workspace/project
RUN vue-security-scanner /workspace/project --report /tmp/report.json

# Second stage: use results elsewhere
FROM alpine:latest
COPY --from=scanner /tmp/report.json /report.json
```

## Security Considerations

- Runs as non-root user (UID 1001)
- Read-only access to project files
- Limited volume mounts
- No network access required for basic scanning

## Integration Examples

### Kubernetes Job
```yaml
apiVersion: batch/v1
kind: Job
metadata:
  name: vue-security-scan
spec:
  template:
    spec:
      containers:
      - name: scanner
        image: vue-security-scanner:latest
        volumeMounts:
        - name: project
          mountPath: /workspace/project
        - name: reports
          mountPath: /home/scanner/reports
        command: ["vue-security-scanner"]
        args: ["/workspace/project", "--report", "/home/scanner/reports/report.json"]
      volumes:
      - name: project
        persistentVolumeClaim:
          claimName: project-source
      - name: reports
        persistentVolumeClaim:
          claimName: scan-reports
      restartPolicy: Never
```

### CI/CD Pipeline
```bash
# In your CI pipeline
docker run --rm \
  -v $CI_PROJECT_DIR:/workspace/project:ro \
  -v $CI_PROJECT_DIR/reports:/home/scanner/reports \
  vue-security-scanner \
  /workspace/project --level detailed --report /home/scanner/reports/ci-report.json

# Check results
if [ -s $CI_PROJECT_DIR/reports/ci-report.json ]; then
  echo "Security scan completed"
else
  echo "Security scan failed"
  exit 1
fi
```

## License

MIT