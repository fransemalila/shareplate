import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import FoodListingForm from '../components/food/FoodListingForm';
import { FoodListing } from '../types';
import { api } from '../services/api';

const CreateFoodListingPage: React.FC = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (data: Partial<FoodListing>) => {
    try {
      setIsSubmitting(true);
      setError(null);

      // Create the listing with all the new fields
      const listing = await api.createFoodListing({
        ...data,
        status: data.isDraft ? 'draft' : (data.status || 'active'),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });

      // Navigate to the appropriate page based on draft status
      if (data.isDraft) {
        navigate('/listings/drafts');
      } else {
        navigate(`/listings/${listing.id}`);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred while creating the listing');
      console.error('Error creating listing:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-8">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-gray-600 hover:text-gray-900"
        >
          <svg
            className="w-5 h-5 mr-2"
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
          Back
        </button>
      </div>

      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">
            Create Food Listing
          </h1>

          {error && (
            <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-center text-red-700">
                <svg
                  className="w-5 h-5 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                {error}
              </div>
            </div>
          )}

          <FoodListingForm
            onSubmit={handleSubmit}
            isLoading={isSubmitting}
          />
        </div>
      </div>
    </div>
  );
};

export default CreateFoodListingPage; 