"use client";

import React, { useState } from "react";
import { useStore } from "@/context/StoreContext";
import { Building2, X, CheckCircle2, Send, Sparkles } from "lucide-react";

interface CorporateOrdersModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CorporateOrdersModal: React.FC<CorporateOrdersModalProps> = ({ isOpen, onClose }) => {
  const { showToast } = useStore();
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    companyName: "",
    contactPerson: "",
    email: "",
    phone: "",
    orderType: "Hotels & Resorts",
    estimatedQuantity: "100 - 500 units",
    customBranding: true,
    message: ""
  });

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    showToast("Corporate B2B Quote request submitted! Concierge will contact you within 4 hours. 💼");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/65 backdrop-blur-md">
      <div className="relative w-full max-w-2xl bg-brand-surface rounded-2xl border-2 border-brand-gold shadow-2xl p-6 md:p-8">
        
        <button onClick={onClose} className="absolute top-4 right-4 p-2 text-brand-charcoal hover:bg-brand-beige rounded-full">
          <X className="w-5 h-5" />
        </button>

        {!submitted ? (
          <div>
            <div className="flex items-center gap-3 border-b border-brand-beige pb-4 mb-6">
              <div className="w-10 h-10 rounded-full bg-brand-charcoal flex items-center justify-center text-brand-gold">
                <Building2 className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] font-bold text-brand-gold uppercase tracking-widest">B2B BULK CONCIERGE</span>
                <h3 className="font-serif text-2xl font-bold text-brand-charcoal">CORPORATE & WEDDING ORDERS</h3>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-brand-earth block mb-1">Company / Event Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. The Oberoi Hotel or Grand Wedding Event"
                    value={form.companyName}
                    onChange={(e) => setForm({ ...form, companyName: e.target.value })}
                    className="w-full p-2.5 rounded-lg border border-brand-beige bg-white"
                  />
                </div>

                <div>
                  <label className="font-bold text-brand-earth block mb-1">Contact Person *</label>
                  <input
                    type="text"
                    required
                    placeholder="Full Name"
                    value={form.contactPerson}
                    onChange={(e) => setForm({ ...form, contactPerson: e.target.value })}
                    className="w-full p-2.5 rounded-lg border border-brand-beige bg-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-brand-earth block mb-1">Business Email *</label>
                  <input
                    type="email"
                    required
                    placeholder="corporate@company.com"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className="w-full p-2.5 rounded-lg border border-brand-beige bg-white"
                  />
                </div>

                <div>
                  <label className="font-bold text-brand-earth block mb-1">Mobile Number *</label>
                  <input
                    type="text"
                    required
                    placeholder="+91 98765 43210"
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    className="w-full p-2.5 rounded-lg border border-brand-beige bg-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-brand-earth block mb-1">Industry / Event Category</label>
                  <select
                    value={form.orderType}
                    onChange={(e) => setForm({ ...form, orderType: e.target.value })}
                    className="w-full p-2.5 rounded-lg border border-brand-beige bg-white"
                  >
                    <option value="Hotels & Resorts">Hotels & Luxury Resorts</option>
                    <option value="Luxury Spas & Wellness">Luxury Spas & Wellness</option>
                    <option value="Wedding Favors">Wedding Return Gifts</option>
                    <option value="Corporate Gifting">Executive Corporate Gifting</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-brand-earth block mb-1">Estimated Quantity</label>
                  <select
                    value={form.estimatedQuantity}
                    onChange={(e) => setForm({ ...form, estimatedQuantity: e.target.value })}
                    className="w-full p-2.5 rounded-lg border border-brand-beige bg-white"
                  >
                    <option value="50 - 100 units">50 - 100 units</option>
                    <option value="100 - 500 units">100 - 500 units</option>
                    <option value="500 - 2000 units">500 - 2,000 units</option>
                    <option value="2000+ units">2,000+ units</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-bold text-brand-earth block mb-1">Specific Scent or Custom Box Instructions</label>
                <textarea
                  rows={2}
                  placeholder="Describe your desired vessel color, custom laser logo engraving, or bespoke fragrance notes..."
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  className="w-full p-2.5 rounded-lg border border-brand-beige bg-white"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-brand-charcoal text-brand-gold py-3 rounded-xl font-bold text-xs hover:bg-brand-gold hover:text-brand-charcoal transition-colors flex items-center justify-center gap-2 shadow-lg"
              >
                Request Custom Bulk Quote <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        ) : (
          <div className="text-center py-10 space-y-3">
            <CheckCircle2 className="w-12 h-12 text-green-600 mx-auto" />
            <h3 className="font-serif text-2xl font-bold text-brand-charcoal">REQUEST RECEIVED!</h3>
            <p className="text-xs text-brand-earth max-w-sm mx-auto">
              Our B2B Luxury Concierge team has received your inquiry. A dedicated manager will call you within 4 business hours with custom pricing & sample box dispatch.
            </p>
            <button onClick={onClose} className="bg-brand-charcoal text-brand-gold px-6 py-2.5 rounded-xl font-bold text-xs mt-4">
              Close Window
            </button>
          </div>
        )}

      </div>
    </div>
  );
};
