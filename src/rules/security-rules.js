const customRules = require('./custom-rules');

const securityRules = [
  {
    id: 'xss-v-html',
    name: 'XSS via v-html',
    severity: 'High',
    description: 'Using v-html can lead to XSS vulnerabilities if not properly sanitized',
    recommendation: 'Avoid using v-html with user-provided content. If necessary, sanitize the content using a library like DOMPurify.',
    patterns: [
      { key: 'v-html', pattern: 'v-html\\s*=|v-html:' }
    ]
  },
  {
    id: 'xss-dangerously-set-inner-html',
    name: 'XSS via dangerouslySetInnerHTML',
    severity: 'High',
    description: 'Using dangerouslySetInnerHTML can lead to XSS vulnerabilities',
    recommendation: 'Avoid using dangerouslySetInnerHTML with user-provided content. Sanitize the content before use.',
    patterns: [
      { key: 'dangerously-set-inner-html', pattern: 'dangerouslySetInnerHTML' }
    ]
  },
  {
    id: 'xss-interpolation',
    name: 'Template Injection',
    severity: 'Medium',
    description: 'Potentially unsafe interpolation',
    recommendation: 'Ensure interpolated values are properly sanitized before rendering.',
    patterns: [
      { key: 'interpolation', pattern: '\\{\\{\\s*(.*?)\\s*\\}\\}', flags: 'g' }
    ]
  },
  {
    id: 'hardcoded-password',
    name: 'Hardcoded Password',
    severity: 'High',
    description: 'Possible hardcoded password',
    recommendation: 'Move sensitive credentials to environment variables or secure vault systems.',
    patterns: [
      { key: 'password', pattern: "password\\s*[:=]\\s*['\"`][^'\"`]+['\"`]" }
    ]
  },
  {
    id: 'hardcoded-secret',
    name: 'Hardcoded Secret',
    severity: 'High',
    description: 'Possible hardcoded secret',
    recommendation: 'Move sensitive credentials to environment variables or secure vault systems.',
    patterns: [
      { key: 'secret', pattern: "secret\\s*[:=]\\s*['\"`][^'\"`]+['\"`]" }
    ]
  },
  {
    id: 'hardcoded-token',
    name: 'Hardcoded Token',
    severity: 'High',
    description: 'Possible hardcoded token',
    recommendation: 'Move sensitive credentials to environment variables or secure vault systems.',
    patterns: [
      { key: 'token', pattern: "token\\s*[:=]\\s*['\"`][^'\"`]+['\"`]" }
    ]
  },
  {
    id: 'hardcoded-api-key',
    name: 'Hardcoded API Key',
    severity: 'High',
    description: 'Possible hardcoded API key',
    recommendation: 'Move sensitive credentials to environment variables or secure vault systems.',
    patterns: [
      { key: 'api-key', pattern: "api[_-]?key\\s*[:=]\\s*['\"`][^'\"`]+['\"`]" }
    ]
  },
  {
    id: 'hardcoded-private-key',
    name: 'Hardcoded Private Key',
    severity: 'High',
    description: 'Possible hardcoded private key',
    recommendation: 'Move sensitive credentials to environment variables or secure vault systems.',
    patterns: [
      { key: 'private-key', pattern: "private[_-]?key\\s*[:=]\\s*['\"`][^'\"`]+['\"`]" }
    ]
  },
  {
    id: 'hardcoded-auth-token',
    name: 'Hardcoded Auth Token',
    severity: 'High',
    description: 'Possible hardcoded auth token',
    recommendation: 'Move sensitive credentials to environment variables or secure vault systems.',
    patterns: [
      { key: 'auth-token', pattern: "auth[_-]?token\\s*[:=]\\s*['\"`][^'\"`]+['\"`]" }
    ]
  },
  {
    id: 'hardcoded-access-token',
    name: 'Hardcoded Access Token',
    severity: 'High',
    description: 'Possible hardcoded access token',
    recommendation: 'Move sensitive credentials to environment variables or secure vault systems.',
    patterns: [
      { key: 'access-token', pattern: "access[_-]?token\\s*[:=]\\s*['\"`][^'\"`]+['\"`]" }
    ]
  },
  {
    id: 'hardcoded-client-secret',
    name: 'Hardcoded Client Secret',
    severity: 'High',
    description: 'Possible hardcoded client secret',
    recommendation: 'Move sensitive credentials to environment variables or secure vault systems.',
    patterns: [
      { key: 'client-secret', pattern: "client[_-]?secret\\s*[:=]\\s*['\"`][^'\"`]+['\"`]" }
    ]
  },
  {
    id: 'vue-config-xss',
    name: 'Vue Configuration Misconfiguration',
    severity: 'Medium',
    description: 'Potentially insecure Vue configuration',
    recommendation: 'Review Vue configuration to ensure security-related settings are properly configured.',
    patterns: [
      { key: 'vue-config', pattern: '__proto__|constructor\\.prototype|Vue\\.config\\.productionTip\\s*=\\s*false|Vue\\.config\\.performance\\s*=\\s*true' }
    ]
  },
  {
    id: 'cors-wildcard',
    name: 'Insecure CORS Policy',
    severity: 'High',
    description: 'Wildcard CORS policy allows requests from any origin',
    recommendation: 'Restrict Access-Control-Allow-Origin to specific trusted domains.',
    patterns: [
      { key: 'cors', pattern: "Access-Control-Allow-Origin\\s*[:=]\\s*['\"`]\\*['\"`]" }
    ]
  },
  {
    id: 'eval-usage',
    name: 'Dangerous eval Usage',
    severity: 'High',
    description: 'Using eval() can lead to code injection vulnerabilities',
    recommendation: 'Avoid using eval(). Use safer alternatives like JSON.parse() for parsing JSON.',
    patterns: [
      { key: 'eval', pattern: '\\beval\\s*\\(' }
    ]
  },
  {
    id: 'prototype-pollution',
    name: 'Prototype Pollution',
    severity: 'High',
    description: 'Potential prototype pollution vulnerability',
    recommendation: 'Avoid accessing __proto__ property directly. Validate and sanitize object keys before assignment.',
    patterns: [
      { key: 'proto', pattern: "\\[(\"') *__proto__\\1?\\]" }
    ]
  },
  {
    id: 'unsafe-dynamic-import',
    name: 'Unsafe Dynamic Import',
    severity: 'Medium',
    description: 'Potentially unsafe dynamic import',
    recommendation: 'Ensure dynamic imports use statically analyzable strings or properly validate the import path.',
    patterns: [
      { key: 'dynamic-import', pattern: "import\\s*\\(\\s*.*[^'\"].*\\s*\\)", flags: 'g' }
    ]
  },
  {
    id: 'route-params-unsafe',
    name: 'Unsafe Route Parameter Usage',
    severity: 'High',
    description: 'Route parameter used unsafely',
    recommendation: 'Sanitize and validate route parameters before using them in templates or DOM manipulation.',
    patterns: [
      { key: 'route-params', pattern: '\\$route\\.params|\\$route\\.query' }
    ]
  },
  {
    id: 'missing-input-validation',
    name: 'Missing Input Validation',
    severity: 'Medium',
    description: 'Input binding without apparent validation',
    recommendation: 'Add proper input validation and sanitization for all user inputs.',
    patterns: [
      { key: 'v-model', pattern: "v-model\\s*=\\s*[\"'][^\"']*[\"']", flags: 'g' }
    ]
  },
  {
    id: 'open-redirect',
    name: 'Potential Open Redirect',
    severity: 'Medium',
    description: 'Potential open redirect vulnerability in router navigation',
    recommendation: 'Validate redirect URLs against a whitelist of allowed domains/endpoints.',
    patterns: [
      { key: 'router-push', pattern: '(router\\.push|this\\.\\$router\\.push)\\s*\\(\\s*\\{' }
    ]
  },
  {
    id: 'dom-xss-location',
    name: 'DOM-based XSS (Location)',
    severity: 'High',
    description: 'Potential DOM-based XSS vulnerability',
    recommendation: 'Avoid directly using user-controllable data in DOM manipulation functions. Sanitize and validate all inputs.',
    patterns: [
      { key: 'location', pattern: 'document\\.location|window\\.location|location\\.href|location\\.hash|location\\.search' }
    ]
  },
  {
    id: 'dom-xss-write',
    name: 'DOM-based XSS (Write)',
    severity: 'High',
    description: 'Potential DOM-based XSS vulnerability',
    recommendation: 'Avoid directly using user-controllable data in DOM manipulation functions. Sanitize and validate all inputs.',
    patterns: [
      { key: 'document-write', pattern: 'document\\.write\\(|document\\.writeln\\(' }
    ]
  },
  {
    id: 'dom-xss-html',
    name: 'DOM-based XSS (HTML)',
    severity: 'High',
    description: 'Potential DOM-based XSS vulnerability',
    recommendation: 'Avoid directly using user-controllable data in DOM manipulation functions. Sanitize and validate all inputs.',
    patterns: [
      { key: 'inner-html', pattern: 'innerHTML|outerHTML|insertAdjacentHTML' }
    ]
  },
  {
    id: 'dom-xss-eval',
    name: 'DOM-based XSS (Eval)',
    severity: 'High',
    description: 'Potential DOM-based XSS vulnerability',
    recommendation: 'Avoid directly using user-controllable data in DOM manipulation functions. Sanitize and validate all inputs.',
    patterns: [
      { key: 'eval-function', pattern: 'eval\\(|new Function\\(' }
    ]
  },
  {
    id: 'dom-xss-timeout',
    name: 'DOM-based XSS (Timeout)',
    severity: 'High',
    description: 'Potential DOM-based XSS vulnerability',
    recommendation: 'Avoid directly using user-controllable data in DOM manipulation functions. Sanitize and validate all inputs.',
    patterns: [
      { key: 'timeout', pattern: "setTimeout\\s*\\(\\s*[\"'`]|setInterval\\s*\\(\\s*[\"'`]" }
    ]
  },
  {
    id: 'sensitive-url-data',
    name: 'Sensitive Data in URL',
    severity: 'High',
    description: 'Sensitive data may be exposed in URL',
    recommendation: 'Avoid passing sensitive data in URLs as they can be logged in server logs and browser history.',
    patterns: [
      { key: 'url-location', pattern: 'location\\.href\\s*[+=].*(password|token|key|secret|auth|credential)' },
      { key: 'url-window', pattern: 'window\\.location\\s*[+=].*(password|token|key|secret|auth|credential)' },
      { key: 'url-fetch', pattern: "fetch\\s*\\(\\s*[\"'`][^\"']*\\?(?=.*password|token|key|secret|auth|credential)" }
    ]
  },
  {
    id: 'weak-random',
    name: 'Weak Random Number Generation',
    severity: 'Medium',
    description: 'Potentially weak random number generation',
    recommendation: 'For cryptographically secure random numbers, use crypto.getRandomValues() or crypto.randomBytes() with proper callback handling.',
    patterns: [
      { key: 'math-random', pattern: 'Math\\.random\\(\\)' },
      { key: 'crypto-random', pattern: 'crypto\\.randomBytes\\([^,]*,?\\s*null\\s*,?' }
    ]
  },
  {
    id: 'vue-filter',
    name: 'Vue Filter Usage',
    severity: 'Medium',
    description: 'Vue filter defined, review for potential security issues',
    recommendation: 'Ensure Vue filters properly sanitize and validate input to prevent XSS vulnerabilities.',
    patterns: [
      { key: 'filter-object', pattern: 'filters\\s*:\\s*\\{' },
      { key: 'filter-method', pattern: 'Vue\\.filter\\s*\\(' }
    ]
  },
  {
    id: 'vue-mixin',
    name: 'Vue Mixin Usage',
    severity: 'Low',
    description: 'Vue mixin usage detected',
    recommendation: 'Review mixins for potential security issues, especially those from external sources.',
    patterns: [
      { key: 'mixin-array', pattern: 'mixins\\s*:\\s*\\[' },
      { key: 'mixin-method', pattern: '\\.mixin\\s*\\(' },
      { key: 'mixin-vue', pattern: 'Vue\\.mixin\\s*\\(' },
      { key: 'extends', pattern: 'extends\\s*:\\s*' }
    ]
  },
  {
    id: 'vue-refs-dynamic',
    name: 'Vue $refs Dynamic Access',
    severity: 'Medium',
    description: 'Dynamic Vue $refs access',
    recommendation: 'Avoid dynamic $refs access with user-controlled values to prevent DOM-based vulnerabilities.',
    patterns: [
      { key: 'refs-string', pattern: "\\$refs\\[\\s*[\"'`][^\"']*[\"'`]\\s*\\]" },
      { key: 'refs-variable', pattern: '\\$refs\\[\\s*\\w+\\s*\\]' }
    ]
  },
  {
    id: 'vue-composition-api',
    name: 'Vue 3 Composition API Potential Issue',
    severity: 'Medium',
    description: 'Vue 3 Composition API usage with potential security concern',
    recommendation: 'Review Composition API usage to ensure proper validation of reactive data sources.',
    patterns: [
      { key: 'composition-import', pattern: "import\\s+{[^}]*\\b(ref|reactive|computed|inject|provide)\\b[^}]*}\\s+from\\s+['\"]vue['\"]" },
      { key: 'composition-ref', pattern: "ref\\s*\\(\\s*(?!('|\"|`))" },
      { key: 'composition-reactive', pattern: "reactive\\s*\\(\\s*(?!('|\"|`))" },
      { key: 'composition-inject', pattern: "inject\\s*\\(\\s*(?!('|\"|`))" },
      { key: 'composition-provide', pattern: "provide\\s*\\(\\s*(?!('|\"|`))" }
    ]
  },
  {
    id: 'vue-directive',
    name: 'Vue Directive Security Issue',
    severity: 'Medium',
    description: 'Vue directive with potential security issue',
    recommendation: 'Ensure Vue directives do not bind untrusted content without proper sanitization.',
    patterns: [
      { key: 'directive-v-text', pattern: 'v-text\\s*=\\s*[\'"][^\'"]*[\'"]' },
      { key: 'directive-v-bind', pattern: 'v-bind:inner-html\\s*=' },
      { key: 'directive-v-interpolation', pattern: 'v-\\w+\\s*=\\s*[\'"]{{\\s*.*?\\s*}}[\'"]' }
    ]
  },
  {
    id: 'vue-router',
    name: 'Vue Router Security Issue',
    severity: 'Medium',
    description: 'Vue router usage with potential security concern',
    recommendation: 'Validate and sanitize route parameters and destinations to prevent open redirects and parameter pollution.',
    patterns: [
      { key: 'router-before-each', pattern: 'beforeEach\\s*\\(' },
      { key: 'router-add-route', pattern: 'addRoute\\s*\\(' },
      { key: 'router-params', pattern: 'this\\.\\$route\\.params\\.([^.]|\\s)*\\.' },
      { key: 'router-push', pattern: 'router\\.push\\s*\\(\\s*\\{' },
      { key: 'router-replace', pattern: 'router\\.replace\\s*\\(\\s*\\{' },
      { key: 'router-this-push', pattern: 'this\\.\\$router\\.push\\s*\\(' },
      { key: 'router-this-replace', pattern: 'this\\.\\$router\\.replace\\s*\\(' }
    ]
  },
  {
    id: 'state-management',
    name: 'State Management Security Issue',
    severity: 'Medium',
    description: 'State management usage with potential security concern',
    recommendation: 'Avoid storing sensitive information in client-side state without encryption. Validate all data before committing to store.',
    patterns: [
      { key: 'state-commit', pattern: 'commit\\s*\\(\\s*[\'"][^\'"]*\\s*\\+\\s*[\'"]' },
      { key: 'state-dispatch', pattern: 'dispatch\\s*\\(\\s*[\'"][^\'"]*\\s*\\+\\s*[\'"]' },
      { key: 'state-access', pattern: 'store\\.state\\.' },
      { key: 'state-map', pattern: 'mapState\\s*\\(' },
      { key: 'state-define', pattern: 'defineStore' },
      { key: 'state-create', pattern: 'createStore' }
    ]
  },
  {
    id: 'vue-custom-directive',
    name: 'Vue Custom Directive Usage',
    severity: 'Medium',
    description: 'Vue custom directive defined',
    recommendation: 'Review custom directives for potential DOM manipulation vulnerabilities.',
    patterns: [
      { key: 'custom-directive', pattern: 'directive\\s*\\(' },
      { key: 'vue-directive', pattern: 'Vue\\.directive\\s*\\(' },
      { key: 'app-directive', pattern: 'app\\.directive\\s*\\(' }
    ]
  },
  {
    id: 'vue-v-for',
    name: 'Vue v-for Security Issue',
    severity: 'Medium',
    description: 'Vue v-for with potential security concern',
    recommendation: 'Ensure iteration sources are validated and sanitized to prevent injection attacks.',
    patterns: [
      { key: 'v-for-in', pattern: 'v-for\\s*=\\s*[\'"][^\'"]* in ([^\'"]*)[\'"]' },
      { key: 'v-for-of', pattern: 'v-for\\s*=\\s*[\'"][^\'"]* of ([^\'"]*)[\'"]' }
    ]
  },
  {
    id: 'vue-dynamic-component',
    name: 'Vue Dynamic Component Usage',
    severity: 'High',
    description: 'Vue dynamic component usage',
    recommendation: 'Validate component names to prevent loading arbitrary components.',
    patterns: [
      { key: 'component-is', pattern: '<component\\s*:is\\s*=' },
      { key: 'component-v-bind', pattern: '<component\\s*v-bind:is\\s*=' },
      { key: 'create-element', pattern: 'createElement\\s*\\(\\s*[\'"`][^\'"`]*[\'"`]' },
      { key: 'h-function', pattern: 'h\\s*\\(\\s*[\'"`][^\'"`]*[\'"`]' }
    ]
  },
  {
    id: 'vue-slot',
    name: 'Vue Slot Security Issue',
    severity: 'Medium',
    description: 'Vue slot usage with potential security concern',
    recommendation: 'Be cautious with slot content from untrusted sources.',
    patterns: [
      { key: 'slot-tag', pattern: '<slot' },
      { key: 'slot-named', pattern: '<template\\s*#' },
      { key: 'slot-v-slot', pattern: '<template\\s+v-slot' }
    ]
  },
  {
    id: 'sql-injection-sequelize',
    name: 'SQL Injection via Sequelize',
    severity: 'High',
    description: 'Potential SQL injection through user input in Sequelize queries',
    recommendation: 'Always use parameterized queries or Sequelize\'s built-in query builders. Never concatenate user input directly into SQL queries.',
    patterns: [
      { key: 'sequelize-user-input', pattern: '\\b(sequelize|mysql|pg|sqlite|mssql)\\b.*(?:req\\.|params|query|body)' }
    ]
  },
  {
    id: 'sql-injection-dynamic-query',
    name: 'Dynamic SQL Query',
    severity: 'High',
    description: 'Dynamic SQL query construction',
    recommendation: 'Use parameterized queries or prepared statements instead of dynamic query construction.',
    patterns: [
      { key: 'dynamic-query', pattern: 'query\\s*\\(\\s*["\'][^"\']*["\']\\s*\\+' }
    ]
  },
  {
    id: 'sql-injection-dynamic-execute',
    name: 'Dynamic SQL Execution',
    severity: 'High',
    description: 'Dynamic SQL execution',
    recommendation: 'Use parameterized queries or prepared statements instead of dynamic execution.',
    patterns: [
      { key: 'dynamic-execute', pattern: 'execute\\s*\\(\\s*["\'][^"\']*["\']\\s*\\+' }
    ]
  },
  {
    id: 'sql-injection-where-clause',
    name: 'SQL WHERE Clause User Input',
    severity: 'High',
    description: 'Direct user input in SQL WHERE clause',
    recommendation: 'Use parameterized queries or prepared statements. Never concatenate user input directly into WHERE clauses.',
    patterns: [
      { key: 'where-clause-user-input', pattern: 'SELECT\\s+.*\\s+FROM\\s+.*\\s+WHERE\\s+.*\\s*=.*(?:req\\.|params|query|body)', flags: 'i' }
    ]
  },
  {
    id: 'sql-injection-insert',
    name: 'SQL INSERT Statement',
    severity: 'Medium',
    description: 'SQL INSERT statement - review for input sanitization',
    recommendation: 'Use parameterized queries or prepared statements for INSERT operations.',
    patterns: [
      { key: 'insert-statement', pattern: 'INSERT\\s+INTO\\s+.*VALUES\\s*\\(', flags: 'i' }
    ]
  },
  {
    id: 'csrf-missing-token',
    name: 'Missing CSRF Token',
    severity: 'High',
    description: 'HTTP request missing CSRF protection token',
    recommendation: 'Add CSRF token validation mechanism to HTTP requests. Ensure server-side CSRF token verification.',
    patterns: [
      { key: 'fetch-post', pattern: '(fetch|axios|XMLHttpRequest|\\$\\.ajax)\\s*\\([^)]*method\\s*[:=]\\s*["\'](POST|PUT|DELETE|PATCH)["\']' }
    ]
  },
  {
    id: 'csrf-insecure-form',
    name: 'Insecure Form Submission',
    severity: 'Medium',
    description: 'Form submission may be missing CSRF protection',
    recommendation: 'Add CSRF hidden field to forms and validate tokens on the server side.',
    patterns: [
      { key: 'form-post', pattern: '<form[^>]*(action\\s*=\\s*["\'][^"\']*["\'][^>]*method\\s*=\\s*["\']post["\'])' }
    ]
  },
  {
    id: 'csrf-axios-no-token',
    name: 'Axios Without CSRF',
    severity: 'Medium',
    description: 'Using Axios to send requests may be missing CSRF protection',
    recommendation: 'Configure Axios to automatically include CSRF tokens, or manually add CSRF tokens in request headers.',
    patterns: [
      { key: 'axios-post', pattern: 'axios\\.(post|put|delete|patch)\\s*\\(' }
    ]
  },
  {
    id: 'csrf-missing-samesite',
    name: 'Missing SameSite Cookie Attribute',
    severity: 'Medium',
    description: 'Cookie setting missing SameSite attribute',
    recommendation: 'Set the SameSite attribute of cookies to "Strict" or "Secure" to prevent CSRF attacks.',
    patterns: [
      { key: 'cookie-no-samesite', pattern: 'document\\.cookie\\s*=\\s*["\']([^"\']*=(?!.*SameSite\\b))' }
    ]
  },
  {
    id: 'memory-leak-event-listener',
    name: 'Event Listener Memory Leak',
    severity: 'Medium',
    description: 'Potential memory leak from event listeners',
    recommendation: 'Ensure event listeners are removed when no longer needed using removeEventListener.',
    patterns: [
      { key: 'event-listener', pattern: '\\.(addEventListener|attachEvent)' }
    ]
  },
  {
    id: 'memory-leak-timer',
    name: 'Interval/Timeout Without Cleanup',
    severity: 'Medium',
    description: 'Potential memory leak from timers without cleanup',
    recommendation: 'Clear timers when they are no longer needed using clearInterval/clearTimeout.',
    patterns: [
      { key: 'setinterval', pattern: 'setInterval' },
      { key: 'settimeout', pattern: 'setTimeout' }
    ]
  },
  {
    id: 'memory-leak-circular-ref',
    name: 'Circular Reference',
    severity: 'Medium',
    description: 'Potential circular reference causing memory leak',
    recommendation: 'Avoid creating circular references, especially between different objects.',
    patterns: [
      { key: 'circular-ref', pattern: 'this\\.[a-zA-Z_$][a-zA-Z_$0-9]*\\s*=\\s*this' }
    ]
  },
  {
    id: 'memory-leak-vue-event',
    name: 'Vue Component Event Listener Without Cleanup',
    severity: 'Medium',
    description: 'Vue component event listener without proper cleanup',
    recommendation: 'Remove Vue event listeners in beforeDestroy or beforeUnmount lifecycle hooks.',
    patterns: [
      { key: 'vue-on', pattern: 'this\\.\\$on|this\\.\\$once' }
    ]
  },
  {
    id: 'memory-leak-vue-watcher',
    name: 'Vue Watcher Without Teardown',
    severity: 'Medium',
    description: 'Vue watcher without proper teardown',
    recommendation: 'Save the unwatch function returned by $watch and call it when appropriate.',
    patterns: [
      { key: 'vue-watch', pattern: 'this\\.\\$watch' }
    ]
  },
  {
    id: 'cookie-missing-secure',
    name: 'Cookie Without Secure Flag',
    severity: 'Medium',
    description: 'Cookie missing Secure flag',
    recommendation: 'Set the Secure flag on cookies to ensure they are only transmitted over HTTPS.',
    patterns: [
      { key: 'cookie-no-secure', pattern: 'document\\.cookie\\s*=\\s*["\']([^"\']*=(?!.*secure\\b)["\'])' }
    ]
  },
  {
    id: 'cookie-missing-httponly',
    name: 'Cookie Without HttpOnly Flag',
    severity: 'High',
    description: 'Cookie missing HttpOnly flag',
    recommendation: 'Set the HttpOnly flag on cookies to prevent JavaScript access.',
    patterns: [
      { key: 'cookie-no-httponly', pattern: 'document\\.cookie\\s*=\\s*["\']([^"\']*=(?!.*httponly\\b)["\'])' }
    ]
  },
  {
    id: 'cookie-missing-samesite-flag',
    name: 'Cookie Without SameSite Flag',
    severity: 'Medium',
    description: 'Cookie missing SameSite flag',
    recommendation: 'Set the SameSite attribute on cookies to prevent CSRF attacks.',
    patterns: [
      { key: 'cookie-no-samesite-flag', pattern: 'document\\.cookie\\s*=\\s*["\']([^"\']*=(?!.*samesite\\b)["\'])' }
    ]
  },
  {
    id: 'http-header-injection-response',
    name: 'Response Header Injection',
    severity: 'High',
    description: 'Potential HTTP header injection vulnerability in response headers',
    recommendation: 'Validate and sanitize all user input before setting response headers. Filter out newlines and control characters.',
    patterns: [
      { key: 'response-set', pattern: 'response\\.set|res\\.header|res\\.setHeader|headers\\.append' }
    ]
  },
  {
    id: 'http-header-injection-request',
    name: 'Request Header Injection',
    severity: 'High',
    description: 'Potential HTTP header injection vulnerability in request headers',
    recommendation: 'Avoid using user-provided data directly in request headers. Use whitelist validation for input.',
    patterns: [
      { key: 'request-header', pattern: 'headers\\s*[:=][^{]*\\{|fetch\\(.*headers|axios\\.defaults\\.headers' }
    ]
  },
  {
    id: 'http-header-injection-location',
    name: 'Location Header Injection',
    severity: 'High',
    description: 'Potential HTTP header injection in Location header',
    recommendation: 'Validate redirect URLs to ensure they point to trusted domains. Avoid open redirect vulnerabilities.',
    patterns: [
      { key: 'location-header', pattern: 'location\\s*[:=]\\s*["\'`][^"\'`]*["\'`]' }
    ]
  },
  {
    id: 'http-header-cache-control',
    name: 'Cache Control Bypass',
    severity: 'Medium',
    description: 'Potential cache control header manipulation',
    recommendation: 'Fix cache control policies to prevent client input from affecting cache control headers.',
    patterns: [
      { key: 'cache-control', pattern: 'cache-control|pragma|expires' }
    ]
  },
  {
    id: 'http-header-csp',
    name: 'CSP Bypass',
    severity: 'High',
    description: 'Potential Content Security Policy header manipulation',
    recommendation: 'Fix Content Security Policy to prevent client input from affecting CSP headers.',
    patterns: [
      { key: 'csp-header', pattern: 'content-security-policy|csp' }
    ]
  },
  {
    id: 'http-header-security-override',
    name: 'Security Header Override',
    severity: 'High',
    description: 'Potential security header override by user input',
    recommendation: 'Ensure security headers are not overridden by user input. Use server-side fixed header values.',
    patterns: [
      { key: 'security-header', pattern: 'strict-transport-security|x-frame-options|x-xss-protection|x-content-type-options' }
    ]
  },
  {
    id: 'vulnerable-lodash',
    name: 'Vulnerable Lodash Version',
    severity: 'High',
    description: 'Lodash version has known security vulnerabilities',
    recommendation: 'Update Lodash to version 4.17.21 or later.',
    patterns: [
      { key: 'lodash-version', pattern: '"lodash"\\s*:\\s*"[~^]?[0-3]\\.' }
    ]
  },
  {
    id: 'vulnerable-moment',
    name: 'Vulnerable Moment Version',
    severity: 'High',
    description: 'Moment.js version has known security vulnerabilities',
    recommendation: 'Update Moment.js to version 2.29.2 or later.',
    patterns: [
      { key: 'moment-version', pattern: '"moment"\\s*:\\s*"[~^]?[0-1]\\.' }
    ]
  },
  {
    id: 'vulnerable-axios',
    name: 'Vulnerable Axios Version',
    severity: 'High',
    description: 'Axios version has known security vulnerabilities',
    recommendation: 'Update Axios to version 0.21.3 or later.',
    patterns: [
      { key: 'axios-version', pattern: '"axios"\\s*:\\s*"[~^]?0\\.(1[0-9]|0\\.[0-9])' }
    ]
  },
  {
    id: 'vulnerable-express',
    name: 'Vulnerable Express Version',
    severity: 'High',
    description: 'Express version has known security vulnerabilities',
    recommendation: 'Update Express to version 4.17.3 or later.',
    patterns: [
      { key: 'express-version', pattern: '"express"\\s*:\\s*"[~^]?[0-3]\\.' }
    ]
  },
  {
    id: 'vulnerable-jquery',
    name: 'Vulnerable jQuery Version',
    severity: 'High',
    description: 'jQuery version has known security vulnerabilities',
    recommendation: 'Update jQuery to version 3.5.0 or later.',
    patterns: [
      { key: 'jquery-version', pattern: '"jquery"\\s*:\\s*"[~^]?[0-2]\\.' }
    ]
  },
  {
    id: 'vulnerable-vue2',
    name: 'Vulnerable Vue 2 Version',
    severity: 'High',
    description: 'Vue 2 version has known security vulnerabilities',
    recommendation: 'Update Vue to version 2.6.14 or later, or migrate to Vue 3.',
    patterns: [
      { key: 'vue2-version', pattern: '"vue"\\s*:\\s*"[~^]?2\\.[0-5]\\.' }
    ]
  },
  {
    id: 'vulnerable-vue-router',
    name: 'Vulnerable Vue Router Version',
    severity: 'High',
    description: 'Vue Router version has known security vulnerabilities',
    recommendation: 'Update Vue Router to version 3.5.3 or later.',
    patterns: [
      { key: 'vue-router-version', pattern: '"vue-router"\\s*:\\s*"[~^]?[0-2]\\.' }
    ]
  },
  {
    id: 'vulnerable-vuex',
    name: 'Vulnerable Vuex Version',
    severity: 'High',
    description: 'Vuex version has known security vulnerabilities',
    recommendation: 'Update Vuex to version 3.6.2 or later.',
    patterns: [
      { key: 'vuex-version', pattern: '"vuex"\\s*:\\s*"[~^]?[0-2]\\.' }
    ]
  },
  {
    id: 'dom-clobbering',
    name: 'DOM Clobbering',
    severity: 'High',
    description: 'Potential DOM clobbering vulnerability',
    recommendation: 'Avoid using DOM element IDs that conflict with JavaScript properties or window object properties.',
    patterns: [
      { key: 'dom-id', pattern: 'id\\s*=\\s*["\'](name|location|top|parent|frames|self|window|document|forms|anchors|links|images|scripts)["\']' },
      { key: 'dom-access', pattern: 'document\\.(getElementById|querySelector)\\s*\\(\\s*["\'].*["\']\\s*\\)\\s*\\.' }
    ]
  },
  {
    id: 'svg-xss',
    name: 'SVG XSS',
    severity: 'High',
    description: 'Potential XSS via SVG content',
    recommendation: 'Sanitize SVG content before rendering. Avoid using user-provided SVG directly.',
    patterns: [
      { key: 'svg-script', pattern: '<svg[^>]*>.*<script' },
      { key: 'svg-onload', pattern: '<svg[^>]*onload\\s*=' },
      { key: 'svg-onerror', pattern: '<svg[^>]*onerror\\s*=' }
    ]
  },
  {
    id: 'css-xss',
    name: 'CSS Expression XSS',
    severity: 'High',
    description: 'Potential XSS via CSS expression()',
    recommendation: 'Avoid using CSS expression() function. Use modern CSS instead.',
    patterns: [
      { key: 'css-expression', pattern: 'expression\\s*\\(' },
      { key: 'css-url-javascript', pattern: 'url\\s*\\(\\s*["\']javascript:' }
    ]
  },
  {
    id: 'postmessage-xss',
    name: 'PostMessage XSS',
    severity: 'High',
    description: 'Potential XSS via postMessage',
    recommendation: 'Always validate origin of postMessage and sanitize received data.',
    patterns: [
      { key: 'postmessage-listener', pattern: 'window\\.addEventListener\\s*\\(\\s*["\']message["\']' },
      { key: 'postmessage-send', pattern: '\\.postMessage\\s*\\(' }
    ]
  },
  {
    id: 'worker-xss',
    name: 'Web Worker XSS',
    severity: 'Medium',
    description: 'Potential XSS via Web Worker',
    recommendation: 'Validate and sanitize data passed to Web Workers.',
    patterns: [
      { key: 'worker-create', pattern: 'new\\s+Worker\\s*\\(' },
      { key: 'worker-import', pattern: 'importScripts\\s*\\(' }
    ]
  },
  {
    id: 'ssr-injection',
    name: 'SSR Injection',
    severity: 'High',
    description: 'Potential Server-Side Rendering injection',
    recommendation: 'Sanitize all user-provided data before rendering on the server.',
    patterns: [
      { key: 'ssr-render', pattern: 'renderToString|renderToStaticMarkup|renderToNodeStream' },
      { key: 'ssr-context', pattern: 'context\\.(req|res|url|query|params)' }
    ]
  },
  {
    id: 'ssr-template-injection',
    name: 'SSR Template Injection',
    severity: 'High',
    description: 'Potential template injection in SSR',
    recommendation: 'Avoid using user input in template strings. Use proper templating libraries.',
    patterns: [
      { key: 'template-literal', pattern: '`\\s*\\$\\{.*req\\.|params|query|body.*\\}\\s*`' },
      { key: 'template-concat', pattern: '\\+\\s*req\\.|params|query|body' }
    ]
  },
  {
    id: 'hydration-mismatch',
    name: 'Hydration Mismatch',
    severity: 'Medium',
    description: 'Potential hydration mismatch vulnerability',
    recommendation: 'Ensure server-rendered and client-rendered content match exactly.',
    patterns: [
      { key: 'hydration-mount', pattern: 'hydrate\\s*\\(|createSSRApp\\s*\\(' }
    ]
  },
  {
    id: 'jwt-algorithm-confusion',
    name: 'JWT Algorithm Confusion',
    severity: 'High',
    description: 'Potential JWT algorithm confusion attack',
    recommendation: 'Always explicitly specify algorithm in JWT verification. Do not accept "none" algorithm.',
    patterns: [
      { key: 'jwt-verify', pattern: 'jwt\\.verify\\s*\\(' },
      { key: 'jwt-none', pattern: 'algorithm\\s*[:=]\\s*["\']none["\']' }
    ]
  },
  {
    id: 'session-fixation',
    name: 'Session Fixation',
    severity: 'High',
    description: 'Potential session fixation vulnerability',
    recommendation: 'Regenerate session ID after login. Use secure session management.',
    patterns: [
      { key: 'session-set', pattern: 'req\\.session\\.(id|userId)\\s*=' },
      { key: 'session-login', pattern: '\\.login\\s*\\(|\\.authenticate\\s*\\(' }
    ]
  },
  {
    id: 'privilege-escalation',
    name: 'Privilege Escalation',
    severity: 'High',
    description: 'Potential privilege escalation vulnerability',
    recommendation: 'Always verify user permissions before performing privileged operations.',
    patterns: [
      { key: 'admin-check', pattern: 'isAdmin|isSuperAdmin|role\\s*===\\s*["\']admin["\']' },
      { key: 'role-check', pattern: 'role\\s*===\\s*["\']user["\']|role\\s*===\\s*["\']guest["\']' }
    ]
  },
  {
    id: 'insecure-password-storage',
    name: 'Insecure Password Storage',
    severity: 'High',
    description: 'Potentially insecure password storage',
    recommendation: 'Never store passwords in plain text. Use bcrypt, scrypt, or argon2 for password hashing.',
    patterns: [
      { key: 'password-store', pattern: 'password\\s*[:=]\\s*["\'][^"\']+["\']' },
      { key: 'password-hash', pattern: 'md5\\s*\\(|sha1\\s*\\(|sha256\\s*\\(' }
    ]
  },
  {
    id: 'oauth-flow-vulnerability',
    name: 'OAuth Flow Vulnerability',
    severity: 'High',
    description: 'Potential OAuth flow vulnerability',
    recommendation: 'Use PKCE for public clients. Validate state parameter to prevent CSRF.',
    patterns: [
      { key: 'oauth-implicit', pattern: 'response_type\\s*=\\s*["\']token["\']' },
      { key: 'oauth-state', pattern: 'oauth.*redirect.*state' }
    ]
  },
  {
    id: 'nosql-injection',
    name: 'NoSQL Injection',
    severity: 'High',
    description: 'Potential NoSQL injection',
    recommendation: 'Use parameterized queries or input validation. Avoid concatenating user input.',
    patterns: [
      { key: 'nosql-mongo', pattern: '\\$where|\\$ne|\\$gt|\\$lt|\\$or|\\$and' },
      { key: 'nosql-redis', pattern: 'redis\\.eval\\s*\\(' }
    ]
  },
  {
    id: 'graphql-injection',
    name: 'GraphQL Injection',
    severity: 'High',
    description: 'Potential GraphQL injection',
    recommendation: 'Use parameterized queries and validate input types. Avoid string interpolation in queries.',
    patterns: [
      { key: 'graphql-query', pattern: 'query\\s*\\(\\s*["\'][^"\']+\\$' },
      { key: 'graphql-mutation', pattern: 'mutation\\s*\\(\\s*["\'][^"\']+\\$' }
    ]
  },
  {
    id: 'ldap-injection',
    name: 'LDAP Injection',
    severity: 'High',
    description: 'Potential LDAP injection',
    recommendation: 'Use proper LDAP escaping libraries. Avoid string concatenation.',
    patterns: [
      { key: 'ldap-search', pattern: 'search\\s*\\(\\s*["\'][^"\']*\\*' },
      { key: 'ldap-filter', pattern: 'filter\\s*=\\s*["\'][^"\']*\\(' }
    ]
  },
  {
    id: 'command-injection',
    name: 'Command Injection',
    severity: 'Critical',
    description: 'Potential command injection vulnerability',
    recommendation: 'Never execute commands with user input. Use safe APIs instead.',
    patterns: [
      { key: 'exec-sync', pattern: 'execSync\\s*\\(|exec\\s*\\(\\s*["\']' },
      { key: 'spawn-sync', pattern: 'spawnSync\\s*\\(|spawn\\s*\\(\\s*["\']' },
      { key: 'child-process', pattern: 'child_process\\.(exec|spawn)\\s*\\(' }
    ]
  },
  {
    id: 'path-traversal',
    name: 'Path Traversal',
    severity: 'High',
    description: 'Potential path traversal vulnerability',
    recommendation: 'Validate and sanitize file paths. Use path.join() and avoid user input in paths.',
    patterns: [
      { key: 'path-traversal', pattern: '\\.\\.\\/|\\.\\.\\\\|%2e%2e%2f|%2e%2e%5c' },
      { key: 'path-concat', pattern: 'path\\s*\\+\\s*req\\.|params|query|body' }
    ]
  },
  {
    id: 'insecure-file-upload',
    name: 'Insecure File Upload',
    severity: 'High',
    description: 'Potential insecure file upload',
    recommendation: 'Validate file type, size, and content. Store uploads outside web root.',
    patterns: [
      { key: 'file-upload', pattern: 'multer|formidable|busboy' },
      { key: 'file-save', pattern: '\\.mv\\s*\\(|\\.pipe\\s*\\(\\s*fs\\.createWriteStream' }
    ]
  },
  {
    id: 'file-inclusion',
    name: 'File Inclusion',
    severity: 'High',
    description: 'Potential file inclusion vulnerability',
    recommendation: 'Never include files based on user input without validation.',
    patterns: [
      { key: 'require-dynamic', pattern: 'require\\s*\\(\\s*req\\.|params|query|body' },
      { key: 'import-dynamic', pattern: 'import\\s*\\(\\s*req\\.|params|query|body' }
    ]
  },
  {
    id: 'websocket-security',
    name: 'WebSocket Security',
    severity: 'Medium',
    description: 'Potential WebSocket security issue',
    recommendation: 'Validate WebSocket origin and implement proper authentication.',
    patterns: [
      { key: 'websocket-connect', pattern: 'new\\s+WebSocket\\s*\\(' },
      { key: 'socket-io', pattern: 'socket\\.io\\s*\\(|io\\s*\\(' }
    ]
  },
  {
    id: 'insecure-http-method',
    name: 'Insecure HTTP Method',
    severity: 'Medium',
    description: 'Potential insecure HTTP method usage',
    recommendation: 'Use appropriate HTTP methods. Avoid GET for sensitive operations.',
    patterns: [
      { key: 'get-sensitive', pattern: 'fetch\\s*\\([^)]*method\\s*[:=]\\s*["\']GET["\'].*password|token|secret' },
      { key: 'delete-unsafe', pattern: 'axios\\.(delete|get)\\s*\\(\\s*["\'][^"\']*\\?' }
    ]
  },
  {
    id: 'missing-https',
    name: 'Missing HTTPS Enforcement',
    severity: 'Medium',
    description: 'Potential missing HTTPS enforcement',
    recommendation: 'Always use HTTPS in production. Implement HSTS header.',
    patterns: [
      { key: 'http-url', pattern: 'http://(?!localhost|127\\.0\\.0\\.1|0\\.0\\.0\\.0)' },
      { key: 'mixed-content', pattern: 'src\\s*=\\s*["\']http://' }
    ]
  },
  {
    id: 'insecure-certificate',
    name: 'Insecure Certificate Verification',
    severity: 'High',
    description: 'Potential insecure certificate verification',
    recommendation: 'Always verify SSL/TLS certificates. Never disable verification.',
    patterns: [
      { key: 'reject-unauthorized', pattern: 'rejectUnauthorized\\s*:\\s*false' },
      { key: 'check-server-identity', pattern: 'checkServerIdentity\\s*:\\s*\\(\\s*\\)\\s*=>\\s*undefined' }
    ]
  },
  {
    id: 'weak-encryption',
    name: 'Weak Encryption',
    severity: 'High',
    description: 'Potentially weak encryption algorithm',
    recommendation: 'Use strong encryption algorithms like AES-256-GCM. Avoid MD5, SHA1, DES.',
    patterns: [
      { key: 'md5-hash', pattern: 'createHash\\s*\\(\\s*["\']md5["\']' },
      { key: 'sha1-hash', pattern: 'createHash\\s*\\(\\s*["\']sha1["\']' },
      { key: 'des-encrypt', pattern: 'createCipher\\s*\\(\\s*["\']des["\']|createDecipher\\s*\\(\\s*["\']des["\']' }
    ]
  },
  {
    id: 'insecure-random',
    name: 'Insecure Random Generation',
    severity: 'Medium',
    description: 'Potentially insecure random number generation',
    recommendation: 'Use crypto.randomBytes() or crypto.getRandomValues() for cryptographic randomness.',
    patterns: [
      { key: 'random-bytes', pattern: 'crypto\\.randomBytes\\s*\\(\\s*[^,]*\\s*\\)\\s*\\.toString\\s*\\(\\s*["\']hex["\']' },
      { key: 'pseudo-random', pattern: 'Math\\.random\\s*\\(\\s*\\)' }
    ]
  },
  {
    id: 'missing-encryption',
    name: 'Missing Encryption',
    severity: 'High',
    description: 'Potentially missing data encryption',
    recommendation: 'Encrypt sensitive data at rest and in transit.',
    patterns: [
      { key: 'plain-text', pattern: 'localStorage\\.(setItem|getItem)\\s*\\(\\s*["\'].*password|token|secret|credit.*card|ssn' },
      { key: 'session-storage', pattern: 'sessionStorage\\.(setItem|getItem)\\s*\\(\\s*["\'].*password|token|secret' }
    ]
  },
  {
    id: 'insecure-hash',
    name: 'Insecure Hash Function',
    severity: 'Medium',
    description: 'Potentially insecure hash function',
    recommendation: 'Use strong hash functions like SHA-256 or SHA-512. Avoid MD5 and SHA1.',
    patterns: [
      { key: 'md5-function', pattern: 'md5\\s*\\(' },
      { key: 'sha1-function', pattern: 'sha1\\s*\\(' }
    ]
  },
  {
    id: 'third-party-script',
    name: 'Third-Party Script Injection',
    severity: 'Medium',
    description: 'Potential third-party script injection',
    recommendation: 'Review and validate all third-party scripts. Use Subresource Integrity (SRI).',
    patterns: [
      { key: 'google-analytics', pattern: 'googletagmanager\\.com|google-analytics\\.com|gtag\\(' },
      { key: 'facebook-pixel', pattern: 'facebook\\.net\\/tr\\/|fbq\\(' },
      { key: 'third-party-cdn', pattern: 'cdn\\.(jsdelivr|unpkg|cloudflare)\\.com' }
    ]
  },
  {
    id: 'insecure-cdn',
    name: 'Insecure CDN Usage',
    severity: 'Medium',
    description: 'Potential insecure CDN usage',
    recommendation: 'Use HTTPS for CDN links. Implement Subresource Integrity (SRI).',
    patterns: [
      { key: 'http-cdn', pattern: 'http://cdn\\.(jsdelivr|unpkg|cloudflare|bootstrapcdn)\\.' },
      { key: 'missing-sri', pattern: '<script[^>]*src\\s*=\\s*["\'][^"\']+["\'][^>]*(?!integrity)' }
    ]
  },
  {
    id: 'third-party-api',
    name: 'Third-Party API Security',
    severity: 'Medium',
    description: 'Potential third-party API security issue',
    recommendation: 'Validate and sanitize all data from third-party APIs.',
    patterns: [
      { key: 'api-call', pattern: 'fetch\\s*\\(\\s*["\']https?://(api\\.(google|facebook|twitter|github|stripe|paypal)\\.)' },
      { key: 'api-response', pattern: '\\.then\\s*\\(\\s*response\\s*=>\\s*\\{[^}]*req\\.|params|query|body' }
    ]
  },
  {
    id: 'service-worker-security',
    name: 'Service Worker Security',
    severity: 'Medium',
    description: 'Potential service worker security issue',
    recommendation: 'Validate service worker scope. Implement proper cache control.',
    patterns: [
      { key: 'service-worker-register', pattern: 'navigator\\.serviceWorker\\.register\\s*\\(' },
      { key: 'service-worker-cache', pattern: 'caches\\.open\\s*\\(|caches\\.match\\s*\\(' }
    ]
  },
  {
    id: 'webassembly-security',
    name: 'WebAssembly Security',
    severity: 'Medium',
    description: 'Potential WebAssembly security issue',
    recommendation: 'Validate WebAssembly modules before loading. Use sandboxing.',
    patterns: [
      { key: 'wasm-instantiate', pattern: 'WebAssembly\\.instantiate\\s*\\(' },
      { key: 'wasm-instantiate-streaming', pattern: 'WebAssembly\\.instantiateStreaming\\s*\\(' }
    ]
  },
  {
    id: 'webrtc-security',
    name: 'WebRTC Security',
    severity: 'Medium',
    description: 'Potential WebRTC security issue',
    recommendation: 'Validate WebRTC connections. Implement proper authentication.',
    patterns: [
      { key: 'webrtc-connection', pattern: 'RTCPeerConnection\\s*\\(|webkitRTCPeerConnection\\s*\\(' },
      { key: 'webrtc-data-channel', pattern: 'createDataChannel\\s*\\(' }
    ]
  },
  {
    id: 'csp-bypass',
    name: 'CSP Bypass',
    severity: 'High',
    description: 'Potential Content Security Policy bypass',
    recommendation: 'Implement strict CSP. Avoid unsafe-inline and unsafe-eval.',
    patterns: [
      { key: 'unsafe-inline', pattern: 'unsafe-inline|unsafe-eval' },
      { key: 'csp-script-src', pattern: 'script-src\\s*\\*|default-src\\s*\\*' }
    ]
  },
  {
    id: 'social-engineering',
    name: 'Social Engineering',
    severity: 'High',
    description: 'Potential social engineering attack',
    recommendation: 'Implement user education and verification mechanisms. Be suspicious of urgent requests.',
    patterns: [
      { key: 'phishing-form', pattern: 'action\\s*=\\s*["\']https?://[^"\']*["\']' },
      { key: 'urgent-notice', pattern: '(urgent|immediate|emergency|alert|warning|critical)' },
      { key: 'fake-support', pattern: '(support|service|help|customer)' },
      { key: 'prize-scam', pattern: '(congratulations|winner|prize|reward|free|gift|lottery)' },
      { key: 'authority-impersonation', pattern: '(government|tax|bank|police|court|official)' }
    ]
  },
  {
    id: 'malicious-file-upload',
    name: 'Malicious File Upload',
    severity: 'High',
    description: 'Potential malicious file upload vulnerability',
    recommendation: 'Validate file types, scan for malware, and store uploads outside web root.',
    patterns: [
      { key: 'upload-no-validation', pattern: 'multer\\s*\\(\\s*\\{[^}]*dest\\s*:' },
      { key: 'upload-extension-check', pattern: '\\.(php|asp|jsp|exe|bat|sh|cmd)' },
      { key: 'upload-mimetype-check', pattern: 'mimetype' },
      { key: 'upload-size-check', pattern: 'maxSize' },
      { key: 'upload-path', pattern: 'uploads/|public/|static/' },
      { key: 'webshell-upload', pattern: 'require\\s*\\(\\s*["\'].*\\.(php|asp|jsp)' }
    ]
  },
  {
    id: 'phishing',
    name: 'Phishing',
    severity: 'High',
    description: 'Potential phishing attack',
    recommendation: 'Implement domain validation and user education. Be cautious of suspicious links.',
    patterns: [
      { key: 'phishing-domain', pattern: 'action\\s*=\\s*["\']https?://[^"\']*[^a-z0-9.-][^"\']*["\']' },
      { key: 'phishing-form-fields', pattern: '(username|password|email|account|login|signin|security).*input' },
      { key: 'phishing-urgent-language', pattern: '(urgent|immediate|limited|time-sensitive|suspension|verify|confirm)' },
      { key: 'phishing-brand-impersonation', pattern: '(paypal|google|apple|facebook|amazon|bank|credit|card)' }
    ]
  },
  {
    id: 'clickjacking',
    name: 'Clickjacking',
    severity: 'Medium',
    description: 'Potential clickjacking vulnerability',
    recommendation: 'Implement X-Frame-Options header or Content Security Policy to prevent framing.',
    patterns: [
      { key: 'missing-frame-options', pattern: 'X-Frame-Options|frame-ancestors' },
      { key: 'frame-busting-bypass', pattern: 'top\\.location\\s*=|self\\.location\\s*=' },
      { key: 'iframe-misuse', pattern: '<iframe[^>]*>' }
    ]
  },
  {
    id: 'ui-redress',
    name: 'UI Redress',
    severity: 'Medium',
    description: 'Potential UI redress attack',
    recommendation: 'Implement proper user interface design principles and validation.',
    patterns: [
      { key: 'ui-overlay', pattern: 'position:\\s*fixed|z-index:\\s*\\d+' },
      { key: 'ui-deception', pattern: 'opacity:\\s*[0-9.]|visibility:\\s*hidden' },
      { key: 'ui-masking', pattern: 'pointer-events:\\s*none' }
    ]
  },
  {
    id: 'tabnabbing',
    name: 'Tabnabbing',
    severity: 'Medium',
    description: 'Potential tabnabbing attack',
    recommendation: 'Use rel="noopener noreferrer" for external links.',
    patterns: [
      { key: 'missing-noopener', pattern: 'target\\s*=\\s*["\']_blank["\'][^>]*>(?!.*rel=)' },
      { key: 'missing-noreferrer', pattern: 'target\\s*=\\s*["\']_blank["\'][^>]*(?!.*noopener)(?!.*noreferrer)' }
    ]
  },
  {
    id: 'cookie-bomb',
    name: 'Cookie Bomb',
    severity: 'Low',
    description: 'Potential cookie bomb attack',
    recommendation: 'Validate cookie sizes and implement limits on cookies.',
    patterns: [
      { key: 'large-cookie-value', pattern: 'document\\.cookie\\s*=.*=.{1000,}' },
      { key: 'cookie-loop', pattern: 'for\\s*\\([^;]*;[^;]*;[^)]*\\)\\s*document\\.cookie' },
      { key: 'cookie-size', pattern: 'cookie\\s*=\\s*["\']A{1000,}' }
    ]
  },
  {
    id: 'csrf-token-bypass',
    name: 'CSRF Token Bypass',
    severity: 'High',
    description: 'Potential CSRF token bypass vulnerability',
    recommendation: 'Implement proper CSRF token validation and regeneration.',
    patterns: [
      { key: 'csrf-token-reuse', pattern: 'same\\s+token|reuse\\s+token' },
      { key: 'csrf-token-missing-validation', pattern: 'csrf\\s+token[^v]|validate\\s*\\(\\s*req\\s*,\\s*null' },
      { key: 'predictable-csrf-token', pattern: 'Math\\.random\\(\\)|timestamp\\s*\\+|sequential' }
    ]
  },
  {
    id: 'session-hijacking',
    name: 'Session Hijacking',
    severity: 'High',
    description: 'Potential session hijacking vulnerability',
    recommendation: 'Use secure session management and regenerate session IDs.',
    patterns: [
      { key: 'session-cookie-missing-flags', pattern: 'HttpOnly|Secure|SameSite' },
      { key: 'session-id-in-url', pattern: 'session[^=]*=|sid=|PHPSESSID=' },
      { key: 'predictable-session-id', pattern: 'Math\\.random\\(\\)|timestamp\\s*\\+|sequential' }
    ]
  },
  {
    id: 'host-header-injection',
    name: 'Host Header Injection',
    severity: 'Medium',
    description: 'Potential host header injection vulnerability',
    recommendation: 'Validate Host header against a whitelist of allowed hosts.',
    patterns: [
      { key: 'host-header-use', pattern: 'req\\.headers\\.host|req\\.get\\(\\s*["\']host["\']\\s*\\)' },
      { key: 'host-header-validation-missing', pattern: 'validate.*host|whitelist.*host' }
    ]
  },
  {
    id: 'http-parameter-pollution',
    name: 'HTTP Parameter Pollution',
    severity: 'Medium',
    description: 'Potential HTTP parameter pollution',
    recommendation: 'Validate and sanitize HTTP parameters to prevent pollution.',
    patterns: [
      { key: 'duplicate-params', pattern: 'req\\.query\\..+\\[|req\\.body\\..+\\[' },
      { key: 'param-array-processing', pattern: 'Array\\.isArray\\(|length\\s*>\\s*1' }
    ]
  },
  {
    id: 'http-response-splitting',
    name: 'HTTP Response Splitting',
    severity: 'High',
    description: 'Potential HTTP response splitting',
    recommendation: 'Validate and sanitize inputs used in HTTP headers.',
    patterns: [
      { key: 'header-injection', pattern: '\\r\\n|\\r|\\n' },
      { key: 'response-header-user-input', pattern: 'res\\.set\\s*\\(|res\\.header\\s*\\(' }
    ]
  },
  {
    id: 'json-injection',
    name: 'JSON Injection',
    severity: 'High',
    description: 'Potential JSON injection vulnerability',
    recommendation: 'Validate and sanitize inputs before using in JSON contexts.',
    patterns: [
      { key: 'json-parse-user-input', pattern: 'JSON\\.parse\\s*\\(\\s*req\\.' },
      { key: 'json-stringify-user-input', pattern: 'JSON\\.stringify\\s*\\(\\s*req\\.' },
      { key: 'json-injection-pattern', pattern: '[{}\\[\\]]' }
    ]
  },
  {
    id: 'html-injection',
    name: 'HTML Injection',
    severity: 'High',
    description: 'Potential HTML injection vulnerability',
    recommendation: 'Sanitize inputs before inserting into HTML contexts.',
    patterns: [
      { key: 'html-injection-element', pattern: '<script|<iframe|<object|<embed|<link|<meta' },
      { key: 'html-injection-attribute', pattern: 'onload=|onclick=|onerror=|onmouseover=' }
    ]
  },
  {
    id: 'css-injection',
    name: 'CSS Injection',
    severity: 'Medium',
    description: 'Potential CSS injection vulnerability',
    recommendation: 'Sanitize inputs before using in CSS contexts.',
    patterns: [
      { key: 'css-injection', pattern: 'expression\\(|-moz-binding|behavior:' },
      { key: 'css-url-injection', pattern: 'url\\(.*\\)' }
    ]
  },
  {
    id: 'xpath-injection',
    name: 'XPath Injection',
    severity: 'High',
    description: 'Potential XPath injection vulnerability',
    recommendation: 'Use parameterized XPath queries or validate inputs.',
    patterns: [
      { key: 'xpath-concat', pattern: 'concat\\(|\\|\\|' },
      { key: 'xpath-user-input', pattern: 'xpath\\s*\\(.*req\\.|evaluate\\s*\\(.*req\\.' }
    ]
  },
  {
    id: 'xxe',
    name: 'XXE (XML External Entity)',
    severity: 'High',
    description: 'Potential XML External Entity vulnerability',
    recommendation: 'Disable external entities and DTDs in XML parsers.',
    patterns: [
      { key: 'xml-parser-insecure', pattern: 'DOMParser\\(|xml2js|sax\\.' },
      { key: 'external-entity', pattern: '<!ENTITY|SYSTEM|PUBLIC' },
      { key: 'dtd-declaration', pattern: '<!DOCTYPE|<!ELEMENT' }
    ]
  },
  {
    id: 'redos',
    name: 'ReDoS (Regular Expression Denial of Service)',
    severity: 'Medium',
    description: 'Potential Regular Expression Denial of Service',
    recommendation: 'Use safe regex patterns or limit regex execution time.',
    patterns: [
      { key: 'regex-explosion', pattern: '\\(a\\+\\)\\+|\\[a-zA-Z\\*\\]\\+|\\(.*\\)\\+.*\\(.*\\)\\+' },
      { key: 'nested-quantifiers', pattern: '\\+\\+|\\*\\*|\\}\\{' },
      { key: 'backtracking-regex', pattern: '\\(x\\|xx\\)\\+|\\[a-z\\]\\[a-z\\]\\?' }
    ]
  },
  {
    id: 'rate-limiting',
    name: 'Rate Limiting',
    severity: 'Medium',
    description: 'Missing rate limiting controls',
    recommendation: 'Implement rate limiting to prevent abuse and brute force attacks.',
    patterns: [
      { key: 'missing-rate-limit', pattern: 'express-rate-limit|rateLimit|limiter|throttle' },
      { key: 'api-endpoint-no-limit', pattern: 'app\\.(get|post|put|delete|patch)\\s*\\(\\s*["\']/api/' }
    ]
  },
  {
    id: 'brute-force',
    name: 'Brute Force Attack',
    severity: 'High',
    description: 'Potential brute force attack vulnerability',
    recommendation: 'Implement account lockout mechanisms and CAPTCHA after failed attempts.',
    patterns: [
      { key: 'auth-no-lockout', pattern: 'login|authenticate|password' },
      { key: 'failed-attempts-tracking', pattern: 'attempts|failures|lockout' }
    ]
  },
  {
    id: 'access-control',
    name: 'Access Control',
    severity: 'High',
    description: 'Potential access control vulnerability',
    recommendation: 'Implement proper authorization checks for sensitive operations.',
    patterns: [
      { key: 'missing-auth-check', pattern: 'middleware.*auth|isLoggedIn|isAuthenticated' },
      { key: 'admin-endpoint-public', pattern: 'admin|root|superuser' }
    ]
  },
  {
    id: 'business-logic-flaw',
    name: 'Business Logic Flaw',
    severity: 'High',
    description: 'Potential business logic vulnerability',
    recommendation: 'Review business logic for edge cases and unintended behaviors.',
    patterns: [
      { key: 'price-manipulation', pattern: 'price|cost|amount' },
      { key: 'quantity-bypass', pattern: 'quantity|count|max|min' },
      { key: 'state-transition-flaw', pattern: 'status|state|transition' }
    ]
  },
  {
    id: 'api-security',
    name: 'API Security',
    severity: 'High',
    description: 'Potential API security vulnerability',
    recommendation: 'Implement proper API security measures including authentication, authorization, and input validation.',
    patterns: [
      { key: 'api-key-exposure', pattern: 'api[_-]key|token|secret' },
      { key: 'api-no-auth', pattern: 'Authorization|Bearer|JWT' }
    ]
  },
  {
    id: 'insecure-file-download',
    name: 'Insecure File Download',
    severity: 'Medium',
    description: 'Potential insecure file download vulnerability',
    recommendation: 'Validate file paths and implement proper access controls for file downloads.',
    patterns: [
      { key: 'path-traversal-download', pattern: 'download|getFile|serveFile' },
      { key: 'file-type-bypass', pattern: '\\.\\./|\\.\\.\\\\' }
    ]
  },
  {
    id: 'mass-assignment',
    name: 'Mass Assignment',
    severity: 'High',
    description: 'Potential mass assignment vulnerability',
    recommendation: 'Whitelist attributes that can be assigned in bulk operations.',
    patterns: [
      { key: 'model-create-all', pattern: 'Model\\.create\\s*\\(\\s*req\\.' },
      { key: 'bulk-update-all', pattern: 'update\\s*\\(\\s*req\\.' }
    ]
  },
  {
    id: 'insecure-deserialization',
    name: 'Insecure Deserialization',
    severity: 'High',
    description: 'Potential insecure deserialization vulnerability',
    recommendation: 'Validate and sanitize serialized data before deserializing.',
    patterns: [
      { key: 'deserialize-user-input', pattern: 'JSON\\.parse\\s*\\(\\s*req\\.' },
      { key: 'deserialize-from-storage', pattern: 'unserialize|deserialize' }
    ]
  },
  {
    id: 'ssrf-vulnerable-request',
    name: 'Server-Side Request Forgery (SSRF)',
    severity: 'High',
    description: 'Potential SSRF vulnerability through URL-based requests',
    recommendation: 'Validate and whitelist URLs before making requests. Restrict protocol and destination.',
    patterns: [
      { key: 'fetch-user-url', pattern: 'fetch\\s*\\(\\s*.*req\\.(query|params|body)' },
      { key: 'fetch-variable', pattern: 'fetch\\s*\\(\\s*url' },
      { key: 'axios-user-url', pattern: 'axios\\.(get|post|put|delete)\\s*\\(\\s*.*req\\.(query|params|body)' },
      { key: 'request-user-url', pattern: 'request\\s*\\(\\s*.*req\\.(query|params|body)' }
    ]
  },
  {
    id: 'path-traversal',
    name: 'Path Traversal Vulnerability',
    severity: 'High',
    description: 'Potential path traversal vulnerability through file system access',
    recommendation: 'Validate and sanitize file paths. Use path.join() and avoid concatenating user input directly.',
    patterns: [
      { key: 'fs-user-path', pattern: '\\b(fs|require\\s*\\([\'"]fs[\'"]\\))\\.[a-zA-Z]+\\s*\\(\\s*(req\\.|params\\.|query\\.|body\\.)' },
      { key: 'path-concat', pattern: '\\+\\s*["\'][/\\\\]["\']\\s*\\+\\s*(req\\.|params\\.|query\\.|body\\.)' },
      { key: 'path-traversal', pattern: '\\.\\.\\/|\\.\\.\\\\' }
    ]
  },
  {
    id: 'insecure-randomness',
    name: 'Insecure Randomness',
    severity: 'Medium',
    description: 'Using insecure random number generation for security-sensitive operations',
    recommendation: 'Use crypto.randomBytes() or crypto.getRandomValues() for security-sensitive random numbers.',
    patterns: [
      { key: 'math-random-crypto', pattern: 'Math\\.random\\s*\\(\\s*\\).*[pP]assword|[tT]oken|[kK]ey|[sS]ecret|[sS]ession' },
      { key: 'date-random', pattern: 'Date\\.now\\s*\\(\\s*\\).*[rR]andom' }
    ]
  },
  {
    id: 'insecure-crypto-algorithm',
    name: 'Insecure Cryptographic Algorithm',
    severity: 'High',
    description: 'Using weak or deprecated cryptographic algorithms',
    recommendation: 'Use strong, modern cryptographic algorithms like AES-256-GCM, RSA with OAEP, or SHA-256.',
    patterns: [
      { key: 'md5-hash', pattern: '\\b(md5|MD5)\\s*\\(' },
      { key: 'sha1-hash', pattern: '\\b(sha1|SHA1)\\s*\\(' },
      { key: 'des-cipher', pattern: '\\b(des|DES)\\s*\\(' },
      { key: 'rc4-cipher', pattern: '\\b(rc4|RC4)\\s*\\(' }
    ]
  },
  {
    id: 'insecure-storage',
    name: 'Insecure Data Storage',
    severity: 'Medium',
    description: 'Storing sensitive data in insecure locations',
    recommendation: 'Use secure storage mechanisms for sensitive data. Avoid localStorage/sessionStorage for sensitive information.',
    patterns: [
      { key: 'localStorage-sensitive', pattern: 'localStorage\\.(setItem|getItem)\\s*\\(.*["\'].*(?:password|token|key|secret|auth|credential)' },
      { key: 'sessionStorage-sensitive', pattern: 'sessionStorage\\.(setItem|getItem)\\s*\\(.*["\'].*(?:password|token|key|secret|auth|credential)' },
      { key: 'indexedDB-sensitive', pattern: 'indexedDB\\.open\\s*\\(.*["\'].*(?:password|token|key|secret|auth|credential)' }
    ]
  },
  {
    id: 'insecure-communication',
    name: 'Insecure Communication',
    severity: 'High',
    description: 'Using insecure protocols for sensitive data transmission',
    recommendation: 'Use HTTPS for all communications involving sensitive data.',
    patterns: [
      { key: 'http-protocol', pattern: '["\']http://[^"\']*(?:password|token|key|secret|auth|credential)' },
      { key: 'ws-protocol', pattern: '["\']ws://[^"\']*' },
      { key: 'insecure-websocket', pattern: 'new WebSocket\\s*\\(\\s*["\']ws://' }
    ]
  },
  {
    id: 'information-disclosure',
    name: 'Information Disclosure',
    severity: 'Medium',
    description: 'Potential information disclosure through error messages or debug output',
    recommendation: 'Avoid exposing sensitive information in error messages or debug output.',
    patterns: [
      { key: 'error-stack', pattern: 'console\\.(log|error)\\s*\\(.*error\\.stack' },
      { key: 'debug-info', pattern: 'console\\.(log|debug)\\s*\\(.*(?:password|token|key|secret|auth|credential)' },
      { key: 'res-send-error', pattern: 'res\\.(send|json|status)\\s*\\(.*error' }
    ]
  },
  {
    id: 'insecure-direct-object-reference',
    name: 'Insecure Direct Object Reference (IDOR)',
    severity: 'High',
    description: 'Potential IDOR vulnerability through direct object references',
    recommendation: 'Implement proper authorization checks before accessing objects.',
    patterns: [
      { key: 'params-id-access', pattern: '\\b(req\\.|params\\.|query\\.)id\\b.*(?:findById|findByPk|findOne)' },
      { key: 'user-input-id', pattern: '(req\\.|params\\.|query\\.|body\\.)[uU]ser[Ii]d' }
    ]
  },
  {
    id: 'command-injection',
    name: 'Command Injection',
    severity: 'Critical',
    description: 'Potential command injection vulnerability',
    recommendation: 'Avoid executing shell commands with user input. Use parameterized commands if possible.',
    patterns: [
      { key: 'exec-user-input', pattern: '\\b(exec|execSync|spawn)\\s*\\(\\s*.*req\\.(query|params|body)' },
      { key: 'child-process-user-input', pattern: 'child_process\\.(exec|execSync|spawn)\\s*\\(\\s*.*req\\.(query|params|body)' },
      { key: 'shell-command', pattern: '\\.exec\\s*\\(.*\\+.*req\\.' },
      { key: 'exec-cmd-param', pattern: '\\b(exec|execSync|spawn)\\s*\\(\\s*command' },
      { key: 'exec-variable', pattern: 'exec\\s*\\(\\s*command' }
    ]
  },
  {
    id: 'insecure-dependency',
    name: 'Insecure Dependency',
    severity: 'Medium',
    description: 'Using dependencies with known vulnerabilities',
    recommendation: 'Regularly update dependencies and use tools like npm audit to check for vulnerabilities.',
    patterns: [
      { key: 'old-vue-version', pattern: '"vue":\\s*"[12]\\.' },
      { key: 'old-webpack-version', pattern: '"webpack":\\s*"[1-4]\\.' }
    ]
  },
  {
    id: 'improper-authentication',
    name: 'Improper Authentication',
    severity: 'High',
    description: 'Potential authentication bypass or weak authentication',
    recommendation: 'Implement strong authentication mechanisms and multi-factor authentication where possible.',
    patterns: [
      { key: 'weak-password-check', pattern: 'password\\s*===\\s*["\'][^"\']+["\']|password\\s*==\\s*["\'][^"\']+["\']' },
      { key: 'hardcoded-session', pattern: 'session\\s*=\\s*["\'][^"\']+["\']' }
    ]
  },
  {
    id: 'insecure-configuration',
    name: 'Insecure Configuration',
    severity: 'Medium',
    description: 'Insecure configuration that may lead to security issues',
    recommendation: 'Review and secure all configuration settings, especially in production environments.',
    patterns: [
      { key: 'disable-ssl-validation', pattern: 'rejectUnauthorized\\s*:\\s*false' },
      { key: 'disable-csrf', pattern: 'csrf\\s*:\\s*false|csrfProtection\\s*:\\s*false' },
      { key: 'insecure-cookie', pattern: 'secure\\s*:\\s*false|httpOnly\\s*:\\s*false' }
    ]
  },
  {
    id: 'insufficient-logging',
    name: 'Insufficient Logging',
    severity: 'Low',
    description: 'Insufficient logging of security events',
    recommendation: 'Implement comprehensive logging for authentication, authorization, and security events.',
    patterns: [
      { key: 'missing-auth-log', pattern: '(login|authenticate|signin).*?(?!console\\.log|logger|winston)' },
      { key: 'missing-failed-login-log', pattern: '(failed|error).*?(?!console\\.log|logger|winston)' }
    ]
  },
  {
    id: 'vue3-specific-xss',
    name: 'Vue 3 Specific XSS',
    severity: 'High',
    description: 'Vue 3 specific XSS vulnerability patterns',
    recommendation: 'Ensure proper sanitization of user input in Vue 3 applications.',
    patterns: [
      { key: 'vue3-v-html', pattern: 'v-html\\s*=\\s*["\'].*(?:user|input|data|content)' },
      { key: 'vue3-innerhtml', pattern: 'innerHTML\\s*=\\s*.*(?:user|input|data|content)' },
      { key: 'vue3-dynamic-template', pattern: 'template\\s*:\\s*["\'].*(?:user|input|data|content)' }
    ]
  },
  {
    id: 'vue-router-security',
    name: 'Vue Router Security Issues',
    severity: 'Medium',
    description: 'Vue router security vulnerabilities',
    recommendation: 'Implement proper route guards and validation for sensitive routes.',
    patterns: [
      { key: 'router-no-guard', pattern: 'path\\s*:\\s*["\']\/(admin|settings|profile).*?(?!beforeEnter|meta)' },
      { key: 'router-meta-auth', pattern: 'meta\\s*:\\s*{.*requiresAuth.*?}' }
    ]
  },
  {
    id: 'vue-state-security',
    name: 'Vue State Management Security',
    severity: 'Medium',
    description: 'Vue state management security issues',
    recommendation: 'Avoid storing sensitive information in Vuex or Pinia stores without encryption.',
    patterns: [
      { key: 'store-sensitive-data', pattern: 'state\\s*:\\s*{.*(?:password|token|key|secret|auth|credential)' },
      { key: 'pinia-sensitive-data', pattern: 'defineStore\\s*\\(.*state.*(?:password|token|key|secret|auth|credential)' }
    ]
  },
  {
    id: 'vue-lifecycle-security',
    name: 'Vue Lifecycle Security Issues',
    severity: 'Medium',
    description: 'Vue lifecycle hooks security vulnerabilities',
    recommendation: 'Be cautious with user input in lifecycle hooks, especially created() and mounted().',
    patterns: [
      { key: 'created-user-input', pattern: 'created\\s*\\(\\s*\\).*(?:req\\.|params\\.|query\\.|body\\.|user|input|data)' },
      { key: 'mounted-dom-manipulation', pattern: 'mounted\\s*\\(\\s*\\).*(?:innerHTML|outerHTML|insertAdjacentHTML)' }
    ]
  },
  {
    id: 'vue-component-security',
    name: 'Vue Component Security Issues',
    severity: 'Medium',
    description: 'Vue component security vulnerabilities',
    recommendation: 'Validate props and avoid using v-html with untrusted content.',
    patterns: [
      { key: 'props-no-validation', pattern: 'props\\s*:\\s*\\[.*\\].*?(?!validator|type)' },
      { key: 'component-v-html-user', pattern: 'v-html\\s*=\\s*["\'].*(?:user|input|data|content)' }
    ]
  },
  {
    id: 'vue-event-security',
    name: 'Vue Event Security Issues',
    severity: 'Medium',
    description: 'Vue event handling security vulnerabilities',
    recommendation: 'Validate and sanitize event data before processing.',
    patterns: [
      { key: 'event-user-input', pattern: '@\\w+\\s*=\\s*["\'].*(?:user|input|data|content).*?(?!sanitize|validate|escape)' },
      { key: 'event-handler-dom', pattern: '\\$\\w+\\s*\\(.*(?:innerHTML|outerHTML|insertAdjacentHTML)' }
    ]
  },
  {
    id: 'vue-template-security',
    name: 'Vue Template Security Issues',
    severity: 'High',
    description: 'Vue template security vulnerabilities',
    recommendation: 'Avoid dynamic template rendering with user input.',
    patterns: [
      { key: 'dynamic-template-user', pattern: 'template\\s*:\\s*["\'].*(?:user|input|data|content)' },
      { key: 'render-function-user', pattern: 'render\\s*\\(.*(?:user|input|data|content)' }
    ]
  },
  {
    id: 'dependency-outdated-package',
    name: 'Outdated Package Version',
    severity: 'Medium',
    description: 'Package version may be outdated and have known vulnerabilities',
    recommendation: 'Update to the latest stable version of the package',
    patterns: [
      { key: 'outdated-lodash', pattern: '"lodash"\\s*:\\s*"[0-3]\\.' },
      { key: 'outdated-moment', pattern: '"moment"\\s*:\\s*"[0-1]\\.' },
      { key: 'outdated-axios', pattern: '"axios"\\s*:\\s*"[0]\\.' },
      { key: 'outdated-express', pattern: '"express"\\s*:\\s*"[0-3]\\.' },
      { key: 'outdated-socket-io', pattern: '"socket\\.io"\\s*:\\s*"[0-1]\\.' },
      { key: 'outdated-qs', pattern: '"qs"\\s*:\\s*"[0-5]\\.' },
      { key: 'outdated-negotiator', pattern: '"negotiator"\\s*:\\s*"[0]\\.' },
      { key: 'outdated-uglify-js', pattern: '"uglify-js"\\s*:\\s*"[0-2]\\.' },
      { key: 'outdated-minimist', pattern: '"minimist"\\s*:\\s*"[0]\\.' },
      { key: 'outdated-merge', pattern: '"merge"\\s*:\\s*"[0-1]\\.' }
    ]
  },
  {
    id: 'dependency-known-vulnerability',
    name: 'Known Vulnerable Package',
    severity: 'Critical',
    description: 'Package has known security vulnerabilities',
    recommendation: 'Update to a patched version or use an alternative package',
    patterns: [
      { key: 'vuln-lodash', pattern: '"lodash"\\s*:\\s*"[0-4]\\.[0-9]+\\.[0-9]+"' },
      { key: 'vuln-axios', pattern: '"axios"\\s*:\\s*"[0]\\.[0-9]+\\.[0-9]+"' },
      { key: 'vuln-express', pattern: '"express"\\s*:\\s*"[0-3]\\.[0-9]+\\.[0-9]+"' },
      { key: 'vuln-socket-io', pattern: '"socket\\.io"\\s*:\\s*"[0-1]\\.[0-9]+\\.[0-9]+"' },
      { key: 'vuln-qs', pattern: '"qs"\\s*:\\s*"[0-5]\\.[0-9]+\\.[0-9]+"' },
      { key: 'vuln-negotiator', pattern: '"negotiator"\\s*:\\s*"[0]\\.[0-9]+\\.[0-9]+"' },
      { key: 'vuln-uglify-js', pattern: '"uglify-js"\\s*:\\s*"[0-2]\\.[0-9]+\\.[0-9]+"' },
      { key: 'vuln-minimist', pattern: '"minimist"\\s*:\\s*"[0]\\.[0-9]+\\.[0-9]+"' },
      { key: 'vuln-merge', pattern: '"merge"\\s*:\\s*"[0-1]\\.[0-9]+\\.[0-9]+"' },
      { key: 'vuln-elliptic', pattern: '"elliptic"\\s*:\\s*"[0-5]\\.[0-9]+\\.[0-9]+"' }
    ]
  },
  {
    id: 'dependency-unmaintained',
    name: 'Unmaintained Package',
    severity: 'High',
    description: 'Package is no longer maintained',
    recommendation: 'Consider migrating to an actively maintained alternative',
    patterns: [
      { key: 'unmaintained-request', pattern: '"request"\\s*:' },
      { key: 'unmaintained-debug', pattern: '"debug"\\s*:\\s*"[0-3]\\.' },
      { key: 'unmaintained-extend', pattern: '"extend"\\s*:' },
      { key: 'unmaintained-mkdirp', pattern: '"mkdirp"\\s*:\\s*"[0]\\.' }
    ]
  },
  {
    id: 'dependency-large-package',
    name: 'Large Package Size',
    severity: 'Low',
    description: 'Package has large size which may impact performance',
    recommendation: 'Consider using lighter alternatives',
    patterns: [
      { key: 'large-moment', pattern: '"moment"\\s*:' },
      { key: 'large-lodash', pattern: '"lodash"\\s*:' },
      { key: 'large-chalk', pattern: '"chalk"\\s*:' }
    ]
  },
  {
    id: 'dependency-deprecated',
    name: 'Deprecated Package',
    severity: 'Medium',
    description: 'Package is deprecated',
    recommendation: 'Migrate to the recommended replacement package',
    patterns: [
      { key: 'deprecated-bcryptjs', pattern: '"bcryptjs"\\s*:' },
      { key: 'deprecated-uuid', pattern: '"uuid"\\s*:\\s*"[0-2]\\.' },
      { key: 'deprecated-jsonwebtoken', pattern: '"jsonwebtoken"\\s*:\\s*"[0-7]\\.' }
    ]
  },
  {
    id: 'dependency-insecure-protocol',
    name: 'Insecure Protocol in Dependencies',
    severity: 'High',
    description: 'Package uses insecure protocol (http://) for installation',
    recommendation: 'Use packages with secure HTTPS protocol',
    patterns: [
      { key: 'insecure-protocol', pattern: '"(http://[^"]+)"\\s*:' }
    ]
  },
  {
    id: 'dependency-git-dependency',
    name: 'Git Dependency',
    severity: 'Medium',
    description: 'Package uses Git dependency which may be unstable',
    recommendation: 'Use published npm packages instead of Git dependencies',
    patterns: [
      { key: 'git-dependency', pattern: '"(git\\+https?://|git@github\\.com:)[^"]+"\\s*:' }
    ]
  },
  {
    id: 'dependency-local-dependency',
    name: 'Local Dependency',
    severity: 'Low',
    description: 'Package uses local file dependency',
    recommendation: 'Ensure local dependencies are properly versioned and documented',
    patterns: [
      { key: 'local-dependency', pattern: '"(file:|link:)[^"]+"\\s*:' }
    ]
  },
  {
    id: 'dependency-peer-dependency-missing',
    name: 'Missing Peer Dependency',
    severity: 'Medium',
    description: 'Package may be missing required peer dependencies',
    recommendation: 'Install all required peer dependencies',
    patterns: [
      { key: 'peer-dependency', pattern: '"peerDependencies"\\s*:' }
    ]
  },
  {
    id: 'dependency-dev-dependency-in-prod',
    name: 'Dev Dependency in Production',
    severity: 'Low',
    description: 'Development dependency may be used in production',
    recommendation: 'Ensure dev dependencies are not bundled in production builds',
    patterns: [
      { key: 'dev-in-prod', pattern: '"devDependencies"\\s*:\\s*\\{[^}]*"(webpack|babel|eslint|jest|typescript)"' }
    ]
  },
  {
    id: 'env-file-exposed',
    name: 'Environment File Exposed',
    severity: 'High',
    description: 'Environment file may be exposed to client or version control',
    recommendation: 'Ensure .env files are not committed to version control and not bundled in client code',
    patterns: [
      { key: 'env-import', pattern: 'import\\s+.*\\s+from\\s+[\'"]\\.env[\'"]' },
      { key: 'env-require', pattern: 'require\\s*\\(\\s*[\'"]\\.env[\'"]\\s*\\)' },
      { key: 'env-load', pattern: 'loadEnv\\s*\\(\\s*[\'"]\\.env[\'"]\\s*\\)' },
      { key: 'env-config', pattern: 'config\\s*\\(\\s*[\'"]\\.env[\'"]\\s*\\)' }
    ]
  },
  {
    id: 'env-sensitive-data',
    name: 'Sensitive Data in Environment Variables',
    severity: 'High',
    description: 'Sensitive data found in environment variable usage',
    recommendation: 'Use secure vault systems for sensitive credentials',
    patterns: [
      { key: 'env-password', pattern: 'process\\.env\\.(?:PASSWORD|PASS|PWD)' },
      { key: 'env-secret', pattern: 'process\\.env\\.(?:SECRET|SECRETS)' },
      { key: 'env-token', pattern: 'process\\.env\\.(?:TOKEN|ACCESS_TOKEN|AUTH_TOKEN|API_TOKEN)' },
      { key: 'env-api-key', pattern: 'process\\.env\\.(?:API_KEY|APIKEY|APISECRET)' },
      { key: 'env-private-key', pattern: 'process\\.env\\.(?:PRIVATE_KEY|PRIVATEKEY)' },
      { key: 'env-auth', pattern: 'process\\.env\\.(?:AUTH|AUTHENTICATION|AUTHORIZATION)' },
      { key: 'env-credential', pattern: 'process\\.env\\.(?:CREDENTIAL|CREDENTIALS)' },
      { key: 'env-db-password', pattern: 'process\\.env\\.(?:DB_PASSWORD|DATABASE_PASSWORD|MONGO_PASSWORD|MYSQL_PASSWORD)' }
    ]
  },
  {
    id: 'env-client-exposure',
    name: 'Environment Variable Exposed to Client',
    severity: 'High',
    description: 'Environment variable may be exposed to client-side code',
    recommendation: 'Use server-side environment variables and avoid exposing sensitive data to client',
    patterns: [
      { key: 'env-in-client', pattern: 'process\\.env\\.(?:API_KEY|SECRET|TOKEN|PASSWORD|AUTH|CREDENTIAL)\\s*\\+\\s*' },
      { key: 'env-in-template', pattern: '\\{\\{\\s*process\\.env\\.(?:API_KEY|SECRET|TOKEN|PASSWORD|AUTH|CREDENTIAL)\\s*\\}\\}' },
      { key: 'env-in-v-bind', pattern: 'v-bind:[^=]+\\s*=\\s*["\'].*process\\.env\\.(?:API_KEY|SECRET|TOKEN|PASSWORD|AUTH|CREDENTIAL)' }
    ]
  },
  {
    id: 'env-default-sensitive',
    name: 'Default Value for Sensitive Environment Variable',
    severity: 'Medium',
    description: 'Sensitive environment variable has default value',
    recommendation: 'Avoid providing default values for sensitive environment variables',
    patterns: [
      { key: 'env-default-password', pattern: 'process\\.env\\.(?:PASSWORD|PASS|PWD)\\s*\\|\\|\\s*["\'][^"\']+["\']' },
      { key: 'env-default-secret', pattern: 'process\\.env\\.(?:SECRET|SECRETS)\\s*\\|\\|\\s*["\'][^"\']+["\']' },
      { key: 'env-default-token', pattern: 'process\\.env\\.(?:TOKEN|ACCESS_TOKEN|AUTH_TOKEN)\\s*\\|\\|\\s*["\'][^"\']+["\']' }
    ]
  },
  {
    id: 'env-logging',
    name: 'Environment Variable Logged',
    severity: 'Medium',
    description: 'Environment variable may be logged',
    recommendation: 'Avoid logging sensitive environment variables',
    patterns: [
      { key: 'log-env', pattern: 'console\\.(log|info|warn|error|debug)\\s*\\(\\s*process\\.env' },
      { key: 'log-env-sensitive', pattern: 'console\\.(log|info|warn|error|debug)\\s*\\(.*process\\.env\\.(?:PASSWORD|SECRET|TOKEN|API_KEY|AUTH)' }
    ]
  },
  {
    id: 'auth-weak-password',
    name: 'Weak Password Policy',
    severity: 'High',
    description: 'Weak password policy detected',
    recommendation: 'Implement strong password requirements (minimum 8 characters, uppercase, lowercase, numbers, special characters)',
    patterns: [
      { key: 'password-length', pattern: 'password\\.length\\s*[<>]=?\\s*[0-6]' },
      { key: 'password-simple', pattern: '/^[a-zA-Z]+$/.test\\s*\\(\\s*password' },
      { key: 'password-no-complex', pattern: '!/(?=.*[A-Z])(?=.*[a-z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}/.test\\s*\\(\\s*password' }
    ]
  },
  {
    id: 'auth-insecure-hash',
    name: 'Insecure Password Hashing',
    severity: 'High',
    description: 'Insecure password hashing algorithm detected',
    recommendation: 'Use secure hashing algorithms like bcrypt, argon2, or scrypt with proper salt',
    patterns: [
      { key: 'hash-md5', pattern: '\\bmd5\\s*\\(\\s*password' },
      { key: 'hash-sha1', pattern: '\\bsha1\\s*\\(\\s*password|\\bsha\\s*\\(\\s*password' },
      { key: 'hash-sha256', pattern: '\\bsha256\\s*\\(\\s*password' },
      { key: 'hash-sha512', pattern: '\\bsha512\\s*\\(\\s*password' },
      { key: 'hash-base64', pattern: 'btoa\\s*\\(\\s*password|Buffer\\.from\\s*\\(\\s*password\\s*\\)\\.toString\\s*\\(\\s*[\'"]base64[\'"]' }
    ]
  },
  {
    id: 'auth-missing-check',
    name: 'Missing Authentication Check',
    severity: 'High',
    description: 'Missing authentication check in route or API endpoint',
    recommendation: 'Implement proper authentication checks before accessing protected resources',
    patterns: [
      { key: 'auth-check-missing', pattern: 'router\\.(get|post|put|delete|patch)\\s*\\(\\s*[\'"][^\'"]*[\'"]\\s*,\\s*\\(\\s*req,\\s*res\\s*\\)\\s*=>\\s*\\{[^}]*res\\.(json|send|render)' },
      { key: 'auth-check-bypass', pattern: 'if\\s*\\(\\s*!authenticated\\s*\\)\\s*\\{[^}]*return[^}]*\\}' },
      { key: 'auth-check-optional', pattern: 'optionalAuth\\s*\\(\\s*\\)|auth\\s*:\\s*\\{\\s*optional\\s*:\\s*true' }
    ]
  },
  {
    id: 'auth-hardcoded-credential',
    name: 'Hardcoded Authentication Credentials',
    severity: 'Critical',
    description: 'Hardcoded authentication credentials detected',
    recommendation: 'Move credentials to environment variables or secure vault systems',
    patterns: [
      { key: 'auth-username', pattern: "(username|user)\\s*[:=]\\s*['\"]admin['\"]" },
      { key: 'auth-password', pattern: "(password|pass)\\s*[:=]\\s*['\"](admin|password|123456|qwerty)['\"]" },
      { key: 'auth-default', pattern: "defaultAuth\\s*[:=]\\s*\\{[^}]*password\\s*[:=]" }
    ]
  },
  {
    id: 'auth-session-fixation',
    name: 'Session Fixation Vulnerability',
    severity: 'High',
    description: 'Potential session fixation vulnerability',
    recommendation: 'Regenerate session ID after authentication',
    patterns: [
      { key: 'session-no-regenerate', pattern: 'req\\.session\\.(user|userId|authenticated)\\s*=\\s*(?!req\\.session\\.regenerate\\s*\\(\\s*\\))' },
      { key: 'session-id-exposed', pattern: 'req\\.sessionID\\s*\\+\\s*|console\\.log\\s*\\(\\s*req\\.sessionID' }
    ]
  },
  {
    id: 'auth-weak-token',
    name: 'Weak Token Generation',
    severity: 'High',
    description: 'Weak token generation method detected',
    recommendation: 'Use cryptographically secure random token generation',
    patterns: [
      { key: 'token-math-random', pattern: 'Math\\.random\\s*\\(\\s*\\)\\.toString\\s*\\(\\s*36\\s*\\)' },
      { key: 'token-date-now', pattern: 'Date\\.now\\s*\\(\\s*\\)\\.toString\\s*\\(\\s*36\\s*\\)' },
      { key: 'token-weak', pattern: 'token\\s*=\\s*Math\\.random\\s*\\(\\s*\\)|token\\s*=\\s*Math\\.floor\\s*\\(\\s*Math\\.random\\s*\\(\\s*\\)' }
    ]
  },
  {
    id: 'auth-missing-logout',
    name: 'Missing Logout Functionality',
    severity: 'Medium',
    description: 'Missing logout functionality or session invalidation',
    recommendation: 'Implement proper logout with session invalidation and token revocation',
    patterns: [
      { key: 'logout-missing', pattern: 'router\\.(get|post)\\s*\\(\\s*[\'"]\\/login[\'"]' },
      { key: 'logout-weak', pattern: 'req\\.session\\s*=\\s*null|req\\.session\\s*=\\s*undefined' }
    ]
  },
  {
    id: 'auth-brute-force',
    name: 'Missing Brute Force Protection',
    severity: 'Medium',
    description: 'Missing brute force protection on authentication endpoints',
    recommendation: 'Implement rate limiting and account lockout mechanisms',
    patterns: [
      { key: 'login-no-rate-limit', pattern: 'router\\.(get|post)\\s*\\(\\s*[\'"]\\/login[\'"]' },
      { key: 'login-no-lockout', pattern: 'login\\s*\\(\\s*username,\\s*password\\s*\\)' }
    ]
  },
  {
    id: 'auth-permission-bypass',
    name: 'Permission Bypass Vulnerability',
    severity: 'High',
    description: 'Potential permission bypass vulnerability',
    recommendation: 'Implement proper role-based access control (RBAC)',
    patterns: [
      { key: 'permission-missing', pattern: 'if\\s*\\(\\s*req\\.session\\.(user|userId)\\s*\\)\\s*\\{[^}]*\\}' },
      { key: 'role-check-missing', pattern: 'if\\s*\\(\\s*req\\.user\\s*\\)\\s*\\{[^}]*\\}' },
      { key: 'admin-check-weak', pattern: 'if\\s*\\(\\s*req\\.user\\.role\\s*===\\s*[\'"]admin[\'"]\\s*\\)\\s*\\{[^}]*\\}' }
    ]
  },
  {
    id: 'auth-jwt-insecure',
    name: 'Insecure JWT Implementation',
    severity: 'High',
    description: 'Insecure JWT token implementation detected',
    recommendation: 'Use secure JWT implementation with proper signing and verification',
    patterns: [
      { key: 'jwt-none-algorithm', pattern: 'algorithm\\s*:\\s*[\'"]none[\'"]' },
      { key: 'jwt-weak-secret', pattern: 'jwt\\.sign\\s*\\(\\s*[^,]+,\\s*[\'"][^\'"]{0,10}[\'"]' },
      { key: 'jwt-no-expiry', pattern: 'jwt\\.sign\\s*\\(\\s*[^,]+,\\s*[^,]+\\s*\\)(?!.*expiresIn)' },
      { key: 'jwt-no-verify', pattern: 'jwt\\.decode\\s*\\(\\s*(?!jwt\\.verify)' }
    ]
  },
  {
    id: 'auth-oauth-insecure',
    name: 'Insecure OAuth Implementation',
    severity: 'High',
    description: 'Insecure OAuth implementation detected',
    recommendation: 'Use secure OAuth implementation with proper state parameter and PKCE',
    patterns: [
      { key: 'oauth-no-state', pattern: 'oauth2\\.authorize\\s*\\(\\s*\\{[^}]*\\}\\s*\\)(?!.*state)' },
      { key: 'oauth-insecure-redirect', pattern: 'redirect_uri\\s*:\\s*[\'"]http://[^\'"]*[\'"]' },
      { key: 'oauth-implicit-flow', pattern: 'response_type\\s*:\\s*[\'"]token[\'"]' }
    ]
  },
  {
    id: 'file-upload-no-validation',
    name: 'File Upload Without Validation',
    severity: 'High',
    description: 'File upload without proper validation',
    recommendation: 'Validate file type, size, and content before accepting uploads',
    patterns: [
      { key: 'upload-no-type-check', pattern: 'upload\\s*\\(\\s*file\\s*\\)\\s*\\{[^}]*\\}(?!.*mimetype|.*filetype|.*content-type)' },
      { key: 'upload-no-size-check', pattern: 'upload\\s*\\(\\s*file\\s*\\)\\s*\\{[^}]*\\}(?!.*size|.*filesize|.*maxSize)' },
      { key: 'upload-no-content-check', pattern: 'upload\\s*\\(\\s*file\\s*\\)\\s*\\{[^}]*\\}(?!.*magic|.*file\\s*\\.read|.*content)' }
    ]
  },
  {
    id: 'file-upload-path-traversal',
    name: 'File Upload Path Traversal',
    severity: 'High',
    description: 'Potential path traversal vulnerability in file upload',
    recommendation: 'Validate and sanitize file paths to prevent path traversal attacks',
    patterns: [
      { key: 'path-traversal', pattern: '\\.\\.\\/|\\.\\.\\\\|%2e%2e%2f|%2e%2e%5c' },
      { key: 'path-concat', pattern: 'path\\.join\\s*\\(\\s*uploadDir,\\s*[^)]*\\+\\s*' },
      { key: 'path-resolve-user', pattern: 'path\\.resolve\\s*\\(\\s*[^,]+,\\s*(?:req|file|filename)' }
    ]
  },
  {
    id: 'file-upload-executable',
    name: 'Executable File Upload',
    severity: 'High',
    description: 'Executable file may be uploaded',
    recommendation: 'Block executable file types (.exe, .sh, .bat, .cmd, .js, .php, .jsp, .asp)',
    patterns: [
      { key: 'upload-executable', pattern: '\\.(exe|sh|bat|cmd|js|php|jsp|asp|aspx|dll|so|dylib|com|vbs|ps1|py|rb|pl)' }
    ]
  },
  {
    id: 'file-upload-malicious',
    name: 'Potentially Malicious File Upload',
    severity: 'High',
    description: 'Potentially malicious file type may be uploaded',
    recommendation: 'Block potentially malicious file types and validate file content',
    patterns: [
      { key: 'upload-malicious', pattern: '\\.(scr|pif|vb|vbe|wsf|wsc|wsh|msi|msp|com|cpl|jar|app|deb|rpm)' }
    ]
  },
  {
    id: 'file-upload-webshell',
    name: 'Webshell File Upload',
    severity: 'Critical',
    description: 'Webshell file may be uploaded',
    recommendation: 'Block webshell file types and validate file content',
    patterns: [
      { key: 'upload-webshell', pattern: '\\.(php|php3|php4|php5|phtml|jsp|jspx|asp|aspx|asa|cer|aSp|aSpx|aSax|ascx|ashx|asmx|cer|aSp|aSpx|aSax|ascx|ashx|asmx)' }
    ]
  },
  {
    id: 'file-upload-size-limit',
    name: 'Missing File Size Limit',
    severity: 'Medium',
    description: 'Missing file size limit in upload configuration',
    recommendation: 'Set appropriate file size limits to prevent DoS attacks',
    patterns: [
      { key: 'size-limit-missing', pattern: 'multer\\s*\\(\\s*\\{[^}]*\\}\\s*\\)(?!.*limits|.*fileSize|.*maxSize)' },
      { key: 'size-limit-large', pattern: 'fileSize\\s*:\\s*\\d{9,}|maxSize\\s*:\\s*\\d{9,}' }
    ]
  },
  {
    id: 'file-upload-storage-location',
    name: 'Insecure File Storage Location',
    severity: 'High',
    description: 'Files stored in web-accessible directory',
    recommendation: 'Store uploaded files outside web root or use secure storage service',
    patterns: [
      { key: 'storage-public', pattern: 'uploadDir\\s*[:=]\\s*[\'"]\\./public[\'"]|uploadDir\\s*[:=]\\s*[\'"]\\./static[\'"]|uploadDir\\s*[:=]\\s*[\'"]\\./assets[\'"]' },
      { key: 'storage-webroot', pattern: 'uploadDir\\s*[:=]\\s*[\'"]\\./www[\'"]|uploadDir\\s*[:=]\\s*[\'"]\\./html[\'"]|uploadDir\\s*[:=]\\s*[\'"]\\./htdocs[\'"]' }
    ]
  },
  {
    id: 'file-upload-filename',
    name: 'Insecure Filename Handling',
    severity: 'High',
    description: 'Original filename used without sanitization',
    recommendation: 'Sanitize and generate unique filenames for uploaded files',
    patterns: [
      { key: 'filename-original', pattern: 'file\\.originalname|req\\.file\\.originalname' },
      { key: 'filename-user', pattern: 'filename\\s*[:=]\\s*req\\.body\\.filename|filename\\s*[:=]\\s*req\\.params\\.filename' }
    ]
  },
  {
    id: 'file-upload-extension',
    name: 'Missing File Extension Validation',
    severity: 'High',
    description: 'Missing file extension validation',
    recommendation: 'Validate and whitelist allowed file extensions',
    patterns: [
      { key: 'extension-no-check', pattern: 'upload\\s*\\(\\s*file\\s*\\)\\s*\\{[^}]*\\}(?!.*extension|.*ext|.*mimetype)' },
      { key: 'extension-allow-all', pattern: 'allowedExtensions\\s*:\\s*\\[\\s*["\']\\*["\']' }
    ]
  },
  {
    id: 'file-upload-mimetype',
    name: 'Missing MIME Type Validation',
    severity: 'High',
    description: 'Missing MIME type validation',
    recommendation: 'Validate MIME type and ensure it matches file extension',
    patterns: [
      { key: 'mimetype-no-check', pattern: 'upload\\s*\\(\\s*file\\s*\\)\\s*\\{[^}]*\\}(?!.*mimetype|.*content-type|.*filetype)' },
      { key: 'mimetype-spoof', pattern: 'file\\.mimetype\\s*\\+\\s*|file\\.contenttype\\s*\\+\\s*' }
    ]
  },
  {
    id: 'file-upload-virus-scan',
    name: 'Missing Virus Scan',
    severity: 'Medium',
    description: 'Missing virus scan for uploaded files',
    recommendation: 'Implement virus scanning for all uploaded files',
    patterns: [
      { key: 'virus-scan-missing', pattern: 'upload\\s*\\(\\s*file\\s*\\)\\s*\\{[^}]*\\}(?!.*virus|.*scan|.*antivirus|.*clamav)' }
    ]
  },
  {
    id: 'api-insecure-http',
    name: 'Insecure HTTP API Call',
    severity: 'High',
    description: 'API call using insecure HTTP protocol',
    recommendation: 'Use HTTPS for all API calls',
    patterns: [
      { key: 'api-http', pattern: 'fetch\\s*\\(\\s*[\'"]http://[^\'"]*api[^\'"]*[\'"]\\s*\\)' },
      { key: 'api-http-axios', pattern: 'axios\\.(get|post|put|delete|patch)\\s*\\(\\s*[\'"]http://[^\'"]*api[^\'"]*[\'"]\\s*\\)' },
      { key: 'api-http-xhr', pattern: 'XMLHttpRequest\\s*\\(\\s*\\)[^;]*open\\s*\\(\\s*[\'"]GET|POST[\'"]\\s*,\\s*[\'"]http://' }
    ]
  },
  {
    id: 'api-key-exposed',
    name: 'API Key Exposed in Code',
    severity: 'Critical',
    description: 'API key hardcoded in source code',
    recommendation: 'Move API keys to environment variables or secure vault systems',
    patterns: [
      { key: 'api-key-hardcoded', pattern: '(api_key|apikey|api-key)\\s*[:=]\\s*[\'"][^\'"]{20,}[\'"]' },
      { key: 'api-secret-hardcoded', pattern: '(api_secret|apisecret|api-secret)\\s*[:=]\\s*[\'"][^\'"]{20,}[\'"]' },
      { key: 'api-token-hardcoded', pattern: '(api_token|apitoken|api-token)\\s*[:=]\\s*[\'"][^\'"]{20,}[\'"]' }
    ]
  },
  {
    id: 'api-no-authentication',
    name: 'API Call Without Authentication',
    severity: 'High',
    description: 'API call without authentication headers',
    recommendation: 'Implement proper API authentication (Bearer token, API key, etc.)',
    patterns: [
      { key: 'api-no-auth', pattern: 'fetch\\s*\\(\\s*url\\s*,\\s*\\{[^}]*\\}\\s*\\)(?!.*Authorization|.*Bearer|.*api_key|.*apikey)' },
      { key: 'api-no-auth-axios', pattern: 'axios\\.(get|post|put|delete|patch)\\s*\\(\\s*url\\s*\\)(?!.*headers|.*auth|.*token)' }
    ]
  },
  {
    id: 'api-insecure-ssl',
    name: 'Insecure SSL/TLS Configuration',
    severity: 'High',
    description: 'Insecure SSL/TLS configuration for API calls',
    recommendation: 'Use secure SSL/TLS configuration with proper certificate validation',
    patterns: [
      { key: 'ssl-disabled', pattern: 'rejectUnauthorized\\s*:\\s*false' },
      { key: 'ssl-verify-disabled', pattern: 'verify\\s*:\\s*false|checkServerIdentity\\s*:\\s*\\(\\s*\\)\\s*=>\\s*undefined' },
      { key: 'ssl-weak-cipher', pattern: 'ciphers\\s*:\\s*[\'"][^\'"]*[\'"]' }
    ]
  },
  {
    id: 'api-rate-limiting',
    name: 'Missing Rate Limiting',
    severity: 'Medium',
    description: 'API endpoint missing rate limiting',
    recommendation: 'Implement rate limiting to prevent abuse and DoS attacks',
    patterns: [
      { key: 'rate-limit-missing', pattern: 'app\\.(get|post|put|delete|patch)\\s*\\(\\s*[\'"]\\/api[\'"]' },
      { key: 'rate-limit-weak', pattern: 'rateLimit\\s*\\(\\s*\\{[^}]*windowMs\\s*:\\s*\\d{4,}' }
    ]
  },
  {
    id: 'api-input-validation',
    name: 'Missing API Input Validation',
    severity: 'High',
    description: 'API endpoint missing input validation',
    recommendation: 'Validate and sanitize all API inputs',
    patterns: [
      { key: 'input-validation-missing', pattern: 'router\\.(get|post|put|delete|patch)\\s*\\(\\s*[\'"][^\'"]*[\'"]\\s*,\\s*\\(\\s*req,\\s*res\\s*\\)\\s*=>\\s*\\{[^}]*req\\.(body|params|query)\\s*\\+\\s*' },
      { key: 'input-sanitization-missing', pattern: 'req\\.(body|params|query)\\.(?!.*sanitize|.*validate|.*escape|.*trim)' }
    ]
  },
  {
    id: 'api-error-handling',
    name: 'Insecure Error Handling',
    severity: 'Medium',
    description: 'API error handling may expose sensitive information',
    recommendation: 'Implement secure error handling without exposing sensitive information',
    patterns: [
      { key: 'error-expose', pattern: 'console\\.(log|error)\\s*\\(\\s*error\\s*\\)|res\\.status\\s*\\(\\s*500\\s*\\)\\.json\\s*\\(\\s*\\{[^}]*error\\s*:\\s*[^}]*\\}\\s*\\)' },
      { key: 'error-stack', pattern: 'error\\.stack|error\\.message\\s*\\+\\s*' }
    ]
  },
  {
    id: 'api-cors-misconfig',
    name: 'Insecure CORS Configuration',
    severity: 'High',
    description: 'Insecure CORS configuration allowing unrestricted access',
    recommendation: 'Restrict CORS to specific trusted origins',
    patterns: [
      { key: 'cors-wildcard', pattern: 'origin\\s*:\\s*[\'"]\\*[\'"]|Access-Control-Allow-Origin\\s*:\\s*[\'"]\\*[\'"]' },
      { key: 'cors-credentials', pattern: 'credentials\\s*:\\s*true.*origin\\s*:\\s*[\'"]\\*[\'"]' },
      { key: 'cors-methods-all', pattern: 'methods\\s*:\\s*[\'"]\\*[\'"]' }
    ]
  },
  {
    id: 'api-versioning',
    name: 'Missing API Versioning',
    severity: 'Low',
    description: 'API missing versioning strategy',
    recommendation: 'Implement API versioning for backward compatibility',
    patterns: [
      { key: 'version-missing', pattern: 'app\\.(get|post|put|delete|patch)\\s*\\(\\s*[\'"]\\/api\\/(?!v\\d)' }
    ]
  },
  {
    id: 'api-pagination',
    name: 'Missing Pagination',
    severity: 'Medium',
    description: 'API endpoint missing pagination',
    recommendation: 'Implement pagination to prevent large data transfers',
    patterns: [
      { key: 'pagination-missing', pattern: 'router\\.(get|post)\\s*\\(\\s*[\'"][^\'"]*list[^\'"]*[\'"]' },
      { key: 'pagination-weak', pattern: 'limit\\s*:\\s*\\d{4,}|skip\\s*:\\s*\\d{4,}' }
    ]
  },
  {
    id: 'api-graphql-injection',
    name: 'GraphQL Injection Vulnerability',
    severity: 'High',
    description: 'Potential GraphQL injection vulnerability',
    recommendation: 'Validate and sanitize GraphQL queries',
    patterns: [
      { key: 'graphql-user-input', pattern: 'graphql\\s*\\(\\s*\\{[^}]*query\\s*:\\s*[^}]*\\+\\s*' },
      { key: 'graphql-operation', pattern: 'operationName\\s*:\\s*[^}]*\\+\\s*' }
    ]
  },
  {
    id: 'api-webhook-security',
    name: 'Insecure Webhook Implementation',
    severity: 'High',
    description: 'Webhook endpoint missing security validation',
    recommendation: 'Implement webhook signature verification and authentication',
    patterns: [
      { key: 'webhook-no-auth', pattern: 'router\\.(post)\\s*\\(\\s*[\'"][^\'"]*webhook[^\'"]*[\'"]' },
      { key: 'webhook-no-verify', pattern: 'webhook\\s*\\(\\s*\\{[^}]*\\}\\s*\\)(?!.*signature|.*verify|.*auth)' }
    ]
  },
  {
    id: 'api-cache-control',
    name: 'Missing Cache Control Headers',
    severity: 'Low',
    description: 'API missing cache control headers',
    recommendation: 'Implement appropriate cache control headers',
    patterns: [
      { key: 'cache-missing', pattern: 'res\\.(json|send)\\s*\\(\\s*\\{[^}]*\\}\\s*\\)(?!.*Cache-Control|.*cache)' }
    ]
  },
  {
    id: 'api-idempotency',
    name: 'Missing Idempotency Key',
    severity: 'Medium',
    description: 'API endpoint missing idempotency key',
    recommendation: 'Implement idempotency keys for POST/PUT operations',
    patterns: [
      { key: 'idempotency-missing', pattern: 'router\\.(post|put|patch)\\s*\\(\\s*[\'"][^\'"]*[\'"]' },
      { key: 'idempotency-no-check', pattern: '(?!.*idempotency|.*idempotency-key).*router\\.(post|put|patch)' }
    ]
  },
  ...customRules
];
module.exports = securityRules;