# Vue Support Guide

This guide provides comprehensive information about Vue.js version support in Vue Security Scanner.

## Overview

Vue Security Scanner supports multiple versions of Vue.js, providing tailored security scanning for each version's specific features and potential vulnerabilities.

## Supported Vue.js Versions

| Vue Version | Support Status | Features |
|-------------|----------------|----------|
| Vue 2.x     | Full Support   | Vue 2 specific features and vulnerabilities |
| Vue 3.x     | Full Support   | Vue 3 Composition API, Teleport, Suspense, etc. |
| Nuxt 2      | Full Support   | Nuxt 2 specific features and modules |
| Nuxt 3      | Full Support   | Nuxt 3 specific features and app structure |
| Vite        | Full Support   | Vite-specific configuration and optimizations |
| VuePress    | Partial Support| Static site generator security |
| Quasar      | Partial Support| Quasar framework security |
| Ionic Vue   | Partial Support| Mobile framework security |

## Vue 2.x Support

### Key Features

- **Options API Support**: Full scanning of Vue 2 Options API patterns
- **Vuex Support**: Detection of Vuex-specific security issues
- **Vue Router Support**: Analysis of Vue Router configuration
- **Mixin Analysis**: Detection of security issues in mixins
- **Filter Analysis**: Scanning of Vue 2 filters
- **Directive Analysis**: Security checking of custom directives

### Vue 2 Specific Rules

```javascript
{
  id: 'vue2-mixin-security',
  name: 'Vue 2 Mixin Security',
  description: 'Detects security issues in Vue 2 mixins',
  severity: 'medium',
  pattern: /mixin[s]?\s*[:=]\s*\{[\s\S]*?\}/g,
  fix: 'Review mixin code for security issues',
  examples: [
    {
      code: "const authMixin = {\n  data() {\n    return {\n      token: 'hardcoded-token'\n    }\n  }\n}",
      message: 'Hardcoded token in Vue 2 mixin detected'
    }
  ]
}
```

### Vue 2 Scanning Example

```bash
# Scan Vue 2 project
vue-security-scanner . --vue2

# With Vue 2 specific rules
vue-security-scanner . --vue2 --rules vue2

# With legacy compatibility mode
vue-security-scanner . --vue2 --compatibility legacy
```

## Vue 3.x Support

### Key Features

- **Composition API Support**: Analysis of Composition API patterns
- **Script Setup Support**: Scanning of `<script setup>` syntax
- **Reactivity API Analysis**: Security checking of Reactivity API usage
- **Teleport Analysis**: Detection of security issues in Teleport components
- **Suspense Analysis**: Security checking of Suspense components
- **Provide/Inject Analysis**: Detection of insecure provide/inject patterns
- **V3 Directives**: Analysis of Vue 3 custom directives

### Vue 3 Specific Rules

```javascript
{
  id: 'vue3-composition-api-security',
  name: 'Vue 3 Composition API Security',
  description: 'Detects security issues in Vue 3 Composition API',
  severity: 'medium',
  pattern: /setup\s*\(\)\s*\{[\s\S]*?\}/g,
  fix: 'Review Composition API code for security issues',
  examples: [
    {
      code: "setup() {\n  const apiKey = 'hardcoded-api-key';\n  return { apiKey }\n}",
      message: 'Hardcoded API key in Vue 3 setup function detected'
    }
  ]
}
```

### Vue 3 Scanning Example

```bash
# Scan Vue 3 project
vue-security-scanner . --vue3

# With Vue 3 specific rules
vue-security-scanner . --vue3 --rules vue3

# With script setup support
vue-security-scanner . --vue3 --script-setup
```

## Nuxt.js Support

### Nuxt 2 Support

- **Page Analysis**: Scanning of Nuxt 2 pages
- **Layout Analysis**: Security checking of Nuxt 2 layouts
- **Middleware Analysis**: Detection of security issues in middleware
- **Plugin Analysis**: Scanning of Nuxt 2 plugins
- **Module Analysis**: Security checking of Nuxt 2 modules

### Nuxt 3 Support

- **App Directory Support**: Scanning of Nuxt 3 app directory structure
- **Server Components Support**: Analysis of server components
- **API Routes Analysis**: Security checking of API routes
- **Middleware Analysis**: Detection of security issues in Nuxt 3 middleware
- **Plugin Analysis**: Scanning of Nuxt 3 plugins

### Nuxt Scanning Example

