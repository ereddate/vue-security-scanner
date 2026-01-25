// SVG XSS 漏洞示例文件

// 示例 1: 包含危险事件处理器的 SVG
export function svgXssExample1() {
  // 危险：SVG 包含 onmouseover 事件处理器
  return `
    <svg xmlns="http://www.w3.org/2000/svg" 
         xmlns:xlink="http://www.w3.org/1999/xlink">
      <circle cx="50" cy="50" r="40" stroke="black" stroke-width="3"
              onmouseover="alert('XSS')" />
    </svg>
  `;
}

// 示例 2: 使用 script 标签的 SVG
export function svgXssExample2() {
  // 危险：SVG 包含 script 标签
  return `
    <svg xmlns="http://www.w3.org/2000/svg">
      <script>alert('XSS')</script>
      <rect width="100" height="100" fill="red"/>
    </svg>
  `;
}

// 示例 3: 包含危险 xlink:href 的 SVG
export function svgXssExample3() {
  // 危险：使用 javascript: 协议的 xlink:href
  return `
    <svg xmlns="http://www.w3.org/2000/svg"
         xmlns:xlink="http://www.w3.org/1999/xlink">
      <rect width="100" height="100" fill="blue"/>
      <a xlink:href="javascript:alert('XSS')">
        <text x="10" y="50">Click me</text>
      </a>
    </svg>
  `;
}

// 示例 4: 包含危险 onload 事件的 SVG
export function svgXssExample4() {
  // 危险：SVG 包含 onload 事件处理器
  return `
    <svg xmlns="http://www.w3.org/2000/svg" onload="alert('XSS')">
      <rect width="100" height="100" fill="green"/>
    </svg>
  `;
}

// 示例 5: 使用 data URI 的危险 SVG
export function svgXssExample5() {
  // 危险：使用 javascript: 协议的 href
  return `
    <svg xmlns="http://www.w3.org/2000/svg"
         xmlns:xlink="http://www.w3.org/1999/xlink">
      <rect width="100" height="100" fill="yellow"/>
      <image href="javascript:alert('XSS')" />
    </svg>
  `;
}

// 示例 6: 包含 onfocus 事件的 SVG
export function svgXssExample6() {
  // 危险：SVG 元素包含 onfocus 事件处理器
  return `
    <svg xmlns="http://www.w3.org/2000/svg">
      <rect width="100" height="100" fill="purple"
            onfocus="alert('XSS')" tabindex="0"/>
    </svg>
  `;
}

// 示例 7: 使用 foreignObject 的 SVG XSS
export function svgXssExample7() {
  // 危险：foreignObject 可能包含恶意内容
  return `
    <svg xmlns="http://www.w3.org/2000/svg">
      <foreignObject>
        <div onclick="alert('XSS')">Dangerous content</div>
      </foreignObject>
      <rect width="100" height="100" fill="orange"/>
    </svg>
  `;
}

// 示例 8: 包含 onmouseenter 事件的 SVG
export function svgXssExample8() {
  // 危险：SVG 包含鼠标进入事件处理器
  return `
    <svg xmlns="http://www.w3.org/2000/svg">
      <circle cx="50" cy="50" r="40" fill="pink"
              onmouseenter="document.location='javascript:alert(XSS)'"/>
    </svg>
  `;
}

// 示例 9: 使用 contentScriptType 的 SVG
export function svgXssExample9() {
  // 危险：SVG 定义了内容脚本类型
  return `
    <svg xmlns="http://www.w3.org/2000/svg"
         contentScriptType="text/ecmascript">
      <rect width="100" height="100" fill="cyan"
            onclick="alert('XSS')"/>
    </svg>
  `;
}

// 示例 10: 包含 onbegin 事件的 SVG 动画
export function svgXssExample10() {
  // 危险：SVG 动画包含事件处理器
  return `
    <svg xmlns="http://www.w3.org/2000/svg">
      <rect width="100" height="100" fill="magenta">
        <animate attributeName="x" begin="onload" onbegin="alert('XSS')"
                 from="0" to="100" dur="10s"/>
      </rect>
    </svg>
  `;
}

