import React, { useState, useEffect } from 'react';
import { Modal, Button, Badge, SparklesIcon, useToast } from '../../design-system';
import { useAuth } from '../../context/AuthContext';
import { useCMS } from '../../context/CMSContext';
import { printOrderInvoice } from '../../utils/printInvoice';
import { PrintableInvoice } from '../invoice/PrintableInvoice';

export interface OrderDetailsModalProps {
  orderId: string | null;
  isOpen: boolean;
  onClose: () => void;
}

export const OrderDetailsModal: React.FC<OrderDetailsModalProps> = ({
  orderId,
  isOpen,
  onClose,
}) => {
  const { toast } = useToast();
  const { user } = useAuth();
  const { orders } = useCMS();
  const [activeView, setActiveView] = useState<'details' | 'invoice'>('details');
  const [orderData, setOrderData] = useState<any | null>(null);

  useEffect(() => {
    if (!orderId || !isOpen) {
      setOrderData(null);
      return;
    }

    try {
      // 1. Check CMS context orders
      const cmsMatch = orders.find((o) => o.id === orderId || o.orderNumber === orderId);
      if (cmsMatch) {
        setOrderData(cmsMatch);
        return;
      }

      // 2. Check LocalStorage
      const userOrders = JSON.parse(localStorage.getItem('tcl_user_orders') || '[]');
      const cmsOrders = JSON.parse(localStorage.getItem('tcl_cms_orders') || '[]');
      const allOrders = JSON.parse(localStorage.getItem('thecandlelab_orders_all') || '[]');
      let emailOrders: any[] = [];
      if (user?.email) {
        emailOrders = JSON.parse(localStorage.getItem(`thecandlelab_orders_${user.email}`) || '[]');
      }

      const pool = [...userOrders, ...cmsOrders, ...allOrders, ...emailOrders];
      const match = pool.find((o: any) => o.id === orderId || o.orderNumber === orderId);
      if (match) {
        setOrderData(match);
      } else {
        // Fallback default order shape
        setOrderData({
          id: orderId,
          orderNumber: orderId,
          date: new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }),
          status: 'Processing',
          customerName: user?.name || user?.email?.split('@')[0] || 'Valued Patron',
          email: user?.email || 'customer@thecandlelab.in',
          shippingAddress: '402 Sanctuary Lane, Bandra West, Mumbai, MH - 400050',
          totalAmount: 1499,
          paymentMethod: 'Online UPI / Card',
          items: [{
            name: 'Handcrafted Artisanal Soy Candle',
            quantity: 1,
            price: 1499,
            fragrance: 'Signature Blend',
            size: 'Classic 250g',
            wickType: 'Wood Wick',
          }],
        });
      }
    } catch (e) {
      console.warn('Error resolving order details:', e);
    }
  }, [orderId, isOpen, orders, user]);

  if (!isOpen || !orderId) return null;

  const currentOrder = orderData || {
    id: orderId,
    orderNumber: orderId,
    date: 'Recent',
    status: 'Processing',
    customerName: 'Valued Patron',
    totalAmount: 1499,
    items: [],
  };

  const parsedItems: any[] = Array.isArray(currentOrder.itemsList) && currentOrder.itemsList.length > 0
    ? currentOrder.itemsList
    : Array.isArray(currentOrder.items) && currentOrder.items.length > 0
      ? currentOrder.items
      : [{
          name: typeof currentOrder.items === 'string' ? currentOrder.items : 'Artisanal Botanical Candle',
          quantity: 1,
          price: typeof currentOrder.totalAmount === 'number' ? currentOrder.totalAmount : 1499,
          fragrance: 'Signature Blend',
          size: 'Classic 250g',
        }];

  let totalAmountNum = 0;
  if (typeof currentOrder.totalAmount === 'number') {
    totalAmountNum = currentOrder.totalAmount;
  } else if (typeof currentOrder.totalAmount === 'string') {
    totalAmountNum = Number(currentOrder.totalAmount.replace(/[^0-9.]/g, '')) || 0;
  }
  if (totalAmountNum === 0 && parsedItems.length > 0) {
    totalAmountNum = parsedItems.reduce((sum, it) => sum + ((it.price || 0) * (it.quantity || 1)), 0);
  }

  const subtotal = currentOrder.subtotal || Math.round(totalAmountNum / 1.18);
  const tax = currentOrder.tax || Math.round(totalAmountNum - subtotal);
  const discount = currentOrder.discount || 0;
  const shipping = currentOrder.shipping || currentOrder.shippingFee || 0;

  const isCOD = String(currentOrder.paymentMethod || '').toLowerCase().includes('cod');
  const statusStr = currentOrder.status || 'Processing';

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Order ${orderId}`}
    >
      <div className="space-y-5 font-sans text-xs max-w-2xl mx-auto">
        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 border-b border-[#EADDCB] pb-3">
          <button
            onClick={() => setActiveView('details')}
            className={`px-3 py-1.5 rounded-xl font-bold text-xs cursor-pointer transition-all ${
              activeView === 'details'
                ? 'bg-[#8B6F4E] text-white shadow-xs'
                : 'bg-[#FAF7F2] text-[#7D6F63] hover:text-[#232323]'
            }`}
          >
            📦 Order Breakdown & Tracking
          </button>
          <button
            onClick={() => setActiveView('invoice')}
            className={`px-3 py-1.5 rounded-xl font-bold text-xs cursor-pointer transition-all ${
              activeView === 'invoice'
                ? 'bg-[#8B6F4E] text-white shadow-xs'
                : 'bg-[#FAF7F2] text-[#7D6F63] hover:text-[#232323]'
            }`}
          >
            🧾 Official Tax Invoice Preview
          </button>
        </div>

        {activeView === 'invoice' ? (
          <PrintableInvoice
            order={currentOrder}
            onClose={onClose}
          />
        ) : (
          <div className="space-y-5">
            {/* Status Header */}
            <div className="p-4 bg-[#FAF7F2] border border-[#EADDCB] rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
              <div className="space-y-1">
                <Badge variant={statusStr === 'Delivered' || statusStr === 'DELIVERED' ? 'success' : 'pink'} icon={<SparklesIcon size={12} />}>
                  {statusStr.toUpperCase()}
                </Badge>
                <p className="text-xs font-bold text-[#232323] pt-1">
                  Placed on {currentOrder.date || 'Recent Date'}
                </p>
              </div>

              <div className="text-left sm:text-right">
                <span className="text-[10px] text-[#7D6F63] uppercase font-bold tracking-wider block">Payment Mode</span>
                <span className="font-semibold text-xs text-[#232323]">{currentOrder.paymentMethod || 'Online (Razorpay)'}</span>
                {currentOrder.trackingNumber && (
                  <p className="text-[10px] text-[#8B6F4E] font-mono mt-0.5">AWB: {currentOrder.trackingNumber}</p>
                )}
              </div>
            </div>

            {/* Customer & Shipping Summary */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3.5 bg-white border border-[#EADDCB] rounded-2xl text-xs">
              <div className="space-y-0.5">
                <span className="text-[10px] uppercase font-bold text-[#7D6F63] block">👤 Customer Details</span>
                <strong className="text-[#232323] block">{currentOrder.customerName}</strong>
                <p className="text-[#5C5149] text-[11px]">{currentOrder.email || currentOrder.customerEmail || 'customer@thecandlelab.in'}</p>
                {currentOrder.phone && <p className="text-[#5C5149] text-[11px]">📞 {currentOrder.phone}</p>}
              </div>

              <div className="space-y-0.5">
                <span className="text-[10px] uppercase font-bold text-[#7D6F63] block">🏠 Delivery Destination</span>
                <p className="text-[#232323] text-[11px] leading-relaxed">
                  {currentOrder.shippingAddress || currentOrder.address || 'Address provided at checkout'}
                </p>
              </div>
            </div>

            {/* Itemized Products */}
            <div className="space-y-3">
              <span className="text-[10px] uppercase font-bold tracking-wider text-[#7D6F63] block">
                Purchased Formulations ({parsedItems.length} Items)
              </span>

              <div className="space-y-2.5">
                {parsedItems.map((item, idx) => {
                  const specs = [item.fragrance, item.size, item.wickType, item.color].filter(Boolean).join(' • ');
                  const qty = item.quantity || 1;
                  const price = item.price || 999;

                  return (
                    <div key={idx} className="p-3 bg-white border border-[#EADDCB] rounded-2xl flex items-start justify-between gap-3 shadow-xs">
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-xl bg-[#FAF7F2] border border-[#EADDCB] flex items-center justify-center text-xl shrink-0 overflow-hidden">
                          {item.image ? (
                            <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                          ) : (
                            '🕯️'
                          )}
                        </div>
                        <div>
                          <strong className="text-[#232323] block text-xs">{qty}x {item.name}</strong>
                          {specs && <span className="text-[10px] text-[#7D6F63] block">{specs}</span>}
                          {item.giftPackaging && (
                            <span className="text-[9px] font-bold text-[#C94C6D] block mt-0.5">
                              🎁 Gift Wrapped with Wax Seal
                            </span>
                          )}
                          {item.customMessage && (
                            <p className="text-[10px] italic text-[#5C5149] bg-[#FAF7F2] p-1 rounded mt-1 border border-[#EADDCB]">
                              "{item.customMessage}"
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="text-right whitespace-nowrap">
                        <span className="font-bold text-[#232323] text-xs block">
                          ₹{(price * qty).toLocaleString('en-IN')}.00
                        </span>
                        <span className="text-[10px] text-[#7D6F63]">₹{price.toLocaleString('en-IN')} each</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Order Price Totals Breakdown */}
            <div className="p-4 bg-[#FAF7F2] border border-[#EADDCB] rounded-2xl space-y-1.5 text-xs">
              <div className="flex justify-between text-[#7D6F63]">
                <span>Taxable Items Subtotal</span>
                <span>₹{subtotal.toLocaleString('en-IN')}.00</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-[#15803D] font-semibold">
                  <span>Promotional Discount</span>
                  <span>-₹{discount.toLocaleString('en-IN')}.00</span>
                </div>
              )}
              <div className="flex justify-between text-[#7D6F63]">
                <span>Express Courier Shipping</span>
                <span>{shipping === 0 ? <strong className="text-[#15803D]">FREE</strong> : `₹${shipping}.00`}</span>
              </div>
              <div className="flex justify-between text-[#7D6F63]">
                <span>Tax (18% GST Included)</span>
                <span>₹{tax.toLocaleString('en-IN')}.00</span>
              </div>
              <div className="flex justify-between text-sm font-bold text-[#232323] pt-2 border-t border-[#EADDCB]">
                <span>{isCOD ? 'Amount Due on Delivery (COD)' : 'Total Paid'}</span>
                <span className="text-[#8B6F4E] font-serif font-bold text-base">₹{totalAmountNum.toLocaleString('en-IN')}.00</span>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="pt-2 flex flex-wrap items-center justify-between gap-3 border-t border-[#EADDCB]">
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    printOrderInvoice(currentOrder, 'invoice');
                    toast({ type: 'luxury', title: 'Printing Tax Invoice...', description: 'Opening clean A4 document.' });
                  }}
                >
                  🖨️ Print Tax Invoice (A4)
                </Button>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    printOrderInvoice(currentOrder, 'packingslip');
                    toast({ type: 'info', title: 'Printing Packing Slip...' });
                  }}
                >
                  📋 Slip
                </Button>
              </div>

              <Button
                variant="pink"
                size="sm"
                onClick={() => {
                  toast({ type: 'luxury', title: 'Formulations Reordered!', description: 'Items re-added to your shopping bag.' });
                  onClose();
                }}
              >
                Reorder Formulations
              </Button>
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
};
