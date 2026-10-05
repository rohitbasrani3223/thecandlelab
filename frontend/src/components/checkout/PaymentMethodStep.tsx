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
  totalAmount?: number;
}

export const PaymentMethodStep: React.FC<PaymentMethodStepProps> = ({
  initialData,
  onBack,
  onNext,
  totalAmount,
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
      <div className="flex items-center justify-between border-b border-[#EADDCB] pb-4">
        <div>
          <Badge variant="pink" size="sm" icon={<SparklesIcon size={12} />}>STEP 3 OF 3</Badge>
          <h2 className="text-2xl font-serif font-bold text-[#232323] mt-1">
            Select Payment Method (India)
          </h2>
          <p className="text-xs text-[#7D6F63] mt-0.5">Choose your preferred Indian payment option.</p>
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
            title: 'Cash on Delivery (COD)',
            subtitle: 'Pay at Doorstep',
            icon: '💵',
            badge: 'COD AVAILABLE',
          },
        ].map((tab) => {
          const isSelected = paymentData.method === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setPaymentData({ ...paymentData, method: tab.id as any })}
              className={`p-4 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between space-y-3 relative ${
                isSelected
                  ? 'border-[#8B6F4E] bg-[#FAF7F2] ring-2 ring-[#8B6F4E]/40 shadow-card'
                  : 'border-[#EADDCB] bg-[#FFFFFF] hover:bg-[#FAF7F2]'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className={`w-4 h-4 rounded-full border flex items-center justify-center ${isSelected ? 'border-[#8B6F4E] bg-[#8B6F4E]' : 'border-[#C2B29F] bg-white'}`}>
                    {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-white block" />}
                  </span>
                  <span className="text-2xl">{tab.icon}</span>
                </div>
                <span className={`text-[9px] font-bold uppercase px-2.5 py-0.5 rounded-full border ${
                  isSelected && tab.id === 'cod'
                    ? 'bg-amber-100 text-amber-900 border-amber-300'
                    : 'bg-[#FDE8EF] text-[#C94C6D] border-[#EADDCB]'
                }`}>
                  {tab.badge}
                </span>
              </div>
              <div>
                <span className="text-sm font-bold text-[#232323] block leading-snug">{tab.title}</span>
                <span className="text-[11px] text-[#7D6F63] block mt-0.5">{tab.subtitle}</span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Razorpay Online Checkout Banner */}
      {paymentData.method === 'razorpay' && (
        <div className="p-5 bg-[#FFFFFF] border border-[#EADDCB] rounded-2xl space-y-3 animate-fade-in shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase font-bold text-[#232323]">Razorpay Payment Gateway</span>
            <span className="text-xs text-[#15803D] font-bold">✓ 256-bit SSL Encrypted</span>
          </div>

          <p className="text-xs text-[#5C5149] leading-relaxed">
            Pay securely using any Indian payment mode: <strong>UPI (GPay, PhonePe, Paytm, BHIM, Cred)</strong>, <strong>RuPay / Visa / Mastercard</strong>, or <strong>50+ Indian Net Banking</strong> options.
          </p>

          <div className="flex items-center gap-2 pt-2 border-t border-[#EADDCB] text-[11px] text-[#7D6F63] font-medium">
            <span>Supported Apps:</span>
            <span className="bg-[#FAF7F2] px-2.5 py-1 rounded-full border border-[#EADDCB] font-bold text-[#232323]">Google Pay</span>
            <span className="bg-[#FAF7F2] px-2.5 py-1 rounded-full border border-[#EADDCB] font-bold text-[#232323]">PhonePe</span>
            <span className="bg-[#FAF7F2] px-2.5 py-1 rounded-full border border-[#EADDCB] font-bold text-[#232323]">Paytm</span>
            <span className="bg-[#FAF7F2] px-2.5 py-1 rounded-full border border-[#EADDCB] font-bold text-[#232323]">RuPay</span>
          </div>
        </div>
      )}

      {/* UPI Direct Banner */}
      {paymentData.method === 'upi' && (
        <div className="p-5 bg-[#FFFFFF] border border-[#EADDCB] rounded-2xl space-y-4 animate-fade-in shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase font-bold text-[#232323]">Direct UPI Instant Payment</span>
            <span className="text-xs text-[#8B6F4E] font-bold">📱 Zero Transaction Fee</span>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#232323] mb-1.5">Enter VPA / UPI ID (Optional)</label>
            <input
              type="text"
              value={paymentData.upiId || ''}
              onChange={(e) => setPaymentData({ ...paymentData, upiId: e.target.value })}
              placeholder="e.g. mobileNumber@upi / username@okaxis"
              className="w-full px-3 py-2 bg-[#FAF7F2] border border-[#EADDCB] rounded-xl text-xs font-mono text-[#232323] outline-none focus:border-[#8B6F4E] focus:ring-2 focus:ring-[#EADDCB]/40"
            />
            <p className="text-[10px] text-[#7D6F63] mt-1">You will receive a payment request directly in your UPI app on click.</p>
          </div>
        </div>
      )}

      {/* Cash on Delivery Banner */}
      {paymentData.method === 'cod' && (
        <div className="p-5 bg-[#FFFBF5] border-2 border-amber-600/40 rounded-2xl space-y-3 animate-fade-in shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase font-bold text-amber-950 flex items-center gap-1.5">
              <span>💵</span>
              <span>Cash on Delivery (COD) Selected</span>
            </span>
            <span className="text-xs text-[#15803D] font-bold">✓ No Advance Payment</span>
          </div>

          <p className="text-xs text-[#5C5149] leading-relaxed">
            Your order will be confirmed immediately. Pay with cash or scan the courier delivery agent's UPI QR code when your candle shipment arrives at your doorstep.
          </p>

          <div className="text-[11px] text-amber-800 bg-amber-50 p-2.5 rounded-xl border border-amber-200/60 font-medium">
            💡 <strong>Note:</strong> Razorpay payment gateway will <strong>not</strong> open for this COD order.
          </div>
        </div>
      )}

      <Checkbox
        label={<span className="text-xs text-[#232323]">Billing address is the same as shipping address</span>}
        checked={paymentData.sameBilling}
        onChange={(e) => setPaymentData({ ...paymentData, sameBilling: e.target.checked })}
      />

      <div className="space-y-2 pt-4">
        <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center gap-4">
          <Button type="button" variant="outline" size="lg" onClick={onBack} className="w-full sm:w-auto">
            ← Back to Delivery
          </Button>
          <Button
            type="submit"
            variant="pink"
            size="lg"
            fullWidth
            className={paymentData.method === 'cod' ? 'bg-[#8B6F4E] hover:bg-[#745A3D]' : ''}
          >
            {paymentData.method === 'cod'
              ? `💵 Place Cash on Delivery Order${totalAmount ? ` (₹${totalAmount.toLocaleString('en-IN')})` : ''} →`
              : paymentData.method === 'upi'
              ? `📱 Proceed with UPI${totalAmount ? ` (₹${totalAmount.toLocaleString('en-IN')})` : ''} →`
              : `⚡ Pay Securely with Razorpay${totalAmount ? ` (₹${totalAmount.toLocaleString('en-IN')})` : ''} →`}
          </Button>
        </div>

        {paymentData.method === 'cod' && (
          <p className="text-center text-[11px] text-stone-500 font-medium">
            🔒 By clicking above, your order will be placed with Cash on Delivery without opening Razorpay.
          </p>
        )}
      </div>
    </form>
  );
};
