import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import FoodListingHeader from '../components/food/FoodListingHeader';
import FoodListingFilters from '../components/food/FoodListingFilters';
import FoodListingGrid from '../components/food/FoodListingGrid';
import NoListings from '../components/food/NoListings';
import { FoodListing } from '../../types';
import { api } from '../services/api';
import FoodListingStats from '../components/food/FoodListingStats';
import FoodListingMap from '../components/food/FoodListingMap';
import FoodListingCategories from '../components/food/FoodListingCategories';
import FoodListingSkeleton from '../components/food/FoodListingSkeleton';
import { mockFoodListings } from '../mocks/foodListings';

const FoodListingsPage: React.FC = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [listings, setListings] = useState<FoodListing[]>([]);
  const [filteredListings, setFilteredListings] = useState<FoodListing[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('active');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [mapCenter, setMapCenter] = useState({
    lat: 40.7128,
    lng: -74.0060
  });

  const categories = [
    { id: 'all', name: 'All', icon: '🍽️', count: 0 },
    { id: 'homemade', name: 'Homemade', icon: '🏠', count: 0 },
    { id: 'restaurant', name: 'Restaurant', icon: '🍽️', count: 0 },
    { id: 'grocery', name: 'Grocery', icon: '🛒', count: 0 },
    { id: 'bakery', name: 'Bakery', icon: '🥖', count: 0 },
    { id: 'desserts', name: 'Desserts', icon: '🍰', count: 0 },
    { id: 'drinks', name: 'Drinks', icon: '☕', count: 0 }
  ];

  const statuses = [
    { id: 'all', name: 'All' },
    { id: 'active', name: 'Active' },
    { id: 'sold', name: 'Sold' },
    { id: 'expired', name: 'Expired' }
  ];

  useEffect(() => {
    fetchListings();
  }, []);

  const fetchListings = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Use mock data for testing
      const response = { listings: mockFoodListings };
      
      // Filter out draft listings from the main view
      const nonDraftListings = response.listings.filter(listing => !listing.isDraft);
      setListings(nonDraftListings);
      
      // Initial filtering
      filterListings(selectedCategory, selectedStatus, selectedTags, nonDraftListings);
      
      // Update map center if listings have locations
      updateMapCenter(nonDraftListings);
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred while fetching listings');
    } finally {
      setTimeout(() => setIsLoading(false), 1000);
    }
  };

  const filterListings = (
    categoryId: string,
    status: string,
    tags: string[],
    listingsToFilter = listings
  ) => {
    let filtered = listingsToFilter;

    // Filter by category
    if (categoryId !== 'all') {
      filtered = filtered.filter(listing => listing.category === categoryId);
    }

    // Filter by status
    if (status !== 'all') {
      filtered = filtered.filter(listing => listing.status === status);
    }

    // Filter by tags
    if (tags.length > 0) {
      filtered = filtered.filter(listing =>
        tags.every(tag => listing.tags.some(t => t.name === tag))
      );
    }

    // Filter out expired listings
    filtered = filtered.filter(listing => {
      if (listing.status === 'expired') return false;
      if (!listing.expiresAt) return true;
      return new Date(listing.expiresAt) > new Date();
    });

    setFilteredListings(filtered);
  };

  const updateMapCenter = (listings: FoodListing[]) => {
    const locatedListings = listings.filter(l => l.location);
    if (locatedListings.length > 0) {
      const avgLat = locatedListings.reduce((sum, l) => sum + (l.location?.lat || 0), 0) / locatedListings.length;
      const avgLng = locatedListings.reduce((sum, l) => sum + (l.location?.lng || 0), 0) / locatedListings.length;
      setMapCenter({ lat: avgLat, lng: avgLng });
    }
  };

  const handleCategorySelect = (categoryId: string) => {
    setSelectedCategory(categoryId);
    filterListings(categoryId, selectedStatus, selectedTags);
  };

  const handleStatusSelect = (status: string) => {
    setSelectedStatus(status);
    filterListings(selectedCategory, status, selectedTags);
  };

  const handleTagSelect = (tag: string) => {
    const newTags = selectedTags.includes(tag)
      ? selectedTags.filter(t => t !== tag)
      : [...selectedTags, tag];
    setSelectedTags(newTags);
    filterListings(selectedCategory, selectedStatus, newTags);
  };

  const handleListingClick = (listing: FoodListing) => {
    navigate(`/listings/${listing.id}`);
  };

  const handleCreateListing = () => {
    navigate('/listings/new');
  };

  const handleViewDrafts = () => {
    navigate('/listings/drafts');
  };

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <div className="flex items-center">
            <svg
              className="w-5 h-5 text-red-400 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span className="text-red-700">{error}</span>
          </div>
          <button
            onClick={fetchListings}
            className="mt-2 text-red-600 hover:text-red-800 font-medium"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header with Actions */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Food Listings</h1>
        <div className="flex gap-4">
          <button
            onClick={handleViewDrafts}
            className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
          >
            View Drafts
          </button>
          <button
            onClick={handleCreateListing}
            className="px-4 py-2 text-white bg-green-600 rounded-md hover:bg-green-700"
          >
            Create Listing
          </button>
        </div>
      </div>

      {/* Filters Section */}
      <div className="mb-8">
        <FoodListingFilters
          categories={categories}
          selectedCategory={selectedCategory}
          onCategorySelect={handleCategorySelect}
          statuses={statuses}
          selectedStatus={selectedStatus}
          onStatusSelect={handleStatusSelect}
          tags={Array.from(new Set(listings.flatMap(l => l.tags.map(t => t.name))))}
          selectedTags={selectedTags}
          onTagSelect={handleTagSelect}
        />
      </div>

      {/* Map Section */}
      <div className="mb-8">
        <FoodListingMap
          listings={filteredListings}
          center={mapCenter}
          zoom={12}
          onMarkerClick={handleListingClick}
        />
      </div>

      {/* Listings Grid Section */}
      {isLoading ? (
        <FoodListingSkeleton count={6} />
      ) : filteredListings.length > 0 ? (
        <FoodListingGrid
          listings={filteredListings}
          onListingClick={handleListingClick}
        />
      ) : (
        <NoListings
          message="No listings match your filters"
          onCreateListing={handleCreateListing}
        />
      )}
    </div>
  );
};

export default FoodListingsPage; 