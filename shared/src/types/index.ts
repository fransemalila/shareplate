export interface User {
  id: string;
  email: string;
  name: string;
  role: 'customer' | 'cook' | 'business';
  createdAt: Date;
  updatedAt: Date;
}

export interface FoodListing {
  id: string;
  title: string;
  description: string;
  price: number;
  sellerId: string;
  category: string;
  images: string[];
  available: boolean;
  createdAt: Date;
  updatedAt: Date;
} 