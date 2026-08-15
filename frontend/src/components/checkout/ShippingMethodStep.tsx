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
    price: 99.0,
    description: '100% biodegradable packaging & carbon-neutral transit.',
  },
  {
    id: 'express-gold',
    name: 'Atelier Express Courier',
    timeframe: '2 - 3 Business Days',
    price: 199.0,
    description: 'Priority courier handling with temperature-controlled shipping.',
    badge: 'FASTEST',
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
  const [selectedId, setSelectedId] = useState(selectedOptionId || 'eco-standard');

  const currentOption = shippingOptions.find((o) => o.id === selectedId) || shippingOptions[0];

  return (
    <div className="space-y-6 font-sans">
      <div className="flex items-center justify-between border-b border-[#F5E8EE] pb-4">
        <div>
          <Badge variant="pink" icon={<SparklesIcon size={12} />}>STEP 2 OF 4</Badge>
          <h2 className="text-2xl font-serif font-bold text-[#1C1217] mt-1">
            Select Delivery Method
          </h2>
        </div>
      </div>

      <div className="space-y-3">
        {shippingOptions.map((opt) => (
          <div
            key={opt.id}
            onClick={() => setSelectedId(opt.id)}
            className={`p-4 bg-[#FFFFFF] rounded-2xl border text-left cursor-pointer transition-all flex items-center justify-between gap-4 ${selectedId === opt.id ? 'border-[#E87A96] ring-2 ring-[#F9B8CA]/40 bg-[#FFF6F8] shadow-xs' : 'border-[#F5E8EE] hover:bg-[#FFF6F8]'}`}
          >
            <div className="flex items-center gap-3">
              <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${selectedId === opt.id ? 'border-[#E87A96] bg-[#E87A96]' : 'border-[#AC94A1]'}`}>
                {selectedId === opt.id && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
              </div>

              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <h4 className="font-serif font-bold text-sm text-[#1C1217]">{opt.name}</h4>
                  {opt.badge && <Badge variant="pink" size="sm">{opt.badge}</Badge>}
                </div>
                <span className="text-xs font-semibold text-[#E87A96] block">{opt.timeframe}</span>
                <p className="text-[11px] text-[#886C7B]">{opt.description}</p>
              </div>
            </div>

            <span className="text-sm font-bold text-[#1C1217] shrink-0">
              {opt.price === 0 ? <strong className="text-[#15803D]">FREE</strong> : `₹${opt.price}`}
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
          variant="pink"
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
