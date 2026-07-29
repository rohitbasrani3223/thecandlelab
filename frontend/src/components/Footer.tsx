"use client";

import React from "react";
import Link from "next/link";
import { Flame, Leaf, HeartHandshake, Truck, Sparkles, Send } from "lucide-react";

export const Footer: React.FC = () => {
  return (
    <footer className="bg-[#F4EFE8] dark:bg-[#151515] text-[#1F1F1F] dark:text-[#F8F5F0] pt-16 pb-8 border-t border-[#E6DFD3] dark:border-[#383838] transition-colors">
      <div className="max-w-7xl mx-auto px-4 lg:px-8">
        
        {/* Brand Value Pillars */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pb-12 border-b border-[#E6DFD3] dark:border-[#383838] text-center">
          <div className="flex flex-col items-center space-y-2 p-5 rounded-2xl bg-white dark:bg-[#1E1E1E] border border-[#E6DFD3] dark:border-[#383838] shadow-luxury-light">
            <Leaf className="w-6 h-6 text-[#C8A75A]" />
            <h4 className="text-xs font-serif font-bold uppercase tracking-wider text-[#1F1F1F] dark:text-[#F8F5F0]">100% Soy & Beeswax</h4>
            <p className="text-[11px] text-[#666666] dark:text-[#A8A29E] font-light">Non-toxic, bio-degradable & clean burning</p>
          </div>
          <div className="flex flex-col items-center space-y-2 p-5 rounded-2xl bg-white dark:bg-[#1E1E1E] border border-[#E6DFD3] dark:border-[#383838] shadow-luxury-light">
            <HeartHandshake className="w-6 h-6 text-[#C8A75A]" />
            <h4 className="text-xs font-serif font-bold uppercase tracking-wider text-[#1F1F1F] dark:text-[#F8F5F0]">Hand-Poured Artisan</h4>
            <p className="text-[11px] text-[#666666] dark:text-[#A8A29E] font-light">Crafted in small batches with love</p>
          </div>
          <div className="flex flex-col items-center space-y-2 p-5 rounded-2xl bg-white dark:bg-[#1E1E1E] border border-[#E6DFD3] dark:border-[#383838] shadow-luxury-light">
            <Sparkles className="w-6 h-6 text-[#C8A75A]" />
            <h4 className="text-xs font-serif font-bold uppercase tracking-wider text-[#1F1F1F] dark:text-[#F8F5F0]">Pure Essential Oils</h4>
            <p className="text-[11px] text-[#666666] dark:text-[#A8A29E] font-light">Layered top, middle & base fragrance notes</p>
          </div>
          <div className="flex flex-col items-center space-y-2 p-5 rounded-2xl bg-white dark:bg-[#1E1E1E] border border-[#E6DFD3] dark:border-[#383838] shadow-luxury-light">
            <Truck className="w-6 h-6 text-[#C8A75A]" />
            <h4 className="text-xs font-serif font-bold uppercase tracking-wider text-[#1F1F1F] dark:text-[#F8F5F0]">Safe Express Shipping</h4>
            <p className="text-[11px] text-[#666666] dark:text-[#A8A29E] font-light">Breakage-free insured luxury packaging</p>
          </div>
        </div>

        {/* Main Footer Links */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8 py-12">
          
          {/* Brand Intro Column */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-white dark:bg-[#1E1E1E] flex items-center justify-center border border-[#C8A75A]">
                <Flame className="w-4 h-4 text-[#C8A75A]" />
              </div>
              <span className="font-serif text-xl font-bold tracking-tight text-[#1F1F1F] dark:text-[#F8F5F0]">THE CANDLE LAB</span>
            </div>
            <p className="text-xs text-[#666666] dark:text-[#D8D2C8] leading-relaxed max-w-sm font-light">
              Where Fragrance Meets Art. Handcrafted soy & beeswax candles designed to fill your home with warmth, elegance, and tranquil glow. Inspired by Jo Malone, Aesop & Diptyque.
            </p>

            {/* Newsletter Input */}
            <div className="pt-2">
              <p className="text-xs font-medium text-[#C8A75A] mb-2 uppercase tracking-wider">Join The Glow Club (15% Off First Order)</p>
              <div className="flex max-w-sm">
                <input
                  type="email"
                  placeholder="Enter your email address..."
                  className="bg-white dark:bg-[#1E1E1E] text-xs px-3.5 py-2.5 rounded-l-2xl border border-[#E6DFD3] dark:border-[#383838] w-full focus:outline-none focus:border-[#C8A75A] text-[#1F1F1F] dark:text-[#F8F5F0] placeholder-[#666666] dark:placeholder-[#A8A29E]"
                />
                <button className="bg-[#C8A75A] text-white px-4 py-2.5 rounded-r-2xl text-xs font-bold hover:bg-[#D4B46A] transition-colors flex items-center gap-1 shadow-sm">
                  Join <Send className="w-3 h-3" />
                </button>
              </div>
            </div>

            {/* Social Icons */}
            <div className="flex items-center space-x-3 pt-2 text-[#666666] dark:text-[#A8A29E]">
              <a href="#" className="p-2 rounded-full bg-white dark:bg-[#1E1E1E] border border-[#E6DFD3] dark:border-[#383838] hover:text-[#C8A75A] transition-colors">
                <Sparkles className="w-4 h-4" />
              </a>
              <a href="#" className="p-2 rounded-full bg-white dark:bg-[#1E1E1E] border border-[#E6DFD3] dark:border-[#383838] hover:text-[#C8A75A] transition-colors">
                <Leaf className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h5 className="text-xs font-serif font-bold uppercase tracking-wider text-[#C8A75A]">Collections</h5>
            <ul className="space-y-2 text-xs text-[#666666] dark:text-[#D8D2C8] font-light">
              <li><Link href="/#shop-catalog" className="hover:text-[#C8A75A] transition-colors">Scented Candles</Link></li>
              <li><Link href="/#shop-catalog" className="hover:text-[#C8A75A] transition-colors">Floral Symphony</Link></li>
              <li><Link href="/#shop-catalog" className="hover:text-[#C8A75A] transition-colors">Vanilla Gourmand</Link></li>
              <li><Link href="/#shop-catalog" className="hover:text-[#C8A75A] transition-colors">Coffee Roast</Link></li>
              <li><Link href="/#shop-catalog" className="hover:text-[#C8A75A] transition-colors">Festive Gift Sets</Link></li>
            </ul>
          </div>

          {/* Candle Care */}
          <div className="space-y-3">
            <h5 className="text-xs font-serif font-bold uppercase tracking-wider text-[#C8A75A]">Candle Care</h5>
            <ul className="space-y-2 text-xs text-[#666666] dark:text-[#D8D2C8] font-light">
              <li><span className="hover:text-[#C8A75A] cursor-pointer">Wick Trimming Guide</span></li>
              <li><span className="hover:text-[#C8A75A] cursor-pointer">Burn Time Maximization</span></li>
              <li><span className="hover:text-[#C8A75A] cursor-pointer">Safety Instructions</span></li>
              <li><span className="hover:text-[#C8A75A] cursor-pointer">Scent Pyramid Index</span></li>
              <li><span className="hover:text-[#C8A75A] cursor-pointer">Recycling Vessels</span></li>
            </ul>
          </div>

          {/* Customer Care */}
          <div className="space-y-3">
            <h5 className="text-xs font-serif font-bold uppercase tracking-wider text-[#C8A75A]">Customer Care</h5>
            <ul className="space-y-2 text-xs text-[#666666] dark:text-[#D8D2C8] font-light">
              <li><Link href="/shipping" className="hover:text-[#C8A75A] transition-colors">Track Order & Delivery</Link></li>
              <li><Link href="/refund" className="hover:text-[#C8A75A] transition-colors">Returns & Replacements</Link></li>
              <li><Link href="/privacy" className="hover:text-[#C8A75A] transition-colors">Privacy & Data Security</Link></li>
              <li><Link href="/terms" className="hover:text-[#C8A75A] transition-colors">Terms of Service</Link></li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-[#E6DFD3] dark:border-[#383838] flex flex-col md:flex-row justify-between items-center text-[11px] text-[#666666] dark:text-[#A8A29E] font-light gap-4">
          <p>© 2026 The Candle Lab Atelier. All rights reserved. Crafted with elegance.</p>
          <div className="flex items-center space-x-6">
            <Link href="/privacy" className="hover:text-[#C8A75A]">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-[#C8A75A]">Terms</Link>
            <Link href="/refund" className="hover:text-[#C8A75A]">Refund Policy</Link>
            <Link href="/shipping" className="hover:text-[#C8A75A]">Shipping Policy</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
