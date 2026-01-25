// CSS Injection 漏洞示例文件

// 示例 1: 直接将用户输入插入 CSS 样式
export function cssInjectionExample1(color) {
  // 危险：用户输入直接用于 CSS 属性
  return `
    <style>
      .my-element {
        color: ${color};
      }
    </style>
  `;
}

// 示例 2: 使用模板字符串构建 CSS
export function cssInjectionExample2(bgColor, fontSize) {
  // 危险：多个用户输入直接用于 CSS 属性
  return `
    <style>
      .dynamic-style {
        background-color: ${bgColor};
        font-size: ${fontSize}px;
      }
    </style>
  `;
}

// 示例 3: 不安全的 CSS 内联样式
export function cssInjectionExample3(width, height) {
  // 危险：用户输入用于内联样式
  return `<div style="width: ${width}; height: ${height};"></div>`;
}

// 示例 4: 使用用户输入构建 CSS 类
export function cssInjectionExample4(className, styleProps) {
  // 危险：用户提供的类名和样式属性
  return `
    <style>
      .${className} {
        ${styleProps}
      }
    </style>
  `;
}

// 示例 5: 危险的 CSS background-image 属性
export function cssInjectionExample5(imageUrl) {
  // 危险：用户输入用于 background-image
  return `
    <style>
      .bg-image {
        background-image: url(${imageUrl});
      }
    </style>
  `;
}

// 示例 6: 使用用户输入构建 CSS 函数
export function cssInjectionExample6(transformValue) {
  // 危险：用户输入用于 CSS transform 函数
  return `
    <style>
      .transformed {
        transform: ${transformValue};
      }
    </style>
  `;
}

// 示例 7: 不安全的 CSS border 属性
export function cssInjectionExample7(borderSpec) {
  // 危险：用户输入用于 border 属性
  return `
    <style>
      .bordered {
        border: ${borderSpec};
      }
    </style>
  `;
}

// 示例 8: 使用用户输入构建 CSS 渐变
export function cssInjectionExample8(gradientType, colors) {
  // 危险：用户输入用于 CSS 渐变函数
  return `
    <style>
      .gradient-box {
        background: ${gradientType}-gradient(${colors});
      }
    </style>
  `;
}

// 示例 9: 危险的 CSS animation 属性
export function cssInjectionExample9(animationName, duration) {
  // 危险：用户输入用于动画相关属性
  return `
    <style>
      @keyframes ${animationName} {
        0% { opacity: 0; }
        100% { opacity: 1; }
      }
      
      .animated {
        animation: ${animationName} ${duration}s;
      }
    </style>
  `;
}

// 示例 10: 不安全的 CSS content 属性
export function cssInjectionExample10(contentValue) {
  // 危险：用户输入用于 content 属性，可能包含恶意内容
  return `
    <style>
      .pseudo-element::before {
        content: "${contentValue}";
      }
    </style>
  `;
}

// 示例 11: 使用用户输入构建 CSS filter
export function cssInjectionExample11(filterValue) {
  // 危险：用户输入用于 filter 属性
  return `
    <style>
      .filtered {
        filter: ${filterValue};
      }
    </style>
  `;
}

// 示例 12: 不安全的 CSS calc() 函数
export function cssInjectionExample12(calcExpression) {
  // 危险：用户输入用于 calc 函数
  return `
    <style>
      .calculated {
        width: calc(${calcExpression});
      }
    </style>
  `;
}

// 示例 13: 使用用户输入构建 CSS 自定义属性
export function cssInjectionExample13(propertyName, propertyValue) {
  // 危险：用户输入用于 CSS 自定义属性
  return `
    <style>
      :root {
        --${propertyName}: ${propertyValue};
      }
      
      .custom-prop {
        color: var(--${propertyName});
      }
    </style>
  `;
}

// 示例 14: 危险的 CSS counter 属性
export function cssInjectionExample14(counterName, counterValue) {
  // 危险：用户输入用于计数器相关属性
  return `
    <style>
      .counter-element {
        counter-reset: ${counterName} ${counterValue};
      }
    </style>
  `;
}

// 示例 15: 不安全的 CSS url() 函数
export function cssInjectionExample15(urlValue) {
  // 危险：用户输入用于 url 函数，可能包含 javascript: 协议
  return `
    <style>
      .url-bg {
        background: url("${urlValue}");
      }
    </style>
  `;
}

// 示例 16: 使用用户输入构建 CSS mask 属性
export function cssInjectionExample16(maskValue) {
  // 危险：用户输入用于 mask 属性
  return `
    <style>
      .masked {
        mask: ${maskValue};
      }
    </style>
  `;
}

// 示例 17: 不安全的 CSS src 属性（在 @font-face 中）
export function cssInjectionExample17(fontSrc) {
  // 危险：用户输入用于字体源
  return `
    <style>
      @font-face {
        font-family: 'CustomFont';
        src: url(${fontSrc});
      }
    </style>
  `;
}

// 示例 18: 使用用户输入构建复杂的 CSS 声明
export function cssInjectionExample18(selector, properties) {
  // 危险：用户输入用于选择器和属性
  return `
    <style>
      ${selector} {
        ${properties}
      }
    </style>
  `;
}

// 示例 19: 危险的 CSS box-shadow 属性
export function cssInjectionExample19(shadowSpec) {
  // 危险：用户输入用于 box-shadow 属性
  return `
    <style>
      .shadowed {
        box-shadow: ${shadowSpec};
      }
    </style>
  `;
}

// 示例 20: 不安全的 CSS import 语句
export function cssInjectionExample20(importUrl) {
  // 危险：用户输入用于 @import 语句
  return `
    <style>
      @import url("${importUrl}");
      .imported-style {
        color: red;
      }
    </style>
  `;
}
