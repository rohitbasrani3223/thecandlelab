import React from 'react';
import { Card, Badge, StarIcon, Button, useToast } from '../../design-system';

const customerReviews = [
  {
    id: 1,
    author: 'Clara Hemsworth',
    location: 'Boston, MA',
    rating: 5,
    date: 'July 18, 2026',
    title: 'The ultimate evening luxury candle',
    comment: 'The scent throw of Velvet Rose & Smoked Amber is magnificent. Within 20 minutes of lighting the wood wick, my living room was filled with rich rose and warm smoked oud notes. Pure bliss.',
    verified: true,
    scentThrow: '5 / 5 (Strong Room Filling)',
  },
  {
    id: 2,
    author: 'Julian Vance',
    location: 'Seattle, WA',
    rating: 5,
    date: 'June 29, 2026',
    title: 'Unbelievable quality and presentation',
    comment: 'Arrived in heavy blush foil packaging. The frosted glass vessel is gorgeous on my marble coffee table and burns completely even. Worth every rupee.',
    verified: true,
    scentThrow: '4 / 5 (Subtle Elegance)',
  },
  {
    id: 3,
    author: 'Seraphina Dupont',
    location: 'Miami, FL',
    rating: 5,
    date: 'June 14, 2026',
    title: 'Crackling wick adds so much serenity',
    comment: 'I love turning off the main lights and listening to the soft fireplace crackle of the organic wood wick. Will be purchasing the 3-wick size next.',
    verified: true,
    scentThrow: '5 / 5 (Strong Room Filling)',
  },
];

export const ProductReviewsSection: React.FC = () => {
  const { toast } = useToast();

  return (
    <section id="reviews" className="space-y-8 font-sans border-t border-[#F5E8EE] pt-12">
      {/* Header Summary */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 border-b border-[#F5E8EE] pb-8">
        <div className="space-y-2">
          <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#1C1217]">
            Connoisseur Reviews
          </h2>
          <div className="flex items-center gap-3 text-sm">
            <div className="flex text-[#E8C86D]">
              {[...Array(5)].map((_, i) => (
                <StarIcon key={i} size={18} className="fill-current text-[#E8C86D]" />
              ))}
            </div>
            <span className="font-bold text-[#1C1217]">4.95 out of 5</span>
            <span className="text-[#886C7B]">Based on 142 reviews</span>
          </div>
        </div>

        <Button
          variant="pink"
          size="md"
          onClick={() => toast({ type: 'luxury', title: 'Review Form Opened', description: 'Thank you for sharing your olfactory review.' })}
        >
          Write a Review
        </Button>
      </div>

      {/* Rating Distribution Progress Bars */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center bg-[#FFFFFF] p-6 rounded-3xl border border-[#F5E8EE] shadow-xs">
        <div className="md:col-span-4 text-center md:text-left space-y-1">
          <div className="text-4xl font-serif font-bold text-[#1C1217]">98%</div>
          <span className="text-xs font-semibold text-[#15803D]">of buyers recommend this formulation</span>
        </div>

        <div className="md:col-span-8 space-y-2 text-xs">
          {[
            { stars: '5 Stars', percent: '92%', count: '131' },
            { stars: '4 Stars', percent: '6%', count: '8' },
            { stars: '3 Stars', percent: '2%', count: '3' },
            { stars: '2 Stars', percent: '0%', count: '0' },
            { stars: '1 Star', percent: '0%', count: '0' },
          ].map((bar) => (
            <div key={bar.stars} className="flex items-center gap-3">
              <span className="w-14 text-[#886C7B] font-medium">{bar.stars}</span>
              <div className="flex-1 h-2 bg-[#FFF6F8] rounded-full overflow-hidden border border-[#F5E8EE]">
                <div className="h-full bg-[#E87A96] rounded-full" style={{ width: bar.percent }} />
              </div>
              <span className="w-10 text-right text-[#1C1217] font-semibold">{bar.count}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Reviews Cards List */}
      <div className="space-y-4">
        {customerReviews.map((rev) => (
          <Card key={rev.id} variant="bordered" padding="lg" className="bg-[#FFFFFF] border-[#F5E8EE] rounded-3xl space-y-3 shadow-xs">
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <div className="flex text-[#E8C86D]">
                    {[...Array(rev.rating)].map((_, i) => (
                      <StarIcon key={i} size={14} className="fill-current text-[#E8C86D]" />
                    ))}
                  </div>
                  <Badge variant="pink" size="sm">✓ Verified Buyer</Badge>
                </div>
                <h4 className="font-serif font-bold text-base text-[#1C1217] mt-1">{rev.title}</h4>
              </div>

              <span className="text-[11px] text-[#886C7B]">{rev.date}</span>
            </div>

            <p className="text-xs text-[#624855] leading-relaxed italic">
              "{rev.comment}"
            </p>

            <div className="pt-2 border-t border-[#F5E8EE] flex items-center justify-between text-[11px] text-[#886C7B]">
              <span>By <strong className="text-[#1C1217]">{rev.author}</strong> ({rev.location})</span>
              <span className="text-[#E87A96] font-semibold">Scent Throw Rating: {rev.scentThrow}</span>
            </div>
          </Card>
        ))}
      </div>
    </section>
  );
};
