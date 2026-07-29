import React, { useState } from 'react';
import { Badge, SparklesIcon, Button, Input, useToast } from '../../design-system';

export interface ContactPageProps {
  onNavigateToFAQ?: () => void;
}

export const ContactPage: React.FC<ContactPageProps> = ({ onNavigateToFAQ }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    orderNo: '',
    subject: 'General Inquiry',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      toast({
        type: 'luxury',
        title: 'Message Transmitted to Concierge',
        description: `Thank you ${formData.name}. Our atelier team will respond to ${formData.email} within 24 hours.`,
      });
      setFormData({ name: '', email: '', orderNo: '', subject: 'General Inquiry', message: '' });
    }, 1000);
  };

  return (
    <div className="w-full bg-[#FAF6F0] min-h-screen font-sans pb-16">
      {/* Hero Header */}
      <section className="bg-[#3D2B1F] text-[#FAF6F0] py-16 sm:py-24 px-6 sm:px-12 text-center relative overflow-hidden">
        <div className="max-w-4xl mx-auto space-y-3 relative z-10">
          <Badge variant="gold" icon={<SparklesIcon size={12} />}>CONCIERGE & SUPPORT STUDIO</Badge>
          <h1 className="text-4xl sm:text-6xl font-serif font-bold text-[#FAF6F0]">
            We'd Love to Hear From You
          </h1>
          <p className="text-sm sm:text-base text-[#EFE8DB] font-light max-w-xl mx-auto leading-relaxed">
            Have questions about custom orders, corporate gifting, order tracking, or candle care? Our atelier support team is at your service.
          </p>
        </div>
      </section>

      {/* Main Form & Info Viewport */}
      <div className="max-w-7xl mx-auto px-6 sm:px-12 py-12 sm:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Left Column: Interactive Contact Form */}
          <div className="lg:col-span-7 bg-white border border-[#EFE8DB] rounded-2xl p-8 sm:p-10 shadow-subtle space-y-6">
            <div className="space-y-1">
              <h2 className="text-2xl font-serif font-bold text-[#2C1E16]">Send Us a Direct Message</h2>
              <p className="text-xs text-[#7A6B5D]">Fill in your details below and our team will get back to you shortly.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-[#2C1E16] uppercase">Full Name *</label>
                  <Input
                    type="text"
                    required
                    placeholder="e.g. Ananya Sharma"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-[#2C1E16] uppercase">Email Address *</label>
                  <Input
                    type="email"
                    required
                    placeholder="e.g. ananya@example.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-[#2C1E16] uppercase">Order Reference (Optional)</label>
                  <Input
                    type="text"
                    placeholder="e.g. TCL-98241"
                    value={formData.orderNo}
                    onChange={(e) => setFormData({ ...formData, orderNo: e.target.value })}
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-[#2C1E16] uppercase">Subject</label>
                  <select
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    className="w-full bg-[#F8F3EA] border border-[#EFE8DB] text-[#2C1E16] text-xs font-semibold rounded-lg p-2.5 focus:outline-none focus:ring-1 focus:ring-[#B88B38]"
                  >
                    <option value="General Inquiry">General Inquiry</option>
                    <option value="Order Status">Order Tracking & Status</option>
                    <option value="Corporate Gifting">Corporate Gifting & Bulk Orders</option>
                    <option value="Returns & Exchanges">Returns & Exchanges</option>
                    <option value="Press & PR">Press & Partnerships</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-[#2C1E16] uppercase">Message *</label>
                <textarea
                  rows={5}
                  required
                  placeholder="Describe your inquiry in detail..."
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full bg-[#F8F3EA] border border-[#EFE8DB] text-[#2C1E16] text-xs p-3 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#B88B38] font-sans"
                />
              </div>

              <Button
                variant="gold"
                size="lg"
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-[#B88B38] hover:bg-[#A3792E] text-white font-bold"
              >
                {isSubmitting ? 'Transmitting...' : 'Send Message →'}
              </Button>
            </form>
          </div>

          {/* Right Column: Studio Information */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-[#3D2B1F] text-[#FAF6F0] rounded-2xl p-8 shadow-card border border-[#523A2B] space-y-6">
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#B88B38]">FLAGSHIP ATELIER</span>
              <h3 className="text-2xl font-serif font-bold text-[#FAF6F0]">The Candle Lab Studio</h3>

              <div className="space-y-4 text-xs text-[#EFE8DB]">
                <div className="flex items-start gap-3">
                  <span className="text-lg">📍</span>
                  <div>
                    <strong className="block text-[#FAF6F0]">Address:</strong>
                    <span>Plot 42, Signature Atelier Towers, Lower Parel, Mumbai, Maharashtra 400013</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <span className="text-lg">✉️</span>
                  <div>
                    <strong className="block text-[#FAF6F0]">Email Support:</strong>
                    <a href="mailto:support@thecandlelab.in" className="text-[#B88B38] hover:underline">support@thecandlelab.in</a>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <span className="text-lg">📞</span>
                  <div>
                    <strong className="block text-[#FAF6F0]">Phone Concierge:</strong>
                    <span>+91 (022) 4982-1090 (Mon - Sat, 10 AM - 7 PM IST)</span>
                  </div>
                </div>
              </div>
            </div>

            {/* FAQ Shortcut Box */}
            <div className="bg-white border border-[#EFE8DB] rounded-2xl p-6 shadow-subtle space-y-3">
              <h4 className="font-serif font-bold text-base text-[#2C1E16]">Looking for Instant Answers?</h4>
              <p className="text-xs text-[#7A6B5D]">Check our comprehensive FAQ section for quick info on delivery timelines, wick trimming, and return policies.</p>
              <Button
                variant="outline"
                size="sm"
                className="w-full border-[#B88B38] text-[#B88B38] hover:bg-[#B88B38] hover:text-white"
                onClick={onNavigateToFAQ}
              >
                Visit Help Center & FAQ →
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
