import React, { useState } from 'react';
import { Button, Input, Badge, SparklesIcon, useToast } from '../../design-system';

export const NewsletterSection: React.FC = () => {
  const [email, setEmail] = useState('');
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      toast({ type: 'error', title: 'Invalid Email Address', description: 'Please enter a valid email address.' });
      return;
    }

    toast({
      type: 'luxury',
      title: 'Welcome to The Candle Society',
      description: 'Your 15% VIP discount code is: CANDLEVIP15',
    });
    setEmail('');
  };

  return (
    <section className="py-16 sm:py-24 bg-[#FAF6F0] font-sans">
      <div className="max-w-5xl mx-auto px-6 sm:px-12">
        <div className="bg-[#2A1E17] text-[#FAF6F0] p-8 sm:p-16 rounded-md border border-[#4A3B32] shadow-modal text-center space-y-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 bg-[#D4AF37]/10 rounded-full blur-3xl pointer-events-none" />

          <div className="space-y-3 max-w-xl mx-auto relative z-10">
            <Badge variant="gold" icon={<SparklesIcon size={12} />}>JOIN THE SERENITY CLUB</Badge>
            <h2 className="text-3xl sm:text-5xl font-serif font-bold text-[#FAF6F0]">
              Unlock 15% Off Your First Order
            </h2>
            <p className="text-xs sm:text-sm text-[#E5D9C5] leading-relaxed">
              Be the first to access limited reserve candle releases, seasonal fragrance drops, and private vault sales.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="max-w-md mx-auto flex flex-col sm:flex-row gap-3 relative z-10">
            <div className="flex-1">
              <Input
                type="email"
                placeholder="Enter your VIP email..."
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-[#1C130E] text-[#FAF6F0] border-[#4A3B32] placeholder-[#8C7A6B] focus:border-[#D4AF37]"
              />
            </div>
            <Button type="submit" variant="gold" size="md" className="shrink-0">
              Claim 15% Off
            </Button>
          </form>

          <span className="block text-[11px] text-[#8C7A6B] relative z-10">
            No spam. Unsubscribe anytime with 1 click.
          </span>
        </div>
      </div>
    </section>
  );
};
