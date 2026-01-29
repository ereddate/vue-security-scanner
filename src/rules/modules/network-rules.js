const networkRules = [
  {
    id: 'websocket-security',
    name: 'WebSocket Security',
    severity: 'Medium',
    description: 'Potential WebSocket security issue',
    recommendation: 'Validate WebSocket origin and implement proper authentication.',
    patterns: [
      { key: 'websocket-connect', pattern: 'new\\s+WebSocket\\s*\\(' },
      { key: 'socket-io', pattern: 'socket\\.io\\s*\\(|io\\s*\\(' },
      { key: 'websocket-protocol', pattern: 'protocol\\s*[:=]\\s*\\[' },
      { key: 'websocket-origin', pattern: 'origin\\s*[:=]\\s*["\'][^"\']*["\']' }
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
    id: 'network-timeout',
    name: 'Missing Network Timeout',
    severity: 'Low',
    description: 'Potential missing network timeout',
    recommendation: 'Set appropriate timeouts for network requests to prevent hanging connections.',
    patterns: [
      { key: 'fetch-no-timeout', pattern: 'fetch\\s*\\(\\s*["\'][^"\']*["\']\\s*\\)' },
      { key: 'axios-no-timeout', pattern: 'axios\\.(get|post|put|delete)\\s*\\(\\s*["\'][^"\']*["\']\\s*\\)' }
    ]
  },
  {
    id: 'network-retry',
    name: 'Missing Network Retry',
    severity: 'Low',
    description: 'Potential missing network retry mechanism',
    recommendation: 'Implement retry logic for transient network failures to improve reliability.',
    patterns: [
      { key: 'fetch-no-retry', pattern: 'fetch\\s*\\(' },
      { key: 'axios-no-retry', pattern: 'axios\\.' }
    ]
  },
  {
    id: 'network-cors',
    name: 'CORS Configuration Issue',
    severity: 'Medium',
    description: 'Potential CORS configuration issue',
    recommendation: 'Configure CORS properly. Avoid using wildcard origins in production.',
    patterns: [
      { key: 'cors-wildcard', pattern: 'Access-Control-Allow-Origin\\s*:\\s*["\']\\*["\']' },
      { key: 'cors-any', pattern: 'origin\\s*=\\s*["\']\\*["\']' }
    ]
  },
  {
    id: 'network-headers',
    name: 'Missing Network Headers',
    severity: 'Low',
    description: 'Potential missing network headers',
    recommendation: 'Add appropriate headers to network requests, such as Content-Type and Accept.',
    patterns: [
      { key: 'fetch-no-headers', pattern: 'fetch\\s*\\(\\s*["\'][^"\']*["\']\\s*,\\s*\\{[^}]*\\}' },
      { key: 'axios-no-headers', pattern: 'axios\\.(get|post|put|delete)\\s*\\(\\s*["\'][^"\']*["\']\\s*,\\s*[^,]*\\)' }
    ]
  },
  {
    id: 'network-error-handling',
    name: 'Missing Network Error Handling',
    severity: 'Low',
    description: 'Potential missing network error handling',
    recommendation: 'Implement proper error handling for network requests to improve user experience.',
    patterns: [
      { key: 'fetch-no-catch', pattern: 'fetch\\s*\\([^)]*\\)\\s*\\.then\\s*\\(' },
      { key: 'axios-no-catch', pattern: 'axios\\.(get|post|put|delete)\\s*\\([^)]*\\)\\s*\\.then\\s*\\(' }
    ]
  },
  {
    id: 'http2-security',
    name: 'HTTP/2 Security',
    severity: 'Medium',
    description: 'Potential HTTP/2 security issue',
    recommendation: 'Implement proper HTTP/2 security configurations. Monitor for HTTP/2 specific attacks.',
    patterns: [
      { key: 'http2-server', pattern: 'http2\\.createServer|createSecureServer' },
      { key: 'http2-connect', pattern: 'http2\\.connect|client\\.request' }
    ]
  },
  {
    id: 'http3-security',
    name: 'HTTP/3 Security',
    severity: 'Medium',
    description: 'Potential HTTP/3 security issue',
    recommendation: 'Implement proper HTTP/3 security configurations. Monitor for HTTP/3 specific attacks.',
    patterns: [
      { key: 'http3-server', pattern: 'http3\\.createServer|quic\\.createSocket' },
      { key: 'http3-connect', pattern: 'http3\\.connect|client\\.connect' }
    ]
  },
  {
    id: 'websocket-compression',
    name: 'WebSocket Compression',
    severity: 'Low',
    description: 'Potential WebSocket compression security issue',
    recommendation: 'Implement proper WebSocket compression settings. Monitor for compression attacks.',
    patterns: [
      { key: 'websocket-compress', pattern: 'permessage-deflate|compression\\s*[:=]' },
      { key: 'ws-options', pattern: 'new\\s+WebSocket\\s*\\(\\s*["\'][^"\']*["\']\\s*,\\s*\\{' }
    ]
  },
  {
    id: 'websocket-auth',
    name: 'WebSocket Authentication',
    severity: 'High',
    description: 'Potential WebSocket authentication issue',
    recommendation: 'Implement proper WebSocket authentication. Validate connections before processing messages.',
    patterns: [
      { key: 'websocket-message', pattern: 'onmessage\\s*=|addEventListener\\s*\\(\\s*["\']message["\']' },
      { key: 'websocket-open', pattern: 'onopen\\s*=|addEventListener\\s*\\(\\s*["\']open["\']' }
    ]
  },
  {
    id: 'network-proxy-security',
    name: 'Network Proxy Security',
    severity: 'Medium',
    description: 'Potential network proxy security issue',
    recommendation: 'Configure proxies securely. Avoid using untrusted proxies.',
    patterns: [
      { key: 'proxy-config', pattern: 'proxy\\s*[:=]\\s*["\'][^"\']*["\']' },
      { key: 'http-proxy', pattern: 'http-proxy|createProxyServer' }
    ]
  },
  {
    id: 'network-dns-security',
    name: 'Network DNS Security',
    severity: 'Medium',
    description: 'Potential network DNS security issue',
    recommendation: 'Use secure DNS servers. Implement DNSSEC where possible.',
    patterns: [
      { key: 'dns-lookup', pattern: 'dns\\.lookup|resolve\\s*\\(' },
      { key: 'dns-server', pattern: 'nameserver|dns\\.servers' }
    ]
  },
  {
    id: 'network-rate-limiting',
    name: 'Network Rate Limiting',
    severity: 'Low',
    description: 'Potential missing network rate limiting',
    recommendation: 'Implement rate limiting for network requests to prevent DoS attacks.',
    patterns: [
      { key: 'rate-limit', pattern: 'rate\\s*limit|limiter|throttle' },
      { key: 'request-count', pattern: 'count\\s*=|requests\\s*=|hits\\s*=' }
    ]
  }
];

module.exports = networkRules;