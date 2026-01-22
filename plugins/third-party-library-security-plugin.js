/**
 * 第三方库安全检测插件
 * 企业级安全扫描插件，用于检测第三方库的安全问题
 */

class ThirdPartyLibrarySecurityPlugin {
  constructor() {
    this.name = 'Third Party Library Security Checker';
    this.description = 'Analyzes third-party libraries for known vulnerabilities';
    this.version = '1.0.0';
    this.severity = 'High';
  }

  /**
   * 分析文件内容以查找第三方库安全问题
   */
  async analyze(filePath, content) {
    const vulnerabilities = [];
    
    // 只处理package.json文件
    if (!filePath.endsWith('package.json')) {
      return vulnerabilities;
    }

    try {
      const packageJson = JSON.parse(content);
      const dependencies = { ...packageJson.dependencies, ...packageJson.devDependencies };
      
      // 已知存在安全问题的库和版本
      const knownVulnerablePackages = {
        'lodash': '<4.17.21',  // CVE-2021-23337
        'moment': '<2.29.2',   // 多个CVE
        'axios': '<0.21.3',    // CVE-2021-3733
        'express': '<4.17.3',  // 多个中间件漏洞
        'jquery': '<3.5.0',    // CVE-2020-11022, CVE-2020-11023
        'vue': '<2.6.14',      // Vue 2中的安全问题
        'vue-router': '<3.5.3', // Vue Router安全问题
        'vuex': '<3.6.2',      // Vuex安全问题
        'serialize-javascript': '<3.1.0', // 多个RCE漏洞
        'underscore': '<1.12.1', // 多个安全问题
        'minimist': '<1.2.6',   // CVE-2021-44906
        'cookie': '<0.4.1',     // CVE-2022-22913
        'ws': '<7.4.6',         // DoS漏洞
        'qs': '<6.7.0',         // DoS漏洞
        'negotiator': '<0.6.3', // ReDoS漏洞
      };

      for (const [pkgName, pkgVersion] of Object.entries(dependencies)) {
        // 清理版本号，去掉^和~前缀
        const cleanVersion = pkgVersion.replace(/^[~^]/, '');
        
        if (knownVulnerablePackages[pkgName]) {
          const requiredVersion = knownVulnerablePackages[pkgName];
          if (this.isVulnerableVersion(cleanVersion, requiredVersion)) {
            vulnerabilities.push({
              id: `vulnerable-package-${pkgName}-${Date.now()}`,
              type: 'Vulnerable Dependency',
              severity: 'High',
              file: filePath,
              line: 'N/A',
              description: `${pkgName}@${pkgVersion} has known security vulnerabilities`,
              codeSnippet: `"${pkgName}": "${pkgVersion}"`,
              recommendation: `Update ${pkgName} to a secure version. Check https://snyk.io/vuln/ for more details.`,
              plugin: this.name
            });
          }
        }
        
        // 检查过时的包
        if (this.isOutdated(pkgName, cleanVersion)) {
          vulnerabilities.push({
            id: `outdated-package-${pkgName}-${Date.now()}`,
            type: 'Outdated Dependency',
            severity: 'Medium',
            file: filePath,
            line: 'N/A',
            description: `${pkgName}@${pkgVersion} is outdated and may contain known vulnerabilities`,
            codeSnippet: `"${pkgName}": "${pkgVersion}"`,
            recommendation: `Update ${pkgName} to the latest stable version to ensure security patches are applied.`,
            plugin: this.name
          });
        }
        
        // 检查已被标记为废弃的包
        if (await this.isDeprecated(pkgName)) {
          vulnerabilities.push({
            id: `deprecated-package-${pkgName}-${Date.now()}`,
            type: 'Deprecated Dependency',
            severity: 'Low',
            file: filePath,
            line: 'N/A',
            description: `${pkgName} is deprecated and no longer maintained`,
            codeSnippet: `"${pkgName}": "${pkgVersion}"`,
            recommendation: `Consider replacing ${pkgName} with an actively maintained alternative.`,
            plugin: this.name
          });
        }
      }
      
      // 检查生产环境中不必要的开发依赖
      if (dependencies && packageJson.devDependencies) {
        const prodDeps = packageJson.dependencies ? Object.keys(packageJson.dependencies) : [];
        const devDeps = packageJson.devDependencies ? Object.keys(packageJson.devDependencies) : [];
        
        // 如果生产环境依赖包含了开发依赖，可能存在风险
        const devDepsInProd = devDeps.filter(dep => prodDeps.includes(dep));
        devDepsInProd.forEach(dep => {
          vulnerabilities.push({
            id: `dev-dep-in-prod-${dep}-${Date.now()}`,
            type: 'Development Dependency in Production',
            severity: 'Medium',
            file: filePath,
            line: 'N/A',
            description: `Development dependency "${dep}" also listed in production dependencies`,
            codeSnippet: `"${dep}" found in both dependencies and devDependencies`,
            recommendation: `Separate development and production dependencies clearly to reduce attack surface.`,
            plugin: this.name
          });
        });
      }
      
    } catch (error) {
      console.error(`Error parsing package.json in plugin:`, error.message);
    }

    return vulnerabilities;
  }

  /**
   * 检查版本是否易受攻击
   */
  isVulnerableVersion(currentVersion, requiredVersion) {
    // 简化的版本比较逻辑，实际实现可能需要更复杂的语义化版本比较
    // 这里仅作演示
    try {
      const current = currentVersion.replace(/[^\d.]/g, '').split('.');
      const required = requiredVersion.replace(/[^\d.]/g, '').split('.');
      
      // 简单的版本比较逻辑
      for (let i = 0; i < Math.min(current.length, required.length); i++) {
        const currNum = parseInt(current[i]) || 0;
        const reqNum = parseInt(required[i]) || 0;
        
        if (currNum < reqNum) {
          return true;
        } else if (currNum > reqNum) {
          return false;
        }
      }
      
      // 如果当前版本和要求版本相同，则认为易受攻击
      return true;
    } catch (error) {
      console.error('Error comparing versions:', error.message);
      return false;
    }
  }

  /**
   * 检查包是否过时
   */
  isOutdated(pkgName, currentVersion) {
    // 这里简化实现，实际应该查询npm registry获取最新版本
    // 返回true表示包已过时
    return false; // 演示用途，实际实现会更复杂
  }

  /**
   * 检查包是否被废弃
   */
  async isDeprecated(pkgName) {
    // 这里简化实现，实际应该查询npm registry
    // 返回true表示包已被废弃
    return false; // 演示用途，实际实现会更复杂
  }

  /**
   * 判断文件是否需要扫描
   */
  isRelevantFile(filePath) {
    return filePath.endsWith('package.json');
  }
}

module.exports = new ThirdPartyLibrarySecurityPlugin();