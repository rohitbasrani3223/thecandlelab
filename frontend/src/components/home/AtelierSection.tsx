"use client";

import { useRef } from "react";
import Link from "next/link";
import { motion, useInView } from "framer-motion";
import { Sparkles, Gift, Hotel, Leaf, HeartHandshake, Zap, ShieldCheck } from "lucide-react";

export function AtelierSection() {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <section ref={ref} className="section" style={{ background: "#F5EFE4" }}>
      <div className="container space-y-10 sm:space-y-12">
        {/* Top Row: 3 Customization & Atelier Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-10">
          {/* Card 1: Build Your Own Candle */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="p-7 rounded-3xl bg-white border border-[#EDE4D4] shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-[0.18em] text-[#C4964A] mb-3">
                <Sparkles size={14} />
                BESPOKE ATELIER
              </div>
              <h3
                className="text-2xl font-bold text-[#1A1208] mb-3 tracking-wide"
                style={{ fontFamily: "Cormorant Garamond, Georgia, serif" }}
              >
                BUILD YOUR OWN CANDLE
              </h3>
              <p className="text-xs text-[#8B7355] leading-relaxed mb-6 font-light">
                Select Jar, Wax, Fragrance, Wick & Laser Engrave custom label text!
              </p>
            </div>
            <Link
              href="/shop?customizer=true"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-semibold uppercase tracking-wider text-white shadow-md self-start"
              style={{ background: "#C4964A" }}
              id="atelier-customizer-btn"
            >
              Start Customizer 🕯️
            </Link>
          </motion.div>

          {/* Card 2: 3-Candle Gift Set */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="p-7 rounded-3xl bg-white border border-[#EDE4D4] shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-[0.18em] text-[#C4964A] mb-3">
                <Gift size={14} />
                GIFT BOX CURATION
              </div>
              <h3
                className="text-2xl font-bold text-[#1A1208] mb-3 tracking-wide"
                style={{ fontFamily: "Cormorant Garamond, Georgia, serif" }}
              >
                3-CANDLE GIFT SET
              </h3>
              <p className="text-xs text-[#8B7355] leading-relaxed mb-6 font-light">
                Select any 3 full-sized candles presented in a luxury wax-sealed box for INR1,499.
              </p>
            </div>
            <Link
              href="/shop?category=gift-sets"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-semibold uppercase tracking-wider text-[#1A1208] border border-[#C4964A] bg-[#FDFAF5] hover:bg-[#F5EFE4] transition-colors self-start"
              id="atelier-giftbox-btn"
            >
              Curate Gift Box 🎁
            </Link>
          </motion.div>

          {/* Card 3: Hotels & Weddings */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="p-7 rounded-3xl bg-white border border-[#EDE4D4] shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-[0.18em] text-[#C4964A] mb-3">
                <Hotel size={14} />
                B2B & EVENT GIFTS
              </div>
              <h3
                className="text-2xl font-bold text-[#1A1208] mb-3 tracking-wide"
                style={{ fontFamily: "Cormorant Garamond, Georgia, serif" }}
              >
                HOTELS & WEDDINGS
              </h3>
              <p className="text-xs text-[#8B7355] leading-relaxed mb-6 font-light">
                Custom logo branding & bulk amenities for spas, luxury hotels, and weddings.
              </p>
            </div>
            <Link
              href="/contact?type=b2b"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-semibold uppercase tracking-wider text-[#1A1208] border border-[#E0D0B8] bg-[#FDFAF5] hover:bg-[#F5EFE4] transition-colors self-start"
              id="atelier-b2b-btn"
            >
              Request B2B Quote 💼
            </Link>
          </motion.div>
        </div>

        {/* Bottom Row: 4 Trust & Craftsmanship Feature Pills */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Pill 1 */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.4, delay: 0.4 }}
            className="p-5 rounded-2xl bg-white border border-[#EDE4D4] shadow-sm text-center flex flex-col items-center justify-center"
          >
            <Leaf size={20} className="text-[#C4964A] mb-2" />
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#1A1208] mb-1">
              100% SOY & BEESWAX
            </h4>
            <p className="text-[11px] text-[#8B7355] font-light">
              Non toxic, bio degradable & clean burning
            </p>
          </motion.div>

          {/* Pill 2 */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.4, delay: 0.5 }}
            className="p-5 rounded-2xl bg-white border border-[#EDE4D4] shadow-sm text-center flex flex-col items-center justify-center"
          >
            <HeartHandshake size={20} className="text-[#C4964A] mb-2" />
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#1A1208] mb-1">
              HAND-POURED ARTISAN
            </h4>
            <p className="text-[11px] text-[#8B7355] font-light">
              Crafted in small batches with love
            </p>
          </motion.div>

          {/* Pill 3 */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.4, delay: 0.6 }}
            className="p-5 rounded-2xl bg-white border border-[#EDE4D4] shadow-sm text-center flex flex-col items-center justify-center"
          >
            <Zap size={20} className="text-[#C4964A] mb-2" />
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#1A1208] mb-1">
              PURE ESSENTIAL OILS
            </h4>
            <p className="text-[11px] text-[#8B7355] font-light">
              Layered top, middle & base fragrance notes
            </p>
          </motion.div>

          {/* Pill 4 */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.4, delay: 0.7 }}
            className="p-5 rounded-2xl bg-white border border-[#EDE4D4] shadow-sm text-center flex flex-col items-center justify-center"
          >
            <ShieldCheck size={20} className="text-[#C4964A] mb-2" />
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#1A1208] mb-1">
              SAFE EXPRESS SHIPPING
            </h4>
            <p className="text-[11px] text-[#8B7355] font-light">
              Breakage free insured luxury packaging
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
