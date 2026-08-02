import React from 'react';

export interface CartItem {
  id: string;
  name: string;
  size: string;
  wick: string;
  price: number;
  quantity: number;
  image?: string;
  inStock: boolean;
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
  return (
    <div className="p-4 bg-[#FAF6F0] border border-[#E5D9C5] rounded-md flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 font-sans hover:border-[#D4AF37]/50 transition-all">
      {/* Product Image & Info */}
      <div className="flex items-center gap-4 flex-1">
        <div className="w-16 h-16 rounded-sm bg-[#2A1E17] text-2xl flex items-center justify-center border border-[#4A3B32] shrink-0 overflow-hidden">
          {item.image ? (
            <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
          ) : (
            '🕯️'
          )}
        </div>

        <div className="space-y-1">
          <h4 className="font-serif font-bold text-base text-[#2A1E17]">
            {item.name}
          </h4>
          <div className="text-xs text-[#8C7A6B] space-x-2">
            <span>Size: <strong className="text-[#2A1E17]">{item.size || '12oz'}</strong></span>
            <span>•</span>
            <span>Wick: <strong className="text-[#2A1E17]">{item.wick || 'Organic Wood Wick'}</strong></span>
          </div>
          <span className="text-[11px] text-[#2E6F40] font-semibold block">
            ✓ In Stock & Ready to Ship
          </span>
        </div>
      </div>

      {/* Quantity & Actions */}
      <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto pt-2 sm:pt-0 border-t sm:border-t-0 border-[#E5D9C5]">
        {/* Quantity Counter */}
        <div className="flex items-center border border-[#E5D9C5] rounded-xs bg-[#FAF6F0]">
          <button
            onClick={() => onUpdateQuantity(item.id, -1)}
            className="px-2.5 py-1 text-xs font-bold text-[#2A1E17] hover:bg-[#E5D9C5]"
          >
            -
          </button>
          <span className="px-3 py-1 text-xs font-bold">{item.quantity}</span>
          <button
            onClick={() => onUpdateQuantity(item.id, 1)}
            className="px-2.5 py-1 text-xs font-bold text-[#2A1E17] hover:bg-[#E5D9C5]"
          >
            +
          </button>
        </div>

        {/* Total Price */}
        <div className="text-right">
          <span className="text-base font-bold text-[#2A1E17] block">
            ₹{Math.round(item.price * item.quantity).toLocaleString('en-IN')}
          </span>
          <span className="text-[10px] text-[#8C7A6B]">
            ₹{Math.round(item.price)} each
          </span>
        </div>

        {/* Save for Later & Remove Actions */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => onSaveForLater(item)}
            className="text-[11px] font-semibold text-[#8C7A6B] hover:text-[#D4AF37] underline"
            title="Save for Later"
          >
            Save
          </button>
          <button
            onClick={() => onRemove(item.id)}
            className="text-xs text-[#B33A3A] hover:text-red-700 p-1 font-bold"
            title="Remove item"
          >
            ✕
          </button>
        </div>
      </div>
    </div>
  );
};
