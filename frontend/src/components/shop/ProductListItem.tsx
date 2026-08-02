import React from 'react';
import { Button, Badge, StarIcon, HeartIcon, SparklesIcon } from '../../design-system';

export interface ShopProduct {
  id: string;
  name: string;
  category: string;
  collection: string;
  scentProfile: string;
  price: number;
  originalPrice?: number;
  rating: number;
  reviewsCount: number;
  topNotes: string;
  heartNotes: string;
  baseNotes: string;
  burnTime: string;
  inStock: boolean;
  isNew?: boolean;
  isBestSeller?: boolean;
  vesselDescription: string;
  image?: string;
  imageUrl?: string;
}

export interface ProductListItemProps {
  product: ShopProduct;
  onQuickView: (product: ShopProduct) => void;
  onSelectProduct?: (product: ShopProduct) => void;
  isWishlisted: boolean;
  onToggleWishlist: (id: string, name: string) => void;
}

export const ProductListItem: React.FC<ProductListItemProps> = ({
  product,
  onQuickView,
  onSelectProduct,
  isWishlisted,
  onToggleWishlist,
}) => {
  const inrPrice = Math.round(product.price || 0);
  const inrOriginal = product.originalPrice ? Math.round(product.originalPrice) : null;

  const handleProductClick = () => {
    if (onSelectProduct) {
      onSelectProduct(product);
    } else {
      window.location.hash = '#pdp';
    }
  };

  return (
    <div className="bg-[#FAF6F0] border border-[#E5D9C5] rounded-md p-5 shadow-subtle hover:shadow-card hover:border-[#D4AF37] transition-all flex flex-col sm:flex-row items-center gap-6 font-sans group">
      {/* Vessel Image Mock */}
      <div
        onClick={handleProductClick}
        className="w-full sm:w-48 h-48 bg-[#2A1E17] rounded-sm flex items-center justify-center relative overflow-hidden shrink-0 cursor-pointer"
      >
        <img
          src={product.image || product.imageUrl || 'https://images.unsplash.com/photo-1603006905003-be475563bc59?auto=format&fit=crop&w=800&q=80'}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />

        {product.isBestSeller && (
          <div className="absolute top-2 left-2 z-10">
            <Badge variant="gold" size="sm" icon={<SparklesIcon size={10} />}>Best Seller</Badge>
          </div>
        )}

        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleWishlist(product.id, product.name);
          }}
          className={`absolute top-2 right-2 w-8 h-8 rounded-full flex items-center justify-center transition-colors z-20 cursor-pointer ${
            isWishlisted
              ? 'bg-[#B33A3A] text-white'
              : 'bg-[#1C130E]/60 text-white hover:bg-[#D4AF37] hover:text-[#1C130E]'
          }`}
          aria-label="Wishlist"
        >
          <HeartIcon size={16} />
        </button>
      </div>

      {/* Product Details Content */}
      <div className="flex-1 space-y-3 w-full">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Badge variant="espresso" size="sm">{product.scentProfile}</Badge>
            <span className="text-xs text-[#8C7A6B]">• {product.category}</span>
          </div>

          <div className="flex items-center gap-1 text-xs text-[#D4AF37] font-bold">
            <StarIcon size={14} className="fill-current text-[#D4AF37]" />
            <span>{product.rating}</span>
            <span className="text-[#8C7A6B] font-normal">({product.reviewsCount})</span>
          </div>
        </div>

        <div>
          <h3
            onClick={handleProductClick}
            className="text-lg font-serif font-bold text-[#2A1E17] group-hover:text-[#D4AF37] transition-colors cursor-pointer"
          >
            {product.name}
          </h3>
          <p className="text-xs text-[#8C7A6B] mt-0.5">{product.vesselDescription}</p>
        </div>

        {/* Fragrance Notes */}
        <div className="p-2.5 bg-[#F4EFE6] rounded-xs text-xs text-[#69574A] space-y-1">
          <div className="font-semibold text-[#2A1E17] uppercase text-[10px] tracking-wider">Aromatic Notes:</div>
          <div className="truncate">Top: {product.topNotes} | Heart: {product.heartNotes} | Base: {product.baseNotes}</div>
        </div>
      </div>

      {/* Right Column: Price & Actions */}
      <div className="w-full sm:w-48 sm:border-l sm:border-[#E5D9C5] sm:pl-6 space-y-3 flex flex-col justify-between shrink-0 text-left sm:text-right">
        <div>
          <div className="text-xl font-bold text-[#2A1E17]">₹{inrPrice.toLocaleString('en-IN')}.00</div>
          {inrOriginal && (
            <span className="text-xs text-[#8C7A6B] line-through">₹{inrOriginal.toLocaleString('en-IN')}.00</span>
          )}
          <div className="text-[11px] text-[#D4AF37] font-semibold mt-1">Burn Duration: {product.burnTime}</div>
        </div>

        <div className="space-y-2">
          <Button
            variant="gold"
            size="sm"
            fullWidth
            onClick={handleProductClick}
          >
            View Details →
          </Button>
          <Button
            variant="outline"
            size="sm"
            fullWidth
            onClick={(e) => {
              e.stopPropagation();
              onQuickView(product);
            }}
          >
            Quick View
          </Button>
        </div>
      </div>
    </div>
  );
};
