import express from 'express';
import {
  getWatchlist,
  addToWatchlist,
  removeFromWatchlist,
  getWatchedItems,
  markAsWatched,
  removeFromWatched,
  rateItem,
  getUserRatings,
} from '../controllers/userController';
import { protect } from '../middleware/auth';

const router = express.Router();

// All routes need authentication
router.use(protect);

// Watchlist routes
router.route('/watchlist')
  .get(getWatchlist)
  .post(addToWatchlist);
router.delete('/watchlist/:itemType/:itemId', removeFromWatchlist);

// Watched items routes
router.route('/watched')
  .get(getWatchedItems)
  .post(markAsWatched);
router.delete('/watched/:itemType/:itemId', removeFromWatched);

// Rating routes
router.route('/ratings')
  .get(getUserRatings)
  .post(rateItem);

export default router;