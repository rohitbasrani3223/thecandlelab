import React, { useState } from 'react';
import { CandleIcon, Input, Button, useToast, SparklesIcon } from '../../design-system';

export const Footer: React.FC = () => {
  const [email, setEmail] = useState('');
  const { toast } = useToast();

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      toast({ type: 'error', title: 'Invalid Email', description: 'Please enter a valid email address.' });
      return;
    }
    toast({
      type: 'luxury',
      title: 'Welcome to The Candle Society',
      description: 'Check your inbox for your 15% VIP welcome code.',
    });
    setEmail('');
  };

  return (
    <footer className="bg-[#1C130E] text-[#FAF6F0] border-t border-[#3D2C22] font-sans pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-6 sm:px-12 space-y-16">
        {/* Top Newsletter & Brand Statement */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center bg-[#2A1E17] p-8 sm:p-12 rounded-md border border-[#4A3B32] shadow-card">
          <div className="lg:col-span-6 space-y-3">
            <div className="flex items-center gap-2 text-[#D4AF37] text-xs uppercase font-bold tracking-widest">
              <SparklesIcon size={14} />
              <span>THE CANDLE CLUB VIP</span>
            </div>
            <h3 className="font-serif font-bold text-2xl sm:text-3xl text-[#FAF6F0]">
              Receive 15% Off Your First Order
            </h3>
            <p className="text-xs text-[#E5D9C5] leading-relaxed max-w-lg">
              Subscribe to unlock private vault releases, seasonal scent previews, and exclusive candle care tutorials.
            </p>
          </div>

          <form onSubmit={handleSubscribe} className="lg:col-span-6 flex flex-col sm:flex-row gap-3">
            <div className="flex-1">
              <Input
                type="email"
                placeholder="Enter your email address..."
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-[#1C130E] text-[#FAF6F0] border-[#4A3B32] placeholder-[#8C7A6B] focus:border-[#D4AF37]"
              />
            </div>
            <Button type="submit" variant="gold" size="md" className="shrink-0">
              Join Club
            </Button>
          </form>
        </div>

        {/* Middle Navigation Columns */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 text-xs">
          {/* Brand Info */}
          <div className="col-span-2 space-y-4">
            <div className="flex items-center gap-2.5">
              <CandleIcon size={28} className="text-[#D4AF37]" />
              <span className="font-serif font-extrabold text-xl tracking-wider text-[#FAF6F0]">
                THE CANDLE LAB
              </span>
            </div>
            <p className="text-[#C2AE90] leading-relaxed max-w-sm">
              Artisanal hand-poured soy candles crafted in small batches using 100% natural botanical oils and lead-free cotton wicks.
            </p>
            <div className="flex items-center gap-3 pt-2 text-[#E5D9C5]">
              <a href="#instagram" className="w-8 h-8 rounded-full bg-[#2A1E17] border border-[#4A3B32] flex items-center justify-center hover:text-[#D4AF37] hover:border-[#D4AF37] transition-colors" aria-label="Instagram">
                📸
              </a>
              <a href="#pinterest" className="w-8 h-8 rounded-full bg-[#2A1E17] border border-[#4A3B32] flex items-center justify-center hover:text-[#D4AF37] hover:border-[#D4AF37] transition-colors" aria-label="Pinterest">
                📌
              </a>
              <a href="#facebook" className="w-8 h-8 rounded-full bg-[#2A1E17] border border-[#4A3B32] flex items-center justify-center hover:text-[#D4AF37] hover:border-[#D4AF37] transition-colors" aria-label="Facebook">
                👤
              </a>
            </div>
          </div>

          {/* Column 1: Shop */}
          <div className="space-y-3">
            <h4 className="text-xs uppercase font-bold tracking-widest text-[#D4AF37]">Shop Collections</h4>
            <ul className="space-y-2 text-[#C2AE90]">
              <li><a href="#shop-glass" className="hover:text-[#FAF6F0] transition-colors">Luxury Glass Jars</a></li>
              <li><a href="#shop-tins" className="hover:text-[#FAF6F0] transition-colors">Botanical Travel Tins</a></li>
              <li><a href="#shop-pillars" className="hover:text-[#FAF6F0] transition-colors">Aromatherapy Pillars</a></li>
              <li><a href="#shop-diffusers" className="hover:text-[#FAF6F0] transition-colors">Reed Diffusers</a></li>
              <li><a href="#shop-gifts" className="hover:text-[#FAF6F0] transition-colors">Bespoke Gift Boxes</a></li>
            </ul>
          </div>

          {/* Column 2: Our Brand */}
          <div className="space-y-3">
            <h4 className="text-xs uppercase font-bold tracking-widest text-[#D4AF37]">About The Lab</h4>
            <ul className="space-y-2 text-[#C2AE90]">
              <li><a href="#story" className="hover:text-[#FAF6F0] transition-colors">Our Artisan Story</a></li>
              <li><a href="#sustainability" className="hover:text-[#FAF6F0] transition-colors">Sustainable Soy Wax</a></li>
              <li><a href="#perfumer-journal" className="hover:text-[#FAF6F0] transition-colors">The Perfumer Journal</a></li>
              <li><a href="#press" className="hover:text-[#FAF6F0] transition-colors">Press & Media</a></li>
              <li><a href="#careers" className="hover:text-[#FAF6F0] transition-colors">Careers</a></li>
            </ul>
          </div>

          {/* Column 3: Customer Care */}
          <div className="space-y-3">
            <h4 className="text-xs uppercase font-bold tracking-widest text-[#D4AF37]">Customer Support</h4>
            <ul className="space-y-2 text-[#C2AE90]">
              <li><a href="#shipping" className="hover:text-[#FAF6F0] transition-colors">Shipping & Returns</a></li>
              <li><a href="#care-guide" className="hover:text-[#FAF6F0] transition-colors">Candle Care Guide</a></li>
              <li><a href="#tracking" className="hover:text-[#FAF6F0] transition-colors">Track Order Status</a></li>
              <li><a href="#faqs" className="hover:text-[#FAF6F0] transition-colors">FAQs</a></li>
              <li><a href="#contact" className="hover:text-[#FAF6F0] transition-colors">Contact Us</a></li>
            </ul>
          </div>
        </div>

        {/* Bottom Copyright Bar & Payment Icons */}
        <div className="pt-8 border-t border-[#3D2C22] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#8C7A6B]">
          <div>
            © {new Date().getFullYear()} The Candle Lab LLC. All rights reserved. Designed for Luxury & Elegance.
          </div>
          <div className="flex items-center gap-4 text-[11px]">
            <a href="#privacy" className="hover:text-[#FAF6F0]">Privacy Policy</a>
            <span>•</span>
            <a href="#terms" className="hover:text-[#FAF6F0]">Terms of Service</a>
            <span>•</span>
            <a href="#accessibility" className="hover:text-[#FAF6F0]">Accessibility</a>
          </div>
        </div>
      </div>
    </footer>
  );
};
