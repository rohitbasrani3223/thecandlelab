import Link from "next/link";
import { Sparkles, Flame, ShieldCheck, Clock, Award } from "lucide-react";

export default function HeroSection() {
  return (
    <section className="relative bg-gradient-to-b from-[#FDFAF5] via-[#F5EFE0] to-[#FAF8F4] py-16 md:py-24 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Hero Left Text Content */}
          <div className="space-y-6 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 bg-[#FFF8EC] border border-[#EDE8DF] text-[#A86C00] text-xs font-semibold px-4 py-1.5 rounded-full shadow-sm">
              <Sparkles className="w-4 h-4 text-[#C9A84C]" />
              <span>Hand-Poured Artisanal Candles</span>
            </div>

            <h1 className="font-serif-luxury text-4xl sm:text-5xl lg:text-6xl font-extrabold text-[#2C2820] leading-tight tracking-tight">
              Illuminate Your Space With <span className="text-gold-gradient">Pure Luxury</span>
            </h1>

            <p className="text-sm sm:text-base text-[#6B4E35] max-w-xl mx-auto lg:mx-0 font-normal leading-relaxed">
              Discover our signature collection of 100% natural soy wax candles, crafted with pure essential fragrance oils for an unmatchable sensory ambiance.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
              <Link href="/shop" className="btn-luxury w-full sm:w-auto">
                <Flame className="w-4 h-4" /> Explore Catalog
              </Link>
              <Link href="/shop?filter=bestsellers" className="btn-luxury-outline w-full sm:w-auto">
                View Best Sellers
              </Link>
            </div>

            {/* Feature Highlights Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-8 border-t border-[#DDD5C4]">
              <div className="flex items-center gap-2 text-xs font-medium text-[#4A4540]">
                <ShieldCheck className="w-4 h-4 text-[#C9A84C] flex-shrink-0" />
                <span>100% Soy Wax</span>
              </div>
              <div className="flex items-center gap-2 text-xs font-medium text-[#4A4540]">
                <Clock className="w-4 h-4 text-[#C9A84C] flex-shrink-0" />
                <span>45+ Hours Burn</span>
              </div>
              <div className="flex items-center gap-2 text-xs font-medium text-[#4A4540]">
                <Flame className="w-4 h-4 text-[#C9A84C] flex-shrink-0" />
                <span>Lead-Free Wick</span>
              </div>
              <div className="flex items-center gap-2 text-xs font-medium text-[#4A4540]">
                <Award className="w-4 h-4 text-[#C9A84C] flex-shrink-0" />
                <span>Paraben-Free</span>
              </div>
            </div>
          </div>

          {/* Hero Right Visual Card */}
          <div className="relative flex justify-center">
            <div className="w-full max-w-md bg-white rounded-3xl p-8 border border-[#DDD5C4] shadow-xl relative overflow-hidden text-center">
              <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-[#C9A84C] to-[#6B4E35] flex items-center justify-center mx-auto mb-6 text-white shadow-lg animate-pulse">
                <Flame className="w-12 h-12" />
              </div>
              <span className="text-[11px] font-bold text-[#C9A84C] uppercase tracking-widest">
                FEATURED CANDLE OF THE MONTH
              </span>
              <h3 className="font-serif-luxury font-bold text-2xl text-[#2C2820] mt-1">
                French Vanilla & Warm Cinnamon
              </h3>
              <p className="text-xs text-[#9B9591] mt-2">
                Top Notes: Creamy Vanilla • Heart: Cinnamon Spice • Base: Golden Amber
              </p>
              <div className="mt-6 pt-4 border-t border-[#EDE8DF] flex items-center justify-between">
                <div>
                  <span className="text-xs text-[#9B9591] line-through font-medium">₹1,199</span>
                  <span className="text-lg font-extrabold text-[#2D7A4F] ml-2">₹899</span>
                </div>
                <Link href="/shop" className="btn-luxury py-2 text-xs">
                  Buy Now
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
