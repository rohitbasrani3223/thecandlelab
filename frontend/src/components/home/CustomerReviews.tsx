import React from 'react';
import { Card, Badge, StarIcon, SparklesIcon } from '../../design-system';

const reviews = [
  {
    id: 'rev-1',
    name: 'Eleanor Vance',
    location: 'New York, NY',
    rating: 5,
    candle: 'Velvet Rose & Smoked Amber',
    quote: 'The scent throw fills my entire living room without being overwhelming. The crackling wood wick adds such a cozy, luxurious ambiance. Will definitely reorder!',
    date: 'Verified Buyer • July 2026',
  },
  {
    id: 'rev-2',
    name: 'Marcus Sterling',
    location: 'Chicago, IL',
    rating: 5,
    candle: 'French Bourbon Vanilla Bean',
    quote: 'Absolute perfection. The packaging alone felt like opening a high-end luxury gift. Burned clean down to the bottom with zero tunnelling.',
    date: 'Verified Buyer • June 2026',
  },
  {
    id: 'rev-3',
    name: 'Sophia Laurent',
    location: 'Los Angeles, CA',
    rating: 5,
    candle: 'Mysore Sandalwood & Cedar',
    quote: 'I use this during my evening reading sessions. The botanical oils feel so authentic and calming. Truly artisanal quality.',
    date: 'Verified Buyer • July 2026',
  },
];

export const CustomerReviews: React.FC = () => {
  return (
    <section className="py-16 sm:py-24 bg-[#F5EEE4] border-b border-[#E5DAC7] font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 space-y-12">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <Badge variant="gold" icon={<SparklesIcon size={12} />}>COMMUNITY LOVE</Badge>
          <h2 className="text-3xl sm:text-5xl font-serif font-bold text-[#241812]">
            Words From Our Connoisseurs
          </h2>
          <div className="flex items-center justify-center gap-2 pt-1 text-sm font-bold text-[#241812]">
            <div className="flex text-[#C5983A]">
              {[...Array(5)].map((_, i) => (
                <StarIcon key={i} size={18} className="fill-current text-[#C5983A]" />
              ))}
            </div>
            <span>4.95 / 5 Rating</span>
            <span className="text-[#847262] font-normal">(2,400+ Verified Reviews)</span>
          </div>
        </div>

        {/* Reviews Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {reviews.map((rev) => (
            <Card key={rev.id} variant="bordered" padding="lg" className="bg-[#FAF7F2] border border-[#E5DAC7] rounded-2xl space-y-4 flex flex-col justify-between hover:shadow-[0_16px_36px_rgba(36,24,18,0.11)] transition-all">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex text-[#C5983A]">
                    {[...Array(rev.rating)].map((_, i) => (
                      <StarIcon key={i} size={14} className="fill-current text-[#C5983A]" />
                    ))}
                  </div>
                  <span className="text-[10px] uppercase font-bold text-[#2E6F40] bg-[#EAF5ED] px-2.5 py-0.5 rounded-full border border-[#A8D9B4]/50">
                    ✓ Verified
                  </span>
                </div>

                <p className="text-xs sm:text-sm text-[#3E3027] italic leading-relaxed">
                  "{rev.quote}"
                </p>
              </div>

              <div className="pt-4 border-t border-[#E5DAC7] space-y-1 text-xs">
                <div className="font-bold text-[#241812] text-sm">{rev.name}</div>
                <div className="text-xs text-[#C5983A] font-serif font-semibold">{rev.candle}</div>
                <div className="text-[10px] text-[#847262]">{rev.location} • {rev.date}</div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};