// 示例 11: 使用 mousedown 事件的 SVG
export function svgXssExample11() {
  // 危险：SVG 包含鼠标按下事件处理器
  return `
    <svg xmlns="http://www.w3.org/2000/svg">
      <path d="M10,10 L90,90 M90,10 L10,90" stroke="black" stroke-width="5"
            onmousedown="alert('XSS')"/>
    </svg>
  `;
}

// 示例 12: 包含 onerror 事件的 SVG
export function svgXssExample12() {
  // 危险：SVG 图像包含错误处理事件
  return `
    <svg xmlns="http://www.w3.org/2000/svg">
      <image href="/nonexistent.png" onerror="alert('XSS')" />
      <rect width="100" height="100" fill="lightblue"/>
    </svg>
  `;
}

// 示例 13: 使用 onclick 事件的 SVG 组
export function svgXssExample13() {
  // 危险：SVG 组包含点击事件处理器
  return `
    <svg xmlns="http://www.w3.org/2000/svg">
      <g onclick="alert('XSS')">
        <rect x="10" y="10" width="50" height="50" fill="red"/>
        <rect x="60" y="10" width="50" height="50" fill="blue"/>
      </g>
    </svg>
  `;
}

// 示例 14: 包含 onend 事件的 SVG 动画
export function svgXssExample14() {
  // 危险：SVG 动画结束事件处理器
  return `
    <svg xmlns="http://www.w3.org/2000/svg">
      <rect width="100" height="100" fill="gray">
        <animate attributeName="width" from="100" to="200" dur="2s" fill="freeze"
                 onend="alert('XSS')"/>
      </rect>
    </svg>
  `;
}

// 示例 15: 使用 onrepeat 事件的 SVG 动画
export function svgXssExample15() {
  // 危险：SVG 动画重复事件处理器
  return `
    <svg xmlns="http://www.w3.org/2000/svg">
      <rect width="100" height="100" fill="brown">
        <animate attributeName="opacity" values="1;0;1" dur="2s" repeatCount="5"
                 onrepeat="alert('XSS')"/>
      </rect>
    </svg>
  `;
}

// 示例 16: 包含 onunload 事件的 SVG
export function svgXssExample16() {
  // 危险：SVG 包含卸载事件处理器
  return `
    <svg xmlns="http://www.w3.org/2000/svg" onunload="alert('XSS')">
      <rect width="100" height="100" fill="teal"/>
    </svg>
  `;
}

// 示例 17: 使用 mouseleave 事件的 SVG
export function svgXssExample17() {
  // 危险：SVG 包含鼠标离开事件处理器
  return `
    <svg xmlns="http://www.w3.org/2000/svg">
      <ellipse cx="50" cy="50" rx="40" ry="20" fill="lavender"
               onmouseleave="alert('XSS')"/>
    </svg>
  `;
}

// 示例 18: 包含 onactivate 事件的 SVG
export function svgXssExample18() {
  // 危险：SVG 包含激活事件处理器
  return `
    <svg xmlns="http://www.w3.org/2000/svg">
      <polygon points="50,5 95,95 5,95" fill="gold"
               onactivate="alert('XSS')" tabindex="0"/>
    </svg>
  `;
}

// 示例 19: 使用 DOMFocusIn 事件的 SVG
export function svgXssExample19() {
  // 危险：SVG 包含焦点进入事件处理器
  return `
    <svg xmlns="http://www.w3.org/2000/svg">
      <rect width="100" height="100" fill="coral"
            onfocusin="alert('XSS')" tabindex="0"/>
    </svg>
  `;
}

// 示例 20: 包含 DOMFocusOut 事件的 SVG
export function svgXssExample20() {
  // 危险：SVG 包含焦点离开事件处理器
  return `
    <svg xmlns="http://www.w3.org/2000/svg">
      <line x1="10" y1="10" x2="90" y2="90" stroke="black" stroke-width="2"
            onfocusout="alert('XSS')" tabindex="0"/>
    </svg>
  `;
}
