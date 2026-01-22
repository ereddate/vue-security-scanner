// Additional test file with more security vulnerabilities

// Example 1: XSS via template interpolation
const unsafeTemplate = `
<div>
  {{ userSuppliedData }}
</div>
`;

// Example 2: Hardcoded credentials
const config = {
  dbPassword: 'admin123',
  secretKey: 'very-secret-key-here',
  apiToken: 'Bearer abcdef123456'
};

// Example 3: Insecure CORS settings (if in a config file)
const corsConfig = {
  origin: '*', // This is insecure!
  credentials: true
};

// Example 4: Potentially unsafe eval usage
function processData(data) {
  // This is dangerous
  return eval(data);
}

// Example 5: Prototype pollution vulnerability
function merge(target, source) {
  for (let key in source) {
    if (key in source) {
      target[key] = source[key]; // Potential prototype pollution
    }
  }
  return target;
}

export { 
  unsafeTemplate, 
  config, 
  corsConfig, 
  processData, 
  merge 
};