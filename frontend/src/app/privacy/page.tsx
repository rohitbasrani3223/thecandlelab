import React from "react";

export default function PrivacyPolicyPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12 font-sans space-y-6 text-brand-charcoal">
      <h1 className="font-serif text-3xl font-bold border-b border-brand-beige pb-3">Privacy Policy</h1>
      <p className="text-xs text-gray-500">Effective Date: July 25, 2026</p>

      <section className="space-y-3 text-xs leading-relaxed">
        <h2 className="font-serif text-base font-bold text-brand-gold uppercase">1. Information We Collect</h2>
        <p>At The Candle Lab Atelier, we respect your privacy. We collect personal information such as name, email address, shipping address, and phone number when you place an order or customize a candle.</p>

        <h2 className="font-serif text-base font-bold text-brand-gold uppercase">2. Use of Information</h2>
        <p>Your information is used strictly to process orders, hand-pour custom laser-engraved candles, dispatch insured shipments, and issue loyalty rewards.</p>

        <h2 className="font-serif text-base font-bold text-brand-gold uppercase">3. Security</h2>
        <p>We use 256-bit SSL encryption, OWASP-compliant security headers, and PCI-DSS compliant payment gateways (Razorpay/Stripe).</p>
      </section>
    </div>
  );
}
