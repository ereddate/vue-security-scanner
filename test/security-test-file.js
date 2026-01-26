// Test file for AST analysis and security scanning

// 1. Test dangerous function calls with user input
function testDangerousFunctions(userInput) {
  // Should be detected by AST analyzer
  eval(userInput);
  
  const dangerousFunc = new Function(userInput);
  dangerousFunc();
  
  // Should be detected by both regex and AST
  setTimeout(userInput, 1000);
  setInterval(userInput, 1000);
}

// 2. Test hardcoded secrets
const API_KEY = 'sk-1234567890abcdef';
const SECRET_TOKEN = 'secret_token_12345';
const password = 'hardcoded_password_123';

// 3. Test XSS vulnerabilities
const htmlContent = '<script>alert("XSS")</script>';
document.getElementById('content').innerHTML = htmlContent;

// 4. Test SQL injection
function getUserData(userId) {
  const query = `SELECT * FROM users WHERE id = ${userId}`;
  return database.query(query);
}

// 5. Test command injection
function executeCommand(command) {
  const exec = require('child_process').exec;
  exec(command);
}

// 6. Test prototype pollution
const userObject = {};
userObject.__proto__.isAdmin = true;

// 7. Test insecure crypto
const crypto = require('crypto');
const hash = crypto.createHash('md5').update('data').digest('hex');

// 8. Test insecure random
const randomValue = Math.random();

// 9. Test SSRF
function fetchExternalUrl(url) {
  return fetch(url);
}

// 10. Test path traversal
function readFile(filename) {
  const fs = require('fs');
  return fs.readFileSync(filename);
}

// 11. Test insecure storage
localStorage.setItem('password', 'user_password');

// 12. Test missing encryption
const sensitiveData = 'credit_card_number_1234567890';
localStorage.setItem('sensitive', sensitiveData);

// 13. Test JWT issues
const jwt = require('jsonwebtoken');
const token = jwt.sign({ userId: 123 }, 'secret_key', { algorithm: 'none' });

// 14. Test session management
const sessionId = 'session_12345';
document.cookie = `session=${sessionId}`;

// 15. Test CSRF
function makeRequest(url, data) {
  fetch(url, {
    method: 'POST',
    body: JSON.stringify(data),
    credentials: 'include'
  });
}

// 16. Test information disclosure
const debugMode = true;
if (debugMode) {
  console.log('Debug: User data:', userData);
}

// 17. Test insecure direct object reference
function getUserProfile(userId) {
  return fetch(`/api/users/${userId}`);
}

// 18. Test improper authentication
function login(username, password) {
  // No rate limiting
  return fetch('/api/login', {
    method: 'POST',
    body: JSON.stringify({ username, password })
  });
}

// 19. Test memory leak
function createMemoryLeak() {
  const elements = [];
  setInterval(() => {
    elements.push(document.createElement('div'));
  }, 100);
}

// 20. Test DOM-based XSS
function getUrlParameter(name) {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get(name);
}

const userInput = getUrlParameter('input');
document.getElementById('output').innerHTML = userInput;

// 21. Test Vue-specific issues
// Vue 2
new Vue({
  el: '#app',
  data: {
    userHtml: '<script>alert("XSS")</script>'
  },
  template: '<div v-html="userHtml"></div>'
});

// Vue 3
const app = createApp({
  setup() {
    const userHtml = ref('<script>alert("XSS")</script>');
    return { userHtml };
  },
  template: '<div v-html="userHtml"></div>'
});

// 22. Test custom directive security
Vue.directive('dangerous', {
  inserted(el, binding) {
    el.innerHTML = binding.value;
  }
});

// 23. Test router security
const router = new VueRouter({
  routes: [
    {
      path: '/user/:id',
      component: UserComponent,
      beforeEnter: (to, from, next) => {
        // No authentication check
        next();
      }
    }
  ]
});

// 24. Test state management security
const store = new Vuex.Store({
  state: {
    user: null,
    token: 'hardcoded_token_123'
  },
  mutations: {
    setUser(state, user) {
      state.user = user;
    }
  }
});

