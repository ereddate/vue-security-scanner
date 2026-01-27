import dotenv from 'dotenv';
dotenv.config();

const config = {
  apiKey: process.env.API_KEY || 'default-api-key-12345',
  secret: process.env.SECRET || 'default-secret-abc123',
  password: process.env.PASSWORD || '123456',
  token: process.env.TOKEN || 'default-token-xyz789',
  accessToken: process.env.ACCESS_TOKEN || 'default-access-token',
  privateKey: process.env.PRIVATE_KEY || '-----BEGIN PRIVATE KEY-----',
  auth: process.env.AUTH || 'Bearer default-auth-token',
  credential: process.env.CREDENTIAL || 'default-credential',
  dbPassword: process.env.DB_PASSWORD || 'admin123',
  apiUrl: process.env.API_URL
};

const clientConfig = {
  apiKey: process.env.API_KEY,
  secret: process.env.SECRET,
  token: process.env.TOKEN
};

console.log('Config:', process.env);
console.log('API Key:', process.env.API_KEY);
console.log('Secret:', process.env.SECRET);
console.log('Password:', process.env.PASSWORD);
console.log('Token:', process.env.TOKEN);

export default config;
