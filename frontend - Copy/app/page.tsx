"use client";

import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import ProductCard, { Product } from "@/components/ProductCard";
import CartDrawer, { CartItem } from "@/components/CartDrawer";
import Footer from "@/components/Footer";
import { Sparkles, Star, Flame, Award, HeartHandshake, ArrowRight } from "lucide-react";
import Link from "next/link";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8085/api";

const initialProducts: Product[] = [
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

export default function Home() {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("ALL");

  useEffect(() => {
    fetch(`${API_BASE}/admin/products?page=0&size=20`)
      .then((res) => res.json())
      .then((json) => {
        const list = json?.data?.content ?? json?.data ?? [];
        if (Array.isArray(list) && list.length > 0) {
          const mapped: Product[] = list
            .filter((p: any) => p.status === "ACTIVE")
            .map((p: any) => ({
              id: String(p.id),
              name: p.name,
              category: p.subCategory?.mainCategory?.name || p.subCategory?.name || "Scented Candles",
              price: p.inventory?.[0]?.price ? Number(p.inventory[0].price) : 999,
              salePrice: p.inventory?.[0]?.salePrice ? Number(p.inventory[0].salePrice) : undefined,
              rating: 4.9,
              reviewsCount: 84,
              fragranceNotes: p.shortDescription || p.description || "Hand-poured Luxury Soy Wax Candle",
              inStock: (p.inventory?.[0]?.currentStock ?? 1) > 0,
              imageUrl: p.images?.[0]?.imageUrl || undefined,
              imageBg: "bg-amber-50"
            }));
          if (mapped.length > 0) setProducts(mapped);
        }
      })
      .catch(() => {});
  }, []);

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

  const handleUpdateQuantity = (productId: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((item) =>
          item.product.id === productId
            ? { ...item, quantity: Math.max(0, item.quantity + delta) }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  const handleRemoveItem = (productId: string) => {
    setCart((prev) => prev.filter((item) => item.product.id !== productId));
  };

  const totalCartCount = cart.reduce((a, b) => a + b.quantity, 0);

  const filteredProducts = products.filter((p) => {
    if (activeTab === "ALL") return true;
    if (activeTab === "CANDLES") return p.category === "Scented Candles";
    if (activeTab === "JARS") return p.category === "Luxury Jars";
    if (activeTab === "MELTS") return p.category === "Wax Melts";
    return true;
  });

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF8F4] font-sans">
      {/* Header Navbar */}
      <Navbar cartCount={totalCartCount} onOpenCart={() => setIsCartOpen(true)} />

      <main className="flex-1 space-y-16 pb-16">
        {/* Hero Section */}
        <HeroSection />

        {/* Categories Showcase */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-xl mx-auto space-y-2 mb-10">
            <span className="text-xs font-bold text-[#C9A84C] uppercase tracking-widest">
              CURATED COLLECTIONS
            </span>
            <h2 className="font-serif-luxury font-bold text-3xl text-[#2C2820]">
              Shop By Fragrance Category
            </h2>
            <p className="text-xs text-[#9B9591]">
              Explore our hand-poured candle categories crafted for every mood and season.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { title: "Scented Candles", count: "18 Products", bg: "from-[#F5EFE0] to-[#EDE4D0]" },
              { title: "Luxury Amber Jars", count: "12 Products", bg: "from-[#FFF8EC] to-[#F5EFE0]" },
              { title: "Wax Melts", count: "14 Products", bg: "from-[#FEF2F0] to-[#F5EFE0]" },
              { title: "Festive Gift Hampers", count: "8 Products", bg: "from-[#EFF5FF] to-[#F5EFE0]" }
            ].map((cat, idx) => (
              <Link
                key={idx}
                href="/shop"
                className={`p-6 rounded-3xl bg-gradient-to-br ${cat.bg} border border-[#DDD5C4] hover:shadow-lg transition-all group`}
              >
                <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center text-[#C9A84C] shadow-sm mb-4 group-hover:scale-110 transition-transform">
                  <Sparkles className="w-6 h-6" />
                </div>
                <h3 className="font-serif-luxury font-bold text-lg text-[#2C2820] group-hover:text-[#C9A84C] transition-colors">
                  {cat.title}
                </h3>
                <p className="text-xs text-[#8B6B47] mt-1 font-medium">{cat.count}</p>
              </Link>
            ))}
          </div>
        </section>

        {/* Featured Products Grid */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8 pb-4 border-b border-[#DDD5C4]">
            <div>
              <h2 className="font-serif-luxury font-bold text-2xl text-[#2C2820]">
                Featured Luxury Fragrances
              </h2>
              <p className="text-xs text-[#9B9591]">Hand-picked customer favorites</p>
            </div>

            {/* Filter Tabs */}
            <div className="flex items-center gap-2">
              {[
                { id: "ALL", label: "All Items" },
                { id: "CANDLES", label: "Candles" },
                { id: "JARS", label: "Luxury Jars" },
                { id: "MELTS", label: "Wax Melts" }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`text-xs font-semibold px-3 py-1.5 rounded-full transition-all ${
                    activeTab === tab.id
                      ? "bg-[#2C2820] text-white"
                      : "bg-[#F5EFE0] text-[#6B4E35] hover:bg-[#EDE4D0]"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredProducts.map((p) => (
              <ProductCard key={p.id} product={p} onAddToCart={handleAddToCart} />
            ))}
          </div>
        </section>

        {/* Why Choose The Candle Lab */}
        <section className="bg-gradient-to-r from-[#2C2820] via-[#4A3425] to-[#2C2820] text-white py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-10">
            <div className="max-w-xl mx-auto space-y-2">
              <span className="text-xs font-bold text-[#C9A84C] uppercase tracking-widest">
                OUR COMMITMENT TO QUALITY
              </span>
              <h2 className="font-serif-luxury font-bold text-3xl">
                The Candle Lab Standard
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
              <div className="p-6 rounded-2xl bg-white/5 border border-white/10 space-y-3">
                <div className="w-10 h-10 rounded-xl bg-[#C9A84C] text-[#2C2820] flex items-center justify-center font-bold">
                  <Flame className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-base text-white">100% Pure Soy Wax</h3>
                <p className="text-xs text-[#DDD5C4] leading-relaxed">
                  We use biodegradable eco-friendly soy wax derived from soybean oils, ensuring clean, non-toxic burns without soot or petrol-paraffin smoke.
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-white/5 border border-white/10 space-y-3">
                <div className="w-10 h-10 rounded-xl bg-[#C9A84C] text-[#2C2820] flex items-center justify-center font-bold">
                  <Award className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-base text-white">Essential Oils Scent Throw</h3>
                <p className="text-xs text-[#DDD5C4] leading-relaxed">
                  Infused with highest concentration IFRA-certified botanical fragrance oils for maximum hot and cold scent throw across any room.
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-white/5 border border-white/10 space-y-3">
                <div className="w-10 h-10 rounded-xl bg-[#C9A84C] text-[#2C2820] flex items-center justify-center font-bold">
                  <HeartHandshake className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-base text-white">Hand-Poured In India</h3>
                <p className="text-xs text-[#DDD5C4] leading-relaxed">
                  Every single candle is meticulously measured, wicked, and hand-poured in small artisanal batches to guarantee perfection.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Customer Reviews Section */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-xl mx-auto space-y-2 mb-10">
            <span className="text-xs font-bold text-[#C9A84C] uppercase tracking-widest">
              VERIFIED REVIEWS
            </span>
            <h2 className="font-serif-luxury font-bold text-3xl text-[#2C2820]">
              Loved By Fragrance Connoisseurs
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { name: "Ananya Roy", city: "Mumbai", quote: "The French Vanilla scent fills my entire living room within minutes! Absolutely in love with the burn time and luxury jar packaging.", candle: "French Vanilla Jar" },
              { name: "Siddharth Malhotra", city: "Bengaluru", quote: "Amber & Oud is hands down the best candle I've purchased in India. Beats expensive imported brands by a mile!", candle: "Amber & Oud Royal" },
              { name: "Meera Kapoor", city: "Delhi", quote: "Fast shipping, beautiful gift box packaging, and clean soot-free burn. Will definitely reorder for festive gifting!", candle: "Rose & Cardamom Melts" }
            ].map((rev, idx) => (
              <div key={idx} className="p-6 rounded-3xl bg-white border border-[#EDE8DF] shadow-sm space-y-4">
                <div className="flex items-center text-[#C9A84C]">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-[#C9A84C]" />
                  ))}
                </div>
                <p className="text-xs text-[#4A4540] italic leading-relaxed">
                  &ldquo;{rev.quote}&rdquo;
                </p>
                <div className="pt-3 border-t border-[#EDE8DF] flex items-center justify-between">
                  <div>
                    <h5 className="font-bold text-xs text-[#2C2820]">{rev.name}</h5>
                    <p className="text-[10px] text-[#9B9591]">{rev.city}</p>
                  </div>
                  <span className="text-[10px] font-semibold text-[#8B6B47] bg-[#F5EFE0] px-2 py-0.5 rounded-full">
                    {rev.candle}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* Cart Drawer Overlay */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cart}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
      />

      {/* Footer */}
      <Footer />
    </div>
  );
}
