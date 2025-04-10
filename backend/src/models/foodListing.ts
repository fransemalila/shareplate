import mongoose, { Schema, Document } from 'mongoose';

export interface IFoodListing extends Document {
  seller: mongoose.Types.ObjectId;
  title: string;
  description: string;
  price: number;
  quantity: number;
  category: string;
  cuisine: string;
  dietaryInfo: string[];
  allergens: string[];
  preparationTime: number;
  pickupWindow: {
    start: Date;
    end: Date;
  };
  location: {
    address: string;
    coordinates: {
      lat: number;
      lng: number;
    };
  };
  images: string[];
  status: 'active' | 'sold' | 'expired' | 'deleted';
  rating: number;
  reviewCount: number;
  createdAt: Date;
  updatedAt: Date;
}

const foodListingSchema = new Schema({
  seller: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  quantity: {
    type: Number,
    required: true,
    min: 0
  },
  category: {
    type: String,
    required: true,
    enum: ['meals', 'snacks', 'desserts', 'beverages', 'other']
  },
  cuisine: {
    type: String,
    required: true
  },
  dietaryInfo: [{
    type: String,
    enum: ['vegetarian', 'vegan', 'gluten-free', 'dairy-free', 'halal', 'kosher']
  }],
  allergens: [{
    type: String,
    enum: ['nuts', 'dairy', 'eggs', 'soy', 'wheat', 'fish', 'shellfish']
  }],
  preparationTime: {
    type: Number,
    required: true,
    min: 0
  },
  pickupWindow: {
    start: {
      type: Date,
      required: true
    },
    end: {
      type: Date,
      required: true
    }
  },
  location: {
    address: {
      type: String,
      required: true
    },
    coordinates: {
      lat: {
        type: Number,
        required: true
      },
      lng: {
        type: Number,
        required: true
      }
    }
  },
  images: [{
    type: String
  }],
  status: {
    type: String,
    enum: ['active', 'sold', 'expired', 'deleted'],
    default: 'active'
  },
  rating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  },
  reviewCount: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// Add indexes for common queries
foodListingSchema.index({ seller: 1 });
foodListingSchema.index({ status: 1 });
foodListingSchema.index({ category: 1 });
foodListingSchema.index({ 'location.coordinates': '2dsphere' });

export const FoodListing = mongoose.model<IFoodListing>('FoodListing', foodListingSchema); 