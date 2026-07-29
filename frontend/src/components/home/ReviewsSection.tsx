"use client";

import { useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, useInView } from "framer-motion";
import { ArrowRight, Star, Quote } from "lucide-react";
import { REVIEWS } from "@/data/mock";

export function ReviewsSection() {
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
          className="section-header"
        >
          <span className="section-label">Social Proof</span>
          <div className="gold-divider mx-auto mb-4" />
          <h2 className="section-title">What Our Customers Say</h2>
          <p className="section-subtitle">
            Real reviews from real candle lovers. No filters — just authentic
            experiences.
          </p>
        </motion.div>

        {/* Overall rating */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="flex justify-center mb-12"
        >
          <div
            className="flex items-center gap-6 px-8 py-4 rounded-2xl"
            style={{
              background: "#fff",
              border: "1px solid #EDE4D4",
              boxShadow: "0 4px 16px rgba(26,18,8,0.06)",
            }}
          >
            <div className="text-center">
              <p
                className="text-4xl font-medium text-[#1A1208]"
                style={{ fontFamily: "Cormorant Garamond, Georgia, serif" }}
              >
                4.8
              </p>
              <div className="flex justify-center gap-0.5 my-1">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star
                    key={s}
                    size={14}
                    className={
                      s <= 5 ? "text-[#C4964A] fill-[#C4964A]" : "text-[#E0D0B8]"
                    }
                  />
                ))}
              </div>
              <p className="text-xs text-[#8B7355]">Overall Rating</p>
            </div>
            <div className="h-12 w-px bg-[#E0D0B8]" />
            <div className="text-center">
              <p
                className="text-4xl font-medium text-[#1A1208]"
                style={{ fontFamily: "Cormorant Garamond, Georgia, serif" }}
              >
                1,200+
              </p>
              <p className="text-xs text-[#8B7355] mt-1">Happy Customers</p>
            </div>
            <div className="h-12 w-px bg-[#E0D0B8]" />
            <div className="text-center">
              <p
                className="text-4xl font-medium text-[#1A1208]"
                style={{ fontFamily: "Cormorant Garamond, Georgia, serif" }}
              >
                98%
              </p>
              <p className="text-xs text-[#8B7355] mt-1">Would Recommend</p>
            </div>
          </div>
        </motion.div>

        {/* Reviews Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10">
          {REVIEWS.map((review, i) => (
            <motion.div
              key={review.id}
              initial={{ opacity: 0, y: 32 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: i * 0.1, duration: 0.6 }}
            >
              <div
                className="flex flex-col h-full p-7 sm:p-9 rounded-3xl relative transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
                style={{
                  background: "#fff",
                  border: "1px solid #EDE4D4",
                  boxShadow: "0 6px 20px -10px rgba(26,18,8,0.06)",
                }}
              >
                {/* Quote icon */}
                <Quote
                  size={24}
                  className="text-[#E0D0B8] absolute top-5 right-5"
                  fill="currentColor"
                />

                {/* Stars */}
                <div className="flex gap-0.5 mb-3">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star
                      key={s}
                      size={14}
                      className={
                        s <= review.rating
                          ? "text-[#C4964A] fill-[#C4964A]"
                          : "text-[#E0D0B8]"
                      }
                    />
                  ))}
                </div>

                {/* Title */}
                <h4 className="text-base font-medium text-[#1A1208] mb-2 leading-snug" style={{ fontFamily: "Cormorant Garamond, Georgia, serif" }}>
                  {review.title}
                </h4>

                {/* Body */}
                <p className="text-sm text-[#8B7355] leading-relaxed flex-1">
                  {review.body}
                </p>

                {/* Author */}
                <div className="flex items-center gap-3 mt-5 pt-4 border-t border-[#EDE4D4]">
                  <div
                    className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-semibold"
                    style={{
                      background: "linear-gradient(135deg, #A87B32, #D4A96A)",
                      color: "#fff",
                    }}
                  >
                    {review.userName.charAt(0)}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-[#1A1208]">
                      {review.userName}
                    </p>
                    <div className="flex items-center gap-1.5">
                      {review.isVerified && (
                        <span className="text-[9px] font-semibold uppercase tracking-wider text-[#A87B32] bg-[#F5EFE4] px-1.5 py-0.5 rounded-full">
                          ✓ Verified
                        </span>
                      )}
                      <span className="text-xs text-[#C9B99A]">
                        {new Date(review.createdAt).toLocaleDateString("en-IN", {
                          month: "short",
                          year: "numeric",
                        })}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
