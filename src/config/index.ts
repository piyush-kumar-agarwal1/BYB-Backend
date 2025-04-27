import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

export default {
  PORT: process.env.PORT || 5000,
  MONGODB_URI: process.env.MONGODB_URI || 'mongodb://localhost:27017/byb',
  JWT_SECRET: process.env.JWT_SECRET || 'dev_secret_only',
  NODE_ENV: process.env.NODE_ENV || 'development',
  CLIENT_URL: process.env.CLIENT_URL || 
    (process.env.NODE_ENV === 'production' 
      ? 'https://break-your-boredom.vercel.app/' 
      : 'http://localhost:5173')
};