import mongoose, { Document } from 'mongoose';

export interface IWatchlistItem extends Document {
  user: mongoose.Schema.Types.ObjectId;
  itemType: string;
  itemId: string;
  createdAt: Date;
}

const watchlistSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  itemType: {
    type: String,
    required: true,
    enum: ['movie', 'series', 'anime', 'book']
  },
  itemId: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Compound index to ensure a user can't add the same item twice
watchlistSchema.index({ user: 1, itemType: 1, itemId: 1 }, { unique: true });

const Watchlist = mongoose.model<IWatchlistItem>('Watchlist', watchlistSchema);

export default Watchlist;