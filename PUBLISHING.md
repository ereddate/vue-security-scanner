# Publish Scripts for Vue Security Scanner Ecosystem

This document outlines the process for publishing the various packages in the Vue Security Scanner ecosystem.

## Packages to Publish

### 1. Main Package: vue-security-scanner
- Contains the core scanner functionality
- Published as `vue-security-scanner` on npm

### 2. Webpack Plugin: webpack-plugin-vue-security
- Webpack integration for security scanning
- Published as `webpack-plugin-vue-security` on npm
- Depends on main package as peer dependency

### 3. Nuxt.js Module: @vue-security/nuxt
- Nuxt.js integration for security scanning
- Published as `@vue-security/nuxt` on npm
- Depends on main package as peer dependency

## Publishing Order

1. First, publish the main package: `vue-security-scanner`
2. Then publish the ecosystem packages that depend on it:
   - `webpack-plugin-vue-security`
   - `@vue-security/nuxt`

## Release Checklist

Before publishing, ensure:

### For all packages:
- [ ] Version number is updated appropriately (following semver)
- [ ] CHANGELOG.md is updated with release notes
- [ ] All tests pass
- [ ] README.md is up to date
- [ ] Dependencies are properly declared
- [ ] LICENSE file is included
- [ ] Package bundles correctly (`npm pack`)

### For the main package:
- [ ] All core functionality works as expected
- [ ] Command-line interface works properly
- [ ] All built-in plugins work correctly
- [ ] Configuration system works properly

### For plugin packages:
- [ ] Properly handles core library loading (both local and peer dependency)
- [ ] Works with the published version of the main package
- [ ] Peer dependency versions are specified correctly
- [ ] Integration points work as expected

## Publishing Commands

```bash
# Publish main package
cd vue-security-scanner
npm publish

# Publish webpack plugin
cd webpack-plugin-vue-security
npm publish

# Publish nuxt module
cd nuxt-module-vue-security
npm publish
```

## Versioning Strategy

- All packages follow semantic versioning (semver)
- Major version changes should be synchronized across the ecosystem
- Minor/patch versions can be released independently when they don't affect cross-package APIs
- When the main package has a major version bump, ecosystem packages should also be checked for compatibility