import React, { useState } from 'react';
import { useToast } from '../../design-system';

export interface ProductShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: {
    id: string;
    name: string;
    price?: number | string;
    originalPrice?: number | string;
    image?: string;
    imageUrl?: string;
    category?: string;
    tagline?: string;
    slug?: string;
  };
}

export const ProductShareModal: React.FC<ProductShareModalProps> = ({
  isOpen,
  onClose,
  product,
}) => {
  const { toast } = useToast();
  const [copied, setCopied] = useState<boolean>(false);

  if (!isOpen) return null;

  // Build canonical share URL
  const baseUrl = window.location.origin;
  const productIdentifier = product.slug || product.id;
  const shareUrl = `${baseUrl}/#pdp?id=${encodeURIComponent(productIdentifier)}`;

  const productName = product.name;
  const productPrice = product.price ? `₹${Number(product.price).toLocaleString('en-IN')}` : '';
  const shareTitle = `${productName} — The Candle Lab`;
  const shareText = `Check out this artisanal handcrafted luxury candle: "${productName}" ${productPrice ? `for ${productPrice}` : ''} at The Candle Lab! ✨`;

  const productImage = product.image || product.imageUrl || 'https://images.unsplash.com/photo-1603006905003-be475563bc59?auto=format&fit=crop&w=600&q=80';

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      toast({
        type: 'success',
        title: 'Link Copied! 📋',
        description: 'Product link has been copied to your clipboard.',
      });
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // Fallback
      const input = document.createElement('input');
      input.value = shareUrl;
      document.body.appendChild(input);
      input.select();
      document.execCommand('copy');
      document.body.removeChild(input);
      setCopied(true);
      toast({
        type: 'success',
        title: 'Link Copied! 📋',
        description: 'Product link copied to clipboard.',
      });
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const handleWhatsAppShare = () => {
    const waUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(`${shareText} \n${shareUrl}`)}`;
    window.open(waUrl, '_blank', 'noopener,noreferrer');
  };

  const handleFacebookShare = () => {
    const fbUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`;
    window.open(fbUrl, '_blank', 'noopener,noreferrer');
  };

  const handleTwitterShare = () => {
    const twUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`;
    window.open(twUrl, '_blank', 'noopener,noreferrer');
  };

  const handleEmailShare = () => {
    const mailto = `mailto:?subject=${encodeURIComponent(shareTitle)}&body=${encodeURIComponent(`${shareText}\n\nExplore here: ${shareUrl}`)}`;
    window.location.href = mailto;
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: shareTitle,
          text: shareText,
          url: shareUrl,
        });
      } catch (err) {
        // User cancelled or not supported
      }
    } else {
      handleCopyLink();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn font-sans">
      <div
        className="fixed inset-0"
        onClick={onClose}
        aria-hidden="true"
      />

      <div className="relative w-full max-w-md bg-[#FFFFFF] rounded-3xl shadow-2xl border border-[#EADDCB] overflow-hidden z-10 transition-all transform animate-scaleUp">
        {/* Header (Flipkart / Amazon Style) */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#EADDCB] bg-[#FAF8F5]">
          <div className="flex items-center gap-2">
            <span className="w-8 h-8 rounded-full bg-[#8B6F4E]/10 text-[#8B6F4E] flex items-center justify-center text-sm font-bold">
              🔗
            </span>
            <div>
              <h3 className="font-serif font-bold text-base text-[#232323]">Share Product</h3>
              <p className="text-[11px] text-[#7D6F63]">Share with friends and family</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-500 hover:text-stone-800 flex items-center justify-center text-sm transition-colors cursor-pointer"
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        {/* Product Snapshot Card */}
        <div className="p-5 space-y-5">
          <div className="flex items-center gap-3.5 p-3 rounded-2xl bg-[#F8F6F0] border border-[#EADDCB]">
            <img
              src={productImage}
              alt={productName}
              className="w-16 h-16 rounded-xl object-cover border border-[#EADDCB] shrink-0"
            />
            <div className="min-w-0 flex-1">
              <span className="text-[10px] font-mono uppercase tracking-wider text-[#8B6F4E] font-bold block truncate">
                {product.category || 'Luxury Candle'}
              </span>
              <h4 className="font-serif font-bold text-sm text-[#232323] truncate">{productName}</h4>
              <div className="flex items-baseline gap-2 mt-0.5">
                <span className="font-serif font-bold text-sm text-[#232323]">{productPrice}</span>
                {product.originalPrice && Number(product.originalPrice) > Number(product.price) && (
                  <span className="text-xs text-[#7D6F63] line-through">
                    ₹{Number(product.originalPrice).toLocaleString('en-IN')}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Share Channels Grid (Amazon / Flipkart layout) */}
          <div>
            <span className="text-xs font-semibold text-[#7D6F63] uppercase tracking-wider block mb-3">
              Share via
            </span>

            <div className="grid grid-cols-4 gap-2.5">
              {/* WhatsApp */}
              <button
                type="button"
                onClick={handleWhatsAppShare}
                className="flex flex-col items-center gap-1.5 p-2.5 rounded-2xl hover:bg-[#25D366]/10 transition-all group cursor-pointer"
              >
                <div className="w-12 h-12 rounded-2xl bg-[#25D366] text-white flex items-center justify-center text-xl shadow-xs group-hover:scale-105 transition-transform">
                  💬
                </div>
                <span className="text-[11px] font-medium text-[#232323] group-hover:text-[#25D366]">
                  WhatsApp
                </span>
              </button>

              {/* Facebook */}
              <button
                type="button"
                onClick={handleFacebookShare}
                className="flex flex-col items-center gap-1.5 p-2.5 rounded-2xl hover:bg-[#1877F2]/10 transition-all group cursor-pointer"
              >
                <div className="w-12 h-12 rounded-2xl bg-[#1877F2] text-white flex items-center justify-center text-lg font-bold shadow-xs group-hover:scale-105 transition-transform">
                  f
                </div>
                <span className="text-[11px] font-medium text-[#232323] group-hover:text-[#1877F2]">
                  Facebook
                </span>
              </button>

              {/* Twitter / X */}
              <button
                type="button"
                onClick={handleTwitterShare}
                className="flex flex-col items-center gap-1.5 p-2.5 rounded-2xl hover:bg-black/10 transition-all group cursor-pointer"
              >
                <div className="w-12 h-12 rounded-2xl bg-[#000000] text-white flex items-center justify-center text-sm font-bold shadow-xs group-hover:scale-105 transition-transform">
                  𝕏
                </div>
                <span className="text-[11px] font-medium text-[#232323]">Twitter</span>
              </button>

              {/* Email */}
              <button
                type="button"
                onClick={handleEmailShare}
                className="flex flex-col items-center gap-1.5 p-2.5 rounded-2xl hover:bg-amber-500/10 transition-all group cursor-pointer"
              >
                <div className="w-12 h-12 rounded-2xl bg-[#8B6F4E] text-white flex items-center justify-center text-xl shadow-xs group-hover:scale-105 transition-transform">
                  ✉️
                </div>
                <span className="text-[11px] font-medium text-[#232323] group-hover:text-[#8B6F4E]">
                  Email
                </span>
              </button>
            </div>
          </div>

          {/* Copy Link Input Bar */}
          <div className="space-y-1.5">
            <span className="text-xs font-semibold text-[#7D6F63] uppercase tracking-wider block">
              Or Copy Link
            </span>
            <div className="flex items-center gap-2 p-1.5 bg-[#F8F6F0] rounded-xl border border-[#EADDCB]">
              <input
                type="text"
                readOnly
                value={shareUrl}
                className="flex-1 bg-transparent px-2.5 text-xs text-[#5C5149] focus:outline-hidden truncate select-all"
              />
              <button
                type="button"
                onClick={handleCopyLink}
                className={`px-4 py-2 rounded-lg text-xs font-bold transition-all shrink-0 cursor-pointer ${
                  copied
                    ? 'bg-emerald-600 text-white'
                    : 'bg-[#8B6F4E] hover:bg-[#725a3f] text-white shadow-xs active:scale-95'
                }`}
              >
                {copied ? '✓ Copied' : 'Copy'}
              </button>
            </div>
          </div>

          {/* Native OS Share Button for Mobile (Flipkart / Amazon app behavior) */}
          {typeof navigator !== 'undefined' && 'share' in navigator && (
            <button
              type="button"
              onClick={handleNativeShare}
              className="w-full py-2.5 px-4 rounded-xl border border-[#8B6F4E]/30 text-[#8B6F4E] hover:bg-[#8B6F4E]/10 font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <span>📱</span>
              <span>More Sharing Options</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
