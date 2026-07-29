"use client";

import React, { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Mail, Phone, MapPin, Send, MessageSquare } from "lucide-react";

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF7F2] dark:bg-[#151515] text-[#1F1F1F] dark:text-[#F8F5F0]">
      <Navbar
        onOpenCart={() => {}}
        onOpenWishlist={() => {}}
        onOpenAuthModal={() => {}}
        onOpenProfile={() => {}}
      />

      <main className="flex-1 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16">
        <div className="text-center space-y-3 mb-16">
          <span className="text-xs uppercase tracking-widest text-[#C8A75A] font-semibold">
            Get In Touch
          </span>
          <h1 className="text-4xl sm:text-5xl font-serif">Contact Our Atelier</h1>
          <p className="text-xs text-gray-500 max-w-md mx-auto">
            Have questions about custom candle scents, corporate gifting, or order inquiries? Our concierge team is at your service.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-10">
          {/* Info Column */}
          <div className="md:col-span-5 space-y-6">
            <div className="bg-white dark:bg-[#1E1E1E] rounded-3xl border border-[#E6DFD3] dark:border-[#383838] p-8 shadow-luxury-light space-y-6">
              <h2 className="text-2xl font-serif">The Candle Lab Concierge</h2>

              <div className="space-y-4 text-xs">
                <div className="flex items-start space-x-3">
                  <MapPin className="w-5 h-5 text-[#C8A75A] flex-shrink-0 mt-0.5" />
                  <div>
                    <strong className="block font-semibold">Atelier Flagship Store</strong>
                    <span className="text-gray-500">104 Luxury Boulevard, Bandra West, Mumbai, Maharashtra 400050</span>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <Mail className="w-5 h-5 text-[#C8A75A] flex-shrink-0" />
                  <div>
                    <strong className="block font-semibold">Email Concierge</strong>
                    <span className="text-gray-500">concierge@thecandlelab.in</span>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <Phone className="w-5 h-5 text-[#C8A75A] flex-shrink-0" />
                  <div>
                    <strong className="block font-semibold">WhatsApp & Phone</strong>
                    <span className="text-gray-500">+91 98765 43210 (Mon - Sat, 10 AM - 7 PM)</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Form Column */}
          <div className="md:col-span-7 bg-white dark:bg-[#1E1E1E] rounded-3xl border border-[#E6DFD3] dark:border-[#383838] p-8 shadow-luxury-light">
            {submitted ? (
              <div className="text-center py-12 space-y-4">
                <div className="w-14 h-14 bg-green-100 dark:bg-green-950/50 text-green-600 rounded-full flex items-center justify-center mx-auto">
                  <Send className="w-7 h-7" />
                </div>
                <h3 className="text-2xl font-serif">Message Received</h3>
                <p className="text-xs text-gray-500 max-w-sm mx-auto">
                  Thank you for reaching out. A fragrance specialist will respond to your query within 2 hours.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <h2 className="text-2xl font-serif mb-4">Send Us a Message</h2>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 mb-1">Your Name</label>
                    <input
                      type="text"
                      required
                      placeholder="Ananya Sharma"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-4 py-2.5 text-xs bg-[#FAF7F2] dark:bg-[#151515] border border-[#E6DFD3] dark:border-[#383838] rounded-xl focus:outline-none focus:border-[#C8A75A]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 mb-1">Your Email</label>
                    <input
                      type="email"
                      required
                      placeholder="ananya@example.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-4 py-2.5 text-xs bg-[#FAF7F2] dark:bg-[#151515] border border-[#E6DFD3] dark:border-[#383838] rounded-xl focus:outline-none focus:border-[#C8A75A]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-500 mb-1">Subject</label>
                  <input
                    type="text"
                    required
                    placeholder="Custom Order / Fragrance Query"
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    className="w-full px-4 py-2.5 text-xs bg-[#FAF7F2] dark:bg-[#151515] border border-[#E6DFD3] dark:border-[#383838] rounded-xl focus:outline-none focus:border-[#C8A75A]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-500 mb-1">Message</label>
                  <textarea
                    rows={4}
                    required
                    placeholder="Write your message details here..."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full px-4 py-2.5 text-xs bg-[#FAF7F2] dark:bg-[#151515] border border-[#E6DFD3] dark:border-[#383838] rounded-xl focus:outline-none focus:border-[#C8A75A]"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full btn-luxury-primary py-3.5 text-xs font-semibold uppercase tracking-wider rounded-xl shadow-md flex items-center justify-center space-x-2"
                >
                  <Send className="w-4 h-4" />
                  <span>Submit Inquiry</span>
                </button>
              </form>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
