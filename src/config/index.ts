import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

export default {
  PORT: process.env.PORT || 5000,
  MONGODB_URI: process.env.MONGODB_URI || 'mongodb+srv://apiyush385:BYIIFGMaA9VCRihq@byb.o0ipw94.mongodb.net/?retryWrites=true&w=majority&appName=BYB',
  JWT_SECRET: process.env.JWT_SECRET || 'd0685fe55ae84046251314a11a0cd736d2e0b2b089ccc203ba94e5c84bbf6814',
  NODE_ENV: process.env.NODE_ENV || 'development',
  CLIENT_URL: process.env.NODE_ENV === 'production' 
    ? 'https://byb-app.netlify.app' 
    : 'http://localhost:5173'
};