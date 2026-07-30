import React, { useState } from 'react';
import { Button, Checkbox, Badge, SparklesIcon } from '../../design-system';

export interface PaymentData {
  method: 'razorpay' | 'upi' | 'cod';
  upiId?: string;
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
  const [paymentData, setPaymentData] = useState<PaymentData>({
    method: initialData.method || 'razorpay',
    upiId: initialData.upiId || '',
    sameBilling: initialData.sameBilling ?? true,
  });

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
            Select Payment Method (India)
          </h2>
          <p className="text-xs text-[#8C7A6B] mt-0.5">Choose your preferred Indian payment option.</p>
        </div>
      </div>

      {/* Payment Options Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          {
            id: 'razorpay',
            title: 'Razorpay Online',
            subtitle: 'UPI, Cards, NetBanking',
            icon: '⚡',
            badge: 'INSTANT & SECURE',
          },
          {
            id: 'upi',
            title: 'UPI / QR Code',
            subtitle: 'GPay, PhonePe, Paytm',
            icon: '📱',
            badge: '0% FEES',
          },
          {
            id: 'cod',
            title: 'Cash on Delivery',
            subtitle: 'Pay at Doorstep',
            icon: '💵',
            badge: 'COD AVAILABLE',
          },
        ].map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setPaymentData({ ...paymentData, method: tab.id as any })}
            className={`p-4 rounded-md border text-left transition-all cursor-pointer flex flex-col justify-between space-y-3 ${
              paymentData.method === tab.id
                ? 'border-[#D4AF37] bg-[#FAF6F0] ring-2 ring-[#D4AF37]/40 shadow-card'
                : 'border-[#E5D9C5] bg-[#F4EFE6] hover:bg-[#FAF6F0]'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-2xl">{tab.icon}</span>
              <span className="text-[9px] font-bold uppercase bg-[#D4AF37]/20 text-[#2A1E17] px-2 py-0.5 rounded-full border border-[#D4AF37]/40">
                {tab.badge}
              </span>
            </div>
            <div>
              <span className="text-sm font-bold text-[#2A1E17] block leading-snug">{tab.title}</span>
              <span className="text-[11px] text-[#8C7A6B] block mt-0.5">{tab.subtitle}</span>
            </div>
          </button>
        ))}
      </div>

      {/* Razorpay Online Checkout Banner */}
      {paymentData.method === 'razorpay' && (
        <div className="p-5 bg-[#FAF6F0] border border-[#E5D9C5] rounded-md space-y-3 animate-fade-in">
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase font-bold text-[#2A1E17]">Razorpay Payment Gateway</span>
            <span className="text-xs text-[#2E6F40] font-bold">✓ 256-bit SSL Encrypted</span>
          </div>

          <p className="text-xs text-[#69574A] leading-relaxed">
            Pay securely using any Indian payment mode: <strong>UPI (GPay, PhonePe, Paytm, BHIM, Cred)</strong>, <strong>RuPay / Visa / Mastercard</strong>, or <strong>50+ Indian Net Banking</strong> options.
          </p>

          <div className="flex items-center gap-2 pt-2 border-t border-[#E5D9C5] text-[11px] text-[#8C7A6B] font-medium">
            <span>Supported Apps:</span>
            <span className="bg-white px-2 py-1 rounded border border-[#E5D9C5] font-bold text-[#2A1E17]">Google Pay</span>
            <span className="bg-white px-2 py-1 rounded border border-[#E5D9C5] font-bold text-[#2A1E17]">PhonePe</span>
            <span className="bg-white px-2 py-1 rounded border border-[#E5D9C5] font-bold text-[#2A1E17]">Paytm</span>
            <span className="bg-white px-2 py-1 rounded border border-[#E5D9C5] font-bold text-[#2A1E17]">RuPay</span>
          </div>
        </div>
      )}

      {/* UPI Direct Banner */}
      {paymentData.method === 'upi' && (
        <div className="p-5 bg-[#FAF6F0] border border-[#E5D9C5] rounded-md space-y-4 animate-fade-in">
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase font-bold text-[#2A1E17]">Direct UPI Instant Payment</span>
            <span className="text-xs text-[#D4AF37] font-bold">📱 Zero Transaction Fee</span>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#2A1E17] mb-1.5">Enter VPA / UPI ID (Optional)</label>
            <input
              type="text"
              value={paymentData.upiId || ''}
              onChange={(e) => setPaymentData({ ...paymentData, upiId: e.target.value })}
              placeholder="e.g. mobileNumber@upi / username@okaxis"
              className="w-full px-3 py-2 bg-white border border-[#E5D9C5] rounded-xs text-xs font-mono text-[#2A1E17]"
            />
            <p className="text-[10px] text-[#8C7A6B] mt-1">You will receive a payment request directly in your UPI app on click.</p>
          </div>
        </div>
      )}

      {/* Cash on Delivery Banner */}
      {paymentData.method === 'cod' && (
        <div className="p-5 bg-[#FAF6F0] border border-[#E5D9C5] rounded-md space-y-3 animate-fade-in">
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase font-bold text-[#2A1E17]">Cash on Delivery (COD)</span>
            <span className="text-xs text-[#2E6F40] font-bold">🚚 Doorstep Verification</span>
          </div>

          <p className="text-xs text-[#69574A] leading-relaxed">
            Pay with cash or scan delivery agent UPI QR code when your candle shipment arrives at your delivery address.
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
