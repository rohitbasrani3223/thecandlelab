import React from 'react';
import { PRODUCT_IMAGE_PLACEHOLDER } from '../../config/placeholders';
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
    <div className="bg-[#FFFFFF] border border-[#EADDCB] rounded-3xl p-5 shadow-subtle hover:shadow-card hover:border-[#EADDCB] transition-all flex flex-col sm:flex-row items-center gap-6 font-sans group">
      {/* Vessel Image Mock */}
      <div
        onClick={handleProductClick}
        className="w-full sm:w-48 h-48 bg-[#FAF7F2] rounded-2xl flex items-center justify-center relative overflow-hidden shrink-0 cursor-pointer"
      >
        <img
          src={product.image || product.imageUrl || PRODUCT_IMAGE_PLACEHOLDER}
          alt={product.name}
          onError={(e) => {
            if (!e.currentTarget.src.includes(PRODUCT_IMAGE_PLACEHOLDER)) {
              e.currentTarget.src = PRODUCT_IMAGE_PLACEHOLDER;
            }
          }}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />

        {product.isBestSeller && (
          <div className="absolute top-3 left-3 z-10">
            <Badge variant="pink" size="sm" icon={<SparklesIcon size={10} />}>Best Seller</Badge>
          </div>
        )}

        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleWishlist(product.id, product.name);
          }}
          className={`absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center transition-colors z-20 cursor-pointer ${
            isWishlisted
              ? 'bg-[#BE123C] text-white'
              : 'bg-white/80 text-[#7D6F63] hover:bg-[#8B6F4E] hover:text-white shadow-xs'
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
            <Badge variant="pink" size="sm">{product.scentProfile}</Badge>
            <span className="text-xs text-[#7D6F63]">• {product.category}</span>
          </div>

          <div className="flex items-center gap-1 text-xs text-[#E8C86D] font-bold">
            <StarIcon size={14} className="fill-current text-[#E8C86D]" />
            <span>{product.rating}</span>
            <span className="text-[#7D6F63] font-normal">({product.reviewsCount})</span>
          </div>
        </div>

        <div>
          <h3
            onClick={handleProductClick}
            className="text-lg font-serif font-bold text-[#232323] group-hover:text-[#8B6F4E] transition-colors cursor-pointer"
          >
            {product.name}
          </h3>
          <p className="text-xs text-[#7D6F63] mt-0.5">{product.vesselDescription}</p>
        </div>

        {/* Fragrance Notes */}
        <div className="p-3 bg-[#FAF7F2] rounded-2xl text-xs text-[#5C5149] space-y-1 border border-[#EADDCB]">
          <div className="font-semibold text-[#232323] uppercase text-[10px] tracking-wider">Aromatic Notes:</div>
          <div className="truncate">Top: {product.topNotes} | Heart: {product.heartNotes} | Base: {product.baseNotes}</div>
        </div>
      </div>

      {/* Right Column: Price & Actions */}
      <div className="w-full sm:w-48 sm:border-l sm:border-[#EADDCB] sm:pl-6 space-y-3 flex flex-col justify-between shrink-0 text-left sm:text-right">
        <div>
          <div className="text-xl font-bold text-[#232323]">₹{inrPrice.toLocaleString('en-IN')}</div>
          {inrOriginal && (
            <span className="text-xs text-[#7D6F63] line-through">₹{inrOriginal.toLocaleString('en-IN')}</span>
          )}
          <div className="text-[11px] text-[#8B6F4E] font-semibold mt-1">Burn Duration: {product.burnTime}</div>
        </div>

        <div className="space-y-2">
          <Button
            variant="pink"
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
