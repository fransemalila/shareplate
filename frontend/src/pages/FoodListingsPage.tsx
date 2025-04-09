import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import FoodListingHeader from '../components/food/FoodListingHeader';
import FoodListingFilters from '../components/food/FoodListingFilters';
import FoodListingGrid from '../components/food/FoodListingGrid';
import NoListings from '../components/food/NoListings';
import { FoodListing } from '../../../shared/src/types';
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
  const [stats, setStats] = useState({
    totalListings: 0,
    activeListings: 0,
    averageRating: 0,
    totalOrders: 0
  });
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
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

  useEffect(() => {
    fetchListings();
  }, []);

  const fetchListings = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Use mock data for testing
      const response = { listings: mockFoodListings };
      setListings(response.listings);
      
      // Calculate stats
      const activeListings = response.listings.filter(l => l.available).length;
      const avgRating = 4.5; // Mock rating
      const totalOrders = response.listings.length * 2; // Mock orders
      
      setStats({
        totalListings: response.listings.length,
        activeListings,
        averageRating: avgRating,
        totalOrders
      });

      // Update category counts
      updateCategoryCounts(response.listings);
      
      // Initial filtering
      filterListings(selectedCategory, response.listings);
      
      // Update map center if listings have locations
      updateMapCenter(response.listings);
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred while fetching listings');
    } finally {
      // Add a small delay to simulate network request
      setTimeout(() => {
        setIsLoading(false);
      }, 1000);
    }
  };

  const updateCategoryCounts = (listings: FoodListing[]) => {
    const counts = listings.reduce((acc, listing) => {
      const category = listing.category || 'uncategorized';
      acc[category] = (acc[category] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    categories.forEach(category => {
      if (category.id === 'all') {
        category.count = listings.length;
      } else {
        category.count = counts[category.id] || 0;
      }
    });
  };

  const filterListings = (categoryId: string, listingsToFilter = listings) => {
    if (categoryId === 'all') {
      setFilteredListings(listingsToFilter);
    } else {
      setFilteredListings(listingsToFilter.filter(listing => listing.category === categoryId));
    }
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
    filterListings(categoryId);
  };

  const handleListingClick = (listing: FoodListing) => {
    navigate(`/listings/${listing.id}`);
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
      {/* Stats Section */}
      <FoodListingStats
        totalListings={stats.totalListings}
        activeListings={stats.activeListings}
        averageRating={stats.averageRating}
        totalOrders={stats.totalOrders}
      />

      {/* Categories Section */}
      <FoodListingCategories
        categories={categories}
        selectedCategory={selectedCategory}
        onCategorySelect={handleCategorySelect}
      />

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
          message={`No ${selectedCategory !== 'all' ? categories.find(c => c.id === selectedCategory)?.name.toLowerCase() : ''} listings available`}
          onCreateListing={() => navigate('/listings/new')}
        />
      )}
    </div>
  );
};

export default FoodListingsPage; 