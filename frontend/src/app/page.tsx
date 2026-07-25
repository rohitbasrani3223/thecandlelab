"use client";

import React, { useState } from "react";
import { useStore, CandleProduct, CollectionItem } from "@/context/StoreContext";
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
  Crown,
  Filter,
  Plus,
  Layers,
  Star,
  CheckCircle,
  SlidersHorizontal,
  ChevronRight,
  ShieldCheck,
  Award,
  Building2,
  Mic
} from "lucide-react";

export default function HomePage() {
  const {
    collections,
    products,
    searchQuery,
    setSearchQuery,
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
  const [maxPrice, setMaxPrice] = useState<number>(2000);

  // Filter Products
  const filteredProducts = products.filter((product) => {
    // Search query filter
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

    // Collection filter
    if (selectedCollectionSlug !== "all") {
      if (!product.collections.includes(selectedCollectionSlug)) {
        return false;
      }
    }

    // Wax filter
    if (selectedWaxType !== "all" && product.waxType !== selectedWaxType) {
      return false;
    }

    // Wick filter
    if (selectedWickType !== "all" && product.wickType !== selectedWickType) {
      return false;
    }

    // Price filter
    if (product.price > maxPrice) {
      return false;
    }

    return true;
  });

  // Role Routing View
  if (activeRole === "seller") {
    return (
      <div className="min-h-screen bg-brand-surface font-sans">
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
      <div className="min-h-screen bg-brand-surface font-sans">
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
    <div className="min-h-screen bg-brand-surface font-sans text-brand-charcoal selection:bg-brand-gold selection:text-brand-charcoal">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-20 right-6 z-50 bg-brand-charcoal text-brand-gold border border-brand-gold px-4 py-3 rounded-xl shadow-2xl flex items-center gap-2 text-xs font-bold animate-bounce">
          <Sparkles className="w-4 h-4 text-brand-gold" />
          {toastMessage}
        </div>
      )}

      {/* Main Luxury Header */}
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

      {/* Hero Section with 3D Candle Customizer Callout */}
      <section className="relative w-full bg-brand-charcoal text-brand-ivory overflow-hidden py-16 lg:py-24 border-b border-brand-gold/30">
        
        {/* Ambient Candle Glow Animation Backdrop */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-brand-gold/15 rounded-full blur-[120px] pointer-events-none animate-pulse-subtle" />

        <div className="max-w-7xl mx-auto px-4 lg:px-8 relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          
          <div className="space-y-6 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 border border-brand-gold/40 backdrop-blur-md text-brand-beige text-xs uppercase tracking-widest font-semibold shadow-inner">
              <Flame className="w-4 h-4 text-brand-gold animate-flame-glow" />
              <span>Handcrafted Luxury Atelier • Version 3.5</span>
            </div>

            <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight leading-[1.1] text-white">
              HANDCRAFTED <br className="hidden sm:inline" />
              <span className="gold-gradient-text">TO GLOW.</span>
            </h1>

            <p className="text-sm md:text-base text-gray-300 max-w-lg mx-auto lg:mx-0 font-light leading-relaxed">
              Handcrafted candles designed to fill your home with warmth, fragrance, and elegance. Pure soy & beeswax hand-poured with crackling wooden wicks.
            </p>

            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
              <button
                onClick={() => setIsCustomizerOpen(true)}
                className="w-full sm:w-auto bg-brand-gold text-brand-charcoal px-8 py-3.5 rounded-xl font-serif text-xs font-bold uppercase tracking-wider hover:bg-brand-goldLight transition-all shadow-xl flex items-center justify-center gap-2"
              >
                <Sparkles className="w-4 h-4" /> Build Bespoke Candle (USP)
              </button>

              <button
                onClick={() => setIsQuizOpen(true)}
                className="w-full sm:w-auto bg-white/10 text-brand-beige border border-brand-beige/40 px-8 py-3.5 rounded-xl font-serif text-xs font-bold uppercase tracking-wider hover:bg-white/20 transition-all flex items-center justify-center gap-2"
              >
                <Compass className="w-4 h-4 text-brand-gold" /> Fragrance Quiz
              </button>
            </div>

            {/* Micro Pillars */}
            <div className="pt-8 border-t border-white/10 grid grid-cols-3 gap-4 text-center lg:text-left text-xs text-gray-300">
              <div>
                <span className="block font-serif text-lg font-bold text-brand-gold">100%</span>
                <span className="text-[11px] text-gray-400">Natural Soy Wax</span>
              </div>
              <div>
                <span className="block font-serif text-lg font-bold text-brand-gold">55+ Hrs</span>
                <span className="text-[11px] text-gray-400">Clean Burn Time</span>
              </div>
              <div>
                <span className="block font-serif text-lg font-bold text-brand-gold">3-Layer</span>
                <span className="text-[11px] text-gray-400">Fragrance Pyramid</span>
              </div>
            </div>
          </div>

          {/* Hero Image Showcase */}
          <div className="relative flex items-center justify-center">
            <div className="relative w-full max-w-md aspect-square rounded-3xl overflow-hidden border-2 border-brand-gold/40 shadow-2xl flame-glow-effect">
              <img
                src="https://images.unsplash.com/photo-1603006905003-be475563bc59?auto=format&fit=crop&w=1000&q=80"
                alt="The Candle Lab Bestseller"
                className="w-full h-full object-cover"
              />
              
              <div className="absolute bottom-4 left-4 right-4 bg-brand-charcoal/90 backdrop-blur-md p-3.5 rounded-2xl border border-brand-gold/40 text-brand-beige flex items-center justify-between shadow-xl">
                <div>
                  <h4 className="font-serif text-xs font-bold text-brand-gold">Velvet Amber & Smoked Oud</h4>
                  <p className="text-[10px] text-gray-300">Top Notes: Amber • Bergamot • Sandalwood</p>
                </div>
                <span className="text-xs font-serif font-bold text-white bg-brand-gold/20 px-2.5 py-1 rounded-full border border-brand-gold/40">
                  ₹899
                </span>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* Dynamic Collections Showcase */}
      <section className="py-16 px-4 lg:px-8 max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-8 gap-4 border-b border-brand-beige pb-4">
          <div>
            <span className="text-xs font-serif font-bold uppercase tracking-widest text-brand-earth flex items-center gap-1.5">
              <Layers className="w-4 h-4 text-brand-gold" /> Curated Aromas
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-brand-charcoal mt-1">
              SHOP BY COLLECTION
            </h2>
          </div>

          <button
            onClick={() => setIsCollectionsModalOpen(true)}
            className="text-xs font-bold text-brand-charcoal bg-brand-beige hover:bg-brand-gold hover:text-brand-charcoal px-4 py-2 rounded-xl transition-all flex items-center gap-1.5 shadow-sm"
          >
            <Plus className="w-4 h-4 text-brand-gold" /> Manage Collections Everywhere
          </button>
        </div>

        {/* Collections Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
          <button
            onClick={() => setSelectedCollectionSlug("all")}
            className={`p-3 rounded-2xl border text-center transition-all flex flex-col items-center gap-1.5 ${
              selectedCollectionSlug === "all"
                ? "bg-brand-charcoal text-brand-gold border-brand-gold font-bold shadow-md scale-105"
                : "bg-white border-brand-beige text-brand-charcoal hover:border-brand-gold"
            }`}
          >
            <span className="text-2xl">🕯️</span>
            <span className="text-xs font-serif font-semibold">All Items</span>
          </button>

          {collections.map((col) => (
            <button
              key={col.id}
              onClick={() => setSelectedCollectionSlug(col.slug)}
              className={`p-3 rounded-2xl border text-center transition-all flex flex-col items-center gap-1.5 ${
                selectedCollectionSlug === col.slug
                  ? "bg-brand-charcoal text-brand-gold border-brand-gold font-bold shadow-md scale-105"
                  : "bg-white border-brand-beige text-brand-charcoal hover:border-brand-gold"
              }`}
            >
              <span className="text-2xl">{col.iconSymbol || "🕯️"}</span>
              <span className="text-xs font-serif font-semibold line-clamp-1">{col.name}</span>
            </button>
          ))}
        </div>
      </section>

      {/* Main Catalog & Filter Section */}
      <section id="shop-catalog" className="py-12 px-4 lg:px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* Sidebar Filter Panel */}
          <div className="lg:col-span-1 bg-white p-5 rounded-2xl border border-brand-beige shadow-sm space-y-6 h-fit sticky top-24">
            <div className="flex items-center justify-between border-b border-brand-beige pb-3">
              <h3 className="font-serif text-sm font-bold text-brand-charcoal flex items-center gap-2">
                <SlidersHorizontal className="w-4 h-4 text-brand-gold" /> Filter Candles
              </h3>
              {(selectedCollectionSlug !== "all" || selectedWaxType !== "all" || selectedWickType !== "all") && (
                <button
                  onClick={() => {
                    setSelectedCollectionSlug("all");
                    setSelectedWaxType("all");
                    setSelectedWickType("all");
                    setMaxPrice(2000);
                  }}
                  className="text-[11px] text-red-600 font-medium underline"
                >
                  Reset
                </button>
              )}
            </div>

            {/* Collection Filter */}
            <div className="space-y-2">
              <label className="text-xs font-serif font-bold text-brand-charcoal uppercase tracking-wider block">
                Collection
              </label>
              <select
                value={selectedCollectionSlug}
                onChange={(e) => setSelectedCollectionSlug(e.target.value)}
                className="w-full text-xs p-2.5 rounded-xl border border-brand-beige bg-brand-surface focus:outline-none focus:ring-1 focus:ring-brand-gold text-brand-charcoal"
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
              <label className="text-xs font-serif font-bold text-brand-charcoal uppercase tracking-wider block">
                Wax Type
              </label>
              <div className="space-y-1.5 text-xs text-brand-charcoal">
                {["all", "Soy Wax", "Beeswax", "Coconut Wax", "Paraffin Blend"].map((w) => (
                  <label key={w} className="flex items-center gap-2 cursor-pointer hover:text-brand-gold">
                    <input
                      type="radio"
                      name="wax"
                      checked={selectedWaxType === w}
                      onChange={() => setSelectedWaxType(w)}
                      className="text-brand-gold focus:ring-brand-gold"
                    />
                    <span>{w === "all" ? "All Wax Types" : w}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Wick Type Filter */}
            <div className="space-y-2">
              <label className="text-xs font-serif font-bold text-brand-charcoal uppercase tracking-wider block">
                Wick Type
              </label>
              <div className="space-y-1.5 text-xs text-brand-charcoal">
                {["all", "Wooden Crackling Wick", "Cotton Wick"].map((wk) => (
                  <label key={wk} className="flex items-center gap-2 cursor-pointer hover:text-brand-gold">
                    <input
                      type="radio"
                      name="wick"
                      checked={selectedWickType === wk}
                      onChange={() => setSelectedWickType(wk)}
                      className="text-brand-gold focus:ring-brand-gold"
                    />
                    <span>{wk === "all" ? "All Wick Types" : wk}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Price Filter */}
            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs font-serif font-bold text-brand-charcoal">
                <span>Max Price:</span>
                <span className="text-brand-gold">{currency}{maxPrice}</span>
              </div>
              <input
                type="range"
                min={400}
                max={2500}
                step={50}
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                className="w-full accent-brand-gold"
              />
            </div>
          </div>

          {/* Products Grid */}
          <div className="lg:col-span-3 space-y-6">
            <div className="flex items-center justify-between border-b border-brand-beige pb-3">
              <span className="text-xs font-bold text-brand-earth">
                Showing {filteredProducts.length} Luxury Candles
              </span>
            </div>

            {filteredProducts.length === 0 ? (
              <div className="bg-white p-12 rounded-2xl border border-brand-beige text-center space-y-3">
                <Flame className="w-10 h-10 text-brand-gold/50 mx-auto" />
                <h4 className="font-serif text-lg font-bold text-brand-charcoal">No Candles Found</h4>
                <p className="text-xs text-brand-earth">Try adjusting your filters or search terms.</p>
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

      {/* Interactive Feature Banners */}
      <section className="py-16 bg-brand-charcoal text-brand-ivory border-y border-brand-gold/30">
        <div className="max-w-7xl mx-auto px-4 lg:px-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Customizer USP Card */}
          <div className="bg-gradient-to-br from-brand-darkCard to-black p-6 rounded-3xl border border-brand-gold/40 flex flex-col justify-between space-y-4 shadow-xl">
            <div className="space-y-2">
              <span className="text-[10px] font-bold text-brand-gold uppercase tracking-widest flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5" /> 3D BESPOKE ATELIER
              </span>
              <h3 className="font-serif text-xl font-bold text-white">BUILD YOUR OWN CANDLE</h3>
              <p className="text-xs text-gray-300">Choose Jar, Wax, Scent, Wick & Laser Engrave your custom label text!</p>
            </div>
            <button
              onClick={() => setIsCustomizerOpen(true)}
              className="bg-brand-gold text-brand-charcoal px-5 py-2.5 rounded-xl font-bold text-xs hover:bg-brand-goldLight transition-colors w-fit flex items-center gap-1.5"
            >
              Start Customizer 🕯️
            </button>
          </div>

          {/* Bundle Builder Card */}
          <div className="bg-gradient-to-br from-brand-darkCard to-black p-6 rounded-3xl border border-brand-gold/40 flex flex-col justify-between space-y-4 shadow-xl">
            <div className="space-y-2">
              <span className="text-[10px] font-bold text-brand-gold uppercase tracking-widest flex items-center gap-1">
                <Gift className="w-3.5 h-3.5" /> BUNDLE & SAVE 25%
              </span>
              <h3 className="font-serif text-xl font-bold text-white">3-CANDLE GIFT BOX</h3>
              <p className="text-xs text-gray-300">Select any 3 full-sized candles for a flat price of {currency}1,499.</p>
            </div>
            <button
              onClick={() => setIsBundleOpen(true)}
              className="bg-white text-brand-charcoal px-5 py-2.5 rounded-xl font-bold text-xs hover:bg-brand-gold transition-colors w-fit flex items-center gap-1.5"
            >
              Build Box Now 🎁
            </button>
          </div>

          {/* Corporate B2B Card */}
          <div className="bg-gradient-to-br from-brand-darkCard to-black p-6 rounded-3xl border border-brand-gold/40 flex flex-col justify-between space-y-4 shadow-xl">
            <div className="space-y-2">
              <span className="text-[10px] font-bold text-brand-gold uppercase tracking-widest flex items-center gap-1">
                <Building2 className="w-3.5 h-3.5" /> CORPORATE & WEDDING
              </span>
              <h3 className="font-serif text-xl font-bold text-white">HOTELS & BULK B2B</h3>
              <p className="text-xs text-gray-300">Custom logo branding & bulk amenities for spas, hotels and wedding return gifts.</p>
            </div>
            <button
              onClick={() => setIsCorporateOpen(true)}
              className="bg-white/10 text-brand-beige border border-brand-beige/40 px-5 py-2.5 rounded-xl font-bold text-xs hover:bg-white/20 transition-colors w-fit flex items-center gap-1.5"
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

      {/* All Modals & Overlays */}
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
