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

// Updated CORS configuration to allow multiple origins
app.use(cors({
  origin: function(origin, callback) {
    const allowedOrigins = [
      'https://break-your-boredom.vercel.app',  // Add your deployed frontend URL
      'http://localhost:5173', 
      'http://localhost:8080',
      'http://localhost:8081'
    ];
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) === -1) {
      const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  credentials: true
}));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);

// Health check route
app.get('/health', (req, res) => {
  res.status(200).send('Server is running!');
});

// Error handling middleware
app.use(errorHandler);

export default app;