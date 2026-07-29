import React, { useState } from 'react';
import { Button, Badge, SparklesIcon } from '../../design-system';

export interface ShippingOption {
  id: string;
  name: string;
  timeframe: string;
  price: number;
  description: string;
  badge?: string;
}

const shippingOptions: ShippingOption[] = [
  
  {
    id: 'eco-standard',
    name: 'Eco-Friendly Standard Delivery',
    timeframe: '4 - 5 Business Days',
    price: 8.0,
    description: '100% biodegradable packaging & carbon-neutral transit.',
  },
];

export interface ShippingMethodStepProps {
  selectedOptionId: string;
  onBack: () => void;
  onNext: (option: ShippingOption) => void;
}

export const ShippingMethodStep: React.FC<ShippingMethodStepProps> = ({
  selectedOptionId,
  onBack,
  onNext,
}) => {
  const [selectedId, setSelectedId] = useState(selectedOptionId);

  const currentOption = shippingOptions.find((o) => o.id === selectedId) || shippingOptions[0];

  return (
    <div className="space-y-6 font-sans">
      <div className="flex items-center justify-between border-b border-[#E5D9C5] pb-4">
        <div>
          <Badge variant="gold" icon={<SparklesIcon size={12} />}>STEP 2 OF 4</Badge>
          <h2 className="text-2xl font-serif font-bold text-[#2A1E17] mt-1">
            Select Delivery Method
          </h2>
        </div>
      </div>

      <div className="space-y-3">
        {shippingOptions.map((opt) => (
          <div
            key={opt.id}
            onClick={() => setSelectedId(opt.id)}
            className={`p-4 bg-[#FAF6F0] rounded-md border text-left cursor-pointer transition-all flex items-center justify-between gap-4 ${selectedId === opt.id ? 'border-[#D4AF37] ring-2 ring-[#D4AF37]/40 bg-[#F4EFE6] shadow-xs' : 'border-[#E5D9C5] hover:bg-[#F4EFE6]'}`}
          >
            <div className="flex items-center gap-3">
              <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${selectedId === opt.id ? 'border-[#D4AF37] bg-[#D4AF37]' : 'border-[#8C7A6B]'}`}>
                {selectedId === opt.id && <div className="w-1.5 h-1.5 rounded-full bg-[#1C130E]" />}
              </div>

              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <h4 className="font-serif font-bold text-sm text-[#2A1E17]">{opt.name}</h4>
                  {opt.badge && <Badge variant="gold" size="sm">{opt.badge}</Badge>}
                </div>
                <span className="text-xs font-semibold text-[#D4AF37] block">{opt.timeframe}</span>
                <p className="text-[11px] text-[#8C7A6B]">{opt.description}</p>
              </div>
            </div>

            <span className="text-sm font-bold text-[#2A1E17] shrink-0">
              {opt.price === 0 ? <strong className="text-[#2E6F40]">FREE</strong> : `$${opt.price.toFixed(2)}`}
            </span>
          </div>
        ))}
      </div>

      <div className="flex items-center gap-4 pt-4">
        <Button type="button" variant="outline" size="lg" onClick={onBack}>
          ← Back to Address
        </Button>
        <Button
          type="button"
          variant="gold"
          size="lg"
          fullWidth
          onClick={() => onNext(currentOption)}
        >
          Continue to Payment Option →
        </Button>
      </div>
    </div>
  );
};