```bash
# Scan Nuxt 2 project
vue-security-scanner . --nuxt

# Scan Nuxt 3 project
vue-security-scanner . --nuxt3

# With Nuxt specific rules
vue-security-scanner . --nuxt --rules nuxt
```

## Vite Support

### Key Features

- **Vite Config Analysis**: Scanning of vite.config.js
- **Plugin Analysis**: Security checking of Vite plugins
- **Dependency Analysis**: Detection of vulnerable dependencies
- **Environment Variable Analysis**: Security checking of .env files
- **Optimization Analysis**: Detection of insecure optimization settings

### Vite Scanning Example

```bash
# Scan Vite project
vue-security-scanner . --vite

# With Vite specific rules
vue-security-scanner . --vite --rules vite

# Include vite.config.js in scan
vue-security-scanner . --vite --include "vite.config.js"
```

## Framework-Specific Configuration

### Vue 2 Configuration

```json
{
  "scan": {
    "vue": {
      "version": 2,
      "features": {
        "optionsApi": true,
        "vuex": true,
        "vueRouter": true,
        "mixins": true,
        "filters": true,
        "directives": true
      }
    }
  }
}
```

### Vue 3 Configuration

```json
{
  "scan": {
    "vue": {
      "version": 3,
      "features": {
        "compositionApi": true,
        "scriptSetup": true,
        "reactivityApi": true,
        "teleport": true,
        "suspense": true,
        "provideInject": true,
        "v3Directives": true
      }
    }
  }
}
```

### Nuxt Configuration

```json
{
  "scan": {
    "nuxt": {
      "version": 3,
      "features": {
        "appDirectory": true,
        "serverComponents": true,
        "apiRoutes": true,
        "middleware": true,
        "plugins": true
      }
    }
  }
}
```

## Vue-Specific Vulnerabilities

### Options API Vulnerabilities

```javascript
// Unsafe: Hardcoded secret in data()
export default {
  data() {
    return {
      secret: 'hardcoded-secret' // Vulnerable
    }
  }
}

// Safe: Use environment variable
export default {
  data() {
    return {
      secret: process.env.VUE_APP_SECRET // Secure
    }
  }
}
```

### Composition API Vulnerabilities

```javascript
// Unsafe: Hardcoded API key in setup()
export default {
  setup() {
    const apiKey = 'hardcoded-api-key' // Vulnerable
    return { apiKey }
  }
}

// Safe: Use provide/inject with secure source
export default {
  setup() {
    const apiKey = inject('apiKey') // Secure
    return { apiKey }
  }
}
```

### Vuex Vulnerabilities

```javascript
// Unsafe: Mutation that allows arbitrary state changes
const store = new Vuex.Store({
  mutations: {
    updateState(state, payload) {
      Object.assign(state, payload) // Vulnerable
    }
  }
})

// Safe: Explicit mutation
const store = new Vuex.Store({
  mutations: {
    updateUser(state, user) {
      state.user = { ...state.user, ...user } // Secure
    }
  }
})
```

### Vue Router Vulnerabilities

```javascript
// Unsafe: Dynamic route with no validation
const router = new VueRouter({
  routes: [
    { path: '/user/:id', component: UserComponent } // Vulnerable
  ]
})

// Safe: Dynamic route with props validation
const router = new VueRouter({
  routes: [
    {
      path: '/user/:id',
      component: UserComponent,
      props: (route) => ({ id: parseInt(route.params.id) }) // Secure
    }
  ]
})
```

## Scanning Strategies by Vue Version

### Vue 2 Projects

```bash
# Comprehensive Vue 2 scan
vue-security-scanner . --vue2 --level detailed

# Fast Vue 2 scan for CI
vue-security-scanner . --vue2 --performance fast --severity high,critical

# Vue 2 with Vuex and Vue Router
vue-security-scanner . --vue2 --rules vue2,vuex,vue-router
```

### Vue 3 Projects

```bash
# Comprehensive Vue 3 scan
vue-security-scanner . --vue3 --level detailed

# Fast Vue 3 scan for CI
vue-security-scanner . --vue3 --performance fast --severity high,critical

# Vue 3 with Composition API focus
vue-security-scanner . --vue3 --rules vue3,composition-api
```

### Nuxt Projects

```bash
# Nuxt 2 scan
vue-security-scanner . --nuxt --level detailed

# Nuxt 3 scan
vue-security-scanner . --nuxt3 --level detailed

# Nuxt with API routes scan
vue-security-scanner . --nuxt3 --include "server/api/**/*.js"
```

