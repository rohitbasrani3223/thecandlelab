import React, { useState } from 'react';
import { CheckoutHeader } from './CheckoutHeader';

import type { CheckoutStep } from './CheckoutHeader';
import { AddressFormStep } from './AddressFormStep';
import type { AddressData } from './AddressFormStep';
import { ShippingMethodStep } from './ShippingMethodStep';
import type { ShippingOption } from './ShippingMethodStep';
import { PaymentMethodStep } from './PaymentMethodStep';
import type { PaymentData } from './PaymentMethodStep';

import { OrderReviewStep } from './OrderReviewStep';
import { CheckoutTrustBadges } from './CheckoutTrustBadges';
import { OrderSuccessPage } from './OrderSuccessPage';
import { useAuth } from '../../context/AuthContext';
import { getApiUrl } from '../../config/api';
import { processRazorpayPayment } from '../../services/razorpay';
import { useToast } from '../../design-system';
import { supabaseFetch } from '../../config/supabaseClient';

export interface CheckoutPageProps {
  onReturnHome?: () => void;
}

export const CheckoutPage: React.FC<CheckoutPageProps> = ({ onReturnHome }) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [step, setStep] = useState<CheckoutStep | 5>(1);
  const [_isProcessing, setIsProcessing] = useState(false);

  const initialAddress: AddressData = {
    email: user?.email || '',
    firstName: user?.name ? user.name.split(' ')[0] : '',
    lastName: user?.name ? user.name.split(' ').slice(1).join(' ') || '' : '',
    phone: user?.phone || '',
    street: '',
    apartment: '',
    city: '',
    state: '',
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
    id: 'gold-express',
    name: 'Complimentary Gold Express Shipping',
    timeframe: '2 - 3 Business Days',
    price: 0,
    description: 'Packed in heavy gold foil gift box.',
  });
  const [payment, setPayment] = useState<PaymentData>(initialPayment);

  const [cartItems] = useState<any[]>(() => {
    try {
      const saved = localStorage.getItem('tcl_cart_items');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const subtotal = cartItems.reduce((sum, item) => sum + (item.price || 0) * (item.quantity || 1), 0);
  const discountAmount = Math.round(subtotal * 0.1); // 10% off coupon
  const totalAmount = Math.max(0, Math.round(subtotal - discountAmount + shipping.price));

  const completeOrderSave = async (paymentId?: string, razorpayOrderId?: string) => {
    const isCOD = payment.method === 'cod';
    const orderNumber = razorpayOrderId ? `#${razorpayOrderId}` : `#TCL-2026-${Math.floor(1000 + Math.random() * 9000)}`;

    const itemsSummaryStr = cartItems.length > 0
      ? cartItems.map((i) => `${i.quantity}x ${i.name} (${i.size || '12oz'})`).join(', ')
      : '1x Custom Artisanal Candle (12oz)';

    const orderItemsArr = cartItems.length > 0
      ? cartItems.map((i) => ({ name: i.name, quantity: i.quantity, price: i.price }))
      : [{ name: 'Custom Artisanal Candle', quantity: 1, price: subtotal }];

    const newOrder = {
      id: orderNumber,
      orderNumber,
      date: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
      status: isCOD ? 'COD_PENDING' : 'PAID',
      badgeVariant: isCOD ? 'warning' : 'gold',
      itemsSummary: itemsSummaryStr,
      items: orderItemsArr,
      totalAmount: `₹${totalAmount.toLocaleString('en-IN')}`,
      paymentMethod: isCOD ? 'Cash on Delivery (COD)' : 'Razorpay Online (UPI/Cards)',
      paymentId: paymentId || (isCOD ? 'COD_ORDER' : 'PAY_RAZORPAY_SUCCESS'),
      trackingNumber: `AWB${Date.now().toString().slice(-8)}`,
      customerEmail: address.email || user?.email || '',
      shippingAddress: `${address.street}, ${address.apartment ? address.apartment + ', ' : ''}${address.city}, ${address.state} ${address.zip}`,
    };

    // 1. Direct Supabase PostgreSQL Database Insert
    try {
      await supabaseFetch('orders', {
        method: 'POST',
        body: {
          order_number: orderNumber,
          customer_name: `${address.firstName} ${address.lastName}`.trim() || 'Valued Customer',
          customer_email: address.email || user?.email || 'customer@example.com',
          total_amount: totalAmount,
          payment_method: isCOD ? 'COD' : 'RAZORPAY',
          order_status: isCOD ? 'Pending COD' : 'Paid',
          shipping_address: `${address.street}, ${address.city}, ${address.state}`,
        },
      });
    } catch (e) {
      console.warn('Supabase order insert note:', e);
    }

    // 2. Direct Backend API fetch fallback
    try {
      await fetch(getApiUrl('orders'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          order_number: orderNumber,
          customer_name: `${address.firstName} ${address.lastName}`.trim() || 'Valued Customer',
          customer_email: address.email || user?.email || '',
          total_amount: totalAmount,
          payment_method: isCOD ? 'COD' : 'RAZORPAY',
          order_status: isCOD ? 'Pending COD' : 'Paid',
          shipping_address: `${address.street}, ${address.city}`,
        }),
      });
    } catch { }

    // 3. Client Local Storage Sync for zero-latency UI update
    try {
      const existingOrders = JSON.parse(localStorage.getItem('tcl_user_orders') || '[]');
      localStorage.setItem('tcl_user_orders', JSON.stringify([newOrder, ...existingOrders]));

      const cmsOrders = JSON.parse(localStorage.getItem('tcl_cms_orders') || '[]');
      const newCmsOrder = {
        id: orderNumber,
        customerName: `${address.firstName} ${address.lastName}`.trim() || 'Valued Customer',
        email: address.email || user?.email || '',
        items: itemsSummaryStr || 'Artisanal Candle Formulation',
        totalAmount: totalAmount,
        paymentMethod: isCOD ? 'COD' : 'Razorpay Online',
        status: isCOD ? 'Pending COD' : 'Processing',
        date: new Date().toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' }),
      };
      localStorage.setItem('tcl_cms_orders', JSON.stringify([newCmsOrder, ...cmsOrders]));
      window.dispatchEvent(new Event('tcl-orders-updated'));
    } catch (e) { }

    // Clear cart upon successful checkout
    try {
      localStorage.removeItem('tcl_cart_items');
      window.dispatchEvent(new Event('tcl-cart-updated'));
    } catch { }

    setIsProcessing(false);
    toast({
      type: 'luxury',
      title: isCOD ? 'COD Order Placed Successfully!' : 'Payment Verified & Order Confirmed!',
      description: isCOD ? 'Pay cash on delivery.' : `Payment ID: ${paymentId || 'Verified'}`,
    });
    setStep(5); // Go to Order Success screen
  };

  const handlePlaceOrder = async () => {
    setIsProcessing(true);

    if (payment.method === 'cod') {
      await completeOrderSave('COD_' + Date.now(), 'COD_ORDER');
      return;
    }

    // Razorpay Online Gateway Integration
    try {
      const fullName = `${address.firstName} ${address.lastName}`.trim() || user?.name || '';
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
            description: 'Payment window was closed. Click Pay Securely to try again or select Cash on Delivery.',
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

  if (step === 5) {
    return (
      <OrderSuccessPage
        orderDetails={{
          orderNumber: `#TCL-2026-${Math.floor(1000 + Math.random() * 9000)}`,
          email: address.email || user?.email || '',
          customerName: `${address.firstName} ${address.lastName}`.trim() || 'Valued Customer',
          items: cartItems,
          totalAmount: totalAmount,
          isCOD: payment.method === 'cod',
          shippingAddress: `${address.street}, ${address.city}`,
        }}
        onReturnHome={onReturnHome}
      />
    );
  }

  return (
    <div className="w-full bg-[#FAF6F0] min-h-screen font-sans">
      {/* Checkout Stepper Header */}
      <CheckoutHeader currentStep={step as CheckoutStep} onStepClick={(s) => setStep(s)} />

      {/* Main Checkout Viewport */}
      <div className="max-w-7xl mx-auto px-6 sm:px-12 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* Left Column: Active Step Form */}
          <div className="lg:col-span-8 bg-[#FAF6F0] p-6 sm:p-8 rounded-md border border-[#E5D9C5] shadow-card">
            {step === 1 && (
              <AddressFormStep
                initialData={address}
                onNext={(data) => {
                  setAddress(data);
                  setStep(2);
                }}
              />
            )}

            {step === 2 && (
              <ShippingMethodStep
                selectedOptionId={shipping.id}
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
                  setStep(4);
                }}
              />
            )}

            {step === 4 && (
              <OrderReviewStep
                addressData={address}
                shippingOption={shipping}
                paymentData={payment}
                subtotal={subtotal}
                discountAmount={discountAmount}
                cartItems={cartItems}
                onBack={() => setStep(3)}
                onPlaceOrder={handlePlaceOrder}
              />
            )}
          </div>

          {/* Right Column: Mini Order Summary & Trust Badges */}
          <div className="lg:col-span-4 space-y-6 lg:sticky lg:top-24">
            <div className="bg-[#FAF6F0] border border-[#E5D9C5] rounded-md p-5 space-y-4 shadow-card">
              <h3 className="font-serif font-bold text-base text-[#2A1E17] border-b border-[#E5D9C5] pb-2">
                Order Items ({cartItems.reduce((sum, i) => sum + (i.quantity || 1), 0)})
              </h3>

              <div className="space-y-3 text-xs max-h-52 overflow-y-auto pr-1">
                {cartItems.length === 0 ? (
                  <p className="text-[#8C7A6B] italic py-2">No items in bag</p>
                ) : (
                  cartItems.map((item, idx) => (
                    <div key={item.id || idx} className="flex items-center justify-between gap-2">
                      <span className="text-[#2A1E17] truncate font-medium">
                        {item.quantity}x {item.name} ({item.size || '12oz'})
                      </span>
                      <span className="font-bold text-[#2C1E16] shrink-0">
                        ₹{Math.round((item.price || 0) * (item.quantity || 1)).toLocaleString('en-IN')}
                      </span>
                    </div>
                  ))
                )}
              </div>

              <div className="pt-3 border-t border-[#E5D9C5] space-y-1.5 text-xs">
                <div className="flex justify-between text-[#8C7A6B]">
                  <span>Subtotal</span>
                  <span>₹{subtotal.toLocaleString('en-IN')}</span>
                </div>
                {discountAmount > 0 && (
                  <div className="flex justify-between text-[#2E6F40] font-semibold">
                    <span>Promo (LUXURY10)</span>
                    <span>-₹{discountAmount.toLocaleString('en-IN')}</span>
                  </div>
                )}
                <div className="flex justify-between text-[#8C7A6B]">
                  <span>Delivery ({shipping.price === 0 ? 'Complimentary' : 'Standard'})</span>
                  <span>{shipping.price === 0 ? 'FREE' : `₹${shipping.price}`}</span>
                </div>
                <div className="flex justify-between text-[#2A1E17] font-bold text-sm pt-2 border-t border-[#E5D9C5]">
                  <span>Total</span>
                  <span className="text-[#B88B38]">₹{totalAmount.toLocaleString('en-IN')}</span>
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
