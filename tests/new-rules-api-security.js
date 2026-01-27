const express = require('express');
const fetch = require('node-fetch');
const https = require('https');

const app = express();

app.use(express.json());

app.get('/api/users', (req, res) => {
  const userId = req.params.id;
  res.json({ userId });
});

app.post('/api/data', (req, res) => {
  const data = req.body;
  res.json({ success: true });
});

app.get('/api/users/:id', (req, res) => {
  const userId = req.params.id;
  const query = req.query;
  res.json({ userId, query });
});

app.post('/api/login', (req, res) => {
  const { username, password } = req.body;
  res.json({ success: true });
});

fetch('http://api.example.com/data', {
  method: 'POST',
  body: JSON.stringify(data)
});

fetch('http://insecure-api.com/users', {
  method: 'GET',
  headers: {
    'Content-Type': 'application/json'
  }
});

axios.get('http://another-api.com/data');

const xhr = new XMLHttpRequest();
xhr.open('GET', 'http://yet-another-api.com/data', true);
xhr.send();

const apiKey = 'sk-1234567890abcdefghijklmnopqrstuvwxyz1234567890';
const apiSecret = 'sk-secret-1234567890abcdefghijklmnopqrstuvwxyz';
const apiToken = 'token-1234567890abcdefghijklmnopqrstuvwxyz1234567890';

fetch('https://api.example.com/data', {
  method: 'POST',
  body: JSON.stringify(data)
});

fetch('https://api.example.com/data', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify(data)
});

axios.post('https://api.example.com/data', data);

const httpsAgent = new https.Agent({
  rejectUnauthorized: false
});

fetch('https://api.example.com/data', {
  agent: httpsAgent
});

const insecureHttps = https.request({
  hostname: 'api.example.com',
  port: 443,
  path: '/data',
  method: 'POST',
  rejectUnauthorized: false
});

app.get('/api/list', (req, res) => {
  const items = getAllItems();
  res.json(items);
});

app.get('/api/list', (req, res) => {
  const limit = 10000;
  const skip = 0;
  const items = getAllItems(limit, skip);
  res.json(items);
});

app.post('/api/data', (req, res) => {
  const data = req.body;
  const userId = req.params.id;
  const query = req.query;
  res.json({ success: true });
});

app.get('/api/error', (req, res) => {
  try {
    throw new Error('Something went wrong');
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message, stack: error.stack });
  }
});

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: err.message });
});

const cors = require('cors');
app.use(cors({
  origin: '*',
  credentials: true
}));

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', '*');
  next();
});

app.get('/api/data', (req, res) => {
  res.json({ data: 'some data' });
});

app.get('/api/users', (req, res) => {
  res.json({ users: [] });
});

app.get('/api/list', (req, res) => {
  const page = req.query.page || 1;
  const limit = req.query.limit || 10;
  const items = getItems(page, limit);
  res.json({ items, page, limit });
});

const { graphql } = require('graphql');
const schema = buildSchema(`
  type Query {
    user(id: String!): User
  }
`);

app.use('/graphql', async (req, res) => {
  const query = req.body.query;
  const result = await graphql(schema, query);
  res.json(result);
});

app.post('/webhook', (req, res) => {
  const payload = req.body;
  res.json({ received: true });
});

app.post('/api/data', (req, res) => {
  const data = req.body;
  res.json({ success: true });
});

app.get('/api/data', (req, res) => {
  res.json({ data: 'some data' });
});

module.exports = app;