## Performance Optimization for Vue Projects

### Vue 2 Performance

```bash
# Optimized Vue 2 scan
vue-security-scanner . --vue2 --batch-size 10 --performance fast

# Incremental Vue 2 scan
vue-security-scanner . --vue2 --incremental
```

### Vue 3 Performance

```bash
# Optimized Vue 3 scan
vue-security-scanner . --vue3 --batch-size 10 --performance fast

# Incremental Vue 3 scan
vue-security-scanner . --vue3 --incremental
```

## Vue-Specific Best Practices

### General Vue Best Practices

1. **Use Environment Variables**: For API keys and secrets
2. **Validate Props**: Always validate component props
3. **Sanitize Input**: Clean user input before use
4. **Use HTTPS**: Always use secure connections
5. **Implement CSP**: Use Content Security Policy
6. **Secure Vuex Store**: Validate mutations and actions
7. **Protect Routes**: Implement route guards
8. **Use Secure Dependencies**: Regularly update packages
9. **Implement Rate Limiting**: Prevent brute force attacks
10. **Monitor for Security Issues**: Regular security scans

### Vue 2 Specific Best Practices

1. **Avoid Mutating Props**: Use data or computed properties instead
2. **Use Proper Key Management**: For v-for directives
3. **Implement Lifecycle Hooks Securely**: Especially beforeDestroy
4. **Review Mixins Carefully**: They can introduce security issues
5. **Secure Event Handlers**: Validate event data

### Vue 3 Specific Best Practices

1. **Use Script Setup Safely**: Avoid exposing sensitive data
2. **Implement Provide/Inject Securely**: Don't expose secrets
3. **Use Teleport Responsibly**: Only teleport to trusted elements
4. **Secure Suspense Components**: Handle errors properly
5. **Use Reactive API Safely**: Avoid reactive secrets

## Troubleshooting Vue Scanning

### Vue 2 Issues

If you encounter issues scanning Vue 2 projects:

1. **Enable Vue 2 Mode**: Use `--vue2` flag
2. **Check Vue Version**: Ensure the scanner detects the correct Vue version
3. **Review Mixins**: Complex mixins can cause parsing issues
4. **Check Filters**: Custom filters may require special handling
5. **Update Scanner**: Ensure you're using the latest version

### Vue 3 Issues

If you encounter issues scanning Vue 3 projects:

1. **Enable Vue 3 Mode**: Use `--vue3` flag
2. **Check Script Setup**: Ensure script setup syntax is supported
3. **Review Composition API**: Complex Composition API usage may need adjustment
4. **Check Teleport/Suspense**: These features may require special handling
5. **Update Scanner**: Ensure you're using the latest version

### Nuxt Issues

If you encounter issues scanning Nuxt projects:

1. **Specify Nuxt Version**: Use `--nuxt` for Nuxt 2, `--nuxt3` for Nuxt 3
2. **Check Server Files**: Ensure server-side files are properly scanned
3. **Review Modules**: Nuxt modules may introduce security complexities
4. **Check Middleware**: Custom middleware may need special attention
5. **Update Scanner**: Ensure you're using the latest version

## Enterprise Vue Support

### Enterprise Features

- **Custom Vue Rules**: Create Vue-specific custom rules
- **Framework Integration**: Deep integration with Vue ecosystem
- **Compliance Scanning**: Vue-specific compliance checks
- **Advanced Reporting**: Vue-focused security reports
- **Priority Support**: Dedicated support for Vue security issues

### Enterprise Configuration

```json
{
  "enterprise": {
    "vue": {
      "customRules": {
        "enabled": true,
        "path": "./vue-custom-rules.js"
      },
      "compliance": {
        "enabled": true,
        "standards": ["pci-dss", "gdpr", "iso27001"]
      }
    }
  }
}
```

## Support

For additional Vue-specific support:

1. **Vue Documentation**: Review Vue's official security documentation
2. **GitHub Issues**: Report Vue-specific scanning issues
3. **Enterprise Support**: Contact enterprise support for Vue-specific assistance
4. **Community Forum**: Ask questions in the Vue Security community

## Next Steps

- **Configure for Your Vue Version**: Set up the scanner for your specific Vue version
- **Enable Framework-Specific Rules**: Activate Vue-specific security rules
- **Implement Regular Scanning**: Set up routine security scans for your Vue project
- **Review Vue-Specific Best Practices**: Follow Vue security best practices
- **Stay Updated**: Keep both Vue and the scanner updated for latest security features
