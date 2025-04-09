import React, { useState } from 'react';
import { Button } from './Button';

interface SearchBarProps {
  onSearch: (query: string, filters: SearchFilters) => void;
}

interface SearchFilters {
  category: string;
  priceRange: string;
  sortBy: string;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch }) => {
  const [query, setQuery] = useState('');
  const [filters, setFilters] = useState<SearchFilters>({
    category: 'all',
    priceRange: 'all',
    sortBy: 'relevance'
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(query, filters);
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-4xl mx-auto">
      <div className="flex flex-col md:flex-row gap-4 bg-white p-4 rounded-lg shadow-md">
        {/* Search Input */}
        <div className="flex-1">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search for food..."
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-2">
          <select
            value={filters.category}
            onChange={(e) => setFilters({ ...filters, category: e.target.value })}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            <option value="all">All Categories</option>
            <option value="homemade">Homemade</option>
            <option value="restaurant">Restaurant</option>
            <option value="grocery">Grocery</option>
          </select>

          <select
            value={filters.priceRange}
            onChange={(e) => setFilters({ ...filters, priceRange: e.target.value })}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            <option value="all">Any Price</option>
            <option value="low">Under $10</option>
            <option value="medium">$10 - $20</option>
            <option value="high">Over $20</option>
          </select>

          <select
            value={filters.sortBy}
            onChange={(e) => setFilters({ ...filters, sortBy: e.target.value })}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            <option value="relevance">Relevance</option>
            <option value="price_low">Price: Low to High</option>
            <option value="price_high">Price: High to Low</option>
            <option value="rating">Rating</option>
          </select>

          <Button type="submit" variant="primary">
            Search
          </Button>
        </div>
      </div>
    </form>
  );
};

export default SearchBar; 