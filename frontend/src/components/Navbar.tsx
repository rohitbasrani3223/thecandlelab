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
  Mic,
  Plus,
  PackageCheck
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
    setSearchQuery
  } = useStore();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCollectionsHovered, setIsCollectionsHovered] = useState(false);

  const cartItemsCount = cart.reduce((sum, i) => sum + i.quantity, 0);

  return (
    <header className="sticky top-0 z-40 w-full transition-all">
      
      {/* Top Luxury Announcement Bar */}
      <div className="bg-[#151515] text-[#F8F5F0] text-xs py-2 px-4 flex justify-between items-center tracking-wider border-b border-[#383838]">
        <div className="hidden md:flex items-center space-x-4">
          <span className="flex items-center gap-1.5 text-[#C8A75A] font-light text-[11px] uppercase tracking-widest">
            <Sparkles className="w-3.5 h-3.5 text-[#C8A75A] animate-pulse" />
            Complimentary Handcrafted Wax Seal & Gift Box on Orders Above ₹1,499
          </span>
        </div>

        <div className="flex items-center justify-between w-full md:w-auto gap-4 text-[11px] uppercase tracking-widest text-[#D8D2C8] font-light">
          <span className="flex items-center gap-1">
            <PackageCheck className="w-3.5 h-3.5 text-[#C8A75A]" /> Express 2-4 Day India Delivery
          </span>
          <span className="text-[#383838]">|</span>
          <button onClick={onOpenCorporate} className="hover:text-[#C8A75A] transition-colors">
            Corporate Gifting & B2B
          </button>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <nav className="bg-[#151515]/95 backdrop-blur-md border-b border-[#383838] px-4 lg:px-8 py-3.5 transition-all">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-6">
          
          {/* Brand Logo & Tagline */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative w-10 h-10 rounded-full bg-[#1E1E1E] flex items-center justify-center border border-[#C8A75A]/60 shadow-lg group-hover:scale-105 transition-transform">
              <Flame className="w-5 h-5 text-[#C8A75A] animate-flame-glow" />
            </div>
            <div className="flex flex-col">
              <span className="font-serif text-2xl font-bold tracking-tight text-[#F8F5F0] group-hover:text-[#C8A75A] transition-colors leading-none">
                THE CANDLE LAB
              </span>
              <span className="text-[9px] uppercase tracking-[0.28em] text-[#C8A75A] font-semibold mt-1">
                CRAFTED TO GLOW
              </span>
            </div>
          </Link>

          {/* Luxury Storefront Links */}
          <div className="hidden lg:flex items-center space-x-7 text-xs uppercase tracking-widest font-medium text-[#D8D2C8]">
            <Link href="/" className="hover:text-[#C8A75A] transition-colors">
              Home
            </Link>

            <Link href="/#shop-catalog" className="hover:text-[#C8A75A] transition-colors">
              Shop
            </Link>

            {/* Collections Dropdown */}
            <div
              className="relative group py-2"
              onMouseEnter={() => setIsCollectionsHovered(true)}
              onMouseLeave={() => setIsCollectionsHovered(false)}
            >
              <button className="flex items-center gap-1 hover:text-[#C8A75A] transition-colors">
                <Layers className="w-3.5 h-3.5 text-[#C8A75A]" />
                Collections
                <ChevronDown className="w-3 h-3 text-[#A8A29E] group-hover:rotate-180 transition-transform" />
              </button>

              {/* Dropdown Menu */}
              {isCollectionsHovered && (
                <div className="absolute top-full left-0 w-80 bg-[#1E1E1E] shadow-2xl rounded-2xl border border-[#383838] p-4 transition-all duration-200 z-50">
                  <div className="flex items-center justify-between pb-2 border-b border-[#383838] mb-3">
                    <span className="text-[11px] font-serif font-bold text-[#C8A75A] uppercase tracking-wider">
                      Signature Collections ({collections.length})
                    </span>
                  </div>

                  <div className="grid grid-cols-1 gap-1.5 max-h-72 overflow-y-auto pr-1">
                    {collections.map((col) => (
                      <Link
                        key={col.id}
                        href={`/#shop-catalog`}
                        className="flex items-center justify-between p-2 rounded-xl hover:bg-[#232323] transition-colors group/item"
                      >
                        <div className="flex items-center gap-2.5">
                          <span className="text-base">{col.iconSymbol || "🕯️"}</span>
                          <div>
                            <p className="text-xs font-medium text-[#F8F5F0] group-hover/item:text-[#C8A75A]">
                              {col.name}
                            </p>
                            <p className="text-[10px] text-[#A8A29E] line-clamp-1">
                              {col.description}
                            </p>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <button
              onClick={onOpenCustomizer}
              className="hover:text-[#C8A75A] transition-colors text-[#C8A75A] flex items-center gap-1.5 font-semibold"
            >
              <Sparkles className="w-3.5 h-3.5" />
              Build Your Candle
            </button>

            <button onClick={onOpenBundle} className="hover:text-[#C8A75A] transition-colors flex items-center gap-1">
              <Gift className="w-3.5 h-3.5 text-[#C8A75A]" />
              Gift Boxes
            </button>

            <button onClick={onOpenQuiz} className="hover:text-[#C8A75A] transition-colors">
              Fragrance Quiz
            </button>
          </div>

          {/* Search Bar & Action Icons */}
          <div className="flex items-center space-x-3">
            
            {/* Search Bar */}
            <div className="relative hidden md:flex items-center w-56 lg:w-64">
              <input
                type="text"
                placeholder="Search candles, fragrances, collections..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full text-xs pl-8 pr-9 py-2 rounded-full border border-[#383838] bg-[#1E1E1E] focus:bg-[#232323] focus:outline-none focus:border-[#C8A75A] text-[#F8F5F0] placeholder-[#A8A29E] transition-colors"
              />
              <Search className="w-3.5 h-3.5 text-[#A8A29E] absolute left-2.5" />
              
              <button
                onClick={onOpenVoiceImageSearch}
                className="absolute right-2.5 p-1 text-[#A8A29E] hover:text-[#C8A75A] transition-colors"
                title="Voice & Image Search"
              >
                <Mic className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Wishlist Icon */}
            <button
              onClick={onOpenWishlist}
              className="relative p-2 rounded-full hover:bg-[#1E1E1E] text-[#D8D2C8] hover:text-[#C8A75A] transition-colors"
              title="Wishlist"
            >
              <Heart className="w-5 h-5" />
              {wishlist.length > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-[#C94A4A] text-white font-bold text-[10px] rounded-full flex items-center justify-center shadow">
                  {wishlist.length}
                </span>
              )}
            </button>

            {/* Shopping Bag / Cart */}
            <button
              onClick={onOpenCart}
              className="relative p-2 rounded-full hover:bg-[#1E1E1E] text-[#D8D2C8] hover:text-[#C8A75A] transition-colors"
              title="Shopping Bag"
            >
              <ShoppingBag className="w-5 h-5" />
              {cartItemsCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-4.5 h-4.5 bg-[#C8A75A] text-[#151515] font-bold text-[10px] rounded-full flex items-center justify-center shadow">
                  {cartItemsCount}
                </span>
              )}
            </button>

            {/* Customer Account Dashboard */}
            <button
              onClick={onOpenProfile}
              className="p-2 rounded-full hover:bg-[#1E1E1E] text-[#D8D2C8] hover:text-[#C8A75A] transition-colors"
              title="Account"
            >
              <User className="w-5 h-5" />
            </button>

            {/* Mobile Navigation Trigger */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 text-[#F8F5F0] hover:text-[#C8A75A]"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden mt-3 pt-3 border-t border-[#383838] space-y-2 text-xs">
            <button
              onClick={onOpenCustomizer}
              className="w-full p-3 rounded-2xl bg-[#C8A75A] text-[#151515] font-bold tracking-wider text-center flex items-center justify-center gap-2 uppercase"
            >
              <Sparkles className="w-4 h-4" /> Build Your Candle
            </button>
            <div className="grid grid-cols-2 gap-2 font-medium pt-2 text-[#D8D2C8]">
              <Link href="/#shop-catalog" className="p-2.5 rounded-xl bg-[#1E1E1E] text-left hover:text-[#C8A75A]">Shop All Candles</Link>
              <button onClick={onOpenBundle} className="p-2.5 rounded-xl bg-[#1E1E1E] text-left hover:text-[#C8A75A]">Gift Boxes 🎁</button>
              <button onClick={onOpenQuiz} className="p-2.5 rounded-xl bg-[#1E1E1E] text-left hover:text-[#C8A75A]">Fragrance Quiz 🌸</button>
              <button onClick={onOpenLoyalty} className="p-2.5 rounded-xl bg-[#1E1E1E] text-left hover:text-[#C8A75A]">Rewards Club 👑</button>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
};
