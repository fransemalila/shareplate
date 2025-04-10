import mongoose, { Schema, Document } from 'mongoose';

export interface IPayment extends Document {
  order: mongoose.Types.ObjectId;
  payer: mongoose.Types.ObjectId;
  recipient: mongoose.Types.ObjectId;
  amount: number;
  currency: string;
  status: 'pending' | 'processing' | 'completed' | 'failed' | 'refunded';
  paymentMethod: 'card' | 'bank_transfer' | 'wallet' | 'cash';
  transactionId?: string;
  paymentProvider?: string;
  paymentDetails?: {
    cardLast4?: string;
    cardBrand?: string;
    bankName?: string;
    accountLast4?: string;
  };
  refundReason?: string;
  refundAmount?: number;
  refundedAt?: Date;
  metadata?: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

const paymentSchema = new Schema({
  order: {
    type: Schema.Types.ObjectId,
    ref: 'Order',
    required: true
  },
  payer: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  recipient: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  amount: {
    type: Number,
    required: true,
    min: 0
  },
  currency: {
    type: String,
    required: true,
    default: 'USD'
  },
  status: {
    type: String,
    enum: ['pending', 'processing', 'completed', 'failed', 'refunded'],
    default: 'pending'
  },
  paymentMethod: {
    type: String,
    enum: ['card', 'bank_transfer', 'wallet', 'cash'],
    required: true
  },
  transactionId: {
    type: String,
    sparse: true,
    unique: true
  },
  paymentProvider: String,
  paymentDetails: {
    cardLast4: String,
    cardBrand: String,
    bankName: String,
    accountLast4: String
  },
  refundReason: String,
  refundAmount: {
    type: Number,
    min: 0
  },
  refundedAt: Date,
  metadata: {
    type: Map,
    of: Schema.Types.Mixed
  }
}, {
  timestamps: true
});

// Add indexes for common queries
paymentSchema.index({ order: 1 });
paymentSchema.index({ payer: 1 });
paymentSchema.index({ recipient: 1 });
paymentSchema.index({ status: 1 });
paymentSchema.index({ transactionId: 1 }, { sparse: true });
paymentSchema.index({ createdAt: -1 });

// Middleware to handle refund status
paymentSchema.pre('save', function(next) {
  if (this.isModified('refundAmount') && this.refundAmount && this.refundAmount > 0) {
    this.status = 'refunded';
    if (!this.refundedAt) {
      this.refundedAt = new Date();
    }
  }
  next();
});

export const Payment = mongoose.model<IPayment>('Payment', paymentSchema); 