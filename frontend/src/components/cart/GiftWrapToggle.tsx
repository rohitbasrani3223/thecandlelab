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
    <div className="p-4 bg-[#F4EFE6] border border-[#D4AF37]/50 rounded-md space-y-3 font-sans shadow-goldGlow">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Badge variant="gold" icon={<SparklesIcon size={12} />}>COMPLIMENTARY LUXURY</Badge>
          <span className="text-xs font-serif font-bold text-[#2A1E17]">24K Gold Foil Gift Box</span>
        </div>
        <span className="text-xs font-bold text-[#2E6F40]">$0.00 (FREE)</span>
      </div>

      <Checkbox
        label={
          <span className="text-xs font-semibold text-[#2A1E17]">
            Add complimentary gold leaf gift packaging & wax seal
          </span>
        }
        checked={isGiftWrapSelected}
        onChange={(e) => onToggleGiftWrap(e.target.checked)}
      />


      {isGiftWrapSelected && (
        <div className="pt-2 space-y-2 animate-fade-in">
          <label className="text-[11px] uppercase font-bold text-[#8C7A6B] block">
            Personalized Gift Card Note (Optional):
          </label>
          <textarea
            value={giftMessage}
            onChange={(e) => onGiftMessageChange(e.target.value)}
            placeholder="Type your warm gift message here..."
            rows={2}
            className="w-full text-xs p-2.5 bg-[#FAF6F0] border border-[#E5D9C5] rounded-xs font-sans outline-none focus:border-[#D4AF37]"
          />
        </div>
      )}
    </div>
  );
};
