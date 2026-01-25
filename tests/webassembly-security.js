// WebAssembly Security 漏洞示例文件

// 示例 1: 不安全的 WebAssembly 实例化
export function webassemblySecurityExample1() {
  fetch('untrusted.wasm')
    .then(response => response.arrayBuffer())
    .then(bytes => {
      // 危险：直接实例化未验证的 WebAssembly 模块
      return WebAssembly.instantiate(bytes);
    })
    .then(results => {
      results.instance.exports.main();
    });
}

// 示例 2: 从不可信来源加载 WebAssembly
export function webassemblySecurityExample2() {
  const wasmUrl = userProvidedUrl;
  
  // 危险：从用户提供的 URL 加载 WebAssembly
  fetch(wasmUrl)
    .then(response => response.arrayBuffer())
    .then(bytes => WebAssembly.instantiate(bytes))
    .then(results => {
      results.instance.exports.run();
    });
}

// 示例 3: 缺少沙箱隔离
export function webassemblySecurityExample3() {
  const importObject = {
    env: {
      memory: new WebAssembly.Memory({ initial: 256 }),
      log: console.log,
      // 危险：暴露敏感 API 给 WebAssembly
      fetch: window.fetch,
      localStorage: window.localStorage
    }
  };
  
  WebAssembly.instantiateStreaming(fetch('module.wasm'), importObject)
    .then(results => {
      results.instance.exports.execute();
    });
}

// 示例 4: 不安全的流式实例化
export function webassemblySecurityExample4() {
  // 危险：流式实例化未验证的 WebAssembly
  WebAssembly.instantiateStreaming(fetch('untrusted.wasm'))
    .then(results => {
      results.instance.exports.run();
    });
}

// 示例 5: WebAssembly 内存泄漏
export function webassemblySecurityExample5() {
  function loadWasm() {
    WebAssembly.instantiateStreaming(fetch('module.wasm'))
      .then(results => {
        const instance = results.instance;
        instance.exports.run();
      });
  }
  
  // 危险：重复加载 WebAssembly 模块导致内存泄漏
  setInterval(loadWasm, 1000);
}

// 示例 6: WebAssembly 代码注入
export function webassemblySecurityExample6() {
  const wasmCode = userProvidedWasmCode;
  
  // 危险：执行用户提供的 WebAssembly 代码
  const wasmModule = new WebAssembly.Module(wasmCode);
  const instance = new WebAssembly.Instance(wasmModule);
  instance.exports.run();
}

// 示例 7: WebAssembly 权限提升
export function webassemblySecurityExample7() {
  const importObject = {
    env: {
      // 危险：暴露文件系统 API
      fs: require('fs'),
      path: require('path'),
      // 危险：暴露网络 API
      http: require('http'),
      https: require('https')
    }
  };
  
  WebAssembly.instantiateStreaming(fetch('module.wasm'), importObject)
    .then(results => {
      results.instance.exports.run();
    });
}

// 示例 8: WebAssembly DoS 攻击
export function webassemblySecurityExample8() {
  const importObject = {
    env: {
      // 危险：无限制的内存访问
      memory: new WebAssembly.Memory({ initial: 1024, maximum: 1024 })
    }
  };
  
  WebAssembly.instantiateStreaming(fetch('malicious.wasm'), importObject)
    .then(results => {
      results.instance.exports.consumeMemory();
    });
}

// 示例 9: WebAssembly 侧信道攻击
export function webassemblySecurityExample9() {
  const importObject = {
    env: {
      // 危险：暴露高精度计时器
      performance: performance,
      Date: Date
    }
  };
  
  WebAssembly.instantiateStreaming(fetch('module.wasm'), importObject)
    .then(results => {
      results.instance.exports.measure();
    });
}

// 示例 10: WebAssembly 数据泄露
export function webassemblySecurityExample10() {
  const importObject = {
    env: {
      // 危险：暴露敏感数据
      secrets: {
        apiKey: 'sk-1234567890abcdef',
        databaseUrl: 'postgres://user:pass@localhost/db'
      }
    }
  };
  
  WebAssembly.instantiateStreaming(fetch('module.wasm'), importObject)
    .then(results => {
      results.instance.exports.exfiltrate();
    });
}
