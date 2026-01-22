const cheerio = require('cheerio');

/**
 * Check for XSS vulnerabilities in Vue files
 * @param {string} filePath - Path to the file being scanned
 * @param {string} content - Content of the file
 * @returns {Array} - Array of vulnerability objects
 */
function checkForXSS(filePath, content) {
  const vulnerabilities = [];
  
  // Check for dangerous usage of v-html
  const vHtmlMatches = findAllMatches(content, /v-html\s*=|v-html:/gi);
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
  
  // Check for insecure use of dangerouslySetInnerHTML (if using Vue with JSX)
  const dangerousHtmlMatches = findAllMatches(content, /dangerouslySetInnerHTML/gi);
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
  
  // Check for potential template injection
  const interpolationMatches = findAllMatches(content, /\{\{\s*(.*?)\s*\}\}/g);
  interpolationMatches.forEach(match => {
    // Look for potential unsafe interpolations
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
  
  // For .vue files, also check the template section
  if (filePath.endsWith('.vue')) {
    try {
      const $ = cheerio.load(content, {
        xmlMode: false,
        decodeEntities: false
      });
      
      // Find elements with inline event handlers
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
          line: 'N/A', // Cheerio doesn\'t provide line numbers
          description: `Inline event handler (${eventName}) in ${tagName} tag`,
          recommendation: 'Use proper Vue event binding instead of inline event handlers (e.g., @click instead of onclick).'
        });
      });
    } catch (e) {
      console.warn(`Could not parse Vue template in ${filePath}: ${e.message}`);
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
  
  // Check for hardcoded secrets in .env files or JavaScript files
  const secretPatterns = [
    /password\s*[:=]\s*['"`][^'"`]+['"`]/gi,
    /secret\s*[:=]\s*['"`][^'"`]+['"`]/gi,
    /token\s*[:=]\s*['"`][^'"`]+['"`]/gi,
    /api[_-]?key\s*[:=]\s*['"`][^'"`]+['"`]/gi,
    /private[_-]?key\s*[:=]\s*['"`][^'"`]+['"`]/gi,
    /auth[_-]?token\s*[:=]\s*['"`][^'"`]+['"`]/gi,
    /access[_-]?token\s*[:=]\s*['"`][^'"`]+['"`]/gi,
    /client[_-]?secret\s*[:=]\s*['"`][^'"`]+['"`]/gi
  ];
  
  secretPatterns.forEach(pattern => {
    const matches = findAllMatches(content, pattern);
    matches.forEach(match => {
      // Don't flag if it's just a configuration example or placeholder
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
  
  // Check for Vue-specific misconfigurations
  if (filePath.endsWith('.js') || filePath.endsWith('.ts') || filePath.endsWith('.vue')) {
    // Check for disable of Vue's built-in XSS protection
    const xssProtectionDisabled = findAllMatches(content, /__proto__|constructor\.prototype|Vue\.config\.productionTip\s*=\s*false|Vue\.config\.performance\s*=\s*true/gi);
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
  
  // Check for insecure CORS settings in config files
  const corsMatches = findAllMatches(content, /Access-Control-Allow-Origin\s*[:=]\s*['"`]\*['"`]/gi);
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
  
  // Check for dangerous eval usage
  const evalMatches = findAllMatches(content, /\beval\s*\(/gi);
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
  
  // Check for potential prototype pollution
  const protoPollutionMatches = findAllMatches(content, /\[(["']) *__proto__\1?\]/gi);
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
  
  // Check for unsafe dynamic imports
  const dynamicImportMatches = findAllMatches(content, /import\s*\(\s*.*[^'"].*\s*\)/g);
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
  
  // Check for unsafe use of $route params (potential XSS)
  const routeParamMatches = findAllMatches(content, /\$route\.params|\$route\.query/g);
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
  
  // Check for missing input validation in forms
  const formValidationMatches = findAllMatches(content, /v-model\s*=\s*["'][^"']*["']/g);
  formValidationMatches.forEach(match => {
    // In a real implementation, we'd check if validation is applied
    // For now, we'll flag all v-model bindings without obvious validation
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
  
  // Check for potential open redirect vulnerabilities in router
  if (filePath.includes('router') || filePath.endsWith('.js') || filePath.endsWith('.ts')) {
    const redirectMatches = findAllMatches(content, /(router\.push|this\.\$router\.push)\s*\(\s*\{/g);
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

module.exports = {
  checkForXSS,
  checkForInsecureDependencies,
  checkForMisconfigurations
};