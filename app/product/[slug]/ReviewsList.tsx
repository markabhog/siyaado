"use client";
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';

interface Review {
  id: string;
  rating: number;
  title?: string | null;
  comment: string;
  images?: any;
  verified: boolean;
  helpfulCount: number;
  createdAt: string;
  user?: {
    name?: string | null;
    image?: string | null;
  } | null;
}

interface ReviewsListProps {
  productId: string;
  refreshTrigger?: number;
}

export function ReviewsList({ productId, refreshTrigger = 0 }: ReviewsListProps) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [sortBy, setSortBy] = useState<'recent' | 'helpful' | 'rating'>('recent');

  useEffect(() => {
    fetchReviews();
  }, [productId, refreshTrigger]);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/products/${productId}/reviews`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch reviews');
      }

      const data = await response.json();
      setReviews(data.reviews || []);
    } catch (err: any) {
      setError(err.message || 'Failed to load reviews');
    } finally {
      setLoading(false);
    }
  };

  const sortedReviews = [...reviews].sort((a, b) => {
    switch (sortBy) {
      case 'helpful':
        return b.helpfulCount - a.helpfulCount;
      case 'rating':
        return b.rating - a.rating;
      case 'recent':
      default:
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    }
  });

  const averageRating = reviews.length > 0
    ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
    : 0;

  const ratingDistribution = [5, 4, 3, 2, 1].map(stars => ({
    stars,
    count: reviews.filter(r => r.rating === stars).length,
    percentage: reviews.length > 0 
      ? (reviews.filter(r => r.rating === stars).length / reviews.length) * 100 
      : 0
  }));

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
        {error}
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Rating Summary */}
      <div className="bg-white rounded-xl border border-slate-200 p-6">
        <div className="grid md:grid-cols-2 gap-8">
          {/* Average Rating */}
          <div className="text-center md:text-left">
            <div className="text-5xl font-bold text-slate-900 mb-2">
              {averageRating.toFixed(1)}
            </div>
            <div className="flex justify-center md:justify-start items-center gap-1 mb-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <svg
                  key={star}
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className={`h-6 w-6 ${
                    star <= Math.round(averageRating)
                      ? 'text-yellow-400'
                      : 'text-slate-300'
                  }`}
                >
                  <path d="M11.48 3.499a.562.562 0 011.04 0l2.074 5.034a.563.563 0 00.475.347l5.404.442c.499.041.701.663.321.988l-4.117 3.527a.563.563 0 00-.182.557l1.257 5.273a.562.562 0 01-.84.61l-4.646-2.76a.563.563 0 00-.586 0l-4.646 2.76a.562.562 0 01-.84-.61l1.257-5.273a.563.563 0 00-.182-.557L3.206 10.31a.563.563 0 01.321-.988l5.404-.442a.563.563 0 00.475-.347l2.074-5.034z" />
                </svg>
              ))}
            </div>
            <div className="text-sm text-slate-600">
              Based on {reviews.length} {reviews.length === 1 ? 'review' : 'reviews'}
            </div>
          </div>

          {/* Rating Distribution */}
          <div className="space-y-2">
            {ratingDistribution.map(({ stars, count, percentage }) => (
              <div key={stars} className="flex items-center gap-3">
                <div className="text-sm font-medium text-slate-700 w-12">
                  {stars} star{stars !== 1 ? 's' : ''}
                </div>
                <div className="flex-1 bg-slate-200 rounded-full h-2 overflow-hidden">
                  <div
                    className="bg-yellow-400 h-full transition-all duration-500"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
                <div className="text-sm text-slate-600 w-12 text-right">
                  {count}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Sort Options */}
      {reviews.length > 0 && (
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-slate-900">
            Customer Reviews ({reviews.length})
          </h3>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="px-4 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="recent">Most Recent</option>
            <option value="helpful">Most Helpful</option>
            <option value="rating">Highest Rating</option>
          </select>
        </div>
      )}

      {/* Reviews List */}
      {sortedReviews.length === 0 ? (
        <div className="text-center py-12 bg-slate-50 rounded-xl">
          <p className="text-slate-600">No reviews yet. Be the first to review this product!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {sortedReviews.map((review) => (
            <motion.div
              key={review.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-xl border border-slate-200 p-6 hover:shadow-md transition-shadow"
            >
              {/* Review Header */}
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  {review.user?.image ? (
                    <Image
                      src={review.user.image}
                      alt={review.user.name || 'User'}
                      width={40}
                      height={40}
                      className="rounded-full"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-semibold">
                      {(review.user?.name || 'U')[0].toUpperCase()}
                    </div>
                  )}
                  <div>
                    <div className="font-medium text-slate-900">
                      {review.user?.name || 'Anonymous'}
                      {review.verified && (
                        <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                          ✓ Verified Purchase
                        </span>
                      )}
                    </div>
                    <div className="text-sm text-slate-500">
                      {new Date(review.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </div>
                  </div>
                </div>

                {/* Rating */}
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <svg
                      key={star}
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      className={`h-5 w-5 ${
                        star <= review.rating
                          ? 'text-yellow-400'
                          : 'text-slate-300'
                      }`}
                    >
                      <path d="M11.48 3.499a.562.562 0 011.04 0l2.074 5.034a.563.563 0 00.475.347l5.404.442c.499.041.701.663.321.988l-4.117 3.527a.563.563 0 00-.182.557l1.257 5.273a.562.562 0 01-.84.61l-4.646-2.76a.563.563 0 00-.586 0l-4.646 2.76a.562.562 0 01-.84-.61l1.257-5.273a.563.563 0 00-.182-.557L3.206 10.31a.563.563 0 01.321-.988l5.404-.442a.563.563 0 00.475-.347l2.074-5.034z" />
                    </svg>
                  ))}
                </div>
              </div>

              {/* Review Title */}
              {review.title && (
                <h4 className="font-semibold text-slate-900 mb-2">
                  {review.title}
                </h4>
              )}

              {/* Review Comment */}
              <p className="text-slate-700 leading-relaxed mb-3">
                {review.comment}
              </p>

              {/* Review Images */}
              {review.images && Array.isArray(review.images) && review.images.length > 0 && (
                <div className="flex gap-2 mb-3">
                  {review.images.map((img: string, idx: number) => (
                    <Image
                      key={idx}
                      src={img}
                      alt={`Review image ${idx + 1}`}
                      width={80}
                      height={80}
                      className="rounded-lg object-cover"
                    />
                  ))}
                </div>
              )}

              {/* Helpful Button */}
              <div className="flex items-center gap-4 pt-3 border-t border-slate-200">
                <button className="text-sm text-slate-600 hover:text-blue-600 transition-colors">
                  Helpful ({review.helpfulCount})
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}

