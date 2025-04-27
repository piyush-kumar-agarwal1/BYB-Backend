import dotenv from 'dotenv';
import mongoose from 'mongoose';
import app from './app';
import config from './config';

// Load env vars
dotenv.config();

// Connect to database
mongoose.connect(config.MONGODB_URI)
  .then(() => {
    console.log('MongoDB Connected');
    
    const PORT = config.PORT;
    
    const server = app.listen(PORT, () => {
      console.log(`Server running in ${config.NODE_ENV} mode on port ${PORT}`);
    });

    // Handle unhandled promise rejections
    process.on('unhandledRejection', (err: Error) => {
      console.log(`Error: ${err.message}`);
      // Close server & exit process
      server.close(() => process.exit(1));
    });
  })
  .catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });