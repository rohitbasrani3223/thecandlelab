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

  // Option Flags Resolution
  const showFragrance = product?.hasFragranceOption !== false && (product?.hasFragranceOption ?? true);
  const showSize = product?.hasSizeOption !== false && (product?.hasSizeOption ?? true);
  const showColor = product?.hasColorOption !== false && (product?.hasColorOption ?? false);
  const showWick = product?.hasWickOption !== false && (product?.hasWickOption ?? true);
  const showGiftPackaging = product?.hasGiftPackaging !== false && (product?.hasGiftPackaging ?? true);
  const showCustomMessage = Boolean(product?.hasCustomMessage);

  // 1. DYNAMIC FRAGRANCE OPTIONS
  const availableFragrances = useMemo(() => {
    if (!product || !showFragrance) return [];

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
  }, [fragrances, product, showFragrance]);

  // 2. DYNAMIC SIZE OPTIONS
  const availableSizes = useMemo(() => {
    if (!showSize) return [];

    if (product.availableSizeIds && product.availableSizeIds.length > 0) {
      const allowed = sizes.filter((s) => product.availableSizeIds!.includes(s.id));
      if (allowed.length > 0) return allowed;
    }

    if (sizes.length > 0) {
      return sizes.filter((s) => s.isActive !== false);
    }

    return [];
  }, [sizes, product, showSize]);

  // 3. DYNAMIC COLOR / FINISH OPTIONS
  const availableColors = useMemo(() => {
    if (!showColor) return [];

    if (product.availableColorIds && product.availableColorIds.length > 0) {
      const allowed = colors.filter((c) => product.availableColorIds!.includes(c.id));
      if (allowed.length > 0) return allowed;
    }

    if (colors.length > 0) {
      return colors.filter((c) => c.isActive !== false);
    }

    return [];
  }, [colors, product, showColor]);

  // 4. DYNAMIC WICK TYPE OPTIONS
  const availableWickTypes = useMemo(() => {
    if (!showWick) return [];

    if (product.availableWickTypeIds && product.availableWickTypeIds.length > 0) {
      const allowed = wickTypes.filter((w) => product.availableWickTypeIds!.includes(w.id));
      if (allowed.length > 0) return allowed;
    }

    if (wickTypes.length > 0) {
      return wickTypes.filter((w) => w.isActive !== false);
    }

    return [];
  }, [wickTypes, product, showWick]);

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
  const [customColorText, setCustomColorText] = useState<string>('');
  const [isCustomColorActive, setIsCustomColorActive] = useState<boolean>(false);
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
    if (availableColors.length > 0 && selectedColorId !== 'custom' && !availableColors.some((c) => c.id === selectedColorId)) {
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
  const selectedColor = useMemo(() => {
    if (selectedColorId === 'custom') {
      return {
        id: 'custom',
        name: customColorText.trim() ? `Custom: ${customColorText.trim()}` : 'Custom Shade',
        hexCode: '#EADDCB',
      };
    }
    return availableColors.find((c) => c.id === selectedColorId) || availableColors[0];
  }, [availableColors, selectedColorId, customColorText]);
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

    const finalColorName = showColor
      ? (selectedColorId === 'custom'
          ? (customColorText.trim() ? `Custom: ${customColorText.trim()}` : 'Custom Color Shade')
          : (customColorText.trim() ? `${selectedColor?.name || 'Standard'} (${customColorText.trim()})` : selectedColor?.name))
      : undefined;

    addToCart({
      id: product.id,
      name: product.name,
      price: currentPrice,
      originalPrice: currentOriginalPrice,
      image: currentVariant?.imageUrl || product.image || product.imageUrl,
      fragrance: showFragrance ? (selectedFragrance?.name || product.scentProfile || 'Signature') : undefined,
      size: showSize ? (selectedSize?.name || 'Standard') : undefined,
      color: finalColorName,
      wickType: showWick ? selectedWickType?.name : undefined,
      sku: currentSku,
      variantId: currentVariant?.id,
      giftPackaging: showGiftPackaging ? giftPackaging : false,
      customMessage: showCustomMessage && (showGiftMessageInput || !showGiftPackaging) ? customMessage : undefined,
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
    <div className="space-y-6 font-sans text-[#232323]">
      {/* Category, SKU & Title */}
      <div>
        <div className="flex items-center justify-between gap-2 flex-wrap mb-2">
          <span className="text-[11px] font-mono uppercase tracking-widest text-[#8B6F4E] font-bold">
            {product.category || 'Artisanal Soy Candles'}
          </span>
          <span className="text-[11px] font-mono text-[#7D6F63]">
            SKU: <span className="text-[#232323] font-semibold">{currentSku}</span>
          </span>
        </div>

        <h1 className="font-serif text-2xl sm:text-3xl lg:text-4xl text-[#232323] font-bold leading-tight">
          {product.name}
        </h1>

        {(product.tagline || product.scentProfile) && (
          <p className="text-sm text-[#5C5149] mt-2 font-light leading-relaxed">
            {product.tagline || product.scentProfile}
          </p>
        )}
      </div>

      {/* Rating & Stock Summary */}
      <div className="flex items-center gap-3 py-2.5 border-y border-[#EADDCB]">
        <div className="flex items-center text-[#8B6F4E] text-sm tracking-tighter">
          {'★'.repeat(5)}
        </div>
        <span className="text-xs font-mono text-[#232323] font-bold">
          {product.rating ? Number(product.rating).toFixed(1) : '4.9'}
        </span>
        <span className="text-xs text-[#7D6F63]">
          ({product.reviewsCount || 18} Verified Reviews)
        </span>
        <span className="text-xs text-[#A39486]">•</span>
        <span className={`text-xs font-semibold ${isOutOfStock ? 'text-rose-600' : 'text-[#6B6E4A]'}`}>
          {isOutOfStock ? 'Currently Sold Out' : '✓ In Stock & Hand-Poured'}
        </span>
      </div>

      {/* Price & Savings Display */}
      <div className="flex items-baseline gap-3">
        <span className="text-3xl sm:text-4xl font-serif text-[#232323] font-bold">
          ₹{currentPrice.toLocaleString('en-IN')}
        </span>
        {currentOriginalPrice > currentPrice && (
          <>
            <span className="text-base text-[#7D6F63] line-through">
              ₹{currentOriginalPrice.toLocaleString('en-IN')}
            </span>
            <span className="text-xs font-mono px-2.5 py-0.5 rounded-full bg-[#FAF7F2] text-[#8B6F4E] border border-[#EADDCB] font-bold">
              SAVE {discountPercent}%
            </span>
          </>
        )}
      </div>

      {/* 1. DYNAMIC FRAGRANCE SELECTOR DROPDOWN */}
      {showFragrance && availableFragrances.length > 0 && (
        <div className="space-y-1.5 pt-1">
          <div className="flex items-center justify-between">
            <label className="text-[11px] font-mono uppercase tracking-wider text-[#5C5149] font-bold">
              Select Fragrance:
            </label>
            {selectedFragrance?.intensity && (
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#FAF7F2] border border-[#EADDCB] text-[#7D6F63]">
                {selectedFragrance.intensity}
              </span>
            )}
          </div>
          <div className="relative">
            <select
              value={selectedFragranceId}
              onChange={(e) => setSelectedFragranceId(e.target.value)}
              className="w-full px-4 py-3 bg-white border border-[#EADDCB] rounded-xl text-sm text-[#232323] font-medium appearance-none focus:outline-none focus:border-[#8B6F4E] focus:ring-1 focus:ring-[#8B6F4E] transition-all pr-10 cursor-pointer shadow-xs"
            >
              {availableFragrances.map((frag) => (
                <option key={frag.id} value={frag.id}>
                  {frag.name} {frag.scentProfile ? `— ${frag.scentProfile}` : ''}
                </option>
              ))}
            </select>
            <div className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-[#7D6F63]">
              <ChevronDownIcon size={16} />
            </div>
          </div>
          {selectedFragrance && (
            <p className="text-[11px] text-[#7D6F63] italic px-1">
              ✨ {selectedFragrance.scentProfile || selectedFragrance.topNotes || 'Signature botanical essential oil blend'}
            </p>
          )}
        </div>
      )}

      {/* 2. DYNAMIC COLOR / FINISH SELECTOR DROPDOWN (WITH CUSTOM COLOR SUPPORT) */}
      {showColor && (
        <div className="space-y-1.5 pt-1">
          <div className="flex items-center justify-between">
            <label className="block text-[11px] font-mono uppercase tracking-wider text-[#5C5149] font-bold">
              Select Wax / Vessel Color:
            </label>
            <button
              type="button"
              onClick={() => {
                const nextActive = !isCustomColorActive;
                setIsCustomColorActive(nextActive);
                if (nextActive) {
                  setSelectedColorId('custom');
                } else if (availableColors.length > 0) {
                  setSelectedColorId(availableColors[0].id);
                }
              }}
              className="text-[10px] font-mono font-bold text-[#8B6F4E] hover:underline cursor-pointer flex items-center gap-1"
            >
              <span>🎨 {isCustomColorActive || selectedColorId === 'custom' ? 'View Standard Colors' : '+ Custom Color Shade'}</span>
            </button>
          </div>

          <div className="flex items-center gap-3">
            <div className="relative flex-1">
              <select
                value={selectedColorId}
                onChange={(e) => {
                  const val = e.target.value;
                  setSelectedColorId(val);
                  if (val === 'custom') {
                    setIsCustomColorActive(true);
                  }
                }}
                className="w-full px-4 py-3 bg-white border border-[#EADDCB] rounded-xl text-sm text-[#232323] font-medium appearance-none focus:outline-none focus:border-[#8B6F4E] focus:ring-1 focus:ring-[#8B6F4E] transition-all pr-10 cursor-pointer shadow-xs"
              >
                {availableColors.map((col) => (
                  <option key={col.id} value={col.id}>
                    {col.name}
                  </option>
                ))}
                {availableColors.length === 0 && (
                  <option value="standard">Natural Atelier Soy Wax</option>
                )}
                <option value="custom">🎨 Custom / Request Specific Shade...</option>
              </select>
              <div className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-[#7D6F63]">
                <ChevronDownIcon size={16} />
              </div>
            </div>

            {/* Color Preview Swatch or Custom Palette Indicator */}
            {selectedColorId === 'custom' ? (
              <div
                className="w-9 h-9 rounded-full border-2 border-white shadow-md shrink-0 bg-gradient-to-tr from-[#EADDCB] via-[#8B6F4E] to-[#8B6F4E] flex items-center justify-center text-xs ring-1 ring-[#EADDCB]"
                title="Custom Color Formulation"
              >
                🎨
              </div>
            ) : selectedColor?.hexCode ? (
              <div
                className="w-9 h-9 rounded-full border-2 border-white shadow-md shrink-0 ring-1 ring-[#EADDCB]"
                style={{ backgroundColor: selectedColor.hexCode }}
                title={selectedColor.name}
              />
            ) : (
              <div
                className="w-9 h-9 rounded-full border-2 border-white shadow-md shrink-0 bg-[#FAF7F2] ring-1 ring-[#EADDCB]"
                title="Natural Soy Cream"
              />
            )}
          </div>

          {/* Custom Color Text Input Field */}
          {(selectedColorId === 'custom' || isCustomColorActive) && (
            <div className="pt-1.5 space-y-1">
              <input
                type="text"
                placeholder="Describe your custom color / shade (e.g. Pastel Lavender, Sage Green & Gold)..."
                value={customColorText}
                onChange={(e) => setCustomColorText(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-[#FAF7F2] border border-[#EADDCB] rounded-xl text-xs text-[#232323] placeholder:text-[#7D6F63] outline-none focus:ring-1 focus:ring-[#8B6F4E] transition-all font-medium"
              />
              <p className="text-[10px] text-[#7D6F63] italic px-1">
                ✨ Hand-tinted specifically to your shade request in small batches.
              </p>
            </div>
          )}
        </div>
      )}

      {/* 3. DYNAMIC SIZE SELECTOR DROPDOWN */}
      {showSize && availableSizes.length > 0 && (
        <div className="space-y-1.5 pt-1">
          <div className="flex items-center justify-between">
            <label className="block text-[11px] font-mono uppercase tracking-wider text-[#5C5149] font-bold">
              Select Vessel Size:
            </label>
            {product.burnTime && (
              <span className="text-[10px] text-[#7D6F63] font-mono">
                Burn: {product.burnTime}
              </span>
            )}
          </div>
          <div className="relative">
            <select
              value={selectedSizeId}
              onChange={(e) => setSelectedSizeId(e.target.value)}
              className="w-full px-4 py-3 bg-white border border-[#EADDCB] rounded-xl text-sm text-[#232323] font-medium appearance-none focus:outline-none focus:border-[#8B6F4E] focus:ring-1 focus:ring-[#8B6F4E] transition-all pr-10 cursor-pointer shadow-xs"
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
            <div className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-[#7D6F63]">
              <ChevronDownIcon size={16} />
            </div>
          </div>
        </div>
      )}

      {/* 4. DYNAMIC WICK TYPE SELECTOR DROPDOWN */}
      {showWick && availableWickTypes.length > 0 && (
        <div className="space-y-1.5 pt-1">
          <label className="block text-[11px] font-mono uppercase tracking-wider text-[#5C5149] font-bold">
            Select Wick Type:
          </label>
          <div className="relative">
            <select
              value={selectedWickTypeId}
              onChange={(e) => setSelectedWickTypeId(e.target.value)}
              className="w-full px-4 py-3 bg-white border border-[#EADDCB] rounded-xl text-sm text-[#232323] font-medium appearance-none focus:outline-none focus:border-[#8B6F4E] focus:ring-1 focus:ring-[#8B6F4E] transition-all pr-10 cursor-pointer shadow-xs"
            >
              {availableWickTypes.map((wk) => (
                <option key={wk.id} value={wk.id}>
                  {wk.name} {wk.description ? `(${wk.description})` : ''}
                </option>
              ))}
            </select>
            <div className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-[#7D6F63]">
              <ChevronDownIcon size={16} />
            </div>
          </div>
        </div>
      )}

      {/* 5. QUANTITY SELECTOR */}
      <div className="space-y-1.5 pt-1">
        <label className="block text-[11px] font-mono uppercase tracking-wider text-[#5C5149] font-bold">
          Quantity:
        </label>
        <div className="flex items-center border border-[#EADDCB] bg-white rounded-xl overflow-hidden max-w-[140px] shadow-xs">
          <button
            type="button"
            disabled={quantity <= 1 || isOutOfStock}
            onClick={() => setQuantity((q) => Math.max(1, q - 1))}
            className="px-4 py-2.5 text-[#232323] hover:text-[#8B6F4E] transition-colors disabled:opacity-30 cursor-pointer font-bold text-base"
          >
            -
          </button>
          <span className="flex-1 text-center text-sm font-mono text-[#232323] font-bold">
            {quantity}
          </span>
          <button
            type="button"
            disabled={quantity >= currentStock || isOutOfStock}
            onClick={() => setQuantity((q) => q + 1)}
            className="px-4 py-2.5 text-[#232323] hover:text-[#8B6F4E] transition-colors disabled:opacity-30 cursor-pointer font-bold text-base"
          >
            +
          </button>
        </div>
      </div>

      {/* 6. ACTION BUTTONS */}
      <div className="space-y-3 pt-3 border-t border-[#EADDCB]">
        {/* Add to Cart Primary Button */}
        <button
          type="button"
          disabled={isOutOfStock}
          onClick={handleAddToCart}
          className="w-full py-4 px-6 rounded-2xl font-bold uppercase tracking-widest text-xs sm:text-sm transition-all shadow-md cursor-pointer bg-[#232323] hover:bg-[#3D3531] text-white flex items-center justify-center gap-2.5 disabled:opacity-40 disabled:cursor-not-allowed hover:scale-[1.01] active:scale-[0.99]"
        >
          <ShoppingBagIcon size={18} />
          <span>{isOutOfStock ? 'Currently Out of Stock' : `Add to Cart • ₹${(currentPrice * quantity).toLocaleString('en-IN')}`}</span>
        </button>

        {/* Instant Buy Now Button */}
        {!isOutOfStock && (
          <button
            type="button"
            onClick={handleTriggerBuyNow}
            className="w-full py-3.5 px-6 rounded-2xl font-bold uppercase tracking-widest text-xs transition-all cursor-pointer bg-[#8B6F4E] hover:bg-[#745A3D] text-white shadow-[0_4px_16px_rgba(139,111,78,0.35)] flex items-center justify-center gap-2"
          >
            <SparklesIcon size={16} />
            <span>Instant Buy Now</span>
          </button>
        )}
      </div>

      {/* Gift Packaging & Atelier Perks */}
      {(showGiftPackaging || showCustomMessage) && (
        <div className="pt-2 space-y-2.5">
          {showGiftPackaging && (
            <label className="flex items-center gap-2.5 text-xs text-[#232323] cursor-pointer">
              <input
                type="checkbox"
                checked={giftPackaging}
                onChange={(e) => {
                  setGiftPackaging(e.target.checked);
                  if (showCustomMessage) {
                    setShowGiftMessageInput(e.target.checked);
                  }
                }}
                className="rounded text-[#8B6F4E] focus:ring-0"
              />
              <span>✨ Add Luxury Blush Gift Box Packaging (+₹149)</span>
            </label>
          )}

          {showCustomMessage && (showGiftMessageInput || !showGiftPackaging) && (
            <div className="pt-1">
              <input
                type="text"
                placeholder="Enter handwritten gift message for recipient..."
                value={customMessage}
                onChange={(e) => setCustomMessage(e.target.value)}
                className="w-full bg-[#FAF7F2] border border-[#EADDCB] rounded-xl px-3 py-2 text-xs text-[#232323] outline-none focus:border-[#8B6F4E]"
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
};
