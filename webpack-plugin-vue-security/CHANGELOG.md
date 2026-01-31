# Changelog

## 1.6.0 (2026-01-31)

- Updated to version 1.6.0
- Updated dependency vue-security-scanner to ^1.6.0
- Added performance configuration options:
  - performanceProfile (fast, balanced, thorough)
  - enableParallelScanning
  - enableIncrementalScanning
  - memoryLimit
- Added Vue 3.6 support:
  - enableVue36Features
  - enableVaporModeScanning
- Added exclude option for pattern-based file exclusion
- Added parallel rule engine shutdown functionality
- Fixed issue where report was not generated when no vulnerabilities were found
- Updated scanner version to 1.6.0
- Added new keywords to package.json

## 1.0.0 (2026-01-22)

- Initial release of webpack-plugin-vue-security
- Integration with Webpack build process
- Real-time security scanning during builds
- Support for custom security plugins
- Flexible configuration options