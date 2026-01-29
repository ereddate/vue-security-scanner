const webassemblySecurityRules = [
  {
    id: 'wasm-memory-security',
    name: 'WebAssembly Memory Security',
    severity: 'High',
    description: 'Potential WebAssembly memory security issue',
    recommendation: 'Implement proper memory bounds checking in WebAssembly code. Avoid unsafe memory operations. Use memory-safe languages for WebAssembly compilation.',
    patterns: [
      { key: 'wasm', pattern: 'WebAssembly|wasm|WASM' },
      { key: 'memory', pattern: 'memory|allocate|deallocate|free|malloc|buffer' }
    ]
  },
  {
    id: 'wasm-code-injection',
    name: 'WebAssembly Code Injection',
    severity: 'Critical',
    description: 'Potential WebAssembly code injection vulnerability',
    recommendation: 'Validate and sanitize all input to WebAssembly modules. Avoid dynamic code generation. Use proper isolation for WebAssembly modules.',
    patterns: [
      { key: 'wasm', pattern: 'WebAssembly|wasm|WASM' },
      { key: 'injection', pattern: 'compile|instantiate|module|import|export|dynamic' }
    ]
  },
  {
    id: 'wasm-permissions',
    name: 'WebAssembly Permissions',
    severity: 'Medium',
    description: 'Potential WebAssembly permissions issue',
    recommendation: 'Limit WebAssembly module permissions. Use proper origin isolation. Implement sandboxing for WebAssembly modules.',
    patterns: [
      { key: 'wasm', pattern: 'WebAssembly|wasm|WASM' },
      { key: 'permissions', pattern: 'permission|permissions|import|export|sandbox' }
    ]
  },
  {
    id: 'wasm-performance-security',
    name: 'WebAssembly Performance Security',
    severity: 'Medium',
    description: 'Potential WebAssembly performance security issue',
    recommendation: 'Implement resource limits for WebAssembly modules. Monitor WebAssembly execution time. Use proper throttling for WebAssembly operations.',
    patterns: [
      { key: 'wasm', pattern: 'WebAssembly|wasm|WASM' },
      { key: 'performance', pattern: 'performance|optimize|speed|execution|resource' }
    ]
  },
  {
    id: 'wasm-validation',
    name: 'WebAssembly Validation',
    severity: 'High',
    description: 'Missing or inadequate WebAssembly validation',
    recommendation: 'Validate all WebAssembly modules before instantiation. Use proper module signing. Implement integrity checks for WebAssembly code.',
    patterns: [
      { key: 'wasm', pattern: 'WebAssembly|wasm|WASM' },
      { key: 'validation', pattern: 'validate|validation|check|verify|integrity' }
    ]
  },
  {
    id: 'wasm-communication-security',
    name: 'WebAssembly Communication Security',
    severity: 'Medium',
    description: 'Potential WebAssembly communication security issue',
    recommendation: 'Secure communication between WebAssembly and JavaScript. Validate all data passed between WebAssembly and JavaScript. Use structured cloning for complex data.',
    patterns: [
      { key: 'wasm', pattern: 'WebAssembly|wasm|WASM' },
      { key: 'communication', pattern: 'import|export|memory|table|global|message' }
    ]
  },
  {
    id: 'wasm-sandboxing',
    name: 'WebAssembly Sandboxing',
    severity: 'Medium',
    description: 'Missing or inadequate WebAssembly sandboxing',
    recommendation: 'Implement proper sandboxing for WebAssembly modules. Use Content Security Policy (CSP) with WebAssembly. Limit WebAssembly module capabilities.',
    patterns: [
      { key: 'wasm', pattern: 'WebAssembly|wasm|WASM' },
      { key: 'sandbox', pattern: 'sandbox|isolation|CSP|Content Security Policy' }
    ]
  },
  {
    id: 'wasm-debugging-security',
    name: 'WebAssembly Debugging Security',
    severity: 'Low',
    description: 'Potential WebAssembly debugging security issue',
    recommendation: 'Remove debug information from production WebAssembly builds. Disable debugging features in production. Use proper build configurations.',
    patterns: [
      { key: 'wasm', pattern: 'WebAssembly|wasm|WASM' },
      { key: 'debug', pattern: 'debug|debugging|source map|symbol' }
    ]
  },
  {
    id: 'wasm-dependency-security',
    name: 'WebAssembly Dependency Security',
    severity: 'Medium',
    description: 'Potential WebAssembly dependency security issue',
    recommendation: 'Scan WebAssembly dependencies for security vulnerabilities. Use trusted WebAssembly libraries. Keep WebAssembly toolchains updated.',
    patterns: [
      { key: 'wasm', pattern: 'WebAssembly|wasm|WASM' },
      { key: 'dependency', pattern: 'dependency|library|toolchain|compile|link' }
    ]
  },
  {
    id: 'wasm-integrity',
    name: 'WebAssembly Integrity',
    severity: 'Medium',
    description: 'Potential WebAssembly integrity issue',
    recommendation: 'Implement WebAssembly module integrity checks. Use subresource integrity (SRI) for WebAssembly files. Validate module hashes before instantiation.',
    patterns: [
      { key: 'wasm', pattern: 'WebAssembly|wasm|WASM' },
      { key: 'integrity', pattern: 'integrity|hash|signature|verify|validate' }
    ]
  }
];

module.exports = webassemblySecurityRules;