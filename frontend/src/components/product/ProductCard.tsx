import React from 'react';
import { type CMSProduct } from '../../context/CMSContext';
import { useCart } from '../../context/CartContext';
import { PRODUCT_IMAGE_PLACEHOLDER } from '../../config/placeholders';

export interface ProductCardProps {
  product: CMSProduct;
  onProductClick?: (product: CMSProduct) => void;
  onSelectProduct?: (product: CMSProduct) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onProductClick,
  onSelectProduct,
}) => {
  const { addToCart } = useCart();
  const imageSrc = product.image || product.imageUrl || product.images?.[0] || PRODUCT_IMAGE_PLACEHOLDER;

  const handleClick = () => {
    if (onSelectProduct) onSelectProduct(product);
    else if (onProductClick) onProductClick(product);
  };

  // Quick-add uses first variant data if available — no hardcoded fallbacks
  const firstVariant = product.variants?.[0];

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();

    // If no variants configured yet, don't silently add with fake data — open PDP instead
    if (!firstVariant && product.hasFragranceOption) {
      handleClick();
      return;
    }

    addToCart({
      id: product.id,
      name: product.name,
      price: firstVariant?.price ?? product.price,
      originalPrice: firstVariant?.originalPrice ?? product.originalPrice,
      image: firstVariant?.imageUrl || imageSrc,
      fragrance: firstVariant?.fragranceName,
      size: firstVariant?.sizeName,
      color: firstVariant?.colorName,
      wickType: firstVariant?.wickTypeName,
      sku: firstVariant?.sku || product.sku,
      variantId: firstVariant?.id,
      inStock: !firstVariant ? product.inStock : (firstVariant?.stock ?? 0) > 0,
      quantity: 1,
    });
  };

  const hasRating = product.rating && Number(product.rating) > 0;
  const hasDiscount = product.originalPrice && product.originalPrice > product.price;

  return (
    <div
      onClick={handleClick}
      className="group relative bg-[#1C130E] border border-[#2C2018] rounded-2xl overflow-hidden hover:border-amber-500/40 transition-all duration-300 flex flex-col justify-between cursor-pointer shadow-lg hover:shadow-2xl"
    >
      {/* Image Container */}
      <div className="relative aspect-[4/5] overflow-hidden bg-[#140D09]">
        <img
          src={imageSrc}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />

        {/* Badges from live DB flags */}
        <div className="absolute top-3 left-3 flex flex-col gap-1 z-10">
          {product.isBestSeller && (
            <span className="text-[9px] font-mono font-bold uppercase bg-amber-600 text-stone-950 px-2 py-0.5 rounded shadow">
              BESTSELLER
            </span>
          )}
          {product.isNew && (
            <span className="text-[9px] font-mono font-bold uppercase bg-amber-500/20 text-amber-300 border border-amber-500/40 px-2 py-0.5 rounded shadow backdrop-blur-sm">
              NEW
            </span>
          )}
          {product.isLimitedEdition && (
            <span className="text-[9px] font-mono font-bold uppercase bg-purple-900/60 text-purple-200 border border-purple-700/50 px-2 py-0.5 rounded shadow backdrop-blur-sm">
              LIMITED
            </span>
          )}
          {product.isTrending && (
            <span className="text-[9px] font-mono font-bold uppercase bg-rose-900/60 text-rose-200 border border-rose-700/50 px-2 py-0.5 rounded shadow backdrop-blur-sm">
              TRENDING
            </span>
          )}
        </div>

        {/* Quick Add to Bag — only shows when variants exist or no variant selection needed */}
        <button
          type="button"
          onClick={handleAddToCart}
          className="absolute bottom-3 right-3 bg-amber-600 hover:bg-amber-500 text-stone-950 p-2.5 rounded-full shadow-xl opacity-0 group-hover:opacity-100 transition-all duration-200 transform translate-y-2 group-hover:translate-y-0"
          title={product.hasFragranceOption && !firstVariant ? 'Select options' : 'Quick add to bag'}
        >
          <span className="text-sm">
            {product.hasFragranceOption && !firstVariant ? '→' : '🛍️'}
          </span>
        </button>
      </div>

      {/* Product Details */}
      <div className="p-4 space-y-2 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between text-[10px] font-mono text-amber-400 mb-1">
            <span className="truncate">{product.category}</span>
            {hasRating && (
              <span>★ {Number(product.rating).toFixed(1)}</span>
            )}
          </div>

          <h3 className="font-serif text-sm font-medium text-[#FDFBF7] group-hover:text-amber-300 transition-colors line-clamp-1">
            {product.name}
          </h3>

          {/* Only show if field actually has data */}
          {(product.scentProfile || product.tagline) && (
            <p className="text-xs text-stone-400 line-clamp-1 mt-0.5">
              {product.scentProfile || product.tagline}
            </p>
          )}
        </div>

        <div className="flex items-baseline justify-between pt-2 border-t border-[#2C2018]/60">
          <div className="flex items-baseline gap-1.5">
            <span className="text-sm font-serif font-semibold text-[#FDFBF7]">
              ₹{product.price.toLocaleString('en-IN')}
            </span>
            {hasDiscount && (
              <span className="text-[10px] text-stone-500 line-through">
                ₹{product.originalPrice!.toLocaleString('en-IN')}
              </span>
            )}
          </div>

          <span className="text-[10px] font-mono text-amber-500 hover:underline">
            View Details →
          </span>
        </div>
      </div>
    </div>
  );
};
