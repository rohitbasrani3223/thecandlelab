"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useStore } from "@/context/StoreContext";
import {
  Flame,
  Search,
  ShoppingBag,
  Heart,
  User,
  Sparkles,
  Menu,
  X,
  Layers,
  ChevronDown,
  Gift,
  Crown,
  Mic,
  Camera,
  Scale,
  Building2,
  Sliders,
  Plus
} from "lucide-react";

interface NavbarProps {
  onOpenQuiz?: () => void;
  onOpenBundle?: () => void;
  onOpenCustomizer?: () => void;
  onOpenSubscription?: () => void;
  onOpenCollectionsModal?: () => void;
  onOpenCart?: () => void;
  onOpenWishlist?: () => void;
  onOpenLoyalty?: () => void;
  onOpenCorporate?: () => void;
  onOpenVoiceImageSearch?: () => void;
  onOpenProfile?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenQuiz,
  onOpenBundle,
  onOpenCustomizer,
  onOpenSubscription,
  onOpenCollectionsModal,
  onOpenCart,
  onOpenWishlist,
  onOpenLoyalty,
  onOpenCorporate,
  onOpenVoiceImageSearch,
  onOpenProfile
}) => {
  const {
    collections,
    cart,
    wishlist,
    searchQuery,
    setSearchQuery,
    activeRole,
    setActiveRole
  } = useStore();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCollectionsHovered, setIsCollectionsHovered] = useState(false);

  const cartItemsCount = cart.reduce((sum, i) => sum + i.quantity, 0);

  return (
    <header className="sticky top-0 z-40 w-full transition-all">
      
      {/* Top Luxury Announcement Bar */}
      <div className="bg-brand-charcoal text-brand-ivory text-xs py-2 px-4 flex justify-between items-center tracking-wider border-b border-brand-gold/30">
        <div className="hidden sm:flex items-center space-x-4">
          <span className="flex items-center gap-1.5 text-brand-gold">
            <Sparkles className="w-3.5 h-3.5 animate-pulse" />
            Complimentary Handcrafted Wax Seal & Gift Box on Orders Above ₹1,499
          </span>
        </div>

        <div className="flex items-center justify-between w-full sm:w-auto gap-3 text-[11px] uppercase tracking-widest text-brand-beige">
          <button onClick={onOpenCustomizer} className="hover:text-brand-gold flex items-center gap-1 font-bold text-brand-gold">
            <Sparkles className="w-3.5 h-3.5" /> 3D Candle Customizer (USP)
          </button>
          <span className="text-brand-gold/40">|</span>
          <button onClick={onOpenLoyalty} className="hover:text-brand-gold flex items-center gap-1">
            <Crown className="w-3.5 h-3.5 text-brand-gold" /> Rewards & Referral
          </button>
          <span className="text-brand-gold/40">|</span>
          <button onClick={onOpenCorporate} className="hover:text-brand-gold flex items-center gap-1">
            <Building2 className="w-3.5 h-3.5" /> Corporate B2B
          </button>
          <span className="text-brand-gold/40">|</span>

          {/* Role Switcher Pill */}
          <div className="flex items-center bg-brand-darkCard px-2 py-0.5 rounded-full border border-brand-gold/40">
            <span className="text-[10px] text-brand-gold mr-1.5 font-bold">Portal:</span>
            <button
              onClick={() => setActiveRole("customer")}
              className={`px-1.5 py-0.5 rounded text-[10px] ${
                activeRole === "customer" ? "bg-brand-gold text-brand-charcoal font-bold" : "text-brand-beige"
              }`}
            >
              Shop
            </button>
            <button
              onClick={() => setActiveRole("seller")}
              className={`px-1.5 py-0.5 rounded text-[10px] ${
                activeRole === "seller" ? "bg-brand-gold text-brand-charcoal font-bold" : "text-brand-beige"
              }`}
            >
              Seller
            </button>
            <button
              onClick={() => setActiveRole("admin")}
              className={`px-1.5 py-0.5 rounded text-[10px] ${
                activeRole === "admin" ? "bg-brand-gold text-brand-charcoal font-bold" : "text-brand-beige"
              }`}
            >
              Admin
            </button>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <nav className="glass-panel border-b border-brand-beige/80 px-4 lg:px-8 py-3 transition-all">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          
          {/* Brand Logo & Flame */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="relative w-9 h-9 rounded-full bg-brand-charcoal flex items-center justify-center border border-brand-gold shadow-md group-hover:scale-105 transition-transform">
              <Flame className="w-5 h-5 text-brand-gold animate-flame-glow" />
            </div>
            <div className="flex flex-col">
              <span className="font-serif text-2xl font-bold tracking-tight text-brand-charcoal group-hover:text-brand-gold transition-colors leading-none">
                THE CANDLE LAB
              </span>
              <span className="text-[9px] uppercase tracking-[0.25em] text-brand-earth font-medium">
                CRAFTED TO GLOW
              </span>
            </div>
          </Link>

          {/* Navigation Links */}
          <div className="hidden lg:flex items-center space-x-7 text-sm font-medium tracking-wide">
            <Link href="/" className="text-brand-charcoal hover:text-brand-gold transition-colors">
              Home
            </Link>

            <button
              onClick={onOpenCustomizer}
              className="text-brand-charcoal hover:text-brand-gold transition-colors font-serif font-bold text-brand-gold flex items-center gap-1.5 bg-brand-charcoal px-3 py-1 rounded-full border border-brand-gold shadow-sm"
            >
              <Sparkles className="w-3.5 h-3.5" />
              Build Custom Candle 🕯️
            </button>

            {/* Dynamic Collections Dropdown */}
            <div
              className="relative group py-2"
              onMouseEnter={() => setIsCollectionsHovered(true)}
              onMouseLeave={() => setIsCollectionsHovered(false)}
            >
              <button className="flex items-center gap-1 text-brand-charcoal hover:text-brand-gold transition-colors">
                <Layers className="w-4 h-4 text-brand-gold" />
                Collections
                <ChevronDown className="w-3.5 h-3.5 text-brand-earth group-hover:rotate-180 transition-transform" />
              </button>

              {/* Mega Dropdown Menu */}
              {isCollectionsHovered && (
                <div className="absolute top-full left-0 w-80 glass-panel shadow-2xl rounded-xl border border-brand-gold/30 p-4 transition-all duration-200 z-50">
                  <div className="flex items-center justify-between pb-2 border-b border-brand-beige mb-3">
                    <span className="text-xs font-serif font-bold text-brand-charcoal uppercase tracking-wider">
                      Explore Collections ({collections.length})
                    </span>
                    <button
                      onClick={onOpenCollectionsModal}
                      className="text-[11px] text-brand-gold hover:underline flex items-center gap-1 font-bold"
                    >
                      <Plus className="w-3 h-3" /> Add / Edit
                    </button>
                  </div>

                  <div className="grid grid-cols-1 gap-2 max-h-72 overflow-y-auto pr-1">
                    {collections.map((col) => (
                      <Link
                        key={col.id}
                        href={`/#shop-catalog`}
                        className="flex items-center justify-between p-2 rounded-lg hover:bg-brand-beige/50 transition-colors group/item"
                      >
                        <div className="flex items-center gap-2.5">
                          <span className="text-lg">{col.iconSymbol || "🕯️"}</span>
                          <div>
                            <p className="text-xs font-medium text-brand-charcoal group-hover/item:text-brand-gold">
                              {col.name}
                            </p>
                            <p className="text-[10px] text-brand-earth line-clamp-1">
                              {col.description}
                            </p>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>

                  <div className="mt-3 pt-2 border-t border-brand-beige">
                    <button
                      onClick={onOpenCollectionsModal}
                      className="w-full text-center py-1.5 rounded bg-brand-charcoal text-brand-gold font-medium text-[11px] hover:bg-brand-gold hover:text-brand-charcoal transition-colors"
                    >
                      Manage Collections Everywhere ⚙️
                    </button>
                  </div>
                </div>
              )}
            </div>

            <button onClick={onOpenQuiz} className="text-brand-charcoal hover:text-brand-gold transition-colors">
              Fragrance Quiz
            </button>

            <button onClick={onOpenBundle} className="text-brand-charcoal hover:text-brand-gold transition-colors">
              Bundle Builder
            </button>
          </div>

          {/* Search Bar & Action Buttons */}
          <div className="flex items-center space-x-3">
            
            {/* Smart Search with Voice & Image Trigger */}
            <div className="relative hidden md:flex items-center w-52 lg:w-64">
              <input
                type="text"
                placeholder="Search notes, wax, burn time..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full text-xs pl-8 pr-14 py-2 rounded-full border border-brand-beige bg-white/80 focus:bg-white focus:outline-none focus:ring-1 focus:ring-brand-gold text-brand-charcoal"
              />
              <Search className="w-3.5 h-3.5 text-brand-earth absolute left-2.5" />
              
              <div className="absolute right-2 flex items-center gap-1">
                <button
                  onClick={onOpenVoiceImageSearch}
                  className="p-1 text-gray-400 hover:text-brand-gold"
                  title="Voice & Image Search"
                >
                  <Mic className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Wishlist Drawer Trigger */}
            <button
              onClick={onOpenWishlist}
              className="relative p-2 rounded-full hover:bg-brand-beige/50 text-brand-charcoal hover:text-red-500 transition-colors"
              title="Wishlist Drawer"
            >
              <Heart className="w-5 h-5" />
              {wishlist.length > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-red-500 text-white font-bold text-[10px] rounded-full flex items-center justify-center shadow">
                  {wishlist.length}
                </span>
              )}
            </button>

            {/* Cart Drawer Trigger */}
            <button
              onClick={onOpenCart}
              className="relative p-2 rounded-full hover:bg-brand-beige/50 text-brand-charcoal hover:text-brand-gold transition-colors"
              title="Shopping Bag"
            >
              <ShoppingBag className="w-5 h-5" />
              {cartItemsCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-4.5 h-4.5 bg-brand-charcoal text-brand-gold font-bold text-[10px] rounded-full flex items-center justify-center shadow border border-brand-gold">
                  {cartItemsCount}
                </span>
              )}
            </button>

            {/* Profile Dashboard Modal Trigger */}
            <button
              onClick={onOpenProfile}
              className="p-2 rounded-full hover:bg-brand-beige/50 text-brand-charcoal hover:text-brand-gold transition-colors"
              title="Account Dashboard"
            >
              <User className="w-5 h-5" />
            </button>

            {/* Mobile Hamburger */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 text-brand-charcoal hover:text-brand-gold"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden mt-3 pt-3 border-t border-brand-beige space-y-2 text-xs">
            <button
              onClick={onOpenCustomizer}
              className="w-full p-2.5 rounded bg-brand-charcoal text-brand-gold font-bold text-center flex items-center justify-center gap-1.5"
            >
              <Sparkles className="w-4 h-4" /> 3D Candle Customizer (USP)
            </button>
            <div className="grid grid-cols-2 gap-2 font-medium">
              <button onClick={onOpenQuiz} className="p-2 rounded bg-white text-left">Fragrance Quiz 🌸</button>
              <button onClick={onOpenBundle} className="p-2 rounded bg-white text-left">Bundle Builder 🎁</button>
              <button onClick={onOpenLoyalty} className="p-2 rounded bg-white text-left">Rewards & Loyalty 👑</button>
              <button onClick={onOpenCorporate} className="p-2 rounded bg-white text-left">Corporate B2B 🏨</button>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
};
