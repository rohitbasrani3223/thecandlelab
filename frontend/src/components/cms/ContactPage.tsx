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
    <div className="w-full bg-[#FAF6F8] min-h-screen font-sans pb-16">
      {/* Hero Header */}
      <section className="bg-white text-[#1C1217] py-16 sm:py-24 px-6 sm:px-12 text-center relative overflow-hidden border-b border-[#F5E8EE]">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#F9B8CA]/20 rounded-full blur-3xl pointer-events-none" />
        <div className="max-w-4xl mx-auto space-y-3 relative z-10">
          <Badge variant="pink" icon={<SparklesIcon size={12} />}>CONCIERGE & SUPPORT STUDIO</Badge>
          <h1 className="text-4xl sm:text-6xl font-serif font-bold text-[#1C1217]">
            We'd Love to Hear From You
          </h1>
          <p className="text-sm sm:text-base text-[#624855] font-light max-w-xl mx-auto leading-relaxed">
            Have questions about custom orders, corporate gifting, order tracking, or candle care? Our atelier support team is at your service.
          </p>
        </div>
      </section>

      {/* Main Form & Info Viewport */}
      <div className="max-w-7xl mx-auto px-6 sm:px-12 py-12 sm:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Left Column: Interactive Contact Form */}
          <div className="lg:col-span-7 bg-white border border-[#F5E8EE] rounded-3xl p-8 sm:p-10 shadow-card space-y-6">
            <div className="space-y-1">
              <h2 className="text-2xl font-serif font-bold text-[#1C1217]">Send Us a Direct Message</h2>
              <p className="text-xs text-[#886C7B]">Fill in your details below and our team will get back to you shortly.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-[#1C1217] uppercase">Full Name *</label>
                  <Input
                    type="text"
                    required
                    placeholder="e.g. Ananya Sharma"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-[#1C1217] uppercase">Email Address *</label>
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
                  <label className="text-xs font-bold text-[#1C1217] uppercase">Order Reference (Optional)</label>
                  <Input
                    type="text"
                    placeholder="e.g. TCL-98241"
                    value={formData.orderNo}
                    onChange={(e) => setFormData({ ...formData, orderNo: e.target.value })}
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-[#1C1217] uppercase">Subject</label>
                  <select
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    className="w-full bg-[#FFF6F8] border border-[#F5E8EE] text-[#1C1217] text-xs font-semibold rounded-2xl p-3 focus:outline-none focus:ring-1 focus:ring-[#E87A96]"
                  >
                    <option value="General Inquiry">General Inquiry</option>
                    <option value="Order Status">Order Tracking & Status</option>
                    <option value="Custom Candle Gifting">Custom & Corporate Gifting</option>
                    <option value="Wholesale Inquiries">Wholesale & Stockist Requests</option>
                    <option value="Press & Collaborations">Press & Brand Collaborations</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-[#1C1217] uppercase">Detailed Message *</label>
                <textarea
                  required
                  rows={5}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="How can our candle artisans assist you today?"
                  className="w-full bg-[#FFF6F8] border border-[#F5E8EE] rounded-2xl p-4 text-xs text-[#1C1217] outline-none focus:border-[#E87A96]"
                />
              </div>

              <Button
                variant="pink"
                size="lg"
                type="submit"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Transmitting...' : 'Send Message to Concierge →'}
              </Button>
            </form>
          </div>

          {/* Right Column: Contact Cards & Studio Coordinates */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white border border-[#F5E8EE] rounded-3xl p-6 sm:p-8 space-y-4 shadow-card">
              <h3 className="font-serif font-bold text-lg text-[#1C1217]">
                Concierge Coordinates
              </h3>

              <div className="space-y-3 text-xs text-[#624855]">
                <div className="flex items-start gap-3 p-3 bg-[#FFF6F8] rounded-2xl border border-[#F5E8EE]">
                  <span className="text-xl">📍</span>
                  <div>
                    <strong className="text-[#1C1217] block">Main Fragrance Studio & Atelier:</strong>
                    <p>Building 4B, Mehrauli Heritage Quarter, New Delhi, 110030, India</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 bg-[#FFF6F8] rounded-2xl border border-[#F5E8EE]">
                  <span className="text-xl">✉️</span>
                  <div>
                    <strong className="text-[#1C1217] block">Direct Email Concierge:</strong>
                    <p>support@thecandlelab.in</p>
                    <p className="text-[10px] text-[#886C7B]">Average response time: &lt; 4 hours</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 bg-[#FFF6F8] rounded-2xl border border-[#F5E8EE]">
                  <span className="text-xl">📞</span>
                  <div>
                    <strong className="text-[#1C1217] block">WhatsApp & Phone Support:</strong>
                    <p>+91 (011) 4982-1000</p>
                    <p className="text-[10px] text-[#886C7B]">Mon - Sat: 9:00 AM – 7:00 PM IST</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick FAQ Link Card */}
            <div className="bg-[#FFF6F8] border border-[#F9B8CA] rounded-3xl p-6 text-center space-y-3">
              <span className="text-2xl">💡</span>
              <h4 className="font-serif font-bold text-base text-[#1C1217]">
                Looking for Instant Answers?
              </h4>
              <p className="text-xs text-[#624855] leading-relaxed">
                Check our Knowledge Base for quick solutions regarding shipping timelines, returns, and organic wick trimming.
              </p>
              {onNavigateToFAQ && (
                <Button variant="pink" size="sm" onClick={onNavigateToFAQ}>
                  Visit Help Center & FAQ →
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
