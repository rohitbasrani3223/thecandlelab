"use client";

import React, { useState } from "react";
import { useStore, CandleProduct } from "@/context/StoreContext";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { ProductCard } from "@/components/ProductCard";
import { FragranceQuizModal } from "@/components/FragranceQuizModal";
import { BundleBuilderModal } from "@/components/BundleBuilderModal";
import { CandleCustomizerModal } from "@/components/CandleCustomizerModal";
import { AIChatConcierge } from "@/components/AIChatConcierge";
import { CompareModal } from "@/components/CompareModal";
import { WishlistDrawer } from "@/components/WishlistDrawer";
import { VoiceImageSearch } from "@/components/VoiceImageSearch";
import { LoyaltyReferralModal } from "@/components/LoyaltyReferralModal";
import { CorporateOrdersModal } from "@/components/CorporateOrdersModal";
import { CustomerDashboardModal } from "@/components/CustomerDashboardModal";
import { CollectionsManagerModal } from "@/components/CollectionsManagerModal";
import { CartDrawer } from "@/components/CartDrawer";
import { CheckoutModal } from "@/components/CheckoutModal";
import { SellerDashboard } from "@/components/SellerDashboard";
import { AdminDashboard } from "@/components/AdminDashboard";
import { ProductDetailModal } from "@/components/ProductDetailModal";
import {
  Flame,
  Sparkles,
  Compass,
  Gift,
  Layers,
  SlidersHorizontal,
  Building2,
  Clock,
  Leaf,
  ArrowRight
} from "lucide-react";

