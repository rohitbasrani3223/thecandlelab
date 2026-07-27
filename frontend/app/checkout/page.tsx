"use client";

import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Sparkles, ShieldCheck, CheckCircle2, CreditCard, Truck, ArrowLeft } from "lucide-react";
import Link from "next/link";
import confetti from "canvas-confetti";

export default function CheckoutPage() {
  const [paymentMethod, setPaymentMethod] = useState<"RAZORPAY" | "COD">("RAZORPAY");
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [orderId, setOrderId] = useState("");

  const [name, setName] = useState("Aarav Sharma");
  const [phone, setPhone] = useState("+91 98765 43210");
  const [email, setEmail] = useState("aarav@gmail.com");
  const [address, setAddress] = useState("Flat 402, Luxury Heights, MG Road");
  const [city, setCity] = useState("Bengaluru");
  const [pincode, setPincode] = useState("560001");

  const handlePlaceOrder = (e: React.FormEvent) => {
    e.preventDefault();
    const newOrdId = "ORD-2026-" + Math.floor(1000 + Math.random() * 9000);
    setOrderId(newOrdId);

    // Trigger confetti celebration
    try {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch (e) {}

    setIsSuccessModalOpen(true);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF8F4] font-sans">
      <Navbar cartCount={2} onOpenCart={() => {}} />

      <main className="flex-1 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full">
        <Link href="/shop" className="inline-flex items-center gap-1 text-xs font-semibold text-[#8B6B47] hover:underline mb-6">
          <ArrowLeft className="w-4 h-4" /> Back to Shop Catalog
        </Link>

        <h1 className="font-serif-luxury font-bold text-3xl text-[#2C2820] mb-8">
          Secure Luxury Checkout
        </h1>

        <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Shipping Form & Payment */}
          <div className="lg:col-span-2 space-y-6">
            {/* Address */}
            <div className="bg-white p-6 rounded-3xl border border-[#EDE8DF] shadow-sm space-y-4">
              <h3 className="font-serif-luxury font-bold text-lg text-[#2C2820] flex items-center gap-2">
                <Truck className="w-5 h-5 text-[#C9A84C]" /> 1. Shipping Address Details
              </h3>

              <div className="grid-2">
                <div className="form-group">
                  <label className="form-label">Full Name *</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="input"
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Phone Number *</label>
                  <input
                    type="text"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="input"
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Email Address *</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="input"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Street Address / Landmark *</label>
                <input
                  type="text"
                  required
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="input"
                />
              </div>

              <div className="grid-2">
                <div className="form-group">
                  <label className="form-label">City *</label>
                  <input
                    type="text"
                    required
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="input"
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Pincode *</label>
                  <input
                    type="text"
                    required
                    value={pincode}
                    onChange={(e) => setPincode(e.target.value)}
                    className="input"
                  />
                </div>
              </div>
            </div>

            {/* Payment Method Selector */}
            <div className="bg-white p-6 rounded-3xl border border-[#EDE8DF] shadow-sm space-y-4">
              <h3 className="font-serif-luxury font-bold text-lg text-[#2C2820] flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-[#C9A84C]" /> 2. Choose Payment Method
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <label
                  onClick={() => setPaymentMethod("RAZORPAY")}
                  className={`p-4 rounded-2xl border cursor-pointer flex items-center gap-3 transition-all ${
                    paymentMethod === "RAZORPAY"
                      ? "border-[#C9A84C] bg-[#FFF8EC]"
                      : "border-[#DDD5C4] bg-[#FAF8F4]"
                  }`}
                >
                  <input
                    type="radio"
                    name="payment"
                    checked={paymentMethod === "RAZORPAY"}
                    readOnly
                  />
                  <div>
                    <p className="font-bold text-xs text-[#2C2820]">Razorpay Online Payment</p>
                    <p className="text-[10px] text-[#9B9591]">UPI, Credit/Debit Cards, NetBanking</p>
                  </div>
                </label>

                <label
                  onClick={() => setPaymentMethod("COD")}
                  className={`p-4 rounded-2xl border cursor-pointer flex items-center gap-3 transition-all ${
                    paymentMethod === "COD"
                      ? "border-[#C9A84C] bg-[#FFF8EC]"
                      : "border-[#DDD5C4] bg-[#FAF8F4]"
                  }`}
                >
                  <input
                    type="radio"
                    name="payment"
                    checked={paymentMethod === "COD"}
                    readOnly
                  />
                  <div>
                    <p className="font-bold text-xs text-[#2C2820]">Cash On Delivery (COD)</p>
                    <p className="text-[10px] text-[#9B9591]">Pay cash when delivered</p>
                  </div>
                </label>
              </div>
            </div>
          </div>

          {/* Order Summary Right Card */}
          <div className="space-y-4">
            <div className="bg-white p-6 rounded-3xl border border-[#EDE8DF] shadow-sm space-y-4 sticky top-24">
              <h3 className="font-serif-luxury font-bold text-lg text-[#2C2820] border-b border-[#EDE8DF] pb-3">
                Order Summary
              </h3>

              <div className="space-y-3 text-xs">
                <div className="flex justify-between">
                  <span>French Vanilla Scented Jar (x1)</span>
                  <span className="font-semibold">₹899</span>
                </div>
                <div className="flex justify-between">
                  <span>Amber & Oud Royal Glass (x1)</span>
                  <span className="font-semibold">₹1,299</span>
                </div>
                <div className="flex justify-between text-[#2D7A4F] font-semibold">
                  <span>Coupon LUXURY20 (20% OFF)</span>
                  <span>-₹439</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping Fee</span>
                  <span className="text-[#2D7A4F] font-bold">FREE</span>
                </div>

                <div className="pt-3 border-t border-[#EDE8DF] flex justify-between font-extrabold text-base text-[#2C2820]">
                  <span>Total Payable</span>
                  <span className="text-[#2D7A4F]">₹1,759</span>
                </div>
              </div>

              <button
                type="submit"
                className="btn-luxury w-full py-3.5 gap-2 text-sm justify-center font-bold"
              >
                <span>Confirm & Place Order</span>
                <CheckCircle2 className="w-4 h-4" />
              </button>

              <p className="text-[10px] text-[#9B9591] text-center flex items-center justify-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-[#2D7A4F]" /> Guaranteed Safe Checkout
              </p>
            </div>
          </div>
        </form>
      </main>

      {/* Order Confirmation Modal */}
      {isSuccessModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-8 max-w-md w-full text-center space-y-4 border border-[#EDE8DF] shadow-2xl animate-in zoom-in-95">
            <div className="w-16 h-16 rounded-full bg-[#EDFAF4] text-[#2D7A4F] flex items-center justify-center mx-auto shadow-md">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <span className="text-xs font-bold text-[#C9A84C] uppercase tracking-widest">
              ORDER CONFIRMED
            </span>

            <h2 className="font-serif-luxury font-bold text-2xl text-[#2C2820]">
              Thank You For Your Order!
            </h2>

            <p className="text-xs text-[#6B4E35]">
              Order <strong className="text-[#2C2820] font-mono">{orderId}</strong> has been successfully placed. We have sent a confirmation email & SMS with live tracking link.
            </p>

            <div className="pt-4">
              <Link href="/" className="btn-luxury w-full py-2.5 text-xs">
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
