// src/components/places/ReviewSection.tsx
import React, { useState } from 'react';
import { Star } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext';
import { useCreateReview } from '../../hooks/useReviews';
import { Button } from '../ui/Button';
import { formatDate } from '../../utils/format';
import { Review } from '../../types';
import { ThumbsUp, Flag } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
interface ReviewFormData {
  comment: string;
}

interface ReviewSectionProps {
  placeId: number;
  reviews: Review[] | undefined; 
  isLoading: boolean;        
  onReviewAdded: () => void;
}

export const ReviewSection: React.FC<ReviewSectionProps> = ({ 
  placeId, 
  reviews, 
  isLoading, 
  onReviewAdded 
}) => {
  const { isAuthenticated, user } = useAuth();
  const [selectedRating, setSelectedRating] = useState(0);
  const { register, handleSubmit, reset } = useForm<ReviewFormData>();
  const createReviewMutation = useCreateReview(placeId);
  const navigate = useNavigate();
  const onSubmit = async (data: ReviewFormData) => {
    if (!isAuthenticated) {
      toast.error('Please login to write a review');
      return;
    }

    try {
      console.log('Submitting review:', {
        rating: selectedRating,
        comment: data.comment,
      });
      await createReviewMutation.mutateAsync({
        rating: selectedRating,
        comment: data.comment,
      });
      toast.success('Review added successfully!');
      reset();
      setSelectedRating(1);
      onReviewAdded();
    } catch (error) {
      console.error('Review submission error:', error);
      toast.error('Failed to add review');
    }
  };

  const renderStars = (rating: number, interactive = false) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => interactive && setSelectedRating(star)}
            className={interactive ? 'cursor-pointer focus:outline-none' : 'cursor-default'}
          >
            <Star
              className={`w-6 h-6 ${
                star <= (interactive ? selectedRating : rating)
                  ? 'text-yellow-400 fill-current'
                  : 'text-gray-300'
              }`}
            />
          </button>
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-8">
      {/* Write Review Section */}
      {isAuthenticated && (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <h3 className="text-lg font-semibold">Write a Review</h3>
          
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Rating</label>
            {renderStars(selectedRating, true)}
          </div>

          <div>
            <textarea
              {...register('comment', { required: 'Please enter your review' })}
              rows={4}
              placeholder="Share your experience..."
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <Button
            type="submit"
            isLoading={createReviewMutation.isPending}
            disabled={selectedRating === 0}
          >
            Submit Review
          </Button>
        </form>
      )}

      {/* Reviews List */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Reviews</h3>
        
        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-gray-200 rounded-full" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-1/4" />
                    <div className="h-4 bg-gray-200 rounded w-1/2" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : reviews && reviews.length > 0 ? (
          <div className="space-y-6">
            {reviews.map((review) => (
              <div key={review.id} className="border-b pb-6">
                <div className="flex items-start justify-between">
                  <div 
                    className="flex items-center gap-4 cursor-pointer"
                    onClick={() => navigate(`/users/${review.user.id}`)}
                  >
                    {/* User Avatar */}
                    {review.user.avatar ? (
                      <img
                        src={review.user.avatar}
                        alt={review.user.username}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-medium">
                        {review.user.username.charAt(0).toUpperCase()}
                      </div>
                    )}

                    {/* User Info */}
                    <div>
                    <div className="font-medium text-blue-600 hover:text-blue-800">
                      {(review.user.first_name || review.user.last_name) ? (
                        `${review.user.first_name || ''} ${review.user.last_name || ''}`.trim()
                      ) : (
                        review.user.username
                      )}
                    </div>
                      <div className="text-sm text-gray-500">
                        {formatDate(review.created_at)}
                      </div>
                    </div>
                  </div>

                  {/* Rating */}
                  <div className="flex items-center gap-1">
                    {renderStars(review.rating)}
                  </div>
                </div>

                {/* Review Content */}
                <p className="mt-4 text-gray-700">{review.comment}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500">No reviews yet. Be the first to review!</p>
        )}
      </div>
    </div>
  );
};