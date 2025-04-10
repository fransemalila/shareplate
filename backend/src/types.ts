export interface Tag {
  id: string;
  name: string;
}

export interface Location {
  lat: number;
  lng: number;
  address?: string;
}

export interface FoodListing {
  id: string;
  title: string;
  description: string;
  price: number;
  images: string[];
  category: string;
  status: 'draft' | 'active' | 'sold' | 'expired';
  sellerId: string;
  location?: Location;
  tags: Tag[];
  createdAt: string;
  updatedAt: string;
} 