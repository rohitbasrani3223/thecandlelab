import React, { useState } from 'react';
import { Card, Button, Badge, HeartIcon, StarIcon, SparklesIcon, useToast } from '../../design-system';
import { useCMS } from '../../context/CMSContext';

export interface FeaturedCollectionProps {
  onSelectProduct?: (product: any) => void;
}

export const FeaturedCollection: React.FC<FeaturedCollectionProps> = ({ onSelectProduct }) => {
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

  const handleProductClick = (prod: any) => {
    try {
      localStorage.setItem('tcl_selected_product', JSON.stringify(prod));
    } catch {}
    if (onSelectProduct) {
      onSelectProduct(prod);
    } else {
      window.location.hash = '#pdp';
    }
  };

  const handleAddToCart = (prod: any, e: React.MouseEvent) => {
    e.stopPropagation();
    const inrPrice = Math.round(prod.price || 0);
    const inrOriginal = prod.originalPrice ? Math.round(prod.originalPrice) : Math.round(inrPrice * 1.25);

    const itemToAdd = {
      id: prod.id,
      name: prod.name,
      category: prod.category || 'Glass Jars',
      price: inrPrice,
      originalPrice: inrOriginal,
      image: prod.image || prod.imageUrl || 'https://images.unsplash.com/photo-1603006905003-be475563bc59?auto=format&fit=crop&w=800&q=80',
      quantity: 1,
      size: '12oz',
      wick: 'Organic Wood Wick',
    };

    try {
      const saved = localStorage.getItem('tcl_cart_items');
      const existing = saved ? JSON.parse(saved) : [];
      const index = existing.findIndex((i: any) => i.id === itemToAdd.id);
      if (index > -1) {
        existing[index].quantity += 1;
      } else {
        existing.push(itemToAdd);
      }
      localStorage.setItem('tcl_cart_items', JSON.stringify(existing));
      window.dispatchEvent(new Event('tcl-cart-updated'));
    } catch (err) {
      console.error('Cart add error:', err);
    }

    toast({ type: 'luxury', title: 'Added to Shopping Bag', description: prod.name });
  };

  // Get products marked as featured or top rated
  const featuredList = (products.filter((p) => p.isFeatured).length > 0
    ? products.filter((p) => p.isFeatured)
    : products
  ).slice(0, 4);

  if (featuredList.length === 0) {
    return null;
  }

  return (
    <section className="py-16 sm:py-24 bg-[#F5EEE4] border-b border-[#E5DAC7] font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 space-y-12">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <Badge variant="gold" icon={<SparklesIcon size={12} />}>2026 ROYAL RESERVE</Badge>
          <h2 className="text-3xl sm:text-5xl font-serif font-bold text-[#241812]">
            Featured Royal Collection
          </h2>
          <p className="text-sm text-[#5E4E42] leading-relaxed">
            Hand-poured in numbered small batches with custom-blended essential oils and 24K gold foil labeling.
          </p>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredList.map((prod) => {
            const isWishlisted = wishlist.includes(prod.id);
            const inrPrice = Math.round(prod.price || 0);
            const formattedPrice = `${settings.currencySymbol}${inrPrice}`;
            const origPrice = prod.originalPrice ? `${settings.currencySymbol}${Math.round(prod.originalPrice)}` : null;

            return (
              <Card
                key={prod.id}
                variant="bordered"
                padding="none"
                onClick={() => handleProductClick(prod)}
                className="bg-[#FAF7F2] group flex flex-col justify-between overflow-hidden hover:shadow-[0_16px_36px_rgba(36,24,18,0.11)] border border-[#E5DAC7] hover:border-[#C5983A] transition-all duration-300 relative cursor-pointer rounded-2xl"
              >
                {/* Product Image Container */}
                <div className="relative h-64 bg-[#F5EEE4] flex items-center justify-center overflow-hidden">
                  <img
                    src={prod.image || prod.imageUrl || [
                      'https://images.unsplash.com/photo-1603006905003-be475563bc59?auto=format&fit=crop&w=800&q=80',
                      'https://images.unsplash.com/photo-1572726729207-a78d6fea73a7?auto=format&fit=crop&w=800&q=80',
                      'https://images.unsplash.com/photo-1602874801007-bd458bb1b8b6?auto=format&fit=crop&w=800&q=80',
                      'https://images.unsplash.com/photo-1507652313519-d4e9174996dd?auto=format&fit=crop&w=800&q=80'
                    ][products.indexOf(prod) % 4]}
                    alt={prod.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#180F0A]/60 via-transparent to-transparent opacity-40 group-hover:opacity-20 transition-opacity" />

                  {/* Tag Badge */}
                  <div className="absolute top-3 left-3">
                    <Badge variant="gold" size="sm">{prod.collection || 'Flagship'}</Badge>
                  </div>

                  {/* Wishlist Heart */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleWishlist(prod.id, prod.name);
                    }}
                    className={`absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center transition-colors ${isWishlisted ? 'bg-[#BA6648] text-white' : 'bg-[#180F0A]/50 text-white hover:bg-[#C5983A] hover:text-[#180F0A]'}`}
                    aria-label="Wishlist"
                  >
                    <HeartIcon size={16} />
                  </button>

                  {/* Scent Pyramid Pill Hover overlay */}
                  <div className="absolute bottom-3 left-3 right-3 bg-[#180F0A]/90 text-[#FAF7F2] p-2.5 rounded-md text-[10px] space-y-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300 backdrop-blur-xs">
                    <div className="font-semibold text-[#DEB554] uppercase tracking-wider">Fragrance Notes:</div>
                    <div className="truncate text-[#E5DAC7]">Top: {prod.topNotes || 'Bergamot'} • Heart: {prod.heartNotes || 'Rose'} • Base: {prod.baseNotes || 'Amber'}</div>
                  </div>
                </div>

                {/* Product Details Content */}
                <div className="p-5 space-y-3 flex-1 flex flex-col justify-between">
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-[#847262] font-medium">{prod.scentProfile || prod.category}</span>
                      <div className="flex items-center gap-1 text-[#C5983A] font-bold">
                        <StarIcon size={14} className="fill-current text-[#C5983A]" />
                        <span>{prod.rating || 4.9}</span>
                        <span className="text-[#847262] font-normal">({prod.reviewsCount || 88})</span>
                      </div>
                    </div>

                    <h3 className="text-base font-serif font-bold text-[#241812] group-hover:text-[#C5983A] transition-colors leading-snug">
                      {prod.name}
                    </h3>
                  </div>

                  <div className="pt-3 border-t border-[#E5DAC7] flex items-center justify-between">
                    <div className="flex items-baseline gap-2">
                      <span className="text-base font-bold text-[#241812]">{formattedPrice}</span>
                      {origPrice && <span className="text-xs text-[#847262] line-through">{origPrice}</span>}
                    </div>

                    <Button
                      variant="gold"
                      size="sm"
                      onClick={(e) => handleAddToCart(prod, e)}
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
