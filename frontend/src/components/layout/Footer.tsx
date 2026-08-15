import React, { useState } from 'react';
import { Input, Button, useToast, SparklesIcon } from '../../design-system';
import { useCMS } from '../../context/CMSContext';

export const Footer: React.FC = () => {
  const [email, setEmail] = useState('');
  const { toast } = useToast();
  const { settings } = useCMS();

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
    <footer className="bg-[#140B10] text-[#FFFFFF] border-t border-[#2C1D25] font-sans pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 space-y-16">
        {/* Top Newsletter & Brand Statement */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center bg-gradient-to-r from-[#1C1217] via-[#2C1D25] to-[#1C1217] p-8 sm:p-12 rounded-3xl border border-[#F9B8CA]/20 shadow-[0_16px_36px_rgba(20,11,16,0.3)]">
          <div className="lg:col-span-6 space-y-3">
            <div className="flex items-center gap-2 text-[#F9B8CA] text-xs uppercase font-bold tracking-widest">
              <SparklesIcon size={14} className="text-[#E8C86D]" />
              <span>THE CANDLE CLUB VIP</span>
            </div>
            <h3 className="font-serif font-bold text-2xl sm:text-3xl text-[#FFFFFF]">
              Receive 15% Off Your First Order
            </h3>
            <p className="text-xs text-[#FCD5E2] leading-relaxed max-w-lg">
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
                className="bg-[#140B10] text-[#FFFFFF] border-[#422D38] placeholder-[#AC94A1] focus:border-[#E87A96]"
              />
            </div>
            <Button type="submit" variant="pink" size="md" className="shrink-0 font-bold">
              Join Club
            </Button>
          </form>
        </div>

        {/* Middle Navigation Columns */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 text-xs">
          {/* Brand Info */}
          <div className="col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <img src="/logo.jpeg" alt="The Candle Lab Logo" className="h-10 w-auto object-contain rounded-xl border border-[#422D38]" />
              <span className="font-serif font-extrabold text-xl tracking-wider text-[#FFFFFF]">
                THE CANDLE LAB
              </span>
            </div>

            <p className="text-[#FCD5E2] leading-relaxed max-w-sm text-xs">
              {settings.footerText || 'Artisanal hand-poured soy candles crafted in small batches using 100% natural botanical oils and lead-free cotton wicks.'}
            </p>
            <div className="flex items-center gap-3 pt-2 text-[#F9B8CA]">
              {settings.socialLinks?.instagram && (
                <a
                  href={settings.socialLinks.instagram}
                  target="_blank"
                  rel="noreferrer"
                  className="w-8 h-8 rounded-full bg-[#2C1D25] border border-[#422D38] flex items-center justify-center hover:text-[#FFFFFF] hover:border-[#E87A96] transition-colors"
                  aria-label="Instagram"
                  title="Instagram"
                >
                  📸
                </a>
              )}
              {settings.socialLinks?.facebook && (
                <a
                  href={settings.socialLinks.facebook}
                  target="_blank"
                  rel="noreferrer"
                  className="w-8 h-8 rounded-full bg-[#2C1D25] border border-[#422D38] flex items-center justify-center hover:text-[#FFFFFF] hover:border-[#E87A96] transition-colors"
                  aria-label="Facebook"
                  title="Facebook"
                >
                  👤
                </a>
              )}
              {settings.socialLinks?.pinterest && (
                <a
                  href={settings.socialLinks.pinterest}
                  target="_blank"
                  rel="noreferrer"
                  className="w-8 h-8 rounded-full bg-[#2C1D25] border border-[#422D38] flex items-center justify-center hover:text-[#FFFFFF] hover:border-[#E87A96] transition-colors"
                  aria-label="Pinterest"
                  title="Pinterest"
                >
                  📌
                </a>
              )}
              {settings.socialLinks?.whatsapp && (
                <a
                  href={settings.socialLinks.whatsapp}
                  target="_blank"
                  rel="noreferrer"
                  className="w-8 h-8 rounded-full bg-[#2C1D25] border border-[#422D38] flex items-center justify-center hover:text-[#FFFFFF] hover:border-[#E87A96] transition-colors"
                  aria-label="WhatsApp"
                  title="WhatsApp"
                >
                  💬
                </a>
              )}
            </div>
          </div>

          {/* Column 1: Shop */}
          <div className="space-y-3">
            <h4 className="text-xs uppercase font-bold tracking-widest text-[#F9B8CA]">Shop Collections</h4>
            <ul className="space-y-2 text-[#EFC8D4]">
              <li><a href="#shop" className="hover:text-[#FFFFFF] transition-colors">Scented Candles</a></li>
              <li><a href="#collections" className="hover:text-[#FFFFFF] transition-colors">Curated Collections</a></li>
              <li><a href="#categories" className="hover:text-[#FFFFFF] transition-colors">Category Showcase</a></li>
              <li><a href="#shop" className="hover:text-[#FFFFFF] transition-colors">Luxury Glass Jars</a></li>
              <li><a href="#shop" className="hover:text-[#FFFFFF] transition-colors">Bespoke Gift Boxes</a></li>
            </ul>
          </div>

          {/* Column 2: Our Brand */}
          <div className="space-y-3">
            <h4 className="text-xs uppercase font-bold tracking-widest text-[#F9B8CA]">About The Lab</h4>
            <ul className="space-y-2 text-[#EFC8D4]">
              <li><a href="#about" className="hover:text-[#FFFFFF] transition-colors">About Us</a></li>
              <li><a href="#blog" className="hover:text-[#FFFFFF] transition-colors">Atelier Gazette & Journal</a></li>
              <li><a href="#careers" className="hover:text-[#FFFFFF] transition-colors">Careers & Hiring</a></li>
              <li><a href="#contact" className="hover:text-[#FFFFFF] transition-colors">Press & PR</a></li>
            </ul>
          </div>

          {/* Column 3: Customer Care */}
          <div className="space-y-3">
            <h4 className="text-xs uppercase font-bold tracking-widest text-[#F9B8CA]">Customer Support</h4>
            <ul className="space-y-2 text-[#EFC8D4]">
              <li><a href="#shipping-policy" className="hover:text-[#FFFFFF] transition-colors">Shipping Policy</a></li>
              <li><a href="#refund-policy" className="hover:text-[#FFFFFF] transition-colors">Refund & Returns Policy</a></li>
              <li><a href="#faq" className="hover:text-[#FFFFFF] transition-colors">FAQ & Help Center</a></li>
              <li><a href="#contact" className="hover:text-[#FFFFFF] transition-colors">Contact Concierge</a></li>
              <li><a href="#account" className="hover:text-[#FFFFFF] transition-colors">Order Tracking</a></li>
            </ul>
          </div>
        </div>

        {/* Bottom Copyright Bar & Legal Links */}
        <div className="pt-8 border-t border-[#2C1D25] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#AC94A1]">
          <div>
            © {new Date().getFullYear()} The Candle Lab. All rights reserved. Crafted for Luxury & Serenity.
          </div>
          <div className="flex items-center gap-4 text-[11px]">
            <a href="#privacy-policy" className="hover:text-[#FFFFFF]">Privacy Policy</a>
            <span>•</span>
            <a href="#terms-conditions" className="hover:text-[#FFFFFF]">Terms & Conditions</a>
            <span>•</span>
            <a href="#shipping-policy" className="hover:text-[#FFFFFF]">Shipping Policy</a>
          </div>
        </div>
      </div>
    </footer>
  );
};
