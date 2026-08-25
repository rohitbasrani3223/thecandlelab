import React, { useState, useMemo, useEffect } from 'react';
import { useCart } from '../../context/CartContext';
import { useCMS, type CMSProduct, type CMSProductVariant } from '../../context/CMSContext';
import { ChevronDownIcon, ShoppingBagIcon, SparklesIcon } from '../../design-system';

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

  // 1. DYNAMIC FRAGRANCE OPTIONS
  const availableFragrances = useMemo(() => {
    if (!product || product.hasFragranceOption === false) return [];

    // A. If admin explicitly selected allowed fragrance IDs for this product
    if (product.availableFragranceIds && product.availableFragranceIds.length > 0) {
      const allowed = fragrances.filter((f) => product.availableFragranceIds!.includes(f.id));
      if (allowed.length > 0) return allowed;
    }

    // B. If variants have specific fragrances
    if (product.variants && product.variants.length > 0) {
      const seen = new Set<string>();
      const derived: typeof fragrances = [];
      product.variants.forEach((v) => {
        if (v.fragranceId && !seen.has(v.fragranceId)) {
          seen.add(v.fragranceId);
          const match = fragrances.find((f) => f.id === v.fragranceId);
          if (match) derived.push(match);
          else if (v.fragranceName) {
            derived.push({
              id: v.fragranceId,
              name: v.fragranceName,
              scentProfile: v.fragranceName,
              isActive: true,
            } as any);
          }
        }
      });
      if (derived.length > 0) return derived;
    }

    // C. All active fragrances from live database library
    if (fragrances.length > 0) {
      return fragrances.filter((f) => f.isActive !== false);
    }

    // D. If product has its own custom scent profile
    if (product.scentProfile || product.topNotes) {
      return [
        {
          id: 'prod-scent',
          name: product.scentProfile || product.topNotes || 'Signature Formulation',
          scentProfile: product.scentProfile,
          topNotes: product.topNotes,
          heartNotes: product.heartNotes,
          baseNotes: product.baseNotes,
          isActive: true,
        } as any,
      ];
    }

    return [];
  }, [fragrances, product]);

  // 2. DYNAMIC SIZE OPTIONS
  const availableSizes = useMemo(() => {
    if (product.hasSizeOption === false) return [];

    if (product.availableSizeIds && product.availableSizeIds.length > 0) {
      const allowed = sizes.filter((s) => product.availableSizeIds!.includes(s.id));
      if (allowed.length > 0) return allowed;
    }

    if (sizes.length > 0) {
      return sizes.filter((s) => s.isActive !== false);
    }

    return [];
  }, [sizes, product]);

  // 3. DYNAMIC COLOR / FINISH OPTIONS
  const availableColors = useMemo(() => {
    if (product.hasColorOption === false) return [];

    if (product.availableColorIds && product.availableColorIds.length > 0) {
      const allowed = colors.filter((c) => product.availableColorIds!.includes(c.id));
      if (allowed.length > 0) return allowed;
    }

    if (colors.length > 0) {
      return colors.filter((c) => c.isActive !== false);
    }

    return [];
  }, [colors, product]);

  // 4. DYNAMIC WICK TYPE OPTIONS
  const availableWickTypes = useMemo(() => {
    if (product.hasWickOption === false) return [];

    if (product.availableWickTypeIds && product.availableWickTypeIds.length > 0) {
      const allowed = wickTypes.filter((w) => product.availableWickTypeIds!.includes(w.id));
      if (allowed.length > 0) return allowed;
    }

    if (wickTypes.length > 0) {
      return wickTypes.filter((w) => w.isActive !== false);
    }

    return [];
  }, [wickTypes, product]);

  // Selection states
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

  // Sync state if options change
  useEffect(() => {
    if (availableFragrances.length > 0 && !availableFragrances.some((f) => f.id === selectedFragranceId)) {
      setSelectedFragranceId(availableFragrances[0].id);
    }
  }, [availableFragrances, selectedFragranceId]);

  useEffect(() => {
    if (availableSizes.length > 0 && !availableSizes.some((s) => s.id === selectedSizeId)) {
      setSelectedSizeId(availableSizes[0].id);
    }
  }, [availableSizes, selectedSizeId]);

  useEffect(() => {
    if (availableColors.length > 0 && !availableColors.some((c) => c.id === selectedColorId)) {
      setSelectedColorId(availableColors[0].id);
    }
  }, [availableColors, selectedColorId]);

  useEffect(() => {
    if (availableWickTypes.length > 0 && !availableWickTypes.some((w) => w.id === selectedWickTypeId)) {
      setSelectedWickTypeId(availableWickTypes[0].id);
    }
  }, [availableWickTypes, selectedWickTypeId]);

  // Find exact matching variant
  const currentVariant = useMemo<CMSProductVariant | null>(() => {
    if (!product.variants || product.variants.length === 0) return null;

    const match = product.variants.find((v) => {
      let isMatch = true;
      if (selectedFragranceId && v.fragranceId && v.fragranceId !== selectedFragranceId) isMatch = false;
      if (selectedSizeId && v.sizeId && v.sizeId !== selectedSizeId) isMatch = false;
      if (selectedColorId && v.colorId && v.colorId !== selectedColorId) isMatch = false;
      if (selectedWickTypeId && v.wickTypeId && v.wickTypeId !== selectedWickTypeId) isMatch = false;
      return isMatch;
    });

    return match || product.variants[0] || null;
  }, [product.variants, selectedFragranceId, selectedSizeId, selectedColorId, selectedWickTypeId]);

  // Selected Option Objects
  const selectedFragrance = useMemo(
    () => availableFragrances.find((f) => f.id === selectedFragranceId) || availableFragrances[0],
    [availableFragrances, selectedFragranceId]
  );
  const selectedSize = useMemo(
    () => availableSizes.find((s) => s.id === selectedSizeId) || availableSizes[0],
    [availableSizes, selectedSizeId]
  );
  const selectedColor = useMemo(
    () => availableColors.find((c) => c.id === selectedColorId) || availableColors[0],
    [availableColors, selectedColorId]
  );
  const selectedWickType = useMemo(
    () => availableWickTypes.find((w) => w.id === selectedWickTypeId) || availableWickTypes[0],
    [availableWickTypes, selectedWickTypeId]
  );

  // Notify parent of variant or image update
  useEffect(() => {
    if (onVariantChange) {
      onVariantChange(currentVariant, currentVariant?.imageUrl);
    }
  }, [currentVariant, onVariantChange]);

  // Calculated Pricing & Stock with dynamic size multiplier
  const basePrice = Number(product.price) || 999;
  const sizeMultiplier = selectedSize?.value ? (selectedSize.value > 300 ? 1.6 : selectedSize.value < 150 ? 0.7 : 1.0) : 1.0;
  const currentPrice = currentVariant ? currentVariant.price : Math.round((basePrice * sizeMultiplier) / 10) * 10;
  const currentOriginalPrice = currentVariant?.originalPrice || (product.originalPrice ? Math.round((product.originalPrice * sizeMultiplier) / 10) * 10 : Math.round(currentPrice * 1.25));
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
    window.location.hash = '#checkout';
  };

  return (
    <div className="space-y-6 font-sans text-[#1C1217]">
      {/* Category, SKU & Title */}
      <div>
        <div className="flex items-center justify-between gap-2 flex-wrap mb-2">
          <span className="text-[11px] font-mono uppercase tracking-widest text-[#E87A96] font-bold">
            {product.category || 'Artisanal Soy Candles'}
          </span>
          <span className="text-[11px] font-mono text-[#886C7B]">
            SKU: <span className="text-[#1C1217] font-semibold">{currentSku}</span>
          </span>
        </div>

        <h1 className="font-serif text-2xl sm:text-3xl lg:text-4xl text-[#1C1217] font-bold leading-tight">
          {product.name}
        </h1>

        {(product.tagline || product.scentProfile) && (
          <p className="text-sm text-[#624855] mt-2 font-light leading-relaxed">
            {product.tagline || product.scentProfile}
          </p>
        )}
      </div>

      {/* Rating & Stock Summary */}
      <div className="flex items-center gap-3 py-2.5 border-y border-[#F5E8EE]">
        <div className="flex items-center text-[#E8C86D] text-sm tracking-tighter">
          {'★'.repeat(5)}
        </div>
        <span className="text-xs font-mono text-[#1C1217] font-bold">
          {product.rating ? Number(product.rating).toFixed(1) : '4.9'}
        </span>
        <span className="text-xs text-[#886C7B]">
          ({product.reviewsCount || 18} Verified Reviews)
        </span>
        <span className="text-xs text-[#AC94A1]">•</span>
        <span className={`text-xs font-semibold ${isOutOfStock ? 'text-rose-600' : 'text-emerald-700'}`}>
          {isOutOfStock ? 'Currently Sold Out' : '✓ In Stock & Hand-Poured'}
        </span>
      </div>

      {/* Price & Savings Display */}
      <div className="flex items-baseline gap-3">
        <span className="text-3xl sm:text-4xl font-serif text-[#1C1217] font-bold">
          ₹{currentPrice.toLocaleString('en-IN')}
        </span>
        {currentOriginalPrice > currentPrice && (
          <>
            <span className="text-base text-[#886C7B] line-through">
              ₹{currentOriginalPrice.toLocaleString('en-IN')}
            </span>
            <span className="text-xs font-mono px-2 py-0.5 rounded-full bg-[#FFF6F8] text-[#E87A96] border border-[#F9B8CA] font-bold">
              SAVE {discountPercent}%
            </span>
          </>
        )}
      </div>

      {/* 1. DYNAMIC FRAGRANCE SELECTOR */}
      {/* 1. DYNAMIC FRAGRANCE SELECTOR DROPDOWN */}
      {availableFragrances.length > 0 && (
        <div className="space-y-1.5 pt-1">
          <div className="flex items-center justify-between">
            <label className="text-[11px] font-mono uppercase tracking-wider text-[#624855] font-bold">
              Select Fragrance:
            </label>
            {selectedFragrance?.intensity && (
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#FFF6F8] border border-[#F5E8EE] text-[#886C7B]">
                {selectedFragrance.intensity}
              </span>
            )}
          </div>
          <div className="relative">
            <select
              value={selectedFragranceId}
              onChange={(e) => setSelectedFragranceId(e.target.value)}
              className="w-full px-4 py-3 bg-white border border-[#E8DCE2] rounded-xl text-sm text-[#1C1217] font-medium appearance-none focus:outline-none focus:border-[#E87A96] focus:ring-1 focus:ring-[#E87A96] transition-all pr-10 cursor-pointer shadow-xs"
            >
              {availableFragrances.map((frag) => (
                <option key={frag.id} value={frag.id}>
                  {frag.name} {frag.scentProfile ? `— ${frag.scentProfile}` : ''}
                </option>
              ))}
            </select>
            <div className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-[#886C7B]">
              <ChevronDownIcon size={16} />
            </div>
          </div>
          {selectedFragrance && (
            <p className="text-[11px] text-[#886C7B] italic px-1">
              ✨ {selectedFragrance.scentProfile || selectedFragrance.topNotes || 'Signature botanical essential oil blend'}
            </p>
          )}
        </div>
      )}

      {/* 2. DYNAMIC COLOR / FINISH SELECTOR DROPDOWN */}
      {availableColors.length > 0 && (
        <div className="space-y-1.5 pt-1">
          <label className="block text-[11px] font-mono uppercase tracking-wider text-[#624855] font-bold">
            Select Wax / Vessel Color:
          </label>
          <div className="flex items-center gap-3">
            <div className="relative flex-1">
              <select
                value={selectedColorId}
                onChange={(e) => setSelectedColorId(e.target.value)}
                className="w-full px-4 py-3 bg-white border border-[#E8DCE2] rounded-xl text-sm text-[#1C1217] font-medium appearance-none focus:outline-none focus:border-[#E87A96] focus:ring-1 focus:ring-[#E87A96] transition-all pr-10 cursor-pointer shadow-xs"
              >
                {availableColors.map((col) => (
                  <option key={col.id} value={col.id}>
                    {col.name}
                  </option>
                ))}
              </select>
              <div className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-[#886C7B]">
                <ChevronDownIcon size={16} />
              </div>
            </div>
            {selectedColor?.hexCode && (
              <div
                className="w-9 h-9 rounded-full border-2 border-white shadow-md shrink-0 ring-1 ring-[#E8DCE2]"
                style={{ backgroundColor: selectedColor.hexCode }}
                title={selectedColor.name}
              />
            )}
          </div>
        </div>
      )}

      {/* 3. DYNAMIC SIZE SELECTOR DROPDOWN */}
      {availableSizes.length > 0 && (
        <div className="space-y-1.5 pt-1">
          <div className="flex items-center justify-between">
            <label className="block text-[11px] font-mono uppercase tracking-wider text-[#624855] font-bold">
              Select Vessel Size:
            </label>
            {product.burnTime && (
              <span className="text-[10px] text-[#886C7B] font-mono">
                Burn: {product.burnTime}
              </span>
            )}
          </div>
          <div className="relative">
            <select
              value={selectedSizeId}
              onChange={(e) => setSelectedSizeId(e.target.value)}
              className="w-full px-4 py-3 bg-white border border-[#E8DCE2] rounded-xl text-sm text-[#1C1217] font-medium appearance-none focus:outline-none focus:border-[#E87A96] focus:ring-1 focus:ring-[#E87A96] transition-all pr-10 cursor-pointer shadow-xs"
            >
              {availableSizes.map((sz) => {
                const szMult = sz.value > 300 ? 1.6 : sz.value < 150 ? 0.7 : 1.0;
                const szPrice = Math.round((basePrice * szMult) / 10) * 10;
                return (
                  <option key={sz.id} value={sz.id}>
                    {sz.name} (₹{szPrice.toLocaleString('en-IN')})
                  </option>
                );
              })}
            </select>
            <div className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-[#886C7B]">
              <ChevronDownIcon size={16} />
            </div>
          </div>
        </div>
      )}

      {/* 4. DYNAMIC WICK TYPE SELECTOR DROPDOWN */}
      {availableWickTypes.length > 0 && (
        <div className="space-y-1.5 pt-1">
          <label className="block text-[11px] font-mono uppercase tracking-wider text-[#624855] font-bold">
            Select Wick Type:
          </label>
          <div className="relative">
            <select
              value={selectedWickTypeId}
              onChange={(e) => setSelectedWickTypeId(e.target.value)}
              className="w-full px-4 py-3 bg-white border border-[#E8DCE2] rounded-xl text-sm text-[#1C1217] font-medium appearance-none focus:outline-none focus:border-[#E87A96] focus:ring-1 focus:ring-[#E87A96] transition-all pr-10 cursor-pointer shadow-xs"
            >
              {availableWickTypes.map((wk) => (
                <option key={wk.id} value={wk.id}>
                  {wk.name} {wk.description ? `(${wk.description})` : ''}
                </option>
              ))}
            </select>
            <div className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-[#886C7B]">
              <ChevronDownIcon size={16} />
            </div>
          </div>
        </div>
      )}

      {/* 5. QUANTITY SELECTOR */}
      <div className="space-y-1.5 pt-1">
        <label className="block text-[11px] font-mono uppercase tracking-wider text-[#624855] font-bold">
          Quantity:
        </label>
        <div className="flex items-center border border-[#E8DCE2] bg-white rounded-xl overflow-hidden max-w-[140px] shadow-xs">
          <button
            type="button"
            disabled={quantity <= 1 || isOutOfStock}
            onClick={() => setQuantity((q) => Math.max(1, q - 1))}
            className="px-4 py-2.5 text-[#1C1217] hover:text-[#E87A96] transition-colors disabled:opacity-30 cursor-pointer font-bold text-base"
          >
            -
          </button>
          <span className="flex-1 text-center text-sm font-mono text-[#1C1217] font-bold">
            {quantity}
          </span>
          <button
            type="button"
            disabled={quantity >= currentStock || isOutOfStock}
            onClick={() => setQuantity((q) => q + 1)}
            className="px-4 py-2.5 text-[#1C1217] hover:text-[#E87A96] transition-colors disabled:opacity-30 cursor-pointer font-bold text-base"
          >
            +
          </button>
        </div>
      </div>

      {/* 6. ACTION BUTTONS */}
      <div className="space-y-3 pt-3 border-t border-[#F5E8EE]">
        {/* Add to Cart Primary Button */}
        <button
          type="button"
          disabled={isOutOfStock}
          onClick={handleAddToCart}
          className="w-full py-4 px-6 rounded-2xl font-bold uppercase tracking-widest text-xs sm:text-sm transition-all shadow-md cursor-pointer bg-[#4A3222] hover:bg-[#382417] text-white flex items-center justify-center gap-2.5 disabled:opacity-40 disabled:cursor-not-allowed hover:scale-[1.01] active:scale-[0.99]"
        >
          <ShoppingBagIcon size={18} />
          <span>{isOutOfStock ? 'Currently Out of Stock' : `Add to Cart • ₹${(currentPrice * quantity).toLocaleString('en-IN')}`}</span>
        </button>

        {/* Instant Buy Now Button */}
        {!isOutOfStock && (
          <button
            type="button"
            onClick={handleTriggerBuyNow}
            className="w-full py-3.5 px-6 rounded-2xl font-bold uppercase tracking-widest text-xs transition-all cursor-pointer bg-[#E87A96] hover:bg-[#D45D7D] text-white shadow-sm flex items-center justify-center gap-2"
          >
            <SparklesIcon size={16} />
            <span>Instant Buy Now</span>
          </button>
        )}
      </div>

      {/* Gift Packaging & Atelier Perks */}
      {(product.hasGiftPackaging !== false || product.hasCustomMessage !== false) && (
        <div className="pt-2 space-y-2.5">
          {product.hasGiftPackaging !== false && (
            <label className="flex items-center gap-2.5 text-xs text-[#1C1217] cursor-pointer">
              <input
                type="checkbox"
                checked={giftPackaging}
                onChange={(e) => {
                  setGiftPackaging(e.target.checked);
                  if (product.hasCustomMessage !== false) {
                    setShowGiftMessageInput(e.target.checked);
                  }
                }}
                className="rounded text-[#E87A96] focus:ring-0"
              />
              <span>✨ Add Luxury Blush Gift Box Packaging (+₹149)</span>
            </label>
          )}

          {product.hasCustomMessage !== false && (showGiftMessageInput || product.hasGiftPackaging === false) && (
            <div className="pt-1">
              <input
                type="text"
                placeholder="Enter handwritten gift message for recipient..."
                value={customMessage}
                onChange={(e) => setCustomMessage(e.target.value)}
                className="w-full bg-[#FFF6F8] border border-[#F5E8EE] rounded-xl px-3 py-2 text-xs text-[#1C1217] outline-none focus:border-[#E87A96]"
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
};
