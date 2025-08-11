import { useState } from 'react';
import { Star } from 'lucide-react';
import Button from './ui/Button';
import { Card } from './ui/Card';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { reviewService } from '../services/api';

export default function ReviewForm({ venueId, onReviewSubmitted }) {
  const { user } = useAuth();
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (rating === 0) {
      toast.error('Please select a rating');
      return;
    }
    
    setIsSubmitting(true);
    try {
      await reviewService.addReview({
        venueId,
        rating,
        comment
      });
      
      toast.success('Review submitted successfully');
      setRating(0);
      setComment('');
      if (onReviewSubmitted) onReviewSubmitted();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to submit review');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="overflow-hidden">
      <Card.Header>
        <Card.Title className="text-lg">Write a Review</Card.Title>
        <Card.Description>Share your experience with other users</Card.Description>
      </Card.Header>
      
      <Card.Content>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Rating</label>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  className="focus:outline-none"
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  onClick={() => setRating(star)}
                >
                  <Star
                    fill={(hoverRating || rating) >= star ? 'currentColor' : 'none'}
                    className={`w-6 h-6 ${
                      (hoverRating || rating) >= star
                        ? 'text-yellow-400'
                        : 'text-muted-foreground'
                    }`}
                  />
                </button>
              ))}
              <span className="ml-2 text-sm text-muted-foreground">
                {rating > 0 ? `${rating}/5` : 'Select rating'}
              </span>
            </div>
          </div>
          
          <div>
            <label htmlFor="comment" className="block text-sm font-medium mb-2">
              Comment
            </label>
            <textarea
              id="comment"
              rows="3"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="w-full px-3 py-2 rounded-md border focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-1 border-input"
              placeholder="Share your experience with this venue..."
            ></textarea>
          </div>
          
          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full"
          >
            {isSubmitting ? (
              <div className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Submitting...
              </div>
            ) : 'Submit Review'}
          </Button>
        </form>
      </Card.Content>
    </Card>
  );
}