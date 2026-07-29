"use client";

import { useState } from "react";
import { Settings, Save, Lock, Truck, CreditCard, Mail, Store } from "lucide-react";
import toast from "react-hot-toast";

export default function AdminSettingsPage() {
  const [storeName, setStoreName] = useState("The Candle Lab");
  const [freeShippingThreshold, setFreeShippingThreshold] = useState("999");
  const [standardShippingFee, setStandardShippingFee] = useState("99");
  const [gstRate, setGstRate] = useState("18");
  const [enableRazorpay, setEnableRazorpay] = useState(true);
  const [enableCod, setEnableCod] = useState(true);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Settings saved successfully!");
  };

  return (
    <div className="space-y-8 max-w-4xl">
      <div>
        <h1
          className="text-3xl font-medium text-[#F5EFE4]"
          style={{ fontFamily: "Cormorant Garamond, Georgia, serif" }}
        >
          Store Settings
        </h1>
        <p className="text-xs text-[#8B7355] mt-1">
          Configure business rules, shipping thresholds, taxes, and payment gateways.
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Store Profile */}
        <div className="p-6 rounded-2xl border border-[#2A1D13] space-y-4" style={{ background: "#140D07" }}>
          <h2 className="text-lg font-semibold text-[#F5EFE4] flex items-center gap-2">
            <Store size={18} className="text-[#C4964A]" />
            General Store Details
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#A08060] mb-1">Store Name</label>
              <input
                type="text"
                value={storeName}
                onChange={(e) => setStoreName(e.target.value)}
                className="w-full px-3 py-2 rounded-xl text-xs bg-[#1F140B] border border-[#3A281A] text-[#F5EFE4]"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#A08060] mb-1">Support Email</label>
              <input
                type="email"
                defaultValue="hello@thecandlelab.in"
                className="w-full px-3 py-2 rounded-xl text-xs bg-[#1F140B] border border-[#3A281A] text-[#F5EFE4]"
              />
            </div>
          </div>
        </div>

        {/* Shipping & Tax */}
        <div className="p-6 rounded-2xl border border-[#2A1D13] space-y-4" style={{ background: "#140D07" }}>
          <h2 className="text-lg font-semibold text-[#F5EFE4] flex items-center gap-2">
            <Truck size={18} className="text-[#C4964A]" />
            Shipping & GST Settings
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#A08060] mb-1">Free Shipping Min (₹)</label>
              <input
                type="number"
                value={freeShippingThreshold}
                onChange={(e) => setFreeShippingThreshold(e.target.value)}
                className="w-full px-3 py-2 rounded-xl text-xs bg-[#1F140B] border border-[#3A281A] text-[#F5EFE4]"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#A08060] mb-1">Standard Delivery Charge (₹)</label>
              <input
                type="number"
                value={standardShippingFee}
                onChange={(e) => setStandardShippingFee(e.target.value)}
                className="w-full px-3 py-2 rounded-xl text-xs bg-[#1F140B] border border-[#3A281A] text-[#F5EFE4]"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#A08060] mb-1">GST Rate (%)</label>
              <input
                type="number"
                value={gstRate}
                onChange={(e) => setGstRate(e.target.value)}
                className="w-full px-3 py-2 rounded-xl text-xs bg-[#1F140B] border border-[#3A281A] text-[#F5EFE4]"
              />
            </div>
          </div>
        </div>

        {/* Payment Gateways */}
        <div className="p-6 rounded-2xl border border-[#2A1D13] space-y-4" style={{ background: "#140D07" }}>
          <h2 className="text-lg font-semibold text-[#F5EFE4] flex items-center gap-2">
            <CreditCard size={18} className="text-[#C4964A]" />
            Payment Gateway Controls
          </h2>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 rounded-xl bg-[#1F140B] border border-[#3A281A]">
              <div>
                <p className="text-xs font-semibold text-[#F5EFE4]">Razorpay / Online Payments (UPI, Cards)</p>
                <p className="text-[10px] text-[#8B7355]">Enable instant online payment checkout</p>
              </div>
              <input
                type="checkbox"
                checked={enableRazorpay}
                onChange={(e) => setEnableRazorpay(e.target.checked)}
                className="accent-[#C4964A] w-4 h-4"
              />
            </div>

            <div className="flex items-center justify-between p-3 rounded-xl bg-[#1F140B] border border-[#3A281A]">
              <div>
                <p className="text-xs font-semibold text-[#F5EFE4]">Cash on Delivery (COD)</p>
                <p className="text-[10px] text-[#8B7355]">Allow customers to pay upon package delivery</p>
              </div>
              <input
                type="checkbox"
                checked={enableCod}
                onChange={(e) => setEnableCod(e.target.checked)}
                className="accent-[#C4964A] w-4 h-4"
              />
            </div>
          </div>
        </div>

        <button type="submit" className="btn btn-gold gap-2">
          <Save size={16} />
          Save All Settings
        </button>
      </form>
    </div>
  );
}
