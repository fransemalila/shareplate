import React from 'react';
import { FoodListing, Tag } from '../../types';

interface FoodListingGridProps {
  listings: FoodListing[];
  onListingClick: (listing: FoodListing) => void;
}

const FoodListingGrid: React.FC<FoodListingGridProps> = ({ listings, onListingClick }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
      {listings.map((listing) => (
        <div
          key={listing.id}
          className="bg-white rounded-lg shadow-md overflow-hidden cursor-pointer transform transition-all duration-200 active:scale-95 hover:scale-105 touch-manipulation"
          onClick={() => onListingClick(listing)}
        >
          {listing.images && listing.images.length > 0 && (
            <div className="relative aspect-w-16 aspect-h-9">
              <img
                src={listing.images[0]}
                alt={listing.title}
                className="object-cover w-full h-48"
                loading="lazy"
              />
              {listing.status === 'sold' && (
                <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                  <span className="text-white font-semibold text-lg">SOLD</span>
                </div>
              )}
            </div>
          )}
          <div className="p-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
              {listing.title}
            </h3>
            <p className="text-gray-600 text-sm mb-2 line-clamp-2">{listing.description}</p>
            <div className="flex justify-between items-center">
              <span className="text-green-600 font-medium">
                ${listing.price.toFixed(2)}
              </span>
              <span className="text-sm text-gray-500">
                {listing.location?.city || 'Location N/A'}
              </span>
            </div>
            {listing.tags && listing.tags.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-2">
                {listing.tags.slice(0, 3).map((tag: Tag) => (
                  <span
                    key={tag.id}
                    className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full whitespace-nowrap"
                  >
                    {tag.name}
                  </span>
                ))}
                {listing.tags.length > 3 && (
                  <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                    +{listing.tags.length - 3} more
                  </span>
                )}
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default FoodListingGrid; 