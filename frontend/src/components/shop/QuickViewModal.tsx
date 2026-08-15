import React, { useState } from 'react';
import { Modal, Button, Badge, StarIcon, SparklesIcon, HeartIcon, useToast } from '../../design-system';
import { useCart } from '../../context/CartContext';
import { useCMS } from '../../context/CMSContext';

export interface QuickViewModalProps {
  product: any | null;
  isOpen: boolean;
  onClose: () => void;
  isWishlisted: boolean;
  onToggleWishlist: (id: string, name: string) => void;
}

export const QuickViewModal: React.FC<QuickViewModalProps> = ({
  product,
  isOpen,
  onClose,
  isWishlisted,
  onToggleWishlist,
}) => {
  const [quantity, setQuantity] = useState(1);
  const { toast } = useToast();
  const { addToCart } = useCart();
  const { settings } = useCMS();

  if (!product) return null;

  const imageSrc = product.image || product.imageUrl || product.images?.[0] || 'https://images.unsplash.com/photo-1603006905003-be475563bc59?auto=format&fit=crop&w=800&q=80';
  const currency = settings.currencySymbol || '₹';
  const price = Math.round(Number(product.price) || 0);
  const origPrice = product.originalPrice ? Math.round(Number(product.originalPrice)) : null;

  const handleAddToCart = () => {
    addToCart({
      id: product.id,
      name: product.name,
      price: price,
      originalPrice: origPrice || price,
      image: imageSrc,
      fragrance: product.scentProfile || product.topNotes || 'Signature Blend',
      size: product.weightGrams ? `${product.weightGrams}g` : '250g',
      wickType: 'Organic Wood Wick',
      quantity,
    } as any);

    toast({
      type: 'luxury',
      title: 'Added to Shopping Bag',
      description: `${quantity}x ${product.name}`,
    });
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="xl"
      title="Atelier Scent & Product Inspector"
      subtitle={`${product.category || 'Soy Candle'} • ${product.collection || 'Signature'}`}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 font-sans">
        {/* Left Vessel Visual */}
        <div className="bg-[#180F0A] rounded-2xl p-4 flex flex-col items-center justify-center relative overflow-hidden h-72 md:h-full min-h-[280px] border border-[#2C2018]">
          <img
            src={imageSrc}
            alt={product.name}
            className="w-full h-full object-cover rounded-xl"
          />
          <div className="absolute top-4 left-4">
            <Badge variant="gold" icon={<SparklesIcon size={12} />}>
              {product.scentProfile || product.category || 'Handcrafted'}
            </Badge>
          </div>
          <div className="absolute bottom-4 left-4 right-4 text-center text-xs font-semibold bg-[#180F0A]/90 backdrop-blur-md py-1 px-3 rounded-full text-[#DEB554] border border-[#DEB554]/30">
            100% Organic Soy Wax • {product.burnTime || '60+ Hours'}
          </div>
        </div>

        {/* Right Product Specifications */}
        <div className="space-y-4 flex flex-col justify-between">
          <div className="space-y-2.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-xs text-[#DEB554] font-bold">
                <StarIcon size={14} className="fill-current text-[#DEB554]" />
                <span>{product.rating ? Number(product.rating).toFixed(1) : '4.9'}</span>
                <span className="text-[#847262] font-normal">({product.reviewsCount || 18} reviews)</span>
              </div>
              <span className={`text-xs font-bold ${product.inStock !== false ? 'text-[#2E6F40]' : 'text-[#B33A3A]'}`}>
                {product.inStock !== false ? '✓ In Stock & Ready' : 'Sold Out'}
              </span>
            </div>

            <h3 className="text-xl sm:text-2xl font-serif font-bold text-[#241812]">
              {product.name}
            </h3>

            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold text-[#241812] font-serif">
                {currency}{price.toLocaleString('en-IN')}
              </span>
              {origPrice && origPrice > price && (
                <span className="text-sm text-[#847262] line-through">
                  {currency}{origPrice.toLocaleString('en-IN')}
                </span>
              )}
            </div>

            <p className="text-xs text-[#5E4E42] leading-relaxed line-clamp-2">
              {product.vesselDescription || product.tagline || 'Hand-poured in luxury frosted glass with crackling wood wick.'}
            </p>
          </div>

          {/* Fragrance Pyramid Accord */}
          {(product.topNotes || product.scentProfile) && (
            <div className="space-y-1.5 bg-[#FAF7F2] p-3.5 rounded-xl border border-[#E5DAC7] text-xs">
              <div className="font-bold text-[#241812] uppercase tracking-wider text-[10px] text-[#C5983A]">
                🌸 Fragrance & Olfactory Notes:
              </div>
              <div className="space-y-1 text-[#5E4E42]">
                <div><strong className="text-[#241812]">Top Notes:</strong> {product.topNotes || product.scentProfile}</div>
                {product.heartNotes && <div><strong className="text-[#241812]">Heart:</strong> {product.heartNotes}</div>}
                {product.baseNotes && <div><strong className="text-[#241812]">Base:</strong> {product.baseNotes}</div>}
              </div>
            </div>
          )}

          {/* Quantity Selector & Action */}
          <div className="space-y-3 pt-2 border-t border-[#E5DAC7]">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#241812]">Quantity:</span>
              <div className="flex items-center border border-[#E5DAC7] rounded-lg bg-[#FAF7F2] overflow-hidden">
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="px-3 py-1.5 text-xs font-bold text-[#241812] hover:bg-[#E5DAC7] cursor-pointer"
                >
                  -
                </button>
                <span className="px-3 py-1.5 text-xs font-bold font-mono">{quantity}</span>
                <button
                  type="button"
                  onClick={() => setQuantity((q) => q + 1)}
                  className="px-3 py-1.5 text-xs font-bold text-[#241812] hover:bg-[#E5DAC7] cursor-pointer"
                >
                  +
                </button>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Button
                variant="gold"
                size="md"
                fullWidth
                onClick={handleAddToCart}
              >
                Add to Bag • {currency}{(price * quantity).toLocaleString('en-IN')}
              </Button>
              <button
                type="button"
                onClick={() => onToggleWishlist(product.id, product.name)}
                className={`p-3 rounded-xl border border-[#E5DAC7] transition-colors cursor-pointer ${
                  isWishlisted ? 'bg-[#BA6648] text-white' : 'bg-[#FAF7F2] text-[#241812] hover:bg-[#F5EEE4]'
                }`}
                title="Wishlist"
              >
                <HeartIcon size={18} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
};
