// 内存泄漏漏洞示例文件

// 示例 1: 未清理的事件监听器
export function addEventListenerWithoutCleanup(element) {
  element.addEventListener('click', function() {
    console.log('Clicked!');
  });
}

// 示例 2: 未清理的定时器
export function startTimerWithoutCleanup() {
  setInterval(function() {
    console.log('Timer tick');
  }, 1000);
}

// 示例 3: 未清理的interval
export function startIntervalWithoutCleanup() {
  setInterval(function() {
    console.log('Interval tick');
  }, 1000);
}

// 示例 4: 未清理的requestAnimationFrame
export function startAnimationWithoutCleanup() {
  function animate() {
    requestAnimationFrame(animate);
  }
  animate();
}

// 示例 5: 未清理的Promise
export function createPromiseWithoutCleanup() {
  const promises = [];
  for (let i = 0; i < 1000; i++) {
    promises.push(new Promise(resolve => {
      setTimeout(resolve, 1000);
    }));
  }
  return promises;
}

// 示例 6: 未清理的闭包
export function createClosureWithoutCleanup() {
  const largeArray = new Array(1000000).fill('data');
  return function() {
    return largeArray;
  };
}

// 示例 7: 未清理的DOM引用
export function keepDOMReference() {
  const elements = [];
  for (let i = 0; i < 1000; i++) {
    const div = document.createElement('div');
    elements.push(div);
  }
  return elements;
}

// 示例 8: 未清理的观察者
export function addObserverWithoutCleanup(target) {
  const observer = new MutationObserver(function(mutations) {
    console.log('Mutation observed');
  });
  observer.observe(target, { childList: true });
}

// 示例 9: 未清理的WebSocket
export function createWebSocketWithoutCleanup() {
  const websockets = [];
  for (let i = 0; i < 10; i++) {
    const ws = new WebSocket('ws://localhost:8080');
    websockets.push(ws);
  }
  return websockets;
}

// 示例 10: Vue组件中的内存泄漏
export default {
  name: 'MemoryLeakComponent',
  data() {
    return {
      timer: null,
      interval: null,
      eventHandler: null,
      observer: null
    };
  },
  
  mounted() {
    this.timer = setTimeout(() => {
      console.log('Timer');
    }, 1000);
    
    this.interval = setInterval(() => {
      console.log('Interval');
    }, 1000);
    
    this.eventHandler = () => {
      console.log('Event');
    };
    window.addEventListener('resize', this.eventHandler);
    
    this.observer = new MutationObserver(() => {
      console.log('Mutation');
    });
    this.observer.observe(this.$el, { childList: true });
  },
  
  beforeUnmount() {
    // 忘记清理定时器、事件监听器和观察者
  }
};

// 示例 11: 未清理的Map
export function createMapWithoutCleanup() {
  const map = new Map();
  for (let i = 0; i < 100000; i++) {
    map.set(i, new Array(1000).fill('data'));
  }
  return map;
}

// 示例 12: 未清理的Set
export function createSetWithoutCleanup() {
  const set = new Set();
  for (let i = 0; i < 100000; i++) {
    set.add(new Array(1000).fill('data'));
  }
  return set;
}

// 示例 13: 未清理的WeakMap误用
export function misuseWeakMap() {
  const weakMap = new WeakMap();
  const keys = [];
  for (let i = 0; i < 100000; i++) {
    const key = { id: i };
    keys.push(key);
    weakMap.set(key, new Array(1000).fill('data'));
  }
  return { weakMap, keys };
}

// 示例 14: 未清理的WeakSet误用
export function misuseWeakSet() {
  const weakSet = new WeakSet();
  const items = [];
  for (let i = 0; i < 100000; i++) {
    const item = { id: i };
    items.push(item);
    weakSet.add(item);
  }
  return { weakSet, items };
}

// 示例 15: 未清理的异步操作
export function createAsyncOperationsWithoutCleanup() {
  const operations = [];
  for (let i = 0; i < 1000; i++) {
    operations.push(
      fetch('/api/data').then(response => response.json())
    );
  }
  return operations;
}

// 示例 16: 未清理的订阅
export function createSubscriptionWithoutCleanup(observable) {
  const subscriptions = [];
  for (let i = 0; i < 100; i++) {
    const subscription = observable.subscribe(data => {
      console.log(data);
    });
    subscriptions.push(subscription);
  }
  return subscriptions;
}

// 示例 17: 未清理的Worker
export function createWorkerWithoutCleanup() {
  const workers = [];
  for (let i = 0; i < 10; i++) {
    const worker = new Worker('worker.js');
    workers.push(worker);
  }
  return workers;
}

// 示例 18: 未清理的IndexedDB
export function openIndexedDBWithoutCleanup() {
  const databases = [];
  for (let i = 0; i < 10; i++) {
    const request = indexedDB.open(`database_${i}`, 1);
    databases.push(request);
  }
  return databases;
}

// 示例 19: 未清理的Canvas
export function createCanvasWithoutCleanup() {
  const canvases = [];
  for (let i = 0; i < 100; i++) {
    const canvas = document.createElement('canvas');
    canvas.width = 1000;
    canvas.height = 1000;
    const ctx = canvas.getContext('2d');
    ctx.fillRect(0, 0, 1000, 1000);
    canvases.push(canvas);
  }
  return canvases;
}

// 示例 20: 未清理的Image
export function createImageWithoutCleanup() {
  const images = [];
  for (let i = 0; i < 1000; i++) {
    const img = new Image();
    img.src = `https://example.com/image${i}.jpg`;
    images.push(img);
  }
  return images;
}
