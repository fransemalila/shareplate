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

export interface FoodListing {
  id: string;
  title: string;
  description: string;
  price: number;
  images: string[];
  sellerId: string;
  available: boolean;
  category: string;
  location?: Location;
  createdAt: string;
  updatedAt: string;
} 