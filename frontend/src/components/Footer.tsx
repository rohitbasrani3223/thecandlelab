"use client";

import React from "react";
import Link from "next/link";
import { Flame, ShieldCheck, Leaf, HeartHandshake, Truck, Sparkles, Send } from "lucide-react";

export const Footer: React.FC = () => {
  return (
    <footer className="bg-brand-charcoal text-brand-ivory pt-16 pb-8 border-t-2 border-brand-gold/40">
      <div className="max-w-7xl mx-auto px-4 lg:px-8">
        
        {/* Brand Value Pillars */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pb-12 border-b border-white/10 text-center">
          <div className="flex flex-col items-center space-y-2 p-4 rounded-xl bg-white/5 border border-white/5">
            <Leaf className="w-6 h-6 text-brand-gold" />
            <h4 className="text-xs font-serif font-bold uppercase tracking-wider text-brand-beige">100% Soy & Beeswax</h4>
            <p className="text-[11px] text-gray-400">Non-toxic, bio-degradable & clean burning</p>
          </div>
          <div className="flex flex-col items-center space-y-2 p-4 rounded-xl bg-white/5 border border-white/5">
            <HeartHandshake className="w-6 h-6 text-brand-gold" />
            <h4 className="text-xs font-serif font-bold uppercase tracking-wider text-brand-beige">Hand-Poured Artisan</h4>
            <p className="text-[11px] text-gray-400">Crafted in small batches with love</p>
          </div>
          <div className="flex flex-col items-center space-y-2 p-4 rounded-xl bg-white/5 border border-white/5">
            <Sparkles className="w-6 h-6 text-brand-gold" />
            <h4 className="text-xs font-serif font-bold uppercase tracking-wider text-brand-beige">Pure Essential Oils</h4>
            <p className="text-[11px] text-gray-400">Layered top, middle & base notes</p>
          </div>
          <div className="flex flex-col items-center space-y-2 p-4 rounded-xl bg-white/5 border border-white/5">
            <Truck className="w-6 h-6 text-brand-gold" />
            <h4 className="text-xs font-serif font-bold uppercase tracking-wider text-brand-beige">Safe Express Shipping</h4>
            <p className="text-[11px] text-gray-400">Breakage-free insured packaging</p>
          </div>
        </div>

        {/* Main Footer Links */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8 py-12">
          
          {/* Brand Intro Column */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-brand-gold/20 flex items-center justify-center border border-brand-gold">
                <Flame className="w-4 h-4 text-brand-gold" />
              </div>
              <span className="font-serif text-xl font-bold tracking-tight text-white">THE CANDLE LAB</span>
            </div>
            <p className="text-xs text-gray-300 leading-relaxed max-w-sm">
              Where Fragrance Meets Art. Handcrafted soy & beeswax candles designed to fill your home with warmth, elegance, and tranquil glow. Inspired by Jo Malone, Aesop & Diptyque.
            </p>

            {/* Newsletter Input */}
            <div className="pt-2">
              <p className="text-xs font-medium text-brand-beige mb-2">Join The Private Glow Club (15% Off First Order)</p>
              <div className="flex max-w-sm">
                <input
                  type="email"
                  placeholder="Enter your email..."
                  className="bg-white/10 text-xs px-3 py-2 rounded-l-md w-full focus:outline-none focus:ring-1 focus:ring-brand-gold text-white"
                />
                <button className="bg-brand-gold text-brand-charcoal px-4 py-2 rounded-r-md text-xs font-bold hover:bg-brand-goldLight transition-colors flex items-center gap-1">
                  Join <Send className="w-3 h-3" />
                </button>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h5 className="text-xs font-serif font-bold uppercase tracking-wider text-brand-gold">Collections</h5>
            <ul className="space-y-2 text-xs text-gray-300">
              <li><Link href="#" className="hover:text-brand-gold transition-colors">Scented Candles</Link></li>
              <li><Link href="#" className="hover:text-brand-gold transition-colors">Floral Symphony</Link></li>
              <li><Link href="#" className="hover:text-brand-gold transition-colors">Vanilla Gourmand</Link></li>
              <li><Link href="#" className="hover:text-brand-gold transition-colors">Coffee Roast</Link></li>
              <li><Link href="#" className="hover:text-brand-gold transition-colors">Festive Gift Boxes</Link></li>
            </ul>
          </div>

          {/* Candle Care & Safety */}
          <div className="space-y-3">
            <h5 className="text-xs font-serif font-bold uppercase tracking-wider text-brand-gold">Candle Care & Guide</h5>
            <ul className="space-y-2 text-xs text-gray-300">
              <li><Link href="#" className="hover:text-brand-gold transition-colors">Wick Trimming Guide</Link></li>
              <li><Link href="#" className="hover:text-brand-gold transition-colors">Burn Time Maximization</Link></li>
              <li><Link href="#" className="hover:text-brand-gold transition-colors">Safety Instructions</Link></li>
              <li><Link href="#" className="hover:text-brand-gold transition-colors">Scent Strength Index</Link></li>
              <li><Link href="#" className="hover:text-brand-gold transition-colors">Recycling Vessels</Link></li>
            </ul>
          </div>

          {/* Customer Service */}
          <div className="space-y-3">
            <h5 className="text-xs font-serif font-bold uppercase tracking-wider text-brand-gold">Customer Care</h5>
            <ul className="space-y-2 text-xs text-gray-300">
              <li><Link href="#" className="hover:text-brand-gold transition-colors">Track Order Live</Link></li>
              <li><Link href="#" className="hover:text-brand-gold transition-colors">Returns & Replacement</Link></li>
              <li><Link href="#" className="hover:text-brand-gold transition-colors">Seller Portal Login</Link></li>
              <li><Link href="#" className="hover:text-brand-gold transition-colors">Admin Dashboard</Link></li>
              <li><Link href="#" className="hover:text-brand-gold transition-colors">Contact Concierge</Link></li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center text-[11px] text-gray-400 gap-4">
          <p>© 2026 The Candle Lab Atelier. All rights reserved. Crafted with elegance.</p>
          <div className="flex items-center space-x-6">
            <Link href="/privacy" className="hover:text-brand-gold">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-brand-gold">Terms of Service</Link>
            <Link href="/refund" className="hover:text-brand-gold">Refund Policy</Link>
            <Link href="/shipping" className="hover:text-brand-gold">Shipping Policy</Link>
            <span>WCAG 2.1 AAA Compliant</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
