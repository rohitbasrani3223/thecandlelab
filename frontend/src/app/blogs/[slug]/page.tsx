"use client";

import React, { use } from "react";
import Link from "next/link";
import Image from "next/image";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Calendar, User, ArrowLeft, Share2 } from "lucide-react";

export default function BlogDetailPage({
  params
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);

  const title = slug.split("-").map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF7F2] dark:bg-[#151515] text-[#1F1F1F] dark:text-[#F8F5F0]">
      <Navbar
        onOpenCart={() => {}}
        onOpenWishlist={() => {}}
        onOpenAuthModal={() => {}}
        onOpenProfile={() => {}}
      />

      <main className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16">
        <Link href="/blogs" className="inline-flex items-center space-x-1 text-xs text-[#C8A75A] font-semibold mb-6 hover:underline">
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to All Journal Articles</span>
        </Link>

        <div className="space-y-4 mb-8">
          <span className="text-xs uppercase tracking-widest text-[#C8A75A] font-semibold">
            Candle Care & Wellness
          </span>
          <h1 className="text-3xl sm:text-5xl font-serif text-[#1F1F1F] dark:text-[#F8F5F0]">
            {title}
          </h1>
          <div className="flex items-center space-x-4 text-xs text-gray-500">
            <span>By Master Perfumer</span>
            <span>•</span>
            <span>July 2026</span>
          </div>
        </div>

        <div className="relative h-80 sm:h-[420px] w-full rounded-3xl overflow-hidden mb-10 border border-[#E6DFD3] dark:border-[#383838]">
          <Image
            src="https://images.unsplash.com/photo-1603006905003-be475563bc59?auto=format&fit=crop&w=1200&q=80"
            alt={title}
            fill
            className="object-cover"
          />
        </div>

        <article className="prose dark:prose-invert max-w-none text-sm text-[#444] dark:text-[#CCC] space-y-6 leading-relaxed">
          <p className="text-base font-serif italic text-gray-600 dark:text-gray-300 border-l-2 border-[#C8A75A] pl-4">
            &ldquo;When you ignite a hand-poured soy candle, you are engaging with an ancient tradition of ambient warmth and olfactory art.&rdquo;
          </p>

          <h2 className="text-xl font-serif font-normal text-[#1F1F1F] dark:text-[#F8F5F0]">
            1. The Golden Rule of the First Burn
          </h2>
          <p>
            The initial burn of your luxury candle sets the &ldquo;wax memory.&rdquo; Always allow the candle to burn until the molten wax pool reaches all edges of the vessel (typically 2 to 3 hours). This prevents tunneling and guarantees an even melt for the entire lifespan of the candle.
          </p>

          <h2 className="text-xl font-serif font-normal text-[#1F1F1F] dark:text-[#F8F5F0]">
            2. Trimming Wicks to 1/4 Inch
          </h2>
          <p>
            Before relighting, always trim the wick to 1/4 inch. For wooden crackling wicks, gently snap off the charred tip with your fingertips or a wick trimmer. Trimming ensures a clean, soot-free flame and prevents high flames that consume wax too rapidly.
          </p>

          <h2 className="text-xl font-serif font-normal text-[#1F1F1F] dark:text-[#F8F5F0]">
            3. Protecting Scent Integrity
          </h2>
          <p>
            Store your candles in a cool, dry place out of direct sunlight. Ultraviolet light can break down natural fragrance oils over time. Using a snuffer to extinguish the flame preserves the delicate top notes without smoke residue.
          </p>
        </article>
      </main>

      <Footer />
    </div>
  );
}
