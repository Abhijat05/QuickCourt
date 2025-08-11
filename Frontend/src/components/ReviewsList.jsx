import { useState, useEffect } from 'react';
import { Card } from './ui/Card';
import { reviewService } from '../services/api';
import { Star, User } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

export default function ReviewsList({ venueId }) {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await reviewService.getVenueReviews(venueId);
        setReviews(response.data);
      } catch (err) {
        setError('Failed to load reviews');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (venueId) {
      fetchReviews();
    }
  }, [venueId]);

  if (loading) {
    return (
      <div className="py-8 flex justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-destructive/10 text-destructive rounded-lg text-center">
        {error}
      </div>
    );
  }

  if (reviews.length === 0) {
    return (
      <div className="text-center py-6 bg-muted/30 rounded-lg">
        <p className="text-muted-foreground">No reviews yet. Be the first to leave a review!</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {reviews.map((review) => (
        <Card key={review.id} className="overflow-hidden">
          <Card.Content className="p-4">
            <div className="flex justify-between items-start mb-2">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                  <User className="w-4 h-4" />
                </div>
                <span className="font-medium">{review.userName}</span>
              </div>
              <div className="flex items-center">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className="w-4 h-4"
                    fill={review.rating >= star ? 'currentColor' : 'none'}
                    color={review.rating >= star ? '#FFB800' : '#D1D5DB'}
                  />
                ))}
              </div>
            </div>
            <p className="text-sm mb-2">{review.comment}</p>
            <div className="text-xs text-muted-foreground">
              {formatDistanceToNow(new Date(review.createdAt), { addSuffix: true })}
            </div>
          </Card.Content>
        </Card>
      ))}
    </div>
  );
}