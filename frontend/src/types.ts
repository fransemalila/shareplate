export interface User {
  id: string;
  name: string;
  email: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface FoodListing {
  id: string;
  title: string;
  description: string;
  price: number;
  location: string;
  imageUrl: string;
  userId: string;
  user: User;
  createdAt: Date;
  updatedAt: Date;
} 