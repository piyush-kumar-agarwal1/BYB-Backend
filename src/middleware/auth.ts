import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User';
import config from '../config';

// Add type for decoded token
interface DecodedToken {
  id: string;
  iat: number;
  exp: number;
}

// Extend Express Request type
declare global {
  namespace Express {
    interface Request {
      user?: any;
    }
  }
}

export const protect = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let token;
  
  console.log('Auth middleware - Headers:', req.headers);
  console.log('Auth middleware - Cookies:', req.cookies);

  // Check for token in headers
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    // Set token from Bearer token
    token = req.headers.authorization.split(' ')[1];
    console.log('Found token in Authorization header');
  } 
  // Check for token in cookies
  else if (req.cookies?.token) {
    token = req.cookies.token;
    console.log('Found token in cookies');
  }

  // Make sure token exists
  if (!token) {
    console.log('No token found');
    return res.status(401).json({
      success: false,
      message: 'Not authorized to access this route'
    });
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, config.JWT_SECRET) as DecodedToken;
    console.log('Token verified:', decoded);

    // Get user from the token
    const user = await User.findById(decoded.id);

    if (!user) {
      console.log('User not found for ID:', decoded.id);
      return res.status(401).json({
        success: false,
        message: 'User not found'
      });
    }

    console.log('User authenticated:', user._id);
    // Add user to request
    req.user = user;
    next();
  } catch (error) {
    console.error('Token verification failed:', error);
    return res.status(401).json({
      success: false,
      message: 'Not authorized to access this route'
    });
  }
};