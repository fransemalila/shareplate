export interface FoodListing {
  id: string;
  title: string;
  description: string;
  price: number;
  images: string[];
  sellerId: string;
  available: boolean;
  createdAt: string;
  updatedAt: string;
  category?: string;
  location?: {
    lat: number;
    lng: number;
  };
}

export interface Review {
  id: string;
  userId: string;
  listingId: string;
  rating: number;
  comment: string;
  createdAt: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  createdAt: string;
} 