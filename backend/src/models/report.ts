import mongoose, { Schema, Document } from 'mongoose';

export interface IReport extends Document {
  reporter: mongoose.Types.ObjectId;
  reportedUser?: mongoose.Types.ObjectId;
  reportedListing?: mongoose.Types.ObjectId;
  reportedReview?: mongoose.Types.ObjectId;
  type: 'user' | 'listing' | 'review';
  reason: 'inappropriate' | 'spam' | 'offensive' | 'scam' | 'other';
  description: string;
  status: 'pending' | 'investigating' | 'resolved' | 'dismissed';
  adminNotes?: string;
  resolution?: string;
  createdAt: Date;
  updatedAt: Date;
  resolvedAt?: Date;
}

const reportSchema = new Schema({
  reporter: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  reportedUser: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  reportedListing: {
    type: Schema.Types.ObjectId,
    ref: 'FoodListing'
  },
  reportedReview: {
    type: Schema.Types.ObjectId,
    ref: 'Review'
  },
  type: {
    type: String,
    enum: ['user', 'listing', 'review'],
    required: true
  },
  reason: {
    type: String,
    enum: ['inappropriate', 'spam', 'offensive', 'scam', 'other'],
    required: true
  },
  description: {
    type: String,
    required: true,
    trim: true
  },
  status: {
    type: String,
    enum: ['pending', 'investigating', 'resolved', 'dismissed'],
    default: 'pending'
  },
  adminNotes: {
    type: String,
    trim: true
  },
  resolution: {
    type: String,
    trim: true
  },
  resolvedAt: {
    type: Date
  }
}, {
  timestamps: true
});

// Add indexes for common queries
reportSchema.index({ status: 1 });
reportSchema.index({ type: 1 });
reportSchema.index({ reporter: 1 });
reportSchema.index({ reportedUser: 1 });
reportSchema.index({ reportedListing: 1 });
reportSchema.index({ reportedReview: 1 });
reportSchema.index({ createdAt: -1 });

// Middleware to set resolvedAt when status changes to resolved
reportSchema.pre('save', function(next) {
  if (this.isModified('status') && this.status === 'resolved' && !this.resolvedAt) {
    this.resolvedAt = new Date();
  }
  next();
});

export const Report = mongoose.model<IReport>('Report', reportSchema); 