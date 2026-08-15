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

  // 1. DYNAMIC FRAGRANCE OPTIONS FOR THIS PRODUCT
  // 1. DYNAMIC FRAGRANCE OPTIONS
  const availableFragrances = useMemo(() => {
    if (product.hasFragranceOption === false) return [];

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

  // 4. DYNAMIC WICK OPTIONS
  const availableWickTypes = useMemo(() => {
    if (product.hasWickOption === false) return [];

    if (product.availableWickTypeIds && product.availableWickTypeIds.length > 0) {
      const allowed = wickTypes.filter((w) => product.availableWickTypeIds!.includes(w.id));
      if (allowed.length > 0) return allowed;
    }

    if (wickTypes.length > 0) {
      return wickTypes.filter((w) => w.isActive !== false);
    }

    if (product.wickType) {
      return [
        {
          id: 'prod-wick',
          name: product.wickType,
          description: 'Standard Artisan Wick',
          isActive: true,
        } as any,
      ];
    }

    return [];
  }, [wickTypes, product]);

  // Selected Option States
  const [selectedFragranceId, setSelectedFragranceId] = useState<string>('');
  const [selectedSizeId, setSelectedSizeId] = useState<string>('');
  const [selectedColorId, setSelectedColorId] = useState<string>('');
  const [selectedWickTypeId, setSelectedWickTypeId] = useState<string>('');
  const [quantity, setQuantity] = useState<number>(1);
  const [giftPackaging, setGiftPackaging] = useState<boolean>(false);
  const [customMessage, setCustomMessage] = useState<string>('');
  const [showGiftMessageInput, setShowGiftMessageInput] = useState<boolean>(false);

  // Sync default selection whenever option lists update
  useEffect(() => {
    if (availableFragrances.length > 0 && (!selectedFragranceId || !availableFragrances.some(f => f.id === selectedFragranceId))) {
      setSelectedFragranceId(availableFragrances[0].id);
    }
  }, [availableFragrances, selectedFragranceId]);

  useEffect(() => {
    if (availableSizes.length > 0 && (!selectedSizeId || !availableSizes.some(s => s.id === selectedSizeId))) {
      setSelectedSizeId(availableSizes[0].id);
    }
  }, [availableSizes, selectedSizeId]);

  useEffect(() => {
    if (availableColors.length > 0 && (!selectedColorId || !availableColors.some(c => c.id === selectedColorId))) {
      setSelectedColorId(availableColors[0].id);
    }
  }, [availableColors, selectedColorId]);

  useEffect(() => {
    if (availableWickTypes.length > 0 && (!selectedWickTypeId || !availableWickTypes.some(w => w.id === selectedWickTypeId))) {
      setSelectedWickTypeId(availableWickTypes[0].id);
    }
  }, [availableWickTypes, selectedWickTypeId]);

  // Find Best Matching Variant
  const currentVariant = useMemo<CMSProductVariant | null>(() => {
    if (!product.variants || product.variants.length === 0) return null;

    // 1. Exact match
    const exact = product.variants.find((v) => {
      const matchFrag = !selectedFragranceId || v.fragranceId === selectedFragranceId || v.fragranceName === selectedFragranceId;
      const matchSize = !selectedSizeId || v.sizeId === selectedSizeId || v.sizeName === selectedSizeId;
      const matchColor = !selectedColorId || v.colorId === selectedColorId;
      return matchFrag && matchSize && matchColor;
    });
    if (exact) return exact;

    // 2. Partial match
    const sizeMatch = product.variants.find((v) => v.sizeId === selectedSizeId || v.sizeName === selectedSizeId);
    if (sizeMatch) return sizeMatch;

    const fragMatch = product.variants.find((v) => v.fragranceId === selectedFragranceId || v.fragranceName === selectedFragranceId);
    if (fragMatch) return fragMatch;

    return product.variants[0] || null;
  }, [
    product.variants,
    selectedFragranceId,
    selectedSizeId,
    selectedColorId,
  ]);

  // Selected Option Objects Lookups
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
  };

  return (
    <div className="space-y-6 font-sans">
      {/* Category, SKU & Title */}
      <div>
        <div className="flex items-center justify-between gap-2 flex-wrap mb-2">
          <span className="text-[11px] font-mono uppercase tracking-widest text-[#C5983A] font-bold">
            {product.category || 'Artisanal Soy Candles'}
          </span>
          <span className="text-[11px] font-mono text-stone-400">
            SKU: <span className="text-stone-300 font-semibold">{currentSku}</span>
          </span>
        </div>

        <h1 className="font-serif text-2xl sm:text-3xl lg:text-4xl text-[#FDFBF7] font-bold leading-tight">
          {product.name}
        </h1>

        {(product.tagline || product.scentProfile) && (
          <p className="text-sm text-stone-300 mt-2 font-light leading-relaxed">
            {product.tagline || product.scentProfile}
          </p>
        )}
      </div>

      {/* Rating & Stock Summary */}
      <div className="flex items-center gap-3 py-2.5 border-y border-[#2C2018]">
        <div className="flex items-center text-[#DEB554] text-sm tracking-tighter">
          {'★'.repeat(5)}
        </div>
        <span className="text-xs font-mono text-stone-300 font-bold">
          {product.rating ? Number(product.rating).toFixed(1) : '4.9'}
        </span>
        <span className="text-xs text-stone-400">
          ({product.reviewsCount || 18} Verified Reviews)
        </span>
        <span className="text-xs text-stone-600">•</span>
        <span className={`text-xs font-semibold ${isOutOfStock ? 'text-rose-400' : 'text-emerald-400'}`}>
          {isOutOfStock ? 'Currently Sold Out' : '✓ In Stock & Hand-Poured'}
        </span>
      </div>

      {/* Price & Savings Display */}
      <div className="flex items-baseline gap-3">
        <span className="text-3xl sm:text-4xl font-serif text-[#FDFBF7] font-bold">
          ₹{currentPrice.toLocaleString('en-IN')}
        </span>
        {currentOriginalPrice > currentPrice && (
          <>
            <span className="text-base text-stone-500 line-through">
              ₹{currentOriginalPrice.toLocaleString('en-IN')}
            </span>
            <span className="text-xs font-mono px-2 py-0.5 rounded-full bg-[#DEB554]/15 text-[#DEB554] border border-[#DEB554]/30 font-bold">
              SAVE {discountPercent}%
            </span>
          </>
        )}
      </div>

      {/* 1. DYNAMIC FRAGRANCE SELECTOR */}
      {availableFragrances.length > 0 && (
        <div className="space-y-2.5 pt-2">
          <div className="flex items-center justify-between">
            <label className="text-xs font-mono uppercase tracking-wider text-stone-300 font-bold">
              Fragrance / Scent Accord:{' '}
              <span className="text-[#DEB554] font-semibold font-sans">
                {selectedFragrance?.name || 'Choose fragrance'}
              </span>
            </label>
            {selectedFragrance?.intensity && (
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#1C130E] border border-[#2C2018] text-stone-400">
                {selectedFragrance.intensity}
              </span>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {availableFragrances.map((frag) => {
              const isSelected = frag.id === selectedFragranceId;
              return (
                <button
                  key={frag.id}
                  type="button"
                  onClick={() => setSelectedFragranceId(frag.id)}
                  className={`flex items-start gap-2.5 p-3 rounded-xl border text-left transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-[#DEB554]/15 border-[#DEB554] shadow-[0_0_15px_rgba(222,181,84,0.15)]'
                      : 'bg-[#1C130E] border-[#2C2018] hover:border-stone-500'
                  }`}
                >
                  <div className="w-8 h-8 rounded-lg bg-[#140D09] border border-[#2C2018] flex items-center justify-center text-sm shrink-0 mt-0.5">
                    {frag.imageUrl ? (
                      <img src={frag.imageUrl} alt={frag.name} className="w-full h-full object-cover rounded-lg" />
                    ) : (
                      '🌸'
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className={`text-xs font-bold leading-tight truncate ${isSelected ? 'text-[#DEB554]' : 'text-[#FDFBF7]'}`}>
                      {frag.name}
                    </p>
                    <p className="text-[10px] text-stone-400 truncate mt-0.5">
                      {frag.scentProfile || frag.topNotes || 'Signature botanical blend'}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Scent Accord Notes Breakdown */}
          {(product.topNotes || selectedFragrance?.topNotes) && (
            <div className="p-3 rounded-xl bg-[#140D09] border border-[#2C2018] text-[11px] text-stone-300 space-y-1">
              <p>
                <span className="text-[#DEB554] font-bold">Top Notes:</span> {product.topNotes || selectedFragrance?.topNotes}
              </p>
              {(product.heartNotes || selectedFragrance?.heartNotes) && (
                <p>
                  <span className="text-stone-400 font-medium">Heart:</span> {product.heartNotes || selectedFragrance?.heartNotes}
                </p>
              )}
              {(product.baseNotes || selectedFragrance?.baseNotes) && (
                <p>
                  <span className="text-stone-400 font-medium">Base:</span> {product.baseNotes || selectedFragrance?.baseNotes}
                </p>
              )}
            </div>
          )}
        </div>
      )}

      {/* 2. DYNAMIC SIZE SELECTOR */}
      {availableSizes.length > 0 && (
        <div className="space-y-2 pt-2">
          <div className="flex items-center justify-between">
            <label className="block text-xs font-mono uppercase tracking-wider text-stone-300 font-bold">
              Vessel Size / Net Weight:{' '}
              <span className="text-[#DEB554] font-semibold font-sans">
                {selectedSize?.name || 'Select Size'}
              </span>
            </label>
            {product.burnTime && (
              <span className="text-[10px] text-stone-400 font-mono">
                Burn: {product.burnTime}
              </span>
            )}
          </div>
          <div className="flex flex-wrap gap-2.5">
            {availableSizes.map((sz) => {
              const isSelected = sz.id === selectedSizeId;
              const szMult = sz.value > 300 ? 1.6 : sz.value < 150 ? 0.7 : 1.0;
              const szPrice = Math.round((basePrice * szMult) / 10) * 10;
              return (
                <button
                  key={sz.id}
                  type="button"
                  onClick={() => setSelectedSizeId(sz.id)}
                  className={`px-3.5 py-2.5 rounded-xl border text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
                    isSelected
                      ? 'bg-[#DEB554]/15 border-[#DEB554] text-[#DEB554] shadow-sm'
                      : 'bg-[#1C130E] border-[#2C2018] text-stone-300 hover:border-stone-500'
                  }`}
                >
                  <span>{sz.name}</span>
                  <span className="text-[10px] text-stone-400 font-normal">
                    (₹{szPrice.toLocaleString('en-IN')})
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* 3. DYNAMIC COLOR / FINISH SELECTOR */}
      {availableColors.length > 0 && (
        <div className="space-y-2 pt-2">
          <label className="block text-xs font-mono uppercase tracking-wider text-stone-300 font-bold">
            Vessel Finish & Color:{' '}
            <span className="text-[#DEB554] font-semibold font-sans">
              {selectedColor?.name || 'Select Finish'}
            </span>
          </label>
          <div className="flex items-center gap-3">
            {availableColors.map((col) => {
              const isSelected = col.id === selectedColorId;
              return (
                <button
                  key={col.id}
                  type="button"
                  title={col.name}
                  onClick={() => setSelectedColorId(col.id)}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-full border transition-all cursor-pointer ${
                    isSelected
                      ? 'border-[#DEB554] bg-[#DEB554]/15 text-[#DEB554]'
                      : 'border-[#2C2018] bg-[#1C130E] text-stone-300 hover:border-stone-500'
                  }`}
                >
                  <span
                    className="w-3.5 h-3.5 rounded-full border border-stone-600 shadow-inner shrink-0"
                    style={{ backgroundColor: col.hexCode }}
                  />
                  <span className="text-xs font-medium">{col.name}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* 4. DYNAMIC WICK TYPE SELECTOR */}
      {availableWickTypes.length > 0 && (
        <div className="space-y-2 pt-2">
          <label className="block text-xs font-mono uppercase tracking-wider text-stone-300 font-bold">
            Wick Formulation:{' '}
            <span className="text-[#DEB554] font-semibold font-sans">
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
                  className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-[#DEB554]/15 border-[#DEB554] text-[#DEB554]'
                      : 'bg-[#1C130E] border-[#2C2018] text-stone-300 hover:border-stone-500'
                  }`}
                >
                  <p className="text-xs font-bold">{wk.name}</p>
                  {wk.description && (
                    <p className="text-[10px] text-stone-400 mt-0.5">{wk.description}</p>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* 5. QUANTITY & CART ACTION BAR */}
      <div className="space-y-4 pt-4 border-t border-[#2C2018]">
        <div className="flex items-center gap-4">
          {/* Quantity Stepper */}
          <div className="flex items-center border border-[#2C2018] bg-[#140D09] rounded-xl overflow-hidden">
            <button
              type="button"
              disabled={quantity <= 1 || isOutOfStock}
              onClick={() => setQuantity((q) => Math.max(1, q - 1))}
              className="px-3.5 py-2.5 text-stone-300 hover:bg-[#251A13] transition-colors disabled:opacity-30 cursor-pointer font-bold"
            >
              -
            </button>
            <span className="px-4 py-2 text-xs font-mono text-[#FDFBF7] font-bold">
              {quantity}
            </span>
            <button
              type="button"
              disabled={quantity >= currentStock || isOutOfStock}
              onClick={() => setQuantity((q) => q + 1)}
              className="px-3.5 py-2.5 text-stone-300 hover:bg-[#251A13] transition-colors disabled:opacity-30 cursor-pointer font-bold"
            >
              +
            </button>
          </div>

          {/* Add to Bag Button */}
          <button
            type="button"
            disabled={isOutOfStock}
            onClick={handleAddToCart}
            className="flex-1 py-3.5 px-6 rounded-xl font-bold uppercase tracking-widest text-xs transition-all shadow-lg cursor-pointer bg-[#DEB554] hover:bg-[#C5983A] text-[#180F0A] hover:shadow-[0_0_20px_rgba(222,181,84,0.3)] disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {isOutOfStock ? 'Out of Stock' : `Add to Bag • ₹${(currentPrice * quantity).toLocaleString('en-IN')}`}
          </button>
        </div>

        {/* Buy Now Instant Checkout Button */}
        {!isOutOfStock && (
          <button
            type="button"
            onClick={handleTriggerBuyNow}
            className="w-full py-3 px-6 rounded-xl font-bold uppercase tracking-widest text-xs transition-all cursor-pointer bg-[#241812] hover:bg-[#2C2018] text-[#F5EEE4] border border-[#DEB554]/40 hover:border-[#DEB554]"
          >
            Instant Buy Now →
          </button>
        )}
      </div>

      {/* Gift Packaging & Atelier Perks */}
      {(product.hasGiftPackaging !== false || product.hasCustomMessage !== false) && (
        <div className="pt-2 space-y-2.5">
          {product.hasGiftPackaging !== false && (
            <label className="flex items-center gap-2.5 text-xs text-stone-300 cursor-pointer">
              <input
                type="checkbox"
                checked={giftPackaging}
                onChange={(e) => {
                  setGiftPackaging(e.target.checked);
                  if (product.hasCustomMessage !== false) {
                    setShowGiftMessageInput(e.target.checked);
                  }
                }}
                className="rounded bg-[#1C130E] border-[#2C2018] text-[#DEB554] focus:ring-0"
              />
              <span>✨ Add Luxury Gold-Foil Gift Box Packaging (+₹149)</span>
            </label>
          )}

          {product.hasCustomMessage !== false && (showGiftMessageInput || product.hasGiftPackaging === false) && (
            <div className="pt-1">
              <input
                type="text"
                placeholder="Enter handwritten gift message for recipient..."
                value={customMessage}
                onChange={(e) => setCustomMessage(e.target.value)}
                className="w-full bg-[#140D09] border border-[#2C2018] rounded-xl px-3 py-2 text-xs text-[#FDFBF7] outline-none focus:border-[#DEB554]"
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
};
