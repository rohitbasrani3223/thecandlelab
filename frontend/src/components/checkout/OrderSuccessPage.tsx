import React from 'react';
import { Button, Badge, SparklesIcon, useToast } from '../../design-system';

export interface OrderSuccessPageProps {
  onReturnHome?: () => void;
}

export const OrderSuccessPage: React.FC<OrderSuccessPageProps> = ({ onReturnHome }) => {
  const { toast } = useToast();
  const orderId = '#TCL-2026-8841';

  return (
    <div className="w-full bg-[#FAF6F0] min-h-screen font-sans py-12 px-6 sm:px-12">
      <div className="max-w-3xl mx-auto space-y-8 text-center">
        {/* Animated Celebration Icon */}
        <div className="w-20 h-20 bg-gradient-to-tr from-[#D4AF37] to-[#E6CA65] text-[#1C130E] rounded-full flex items-center justify-center text-4xl mx-auto shadow-goldGlow animate-bounce">
          ✨
        </div>

        <div className="space-y-3">
          <Badge variant="gold" icon={<SparklesIcon size={12} />}>ORDER CONFIRMED & FORMULATING</Badge>
          <h1 className="text-4xl sm:text-6xl font-serif font-extrabold text-[#2A1E17]">
            Thank You for Your Order!
          </h1>
          <p className="text-sm text-[#69574A] max-w-lg mx-auto font-light leading-relaxed">
            Your luxury candle order has been received. Our master artisans are preparing your hand-poured soy formulations in our studio.
          </p>
        </div>

        {/* Order Details Banner */}
        <div className="p-6 bg-[#F4EFE6] border border-[#D4AF37]/50 rounded-md space-y-4 shadow-card text-left">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-[#E5D9C5] pb-4">
            <div>
              <span className="text-xs text-[#8C7A6B] font-bold uppercase tracking-wider block">Order Confirmation Number</span>
              <span className="text-2xl font-serif font-bold text-[#2A1E17]">{orderId}</span>
            </div>
            <div className="text-left sm:text-right">
              <span className="text-xs text-[#8C7A6B] font-bold uppercase tracking-wider block">Estimated Delivery</span>
              <span className="text-sm font-bold text-[#2E6F40]">August 1 - August 3, 2026</span>
            </div>
          </div>

          {/* Delivery Timeline Tracker */}
          <div className="space-y-2 pt-2">
            <span className="text-xs font-bold uppercase tracking-wider text-[#8C7A6B] block">Order Status Timeline</span>
            <div className="grid grid-cols-4 gap-2 text-center text-[10px] font-bold">
              <div className="p-2 bg-[#2A1E17] text-[#FAF6F0] rounded-xs">
                1. Order Placed ✓
              </div>
              <div className="p-2 bg-[#D4AF37] text-[#1C130E] rounded-xs animate-pulse">
                2. Hand-Pouring
              </div>
              <div className="p-2 bg-[#FAF6F0] border border-[#E5D9C5] text-[#8C7A6B] rounded-xs">
                3. Quality Check
              </div>
              <div className="p-2 bg-[#FAF6F0] border border-[#E5D9C5] text-[#8C7A6B] rounded-xs">
                4. Shipped
              </div>
            </div>
          </div>
        </div>

        {/* Order Summary Items */}
        <div className="p-6 bg-[#FAF6F0] border border-[#E5D9C5] rounded-md text-left space-y-4">
          <h3 className="font-serif font-bold text-base text-[#2A1E17] border-b border-[#E5D9C5] pb-2">
            Formulations Included in Order
          </h3>

          <div className="space-y-3 text-xs">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-2xl">🕯️</span>
                <div>
                  <strong className="text-[#2A1E17] block">Velvet Rose & Smoked Amber</strong>
                  <span className="text-[#8C7A6B]">12 oz Frosted Glass • Organic Wood Wick</span>
                </div>
              </div>
              <span className="font-bold text-[#2A1E17]">$78.00</span>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-2xl">🕯️</span>
                <div>
                  <strong className="text-[#2A1E17] block">French Bourbon Vanilla Bean</strong>
                  <span className="text-[#8C7A6B]">16 oz 3-Wick Jar • Cotton Wick</span>
                </div>
              </div>
              <span className="font-bold text-[#2A1E17]">$94.00</span>
            </div>
          </div>

          <div className="pt-3 border-t border-[#E5D9C5] flex items-center justify-between text-sm font-bold">
            <span className="text-[#2A1E17]">Total Paid</span>
            <span className="text-xl font-serif text-[#D4AF37]">$172.00</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Button
            variant="outline"
            size="md"
            onClick={() => {
              window.print();
              toast({ type: 'info', title: 'Preparing Receipt PDF...' });
            }}
          >
            🖨️ Download Receipt PDF
          </Button>

          <Button
            variant="gold"
            size="md"
            onClick={onReturnHome}
          >
            Return to Sanctuary Home →
          </Button>
        </div>
      </div>
    </div>
  );
};
