"use client";
import { useState } from 'react';
import { motion } from 'framer-motion';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

interface ReviewFormProps {
  productId: string;
  onReviewSubmitted?: () => void;
}

export function ReviewForm({ productId, onReviewSubmitted }: ReviewFormProps) {
  const { data: session } = useSession();
  const router = useRouter();
  const [rating, setRating] = useState(5);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [title, setTitle] = useState('');
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!session) {
      router.push('/auth/signin?callbackUrl=' + encodeURIComponent(window.location.href));
      return;
    }

    if (!comment.trim()) {
      setError('Please write a review');
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      const response = await fetch(`/api/products/${productId}/reviews`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          rating,
          title: title.trim() || null,
          comment: comment.trim(),
          images: [] // TODO: Add image upload support
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to submit review');
      }

      setSuccess(true);
      setTitle('');
      setComment('');
      setRating(5);
      
      // Call callback if provided
      if (onReviewSubmitted) {
        onReviewSubmitted();
      }

      // Reset success message after 3 seconds
      setTimeout(() => setSuccess(false), 3000);
    } catch (err: any) {
      setError(err.message || 'Failed to submit review');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!session) {
    return (
      <div className="bg-blue-50 rounded-xl p-6 text-center">
        <p className="text-slate-700 mb-4">Sign in to write a review</p>
        <button
          onClick={() => router.push('/auth/signin?callbackUrl=' + encodeURIComponent(window.location.href))}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Sign In
        </button>
      </div>
    );
  }

  return (
    <motion.form
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      onSubmit={handleSubmit}
      className="bg-white rounded-xl border border-slate-200 p-6 space-y-6"
    >
      <h3 className="text-xl font-semibold text-slate-900">Write a Review</h3>

      {/* Rating */}
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">
          Rating
        </label>
        <div className="flex gap-2">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => setRating(star)}
              onMouseEnter={() => setHoveredRating(star)}
              onMouseLeave={() => setHoveredRating(0)}
              className="transition-transform hover:scale-110"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className={`h-8 w-8 ${
                  star <= (hoveredRating || rating)
                    ? 'text-yellow-400'
                    : 'text-slate-300'
                }`}
              >
                <path d="M11.48 3.499a.562.562 0 011.04 0l2.074 5.034a.563.563 0 00.475.347l5.404.442c.499.041.701.663.321.988l-4.117 3.527a.563.563 0 00-.182.557l1.257 5.273a.562.562 0 01-.84.61l-4.646-2.76a.563.563 0 00-.586 0l-4.646 2.76a.562.562 0 01-.84-.61l1.257-5.273a.563.563 0 00-.182-.557L3.206 10.31a.563.563 0 01.321-.988l5.404-.442a.563.563 0 00.475-.347l2.074-5.034z" />
              </svg>
            </button>
          ))}
          <span className="ml-2 text-sm text-slate-600 self-center">
            {rating} {rating === 1 ? 'star' : 'stars'}
          </span>
        </div>
      </div>

      {/* Title (Optional) */}
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">
          Review Title (Optional)
        </label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Sum up your experience"
          maxLength={100}
          className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      {/* Comment */}
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">
          Your Review <span className="text-red-500">*</span>
        </label>
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Share your thoughts about this product..."
          rows={5}
          required
          className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
        />
        <div className="mt-1 text-xs text-slate-500">
          {comment.length} characters
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
          {error}
        </div>
      )}

      {/* Success Message */}
      {success && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg text-sm"
        >
          ✓ Review submitted successfully! Thank you for your feedback.
        </motion.div>
      )}

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isSubmitting || !comment.trim()}
        className={`
          w-full py-3 px-6 rounded-lg font-semibold text-white transition-colors
          ${isSubmitting || !comment.trim()
            ? 'bg-slate-400 cursor-not-allowed'
            : 'bg-blue-600 hover:bg-blue-700'
          }
        `}
      >
        {isSubmitting ? 'Submitting...' : 'Submit Review'}
      </button>
    </motion.form>
  );
}

