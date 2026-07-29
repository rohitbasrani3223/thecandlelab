"use client";

import { useRef, useState } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { FAQS } from "@/data/mock";

export function FAQSection() {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-60px" });
  const [openId, setOpenId] = useState<string | null>("faq-1");

  return (
    <section ref={ref} className="section">
      <div className="container-sm">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="section-header"
        >
          <span className="section-label">Questions Answered</span>
          <div className="gold-divider mx-auto mb-4" />
          <h2 className="section-title">Frequently Asked Questions</h2>
          <p className="section-subtitle">
            Everything you need to know about our candles, shipping, and more.
          </p>
        </motion.div>

        {/* FAQ Accordion */}
        <div className="space-y-3">
          {FAQS.map((faq, i) => (
            <motion.div
              key={faq.id}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: i * 0.08, duration: 0.5 }}
            >
              <div
                className="rounded-xl overflow-hidden transition-all"
                style={{
                  background: "#fff",
                  border: `1.5px solid ${openId === faq.id ? "#C4964A" : "#EDE4D4"}`,
                  boxShadow:
                    openId === faq.id
                      ? "0 4px 20px rgba(196,150,74,0.12)"
                      : "0 2px 8px rgba(26,18,8,0.04)",
                }}
              >
                <button
                  onClick={() =>
                    setOpenId(openId === faq.id ? null : faq.id)
                  }
                  className="w-full flex items-center justify-between px-6 py-4 text-left"
                  id={`faq-btn-${faq.id}`}
                  aria-expanded={openId === faq.id}
                  suppressHydrationWarning
                >
                  <span className="font-medium text-[#1A1208] pr-4">
                    {faq.question}
                  </span>
                  <motion.div
                    animate={{ rotate: openId === faq.id ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                    className="flex-shrink-0"
                  >
                    <ChevronDown
                      size={18}
                      className={
                        openId === faq.id
                          ? "text-[#C4964A]"
                          : "text-[#8B7355]"
                      }
                    />
                  </motion.div>
                </button>

                <AnimatePresence>
                  {openId === faq.id && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
                      style={{ overflow: "hidden" }}
                    >
                      <div className="px-6 pb-5">
                        <div
                          className="h-px mb-4"
                          style={{ background: "#EDE4D4" }}
                        />
                        <p className="text-sm text-[#8B7355] leading-relaxed">
                          {faq.answer}
                        </p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Contact CTA */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ delay: 0.6 }}
          className="text-center mt-10 text-sm text-[#8B7355]"
        >
          Still have questions?{" "}
          <a
            href="/contact"
            className="text-[#A87B32] font-medium hover:underline underline-offset-2"
          >
            Contact our team →
          </a>
        </motion.p>
      </div>
    </section>
  );
}
