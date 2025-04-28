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

// Simplified CORS configuration for Vercel
app.use(cors({
  origin: ['https://break-your-boredom.vercel.app', 'http://localhost:5173', 'http://localhost:8080'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Origin', 'X-Requested-With', 'Content-Type', 'Accept', 'Authorization']
}));

// Handle preflight requests for all routes
app.options('*', cors());

// Add redirects for auth endpoints without /api prefix
app.post('/login', (req, res) => {
  req.url = '/api/auth/login';
  app._router.handle(req, res);
});

app.post('/register', (req, res) => {
  req.url = '/api/auth/register';
  app._router.handle(req, res);
});

app.post('/logout', (req, res) => {
  req.url = '/api/auth/logout';
  app._router.handle(req, res);
});

app.get('/me', (req, res) => {
  req.url = '/api/auth/me';
  app._router.handle(req, res);
});

// Add redirects for user endpoints without /api prefix

// User watchlist endpoints
app.get('/user/watchlist', (req, res) => {
  req.url = '/api/user/watchlist';
  app._router.handle(req, res);
});

app.post('/user/watchlist', (req, res) => {
  req.url = '/api/user/watchlist';
  app._router.handle(req, res);
});

app.delete('/user/watchlist/:itemType/:itemId', (req, res) => {
  req.url = `/api/user/watchlist/${req.params.itemType}/${req.params.itemId}`;
  app._router.handle(req, res);
});

// User watched endpoints
app.get('/user/watched', (req, res) => {
  req.url = '/api/user/watched';
  app._router.handle(req, res);
});

app.post('/user/watched', (req, res) => {
  req.url = '/api/user/watched';
  app._router.handle(req, res);
});

app.delete('/user/watched/:itemType/:itemId', (req, res) => {
  req.url = `/api/user/watched/${req.params.itemType}/${req.params.itemId}`;
  app._router.handle(req, res);
});

// User ratings endpoints
app.get('/user/ratings', (req, res) => {
  req.url = '/api/user/ratings';
  app._router.handle(req, res);
});

app.post('/user/ratings', (req, res) => {
  req.url = '/api/user/ratings';
  app._router.handle(req, res);
});

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