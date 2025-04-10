import React from 'react';
import { useNavigate } from 'react-router-dom';

const FoodListingHeader: React.FC = () => {
  const navigate = useNavigate();

  const handleCreateListing = () => {
    navigate('/listings/new');
  };

  const handleViewDrafts = () => {
    navigate('/listings/drafts');
  };

  return (
    <div className="flex justify-between items-center">
      <h1 className="text-2xl font-bold text-gray-900">Food Listings</h1>
      <div className="flex gap-4">
        <button
          onClick={handleViewDrafts}
          className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
        >
          View Drafts
        </button>
        <button
          onClick={handleCreateListing}
          className="px-4 py-2 text-white bg-green-600 rounded-md hover:bg-green-700"
        >
          Create Listing
        </button>
      </div>
    </div>
  );
};

export default FoodListingHeader; 