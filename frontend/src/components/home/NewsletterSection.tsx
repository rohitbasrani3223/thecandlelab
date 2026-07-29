"use client";

import { useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { Mail, ArrowRight, CheckCircle2, Sparkles } from "lucide-react";

export function NewsletterSection() {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-60px" });
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setIsLoading(true);
    await new Promise((r) => setTimeout(r, 1100));
    setIsLoading(false);
    setIsSubmitted(true);
  };

  return (
    <section
      ref={ref}
      className="section"
      style={{
        background: "linear-gradient(135deg, #1A1208 0%, #2D1A0E 50%, #1A1208 100%)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Ambient blobs */}
      <div
        className="absolute -left-40 top-0 w-80 h-80 rounded-full pointer-events-none"
        style={{
          background: "radial-gradient(circle, rgba(196,150,74,0.18), transparent 70%)",
        }}
      />
      <div
        className="absolute -right-40 bottom-0 w-80 h-80 rounded-full pointer-events-none"
        style={{
          background: "radial-gradient(circle, rgba(196,150,74,0.12), transparent 70%)",
        }}
      />

      <div className="container relative">
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.65 }}
          className="max-w-xl mx-auto text-center"
        >
          {/* Icon badge */}
          <div
            className="inline-flex items-center justify-center w-14 h-14 rounded-2xl mx-auto mb-5"
            style={{
              background: "rgba(196,150,74,0.12)",
              border: "1px solid rgba(196,150,74,0.28)",
            }}
          >
            <Mail size={26} className="text-[#C4964A]" strokeWidth={1.5} />
          </div>

          {/* Label */}
          <div className="flex items-center justify-center gap-2 mb-3">
            <Sparkles size={12} className="text-[#C4964A]" />
            <span
              className="text-[11px] font-bold tracking-[0.22em] uppercase"
              style={{ color: "#C4964A" }}
            >
              Stay in the loop
            </span>
            <Sparkles size={12} className="text-[#C4964A]" />
          </div>

          {/* Heading */}
          <h2
            className="mb-3 leading-tight"
            style={{
              fontFamily: "Cormorant Garamond, Georgia, serif",
              fontSize: "clamp(1.9rem, 5vw, 2.8rem)",
              fontWeight: 400,
              color: "#F5EFE4",
            }}
          >
            Join The Candle Lab Family
          </h2>

          {/* Subtext */}
          <p
            className="text-sm leading-relaxed mb-8 max-w-sm mx-auto"
            style={{ color: "#8B6A44" }}
          >
            Exclusive offers, new arrivals & fragrance tips — delivered to your inbox.
            Get <strong style={{ color: "#C4964A" }}>15% off</strong> your first order.
          </p>

          {/* ── Form or Success ── */}
          {!isSubmitted ? (
            <form
              onSubmit={handleSubmit}
              className="flex flex-col sm:flex-row gap-2.5 max-w-md mx-auto"
            >
              <input
                type="email"
                id="newsletter-email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email address"
                required
                suppressHydrationWarning
                className="flex-1 px-4 py-3 rounded-xl text-sm focus:outline-none"
                style={{
                  background: "rgba(253,250,245,0.07)",
                  border: "1.5px solid rgba(196,150,74,0.28)",
                  color: "#F5EFE4",
                  fontFamily: "Inter, sans-serif",
                  minWidth: 0,
                }}
              />
              <button
                type="submit"
                id="newsletter-submit"
                disabled={isLoading}
                suppressHydrationWarning
                className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-sm font-bold uppercase tracking-wider transition-all whitespace-nowrap disabled:opacity-70 flex-shrink-0"
                style={{
                  background:
                    "linear-gradient(135deg, #A87B32 0%, #C4964A 60%, #D4A96A 100%)",
                  color: "#fff",
                  boxShadow: "0 4px 20px rgba(196,150,74,0.35)",
                  letterSpacing: "0.08em",
                }}
              >
                {isLoading ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Subscribing...
                  </>
                ) : (
                  <>
                    Subscribe
                    <ArrowRight size={15} />
                  </>
                )}
              </button>
            </form>
          ) : (
            <motion.div
              initial={{ scale: 0.85, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", stiffness: 280, damping: 22 }}
              className="flex flex-col items-center gap-3"
            >
              <div
                className="w-14 h-14 rounded-full flex items-center justify-center"
                style={{ background: "rgba(196,150,74,0.18)" }}
              >
                <CheckCircle2 size={30} className="text-[#C4964A]" />
              </div>
              <p
                className="text-xl font-medium"
                style={{
                  fontFamily: "Cormorant Garamond, Georgia, serif",
                  color: "#F5EFE4",
                }}
              >
                You're on the list!
              </p>
              <p className="text-sm" style={{ color: "#8B6A44" }}>
                Check your inbox for a welcome email with your 15% discount code.
              </p>
            </motion.div>
          )}

          {/* Privacy note */}
          {!isSubmitted && (
            <p className="text-[11px] mt-4" style={{ color: "#4A3020" }}>
              No spam, ever. Unsubscribe at any time. We respect your privacy.
            </p>
          )}
        </motion.div>
      </div>
    </section>
  );
}
