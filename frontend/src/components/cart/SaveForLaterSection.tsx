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
    <div className="space-y-4 pt-8 border-t border-[#F5E8EE] font-sans">
      <div className="flex items-center justify-between border-b border-[#F5E8EE] pb-3">
        <h3 className="font-serif font-bold text-lg text-[#1C1217]">
          Saved for Later ({savedItems.length})
        </h3>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {savedItems.map((item) => (
          <div
            key={item.id}
            className="p-4 bg-[#FFFFFF] border border-[#F5E8EE] rounded-2xl flex items-center justify-between gap-3 shadow-xs"
          >
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-[#FFF6F8] text-xl rounded-xl flex items-center justify-center border border-[#F5E8EE]">
                🕯️
              </div>
              <div className="space-y-0.5">
                <h5 className="text-xs font-bold text-[#1C1217]">{item.name}</h5>
                <span className="text-[10px] text-[#886C7B] block">₹{Math.round(item.price)}</span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button variant="pink" size="sm" onClick={() => onMoveToBag(item)}>
                Move to Bag
              </Button>
              <button
                onClick={() => onRemoveSaved(item.id)}
                className="text-xs text-[#BE123C] hover:text-[#9F1239] p-1.5 rounded-full hover:bg-[#FFF1F2]"
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