// 25. Test async/await security
async function fetchData(url) {
  const response = await fetch(url);
  const data = await response.json();
  return data;
}

// 26. Test import/export security
import { sensitiveFunction } from './sensitive-module';
export const API_KEY = 'exported_api_key_123';

// 27. Test template injection
function renderTemplate(template, data) {
  return template.replace(/\{\{(\w+)\}\}/g, (match, key) => data[key]);
}

const template = '<div>{{userInput}}</div>';
const data = { userInput: '<script>alert("XSS")</script>' };
renderTemplate(template, data);

// 28. Test HTTP header injection
function setCustomHeader(name, value) {
  document.cookie = `${name}=${value}`;
}

setCustomHeader('user-data', 'sensitive_information');

// 29. Test cookie security
document.cookie = 'session=12345; path=/; max-age=3600';

// 30. Test file upload security
function uploadFile(file) {
  const formData = new FormData();
  formData.append('file', file);
  return fetch('/api/upload', {
    method: 'POST',
    body: formData
  });
}

// 31. Test GraphQL injection
function executeGraphQL(query, variables) {
  return fetch('/graphql', {
    method: 'POST',
    body: JSON.stringify({ query, variables })
  });
}

const maliciousQuery = `
  query {
    users {
      id
      username
      password
    }
  }
`;

// 32. Test NoSQL injection
function findUser(username) {
  return db.users.findOne({ username: username });
}

// 33. Test LDAP injection
function authenticate(username, password) {
  const ldapQuery = `(uid=${username})(userPassword=${password})`;
  return ldap.search(ldapQuery);
}

// 34. Test XPath injection
function findUser(xpath) {
  return xmlDocument.evaluate(xpath);
}

// 35. Test XXE
function parseXML(xmlString) {
  const parser = new DOMParser();
  return parser.parseFromString(xmlString, 'text/xml');
}

// 36. Test ReDoS
function validateEmail(email) {
  const regex = /^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,5})$/;
  return regex.test(email);
}

// 37. Test rate limiting
function loginAttempt(username, password) {
  // No rate limiting implemented
  return authenticate(username, password);
}

// 38. Test brute force
function bruteForcePassword(username) {
  const passwords = ['123456', 'password', 'admin'];
  for (const pwd of passwords) {
    loginAttempt(username, pwd);
  }
}

// 39. Test access control
function adminPanel() {
  if (currentUser.role === 'admin') {
    showAdminPanel();
  }
}

// 40. Test business logic flaw
function transferMoney(from, to, amount) {
  // No balance check
  account[from].balance -= amount;
  account[to].balance += amount;
}

// 41. Test API security
function callExternalAPI(endpoint, apiKey) {
  return fetch(endpoint, {
    headers: {
      'Authorization': `Bearer ${apiKey}`
    }
  });
}

// 42. Test insecure file download
function downloadFile(filename) {
  return fetch(`/api/files/${filename}`);
}

// 43. Test mass assignment
function updateUserProfile(userId, updates) {
  const user = db.users.findById(userId);
  Object.assign(user, updates);
  return user.save();
}

// 44. Test insecure deserialization
function deserializeObject(data) {
  return JSON.parse(data);
}

// 45. Test WebAssembly security
const wasmModule = await WebAssembly.instantiate(wasmBytes);

// 46. Test WebRTC security
const peerConnection = new RTCPeerConnection();

// 47. Test WebSocket security
const ws = new WebSocket('ws://example.com/socket');

// 48. Test worker XSS
const worker = new Worker('worker.js');
worker.postMessage(userInput);

// 49. Test SVG XSS
const svgContent = `<svg><script>alert("XSS")</script></svg>`;
document.getElementById('svg-container').innerHTML = svgContent;

// 50. Test postMessage XSS
window.addEventListener('message', (event) => {
  document.getElementById('output').innerHTML = event.data;
});

window.postMessage('<script>alert("XSS")</script>', '*');

console.log('Test file loaded successfully');
