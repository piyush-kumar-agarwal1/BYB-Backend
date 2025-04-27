import mongoose, { Document } from 'mongoose';

export interface IWatchedItem extends Document {
  user: mongoose.Schema.Types.ObjectId;
  itemType: string;
  itemId: string;
  watchedAt: Date;
}

const watchedItemSchema = new mongoose.Schema({
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
  watchedAt: {
    type: Date,
    default: Date.now
  }
});

// Compound index to ensure a user can't add the same item twice
watchedItemSchema.index({ user: 1, itemType: 1, itemId: 1 }, { unique: true });

const WatchedItem = mongoose.model<IWatchedItem>('WatchedItem', watchedItemSchema);

export default WatchedItem;