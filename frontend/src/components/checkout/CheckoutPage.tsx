import React, { useState, useEffect } from 'react';
import { CheckoutHeader } from './CheckoutHeader';
import type { CheckoutStep } from './CheckoutHeader';
import { AddressFormStep } from './AddressFormStep';
import type { AddressData } from './AddressFormStep';
import { ShippingMethodStep } from './ShippingMethodStep';
import type { ShippingOption } from './ShippingMethodStep';
import { PaymentMethodStep } from './PaymentMethodStep';
import type { PaymentData } from './PaymentMethodStep';
import { CheckoutTrustBadges } from './CheckoutTrustBadges';
import { OrderSuccessPage } from './OrderSuccessPage';
import { CouponCodeBox } from '../cart/CouponCodeBox';
import { useAuth } from '../../context/AuthContext';
import { useCMS } from '../../context/CMSContext';
import { processRazorpayPayment } from '../../services/razorpay';
import { useToast, Button } from '../../design-system';
import { supabaseFetch } from '../../config/supabaseClient';

export interface CheckoutPageProps {
  onReturnHome?: () => void;
}

export const CheckoutPage: React.FC<CheckoutPageProps> = ({ onReturnHome }) => {
  const { user } = useAuth();
  const { addOrder } = useCMS();
  const { toast } = useToast();
  const [step, setStep] = useState<CheckoutStep | 4>(1);
  const [_isProcessing, setIsProcessing] = useState(false);

  const [cartItems, setCartItems] = useState<any[]>(() => {
    try {
      const saved = localStorage.getItem('tcl_cart_items');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    const handleSync = () => {
      try {
        const saved = localStorage.getItem('tcl_cart_items');
        setCartItems(saved ? JSON.parse(saved) : []);
      } catch {}
    };
    window.addEventListener('tcl-cart-updated', handleSync);
    return () => window.removeEventListener('tcl-cart-updated', handleSync);
  }, []);

  const initialAddress: AddressData = {
    email: user?.email || '',
    firstName: user?.name ? user.name.split(' ')[0] : '',
    lastName: user?.name ? user.name.split(' ').slice(1).join(' ') || '' : '',
    phone: user?.phone || '',
    street: '',
    apartment: '',
    city: 'Mumbai',
    state: 'Maharashtra',
    zip: '',
    country: 'IN',
    saveAddress: true,
    isGuest: !user,
  };

  const initialPayment: PaymentData = {
    method: 'razorpay',
    sameBilling: true,
  };

  const [address, setAddress] = useState<AddressData>(initialAddress);
  const [shipping, setShipping] = useState<ShippingOption>({
    id: 'free-express',
    name: 'Pan-India Express Shipping',
    timeframe: '2 - 3 Business Days',
    price: 0,
    description: 'Complimentary on orders above ₹999.',
  });
  const [payment, setPayment] = useState<PaymentData>(initialPayment);
  const [confirmedOrderNumber, setConfirmedOrderNumber] = useState('');

  const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null);
  const [discountPercent, setDiscountPercent] = useState<number>(0);

  const subtotal = cartItems.reduce((sum, item) => sum + (item.price || 0) * (item.quantity || 1), 0);
  const isFreeShippingEligible = subtotal >= 999;
  const shippingFee = isFreeShippingEligible
    ? (shipping.id === 'vip-courier' ? 99 : 0)
    : (shipping.price || 99);

  const discountAmount = appliedCoupon ? Math.round((subtotal * discountPercent) / 100) : 0;
  const totalAmount = Math.max(0, Math.round(subtotal - discountAmount + shippingFee));

  const completeOrderSave = async (paymentId?: string, razorpayOrderId?: string) => {
    const isCOD = payment.method === 'cod';
    const orderNumber = razorpayOrderId ? `#${razorpayOrderId}` : `#TCL-2026-${Math.floor(1000 + Math.random() * 9000)}`;

    const itemsSummaryStr = cartItems.length > 0
      ? cartItems.map((i) => `${i.quantity || 1}x ${i.name} (${[i.fragrance, i.size, i.wickType || i.wick, i.color].filter(Boolean).join(' • ')})`).join(', ')
      : '1x Custom Artisanal Candle';

    const orderItemsArr = cartItems.map((i) => ({
      name: i.name,
      fragrance: i.fragrance || 'Signature Blend',
      size: i.size || 'Standard',
      color: i.color || 'Classic Vessel',
      wickType: i.wickType || i.wick || 'Wood Wick',
      giftPackaging: Boolean(i.giftPackaging),
      customMessage: i.customMessage || '',
      sku: i.sku || `TCL-${i.id?.slice(0, 5) || '101'}`,
      quantity: i.quantity || 1,
      price: i.price || 999,
      image: i.image || '',
    }));

    const newOrder = {
      id: orderNumber,
      orderNumber,
      date: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
      status: isCOD ? 'COD_PENDING' : 'PAID',
      badgeVariant: isCOD ? 'warning' : 'pink',
      itemsSummary: itemsSummaryStr,
      items: orderItemsArr,
      totalAmount: `₹${totalAmount.toLocaleString('en-IN')}`,
      paymentMethod: isCOD ? 'Cash on Delivery (COD)' : 'Razorpay Online (UPI/Cards)',
      paymentId: paymentId || (isCOD ? 'COD_ORDER' : 'PAY_RAZORPAY_SUCCESS'),
      trackingNumber: `AWB${Date.now().toString().slice(-8)}`,
      customerName: `${address.firstName} ${address.lastName}`.trim() || 'Valued Customer',
      customerEmail: address.email || user?.email || '',
      customerPhone: address.phone || '',
      shippingAddress: `${address.street}, ${address.apartment ? address.apartment + ', ' : ''}${address.city}, ${address.state} ${address.zip}`,
    };

    setConfirmedOrderNumber(orderNumber);

    try {
      addOrder({
        id: orderNumber,
        customerName: newOrder.customerName,
        email: newOrder.customerEmail,
        phone: newOrder.customerPhone,
        address: newOrder.shippingAddress,
        items: itemsSummaryStr,
        itemsList: orderItemsArr,
        totalAmount: totalAmount,
        paymentMethod: newOrder.paymentMethod,
        status: isCOD ? 'Pending' : 'Processing',
        date: new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }),
      });
    } catch (e) {
      console.warn('CMS addOrder note:', e);
    }

    try {
      await supabaseFetch('orders', {
        method: 'POST',
        body: {
          order_number: orderNumber,
          customer_name: newOrder.customerName,
          customer_email: newOrder.customerEmail,
          total_amount: totalAmount,
          payment_method: isCOD ? 'COD' : 'RAZORPAY',
          order_status: isCOD ? 'Pending COD' : 'Paid',
          shipping_address: newOrder.shippingAddress,
        },
      });
    } catch (e) {
      console.warn('Supabase order insert note:', e);
    }

    try {
      const existingOrders = JSON.parse(localStorage.getItem('tcl_user_orders') || '[]');
      localStorage.setItem('tcl_user_orders', JSON.stringify([newOrder, ...existingOrders]));

      const cmsOrders = JSON.parse(localStorage.getItem('tcl_cms_orders') || '[]');
      localStorage.setItem('tcl_cms_orders', JSON.stringify([newOrder, ...cmsOrders]));
      window.dispatchEvent(new Event('tcl-orders-updated'));
    } catch (e) {}

    try {
      localStorage.removeItem('tcl_cart_items');
      window.dispatchEvent(new Event('tcl-cart-updated'));
    } catch {}

    setIsProcessing(false);
    setStep(4);
  };

  const handlePlaceOrder = async (payData?: PaymentData) => {
    const activePayment = payData || payment;
    setIsProcessing(true);

    if (activePayment.method === 'cod') {
      toast({
        type: 'luxury',
        title: 'Order Placed with COD!',
        description: 'Thank you! Your candle order has been received.',
      });
      await completeOrderSave();
      return;
    }

    try {
      const fullName = `${address.firstName} ${address.lastName}`.trim() || 'Valued Customer';
      const email = (address.email || user?.email || '').trim();
      const phone = (address.phone || '').replace(/[^0-9+]/g, '');

      await processRazorpayPayment({
        amountInRupees: totalAmount,
        customerName: fullName,
        customerEmail: email,
        customerPhone: phone,
        description: 'Payment for The Candle Lab Luxury Soy Candles',
        onSuccess: async (paymentId: string, orderId: string) => {
          toast({
            type: 'luxury',
            title: 'Payment Successful!',
            description: `Payment ID: ${paymentId}. Confirming your order...`,
          });
          await completeOrderSave(paymentId, orderId);
        },
        onFailure: (errorMessage: string) => {
          setIsProcessing(false);
          toast({
            type: 'error',
            title: 'Payment Failed',
            description: errorMessage || 'Payment could not be completed. Please try again or select Cash on Delivery.',
          });
        },
        onDismiss: () => {
          setIsProcessing(false);
          toast({
            type: 'info',
            title: 'Payment Window Closed',
            description: 'You can try again or select Cash on Delivery (COD).',
          });
        },
      });
    } catch (err: any) {
      console.error('Razorpay SDK Exception:', err);
      setIsProcessing(false);
      toast({
        type: 'error',
        title: 'Payment Error',
        description: err?.message || 'Payment process encountered an error.',
      });
    }
  };

  if (step === 4) {
    return (
      <OrderSuccessPage
        orderDetails={{
          orderNumber: confirmedOrderNumber,
          email: address.email || user?.email || '',
          customerName: `${address.firstName} ${address.lastName}`.trim() || 'Valued Customer',
          items: cartItems,
          totalAmount: totalAmount,
          isCOD: payment.method === 'cod',
          shippingAddress: `${address.street}, ${address.city}, ${address.state} ${address.zip}`,
        }}
        onReturnHome={onReturnHome}
      />
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="w-full bg-[#F8F6F0] min-h-screen font-sans">
        <CheckoutHeader currentStep={1} onStepClick={() => {}} />
        <div className="max-w-xl mx-auto px-4 py-20 text-center space-y-6">
          <div className="w-20 h-20 bg-[#FAF7F2] rounded-full flex items-center justify-center mx-auto text-4xl border border-[#EADDCB] shadow-sm">
            🕯️
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#232323]">
              Your Shopping Bag is Empty
            </h2>
            <p className="text-xs sm:text-sm text-[#7D6F63] leading-relaxed">
              Please add at least one handcrafted candle or botanical diffuser to proceed with checkout.
            </p>
          </div>
          <Button
            variant="pink"
            size="lg"
            onClick={() => {
              window.location.hash = '#shop';
            }}
          >
            Explore Collections & Shop →
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full bg-[#F8F6F0] min-h-screen font-sans">
      <CheckoutHeader currentStep={step as CheckoutStep} onStepClick={(s) => setStep(s)} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 py-6 sm:py-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-8 min-w-0 bg-[#FFFFFF] p-4 sm:p-8 rounded-3xl border border-[#EADDCB] shadow-card">
            {step === 1 && (
              <AddressFormStep
                initialData={address}
                cartItems={cartItems}
                subtotal={subtotal}
                onNext={(data) => {
                  setAddress(data);
                  setStep(2);
                }}
              />
            )}

            {step === 2 && (
              <ShippingMethodStep
                selectedOptionId={shipping.id}
                subtotal={subtotal}
                onBack={() => setStep(1)}
                onNext={(opt) => {
                  setShipping(opt);
                  setStep(3);
                }}
              />
            )}

            {step === 3 && (
              <PaymentMethodStep
                initialData={payment}
                onBack={() => setStep(2)}
                onNext={(pay) => {
                  setPayment(pay);
                  handlePlaceOrder(pay);
                }}
              />
            )}
          </div>

          <div className="lg:col-span-4 space-y-5 lg:sticky lg:top-24">
            <div className="bg-[#FFFFFF] border border-[#EADDCB] rounded-3xl p-5 space-y-4 shadow-card">
              <div className="flex items-center justify-between border-b border-[#EADDCB] pb-3">
                <h3 className="font-serif font-bold text-base text-[#232323]">
                  Order Items ({cartItems.reduce((sum, i) => sum + (i.quantity || 1), 0)})
                </h3>
                <span className="text-[10px] font-bold text-[#8B6F4E] bg-[#FAF7F2] px-2.5 py-0.5 rounded-full border border-[#EADDCB]">
                  {isFreeShippingEligible ? 'FREE SHIPPING' : '₹999+ FREE'}
                </span>
              </div>

              <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
                {cartItems.map((item, idx) => (
                  <div key={item.id || idx} className="flex items-start gap-3 text-xs border-b border-[#EADDCB]/60 pb-3 last:border-0 last:pb-0">
                    <div className="w-12 h-12 rounded-xl bg-[#FAF7F2] border border-[#EADDCB] shrink-0 overflow-hidden flex items-center justify-center">
                      {item.image ? (
                        <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                      ) : (
                        <span className="text-base">🕯️</span>
                      )}
                    </div>

                    <div className="flex-1 min-w-0 space-y-0.5">
                      <h4 className="font-bold text-[#232323] truncate">{item.name}</h4>
                      <div className="text-[10px] text-[#7D6F63] space-y-0.5">
                        {item.fragrance && (
                          <span className="text-[#C94C6D] font-medium block truncate">
                            🌸 {item.fragrance}
                          </span>
                        )}
                        <span className="block truncate">
                          {[item.size, item.wickType || item.wick, item.color].filter(Boolean).join(' • ') || 'Standard Luxury'}
                        </span>
                        {item.giftPackaging && (
                          <span className="text-[#C94C6D] font-semibold block text-[9px]">
                            🎁 Luxury Gift Box
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <span className="font-bold text-[#232323] block">
                        ₹{Math.round((item.price || 0) * (item.quantity || 1)).toLocaleString('en-IN')}
                      </span>
                      <span className="text-[10px] text-[#7D6F63]">Qty: {item.quantity || 1}</span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="pt-2">
                <CouponCodeBox
                  appliedCoupon={appliedCoupon}
                  onApplyCoupon={(code, percent) => {
                    setAppliedCoupon(code);
                    setDiscountPercent(percent);
                  }}
                  onRemoveCoupon={() => {
                    setAppliedCoupon(null);
                    setDiscountPercent(0);
                  }}
                  discountPercentage={discountPercent}
                />
              </div>

              <div className="pt-3 border-t border-[#EADDCB] space-y-2 text-xs">
                <div className="flex justify-between text-[#7D6F63]">
                  <span>Subtotal</span>
                  <span className="font-semibold text-[#232323]">₹{subtotal.toLocaleString('en-IN')}</span>
                </div>

                {discountAmount > 0 && (
                  <div className="flex justify-between text-[#15803D] font-bold">
                    <span>Promo Savings ({appliedCoupon})</span>
                    <span>-₹{discountAmount.toLocaleString('en-IN')}</span>
                  </div>
                )}

                <div className="flex justify-between text-[#7D6F63]">
                  <span>Delivery ({isFreeShippingEligible ? 'Pan-India Free Express' : 'Standard Express'})</span>
                  <span>
                    {shippingFee === 0 ? (
                      <strong className="text-[#15803D]">FREE</strong>
                    ) : (
                      `₹${shippingFee}`
                    )}
                  </span>
                </div>

                <div className="flex justify-between items-baseline pt-2 border-t border-[#EADDCB] text-sm font-bold text-[#232323]">
                  <span className="font-serif">Grand Total</span>
                  <span className="text-xl font-serif text-[#8B6F4E]">
                    ₹{totalAmount.toLocaleString('en-IN')}
                  </span>
                </div>
              </div>
            </div>

            <CheckoutTrustBadges />
          </div>
        </div>
      </div>
    </div>
  );
};
