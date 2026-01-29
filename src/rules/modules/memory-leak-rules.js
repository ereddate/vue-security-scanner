const memoryLeakRules = [
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
    id: 'memory-leak-global-variable',
    name: 'Global Variable Memory Leak',
    severity: 'Medium',
    description: 'Potential memory leak from global variables',
    recommendation: 'Avoid using global variables. Use proper scoping and cleanup.',
    patterns: [
      { key: 'global-variable', pattern: 'window\\.|global\\.|globalThis\\.' },
      { key: 'var-declaration', pattern: 'var\\s+[a-zA-Z_$][a-zA-Z_$0-9]*\\s*=' }
    ]
  },
  {
    id: 'memory-leak-dom-reference',
    name: 'DOM Reference Memory Leak',
    severity: 'Medium',
    description: 'Potential memory leak from DOM references',
    recommendation: 'Remove DOM references when elements are no longer needed.',
    patterns: [
      { key: 'dom-reference', pattern: 'getElementById|querySelector|querySelectorAll' },
      { key: 'dom-cache', pattern: '[a-zA-Z_$][a-zA-Z_$0-9]*\\s*=\\s*document\\.' }
    ]
  },
  {
    id: 'memory-leak-large-object',
    name: 'Large Object Memory Leak',
    severity: 'Medium',
    description: 'Potential memory leak from large objects',
    recommendation: 'Avoid storing large objects in memory. Use streaming or pagination for large datasets.',
    patterns: [
      { key: 'large-object', pattern: 'Array\\.from|Object\\.assign|JSON\\.parse' },
      { key: 'loop-push', pattern: 'for\\s*\\([^)]*\\)\\s*\\{[^}]*push\\s*\\(' }
    ]
  },
  {
    id: 'memory-leak-closure',
    name: 'Closure Memory Leak',
    severity: 'Medium',
    description: 'Potential memory leak from closures',
    recommendation: 'Avoid creating unnecessary closures. Clean up references in closures when no longer needed.',
    patterns: [
      { key: 'closure', pattern: 'function\\s*\\([^)]*\\)\\s*\\{[^}]*function\\s*\\(' },
      { key: 'arrow-closure', pattern: '=>\\s*\{[^}]*this\\.' }
    ]
  },
  {
    id: 'memory-leak-web-worker',
    name: 'Web Worker Memory Leak',
    severity: 'Medium',
    description: 'Potential memory leak from Web Workers',
    recommendation: 'Terminate Web Workers when no longer needed using worker.terminate().',
    patterns: [
      { key: 'web-worker', pattern: 'new\\s+Worker\\s*\\(' },
      { key: 'worker-message', pattern: 'worker\\.postMessage' }
    ]
  }
];

module.exports = memoryLeakRules;