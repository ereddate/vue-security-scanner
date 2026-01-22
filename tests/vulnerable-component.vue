// Test file to simulate a vulnerable Vue component for testing purposes
export default {
  name: 'VulnerableComponent',
  data() {
    return {
      userInput: '<script>alert("XSS")</script>',
      apiUrl: 'https://api.example.com',
      apiKey: 'sk-1234567890abcdef' // This should be flagged as hardcoded secret
    }
  },
  template: `
    <div>
      <!-- This should be flagged as potential XSS -->
      <div v-html="userInput"></div>
      
      <!-- This should be flagged as inline event handler -->
      <button onclick="doSomething()">Click me</button>
      
      <!-- This should be flagged as potential template injection -->
      {{ userInput }}
    </div>
  `,
  methods: {
    fetchData() {
      // Potential security issue: hardcoded API key
      fetch(this.apiUrl, {
        headers: {
          'Authorization': `Bearer ${this.apiKey}`
        }
      })
    }
  }
}