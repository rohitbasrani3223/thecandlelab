import React from 'react';

export interface CartItem {
  id: string;
  name: string;
  size?: string;
  fragrance?: string;
  color?: string;
  wick?: string;
  wickType?: string;
  sku?: string;
  variantId?: string;
  giftPackaging?: boolean;
  customMessage?: string;
  price: number;
  originalPrice?: number;
  quantity: number;
  image?: string;
  inStock?: boolean;
}

export interface CartItemRowProps {
  item: CartItem;
  onUpdateQuantity: (id: string, delta: number) => void;
  onRemove: (id: string) => void;
  onSaveForLater: (item: CartItem) => void;
}

export const CartItemRow: React.FC<CartItemRowProps> = ({
  item,
  onUpdateQuantity,
  onRemove,
  onSaveForLater,
}) => {
  const fragranceDisplay = item.fragrance;
  const sizeDisplay = item.size;
  const wickDisplay = item.wickType || item.wick;

  return (
    <div className="p-4 bg-[#1C130E] border border-[#2C2018] rounded-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 font-sans hover:border-amber-500/30 transition-all">
      {/* Product Image & Details */}
      <div className="flex items-center gap-4 flex-1 min-w-0">
        <div className="w-16 h-16 rounded-lg bg-[#140D09] border border-[#2C2018] shrink-0 overflow-hidden flex items-center justify-center">
          {item.image ? (
            <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
          ) : (
            <span className="text-2xl">🕯️</span>
          )}
        </div>

        <div className="space-y-1 min-w-0 flex-1">
          <h4 className="font-serif font-medium text-sm text-[#FDFBF7] truncate">
            {item.name}
          </h4>

          {/* Dynamic Variant Attributes Display */}
          <div className="flex items-center gap-2 text-[11px] text-stone-400 flex-wrap">
            {fragranceDisplay && (
              <span className="text-amber-300 font-medium">
                🌸 {fragranceDisplay}
              </span>
            )}
            {sizeDisplay && (
              <>
                <span>•</span>
                <span>Size: <strong className="text-stone-300 font-mono">{sizeDisplay}</strong></span>
              </>
            )}
            {wickDisplay && wickDisplay !== 'N/A' && (
              <>
                <span>•</span>
                <span className="text-stone-400">{wickDisplay}</span>
              </>
            )}
            {item.color && (
              <>
                <span>•</span>
                <span className="text-stone-400">Color: {item.color}</span>
              </>
            )}
          </div>

          {/* Gift Packaging & Message Notes */}
          {item.giftPackaging && (
            <span className="inline-block text-[10px] font-mono text-amber-400 bg-amber-500/10 px-1.5 py-0.5 rounded border border-amber-500/20">
              🎁 Luxury Gift Box Included
            </span>
          )}

          {item.customMessage && (
            <p className="text-[10px] text-stone-500 italic truncate max-w-sm">
              Note: "{item.customMessage}"
            </p>
          )}
        </div>
      </div>

      {/* Quantity & Actions */}
      <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto pt-2 sm:pt-0 border-t sm:border-t-0 border-[#2C2018]">
        {/* Quantity Counter */}
        <div className="flex items-center border border-[#2C2018] rounded-lg bg-[#140D09]">
          <button
            type="button"
            onClick={() => onUpdateQuantity(item.id, -1)}
            className="px-2.5 py-1 text-xs font-bold text-stone-400 hover:text-stone-200"
          >
            −
          </button>
          <span className="px-3 py-1 text-xs font-mono font-semibold text-[#FDFBF7]">{item.quantity}</span>
          <button
            type="button"
            onClick={() => onUpdateQuantity(item.id, 1)}
            className="px-2.5 py-1 text-xs font-bold text-stone-400 hover:text-stone-200"
          >
            +
          </button>
        </div>

        {/* Total Price */}
        <div className="text-right">
          <span className="text-sm font-serif font-semibold text-[#FDFBF7] block">
            ₹{(item.price * item.quantity).toLocaleString('en-IN')}
          </span>
          <span className="text-[10px] font-mono text-stone-500">
            ₹{item.price.toLocaleString('en-IN')} each
          </span>
        </div>

        {/* Save for Later & Remove Actions */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => onSaveForLater(item)}
            className="text-[10px] font-mono text-stone-400 hover:text-amber-400"
            title="Save for Later"
          >
            Save
          </button>
          <button
            type="button"
            onClick={() => onRemove(item.id)}
            className="text-xs text-red-400 hover:text-red-300 p-1"
            title="Remove item"
          >
            ✕
          </button>
        </div>
      </div>
    </div>
  );
};
