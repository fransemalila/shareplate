import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Review, ReviewResponse } from '../../types';
import Rating from '../common/Rating';
import Button from '../common/Button';

interface FoodListingReviewsProps {
  reviews: Review[];
  sellerId: string;
  onAddReview?: (rating: number, comment: string) => Promise<void>;
  onModerateReview?: (reviewId: string, action: 'approve' | 'reject', reason?: string) => Promise<void>;
  onAddResponse?: (reviewId: string, comment: string) => Promise<void>;
  onUpdateResponse?: (reviewId: string, responseId: string, comment: string) => Promise<void>;
  onDeleteResponse?: (reviewId: string, responseId: string) => Promise<void>;
  onVoteReview?: (reviewId: string, vote: 'helpful' | 'not_helpful') => Promise<void>;
}

const FoodListingReviews: React.FC<FoodListingReviewsProps> = ({
  reviews,
  sellerId,
  onAddReview,
  onModerateReview,
  onAddResponse,
  onUpdateResponse,
  onDeleteResponse,
  onVoteReview,
}) => {
  const { user } = useAuth();
  const [newRating, setNewRating] = useState(5);
  const [newComment, setNewComment] = useState('');
  const [isAddingReview, setIsAddingReview] = useState(false);
  const [moderationReason, setModerationReason] = useState('');
  const [responseComment, setResponseComment] = useState('');
  const [editingResponseId, setEditingResponseId] = useState<string | null>(null);

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (onAddReview) {
      await onAddReview(newRating, newComment);
      setNewComment('');
      setNewRating(5);
      setIsAddingReview(false);
    }
  };

  const handleModerateReview = async (reviewId: string, action: 'approve' | 'reject') => {
    if (onModerateReview) {
      await onModerateReview(reviewId, action, action === 'reject' ? moderationReason : undefined);
      setModerationReason('');
    }
  };

  const handleSubmitResponse = async (reviewId: string) => {
    if (onAddResponse) {
      await onAddResponse(reviewId, responseComment);
      setResponseComment('');
    }
  };

  const handleUpdateResponse = async (reviewId: string, responseId: string) => {
    if (onUpdateResponse) {
      await onUpdateResponse(reviewId, responseId, responseComment);
      setResponseComment('');
      setEditingResponseId(null);
    }
  };

  const isAdmin = user?.role === 'admin';
  const isSeller = user?.id === sellerId;
  const approvedReviews = reviews.filter(review => review.status === 'approved');
  const pendingReviews = reviews.filter(review => review.status === 'pending');
  const averageRating = approvedReviews.reduce((acc, review) => acc + review.rating, 0) / approvedReviews.length;

  const renderReviewActions = (review: Review) => {
    const hasVoted = user && review.voters?.includes(user.id);
    
    return (
      <div className="flex items-center space-x-2 mt-2">
        {!hasVoted && onVoteReview && (
          <>
            <button
              onClick={() => onVoteReview(review.id, 'helpful')}
              className="text-sm text-gray-600 hover:text-green-600"
            >
              Helpful ({review.helpfulVotes})
            </button>
            <button
              onClick={() => onVoteReview(review.id, 'not_helpful')}
              className="text-sm text-gray-600 hover:text-red-600"
            >
              Not Helpful ({review.notHelpfulVotes})
            </button>
          </>
        )}
      </div>
    );
  };

  const renderSellerResponse = (review: Review) => {
    if (!isSeller) return null;

    if (review.sellerResponse && editingResponseId !== review.sellerResponse.id) {
      return (
        <div className="mt-4 pl-4 border-l-4 border-gray-200">
          <div className="text-sm text-gray-600">Seller Response:</div>
          <p className="text-gray-800">{review.sellerResponse.comment}</p>
          <div className="mt-2 space-x-2">
            <button
              onClick={() => {
                setEditingResponseId(review.sellerResponse!.id);
                setResponseComment(review.sellerResponse!.comment);
              }}
              className="text-sm text-blue-600 hover:text-blue-800"
            >
              Edit Response
            </button>
            <button
              onClick={() => onDeleteResponse?.(review.id, review.sellerResponse!.id)}
              className="text-sm text-red-600 hover:text-red-800"
            >
              Delete Response
            </button>
          </div>
        </div>
      );
    }

    if (editingResponseId === review.sellerResponse?.id) {
      return (
        <div className="mt-4">
          <textarea
            value={responseComment}
            onChange={(e) => setResponseComment(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
            rows={3}
          />
          <div className="mt-2 space-x-2">
            <Button
              variant="primary"
              onClick={() => handleUpdateResponse(review.id, review.sellerResponse!.id)}
            >
              Update Response
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                setEditingResponseId(null);
                setResponseComment('');
              }}
            >
              Cancel
            </Button>
          </div>
        </div>
      );
    }

    return (
      <div className="mt-4">
        <textarea
          value={responseComment}
          onChange={(e) => setResponseComment(e.target.value)}
          placeholder="Write a response to this review..."
          className="w-full px-3 py-2 border border-gray-300 rounded-md"
          rows={3}
        />
        <Button
          variant="primary"
          className="mt-2"
          onClick={() => handleSubmitResponse(review.id)}
        >
          Add Response
        </Button>
      </div>
    );
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-900">
          Reviews ({approvedReviews.length})
        </h2>
        {onAddReview && !isAddingReview && (
          <Button
            variant="outline"
            onClick={() => setIsAddingReview(true)}
          >
            Write a Review
          </Button>
        )}
      </div>

      {/* Review Summary */}
      {approvedReviews.length > 0 && (
        <div className="mb-6 p-4 bg-gray-50 rounded-lg">
          <div className="flex items-center">
            <div className="text-4xl font-bold text-gray-900 mr-4">
              {averageRating.toFixed(1)}
            </div>
            <div>
              <Rating value={averageRating} readonly size="large" />
              <div className="text-sm text-gray-500 mt-1">
                Based on {approvedReviews.length} reviews
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Review Form */}
      {isAddingReview && (
        <form onSubmit={handleSubmitReview} className="mb-6 p-4 border rounded-lg">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Write Your Review</h3>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Rating
            </label>
            <Rating
              value={newRating}
              onChange={setNewRating}
              size="large"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Comment
            </label>
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              rows={4}
              required
            />
          </div>
          <div className="flex gap-2">
            <Button type="submit" variant="primary">
              Submit Review
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsAddingReview(false)}
            >
              Cancel
            </Button>
          </div>
        </form>
      )}

      {/* Pending Reviews (Admin Only) */}
      {isAdmin && pendingReviews.length > 0 && (
        <div className="mb-8">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Pending Reviews</h3>
          <div className="space-y-6">
            {pendingReviews.map((review) => (
              <div key={review.id} className="border p-4 rounded-lg bg-yellow-50">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <div className="font-medium text-gray-900">User #{review.userId}</div>
                    <div className="text-sm text-gray-500">
                      {new Date(review.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                  <Rating value={review.rating} readonly size="small" />
                </div>
                <p className="text-gray-600 mb-4">{review.comment}</p>
                <div className="space-y-2">
                  <textarea
                    value={moderationReason}
                    onChange={(e) => setModerationReason(e.target.value)}
                    placeholder="Reason for rejection (optional)"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    rows={2}
                  />
                  <div className="flex gap-2">
                    <Button
                      variant="primary"
                      onClick={() => handleModerateReview(review.id, 'approve')}
                    >
                      Approve
                    </Button>
                    <Button
                      variant="danger"
                      onClick={() => handleModerateReview(review.id, 'reject')}
                    >
                      Reject
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Approved Reviews */}
      <div className="space-y-6">
        {approvedReviews.map((review) => (
          <div key={review.id} className="border-b pb-6 last:border-b-0">
            <div className="flex justify-between items-start mb-2">
              <div>
                <div className="font-medium text-gray-900">User #{review.userId}</div>
                <div className="text-sm text-gray-500">
                  {new Date(review.createdAt).toLocaleDateString()}
                </div>
              </div>
              <Rating value={review.rating} readonly size="small" />
            </div>
            <p className="text-gray-600">{review.comment}</p>
            {renderReviewActions(review)}
            {renderSellerResponse(review)}
          </div>
        ))}
      </div>

      {approvedReviews.length === 0 && !isAddingReview && (
        <div className="text-center py-6 text-gray-500">
          No reviews yet. Be the first to review!
        </div>
      )}
    </div>
  );
};

export default FoodListingReviews; 