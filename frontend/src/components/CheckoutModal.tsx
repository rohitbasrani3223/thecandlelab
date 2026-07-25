"use client";

import React, { useState } from "react";
import { useStore } from "@/context/StoreContext";
import { X, CheckCircle, CreditCard, ShieldCheck, Truck, Lock, FileText, Sparkles } from "lucide-react";

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({ isOpen, onClose }) => {
  const { cart, cartTotal, clearCart, currency, showToast } = useStore();
  const [step, setStep] = useState<"address" | "payment" | "success">("address");

  const [address, setAddress] = useState({
    fullName: "Aarav Sharma",
    phone: "+91 98765 43210",
    email: "aarav.sharma@example.com",
    street: "Flat 402, Royal Palms, MG Road",
    city: "Mumbai",
    state: "Maharashtra",
    pincode: "400001"
  });

  const [paymentMethod, setPaymentMethod] = useState<"upi" | "card" | "razorpay" | "cod">("upi");
  const [couponCode, setCouponCode] = useState("");
  const [appliedDiscount, setAppliedDiscount] = useState(0);

  if (!isOpen) return null;

  const handleApplyCoupon = () => {
    if (couponCode.toUpperCase() === "GLOW15") {
      const discount = Math.round(cartTotal * 0.15);
      setAppliedDiscount(discount);
      showToast("Coupon GLOW15 applied: 15% OFF! 🎉");
    } else {
      showToast("Invalid Coupon Code. Try GLOW15!");
    }
  };

  const finalTotal = Math.max(0, cartTotal - appliedDiscount);

  const handleCompleteOrder = () => {
    setStep("success");
    clearCart();
    showToast("Order placed successfully! Invoice generated. 🎉");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md">
      <div className="relative w-full max-w-3xl bg-brand-surface rounded-2xl border-2 border-brand-gold shadow-2xl p-6 md:p-8 max-h-[90vh] overflow-y-auto">
        
        {/* Close button */}
        <button onClick={onClose} className="absolute top-4 right-4 p-2 text-brand-charcoal hover:bg-brand-beige rounded-full">
          <X className="w-5 h-5" />
        </button>

        {step !== "success" ? (
          <div>
            {/* Header */}
            <div className="flex items-center justify-between border-b border-brand-beige pb-4 mb-6">
              <div>
                <h3 className="font-serif text-2xl font-bold text-brand-charcoal">LUXURY CHECKOUT</h3>
                <p className="text-xs text-brand-earth">Safe & Encrypted Checkout</p>
              </div>

              {/* Progress Steps */}
              <div className="flex items-center gap-2 text-xs font-bold">
                <span className={`px-3 py-1 rounded-full ${step === "address" ? "bg-brand-gold text-brand-charcoal" : "bg-brand-beige text-brand-earth"}`}>
                  1. Address
                </span>
                <span>→</span>
                <span className={`px-3 py-1 rounded-full ${step === "payment" ? "bg-brand-gold text-brand-charcoal" : "bg-brand-beige text-brand-earth"}`}>
                  2. Payment
                </span>
              </div>
            </div>

            {/* Address Step */}
            {step === "address" && (
              <div className="space-y-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-brand-charcoal">Shipping Address</h4>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] font-medium text-brand-earth">Full Name</label>
                    <input
                      type="text"
                      value={address.fullName}
                      onChange={(e) => setAddress({ ...address, fullName: e.target.value })}
                      className="w-full text-xs p-2 rounded.lg border border-brand-beige bg-white"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-medium text-brand-earth">Mobile Number</label>
                    <input
                      type="text"
                      value={address.phone}
                      onChange={(e) => setAddress({ ...address, phone: e.target.value })}
                      className="w-full text-xs p-2 rounded.lg border border-brand-beige bg-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[11px] font-medium text-brand-earth">Street Address</label>
                  <input
                    type="text"
                    value={address.street}
                    onChange={(e) => setAddress({ ...address, street: e.target.value })}
                    className="w-full text-xs p-2 rounded.lg border border-brand-beige bg-white"
                  />
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="text-[11px] font-medium text-brand-earth">City</label>
                    <input
                      type="text"
                      value={address.city}
                      onChange={(e) => setAddress({ ...address, city: e.target.value })}
                      className="w-full text-xs p-2 rounded.lg border border-brand-beige bg-white"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-medium text-brand-earth">State</label>
                    <input
                      type="text"
                      value={address.state}
                      onChange={(e) => setAddress({ ...address, state: e.target.value })}
                      className="w-full text-xs p-2 rounded.lg border border-brand-beige bg-white"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-medium text-brand-earth">Pincode</label>
                    <input
                      type="text"
                      value={address.pincode}
                      onChange={(e) => setAddress({ ...address, pincode: e.target.value })}
                      className="w-full text-xs p-2 rounded.lg border border-brand-beige bg-white"
                    />
                  </div>
                </div>

                <div className="pt-4 flex justify-end">
                  <button
                    onClick={() => setStep("payment")}
                    className="bg-brand-charcoal text-brand-gold px-6 py-2.5 rounded-xl font-bold text-xs hover:bg-brand-gold hover:text-brand-charcoal transition-colors"
                  >
                    Continue to Payment →
                  </button>
                </div>
              </div>
            )}

            {/* Payment Step */}
            {step === "payment" && (
              <div className="space-y-6">
                {/* Coupon Apply */}
                <div className="flex gap-2 bg-white p-3 rounded-xl border border-brand-beige">
                  <input
                    type="text"
                    placeholder="Enter Coupon Code (e.g. GLOW15)"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    className="w-full text-xs px-3 py-1.5 rounded-lg border border-brand-beige uppercase font-mono"
                  />
                  <button
                    onClick={handleApplyCoupon}
                    className="bg-brand-gold text-brand-charcoal px-4 py-1.5 rounded-lg text-xs font-bold hover:bg-brand-goldLight"
                  >
                    Apply
                  </button>
                </div>

                {/* Payment Gateway Options */}
                <div className="space-y-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-brand-charcoal">Select Payment Option</h4>

                  {[
                    { id: "upi", label: "Instant UPI (GPay / PhonePe / Paytm)", icon: "⚡" },
                    { id: "razorpay", label: "Razorpay Secure Gateway (Cards / NetBanking)", icon: "💳" },
                    { id: "card", label: "Credit / Debit Card (Visa, MasterCard)", icon: "🔒" },
                    { id: "cod", label: "Cash on Delivery (+₹50 Handling Fee)", icon: "💵" }
                  ].map((method) => (
                    <label
                      key={method.id}
                      className={`flex items-center justify-between p-3.5 rounded-xl border cursor-pointer transition-all ${
                        paymentMethod === method.id
                          ? "bg-brand-beige/50 border-brand-gold font-bold text-brand-charcoal"
                          : "bg-white border-brand-beige hover:border-brand-gold text-brand-charcoal"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-xl">{method.icon}</span>
                        <span className="text-xs">{method.label}</span>
                      </div>
                      <input
                        type="radio"
                        name="payment"
                        checked={paymentMethod === method.id}
                        onChange={() => setPaymentMethod(method.id as any)}
                        className="text-brand-gold focus:ring-brand-gold"
                      />
                    </label>
                  ))}
                </div>

                {/* Order Summary & Final Button */}
                <div className="bg-white p-4 rounded-xl border border-brand-gold/30 space-y-2">
                  <div className="flex justify-between text-xs text-brand-earth">
                    <span>Subtotal:</span>
                    <span>{currency}{cartTotal}</span>
                  </div>
                  {appliedDiscount > 0 && (
                    <div className="flex justify-between text-xs text-green-700 font-bold">
                      <span>Discount (GLOW15):</span>
                      <span>-{currency}{appliedDiscount}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-xs text-brand-earth">
                    <span>Shipping:</span>
                    <span className="text-green-700 font-bold">FREE</span>
                  </div>
                  <div className="flex justify-between font-serif text-lg font-bold text-brand-charcoal pt-2 border-t border-brand-beige">
                    <span>Amount Payable:</span>
                    <span className="text-brand-gold">{currency}{finalTotal}</span>
                  </div>
                </div>

                <div className="flex justify-between items-center pt-2">
                  <button onClick={() => setStep("address")} className="text-xs text-brand-earth underline">
                    ← Back to Address
                  </button>
                  <button
                    onClick={handleCompleteOrder}
                    className="bg-brand-charcoal text-brand-gold px-8 py-3 rounded-xl font-bold text-xs hover:bg-brand-gold hover:text-brand-charcoal transition-colors shadow-xl"
                  >
                    Pay & Place Order ({currency}{finalTotal}) 🔥
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          /* Success Screen */
          <div className="text-center py-10 space-y-4">
            <div className="w-16 h-16 rounded-full bg-green-100 text-green-600 flex items-center justify-center mx-auto shadow-md">
              <CheckCircle className="w-10 h-10" />
            </div>

            <h3 className="font-serif text-2xl font-bold text-brand-charcoal">ORDER CONFIRMED!</h3>
            <p className="text-xs text-brand-earth max-w-md mx-auto">
              Thank you for choosing The Candle Lab. Order <span className="font-bold text-brand-gold">#TCL-94821</span> has been received and is being hand-poured & wax sealed.
            </p>

            <div className="bg-white p-4 rounded-xl border border-brand-beige max-w-sm mx-auto text-left text-xs space-y-2">
              <p className="font-bold text-brand-charcoal">Estimated Delivery: 2-3 Business Days</p>
              <p className="text-gray-500">Tracking link sent to {address.email}</p>
            </div>

            <div className="flex justify-center gap-3 pt-4">
              <button
                onClick={() => {
                  onClose();
                  setStep("address");
                }}
                className="bg-brand-charcoal text-brand-gold px-6 py-2.5 rounded-xl font-bold text-xs hover:bg-brand-gold hover:text-brand-charcoal transition-colors"
              >
                Continue Shopping
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
