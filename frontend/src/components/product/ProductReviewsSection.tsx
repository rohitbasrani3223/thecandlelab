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
    comment: 'Arrived in heavy gold foil packaging. The frosted glass vessel is gorgeous on my marble coffee table and burns completely even. Worth every dollar.',
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
    <section id="reviews" className="space-y-8 font-sans border-t border-[#E5D9C5] pt-12">
      {/* Header Summary */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 border-b border-[#E5D9C5] pb-8">
        <div className="space-y-2">
          <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#2A1E17]">
            Connoisseur Reviews
          </h2>
          <div className="flex items-center gap-3 text-sm">
            <div className="flex text-[#D4AF37]">
              {[...Array(5)].map((_, i) => (
                <StarIcon key={i} size={18} className="fill-current text-[#D4AF37]" />
              ))}
            </div>
            <span className="font-bold text-[#2A1E17]">4.95 out of 5</span>
            <span className="text-[#8C7A6B]">Based on 142 reviews</span>
          </div>
        </div>

        <Button
          variant="gold"
          size="md"
          onClick={() => toast({ type: 'luxury', title: 'Review Form Opened', description: 'Thank you for sharing your olfactory review.' })}
        >
          Write a Review
        </Button>
      </div>

      {/* Rating Distribution Progress Bars */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center bg-[#F4EFE6] p-6 rounded-md border border-[#E5D9C5]">
        <div className="md:col-span-4 text-center md:text-left space-y-1">
          <div className="text-4xl font-serif font-bold text-[#2A1E17]">98%</div>
          <span className="text-xs font-semibold text-[#2E6F40]">of buyers recommend this formulation</span>
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
              <span className="w-14 text-[#8C7A6B] font-medium">{bar.stars}</span>
              <div className="flex-1 h-2 bg-[#E5D9C5] rounded-full overflow-hidden">
                <div className="h-full bg-[#D4AF37] rounded-full" style={{ width: bar.percent }} />
              </div>
              <span className="w-10 text-right text-[#2A1E17] font-semibold">{bar.count}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Reviews Cards List */}
      <div className="space-y-4">
        {customerReviews.map((rev) => (
          <Card key={rev.id} variant="bordered" padding="lg" className="bg-[#FAF6F0] space-y-3">
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <div className="flex text-[#D4AF37]">
                    {[...Array(rev.rating)].map((_, i) => (
                      <StarIcon key={i} size={14} className="fill-current text-[#D4AF37]" />
                    ))}
                  </div>
                  <Badge variant="success" size="sm">✓ Verified Buyer</Badge>
                </div>
                <h4 className="font-serif font-bold text-base text-[#2A1E17] mt-1">{rev.title}</h4>
              </div>

              <span className="text-[11px] text-[#8C7A6B]">{rev.date}</span>
            </div>

            <p className="text-xs text-[#4A3B32] leading-relaxed italic">
              "{rev.comment}"
            </p>

            <div className="pt-2 border-t border-[#F4EFE6] flex items-center justify-between text-[11px] text-[#8C7A6B]">
              <span>By <strong className="text-[#2A1E17]">{rev.author}</strong> ({rev.location})</span>
              <span className="text-[#D4AF37] font-semibold">Scent Throw Rating: {rev.scentThrow}</span>
            </div>
          </Card>
        ))}
      </div>
    </section>
  );
};
