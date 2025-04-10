import React from 'react';
import { FoodListing, Tag } from '../../types';

interface RecommendedListingsProps {
  recommendedListings: FoodListing[];
  trendingListings: FoodListing[];
  onListingClick: (listing: FoodListing) => void;
}

export const RecommendedListings: React.FC<RecommendedListingsProps> = ({
  recommendedListings,
  trendingListings,
  onListingClick
}) => {
  const renderListingCard = (listing: FoodListing) => (
    <div
      key={listing.id}
      onClick={() => onListingClick(listing)}
      className="bg-white rounded-lg shadow-md overflow-hidden cursor-pointer transition-transform hover:scale-105"
    >
      <div className="aspect-w-16 aspect-h-9 relative">
        <img
          src={listing.images[0]}
          alt={listing.title}
          className="object-cover w-full h-full"
        />
        <div className="absolute top-2 right-2">
          <span className="px-2 py-1 text-sm bg-green-500 text-white rounded-full">
            ${listing.price}
          </span>
        </div>
      </div>
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">{listing.title}</h3>
        <p className="text-sm text-gray-500 line-clamp-2 mb-2">{listing.description}</p>
        <div className="flex flex-wrap gap-1">
          {listing.tags.map((tag: Tag) => (
            <span
              key={tag.id}
              className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded-full"
            >
              {tag.name}
            </span>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-8">
      {/* Recommended Listings */}
      <section>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-gray-900">Recommended for You</h2>
          <button className="text-green-600 hover:text-green-800">View All</button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {recommendedListings.map(renderListingCard)}
        </div>
      </section>

      {/* Trending Listings */}
      <section>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-gray-900">Trending Now</h2>
          <button className="text-green-600 hover:text-green-800">View All</button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {trendingListings.map(renderListingCard)}
        </div>
      </section>
    </div>
  );
}; 