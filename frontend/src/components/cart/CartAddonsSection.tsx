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
    <div className="p-6 bg-[#FFF6F8] border border-[#F5E8EE] rounded-3xl space-y-4 font-sans">
      <div className="flex items-center justify-between border-b border-[#F5E8EE] pb-3">
        <div className="flex items-center gap-2">
          <Badge variant="pink" icon={<SparklesIcon size={12} />}>ESSENTIAL ACCESSORIES</Badge>
          <h4 className="font-serif font-bold text-base text-[#1C1217]">Enhance Your Sanctuary</h4>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {addonItems.map((item) => (
          <div
            key={item.id}
            className="p-3.5 bg-[#FFFFFF] border border-[#F5E8EE] rounded-2xl space-y-2 flex flex-col justify-between hover:border-[#F9B8CA] shadow-xs transition-all"
          >
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-2xl">{item.icon}</span>
                <span className="text-xs font-bold text-[#E87A96]">₹{item.price}</span>
              </div>
              <h5 className="font-serif font-bold text-xs text-[#1C1217]">{item.name}</h5>
              <p className="text-[10px] text-[#886C7B]">{item.desc}</p>
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
