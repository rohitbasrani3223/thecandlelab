import React from 'react';
import { Button, Badge, StarIcon, HeartIcon, SparklesIcon } from '../../design-system';
import { PRODUCT_IMAGE_PLACEHOLDER } from '../../config/placeholders';

export interface StorefrontProductCardProps {
  product: {
    id: string;
    name: string;
    category?: string;
    collection?: string;
    scentProfile?: string;
    price: number;
    originalPrice?: number;
    rating?: number;
    reviewsCount?: number;
    burnTime?: string;
    topNotes?: string;
    heartNotes?: string;
    baseNotes?: string;
    image?: string;
    imageUrl?: string;
  };
  currencySymbol?: string;
  badge?: React.ReactNode;
  rankLabel?: string;
  isWishlisted?: boolean;
  onToggleWishlist?: (e: React.MouseEvent) => void;
  onClick?: () => void;
  onAddToCart?: (e: React.MouseEvent) => void;
  showNotesOnHover?: boolean;
  ctaLabel?: string;
}

export const StorefrontProductCard: React.FC<StorefrontProductCardProps> = ({
  product,
  currencySymbol = '₹',
  badge,
  rankLabel,
  isWishlisted,
  onToggleWishlist,
  onClick,
  onAddToCart,
  showNotesOnHover = true,
  ctaLabel = 'View details',
}) => {
  const imageSrc = product.image || product.imageUrl || PRODUCT_IMAGE_PLACEHOLDER;
  const price = `${currencySymbol}${Math.round(product.price || 0)}`;
  const original = product.originalPrice
    ? `${currencySymbol}${Math.round(product.originalPrice)}`
    : null;

  return (
    <article
      onClick={onClick}
      className="group flex flex-col overflow-hidden rounded-2xl border border-[#E5D9C5]/70 bg-white/80 backdrop-blur-sm shadow-sm hover:shadow-xl hover:border-[#B88B38]/40 transition-all duration-300 cursor-pointer"
    >
      <div className="relative aspect-[4/5] overflow-hidden bg-[#F8F3EA]">
        <img
          src={imageSrc}
          alt={product.name}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#1C130E]/50 via-transparent to-transparent opacity-60" />

        <div className="absolute top-3 left-3 flex flex-wrap gap-1.5 z-10">
          {rankLabel && (
            <Badge variant="gold" size="sm" icon={<SparklesIcon size={10} />}>
              {rankLabel}
            </Badge>
          )}
          {badge}
        </div>

        {onToggleWishlist && (
          <button
            type="button"
            onClick={onToggleWishlist}
            className={`absolute top-3 right-3 z-20 flex h-9 w-9 items-center justify-center rounded-full backdrop-blur-md transition-colors cursor-pointer ${
              isWishlisted
                ? 'bg-[#B33A3A] text-white'
                : 'bg-white/80 text-[#2A1E17] hover:bg-[#B88B38] hover:text-white'
            }`}
            aria-label="Toggle wishlist"
          >
            <HeartIcon size={16} />
          </button>
        )}

        {showNotesOnHover && (
          <div className="absolute bottom-3 left-3 right-3 rounded-xl bg-[#1C130E]/85 px-3 py-2 text-[10px] text-[#FAF6F0] opacity-0 backdrop-blur-md transition-opacity duration-300 group-hover:opacity-100">
            <span className="font-semibold text-[#D4AF37]">Notes · </span>
            {product.topNotes || 'Bergamot'} · {product.heartNotes || 'Rose'} · {product.baseNotes || 'Amber'}
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-3 p-4 sm:p-5">
        <div className="space-y-1">
          <div className="flex items-center justify-between gap-2 text-xs">
            <span className="font-medium text-[#8C7A6B] truncate">
              {product.scentProfile || product.category}
            </span>
            <div className="flex shrink-0 items-center gap-1 font-semibold text-[#B88B38]">
              <StarIcon size={13} className="fill-current" />
              <span>{product.rating ?? 4.9}</span>
              <span className="font-normal text-[#8C7A6B]">({product.reviewsCount ?? 0})</span>
            </div>
          </div>
          <h3 className="font-serif text-base sm:text-lg font-bold text-[#2A1E17] leading-snug group-hover:text-[#B88B38] transition-colors line-clamp-2">
            {product.name}
          </h3>
        </div>

        <div className="mt-auto flex items-end justify-between gap-3 border-t border-[#EFE8DB] pt-3">
          <div>
            <p className="font-serif text-lg font-bold text-[#2A1E17]">{price}</p>
            {original && (
              <p className="text-[11px] text-[#8C7A6B] line-through">{original}</p>
            )}
            {product.burnTime && (
              <p className="text-[10px] text-[#8C7A6B] mt-0.5">{product.burnTime}</p>
            )}
          </div>
          {onAddToCart ? (
            <Button
              variant="gold"
              size="sm"
              onClick={onAddToCart}
              className="shrink-0 rounded-full px-4"
            >
              Add
            </Button>
          ) : (
            <span className="text-xs font-semibold text-[#B88B38] group-hover:translate-x-0.5 transition-transform">
              {ctaLabel} →
            </span>
          )}
        </div>
      </div>
    </article>
  );
};

export const SectionHeader: React.FC<{
  eyebrow?: string;
  title: string;
  description?: string;
  align?: 'left' | 'center';
  action?: React.ReactNode;
}> = ({ eyebrow, title, description, align = 'left', action }) => (
  <div
    className={`flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between ${
      align === 'center' ? 'text-center sm:text-center sm:justify-center' : ''
    }`}
  >
    <div className={`space-y-2 max-w-2xl ${align === 'center' ? 'mx-auto' : ''}`}>
      {eyebrow && (
        <p className="text-sm font-medium text-[#B88B38]">{eyebrow}</p>
      )}
      <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#2A1E17] tracking-tight">
        {title}
      </h2>
      {description && (
        <p className="text-sm text-[#69574A] leading-relaxed">{description}</p>
      )}
    </div>
    {action}
  </div>
);
