import React from 'react';
import Button from '../common/Button';
import Rating from '../common/Rating';
import ImageGallery from './ImageGallery';
import { FoodListing } from '../../../shared/src/types';

interface FoodListingDetailsProps {
  listing: FoodListing;
  onOrder?: () => void;
  onBack?: () => void;
}

const FoodListingDetails: React.FC<FoodListingDetailsProps> = ({
  listing,
  onOrder,
  onBack,
}) => {
  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
      {/* Back Button */}
      <div className="absolute top-4 left-4 z-10">
        <button
          onClick={onBack}
          className="bg-white p-2 rounded-full shadow-md hover:bg-gray-100"
        >
          <svg
            className="w-6 h-6 text-gray-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </button>
      </div>

      {/* Image Gallery */}
      <ImageGallery images={listing.images} alt={listing.title} />

      {/* Content */}
      <div className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{listing.title}</h1>
            <div className="mt-1 flex items-center">
              <Rating value={4.5} readonly size="small" />
              <span className="ml-2 text-sm text-gray-500">(24 reviews)</span>
            </div>
          </div>
          <div className="text-2xl font-bold text-green-600">
            ${listing.price.toFixed(2)}
          </div>
        </div>

        <div className="mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-2">Description</h2>
          <p className="text-gray-600">{listing.description}</p>
        </div>

        <div className="mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-2">Seller Information</h2>
          <div className="flex items-center">
            <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
              <svg
                className="w-6 h-6 text-gray-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
            </div>
            <div className="ml-4">
              <div className="font-medium text-gray-900">Seller #{listing.sellerId}</div>
              <div className="text-sm text-gray-500">Member since 2024</div>
            </div>
          </div>
        </div>

        <div className="border-t pt-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <span className="text-gray-600">Status: </span>
              <span className={`font-medium ${listing.available ? 'text-green-600' : 'text-red-600'}`}>
                {listing.available ? 'Available' : 'Sold Out'}
              </span>
            </div>
            <div className="text-sm text-gray-500">
              Listed {new Date(listing.createdAt).toLocaleDateString()}
            </div>
          </div>

          {listing.available && onOrder && (
            <Button
              variant="primary"
              onClick={onOrder}
              fullWidth
            >
              Order Now
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default FoodListingDetails; 