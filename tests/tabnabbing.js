// Tabnabbing 漏洞示例文件

// 示例 1: 不安全的 target="_blank" 使用
export function tabnabbingExample1() {
  // 危险：使用 target="_blank" 但没有 rel="noopener noreferrer"
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <title>Tabnabbing Vulnerability - Example 1</title>
    </head>
    <body>
      <h1>危险的外部链接</h1>
      <p>以下链接存在 Tabnabbing 漏洞：</p>
      
      <!-- 危险：target="_blank" 没有安全属性 -->
      <a href="https://external-site.com" target="_blank">访问外部网站</a>
      
      <script>
        // 外部网站可以通过 window.opener.location 改变原始页面
        console.log('当前页面可能被新打开的页面控制');
      </script>
    </body>
    </html>
  `;
}

// 示例 2: 通过 JavaScript 打开新窗口
export function tabnabbingExample2() {
  // 危险：通过 JavaScript 打开窗口，没有安全控制
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <title>Tabnabbing Vulnerability - Example 2</title>
    </head>
    <body>
      <h1>JavaScript 窗口打开漏洞</h1>
      
      <button onclick="openDangerousWindow()">打开外部页面</button>
      
      <script>
        function openDangerousWindow() {
          // 危险：使用 window.open 没有安全特性
          window.open('https://external-malicious-site.com', '_blank');
        }
        
        // 当前页面可能被新页面通过 opener 控制
        console.log('Opener:', window.opener);
      </script>
    </body>
    </html>
  `;
}

// 示例 3: 动态创建的链接
export function tabnabbingExample3() {
  // 危险：动态创建的链接没有安全属性
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <title>Tabnabbing Vulnerability - Example 3</title>
    </head>
    <body>
      <h1>动态链接漏洞</h1>
      
      <div id="linkContainer"></div>
      
      <script>
        // 危险：动态创建的链接没有安全属性
        function createExternalLink() {
          const link = document.createElement('a');
          link.href = 'https://malicious-site.com';
          link.textContent = '外部链接';
          link.target = '_blank';  // 危险：没有安全属性
          document.getElementById('linkContainer').appendChild(link);
        }
        
        createExternalLink();
      </script>
    </body>
    </html>
  `;
}

// 示例 4: 用户生成内容中的不安全链接
export function tabnabbingExample4() {
  // 危险：用户内容中的链接没有经过安全处理
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <title>Tabnabbing Vulnerability - Example 4</title>
    </head>
    <body>
      <h1>用户生成内容漏洞</h1>
      
      <div id="userContent">
        <p>用户评论：</p>
        <p>这个网站很有趣 <a href="https://phishing-site.com" target="_blank">点击这里</a> 查看更多信息。</p>
      </div>
      
      <script>
        // 危险：用户提供的链接没有安全处理
        // 如果用户内容包含 target="_blank" 链接，则存在漏洞
        console.log('页面中可能存在不安全的外部链接');
      </script>
    </body>
    </html>
  `;
}

// 示例 5: 链接池中的不安全链接
export function tabnabbingExample5() {
  // 危险：多个外部链接没有安全属性
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <title>Tabnabbing Vulnerability - Example 5</title>
    </head>
    <body>
      <h1>链接池漏洞</h1>
      
      <ul>
        <!-- 危险：多个外部链接 -->
        <li><a href="https://external1.com" target="_blank">外部链接 1</a></li>
        <li><a href="https://external2.com" target="_blank">外部链接 2</a></li>
        <li><a href="https://external3.com" target="_blank">外部链接 3</a></li>
        <li><a href="https://external4.com" target="_blank">外部链接 4</a></li>
      </ul>
      
      <script>
        // 所有通过 target="_blank" 打开的页面都可以访问 window.opener
        console.log('当前页面可能被多个外部页面控制');
      </script>
    </body>
    </html>
  `;
}

// 示例 6: 表单提交到新窗口
export function tabnabbingExample6() {
  // 危险：表单提交到新窗口
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <title>Tabnabbing Vulnerability - Example 6</title>
    </head>
    <body>
      <h1>表单提交漏洞</h1>
      
      <!-- 危险：表单提交到新窗口 -->
      <form action="https://external-process.com" method="POST" target="_blank">
        <input type="hidden" name="data" value="sensitive_info">
        <button type="submit">提交到外部处理</button>
      </form>
      
      <script>
        // 新窗口可以通过 opener 访问原窗口
        console.log('表单提交后的新页面可能控制当前页面');
      </script>
    </body>
    </html>
  `;
}

