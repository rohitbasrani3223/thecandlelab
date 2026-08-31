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
    <div className="w-full bg-[#F8F6F0] min-h-screen font-sans py-12 px-6 sm:px-12">
      <div className="max-w-3xl mx-auto space-y-8 text-center">
        {/* Animated Celebration Icon */}
        <div className="w-20 h-20 bg-gradient-to-tr from-[#EADDCB] via-[#8B6F4E] to-[#745A3D] text-white rounded-full flex items-center justify-center text-4xl mx-auto shadow-pink-glow animate-bounce">
          ✨
        </div>

        <div className="space-y-3">
          <Badge variant={isCOD ? 'warning' : 'pink'} icon={<SparklesIcon size={12} />}>
            {isCOD ? 'COD ORDER PLACED • PENDING DELIVERY' : 'ONLINE PAYMENT VERIFIED & ORDER CONFIRMED'}
          </Badge>
          <h1 className="text-4xl sm:text-6xl font-serif font-extrabold text-[#232323]">
            Thank You for Your Order!
          </h1>
          <p className="text-sm text-[#5C5149] max-w-lg mx-auto font-light leading-relaxed">
            {isCOD
              ? 'Your COD order has been received. Please pay cash upon courier delivery.'
              : 'Your online payment has been verified. Our master artisans are preparing your hand-poured formulations.'}
          </p>
        </div>

        {/* Order Details Banner */}
        <div className="p-6 bg-[#FFFFFF] border border-[#EADDCB] rounded-3xl space-y-4 shadow-card text-left">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-[#EADDCB] pb-4">
            <div>
              <span className="text-xs text-[#7D6F63] font-bold uppercase tracking-wider block">Order Confirmation Number</span>
              <span className="text-2xl font-serif font-bold text-[#232323]">{orderId}</span>
              {customerEmail && <span className="text-xs text-[#7D6F63] block mt-0.5">Confirmation sent to {customerEmail}</span>}
            </div>
            <div className="text-left sm:text-right">
              <span className="text-xs text-[#7D6F63] font-bold uppercase tracking-wider block">Estimated Delivery</span>
              <span className="text-sm font-bold text-[#15803D]">{formatDate(deliveryStart)} - {formatDate(deliveryEnd)}</span>
            </div>
          </div>

          {/* Delivery Timeline Tracker */}
          <div className="space-y-2 pt-2">
            <span className="text-xs font-bold uppercase tracking-wider text-[#7D6F63] block">Order Status Timeline</span>
            <div className="grid grid-cols-4 gap-2 text-center text-[10px] font-bold">
              <div className="p-2 bg-[#232323] text-white rounded-xl">
                1. Order Placed ✓
              </div>
              <div className="p-2 bg-[#8B6F4E] text-white rounded-xl animate-pulse">
                2. Hand-Pouring
              </div>
              <div className="p-2 bg-[#FAF7F2] border border-[#EADDCB] text-[#7D6F63] rounded-xl">
                3. Quality Check
              </div>
              <div className="p-2 bg-[#FAF7F2] border border-[#EADDCB] text-[#7D6F63] rounded-xl">
                4. Shipped
              </div>
            </div>
          </div>
        </div>

        {/* Order Summary Items */}
        <div className="p-6 bg-[#FFFFFF] border border-[#EADDCB] rounded-3xl text-left space-y-4 shadow-card">
          <h3 className="font-serif font-bold text-base text-[#232323] border-b border-[#EADDCB] pb-2">
            Formulations Included in Order ({items.length})
          </h3>

          <div className="space-y-3 text-xs">
            {items.length === 0 ? (
              <p className="text-[#7D6F63] italic text-center py-2">Order details not available.</p>
            ) : (
              items.map((item, idx) => {
                const variantLabel = [item.fragrance, item.size, item.wickType || item.wick]
                  .filter(Boolean)
                  .join(' • ');
                return (
                  <div key={item.id || idx} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">🕯️</span>
                      <div>
                        <strong className="text-[#232323] block">{item.quantity}x {item.name}</strong>
                        {variantLabel && (
                          <span className="text-[#7D6F63]">{variantLabel}</span>
                        )}
                        {item.sku && (
                          <span className="text-[11px] font-mono text-[#8B6F4E] block">SKU: {item.sku}</span>
                        )}
                      </div>
                    </div>
                    <span className="font-bold text-[#232323]">
                      ₹{Math.round((item.price || 0) * (item.quantity || 1)).toLocaleString('en-IN')}
                    </span>
                  </div>
                );
              })
            )}
          </div>

          <div className="pt-3 border-t border-[#EADDCB] flex items-center justify-between text-sm font-bold">
            <span className="text-[#232323]">{isCOD ? 'Amount Due on Delivery (COD)' : 'Total Paid'}</span>
            <span className="text-xl font-serif text-[#8B6F4E]">₹{totalAmount.toLocaleString('en-IN')}</span>
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
            variant="pink"
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
