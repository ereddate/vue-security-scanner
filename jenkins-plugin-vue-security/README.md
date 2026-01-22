# Jenkins Plugin for Vue Security Scanner

A Jenkins plugin that integrates Vue Security Scanner into CI/CD pipelines for automated security scanning of Vue.js projects.

## Installation

### Method 1: From Jenkins Update Center (Recommended)
1. Go to "Manage Jenkins" → "Manage Plugins"
2. Search for "Vue Security Scanner" in the Available tab
3. Install the plugin

### Method 2: Manual Installation
1. Download the `.hpi` file from releases
2. Go to "Manage Jenkins" → "Manage Plugins" → "Advanced" tab
3. Upload the plugin file

### Prerequisites
- Node.js 14+ installed on build agents
- Vue Security Scanner installed globally: `npm install -g vue-security-scanner`

## Configuration

### Global Configuration
1. Go to "Manage Jenkins" → "Configure System"
2. Find "Vue Security Scanner" section
3. Configure global settings if needed

### Job Configuration
1. In your job configuration, add a build step
2. Select "Vue Security Scanner" from the list of build steps
3. Configure the scan parameters

## Usage

### Pipeline Jobs
```groovy
pipeline {
    agent any
    
    stages {
        stage('Security Scan') {
            steps {
                script {
                    vueSecurityScanner(
                        projectPath: 'frontend/',
                        scanLevel: 'detailed',
                        failBuildOnVulnerabilities: true,
                        reportOutputPath: 'security-report.json',
                        enablePlugins: true,
                        customPluginPath: 'custom-plugins/'
                    )
                }
            }
        }
    }
}
```

### Freestyle Jobs
1. Add "Build" step
2. Select "Vue Security Scanner"
3. Configure:
   - Project Path: Path to Vue.js project in workspace
   - Scan Level: Basic, Standard, or Detailed
   - Fail Build on Vulnerabilities: Whether to fail build if vulnerabilities are found
   - Report Output Path: Path for security report file
   - Enable Plugins: Whether to use security plugins
   - Custom Plugin Path: Path to custom security plugins

## Parameters

- `projectPath`: Path to the Vue.js project to scan (relative to workspace)
- `scanLevel`: Security scan level (`basic`, `standard`, or `detailed`)
- `failBuildOnVulnerabilities`: Whether to fail the build if vulnerabilities are found
- `reportOutputPath`: Path for the security report output file
- `enablePlugins`: Whether to enable the plugin system
- `customPluginPath`: Path to custom security plugins

## Features

- **Pipeline Support**: Full support for Jenkins Pipeline jobs
- **Freestyle Jobs**: Support for traditional freestyle jobs
- **Flexible Configuration**: Configurable scan levels and parameters
- **Build Failure Control**: Option to fail builds on security vulnerabilities
- **Plugin System**: Support for custom security plugins
- **Report Generation**: Generates detailed security reports
- **Agent Compatibility**: Works on all Jenkins build agents
- **Global Configuration**: Centralized configuration options

## Integration with Other Tools

### With JUnit Plugin
```groovy
pipeline {
    agent any
    
    stages {
        stage('Security Scan') {
            steps {
                script {
                    vueSecurityScanner(
                        projectPath: 'frontend/',
                        scanLevel: 'detailed',
                        reportOutputPath: 'vue-security-report.json'
                    )
                }
            }
        }
    }
    
    post {
        always {
            // Archive security reports
            archiveArtifacts artifacts: 'vue-security-report.json', fingerprint: true
        }
    }
}
```

### Conditional Build Failure
```groovy
pipeline {
    agent any
    
    stages {
        stage('Security Scan') {
            steps {
                script {
                    def scanResult = vueSecurityScanner(
                        projectPath: 'frontend/',
                        scanLevel: 'detailed',
                        failBuildOnVulnerabilities: false  // Don't fail immediately
                    )
                    
                    // Check results and conditionally fail
                    if (hasHighSeverityVulnerabilities('vue-security-report.json')) {
                        error('High severity vulnerabilities found!')
                    }
                }
            }
        }
    }
}
```

## Security Considerations

- Runs Vue Security Scanner in isolated workspace
- Does not modify source code
- Respects Jenkins security model
- Supports agents with restricted permissions

## Troubleshooting

### Vue Security Scanner Not Found
Make sure Vue Security Scanner is installed on all build agents:
```bash
npm install -g vue-security-scanner
```

### Permission Issues
Ensure Jenkins user has appropriate permissions to:
- Execute Node.js/npm commands
- Read project files
- Write report files

## License

MIT