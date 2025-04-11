import mongoose, { Schema, Document } from 'mongoose';

export interface IToken extends Document {
  userId: mongoose.Types.ObjectId;
  token: string;
  type: 'refresh' | 'reset' | 'verification';
  expires: Date;
  blacklisted: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const tokenSchema = new Schema<IToken>({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  token: {
    type: String,
    required: true,
    index: true
  },
  type: {
    type: String,
    enum: ['refresh', 'reset', 'verification'],
    required: true
  },
  expires: {
    type: Date,
    required: true
  },
  blacklisted: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// Create indexes
tokenSchema.index({ token: 1, type: 1 });
tokenSchema.index({ userId: 1, type: 1 });
tokenSchema.index({ expires: 1 }, { expireAfterSeconds: 0 }); // TTL index

export const Token = mongoose.model<IToken>('Token', tokenSchema); 