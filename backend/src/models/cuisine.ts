import mongoose, { Schema, Document } from 'mongoose';

export interface ICuisine extends Document {
  name: string;
  slug: string;
  description?: string;
  icon?: string;
  region?: string;
  popularDishes?: string[];
  dietaryInfo?: {
    isVegetarian: boolean;
    isVegan: boolean;
    isHalal: boolean;
    isKosher: boolean;
  };
  spicyLevel?: 'not_spicy' | 'mild' | 'medium' | 'hot' | 'very_hot';
  isActive: boolean;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

const cuisineSchema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  slug: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  description: {
    type: String,
    trim: true
  },
  icon: {
    type: String
  },
  region: {
    type: String,
    trim: true
  },
  popularDishes: [{
    type: String,
    trim: true
  }],
  dietaryInfo: {
    isVegetarian: {
      type: Boolean,
      default: false
    },
    isVegan: {
      type: Boolean,
      default: false
    },
    isHalal: {
      type: Boolean,
      default: false
    },
    isKosher: {
      type: Boolean,
      default: false
    }
  },
  spicyLevel: {
    type: String,
    enum: ['not_spicy', 'mild', 'medium', 'hot', 'very_hot']
  },
  isActive: {
    type: Boolean,
    default: true
  },
  order: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// Add indexes for common queries
cuisineSchema.index({ slug: 1 }, { unique: true });
cuisineSchema.index({ isActive: 1 });
cuisineSchema.index({ order: 1 });
cuisineSchema.index({ region: 1 });

// Pre-save middleware to generate slug if not provided
cuisineSchema.pre('save', function(next) {
  if (!this.slug) {
    this.slug = this.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  }
  next();
});

export const Cuisine = mongoose.model<ICuisine>('Cuisine', cuisineSchema); 