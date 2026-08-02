import React, { useState } from 'react';
import { Card, Button, Badge, HeartIcon, StarIcon, SparklesIcon, useToast } from '../../design-system';
import { useCMS } from '../../context/CMSContext';

export const FeaturedCollection: React.FC = () => {
  const { toast } = useToast();
  const { products, settings } = useCMS();
  const [wishlist, setWishlist] = useState<string[]>([]);

  const toggleWishlist = (id: string, name: string) => {
    if (wishlist.includes(id)) {
      setWishlist(wishlist.filter((w) => w !== id));
      toast({ type: 'info', title: 'Removed from Wishlist' });
    } else {
      setWishlist([...wishlist, id]);
      toast({ type: 'luxury', title: 'Saved to Wishlist', description: name });
    }
  };

  // Get products marked as featured or top rated
  const featuredList = (products.filter((p) => p.isFeatured).length > 0
    ? products.filter((p) => p.isFeatured)
    : products
  ).slice(0, 4);

  return (
    <section className="py-16 sm:py-24 bg-[#F4EFE6] border-b border-[#E5D9C5] font-sans">
      <div className="max-w-7xl mx-auto px-6 sm:px-12 space-y-12">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <Badge variant="gold" icon={<SparklesIcon size={12} />}>2026 ROYAL RESERVE</Badge>
          <h2 className="text-3xl sm:text-5xl font-serif font-bold text-[#2A1E17]">
            Featured Royal Collection
          </h2>
          <p className="text-sm text-[#69574A] leading-relaxed">
            Hand-poured in numbered small batches with custom-blended essential oils and 24K gold foil labeling.
          </p>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredList.map((prod) => {
            const isWishlisted = wishlist.includes(prod.id);
            const formattedPrice = `${settings.currencySymbol}${prod.price}`;
            const origPrice = prod.originalPrice ? `${settings.currencySymbol}${prod.originalPrice}` : null;

            return (
              <Card
                key={prod.id}
                variant="bordered"
                padding="none"
                className="bg-[#FAF6F0] group flex flex-col justify-between overflow-hidden hover:shadow-hover transition-all duration-300 relative"
              >
                {/* Product Image Container */}
                <div className="relative h-64 bg-[#FAF6F0] flex items-center justify-center overflow-hidden">
                  <img
                    src={prod.image || prod.imageUrl || [
                      'https://images.unsplash.com/photo-1603006905003-be475563bc59?auto=format&fit=crop&w=800&q=80',
                      'https://images.unsplash.com/photo-1547887537-6158d64c35b3?auto=format&fit=crop&w=800&q=80',
                      'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&w=800&q=80',
                      'https://images.unsplash.com/photo-1572635196237-14b3f281503f?auto=format&fit=crop&w=800&q=80'
                    ][products.indexOf(prod) % 4]}
                    alt={prod.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#1C130E]/60 via-transparent to-transparent opacity-40 group-hover:opacity-20 transition-opacity" />

                  {/* Tag Badge */}
                  <div className="absolute top-3 left-3">
                    <Badge variant="gold" size="sm">{prod.collection || 'Flagship'}</Badge>
                  </div>

                  {/* Wishlist Heart */}
                  <button
                    onClick={() => toggleWishlist(prod.id, prod.name)}
                    className={`absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center transition-colors ${isWishlisted ? 'bg-[#B33A3A] text-white' : 'bg-[#1C130E]/50 text-white hover:bg-[#D4AF37] hover:text-[#1C130E]'}`}
                    aria-label="Wishlist"
                  >
                    <HeartIcon size={16} />
                  </button>

                  {/* Scent Pyramid Pill Hover overlay */}
                  <div className="absolute bottom-3 left-3 right-3 bg-[#1C130E]/90 text-[#FAF6F0] p-2.5 rounded-xs text-[10px] space-y-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300 backdrop-blur-xs">
                    <div className="font-semibold text-[#D4AF37] uppercase tracking-wider">Fragrance Notes:</div>
                    <div className="truncate text-[#E5D9C5]">Top: {prod.topNotes || 'Bergamot'} • Heart: {prod.heartNotes || 'Rose'} • Base: {prod.baseNotes || 'Amber'}</div>
                  </div>
                </div>

                {/* Product Details Content */}
                <div className="p-5 space-y-3 flex-1 flex flex-col justify-between">
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-[#8C7A6B] font-medium">{prod.scentProfile || prod.category}</span>
                      <div className="flex items-center gap-1 text-[#D4AF37] font-bold">
                        <StarIcon size={14} className="fill-current text-[#D4AF37]" />
                        <span>{prod.rating || 4.9}</span>
                        <span className="text-[#8C7A6B] font-normal">({prod.reviewsCount || 88})</span>
                      </div>
                    </div>

                    <h3 className="text-base font-serif font-bold text-[#2A1E17] group-hover:text-[#D4AF37] transition-colors leading-snug">
                      {prod.name}
                    </h3>
                  </div>

                  <div className="pt-3 border-t border-[#E5D9C5] flex items-center justify-between">
                    <div className="flex items-baseline gap-2">
                      <span className="text-base font-bold text-[#2A1E17]">{formattedPrice}</span>
                      {origPrice && <span className="text-xs text-[#8C7A6B] line-through">{origPrice}</span>}
                    </div>

                    <Button
                      variant="gold"
                      size="sm"
                      onClick={() => toast({ type: 'luxury', title: 'Added to Cart', description: prod.name })}
                    >
                      Add to Cart
                    </Button>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
};
