import React, { useState, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { Card, Badge, StarIcon, Button, useToast } from '../../design-system';
import {
  fetchProductReviews,
  submitCustomerReview,
  type ProductReview,
  type ReviewStats,
} from '../../services/reviewService';

export interface ProductReviewsSectionProps {
  productId?: string;
  productName?: string;
}

export const ProductReviewsSection: React.FC<ProductReviewsSectionProps> = ({
  productId = '',
  productName = 'Candle',
}) => {
  const { toast } = useToast();

  const [reviews, setReviews] = useState<ProductReview[]>([]);
  const [stats, setStats] = useState<ReviewStats>({
    totalReviews: 0,
    averageRating: 0,
    distribution: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 },
  });
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Review Form Modal State
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [formRating, setFormRating] = useState<number>(5);
  const [formHoverRating, setFormHoverRating] = useState<number>(0);
  const [formName, setFormName] = useState<string>('');
  const [formEmail, setFormEmail] = useState<string>('');
  const [formLocation, setFormLocation] = useState<string>('');
  const [formTitle, setFormTitle] = useState<string>('');
  const [formComment, setFormComment] = useState<string>('');
  const [formScentThrow, setFormScentThrow] = useState<string>('5 / 5 (Strong Room Filling)');

  // Load reviews for this product
  const loadReviews = useCallback(async () => {
    if (!productId) return;
    setIsLoading(true);
    try {
      const res = await fetchProductReviews(productId);
      setReviews(res.reviews);
      setStats(res.stats);
    } catch (err) {
      console.warn('Failed to load reviews', err);
    } finally {
      setIsLoading(false);
    }
  }, [productId]);

  useEffect(() => {
    loadReviews();
  }, [loadReviews]);

  // Lock body scroll when review modal is open
  useEffect(() => {
    if (!isModalOpen) return;
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, [isModalOpen]);

  // Handle Review Submission
  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formName.trim() || !formTitle.trim() || !formComment.trim()) {
      toast({
        type: 'warning',
        title: 'Missing Details',
        description: 'Please provide your name, review headline, and detailed feedback.',
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await submitCustomerReview({
        productId,
        productName,
        customerName: formName,
        customerEmail: formEmail,
        customerLocation: formLocation,
        rating: formRating,
        title: formTitle,
        comment: formComment,
        scentThrow: formScentThrow,
      });

      if (res.success) {
        toast({
          type: 'luxury',
          title: 'Review Submitted ✨',
          description: 'Thank you! Your review has been submitted and will appear live once approved by our atelier team.',
        });
        // Reset form & close modal
        setFormName('');
        setFormEmail('');
        setFormLocation('');
        setFormTitle('');
        setFormComment('');
        setFormRating(5);
        setIsModalOpen(false);
      } else {
        toast({
          type: 'error',
          title: 'Submission Failed',
          description: res.message || 'Unable to submit review at this moment.',
        });
      }
    } catch {
      toast({
        type: 'error',
        title: 'Submission Error',
        description: 'An unexpected error occurred while submitting your review.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const ratingLabels: Record<number, string> = {
    1: '1 Star — Disappointing',
    2: '2 Stars — Below Expectations',
    3: '3 Stars — Average / Satisfactory',
    4: '4 Stars — Very Good & Fragrant',
    5: '5 Stars — Exceptional Luxury Perfection',
  };

  const activeDisplayRating = formHoverRating || formRating;

  return (
    <section id="reviews" className="space-y-8 font-sans border-t border-[#EADDCB] pt-12">
      {/* Header Summary */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 border-b border-[#EADDCB] pb-8">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-mono uppercase tracking-widest text-[#8B6F4E] font-bold">
              Authentic Feedback
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#232323]">
            Connoisseur Reviews
          </h2>

          <div className="flex items-center gap-3 text-sm flex-wrap">
            {stats.totalReviews > 0 ? (
              <>
                <div className="flex text-[#8B6F4E]">
                  {[...Array(5)].map((_, i) => (
                    <StarIcon
                      key={i}
                      size={18}
                      className={`fill-current ${
                        i < Math.round(stats.averageRating) ? 'text-[#8B6F4E]' : 'text-stone-300'
                      }`}
                    />
                  ))}
                </div>
                <span className="font-bold text-[#232323]">
                  {stats.averageRating.toFixed(1)} out of 5
                </span>
                <span className="text-[#7D6F63]">
                  Based on {stats.totalReviews} verified {stats.totalReviews === 1 ? 'review' : 'reviews'}
                </span>
              </>
            ) : (
              <span className="text-xs text-[#7D6F63]">
                No reviews yet for this candle. Be the first to review!
              </span>
            )}
          </div>
        </div>

        <Button
          variant="pink"
          size="md"
          onClick={() => setIsModalOpen(true)}
          className="shadow-xs hover:shadow-md transition-all cursor-pointer"
        >
          ✍️ Write a Review
        </Button>
      </div>

      {/* Rating Breakdown & Stats (Only if reviews exist) */}
      {stats.totalReviews > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center bg-[#FFFFFF] p-6 rounded-3xl border border-[#EADDCB] shadow-xs">
          <div className="md:col-span-4 text-center md:text-left space-y-1">
            <div className="text-4xl sm:text-5xl font-serif font-bold text-[#232323]">
              {stats.averageRating.toFixed(1)}
            </div>
            <div className="flex justify-center md:justify-start text-[#8B6F4E] my-1">
              {[...Array(5)].map((_, i) => (
                <StarIcon
                  key={i}
                  size={16}
                  className={`fill-current ${
                    i < Math.round(stats.averageRating) ? 'text-[#8B6F4E]' : 'text-stone-300'
                  }`}
                />
              ))}
            </div>
            <span className="text-xs font-semibold text-[#15803D] block">
              100% verified customer impressions
            </span>
          </div>

          <div className="md:col-span-8 space-y-2 text-xs">
            {[5, 4, 3, 2, 1].map((star) => {
              const count = stats.distribution[star as 1 | 2 | 3 | 4 | 5] || 0;
              const percent = stats.totalReviews > 0 ? Math.round((count / stats.totalReviews) * 100) : 0;
              return (
                <div key={star} className="flex items-center gap-3">
                  <span className="w-14 text-[#7D6F63] font-medium">{star} Stars</span>
                  <div className="flex-1 h-2 bg-[#FAF7F2] rounded-full overflow-hidden border border-[#EADDCB]">
                    <div
                      className="h-full bg-[#8B6F4E] rounded-full transition-all duration-500"
                      style={{ width: `${percent}%` }}
                    />
                  </div>
                  <span className="w-10 text-right text-[#232323] font-semibold">{count}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Reviews Cards List */}
      <div className="space-y-4">
        {isLoading ? (
          <div className="p-8 text-center text-xs font-mono text-[#8B6F4E] animate-pulse">
            Loading verified reviews...
          </div>
        ) : reviews.length > 0 ? (
          reviews.map((rev) => (
            <Card
              key={rev.id}
              variant="bordered"
              padding="lg"
              className="bg-[#FFFFFF] border-[#EADDCB] rounded-3xl space-y-3 shadow-xs hover:border-[#8B6F4E]/40 transition-all"
            >
              <div className="flex items-start justify-between flex-wrap gap-2">
                <div>
                  <div className="flex items-center gap-2">
                    <div className="flex text-[#8B6F4E]">
                      {[...Array(5)].map((_, i) => (
                        <StarIcon
                          key={i}
                          size={14}
                          className={`fill-current ${i < rev.rating ? 'text-[#8B6F4E]' : 'text-stone-300'}`}
                        />
                      ))}
                    </div>
                    {rev.isVerifiedBuyer && (
                      <Badge variant="pink" size="sm">
                        ✓ Verified Buyer
                      </Badge>
                    )}
                  </div>
                  <h4 className="font-serif font-bold text-base text-[#232323] mt-1.5">{rev.title}</h4>
                </div>

                <span className="text-[11px] font-mono text-[#7D6F63]">
                  {new Date(rev.createdAt).toLocaleDateString('en-IN', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                  })}
                </span>
              </div>

              <p className="text-xs text-[#5C5149] leading-relaxed italic">
                "{rev.comment}"
              </p>

              <div className="pt-2.5 border-t border-[#EADDCB] flex items-center justify-between text-[11px] text-[#7D6F63] flex-wrap gap-2">
                <span>
                  By <strong className="text-[#232323]">{rev.customerName}</strong>
                  {rev.customerLocation ? ` (${rev.customerLocation})` : ''}
                </span>
                {rev.scentThrow && (
                  <span className="text-[#8B6F4E] font-semibold">
                    Scent Throw: {rev.scentThrow}
                  </span>
                )}
              </div>
            </Card>
          ))
        ) : (
          <div className="bg-[#FFFFFF] p-8 sm:p-12 rounded-3xl border border-[#EADDCB] text-center space-y-4">
            <div className="w-12 h-12 rounded-full bg-[#8B6F4E]/10 text-[#8B6F4E] mx-auto flex items-center justify-center text-xl">
              🕯️
            </div>
            <div className="space-y-1">
              <h3 className="font-serif font-bold text-lg text-[#232323]">
                Be the first to review "{productName}"
              </h3>
              <p className="text-xs text-[#7D6F63] max-w-md mx-auto">
                Have you enjoyed lighting this hand-poured formulation? Share your olfactory experience to help fellow candle connoisseurs.
              </p>
            </div>
            <Button
              variant="pink"
              size="md"
              onClick={() => setIsModalOpen(true)}
              className="cursor-pointer"
            >
              Write First Review
            </Button>
          </div>
        )}
      </div>

      {/* Write a Review Modal */}
      {isModalOpen && typeof document !== 'undefined' && createPortal(
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn font-sans">
          <div
            className="fixed inset-0"
            onClick={() => !isSubmitting && setIsModalOpen(false)}
            aria-hidden="true"
          />

          <div className="relative w-full max-w-lg bg-[#FFFFFF] rounded-3xl shadow-2xl border border-[#EADDCB] overflow-hidden z-10 max-h-[90vh] flex flex-col animate-scaleUp">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-[#EADDCB] bg-[#FAF8F5] shrink-0">
              <div>
                <h3 className="font-serif font-bold text-base text-[#232323]">Write an Olfactory Review</h3>
                <p className="text-[11px] text-[#7D6F63] truncate max-w-xs">{productName}</p>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                disabled={isSubmitting}
                className="w-8 h-8 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-500 hover:text-stone-800 flex items-center justify-center text-sm transition-colors cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSubmitReview} className="p-6 overflow-y-auto space-y-4 text-xs">
              {/* Star Rating Picker */}
              <div className="space-y-1.5 p-3.5 bg-[#FAF8F5] rounded-2xl border border-[#EADDCB] text-center">
                <label className="font-bold text-[#232323] text-xs block">
                  Overall Rating *
                </label>
                <div className="flex items-center justify-center gap-1.5 py-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setFormRating(star)}
                      onMouseEnter={() => setFormHoverRating(star)}
                      onMouseLeave={() => setFormHoverRating(0)}
                      className="p-1 text-2xl transition-transform hover:scale-125 focus:outline-hidden cursor-pointer"
                      title={`${star} Star`}
                    >
                      <span className={star <= activeDisplayRating ? 'text-[#8B6F4E]' : 'text-stone-300'}>
                        ★
                      </span>
                    </button>
                  ))}
                </div>
                <p className="text-[11px] font-medium text-[#8B6F4E]">
                  {ratingLabels[activeDisplayRating] || ''}
                </p>
              </div>

              {/* Scent Throw Selector */}
              <div className="space-y-1">
                <label className="font-bold text-[#232323] block">
                  Scent Throw Strength
                </label>
                <select
                  value={formScentThrow}
                  onChange={(e) => setFormScentThrow(e.target.value)}
                  className="w-full bg-[#FAF7F2] border border-[#EADDCB] rounded-xl px-3 py-2 text-xs text-[#232323] focus:border-[#8B6F4E] outline-hidden cursor-pointer"
                >
                  <option value="5 / 5 (Strong Room Filling)">5 / 5 — Strong & Room-Filling</option>
                  <option value="4 / 5 (Balanced & Noticeable)">4 / 5 — Balanced & Noticeable</option>
                  <option value="3 / 5 (Subtle Elegance)">3 / 5 — Subtle & Gentle Ambience</option>
                  <option value="2 / 5 (Intimate / Close Range)">2 / 5 — Intimate & Soft</option>
                </select>
              </div>

              {/* Name & City */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-[#232323] block">
                    Your Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Aditi Sharma"
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    className="w-full bg-[#FAF7F2] border border-[#EADDCB] rounded-xl px-3 py-2 text-xs text-[#232323] focus:border-[#8B6F4E] outline-hidden"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-[#232323] block">
                    City / Location (Optional)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Mumbai, MH"
                    value={formLocation}
                    onChange={(e) => setFormLocation(e.target.value)}
                    className="w-full bg-[#FAF7F2] border border-[#EADDCB] rounded-xl px-3 py-2 text-xs text-[#232323] focus:border-[#8B6F4E] outline-hidden"
                  />
                </div>
              </div>

              {/* Email (Private) */}
              <div className="space-y-1">
                <label className="font-bold text-[#232323] block">
                  Email Address <span className="font-normal text-[#7D6F63]">(Kept confidential, for verification only)</span>
                </label>
                <input
                  type="email"
                  placeholder="your.email@example.com"
                  value={formEmail}
                  onChange={(e) => setFormEmail(e.target.value)}
                  className="w-full bg-[#FAF7F2] border border-[#EADDCB] rounded-xl px-3 py-2 text-xs text-[#232323] focus:border-[#8B6F4E] outline-hidden"
                />
              </div>

              {/* Review Headline / Title */}
              <div className="space-y-1">
                <label className="font-bold text-[#232323] block">
                  Review Headline *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Beautiful calming fragrance with magnificent throw"
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  className="w-full bg-[#FAF7F2] border border-[#EADDCB] rounded-xl px-3 py-2 text-xs text-[#232323] focus:border-[#8B6F4E] outline-hidden"
                />
              </div>

              {/* Detailed Review */}
              <div className="space-y-1">
                <label className="font-bold text-[#232323] block">
                  Detailed Olfactory Review *
                </label>
                <textarea
                  required
                  rows={4}
                  placeholder="Tell us about the scent notes, burn quality, vessel elegance, and overall serenity..."
                  value={formComment}
                  onChange={(e) => setFormComment(e.target.value)}
                  className="w-full bg-[#FAF7F2] border border-[#EADDCB] rounded-xl p-3 text-xs text-[#232323] focus:border-[#8B6F4E] outline-hidden resize-none"
                />
              </div>

              {/* Moderation Disclaimer Notice */}
              <div className="p-3 bg-[#FAF8F5] rounded-xl border border-[#EADDCB] text-[11px] text-[#7D6F63] flex items-center gap-2">
                <span>🛡️</span>
                <span>
                  To ensure authentic connoisseur trust, reviews are reviewed by our team before going live.
                </span>
              </div>

              {/* Submit Buttons */}
              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  disabled={isSubmitting}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-[#7D6F63] hover:text-[#232323] hover:bg-stone-100 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-2.5 rounded-xl text-xs font-bold bg-[#8B6F4E] hover:bg-[#725a3f] text-white shadow-xs active:scale-95 transition-all cursor-pointer disabled:opacity-50"
                >
                  {isSubmitting ? 'Submitting Review...' : 'Submit Review'}
                </button>
              </div>
            </form>
          </div>
        </div>,
        document.body
      )}
    </section>
  );
};
