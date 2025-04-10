export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: 'user' | 'admin' | 'moderator';
  isEmailVerified: boolean;
  phoneNumber?: string;
  isPhoneVerified: boolean;
  twoFactorAuth: {
    enabled: boolean;
    method: 'sms' | 'app' | null;
  };
  privacySettings: {
    showEmail: boolean;
    showPhone: boolean;
    showLocation: boolean;
  };
  status: 'active' | 'suspended' | 'banned';
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

export interface TwoFactorAuth {
  enabled: boolean;
  method: '2fa_app' | 'sms' | 'email';
  secret?: string;
  backupCodes?: string[];
}

export interface PrivacySettings {
  profileVisibility: 'public' | 'private' | 'friends';
  showEmail: boolean;
  showPhone: boolean;
  showLocation: boolean;
  allowMessaging: boolean;
}

export interface UserSession {
  id: string;
  deviceName: string;
  deviceType: string;
  browser: string;
  ipAddress: string;
  location: string;
  lastActive: Date;
  createdAt: Date;
}

export interface ActivityLogEntry {
  id: string;
  userId: string;
  action: string;
  details: Record<string, any>;
  ipAddress: string;
  userAgent: string;
  createdAt: Date;
}

export interface DeviceInfo {
  id: string;
  userId: string;
  name: string;
  type: string;
  browser: string;
  os: string;
  trusted: boolean;
  lastActive: Date;
  createdAt: Date;
}

export interface SavedListing {
  id: string;
  userId: string;
  listingId: string;
  listing: FoodListing;
  notes?: string;
  createdAt: string;
}

export interface Report {
  id: string;
  userId: string;
  targetType: 'listing' | 'user' | 'review' | 'message';
  targetId: string;
  reason: string;
  details: string;
  status: 'pending' | 'investigating' | 'resolved' | 'dismissed';
  moderatorNotes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface FAQCategory {
  id: string;
  title: string;
  description: string;
  order: number;
}

export interface FAQItem {
  id: string;
  categoryId: string;
  question: string;
  answer: string;
  order: number;
}

export interface SupportTicket {
  id: string;
  subject: string;
  description: string;
  category: 'general' | 'technical' | 'billing' | 'report';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'open' | 'closed' | 'pending';
  createdAt: string;
  updatedAt: string;
}

export interface SupportMessage {
  id: string;
  ticketId: string;
  content: string;
  isStaffResponse: boolean;
  attachments?: string[];
  createdAt: string;
  updatedAt: string;
} 