# Publishing Guide

This guide explains how to publish Vue Security Scanner packages and updates.

## Overview

Publishing is a critical process that involves:
- Preparing release versions
- Building packages
- Testing release candidates
- Publishing to package registries
- Distributing updates to users

## Release Process

### 1. Version Bumping

Update the version in package.json:

```bash
# Patch version (bug fixes)
npm version patch

# Minor version (new features)
npm version minor

# Major version (breaking changes)
npm version major
```

### 2. Release Preparation

Prepare the release by:

1. Updating CHANGELOG.md with release notes
2. Running tests to ensure stability
3. Building the project
4. Creating release candidates

### 3. Testing

Test the release candidate:

```bash
# Run full test suite
npm test

# Run security scan
npm run security

# Test CLI functionality
node bin/vue-security-scanner.js --version

# Test distributed scanning
node bin/vue-security-distributed.js --version
```

### 4. Publishing

Publish to npm:

```bash
# Login to npm (if not already logged in)
npm login

# Publish the package
npm publish

# Publish with tag (for pre-releases)
npm publish --tag beta
npm publish --tag alpha
```

## Package Registries

### npm

The primary package registry:

- **Registry URL**: https://registry.npmjs.org/
- **Package Name**: vue-security-scanner
- **Access Level**: Public

### GitHub Packages

Alternative package registry:

- **Registry URL**: https://npm.pkg.github.com/
- **Package Name**: @vue-security-project/vue-security-scanner
- **Access Level**: Public

### Enterprise Registry

For enterprise customers:

- **Registry URL**: Custom enterprise registry
- **Package Name**: vue-security-scanner-enterprise
- **Access Level**: Private

## Distribution Channels

### npm

- **Global Installation**: `npm install -g vue-security-scanner`
- **Project Installation**: `npm install --save-dev vue-security-scanner`

### GitHub Releases

- **Release Assets**: Pre-built binaries and packages
- **Release Notes**: Detailed changelog for each version
- **Downloads**: Direct downloads for offline installation

### Docker Hub

- **Image Name**: vuesecurityscanner/vue-security-scanner
- **Tags**: Version-specific and latest tags
- **Pull Command**: `docker pull vuesecurityscanner/vue-security-scanner:latest`

### Enterprise Portal

- **Enterprise Downloads**: Premium packages and plugins
- **License Management**: Enterprise license activation
- **Priority Support**: Direct support for enterprise customers

## Publishing Best Practices

### Versioning

- **Follow semantic versioning**: Major.Minor.Patch
- **Document breaking changes**: Clearly document any breaking changes
- **Use pre-release tags**: alpha, beta, rc for test versions
- **Maintain version history**: Keep accurate changelog

### Testing

- **Run full test suite**: Ensure all tests pass
- **Test in multiple environments**: Different OS, Node.js versions
- **Test edge cases**: Large projects, complex configurations
- **Verify security**: Run security scans on the release

### Documentation

- **Update documentation**: Keep docs in sync with code changes
- **Update examples**: Ensure examples work with new version
- **Update README**: Reflect changes in main documentation
- **Update API docs**: Document any API changes

### Communication

- **Announce releases**: Notify users of new versions
- **Highlight features**: Emphasize new features and improvements
- **Address deprecations**: Communicate deprecated features
- **Provide migration guides**: Help users upgrade smoothly

## CI/CD Integration

### GitHub Actions

The project uses GitHub Actions for CI/CD:

- **Release Workflow**: `.github/workflows/release.yml`
- **Independent Release Workflow**: `.github/workflows/release-independent.yml`
- **Security Scan Workflow**: `.github/workflows/vue-security-scan.yml`

### Automated Publishing

Automated publishing process:

1. **Trigger**: Push to main branch or tag creation
2. **Build**: Build the project
3. **Test**: Run test suite
4. **Publish**: Publish to npm if tests pass
5. **Deploy**: Deploy documentation and updates

## Enterprise Publishing

### Enterprise Versioning

Enterprise versions follow a different scheme:

- **Format**: `X.Y.Z-enterprise.W`
- **Example**: `1.3.1-enterprise.2`
- **Release Cycle**: Independent from community version

### Enterprise Distribution

Enterprise packages are distributed through:

- **Enterprise Portal**: Secure download portal
- **Private Registry**: Enterprise npm registry
- **License Keys**: Per-user or per-server licensing
- **Support Channels**: Dedicated support for enterprise customers

## Troubleshooting Publishing

### npm Publish Failures

If npm publish fails:

1. **Check npm credentials**: Ensure you're logged in with correct permissions
2. **Verify package name**: Ensure the package name is available
3. **Check version**: Ensure the version hasn't been published before
4. **Review npm logs**: Check for specific error messages

### Registry Issues

If there are registry issues:

1. **Verify registry URL**: Ensure you're using the correct registry
2. **Check network connectivity**: Ensure you can reach the registry
3. **Clear npm cache**: `npm cache clean --force`
4. **Try with verbose output**: `npm publish --verbose`

### Version Conflicts

If there are version conflicts:

1. **Check git tags**: Ensure tags match package.json version
2. **Verify changelog**: Ensure changelog has entry for the version
3. **Check release history**: Ensure version hasn't been released before
4. **Use unique version**: Choose a different version number if necessary

## Publishing Checklist

### Pre-Publishing

- [ ] Update package.json version
- [ ] Update CHANGELOG.md with release notes
- [ ] Run full test suite
- [ ] Build the project
- [ ] Test CLI functionality
- [ ] Verify documentation is up-to-date

### Publishing

- [ ] Login to npm
- [ ] Publish to npm
- [ ] Create GitHub release
- [ ] Publish Docker image
- [ ] Update enterprise portal

### Post-Publishing

- [ ] Announce the release
- [ ] Update documentation links
- [ ] Monitor for issues
- [ ] Address user feedback

## Support

For publishing assistance:

1. **Review documentation**: Check this guide and other publishing docs
2. **Contact maintainers**: Reach out to core team members
3. **Check GitHub issues**: Look for similar publishing issues
4. **Enterprise support**: For enterprise publishing issues
