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
    <section className="py-16 sm:py-24 bg-[#FFF6F8] border-b border-[#F5E8EE] font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 space-y-12">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <Badge variant="pink" icon={<SparklesIcon size={12} />}>COMMUNITY LOVE</Badge>
          <h2 className="text-3xl sm:text-5xl font-serif font-bold text-[#1C1217]">
            Words From Our Connoisseurs
          </h2>
          <div className="flex items-center justify-center gap-2 pt-1 text-sm font-bold text-[#1C1217]">
            <div className="flex text-[#E8C86D]">
              {[...Array(5)].map((_, i) => (
                <StarIcon key={i} size={18} className="fill-current text-[#E8C86D]" />
              ))}
            </div>
            <span>4.95 / 5 Rating</span>
            <span className="text-[#886C7B] font-normal">(2,400+ Verified Reviews)</span>
          </div>
        </div>

        {/* Reviews Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {reviews.map((rev) => (
            <Card key={rev.id} variant="bordered" padding="lg" className="bg-[#FFFFFF] border border-[#F5E8EE] rounded-3xl space-y-4 flex flex-col justify-between hover:shadow-[0_16px_36px_rgba(230,106,138,0.12)] transition-all">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex text-[#E8C86D]">
                    {[...Array(rev.rating)].map((_, i) => (
                      <StarIcon key={i} size={14} className="fill-current text-[#E8C86D]" />
                    ))}
                  </div>
                  <span className="text-[10px] uppercase font-bold text-[#15803D] bg-[#F0FDF4] px-3 py-0.5 rounded-full border border-[#BBF7D0]">
                    ✓ Verified
                  </span>
                </div>

                <p className="text-xs sm:text-sm text-[#422D38] italic leading-relaxed">
                  "{rev.quote}"
                </p>
              </div>

              <div className="pt-4 border-t border-[#F5E8EE] space-y-1 text-xs">
                <div className="font-bold text-[#1C1217] text-sm">{rev.name}</div>
                <div className="text-xs text-[#E87A96] font-serif font-semibold">{rev.candle}</div>
                <div className="text-[10px] text-[#886C7B]">{rev.location} • {rev.date}</div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};
