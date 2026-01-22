// Additional test file with more security vulnerabilities to test enhanced detection

// Router configuration with potential security issues
import { createRouter, createWebHistory } from 'vue-router';
import Home from '@/views/Home.vue';

const routes = [
  {
    path: '/user/:id',  // Potential route parameter issue
    component: Home,
    beforeEnter: (to, from, next) => {
      // Missing validation for route parameters
      next();
    }
  },
  {
    path: '/redirect',
    component: Home,
    beforeEnter: (to, from, next) => {
      // Potential open redirect vulnerability
      const redirectUrl = to.query.redirect;  // User-controlled input
      window.location.href = redirectUrl;  // Dangerous!
      next();
    }
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;

// Component with additional vulnerabilities
export default {
  name: 'SecurityTestComponent',
  data() {
    return {
      // More hardcoded credentials
      dbCredentials: {
        username: 'admin',
        password: 'admin123',  // Hardcoded password
        host: 'localhost'
      },
      apiKeys: {
        googleMapsApiKey: 'AIzaSyDummyKey1234567890',  // Hardcoded API key
        stripeKey: 'sk_test_dummy1234567890'  // Hardcoded payment key
      }
    };
  },
  computed: {
    // Unsafe computed property that might be vulnerable
    processedData() {
      // If user data is used without sanitization
      const rawUserData = this.$route.query.data;
      return eval(rawUserData);  // Very dangerous
    }
  },
  methods: {
    handleUserInput() {
      // Direct DOM manipulation with user input
      const userInput = this.$route.params.input;
      document.getElementById('content').innerHTML = userInput;  // XSS vulnerability
      
      // Using v-model without validation
      this.formData = this.$route.query.formData;  // No validation
      
      // Unsafe dynamic component loading
      const componentName = this.$route.query.component;
      import(`../components/${componentName}.vue`);  // Potential path traversal
    },
    
    unsafeMerge(target, source) {
      // Prototype pollution vulnerability
      for (let key in source) {
        if (key === '__proto__' || key === 'constructor') {
          // This check should exist but doesn't
          target[key] = source[key];
        }
      }
    }
  },
  mounted() {
    // Execute code with user-controlled parameters
    const action = this.$route.query.action;
    if (action) {
      eval(`(${action})`);  // Extremely dangerous
    }
  }
};