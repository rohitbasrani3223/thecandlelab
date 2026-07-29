"use client";

import React from "react";
import Image from "next/image";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Flame, Sparkles, Heart, Leaf, ShieldCheck, Award } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#FAF7F2] dark:bg-[#151515] text-[#1F1F1F] dark:text-[#F8F5F0]">
      <Navbar
        onOpenCart={() => {}}
        onOpenWishlist={() => {}}
        onOpenAuthModal={() => {}}
        onOpenProfile={() => {}}
      />

      <main className="flex-1 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16">
        {/* Editorial Story */}
        <div className="text-center space-y-4 mb-16">
          <span className="text-xs uppercase tracking-widest text-[#C8A75A] font-semibold">
            Our Brand Philosophy
          </span>
          <h1 className="text-4xl sm:text-6xl font-serif font-normal text-[#1F1F1F] dark:text-[#F8F5F0]">
            Crafting Sensory Elegance
          </h1>
          <p className="text-sm sm:text-base text-[#666666] dark:text-[#A0A0A0] max-w-2xl mx-auto font-light leading-relaxed">
            The Candle Lab was founded on a singular passion: creating pure, organic, luxury candles that transform any space into a serene sanctuary of olfactory warmth.
          </p>
        </div>

        {/* Brand Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
          <div className="bg-white dark:bg-[#1E1E1E] rounded-3xl border border-[#E6DFD3] dark:border-[#383838] p-8 text-center space-y-3 shadow-luxury-light">
            <Leaf className="w-10 h-10 text-[#C8A75A] mx-auto" />
            <h3 className="font-serif text-xl">100% Organic Wax</h3>
            <p className="text-xs text-gray-500 leading-relaxed">
              Formulated exclusively from natural soy wax and beeswax. Zero paraffin, zero phthalates, and zero lead.
            </p>
          </div>

          <div className="bg-white dark:bg-[#1E1E1E] rounded-3xl border border-[#E6DFD3] dark:border-[#383838] p-8 text-center space-y-3 shadow-luxury-light">
            <Sparkles className="w-10 h-10 text-[#C8A75A] mx-auto" />
            <h3 className="font-serif text-xl">Master Perfumery</h3>
            <p className="text-xs text-gray-500 leading-relaxed">
              Every scent is blended with essential oils sourced from Grasse, France and Kannauj, India for multi-layered fragrance throw.
            </p>
          </div>

          <div className="bg-white dark:bg-[#1E1E1E] rounded-3xl border border-[#E6DFD3] dark:border-[#383838] p-8 text-center space-y-3 shadow-luxury-light">
            <Flame className="w-10 h-10 text-[#C8A75A] mx-auto" />
            <h3 className="font-serif text-xl">Hand-Poured Artisan Craft</h3>
            <p className="text-xs text-gray-500 leading-relaxed">
              Each candle is individually poured in micro-batches by skilled candle artisans to ensure perfect burn quality.
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
