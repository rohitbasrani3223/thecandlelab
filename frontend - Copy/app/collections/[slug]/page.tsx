"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import Navbar from "@/components/Navbar";
import ProductCard, { Product } from "@/components/ProductCard";
import CartDrawer, { CartItem } from "@/components/CartDrawer";
import Footer from "@/components/Footer";
import Link from "next/link";
import { ArrowLeft, Sparkles } from "lucide-react";

const allProducts: Product[] = [
  {
    id: "1",
    name: "French Vanilla & Cinnamon Scented Jar",
    category: "Scented Candles",
    price: 1199,
    salePrice: 899,
    rating: 4.9,
    reviewsCount: 128,
    fragranceNotes: "Vanilla Bean, Ceylon Cinnamon, Warm Amber",
    inStock: true,
    imageBg: "bg-amber-50"
  },
  {
    id: "2",
    name: "Amber & Oud Royal Glass Candle",
    category: "Luxury Jars",
    price: 1499,
    salePrice: 1299,
    rating: 5.0,
    reviewsCount: 94,
    fragranceNotes: "Golden Amber, Cambodian Oud, Sandalwood",
    inStock: true,
    imageBg: "bg-[#F5EFE0]"
  },
  {
    id: "3",
    name: "Rose Petals & Cardamom Wax Melts",
    category: "Wax Melts",
    price: 599,
    salePrice: 499,
    rating: 4.8,
    reviewsCount: 62,
    fragranceNotes: "Damask Rose, Spiced Cardamom, Soft Musk",
    inStock: true,
    imageBg: "bg-rose-50"
  },
  {
    id: "4",
    name: "Midnight Lavender & Sage Pillar Candle",
    category: "Scented Candles",
    price: 1199,
    rating: 4.7,
    reviewsCount: 45,
    fragranceNotes: "French Lavender, White Sage, Bergamot",
    inStock: true,
    imageBg: "bg-purple-50"
  }
];

export default function CollectionDetailPage() {
  const params = useParams();
  const slug = params?.slug as string;

  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  const formattedName = (slug || "scented-candles")
    .replace(/-/g, " ")
    .toUpperCase();

  const handleAddToCart = (product: Product) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { product, quantity: 1 }];
    });
    setIsCartOpen(true);
  };

  const totalCartCount = cart.reduce((a, b) => a + b.quantity, 0);

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF8F4] font-sans">
      <Navbar cartCount={totalCartCount} onOpenCart={() => setIsCartOpen(true)} />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full space-y-8">
        <Link href="/collections" className="inline-flex items-center gap-1 text-xs font-semibold text-[#8B6B47] hover:underline">
          <ArrowLeft className="w-4 h-4" /> All Collections
        </Link>

        {/* Collection Header Banner */}
        <div className="bg-gradient-to-r from-[#2C2820] to-[#4A3425] text-white p-8 rounded-3xl space-y-2 shadow-lg">
          <span className="text-xs font-bold text-[#C9A84C] uppercase tracking-widest flex items-center gap-1">
            <Sparkles className="w-4 h-4 text-[#C9A84C]" /> CURATED FRAGRANCE THEME
          </span>
          <h1 className="font-serif-luxury font-bold text-3xl sm:text-4xl">
            {formattedName}
          </h1>
          <p className="text-xs text-[#DDD5C4]">
            Hand-poured 100% soy wax candles crafted specifically for the {formattedName} collection.
          </p>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {allProducts.map((p) => (
            <ProductCard key={p.id} product={p} onAddToCart={handleAddToCart} />
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
