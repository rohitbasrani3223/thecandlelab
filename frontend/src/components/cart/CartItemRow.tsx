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
    <div className="p-4 bg-[#FFFFFF] border border-[#F5E8EE] rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 font-sans hover:border-[#F9B8CA] shadow-xs transition-all">
      {/* Product Image & Details */}
      <div className="flex items-center gap-4 flex-1 min-w-0">
        <div className="w-16 h-16 rounded-xl bg-[#FFF6F8] border border-[#F5E8EE] shrink-0 overflow-hidden flex items-center justify-center">
          {item.image ? (
            <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
          ) : (
            <span className="text-2xl">🕯️</span>
          )}
        </div>

        <div className="space-y-1 min-w-0 flex-1">
          <h4 className="font-serif font-medium text-sm text-[#1C1217] truncate">
            {item.name}
          </h4>

          {/* Dynamic Variant Attributes Display */}
          <div className="flex items-center gap-2 text-[11px] text-[#886C7B] flex-wrap">
            {fragranceDisplay && (
              <span className="text-[#C94C6D] font-medium">
                🌸 {fragranceDisplay}
              </span>
            )}
            {sizeDisplay && (
              <>
                <span>•</span>
                <span>Size: <strong className="text-[#1C1217] font-mono">{sizeDisplay}</strong></span>
              </>
            )}
            {wickDisplay && wickDisplay !== 'N/A' && (
              <>
                <span>•</span>
                <span className="text-[#886C7B]">{wickDisplay}</span>
              </>
            )}
            {item.color && (
              <>
                <span>•</span>
                <span className="text-[#886C7B]">Color: {item.color}</span>
              </>
            )}
          </div>

          {/* Gift Packaging & Message Notes */}
          {item.giftPackaging && (
            <span className="inline-block text-[10px] font-mono text-[#C94C6D] bg-[#FDE8EF] px-2 py-0.5 rounded-full border border-[#F9B8CA]">
              🎁 Luxury Gift Box Included
            </span>
          )}

          {item.customMessage && (
            <p className="text-[10px] text-[#886C7B] italic truncate max-w-sm">
              Note: "{item.customMessage}"
            </p>
          )}
        </div>
      </div>

      {/* Quantity & Actions */}
      <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto pt-2 sm:pt-0 border-t sm:border-t-0 border-[#F5E8EE]">
        {/* Quantity Counter */}
        <div className="flex items-center border border-[#F5E8EE] rounded-full bg-[#FFF6F8]">
          <button
            type="button"
            onClick={() => onUpdateQuantity(item.id, -1)}
            className="px-3 py-1 text-xs font-bold text-[#624855] hover:text-[#1C1217]"
          >
            −
          </button>
          <span className="px-2 py-1 text-xs font-mono font-semibold text-[#1C1217]">{item.quantity}</span>
          <button
            type="button"
            onClick={() => onUpdateQuantity(item.id, 1)}
            className="px-3 py-1 text-xs font-bold text-[#624855] hover:text-[#1C1217]"
          >
            +
          </button>
        </div>

        {/* Total Price */}
        <div className="text-right">
          <span className="text-sm font-serif font-semibold text-[#1C1217] block">
            ₹{(item.price * item.quantity).toLocaleString('en-IN')}
          </span>
          <span className="text-[10px] font-mono text-[#886C7B]">
            ₹{item.price.toLocaleString('en-IN')} each
          </span>
        </div>

        {/* Save for Later & Remove Actions */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => onSaveForLater(item)}
            className="text-[10px] font-mono text-[#886C7B] hover:text-[#E87A96] bg-[#FFF6F8] px-2 py-1 rounded-full border border-[#F5E8EE]"
            title="Save for Later"
          >
            Save
          </button>
          <button
            type="button"
            onClick={() => onRemove(item.id)}
            className="text-xs text-[#BE123C] hover:text-[#9F1239] p-1.5 rounded-full hover:bg-[#FFF1F2]"
            title="Remove item"
          >
            ✕
          </button>
        </div>
      </div>
    </div>
  );
};
