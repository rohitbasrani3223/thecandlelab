import React, { useState } from 'react';
import { Modal, Input, Button, Badge, SparklesIcon, useToast } from '../../design-system';
import { supabaseFetch } from '../../config/supabaseClient';
import { printOrderInvoice } from '../../utils/printInvoice';
import { PrintableInvoice } from '../invoice/PrintableInvoice';

export interface TrackOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialOrderId?: string;
}

export const TrackOrderModal: React.FC<TrackOrderModalProps> = ({
  isOpen,
  onClose,
  initialOrderId = '',
}) => {
  const { toast } = useToast();
  const [orderInput, setOrderInput] = useState(initialOrderId);
  const [contactInput, setContactInput] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [trackedOrder, setTrackedOrder] = useState<any | null>(null);
  const [searchError, setSearchError] = useState<string | null>(null);
  const [showInvoicePreview, setShowInvoicePreview] = useState(false);

  const handleSearch = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const cleanOrderId = orderInput.trim().toUpperCase();
    const cleanContact = contactInput.trim().toLowerCase().replace(/[^a-z0-9@.+]/g, '');

    if (!cleanOrderId) {
      setSearchError('Please enter your Order Reference Number (e.g. TCL-XXXXXX).');
      return;
    }

    setIsSearching(true);
    setSearchError(null);
    setTrackedOrder(null);

    try {
      let matchedOrder: any = null;

      // 1. Check Supabase Live DB
      try {
        const dbOrders = await supabaseFetch<any[]>('orders', {
          query: `order_number=eq.${encodeURIComponent(cleanOrderId)}`,
        });

        if (Array.isArray(dbOrders) && dbOrders.length > 0) {
          const raw = dbOrders[0];

          // Fetch items for this order
          let itemsList: any[] = [];
          try {
            const dbItems = await supabaseFetch<any[]>('order_items', {
              query: `order_id=eq.${encodeURIComponent(raw.id)}`,
            });
            if (Array.isArray(dbItems) && dbItems.length > 0) {
              itemsList = dbItems.map((it) => ({
                name: it.product_name || 'Handcrafted Soy Candle',
                fragrance: it.fragrance || '',
                size: it.size || '250g Classic',
                wickType: it.wick_type || 'Organic Wood Wick',
                quantity: Number(it.quantity) || 1,
                price: Number(it.unit_price) || 999,
              }));
            }
          } catch {}

          matchedOrder = {
            id: raw.id,
            orderNumber: raw.order_number || raw.id,
            date: raw.created_at ? new Date(raw.created_at).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : '',
            status: raw.order_status || 'Processing',
            customerName: raw.customer_name || 'Valued Customer',
            customerEmail: raw.customer_email || '',
            email: raw.customer_email || '',
            customerPhone: raw.customer_phone || '',
            phone: raw.customer_phone || '',
            shippingAddress: raw.shipping_address || 'Provided at checkout',
            address: raw.shipping_address || 'Provided at checkout',
            totalAmount: Number(raw.total_amount) || 0,
            subtotal: Number(raw.total_amount) || 0,
            paymentMethod: raw.payment_method || 'Online Payment',
            trackingNumber: raw.tracking_number || (cleanOrderId ? `AWB-TCL-${cleanOrderId.slice(-6)}` : 'AWB-PENDING'),
            courier: 'Blue Dart Express',
            itemsList: itemsList,
            items: itemsList.map((i) => `${i.quantity}x ${i.name}`).join(', ') || 'Handcrafted Soy Candles',
          };
        }
      } catch (err) {
        console.warn('Supabase order tracking query note:', err);
      }

      // 2. Fallback to LocalStorage pools if not found or offline
      if (!matchedOrder) {
        const guestOrders = JSON.parse(localStorage.getItem('thecandlelab_guest_orders') || '[]');
        const allOrders = JSON.parse(localStorage.getItem('thecandlelab_orders_all') || '[]');
        const cmsOrders = JSON.parse(localStorage.getItem('tcl_cms_orders') || '[]');
        const userOrders = JSON.parse(localStorage.getItem('tcl_user_orders') || '[]');

        // Also check any email-specific storage
        const emailSpecific = cleanContact && cleanContact.includes('@')
          ? JSON.parse(localStorage.getItem(`thecandlelab_orders_${cleanContact}`) || '[]')
          : [];

        const pool = [...emailSpecific, ...guestOrders, ...allOrders, ...cmsOrders, ...userOrders];

        const localMatch = pool.find((o: any) => {
          const ordNum = String(o.orderNumber || o.id || '').toUpperCase();
          const ordId = String(o.id || '').toUpperCase();
          return ordNum === cleanOrderId || ordId === cleanOrderId || ordNum.includes(cleanOrderId) || cleanOrderId.includes(ordNum);
        });

        if (localMatch) {
          matchedOrder = {
            ...localMatch,
            orderNumber: localMatch.orderNumber || localMatch.id,
            status: localMatch.status || 'Processing',
            trackingNumber: localMatch.trackingNumber || `AWB-TCL-${cleanOrderId.slice(-6)}`,
            courier: localMatch.courier || 'Blue Dart Express',
            itemsList: Array.isArray(localMatch.itemsList) ? localMatch.itemsList : (Array.isArray(localMatch.items) ? localMatch.items : []),
          };
        }
      }

      if (!matchedOrder) {
        setSearchError(`No order found matching "${cleanOrderId}". Please check your order reference ID.`);
        setIsSearching(false);
        return;
      }

      // Optional Verification if contact was provided
      if (cleanContact) {
        const orderEmail = String(matchedOrder.customerEmail || matchedOrder.email || '').toLowerCase();
        const orderPhone = String(matchedOrder.customerPhone || matchedOrder.phone || '').replace(/[^0-9]/g, '');
        const inputDigits = cleanContact.replace(/[^0-9]/g, '');

        const emailMatches = cleanContact.includes('@') && orderEmail.includes(cleanContact);
        const phoneMatches = inputDigits.length >= 4 && orderPhone.includes(inputDigits);

        if (!emailMatches && !phoneMatches && orderEmail && orderEmail !== 'guest@example.com') {
          setSearchError('The email/phone does not match the customer details on this order.');
          setIsSearching(false);
          return;
        }
      }

      setTrackedOrder(matchedOrder);
      toast({
        type: 'luxury',
        title: 'Order Located Successfully',
        description: `Tracking details loaded for ${matchedOrder.orderNumber}`,
      });
    } catch (err: any) {
      setSearchError('Unable to retrieve tracking information at this moment. Please try again.');
    } finally {
      setIsSearching(false);
    }
  };

  // 5-Stage Stepper Determination
  const getStepStatus = (status: string) => {
    const s = String(status || '').toUpperCase();
    if (s.includes('CANCEL')) return { currentStep: 0, isCancelled: true };
    if (s.includes('DELIVER')) return { currentStep: 5, isCancelled: false };
    if (s.includes('DISPATCH') || s.includes('SHIP') || s.includes('TRANSIT')) return { currentStep: 4, isCancelled: false };
    if (s.includes('AUDIT') || s.includes('READY')) return { currentStep: 3, isCancelled: false };
    if (s.includes('ATELIER') || s.includes('POUR') || s.includes('CURE')) return { currentStep: 2, isCancelled: false };
    return { currentStep: 1, isCancelled: false }; // Default: Placed & Confirmed
  };

  const trackingInfo = trackedOrder ? getStepStatus(trackedOrder.status) : null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={() => {
        setTrackedOrder(null);
        setSearchError(null);
        setShowInvoicePreview(false);
        onClose();
      }}
      title="Live Shipment & Order Tracker"
    >
      <div className="space-y-6 font-sans text-xs max-w-2xl mx-auto">
        {/* Search Header Banner */}
        <div className="bg-[#FAF7F2] border border-[#EADDCB] rounded-2xl p-4 sm:p-5 text-center space-y-2">
          <Badge variant="pink" icon={<SparklesIcon size={12} />}>
            ATELIER LOGISTICS TRACKING
          </Badge>
          <h3 className="text-xl font-serif font-bold text-[#232323]">
            Track Your Handcrafted Candle Order
          </h3>
          <p className="text-xs text-[#7D6F63] max-w-md mx-auto">
            Enter your Order Reference Number and optional email/phone to inspect live artisan curing, packaging, and courier dispatch.
          </p>

          {/* Search Form */}
          <form onSubmit={handleSearch} className="mt-4 space-y-3 max-w-lg mx-auto text-left">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Input
                label="Order ID / Reference"
                placeholder="e.g. TCL-8A9F1B2C"
                value={orderInput}
                onChange={(e) => {
                  setOrderInput(e.target.value);
                  if (searchError) setSearchError(null);
                }}
                required
              />
              <Input
                label="Email or Mobile (Optional)"
                placeholder="Email or Phone Number"
                value={contactInput}
                onChange={(e) => {
                  setContactInput(e.target.value);
                  if (searchError) setSearchError(null);
                }}
              />
            </div>

            {searchError && (
              <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-xl text-xs flex items-center gap-2">
                <span>⚠️</span>
                <span>{searchError}</span>
              </div>
            )}

            <Button
              type="submit"
              variant="pink"
              size="md"
              fullWidth
              disabled={isSearching || !orderInput.trim()}
            >
              {isSearching ? 'Locating Sanctuary Order...' : '🔎 Track Live Shipment'}
            </Button>
          </form>
        </div>

        {/* Tracked Order Result View */}
        {trackedOrder && (
          <div className="space-y-6 animate-fadeIn">
            {/* Status & Courier Bar */}
            <div className="p-4 bg-white border border-[#EADDCB] rounded-2xl shadow-card flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#7D6F63]">Order Status</span>
                  <Badge
                    variant={
                      trackingInfo?.isCancelled
                        ? 'error'
                        : trackingInfo?.currentStep === 5
                          ? 'success'
                          : 'pink'
                    }
                    size="sm"
                  >
                    {trackedOrder.status.toUpperCase()}
                  </Badge>
                </div>
                <h4 className="font-serif font-bold text-lg text-[#232323] mt-0.5">
                  {trackedOrder.orderNumber}
                </h4>
                <div className="flex flex-wrap items-center gap-2 pt-1 text-[11px] text-[#7D6F63]">
                  <span>Placed on {trackedOrder.date || 'Recent Date'}</span>
                  <span>•</span>
                  {String(trackedOrder.paymentMethod || '').toLowerCase().includes('cod') || String(trackedOrder.status || '').toLowerCase().includes('cod') ? (
                    <span className="inline-flex items-center gap-1 font-bold text-amber-900 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                      <span>💵</span>
                      <span>Cash on Delivery (COD)</span>
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 font-bold text-emerald-900 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                      <span>💳</span>
                      <span>Razorpay Online (Paid)</span>
                    </span>
                  )}
                </div>
              </div>

              <div className="text-left sm:text-right bg-[#FAF7F2] p-2.5 rounded-xl border border-[#EADDCB]">
                <span className="text-[10px] text-[#7D6F63] font-bold uppercase block">Courier & AWB Tracking</span>
                <span className="text-xs font-bold text-[#8B6F4E] block">{trackedOrder.courier || 'Blue Dart Express'}</span>
                <code className="text-[11px] font-mono text-[#232323] font-bold block">{trackedOrder.trackingNumber || 'AWB-PENDING'}</code>
              </div>
            </div>

            {/* 5-Stage Visual Stepper */}
            {!trackingInfo?.isCancelled ? (
              <div className="p-5 bg-white border border-[#EADDCB] rounded-2xl space-y-4 shadow-card">
                <div className="flex items-center justify-between">
                  <h5 className="text-xs font-bold uppercase tracking-wider text-[#232323]">
                    Fulfillment & Delivery Progress
                  </h5>
                  <span className="text-[11px] font-bold text-[#15803D]">
                    Estimated Delivery: 3–4 Business Days
                  </span>
                </div>

                <div className="relative pt-2 pb-1">
                  {/* Step Line */}
                  <div className="hidden sm:block absolute top-5 left-8 right-8 h-1 bg-[#EADDCB] z-0">
                    <div
                      className="h-full bg-[#8B6F4E] transition-all duration-700"
                      style={{ width: `${((trackingInfo?.currentStep || 1) - 1) * 25}%` }}
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-5 gap-3 relative z-10">
                    {[
                      { step: 1, title: '1. Placed', desc: 'Order Confirmed' },
                      { step: 2, title: '2. Atelier', desc: 'Hand-Pouring & Curing' },
                      { step: 3, title: '3. Quality', desc: 'Fragrance Audit' },
                      { step: 4, title: '4. Dispatched', desc: 'Courier In-Transit' },
                      { step: 5, title: '5. Delivered', desc: 'At Your Doorstep' },
                    ].map((st) => {
                      const isCompleted = (trackingInfo?.currentStep || 1) >= st.step;
                      const isCurrent = (trackingInfo?.currentStep || 1) === st.step;

                      return (
                        <div
                          key={st.step}
                          className={`flex sm:flex-col items-center sm:text-center gap-3 sm:gap-2 p-2.5 rounded-xl border transition-all ${
                            isCurrent
                              ? 'bg-[#FDE8EF] border-[#C94C6D] shadow-xs'
                              : isCompleted
                                ? 'bg-[#FAF7F2] border-[#8B6F4E]/30 text-[#232323]'
                                : 'bg-stone-50 border-stone-200 opacity-60 text-stone-400'
                          }`}
                        >
                          <div
                            className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                              isCompleted
                                ? 'bg-[#8B6F4E] text-white shadow-xs'
                                : 'bg-stone-200 text-stone-600'
                            }`}
                          >
                            {isCompleted ? '✓' : st.step}
                          </div>
                          <div>
                            <strong className={`block text-xs ${isCurrent ? 'text-[#C94C6D] font-bold' : 'text-[#232323]'}`}>
                              {st.title}
                            </strong>
                            <span className="text-[10px] text-[#7D6F63] block">
                              {st.desc}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-4 bg-red-50 border border-red-200 rounded-2xl text-center space-y-1">
                <Badge variant="error">ORDER CANCELLED</Badge>
                <p className="text-xs text-red-800 font-medium">
                  This order was cancelled. Any pre-paid balance has been refunded to your original payment method.
                </p>
              </div>
            )}

            {/* Itemized Products Summary */}
            <div className="p-4 bg-white border border-[#EADDCB] rounded-2xl space-y-3 shadow-card">
              <h5 className="font-serif font-bold text-sm text-[#232323] border-b border-[#EADDCB] pb-2 flex justify-between items-center">
                <span>Ordered Formulations ({trackedOrder.itemsList?.length || 1})</span>
                <span className="text-xs font-mono font-bold text-[#8B6F4E]">
                  Total: ₹{Number(trackedOrder.totalAmount || 0).toLocaleString('en-IN')}.00
                </span>
              </h5>

              <div className="space-y-2 text-xs">
                {Array.isArray(trackedOrder.itemsList) && trackedOrder.itemsList.length > 0 ? (
                  trackedOrder.itemsList.map((item: any, idx: number) => (
                    <div key={idx} className="flex items-center justify-between p-2.5 bg-[#FAF7F2] rounded-xl border border-[#EADDCB]">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-lg bg-white border border-[#EADDCB] flex items-center justify-center text-base shrink-0">
                          🕯️
                        </div>
                        <div>
                          <strong className="text-[#232323] block">{item.quantity || 1}x {item.name}</strong>
                          {item.fragrance && <span className="text-[10px] text-[#7D6F63] block">{item.fragrance} • {item.size || 'Classic'}</span>}
                        </div>
                      </div>
                      <span className="font-bold text-[#232323]">
                        ₹{((item.price || 999) * (item.quantity || 1)).toLocaleString('en-IN')}.00
                      </span>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-[#7D6F63] italic">{trackedOrder.items || 'Handcrafted Soy Candle'}</p>
                )}
              </div>

              {/* Delivery Address */}
              <div className="pt-2 border-t border-[#EADDCB] text-xs text-[#5C5149]">
                <strong className="text-[#232323] block text-[11px] uppercase font-bold text-[#7D6F63]">Destination Address:</strong>
                <p className="mt-0.5">{trackedOrder.shippingAddress || trackedOrder.address || 'Address provided at checkout'}</p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  printOrderInvoice(trackedOrder, 'invoice');
                  toast({
                    type: 'luxury',
                    title: 'Preparing Tax Invoice',
                    description: 'Opening A4 printable tax invoice dialog...',
                  });
                }}
              >
                🖨️ Download / Print Tax Invoice (A4)
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowInvoicePreview(true)}
              >
                👁️ Preview Invoice
              </Button>
            </div>
          </div>
        )}

        {/* Invoice Preview Modal */}
        {showInvoicePreview && trackedOrder && (
          <div className="fixed inset-0 z-50 bg-[#1C130E]/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
            <div className="my-8 max-w-4xl w-full">
              <PrintableInvoice
                order={trackedOrder}
                onClose={() => setShowInvoicePreview(false)}
              />
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
};
