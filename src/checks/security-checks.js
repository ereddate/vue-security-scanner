const cheerio = require('cheerio');

const regexCache = new Map();

function getCachedRegex(key, pattern, flags = 'gi') {
  if (!regexCache.has(key)) {
    regexCache.set(key, new RegExp(pattern, flags));
  }
  const regex = regexCache.get(key);
  regex.lastIndex = 0;
  return regex;
}

function clearRegexCache() {
  regexCache.clear();
}

/**
 * Check for XSS vulnerabilities in Vue files
 * @param {string} filePath - Path to the file being scanned
 * @param {string} content - Content of the file
 * @returns {Array} - Array of vulnerability objects
 */
function checkForXSS(filePath, content) {
  const vulnerabilities = [];
  
  const vHtmlMatches = findAllMatches(content, getCachedRegex('xss-v-html', 'v-html\\s*=|v-html:'));
  vHtmlMatches.forEach(match => {
    vulnerabilities.push({
      type: 'Potential XSS via v-html',
      severity: 'High',
      file: filePath,
      line: getLineNumber(content, match.index),
      description: 'Using v-html can lead to XSS vulnerabilities if not properly sanitized',
      recommendation: 'Avoid using v-html with user-provided content. If necessary, sanitize the content using a library like DOMPurify.'
    });
  });
  
  const dangerousHtmlMatches = findAllMatches(content, getCachedRegex('xss-dangerously-set-inner-html', 'dangerouslySetInnerHTML'));
  dangerousHtmlMatches.forEach(match => {
    vulnerabilities.push({
      type: 'Potential XSS via dangerouslySetInnerHTML',
      severity: 'High',
      file: filePath,
      line: getLineNumber(content, match.index),
      description: 'Using dangerouslySetInnerHTML can lead to XSS vulnerabilities',
      recommendation: 'Avoid using dangerouslySetInnerHTML with user-provided content. Sanitize the content before use.'
    });
  });
  
  const interpolationMatches = findAllMatches(content, getCachedRegex('xss-interpolation', '\\{\\{\\s*(.*?)\\s*\\}\\}', 'g'));
  interpolationMatches.forEach(match => {
    if (isPotentiallyUnsafeInterpolation(match[1])) {
      vulnerabilities.push({
        type: 'Potential Template Injection',
        severity: 'Medium',
        file: filePath,
        line: getLineNumber(content, match.index),
        description: `Potentially unsafe interpolation: ${match[1].substring(0, 50)}`,
        recommendation: 'Ensure interpolated values are properly sanitized before rendering.'
      });
    }
  });
  
  if (filePath.endsWith('.vue')) {
    let $ = null;
    try {
      $ = cheerio.load(content, {
        xmlMode: false,
        decodeEntities: false
      });
      
      $('*[onclick], *[ondblclick], *[onmouseover], *[onmouseout], *[onkeydown], *[onkeyup]').each(function() {
        const tagName = $(this).prop('tagName');
        const attributes = $(this).prop('attributes');
        let eventName = '';
        
        if (attributes) {
          for (let i = 0; i < attributes.length; i++) {
            if (attributes[i].name && attributes[i].name.startsWith('on')) {
              eventName = attributes[i].name;
              break;
            }
          }
        }
        
        vulnerabilities.push({
          type: 'Inline Event Handler',
          severity: 'Medium',
          file: filePath,
          line: 'N/A',
          description: `Inline event handler (${eventName}) in ${tagName} tag`,
          recommendation: 'Use proper Vue event binding instead of inline event handlers (e.g., @click instead of onclick).'
        });
      });
    } catch (e) {
      console.warn(`Could not parse Vue template in ${filePath}: ${e.message}`);
    } finally {
      if ($) {
        $ = null;
      }
    }
  }
  
  return vulnerabilities;
}

/**
 * Check for insecure dependencies in package.json
 * @param {string} filePath - Path to the file being scanned
 * @param {string} content - Content of the file
 * @returns {Array} - Array of vulnerability objects
 */
function checkForInsecureDependencies(filePath, content) {
  if (!filePath.endsWith('package.json')) {
    return [];
  }
  
  const vulnerabilities = [];
  
  try {
    const packageJson = JSON.parse(content);
    const dependencies = { ...packageJson.dependencies, ...packageJson.devDependencies };
    
    for (const [name, version] of Object.entries(dependencies)) {
      // Check for known vulnerable packages
      if (isKnownVulnerablePackage(name, version)) {
        vulnerabilities.push({
          type: 'Insecure Dependency',
          severity: 'High',
          file: filePath,
          line: 'N/A',
          description: `${name}@${version} has known security vulnerabilities`,
          recommendation: `Update ${name} to a secure version.`
        });
      }
      
      // Check for deprecated packages
      if (isDeprecatedPackage(name)) {
        vulnerabilities.push({
          type: 'Deprecated Dependency',
          severity: 'Low',
          file: filePath,
          line: 'N/A',
          description: `${name} is deprecated`,
          recommendation: `Consider replacing ${name} with an actively maintained alternative.`
        });
      }
      
      // Check for outdated packages (potentially having known vulnerabilities)
      if (isOutdatedPackage(name, version)) {
        vulnerabilities.push({
          type: 'Outdated Dependency',
          severity: 'Medium',
          file: filePath,
          line: 'N/A',
          description: `${name}@${version} is outdated and may contain known vulnerabilities`,
          recommendation: `Update ${name} to the latest stable version.`
        });
      }
      
      // Check for packages with security advisories
      if (hasSecurityAdvisory(name)) {
        vulnerabilities.push({
          type: 'Dependency with Security Advisory',
          severity: 'High',
          file: filePath,
          line: 'N/A',
          description: `${name} has published security advisories`,
          recommendation: `Check security advisories for ${name} and update to a patched version.`
        });
      }
    }
    
    // Check for insecure configurations in package.json
    if (packageJson.vue && packageJson.vue.productionTip === true) {
      vulnerabilities.push({
        type: 'Vue Production Tip Enabled',
        severity: 'Low',
        file: filePath,
        line: 'N/A',
        description: 'Vue production tip is enabled, potentially leaking Vue version information',
        recommendation: 'Set vue.productionTip to false in production builds.'
      });
    }
    
    if (packageJson.vue && packageJson.vue.performance === true) {
      vulnerabilities.push({
        type: 'Vue Performance Tracking Enabled',
        severity: 'Low',
        file: filePath,
        line: 'N/A',
        description: 'Vue performance tracking is enabled in production, leaking performance data',
        recommendation: 'Disable Vue performance tracking in production builds.'
      });
    }
    
  } catch (e) {
    console.warn(`Could not parse package.json in ${filePath}: ${e.message}`);
  }
  
  return vulnerabilities;
}

