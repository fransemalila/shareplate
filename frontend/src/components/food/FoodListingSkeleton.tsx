import React from 'react';

interface FoodListingSkeletonProps {
  count?: number;
}

const FoodListingSkeleton: React.FC<FoodListingSkeletonProps> = ({ count = 3 }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: count }).map((_, index) => (
        <div
          key={index}
          className="bg-white rounded-lg shadow-md overflow-hidden animate-pulse"
        >
          {/* Image skeleton */}
          <div className="h-48 bg-gray-200" />

          {/* Content skeleton */}
          <div className="p-4">
            {/* Title skeleton */}
            <div className="h-6 bg-gray-200 rounded w-3/4 mb-4" />

            {/* Description skeleton */}
            <div className="space-y-2 mb-4">
              <div className="h-4 bg-gray-200 rounded w-full" />
              <div className="h-4 bg-gray-200 rounded w-5/6" />
            </div>

            {/* Price and rating skeleton */}
            <div className="flex justify-between items-center">
              <div className="h-6 bg-gray-200 rounded w-20" />
              <div className="flex space-x-1">
                {Array.from({ length: 5 }).map((_, starIndex) => (
                  <div
                    key={starIndex}
                    className="w-4 h-4 bg-gray-200 rounded-full"
                  />
                ))}
              </div>
            </div>

            {/* Button skeleton */}
            <div className="mt-4 h-10 bg-gray-200 rounded" />
          </div>
        </div>
      ))}
    </div>
  );
};

export default FoodListingSkeleton; 