import { Button } from '../../design-system';
import type { CartItem } from './CartItemRow';


export interface SaveForLaterSectionProps {
  savedItems: CartItem[];
  onMoveToBag: (item: CartItem) => void;
  onRemoveSaved: (id: string) => void;
}

export const SaveForLaterSection: React.FC<SaveForLaterSectionProps> = ({
  savedItems,
  onMoveToBag,
  onRemoveSaved,
}) => {
  if (savedItems.length === 0) return null;

  return (
    <div className="space-y-4 pt-8 border-t border-[#E5D9C5] font-sans">
      <div className="flex items-center justify-between border-b border-[#E5D9C5] pb-3">
        <h3 className="font-serif font-bold text-lg text-[#2A1E17]">
          Saved for Later ({savedItems.length})
        </h3>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {savedItems.map((item) => (
          <div
            key={item.id}
            className="p-4 bg-[#FAF6F0] border border-[#E5D9C5] rounded-md flex items-center justify-between gap-3"
          >
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-[#2A1E17] text-xl rounded-xs flex items-center justify-center border border-[#4A3B32]">
                🕯️
              </div>
              <div className="space-y-0.5">
                <h5 className="text-xs font-bold text-[#2A1E17]">{item.name}</h5>
                <span className="text-[10px] text-[#8C7A6B] block">${item.price.toFixed(2)}</span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button variant="gold" size="sm" onClick={() => onMoveToBag(item)}>
                Move to Bag
              </Button>
              <button
                onClick={() => onRemoveSaved(item.id)}
                className="text-xs text-[#B33A3A] hover:text-red-700 p-1"
              >
                ✕
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
