import React from 'react';

interface FoodListingStatsProps {
  totalListings: number;
  activeListings: number;
  averageRating: number;
  totalOrders: number;
}

const FoodListingStats: React.FC<FoodListingStatsProps> = ({
  totalListings,
  activeListings,
  averageRating,
  totalOrders,
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 p-4">
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="text-sm font-medium text-gray-500 mb-2">Total Listings</div>
        <div className="flex items-baseline">
          <div className="text-2xl font-semibold text-gray-900">{totalListings}</div>
          <div className="ml-2 text-sm text-green-600">All time</div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="text-sm font-medium text-gray-500 mb-2">Active Listings</div>
        <div className="flex items-baseline">
          <div className="text-2xl font-semibold text-gray-900">{activeListings}</div>
          <div className="ml-2 text-sm text-green-600">Currently available</div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="text-sm font-medium text-gray-500 mb-2">Average Rating</div>
        <div className="flex items-baseline">
          <div className="text-2xl font-semibold text-gray-900">{averageRating.toFixed(1)}</div>
          <div className="ml-2 text-sm text-yellow-500">★</div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="text-sm font-medium text-gray-500 mb-2">Total Orders</div>
        <div className="flex items-baseline">
          <div className="text-2xl font-semibold text-gray-900">{totalOrders}</div>
          <div className="ml-2 text-sm text-green-600">Completed</div>
        </div>
      </div>
    </div>
  );
};

export default FoodListingStats; 