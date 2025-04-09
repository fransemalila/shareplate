import React from 'react';
import FoodCard from './FoodCard';
import Rating from '../common/Rating';
import { FoodListing } from '../../types';

interface FoodListingGridProps {
  listings: FoodListing[];
  onListingClick?: (listing: FoodListing) => void;
}

const FoodListingGrid: React.FC<FoodListingGridProps> = ({
  listings,
  onListingClick,
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {listings.map((listing) => (
        <div
          key={listing.id}
          className="flex flex-col cursor-pointer"
          onClick={() => onListingClick?.(listing)}
        >
          <FoodCard
            title={listing.title}
            description={listing.description}
            price={listing.price}
            image={listing.images[0]}
            seller={listing.sellerId}
            location={listing.location}
          />
          <div className="mt-2 px-4">
            <Rating value={4.5} readonly size="small" />
          </div>
        </div>
      ))}
    </div>
  );
};

export default FoodListingGrid; 