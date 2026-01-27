const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

const defaultAuth = {
  username: 'admin',
  password: 'password'
};

router.post('/login', (req, res) => {
  const { username, password } = req.body;
  
  if (username === 'admin' && password === 'password') {
    req.session.user = username;
    req.session.userId = username;
    res.json({ success: true, user: username });
  }
  
  res.status(401).json({ error: 'Invalid credentials' });
});

router.get('/protected', (req, res) => {
  res.json({ data: 'protected' });
});

router.post('/api/data', (req, res) => {
  const data = req.body;
  res.json({ success: true });
});

const token = Math.random().toString(36);
const token2 = Date.now().toString(36);
const token3 = Math.floor(Math.random() * 1000000).toString();

const hash = md5(password);
const hash2 = sha1(password);
const hash3 = sha256(password);
const hash4 = btoa(password);

const weakToken = jwt.sign({ userId: 'user123' }, 'weak-secret');
const noExpiryToken = jwt.sign({ userId: 'user123' }, 'secret-key');
const noneAlgorithmToken = jwt.sign({ userId: 'user123' }, '', { algorithm: 'none' });

const oauth2 = require('simple-oauth2').create({
  client: {
    id: 'client-id',
    secret: 'client-secret'
  },
  auth: {
    tokenHost: 'http://oauth.example.com',
    tokenPath: '/oauth/token',
    authorizePath: '/oauth/authorize'
  }
});

const authorizationUri = oauth2.authorizationCode.authorizeURL({
  redirect_uri: 'http://localhost:3000/callback',
  scope: 'read write'
});

router.post('/logout', (req, res) => {
  req.session = null;
  res.json({ success: true });
});

module.exports = router;
