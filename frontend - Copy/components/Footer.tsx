import Link from "next/link";
import { Sparkles, Mail, ShieldCheck, Heart } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-[#2C2820] text-[#EDE4D0] pt-16 pb-8 border-t border-[#4A3425]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Newsletter Box */}
        <div className="bg-gradient-to-r from-[#4A3425] via-[#6B4E35] to-[#4A3425] rounded-3xl p-8 border border-[#6B4E35] shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-1 text-center md:text-left">
            <h3 className="font-serif-luxury font-bold text-xl text-white flex items-center gap-2 justify-center md:justify-start">
              <Sparkles className="w-5 h-5 text-[#C9A84C]" /> Join The VIP Candle Club
            </h3>
            <p className="text-xs text-[#DDD5C4]">
              Subscribe for exclusive secret sales, new scent drops, and 15% OFF your first order.
            </p>
          </div>
          <form className="flex w-full md:w-auto gap-2">
            <input
              type="email"
              placeholder="Enter your email address"
              className="bg-white/10 border border-[#8B6B47] text-xs text-white placeholder-[#9B9591] px-4 py-2.5 rounded-xl focus:outline-none focus:border-[#C9A84C] w-full md:w-64"
            />
            <button type="submit" className="btn-luxury text-xs py-2.5 px-5 whitespace-nowrap">
              Subscribe
            </button>
          </form>
        </div>

        {/* Footer Navigation Columns */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-xs">
          {/* Brand Info */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-[#C9A84C] text-[#2C2820] flex items-center justify-center font-bold">
                <Sparkles className="w-4 h-4" />
              </div>
              <span className="font-serif-luxury font-bold text-lg text-white uppercase tracking-wider">
                The Candle Lab
              </span>
            </div>
            <p className="text-[#9B9591] leading-relaxed">
              Crafting premium luxury artisanal candles, wax melts, and home fragrances with 100% natural soy wax and essential oils.
            </p>
          </div>

          {/* Catalog Links */}
          <div className="space-y-3">
            <h4 className="font-bold text-white uppercase tracking-wider text-xs">Shop Collections</h4>
            <ul className="space-y-2 text-[#DDD5C4]">
              <li><Link href="/shop" className="hover:text-[#C9A84C] transition-colors">Scented Pillar Candles</Link></li>
              <li><Link href="/shop" className="hover:text-[#C9A84C] transition-colors">Luxury Amber Glass Jars</Link></li>
              <li><Link href="/shop" className="hover:text-[#C9A84C] transition-colors">Artisanal Wax Melts</Link></li>
              <li><Link href="/shop" className="hover:text-[#C9A84C] transition-colors">Festive Gift Hampers</Link></li>
            </ul>
          </div>

          {/* Customer Service */}
          <div className="space-y-3">
            <h4 className="font-bold text-white uppercase tracking-wider text-xs">Customer Service</h4>
            <ul className="space-y-2 text-[#DDD5C4]">
              <li><Link href="#" className="hover:text-[#C9A84C] transition-colors">Track Order Status</Link></li>
              <li><Link href="#" className="hover:text-[#C9A84C] transition-colors">Shipping & Delivery Policy</Link></li>
              <li><Link href="#" className="hover:text-[#C9A84C] transition-colors">Returns & Refund Policy</Link></li>
              <li><Link href="#" className="hover:text-[#C9A84C] transition-colors">Candle Care & Safety Guide</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div className="space-y-3">
            <h4 className="font-bold text-white uppercase tracking-wider text-xs">Contact Us</h4>
            <p className="text-[#DDD5C4]">
              Email: <span className="text-[#C9A84C]">support@thecandlelab.com</span>
            </p>
            <p className="text-[#DDD5C4]">
              Helpline: +91 98765 43210 (10 AM - 7 PM IST)
            </p>
            <p className="text-[#9B9591]">
              Mumbai • Bengaluru • New Delhi
            </p>
          </div>
        </div>

        {/* Copyright */}
        <div className="pt-8 border-t border-[#4A3425] text-center text-xs text-[#9B9591] flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© 2026 The Candle Lab 3.0. All Rights Reserved.</p>
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-[#C9A84C]" />
            <span>Razorpay Secured • Cash On Delivery Available</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
