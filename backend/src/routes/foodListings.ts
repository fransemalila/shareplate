import express from 'express';
import { FoodListing } from '../types';

const router = express.Router();

// Mock data for testing
const mockListings: FoodListing[] = [
  {
    id: '1',
    title: 'Homemade Pasta',
    description: 'Fresh homemade pasta with tomato sauce',
    price: 15.99,
    images: ['https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?ixlib=rb-4.0.3'],
    category: 'meals',
    status: 'active',
    sellerId: 'user1',
    location: {
      lat: 51.5074,
      lng: -0.1278,
    },
    tags: [{ id: '1', name: 'Italian' }],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: '2',
    title: 'Fresh Baked Bread',
    description: 'Artisanal sourdough bread',
    price: 8.99,
    images: ['https://images.unsplash.com/photo-1549931319-a545dcf3bc73?ixlib=rb-4.0.3'],
    category: 'bakery',
    status: 'active',
    sellerId: 'user2',
    location: {
      lat: 51.5074,
      lng: -0.1278,
    },
    tags: [{ id: '2', name: 'Bakery' }],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: '3',
    title: 'Organic Vegetables',
    description: 'Fresh organic vegetable basket',
    price: 25.99,
    images: ['https://images.unsplash.com/photo-1557844352-761f2565b576?ixlib=rb-4.0.3'],
    category: 'produce',
    status: 'active',
    sellerId: 'user3',
    location: {
      lat: 51.5074,
      lng: -0.1278,
    },
    tags: [{ id: '3', name: 'Organic' }, { id: '4', name: 'Vegetarian' }],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

// GET /api/food-listings
router.get('/', (req, res) => {
  const {
    category,
    status,
    tags,
    location,
    radius,
    priceRange,
    sortBy
  } = req.query;

  let filteredListings = [...mockListings];

  // Apply filters
  if (category) {
    filteredListings = filteredListings.filter(listing => listing.category === category);
  }

  if (status) {
    filteredListings = filteredListings.filter(listing => listing.status === status);
  }

  if (tags) {
    const tagList = (tags as string).split(',');
    filteredListings = filteredListings.filter(listing =>
      listing.tags.some((tag: { name: string }) => tagList.includes(tag.name))
    );
  }

  if (priceRange) {
    const [min, max] = (priceRange as string).split(',').map(Number);
    filteredListings = filteredListings.filter(listing =>
      listing.price >= min && listing.price <= max
    );
  }

  // Apply sorting
  if (sortBy) {
    switch (sortBy) {
      case 'price_low':
        filteredListings.sort((a, b) => a.price - b.price);
        break;
      case 'price_high':
        filteredListings.sort((a, b) => b.price - a.price);
        break;
      case 'newest':
        filteredListings.sort((a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        break;
    }
  }

  res.json({
    listings: filteredListings,
    total: filteredListings.length
  });
});

// GET /api/food-listings/:id
router.get('/:id', (req, res) => {
  const listing = mockListings.find(l => l.id === req.params.id);
  if (!listing) {
    return res.status(404).json({ message: 'Listing not found' });
  }
  res.json(listing);
});

export default router; 