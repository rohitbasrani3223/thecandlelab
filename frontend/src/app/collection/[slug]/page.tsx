"use client";

import React, { useState, use } from "react";
import Link from "next/link";
import Image from "next/image";
import { useStore } from "@/context/StoreContext";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { ProductCard } from "@/components/ProductCard";
import { CartDrawer } from "@/components/CartDrawer";
import { WishlistDrawer } from "@/components/WishlistDrawer";
import { ProductDetailModal } from "@/components/ProductDetailModal";
import { ChevronRight, Sparkles } from "lucide-react";

export default function CollectionPage({
  params
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);
  const { collections, products } = useStore();

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState<any>(null);

  const collection = collections.find((c) => c.slug === slug) || collections[0];

  const collectionProducts = products.filter((p) =>
    p.collections.some((cSlug) => cSlug.toLowerCase() === slug.toLowerCase())
  );

  const displayProducts = collectionProducts.length > 0 ? collectionProducts : products.slice(0, 6);

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF7F2] dark:bg-[#151515] text-[#1F1F1F] dark:text-[#F8F5F0]">
      <Navbar
        onOpenCart={() => setIsCartOpen(true)}
        onOpenWishlist={() => setIsWishlistOpen(true)}
        onOpenAuthModal={() => {}}
        onOpenProfile={() => {}}
      />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16">
        {/* Breadcrumb */}
        <nav className="flex items-center text-xs text-[#666666] dark:text-[#A0A0A0] mb-8 space-x-2">
          <Link href="/" className="hover:text-[#C8A75A] transition-colors">Home</Link>
          <ChevronRight className="w-3 h-3" />
          <Link href="/shop" className="hover:text-[#C8A75A] transition-colors">Collections</Link>
          <ChevronRight className="w-3 h-3" />
          <span className="text-[#1F1F1F] dark:text-[#F8F5F0] font-medium">{collection.name}</span>
        </nav>

        {/* Collection Hero Showcase */}
        <div className="relative rounded-3xl overflow-hidden mb-16 border border-[#E6DFD3] dark:border-[#383838] shadow-luxury-hero bg-[#1F1F1F] text-white">
          <div className="relative h-[320px] sm:h-[420px] w-full">
            <Image
              src={collection.bannerImage}
              alt={collection.name}
              fill
              priority
              className="object-cover opacity-60 mix-blend-overlay"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent flex flex-col justify-end p-8 sm:p-12">
              <div className="flex items-center space-x-2 text-[#C8A75A] text-xs font-semibold uppercase tracking-widest mb-2">
                <Sparkles className="w-4 h-4" />
                <span>Curated Luxury Showcase</span>
              </div>
              <h1 className="text-4xl sm:text-6xl font-serif font-normal text-white mb-4">
                {collection.name}
              </h1>
              <p className="text-sm sm:text-base text-gray-300 max-w-2xl font-light">
                {collection.description}
              </p>
            </div>
          </div>
        </div>

        {/* Collection Products Grid */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-8 pb-4 border-b border-[#E6DFD3] dark:border-[#383838]">
            <h2 className="text-2xl font-serif font-normal text-[#1F1F1F] dark:text-[#F8F5F0]">
              Collection Items ({displayProducts.length})
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {displayProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onQuickView={(p) => setQuickViewProduct(p)}
              />
            ))}
          </div>
        </div>
      </main>

      <Footer />

      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} onOpenCheckout={() => {}} />
      <WishlistDrawer isOpen={isWishlistOpen} onClose={() => setIsWishlistOpen(false)} />
      {quickViewProduct && (
        <ProductDetailModal product={quickViewProduct} onClose={() => setQuickViewProduct(null)} />
      )}
    </div>
  );
}
