"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { ChevronDown, HelpCircle, Flame, Truck, RefreshCw, Shield } from "lucide-react";

export default function FAQPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      category: "Candle Quality & Wax",
      question: "What type of wax is used in The Candle Lab candles?",
      answer: "We use 100% natural, eco-friendly soy wax and pure beeswax blends sourced from sustainable farms. Our waxes are 100% paraffin-free, non-toxic, and biodegradable."
    },
    {
      category: "Candle Quality & Wax",
      question: "What is the difference between Wooden Crackling Wicks and Cotton Wicks?",
      answer: "Wooden crackling wicks emit a soothing, subtle campfire crackle sound as they burn, creating an immersive sensory experience. Premium unbleached cotton wicks deliver a steady, whisper-quiet flame with zero soot."
    },
    {
      category: "Shipping & Delivery",
      question: "How long does shipping take?",
      answer: "Standard shipping across India takes 3 to 5 business days. Express shipping is delivered in 24 to 48 hours for metro cities. Free express shipping applies on all orders above ₹1,499."
    },
    {
      category: "Returns & Exchanges",
      question: "What is your return and refund policy?",
      answer: "We offer a 7-day hassle-free return and exchange policy. If your product arrives damaged or you are unsatisfied with the scent throw, we provide instant replacement or full refund."
    },
    {
      category: "Custom & Corporate Orders",
      question: "Do you offer corporate gifting or custom label candles?",
      answer: "Yes! We specialize in custom-branded wedding favors, corporate gift hampers, and bespoke scent creation. You can customize jar colors, wax colors, custom gold foil labels, and gift packaging."
    }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF7F2] dark:bg-[#151515] text-[#1F1F1F] dark:text-[#F8F5F0]">
      <Navbar
        onOpenCart={() => {}}
        onOpenWishlist={() => {}}
        onOpenAuthModal={() => {}}
        onOpenProfile={() => {}}
      />

      <main className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16">
        <div className="text-center space-y-3 mb-12">
          <span className="text-xs uppercase tracking-widest text-[#C8A75A] font-semibold flex items-center justify-center space-x-1">
            <HelpCircle className="w-4 h-4" />
            <span>Help Center</span>
          </span>
          <h1 className="text-4xl font-serif">Frequently Asked Questions</h1>
          <p className="text-xs text-gray-500 max-w-md mx-auto">
            Everything you need to know about our luxury candle formulations, shipping, returns, and custom candle care.
          </p>
        </div>

        {/* FAQ Accordion */}
        <div className="space-y-4">
          {faqs.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={idx}
                className="bg-white dark:bg-[#1E1E1E] rounded-2xl border border-[#E6DFD3] dark:border-[#383838] overflow-hidden transition-all shadow-xs"
              >
                <button
                  onClick={() => setOpenIndex(isOpen ? null : idx)}
                  className="w-full p-6 text-left flex justify-between items-center space-x-4 focus:outline-none"
                >
                  <div>
                    <span className="text-[10px] uppercase font-semibold text-[#C8A75A] tracking-wider block mb-1">
                      {faq.category}
                    </span>
                    <span className="font-serif text-base text-[#1F1F1F] dark:text-[#F8F5F0]">
                      {faq.question}
                    </span>
                  </div>
                  <ChevronDown
                    className={`w-5 h-5 text-[#C8A75A] transition-transform duration-300 ${
                      isOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>
                {isOpen && (
                  <div className="px-6 pb-6 pt-0 text-xs text-gray-600 dark:text-gray-300 leading-relaxed border-t border-[#FAF7F2] dark:border-[#2A2A2A] mt-2 pt-4">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </main>

      <Footer />
    </div>
  );
}
