import React, { useState } from 'react';
import Rating from '../common/Rating';
import Button from '../common/Button';

interface Review {
  id: string;
  userId: string;
  rating: number;
  comment: string;
  createdAt: Date;
}

interface FoodListingReviewsProps {
  reviews: Review[];
  onAddReview?: (rating: number, comment: string) => void;
}

const FoodListingReviews: React.FC<FoodListingReviewsProps> = ({
  reviews,
  onAddReview,
}) => {
  const [newRating, setNewRating] = useState(5);
  const [newComment, setNewComment] = useState('');
  const [isAddingReview, setIsAddingReview] = useState(false);

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (onAddReview) {
      onAddReview(newRating, newComment);
      setNewComment('');
      setNewRating(5);
      setIsAddingReview(false);
    }
  };

  const averageRating = reviews.reduce((acc, review) => acc + review.rating, 0) / reviews.length;

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-900">
          Reviews ({reviews.length})
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
      {reviews.length > 0 && (
        <div className="mb-6 p-4 bg-gray-50 rounded-lg">
          <div className="flex items-center">
            <div className="text-4xl font-bold text-gray-900 mr-4">
              {averageRating.toFixed(1)}
            </div>
            <div>
              <Rating value={averageRating} readonly size="large" />
              <div className="text-sm text-gray-500 mt-1">
                Based on {reviews.length} reviews
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

      {/* Reviews List */}
      <div className="space-y-6">
        {reviews.map((review) => (
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
          </div>
        ))}
      </div>

      {reviews.length === 0 && !isAddingReview && (
        <div className="text-center py-6 text-gray-500">
          No reviews yet. Be the first to review!
        </div>
      )}
    </div>
  );
};

export default FoodListingReviews; 