// 示例 7: 框架中的 Tabnabbing
export function tabnabbingExample7() {
  // 危险：iframe 中的内容可能被外部控制
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <title>Tabnabbing Vulnerability - Example 7</title>
    </head>
    <body>
      <h1>框架漏洞</h1>
      
      <iframe src="about:blank" id="contentFrame"></iframe>
      
      <script>
        // 危险：动态设置 iframe 内容，可能包含不安全链接
        function loadExternalContent() {
          const frame = document.getElementById('contentFrame');
          frame.src = 'https://external-site.com/page-with-blank-links.html';
        }
        
        // 原页面可能被 iframe 中的页面控制
        console.log('当前页面可能被 iframe 内容控制');
      </script>
    </body>
    </html>
  `;
}

// 示例 8: 重定向页面中的 Tabnabbing
export function tabnabbingExample8() {
  // 危险：重定向页面可能包含不安全链接
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <title>Tabnabbing Vulnerability - Example 8</title>
    </head>
    <body>
      <h1>重定向页面漏洞</h1>
      
      <script>
        // 危险：页面加载后动态创建不安全链接
        setTimeout(function() {
          const link = document.createElement('a');
          link.href = 'https://malicious-redirect.com';
          link.target = '_blank';  // 危险：没有安全属性
          link.textContent = '延迟加载的外部链接';
          document.body.appendChild(link);
        }, 1000);
      </script>
    </body>
    </html>
  `;
}

// 示例 9: 富文本编辑器中的 Tabnabbing
export function tabnabbingExample9() {
  // 危险：富文本内容中的链接没有安全处理
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <title>Tabnabbing Vulnerability - Example 9</title>
    </head>
    <body>
      <h1>富文本编辑器漏洞</h1>
      
      <div id="richTextContent">
        <p>这里是富文本内容：<a href="https://evil-site.com" target="_blank">点击访问</a></p>
      </div>
      
      <script>
        // 危险：富文本内容中的链接可能没有经过安全处理
        // 需要确保所有生成的 target="_blank" 链接都有 rel="noopener noreferrer"
        console.log('富文本内容可能存在安全链接漏洞');
      </script>
    </body>
    </html>
  `;
}

// 示例 10: 按钮驱动的新窗口打开
export function tabnabbingExample10() {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <title>Tabnabbing Vulnerability - Example 10</title>
    </head>
    <body>
      <h1>按钮驱动的窗口打开</h1>
      
      <button id="openWindowBtn">打开外部页面</button>
      
      <script>
        document.getElementById('openWindowBtn').addEventListener('click', function() {
          // 危险：通过 JavaScript 打开新窗口
          const newWindow = window.open('https://untrusted-site.com', '_blank');
          
          // 新窗口可以通过 window.opener 访问当前窗口
          console.log('新窗口可以访问 opener:', newWindow.opener);
        });
      </script>
    </body>
    </html>
  `;
}

// 示例 11: 事件处理程序中的 Tabnabbing
export function tabnabbingExample11() {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <title>Tabnabbing Vulnerability - Example 11</title>
    </head>
    <body>
      <h1>事件处理程序漏洞</h1>
      
      <div class="external-link" data-url="https://dangerous-site.com">
        点击访问外部网站
      </div>
      
      <script>
        document.querySelectorAll('.external-link').forEach(item => {
          item.addEventListener('click', function() {
            const url = this.getAttribute('data-url');
            
            // 危险：打开新窗口没有安全措施
            window.open(url, '_blank', 'noopener,noreferrer');
          });
        });
      </script>
    </body>
    </html>
  `;
}

// 示例 12: 鼠标悬停打开新窗口
export function tabnabbingExample12() {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <title>Tabnabbing Vulnerability - Example 12</title>
    </head>
    <body>
      <h1>鼠标悬停漏洞</h1>
      
      <div class="hover-area" style="padding: 20px; background: #eee;">
        悬停在此区域上方打开新窗口
      </div>
      
      <script>
        const hoverArea = document.querySelector('.hover-area');
        
        hoverArea.addEventListener('mouseenter', function() {
          // 危险：鼠标悬停时打开新窗口
          setTimeout(() => {
            window.open('https://suspicious-site.com', '_blank');
          }, 1000);
        });
      </script>
    </body>
    </html>
  `;
}

