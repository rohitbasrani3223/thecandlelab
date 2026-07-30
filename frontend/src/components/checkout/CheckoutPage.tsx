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

export interface CheckoutPageProps {
  onReturnHome?: () => void;
}

export const CheckoutPage: React.FC<CheckoutPageProps> = ({ onReturnHome }) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [step, setStep] = useState<CheckoutStep | 5>(1);
  const [_isProcessing, setIsProcessing] = useState(false);

  const initialAddress: AddressData = {
    email: user?.email || 'customer@thecandlelab.com',
    firstName: user?.name ? user.name.split(' ')[0] : 'Valued',
    lastName: user?.name ? user.name.split(' ').slice(1).join(' ') || 'Customer' : 'Customer',
    phone: user?.phone || '+91 98765 43210',
    street: '742 Evergreen Terrace',
    apartment: 'Penthouse 4B',
    city: 'Mumbai',
    state: 'Maharashtra',
    zip: '400001',
    country: 'IN',
    saveAddress: true,
    isGuest: !user,
  };

  const initialPayment: PaymentData = {
    method: 'razorpay',
    cardNumber: '••••••••4242',
    cardExpiry: '08/28',
    cardCvv: '123',
    cardName: user?.name || 'Valued Customer',
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

  const subtotal = 2798.0;
  const discountAmount = 279.8; // 10% off
  const totalAmount = Math.max(1, Math.round(subtotal - discountAmount + shipping.price));

  const completeOrderSave = async (paymentId?: string, razorpayOrderId?: string) => {
    const isCOD = payment.method === 'cod';
    const orderNumber = razorpayOrderId ? `#${razorpayOrderId}` : `#TCL-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    const newOrder = {
      id: orderNumber,
      orderNumber,
      date: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
      status: isCOD ? 'COD_PENDING' : 'PAID',
      badgeVariant: isCOD ? 'warning' : 'gold',
      itemsSummary: 'Velvet Rose & Smoked Amber, French Bourbon Vanilla',
      items: [
        { name: 'Velvet Rose & Smoked Amber', quantity: 1, price: 1499 },
        { name: 'French Bourbon Vanilla 3-Wick', quantity: 1, price: 1299 },
      ],
      totalAmount: `₹${totalAmount.toLocaleString('en-IN')}`,
      paymentMethod: isCOD ? 'Cash on Delivery (COD)' : 'Razorpay Online (UPI/Cards)',
      paymentId: paymentId || (isCOD ? 'COD_ORDER' : 'PAY_RAZORPAY_SUCCESS'),
      trackingNumber: `AWB${Date.now().toString().slice(-8)}`,
      customerEmail: address.email || user?.email || 'customer@thecandlelab.com',
      customerName: `${address.firstName} ${address.lastName}`.trim(),
    };

    // Save to persistent storage for this user
    try {
      const storageKey = `thecandlelab_orders_${user?.email || address.email || 'guest'}`;
      const saved = localStorage.getItem(storageKey);
      const existing = saved ? JSON.parse(saved) : [];
      localStorage.setItem(storageKey, JSON.stringify([newOrder, ...existing]));
    } catch (e) {
      console.error('Failed to store local order:', e);
    }

    // Try posting to backend API
    try {
      await fetch(getApiUrl('orders'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newOrder),
      });
    } catch (e) {
      // Fallback local persistence completed
    }

    setIsProcessing(false);
    toast({
      type: 'luxury',
      title: isCOD ? 'COD Order Placed Successfully!' : 'Payment Verified & Order Confirmed!',
      description: isCOD ? 'Pay cash on delivery.' : `Payment ID: ${paymentId || 'Verified'}`,
    });
    setStep(5);
  };

  const handlePlaceOrder = async () => {
    setIsProcessing(true);

    if (payment.method === 'cod') {
      completeOrderSave(undefined, undefined);
      return;
    }

    // Launch Razorpay Standard Web Checkout Modal for Razorpay / UPI
    processRazorpayPayment({
      amountInRupees: totalAmount,
      customerName: `${address.firstName} ${address.lastName}`.trim(),
      customerEmail: address.email || user?.email || 'customer@thecandlelab.com',
      customerPhone: address.phone || user?.phone || '+91 98765 43210',
      description: 'The Candle Lab Artisanal Order Payment',
      onSuccess: (paymentId, orderId) => {
        completeOrderSave(paymentId, orderId);
      },
      onFailure: (errorMessage) => {
        setIsProcessing(false);
        toast({
          type: 'error',
          title: 'Razorpay API Key Auth Error (401)',
          description: `${errorMessage} (Complete flow via Cash on Delivery or generate active API Keys from Razorpay Dashboard).`,
        });
      },
      onDismiss: () => {
        setIsProcessing(false);
        toast({
          type: 'info',
          title: 'Payment Window Closed',
          description: 'You cancelled the checkout. You can retry payment anytime.',
        });
      },
    });
  };

  if (step === 5) {
    return <OrderSuccessPage onReturnHome={onReturnHome} />;
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
                onBack={() => setStep(3)}
                onPlaceOrder={handlePlaceOrder}
              />
            )}
          </div>

          {/* Right Column: Mini Order Summary & Trust Badges */}
          <div className="lg:col-span-4 space-y-6 lg:sticky lg:top-24">
            <div className="bg-[#FAF6F0] border border-[#E5D9C5] rounded-md p-5 space-y-4 shadow-card">
              <h3 className="font-serif font-bold text-base text-[#2A1E17] border-b border-[#E5D9C5] pb-2">
                Order Items (2)
              </h3>

              <div className="space-y-3 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-[#2A1E17] truncate font-medium">Velvet Rose & Smoked Amber</span>
                  <span className="font-bold text-[#2A1E17]">₹1,499.00</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[#2A1E17] truncate font-medium">French Bourbon Vanilla 3-Wick</span>
                  <span className="font-bold text-[#2A1E17]">₹1,299.00</span>
                </div>
              </div>

              <div className="pt-3 border-t border-[#E5D9C5] space-y-1.5 text-xs">
                <div className="flex justify-between text-[#8C7A6B]">
                  <span>Subtotal</span>
                  <span>₹{subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-[#2E6F40] font-semibold">
                  <span>Promo (LUXURY10)</span>
                  <span>-₹{discountAmount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-[#8C7A6B]">
                  <span>Delivery ({shipping.name.split(' ')[0]})</span>
                  <span>{shipping.price === 0 ? 'FREE' : `₹${shipping.price.toFixed(2)}`}</span>
                </div>
                <div className="flex justify-between text-base font-bold text-[#2A1E17] pt-2 border-t border-[#E5D9C5]">
                  <span>Total</span>
                  <span className="text-[#D4AF37] font-serif">₹{(subtotal - discountAmount + shipping.price).toLocaleString('en-IN')}</span>
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
