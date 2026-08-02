import React from 'react';
import { Button, Badge, SparklesIcon, useToast } from '../../design-system';

const addonItems = [
  { id: 'add-1', name: 'Rosewood Wick Trimmer', price: 499, desc: 'Extends candle burn memory', icon: '✂️' },
  { id: 'add-2', name: 'Solid Brass Candle Snuffer', price: 699, desc: 'Smokeless flame extinguishing', icon: '🔔' },
  { id: 'add-3', name: 'Artisan Apothecary Matchbox', price: 249, desc: 'Extra-long 4-inch wooden matches', icon: '🧹' },
];

export interface CartAddonsSectionProps {
  onAddAddon: (name: string, price: number) => void;
}

export const CartAddonsSection: React.FC<CartAddonsSectionProps> = ({ onAddAddon }) => {
  const { toast } = useToast();

  return (
    <div className="p-6 bg-[#F4EFE6] border border-[#E5D9C5] rounded-md space-y-4 font-sans">
      <div className="flex items-center justify-between border-b border-[#E5D9C5] pb-3">
        <div className="flex items-center gap-2">
          <Badge variant="gold" icon={<SparklesIcon size={12} />}>ESSENTIAL ACCESSORIES</Badge>
          <h4 className="font-serif font-bold text-base text-[#2A1E17]">Enhance Your Sanctuary</h4>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {addonItems.map((item) => (
          <div
            key={item.id}
            className="p-3.5 bg-[#FAF6F0] border border-[#E5D9C5] rounded-md space-y-2 flex flex-col justify-between hover:border-[#D4AF37] transition-all"
          >
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-2xl">{item.icon}</span>
                <span className="text-xs font-bold text-[#D4AF37]">₹{item.price}</span>
              </div>
              <h5 className="font-serif font-bold text-xs text-[#2A1E17]">{item.name}</h5>
              <p className="text-[10px] text-[#8C7A6B]">{item.desc}</p>
            </div>

            <Button
              variant="outline"
              size="sm"
              fullWidth
              onClick={() => {
                onAddAddon(item.name, item.price);
                toast({ type: 'luxury', title: 'Add-on Added to Bag', description: item.name });
              }}
            >
              + Add to Bag
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
};
