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
    <section className="py-16 sm:py-24 bg-[#FAF7F2] font-sans">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-12">
        <div className="bg-[#241812] text-[#FAF7F2] p-8 sm:p-16 rounded-3xl border border-[#3E3027] shadow-[0_20px_50px_rgba(24,15,10,0.28)] text-center space-y-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 bg-[#C5983A]/15 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#BA6648]/10 rounded-full blur-3xl pointer-events-none" />

          <div className="space-y-3 max-w-xl mx-auto relative z-10">
            <Badge variant="gold" icon={<SparklesIcon size={12} />}>JOIN THE SERENITY CLUB</Badge>
            <h2 className="text-3xl sm:text-5xl font-serif font-bold text-[#FAF7F2]">
              Unlock 15% Off Your First Order
            </h2>
            <p className="text-xs sm:text-sm text-[#E5DAC7] leading-relaxed">
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
                className="bg-[#180F0A] text-[#FAF7F2] border-[#3E3027] placeholder-[#847262] focus:border-[#C5983A]"
              />
            </div>
            <Button type="submit" variant="gold" size="md" className="shrink-0 font-bold">
              Claim 15% Off
            </Button>
          </form>

          <span className="block text-[11px] text-[#847262] relative z-10">
            No spam. Unsubscribe anytime with 1 click.
          </span>
        </div>
      </div>
    </section>
  );
};
