const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const semver = require('semver');
const { ErrorHandler } = require('../utils/error-handler');

class DependencyVulnerabilityScanner {
  constructor(config = {}) {
    this.config = config;
    this.enableNpmAudit = config.enableNpmAudit !== false;
    this.enableVulnerabilityDB = config.enableVulnerabilityDB !== false;
    this.vulnerabilityCache = new Map();
    this.cacheTimeout = config.cacheTimeout || 3600000; // 1小时
  }

  async scanDependencies(projectPath) {
    const vulnerabilities = [];

    try {
      const packageJsonPath = path.join(projectPath, 'package.json');
      
      if (!fs.existsSync(packageJsonPath)) {
        return [];
      }

      const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
      
      // 扫描npm audit漏洞
      if (this.enableNpmAudit) {
        const npmAuditVulns = await this.scanWithNpmAudit(projectPath);
        vulnerabilities.push(...npmAuditVulns);
      }

      // 扫描已知漏洞数据库
      if (this.enableVulnerabilityDB) {
        const dbVulns = await this.scanWithVulnerabilityDB(packageJson);
        vulnerabilities.push(...dbVulns);
      }

      // 检查过时的依赖
      const outdatedVulns = await this.checkOutdatedDependencies(projectPath);
      vulnerabilities.push(...outdatedVulns);

      // 检查许可证合规性
      const licenseVulns = this.checkLicenseCompliance(packageJson);
      vulnerabilities.push(...licenseVulns);

      return vulnerabilities;
    } catch (error) {
      ErrorHandler.handleFileError(projectPath, error);
      return [];
    }
  }

  async scanWithNpmAudit(projectPath) {
    const vulnerabilities = [];

    try {
      // 执行npm audit命令
      const auditOutput = execSync('npm audit --json', {
        cwd: projectPath,
        encoding: 'utf8',
        stdio: ['ignore', 'pipe', 'ignore']
      });

      const auditData = JSON.parse(auditOutput);

      if (auditData.vulnerabilities) {
        for (const [packageName, vulnData] of Object.entries(auditData.vulnerabilities)) {
          const vulnerability = {
            ruleId: 'dependency-vulnerability',
            name: `Dependency vulnerability: ${packageName}`,
            severity: this.mapNpmSeverity(vulnData.severity),
            description: vulnData.title || `Vulnerability found in ${packageName}`,
            recommendation: `Update ${packageName} to a secure version. Check ${vulnData.url} for more details.`,
            file: 'package.json',
            line: 0,
            column: 0,
            evidence: `${packageName}@${vulnData.via[0]?.range || 'unknown'}`,
            package: packageName,
            vulnerableVersions: vulnData.via.map(v => v.range).join(', '),
            patchedVersions: vulnData.fixAvailable ? vulnData.fixAvailable.version : 'None',
            cwe: this.mapToCWE(vulnData.cwe),
            owaspCategory: 'A06:2021 – Vulnerable and Outdated Components',
            references: vulnData.via.map(v => v.url).filter(Boolean),
            fixAvailable: !!vulnData.fixAvailable,
            confidence: 'High'
          };

          vulnerabilities.push(vulnerability);
        }
      }
    } catch (error) {
      // npm audit可能返回非零退出码，但这不一定是错误
      if (error.stdout) {
        try {
          const auditData = JSON.parse(error.stdout);
          if (auditData.vulnerabilities) {
            for (const [packageName, vulnData] of Object.entries(auditData.vulnerabilities)) {
              const vulnerability = {
                ruleId: 'dependency-vulnerability',
                name: `Dependency vulnerability: ${packageName}`,
                severity: this.mapNpmSeverity(vulnData.severity),
                description: vulnData.title || `Vulnerability found in ${packageName}`,
                recommendation: `Update ${packageName} to a secure version. Check ${vulnData.url} for more details.`,
                file: 'package.json',
                line: 0,
                column: 0,
                evidence: `${packageName}@${vulnData.via[0]?.range || 'unknown'}`,
                package: packageName,
                vulnerableVersions: vulnData.via.map(v => v.range).join(', '),
                patchedVersions: vulnData.fixAvailable ? vulnData.fixAvailable.version : 'None',
                cwe: this.mapToCWE(vulnData.cwe),
                owaspCategory: 'A06:2021 – Vulnerable and Outdated Components',
                references: vulnData.via.map(v => v.url).filter(Boolean),
                fixAvailable: !!vulnData.fixAvailable,
                confidence: 'High'
              };

              vulnerabilities.push(vulnerability);
            }
          }
        } catch (parseError) {
          console.error('Failed to parse npm audit output:', parseError.message);
        }
      }
    }

    return vulnerabilities;
  }

