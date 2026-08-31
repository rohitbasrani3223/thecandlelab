import React, { useState } from 'react';
import { Button, Checkbox, Badge, SparklesIcon, useToast } from '../../design-system';

const bundleItems = [
  { id: 'b-1', name: 'Velvet Rose & Smoked Amber Candle (12 oz)', price: 1499, required: true },
  { id: 'b-2', name: 'Rosewood Wick Trimmer Tool', price: 499, required: false },
  { id: 'b-3', name: 'Solid Brass Candle Snuffer', price: 699, required: false },
];

export const FrequentlyBoughtTogether: React.FC = () => {
  const [selectedItems, setSelectedItems] = useState<string[]>(['b-1', 'b-2', 'b-3']);
  const { toast } = useToast();

  const toggleItem = (id: string) => {
    if (id === 'b-1') return; // Candle is required
    setSelectedItems((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const calculateTotal = () => {
    const rawSum = bundleItems
      .filter((item) => selectedItems.includes(item.id))
      .reduce((sum, item) => sum + item.price, 0);
    const hasDiscount = selectedItems.length === 3;
    const finalTotal = hasDiscount ? rawSum - 200 : rawSum;
    return { rawSum, finalTotal, hasDiscount };
  };

  const { rawSum, finalTotal, hasDiscount } = calculateTotal();

  const handleAddBundle = () => {
    toast({
      type: 'luxury',
      title: 'Complete Bundle Added to Bag',
      description: `${selectedItems.length} items added with ₹200 bundle savings!`,
    });
  };

  return (
    <div className="bg-[#FFFFFF] border border-[#EADDCB] rounded-3xl p-6 shadow-card space-y-6 font-sans">
      <div className="flex items-center justify-between border-b border-[#EADDCB] pb-3">
        <div className="flex items-center gap-2">
          <Badge variant="pink" icon={<SparklesIcon size={12} />}>ATELIER BUNDLE SAVINGS</Badge>
          <h3 className="font-serif font-bold text-lg text-[#232323]">Frequently Bought Together</h3>
        </div>
        {hasDiscount && (
          <Badge variant="success" size="sm">Save ₹200 Bonus</Badge>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
        {/* Bundle Items Visual Row */}
        <div className="md:col-span-8 space-y-3">
          <div className="flex items-center gap-3 overflow-x-auto pb-2">
            {bundleItems.map((item, idx) => (
              <React.Fragment key={item.id}>
                <div
                  onClick={() => toggleItem(item.id)}
                  className={`p-3 rounded-2xl border text-center transition-all cursor-pointer w-32 shrink-0 ${selectedItems.includes(item.id) ? 'border-[#8B6F4E] bg-[#FAF7F2] ring-2 ring-[#EADDCB]/40' : 'border-[#EADDCB] bg-[#FFFFFF] opacity-50'}`}
                >
                  <div className="text-3xl mb-1">{idx === 0 ? '🕯️' : idx === 1 ? '✂️' : '🔔'}</div>
                  <span className="text-[10px] font-bold text-[#232323] block truncate">{item.name}</span>
                  <span className="text-[11px] font-semibold text-[#8B6F4E]">₹{item.price}</span>
                </div>
                {idx < bundleItems.length - 1 && <span className="text-lg font-bold text-[#8B6F4E]">+</span>}
              </React.Fragment>
            ))}
          </div>

          {/* Item Checkboxes */}
          <div className="space-y-1.5 pt-1">
            {bundleItems.map((item) => (
              <div key={item.id}>
                <Checkbox
                  label={<span><strong className="text-[#232323]">{item.name}</strong> — ₹{item.price}</span>}
                  checked={selectedItems.includes(item.id)}
                  onChange={() => toggleItem(item.id)}
                  disabled={item.required}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Bundle Total & Add Button */}
        <div className="md:col-span-4 bg-[#FAF7F2] p-5 rounded-2xl border border-[#EADDCB] space-y-3 text-center md:text-right">
          <div>
            <span className="text-xs text-[#7D6F63] uppercase font-bold tracking-wider block">Bundle Price</span>
            <div className="flex items-baseline justify-center md:justify-end gap-2">
              <span className="text-2xl font-bold text-[#232323]">₹{finalTotal}</span>
              {hasDiscount && (
                <span className="text-xs text-[#7D6F63] line-through">₹{rawSum}</span>
              )}
            </div>
          </div>

          <Button
            variant="pink"
            size="md"
            fullWidth
            onClick={handleAddBundle}
          >
            Add Bundle to Bag ({selectedItems.length})
          </Button>
        </div>
      </div>
    </div>
  );
};
