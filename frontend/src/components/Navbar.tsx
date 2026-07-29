"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useStore } from "@/context/StoreContext";
import { CandleLabLogo } from "@/components/CandleLabLogo";


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
  Sun,
  Moon,
  Building2,
  PackageCheck,
  Package,
  Wallet,
  MapPin,
  Settings,
  LogOut
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
  onOpenAuthModal?: () => void;
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
  onOpenProfile,
  onOpenAuthModal
}) => {
  const {
    collections,
    cart,
    wishlist,
    searchQuery,
    setSearchQuery,
    theme,
    toggleTheme,
    currentUser,
    logoutUser
  } = useStore();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCollectionsHovered, setIsCollectionsHovered] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);

  const cartItemsCount = cart.reduce((sum, i) => sum + i.quantity, 0);

  return (
    <header className="sticky top-0 z-40 w-full transition-colors">
      
      {/* Top Luxury Announcement Bar */}
      <div className="bg-[#FAF7F2] dark:bg-[#151515] text-[#1F1F1F] dark:text-[#F8F5F0] text-[11px] py-2 px-4 flex justify-between items-center tracking-wider border-b border-[#E6DFD3] dark:border-[#383838] transition-colors">
        <div className="hidden lg:flex items-center space-x-3 text-[#666666] dark:text-[#A8A29E] font-light">
          <span className="flex items-center gap-1">
            <Heart className="w-3 h-3 text-[#C8A75A]" /> Handcrafted in India
          </span>
          <span className="text-[#E6DFD3] dark:text-[#383838]">|</span>
          <span>100% Natural Soy & Beeswax</span>
          <span className="text-[#E6DFD3] dark:text-[#383838]">|</span>
          <span>Clean Burn Promise</span>
        </div>

        <div className="flex items-center justify-center w-full lg:w-auto text-center font-medium tracking-widest text-[#1F1F1F] dark:text-[#F8F5F0] uppercase text-[10px]">
          <span className="flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-[#C8A75A]" />
            FREE SHIPPING on orders above ₹999
          </span>
        </div>

        <div className="hidden md:flex items-center space-x-4 text-[11px] text-[#666666] dark:text-[#A8A29E]">
          <button onClick={onOpenCorporate} className="hover:text-[#C8A75A] transition-colors flex items-center gap-1">
            <Building2 className="w-3.5 h-3.5 text-[#C8A75A]" /> Corporate & Bulk Orders
          </button>
          
          {/* Theme Mode Toggle Button */}
          <button
            onClick={toggleTheme}
            className="p-1 rounded-full bg-[#E6DFD3]/50 dark:bg-[#383838] text-[#1F1F1F] dark:text-[#F8F5F0] hover:text-[#C8A75A] transition-all flex items-center gap-1 px-2 text-[10px] font-medium"
            title="Toggle Light / Dark Luxury Mode"
          >
            {theme === "dark" ? (
              <>
                <Sun className="w-3 h-3 text-[#C8A75A]" /> Light Mode
              </>
            ) : (
              <>
                <Moon className="w-3 h-3 text-[#C8A75A]" /> Dark Mode
              </>
            )}
          </button>
        </div>
      </div>

      {/* Main White Luxury Navbar */}
      <nav className="bg-[#FFFFFF]/95 dark:bg-[#151515]/95 backdrop-blur-md border-b border-[#E6DFD3]/80 dark:border-[#383838] px-4 lg:px-8 py-3.5 transition-colors">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          
          {/* Brand Logo */}
          <Link href="/" className="flex items-center group">
            <CandleLabLogo variant={theme === "dark" ? "light" : "dark"} size="md" />
          </Link>


          {/* Luxury Editorial Storefront Links */}
          <div className="hidden lg:flex items-center space-x-6 text-[11px] uppercase tracking-widest font-medium text-[#1F1F1F] dark:text-[#D8D2C8]">
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
                Collections
                <ChevronDown className="w-3 h-3 text-[#666666] group-hover:rotate-180 transition-transform" />
              </button>

              {/* Dropdown Menu */}
              {isCollectionsHovered && (
                <div className="absolute top-full left-0 w-80 bg-[#FFFFFF] dark:bg-[#1E1E1E] shadow-luxury-light dark:shadow-2xl rounded-2xl border border-[#E6DFD3] dark:border-[#383838] p-4 transition-all duration-200 z-50">
                  <div className="flex items-center justify-between pb-2 border-b border-[#E6DFD3] dark:border-[#383838] mb-3">
                    <span className="text-[11px] font-serif font-bold text-[#C8A75A] uppercase tracking-wider">
                      Curated Collections ({collections.length})
                    </span>
                  </div>

                  <div className="grid grid-cols-1 gap-1.5 max-h-72 overflow-y-auto pr-1">
                    {collections.map((col) => (
                      <Link
                        key={col.id}
                        href={`/#shop-catalog`}
                        className="flex items-center justify-between p-2 rounded-xl hover:bg-[#FAF7F2] dark:hover:bg-[#232323] transition-colors group/item"
                      >
                        <div className="flex items-center gap-2.5">
                          <span className="text-base">{col.iconSymbol || "🕯️"}</span>
                          <div>
                            <p className="text-xs font-medium text-[#1F1F1F] dark:text-[#F8F5F0] group-hover/item:text-[#C8A75A]">
                              {col.name}
                            </p>
                            <p className="text-[10px] text-[#666666] dark:text-[#A8A29E] line-clamp-1">
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
              className="hover:text-[#C8A75A] transition-colors"
            >
              Build Your Candle
            </button>

            <button onClick={onOpenBundle} className="hover:text-[#C8A75A] transition-colors">
              Gift Boxes
            </button>

            <button onClick={onOpenQuiz} className="hover:text-[#C8A75A] transition-colors">
              About Us
            </button>

            <Link href="/shipping" className="hover:text-[#C8A75A] transition-colors">
              Contact
            </Link>
          </div>

          {/* Search & Actions */}
          <div className="flex items-center space-x-3">
            
            {/* Search Input */}
            <div className="relative hidden md:flex items-center w-48 lg:w-56">
              <input
                type="text"
                placeholder="Search candles..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full text-xs pl-8 pr-8 py-2 rounded-full border border-[#E6DFD3] dark:border-[#383838] bg-[#FAF7F2] dark:bg-[#1E1E1E] focus:bg-[#FFFFFF] dark:focus:bg-[#232323] focus:outline-none focus:border-[#C8A75A] text-[#1F1F1F] dark:text-[#F8F5F0] placeholder-[#666666] dark:placeholder-[#A8A29E] transition-colors"
              />
              <Search className="w-3.5 h-3.5 text-[#666666] dark:text-[#A8A29E] absolute left-2.5" />
              
              <button
                onClick={onOpenVoiceImageSearch}
                className="absolute right-2.5 p-1 text-[#666666] dark:text-[#A8A29E] hover:text-[#C8A75A] transition-colors"
                title="Voice & Image Search"
              >
                <Mic className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Wishlist */}
            <button
              onClick={onOpenWishlist}
              className="relative p-2 rounded-full hover:bg-[#FAF7F2] dark:hover:bg-[#1E1E1E] text-[#1F1F1F] dark:text-[#F8F5F0] hover:text-[#C8A75A] transition-colors"
              title="Wishlist"
            >
              <Heart className="w-5 h-5" />
              {wishlist.length > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-[#C8A75A] text-white font-bold text-[10px] rounded-full flex items-center justify-center shadow">
                  {wishlist.length}
                </span>
              )}
            </button>

            {/* Cart */}
            <button
              onClick={onOpenCart}
              className="relative p-2 rounded-full hover:bg-[#FAF7F2] dark:hover:bg-[#1E1E1E] text-[#1F1F1F] dark:text-[#F8F5F0] hover:text-[#C8A75A] transition-colors"
              title="Shopping Bag"
            >
              <ShoppingBag className="w-5 h-5" />
              {cartItemsCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-4.5 h-4.5 bg-[#C8A75A] text-white font-bold text-[10px] rounded-full flex items-center justify-center shadow">
                  {cartItemsCount}
                </span>
              )}
            </button>

            {/* User Account / Flipkart Style Dropdown */}
            {currentUser ? (
              <div className="relative">
                <button
                  onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#FAF7F2] dark:bg-[#1E1E1E] border border-[#C8A75A]/60 text-xs font-bold text-[#1F1F1F] dark:text-[#F8F5F0] hover:border-[#C8A75A] transition-all shadow-sm"
                >
                  <User className="w-3.5 h-3.5 text-[#C8A75A]" />
                  <span className="line-clamp-1">{currentUser.name}</span>
                  <ChevronDown className="w-3 h-3 text-[#666666]" />
                </button>

                {/* Flipkart / Amazon Style User Dropdown Menu */}
                {isUserDropdownOpen && (
                  <div
                    onMouseLeave={() => setIsUserDropdownOpen(false)}
                    className="absolute right-0 top-full mt-2 w-56 bg-[#FFFFFF] dark:bg-[#1E1E1E] rounded-2xl border border-[#E6DFD3] dark:border-[#383838] shadow-2xl p-2 text-xs font-sans z-50 space-y-1"
                  >
                    <div className="p-3 border-b border-[#E6DFD3] dark:border-[#383838] bg-[#FAF7F2] dark:bg-[#151515] rounded-xl mb-1">
                      <p className="font-bold text-[#1F1F1F] dark:text-[#F8F5F0]">{currentUser.name}</p>
                      <p className="text-[10px] text-gray-500 line-clamp-1">{currentUser.email}</p>
                    </div>

                    <button
                      onClick={() => {
                        setIsUserDropdownOpen(false);
                        if (onOpenProfile) onOpenProfile();
                      }}
                      className="w-full text-left px-3 py-2 rounded-xl hover:bg-[#FAF7F2] dark:hover:bg-[#232323] flex items-center gap-2 font-medium"
                    >
                      <User className="w-4 h-4 text-[#C8A75A]" /> My Profile
                    </button>

                    <button
                      onClick={() => {
                        setIsUserDropdownOpen(false);
                        if (onOpenProfile) onOpenProfile();
                      }}
                      className="w-full text-left px-3 py-2 rounded-xl hover:bg-[#FAF7F2] dark:hover:bg-[#232323] flex items-center gap-2 font-medium"
                    >
                      <Package className="w-4 h-4 text-[#C8A75A]" /> My Orders
                    </button>

                    <button
                      onClick={() => {
                        setIsUserDropdownOpen(false);
                        if (onOpenWishlist) onOpenWishlist();
                      }}
                      className="w-full text-left px-3 py-2 rounded-xl hover:bg-[#FAF7F2] dark:hover:bg-[#232323] flex items-center gap-2 font-medium"
                    >
                      <Heart className="w-4 h-4 text-[#C8A75A]" /> Wishlist
                    </button>

                    <button
                      onClick={() => {
                        setIsUserDropdownOpen(false);
                        if (onOpenLoyalty) onOpenLoyalty();
                      }}
                      className="w-full text-left px-3 py-2 rounded-xl hover:bg-[#FAF7F2] dark:hover:bg-[#232323] flex items-center gap-2 font-medium"
                    >
                      <Wallet className="w-4 h-4 text-[#C8A75A]" /> Wallet (₹{currentUser.walletBalance || 0})
                    </button>

                    <button
                      onClick={() => {
                        setIsUserDropdownOpen(false);
                        logoutUser();
                      }}
                      className="w-full text-left px-3 py-2 rounded-xl hover:bg-red-50 text-red-600 font-bold flex items-center gap-2 border-t border-[#E6DFD3] dark:border-[#383838] mt-1"
                    >
                      <LogOut className="w-4 h-4 text-red-600" /> Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link
                href="/login"
                className="bg-[#C8A75A] text-white px-4 py-2 rounded-full font-bold text-xs hover:bg-[#D4B46A] transition-all shadow-sm flex items-center gap-1.5"
              >
                <User className="w-3.5 h-3.5 text-white" /> Login / Sign Up
              </Link>
            )}

            {/* Mobile Hamburger */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 text-[#1F1F1F] dark:text-[#F8F5F0] hover:text-[#C8A75A]"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden mt-3 pt-3 border-t border-[#E6DFD3] dark:border-[#383838] space-y-2 text-xs">
            <button
              onClick={toggleTheme}
              className="w-full p-2.5 rounded-xl bg-[#FAF7F2] dark:bg-[#1E1E1E] text-[#1F1F1F] dark:text-[#F8F5F0] font-medium text-center flex items-center justify-center gap-2 border border-[#E6DFD3] dark:border-[#383838]"
            >
              {theme === "dark" ? <Sun className="w-4 h-4 text-[#C8A75A]" /> : <Moon className="w-4 h-4 text-[#C8A75A]" />}
              Switch to {theme === "dark" ? "Light Luxury Theme" : "Dark Luxury Theme"}
            </button>
            
            {!currentUser && (
              <Link
                href="/login"
                className="w-full p-3 rounded-xl bg-[#C8A75A] text-white font-bold tracking-wider text-center flex items-center justify-center gap-2 uppercase"
              >
                <User className="w-4 h-4" /> Login / Create Account
              </Link>
            )}
          </div>
        )}
      </nav>
    </header>
  );
};
