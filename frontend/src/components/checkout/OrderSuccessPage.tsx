import React from 'react';
import { Button, Badge, SparklesIcon, useToast } from '../../design-system';

export interface OrderSuccessPageProps {
  onReturnHome?: () => void;
  orderDetails?: {
    orderNumber: string;
    email: string;
    customerName?: string;
    items: any[];
    totalAmount: number;
    isCOD: boolean;
    shippingAddress?: string;
  };
}

export const OrderSuccessPage: React.FC<OrderSuccessPageProps> = ({ onReturnHome, orderDetails }) => {
  const { toast } = useToast();
  const orderId = orderDetails?.orderNumber || '#TCL-2026-8841';
  const totalAmount = orderDetails?.totalAmount || 0;
  const isCOD = orderDetails?.isCOD ?? false;
  const items = orderDetails?.items || [];
  const customerEmail = orderDetails?.email || '';

  // Delivery estimation date range (3 days from today)
  const today = new Date();
  const deliveryStart = new Date(today);
  deliveryStart.setDate(today.getDate() + 2);
  const deliveryEnd = new Date(today);
  deliveryEnd.setDate(today.getDate() + 4);

  const formatDate = (d: Date) =>
    d.toLocaleDateString('en-IN', { month: 'short', day: 'numeric' });

  return (
    <div className="w-full bg-[#FAF6F0] min-h-screen font-sans py-12 px-6 sm:px-12">
      <div className="max-w-3xl mx-auto space-y-8 text-center">
        {/* Animated Celebration Icon */}
        <div className="w-20 h-20 bg-gradient-to-tr from-[#D4AF37] to-[#E6CA65] text-[#1C130E] rounded-full flex items-center justify-center text-4xl mx-auto shadow-goldGlow animate-bounce">
          ✨
        </div>

        <div className="space-y-3">
          <Badge variant={isCOD ? 'warning' : 'gold'} icon={<SparklesIcon size={12} />}>
            {isCOD ? 'COD ORDER PLACED • PENDING DELIVERY' : 'ONLINE PAYMENT VERIFIED & ORDER CONFIRMED'}
          </Badge>
          <h1 className="text-4xl sm:text-6xl font-serif font-extrabold text-[#2A1E17]">
            Thank You for Your Order!
          </h1>
          <p className="text-sm text-[#69574A] max-w-lg mx-auto font-light leading-relaxed">
            {isCOD
              ? 'Your COD order has been received. Please pay cash upon courier delivery.'
              : 'Your online payment has been verified. Our master artisans are preparing your hand-poured formulations.'}
          </p>
        </div>

        {/* Order Details Banner */}
        <div className="p-6 bg-[#F4EFE6] border border-[#D4AF37]/50 rounded-md space-y-4 shadow-card text-left">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-[#E5D9C5] pb-4">
            <div>
              <span className="text-xs text-[#8C7A6B] font-bold uppercase tracking-wider block">Order Confirmation Number</span>
              <span className="text-2xl font-serif font-bold text-[#2A1E17]">{orderId}</span>
              {customerEmail && <span className="text-xs text-[#8C7A6B] block mt-0.5">Confirmation sent to {customerEmail}</span>}
            </div>
            <div className="text-left sm:text-right">
              <span className="text-xs text-[#8C7A6B] font-bold uppercase tracking-wider block">Estimated Delivery</span>
              <span className="text-sm font-bold text-[#2E6F40]">{formatDate(deliveryStart)} - {formatDate(deliveryEnd)}</span>
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
            Formulations Included in Order ({items.length})
          </h3>

          <div className="space-y-3 text-xs">
            {items.length === 0 ? (
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">🕯️</span>
                  <div>
                    <strong className="text-[#2A1E17] block">Artisanal Soy Candle Formulation</strong>
                    <span className="text-[#8C7A6B]">12 oz Frosted Glass • Organic Wood Wick</span>
                  </div>
                </div>
                <span className="font-bold text-[#2A1E17]">₹{totalAmount.toLocaleString('en-IN')}</span>
              </div>
            ) : (
              items.map((item, idx) => (
                <div key={item.id || idx} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">🕯️</span>
                    <div>
                      <strong className="text-[#2A1E17] block">{item.quantity}x {item.name}</strong>
                      <span className="text-[#8C7A6B]">{item.size || '12 oz Glass'} • {item.wick || 'Organic Wood Wick'}</span>
                    </div>
                  </div>
                  <span className="font-bold text-[#2A1E17]">
                    ₹{Math.round((item.price || 0) * (item.quantity || 1)).toLocaleString('en-IN')}
                  </span>
                </div>
              ))
            )}
          </div>

          <div className="pt-3 border-t border-[#E5D9C5] flex items-center justify-between text-sm font-bold">
            <span className="text-[#2A1E17]">{isCOD ? 'Amount Due on Delivery (COD)' : 'Total Paid'}</span>
            <span className="text-xl font-serif text-[#D4AF37]">₹{totalAmount.toLocaleString('en-IN')}</span>
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
            🖨️ Print / Download Receipt
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
