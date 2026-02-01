# Vue Security Scanner Installation Guide

## System Requirements

- **Node.js**: v14.0.0 or higher
- **npm**: v6.0.0 or higher
- **Operating System**: Windows, macOS, Linux
- **Memory**: At least 4GB RAM
- **Disk Space**: At least 100MB free space

## Installation Methods

### 1. Global Installation (Recommended)

Install globally to use in any project:

```bash
npm install -g vue-security-scanner
```

### 2. Local Project Installation

Install in a specific project:

```bash
npm install vue-security-scanner --save-dev
```

### 3. Installation from Source

Clone the repository and install dependencies:

```bash
# Clone from GitHub
git clone https://github.com/ereddate/vue-security-scanner.git

# Or clone from Gitee
git clone https://gitee.com/ereddate2017/vue-security-scanner.git

# Enter directory
cd vue-security-scanner

# Install dependencies
npm install

# Link as global tool
npm link
```

## Verify Installation

After installation, run the following command to verify:

```bash
vue-security-scanner --version
```

Or use the shorthand command:

```bash
vsc --version
```

If installation is successful, you will see version information:

```
vue-security-scanner version 1.8.0
```

## Environment Configuration

### 1. Configuration File

Vue Security Scanner supports custom settings through configuration files. Create a `.vue-security-scanner.config.js` file in your project root:

```javascript
module.exports = {
  // Scan path
  scanPath: './src',
  
  // Exclude paths
  exclude: [
    'node_modules',
    'dist',
    'build',
    '.git'
  ],
  
  // Rules configuration
  rules: {
    // Enabled rule modules
    enabled: [
      'vue',
      'javascript',
      'china-security',
      'china-api-security'
    ],
    
    // Custom rule configuration
    severity: {
      critical: true,
      high: true,
      medium: true,
      low: false
    }
  },
  
  // Performance configuration
  performance: {
    enableCache: true,
    enableIncremental: true,
    maxCacheSize: 100 * 1024 * 1024 // 100MB
  },
  
  // Reporting configuration
  reporting: {
    formats: ['json', 'html', 'text'],
    outputDir: './security-reports'
  }
};
```

### 2. Environment Variables

The following environment variables are supported:

- `VUE_SECURITY_SCANNER_CACHE_DIR`: Cache directory path
- `VUE_SECURITY_SCANNER_MAX_CACHE_SIZE`: Maximum cache size (bytes)
- `VUE_SECURITY_SCANNER_TIMEOUT`: Scan timeout (milliseconds)
- `VUE_SECURITY_SCANNER_THREADS`: Number of parallel processing threads

## Upgrading

### Global Installation Upgrade

```bash
npm update -g vue-security-scanner
```

### Local Installation Upgrade

```bash
npm update vue-security-scanner --save-dev
```

### Source Code Upgrade

```bash
# Enter directory
cd vue-security-scanner

# Pull latest code
git pull

# Reinstall dependencies
npm install

# Relink
npm link
```

## Uninstallation

### Global Installation Uninstall

```bash
npm uninstall -g vue-security-scanner
```

### Local Installation Uninstall

```bash
npm uninstall vue-security-scanner
```

## Common Installation Issues

### 1. Permission Issues

**Symptom**: Permission errors during installation

**Solution**: 
- Windows: Run command prompt as administrator
- macOS/Linux: Use `sudo` command

### 2. Network Issues

**Symptom**: Slow or failed downloads during installation

**Solution**: 
- Use npm mirror: `npm install -g vue-security-scanner --registry=https://registry.npmmirror.com`
- Check network connection

### 3. Node.js Version Issues

**Symptom**: Installation succeeds but runtime fails

**Solution**: 
- Check Node.js version: `node --version`
- Upgrade to recommended version

### 4. Dependency Conflicts

**Symptom**: Dependency conflicts during installation

**Solution**: 
- Clean npm cache: `npm cache clean --force`
- Reinstall: `npm install -g vue-security-scanner`

## Next Steps

After installation, you can:

- Check [Usage Guide](./usage.md) to learn how to use
- Check [Rules Documentation](./rules/index.md) to understand supported rules
- Check [API Reference](./api/index.md) to understand the programming interface

## Contact Us

If you encounter installation issues, please contact us through:

- **GitHub Issues**: https://github.com/ereddate/vue-security-scanner/issues
- **Gitee Issues**: https://gitee.com/ereddate2017/vue-security-scanner/issues