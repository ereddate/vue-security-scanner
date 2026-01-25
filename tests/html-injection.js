// HTML Injection 漏洞示例文件

// 示例 1: 直接将用户输入插入 HTML
export function htmlInjectionExample1(userInput) {
  // 危险：用户输入直接插入到 HTML 中
  return `<div>${userInput}</div>`;
}

// 示例 2: 使用 innerHTML 插入用户内容
export function htmlInjectionExample2(content) {
  // 危险：用户内容直接赋值给 innerHTML
  const element = document.createElement('div');
  element.innerHTML = content;
  return element;
}

// 示例 3: 在模板字符串中插入用户输入
export function htmlInjectionExample3(title, body) {
  // 危险：多个用户输入直接插入 HTML
  return `
    <article>
      <h1>${title}</h1>
      <p>${body}</p>
    </article>
  `;
}

// 示例 4: 使用用户输入构建链接
export function htmlInjectionExample4(url, linkText) {
  // 危险：URL 和链接文本来自用户输入
  return `<a href="${url}">${linkText}</a>`;
}

// 示例 5: 不安全的表单生成
export function htmlInjectionExample5(fieldName, defaultValue) {
  // 危险：字段名和默认值来自用户输入
  return `<input name="${fieldName}" value="${defaultValue}" />`;
}

// 示例 6: 用户输入影响属性值
export function htmlInjectionExample6(imageSrc, altText) {
  // 危险：图片源和替代文本来自用户输入
  return `<img src="${imageSrc}" alt="${altText}" />`;
}

// 示例 7: 构建带有用户输入的列表
export function htmlInjectionExample7(items) {
  // 危险：列表项来自用户输入
  let listHtml = '<ul>';
  for (const item of items) {
    listHtml += `<li>${item}</li>`;
  }
  listHtml += '</ul>';
  return listHtml;
}

// 示例 8: 使用用户输入构建表格
export function htmlInjectionExample8(headers, rows) {
  // 危险：表头和行数据来自用户输入
  let tableHtml = '<table><thead><tr>';
  for (const header of headers) {
    tableHtml += `<th>${header}</th>`;
  }
  tableHtml += '</tr></thead><tbody>';
  
  for (const row of rows) {
    tableHtml += '<tr>';
    for (const cell of row) {
      tableHtml += `<td>${cell}</td>`;
    }
    tableHtml += '</tr>';
  }
  
  tableHtml += '</tbody></table>';
  return tableHtml;
}

// 示例 9: 用户输入影响事件处理器
export function htmlInjectionExample9(eventName, handlerCode) {
  // 危险：事件名和处理器代码来自用户输入
  return `<button ${eventName}="${handlerCode}">Click me</button>`;
}

// 示例 10: 不安全的 div 标签构建
export function htmlInjectionExample10(cssClass, content) {
  // 危险：CSS 类和内容来自用户输入
  return `<div class="${cssClass}">${content}</div>`;
}

// 示例 11: 使用用户输入构建 iframe
export function htmlInjectionExample11(srcUrl, width, height) {
  // 危险：iframe 属性来自用户输入
  return `<iframe src="${srcUrl}" width="${width}" height="${height}"></iframe>`;
}

// 示例 12: 用户输入影响样式属性
export function htmlInjectionExample12(styleProperty, styleValue) {
  // 危险：样式属性和值来自用户输入
  return `<span style="${styleProperty}:${styleValue};">Styled text</span>`;
}

// 示例 13: 构建带有用户输入的表单
export function htmlInjectionExample13(actionUrl, formData) {
  // 危险：表单动作和数据来自用户输入
  let formHtml = `<form action="${actionUrl}">`;
  for (const [name, value] of Object.entries(formData)) {
    formHtml += `<input type="hidden" name="${name}" value="${value}" />`;
  }
  formHtml += '<input type="submit" value="Submit" /></form>';
  return formHtml;
}

// 示例 14: 用户输入构建按钮
export function htmlInjectionExample14(buttonType, buttonText, onClickHandler) {
  // 危险：按钮类型、文本和点击处理器来自用户输入
  return `<button type="${buttonType}" onclick="${onClickHandler}">${buttonText}</button>`;
}

// 示例 15: 不安全的评论系统 HTML
export function htmlInjectionExample15(author, comment, timestamp) {
  // 危险：作者、评论和时间戳来自用户输入
  return `
    <div class="comment">
      <h4>${author}</h4>
      <p>${comment}</p>
      <small>${timestamp}</small>
    </div>
  `;
}

// 示例 16: 用户输入构建导航菜单
export function htmlInjectionExample16(menuItems) {
  // 危险：菜单项来自用户输入
  let navHtml = '<nav><ul>';
  for (const item of menuItems) {
    navHtml += `<li><a href="${item.url}">${item.text}</a></li>`;
  }
  navHtml += '</ul></nav>';
  return navHtml;
}

// 示例 17: 使用用户输入构建音频元素
export function htmlInjectionExample17(audioSrc, controls) {
  // 危险：音频源和控件来自用户输入
  return `<audio src="${audioSrc}" ${controls ? 'controls' : ''}></audio>`;
}

// 示例 18: 用户输入影响 meta 标签
export function htmlInjectionExample18(metaName, metaContent) {
  // 危险：meta 名称和内容来自用户输入
  return `<meta name="${metaName}" content="${metaContent}" />`;
}

// 示例 19: 构建带有用户输入的视频元素
export function htmlInjectionExample19(videoSrc, posterImage) {
  // 危险：视频源和海报图像来自用户输入
  return `<video src="${videoSrc}" poster="${posterImage}" controls></video>`;
}

// 示例 20: 复杂的用户输入驱动 HTML 结构
export function htmlInjectionExample20(structureDefinition) {
  // 危险：整个结构定义来自用户输入
  return structureDefinition;
}
