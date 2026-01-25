// DOM Clobbering 漏洞示例文件

// 示例 1: 使用冲突的 DOM 元素 ID
export function domClobberingExample1() {
  const element = document.getElementById('name');
  console.log(element);
}

// 示例 2: 使用冲突的 DOM 元素 ID (location)
export function domClobberingExample2() {
  const element = document.getElementById('location');
  console.log(element);
}

// 示例 3: 使用冲突的 DOM 元素 ID (window)
export function domClobberingExample3() {
  const element = document.getElementById('window');
  console.log(element);
}

// 示例 4: 使用冲突的 DOM 元素 ID (document)
export function domClobberingExample4() {
  const element = document.getElementById('document');
  console.log(element);
}

// 示例 5: 使用冲突的 DOM 元素 ID (top)
export function domClobberingExample5() {
  const element = document.getElementById('top');
  console.log(element);
}

// 示例 6: 使用冲突的 DOM 元素 ID (parent)
export function domClobberingExample6() {
  const element = document.getElementById('parent');
  console.log(element);
}

// 示例 7: 使用冲突的 DOM 元素 ID (frames)
export function domClobberingExample7() {
  const element = document.getElementById('frames');
  console.log(element);
}

// 示例 8: 使用冲突的 DOM 元素 ID (self)
export function domClobberingExample8() {
  const element = document.getElementById('self');
  console.log(element);
}

// 示例 9: 使用冲突的 DOM 元素 ID (forms)
export function domClobberingExample9() {
  const element = document.getElementById('forms');
  console.log(element);
}

// 示例 10: 使用冲突的 DOM 元素 ID (anchors)
export function domClobberingExample10() {
  const element = document.getElementById('anchors');
  console.log(element);
}

// 示例 11: 使用冲突的 DOM 元素 ID (links)
export function domClobberingExample11() {
  const element = document.getElementById('links');
  console.log(element);
}

// 示例 12: 使用冲突的 DOM 元素 ID (images)
export function domClobberingExample12() {
  const element = document.getElementById('images');
  console.log(element);
}

// 示例 13: 使用冲突的 DOM 元素 ID (scripts)
export function domClobberingExample13() {
  const element = document.getElementById('scripts');
  console.log(element);
}

// 示例 14: 使用 querySelector 访问 DOM 元素
export function domClobberingExample14() {
  const element = document.querySelector('#name');
  console.log(element);
}

// 示例 15: 使用 getElementById 访问 DOM 元素
export function domClobberingExample15() {
  const element = document.getElementById('name');
  if (element) {
    console.log(element.value);
  }
}

// 示例 16: 使用 getElementsByName 访问 DOM 元素
export function domClobberingExample16() {
  const elements = document.getElementsByName('name');
  console.log(elements);
}

// 示例 17: 使用 getElementsByTagName 访问 DOM 元素
export function domClobberingExample17() {
  const elements = document.getElementsByTagName('input');
  console.log(elements);
}

// 示例 18: 使用 getElementsByClassName 访问 DOM 元素
export function domClobberingExample18() {
  const elements = document.getElementsByClassName('input');
  console.log(elements);
}

// 示例 19: 使用 querySelectorAll 访问 DOM 元素
export function domClobberingExample19() {
  const elements = document.querySelectorAll('.input');
  console.log(elements);
}

// 示例 20: 直接访问 DOM 元素属性
export function domClobberingExample20() {
  const element = document.getElementById('name');
  console.log(element.value);
  console.log(element.name);
  console.log(element.type);
}
