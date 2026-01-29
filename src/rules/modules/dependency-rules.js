const dependencyRules = [
  {
    id: 'vulnerable-lodash',
    name: 'Vulnerable Lodash Version',
    severity: 'High',
    description: 'Lodash version has known security vulnerabilities',
    recommendation: 'Update Lodash to version 4.17.21 or later.',
    patterns: [
      { key: 'lodash-version', pattern: '"lodash"\\s*:\\s*"[~^]?[0-3]\\.' }
    ]
  },
  {
    id: 'vulnerable-lodash-es',
    name: 'Vulnerable Lodash-ES Version',
    severity: 'High',
    description: 'Lodash-ES version has known security vulnerabilities',
    recommendation: 'Update Lodash-ES to version 4.17.21 or later.',
    patterns: [
      { key: 'lodash-es-version', pattern: '"lodash-es"\\s*:\\s*"[~^]?[0-3]\\.' }
    ]
  },
  {
    id: 'vulnerable-moment',
    name: 'Vulnerable Moment Version',
    severity: 'High',
    description: 'Moment.js version has known security vulnerabilities',
    recommendation: 'Update Moment.js to version 2.29.2 or later.',
    patterns: [
      { key: 'moment-version', pattern: '"moment"\\s*:\\s*"[~^]?[0-1]\\.' }
    ]
  },
  {
    id: 'vulnerable-axios',
    name: 'Vulnerable Axios Version',
    severity: 'High',
    description: 'Axios version has known security vulnerabilities',
    recommendation: 'Update Axios to version 0.21.3 or later.',
    patterns: [
      { key: 'axios-version', pattern: '"axios"\\s*:\\s*"[~^]?0\\.(1[0-9]|0\\.[0-9])' }
    ]
  },
  {
    id: 'vulnerable-express',
    name: 'Vulnerable Express Version',
    severity: 'High',
    description: 'Express version has known security vulnerabilities',
    recommendation: 'Update Express to version 4.17.3 or later.',
    patterns: [
      { key: 'express-version', pattern: '"express"\\s*:\\s*"[~^]?[0-3]\\.' }
    ]
  },
  {
    id: 'vulnerable-jquery',
    name: 'Vulnerable jQuery Version',
    severity: 'High',
    description: 'jQuery version has known security vulnerabilities',
    recommendation: 'Update jQuery to version 3.5.0 or later.',
    patterns: [
      { key: 'jquery-version', pattern: '"jquery"\\s*:\\s*"[~^]?[0-2]\\.' }
    ]
  },
  {
    id: 'vulnerable-vue2',
    name: 'Vulnerable Vue 2 Version',
    severity: 'High',
    description: 'Vue 2 version has known security vulnerabilities',
    recommendation: 'Update Vue to version 2.6.14 or later, or migrate to Vue 3.',
    patterns: [
      { key: 'vue2-version', pattern: '"vue"\\s*:\\s*"[~^]?2\\.[0-5]\\.' }
    ]
  },
  {
    id: 'vulnerable-vue-router',
    name: 'Vulnerable Vue Router Version',
    severity: 'High',
    description: 'Vue Router version has known security vulnerabilities',
    recommendation: 'Update Vue Router to version 3.5.3 or later.',
    patterns: [
      { key: 'vue-router-version', pattern: '"vue-router"\\s*:\\s*"[~^]?[0-2]\\.' }
    ]
  },
  {
    id: 'vulnerable-vuex',
    name: 'Vulnerable Vuex Version',
    severity: 'High',
    description: 'Vuex version has known security vulnerabilities',
    recommendation: 'Update Vuex to version 3.6.2 or later.',
    patterns: [
      { key: 'vuex-version', pattern: '"vuex"\\s*:\\s*"[~^]?[0-2]\\.' }
    ]
  },
  {
    id: 'vulnerable-react',
    name: 'Vulnerable React Version',
    severity: 'High',
    description: 'React version has known security vulnerabilities',
    recommendation: 'Update React to version 16.13.1 or later.',
    patterns: [
      { key: 'react-version', pattern: '"react"\\s*:\\s*"[~^]?[0-15]\\.' }
    ]
  },
  {
    id: 'vulnerable-react-dom',
    name: 'Vulnerable React DOM Version',
    severity: 'High',
    description: 'React DOM version has known security vulnerabilities',
    recommendation: 'Update React DOM to version 16.13.1 or later.',
    patterns: [
      { key: 'react-dom-version', pattern: '"react-dom"\\s*:\\s*"[~^]?[0-15]\\.' }
    ]
  },
  {
    id: 'vulnerable-react-router',
    name: 'Vulnerable React Router Version',
    severity: 'High',
    description: 'React Router version has known security vulnerabilities',
    recommendation: 'Update React Router to version 5.2.0 or later.',
    patterns: [
      { key: 'react-router-version', pattern: '"react-router"\\s*:\\s*"[~^]?[0-4]\\.' }
    ]
  },
  {
    id: 'vulnerable-react-redux',
    name: 'Vulnerable React Redux Version',
    severity: 'High',
    description: 'React Redux version has known security vulnerabilities',
    recommendation: 'Update React Redux to version 7.2.3 or later.',
    patterns: [
      { key: 'react-redux-version', pattern: '"react-redux"\\s*:\\s*"[~^]?[0-6]\\.' }
    ]
  },
  {
    id: 'vulnerable-mongoose',
    name: 'Vulnerable Mongoose Version',
    severity: 'High',
    description: 'Mongoose version has known security vulnerabilities',
    recommendation: 'Update Mongoose to version 5.13.0 or later.',
    patterns: [
      { key: 'mongoose-version', pattern: '"mongoose"\\s*:\\s*"[~^]?[0-4]\\.' }
    ]
  },
  {
    id: 'vulnerable-sequelize',
    name: 'Vulnerable Sequelize Version',
    severity: 'High',
    description: 'Sequelize version has known security vulnerabilities',
    recommendation: 'Update Sequelize to version 6.6.0 or later.',
    patterns: [
      { key: 'sequelize-version', pattern: '"sequelize"\\s*:\\s*"[~^]?[0-5]\\.' }
    ]
  },
  {
    id: 'vulnerable-express-validator',
    name: 'Vulnerable Express Validator Version',
    severity: 'High',
    description: 'Express Validator version has known security vulnerabilities',
    recommendation: 'Update Express Validator to version 6.12.0 or later.',
    patterns: [
      { key: 'express-validator-version', pattern: '"express-validator"\\s*:\\s*"[~^]?[0-5]\\.' }
    ]
  },
  {
    id: 'vulnerable-helmet',
    name: 'Vulnerable Helmet Version',
    severity: 'High',
    description: 'Helmet version has known security vulnerabilities',
    recommendation: 'Update Helmet to version 4.6.0 or later.',
    patterns: [
      { key: 'helmet-version', pattern: '"helmet"\\s*:\\s*"[~^]?[0-3]\\.' }
    ]
  },
  {
    id: 'vulnerable-passport',
    name: 'Vulnerable Passport Version',
    severity: 'High',
    description: 'Passport version has known security vulnerabilities',
    recommendation: 'Update Passport to version 0.4.1 or later.',
    patterns: [
      { key: 'passport-version', pattern: '"passport"\\s*:\\s*"[~^]?[0-3]\\.' }
    ]
  },
  {
    id: 'vulnerable-bcrypt',
    name: 'Vulnerable Bcrypt Version',
    severity: 'High',
    description: 'Bcrypt version has known security vulnerabilities',
    recommendation: 'Update Bcrypt to version 5.0.1 or later.',
    patterns: [
      { key: 'bcrypt-version', pattern: '"bcrypt"\\s*:\\s*"[~^]?[0-4]\\.' }
    ]
  },
  {
    id: 'vulnerable-jsonwebtoken',
    name: 'Vulnerable JsonWebToken Version',
    severity: 'High',
    description: 'JsonWebToken version has known security vulnerabilities',
    recommendation: 'Update JsonWebToken to version 8.5.1 or later.',
    patterns: [
      { key: 'jsonwebtoken-version', pattern: '"jsonwebtoken"\\s*:\\s*"[~^]?[0-7]\\.' }
    ]
  },
  {
    id: 'vulnerable-socket-io',
    name: 'Vulnerable Socket.io Version',
    severity: 'High',
    description: 'Socket.io version has known security vulnerabilities',
    recommendation: 'Update Socket.io to version 4.4.0 or later.',
    patterns: [
      { key: 'socket-io-version', pattern: '"socket.io"\\s*:\\s*"[~^]?[0-3]\\.' }
    ]
  },
  {
    id: 'vulnerable-koa',
    name: 'Vulnerable Koa Version',
    severity: 'High',
    description: 'Koa version has known security vulnerabilities',
    recommendation: 'Update Koa to version 2.13.0 or later.',
    patterns: [
      { key: 'koa-version', pattern: '"koa"\\s*:\\s*"[~^]?[0-1]\\.' }
    ]
  },
  {
    id: 'vulnerable-fastify',
    name: 'Vulnerable Fastify Version',
    severity: 'High',
    description: 'Fastify version has known security vulnerabilities',
    recommendation: 'Update Fastify to version 3.20.0 or later.',
    patterns: [
      { key: 'fastify-version', pattern: '"fastify"\\s*:\\s*"[~^]?[0-2]\\.' }
    ]
  },
  {
    id: 'vulnerable-next',
    name: 'Vulnerable Next.js Version',
    severity: 'High',
    description: 'Next.js version has known security vulnerabilities',
    recommendation: 'Update Next.js to version 10.2.0 or later.',
    patterns: [
      { key: 'next-version', pattern: '"next"\\s*:\\s*"[~^]?[0-9]\\.' }
    ]
  },
  {
    id: 'vulnerable-nuxt',
    name: 'Vulnerable Nuxt.js Version',
    severity: 'High',
    description: 'Nuxt.js version has known security vulnerabilities',
    recommendation: 'Update Nuxt.js to version 2.15.0 or later.',
    patterns: [
      { key: 'nuxt-version', pattern: '"nuxt"\\s*:\\s*"[~^]?[0-1]\\.' }
    ]
  },
  {
    id: 'vulnerable-gatsby',
    name: 'Vulnerable Gatsby Version',
    severity: 'High',
    description: 'Gatsby version has known security vulnerabilities',
    recommendation: 'Update Gatsby to version 3.13.0 or later.',
    patterns: [
      { key: 'gatsby-version', pattern: '"gatsby"\\s*:\\s*"[~^]?[0-2]\\.' }
    ]
  },
  {
    id: 'vulnerable-angular',
    name: 'Vulnerable Angular Version',
    severity: 'High',
    description: 'Angular version has known security vulnerabilities',
    recommendation: 'Update Angular to version 12.0.0 or later.',
    patterns: [
      { key: 'angular-version', pattern: '"angular"\\s*:\\s*"[~^]?[0-11]\\.' }
    ]
  },
  {
    id: 'vulnerable-angular-core',
    name: 'Vulnerable @angular/core Version',
    severity: 'High',
    description: '@angular/core version has known security vulnerabilities',
    recommendation: 'Update @angular/core to version 12.0.0 or later.',
    patterns: [
      { key: 'angular-core-version', pattern: '"@angular/core"\\s*:\\s*"[~^]?[0-11]\\.' }
    ]
  },
  {
    id: 'vulnerable-node-fetch',
    name: 'Vulnerable Node Fetch Version',
    severity: 'High',
    description: 'Node Fetch version has known security vulnerabilities',
    recommendation: 'Update Node Fetch to version 2.6.7 or later.',
    patterns: [
      { key: 'node-fetch-version', pattern: '"node-fetch"\\s*:\\s*"[~^]?[0-1]\\.' }
    ]
  },
  {
    id: 'vulnerable-npm',
    name: 'Vulnerable NPM Version',
    severity: 'High',
    description: 'NPM version has known security vulnerabilities',
    recommendation: 'Update NPM to the latest version.',
    patterns: [
      { key: 'npm-version', pattern: '"npm"\\s*:\\s*"[~^]?[0-6]\\.' }
    ]
  },
  {
    id: 'vulnerable-webpack',
    name: 'Vulnerable Webpack Version',
    severity: 'High',
    description: 'Webpack version has known security vulnerabilities',
    recommendation: 'Update Webpack to version 5.0.0 or later.',
    patterns: [
      { key: 'webpack-version', pattern: '"webpack"\\s*:\\s*"[~^]?[0-4]\\.' }
    ]
  },
  {
    id: 'vulnerable-rollup',
    name: 'Vulnerable Rollup Version',
    severity: 'High',
    description: 'Rollup version has known security vulnerabilities',
    recommendation: 'Update Rollup to version 2.0.0 or later.',
    patterns: [
      { key: 'rollup-version', pattern: '"rollup"\\s*:\\s*"[~^]?[0-1]\\.' }
    ]
  },
  {
    id: 'dependency-license-gpl',
    name: 'GPL License Dependency',
    severity: 'Medium',
    description: 'Dependency uses GPL license which may have copyleft requirements',
    recommendation: 'Review GPL license implications. Consider alternative dependencies with permissive licenses.',
    patterns: [
      { key: 'license-gpl', pattern: '"license"\\s*:\\s*"[^"]*GPL[^"]*"' }
    ]
  },
  {
    id: 'dependency-license-agpl',
    name: 'AGPL License Dependency',
    severity: 'High',
    description: 'Dependency uses AGPL license which has strong copyleft requirements',
    recommendation: 'Review AGPL license implications. Consider alternative dependencies with permissive licenses.',
    patterns: [
      { key: 'license-agpl', pattern: '"license"\\s*:\\s*"[^"]*AGPL[^"]*"' }
    ]
  },
  {
    id: 'dependency-license-commercial',
    name: 'Commercial License Dependency',
    severity: 'Medium',
    description: 'Dependency uses commercial license which may require payment',
    recommendation: 'Review commercial license terms. Ensure proper licensing for production use.',
    patterns: [
      { key: 'license-commercial', pattern: '"license"\\s*:\\s*"[^"]*Commercial[^"]*"' }
    ]
  },
  {
    id: 'dependency-license-unknown',
    name: 'Unknown License Dependency',
    severity: 'Low',
    description: 'Dependency has unknown or missing license',
    recommendation: 'Verify dependency license. Use dependencies with clear, permissive licenses.',
    patterns: [
      { key: 'license-unknown', pattern: '"license"\\s*:\\s*"[^"]*Unknown[^"]*"' }
    ]
  }
];

module.exports = dependencyRules;