import React from 'react';
import Button from '../common/Button';

interface FilterOptions {
  category: string;
  priceRange: string;
  sortBy: string;
  dietary?: string[];
  allergens?: string[];
}

interface FoodListingFiltersProps {
  filters: FilterOptions;
  onFilterChange: (filters: FilterOptions) => void;
}

const FoodListingFilters: React.FC<FoodListingFiltersProps> = ({
  filters,
  onFilterChange,
}) => {
  const handleFilterChange = (key: keyof FilterOptions, value: string) => {
    onFilterChange({ ...filters, [key]: value });
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-md space-y-4">
      <h3 className="font-semibold text-lg text-gray-700">Filters</h3>
      
      {/* Category Filter */}
      <div>
        <label className="block text-sm font-medium text-gray-600 mb-2">
          Category
        </label>
        <select
          value={filters.category}
          onChange={(e) => handleFilterChange('category', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
        >
          <option value="all">All Categories</option>
          <option value="homemade">Homemade</option>
          <option value="restaurant">Restaurant</option>
          <option value="grocery">Grocery</option>
        </select>
      </div>

      {/* Price Range Filter */}
      <div>
        <label className="block text-sm font-medium text-gray-600 mb-2">
          Price Range
        </label>
        <select
          value={filters.priceRange}
          onChange={(e) => handleFilterChange('priceRange', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
        >
          <option value="all">Any Price</option>
          <option value="low">Under $10</option>
          <option value="medium">$10 - $20</option>
          <option value="high">Over $20</option>
        </select>
      </div>

      {/* Sort By */}
      <div>
        <label className="block text-sm font-medium text-gray-600 mb-2">
          Sort By
        </label>
        <select
          value={filters.sortBy}
          onChange={(e) => handleFilterChange('sortBy', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
        >
          <option value="relevance">Relevance</option>
          <option value="price_low">Price: Low to High</option>
          <option value="price_high">Price: High to Low</option>
          <option value="rating">Rating</option>
          <option value="newest">Newest First</option>
        </select>
      </div>

      {/* Reset Filters Button */}
      <Button
        variant="outline"
        onClick={() =>
          onFilterChange({
            category: 'all',
            priceRange: 'all',
            sortBy: 'relevance',
          })
        }
        fullWidth
      >
        Reset Filters
      </Button>
    </div>
  );
};

export default FoodListingFilters; 