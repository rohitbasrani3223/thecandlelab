import React from 'react';
import { Badge, SparklesIcon, HeartIcon } from '../../design-system';

const instaPosts = [
  { id: 1, title: 'Evening Sanctuary Vibes', likes: '1.4k', tag: '#thecandlelab', url: 'https://instagram.com/_the_candlelab', image: 'https://images.unsplash.com/photo-1603006905003-be475563bc59?auto=format&fit=crop&w=800&q=80' },
  { id: 2, title: 'Unboxing 24K Gold Series', likes: '2.1k', tag: '#luxurycandles', url: 'https://instagram.com/_the_candlelab', image: 'https://images.unsplash.com/photo-1596435452227-886313d0130f?auto=format&fit=crop&w=800&q=80' },
  { id: 3, title: 'Botanical Oil Infusion', likes: '980', tag: '#soycandles', url: 'https://instagram.com/_the_candlelab', image: 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&w=800&q=80' },
  { id: 4, title: 'Wood Wick Flame Dance', likes: '3.2k', tag: '#candlecare', url: 'https://instagram.com/_the_candlelab', image: 'https://images.unsplash.com/photo-1572726729207-a78d6fea73a7?auto=format&fit=crop&w=800&q=80' },
];

export const InstagramGallery: React.FC = () => {
  return (
    <section className="py-16 sm:py-24 bg-[#FAF7F2] border-b border-[#E5DAC7] font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 space-y-12">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <Badge variant="gold" icon={<SparklesIcon size={12} />}>@THECANDLELAB ON INSTAGRAM</Badge>
          <h2 className="text-3xl sm:text-5xl font-serif font-bold text-[#241812]">
            Share Your Sanctuary Moment
          </h2>
          <p className="text-sm text-[#5E4E42]">
            Tag <span className="font-bold text-[#241812]">#TheCandleLab</span> on Instagram for a chance to be featured in our monthly gallery.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {instaPosts.map((post) => (
            <a
              key={post.id}
              href={post.url}
              target="_blank"
              rel="noreferrer"
              className="relative h-64 sm:h-72 bg-[#241812] rounded-2xl overflow-hidden group cursor-pointer border border-[#E5DAC7] hover:border-[#C5983A] shadow-subtle transition-all"
            >
              <img
                src={post.image}
                alt={post.title}
                className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-[#180F0A]/75 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-between p-4 text-[#FAF7F2]">
                <div className="text-[10px] font-bold text-[#DEB554] uppercase tracking-wider">{post.tag}</div>
                <div>
                  <h4 className="text-sm font-serif font-bold">{post.title}</h4>
                  <div className="flex items-center gap-1 text-xs text-[#E5DAC7] mt-1">
                    <HeartIcon size={12} className="text-[#BA6648]" />
                    <span>{post.likes}</span>
                    <span className="ml-auto text-[10px] text-[#DEB554] font-bold">Open Instagram ↗</span>
                  </div>
                </div>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
};
