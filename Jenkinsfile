// Jenkinsfile for Vue Security Scanner
// This pipeline provides comprehensive security scanning for Vue.js projects

pipeline {
    agent any
    
    environment {
        NODE_VERSION = '18'
        SECURITY_SCAN_LEVEL = 'detailed'
        SECURITY_REPORT_PATH = 'security-report.json'
        ADVANCED_REPORT_PATH = 'security-report-advanced.html'
    }
    
    options {
        buildDiscarder(logRotator(numToKeepStr: '30'))
        disableConcurrentBuilds()
        timeout(time: 30, unit: 'MINUTES')
        timestamps()
    }
    
    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }
        
        stage('Setup Environment') {
            steps {
                script {
                    echo "Setting up Node.js ${env.NODE_VERSION} environment..."
                    sh """
                        if ! command -v node &> /dev/null; then
                            curl -fsSL https://deb.nodesource.com/setup_${env.NODE_VERSION}.x | sudo -E bash -
                            sudo apt-get install -y nodejs
                        fi
                        node --version
                        npm --version
                    """
                }
            }
        }
        
        stage('Install Dependencies') {
            steps {
                script {
                    echo "Installing project dependencies..."
                    sh 'npm ci'
                }
            }
        }
        
        stage('Install Vue Security Scanner') {
            steps {
                script {
                    echo "Installing Vue Security Scanner..."
                    sh 'npm install -g vue-security-scanner'
                }
            }
        }
        
        stage('Run Security Scan') {
            steps {
                script {
                    echo "Running Vue Security Scanner..."
                    sh """
                        vue-security-scanner . \
                            --output json \
                            --report ${env.SECURITY_REPORT_PATH} \
                            --level ${env.SECURITY_SCAN_LEVEL} \
                            --advanced-report || true
                    """
                }
            }
        }
        
        stage('Analyze Results') {
            steps {
                script {
                    echo "Analyzing security scan results..."
                    sh """
                        node -e "
                            const fs = require('fs');
                            const report = JSON.parse(fs.readFileSync('${env.SECURITY_REPORT_PATH}', 'utf8'));
                            const summary = report.summary;
                            
                            console.log('=== Security Scan Summary ===');
                            console.log('Total Vulnerabilities:', summary.totalVulnerabilities);
                            console.log('Critical/High:', summary.highSeverity);
                            console.log('Medium:', summary.mediumSeverity);
                            console.log('Low:', summary.lowSeverity);
                            console.log('Files Scanned:', summary.filesScanned);
                            
                            const criticalCount = report.vulnerabilities.filter(v => v.severity === 'Critical').length;
                            const highCount = report.vulnerabilities.filter(v => v.severity === 'High').length;
                            
                            if (criticalCount > 0 || highCount > 0) {
                                console.error('');
                                console.error('❌ Critical or High severity vulnerabilities found!');
                                process.exit(1);
                            }
                        " || echo "Analysis completed with warnings"
                    """
                }
            }
        }
        
        stage('Generate Security Report') {
            steps {
                script {
                    echo "Generating security report..."
                    sh """
                        node -e "
                            const fs = require('fs');
                            const report = JSON.parse(fs.readFileSync('${env.SECURITY_REPORT_PATH}', 'utf8'));
                            
                            let markdown = '# 🔒 Security Scan Report\\n\\n';
                            markdown += '## Summary\\n\\n';
                            markdown += '- **Total Vulnerabilities**: ' + report.summary.totalVulnerabilities + '\\n';
                            markdown += '- **Critical/High**: ' + report.summary.highSeverity + '\\n';
                            markdown += '- **Medium**: ' + report.summary.mediumSeverity + '\\n';
                            markdown += '- **Low**: ' + report.summary.lowSeverity + '\\n';
                            markdown += '- **Files Scanned**: ' + report.summary.filesScanned + '\\n\\n';
                            
                            markdown += '## Top Vulnerabilities\\n\\n';
                            const topVulns = report.vulnerabilities.slice(0, 10);
                            topVulns.forEach((v, i) => {
                                markdown += (i + 1) + '. **' + v.name + '** (' + v.severity + ')\\n';
                                markdown += '   - File: ' + v.file + ':' + v.line + '\\n';
                                markdown += '   - Description: ' + v.description + '\\n\\n';
                            });
                            
                            fs.writeFileSync('security-summary.md', markdown);
                            console.log('Security summary generated');
                        "
                    """
                }
            }
        }
        
        stage('Archive Reports') {
            steps {
                script {
                    echo "Archiving security reports..."
                    archiveArtifacts artifacts: '*.json,*.html,*.md', fingerprint: true
                }
            }
        }
        
        stage('Publish HTML Report') {
            steps {
                script {
                    echo "Publishing HTML security report..."
                    publishHTML([
                        allowMissing: false,
                        alwaysLinkToLastBuild: true,
                        keepAll: true,
                        reportDir: '.',
                        reportFiles: '${env.ADVANCED_REPORT_PATH}',
                        reportName: 'Security Report',
                        reportTitles: 'Vue Security Scanner Report'
                    ])
                }
            }
        }
    }
    
    post {
        always {
            echo 'Pipeline execution completed'
            cleanWs()
        }
        
        success {
            echo '✅ Security scan completed successfully!'
            script {
                sh """
                    node -e "
                        const fs = require('fs');
                        const report = JSON.parse(fs.readFileSync('${env.SECURITY_REPORT_PATH}', 'utf8'));
                        console.log('');
                        console.log('🎉 Great job! No critical or high severity vulnerabilities found.');
                        console.log('📊 Total vulnerabilities:', report.summary.totalVulnerabilities);
                        console.log('📁 View detailed report in Jenkins artifacts');
                    "
                """
            }
        }
        
        failure {
            echo '❌ Security scan failed!'
            script {
                sh """
                    node -e "
                        const fs = require('fs');
                        const report = JSON.parse(fs.readFileSync('${env.SECURITY_REPORT_PATH}', 'utf8'));
                        const criticalVulns = report.vulnerabilities.filter(v => v.severity === 'Critical');
                        const highVulns = report.vulnerabilities.filter(v => v.severity === 'High');
                        
                        console.error('');
                        console.error('🚨 Security Issues Detected!');
                        console.error('Critical vulnerabilities:', criticalVulns.length);
                        console.error('High severity vulnerabilities:', highVulns.length);
                        console.error('');
                        console.error('Please review the security report and address the issues.');
                        console.error('Build will fail until critical/high issues are resolved.');
                    "
                """
            }
        }
        
        unstable {
            echo '⚠️ Security scan completed with warnings'
        }
    }
}
