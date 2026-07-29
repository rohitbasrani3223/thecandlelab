"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Leaf, Clock, Layers, Sparkles, Compass } from "lucide-react";
import { useUIStore } from "@/store";

const HERO_SLIDES = [
  {
    id: "slide-1",
    subtitle: "PREMIUM HOME FRAGRANCES",
    titleLine1: "Crafted to Glow.",
    titleLine2: "Designed to Inspire.",
    description:
      "Handcrafted luxury candles designed to fill your home with warmth, fragrance, and elegance. Pure soy & beeswax hand-poured with crackling wooden wicks.",
    primaryCtaText: "BUILD YOUR CANDLE",
    primaryCtaLink: "/shop",
    secondaryCtaText: "TAKE THE FRAGRANCE QUIZ",
    secondaryCtaLink: "/quiz",
    featuredCandle: {
      name: "Velvet Amber & Smoked Oud",
      notes: "Top: Amber, Bergamot | Heart: Oud, Jasmine | Base: Sandalwood, Musk",
      price: "INR899",
      image: "https://images.unsplash.com/photo-1603006905003-be475563bc59?w=800&auto=format&fit=crop&q=80",
    },
    features: [
      { icon: <Leaf size={18} className="text-[#C4964A]" />, title: "100% Natural", sub: "Soy & Beeswax" },
      { icon: <Clock size={18} className="text-[#C4964A]" />, title: "55+ Hours", sub: "Clean Burn Time" },
      { icon: <Layers size={18} className="text-[#C4964A]" />, title: "3-Layer", sub: "Fragrance Pyramid" },
    ],
  },
  {
    id: "slide-2",
    subtitle: "HOLIDAY & FESTIVE EDITION",
    titleLine1: "Gifting, Elevated.",
    titleLine2: "Unforgettable.",
    description:
      "Thoughtfully curated gift sets for every occasion. Make every moment unforgettable with hand-poured artisan scents and gold-embossed packaging.",
    primaryCtaText: "BUILD YOUR CANDLE",
    primaryCtaLink: "/shop?category=gift-sets",
    secondaryCtaText: "TAKE THE FRAGRANCE QUIZ",
    secondaryCtaLink: "/shop",
    featuredCandle: {
      name: "Rose & Cambodian Oud Signature",
      notes: "Top: Damask Rose | Heart: Cambodian Oud | Base: Velvet Patchouli",
      price: "INR1,599",
      image: "https://images.unsplash.com/photo-1547887537-6158d64c35b3?w=800&auto=format&fit=crop&q=80",
    },
    features: [
      { icon: <Leaf size={18} className="text-[#C4964A]" />, title: "Artisan Poured", sub: "Handcrafted Gift Box" },
      { icon: <Clock size={18} className="text-[#C4964A]" />, title: "60+ Hours", sub: "Extended Burn Time" },
      { icon: <Layers size={18} className="text-[#C4964A]" />, title: "Gold Embossed", sub: "Luxury Packaging" },
    ],
  },
];

