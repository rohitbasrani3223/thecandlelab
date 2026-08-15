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
    try {
      localStorage.setItem('tcl_selected_product', JSON.stringify(product));
    } catch {}
    if (onSelectProduct) onSelectProduct(product);
    else if (onProductClick) onProductClick(product);
  };

  const firstVariant = product.variants?.[0];

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();

    addToCart({
      id: product.id,
      name: product.name,
      price: firstVariant?.price ?? product.price,
      originalPrice: firstVariant?.originalPrice ?? product.originalPrice,
      image: firstVariant?.imageUrl || imageSrc,
      fragrance: firstVariant?.fragranceName || product.scentProfile || 'Signature Blend',
      size: firstVariant?.sizeName || (product.weightGrams ? `${product.weightGrams}g` : '250g'),
      color: firstVariant?.colorName,
      wickType: firstVariant?.wickTypeName || 'Organic Wood Wick',
      sku: firstVariant?.sku || product.sku,
      variantId: firstVariant?.id,
      inStock: !firstVariant ? product.inStock : (firstVariant?.stock ?? 0) > 0,
      quantity: 1,
    });
  };

  const hasRating = product.rating && Number(product.rating) > 0;
  const hasDiscount = product.originalPrice && product.originalPrice > product.price;

  // Extract primary fragrance & specs
  const fragranceLabel = product.scentProfile || product.topNotes || product.tagline;
  const sizeLabel = product.weightGrams ? `${product.weightGrams}g` : product.burnTime ? product.burnTime : null;

  return (
    <div
      onClick={handleClick}
      className="group relative bg-[#1C130E] border border-[#2C2018] rounded-2xl overflow-hidden hover:border-[#DEB554]/50 transition-all duration-300 flex flex-col justify-between cursor-pointer shadow-lg hover:shadow-[0_16px_36px_rgba(0,0,0,0.4)] font-sans hover:-translate-y-1"
    >
      {/* Image Container */}
      <div className="relative aspect-[4/5] overflow-hidden bg-[#140D09]">
        <img
          src={imageSrc}
          alt={product.name}
          loading="lazy"
          className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-108 brightness-95 group-hover:brightness-100"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#1C130E] via-transparent to-transparent opacity-60 group-hover:opacity-30 transition-opacity" />

        {/* Badges from live DB flags */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10 pointer-events-none">
          {product.isBestSeller && (
            <span className="text-[9px] font-mono font-bold uppercase bg-[#DEB554] text-[#180F0A] px-2.5 py-0.5 rounded-full shadow font-sans">
              ★ BESTSELLER
            </span>
          )}
          {product.isNew && (
            <span className="text-[9px] font-mono font-bold uppercase bg-[#DEB554]/20 text-[#DEB554] border border-[#DEB554]/40 px-2.5 py-0.5 rounded-full shadow backdrop-blur-sm">
              NEW
            </span>
          )}
          {product.isTrending && (
            <span className="text-[9px] font-mono font-bold uppercase bg-amber-500/20 text-amber-300 border border-amber-500/40 px-2.5 py-0.5 rounded-full shadow backdrop-blur-sm">
              TRENDING
            </span>
          )}
          {product.isLimitedEdition && (
            <span className="text-[9px] font-mono font-bold uppercase bg-purple-900/80 text-purple-200 border border-purple-700/50 px-2.5 py-0.5 rounded-full shadow backdrop-blur-sm">
              LIMITED
            </span>
          )}
        </div>

        {/* Size Badge Top Right */}
        {sizeLabel && (
          <div className="absolute top-3 right-3 z-10 pointer-events-none">
            <span className="text-[9px] font-mono font-semibold bg-[#140D09]/80 backdrop-blur-xs text-[#F5EEE4] border border-white/10 px-2 py-0.5 rounded-full">
              {sizeLabel}
            </span>
          </div>
        )}

        {/* Bottom Scent Notes Overlay Pill */}
        {fragranceLabel && (
          <div className="absolute bottom-3 left-3 right-12 z-10 pointer-events-none">
            <span className="inline-block text-[10px] font-semibold bg-[#140D09]/85 backdrop-blur-md text-[#DEB554] border border-[#DEB554]/30 px-2.5 py-0.5 rounded-full truncate max-w-full">
              🌸 {fragranceLabel}
            </span>
          </div>
        )}

        {/* Quick Add to Bag */}
        <button
          type="button"
          onClick={handleAddToCart}
          className="absolute bottom-2.5 right-2.5 bg-[#DEB554] hover:bg-[#C5983A] text-[#180F0A] p-2.5 rounded-full shadow-xl opacity-0 group-hover:opacity-100 transition-all duration-200 transform translate-y-2 group-hover:translate-y-0 cursor-pointer font-bold"
          title="Quick add to bag"
        >
          <span className="text-xs">🛍️</span>
        </button>
      </div>

      {/* Product Details */}
      <div className="p-4 space-y-2 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between text-[10px] font-mono text-[#DEB554] mb-1">
            <span className="truncate uppercase font-bold tracking-wider">{product.category || 'Soy Candle'}</span>
            {hasRating && (
              <span className="text-stone-300 font-bold">★ {Number(product.rating).toFixed(1)}</span>
            )}
          </div>

          <h3 className="font-serif text-sm sm:text-base font-bold text-[#FDFBF7] group-hover:text-[#DEB554] transition-colors line-clamp-1">
            {product.name}
          </h3>

          {/* Fragrance / Top Notes preview */}
          {product.topNotes && (
            <p className="text-[11px] text-stone-400 line-clamp-1 mt-0.5">
              <span className="text-stone-500 font-medium">Notes:</span> {product.topNotes}
            </p>
          )}
        </div>

        <div className="flex items-baseline justify-between pt-2.5 border-t border-[#2C2018]/80">
          <div className="flex items-baseline gap-1.5">
            <span className="text-base font-serif font-bold text-[#FDFBF7]">
              ₹{Number(product.price).toLocaleString('en-IN')}
            </span>
            {hasDiscount && (
              <span className="text-[11px] text-stone-500 line-through">
                ₹{Number(product.originalPrice!).toLocaleString('en-IN')}
              </span>
            )}
          </div>

          <span className="text-[11px] font-bold text-[#DEB554] group-hover:translate-x-0.5 transition-transform">
            View Details →
          </span>
        </div>
      </div>
    </div>
  );
};
