import mongoose, { Document } from 'mongoose';

export interface IRating extends Document {
  user: mongoose.Schema.Types.ObjectId;
  itemType: string;
  itemId: string;
  rating: number;
  createdAt: Date;
  updatedAt: Date;
}

const ratingSchema = new mongoose.Schema({
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
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Compound index to ensure a user can only rate an item once
ratingSchema.index({ user: 1, itemType: 1, itemId: 1 }, { unique: true });

const Rating = mongoose.model<IRating>('Rating', ratingSchema);

export default Rating;