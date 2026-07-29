import React from 'react';
import { Badge, SparklesIcon, HeartIcon } from '../../design-system';

const instaPosts = [
  { id: 1, title: 'Evening Sanctuary Vibes', likes: '1.4k', tag: '#thecandlelab' },
  { id: 2, title: 'Unboxing 24K Gold Series', likes: '2.1k', tag: '#luxurycandles' },
  { id: 3, title: 'Botanical Oil Infusion', likes: '980', tag: '#soycandles' },
  { id: 4, title: 'Wood Wick Flame Dance', likes: '3.2k', tag: '#candlecare' },
];

export const InstagramGallery: React.FC = () => {
  return (
    <section className="py-16 sm:py-24 bg-[#FAF6F0] border-b border-[#E5D9C5] font-sans">
      <div className="max-w-7xl mx-auto px-6 sm:px-12 space-y-12">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <Badge variant="gold" icon={<SparklesIcon size={12} />}>@THECANDLELAB ON INSTAGRAM</Badge>
          <h2 className="text-3xl sm:text-5xl font-serif font-bold text-[#2A1E17]">
            Share Your Sanctuary Moment
          </h2>
          <p className="text-sm text-[#69574A]">
            Tag <span className="font-bold text-[#2A1E17]">#TheCandleLab</span> on Instagram for a chance to be featured in our monthly gallery.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {instaPosts.map((post) => (
            <div
              key={post.id}
              className="relative h-64 bg-[#2A1E17] rounded-md overflow-hidden group cursor-pointer border border-[#E5D9C5]"
            >
              <div className="w-full h-full flex items-center justify-center text-5xl group-hover:scale-110 transition-transform duration-500">
                📸 🕯️
              </div>
              <div className="absolute inset-0 bg-[#1C130E]/70 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-between p-4 text-[#FAF6F0]">
                <div className="text-[10px] font-bold text-[#D4AF37] uppercase">{post.tag}</div>
                <div>
                  <h4 className="text-sm font-serif font-bold">{post.title}</h4>
                  <div className="flex items-center gap-1 text-xs text-[#E5D9C5] mt-1">
                    <HeartIcon size={12} className="text-[#B33A3A]" />
                    <span>{post.likes}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
