import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import FoodListingDetails from '../components/food/FoodListingDetails';
import FoodListingReviews from '../components/food/FoodListingReviews';
import { FoodListing, Review } from '../types';
import { api } from '../services/api';

const FoodListingDetailsPage: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [listing, setListing] = useState<FoodListing | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchListing = async () => {
    try {
      if (!id) return;
      const response = await api.getFoodListingById(id);
      setListing(response);
    } catch (err) {
      setError('Failed to fetch listing details');
      console.error('Error fetching listing:', err);
    }
  };

  const fetchReviews = async () => {
    try {
      if (!id) return;
      const response = await api.getReviews(id);
      setReviews(response.reviews);
    } catch (err) {
      setError('Failed to fetch reviews');
      console.error('Error fetching reviews:', err);
    }
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await Promise.all([fetchListing(), fetchReviews()]);
      setLoading(false);
    };

    if (id) {
      loadData();
    }
  }, [id]);

  const handleBack = () => {
    navigate(-1);
  };

  const handleOrder = async () => {
    if (!listing) return;
    
    try {
      console.log('Creating order for listing:', listing.id);
      // Navigate to order confirmation page (to be implemented)
      navigate('/orders/new');
    } catch (err) {
      console.error('Error creating order:', err);
    }
  };

  const handleAddReview = async (rating: number, comment: string) => {
    try {
      if (!id) return;
      const response = await api.createReview(id, rating, comment);
      setReviews([...reviews, response]);
    } catch (err) {
      setError('Failed to add review');
      console.error('Error adding review:', err);
    }
  };

  const handleModerateReview = async (reviewId: string, action: 'approve' | 'reject', reason?: string) => {
    try {
      if (!id) return;
      await api.moderateReview(id, reviewId, action, reason);
      const updatedReviews = reviews.map(review =>
        review.id === reviewId
          ? {
              ...review,
              status: action === 'approve' ? 'approved' as const : 'rejected' as const,
              moderationDetails: {
                status: action === 'approve' ? 'approved' as const : 'rejected' as const,
                reason,
                moderatedAt: new Date().toISOString()
              }
            }
          : review
      ) as Review[];
      setReviews(updatedReviews);
    } catch (err) {
      setError('Failed to moderate review');
      console.error('Error moderating review:', err);
    }
  };

  const handleAddResponse = async (reviewId: string, comment: string) => {
    try {
      if (!id) return;
      const response = await api.addSellerResponse(id, reviewId, comment);
      const updatedReviews = reviews.map(review =>
        review.id === reviewId
          ? { ...review, sellerResponse: response }
          : review
      );
      setReviews(updatedReviews);
    } catch (err) {
      setError('Failed to add response');
      console.error('Error adding response:', err);
    }
  };

  const handleUpdateResponse = async (reviewId: string, responseId: string, comment: string) => {
    try {
      if (!id) return;
      const response = await api.updateSellerResponse(id, reviewId, responseId, comment);
      const updatedReviews = reviews.map(review =>
        review.id === reviewId
          ? { ...review, sellerResponse: response }
          : review
      );
      setReviews(updatedReviews);
    } catch (err) {
      setError('Failed to update response');
      console.error('Error updating response:', err);
    }
  };

  const handleDeleteResponse = async (reviewId: string, responseId: string) => {
    try {
      if (!id) return;
      await api.deleteSellerResponse(id, reviewId, responseId);
      const updatedReviews = reviews.map(review =>
        review.id === reviewId
          ? { ...review, sellerResponse: undefined }
          : review
      );
      setReviews(updatedReviews);
    } catch (err) {
      setError('Failed to delete response');
      console.error('Error deleting response:', err);
    }
  };

  const handleVoteReview = async (reviewId: string, vote: 'helpful' | 'not_helpful') => {
    try {
      if (!id) return;
      const response = await api.voteReview(id, reviewId, vote);
      const updatedReviews = reviews.map(review =>
        review.id === reviewId
          ? {
              ...review,
              helpfulVotes: response.helpfulVotes,
              notHelpfulVotes: response.notHelpfulVotes,
              voters: response.voters
            }
          : review
      );
      setReviews(updatedReviews);
    } catch (err) {
      setError('Failed to vote on review');
      console.error('Error voting on review:', err);
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-green-500 border-t-transparent"></div>
        </div>
      </div>
    );
  }

  if (error || !listing) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center">
            <svg
              className="w-5 h-5 text-red-400 mr-2"
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
            <span className="text-red-800">{error || 'Listing not found'}</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <FoodListingDetails
        listing={listing}
        onBack={handleBack}
        onOrder={handleOrder}
      />
      <div className="mt-8">
        <FoodListingReviews
          reviews={reviews}
          sellerId={listing.sellerId}
          onAddReview={handleAddReview}
          onModerateReview={handleModerateReview}
          onAddResponse={handleAddResponse}
          onUpdateResponse={handleUpdateResponse}
          onDeleteResponse={handleDeleteResponse}
          onVoteReview={handleVoteReview}
        />
      </div>
    </div>
  );
};

export default FoodListingDetailsPage; 