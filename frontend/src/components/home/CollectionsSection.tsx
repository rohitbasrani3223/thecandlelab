"use client";

import { useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, useInView } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import { COLLECTIONS } from "@/data/mock";

export function CollectionsSection() {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <section ref={ref} className="section" style={{ background: "#F5EFE4" }}>
      <div className="container">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="section-header text-center mb-12"
        >
          <span className="section-label text-xs font-semibold tracking-[0.2em] text-[#A87B32] uppercase">
            Curated Moods
          </span>
          <div className="w-12 h-0.5 bg-[#C4964A] mx-auto my-3" />
          <h2
            className="text-4xl sm:text-5xl font-light text-[#1A1208]"
            style={{ fontFamily: "Cormorant Garamond, Georgia, serif" }}
          >
            Exclusive Collections
          </h2>
          <p className="text-sm text-[#8B7355] max-w-xl mx-auto mt-2">
            Explore our signature candle series, crafted for special moments, luxury gifting, and seasonal transitions.
          </p>
        </motion.div>

        {/* Collections Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-10">
          {COLLECTIONS.map((col, index) => (
            <motion.div
              key={col.id}
              initial={{ opacity: 0, y: 32 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: index * 0.12, duration: 0.6 }}
            >
              <Link
                href={`/shop?collection=${col.slug}`}
                id={`collection-card-${col.slug}`}
                className="group relative block h-96 sm:h-[28rem] rounded-[2.25rem] overflow-hidden shadow-xl transition-all duration-500 hover:-translate-y-1.5 border border-[#EDE4D4]"
              >
                {/* Background Image */}
                <Image
                  src={col.bannerImage || col.image}
                  alt={col.name}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-108"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />

                {/* Dark Luxury Ambient Gradient Overlay */}
                <div
                  className="absolute inset-0 transition-opacity duration-500"
                  style={{
                    background:
                      "linear-gradient(180deg, rgba(0,0,0,0.05) 0%, rgba(26,18,8,0.75) 55%, rgba(15,10,4,0.96) 100%)",
                  }}
                />

                {/* Card Content Overlay */}
                <div className="absolute inset-0 p-8 flex flex-col justify-end text-white z-10">
                  <div className="flex items-center gap-2 mb-2">
                    <Sparkles size={14} className="text-[#C4964A]" />
                    <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#C4964A]">
                      Collection
                    </span>
                  </div>

                  <h3
                    className="text-3xl sm:text-4xl font-normal mb-2 text-white drop-shadow-md"
                    style={{ fontFamily: "Cormorant Garamond, Georgia, serif" }}
                  >
                    {col.name}
                  </h3>

                  <p className="text-sm text-[#F5EFE4] line-clamp-2 max-w-md mb-5 leading-relaxed font-light drop-shadow-sm">
                    {col.description}
                  </p>

                  <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-[#C4964A] group-hover:text-white transition-colors">
                    Explore Collection
                    <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
