import React from 'react';
import Button from '../common/Button';

interface NoListingsProps {
  message?: string;
  onCreateListing?: () => void;
}

const NoListings: React.FC<NoListingsProps> = ({
  message = 'No food listings available',
  onCreateListing,
}) => {
  return (
    <div className="text-center py-12">
      <div className="rounded-full bg-gray-100 p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
        <svg
          className="w-8 h-8 text-gray-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
          />
        </svg>
      </div>
      <h3 className="text-lg font-medium text-gray-900 mb-2">{message}</h3>
      <p className="text-gray-500 mb-6">
        Be the first to share delicious food with your community
      </p>
      {onCreateListing && (
        <Button
          variant="primary"
          onClick={onCreateListing}
        >
          Share Food Now
        </Button>
      )}
    </div>
  );
};

export default NoListings; 