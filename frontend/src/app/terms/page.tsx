import React from "react";

export default function TermsOfServicePage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12 font-sans space-y-6 text-brand-charcoal">
      <h1 className="font-serif text-3xl font-bold border-b border-brand-beige pb-3">Terms of Service</h1>
      <p className="text-xs text-gray-500">Effective Date: July 25, 2026</p>

      <section className="space-y-3 text-xs leading-relaxed">
        <h2 className="font-serif text-base font-bold text-brand-gold uppercase">1. Product Customization</h2>
        <p>Bespoke custom candles created via the 3D Customizer Atelier are hand-poured according to customer-selected vessels, scents, and engraved labels.</p>

        <h2 className="font-serif text-base font-bold text-brand-gold uppercase">2. Intellect & Branding</h2>
        <p>All brand assets, candle formulations, and visual designs are the property of The Candle Lab Atelier.</p>
      </section>
    </div>
  );
}
