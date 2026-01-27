# Publishing Guide

This guide explains how to use the automated publishing workflow for Vue Security Scanner.

## Overview

The project uses GitHub Actions for automated publishing to:
- **npm** (for all packages)
- **VSCode Marketplace** (for VSCode extension)
- **Gitee** (for Chinese users)
- **GitHub Releases** (for all packages)

## Prerequisites

### Required Secrets

Configure the following secrets in your GitHub repository settings (`Settings` → `Secrets and variables` → `Actions`):

| Secret Name | Description | How to Get |
|-------------|-------------|---------------|
| `NPM_TOKEN` | npm authentication token | [Create npm token](https://docs.npmjs.com/creating-and-viewing-access-tokens) |
| `VSCE_PAT` | VSCode Marketplace personal access token | [Create VSCode token](https://code.visualstudio.com/Manage) |
| `GITEE_TOKEN` | Gitee authentication token | [Create Gitee token](https://gitee.com/profile/personal_access_tokens) |
| `GITHUB_TOKEN` | GitHub token (automatically provided) | Automatically available in Actions |

### Creating npm Token

1. Go to [npmjs.com](https://www.npmjs.com/)
2. Login and go to [Access Tokens](https://www.npmjs.com/settings/tokens)
3. Click "Create New Token"
4. Select "Automation" type
5. Give it a name (e.g., "vue-security-scanner-publish")
6. Click "Create Token"
7. Copy the token and add to GitHub Secrets as `NPM_TOKEN`

### Creating VSCode Marketplace Token

1. Go to [Azure DevOps](https://dev.azure.com/)
2. Create a new organization or use existing one
3. Go to [Personal Access Tokens](https://dev.azure.com/_usersSettings/tokens)
4. Click "New Token"
5. Select "All accessible organizations"
6. Choose "Custom defined"
7. Select "Marketplace" → "Manage"
8. Give it a name and expiration
9. Click "Create"
10. Copy the token and add to GitHub Secrets as `VSCE_PAT`

### Creating Gitee Token

1. Go to [Gitee](https://gitee.com/)
2. Login and go to [Personal Access Tokens](https://gitee.com/profile/personal_access_tokens)
3. Click "Generate New Token"
4. Give it a name and select permissions (at least "repo")
5. Click "Submit"
6. Copy the token and add to GitHub Secrets as `GITEE_TOKEN`

## Publishing Process

### Automatic Publishing (Recommended)

The workflow automatically triggers when you push a version tag:

```bash
# Create and push a version tag
git tag v1.3.2
git push origin v1.3.2
```

This will:
1. Create a GitHub Release
2. Publish all packages to npm
3. Publish VSCode extension to Marketplace
4. Push release to Gitee
5. Create Gitee Release

### Manual Publishing

You can also trigger the workflow manually:

1. Go to `Actions` tab in GitHub
2. Select "Release and Publish" workflow
3. Click "Run workflow"
4. Enter version (e.g., `1.3.2`)
5. Choose whether to do a dry run
6. Click "Run workflow"

### Dry Run

To test the workflow without actually publishing:

```bash
# Manual trigger with dry run
# In GitHub Actions UI, select "true" for dry_run option
```

Or use workflow dispatch:

```bash
gh workflow run release.yml -f version=1.3.2 -f dry_run=true
```

---

### Workflow 2: Independent Version Publishing

This workflow allows each package to have its own version number.

#### Tag Format

Use the following tag format to publish individual packages:

```
<package-name>@<version>
```

Available package names:
- `vue-security-scanner` - Core scanner
- `vite-plugin-vue-security` - Vite plugin
- `webpack-plugin-vue-security` - Webpack plugin
- `nuxt-module-vue-security` - Nuxt module
- `mcp-vue-security-scanner` - MCP integration
- `vue-security-scanner-vscode` - VSCode extension

#### Automatic Publishing

Create and push a package-specific tag:

```bash
# Publish only: core scanner
git tag vue-security-scanner@1.3.2
git push origin vue-security-scanner@1.3.2

# Publish only: Vite plugin
git tag vite-plugin-vue-security@1.2.5
git push origin vite-plugin-vue-security@1.2.5

# Publish only: VSCode extension
git tag vue-security-scanner-vscode@1.1.3
git push origin vue-security-scanner-vscode@1.1.3
```

The workflow will:
1. Extract package name and version from the tag
2. Verify that the version matches package.json
3. Create a GitHub Release for that package
4. Publish only that specific package to npm or VSCode Marketplace
5. Push release to Gitee

#### Manual Publishing

You can also trigger the workflow manually:

1. Go to `Actions` tab in GitHub
2. Select "Release and Publish (Independent Versions)" workflow
3. Click "Run workflow"
4. Select the package to release (or "all" for future batch releases)
5. Enter version (e.g., `1.3.2`)
6. Choose whether to do a dry run
7. Click "Run workflow"

#### Dry Run

To test the workflow without actually publishing:

```bash
# Manual trigger with dry run
# In GitHub Actions UI, select "true" for dry_run option
```

Or use workflow dispatch:

```bash
gh workflow run release-independent.yml -f package=vue-security-scanner -f version=1.3.2 -f dry_run=true
```

#### Version Verification

The workflow automatically verifies that:
- The tag version matches the version in package.json
- The package name is valid
- The package path exists

If versions don't match, the workflow will fail with an error message.

---

### Choosing the Right Workflow

| Scenario | Recommended Workflow |
|----------|---------------------|
| All packages should have the same version | [release.yml](.github/workflows/release.yml) |
| Packages need independent versions | [release-independent.yml](.github/workflows/release-independent.yml) |
| Quick release of a single package | [release-independent.yml](.github/workflows/release-independent.yml) |
| Coordinated release of all packages | [release.yml](.github/workflows/release.yml) |
| Testing the release process | Either workflow with dry run |

## Published Packages

The workflow publishes the following packages:

| Package | npm Name | Path | Version |
|---------|-----------|------|----------|
| Core Scanner | `vue-security-scanner` | `./` | Synced with tag |
| Vite Plugin | `vite-plugin-vue-security` | `./vite-plugin-vue-security` | Synced with tag |
| Webpack Plugin | `webpack-plugin-vue-security` | `./webpack-plugin-vue-security` | Synced with tag |
| Nuxt Module | `nuxt-module-vue-security` | `./nuxt-module-vue-security` | Synced with tag |
| MCP | `mcp-vue-security-scanner` | `./mcp` | Synced with tag |
| VSCode Extension | `vue-security-scanner` | `./vue-security-scanner-vscode` | Synced with tag |

## Version Management

### Semantic Versioning

Follow [Semantic Versioning](https://semver.org/):

- **MAJOR** (X.0.0): Breaking changes
- **MINOR** (1.X.0): New features, backwards compatible
- **PATCH** (1.0.X): Bug fixes, backwards compatible

### Updating Versions

Before publishing, update version numbers in all `package.json` files:

```bash
# Update version in all package.json files
npm version 1.3.2 --workspaces-update=false

# Or manually update:
# - package.json
# - vite-plugin-vue-security/package.json
# - webpack-plugin-vue-security/package.json
# - nuxt-module-vue-security/package.json
# - mcp/package.json
# - vue-security-scanner-vscode/package.json
```

### Version Sync

**For Synchronized Workflow ([release.yml](.github/workflows/release.yml)):**
All packages should have the same version number for consistency.

**For Independent Workflow ([release-independent.yml](.github/workflows/release-independent.yml)):**
Each package can have its own version number. Only update the package.json file for the specific package you want to release.

Example of independent versions:
- `vue-security-scanner`: 1.3.2
- `vite-plugin-vue-security`: 1.2.5
- `webpack-plugin-vue-security`: 1.2.5
- `nuxt-module-vue-security`: 1.2.5
- `mcp-vue-security-scanner`: 1.0.3
- `vue-security-scanner-vscode`: 1.1.3

## Pre-Release Checklist

### For Synchronized Release ([release.yml](.github/workflows/release.yml)):

- [ ] Update version in **all** `package.json` files
- [ ] Update `CHANGELOG.md` with changes
- [ ] Run tests locally: `npm test`
- [ ] Verify all plugins work correctly
- [ ] Update README if needed
- [ ] Commit all changes
- [ ] Create and push version tag: `git tag v1.3.2 && git push origin v1.3.2`
- [ ] Verify all GitHub secrets are configured

### For Independent Release ([release-independent.yml](.github/workflows/release-independent.yml)):

- [ ] Update version **only** in the specific package's `package.json`
- [ ] Update `CHANGELOG.md` with changes
- [ ] Run tests locally: `npm test`
- [ ] Verify the specific package works correctly
- [ ] Update README if needed
- [ ] Commit all changes
- [ ] Create and push package-specific tag: `git tag vue-security-scanner@1.3.2 && git push origin vue-security-scanner@1.3.2`
- [ ] Verify all GitHub secrets are configured

## Post-Release Steps

### For Synchronized Release ([release.yml](.github/workflows/release.yml)):

After successful release:

1. **Verify npm packages**:
   ```bash
   npm view vue-security-scanner
   npm view vite-plugin-vue-security
   npm view webpack-plugin-vue-security
   npm view nuxt-module-vue-security
   npm view mcp-vue-security-scanner
   ```

2. **Verify VSCode extension**:
   - Go to [VSCode Marketplace](https://marketplace.visualstudio.com/)
   - Search for "Vue Security Scanner"
   - Verify version is updated

3. **Verify GitHub Release**:
   - Go to [Releases page](https://github.com/ereddate/vue-security-scanner/releases)
   - Verify release notes are correct

4. **Verify Gitee Release**:
   - Go to [Gitee Releases](https://gitee.com/ereddate2017/vue-security-scanner/releases)
   - Verify release is synced

5. **Update documentation** if needed

### For Independent Release ([release-independent.yml](.github/workflows/release-independent.yml)):

After successful release:

1. **Verify specific npm package**:
   ```bash
   # Example: verify core scanner
   npm view vue-security-scanner
   
   # Example: verify Vite plugin
   npm view vite-plugin-vue-security
   ```

2. **Verify VSCode extension** (if released):
   - Go to [VSCode Marketplace](https://marketplace.visualstudio.com/)
   - Search for "Vue Security Scanner"
   - Verify version is updated

3. **Verify GitHub Release**:
   - Go to [Releases page](https://github.com/ereddate/vue-security-scanner/releases)
   - Verify the specific package release notes are correct

4. **Verify Gitee Release**:
   - Go to [Gitee Releases](https://gitee.com/ereddate2017/vue-security-scanner/releases)
   - Verify the specific package release is synced

5. **Update documentation** if needed

## Troubleshooting

### npm Publish Fails

**Error**: `401 Unauthorized`

**Solution**: Check that `NPM_TOKEN` is correctly set and has publish permissions.

**Error**: `403 Forbidden`

**Solution**: Ensure you're not trying to publish a package name that already exists and you don't own.

### VSCode Publish Fails

**Error**: `Authentication failed`

**Solution**: Verify `VSCE_PAT` has Marketplace permissions.

**Error**: `Extension already exists`

**Solution**: Ensure the extension name in `package.json` is unique or you own it.

### Gitee Push Fails

**Error**: `Authentication failed`

**Solution**: Verify `GITEE_TOKEN` is correct and has repo permissions.

### Workflow Fails

**Error**: Tests fail

**Solution**: Run tests locally first and fix any issues before publishing.

**Error**: Build fails

**Solution**: Check build logs and fix build errors.

**Error**: Version mismatch

**Solution** (for independent workflow): Ensure the tag version matches the version in the package.json file of the specific package.

**Error**: Invalid package name

**Solution** (for independent workflow): Ensure the package name in the tag is one of the valid package names.

## Rollback

### For Synchronized Release ([release.yml](.github/workflows/release.yml)):

If you need to rollback a release:

```bash
# Delete the tag locally and remotely
git tag -d v1.3.2
git push origin :refs/tags/v1.3.2

# Unpublish from npm (use with caution)
npm unpublish vue-security-scanner@1.3.2
npm unpublish vite-plugin-vue-security@1.3.2
npm unpublish webpack-plugin-vue-security@1.3.2
npm unpublish nuxt-module-vue-security@1.3.2
npm unpublish mcp-vue-security-scanner@1.3.2

# Delete GitHub release
# Go to Releases page and delete the release
```

### For Independent Release ([release-independent.yml](.github/workflows/release-independent.yml)):

If you need to rollback a specific package release:

```bash
# Example: Rollback core scanner v1.3.2
# Delete the tag locally and remotely
git tag -d vue-security-scanner@1.3.2
git push origin :refs/tags/vue-security-scanner@1.3.2

# Unpublish specific package from npm (use with caution)
npm unpublish vue-security-scanner@1.3.2

# Example: Rollback Vite plugin v1.2.5
git tag -d vite-plugin-vue-security@1.2.5
git push origin :refs/tags/vite-plugin-vue-security@1.2.5
npm unpublish vite-plugin-vue-security@1.2.5

# Delete GitHub release
# Go to Releases page and delete the specific release
```

## Best Practices

1. **Always test locally** before triggering the workflow
2. **Use dry run** first to verify everything works
3. **Keep CHANGELOG updated** for transparency
4. **Use semantic versioning** for consistency
5. **Monitor GitHub Actions** for any failures
6. **Verify all packages** after release
7. **Communicate changes** to users via release notes

## Support

For issues with publishing:
- Check [GitHub Actions logs](https://github.com/ereddate/vue-security-scanner/actions)
- Review [workflow file](https://github.com/ereddate/vue-security-scanner/blob/main/.github/workflows/release.yml)
- Open an [issue](https://github.com/ereddate/vue-security-scanner/issues) if needed
