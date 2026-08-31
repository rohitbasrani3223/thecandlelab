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

export interface ShippingMethodStepProps {
  selectedOptionId: string;
  subtotal?: number;
  onBack: () => void;
  onNext: (option: ShippingOption) => void;
}

export const ShippingMethodStep: React.FC<ShippingMethodStepProps> = ({
  selectedOptionId,
  subtotal = 0,
  onBack,
  onNext,
}) => {
  const isFreeEligible = subtotal >= 999;

  const dynamicShippingOptions: ShippingOption[] = isFreeEligible
    ? [
        {
          id: 'free-express',
          name: 'Complimentary Pan-India Express Shipping',
          timeframe: '2 - 3 Business Days',
          price: 0,
          description: 'Unlocked! Free Express delivery on orders above ₹999.',
          badge: 'FREE DELIVERY',
        },
        {
          id: 'vip-courier',
          name: 'VIP Priority Air Dispatch',
          timeframe: '1 - 2 Business Days',
          price: 99.0,
          description: 'Top-priority courier dispatch with wax seal gift packaging.',
          badge: 'FASTEST',
        },
      ]
    : [
        {
          id: 'standard-delivery',
          name: 'Pan-India Express Delivery',
          timeframe: '3 - 4 Business Days',
          price: 99.0,
          description: 'Insured transit in protective cushioned packaging.',
        },
        {
          id: 'priority-delivery',
          name: 'Priority Courier Handling',
          timeframe: '1 - 2 Business Days',
          price: 149.0,
          description: 'Temperature-controlled courier with fast dispatch.',
          badge: 'FASTEST',
        },
      ];

  const [selectedId, setSelectedId] = useState(
    selectedOptionId && dynamicShippingOptions.some((o) => o.id === selectedOptionId)
      ? selectedOptionId
      : dynamicShippingOptions[0].id
  );

  const currentOption = dynamicShippingOptions.find((o) => o.id === selectedId) || dynamicShippingOptions[0];

  return (
    <div className="space-y-6 font-sans">
      <div className="flex items-center justify-between border-b border-[#EADDCB] pb-4">
        <div>
          <Badge variant="pink" size="sm" icon={<SparklesIcon size={12} />}>STEP 2 OF 3</Badge>
          <h2 className="text-2xl font-serif font-bold text-[#232323] mt-1">
            Select Delivery Method
          </h2>
        </div>
      </div>

      <div className="space-y-3">
        {dynamicShippingOptions.map((opt) => (
          <div
            key={opt.id}
            onClick={() => setSelectedId(opt.id)}
            className={`p-4 bg-[#FFFFFF] rounded-2xl border text-left cursor-pointer transition-all flex items-center justify-between gap-4 ${selectedId === opt.id ? 'border-[#8B6F4E] ring-2 ring-[#EADDCB]/40 bg-[#FAF7F2] shadow-xs' : 'border-[#EADDCB] hover:bg-[#FAF7F2]'}`}
          >
            <div className="flex items-center gap-3">
              <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${selectedId === opt.id ? 'border-[#8B6F4E] bg-[#8B6F4E]' : 'border-[#A39486]'}`}>
                {selectedId === opt.id && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
              </div>

              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <h4 className="font-serif font-bold text-sm text-[#232323]">{opt.name}</h4>
                  {opt.badge && <Badge variant="pink" size="sm">{opt.badge}</Badge>}
                </div>
                <span className="text-xs font-semibold text-[#8B6F4E] block">{opt.timeframe}</span>
                <p className="text-[11px] text-[#7D6F63]">{opt.description}</p>
              </div>
            </div>

            <span className="text-sm font-bold text-[#232323] shrink-0">
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
          Continue to Payment & Pay →
        </Button>
      </div>
    </div>
  );
};
