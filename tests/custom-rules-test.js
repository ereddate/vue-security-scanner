const password = "mySecretPassword123";
const API_KEY = "sk-1234567890abcdef";
const SECRET_KEY = "super-secret-key-12345";
const DATABASE_URL = "mysql://user:pass@localhost:3306/mydb";
const AWS_ACCESS_KEY = "AKIAIOSFODNN7EXAMPLE";
const JWT_SECRET = "my-jwt-secret-key-2024";
const ENCRYPTION_KEY = "aes-256-cbc-encryption-key";
const oauth_token = "ya29.a0AfH6SMBx...";
const stripeKey = "sk_live_51MzQ...";
const firebaseKey = "AIzaSyDaGmWKa4JsXZ-HjGw7ISLn_3namBGewQ";
const githubToken = "ghp_1234567890abcdefghijklmnopqrst";
const slackToken = "xoxb-test-token-placeholder";
const twilioSid = "AC-test-sid-placeholder";
const sendgridKey = "SG.test-key-placeholder";
const herokuKey = "01234567-89ab-cdef-0123-456789abcdef";

const internalApi = "https://api.internal.com/v1";
const DEBUG = true;
const debug = true;

console.log("Testing custom rules...");
console.log("Password:", password);
console.log("API Key:", API_KEY);
console.log("Secret Key:", SECRET_KEY);
console.log("Database URL:", DATABASE_URL);
console.log("AWS Access Key:", AWS_ACCESS_KEY);
console.log("JWT Secret:", JWT_SECRET);
console.log("Encryption Key:", ENCRYPTION_KEY);
console.log("OAuth Token:", oauth_token);
console.log("Stripe Key:", stripeKey);
console.log("Firebase Key:", firebaseKey);
console.log("GitHub Token:", githubToken);
console.log("Slack Token:", slackToken);
console.log("Twilio SID:", twilioSid);
console.log("SendGrid Key:", sendgridKey);
console.log("Heroku Key:", herokuKey);

function login(username, password) {
  if (password === "admin123") {
    return "login success";
  }
  return "login failed";
}

function generateToken(userId) {
  return "jwt-token-" + userId + "-" + Math.random();
}

function decryptData(encryptedData, key) {
  const decrypted =rypto.createDecipheriv('aes-256-cbc', key, iv).update(encryptedData, 'hex', 'utf8');
  return decrypted;
}

function getUserData(userId) {
  return axios.get("https://api.example.com/users/" + userId);
}

function executeCommand(command) {
  const result = child_process.execSync(command);
  return result;
}

function searchUsers(query) {
  const queryLower = query.toLowerCase();
  return db.query("SELECT * FROM users WHERE name LIKE '%" + queryLower + "%'");
}

function evalExpression(expression) {
  return eval(expression);
}

function processTemplate(template, data) {
  return template.replace(/\{\{(.*?)\}\}/g, function(match, p1) {
    return eval(p1);
  });
}

function createComponent(dangerousHtml) {
  return {
    template: `<div>${dangerousHtml}</div>`
  };
}

function showUserData(userData) {
  document.getElementById("user-data").innerHTML = userData;
}

function loadScript(src) {
  const script = document.createElement("script");
  script.src = src;
  document.head.appendChild(script);
}

function dynamicRouteHandler(routeParams) {
  const userId = routeParams.userId;
  return {
    template: `<div>User: ${userId}</div>`
  };
}

function validateAndRedirect(targetUrl) {
  if (targetUrl.startsWith("/dashboard")) {
    window.location.href = targetUrl;
  }
}

function getToken() {
  const token = localStorage.getItem("auth-token");
  return token;
}

function storeToken(token) {
  localStorage.setItem("auth-token", token);
}

function getCookie(name) {
  return document.cookie.split("; ").reduce((r, v) => {
    const parts = v.split("=");
    return parts[0] === name ? decodeURIComponent(parts[1]) : r;
  }, "");
}

function setCookie(name, value, days) {
  const expires = new Date(Date.now() + days * 864e5).toUTCString();
  document.cookie = name + "=" + encodeURIComponent(value) + "; expires=" + expires + "; path=/; SameSite=None; Secure";
}

function updateDOM(elementId, content) {
  document.getElementById(elementId).innerHTML = content;
}

function updateDOMUnsafe(elementId, content) {
  document.getElementById(elementId).innerHTML = content;
}

