import React, { useState, useEffect } from 'react';
import { Card, Badge, StarIcon, SparklesIcon } from '../../design-system';
import { fetchRecentApprovedReviews, type ProductReview } from '../../services/reviewService';

export const CustomerReviews: React.FC = () => {
  const [reviews, setReviews] = useState<ProductReview[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    let isMounted = true;
    fetchRecentApprovedReviews(3).then((res) => {
      if (isMounted) {
        setReviews(res);
        setLoading(false);
      }
    });
    return () => {
      isMounted = false;
    };
  }, []);

  const totalReviewsCount = reviews.length;
  const avgRating = totalReviewsCount > 0
    ? (reviews.reduce((acc, r) => acc + r.rating, 0) / totalReviewsCount).toFixed(1)
    : '5.0';

  return (
    <section className="py-16 sm:py-24 bg-[#F8F6F0] border-b border-[#EADDCB] font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 space-y-12">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <Badge variant="gold" icon={<SparklesIcon size={12} />}>COMMUNITY LOVE</Badge>
          <h2 className="text-3xl sm:text-5xl font-serif font-bold text-[#232323]">
            Words From Our Connoisseurs
          </h2>
          <div className="flex items-center justify-center gap-2 pt-1 text-sm font-bold text-[#232323] flex-wrap">
            <div className="flex text-[#8B6F4E]">
              {[...Array(5)].map((_, i) => (
                <StarIcon key={i} size={18} className="fill-current text-[#8B6F4E]" />
              ))}
            </div>
            <span>{avgRating} / 5 Rating</span>
            <span className="text-[#7D6F63] font-normal">
              {totalReviewsCount > 0 ? `(${totalReviewsCount} Verified Connoisseur Impressions)` : '(Real Customer Feedback)'}
            </span>
          </div>
        </div>

        {/* Reviews Grid */}
        {loading ? (
          <div className="text-center py-12 text-xs font-mono text-[#8B6F4E] animate-pulse">
            Loading connoisseur stories...
          </div>
        ) : reviews.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {reviews.map((rev) => (
              <Card
                key={rev.id}
                variant="bordered"
                padding="lg"
                className="bg-[#FFFFFF] border border-[#EADDCB] rounded-3xl space-y-4 flex flex-col justify-between hover:shadow-[0_16px_36px_rgba(139,111,78,0.14)] transition-all"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex text-[#8B6F4E]">
                      {[...Array(rev.rating)].map((_, i) => (
                        <StarIcon key={i} size={14} className="fill-current text-[#8B6F4E]" />
                      ))}
                    </div>
                    {rev.isVerifiedBuyer && (
                      <span className="text-[10px] uppercase font-bold text-[#6B6E4A] bg-[#EFF1E5] px-3 py-0.5 rounded-full border border-[#BFC69E]">
                        ✓ Verified Buyer
                      </span>
                    )}
                  </div>

                  <h4 className="font-serif font-bold text-sm text-[#232323]">{rev.title}</h4>

                  <p className="text-xs sm:text-sm text-[#5C5149] italic leading-relaxed line-clamp-4">
                    "{rev.comment}"
                  </p>
                </div>

                <div className="pt-4 border-t border-[#EADDCB] flex items-center justify-between">
                  <div>
                    <h5 className="font-serif font-bold text-xs text-[#232323]">{rev.customerName}</h5>
                    {rev.customerLocation && (
                      <span className="text-[10px] text-[#7D6F63]">{rev.customerLocation}</span>
                    )}
                  </div>
                  {rev.productName && (
                    <span className="text-[10px] font-mono text-[#8B6F4E] font-semibold truncate max-w-[130px]">
                      {rev.productName}
                    </span>
                  )}
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <div className="max-w-xl mx-auto bg-[#FFFFFF] border border-[#EADDCB] rounded-3xl p-8 text-center space-y-4 shadow-xs">
            <div className="w-12 h-12 rounded-full bg-amber-500/10 text-amber-700 flex items-center justify-center mx-auto text-xl">
              ✨
            </div>
            <div className="space-y-1">
              <h3 className="font-serif font-bold text-base text-[#232323]">Authentic Candle Lab Experiences</h3>
              <p className="text-xs text-[#7D6F63] leading-relaxed">
                Every review on The Candle Lab is 100% genuine and verified by our atelier team. Order your first hand-poured candle and share your impression with us!
              </p>
            </div>
            <a
              href="#shop"
              className="inline-block px-5 py-2.5 rounded-xl bg-[#8B6F4E] hover:bg-[#725a3f] text-white text-xs font-bold transition-all shadow-xs"
            >
              Explore Artisanal Collection →
            </a>
          </div>
        )}
      </div>
    </section>
  );
};
