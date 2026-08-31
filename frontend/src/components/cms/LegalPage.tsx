import React from 'react';
import { Badge, SparklesIcon } from '../../design-system';

export interface LegalPageProps {
  type: 'privacy' | 'terms' | 'shipping' | 'refund';
}

export const LegalPage: React.FC<LegalPageProps> = ({ type }) => {
  const titles = {
    privacy: 'Privacy Policy',
    terms: 'Terms & Conditions',
    shipping: 'Shipping & Delivery Policy',
    refund: 'Refund & Returns Policy',
  };

  const dates = {
    privacy: 'Last Updated: July 29, 2026',
    terms: 'Last Updated: July 29, 2026',
    shipping: 'Last Updated: July 29, 2026',
    refund: 'Last Updated: July 29, 2026',
  };

  return (
    <div className="w-full bg-[#F8F6F0] min-h-screen font-sans pb-16">
      {/* Hero Header */}
      <section className="bg-white text-[#232323] py-16 sm:py-24 px-6 sm:px-12 text-center relative overflow-hidden border-b border-[#EADDCB]">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#EADDCB]/20 rounded-full blur-3xl pointer-events-none" />
        <div className="max-w-4xl mx-auto space-y-3 relative z-10">
          <Badge variant="pink" icon={<SparklesIcon size={12} />}>ATELIER LEGAL & COMPLIANCE</Badge>
          <h1 className="text-4xl sm:text-6xl font-serif font-bold text-[#232323]">
            {titles[type]}
          </h1>
          <p className="text-xs text-[#7D6F63] font-mono tracking-wider">{dates[type]}</p>
        </div>
      </section>

      {/* Main Legal Content Container */}
      <div className="max-w-4xl mx-auto px-6 sm:px-12 py-12">
        <div className="bg-white border border-[#EADDCB] rounded-3xl p-8 sm:p-12 shadow-card space-y-8 text-[#232323] leading-relaxed text-sm sm:text-base font-light">
          {type === 'privacy' && (
            <>
              <section className="space-y-3">
                <h3 className="font-serif font-bold text-xl text-[#232323]">1. Data Collection & Privacy Commitment</h3>
                <p className="text-[#5C5149]">
                  At The Candle Lab, we respect your privacy. We collect personal identification information (Name, Delivery Address, Email Address, Phone Number) solely for order processing, shipping fulfillment, and customer concierge service.
                </p>
              </section>

              <section className="space-y-3">
                <h3 className="font-serif font-bold text-xl text-[#232323]">2. Payment Processing Security</h3>
                <p className="text-[#5C5149]">
                  All online payments processed through our platform utilize 256-bit SSL encryption. We do not store debit/credit card numbers or CVVs on our servers. Transactions are handled by RBI-compliant payment gateways.
                </p>
              </section>

              <section className="space-y-3">
                <h3 className="font-serif font-bold text-xl text-[#232323]">3. Cookies & Analytics</h3>
                <p className="text-[#5C5149]">
                  We use cookies to maintain your shopping cart session, save your wishlist preferences, and analyze website performance for UX improvements. You may disable cookies in your browser settings.
                </p>
              </section>
            </>
          )}

          {type === 'terms' && (
            <>
              <section className="space-y-3">
                <h3 className="font-serif font-bold text-xl text-[#232323]">1. Agreement to Terms</h3>
                <p className="text-[#5C5149]">
                  By accessing or purchasing from The Candle Lab website (thecandlelab.in), you agree to be bound by these Terms & Conditions. All content, trademarks, and vessel formulations are intellectual property of The Candle Lab Atelier.
                </p>
              </section>

              <section className="space-y-3">
                <h3 className="font-serif font-bold text-xl text-[#232323]">2. Product Availability & Batch Formulations</h3>
                <p className="text-[#5C5149]">
                  Because our soy candles are hand-poured in small batches, slight variations in wax color texture and soy frosted bloom may occur naturally. These variations signify pure botanical formulation and do not affect scent throw.
                </p>
              </section>
            </>
          )}

          {type === 'shipping' && (
            <>
              <section className="space-y-3">
                <h3 className="font-serif font-bold text-xl text-[#232323]">1. Free Shipping Threshold</h3>
                <p className="text-[#5C5149]">
                  We provide 100% Free Express Shipping on all orders totaling ₹1,499 or higher across all serviceable pin codes in India. Orders below ₹1,499 incur a flat ₹99 standard shipping charge.
                </p>
              </section>

              <section className="space-y-3">
                <h3 className="font-serif font-bold text-xl text-[#232323]">2. Dispatch & Tracking</h3>
                <p className="text-[#5C5149]">
                  Orders placed before 2:00 PM IST are dispatched on the same business day. Live Airway Bill (AWB) tracking links are sent via SMS, WhatsApp, and Email immediately upon courier pickup.
                </p>
              </section>
            </>
          )}

          {type === 'refund' && (
            <>
              <section className="space-y-3">
                <h3 className="font-serif font-bold text-xl text-[#232323]">1. 15-Day Return Guarantee</h3>
                <p className="text-[#5C5149]">
                  If you are not completely satisfied with your candle, you may return unopened, unused products in original packaging within 15 days of delivery for a full refund or exchange.
                </p>
              </section>

              <section className="space-y-3">
                <h3 className="font-serif font-bold text-xl text-[#232323]">2. Damaged in Transit Replacement</h3>
                <p className="text-[#5C5149]">
                  If a glass vessel arrives damaged or broken during courier shipping, email a photo of the box to support@thecandlelab.in within 48 hours. We will dispatch a brand new replacement immediately at zero cost.
                </p>
              </section>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
