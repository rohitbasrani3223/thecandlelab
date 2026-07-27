"use client";

import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CartDrawer, { CartItem } from "@/components/CartDrawer";
import Link from "next/link";
import { Sparkles, ArrowRight } from "lucide-react";

const collectionsList = [
  {
    name: "Scented Candles",
    slug: "scented-candles",
    description: "Aromatherapy infused luxury soy wax candles engineered for clean, soot-free burn & room filling scents.",
    icon: "🕯️",
    count: "18 Products",
    bg: "from-[#F5EFE0] to-[#EDE4D0]"
  },
  {
    name: "Floral Collection",
    slug: "floral-collection",
    description: "Hand-poured floral bouquets featuring Damask Rose, French Jasmine, and Organic Lavender notes.",
    icon: "🌸",
    count: "12 Products",
    bg: "from-[#FEF2F0] to-[#F5EFE0]"
  },
  {
    name: "Vanilla Collection",
    slug: "vanilla-collection",
    description: "Warm Madagascar vanilla bean paired with spicy Ceylon cinnamon and golden amber base.",
    icon: "🍦",
    count: "10 Products",
    bg: "from-[#FFF8EC] to-[#F5EFE0]"
  },
  {
    name: "Coffee Collection",
    slug: "coffee-collection",
    description: "Rich roasted Arabica coffee bean accords infused with dark chocolate and hazelnut cream.",
    icon: "☕",
    count: "8 Products",
    bg: "from-[#EFEBE6] to-[#FAF8F4]"
  },
  {
    name: "Festive Collection",
    slug: "festive-collection",
    description: "Spiced cinnamon, glowing golden amber, and cardamom for festive Diwali & seasonal celebrations.",
    icon: "🎄",
    count: "14 Products",
    bg: "from-[#FFF8EC] to-[#EDE4D0]"
  },
  {
    name: "Gift Boxes",
    slug: "gift-boxes",
    description: "Curated luxury gift hamper boxes complete with hand-poured candles, wick trimmers, and matches.",
    icon: "🎁",
    count: "6 Gift Sets",
    bg: "from-[#EDFAF4] to-[#FAF8F4]"
  }
];

export default function CollectionsOverviewPage() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  const totalCartCount = cart.reduce((a, b) => a + b.quantity, 0);

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF8F4] font-sans">
      <Navbar cartCount={totalCartCount} onOpenCart={() => setIsCartOpen(true)} />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full space-y-10">
        {/* Banner */}
        <div className="bg-gradient-to-r from-[#2C2820] to-[#4A3425] text-white p-8 sm:p-12 rounded-3xl space-y-3 shadow-lg text-center sm:text-left">
          <span className="text-xs font-bold text-[#C9A84C] uppercase tracking-widest flex items-center justify-center sm:justify-start gap-1">
            <Sparkles className="w-4 h-4 text-[#C9A84C]" /> CURATED THEMATIC FRAGRANCES
          </span>
          <h1 className="font-serif-luxury font-bold text-3xl sm:text-5xl">
            Explore All Curated Collections
          </h1>
          <p className="text-xs sm:text-sm text-[#DDD5C4] max-w-2xl">
            Discover artisanal candles grouped by scent notes, moods, and hand-poured seasonal collections.
          </p>
        </div>

        {/* Collections Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {collectionsList.map((col, idx) => (
            <Link
              key={idx}
              href={`/collections/${col.slug}`}
              className={`p-8 rounded-3xl bg-gradient-to-br ${col.bg} border border-[#DDD5C4] hover:shadow-xl transition-all space-y-4 group flex flex-col justify-between`}
            >
              <div>
                <div className="w-14 h-14 rounded-2xl bg-white border border-[#DDD5C4] flex items-center justify-center text-2xl shadow-sm mb-4 group-hover:scale-110 transition-transform">
                  {col.icon}
                </div>
                <h3 className="font-serif-luxury font-bold text-xl text-[#2C2820] group-hover:text-[#C9A84C] transition-colors">
                  {col.name}
                </h3>
                <p className="text-xs text-[#6B4E35] mt-2 leading-relaxed font-medium">
                  {col.description}
                </p>
              </div>

              <div className="pt-4 border-t border-[#DDD5C4]/60 flex items-center justify-between">
                <span className="text-xs font-bold text-[#8B6B47] uppercase tracking-wider">
                  {col.count}
                </span>
                <span className="inline-flex items-center gap-1 text-xs font-bold text-[#C9A84C] group-hover:translate-x-1 transition-transform">
                  Browse Collection <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </main>

      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cart}
        onUpdateQuantity={(id, delta) => {}}
        onRemoveItem={(id) => {}}
      />

      <Footer />
    </div>
  );
}
