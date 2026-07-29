import React, { useState } from 'react';
import { Input, Button, Checkbox, Badge, SparklesIcon } from '../../design-system';

export interface PaymentData {
  method: 'card' | 'applepay' | 'klarna';
  cardNumber: string;
  cardExpiry: string;
  cardCvv: string;
  cardName: string;
  sameBilling: boolean;
}

export interface PaymentMethodStepProps {
  initialData: PaymentData;
  onBack: () => void;
  onNext: (data: PaymentData) => void;
}

export const PaymentMethodStep: React.FC<PaymentMethodStepProps> = ({
  initialData,
  onBack,
  onNext,
}) => {
  const [paymentData, setPaymentData] = useState<PaymentData>(initialData);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onNext(paymentData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 font-sans">
      <div className="flex items-center justify-between border-b border-[#E5D9C5] pb-4">
        <div>
          <Badge variant="gold" icon={<SparklesIcon size={12} />}>STEP 3 OF 4</Badge>
          <h2 className="text-2xl font-serif font-bold text-[#2A1E17] mt-1">
            Select Payment Method
          </h2>
        </div>
      </div>

      {/* Payment Tabs */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { id: 'card', title: 'Credit Card', icon: '💳' },
          { id: 'applepay', title: 'Apple Pay', icon: '🍏' },
          { id: 'klarna', title: 'Klarna Pay', icon: '🛍️' },
        ].map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setPaymentData({ ...paymentData, method: tab.id as any })}
            className={`p-3 rounded-md border text-center transition-all ${paymentData.method === tab.id ? 'border-[#D4AF37] bg-[#FAF6F0] ring-2 ring-[#D4AF37]/40 shadow-xs' : 'border-[#E5D9C5] bg-[#F4EFE6] hover:bg-[#FAF6F0]'}`}
          >
            <span className="text-xl block mb-1">{tab.icon}</span>
            <span className="text-xs font-bold text-[#2A1E17]">{tab.title}</span>
          </button>
        ))}
      </div>

      {/* Payment Tab Content */}
      {paymentData.method === 'card' && (
        <div className="p-5 bg-[#FAF6F0] border border-[#E5D9C5] rounded-md space-y-4 animate-fade-in">
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase font-bold text-[#8C7A6B]">Encrypted Card Details</span>
            <span className="text-xs text-[#2A1E17] font-semibold">💳 Visa • Mastercard • AMEX</span>
          </div>

          <Input
            label="Name on Card"
            required
            value={paymentData.cardName}
            onChange={(e) => setPaymentData({ ...paymentData, cardName: e.target.value })}
            placeholder="Clara Hemsworth"
          />

          <Input
            label="Card Number"
            required
            value={paymentData.cardNumber}
            onChange={(e) => setPaymentData({ ...paymentData, cardNumber: e.target.value })}
            placeholder="4242 •••• •••• 4242"
          />

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Expiry Date (MM/YY)"
              required
              value={paymentData.cardExpiry}
              onChange={(e) => setPaymentData({ ...paymentData, cardExpiry: e.target.value })}
              placeholder="08 / 28"
            />
            <Input
              label="CVV / CVC"
              required
              value={paymentData.cardCvv}
              onChange={(e) => setPaymentData({ ...paymentData, cardCvv: e.target.value })}
              placeholder="123"
            />
          </div>
        </div>
      )}

      {paymentData.method === 'applepay' && (
        <div className="p-8 bg-[#FAF6F0] border border-[#E5D9C5] rounded-md text-center space-y-4 animate-fade-in">
          <div className="text-4xl">🍏</div>
          <h4 className="font-serif font-bold text-lg text-[#2A1E17]">Apple Pay Instant Checkout</h4>
          <p className="text-xs text-[#8C7A6B] max-w-sm mx-auto">
            Click below to authorize instant payment with Touch ID or Face ID.
          </p>
        </div>
      )}

      {paymentData.method === 'klarna' && (
        <div className="p-8 bg-[#FAF6F0] border border-[#E5D9C5] rounded-md text-center space-y-4 animate-fade-in">
          <div className="text-4xl">🛍️</div>
          <h4 className="font-serif font-bold text-lg text-[#2A1E17]">Klarna 4 Interest-Free Payments</h4>
          <p className="text-xs text-[#8C7A6B] max-w-sm mx-auto">
            Pay 4 easy installments of <strong className="text-[#D4AF37]">$43.00</strong> every 2 weeks. No interest or fees.
          </p>
        </div>
      )}

      <Checkbox
        label={<span className="text-xs text-[#2A1E17]">Billing address is the same as shipping address</span>}
        checked={paymentData.sameBilling}
        onChange={(e) => setPaymentData({ ...paymentData, sameBilling: e.target.checked })}
      />

      <div className="flex items-center gap-4 pt-4">
        <Button type="button" variant="outline" size="lg" onClick={onBack}>
          ← Back to Delivery
        </Button>
        <Button type="submit" variant="gold" size="lg" fullWidth>
          Continue to Final Review →
        </Button>
      </div>
    </form>
  );
};
