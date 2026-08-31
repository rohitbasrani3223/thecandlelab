import React, { useState, useEffect } from 'react';
import { Modal, Button, Badge, SparklesIcon, useToast } from '../../design-system';
import { useAuth } from '../../context/AuthContext';
import { useCMS } from '../../context/CMSContext';
import { useCart } from '../../context/CartContext';
import { printOrderInvoice } from '../../utils/printInvoice';
import { PrintableInvoice } from '../invoice/PrintableInvoice';
import { supabaseFetch } from '../../config/supabaseClient';

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
  const { addToCart } = useCart();
  const [activeView, setActiveView] = useState<'details' | 'invoice'>('details');
  const [orderData, setOrderData] = useState<any | null>(null);
  const [isCancelling, setIsCancelling] = useState(false);

  useEffect(() => {
    if (!orderId || !isOpen) {
      setOrderData(null);
      return;
    }

    try {
      const userEmailLower = user?.email?.toLowerCase() || '';

      // 1. Check user-specific local storage
      let userSpecificOrders: any[] = [];
      if (userEmailLower) {
        userSpecificOrders = JSON.parse(localStorage.getItem(`thecandlelab_orders_${userEmailLower}`) || '[]');
      }

      // 2. Check guest & cms orders
      const guestOrders = JSON.parse(localStorage.getItem('thecandlelab_guest_orders') || '[]');
      const cmsOrders = JSON.parse(localStorage.getItem('tcl_cms_orders') || '[]');
      const allOrders = JSON.parse(localStorage.getItem('thecandlelab_orders_all') || '[]');

      const pool = [...userSpecificOrders, ...guestOrders, ...orders, ...cmsOrders, ...allOrders];
      const match = pool.find((o: any) =>
        o.id === orderId ||
        o.orderNumber === orderId ||
        String(o.id).toLowerCase() === String(orderId).toLowerCase() ||
        String(o.orderNumber).toLowerCase() === String(orderId).toLowerCase()
      );

      if (match) {
        setOrderData({
          ...match,
          orderNumber: match.orderNumber || match.id,
          courier: match.courier || 'Blue Dart Express',
          trackingNumber: match.trackingNumber || `AWB-TCL-${String(match.orderNumber || match.id).slice(-6)}`,
          itemsList: Array.isArray(match.itemsList) ? match.itemsList : (Array.isArray(match.items) ? match.items : []),
        });
      } else {
        // Fallback placeholder
        setOrderData({
          id: orderId,
          orderNumber: orderId,
          date: new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }),
          status: 'Processing',
          customerName: user?.name || 'Valued Customer',
          email: user?.email || '',
          shippingAddress: 'Provided at checkout',
          totalAmount: 0,
          paymentMethod: 'Online Payment',
          courier: 'Blue Dart Express',
          trackingNumber: `AWB-TCL-${String(orderId).slice(-6)}`,
          items: [],
          itemsList: [],
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
    date: '',
    status: 'Processing',
    customerName: user?.name || '',
    totalAmount: 0,
    items: [],
    itemsList: [],
  };

  const parsedItems: any[] = Array.isArray(currentOrder.itemsList) && currentOrder.itemsList.length > 0
    ? currentOrder.itemsList
    : Array.isArray(currentOrder.items) && currentOrder.items.length > 0
      ? currentOrder.items
      : (typeof currentOrder.items === 'string' && currentOrder.items.trim())
        ? [{
            name: currentOrder.items,
            quantity: 1,
            price: currentOrder.totalAmount || 999,
            fragrance: '',
            size: '',
          }]
        : [];

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
  const isProcessing = statusStr.toLowerCase().includes('process') || statusStr.toLowerCase().includes('placed');
  const isCancelled = statusStr.toLowerCase().includes('cancel');

  // 5-Stage Stepper Number
  const getStepNumber = (s: string) => {
    const st = s.toUpperCase();
    if (st.includes('DELIVER')) return 5;
    if (st.includes('DISPATCH') || st.includes('SHIP') || st.includes('TRANSIT')) return 4;
    if (st.includes('AUDIT') || st.includes('READY')) return 3;
    if (st.includes('ATELIER') || st.includes('POUR') || st.includes('CURE')) return 2;
    return 1;
  };

  const stepNumber = getStepNumber(statusStr);

  // 1-Click Reorder
  const handleReorder = () => {
    if (parsedItems.length === 0) {
      addToCart({
        id: `reorder-${orderId}`,
        name: 'Handcrafted Candle Formulation',
        price: totalAmountNum || 999,
        quantity: 1,
      });
    } else {
      parsedItems.forEach((it: any) => {
        addToCart({
          id: it.id || `reorder-${it.name.replace(/\s+/g, '-').toLowerCase()}`,
          name: it.name,
          price: Number(it.price) || 999,
          quantity: Number(it.quantity) || 1,
          fragrance: it.fragrance || '',
          size: it.size || '',
          wickType: it.wickType || '',
        });
      });
    }

    toast({
      type: 'luxury',
      title: 'Formulations Added to Bag!',
      description: 'Your favorite artisan candles have been added to your shopping cart.',
    });
    onClose();
  };

  // Cancel Order
  const handleCancel = async () => {
    if (!window.confirm(`Are you sure you want to cancel Order #${currentOrder.orderNumber}?`)) {
      return;
    }

    setIsCancelling(true);
    const userEmailLower = (user?.email || '').trim().toLowerCase();
    const userKey = `thecandlelab_orders_${userEmailLower}`;

    try {
      // 1. Supabase patch
      try {
        await supabaseFetch(`orders?order_number=eq.${encodeURIComponent(currentOrder.orderNumber)}`, {
          method: 'PATCH',
          body: { order_status: 'Cancelled' },
        });
      } catch {}

      // 2. Local storage update
      if (userKey) {
        const saved = localStorage.getItem(userKey);
        if (saved) {
          const parsed = JSON.parse(saved);
          const updated = parsed.map((o: any) =>
            (o.id === currentOrder.id || o.orderNumber === currentOrder.orderNumber) ? { ...o, status: 'Cancelled' } : o
          );
          localStorage.setItem(userKey, JSON.stringify(updated));
        }
      }

      setOrderData((prev: any) => ({ ...prev, status: 'Cancelled' }));

      toast({
        type: 'info',
        title: 'Order Cancelled',
        description: `Order #${currentOrder.orderNumber} has been successfully cancelled.`,
      });

      window.dispatchEvent(new Event('tcl-orders-updated'));
    } catch (e) {
      toast({
        type: 'error',
        title: 'Cancellation Failed',
        description: 'Unable to cancel this order right now. Please reach out to customer concierge.',
      });
    } finally {
      setIsCancelling(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Order ${currentOrder.orderNumber || orderId}`}
    >
      <div className="space-y-5 font-sans text-xs max-w-2xl mx-auto">
        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 border-b border-[#EADDCB] pb-3">
          <button
            onClick={() => setActiveView('details')}
            className={`px-3.5 py-2 rounded-xl font-bold text-xs cursor-pointer transition-all ${
              activeView === 'details'
                ? 'bg-[#8B6F4E] text-white shadow-xs'
                : 'bg-[#FAF7F2] text-[#7D6F63] hover:text-[#232323]'
            }`}
          >
            📦 Order Breakdown & Fulfillment
          </button>
          <button
            onClick={() => setActiveView('invoice')}
            className={`px-3.5 py-2 rounded-xl font-bold text-xs cursor-pointer transition-all ${
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
            order={{
              ...currentOrder,
              totalAmount: totalAmountNum,
              subtotal,
              tax,
              discount,
              shippingFee: shipping,
            }}
            onClose={onClose}
          />
        ) : (
          <div className="space-y-5">
            {/* Status Header */}
            <div className="p-4 bg-[#FAF7F2] border border-[#EADDCB] rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
              <div className="space-y-1">
                <Badge
                  variant={
                    isCancelled
                      ? 'error'
                      : statusStr.toLowerCase().includes('deliver')
                        ? 'success'
                        : 'pink'
                  }
                  icon={<SparklesIcon size={12} />}
                >
                  {statusStr.toUpperCase()}
                </Badge>
                <p className="text-xs font-bold text-[#232323] pt-1">
                  Placed on {currentOrder.date || 'Recent Date'}
                </p>
              </div>

              <div className="text-left sm:text-right space-y-1">
                <span className="text-[10px] text-[#7D6F63] uppercase font-bold tracking-wider block">Payment Method</span>
                {isCOD ? (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-900 border border-amber-200 shadow-xs">
                    <span>💵</span>
                    <span>Cash on Delivery (COD)</span>
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-900 border border-emerald-200 shadow-xs">
                    <span>💳</span>
                    <span>Razorpay Online (Paid)</span>
                  </span>
                )}
                {currentOrder.trackingNumber && (
                  <p className="text-[10px] text-[#8B6F4E] font-mono mt-1">
                    {currentOrder.courier || 'Blue Dart'}: <strong className="text-[#232323]">{currentOrder.trackingNumber}</strong>
                  </p>
                )}
              </div>
            </div>

            {/* 5-Stage Visual Fulfillment Stepper */}
            {!isCancelled ? (
              <div className="p-4 bg-white border border-[#EADDCB] rounded-2xl space-y-3 shadow-card">
                <div className="flex items-center justify-between">
                  <h5 className="text-[11px] font-bold uppercase tracking-wider text-[#232323]">
                    Artisan Fulfillment Timeline
                  </h5>
                  <span className="text-[10px] font-bold text-[#15803D]">
                    Estimated Delivery: 3–4 Days
                  </span>
                </div>

                <div className="grid grid-cols-5 gap-1.5 text-center text-[10px]">
                  {[
                    { step: 1, name: 'Placed' },
                    { step: 2, name: 'Atelier' },
                    { step: 3, name: 'Audit' },
                    { step: 4, name: 'Dispatched' },
                    { step: 5, name: 'Delivered' },
                  ].map((s) => {
                    const isDone = stepNumber >= s.step;
                    const isNow = stepNumber === s.step;

                    return (
                      <div
                        key={s.step}
                        className={`p-2 rounded-xl border transition-all ${
                          isNow
                            ? 'bg-[#FDE8EF] border-[#C94C6D] text-[#C94C6D] font-bold shadow-xs'
                            : isDone
                              ? 'bg-[#FAF7F2] border-[#8B6F4E]/30 text-[#232323]'
                              : 'bg-stone-50 border-stone-200 text-stone-400 opacity-60'
                        }`}
                      >
                        <div
                          className={`w-5 h-5 rounded-full mx-auto mb-1 flex items-center justify-center font-bold text-[9px] ${
                            isDone ? 'bg-[#8B6F4E] text-white' : 'bg-stone-200 text-stone-600'
                          }`}
                        >
                          {isDone ? '✓' : s.step}
                        </div>
                        <span className="block truncate">{s.name}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : (
              <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-center text-xs text-red-700 font-medium">
                This order was cancelled.
              </div>
            )}

            {/* Customer & Shipping Destination */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3.5 bg-white border border-[#EADDCB] rounded-2xl text-xs">
              <div className="space-y-0.5">
                <span className="text-[10px] uppercase font-bold text-[#7D6F63] block">👤 Customer Details</span>
                <strong className="text-[#232323] block">{currentOrder.customerName || user?.name || 'Valued Customer'}</strong>
                <p className="text-[#5C5149] text-[11px]">{currentOrder.email || currentOrder.customerEmail || user?.email}</p>
                {currentOrder.phone && <p className="text-[#5C5149] text-[11px]">📞 {currentOrder.phone}</p>}
              </div>

              <div className="space-y-0.5">
                <span className="text-[10px] uppercase font-bold text-[#7D6F63] block">🏠 Delivery Destination</span>
                <p className="text-[#232323] text-[11px] leading-relaxed">
                  {currentOrder.shippingAddress || currentOrder.address || 'Address provided at checkout'}
                </p>
              </div>
            </div>

            {/* Itemized Purchased Formulations */}
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
                    <div key={idx} className="p-3 bg-white border border-[#EADDCB] rounded-2xl flex items-start justify-between gap-3 shadow-card">
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
                    printOrderInvoice(
                      {
                        ...currentOrder,
                        totalAmount: totalAmountNum,
                        subtotal,
                        tax,
                        discount,
                        shippingFee: shipping,
                      },
                      'invoice'
                    );
                    toast({ type: 'luxury', title: 'Printing Tax Invoice...', description: 'Opening clean A4 document.' });
                  }}
                >
                  🖨️ Print Tax Invoice (A4)
                </Button>

                {isProcessing && (
                  <button
                    onClick={handleCancel}
                    disabled={isCancelling}
                    className="px-3 py-1.5 rounded-full text-xs font-bold text-red-600 bg-red-50 hover:bg-red-100 transition-colors cursor-pointer"
                  >
                    {isCancelling ? 'Cancelling...' : 'Cancel Order'}
                  </button>
                )}
              </div>

              <Button
                variant="pink"
                size="sm"
                onClick={handleReorder}
              >
                🔄 Reorder Formulations
              </Button>
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
};
