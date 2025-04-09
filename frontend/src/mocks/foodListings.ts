import { FoodListing } from '../../../shared/src/types';

export const mockFoodListings: FoodListing[] = [
  {
    id: '1',
    title: 'Homemade Italian Pasta',
    description: 'Fresh, handmade pasta with authentic Italian sauce',
    price: 15.99,
    images: ['https://placehold.co/600x400?text=Pasta'],
    sellerId: 'user1',
    available: true,
    category: 'homemade',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    location: {
      lat: 40.7128,
      lng: -74.0060
    }
  },
  {
    id: '2',
    title: 'Artisan Sourdough Bread',
    description: 'Freshly baked sourdough bread',
    price: 8.99,
    images: ['https://placehold.co/600x400?text=Bread'],
    sellerId: 'user2',
    available: true,
    category: 'bakery',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    location: {
      lat: 40.7580,
      lng: -73.9855
    }
  },
  {
    id: '3',
    title: 'Organic Green Smoothie',
    description: 'Healthy smoothie with organic ingredients',
    price: 6.99,
    images: ['https://placehold.co/600x400?text=Smoothie'],
    sellerId: 'user3',
    available: true,
    category: 'drinks',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    location: {
      lat: 40.7829,
      lng: -73.9654
    }
  },
  {
    id: '4',
    title: 'Homemade Apple Pie',
    description: 'Traditional apple pie made from scratch',
    price: 19.99,
    images: ['https://placehold.co/600x400?text=Pie'],
    sellerId: 'user1',
    available: true,
    category: 'desserts',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    location: {
      lat: 40.7614,
      lng: -73.9776
    }
  },
  {
    id: '5',
    title: 'Fresh Sushi Platter',
    description: 'Assorted sushi rolls made fresh daily',
    price: 29.99,
    images: ['https://placehold.co/600x400?text=Sushi'],
    sellerId: 'user4',
    available: true,
    category: 'restaurant',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    location: {
      lat: 40.7505,
      lng: -73.9934
    }
  },
  {
    id: '6',
    title: 'Organic Produce Box',
    description: 'Fresh organic vegetables and fruits',
    price: 24.99,
    images: ['https://placehold.co/600x400?text=Produce'],
    sellerId: 'user5',
    available: true,
    category: 'grocery',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    location: {
      lat: 40.7421,
      lng: -73.9890
    }
  }
]; 