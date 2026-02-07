const vueBuildToolSecurityRules = [
  {
    id: 'vite-config-security',
    name: 'Vite Configuration Security',
    severity: 'High',
    description: 'Vite configuration security issues',
    recommendation: 'Ensure sensitive data is not exposed in Vite configuration. Use environment variables properly.',
    patterns: [
      { key: 'vite-define', pattern: 'define\\s*:\\s*\\{[^}]*API_KEY|SECRET|PASSWORD' },
      { key: 'vite-env', pattern: 'process\\.env\\.(API_KEY|SECRET|PASSWORD)' },
      { key: 'vite-config', pattern: 'defineConfig\\s*\\(\\s*\\{[^}]+\\}\\s*\\)' }
    ]
  },
  {
    id: 'webpack-config-security',
    name: 'Webpack Configuration Security',
    severity: 'High',
    description: 'Webpack configuration security issues',
    recommendation: 'Ensure sensitive data is not exposed in Webpack configuration. Use DefinePlugin with environment variables.',
    patterns: [
      { key: 'webpack-define', pattern: 'DefinePlugin\\s*\\(\\s*\\{[^}]*API_KEY|SECRET|PASSWORD' },
      { key: 'webpack-env', pattern: 'process\\.env\\.(API_KEY|SECRET|PASSWORD)' },
      { key: 'webpack-config', pattern: 'module\\.exports\\s*=\\s*\\{[^}]+\\}' }
    ]
  },
  {
    id: 'build-tool-plugin-security',
    name: 'Build Tool Plugin Security',
    severity: 'Medium',
    description: 'Potential security issues with build tool plugins',
    recommendation: 'Use trusted build tool plugins. Keep plugins updated. Review plugin configurations.',
    patterns: [
      { key: 'vite-plugin', pattern: 'plugins\\s*:\\s*\\[[^\\]]*\\]' },
      { key: 'webpack-plugin', pattern: 'plugins\\s*:\\s*\\[[^\\]]*\\]' },
      { key: 'rollup-plugin', pattern: 'plugins\\s*:\\s*\\[[^\\]]*\\]' }
    ]
  },
  {
    id: 'build-output-security',
    name: 'Build Output Security',
    severity: 'Medium',
    description: 'Potential security issues with build output',
    recommendation: 'Ensure build output does not contain sensitive information. Use proper source maps configuration.',
    patterns: [
      { key: 'source-map', pattern: 'sourceMap\\s*:\\s*(true|\\{[^}]+\\})' },
      { key: 'build-output', pattern: 'output\\s*:\\s*\\{[^}]+\\}' },
      { key: 'minify', pattern: 'minify\\s*:\\s*(true|\\{[^}]+\\})' }
    ]
  },
  {
    id: 'build-script-security',
    name: 'Build Script Security',
    severity: 'Medium',
    description: 'Potential security issues with build scripts',
    recommendation: 'Validate build scripts. Avoid executing arbitrary commands. Use npm scripts with care.',
    patterns: [
      { key: 'build-script', pattern: '"build"\\s*:\\s*"[^"]+"' },
      { key: 'dev-script', pattern: '"dev"\\s*:\\s*"[^"]+"' },
      { key: 'postinstall-script', pattern: '"postinstall"\\s*:\\s*"[^"]+"' }
    ]
  },
  {
    id: 'build-cache-security',
    name: 'Build Cache Security',
    severity: 'Low',
    description: 'Potential security issues with build caches',
    recommendation: 'Secure build caches. Avoid caching sensitive information. Clear caches regularly.',
    patterns: [
      { key: 'cache-config', pattern: 'cache\\s*:\\s*\\{[^}]+\\}' },
      { key: 'vite-cache', pattern: 'vite\\s*--force|vite\\s*clean' },
      { key: 'webpack-cache', pattern: 'webpack\\s*--no-cache|webpack\\s*clean' }
    ]
  },
  {
    id: 'build-dependency-security',
    name: 'Build Dependency Security',
    severity: 'High',
    description: 'Potential security issues with build dependencies',
    recommendation: 'Keep build dependencies updated. Use secure versions of build tools. Review build dependency chains.',
    patterns: [
      { key: 'build-deps', pattern: '"devDependencies"\\s*:\\s*\\{' },
      { key: 'vite-version', pattern: '"vite"\\s*:\\s*"[^"]+"' },
      { key: 'webpack-version', pattern: '"webpack"\\s*:\\s*"[^"]+"' }
    ]
  }
];

module.exports = vueBuildToolSecurityRules;