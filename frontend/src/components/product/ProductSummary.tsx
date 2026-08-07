import React, { useState } from 'react';
import { Button, Badge, StarIcon, SparklesIcon, HeartIcon, useToast } from '../../design-system';

export interface ProductSummaryProps {
  product?: {
    id?: string;
    name?: string;
    category?: string;
    collection?: string;
    scentProfile?: string;
    price?: number;
    originalPrice?: number;
    rating?: number;
    reviewsCount?: number;
    topNotes?: string;
    heartNotes?: string;
    baseNotes?: string;
    burnTime?: string;
    vesselDescription?: string;
    image?: string;
    imageUrl?: string;
    inStock?: boolean;
  } | null;
  onAddToCart: (size: string, wick: string, qty: number) => void;
  onBuyNow: (size: string, wick: string, qty: number) => void;
}

export const ProductSummary: React.FC<ProductSummaryProps> = ({ product, onAddToCart, onBuyNow }) => {
  const productName = product?.name || 'Velvet Rose & Smoked Amber';
  const productPrice = product?.price ? Math.round(product.price) : 1499;
  const productOriginal = product?.originalPrice ? Math.round(product.originalPrice) : Math.round(productPrice * 1.25);
  const rating = product?.rating || 4.9;
  const reviewsCount = product?.reviewsCount || 12;

  const scentProfile = product?.scentProfile || product?.topNotes || 'Warm Vanilla, Amber';
  const topNotes = product?.topNotes || scentProfile;
  const heartNotes = product?.heartNotes || 'Damask Rose, Soft Spices';
  const baseNotes = product?.baseNotes || 'Smoked Amber, Sandalwood';
  const burnTime = product?.burnTime || '60 Hours';
  const vesselDesc =
    product?.vesselDescription ||
    'Handcrafted bouquet candle featuring elegant purple daisy flowers wrapped in premium newspaper-style wrapping with a decorative ribbon.';
  const sku = `TCL-${(product?.id || 'VRSA').toUpperCase()}-2026`;

  const [sizeOption, setSizeOption] = useState<'8oz' | '12oz' | '16oz'>('12oz');
  const [selectedWick, setSelectedWick] = useState('Organic Wood Wick (Crackling)');
  const [quantity, setQuantity] = useState(1);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const { toast } = useToast();

  const currentPrice =
    sizeOption === '8oz'
      ? Math.round(productPrice * 0.7)
      : sizeOption === '16oz'
      ? Math.round(productPrice * 1.3)
      : productPrice;
  const currentOriginal =
    sizeOption === '8oz'
      ? Math.round(productOriginal * 0.7)
      : sizeOption === '16oz'
      ? Math.round(productOriginal * 1.3)
      : productOriginal;
  const selectedSizeLabel =
    sizeOption === '8oz'
      ? `8 oz Tin (₹${currentPrice.toLocaleString('en-IN')})`
      : sizeOption === '16oz'
      ? `16 oz 3-Wick (₹${currentPrice.toLocaleString('en-IN')})`
      : `12 oz Glass (₹${currentPrice.toLocaleString('en-IN')})`;

  const handleShare = () => {
    navigator.clipboard?.writeText(window.location.href);
    toast({ type: 'info', title: 'Product Link Copied to Clipboard' });
  };

  return (
    <div className="space-y-6 font-sans">
      {/* Header Info */}
      <div className="space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <Badge variant="gold" icon={<SparklesIcon size={12} />}>
            ROYAL 24K GOLD RESERVE
          </Badge>
          <span className="text-xs font-mono text-[#8C7A6B]">SKU: {sku}</span>
        </div>

        <h1 className="text-3xl sm:text-4xl font-serif font-bold text-[#2A1E17] leading-tight">
          {productName}
        </h1>

        <p className="text-sm font-accent-luxury italic text-[#69574A] leading-relaxed">
          {vesselDesc}
        </p>

        {/* Dynamic Notes Pill */}
        <div className="text-xs text-[#69574A] bg-[#F4EFE6] p-3 rounded-lg border border-[#E5D9C5] space-y-1.5">
          <div className="flex items-center justify-between font-bold text-[#2A1E17]">
            <span>Fragrance & Scent Profile:</span>
            <button onClick={handleShare} className="text-[#D4AF37] hover:underline cursor-pointer">
              Share 🔗
            </button>
          </div>
          <p className="text-[#2A1E17] font-semibold">{scentProfile}</p>
          {product?.topNotes && (
            <div className="pt-1 text-[11px] text-[#8C7A6B] space-y-0.5 border-t border-[#E5D9C5]/60">
              <div>
                <strong className="text-[#2A1E17]">Top Notes:</strong> {topNotes}
              </div>
              {product?.heartNotes && (
                <div>
                  <strong className="text-[#2A1E17]">Heart Notes:</strong> {heartNotes}
                </div>
              )}
              {product?.baseNotes && (
                <div>
                  <strong className="text-[#2A1E17]">Base Notes:</strong> {baseNotes}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Rating & Burn Time Badge */}
        <div className="flex flex-wrap items-center gap-3 text-xs pt-1">
          <div className="flex items-center gap-1 text-[#D4AF37] font-bold">
            <div className="flex text-[#D4AF37]">
              {[...Array(5)].map((_, i) => (
                <StarIcon key={i} size={15} className="fill-current text-[#D4AF37]" />
              ))}
            </div>
            <span className="ml-1">{rating}</span>
          </div>
          <span className="text-[#8C7A6B]">•</span>
          <span className="text-[#2A1E17] font-semibold">{reviewsCount} Verified Connoisseur Reviews</span>
          <span className="text-[#8C7A6B]">•</span>
          <span className="bg-[#EFE7D8] text-[#2A1E17] px-2 py-0.5 rounded-full font-bold text-[11px]">
            🔥 Burn Time: {burnTime}
          </span>
        </div>
      </div>

      {/* Price Box */}
      <div className="p-4 bg-[#F4EFE6] border border-[#E5D9C5] rounded-xl flex items-center justify-between">
        <div className="flex items-baseline gap-3">
          <span className="text-3xl font-bold text-[#2A1E17]">₹{currentPrice.toLocaleString('en-IN')}.00</span>
          <span className="text-sm text-[#8C7A6B] line-through">₹{currentOriginal.toLocaleString('en-IN')}.00</span>
        </div>
        <div className="text-right">
          <span className="text-xs font-bold text-[#2E6F40] block">✓ In Stock</span>
          <span className="text-[11px] text-[#B33A3A] font-semibold">⚡ Hand-Poured Small Batch</span>
        </div>
      </div>

      {/* 1. Vessel Size Selection */}
      <div className="space-y-2.5">
        <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-[#2A1E17]">
          <span>Select Vessel Size:</span>
          <span className="text-[#D4AF37] font-normal">{selectedSizeLabel}</span>
        </div>
        <div className="grid grid-cols-3 gap-3">
          {[
            { id: '8oz', label: '8 oz Tin', price: `₹${Math.round(productPrice * 0.7).toLocaleString('en-IN')}` },
            { id: '12oz', label: '12 oz Glass', price: `₹${productPrice.toLocaleString('en-IN')}`, popular: true },
            { id: '16oz', label: '16 oz 3-Wick', price: `₹${Math.round(productPrice * 1.3).toLocaleString('en-IN')}` },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setSizeOption(item.id as any)}
              className={`p-3 rounded-xl border text-center transition-all relative cursor-pointer ${
                sizeOption === item.id
                  ? 'border-[#D4AF37] bg-[#FAF6F0] ring-2 ring-[#D4AF37]/40 shadow-xs'
                  : 'border-[#E5D9C5] bg-[#F4EFE6] hover:bg-[#FAF6F0]'
              }`}
            >
              {item.popular && (
                <span className="absolute -top-2 right-2 bg-[#D4AF37] text-[#1C130E] text-[9px] font-bold px-1.5 py-0.5 rounded-full">
                  MOST LOVED
                </span>
              )}
              <span className="text-xs font-bold text-[#2A1E17] block">{item.label}</span>
              <span className="text-[11px] text-[#8C7A6B]">{item.price}</span>
            </button>
          ))}
        </div>
      </div>

      {/* 2. Wick Type Selection */}
      <div className="space-y-2.5">
        <span className="text-xs font-bold uppercase tracking-wider text-[#2A1E17] block">
          Select Wick Type:
        </span>
        <div className="grid grid-cols-2 gap-3 text-xs">
          {[
            { title: 'Organic Wood Wick', desc: 'Crackling fireside sound', val: 'Organic Wood Wick (Crackling)' },
            { title: '100% Cotton Wick', desc: 'Silent flame diffusion', val: '100% Cotton Wick (Silent)' },
          ].map((wick) => (
            <button
              key={wick.val}
              onClick={() => setSelectedWick(wick.val)}
              className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                selectedWick === wick.val
                  ? 'border-[#D4AF37] bg-[#FAF6F0] ring-2 ring-[#D4AF37]/40 shadow-xs'
                  : 'border-[#E5D9C5] bg-[#F4EFE6] hover:bg-[#FAF6F0]'
              }`}
            >
              <span className="font-bold text-[#2A1E17] block">{wick.title}</span>
              <span className="text-[10px] text-[#8C7A6B]">{wick.desc}</span>
            </button>
          ))}
        </div>
      </div>

      {/* 3. Quantity & Primary CTA Buttons */}
      <div className="space-y-4 pt-2">
        <div className="flex items-center gap-4">
          <div className="flex items-center border border-[#E5D9C5] rounded-xl bg-[#F4EFE6]">
            <button
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              className="px-3.5 py-2.5 text-[#2A1E17] font-bold hover:bg-[#E5D9C5] transition-colors rounded-l-xl cursor-pointer"
            >
              -
            </button>
            <span className="px-4 py-2.5 font-bold text-[#2A1E17] text-sm font-mono min-w-[40px] text-center">
              {quantity}
            </span>
            <button
              onClick={() => setQuantity(quantity + 1)}
              className="px-3.5 py-2.5 text-[#2A1E17] font-bold hover:bg-[#E5D9C5] transition-colors rounded-r-xl cursor-pointer"
            >
              +
            </button>
          </div>

          <Button
            variant="gold"
            size="lg"
            className="flex-1 text-sm font-bold shadow-md bg-[#B88B38] hover:bg-[#9E752C] text-white py-3.5 rounded-xl"
            onClick={() => onAddToCart(selectedSizeLabel, selectedWick, quantity)}
          >
            Add to Shopping Bag — ₹{(currentPrice * quantity).toLocaleString('en-IN')}.00
          </Button>

          <button
            onClick={() => {
              setIsWishlisted(!isWishlisted);
              toast({
                type: isWishlisted ? 'info' : 'luxury',
                title: isWishlisted ? 'Removed from Wishlist' : 'Saved to Wishlist',
              });
            }}
            className={`p-3.5 rounded-xl border border-[#E5D9C5] transition-colors cursor-pointer ${
              isWishlisted ? 'bg-[#B33A3A] text-white' : 'bg-[#F4EFE6] text-[#2A1E17] hover:bg-[#E5D9C5]'
            }`}
          >
            <HeartIcon size={20} />
          </button>
        </div>

        <Button
          variant="primary"
          size="lg"
          fullWidth
          className="bg-[#2A1E17] hover:bg-[#1C130E] text-[#FAF6F0] py-3.5 rounded-xl font-bold"
          onClick={() => onBuyNow(selectedSizeLabel, selectedWick, quantity)}
        >
          Buy Now with Instant Express Checkout →
        </Button>
      </div>

      {/* Trust Micro Features */}
      <div className="pt-4 border-t border-[#E5D9C5] grid grid-cols-3 gap-2 text-center text-[11px] text-[#69574A]">
        <div>🚚 Free Express Shipping</div>
        <div>🌿 100% Organic Soy Wax</div>
        <div>✨ Gold Packaging Included</div>
      </div>
    </div>
  );
};