  async scanWithVulnerabilityDB(packageJson) {
    const vulnerabilities = [];
    const allDependencies = {
      ...packageJson.dependencies || {},
      ...packageJson.devDependencies || {},
      ...packageJson.peerDependencies || {},
      ...packageJson.optionalDependencies || {}
    };

    for (const [packageName, version] of Object.entries(allDependencies)) {
      const knownVulns = await this.checkKnownVulnerabilities(packageName, version);
      
      for (const vuln of knownVulns) {
        vulnerabilities.push({
          ruleId: 'known-vulnerability',
          name: `Known vulnerability: ${packageName}`,
          severity: vuln.severity,
          description: vuln.description,
          recommendation: vuln.recommendation || `Update ${packageName} to a secure version.`,
          file: 'package.json',
          line: 0,
          column: 0,
          evidence: `${packageName}@${version}`,
          package: packageName,
          currentVersion: version,
          vulnerableVersions: vuln.vulnerableVersions,
          patchedVersions: vuln.patchedVersions,
          cwe: vuln.cwe,
          owaspCategory: 'A06:2021 – Vulnerable and Outdated Components',
          references: vuln.references || [],
          confidence: 'High'
        });
      }
    }

    return vulnerabilities;
  }

  async checkKnownVulnerabilities(packageName, version) {
    const cacheKey = `${packageName}:${version}`;
    const cached = this.vulnerabilityCache.get(cacheKey);

    if (cached && Date.now() - cached.timestamp < this.cacheTimeout) {
      return cached.vulnerabilities;
    }

    const vulnerabilities = [];

    // 已知的高危依赖包漏洞数据库
    const knownVulnerabilities = this.getKnownVulnerabilityDB();
    
    if (knownVulnerabilities[packageName]) {
      const packageVulns = knownVulnerabilities[packageName];
      
      for (const vuln of packageVulns) {
        if (semver.satisfies(version, vuln.vulnerableVersions)) {
          vulnerabilities.push(vuln);
        }
      }
    }

    // 缓存结果
    this.vulnerabilityCache.set(cacheKey, {
      vulnerabilities,
      timestamp: Date.now()
    });

    return vulnerabilities;
  }

  getKnownVulnerabilityDB() {
    return {
      'lodash': [
        {
          severity: 'High',
          description: 'Prototype Pollution in lodash',
          vulnerableVersions: '<4.17.21',
          patchedVersions: '>=4.17.21',
          cwe: 'CWE-1321',
          recommendation: 'Update lodash to version 4.17.21 or later',
          references: ['https://nvd.nist.gov/vuln/detail/CVE-2021-23337']
        }
      ],
      'axios': [
        {
          severity: 'Medium',
          description: 'SSRF in axios',
          vulnerableVersions: '<0.21.1',
          patchedVersions: '>=0.21.1',
          cwe: 'CWE-918',
          recommendation: 'Update axios to version 0.21.1 or later',
          references: ['https://nvd.nist.gov/vuln/detail/CVE-2021-3749']
        }
      ],
      'node-fetch': [
        {
          severity: 'High',
          description: 'SSRF in node-fetch',
          vulnerableVersions: '<2.6.1',
          patchedVersions: '>=2.6.1',
          cwe: 'CWE-918',
          recommendation: 'Update node-fetch to version 2.6.1 or later',
          references: ['https://nvd.nist.gov/vuln/detail/CVE-2020-8203']
        }
      ],
      'moment': [
        {
          severity: 'Medium',
          description: 'Path traversal in moment',
          vulnerableVersions: '<2.29.2',
          patchedVersions: '>=2.29.2',
          cwe: 'CWE-22',
          recommendation: 'Update moment to version 2.29.2 or later',
          references: ['https://nvd.nist.gov/vuln/detail/CVE-2022-24785']
        }
      ],
      'ejs': [
        {
          severity: 'High',
          description: 'RCE in ejs',
          vulnerableVersions: '<3.1.7',
          patchedVersions: '>=3.1.7',
          cwe: 'CWE-94',
          recommendation: 'Update ejs to version 3.1.7 or later',
          references: ['https://nvd.nist.gov/vuln/detail/CVE-2022-29078']
        }
      ],
      'handlebars': [
        {
          severity: 'High',
          description: 'RCE in handlebars',
          vulnerableVersions: '<4.7.7',
          patchedVersions: '>=4.7.7',
          cwe: 'CWE-94',
          recommendation: 'Update handlebars to version 4.7.7 or later',
          references: ['https://nvd.nist.gov/vuln/detail/CVE-2021-23369']
        }
      ],
      'webpack': [
        {
          severity: 'Medium',
          description: 'Path traversal in webpack',
          vulnerableVersions: '<5.0.0',
          patchedVersions: '>=5.0.0',
          cwe: 'CWE-22',
          recommendation: 'Update webpack to version 5.0.0 or later',
          references: ['https://nvd.nist.gov/vuln/detail/CVE-2020-15256']
        }
      ],
      'jquery': [
        {
          severity: 'High',
          description: 'XSS in jQuery',
          vulnerableVersions: '<3.5.0',
          patchedVersions: '>=3.5.0',
          cwe: 'CWE-79',
          recommendation: 'Update jQuery to version 3.5.0 or later',
          references: ['https://nvd.nist.gov/vuln/detail/CVE-2020-11022']
        }
      ],
      'express': [
        {
          severity: 'Medium',
          description: 'Path traversal in express',
          vulnerableVersions: '<4.17.3',
          patchedVersions: '>=4.17.3',
          cwe: 'CWE-22',
          recommendation: 'Update express to version 4.17.3 or later',
          references: ['https://nvd.nist.gov/vuln/detail/CVE-2022-24999']
        }
      ],
      'vuex': [
        {
          severity: 'Medium',
          description: 'Prototype pollution in vuex',
          vulnerableVersions: '<3.6.2',
          patchedVersions: '>=3.6.2',
          cwe: 'CWE-1321',
          recommendation: 'Update vuex to version 3.6.2 or later',
          references: ['https://nvd.nist.gov/vuln/detail/CVE-2021-41222']
        }
      ]
    };
  }

