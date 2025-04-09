export interface User {
  id: string;
  name: string;
  email: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Location {
  lat: number;
  lng: number;
}

export interface Tag {
  id: string;
  name: string;
  color?: string;
}

export type ListingStatus = 'draft' | 'active' | 'sold' | 'expired';

export interface FoodListing {
  id: string;
  title: string;
  description: string;
  price: number;
  images: string[];
  sellerId: string;
  available: boolean;
  category: string;
  location?: {
    lat: number;
    lng: number;
    address: string;
  };
  status: 'active' | 'sold' | 'expired';
  isDraft: boolean;
  tags: Tag[];
  expiresAt?: Date;
  createdAt: Date;
  updatedAt: Date;
  userId: string;
} 