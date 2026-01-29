const domSecurityRules = [
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
    id: 'dom-xss-event-handler',
    name: 'DOM-based XSS (Event Handler)',
    severity: 'High',
    description: 'Potential DOM-based XSS via event handlers',
    recommendation: 'Avoid assigning user-controllable values to event handlers. Use addEventListener instead of inline handlers.',
    patterns: [
      { key: 'event-handler-assign', pattern: 'onclick\\s*=\\s*["\'].*["\']|onload\\s*=\\s*["\'].*["\']|onerror\\s*=\\s*["\'].*["\']' },
      { key: 'dynamic-event', pattern: 'element\\.onclick\\s*=|element\\.onload\\s*=' }
    ]
  },
  {
    id: 'dom-xss-iframe',
    name: 'DOM-based XSS (Iframe)',
    severity: 'High',
    description: 'Potential DOM-based XSS via iframe',
    recommendation: 'Avoid using user-controllable values in iframe src attributes. Use sandbox attribute.',
    patterns: [
      { key: 'iframe-src', pattern: '<iframe\\s+src\\s*=\\s*["\'].*["\']' },
      { key: 'iframe-dynamic', pattern: 'iframe\\.src\\s*=' }
    ]
  },
  {
    id: 'dom-xss-location-hash',
    name: 'DOM-based XSS (Location Hash)',
    severity: 'High',
    description: 'Potential DOM-based XSS via location hash',
    recommendation: 'Avoid using location.hash directly without sanitization.',
    patterns: [
      { key: 'location-hash', pattern: 'location\\.hash' }
    ]
  },
  {
    id: 'dom-xss-document-domain',
    name: 'DOM-based XSS (Document Domain)',
    severity: 'High',
    description: 'Potential DOM-based XSS via document.domain',
    recommendation: 'Avoid setting document.domain unless absolutely necessary. Use postMessage for cross-domain communication.',
    patterns: [
      { key: 'document-domain', pattern: 'document\\.domain\\s*=' }
    ]
  }
];

module.exports = domSecurityRules;