// 示例 13: 键盘快捷键打开新窗口
export function tabnabbingExample13() {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <title>Tabnabbing Vulnerability - Example 13</title>
    </head>
    <body>
      <h1>键盘快捷键漏洞</h1>
      
      <p>按下 Ctrl+X 打开外部页面</p>
      
      <script>
        document.addEventListener('keydown', function(e) {
          if (e.ctrlKey && e.key === 'x') {
            e.preventDefault();
            
            // 危险：通过键盘快捷键打开新窗口
            window.open('https://malicious-keyboard-site.com', '_blank');
          }
        });
      </script>
    </body>
    </html>
  `;
}

// 示例 14: 自动重定向到新窗口
export function tabnabbingExample14() {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <title>Tabnabbing Vulnerability - Example 14</title>
    </head>
    <body>
      <h1>自动重定向漏洞</h1>
      
      <script>
        // 危险：页面加载后自动打开新窗口
        window.onload = function() {
          setTimeout(() => {
            const newWin = window.open('https://automated-attack.com', '_blank');
            
            // 新窗口可以控制原窗口
            if (newWin) {
              console.log('新窗口已打开，可能控制原窗口');
            }
          }, 3000);
        };
      </script>
    </body>
    </html>
  `;
}

// 示例 15: 拖放操作中的 Tabnabbing
export function tabnabbingExample15() {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <title>Tabnabbing Vulnerability - Example 15</title>
    </head>
    <body>
      <h1>拖放操作漏洞</h1>
      
      <div id="draggable" draggable="true" style="padding: 10px; background: yellow;">
        拖拽此元素
      </div>
      
      <div id="dropzone" style="width: 200px; height: 100px; border: 2px dashed gray; margin-top: 20px;">
        拖拽到这里
      </div>
      
      <script>
        document.getElementById('dropzone').addEventListener('dragover', function(e) {
          e.preventDefault();
        });
        
        document.getElementById('dropzone').addEventListener('drop', function(e) {
          e.preventDefault();
          
          // 危险：拖放操作后打开新窗口
          window.open('https://drag-drop-attack.com', '_blank');
        });
      </script>
    </body>
    </html>
  `;
}

// 示例 16: 表格中的不安全链接
export function tabnabbingExample16() {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <title>Tabnabbing Vulnerability - Example 16</title>
    </head>
    <body>
      <h1>表格链接漏洞</h1>
      
      <table border="1">
        <tr>
          <th>网站</th>
          <th>链接</th>
        </tr>
        <tr>
          <td>外部资源 1</td>
          <td><a href="https://external-res-1.com" target="_blank">访问</a></td>
        </tr>
        <tr>
          <td>外部资源 2</td>
          <td><a href="https://external-res-2.com" target="_blank">访问</a></td>
        </tr>
        <tr>
          <td>外部资源 3</td>
          <td><a href="https://external-res-3.com" target="_blank">访问</a></td>
        </tr>
      </table>
      
      <script>
        // 表格中的所有链接都可能存在 Tabnabbing 漏洞
        console.log('表格中的所有外部链接都需要安全处理');
      </script>
    </body>
    </html>
  `;
}

