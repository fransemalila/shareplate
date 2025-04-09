import React from 'react';
import Button from '../common/Button';

interface FoodListingHeaderProps {
  title: string;
  totalListings: number;
  onCreateListing?: () => void;
}

const FoodListingHeader: React.FC<FoodListingHeaderProps> = ({
  title,
  totalListings,
  onCreateListing,
}) => {
  return (
    <div className="flex justify-between items-center mb-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
        <p className="text-gray-600 mt-1">
          {totalListings} {totalListings === 1 ? 'listing' : 'listings'} available
        </p>
      </div>
      
      {onCreateListing && (
        <Button
          variant="primary"
          onClick={onCreateListing}
        >
          Share Food
        </Button>
      )}
    </div>
  );
};

export default FoodListingHeader; 