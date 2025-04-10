import mongoose, { Schema, Document } from 'mongoose';

export interface IAddress extends Document {
  user: mongoose.Types.ObjectId;
  type: 'home' | 'work' | 'other';
  label?: string;
  street: string;
  unit?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  coordinates: {
    latitude: number;
    longitude: number;
  };
  isDefault: boolean;
  instructions?: string;
  contactName?: string;
  contactPhone?: string;
  isVerified: boolean;
  verifiedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const addressSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  type: {
    type: String,
    enum: ['home', 'work', 'other'],
    required: true
  },
  label: {
    type: String,
    trim: true
  },
  street: {
    type: String,
    required: true,
    trim: true
  },
  unit: {
    type: String,
    trim: true
  },
  city: {
    type: String,
    required: true,
    trim: true
  },
  state: {
    type: String,
    required: true,
    trim: true
  },
  postalCode: {
    type: String,
    required: true,
    trim: true
  },
  country: {
    type: String,
    required: true,
    trim: true
  },
  coordinates: {
    latitude: {
      type: Number,
      required: true
    },
    longitude: {
      type: Number,
      required: true
    }
  },
  isDefault: {
    type: Boolean,
    default: false
  },
  instructions: {
    type: String,
    trim: true
  },
  contactName: {
    type: String,
    trim: true
  },
  contactPhone: {
    type: String,
    trim: true
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  verifiedAt: {
    type: Date
  }
}, {
  timestamps: true
});

// Add indexes for common queries
addressSchema.index({ user: 1 });
addressSchema.index({ 'coordinates.latitude': 1, 'coordinates.longitude': 1 });
addressSchema.index({ isDefault: 1 });
addressSchema.index({ isVerified: 1 });

// Create 2dsphere index for geospatial queries
addressSchema.index({ coordinates: '2dsphere' });

// Middleware to ensure only one default address per user
addressSchema.pre('save', async function(next) {
  if (this.isModified('isDefault') && this.isDefault) {
    const Address = this.constructor as mongoose.Model<IAddress>;
    await Address.updateMany(
      { user: this.user, _id: { $ne: this._id } },
      { $set: { isDefault: false } }
    );
  }
  next();
});

// Middleware to set verifiedAt when address is verified
addressSchema.pre('save', function(next) {
  if (this.isModified('isVerified') && this.isVerified && !this.verifiedAt) {
    this.verifiedAt = new Date();
  }
  next();
});

export const Address = mongoose.model<IAddress>('Address', addressSchema); 