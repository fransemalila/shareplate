import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FoodListing } from '../types';
import { api } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import FoodListingHeader from '../components/food/FoodListingHeader';
import { FoodListingFilters } from '../components/food/FoodListingFilters';
import FoodListingGrid from '../components/food/FoodListingGrid';
import { FoodCategories } from '../components/food/FoodCategories';
import { SavedSearches } from '../components/food/SavedSearches';
import { RecommendedListings } from '../components/food/RecommendedListings';
import FoodListingMap from '../components/food/FoodListingMap';

const FoodListingsPage: React.FC = () => {
  const navigate = useNavigate();
  const { user, isLoading: authLoading } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [listings, setListings] = useState<FoodListing[]>([]);
  const [filteredListings, setFilteredListings] = useState<FoodListing[]>([]);
  const [recommendedListings, setRecommendedListings] = useState<FoodListing[]>([]);
  const [trendingListings, setTrendingListings] = useState<FoodListing[]>([]);
  
  // Filter states
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [location, setLocation] = useState('');
  const [radius, setRadius] = useState(5);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000]);
  const [sortBy, setSortBy] = useState('relevance');
  
  // Map state
  const [mapCenter, setMapCenter] = useState({ lat: 0, lng: 0 });
  const [mapZoom, setMapZoom] = useState(12);

  useEffect(() => {
    if (!authLoading) {
      if (!user) {
        navigate('/login', { state: { from: '/browse' } });
      } else {
        fetchListings();
        fetchRecommendedListings();
        fetchTrendingListings();
        getUserLocation();
      }
    }
  }, [authLoading, user]);

  const getUserLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setMapCenter({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        () => {
          // Default location if user denies permission
          setMapCenter({ lat: 51.5074, lng: -0.1278 }); // London coordinates
        }
      );
    }
  };

  const fetchListings = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await api.getFoodListings({
        category: selectedCategory || undefined,
        status: selectedStatus || undefined,
        tags: selectedTags.length > 0 ? selectedTags : undefined,
        location: mapCenter,
        radius,
        priceRange: {
          min: priceRange[0],
          max: priceRange[1]
        },
        sortBy
      });
      setListings(response.listings);
      setFilteredListings(response.listings);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch listings');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchRecommendedListings = async () => {
    // TODO: Implement recommended listings API
    setRecommendedListings([]);
  };

  const fetchTrendingListings = async () => {
    // TODO: Implement trending listings API
    setTrendingListings([]);
  };

  const handleFilterChange = () => {
    fetchListings();
  };

  const handleListingClick = (listing: FoodListing) => {
    navigate(`/listings/${listing.id}`);
  };

  const handleSavedSearchApply = (filters: {
    category?: string;
    status?: string;
    tags?: string[];
    location?: {
      lat: number;
      lng: number;
      address: string;
    };
    radius?: number;
    priceRange?: {
      min: number;
      max: number;
    };
    sortBy?: string;
  }) => {
    setSelectedCategory(filters.category || '');
    setSelectedStatus(filters.status || '');
    setSelectedTags(filters.tags || []);
    setLocation(filters.location?.address || '');
    if (filters.location) {
      setMapCenter({
        lat: filters.location.lat,
        lng: filters.location.lng
      });
    }
    setRadius(filters.radius || 5);
    setPriceRange([
      filters.priceRange?.min || 0,
      filters.priceRange?.max || 1000
    ]);
    setSortBy(filters.sortBy || 'relevance');
    fetchListings();
  };

  const handleMapMarkerClick = (listing: FoodListing) => {
    navigate(`/listings/${listing.id}`);
  };

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-700">{error}</p>
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
    <div className="max-w-7xl mx-auto px-4 py-8">
      <FoodListingHeader />
      
      {/* Categories Section */}
      <FoodCategories
        categories={[
          { id: 'meals', name: 'Meals', icon: '🍽️', description: 'Home-cooked meals', count: 150 },
          { id: 'groceries', name: 'Groceries', icon: '🛒', description: 'Fresh groceries', count: 89 },
          { id: 'produce', name: 'Produce', icon: '🥬', description: 'Fresh produce', count: 67 },
          { id: 'bakery', name: 'Bakery', icon: '🥖', description: 'Fresh baked goods', count: 45 },
        ]}
        selectedCategory={selectedCategory}
        onCategorySelect={setSelectedCategory}
      />

      {/* Map View */}
      <div className="mb-8">
        <FoodListingMap
          listings={filteredListings}
          center={mapCenter}
          zoom={mapZoom}
          onMarkerClick={handleMapMarkerClick}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Filters Sidebar */}
        <div className="lg:col-span-1 space-y-6">
          <FoodListingFilters
            selectedCategory={selectedCategory}
            onCategoryChange={setSelectedCategory}
            selectedStatus={selectedStatus}
            onStatusChange={setSelectedStatus}
            selectedTags={selectedTags}
            onTagsChange={setSelectedTags}
            location={location}
            onLocationChange={setLocation}
            radius={radius}
            onRadiusChange={setRadius}
            priceRange={priceRange}
            onPriceRangeChange={setPriceRange}
            sortBy={sortBy}
            onSortChange={setSortBy}
          />

          <SavedSearches 
            onApplySearch={handleSavedSearchApply}
            currentFilters={{
              category: selectedCategory,
              status: selectedStatus,
              tags: selectedTags,
              location: location ? {
                lat: mapCenter.lat,
                lng: mapCenter.lng,
                address: location
              } : undefined,
              radius,
              priceRange: {
                min: priceRange[0],
                max: priceRange[1]
              },
              sortBy
            }}
          />
        </div>

        {/* Main Content */}
        <div className="lg:col-span-3">
          {/* Recommended & Trending Listings */}
          <RecommendedListings
            recommendedListings={recommendedListings}
            trendingListings={trendingListings}
            onListingClick={handleListingClick}
          />

          {/* Search Results */}
          <div className="mt-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Search Results</h2>
            {isLoading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
              </div>
            ) : filteredListings.length > 0 ? (
              <FoodListingGrid
                listings={filteredListings}
                onListingClick={handleListingClick}
              />
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-500">No listings match your filters</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FoodListingsPage; 