  async checkOutdatedDependencies(projectPath) {
    const vulnerabilities = [];

    try {
      const outdatedOutput = execSync('npm outdated --json', {
        cwd: projectPath,
        encoding: 'utf8',
        stdio: ['ignore', 'pipe', 'ignore']
      });

      const outdatedData = JSON.parse(outdatedOutput);

      for (const [packageName, info] of Object.entries(outdatedData)) {
        vulnerabilities.push({
          ruleId: 'outdated-dependency',
          name: `Outdated dependency: ${packageName}`,
          severity: 'Low',
          description: `${packageName} is outdated. Current: ${info.current}, Latest: ${info.latest}`,
          recommendation: `Update ${packageName} to version ${info.latest}`,
          file: 'package.json',
          line: 0,
          column: 0,
          evidence: `${packageName}@${info.current}`,
          package: packageName,
          currentVersion: info.current,
          wantedVersion: info.wanted,
          latestVersion: info.latest,
          cwe: 'CWE-1104',
          owaspCategory: 'A06:2021 – Vulnerable and Outdated Components',
          confidence: 'High'
        });
      }
    } catch (error) {
      // npm outdated在没有过期包时会返回非零退出码
      if (error.stdout) {
        try {
          const outdatedData = JSON.parse(error.stdout);
          for (const [packageName, info] of Object.entries(outdatedData)) {
            vulnerabilities.push({
              ruleId: 'outdated-dependency',
              name: `Outdated dependency: ${packageName}`,
              severity: 'Low',
              description: `${packageName} is outdated. Current: ${info.current}, Latest: ${info.latest}`,
              recommendation: `Update ${packageName} to version ${info.latest}`,
              file: 'package.json',
              line: 0,
              column: 0,
              evidence: `${packageName}@${info.current}`,
              package: packageName,
              currentVersion: info.current,
              wantedVersion: info.wanted,
              latestVersion: info.latest,
              cwe: 'CWE-1104',
              owaspCategory: 'A06:2021 – Vulnerable and Outdated Components',
              confidence: 'High'
            });
          }
        } catch (parseError) {
          // 忽略解析错误
        }
      }
    }

    return vulnerabilities;
  }

  checkLicenseCompliance(packageJson) {
    const vulnerabilities = [];
    const allDependencies = {
      ...packageJson.dependencies || {},
      ...packageJson.devDependencies || {}
    };

    // 不推荐的许可证类型
    const problematicLicenses = [
      'GPL',
      'AGPL',
      'LGPL',
      'MPL',
      'CDDL',
      'EPL'
    ];

    for (const [packageName, version] of Object.entries(allDependencies)) {
      try {
        const packagePath = path.join(
          path.dirname(path.resolve('package.json')),
          'node_modules',
          packageName,
          'package.json'
        );

        if (fs.existsSync(packagePath)) {
          const depPackageJson = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
          const license = depPackageJson.license || depPackageJson.licenses;

          if (license) {
            const licenseString = Array.isArray(license) ? license.join(', ') : license;
            
            if (problematicLicenses.some(problematic => 
              licenseString.toUpperCase().includes(problematic)
            )) {
              vulnerabilities.push({
                ruleId: 'license-compliance',
                name: `License compliance issue: ${packageName}`,
                severity: 'Medium',
                description: `${packageName} uses a potentially problematic license: ${licenseString}`,
                recommendation: `Review the license of ${packageName} and consider alternatives if needed`,
                file: 'package.json',
                line: 0,
                column: 0,
                evidence: `${packageName}: ${licenseString}`,
                package: packageName,
                license: licenseString,
                cwe: 'CWE-1104',
                owaspCategory: 'A06:2021 – Vulnerable and Outdated Components',
                confidence: 'Medium'
              });
            }
          }
        }
      } catch (error) {
        // 忽略单个包的错误
      }
    }

    return vulnerabilities;
  }

  mapNpmSeverity(severity) {
    const severityMap = {
      'low': 'Low',
      'moderate': 'Medium',
      'high': 'High',
      'critical': 'Critical'
    };

    return severityMap[severity] || 'Medium';
  }

  mapToCWE(cweArray) {
    if (!cweArray || cweArray.length === 0) {
      return 'CWE-1104'; // Use of Unmaintained Third Party Components
    }

    return cweArray[0];
  }

  clearCache() {
    this.vulnerabilityCache.clear();
  }

  getCacheStats() {
    return {
      size: this.vulnerabilityCache.size,
      timeout: this.cacheTimeout
    };
  }
}

module.exports = DependencyVulnerabilityScanner;
