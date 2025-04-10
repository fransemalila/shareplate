export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: 'user' | 'admin' | 'moderator';
  isEmailVerified: boolean;
  phoneNumber?: string;
  isPhoneVerified?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Location {
  lat: number;
  lng: number;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
}

export interface Tag {
  id: string;
  name: string;
}

export type ListingStatus = 'draft' | 'active' | 'sold' | 'expired';

export interface FoodListing {
  id: string;
  title: string;
  description: string;
  price: number;
  images: string[];
  category: string;
  status: ListingStatus;
  sellerId: string;
  location?: Location;
  tags: Tag[];
  expiresAt?: string;
  isDraft?: boolean;
  templateId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CartItem {
  id: string;
  listingId: string;
  listing: FoodListing;
  quantity: number;
  notes?: string;
}

export interface Order {
  id: string;
  userId: string;
  items: CartItem[];
  status: 'pending' | 'paid' | 'preparing' | 'ready' | 'completed' | 'cancelled' | 'refunded';
  subtotal: number;
  tax: number;
  total: number;
  paymentIntentId?: string;
  refundId?: string;
  deliveryAddress?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Transaction {
  id: string;
  orderId: string;
  amount: number;
  status: 'pending' | 'succeeded' | 'failed' | 'refunded';
  paymentMethod: {
    type: 'card' | 'bank_transfer';
    last4?: string;
    brand?: string;
  };
  receiptUrl?: string;
  refundReason?: string;
  createdAt: string;
}

export interface Review {
  id: string;
  userId: string;
  listingId: string;
  rating: number;
  comment: string;
  status: 'pending' | 'approved' | 'rejected';
  helpfulVotes: number;
  notHelpfulVotes: number;
  voters: string[];
  sellerResponse?: ReviewResponse;
  moderationDetails?: ModerationDetails;
  createdAt: string;
  updatedAt: string;
}

export interface ReviewResponse {
  id: string;
  reviewId: string;
  sellerId: string;
  comment: string;
  createdAt: string;
  updatedAt: string;
}

export interface ModerationDetails {
  status: 'pending' | 'approved' | 'rejected';
  moderatorId?: string;
  reason?: string;
  moderatedAt?: string;
}

export interface UserReputation {
  userId: string;
  overallRating: number;
  totalReviews: number;
  helpfulVotes: number;
  reviewQuality: number;
  sellerRating: number;
  buyerRating: number;
  createdAt: string;
  updatedAt: string;
}

export type NotificationType = 
  | 'order_status'
  | 'new_message'
  | 'review'
  | 'price_alert'
  | 'listing_expiry'
  | 'account_alert';

export type NotificationChannel = 'email' | 'in_app' | 'push';

export interface NotificationPreferences {
  userId: string;
  channels: {
    [key in NotificationType]: NotificationChannel[];
  };
  emailFrequency: 'instant' | 'daily' | 'weekly';
  pushEnabled: boolean;
  emailEnabled: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Notification {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  data?: {
    orderId?: string;
    listingId?: string;
    messageId?: string;
    reviewId?: string;
  };
  read: boolean;
  channel: NotificationChannel;
  sentVia: NotificationChannel[];
  createdAt: string;
  readAt?: string;
}

export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  content: string;
  attachments?: MessageAttachment[];
  readBy: string[];
  deliveredAt: string;
  readAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface MessageAttachment {
  id: string;
  type: 'image' | 'document' | 'audio';
  url: string;
  name: string;
  size: number;
  mimeType: string;
}

export interface Conversation {
  id: string;
  participants: string[];
  lastMessage?: Message;
  unreadCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface BlockedUser {
  id: string;
  userId: string;
  blockedUserId: string;
  reason?: string;
  createdAt: string;
  updatedAt: string;
} 