export function HeroBanner() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const { openCustomizer, openFragranceQuiz } = useUIStore();

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length);
    }, 8000);
    return () => clearInterval(timer);
  }, []);

  const slide = HERO_SLIDES[currentSlide];

  return (
    <section
      className="relative min-h-[80vh] flex items-center py-12 lg:py-16 overflow-hidden"
      style={{
        background: "#FDFAF5",
      }}
    >
      {/* Dynamic Animated Ambient Glow Background Blobs */}
      <motion.div
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.5, 0.3],
          x: [0, 30, 0],
          y: [0, -20, 0],
        }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full pointer-events-none filter blur-3xl"
        style={{
          background: "radial-gradient(circle, rgba(196,150,74,0.22) 0%, rgba(253,250,245,0) 70%)",
        }}
      />
      <motion.div
        animate={{
          scale: [1.2, 1, 1.2],
          opacity: [0.2, 0.4, 0.2],
          x: [0, -40, 0],
          y: [0, 30, 0],
        }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
        className="absolute bottom-10 right-1/3 w-[30rem] h-[30rem] rounded-full pointer-events-none filter blur-3xl"
        style={{
          background: "radial-gradient(circle, rgba(168,123,50,0.15) 0%, rgba(253,250,245,0) 70%)",
        }}
      />

      <div className="container relative z-10">
        <AnimatePresence mode="wait">
          <motion.div
            key={slide.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.6 }}
            className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center"
          >
            {/* Left Content Column (7 cols) */}
            <div className="lg:col-span-7 space-y-7">

              {/* Subtitle Label */}
              <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#C4964A]">
                {slide.subtitle}
              </p>

              {/* Main Headline */}
              <h1
                className="text-4xl sm:text-6xl lg:text-7xl font-normal text-[#1A1208] leading-[1.08] tracking-tight"
                style={{ fontFamily: "Cormorant Garamond, Georgia, serif" }}
              >
                {slide.titleLine1} <br />
                <span
                  className="italic text-[#C4964A] font-light"
                  style={{ fontFamily: "Cormorant Garamond, Georgia, serif" }}
                >
                  {slide.titleLine2}
                </span>
              </h1>

              {/* Paragraph Description */}
              <p className="text-sm sm:text-base text-[#4A3728]/80 max-w-xl leading-relaxed font-light my-5">
                {slide.description}
              </p>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-4 py-3">
                <button
                  type="button"
                  onClick={openCustomizer}
                  className="px-7 py-3.5 rounded-full text-xs font-bold uppercase tracking-wider text-white transition-all hover:scale-105 shadow-md flex items-center gap-2 cursor-pointer"
                  style={{
                    background: "linear-gradient(135deg, #C4964A 0%, #A87B32 100%)",
                    boxShadow: "0 6px 20px -4px rgba(196,150,74,0.40)",
                    letterSpacing: "0.08em",
                  }}
                  id="hero-primary-cta"
                >
                  <Sparkles size={14} />
                  {slide.primaryCtaText}
                </button>

                <button
                  type="button"
                  onClick={openFragranceQuiz}
                  className="px-7 py-3.5 rounded-full text-xs font-bold uppercase tracking-wider text-[#1A1208] transition-all hover:bg-[#F5EFE4] flex items-center gap-2 cursor-pointer"
                  style={{
                    background: "#FDFAF5",
                    border: "1.5px solid #C4964A",
                    letterSpacing: "0.08em",
                  }}
                  id="hero-secondary-cta"
                >
                  <Compass size={14} className="text-[#C4964A]" />
                  {slide.secondaryCtaText}
                </button>
              </div>

              {/* Divider + Bottom Feature Badges */}
              <div
                className="mt-6 pt-6 grid grid-cols-3 gap-6"
                style={{ borderTop: "1px solid #EDE4D4" }}
              >
                {slide.features.map((feat) => (
                  <div key={feat.title} className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0">
                      {feat.icon}
                    </div>
                    <div>
                      <p className="text-xs font-bold text-[#1A1208] leading-snug">{feat.title}</p>
                      <p className="text-[11px] text-[#8B7355] leading-snug">{feat.sub}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Candle Showcase Card (5 cols) */}
            <div className="lg:col-span-5 relative flex justify-center">
              <motion.div
                initial={{ scale: 0.96, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.7 }}
                className="relative w-full max-w-md aspect-[4/5] rounded-[2.5rem] overflow-hidden shadow-[0_20px_50px_rgba(26,18,8,0.12)] border-2 border-white"
              >
                <Image
                  src={slide.featuredCandle.image}
                  alt={slide.featuredCandle.name}
                  fill
                  sizes="(max-width: 768px) 100vw, 40vw"
                  className="object-cover hover:scale-105 transition-transform duration-700"
                  priority
                />

                {/* Subtle Ambient Gradient Overlay */}
                <div
                  className="absolute inset-0 pointer-events-none"
                  style={{
                    background:
                      "linear-gradient(180deg, rgba(0,0,0,0) 55%, rgba(26,18,8,0.65) 100%)",
                  }}
                />

                {/* Floating Glass Candle Info Badge (Exact reference screenshot style) */}
                <div
                  className="absolute bottom-4 left-4 right-4 p-4 rounded-2xl backdrop-blur-md flex items-center justify-between gap-3 shadow-lg"
                  style={{
                    background: "rgba(253,250,245,0.92)",
                    border: "1px solid rgba(224,208,184,0.6)",
                  }}
                >
                  <div className="min-w-0 flex-1">
                    <p
                      className="text-sm font-bold text-[#1A1208] truncate leading-tight"
                      style={{ fontFamily: "Cormorant Garamond, Georgia, serif" }}
                    >
                      {slide.featuredCandle.name}
                    </p>
                    <p className="text-[10px] text-[#8B7355] truncate mt-0.5 font-light">
                      {slide.featuredCandle.notes}
                    </p>
                  </div>
                  <span
                    className="text-xs font-bold text-[#1A1208] px-3 py-1.5 rounded-xl bg-[#F5EFE4] border border-[#E0D0B8] flex-shrink-0"
                  >
                    {slide.featuredCandle.price}
                  </span>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Slide Indicators */}
        <div className="flex justify-center gap-2 mt-10">
          {HERO_SLIDES.map((s, index) => (
            <button
              key={s.id}
              onClick={() => setCurrentSlide(index)}
              className="h-1.5 rounded-full transition-all duration-300"
              suppressHydrationWarning
              style={{
                width: index === currentSlide ? "2rem" : "0.5rem",
                background: index === currentSlide ? "#C4964A" : "#E0D0B8",
              }}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
