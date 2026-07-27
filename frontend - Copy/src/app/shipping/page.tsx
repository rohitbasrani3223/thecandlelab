import React from "react";

export default function ShippingPolicyPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12 font-sans space-y-6 text-brand-charcoal">
      <h1 className="font-serif text-3xl font-bold border-b border-brand-beige pb-3">Shipping & Delivery Policy</h1>
      <p className="text-xs text-gray-500">Effective Date: July 25, 2026</p>

      <section className="space-y-3 text-xs leading-relaxed">
        <h2 className="font-serif text-base font-bold text-brand-gold uppercase">1. Delivery Timeline</h2>
        <p>Orders are dispatched via Express Courier (Shiprocket/Delhivery) within 24 hours. Delivery takes 2-4 business days across India.</p>
      </section>
    </div>
  );
}
