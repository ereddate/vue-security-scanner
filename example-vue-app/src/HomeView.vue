<template>
  <div class="home">
    <!-- XSS vulnerability: Using v-html with user input -->
    <div v-html="userContent"></div>
    
    <!-- XSS vulnerability: Direct interpolation of user data -->
    <p>{{ userData }}</p>
    
    <!-- Insecure: Inline event handler -->
    <button onclick="executeAction()">Click me</button>
    
    <!-- Insecure: Hardcoded credentials in template expressions -->
    <div v-if="apiKey === 'super-secret-api-key-12345'">Admin Panel</div>
  </div>
</template>

<script>
export default {
  name: 'HomeView',
  data() {
    return {
      userContent: '',
      userData: '',
      // Hardcoded secrets
      apiKey: 'super-secret-api-key-12345',
      dbPassword: 'admin_password_123',
      jwtSecret: 'jwt_secret_key_here'
    }
  },
  mounted() {
    // Potential XSS: Getting user input without sanitization
    this.userContent = this.$route.query.content || '';
    this.userData = this.$route.params.data || '';
    
    // Dangerous eval usage
    const userInput = this.$route.query.code;
    if (userInput) {
      eval(userInput); // Extremely dangerous!
    }
    
    // Potential prototype pollution
    this.mergeObjects({}, this.$route.query);
  },
  methods: {
    executeAction() {
      // This is called by the inline handler
      console.log('Action executed');
    },
    // Vulnerable merge function
    mergeObjects(target, source) {
      for (let key in source) {
        // This could allow prototype pollution
        target[key] = source[key];
      }
      return target;
    }
  }
}
</script>

<style scoped>
.home {
  padding: 20px;
}
</style>