import React from 'react';

interface FoodListingFiltersProps {
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  selectedStatus: string;
  onStatusChange: (status: string) => void;
  selectedTags: string[];
  onTagsChange: (tags: string[]) => void;
  location?: string;
  onLocationChange: (location: string) => void;
  radius?: number;
  onRadiusChange: (radius: number) => void;
  priceRange: [number, number];
  onPriceRangeChange: (range: [number, number]) => void;
  sortBy: string;
  onSortChange: (sort: string) => void;
}

export const FoodListingFilters: React.FC<FoodListingFiltersProps> = ({
  selectedCategory,
  onCategoryChange,
  selectedStatus,
  onStatusChange,
  selectedTags,
  onTagsChange,
  location,
  onLocationChange,
  radius = 5,
  onRadiusChange,
  priceRange,
  onPriceRangeChange,
  sortBy,
  onSortChange
}) => {
  return (
    <div className="flex flex-col gap-4 p-4 bg-white rounded-lg shadow">
      {/* Category Filter */}
      <div>
        <label className="block text-sm font-medium text-gray-700">Category</label>
        <select
          value={selectedCategory}
          onChange={(e) => onCategoryChange(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
        >
          <option value="">All Categories</option>
          <option value="meals">Meals</option>
          <option value="groceries">Groceries</option>
          <option value="produce">Produce</option>
          <option value="bakery">Bakery</option>
          <option value="dairy">Dairy</option>
          <option value="snacks">Snacks</option>
        </select>
      </div>

      {/* Status Filter */}
      <div>
        <label className="block text-sm font-medium text-gray-700">Status</label>
        <select
          value={selectedStatus}
          onChange={(e) => onStatusChange(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
        >
          <option value="">All Statuses</option>
          <option value="active">Active</option>
          <option value="sold">Sold</option>
          <option value="expired">Expired</option>
        </select>
      </div>

      {/* Location Search */}
      <div>
        <label className="block text-sm font-medium text-gray-700">Location</label>
        <input
          type="text"
          value={location}
          onChange={(e) => onLocationChange(e.target.value)}
          placeholder="Enter location..."
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
        />
      </div>

      {/* Search Radius */}
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Search Radius (km): {radius}
        </label>
        <input
          type="range"
          min="1"
          max="50"
          value={radius}
          onChange={(e) => onRadiusChange(Number(e.target.value))}
          className="mt-1 block w-full"
        />
      </div>

      {/* Price Range */}
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Price Range: ${priceRange[0]} - ${priceRange[1]}
        </label>
        <div className="flex gap-2 mt-1">
          <input
            type="number"
            value={priceRange[0]}
            onChange={(e) => onPriceRangeChange([Number(e.target.value), priceRange[1]])}
            min="0"
            className="w-1/2 rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
          />
          <input
            type="number"
            value={priceRange[1]}
            onChange={(e) => onPriceRangeChange([priceRange[0], Number(e.target.value)])}
            min={priceRange[0]}
            className="w-1/2 rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
          />
        </div>
      </div>

      {/* Sort By */}
      <div>
        <label className="block text-sm font-medium text-gray-700">Sort By</label>
        <select
          value={sortBy}
          onChange={(e) => onSortChange(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
        >
          <option value="relevance">Relevance</option>
          <option value="price_low">Price: Low to High</option>
          <option value="price_high">Price: High to Low</option>
          <option value="distance">Distance</option>
          <option value="rating">Rating</option>
          <option value="newest">Newest First</option>
        </select>
      </div>

      {/* Tags */}
      <div>
        <label className="block text-sm font-medium text-gray-700">Tags</label>
        <select
          multiple
          value={selectedTags}
          onChange={(e) => onTagsChange(Array.from(e.target.selectedOptions, option => option.value))}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
        >
          <option value="vegetarian">Vegetarian</option>
          <option value="vegan">Vegan</option>
          <option value="gluten-free">Gluten Free</option>
          <option value="dairy-free">Dairy Free</option>
          <option value="organic">Organic</option>
          <option value="halal">Halal</option>
          <option value="kosher">Kosher</option>
          <option value="spicy">Spicy</option>
        </select>
        <p className="mt-1 text-sm text-gray-500">Hold Ctrl/Cmd to select multiple tags</p>
      </div>
    </div>
  );
}; 