import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IReview extends Document {
  author: mongoose.Types.ObjectId;
  foodListing: mongoose.Types.ObjectId;
  rating: number;
  comment: string;
  images?: string[];
  helpful: number;
  reported: boolean;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: Date;
  updatedAt: Date;
}

const reviewSchema = new Schema({
  author: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  foodListing: {
    type: Schema.Types.ObjectId,
    ref: 'FoodListing',
    required: true
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  comment: {
    type: String,
    required: true,
    trim: true
  },
  images: [{
    type: String
  }],
  helpful: {
    type: Number,
    default: 0
  },
  reported: {
    type: Boolean,
    default: false
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'
  }
}, {
  timestamps: true
});

// Add indexes for common queries
reviewSchema.index({ foodListing: 1 });
reviewSchema.index({ author: 1 });
reviewSchema.index({ rating: -1 });
reviewSchema.index({ status: 1 });
reviewSchema.index({ createdAt: -1 });

// Middleware to update food listing rating when review is added/modified
reviewSchema.post('save', async function(doc) {
  const Review = this.constructor as Model<IReview>;
  const FoodListing = mongoose.model('FoodListing');
  
  const stats = await Review.aggregate([
    { $match: { foodListing: doc.foodListing, status: 'approved' } },
    { 
      $group: {
        _id: '$foodListing',
        avgRating: { $avg: '$rating' },
        count: { $sum: 1 }
      }
    }
  ]);

  if (stats.length > 0) {
    await FoodListing.findByIdAndUpdate(doc.foodListing, {
      rating: Math.round(stats[0].avgRating * 10) / 10,
      reviewCount: stats[0].count
    });
  }
});

export const Review = mongoose.model<IReview>('Review', reviewSchema); 