// 示例 17: 动态加载的广告中的 Tabnabbing
export function tabnabbingExample17() {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <title>Tabnabbing Vulnerability - Example 17</title>
    </head>
    <body>
      <h1>动态广告漏洞</h1>
      
      <div id="ad-container"></div>
      
      <script>
        // 危险：动态加载的广告可能包含不安全链接
        function loadAdContent() {
          const adContent = '<a href="https://malicious-ad.com" target="_blank"><img src="ad-image.jpg" alt="广告"></a>';
          document.getElementById('ad-container').innerHTML = adContent;
        }
        
        // 广告加载后可能存在 Tabnabbing 漏洞
        loadAdContent();
      </script>
    </body>
    </html>
  `;
}

// 示例 18: 社交媒体分享按钮中的 Tabnabbing
export function tabnabbingExample18() {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <title>Tabnabbing Vulnerability - Example 18</title>
    </head>
    <body>
      <h1>社交媒体分享漏洞</h1>
      
      <div class="social-share-buttons">
        <a href="https://facebook.com/sharer.php?u=https://current-page.com" target="_blank">分享到 Facebook</a>
        <a href="https://twitter.com/intent/tweet?url=https://current-page.com" target="_blank">分享到 Twitter</a>
        <a href="https://linkedin.com/shareArticle?url=https://current-page.com" target="_blank">分享到 LinkedIn</a>
      </div>
      
      <script>
        // 即使是官方分享链接，如果使用 target="_blank" 也需要安全属性
        console.log('社交媒体分享按钮也需注意 Tabnabbing 防护');
      </script>
    </body>
    </html>
  `;
}

// 示例 19: 下拉菜单中的外部链接
export function tabnabbingExample19() {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <title>Tabnabbing Vulnerability - Example 19</title>
    </head>
    <body>
      <h1>下拉菜单漏洞</h1>
      
      <div class="dropdown">
        <button onclick="toggleDropdown()">菜单</button>
        <div id="dropdownContent" class="dropdown-content" style="display: none;">
          <a href="https://resource1.com" target="_blank">资源 1</a>
          <a href="https://resource2.com" target="_blank">资源 2</a>
          <a href="https://resource3.com" target="_blank">资源 3</a>
        </div>
      </div>
      
      <script>
        function toggleDropdown() {
          const dropdown = document.getElementById('dropdownContent');
          dropdown.style.display = dropdown.style.display === 'block' ? 'none' : 'block';
        }
        
        // 下拉菜单中的所有链接都需要安全处理
        console.log('下拉菜单中的外部链接需要安全属性');
      </script>
    </body>
    </html>
  `;
}

// 示例 20: 复合 Tabnabbing 攻击
export function tabnabbingExample20() {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <title>Tabnabbing Vulnerability - Example 20</title>
    </head>
    <body>
      <h1>复合 Tabnabbing 攻击</h1>
      
      <!-- 技术1: 不安全的外部链接 -->
      <a href="https://first-malicious.com" target="_blank">第一个恶意链接</a>
      
      <!-- 技术2: JavaScript 打开窗口 -->
      <button id="jsOpenBtn">JS 打开窗口</button>
      
      <!-- 技术3: 表单提交到新窗口 -->
      <form action="https://form-target.com" method="POST" target="_blank">
        <input type="hidden" name="token" value="secret_token">
        <button type="submit">表单提交</button>
      </form>
      
      <!-- 技术4: 动态创建链接 -->
      <div id="dynamicLinks"></div>
      
      <script>
        // 组合多种 Tabnabbing 技术
        
        // 技术2: JavaScript 打开窗口
        document.getElementById('jsOpenBtn').addEventListener('click', function() {
          window.open('https://second-malicious.com', '_blank');
        });
        
        // 技术4: 动态创建多个不安全链接
        function createMultipleLinks() {
          const container = document.getElementById('dynamicLinks');
          for (let i = 0; i < 5; i++) {
            const link = document.createElement('a');
            link.href = `https://dynamic-${i}-malicious.com`;
            link.target = '_blank';  // 危险：没有安全属性
            link.textContent = `动态链接 ${i}`;
            container.appendChild(document.createElement('br'));
            container.appendChild(link);
          }
        }
        
        // 延迟创建动态链接
        setTimeout(createMultipleLinks, 2000);
        
        // 监控 opener 访问
        setInterval(() => {
          if (window.opener) {
            console.log('当前页面可能被 opener 控制');
            console.log('Opener location:', window.opener.location);
          }
        }, 1000);
        
        // 其他可能的攻击向量
        window.addEventListener('focus', () => {
          // 当窗口重新获得焦点时，可能已被篡改
          console.log('窗口焦点恢复，检查是否被篡改');
        });
      </script>
    </body>
    </html>
  `;
}
