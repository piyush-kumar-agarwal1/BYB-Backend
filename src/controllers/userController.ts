import { Request, Response } from 'express';
import User from '../models/User';
import Watchlist from '../models/Watchlist';
import WatchedItem from '../models/WatchedItem';
import Rating from '../models/Rating';

// Fix error handling in UserController class
class UserController {
  async getUserProfile(req: Request, res: Response) {
    try {
      const userId = req.user.id;
      const user = await User.findById(userId).select('-password');
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      res.status(200).json(user);
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      res.status(500).json({ message: 'Server error', error: errorMessage });
    }
  }

  async updateUserProfile(req: Request, res: Response) {
    try {
      const userId = req.user.id;
      const { username, email } = req.body;

      const updatedUser = await User.findByIdAndUpdate(
        userId,
        { username, email },
        { new: true, runValidators: true }
      ).select('-password');

      if (!updatedUser) {
        return res.status(404).json({ message: 'User not found' });
      }
      res.status(200).json(updatedUser);
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      res.status(500).json({ message: 'Server error', error: errorMessage });
    }
  }
}

// @desc    Get user's watchlist
// @route   GET /api/user/watchlist
// @access  Private
export const getWatchlist = async (req: Request, res: Response) => {
  try {
    const watchlist = await Watchlist.find({ user: req.user.id });

    res.status(200).json({
      success: true,
      data: watchlist,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};

// @desc    Add item to watchlist
// @route   POST /api/user/watchlist
// @access  Private
export const addToWatchlist = async (req: Request, res: Response) => {
  try {
    const { itemType, itemId } = req.body;

    // Validate item type
    if (!['movie', 'series', 'anime', 'book'].includes(itemType)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid item type',
      });
    }

    // Check if already in watchlist
    const existing = await Watchlist.findOne({
      user: req.user.id,
      itemType,
      itemId,
    });

    if (existing) {
      return res.status(400).json({
        success: false,
        message: 'Item already in watchlist',
      });
    }

    // Add to watchlist
    const watchlistItem = await Watchlist.create({
      user: req.user.id,
      itemType,
      itemId,
    });

    res.status(201).json({
      success: true,
      data: watchlistItem,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};

// @desc    Remove item from watchlist
// @route   DELETE /api/user/watchlist/:itemType/:itemId
// @access  Private
export const removeFromWatchlist = async (req: Request, res: Response) => {
  try {
    const { itemType, itemId } = req.params;

    // Remove from watchlist
    const result = await Watchlist.findOneAndDelete({
      user: req.user.id,
      itemType,
      itemId,
    });

    if (!result) {
      return res.status(404).json({
        success: false,
        message: 'Item not found in watchlist',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Item removed from watchlist',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};

// @desc    Get user's watched items
// @route   GET /api/user/watched
// @access  Private
export const getWatchedItems = async (req: Request, res: Response) => {
  try {
    const watchedItems = await WatchedItem.find({ user: req.user.id });

    res.status(200).json({
      success: true,
      data: watchedItems,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};

// @desc    Mark item as watched
// @route   POST /api/user/watched
// @access  Private
export const markAsWatched = async (req: Request, res: Response) => {
  try {
    const { itemType, itemId } = req.body;

    // Validate item type
    if (!['movie', 'series', 'anime', 'book'].includes(itemType)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid item type',
      });
    }

    // Check if already marked as watched
    const existing = await WatchedItem.findOne({
      user: req.user.id,
      itemType,
      itemId,
    });

    if (existing) {
      return res.status(400).json({
        success: false,
        message: 'Item already marked as watched',
      });
    }

    // Add to watched items
    const watchedItem = await WatchedItem.create({
      user: req.user.id,
      itemType,
      itemId,
    });

    res.status(201).json({
      success: true,
      data: watchedItem,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};

// @desc    Remove item from watched
// @route   DELETE /api/user/watched/:itemType/:itemId
// @access  Private
export const removeFromWatched = async (req: Request, res: Response) => {
  try {
    const { itemType, itemId } = req.params;

    // Remove from watched items
    const result = await WatchedItem.findOneAndDelete({
      user: req.user.id,
      itemType,
      itemId,
    });

    if (!result) {
      return res.status(404).json({
        success: false,
        message: 'Item not found in watched list',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Item removed from watched list',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};

// @desc    Rate an item
// @route   POST /api/user/ratings
// @access  Private
export const rateItem = async (req: Request, res: Response) => {
  try {
    const { itemType, itemId, rating } = req.body;

    // Validate rating
    if (rating < 1 || rating > 5) {
      return res.status(400).json({
        success: false,
        message: 'Rating must be between 1 and 5',
      });
    }

    // Validate item type
    if (!['movie', 'series', 'anime', 'book'].includes(itemType)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid item type',
      });
    }

    // Check if already rated
    const existingRating = await Rating.findOne({
      user: req.user.id,
      itemType,
      itemId,
    });

    if (existingRating) {
      // Update existing rating
      existingRating.rating = rating;
      existingRating.updatedAt = new Date();
      await existingRating.save();

      return res.status(200).json({
        success: true,
        data: existingRating,
      });
    }

    // Create new rating
    const newRating = await Rating.create({
      user: req.user.id,
      itemType,
      itemId,
      rating,
    });

    res.status(201).json({
      success: true,
      data: newRating,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};

// @desc    Get user's ratings
// @route   GET /api/user/ratings
// @access  Private
export const getUserRatings = async (req: Request, res: Response) => {
  try {
    const ratings = await Rating.find({ user: req.user.id });

    res.status(200).json({
      success: true,
      data: ratings,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
}