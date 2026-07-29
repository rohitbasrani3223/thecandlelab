"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Home, ShoppingBag, Flame, ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center p-6 text-center"
      style={{
        background: "linear-gradient(135deg, #1A1208 0%, #3D2010 50%, #1A1208 100%)",
        color: "#FDFAF5",
      }}
    >
      {/* Decorative Glow */}
      <div
        className="absolute w-96 h-96 rounded-full opacity-10 pointer-events-none"
        style={{ background: "radial-gradient(circle, #C4964A, transparent)" }}
      />

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="max-w-md relative z-10"
      >
        {/* Candle Flame animation */}
        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#A87B32] via-[#C4964A] to-[#D4A96A] flex items-center justify-center mx-auto mb-6 shadow-[0_0_30px_rgba(196,150,74,0.4)]">
          <Flame size={32} className="text-white animate-pulse" />
        </div>

        <span
          className="text-xs font-semibold tracking-[0.25em] uppercase"
          style={{ color: "#C4964A" }}
        >
          404 Error
        </span>

        <h1
          className="text-5xl sm:text-6xl font-light mt-3 mb-4"
          style={{ fontFamily: "Cormorant Garamond, Georgia, serif" }}
        >
          Flame Extinguished
        </h1>

        <p className="text-base text-[#A08060] mb-8 leading-relaxed">
          The page you are looking for doesn't exist or has been moved to another sanctuary. Let's guide you back to warmth.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link href="/" className="btn btn-gold gap-2" id="notfound-home-btn">
            <Home size={16} />
            Return Home
          </Link>
          <Link
            href="/shop"
            className="btn gap-2 text-[#FDFAF5]"
            style={{
              background: "rgba(255,255,255,0.1)",
              border: "1px solid rgba(255,255,255,0.2)",
            }}
            id="notfound-shop-btn"
          >
            <ShoppingBag size={16} />
            Explore Shop
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
