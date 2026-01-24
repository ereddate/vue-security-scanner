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
  ...customRules
];

module.exports = securityRules;