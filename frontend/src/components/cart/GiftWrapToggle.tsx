import { Checkbox, Badge, SparklesIcon } from '../../design-system';

export interface GiftWrapToggleProps {
  isGiftWrapSelected: boolean;
  onToggleGiftWrap: (selected: boolean) => void;
  giftMessage: string;
  onGiftMessageChange: (message: string) => void;
}

export const GiftWrapToggle: React.FC<GiftWrapToggleProps> = ({
  isGiftWrapSelected,
  onToggleGiftWrap,
  giftMessage,
  onGiftMessageChange,
}) => {
  return (
    <div className="p-4 bg-[#FFF6F8] border border-[#F9B8CA]/60 rounded-2xl space-y-3 font-sans shadow-xs">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Badge variant="pink" icon={<SparklesIcon size={12} />}>COMPLIMENTARY LUXURY</Badge>
          <span className="text-xs font-serif font-bold text-[#1C1217]">Blush Rose Gift Box & Ribbon</span>
        </div>
        <span className="text-xs font-bold text-[#15803D]">₹0.00 (FREE)</span>
      </div>

      <Checkbox
        label={
          <span className="text-xs font-semibold text-[#1C1217]">
            Add complimentary blush gift packaging & wax seal
          </span>
        }
        checked={isGiftWrapSelected}
        onChange={(e) => onToggleGiftWrap(e.target.checked)}
      />

      {isGiftWrapSelected && (
        <div className="pt-2 space-y-2 animate-fade-in">
          <label className="text-[11px] uppercase font-bold text-[#886C7B] block">
            Personalized Gift Card Note (Optional):
          </label>
          <textarea
            value={giftMessage}
            onChange={(e) => onGiftMessageChange(e.target.value)}
            placeholder="Type your warm gift message here..."
            rows={2}
            className="w-full text-xs p-3 bg-[#FFFFFF] border border-[#F5E8EE] rounded-xl font-sans outline-none focus:border-[#E87A96] focus:ring-2 focus:ring-[#F9B8CA]/40 text-[#1C1217]"
          />
        </div>
      )}
    </div>
  );
};
