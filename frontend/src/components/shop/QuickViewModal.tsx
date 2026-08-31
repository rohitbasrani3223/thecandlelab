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
  const { settings, colors, fragrances } = useCMS();

  const [selectedFragrance, setSelectedFragrance] = useState<string>('');
  const [selectedColorId, setSelectedColorId] = useState<string>('');
  const [customColorText, setCustomColorText] = useState<string>('');

  if (!product) return null;

  const showFragrance = product.hasFragranceOption !== false && (product.hasFragranceOption ?? true);
  const showColor = product.hasColorOption !== false && (product.hasColorOption ?? false);

  const imageSrc = product.image || product.imageUrl || product.images?.[0] || 'https://images.unsplash.com/photo-1603006905003-be475563bc59?auto=format&fit=crop&w=800&q=80';
  const currency = settings.currencySymbol || '₹';
  const price = Math.round(Number(product.price) || 0);
  const origPrice = (product.originalPrice && Number(product.originalPrice) > price) ? Math.round(Number(product.originalPrice)) : null;

  const handleAddToCart = () => {
    const chosenColor = colors.find((c) => c.id === selectedColorId);
    const finalColor = showColor
      ? (selectedColorId === 'custom'
          ? (customColorText.trim() ? `Custom: ${customColorText.trim()}` : 'Custom Color Shade')
          : (customColorText.trim() ? `${chosenColor?.name || 'Standard'} (${customColorText.trim()})` : chosenColor?.name))
      : undefined;

    addToCart({
      id: product.id,
      name: product.name,
      price: price,
      originalPrice: origPrice || price,
      image: imageSrc,
      fragrance: showFragrance ? (selectedFragrance || product.scentProfile || product.topNotes || 'Signature Blend') : undefined,
      size: product.weightGrams ? `${product.weightGrams}g` : '250g',
      color: finalColor,
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
        <div className="bg-[#FAF7F2] rounded-3xl p-4 flex flex-col items-center justify-center relative overflow-hidden h-72 md:h-full min-h-[280px] border border-[#EADDCB]">
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
          <div className="absolute bottom-4 left-4 right-4 text-center text-xs font-semibold bg-white/90 backdrop-blur-md py-1.5 px-3 rounded-full text-[#232323] border border-[#EADDCB] shadow-xs">
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
                <span className="text-[#7D6F63] font-normal">({product.reviewsCount || 18} reviews)</span>
              </div>
              <span className={`text-xs font-bold ${product.inStock !== false ? 'text-[#15803D]' : 'text-[#BE123C]'}`}>
                {product.inStock !== false ? '✓ In Stock & Ready' : 'Sold Out'}
              </span>
            </div>

            <h3 className="text-xl sm:text-2xl font-serif font-bold text-[#232323]">
              {product.name}
            </h3>

            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold text-[#232323] font-serif">
                {currency}{price.toLocaleString('en-IN')}
              </span>
              {origPrice && (
                <span className="text-xs text-[#7D6F63] line-through">
                  {currency}{origPrice.toLocaleString('en-IN')}
                </span>
              )}
            </div>

            <p className="text-xs text-[#5C5149] leading-relaxed line-clamp-3">
              {product.longDescription || product.vesselDescription || 'Hand-poured candle crafted with natural soy wax, custom essential oil notes, and organic dual crackling wood wicks.'}
            </p>

            {/* Fragrance & Color Selectors */}
            {(showFragrance || showColor) && (
              <div className="space-y-2 pt-1 border-t border-[#EADDCB]">
                {/* Fragrance Dropdown */}
                {showFragrance && fragrances.length > 0 && (
                  <div className="space-y-1">
                    <label className="block text-[10px] font-mono uppercase font-bold text-[#5C5149]">
                      Select Fragrance
                    </label>
                    <select
                      value={selectedFragrance}
                      onChange={(e) => setSelectedFragrance(e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-[#DFCFBC] rounded-xl text-xs text-[#232323] outline-none cursor-pointer"
                    >
                      <option value="">{product.scentProfile || product.topNotes || 'Signature Formulation'}</option>
                      {fragrances.map((f) => (
                        <option key={f.id} value={f.name}>
                          {f.name}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                {/* Color Dropdown + Custom Color */}
                {showColor && (
                  <div className="space-y-1">
                    <label className="block text-[10px] font-mono uppercase font-bold text-[#5C5149]">
                      Select Wax / Vessel Color
                    </label>
                    <div className="flex items-center gap-2">
                      <select
                        value={selectedColorId}
                        onChange={(e) => setSelectedColorId(e.target.value)}
                        className="w-full px-3 py-2 bg-white border border-[#DFCFBC] rounded-xl text-xs text-[#232323] outline-none cursor-pointer"
                      >
                        {colors.map((c) => (
                          <option key={c.id} value={c.id}>
                            {c.name}
                          </option>
                        ))}
                        {colors.length === 0 && <option value="standard">Natural Atelier Soy Cream</option>}
                        <option value="custom">🎨 Custom / Request Specific Shade...</option>
                      </select>
                    </div>
                    {selectedColorId === 'custom' && (
                      <input
                        type="text"
                        placeholder="Enter custom shade (e.g. Pastel Lavender, Sage Green)..."
                        value={customColorText}
                        onChange={(e) => setCustomColorText(e.target.value)}
                        className="w-full px-3 py-2 bg-[#FAF7F2] border border-[#EADDCB] rounded-xl text-xs text-[#232323] outline-none placeholder:text-[#7D6F63]"
                      />
                    )}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Bottom Actions */}
          <div className="space-y-3 pt-3 border-t border-[#EADDCB]">
            <div className="flex items-center gap-3">
              {/* Stepper */}
              <div className="flex items-center border border-[#EADDCB] bg-[#FAF7F2] rounded-full overflow-hidden">
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="px-3 py-1 text-xs font-bold text-[#232323] hover:text-[#8B6F4E]"
                >
                  -
                </button>
                <span className="px-2 py-1 text-xs font-mono font-bold">{quantity}</span>
                <button
                  type="button"
                  onClick={() => setQuantity((q) => q + 1)}
                  className="px-3 py-1 text-xs font-bold text-[#232323] hover:text-[#8B6F4E]"
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
                className={`p-2.5 rounded-full border border-[#EADDCB] transition-colors ${isWishlisted ? 'bg-[#BE123C] text-white' : 'bg-[#FAF7F2] text-[#7D6F63] hover:text-[#8B6F4E]'}`}
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
