import mongoose, { Schema, Document } from 'mongoose';

export interface ISettings extends Document {
  key: string;
  value: any;
  group: string;
  description?: string;
  isPublic: boolean;
  dataType: 'string' | 'number' | 'boolean' | 'json' | 'array';
  createdAt: Date;
  updatedAt: Date;
}

const settingsSchema = new Schema({
  key: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  value: {
    type: Schema.Types.Mixed,
    required: true
  },
  group: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  isPublic: {
    type: Boolean,
    default: false
  },
  dataType: {
    type: String,
    enum: ['string', 'number', 'boolean', 'json', 'array'],
    required: true
  }
}, {
  timestamps: true
});

// Add indexes for common queries
settingsSchema.index({ key: 1 }, { unique: true });
settingsSchema.index({ group: 1 });
settingsSchema.index({ isPublic: 1 });

// Middleware to validate value based on dataType
settingsSchema.pre('save', function(next) {
  const setting = this;
  
  try {
    switch (setting.dataType) {
      case 'string':
        if (typeof setting.value !== 'string') {
          setting.value = String(setting.value);
        }
        break;
      case 'number':
        if (typeof setting.value !== 'number') {
          setting.value = Number(setting.value);
        }
        break;
      case 'boolean':
        if (typeof setting.value !== 'boolean') {
          setting.value = Boolean(setting.value);
        }
        break;
      case 'json':
        if (typeof setting.value === 'string') {
          setting.value = JSON.parse(setting.value);
        }
        break;
      case 'array':
        if (!Array.isArray(setting.value)) {
          setting.value = [setting.value];
        }
        break;
    }
    next();
  } catch (error) {
    next(error as Error);
  }
});

export const Settings = mongoose.model<ISettings>('Settings', settingsSchema); 