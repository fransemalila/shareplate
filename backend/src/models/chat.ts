import mongoose, { Schema, Document } from 'mongoose';

export interface IMessage {
  sender: mongoose.Types.ObjectId;
  content: string;
  read: boolean;
  createdAt: Date;
}

export interface IChat extends Document {
  participants: mongoose.Types.ObjectId[];
  messages: IMessage[];
  lastMessage: IMessage;
  unreadCounts: Record<string, number>;
  relatedOrder?: mongoose.Types.ObjectId;
  relatedListing?: mongoose.Types.ObjectId;
  status: 'active' | 'archived';
  createdAt: Date;
  updatedAt: Date;
}

const messageSchema = new Schema({
  sender: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  content: {
    type: String,
    required: true,
    trim: true
  },
  read: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

const chatSchema = new Schema({
  participants: [{
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }],
  messages: [messageSchema],
  lastMessage: {
    type: messageSchema,
    required: false
  },
  unreadCounts: {
    type: Schema.Types.Mixed,
    default: {}
  },
  relatedOrder: {
    type: Schema.Types.ObjectId,
    ref: 'Order'
  },
  relatedListing: {
    type: Schema.Types.ObjectId,
    ref: 'FoodListing'
  },
  status: {
    type: String,
    enum: ['active', 'archived'],
    default: 'active'
  }
}, {
  timestamps: true
});

// Add indexes for common queries
chatSchema.index({ participants: 1 });
chatSchema.index({ 'lastMessage.createdAt': -1 });
chatSchema.index({ status: 1 });
chatSchema.index({ relatedOrder: 1 });
chatSchema.index({ relatedListing: 1 });

// Middleware to update lastMessage and unreadCounts when a new message is added
chatSchema.pre('save', function(next) {
  const chat = this as IChat;
  if (chat.messages && chat.messages.length > 0) {
    const lastMsg = chat.messages[chat.messages.length - 1];
    chat.lastMessage = lastMsg;
    
    // Update unread counts for all participants except sender
    chat.participants.forEach((participantId) => {
      if (participantId.toString() !== lastMsg.sender.toString()) {
        const currentCount = chat.unreadCounts[participantId.toString()] || 0;
        chat.unreadCounts[participantId.toString()] = currentCount + 1;
      }
    });
  }
  next();
});

export const Chat = mongoose.model<IChat>('Chat', chatSchema); 