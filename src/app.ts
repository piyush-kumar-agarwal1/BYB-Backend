import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import authRoutes from './routes/authRoutes';
import userRoutes from './routes/userRoutes';
import errorHandler from './middleware/errorHandler';
import config from './config';

const app = express();

// Middleware
app.use(express.json());
app.use(cookieParser());

// Updated CORS configuration with better debugging and error handling
app.use(cors({
  origin: function(origin, callback) {
    console.log("Request origin:", origin); // Add this for debugging
    
    const allowedOrigins = [
      'https://break-your-boredom.vercel.app',
      'http://localhost:5173',
      'http://localhost:8080',
      'http://localhost:8081'
    ];
    
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) {
      console.log("No origin, allowing request");
      return callback(null, true);
    }
    
    if (allowedOrigins.indexOf(origin) !== -1) {
      console.log("Origin allowed:", origin);
      return callback(null, true);
    }
    
    console.log("Origin rejected:", origin);
    return callback(new Error('CORS not allowed for this origin'), false);
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Origin', 'X-Requested-With', 'Content-Type', 'Accept', 'Authorization']
}));

// Add this before your routes
app.options('*', cors());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);

// Health check route
app.get('/health', (req, res) => {
  res.status(200).send('Server is running!');
});

// Error handling middleware
app.use(errorHandler);

// For serverless environments like Vercel
if (process.env.NODE_ENV === 'production') {
  // Make sure we handle OPTIONS requests properly for CORS
  app.options('*', cors());
}

export default app;