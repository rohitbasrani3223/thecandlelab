import { useState } from 'react';
import { Modal, Button, Badge, StarIcon, SparklesIcon, HeartIcon, useToast } from '../../design-system';

import type { ShopProduct } from './ProductListItem';


export interface QuickViewModalProps {
  product: ShopProduct | null;
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

  if (!product) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="xl"
      title="Quick Scent Inspector"
      subtitle={`${product.category} • ${product.collection}`}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 font-sans">
        {/* Left Vessel Visual */}
        <div className="bg-[#2A1E17] rounded-md p-8 flex flex-col items-center justify-center relative overflow-hidden h-72 md:h-full min-h-[260px]">
          <div className="text-7xl animate-pulse">🕯️</div>
          <div className="absolute top-3 left-3">
            <Badge variant="gold" icon={<SparklesIcon size={12} />}>{product.scentProfile}</Badge>
          </div>
          <div className="absolute bottom-3 text-center text-xs text-[#E5D9C5]">
            Hand-Poured Soy Wax • {product.burnTime}
          </div>
        </div>

        {/* Right Product Specifications */}
        <div className="space-y-4 flex flex-col justify-between">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1 text-xs text-[#D4AF37] font-bold">
                <StarIcon size={14} className="fill-current text-[#D4AF37]" />
                <span>{product.rating}</span>
                <span className="text-[#8C7A6B] font-normal">({product.reviewsCount} reviews)</span>
              </div>
              <span className={`text-xs font-bold ${product.inStock ? 'text-[#2E6F40]' : 'text-[#B33A3A]'}`}>
                {product.inStock ? '✓ In Stock' : 'Sold Out'}
              </span>
            </div>

            <h3 className="text-xl font-serif font-bold text-[#2A1E17]">
              {product.name}
            </h3>

            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold text-[#2A1E17]">${product.price.toFixed(2)}</span>
              {product.originalPrice && (
                <span className="text-xs text-[#8C7A6B] line-through">${product.originalPrice.toFixed(2)}</span>
              )}
            </div>

            <p className="text-xs text-[#8C7A6B] leading-relaxed">
              {product.vesselDescription}
            </p>
          </div>

          {/* Fragrance Pyramid */}
          <div className="space-y-2 bg-[#F4EFE6] p-3 rounded-md border border-[#E5D9C5] text-xs">
            <div className="font-bold text-[#2A1E17] uppercase tracking-wider text-[10px]">Fragrance Pyramid:</div>
            <div className="space-y-1 text-[#69574A]">
              <div><strong className="text-[#2A1E17]">Top Notes:</strong> {product.topNotes}</div>
              <div><strong className="text-[#2A1E17]">Heart Notes:</strong> {product.heartNotes}</div>
              <div><strong className="text-[#2A1E17]">Base Notes:</strong> {product.baseNotes}</div>
            </div>
          </div>

          {/* Quantity Selector & Action */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#2A1E17]">Quantity:</span>
              <div className="flex items-center border border-[#E5D9C5] rounded-xs bg-[#FAF6F0]">
                <button
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="px-3 py-1 text-xs font-bold text-[#2A1E17] hover:bg-[#E5D9C5]"
                >
                  -
                </button>
                <span className="px-3 py-1 text-xs font-bold">{quantity}</span>
                <button
                  onClick={() => setQuantity((q) => q + 1)}
                  className="px-3 py-1 text-xs font-bold text-[#2A1E17] hover:bg-[#E5D9C5]"
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
                onClick={() => {
                  toast({
                    type: 'luxury',
                    title: 'Added to Cart',
                    description: `${quantity}x ${product.name}`,
                  });
                  onClose();
                }}
              >
                Add to Cart • ${(product.price * quantity).toFixed(2)}
              </Button>
              <button
                onClick={() => onToggleWishlist(product.id, product.name)}
                className={`p-3 rounded-md border border-[#E5D9C5] transition-colors ${isWishlisted ? 'bg-[#B33A3A] text-white' : 'bg-[#FAF6F0] text-[#2A1E17] hover:bg-[#F4EFE6]'}`}
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
