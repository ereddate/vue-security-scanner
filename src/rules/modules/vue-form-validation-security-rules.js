const vueFormValidationSecurityRules = [
  {
    id: 'vuelidate-security',
    name: 'Vuelidate Security Check',
    severity: 'Medium',
    description: 'Vuelidate form validation security issues',
    recommendation: 'Ensure Vuelidate validation rules are properly configured and cannot be bypassed.',
    patterns: [
      { key: 'vuelidate-import', pattern: 'from\\s*["\']@vuelidate/core["\']' },
      { key: 'vuelidate-usage', pattern: 'useVuelidate|vuelidate\\.' },
      { key: 'vuelidate-rules', pattern: 'rules\\s*:\\s*\\{[^}]+\\}' }
    ]
  },
  {
    id: 'veevalidate-security',
    name: 'VeeValidate Security Check',
    severity: 'Medium',
    description: 'VeeValidate form validation security issues',
    recommendation: 'Ensure VeeValidate validation rules are properly configured and cannot be bypassed.',
    patterns: [
      { key: 'veevalidate-import', pattern: 'from\\s*["\']vee-validate["\']' },
      { key: 'veevalidate-usage', pattern: 'useForm|useField|veeValidate\\.' },
      { key: 'veevalidate-rules', pattern: 'rules\\s*:\\s*\\{[^}]+\\}' }
    ]
  },
  {
    id: 'formkit-security',
    name: 'FormKit Security Check',
    severity: 'Medium',
    description: 'FormKit form validation security issues',
    recommendation: 'Ensure FormKit validation rules are properly configured and cannot be bypassed.',
    patterns: [
      { key: 'formkit-import', pattern: 'from\\s*["\']@formkit/vue["\']' },
      { key: 'formkit-usage', pattern: 'FormKit|useFormKit|formkit\\.' },
      { key: 'formkit-rules', pattern: 'validation\\s*:\\s*["\'][^"\']*["\']' }
    ]
  },
  {
    id: 'vue-formulate-security',
    name: 'Vue Formulate Security Check',
    severity: 'Medium',
    description: 'Vue Formulate form validation security issues',
    recommendation: 'Ensure Vue Formulate validation rules are properly configured and cannot be bypassed.',
    patterns: [
      { key: 'formulate-import', pattern: 'from\\s*["\']@braid/vue-formulate["\']' },
      { key: 'formulate-usage', pattern: 'Formulate|formulate\\.' },
      { key: 'formulate-rules', pattern: 'validation\\s*:\\s*["\'][^"\']*["\']' }
    ]
  },
  {
    id: 'form-validation-bypass',
    name: 'Form Validation Bypass',
    severity: 'High',
    description: 'Potential form validation bypass vulnerabilities',
    recommendation: 'Implement server-side validation as a second layer of defense. Never trust client-side validation alone.',
    patterns: [
      { key: 'submit-without-validation', pattern: '@submit\\s*=\\s*["\'][^"\']*["\']' },
      { key: 'native-submit', pattern: 'type\\s*=\\s*["\']submit["\']' },
      { key: 'form-action', pattern: 'action\\s*=\\s*["\'][^"\']*["\']' }
    ]
  },
  {
    id: 'form-field-security',
    name: 'Form Field Security',
    severity: 'Medium',
    description: 'Potential form field security issues',
    recommendation: 'Validate all form fields. Use proper input types. Implement input sanitization.',
    patterns: [
      { key: 'input-field', pattern: '<input[^>]*>' },
      { key: 'textarea-field', pattern: '<textarea[^>]*>' },
      { key: 'select-field', pattern: '<select[^>]*>' }
    ]
  },
  {
    id: 'form-data-security',
    name: 'Form Data Security',
    severity: 'High',
    description: 'Potential form data security issues',
    recommendation: 'Encrypt sensitive form data. Use HTTPS for form submissions. Implement CSRF protection.',
    patterns: [
      { key: 'form-data', pattern: 'FormData\\s*\\(' },
      { key: 'axios-post', pattern: 'axios\\.post\\s*\\(' },
      { key: 'fetch-post', pattern: 'fetch\\s*\\(\\s*[^"\'`][^,]+,\\s*\\{[^}]*method\\s*:\\s*["\']POST["\'][^}]*\\}' }
    ]
  }
];

module.exports = vueFormValidationSecurityRules;