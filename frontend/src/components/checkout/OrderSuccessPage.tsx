import React, { useState } from 'react';
import { Button, Badge, SparklesIcon, useToast } from '../../design-system';
import { printOrderInvoice } from '../../utils/printInvoice';
import { PrintableInvoice } from '../invoice/PrintableInvoice';

export interface OrderSuccessPageProps {
  onReturnHome?: () => void;
  orderDetails?: {
    orderNumber: string;
    email: string;
    customerName?: string;
    phone?: string;
    items: any[];
    subtotal?: number;
    discount?: number;
    shippingFee?: number;
    totalAmount: number;
    isCOD: boolean;
    shippingAddress?: string;
    paymentId?: string;
    paymentMethod?: string;
    date?: string;
  };
}

export const OrderSuccessPage: React.FC<OrderSuccessPageProps> = ({ onReturnHome, orderDetails }) => {
  const { toast } = useToast();
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);

  const orderId = orderDetails?.orderNumber || '#TCL-2026-8841';
  const totalAmount = orderDetails?.totalAmount || 0;
  const isCOD = orderDetails?.isCOD ?? false;
  const items = orderDetails?.items || [];
  const customerEmail = orderDetails?.email || '';
  const customerName = orderDetails?.customerName || 'Valued Patron';
  const customerPhone = orderDetails?.phone || '';
  const shippingAddress = orderDetails?.shippingAddress || 'Sanctuary Address';

  // Delivery estimation date range (3 days from today)
  const today = new Date();
  const deliveryStart = new Date(today);
  deliveryStart.setDate(today.getDate() + 2);
  const deliveryEnd = new Date(today);
  deliveryEnd.setDate(today.getDate() + 4);

  const formatDate = (d: Date) =>
    d.toLocaleDateString('en-IN', { month: 'short', day: 'numeric' });

  const invoiceOrderData = {
    orderNumber: orderId,
    id: orderId,
    date: orderDetails?.date || new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }),
    customerName: customerName,
    customerEmail: customerEmail,
    email: customerEmail,
    customerPhone: customerPhone,
    phone: customerPhone,
    shippingAddress: shippingAddress,
    address: shippingAddress,
    items: items,
    itemsList: items,
    subtotal: orderDetails?.subtotal || Math.round(totalAmount / 1.18),
    discount: orderDetails?.discount || 0,
    shippingFee: orderDetails?.shippingFee || 0,
    tax: Math.round(totalAmount - (orderDetails?.subtotal || Math.round(totalAmount / 1.18))),
    totalAmount: totalAmount,
    paymentMethod: isCOD ? 'Cash on Delivery (COD)' : (orderDetails?.paymentMethod || 'Razorpay Online (UPI/Card)'),
    paymentId: orderDetails?.paymentId || (isCOD ? 'COD_ORDER' : `PAY_${orderId.replace(/[^A-Za-z0-9]/g, '')}`),
    status: isCOD ? 'COD_PENDING' : 'PAID',
    trackingNumber: `AWB${Date.now().toString().slice(-8)}`,
    courier: 'Express Air Courier',
  };

  return (
    <div className="w-full bg-[#F8F6F0] min-h-screen font-sans py-12 px-4 sm:px-8">
      <div className="max-w-4xl mx-auto space-y-8 text-center">
        {/* Animated Celebration Icon */}
        <div className="w-20 h-20 bg-gradient-to-tr from-[#EADDCB] via-[#8B6F4E] to-[#745A3D] text-white rounded-full flex items-center justify-center text-4xl mx-auto shadow-gold-glow animate-bounce">
          ✨
        </div>

        <div className="space-y-3">
          <Badge variant={isCOD ? 'warning' : 'pink'} icon={<SparklesIcon size={12} />}>
            {isCOD ? 'COD ORDER PLACED • PENDING DELIVERY' : 'ONLINE PAYMENT VERIFIED & ORDER CONFIRMED'}
          </Badge>
          <h1 className="text-3xl sm:text-5xl font-serif font-extrabold text-[#232323]">
            Thank You for Your Order!
          </h1>
          <p className="text-sm text-[#5C5149] max-w-lg mx-auto font-light leading-relaxed">
            {isCOD
              ? 'Your COD order has been safely placed. Please keep cash ready upon courier delivery.'
              : 'Your payment was verified. Our master artisans are hand-pouring and curing your formulations.'}
          </p>
        </div>

        {/* Order Details Header Card */}
        <div className="p-6 bg-white border border-[#EADDCB] rounded-3xl space-y-5 shadow-card text-left">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-[#EADDCB] pb-4">
            <div>
              <span className="text-[10px] text-[#7D6F63] font-bold uppercase tracking-wider block">Order Reference</span>
              <span className="text-2xl font-serif font-bold text-[#8B6F4E]">{orderId}</span>
              {customerEmail && <span className="text-xs text-[#7D6F63] block mt-0.5">Confirmation email dispatched to <strong>{customerEmail}</strong></span>}
            </div>
            <div className="text-left sm:text-right">
              <span className="text-[10px] text-[#7D6F63] font-bold uppercase tracking-wider block">Estimated Dispatch & Delivery</span>
              <span className="text-sm font-bold text-[#15803D]">{formatDate(deliveryStart)} – {formatDate(deliveryEnd)}</span>
            </div>
          </div>

          {/* Customer & Shipping Summary Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 bg-[#FAF7F2] rounded-2xl border border-[#EADDCB] text-xs">
            <div className="space-y-1">
              <span className="text-[10px] font-bold uppercase text-[#7D6F63] block">👤 Customer Details</span>
              <p className="font-bold text-[#232323] text-sm">{customerName}</p>
              <p className="text-[#5C5149]">✉️ {customerEmail}</p>
              {customerPhone && <p className="text-[#5C5149]">📞 {customerPhone}</p>}
            </div>
            <div className="space-y-1">
              <span className="text-[10px] font-bold uppercase text-[#7D6F63] block">🏠 Delivery Destination</span>
              <p className="text-[#232323] font-medium leading-relaxed">{shippingAddress}</p>
              <p className="text-[11px] text-[#7D6F63] pt-1">
                Payment: <strong className="text-[#232323]">{invoiceOrderData.paymentMethod}</strong>
              </p>
            </div>
          </div>

          {/* Delivery Timeline Tracker */}
          <div className="space-y-2 pt-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#7D6F63] block">Order Fulfillment Process</span>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-[11px] font-bold">
              <div className="p-2.5 bg-[#232323] text-white rounded-xl shadow-xs">
                1. Order Placed ✓
              </div>
              <div className="p-2.5 bg-[#8B6F4E] text-white rounded-xl animate-pulse shadow-xs">
                2. Hand-Pouring
              </div>
              <div className="p-2.5 bg-[#FAF7F2] border border-[#EADDCB] text-[#7D6F63] rounded-xl">
                3. Quality Audit
              </div>
              <div className="p-2.5 bg-[#FAF7F2] border border-[#EADDCB] text-[#7D6F63] rounded-xl">
                4. Express Dispatch
              </div>
            </div>
          </div>
        </div>

        {/* Order Summary Items Breakdown */}
        <div className="p-6 bg-white border border-[#EADDCB] rounded-3xl text-left space-y-4 shadow-card">
          <h3 className="font-serif font-bold text-lg text-[#232323] border-b border-[#EADDCB] pb-3 flex items-center justify-between">
            <span>Ordered Formulations ({items.length})</span>
            <span className="text-xs font-normal text-[#7D6F63]">100% Organic Soy Wax Atelier</span>
          </h3>

          <div className="space-y-3 text-xs divide-y divide-[#F0E6D8]">
            {items.length === 0 ? (
              <p className="text-[#7D6F63] italic text-center py-4">Handcrafted candle formulations ordered.</p>
            ) : (
              items.map((item, idx) => {
                const variantLabel = [item.fragrance, item.size, item.wickType || item.wick, item.color]
                  .filter(Boolean)
                  .join(' • ');
                const itemQty = item.quantity || 1;
                const itemPrice = item.price || 999;

                return (
                  <div key={item.id || idx} className="pt-3 first:pt-0 flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3">
                      <div className="w-12 h-12 rounded-xl bg-[#FAF7F2] border border-[#EADDCB] flex items-center justify-center text-2xl shrink-0 overflow-hidden">
                        {item.image ? (
                          <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                        ) : (
                          '🕯️'
                        )}
                      </div>
                      <div className="space-y-0.5">
                        <strong className="text-sm font-serif font-bold text-[#232323] block">
                          {itemQty}x {item.name}
                        </strong>
                        {variantLabel && (
                          <span className="text-[11px] text-[#7D6F63] block">{variantLabel}</span>
                        )}
                        {item.sku && (
                          <span className="text-[10px] font-mono text-[#8B6F4E] block">SKU: {item.sku}</span>
                        )}
                        {item.giftPackaging && (
                          <span className="inline-block text-[10px] font-bold text-[#C94C6D]">
                            🎁 Gift Wrapped with Luxury Wax Seal
                          </span>
                        )}
                        {item.customMessage && (
                          <p className="text-[10px] italic text-[#5C5149] bg-[#FAF7F2] p-1.5 rounded-lg border border-[#EADDCB]">
                            "{item.customMessage}"
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="text-right whitespace-nowrap">
                      <span className="font-bold text-sm text-[#232323] block">
                        ₹{(itemPrice * itemQty).toLocaleString('en-IN')}.00
                      </span>
                      <span className="text-[10px] text-[#7D6F63]">₹{itemPrice.toLocaleString('en-IN')} each</span>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Pricing Totals Breakdown */}
          <div className="pt-4 border-t border-[#EADDCB] space-y-1.5 text-xs">
            <div className="flex justify-between text-[#7D6F63]">
              <span>Taxable Items Subtotal</span>
              <span>₹{(orderDetails?.subtotal || Math.round(totalAmount / 1.18)).toLocaleString('en-IN')}.00</span>
            </div>
            {Boolean(orderDetails?.discount) && (
              <div className="flex justify-between text-[#15803D] font-semibold">
                <span>Promotional Discount</span>
                <span>-₹{(orderDetails?.discount || 0).toLocaleString('en-IN')}.00</span>
              </div>
            )}
            <div className="flex justify-between text-[#7D6F63]">
              <span>Courier Delivery</span>
              <span>{orderDetails?.shippingFee === 0 || !orderDetails?.shippingFee ? <strong className="text-[#15803D]">FREE</strong> : `₹${orderDetails.shippingFee}.00`}</span>
            </div>
            <div className="flex justify-between text-[#7D6F63]">
              <span>GST (18% Integrated Tax)</span>
              <span>₹{Math.round(totalAmount - (orderDetails?.subtotal || Math.round(totalAmount / 1.18)))}.00</span>
            </div>
            <div className="pt-2 border-t border-[#EADDCB] flex items-center justify-between text-base font-bold">
              <span className="text-[#232323]">{isCOD ? 'Amount Due on Courier Delivery' : 'Total Amount Paid'}</span>
              <span className="text-2xl font-serif text-[#8B6F4E]">₹{totalAmount.toLocaleString('en-IN')}.00</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-3">
          <Button
            variant="pink"
            size="md"
            onClick={() => {
              printOrderInvoice(invoiceOrderData, 'invoice');
              toast({ type: 'luxury', title: 'Preparing Official Tax Invoice', description: 'Opening clean A4 print dialog...' });
            }}
          >
            🖨️ Print / Download Tax Invoice (A4)
          </Button>

          <Button
            variant="outline"
            size="md"
            onClick={() => setShowInvoiceModal(true)}
          >
            👁️ Preview Invoice on Screen
          </Button>

          <Button
            variant="outline"
            size="md"
            onClick={onReturnHome}
          >
            Return to Sanctuary Home →
          </Button>
        </div>
      </div>

      {/* Invoice Modal Preview */}
      {showInvoiceModal && (
        <div className="fixed inset-0 z-50 bg-[#1C130E]/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="my-8 max-w-4xl w-full">
            <PrintableInvoice
              order={invoiceOrderData}
              onClose={() => setShowInvoiceModal(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
};
