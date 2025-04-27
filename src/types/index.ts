// filepath: byb-backend/src/types/index.ts
import { Request } from 'express';

export interface User {
  id: string;
  username: string;
  email: string;
  password: string; // Consider excluding this in responses
}

export interface AuthPayload {
  userId: string;
  token: string;
}

export interface WatchlistItem {
  itemId: string;
  title: string;
  type: string; // e.g., movie, series
}

export interface WatchedItem {
  userId: string;
  itemId: string;
}

export interface Rating {
  userId: string;
  itemId: string;
  rating: number; // e.g., 1 to 5
}

export interface RequestWithUser extends Request {
  user: {
    id: string;
    name: string;
    email: string;
  };
}