/**
 * Check for common security misconfigurations
 * @param {string} filePath - Path to the file being scanned
 * @param {string} content - Content of the file
 * @returns {Array} - Array of vulnerability objects
 */
function checkForMisconfigurations(filePath, content) {
  const vulnerabilities = [];
  
  const secretPatterns = [
    { key: 'secret-password', pattern: "password\\s*[:=]\\s*['\"`][^'\"`]+['\"`]" },
    { key: 'secret-secret', pattern: "secret\\s*[:=]\\s*['\"`][^'\"`]+['\"`]" },
    { key: 'secret-token', pattern: "token\\s*[:=]\\s*['\"`][^'\"`]+['\"`]" },
    { key: 'secret-api-key', pattern: "api[_-]?key\\s*[:=]\\s*['\"`][^'\"`]+['\"`]" },
    { key: 'secret-private-key', pattern: "private[_-]?key\\s*[:=]\\s*['\"`][^'\"`]+['\"`]" },
    { key: 'secret-auth-token', pattern: "auth[_-]?token\\s*[:=]\\s*['\"`][^'\"`]+['\"`]" },
    { key: 'secret-access-token', pattern: "access[_-]?token\\s*[:=]\\s*['\"`][^'\"`]+['\"`]" },
    { key: 'secret-client-secret', pattern: "client[_-]?secret\\s*[:=]\\s*['\"`][^'\"`]+['\"`]" }
  ];
  
  secretPatterns.forEach(({ key, pattern }) => {
    const matches = findAllMatches(content, getCachedRegex(key, pattern));
    matches.forEach(match => {
      if (!isLikelyPlaceholder(match[0])) {
        vulnerabilities.push({
          type: 'Hardcoded Secret',
          severity: 'High',
          file: filePath,
          line: getLineNumber(content, match.index),
          description: `Possible hardcoded secret: ${match[0].substring(0, 50)}`,
          recommendation: 'Move sensitive credentials to environment variables or secure vault systems.'
        });
      }
    });
  });
  
  if (filePath.endsWith('.js') || filePath.endsWith('.ts') || filePath.endsWith('.vue')) {
    const xssProtectionDisabled = findAllMatches(content, getCachedRegex('misconfig-xss-protection', '__proto__|constructor\\.prototype|Vue\\.config\\.productionTip\\s*=\\s*false|Vue\\.config\\.performance\\s*=\\s*true'));
    xssProtectionDisabled.forEach(match => {
      vulnerabilities.push({
        type: 'Vue Configuration Misconfiguration',
        severity: 'Medium',
        file: filePath,
        line: getLineNumber(content, match.index),
        description: `Potentially insecure Vue configuration: ${match[0]}`,
        recommendation: 'Review Vue configuration to ensure security-related settings are properly configured.'
      });
    });
  }
  
  const corsMatches = findAllMatches(content, getCachedRegex('misconfig-cors', "Access-Control-Allow-Origin\\s*[:=]\\s*['\"`]\\*['\"`]"));
  corsMatches.forEach(match => {
    vulnerabilities.push({
      type: 'Insecure CORS Policy',
      severity: 'High',
      file: filePath,
      line: getLineNumber(content, match.index),
      description: 'Wildcard CORS policy allows requests from any origin',
      recommendation: 'Restrict Access-Control-Allow-Origin to specific trusted domains.'
    });
  });
  
  const evalMatches = findAllMatches(content, getCachedRegex('misconfig-eval', '\\beval\\s*\\('));
  evalMatches.forEach(match => {
    vulnerabilities.push({
      type: 'Dangerous eval Usage',
      severity: 'High',
      file: filePath,
      line: getLineNumber(content, match.index),
      description: 'Using eval() can lead to code injection vulnerabilities',
      recommendation: 'Avoid using eval(). Use safer alternatives like JSON.parse() for parsing JSON.'
    });
  });
  
  const protoPollutionMatches = findAllMatches(content, getCachedRegex('misconfig-proto-pollution', "\\[(\"') *__proto__\\1?\\]"));
  protoPollutionMatches.forEach(match => {
    vulnerabilities.push({
      type: 'Prototype Pollution',
      severity: 'High',
      file: filePath,
      line: getLineNumber(content, match.index),
      description: `Potential prototype pollution vulnerability: ${match[0]}`,
      recommendation: 'Avoid accessing __proto__ property directly. Validate and sanitize object keys before assignment.'
    });
  });
  
  const dynamicImportMatches = findAllMatches(content, getCachedRegex('misconfig-dynamic-import', "import\\s*\\(\\s*.*[^'\"].*\\s*\\)", 'g'));
  dynamicImportMatches.forEach(match => {
    if (!isSafeDynamicImport(match[0])) {
      vulnerabilities.push({
        type: 'Unsafe Dynamic Import',
        severity: 'Medium',
        file: filePath,
        line: getLineNumber(content, match.index),
        description: `Potentially unsafe dynamic import: ${match[0]}`,
        recommendation: 'Ensure dynamic imports use statically analyzable strings or properly validate the import path.'
      });
    }
  });
  
  const routeParamMatches = findAllMatches(content, getCachedRegex('misconfig-route-params', '\\$route\\.params|\\$route\\.query'));
  routeParamMatches.forEach(match => {
    // Check if route params are used directly in templates or dangerously
    if (isUnsafeRouteUsage(content, match.index)) {
      vulnerabilities.push({
        type: 'Unsafe Route Parameter Usage',
        severity: 'High',
        file: filePath,
        line: getLineNumber(content, match.index),
        description: `Route parameter used unsafely: ${match[0]}`,
        recommendation: 'Sanitize and validate route parameters before using them in templates or DOM manipulation.'
      });
    }
  });
  
  const formValidationMatches = findAllMatches(content, getCachedRegex('misconfig-form-validation', "v-model\\s*=\\s*[\"'][^\"']*[\"']", 'g'));
  formValidationMatches.forEach(match => {
    if (!hasValidation(content, match.index)) {
      vulnerabilities.push({
        type: 'Missing Input Validation',
        severity: 'Medium',
        file: filePath,
        line: getLineNumber(content, match.index),
        description: `Input binding without apparent validation: ${match[0]}`,
        recommendation: 'Add proper input validation and sanitization for all user inputs.'
      });
    }
  });
  
  if (filePath.includes('router') || filePath.endsWith('.js') || filePath.endsWith('.ts')) {
    const redirectMatches = findAllMatches(content, getCachedRegex('misconfig-redirect', '(router\\.push|this\\.\\$router\\.push)\\s*\\(\\s*\\{'));
    redirectMatches.forEach(match => {
      vulnerabilities.push({
        type: 'Potential Open Redirect',
        severity: 'Medium',
        file: filePath,
        line: getLineNumber(content, match.index),
        description: 'Potential open redirect vulnerability in router navigation',
        recommendation: 'Validate redirect URLs against a whitelist of allowed domains/endpoints.'
      });
    });
  }
  
  const missingSecurityHeaders = [
    { key: 'header-app-use', pattern: 'app\\.use|express|server', header: 'X-Frame-Options', description: 'Missing X-Frame-Options header (clickjacking protection)' },
    { key: 'header-xss', pattern: 'app\\.use|express|server', header: 'X-XSS-Protection', description: 'Missing X-XSS-Protection header' },
    { key: 'header-content-type', pattern: 'app\\.use|express|server', header: 'X-Content-Type-Options', description: 'Missing X-Content-Type-Options header' },
    { key: 'header-hsts', pattern: 'app\\.use|express|server', header: 'Strict-Transport-Security', description: 'Missing HSTS header' },
    { key: 'header-csp', pattern: 'app\\.use|express|server', header: 'Content-Security-Policy', description: 'Missing CSP header' }
  ];
  
  for (const headerInfo of missingSecurityHeaders) {
    const regex = getCachedRegex(headerInfo.key, headerInfo.pattern);
    if (regex.test(content)) {
      vulnerabilities.push({
        type: 'Missing Security Header',
        severity: 'Medium',
        file: filePath,
        line: 'N/A',
        description: headerInfo.description,
        recommendation: `Add the ${headerInfo.header} header to prevent security attacks.`
      });
    }
  }
  
  const domBasedXssPatterns = [
    { key: 'dom-xss-location', pattern: 'document\\.location|window\\.location|location\\.href|location\\.hash|location\\.search' },
    { key: 'dom-xss-write', pattern: 'document\\.write\\(|document\\.writeln\\(' },
    { key: 'dom-xss-html', pattern: 'innerHTML|outerHTML|insertAdjacentHTML' },
    { key: 'dom-xss-eval', pattern: 'eval\\(|new Function\\(' },
    { key: 'dom-xss-timeout', pattern: "setTimeout\\s*\\(\\s*[\"'`]|setInterval\\s*\\(\\s*[\"'`]" }
  ];
  
  domBasedXssPatterns.forEach(({ key, pattern }) => {
    const matches = findAllMatches(content, getCachedRegex(key, pattern));
    matches.forEach(match => {
      vulnerabilities.push({
        type: 'Potential DOM-based XSS',
        severity: 'High',
        file: filePath,
        line: getLineNumber(content, match.index),
        description: `Potential DOM-based XSS vulnerability: ${match[0]}`,
        recommendation: 'Avoid directly using user-controllable data in DOM manipulation functions. Sanitize and validate all inputs.'
      });
    });
  });
  
  const sensitiveUrlPatterns = [
    { key: 'url-location-href', pattern: 'location\\.href\\s*[+=].*(password|token|key|secret|auth|credential)' },
    { key: 'url-window-location', pattern: 'window\\.location\\s*[+=].*(password|token|key|secret|auth|credential)' },
    { key: 'url-fetch', pattern: "fetch\\s*\\(\\s*[\"'`][^\"']*\\?(?=.*password|token|key|secret|auth|credential)" }
  ];
  
  sensitiveUrlPatterns.forEach(({ key, pattern }) => {
    const matches = findAllMatches(content, getCachedRegex(key, pattern));
    matches.forEach(match => {
      vulnerabilities.push({
        type: 'Sensitive Data in URL',
        severity: 'High',
        file: filePath,
        line: getLineNumber(content, match.index),
        description: `Sensitive data may be exposed in URL: ${match[0].substring(0, 100)}`,
        recommendation: 'Avoid passing sensitive data in URLs as they can be logged in server logs and browser history.'
      });
    });
  });
  
  const weakRandomPatterns = [
    { key: 'weak-random-math', pattern: 'Math\\.random\\(\\)' },
    { key: 'weak-random-crypto', pattern: 'crypto\\.randomBytes\\([^,]*,?\\s*null\\s*,?' }
  ];
  
  weakRandomPatterns.forEach(({ key, pattern }) => {
    const matches = findAllMatches(content, getCachedRegex(key, pattern));
    matches.forEach(match => {
      vulnerabilities.push({
        type: 'Weak Random Number Generation',
        severity: 'Medium',
        file: filePath,
        line: getLineNumber(content, match.index),
        description: `Potentially weak random number generation: ${match[0]}`,
        recommendation: 'For cryptographically secure random numbers, use crypto.getRandomValues() or crypto.randomBytes() with proper callback handling.'
      });
    });
  });
  
  if (filePath.endsWith('.vue') || filePath.endsWith('.js') || filePath.endsWith('.ts')) {
    const vueFilterPatterns = [
      { key: 'vue-filter-object', pattern: 'filters\\s*:\\s*\\{' },
      { key: 'vue-filter-method', pattern: 'Vue\\.filter\\s*\\(' }
    ];
    
    vueFilterPatterns.forEach(({ key, pattern }) => {
      const matches = findAllMatches(content, getCachedRegex(key, pattern));
      matches.forEach(match => {
        vulnerabilities.push({
          type: 'Vue Filter Usage',
          severity: 'Medium',
          file: filePath,
          line: getLineNumber(content, match.index),
          description: `Vue filter defined, review for potential security issues: ${match[0]}`,
          recommendation: 'Ensure Vue filters properly sanitize and validate input to prevent XSS vulnerabilities.'
        });
      });
    });
    
    const vueMixinPatterns = [
      { key: 'vue-mixin-array', pattern: 'mixins\\s*:\\s*\\[' },
      { key: 'vue-mixin-method', pattern: '\\.mixin\\s*\\(' },
      { key: 'vue-mixin-vue', pattern: 'Vue\\.mixin\\s*\\(' },
      { key: 'vue-extends', pattern: 'extends\\s*:\\s*' }
    ];
    
    vueMixinPatterns.forEach(({ key, pattern }) => {
      const matches = findAllMatches(content, getCachedRegex(key, pattern));
      matches.forEach(match => {
        vulnerabilities.push({
          type: 'Vue Mixin Usage',
          severity: 'Low',
          file: filePath,
          line: getLineNumber(content, match.index),
          description: `Vue mixin usage detected: ${match[0]}`,
          recommendation: 'Review mixins for potential security issues, especially those from external sources.'
        });
      });
    });
    
    const vueRefsPatterns = [
      { key: 'vue-refs-string', pattern: "\\$refs\\[\\s*[\"'`][^\"']*[\"'`]\\s*\\]" },
      { key: 'vue-refs-variable', pattern: '\\$refs\\[\\s*\\w+\\s*\\]' }
    ];
    
    vueRefsPatterns.forEach(({ key, pattern }) => {
      const matches = findAllMatches(content, getCachedRegex(key, pattern));
      matches.forEach(match => {
        vulnerabilities.push({
          type: 'Vue $refs Dynamic Access',
          severity: 'Medium',
          file: filePath,
          line: getLineNumber(content, match.index),
          description: `Dynamic Vue $refs access: ${match[0]}`,
          recommendation: 'Avoid dynamic $refs access with user-controlled values to prevent DOM-based vulnerabilities.'
        });
      });
    });
    
    if (filePath.endsWith('.vue') || filePath.endsWith('.js') || filePath.endsWith('.ts')) {
      const compositionApiPatterns = [
        { key: 'composition-import', pattern: "import\\s+{[^}]*\\b(ref|reactive|computed|inject|provide)\\b[^}]*}\\s+from\\s+['\"]vue['\"]" },
        { key: 'composition-ref', pattern: "ref\\s*\\(\\s*(?!('|\"|`))" },
        { key: 'composition-reactive', pattern: "reactive\\s*\\(\\s*(?!('|\"|`))" },
        { key: 'composition-inject', pattern: "inject\\s*\\(\\s*(?!('|\"|`))" },
        { key: 'composition-provide', pattern: "provide\\s*\\(\\s*(?!('|\"|`))" }
      ];
      
      compositionApiPatterns.forEach(({ key, pattern }) => {
        const matches = findAllMatches(content, getCachedRegex(key, pattern));
        matches.forEach(match => {
          const context = getContext(content, match.index, 100);
          if (/(location|route|query|params|user|input|data)/i.test(context)) {
            vulnerabilities.push({
              type: 'Vue 3 Composition API Potential Issue',
              severity: 'Medium',
              file: filePath,
              line: getLineNumber(content, match.index),
              description: `Vue 3 Composition API usage with potential security concern: ${match[0]}`,
              recommendation: 'Review Composition API usage to ensure proper validation of reactive data sources.'
            });
          }
        });
      });
    }
    
    // Check for unsafe dynamic component usage
    const dynamicComponentPatterns = [
      /<component[^>]+:[^>]+is\s*=/gi,  // Dynamic component with v-bind :is
      /<component[^>]+v-bind:is\s*=/gi,  // Dynamic component with v-bind:is
      /:is\s*=\s*["'][^"'>]+["']/gi,  // Direct :is attribute usage
      /component\s+:\s*["'][^"'>]+["']/gi  // Component with string binding (JS)
    ];
    
    dynamicComponentPatterns.forEach(pattern => {
      const matches = findAllMatches(content, pattern);
      matches.forEach(match => {
        vulnerabilities.push({
          type: 'Vue Dynamic Component Usage',
          severity: 'High',
          file: filePath,
          line: getLineNumber(content, match.index),
          description: `Dynamic component usage: ${match[0].substring(0, 100)}`,
          recommendation: 'Validate dynamic component names against a whitelist to prevent arbitrary component instantiation.'
        });
      });
    });
    
    // Check for unsafe slot usage
    const slotPatterns = [
      /<slot[^>]*>/gi,
      /v-slot(?::|=)/gi,  // v-slot with arguments or equal sign
      /slot-scope\s*=/gi
    ];
    
    slotPatterns.forEach(pattern => {
      const matches = findAllMatches(content, pattern);
      matches.forEach(match => {
        // Only flag if slots are used with user-provided content
        const context = getContext(content, match.index, 200);
        if (/(user|input|dynamic|untrusted)/i.test(context)) {
          vulnerabilities.push({
            type: 'Vue Slot Usage',
            severity: 'Medium',
            file: filePath,
            line: getLineNumber(content, match.index),
            description: `Vue slot usage with potential security concern`,
            recommendation: 'Ensure slots do not render untrusted user content without proper sanitization.'
          });
        }
      });
    });
    
    // Check for Vue 2/3 prototype pollution vulnerabilities
    const protoPollutionPatterns = [
      /Object\.prototype\.(\w+)\s*=/gi,
      /\["?__proto__"?\]\s*=/gi,
      /constructor\.prototype\.(\w+)\s*=/gi
    ];
    
    protoPollutionPatterns.forEach(pattern => {
      const matches = findAllMatches(content, pattern);
      matches.forEach(match => {
        vulnerabilities.push({
          type: 'Vue Prototype Pollution',
          severity: 'High',
          file: filePath,
          line: getLineNumber(content, match.index),
          description: `Potential prototype pollution vulnerability: ${match[0]}`,
          recommendation: 'Never allow user input to directly manipulate object prototypes. Use safe-set libraries or validation.'
        });
      });
    });
    
    // Additional Vue-specific security checks
    
    // Check for v-text and v-bind directives with potential XSS
    const vueDirectivePatterns = [
      /v-text\s*=\s*["'][^"']*["']/gi,  // v-text with dynamic content
      /v-bind:inner-html\s*=/gi,  // v-bind for innerHTML
      /v-\w+\s*=\s*["']{{\s*.*?\s*}}["']/gi  // Other directives with interpolations
    ];
    
    vueDirectivePatterns.forEach(pattern => {
      const matches = findAllMatches(content, pattern);
      matches.forEach(match => {
        vulnerabilities.push({
          type: 'Vue Directive Security Issue',
          severity: 'Medium',
          file: filePath,
          line: getLineNumber(content, match.index),
          description: `Vue directive with potential security issue: ${match[0]}`,
          recommendation: 'Ensure Vue directives do not bind untrusted content without proper sanitization.'
        });
      });
    });
    
    // Check for Vue router security issues
    const vueRouterPatterns = [
      /beforeEach\s*\(/gi,  // Router guards
      /addRoute\s*\(/gi,  // Dynamic route addition
      /this\.\$route\.params\.([^.]|\s)*\./gi,  // Accessing route params properties
      /router\.push\s*\(\s*\{/gi,  // Navigation with object
      /router\.replace\s*\(\s*\{/gi  // Replace with object
    ];
    
    vueRouterPatterns.forEach(pattern => {
      const matches = findAllMatches(content, pattern);
      matches.forEach(match => {
        vulnerabilities.push({
          type: 'Vue Router Security Issue',
          severity: 'Medium',
          file: filePath,
          line: getLineNumber(content, match.index),
          description: `Vue router usage with potential security concern: ${match[0]}`,
          recommendation: 'Validate and sanitize route parameters and destinations to prevent open redirects and parameter pollution.'
        });
      });
    });
    
    // Check for Vuex/Pinia store security issues
    const stateManagementPatterns = [
      /commit\s*\(\s*["'][^"']*\s*\+\s*["']/gi,  // Dynamic mutation names
      /dispatch\s*\(\s*["'][^"']*\s*\+\s*["']/gi,  // Dynamic action names
      /store\.state\./gi,  // Direct state access
      /mapState\s*\(/gi,  // State mapping
      /defineStore/gi  // Pinia stores
    ];
    
    stateManagementPatterns.forEach(pattern => {
      const matches = findAllMatches(content, pattern);
      matches.forEach(match => {
        // Only flag if it involves user input
        const context = getContext(content, match.index, 100);
        if (/(params|query|user|input|external|untrusted)/i.test(context)) {
          vulnerabilities.push({
            type: 'State Management Security Issue',
            severity: 'Medium',
            file: filePath,
            line: getLineNumber(content, match.index),
            description: `State management usage with potential security concern: ${match[0]}`,
            recommendation: 'Avoid storing sensitive information in client-side state without encryption. Validate all data before committing to store.'
          });
        }
      });
    });
    
    // Check for custom directive security issues
    const customDirectivePatterns = [
      /directive\s*\(/gi,
      /Vue\.directive\s*\(/gi,
      /app\.directive\s*\(/gi
    ];
    
    customDirectivePatterns.forEach(pattern => {
      const matches = findAllMatches(content, pattern);
      matches.forEach(match => {
        vulnerabilities.push({
          type: 'Vue Custom Directive Usage',
          severity: 'Medium',
          file: filePath,
          line: getLineNumber(content, match.index),
          description: `Vue custom directive defined: ${match[0]}`,
          recommendation: 'Review custom directives for potential DOM manipulation vulnerabilities.'
        });
      });
    });
    
    // Check for v-for with potential issues
    const vForPatterns = [
      /v-for\s*=\s*["'][^"']* in ([^"']*)["']/gi,
      /v-for\s*=\s*["'][^"']* of ([^"']*)["']/gi
    ];
    
    vForPatterns.forEach(pattern => {
      const matches = findAllMatches(content, pattern);
      matches.forEach(match => {
        // Check if the iteration source is from untrusted input
        const context = getContext(content, match.index, 50);
        if (/(params|query|user|input|external|untrusted)/i.test(context)) {
          vulnerabilities.push({
            type: 'Vue v-for Security Issue',
            severity: 'Medium',
            file: filePath,
            line: getLineNumber(content, match.index),
            description: `Vue v-for with potential security concern: ${match[0]}`,
            recommendation: 'Ensure iteration sources are validated and sanitized to prevent injection attacks.'
          });
        }
      });
    });
  }
  
  // TypeScript-specific security checks
  if (filePath.endsWith('.ts') || filePath.endsWith('.tsx')) {
    // Check for unsafe type assertions
    const unsafeTypeAssertionPattern = /\b(as\s+|as\s*\()(\w+|HTMLElement|any|unknown|Object|Function)\b/gi;
    const typeAssertionMatches = findAllMatches(content, unsafeTypeAssertionPattern);
    typeAssertionMatches.forEach(match => {
      // Exclude legitimate type assertions like 'as const'
      if (!/\b(as\s+const|as\s+never|as\s+readonly)\b/i.test(match[0])) {
        vulnerabilities.push({
          type: 'TypeScript Unsafe Type Assertion',
          severity: 'Medium',
          file: filePath,
          line: getLineNumber(content, match.index),
          description: `Potentially unsafe TypeScript type assertion: ${match[0]}`,
          recommendation: 'Be cautious with type assertions, especially when dealing with user input. Consider using type guards or validation instead of forceful casting.'
        });
      }
    });
    
    // Check for use of 'any' type which bypasses type safety
    const anyTypePattern = /\b(any|Object)\b/g;
    const anyTypeMatches = findAllMatches(content, anyTypePattern);
    anyTypeMatches.forEach(match => {
      // Avoid flagging legitimate uses like Object.assign
      if (!/\b(Object\.assign|Object\.keys|Object\.values|Object\.entries)\b/.test(content.substring(Math.max(0, match.index - 20), match.index + match[0].length + 20))) {
        vulnerabilities.push({
          type: 'TypeScript Any Type Usage',
          severity: 'Medium',
          file: filePath,
          line: getLineNumber(content, match.index),
          description: `Use of 'any' or 'Object' type bypasses TypeScript safety: ${match[0]}`,
          recommendation: 'Use specific types instead of \'any\' to maintain type safety and prevent runtime errors.'
        });
      }
    });
    
    // Check for unsafe decorator usage
    const decoratorPattern = /@(\w+)/g;
    const decoratorMatches = findAllMatches(content, decoratorPattern);
    decoratorMatches.forEach(match => {
      vulnerabilities.push({
        type: 'TypeScript Decorator Usage',
        severity: 'Medium',
        file: filePath,
        line: getLineNumber(content, match.index),
        description: `TypeScript decorator usage: ${match[0]}`,
        recommendation: 'Review decorators carefully as they can modify class/method behavior and potentially introduce security risks.'
      });
    });
    
    // Check for generic type issues
    const genericPattern = /\bfunction\s+\w+<T>\s*\(|class\s+\w+<T>|\b<T>\s*\(.*\)\s*=>/g;
    const genericMatches = findAllMatches(content, genericPattern);
    genericMatches.forEach(match => {
      vulnerabilities.push({
        type: 'TypeScript Generic Type Usage',
        severity: 'Low',
        file: filePath,
        line: getLineNumber(content, match.index),
        description: `Generic type usage without proper constraints: ${match[0]}`,
        recommendation: 'Ensure generic types have proper constraints to prevent type-related security issues.'
      });
    });
  }
  
  return vulnerabilities;
}

/**
 * Helper function to find all matches of a regex pattern in a string
 * @param {string} str - String to search
 * @param {RegExp} regex - Regular expression to match
 * @returns {Array} - Array of match objects
 */
function findAllMatches(str, regex) {
  const matches = [];
  let match;
  
  while ((match = regex.exec(str)) !== null) {
    matches.push(match);
    // Prevent infinite loop for zero-length matches
    if (match.index === regex.lastIndex) {
      regex.lastIndex++;
    }
  }
  
  return matches;
}

/**
 * Get line number for a character index in a string
 * @param {string} str - String to analyze
 * @param {number} index - Character index
 * @returns {number} - Line number (1-based)
 */
function getLineNumber(str, index) {
  const lines = str.substring(0, index).split('\n');
  return lines.length;
}

/**
 * Check if interpolation contains potentially unsafe content
 * @param {string} content - Interpolated content
 * @returns {boolean} - True if potentially unsafe
 */
function isPotentiallyUnsafeInterpolation(content) {
  // Check for direct variable access without sanitization
  const unsafePatterns = [
    /window/,
    /document/,
    /location/,
    /eval/,
    /setTimeout/,
    /setInterval/
  ];
  
  return unsafePatterns.some(pattern => pattern.test(content));
}

/**
 * Check if a match is likely just a placeholder/config example
 * @param {string} match - Matched string
 * @returns {boolean} - True if likely a placeholder
 */
function isLikelyPlaceholder(match) {
  const placeholders = ['YOUR_', 'EXAMPLE_', 'PLACEHOLDER_', 'REPLACE_', 'DEMO_', 'TEST_'];
  return placeholders.some(ph => match.includes(ph));
}

/**
 * Check if package is known to be vulnerable
 * @param {string} name - Package name
 * @param {string} version - Package version
 * @returns {boolean} - True if vulnerable
 */
function isKnownVulnerablePackage(name, version) {
  // In a real implementation, this would check against a database of known vulnerabilities
  // For now, we'll check for some commonly problematic packages
  const vulnerablePackages = [
    'event-stream', // Known malware package
    'coa',         // Known vulnerability
    'lodash',      // Multiple historical vulnerabilities
    'serialize-javascript', // Known vulnerability
    'ansi-regex',  // Known vulnerability
    'minimist',    // Known vulnerability
    'moment',      // Known vulnerabilities
    'jquery',      // Known vulnerabilities
    'bootstrap',   // Known vulnerabilities
    'react',       // Known vulnerabilities in older versions
    'angular',     // Known vulnerabilities in older versions
    'vue',         // Known vulnerabilities in older versions
    'axios',       // Known vulnerabilities in older versions
    'express',     // Known vulnerabilities in older versions
    'request',     // Deprecated and has vulnerabilities
    'left-pad'     // Known incident
  ];
  
  return vulnerablePackages.includes(name);
}

/**
 * Check if package is deprecated
 * @param {string} name - Package name
 * @returns {boolean} - True if deprecated
 */
function isDeprecatedPackage(name) {
  // In a real implementation, this would check npm registry for deprecation status
  // For now, we'll return true for some known deprecated packages
  const deprecatedPackages = [
    'request',     // Officially deprecated
    'grunt',       // Less maintained
    'gulp',        // Less maintained
    'bower',       // Officially deprecated
    'yeoman',      // Less maintained
    'jade'         // Renamed to pug
  ];
  
  return deprecatedPackages.includes(name);
}

/**
 * Check if package is outdated
 * @param {string} name - Package name
 * @param {string} version - Package version
 * @returns {boolean} - True if outdated
 */
function isOutdatedPackage(name, version) {
  // In a real implementation, this would compare with latest version from npm
  // For now, we'll return true for packages with very old versions
  const outdatedVersionPatterns = [
    { name: 'vue', pattern: /^2\.[0-5]\./ },  // Vue 2.5.x and earlier
    { name: 'vue-router', pattern: /^3\.[0-4]\./ },  // Vue Router 3.4.x and earlier
    { name: 'vuex', pattern: /^3\.[0-5]\./ },  // Vuex 3.5.x and earlier
    { name: 'axios', pattern: /^0\./ },  // Axios 0.x versions
    { name: 'lodash', pattern: /^3\./ },  // Lodash 3.x versions
    { name: 'jquery', pattern: /^1\./ },  // jQuery 1.x versions
  ];
  
  for (const pkg of outdatedVersionPatterns) {
    if (pkg.name === name && pkg.pattern.test(version.replace(/[^\d.]/g, ''))) {
      return true;
    }
  }
  
  return false;
}

/**
 * Check if package has security advisories
 * @param {string} name - Package name
 * @returns {boolean} - True if has advisories
 */
function hasSecurityAdvisory(name) {
  // In a real implementation, this would check against security advisory databases
  // For now, we'll return true for packages with known security issues
  const advisoryPackages = [
    'lodash',      // Multiple security advisories
    'moment',      // Multiple security advisories
    'jquery',      // Multiple security advisories
    'serialize-javascript', // Multiple security advisories
    'ejs',         // Multiple security advisories
    'mime',        // Multiple security advisories
    'acorn',       // Multiple security advisories
    'handlebars',  // Multiple security advisories
    'underscore',  // Multiple security advisories
    'prismjs',     // Multiple security advisories
    'marked',      // Multiple security advisories
    'graphql',     // Multiple security advisories
    'ws',          // Multiple security advisories
    'socket.io',   // Multiple security advisories
    'express',     // Multiple security advisories
    'passport',    // Multiple security advisories
    'mongoose',    // Multiple security advisories
    'sequelize',   // Multiple security advisories
    'typeorm',     // Multiple security advisories
    'next',        // Multiple security advisories
    'nuxt',        // Multiple security advisories
  ];
  
  return advisoryPackages.includes(name);
}

/**
 * Check if dynamic import is safe
 * @param {string} importStatement - Dynamic import statement
 * @returns {boolean} - True if safe
 */
function isSafeDynamicImport(importStatement) {
  // A safe dynamic import typically has a static string template with only variable parts
  // For example: import(`./components/${componentName}.js`) is safer than import(userInput)
  return /import\s*\(\s*[`'"]/.test(importStatement);
}

/**
 * Check if route parameter usage is unsafe
 * @param {string} content - File content
 * @param {number} index - Index of the match
 * @returns {boolean} - True if unsafe
 */
function isUnsafeRouteUsage(content, index) {
  // Simple heuristic: if route params are used near v-html or similar dangerous operations
  const context = getContext(content, index, 50);
  return /v-html|innerHTML|outerHTML|eval|Function/.test(context);
}

/**
 * Check if content has validation
 * @param {string} content - File content
 * @param {number} index - Index of the match
 * @returns {boolean} - True if validation is present
 */
function hasValidation(content, index) {
  // Simple heuristic: check if validation-related terms appear nearby
  const context = getContext(content, index, 100);
  return /validate|validation|sanitize|sanitization|filter|check|verify/.test(context);
}

/**
 * Get context around a position in content
 * @param {string} content - File content
 * @param {number} index - Position index
 * @param {number} radius - Context radius
 * @returns {string} - Context string
 */
function getContext(content, index, radius) {
  const start = Math.max(0, index - radius);
  const end = Math.min(content.length, index + radius);
  return content.substring(start, end);
}

/**
 * Unified function to find all vulnerabilities in a file
 * @param {string} filePath - Path to the file being scanned
 * @param {string} content - Content of the file
 * @returns {Array} - Array of vulnerability objects
 */
function findAllVulnerabilities(filePath, content) {
  let vulnerabilities = [];
  
  // Run all security checks
  vulnerabilities = vulnerabilities.concat(checkForXSS(filePath, content));
  vulnerabilities = vulnerabilities.concat(checkForInsecureDependencies(filePath, content));
  vulnerabilities = vulnerabilities.concat(checkForMisconfigurations(filePath, content));
  
  // Additional Vue-specific security checks
  
  const vueDirectivePatterns = [
    { key: 'directive-v-text', pattern: 'v-text\\s*=\\s*[\'"][^\'"]*[\'"]' },
    { key: 'directive-v-bind', pattern: 'v-bind:inner-html\\s*=' },
    { key: 'directive-v-interpolation', pattern: 'v-\\w+\\s*=\\s*[\'"]{{\\s*.*?\\s*}}[\'"]' }
  ];
  
  vueDirectivePatterns.forEach(({ key, pattern }) => {
    const matches = findAllMatches(content, getCachedRegex(key, pattern));
    matches.forEach(match => {
      vulnerabilities.push({
        type: 'Vue Directive Security Issue',
        severity: 'Medium',
        file: filePath,
        line: getLineNumber(content, match.index),
        description: `Vue directive with potential security issue: ${match[0]}`,
        recommendation: 'Ensure Vue directives do not bind untrusted content without proper sanitization.'
      });
    });
  });
  
  const vueRouterPatterns = [
    { key: 'router-before-each', pattern: 'beforeEach\\s*\\(' },
    { key: 'router-add-route', pattern: 'addRoute\\s*\\(' },
    { key: 'router-params', pattern: 'this\\.\\$route\\.params\\.([^.]|\\s)*\\.' },
    { key: 'router-push', pattern: 'router\\.push\\s*\\(\\s*\\{' },
    { key: 'router-replace', pattern: 'router\\.replace\\s*\\(\\s*\\{' },
    { key: 'router-this-push', pattern: 'this\\.\\$router\\.push\\s*\\(' },
    { key: 'router-this-replace', pattern: 'this\\.\\$router\\.replace\\s*\\(' }
  ];
  
  vueRouterPatterns.forEach(({ key, pattern }) => {
    const matches = findAllMatches(content, getCachedRegex(key, pattern));
    matches.forEach(match => {
      vulnerabilities.push({
        type: 'Vue Router Security Issue',
        severity: 'Medium',
        file: filePath,
        line: getLineNumber(content, match.index),
        description: `Vue router usage with potential security concern: ${match[0]}`,
        recommendation: 'Validate and sanitize route parameters and destinations to prevent open redirects and parameter pollution.'
      });
    });
  });
  
  const stateManagementPatterns = [
    { key: 'state-commit', pattern: 'commit\\s*\\(\\s*[\'"][^\'"]*\\s*\\+\\s*[\'"]' },
    { key: 'state-dispatch', pattern: 'dispatch\\s*\\(\\s*[\'"][^\'"]*\\s*\\+\\s*[\'"]' },
    { key: 'state-access', pattern: 'store\\.state\\.' },
    { key: 'state-map', pattern: 'mapState\\s*\\(' },
    { key: 'state-define', pattern: 'defineStore' },
    { key: 'state-create', pattern: 'createStore' }
  ];
  
  stateManagementPatterns.forEach(({ key, pattern }) => {
    const matches = findAllMatches(content, getCachedRegex(key, pattern));
    matches.forEach(match => {
      const context = getContext(content, match.index, 100);
      if (/(params|query|user|input|external|untrusted)/i.test(context)) {
        vulnerabilities.push({
          type: 'State Management Security Issue',
          severity: 'Medium',
          file: filePath,
          line: getLineNumber(content, match.index),
          description: `State management usage with potential security concern: ${match[0]}`,
          recommendation: 'Avoid storing sensitive information in client-side state without encryption. Validate all data before committing to store.'
        });
      }
    });
  });
  
  const customDirectivePatterns = [
    { key: 'custom-directive', pattern: 'directive\\s*\\(' },
    { key: 'vue-directive', pattern: 'Vue\\.directive\\s*\\(' },
    { key: 'app-directive', pattern: 'app\\.directive\\s*\\(' }
  ];
  
  customDirectivePatterns.forEach(({ key, pattern }) => {
    const matches = findAllMatches(content, getCachedRegex(key, pattern));
    matches.forEach(match => {
      vulnerabilities.push({
        type: 'Vue Custom Directive Usage',
        severity: 'Medium',
        file: filePath,
        line: getLineNumber(content, match.index),
        description: `Vue custom directive defined: ${match[0]}`,
        recommendation: 'Review custom directives for potential DOM manipulation vulnerabilities.'
      });
    });
  });
  
  const vForPatterns = [
    { key: 'v-for-in', pattern: 'v-for\\s*=\\s*[\'"][^\'"]* in ([^\'"]*)[\'"]' },
    { key: 'v-for-of', pattern: 'v-for\\s*=\\s*[\'"][^\'"]* of ([^\'"]*)[\'"]' }
  ];
  
  vForPatterns.forEach(({ key, pattern }) => {
    const matches = findAllMatches(content, getCachedRegex(key, pattern));
    matches.forEach(match => {
      const context = getContext(content, match.index, 50);
      if (/(params|query|user|input|external|untrusted)/i.test(context)) {
        vulnerabilities.push({
          type: 'Vue v-for Security Issue',
          severity: 'Medium',
          file: filePath,
          line: getLineNumber(content, match.index),
          description: `Vue v-for with potential security concern: ${match[0]}`,
          recommendation: 'Ensure iteration sources are validated and sanitized to prevent injection attacks.'
        });
      }
    });
  });
  
  const dynamicComponentPatterns = [
    { key: 'component-is', pattern: '<component\\s*:is\\s*=' },
    { key: 'component-v-bind', pattern: '<component\\s*v-bind:is\\s*=' },
    { key: 'create-element', pattern: 'createElement\\s*\\(\\s*[\'"`][^\'"`]*[\'"`]' },
    { key: 'h-function', pattern: 'h\\s*\\(\\s*[\'"`][^\'"`]*[\'"`]' }
  ];
  
  dynamicComponentPatterns.forEach(({ key, pattern }) => {
    const matches = findAllMatches(content, getCachedRegex(key, pattern));
    matches.forEach(match => {
      vulnerabilities.push({
        type: 'Vue Dynamic Component Usage',
        severity: 'High',
        file: filePath,
        line: getLineNumber(content, match.index),
        description: `Vue dynamic component usage: ${match[0]}`,
        recommendation: 'Validate component names to prevent loading arbitrary components.'
      });
    });
  });
  
  const slotPatterns = [
    { key: 'slot-tag', pattern: '<slot' },
    { key: 'slot-named', pattern: '<template\\s*#' },
    { key: 'slot-v-slot', pattern: '<template\\s+v-slot' }
  ];
  
  slotPatterns.forEach(({ key, pattern }) => {
    const matches = findAllMatches(content, getCachedRegex(key, pattern));
    matches.forEach(match => {
      const context = getContext(content, match.index, 100);
      if (/(user|external|untrusted|input)/i.test(context)) {
        vulnerabilities.push({
          type: 'Vue Slot Security Issue',
          severity: 'Medium',
          file: filePath,
          line: getLineNumber(content, match.index),
          description: `Vue slot usage with potential security concern: ${match[0]}`,
          recommendation: 'Be cautious with slot content from untrusted sources.'
        });
      }
    });
  });
  
  return vulnerabilities;
}

module.exports = {
  checkForXSS,
  checkForInsecureDependencies,
  checkForMisconfigurations,
  findAllVulnerabilities
};