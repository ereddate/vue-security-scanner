const performanceAndResourceSecurityRules = [
  {
    id: 'memory-leak-security',
    name: 'Memory Leak Security',
    severity: 'Medium',
    description: 'Memory leaks may have security implications',
    recommendation: 'Ensure proper memory management to prevent memory leaks.',
    patterns: [
      { key: 'memory-intensive', pattern: 'setInterval|setTimeout|setImmediate' },
      { key: 'event-listener', pattern: 'addEventListener|removeEventListener' }
    ]
  },
  {
    id: 'resource-exhaustion-security',
    name: 'Resource Exhaustion Security',
    severity: 'Medium',
    description: 'Resource exhaustion may have security implications',
    recommendation: 'Ensure proper resource management to prevent resource exhaustion.',
    patterns: [
      { key: 'resource-intensive', pattern: 'large\s*file|heavy\s*computation|recursion' },
      { key: 'network-request', pattern: 'fetch|axios|XMLHttpRequest' }
    ]
  },
  {
    id: 'resource-loading-security',
    name: 'Resource Loading Security',
    severity: 'Medium',
    description: 'Resource loading may have security vulnerabilities',
    recommendation: 'Ensure resources are loaded securely and efficiently.',
    patterns: [
      { key: 'resource-load', pattern: 'import\(|require\(|loadScript' },
      { key: 'external-resource', pattern: 'https?:\/\/[^"\']+' }
    ]
  },
  {
    id: 'performance-optimization-security',
    name: 'Performance Optimization Security',
    severity: 'Low',
    description: 'Performance optimization may have security implications',
    recommendation: 'Ensure performance optimizations do not compromise security.',
    patterns: [
      { key: 'performance-config', pattern: 'performance|optimization|cache' },
      { key: 'lazy-loading', pattern: 'lazy|loadable|dynamic\\s*import' }
    ]
  },
  {
    id: 'bundle-size-security',
    name: 'Bundle Size Security',
    severity: 'Low',
    description: 'Large bundle sizes may have security implications',
    recommendation: 'Optimize bundle size to improve security and performance.',
    patterns: [
      { key: 'bundle-analyzer', pattern: 'webpack-bundle-analyzer|bundle\\s*size' },
      { key: 'large-dependency', pattern: 'lodash|moment|jquery' }
    ]
  },
  {
    id: 'code-splitting-security',
    name: 'Code Splitting Security',
    severity: 'Low',
    description: 'Code splitting may have security implications',
    recommendation: 'Ensure code splitting is properly implemented.',
    patterns: [
      { key: 'code-splitting', pattern: 'splitChunks|dynamic\\s*import|loadable' },
      { key: 'route-splitting', pattern: 'Route\\s*component|lazy\\s*\(' }
    ]
  },
  {
    id: 'asset-optimization-security',
    name: 'Asset Optimization Security',
    severity: 'Low',
    description: 'Asset optimization may have security implications',
    recommendation: 'Ensure assets are optimized securely.',
    patterns: [
      { key: 'asset-optimization', pattern: 'image\\s*optimization|minify|compress' },
      { key: 'asset-loader', pattern: 'file-loader|url-loader|asset-loader' }
    ]
  },
  {
    id: 'network-performance-security',
    name: 'Network Performance Security',
    severity: 'Medium',
    description: 'Network performance may have security implications',
    recommendation: 'Ensure network requests are optimized securely.',
    patterns: [
      { key: 'network-optimization', pattern: 'defer|async|preload|prefetch' },
      { key: 'http2', pattern: 'http2|https' }
    ]
  },
  {
    id: 'caching-security',
    name: 'Caching Security',
    severity: 'Medium',
    description: 'Caching may have security implications',
    recommendation: 'Ensure caching is implemented securely.',
    patterns: [
      { key: 'cache-config', pattern: 'cache|localStorage|sessionStorage' },
      { key: 'cache-control', pattern: 'Cache-Control|Expires' }
    ]
  },
  {
    id: 'service-worker-performance-security',
    name: 'Service Worker Performance Security',
    severity: 'Medium',
    description: 'Service worker performance may have security implications',
    recommendation: 'Ensure service workers are optimized securely.',
    patterns: [
      { key: 'service-worker', pattern: 'serviceWorker|sw\\.js' },
      { key: 'cache-api', pattern: 'caches\\.open|cache\\.add' }
    ]
  }
];

module.exports = performanceAndResourceSecurityRules;