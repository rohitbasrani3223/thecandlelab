"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Sparkles, Truck, Gift, Star } from "lucide-react";

const ANNOUNCEMENTS = [
  {
    id: 1,
    icon: <Truck size={12} className="text-[#C4964A]" />,
    text: "FREE SHIPPING on all orders above ₹999",
    highlight: "₹999",
  },
  {
    id: 2,
    icon: <Sparkles size={12} className="text-[#C4964A]" />,
    text: "NEW LAUNCH — Midnight Jasmine & Amber Vetiver is here",
    highlight: "Midnight Jasmine",
  },
  {
    id: 3,
    icon: <Gift size={12} className="text-[#C4964A]" />,
    text: "USE CODE LUXURY15 — Get 15% off your first order",
    highlight: "LUXURY15",
  },
  {
    id: 4,
    icon: <Star size={12} className="text-[#C4964A]" />,
    text: "100% Natural Soy & Beeswax — Clean Burn Promise",
    highlight: "Clean Burn",
  },
];

export function AnnouncementBar() {
  const [current, setCurrent] = useState(0);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    if (dismissed) return;
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % ANNOUNCEMENTS.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [dismissed]);

  if (dismissed) return null;

  const announcement = ANNOUNCEMENTS[current];

  return (
    <div
      className="relative w-full z-[400] flex items-center justify-center px-4 py-2"
      style={{
        background: "linear-gradient(90deg, #1A1208 0%, #3D2010 50%, #1A1208 100%)",
        borderBottom: "1px solid rgba(196,150,74,0.25)",
      }}
    >
      {/* Rotating Text */}
      <AnimatePresence mode="wait">
        <motion.div
          key={announcement.id}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.35 }}
          className="flex items-center gap-2 text-[#F5EFE4]"
        >
          {announcement.icon}
          <span className="text-[10px] sm:text-[11px] font-medium tracking-[0.18em] uppercase">
            {announcement.text.split(announcement.highlight).map((part, i) => (
              <span key={i}>
                {part}
                {i < announcement.text.split(announcement.highlight).length - 1 && (
                  <span className="text-[#C4964A] font-bold">{announcement.highlight}</span>
                )}
              </span>
            ))}
          </span>
        </motion.div>
      </AnimatePresence>

      {/* Dot indicators */}
      <div className="absolute left-1/2 -translate-x-1/2 bottom-0.5 flex gap-1 opacity-0 sm:opacity-60">
        {ANNOUNCEMENTS.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className="w-1 h-1 rounded-full transition-all"
            style={{ background: i === current ? "#C4964A" : "rgba(245,239,228,0.35)" }}
          />
        ))}
      </div>

      {/* Dismiss */}
      <button
        onClick={() => setDismissed(true)}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-[#F5EFE4]/50 hover:text-[#F5EFE4] transition-colors"
        aria-label="Dismiss announcement"
      >
        <X size={13} />
      </button>
    </div>
  );
}