export default function HomePage() {
  const {
    collections,
    products,
    searchQuery,
    activeRole,
    toastMessage,
    currency
  } = useStore();

  // Modals state
  const [isQuizOpen, setIsQuizOpen] = useState(false);
  const [isBundleOpen, setIsBundleOpen] = useState(false);
  const [isCustomizerOpen, setIsCustomizerOpen] = useState(false);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const [isLoyaltyOpen, setIsLoyaltyOpen] = useState(false);
  const [isCorporateOpen, setIsCorporateOpen] = useState(false);
  const [isVoiceImageSearchOpen, setIsVoiceImageSearchOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isCollectionsModalOpen, setIsCollectionsModalOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState<CandleProduct | null>(null);

  // Filters state
  const [selectedCollectionSlug, setSelectedCollectionSlug] = useState<string>("all");
  const [selectedWaxType, setSelectedWaxType] = useState<string>("all");
  const [selectedWickType, setSelectedWickType] = useState<string>("all");
  const [maxPrice, setMaxPrice] = useState<number>(2500);

  // Filter Products
  const filteredProducts = products.filter((product) => {
    if (searchQuery.trim() !== "") {
      const q = searchQuery.toLowerCase();
      const nameMatch = product.name.toLowerCase().includes(q);
      const categoryMatch = product.category.toLowerCase().includes(q);
      const waxMatch = product.waxType.toLowerCase().includes(q);
      const topNoteMatch = product.fragranceNotes.top.some((n) => n.toLowerCase().includes(q));
      const baseNoteMatch = product.fragranceNotes.base.some((n) => n.toLowerCase().includes(q));
      if (!nameMatch && !categoryMatch && !waxMatch && !topNoteMatch && !baseNoteMatch) {
        return false;
      }
    }

    if (selectedCollectionSlug !== "all") {
      if (!product.collections.includes(selectedCollectionSlug)) {
        return false;
      }
    }

    if (selectedWaxType !== "all" && product.waxType !== selectedWaxType) {
      return false;
    }

    if (selectedWickType !== "all" && product.wickType !== selectedWickType) {
      return false;
    }

    if (product.price > maxPrice) {
      return false;
    }

    return true;
  });

  // Dedicated Back-Office views if role active
  if (activeRole === "seller") {
    return (
      <div className="min-h-screen bg-[#FAF7F2] dark:bg-[#151515] font-sans text-[#1F1F1F] dark:text-[#F8F5F0]">
        <Navbar
          onOpenCollectionsModal={() => setIsCollectionsModalOpen(true)}
          onOpenCart={() => setIsCartOpen(true)}
          onOpenCustomizer={() => setIsCustomizerOpen(true)}
          onOpenWishlist={() => setIsWishlistOpen(true)}
          onOpenLoyalty={() => setIsLoyaltyOpen(true)}
          onOpenCorporate={() => setIsCorporateOpen(true)}
          onOpenVoiceImageSearch={() => setIsVoiceImageSearchOpen(true)}
          onOpenProfile={() => setIsProfileOpen(true)}
        />
        <SellerDashboard onOpenCollectionsModal={() => setIsCollectionsModalOpen(true)} />
        <CollectionsManagerModal
          isOpen={isCollectionsModalOpen}
          onClose={() => setIsCollectionsModalOpen(false)}
        />
        <CandleCustomizerModal isOpen={isCustomizerOpen} onClose={() => setIsCustomizerOpen(false)} />
        <Footer />
      </div>
    );
  }

  if (activeRole === "admin") {
    return (
      <div className="min-h-screen bg-[#FAF7F2] dark:bg-[#151515] font-sans text-[#1F1F1F] dark:text-[#F8F5F0]">
        <Navbar
          onOpenCollectionsModal={() => setIsCollectionsModalOpen(true)}
          onOpenCart={() => setIsCartOpen(true)}
          onOpenCustomizer={() => setIsCustomizerOpen(true)}
          onOpenWishlist={() => setIsWishlistOpen(true)}
          onOpenLoyalty={() => setIsLoyaltyOpen(true)}
          onOpenCorporate={() => setIsCorporateOpen(true)}
          onOpenVoiceImageSearch={() => setIsVoiceImageSearchOpen(true)}
          onOpenProfile={() => setIsProfileOpen(true)}
        />
        <AdminDashboard onOpenCollectionsModal={() => setIsCollectionsModalOpen(true)} />
        <CollectionsManagerModal
          isOpen={isCollectionsModalOpen}
          onClose={() => setIsCollectionsModalOpen(false)}
        />
        <CandleCustomizerModal isOpen={isCustomizerOpen} onClose={() => setIsCustomizerOpen(false)} />
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAF7F2] dark:bg-[#151515] font-sans text-[#1F1F1F] dark:text-[#F8F5F0] selection:bg-[#C8A75A] selection:text-white transition-colors duration-300">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-24 right-6 z-50 bg-[#FFFFFF] dark:bg-[#1E1E1E] text-[#1F1F1F] dark:text-[#F8F5F0] border border-[#C8A75A] px-4 py-3 rounded-2xl shadow-luxury-light flex items-center gap-2 text-xs font-bold animate-bounce">
          <Sparkles className="w-4 h-4 text-[#C8A75A]" />
          {toastMessage}
        </div>
      )}

      {/* Main Luxury Storefront Navigation */}
      <Navbar
        onOpenQuiz={() => setIsQuizOpen(true)}
        onOpenBundle={() => setIsBundleOpen(true)}
        onOpenCustomizer={() => setIsCustomizerOpen(true)}
        onOpenWishlist={() => setIsWishlistOpen(true)}
        onOpenLoyalty={() => setIsLoyaltyOpen(true)}
        onOpenCorporate={() => setIsCorporateOpen(true)}
        onOpenVoiceImageSearch={() => setIsVoiceImageSearchOpen(true)}
        onOpenProfile={() => setIsProfileOpen(true)}
        onOpenCollectionsModal={() => setIsCollectionsModalOpen(true)}
        onOpenCart={() => setIsCartOpen(true)}
      />

      {/* Editorial Light Luxury Hero Section */}
      <section className="relative w-full bg-[#F4EFE8] dark:bg-[#1D1D1D] text-[#1F1F1F] dark:text-[#F8F5F0] overflow-hidden py-16 lg:py-24 border-b border-[#E6DFD3] dark:border-[#383838] transition-colors">
        
        <div className="max-w-7xl mx-auto px-4 lg:px-8 relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          
          <div className="space-y-6 text-center lg:text-left">
            <span className="text-[11px] font-semibold text-[#C8A75A] uppercase tracking-[0.25em] block">
              PREMIUM HOME FRAGRANCES
            </span>

            <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-normal tracking-tight leading-[1.12] text-[#1F1F1F] dark:text-[#F8F5F0]">
              Crafted to Glow. <br className="hidden sm:inline" />
              <span className="font-serif italic text-[#C8A75A]">Designed to Inspire.</span>
            </h1>

            <p className="text-xs md:text-sm text-[#666666] dark:text-[#D8D2C8] max-w-lg mx-auto lg:mx-0 font-light leading-relaxed">
              Handcrafted luxury candles designed to fill your home with warmth, fragrance, and elegance. Pure soy & beeswax hand-poured with crackling wooden wicks.
            </p>

            {/* Action Buttons */}
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
              <button
                onClick={() => setIsCustomizerOpen(true)}
                className="w-full sm:w-auto bg-[#C8A75A] text-white px-8 py-3.5 rounded-2xl text-xs font-semibold uppercase tracking-wider hover:bg-[#D4B46A] transition-all shadow-sm flex items-center justify-center gap-2"
              >
                <Sparkles className="w-4 h-4 text-white" /> BUILD YOUR CANDLE
              </button>

              <button
                onClick={() => setIsQuizOpen(true)}
                className="w-full sm:w-auto bg-white dark:bg-[#1E1E1E] text-[#1F1F1F] dark:text-[#F8F5F0] border border-[#C8A75A] px-8 py-3.5 rounded-2xl text-xs font-semibold uppercase tracking-wider hover:bg-[#FAF7F2] dark:hover:bg-[#232323] transition-all flex items-center justify-center gap-2"
              >
                <Compass className="w-4 h-4 text-[#C8A75A]" /> TAKE THE FRAGRANCE QUIZ
              </button>
            </div>

            {/* Micro Features Bar */}
            <div className="pt-8 border-t border-[#E6DFD3] dark:border-[#383838] grid grid-cols-3 gap-4 text-center lg:text-left text-xs text-[#666666] dark:text-[#D8D2C8]">
              <div className="flex items-center gap-2.5">
                <Leaf className="w-5 h-5 text-[#C8A75A]" />
                <div>
                  <span className="block font-serif font-bold text-[#1F1F1F] dark:text-[#F8F5F0]">100% Natural</span>
                  <span className="text-[11px] text-[#666666] dark:text-[#A8A29E] font-light">Soy & Beeswax</span>
                </div>
              </div>
              <div className="flex items-center gap-2.5">
                <Clock className="w-5 h-5 text-[#C8A75A]" />
                <div>
                  <span className="block font-serif font-bold text-[#1F1F1F] dark:text-[#F8F5F0]">55+ Hours</span>
                  <span className="text-[11px] text-[#666666] dark:text-[#A8A29E] font-light">Clean Burn Time</span>
                </div>
              </div>
              <div className="flex items-center gap-2.5">
                <Layers className="w-5 h-5 text-[#C8A75A]" />
                <div>
                  <span className="block font-serif font-bold text-[#1F1F1F] dark:text-[#F8F5F0]">3-Layer</span>
                  <span className="text-[11px] text-[#666666] dark:text-[#A8A29E] font-light">Fragrance Pyramid</span>
                </div>
              </div>
            </div>
          </div>

          {/* Hero Image Showcase */}
          <div className="relative flex items-center justify-center">
            <div className="relative w-full max-w-md aspect-square rounded-3xl overflow-hidden border border-[#E6DFD3] dark:border-[#383838] shadow-luxury-hero bg-white">
              <img
                src="https://images.unsplash.com/photo-1603006905003-be475563bc59?auto=format&fit=crop&w=1000&q=80"
                alt="The Candle Lab Bestseller"
                className="w-full h-full object-cover"
              />
              
              <div className="absolute bottom-4 left-4 right-4 bg-white/95 dark:bg-[#151515]/95 backdrop-blur-md p-4 rounded-2xl border border-[#E6DFD3] dark:border-[#383838] text-[#1F1F1F] dark:text-[#F8F5F0] flex items-center justify-between shadow-sm">
                <div>
                  <h4 className="font-serif text-xs font-bold text-[#1F1F1F] dark:text-[#F8F5F0]">Velvet Amber & Smoked Oud</h4>
                  <p className="text-[10px] text-[#666666] dark:text-[#A8A29E] font-light mt-0.5">Top: Amber, Bergamot | Heart: Oud, Jasmine | Base: Sandalwood, Musk</p>
                </div>
                <span className="text-xs font-serif font-bold text-[#1F1F1F] dark:text-[#F8F5F0] bg-[#FAF7F2] dark:bg-[#1E1E1E] px-3 py-1 rounded-full border border-[#E6DFD3] dark:border-[#383838]">
                  {currency}899
                </span>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* Shop by Collection */}
      <section className="py-16 px-4 lg:px-8 max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-8 gap-4 border-b border-[#E6DFD3] dark:border-[#383838] pb-4">
          <div>
            <span className="text-[11px] font-semibold uppercase tracking-widest text-[#C8A75A] block">
              CURATED AROMAS
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl font-normal text-[#1F1F1F] dark:text-[#F8F5F0] mt-1">
              Shop by Collection
            </h2>
          </div>

          <a href="#shop-catalog" className="text-xs font-semibold text-[#C8A75A] hover:underline flex items-center gap-1">
            VIEW ALL COLLECTIONS <ArrowRight className="w-3.5 h-3.5" />
          </a>
        </div>

        {/* Collections Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3.5">
          <button
            onClick={() => setSelectedCollectionSlug("all")}
            className={`p-4 rounded-2xl border text-center transition-all flex flex-col items-center gap-2 ${
              selectedCollectionSlug === "all"
                ? "bg-white dark:bg-[#1E1E1E] text-[#C8A75A] border-[#C8A75A] font-bold shadow-luxury-light scale-102"
                : "bg-white dark:bg-[#1E1E1E] border-[#E6DFD3] dark:border-[#383838] text-[#1F1F1F] dark:text-[#D8D2C8] hover:border-[#C8A75A]"
            }`}
          >
            <span className="text-2xl">🕯️</span>
            <span className="text-xs font-serif font-medium">All Items</span>
          </button>

          {collections.map((col) => (
            <button
              key={col.id}
              onClick={() => setSelectedCollectionSlug(col.slug)}
              className={`p-4 rounded-2xl border text-center transition-all flex flex-col items-center gap-2 ${
                selectedCollectionSlug === col.slug
                  ? "bg-white dark:bg-[#1E1E1E] text-[#C8A75A] border-[#C8A75A] font-bold shadow-luxury-light scale-102"
                  : "bg-white dark:bg-[#1E1E1E] border-[#E6DFD3] dark:border-[#383838] text-[#1F1F1F] dark:text-[#D8D2C8] hover:border-[#C8A75A]"
              }`}
            >
              <span className="text-2xl">{col.iconSymbol || "🕯️"}</span>
              <span className="text-xs font-serif font-medium line-clamp-1">{col.name}</span>
            </button>
          ))}
        </div>
      </section>

      {/* Main Catalog & Filter Section */}
      <section id="shop-catalog" className="py-12 px-4 lg:px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* Sidebar Filter Panel */}
          <div className="lg:col-span-1 bg-white dark:bg-[#1E1E1E] p-5 rounded-2xl border border-[#E6DFD3] dark:border-[#383838] shadow-luxury-light space-y-6 h-fit sticky top-24">
            <div className="flex items-center justify-between border-b border-[#E6DFD3] dark:border-[#383838] pb-3">
              <h3 className="font-serif text-sm font-bold text-[#1F1F1F] dark:text-[#F8F5F0] flex items-center gap-2">
                <SlidersHorizontal className="w-4 h-4 text-[#C8A75A]" /> Filter Candles
              </h3>
              {(selectedCollectionSlug !== "all" || selectedWaxType !== "all" || selectedWickType !== "all") && (
                <button
                  onClick={() => {
                    setSelectedCollectionSlug("all");
                    setSelectedWaxType("all");
                    setSelectedWickType("all");
                    setMaxPrice(2500);
                  }}
                  className="text-[11px] text-[#C94A4A] font-medium underline"
                >
                  Reset
                </button>
              )}
            </div>

            {/* Collection Filter */}
            <div className="space-y-2">
              <label className="text-xs font-serif font-semibold text-[#C8A75A] uppercase tracking-wider block">
                Collection
              </label>
              <select
                value={selectedCollectionSlug}
                onChange={(e) => setSelectedCollectionSlug(e.target.value)}
                className="w-full text-xs p-2.5 rounded-xl border border-[#E6DFD3] dark:border-[#383838] bg-[#FAF7F2] dark:bg-[#151515] focus:outline-none focus:border-[#C8A75A] text-[#1F1F1F] dark:text-[#F8F5F0]"
              >
                <option value="all">All Collections ({collections.length})</option>
                {collections.map((c) => (
                  <option key={c.id} value={c.slug}>
                    {c.iconSymbol} {c.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Wax Type Filter */}
            <div className="space-y-2">
              <label className="text-xs font-serif font-semibold text-[#C8A75A] uppercase tracking-wider block">
                Wax Type
              </label>
              <div className="space-y-1.5 text-xs text-[#666666] dark:text-[#D8D2C8]">
                {["all", "Soy Wax", "Beeswax", "Coconut Wax", "Paraffin Blend"].map((w) => (
                  <label key={w} className="flex items-center gap-2 cursor-pointer hover:text-[#C8A75A]">
                    <input
                      type="radio"
                      name="wax"
                      checked={selectedWaxType === w}
                      onChange={() => setSelectedWaxType(w)}
                      className="text-[#C8A75A] focus:ring-[#C8A75A]"
                    />
                    <span>{w === "all" ? "All Wax Types" : w}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Wick Type Filter */}
            <div className="space-y-2">
              <label className="text-xs font-serif font-semibold text-[#C8A75A] uppercase tracking-wider block">
                Wick Type
              </label>
              <div className="space-y-1.5 text-xs text-[#666666] dark:text-[#D8D2C8]">
                {["all", "Wooden Crackling Wick", "Cotton Wick"].map((wk) => (
                  <label key={wk} className="flex items-center gap-2 cursor-pointer hover:text-[#C8A75A]">
                    <input
                      type="radio"
                      name="wick"
                      checked={selectedWickType === wk}
                      onChange={() => setSelectedWickType(wk)}
                      className="text-[#C8A75A] focus:ring-[#C8A75A]"
                    />
                    <span>{wk === "all" ? "All Wick Types" : wk}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Price Filter */}
            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs font-serif font-bold text-[#1F1F1F] dark:text-[#F8F5F0]">
                <span>Max Price:</span>
                <span className="text-[#C8A75A]">{currency}{maxPrice}</span>
              </div>
              <input
                type="range"
                min={400}
                max={2500}
                step={50}
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                className="w-full accent-[#C8A75A]"
              />
            </div>
          </div>

          {/* Products Grid */}
          <div className="lg:col-span-3 space-y-6">
            <div className="flex items-center justify-between border-b border-[#E6DFD3] dark:border-[#383838] pb-3">
              <span className="text-xs font-medium text-[#666666] dark:text-[#A8A29E]">
                Showing {filteredProducts.length} Luxury Candles
              </span>
            </div>

            {filteredProducts.length === 0 ? (
              <div className="bg-white dark:bg-[#1E1E1E] p-12 rounded-2xl border border-[#E6DFD3] dark:border-[#383838] text-center space-y-3">
                <Flame className="w-10 h-10 text-[#C8A75A]/50 mx-auto" />
                <h4 className="font-serif text-lg font-bold text-[#1F1F1F] dark:text-[#F8F5F0]">No Candles Found</h4>
                <p className="text-xs text-[#666666] dark:text-[#A8A29E]">Try adjusting your filters or search terms.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProducts.map((p) => (
                  <ProductCard
                    key={p.id}
                    product={p}
                    onQuickView={(prod) => setQuickViewProduct(prod)}
                  />
                ))}
              </div>
            )}
          </div>

        </div>
      </section>

      {/* Feature Showcase Banners */}
      <section className="py-16 bg-[#F4EFE8] dark:bg-[#1D1D1D] text-[#1F1F1F] dark:text-[#F8F5F0] border-y border-[#E6DFD3] dark:border-[#383838] transition-colors">
        <div className="max-w-7xl mx-auto px-4 lg:px-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Customizer Card */}
          <div className="bg-white dark:bg-[#1E1E1E] p-6 rounded-3xl border border-[#E6DFD3] dark:border-[#383838] flex flex-col justify-between space-y-4 shadow-luxury-light hover:border-[#C8A75A]/60 transition-all">
            <div className="space-y-2">
              <span className="text-[10px] font-semibold text-[#C8A75A] uppercase tracking-widest flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-[#C8A75A]" /> BESPOKE ATELIER
              </span>
              <h3 className="font-serif text-xl font-bold text-[#1F1F1F] dark:text-[#F8F5F0]">BUILD YOUR OWN CANDLE</h3>
              <p className="text-xs text-[#666666] dark:text-[#D8D2C8] font-light">Select Jar, Wax, Fragrance, Wick & Laser Engrave custom label text!</p>
            </div>
            <button
              onClick={() => setIsCustomizerOpen(true)}
              className="bg-[#C8A75A] text-white px-5 py-2.5 rounded-2xl font-medium text-xs hover:bg-[#D4B46A] transition-colors w-fit flex items-center gap-1.5 shadow-sm"
            >
              Start Customizer 🕯️
            </button>
          </div>

          {/* Gift Box Card */}
          <div className="bg-white dark:bg-[#1E1E1E] p-6 rounded-3xl border border-[#E6DFD3] dark:border-[#383838] flex flex-col justify-between space-y-4 shadow-luxury-light hover:border-[#C8A75A]/60 transition-all">
            <div className="space-y-2">
              <span className="text-[10px] font-semibold text-[#C8A75A] uppercase tracking-widest flex items-center gap-1">
                <Gift className="w-3.5 h-3.5 text-[#C8A75A]" /> GIFT BOX CURATION
              </span>
              <h3 className="font-serif text-xl font-bold text-[#1F1F1F] dark:text-[#F8F5F0]">3-CANDLE GIFT SET</h3>
              <p className="text-xs text-[#666666] dark:text-[#D8D2C8] font-light">Select any 3 full-sized candles presented in a luxury wax-sealed box for {currency}1,499.</p>
            </div>
            <button
              onClick={() => setIsBundleOpen(true)}
              className="bg-[#FAF7F2] dark:bg-[#151515] text-[#1F1F1F] dark:text-[#F8F5F0] border border-[#C8A75A] px-5 py-2.5 rounded-2xl font-medium text-xs hover:bg-[#C8A75A] hover:text-white transition-colors w-fit flex items-center gap-1.5"
            >
              Curate Gift Box 🎁
            </button>
          </div>

          {/* Corporate B2B Card */}
          <div className="bg-white dark:bg-[#1E1E1E] p-6 rounded-3xl border border-[#E6DFD3] dark:border-[#383838] flex flex-col justify-between space-y-4 shadow-luxury-light hover:border-[#C8A75A]/60 transition-all">
            <div className="space-y-2">
              <span className="text-[10px] font-semibold text-[#C8A75A] uppercase tracking-widest flex items-center gap-1">
                <Building2 className="w-3.5 h-3.5 text-[#C8A75A]" /> B2B & EVENT GIFTS
              </span>
              <h3 className="font-serif text-xl font-bold text-[#1F1F1F] dark:text-[#F8F5F0]">HOTELS & WEDDINGS</h3>
              <p className="text-xs text-[#666666] dark:text-[#D8D2C8] font-light">Custom logo branding & bulk amenities for spas, luxury hotels, and weddings.</p>
            </div>
            <button
              onClick={() => setIsCorporateOpen(true)}
              className="bg-[#FAF7F2] dark:bg-[#151515] text-[#1F1F1F] dark:text-[#F8F5F0] border border-[#E6DFD3] dark:border-[#383838] px-5 py-2.5 rounded-2xl font-medium text-xs hover:border-[#C8A75A] transition-colors w-fit flex items-center gap-1.5"
            >
              Request B2B Quote 💼
            </button>
          </div>

        </div>
      </section>

      {/* Floating AI Shopping Concierge Assistant */}
      <AIChatConcierge />

      {/* Sticky Compare Products Bar & Modal */}
      <CompareModal />

      {/* Modals & Overlays */}
      <FragranceQuizModal isOpen={isQuizOpen} onClose={() => setIsQuizOpen(false)} />
      <BundleBuilderModal isOpen={isBundleOpen} onClose={() => setIsBundleOpen(false)} />
      <CandleCustomizerModal isOpen={isCustomizerOpen} onClose={() => setIsCustomizerOpen(false)} />
      <WishlistDrawer isOpen={isWishlistOpen} onClose={() => setIsWishlistOpen(false)} />
      <VoiceImageSearch isOpen={isVoiceImageSearchOpen} onClose={() => setIsVoiceImageSearchOpen(false)} />
      <LoyaltyReferralModal isOpen={isLoyaltyOpen} onClose={() => setIsLoyaltyOpen(false)} />
      <CorporateOrdersModal isOpen={isCorporateOpen} onClose={() => setIsCorporateOpen(false)} />
      <CustomerDashboardModal isOpen={isProfileOpen} onClose={() => setIsProfileOpen(false)} />
      <CollectionsManagerModal isOpen={isCollectionsModalOpen} onClose={() => setIsCollectionsModalOpen(false)} />
      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} onOpenCheckout={() => setIsCheckoutOpen(true)} />
      <CheckoutModal isOpen={isCheckoutOpen} onClose={() => setIsCheckoutOpen(false)} />

      {quickViewProduct && (
        <ProductDetailModal
          product={quickViewProduct}
          onClose={() => setQuickViewProduct(null)}
        />
      )}

      {/* Main Luxury Footer */}
      <Footer />
    </div>
  );
}
