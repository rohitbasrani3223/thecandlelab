import React, { useState, useMemo, useEffect } from 'react';
import { useCart } from '../../context/CartContext';
import { useCMS, type CMSProduct, type CMSProductVariant } from '../../context/CMSContext';

interface ProductSummaryProps {
  product: CMSProduct;
  onVariantChange?: (variant: CMSProductVariant | null, variantImage?: string) => void;
  onBuyNow?: () => void;
}

export const ProductSummary: React.FC<ProductSummaryProps> = ({
  product,
  onVariantChange,
  onBuyNow,
}) => {
  const { addToCart } = useCart();
  const { fragrances, sizes, colors, wickTypes } = useCMS();

  // Filter available options for this product
  // Priority: explicit IDs from DB > derive from variants > all active global options
  const availableFragrances = useMemo(() => {
    if (!product.hasFragranceOption) return [];

    // If product has explicit fragrance ID list, use it
    if (product.availableFragranceIds && product.availableFragranceIds.length > 0) {
      return fragrances.filter((f) => product.availableFragranceIds!.includes(f.id));
    }

    // Derive unique fragrances from variants (when admin saved variants directly with fragrance names)
    if (product.variants && product.variants.length > 0) {
      const seen = new Set<string>();
      const derived: typeof fragrances = [];
      product.variants.forEach((v) => {
        if (v.fragranceId && !seen.has(v.fragranceId)) {
          seen.add(v.fragranceId);
          const existing = fragrances.find((f) => f.id === v.fragranceId);
          if (existing) {
            derived.push(existing);
          } else if (v.fragranceName) {
            // Variant has a fragrance name but no matching fragrance record yet — show as inline option
            derived.push({ id: v.fragranceId, name: v.fragranceName, isActive: true } as any);
          }
        } else if (!v.fragranceId && v.fragranceName && !seen.has(v.fragranceName)) {
          seen.add(v.fragranceName);
          derived.push({ id: `inline-${v.fragranceName}`, name: v.fragranceName, isActive: true } as any);
        }
      });
      if (derived.length > 0) return derived;
    }

    // Fallback: show all active fragrances from DB
    return fragrances.filter((f) => f.isActive);
  }, [fragrances, product]);

  const availableSizes = useMemo(() => {
    if (!product.hasSizeOption) return [];

    if (product.availableSizeIds && product.availableSizeIds.length > 0) {
      return sizes.filter((s) => product.availableSizeIds!.includes(s.id));
    }

    // Derive from variants
    if (product.variants && product.variants.length > 0) {
      const seen = new Set<string>();
      const derived: typeof sizes = [];
      product.variants.forEach((v) => {
        if (v.sizeId && !seen.has(v.sizeId)) {
          seen.add(v.sizeId);
          const existing = sizes.find((s) => s.id === v.sizeId);
          if (existing) derived.push(existing);
          else if (v.sizeName) derived.push({ id: v.sizeId, name: v.sizeName, isActive: true } as any);
        } else if (!v.sizeId && v.sizeName && !seen.has(v.sizeName)) {
          seen.add(v.sizeName);
          derived.push({ id: `inline-${v.sizeName}`, name: v.sizeName, isActive: true } as any);
        }
      });
      if (derived.length > 0) return derived;
    }

    return sizes.filter((s) => s.isActive);
  }, [sizes, product]);

  const availableColors = useMemo(() => {
    if (!product.hasColorOption) return [];
    if (product.availableColorIds && product.availableColorIds.length > 0) {
      return colors.filter((c) => product.availableColorIds!.includes(c.id));
    }
    return colors.filter((c) => c.isActive);
  }, [colors, product]);

  const availableWickTypes = useMemo(() => {
    if (!product.hasWickOption) return [];
    if (product.availableWickTypeIds && product.availableWickTypeIds.length > 0) {
      return wickTypes.filter((w) => product.availableWickTypeIds!.includes(w.id));
    }

    // Derive from variants
    if (product.variants && product.variants.length > 0) {
      const seen = new Set<string>();
      const derived: typeof wickTypes = [];
      product.variants.forEach((v) => {
        if (v.wickTypeId && !seen.has(v.wickTypeId)) {
          seen.add(v.wickTypeId);
          const existing = wickTypes.find((w) => w.id === v.wickTypeId);
          if (existing) derived.push(existing);
          else if (v.wickTypeName) derived.push({ id: v.wickTypeId, name: v.wickTypeName, isActive: true } as any);
        }
      });
      if (derived.length > 0) return derived;
    }

    return wickTypes.filter((w) => w.isActive);
  }, [wickTypes, product]);

  // Selected Option States
  const [selectedFragranceId, setSelectedFragranceId] = useState<string>(
    availableFragrances[0]?.id || ''
  );
  const [selectedSizeId, setSelectedSizeId] = useState<string>(
    availableSizes[0]?.id || ''
  );
  const [selectedColorId, setSelectedColorId] = useState<string>(
    availableColors[0]?.id || ''
  );
  const [selectedWickTypeId, setSelectedWickTypeId] = useState<string>(
    availableWickTypes[0]?.id || ''
  );
  const [quantity, setQuantity] = useState<number>(1);
  const [giftPackaging, setGiftPackaging] = useState<boolean>(false);
  const [customMessage, setCustomMessage] = useState<string>('');
  const [showGiftMessageInput, setShowGiftMessageInput] = useState<boolean>(false);

  // Sync default selection if options change
  useEffect(() => {
    if (availableFragrances.length > 0 && !selectedFragranceId) {
      setSelectedFragranceId(availableFragrances[0].id);
    }
  }, [availableFragrances, selectedFragranceId]);

  useEffect(() => {
    if (availableSizes.length > 0 && !selectedSizeId) {
      setSelectedSizeId(availableSizes[0].id);
    }
  }, [availableSizes, selectedSizeId]);

  useEffect(() => {
    if (availableColors.length > 0 && !selectedColorId) {
      setSelectedColorId(availableColors[0].id);
    }
  }, [availableColors, selectedColorId]);

  useEffect(() => {
    if (availableWickTypes.length > 0 && !selectedWickTypeId) {
      setSelectedWickTypeId(availableWickTypes[0].id);
    }
  }, [availableWickTypes, selectedWickTypeId]);

  // Find Best Matching Variant
  const currentVariant = useMemo<CMSProductVariant | null>(() => {
    if (!product.variants || product.variants.length === 0) return null;

    // Try exact match
    const exact = product.variants.find((v) => {
      const matchFrag = !product.hasFragranceOption || v.fragranceId === selectedFragranceId || !v.fragranceId;
      const matchSize = !product.hasSizeOption || v.sizeId === selectedSizeId || !v.sizeId;
      const matchColor = !product.hasColorOption || v.colorId === selectedColorId || !v.colorId;
      const matchWick = !product.hasWickOption || v.wickTypeId === selectedWickTypeId || !v.wickTypeId;
      return matchFrag && matchSize && matchColor && matchWick;
    });

    if (exact) return exact;

    // Fallback match by size or fragrance
    const sizeMatch = product.variants.find((v) => v.sizeId === selectedSizeId);
    if (sizeMatch) return sizeMatch;

    const fragMatch = product.variants.find((v) => v.fragranceId === selectedFragranceId);
    if (fragMatch) return fragMatch;

    return product.variants[0] || null;
  }, [
    product,
    selectedFragranceId,
    selectedSizeId,
    selectedColorId,
    selectedWickTypeId,
  ]);

  // Selected Option Objects
  const selectedFragrance = useMemo(
    () => fragrances.find((f) => f.id === selectedFragranceId),
    [fragrances, selectedFragranceId]
  );
  const selectedSize = useMemo(
    () => sizes.find((s) => s.id === selectedSizeId),
    [sizes, selectedSizeId]
  );
  const selectedColor = useMemo(
    () => colors.find((c) => c.id === selectedColorId),
    [colors, selectedColorId]
  );
  const selectedWickType = useMemo(
    () => wickTypes.find((w) => w.id === selectedWickTypeId),
    [wickTypes, selectedWickTypeId]
  );

  // Notify parent of variant or image update
  useEffect(() => {
    if (onVariantChange) {
      onVariantChange(currentVariant, currentVariant?.imageUrl);
    }
  }, [currentVariant, onVariantChange]);

  // Calculated Pricing & Stock
  const currentPrice = currentVariant ? currentVariant.price : product.price;
  const currentOriginalPrice = currentVariant?.originalPrice || product.originalPrice || currentPrice;
  const discountPercent =
    currentOriginalPrice > currentPrice
      ? Math.round(((currentOriginalPrice - currentPrice) / currentOriginalPrice) * 100)
      : 0;

  const currentSku = currentVariant?.sku || product.sku || 'TCL-001';
  const currentStock = currentVariant?.stock ?? 50;
  const isOutOfStock = !product.inStock || currentStock <= 0;

  // Handle Add to Cart
  const handleAddToCart = () => {
    if (isOutOfStock) return;

    addToCart({
      id: product.id,
      name: product.name,
      price: currentPrice,
      originalPrice: currentOriginalPrice,
      image: currentVariant?.imageUrl || product.image || product.imageUrl,
      fragrance: selectedFragrance?.name || product.scentProfile || 'Signature',
      size: selectedSize?.name || 'Standard',
      color: selectedColor?.name,
      wickType: selectedWickType?.name,
      sku: currentSku,
      variantId: currentVariant?.id,
      giftPackaging,
      customMessage: showGiftMessageInput ? customMessage : undefined,
      quantity,
    } as any);
  };

  const handleTriggerBuyNow = () => {
    handleAddToCart();
    if (onBuyNow) {
      onBuyNow();
    }
  };

  return (
    <div className="space-y-6">
      {/* Category, SKU & Title */}
      <div>
        <div className="flex items-center justify-between gap-2 flex-wrap mb-2">
          <span className="text-[11px] font-mono uppercase tracking-widest text-amber-500">
            {product.category}
          </span>
          <span className="text-[11px] font-mono text-stone-500">
            SKU: <span className="text-stone-400 font-semibold">{currentSku}</span>
          </span>
        </div>

        <h1 className="font-serif text-2xl sm:text-3xl lg:text-4xl text-[#FDFBF7] font-medium leading-tight">
          {product.name}
        </h1>

        {product.tagline && (
          <p className="text-sm text-stone-400 mt-2 font-light leading-relaxed">
            {product.tagline}
          </p>
        )}
      </div>

      {/* Rating & Review Summary */}
      <div className="flex items-center gap-3 py-2 border-y border-[#2C2018]">
        <div className="flex items-center text-amber-400 text-sm tracking-tighter">
          {'★'.repeat(5)}
        </div>
        <span className="text-xs font-mono text-stone-300">
          {product.rating ? Number(product.rating).toFixed(1) : '4.9'}
        </span>
        <span className="text-xs text-stone-500">
          ({product.reviewsCount || 18} Verified Connoisseurs)
        </span>
        <span className="text-xs text-stone-600">•</span>
        <span className="text-xs text-emerald-400 font-medium">
          {isOutOfStock ? 'Currently Sold Out' : 'In Stock & Ready to Ship'}
        </span>
      </div>

      {/* Price & Savings Display */}
      <div className="flex items-baseline gap-3">
        <span className="text-3xl font-serif text-[#FDFBF7] font-medium">
          ₹{currentPrice.toLocaleString('en-IN')}
        </span>
        {currentOriginalPrice > currentPrice && (
          <>
            <span className="text-base text-stone-500 line-through">
              ₹{currentOriginalPrice.toLocaleString('en-IN')}
            </span>
            <span className="text-xs font-mono px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20">
              SAVE {discountPercent}%
            </span>
          </>
        )}
      </div>

      {/* 1. DYNAMIC FRAGRANCE SELECTOR (Replacing Vessel Size) */}
      {product.hasFragranceOption && availableFragrances.length > 0 && (
        <div className="space-y-2.5 pt-2">
          <div className="flex items-center justify-between">
            <label className="text-xs font-mono uppercase tracking-wider text-stone-300">
              Select Fragrance:{' '}
              <span className="text-amber-400 font-semibold font-sans">
                {selectedFragrance?.name || 'Choose fragrance'}
              </span>
            </label>
            {selectedFragrance?.scentFamily && (
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#1C130E] border border-[#2C2018] text-stone-400">
                {selectedFragrance.scentFamily} • {selectedFragrance.intensity}
              </span>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {availableFragrances.map((frag) => {
              const isSelected = frag.id === selectedFragranceId;
              return (
                <button
                  key={frag.id}
                  type="button"
                  onClick={() => setSelectedFragranceId(frag.id)}
                  className={`flex items-start gap-2.5 p-2.5 rounded-lg border text-left transition-all ${
                    isSelected
                      ? 'bg-amber-500/15 border-amber-500/50 shadow-sm'
                      : 'bg-[#1C130E] border-[#2C2018] hover:border-stone-600'
                  }`}
                >
                  <div className="w-8 h-8 rounded bg-[#140D09] border border-[#2C2018] flex items-center justify-center text-sm shrink-0 mt-0.5">
                    {frag.imageUrl ? (
                      <img src={frag.imageUrl} alt={frag.name} className="w-full h-full object-cover rounded" />
                    ) : (
                      '🌸'
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className={`text-xs font-medium leading-tight truncate ${isSelected ? 'text-amber-300' : 'text-[#FDFBF7]'}`}>
                      {frag.name}
                    </p>
                    <p className="text-[10px] text-stone-400 truncate mt-0.5">
                      {frag.scentProfile || frag.shortDescription || 'Signature blend'}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>

          {selectedFragrance?.topNotes && (
            <div className="p-2.5 rounded-lg bg-[#140D09] border border-[#2C2018] text-[11px] text-stone-400 space-y-1">
              <p><span className="text-stone-300 font-medium">Notes:</span> {selectedFragrance.topNotes} • {selectedFragrance.heartNotes} • {selectedFragrance.baseNotes}</p>
            </div>
          )}
        </div>
      )}

      {/* 2. GENERIC SIZE SELECTOR (Grams / ML) */}
      {product.hasSizeOption && availableSizes.length > 0 && (
        <div className="space-y-2 pt-2">
          <label className="block text-xs font-mono uppercase tracking-wider text-stone-300">
            Select Size:{' '}
            <span className="text-amber-400 font-semibold font-sans">
              {selectedSize?.name || 'Select Size'}
            </span>
          </label>
          <div className="flex flex-wrap gap-2">
            {availableSizes.map((sz) => {
              const isSelected = sz.id === selectedSizeId;
              return (
                <button
                  key={sz.id}
                  type="button"
                  onClick={() => setSelectedSizeId(sz.id)}
                  className={`px-3 py-2 rounded-lg border text-xs font-medium transition-all ${
                    isSelected
                      ? 'bg-amber-500/15 border-amber-500 text-amber-300 font-semibold'
                      : 'bg-[#1C130E] border-[#2C2018] text-stone-300 hover:border-stone-600'
                  }`}
                >
                  {sz.name}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* 3. COLOR SELECTOR */}
      {product.hasColorOption && availableColors.length > 0 && (
        <div className="space-y-2 pt-2">
          <label className="block text-xs font-mono uppercase tracking-wider text-stone-300">
            Vessel Finish:{' '}
            <span className="text-amber-400 font-semibold font-sans">
              {selectedColor?.name || 'Select Finish'}
            </span>
          </label>
          <div className="flex items-center gap-2.5">
            {availableColors.map((col) => {
              const isSelected = col.id === selectedColorId;
              return (
                <button
                  key={col.id}
                  type="button"
                  title={col.name}
                  onClick={() => setSelectedColorId(col.id)}
                  className={`w-8 h-8 rounded-full border-2 transition-all p-0.5 flex items-center justify-center ${
                    isSelected ? 'border-amber-400 scale-110' : 'border-transparent hover:scale-105'
                  }`}
                >
                  <span
                    className="w-full h-full rounded-full border border-stone-700 shadow-inner"
                    style={{ backgroundColor: col.hexCode }}
                  />
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* 4. WICK TYPE SELECTOR (Candles Only) */}
      {product.hasWickOption && availableWickTypes.length > 0 && (
        <div className="space-y-2 pt-2">
          <label className="block text-xs font-mono uppercase tracking-wider text-stone-300">
            Wick Formulation:{' '}
            <span className="text-amber-400 font-semibold font-sans">
              {selectedWickType?.name || 'Standard'}
            </span>
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {availableWickTypes.map((wk) => {
              const isSelected = wk.id === selectedWickTypeId;
              return (
                <button
                  key={wk.id}
                  type="button"
                  onClick={() => setSelectedWickTypeId(wk.id)}
                  className={`p-2.5 rounded-lg border text-left transition-all ${
                    isSelected
                      ? 'bg-amber-500/15 border-amber-500/50 text-amber-300'
                      : 'bg-[#1C130E] border-[#2C2018] text-stone-300 hover:border-stone-600'
                  }`}
                >
                  <p className="text-xs font-medium">{wk.name}</p>
                  {wk.description && (
                    <p className="text-[10px] text-stone-400 mt-0.5 line-clamp-1">{wk.description}</p>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* 5. GIFT PACKAGING & CUSTOM MESSAGE */}
      {(product.hasGiftPackaging || product.hasCustomMessage) && (
        <div className="p-3.5 rounded-xl bg-[#140D09] border border-[#2C2018] space-y-3">
          {product.hasGiftPackaging && (
            <label className="flex items-center justify-between cursor-pointer">
              <div className="flex items-center gap-2.5">
                <span className="text-base">🎁</span>
                <div>
                  <p className="text-xs font-medium text-[#FDFBF7]">Luxury Gold-Embossed Gift Box</p>
                  <p className="text-[10px] text-stone-400">Includes satin ribbon and custom wax seal stamp</p>
                </div>
              </div>
              <input
                type="checkbox"
                checked={giftPackaging}
                onChange={(e) => setGiftPackaging(e.target.checked)}
                className="rounded bg-[#1C130E] border-[#2C2018] text-amber-500 focus:ring-0 w-4 h-4"
              />
            </label>
          )}

          {product.hasCustomMessage && (
            <div>
              {!showGiftMessageInput ? (
                <button
                  type="button"
                  onClick={() => setShowGiftMessageInput(true)}
                  className="text-xs text-amber-400 hover:text-amber-300 flex items-center gap-1.5"
                >
                  <span>✍️</span>
                  <span>+ Add Complimentary Handwritten Note Card</span>
                </button>
              ) : (
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="text-[11px] font-mono text-stone-400">Recipient Message:</label>
                    <button
                      type="button"
                      onClick={() => setShowGiftMessageInput(false)}
                      className="text-[10px] text-stone-500 hover:text-stone-300"
                    >
                      Remove
                    </button>
                  </div>
                  <textarea
                    rows={2}
                    maxLength={150}
                    placeholder="Wishing you warmth and peaceful evenings..."
                    value={customMessage}
                    onChange={(e) => setCustomMessage(e.target.value)}
                    className="w-full bg-[#1C130E] border border-[#2C2018] rounded-lg p-2 text-xs text-[#FDFBF7] focus:border-amber-500 focus:outline-none"
                  />
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Quantity & CTA Buttons */}
      <div className="space-y-3 pt-2">
        <div className="flex items-center gap-3">
          {/* Quantity Selector */}
          <div className="flex items-center border border-[#2C2018] bg-[#1C130E] rounded-lg h-11 px-2">
            <button
              type="button"
              disabled={quantity <= 1 || isOutOfStock}
              onClick={() => setQuantity((q) => Math.max(1, q - 1))}
              className="w-8 h-full flex items-center justify-center text-stone-400 hover:text-[#FDFBF7] disabled:opacity-30"
            >
              −
            </button>
            <span className="w-10 text-center font-mono text-xs font-semibold text-[#FDFBF7]">
              {quantity}
            </span>
            <button
              type="button"
              disabled={quantity >= currentStock || isOutOfStock}
              onClick={() => setQuantity((q) => q + 1)}
              className="w-8 h-full flex items-center justify-center text-stone-400 hover:text-[#FDFBF7] disabled:opacity-30"
            >
              +
            </button>
          </div>

          {/* Add to Cart Button */}
          <button
            type="button"
            disabled={isOutOfStock}
            onClick={handleAddToCart}
            className="flex-1 h-11 bg-amber-600 hover:bg-amber-500 disabled:bg-stone-800 disabled:text-stone-600 text-stone-950 font-semibold text-xs rounded-lg transition-colors shadow-lg flex items-center justify-center gap-2"
          >
            <span>🛍️</span>
            <span>{isOutOfStock ? 'Out of Stock' : `Add to Bag • ₹${(currentPrice * quantity).toLocaleString('en-IN')}`}</span>
          </button>
        </div>

        {/* Buy Now Button */}
        <button
          type="button"
          disabled={isOutOfStock}
          onClick={handleTriggerBuyNow}
          className="w-full h-11 bg-[#251A13] hover:bg-[#2C2018] border border-amber-500/30 hover:border-amber-500/60 disabled:opacity-40 text-amber-300 font-medium text-xs rounded-lg transition-colors flex items-center justify-center gap-2"
        >
          <span>⚡</span>
          <span>Instant Checkout (Buy Now)</span>
        </button>
      </div>

      {/* Assurances Banner */}
      <div className="grid grid-cols-3 gap-2 pt-4 border-t border-[#2C2018] text-center">
        <div className="p-2 rounded bg-[#140D09] border border-[#2C2018]/50">
          <p className="text-base mb-1">🌿</p>
          <p className="text-[10px] font-medium text-stone-300">100% Pure Soy</p>
          <p className="text-[9px] text-stone-500">Zero Paraffin / Toxins</p>
        </div>
        <div className="p-2 rounded bg-[#140D09] border border-[#2C2018]/50">
          <p className="text-base mb-1">🚚</p>
          <p className="text-[10px] font-medium text-stone-300">Express Delivery</p>
          <p className="text-[9px] text-stone-500">Pan-India Dispatch</p>
        </div>
        <div className="p-2 rounded bg-[#140D09] border border-[#2C2018]/50">
          <p className="text-base mb-1">✨</p>
          <p className="text-[10px] font-medium text-stone-300">30-Day Guarantee</p>
          <p className="text-[9px] text-stone-500">Hassle-Free Exchange</p>
        </div>
      </div>
    </div>
  );
};