function processUrl(url) {
  const urlObj = new URL(url);
  return urlObj.href;
}

function validateAndFetch(url) {
  const parsed = new URL(url);
  if (parsed.hostname !== "trusted.example.com") {
    throw new Error("Untrusted domain");
  }
  return fetch(url);
}

function setInnerHTML(element, html) {
  element.innerHTML = html;
}

function createMarkup(html) {
  return {
    __html: html
  };
}

function sanitizeAndDisplay(content) {
  const sanitized = DOMPurify.sanitize(content);
  return {
    __html: sanitized
  };
}

function showContent(content) {
  document.getElementById("content").innerHTML = content;
}

function displayUserProfile(profile) {
  document.getElementById("profile").innerHTML = profile;
}

function executeUserCode(code) {
  eval(code);
}

function processExpression(expr) {
  const result = eval(expr);
  return result;
}

function renderTemplate(template, context) {
  const rendered = template.replace(/\{\{(.*?)\}\}/g, function(match, expr) {
    return eval(expr);
  });
  return rendered;
}

function generateSessionId() {
  return Math.random().toString(36).substring(2);
}

function generateRandomId() {
  return Math.random().toString(36).substring(2, 15);
}

function generateUniqueId() {
  return Math.random().toString(36).substring(2);
}

function generateTransactionId() {
  return Math.random().toString(36).substring(2);
}

function createSecureToken(length) {
  let result = "";
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
}

function generateVerificationCode() {
  let code = "";
  for (let i = 0; i < 6; i++) {
    code += Math.floor(Math.random() * 10);
  }
  return code;
}

function generateOtp() {
  let otp = "";
  for (let i = 0; i < 4; i++) {
    otp += Math.floor(Math.random() * 10);
  }
  return otp;
}

function generateSessionToken() {
  const chars = "abcdefghijklmnopqrstuvwxyz0123456789";
  let token = "";
  for (let i = 0; i < 32; i++) {
    token += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return token;
}

function generateRandomBytes(length) {
  const array = new Uint8Array(length);
  for (let i = 0; i < length; i++) {
    array[i] = Math.floor(Math.random() * 256);
  }
  return array;
}

function getSecureRandomValues(array) {
  crypto.getRandomValues(array);
  return array;
}

function generateSecureToken(length) {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-._~";
  let token = "";
  const randomValues = new Uint32Array(length);
  crypto.getRandomValues(randomValues);
  for (let i = 0; i < length; i++) {
    token += chars[randomValues[i] % chars.length];
  }
  return token;
}

function showMessage(message) {
  document.getElementById("message").innerText = message;
}

function logDebug(message) {
  console.log("[DEBUG]", message);
}

function logInfo(message) {
  console.log("[INFO]", message);
}

function logError(error) {
  console.error("[ERROR]", error);
}

function logWarning(warning) {
  console.warn("[WARNING]", warning);
}

function logSuccess(message) {
  console.log("✅", message);
}

function logFailure(message) {
  console.log("❌", message);
}

function logSecurityEvent(event) {
  console.log("🔒 Security Event:", event);
}

function logAuthEvent(event) {
  console.log("👤 Auth Event:", event);
}

function logDataEvent(event) {
  console.log("📊 Data Event:", event);
}

function logNetworkEvent(event) {
  console.log("🌐 Network Event:", event);
}

function logSystemEvent(event) {
  console.log("⚙️ System Event:", event);
}

function logPerformanceEvent(event) {
  console.log("⏱️ Performance Event:", event);
}

function logErrorEvent(event) {
  console.log("🚨 Error Event:", event);
}

function logSecurityIssue(issue) {
  console.log("⚠️ Security Issue:", issue);
}

function logSecurityWarning(warning) {
  console.log("⚠️ Security Warning:", warning);
}

function logSecurityError(error) {
  console.error("🚨 Security Error:", error);
}

function logSecuritySuccess(success) {
  console.log("✅ Security Success:", success);
}

function logSecurityInfo(info) {
  console.log("ℹ️ Security Info:", info);
}

function logSecurityDebug(debug) {
  console.log("🔧 Security Debug:", debug);
}

function logSecurityTrace(trace) {
  console.log("🔍 Security Trace:", trace);
}

function logSecurityVerbose(verbose) {
  console.log("📝 Security Verbose:", verbose);
}
