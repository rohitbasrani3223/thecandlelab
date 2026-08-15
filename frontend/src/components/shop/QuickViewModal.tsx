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
        <div className="bg-[#FFF6F8] rounded-3xl p-4 flex flex-col items-center justify-center relative overflow-hidden h-72 md:h-full min-h-[280px] border border-[#F5E8EE]">
          <img
            src={imageSrc}
            alt={product.name}
            className="w-full h-full object-cover rounded-2xl"
          />
          <div className="absolute top-4 left-4">
            <Badge variant="pink" icon={<SparklesIcon size={12} />}>
              {product.scentProfile || product.category || 'Handcrafted'}
            </Badge>
          </div>
          <div className="absolute bottom-4 left-4 right-4 text-center text-xs font-semibold bg-white/90 backdrop-blur-md py-1.5 px-3 rounded-full text-[#1C1217] border border-[#F5E8EE] shadow-xs">
            100% Organic Soy Wax • {product.burnTime || '60+ Hours'}
          </div>
        </div>

        {/* Right Product Specifications */}
        <div className="space-y-4 flex flex-col justify-between">
          <div className="space-y-2.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-xs text-[#E8C86D] font-bold">
                <StarIcon size={14} className="fill-current text-[#E8C86D]" />
                <span>{product.rating ? Number(product.rating).toFixed(1) : '4.9'}</span>
                <span className="text-[#886C7B] font-normal">({product.reviewsCount || 18} reviews)</span>
              </div>
              <span className={`text-xs font-bold ${product.inStock !== false ? 'text-[#15803D]' : 'text-[#BE123C]'}`}>
                {product.inStock !== false ? '✓ In Stock & Ready' : 'Sold Out'}
              </span>
            </div>

            <h3 className="text-xl sm:text-2xl font-serif font-bold text-[#1C1217]">
              {product.name}
            </h3>

            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold text-[#1C1217] font-serif">
                {currency}{price.toLocaleString('en-IN')}
              </span>
              {origPrice && (
                <span className="text-xs text-[#886C7B] line-through">
                  {currency}{origPrice.toLocaleString('en-IN')}
                </span>
              )}
            </div>

            <p className="text-xs text-[#624855] leading-relaxed line-clamp-3">
              {product.longDescription || product.vesselDescription || 'Hand-poured candle crafted with natural soy wax, custom essential oil notes, and organic dual crackling wood wicks.'}
            </p>

            {/* Aromatic Profile Notes */}
            <div className="p-3 bg-[#FFF6F8] rounded-2xl border border-[#F5E8EE] space-y-1 text-xs">
              <span className="font-bold text-[#E87A96] block uppercase text-[10px]">Aromatic Profile:</span>
              <p className="text-[#624855] italic">
                Top: {product.topNotes || 'Bergamot'} • Heart: {product.heartNotes || 'Rose'} • Base: {product.baseNotes || 'Amber'}
              </p>
            </div>
          </div>

          {/* Bottom Actions */}
          <div className="space-y-3 pt-3 border-t border-[#F5E8EE]">
            <div className="flex items-center gap-3">
              {/* Stepper */}
              <div className="flex items-center border border-[#F5E8EE] bg-[#FFF6F8] rounded-full overflow-hidden">
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="px-3 py-1 text-xs font-bold text-[#1C1217] hover:text-[#E87A96]"
                >
                  -
                </button>
                <span className="px-2 py-1 text-xs font-mono font-bold">{quantity}</span>
                <button
                  type="button"
                  onClick={() => setQuantity((q) => q + 1)}
                  className="px-3 py-1 text-xs font-bold text-[#1C1217] hover:text-[#E87A96]"
                >
                  +
                </button>
              </div>

              <Button
                variant="pink"
                size="md"
                className="flex-1"
                onClick={handleAddToCart}
              >
                Add to Bag • {currency}{(price * quantity).toLocaleString('en-IN')}
              </Button>

              <button
                type="button"
                onClick={() => onToggleWishlist(product.id, product.name)}
                className={`p-2.5 rounded-full border border-[#F5E8EE] transition-colors ${isWishlisted ? 'bg-[#BE123C] text-white' : 'bg-[#FFF6F8] text-[#886C7B] hover:text-[#E87A96]'}`}
              >
                <HeartIcon size={16} className={isWishlisted ? 'fill-current' : ''} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
};
