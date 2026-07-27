"use client";

import { useState } from "react";
import Link from "next/link";
import { Sparkles, ShoppingBag, Heart, Search, Menu, X, ChevronDown, User, Mic } from "lucide-react";

interface NavbarProps {
  cartCount: number;
  onOpenCart: () => void;
}

const collectionsDropdownItems = [
  {
    name: "SCENTED CANDLES",
    description: "AROMATHERAPY INFUSED LUXURY SOY...",
    icon: "🕯️",
    href: "/collections/scented-candles"
  },
  {
    name: "FLORAL COLLECTION",
    description: "HAND-POURED FLORAL BOUQUETS OF...",
    icon: "🌸",
    href: "/collections/floral-collection"
  },
  {
    name: "VANILLA COLLECTION",
    description: "WARM MADAGASCAR VANILLA BEAN &...",
    icon: "🍦",
    href: "/collections/vanilla-collection"
  },
  {
    name: "COFFEE COLLECTION",
    description: "RICH ROASTED ARABICA & DARK...",
    icon: "☕",
    href: "/collections/coffee-collection"
  },
  {
    name: "FESTIVE COLLECTION",
    description: "SPICED CINNAMON, GLOWING AMBER...",
    icon: "🎄",
    href: "/collections/festive-collection"
  },
  {
    name: "GIFT BOXES",
    description: "CURATED LUXURY GIFT SETS...",
    icon: "🎁",
    href: "/collections/gift-boxes"
  }
];

export default function Navbar({ cartCount, onOpenCart }: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [collectionsOpen, setCollectionsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <header className="sticky top-0 z-40 bg-[#FAF8F4]/95 backdrop-blur-md border-b border-[#EDE8DF]">
      {/* Announcement Bar */}
      <div className="bg-gradient-to-r from-[#2C2820] via-[#4A3425] to-[#2C2820] text-[#E8C97A] text-[11px] font-semibold py-1.5 px-4 text-center tracking-wider uppercase flex items-center justify-center gap-2">
        <Sparkles className="w-3.5 h-3.5 text-[#C9A84C] animate-pulse" />
        <span>Free Shipping on Orders Over ₹1,499 • Use Code <strong>LUXURY20</strong> for 20% OFF</span>
      </div>

      {/* Header Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
        {/* Mobile Menu Toggle */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="lg:hidden text-[#2C2820] p-2 hover:bg-[#F5EFE0] rounded-xl"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>

        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-2.5 group flex-shrink-0">
          <div className="w-10 h-10 rounded-full border border-[#C9A84C] bg-white flex items-center justify-center text-[#C9A84C] shadow-sm group-hover:scale-105 transition-transform">
            <Sparkles className="w-5 h-5 text-[#C9A84C]" />
          </div>
          <div className="flex flex-col">
            <span className="font-serif-luxury font-bold text-xl text-[#2C2820] tracking-wider uppercase leading-none">
              The Candle Lab
            </span>
            <span className="text-[9px] text-[#8B6B47] font-semibold tracking-widest uppercase mt-0.5">
              CRAFTED TO GLOW
            </span>
          </div>
        </Link>

        {/* Desktop Links */}
        <nav className="hidden lg:flex items-center gap-7 text-xs font-bold uppercase tracking-wider text-[#4A4540]">
          <Link href="/" className="hover:text-[#C9A84C] transition-colors">
            HOME
          </Link>

          <Link href="/shop" className="hover:text-[#C9A84C] transition-colors">
            SHOP
          </Link>

          {/* Collections Dropdown Menu */}
          <div
            className="relative"
            onMouseEnter={() => setCollectionsOpen(true)}
            onMouseLeave={() => setCollectionsOpen(false)}
          >
            <button className="flex items-center gap-1 hover:text-[#C9A84C] transition-colors py-2">
              <span className={collectionsOpen ? "text-[#C9A84C]" : ""}>Collections</span>
              <ChevronDown className={`w-3.5 h-3.5 transition-transform ${collectionsOpen ? "rotate-180 text-[#C9A84C]" : ""}`} />
            </button>

            {/* Dropdown Menu Window matching user's image */}
            {collectionsOpen && (
              <div className="absolute left-0 mt-0 w-80 bg-white rounded-2xl border border-[#DDD5C4] shadow-2xl p-4 z-50 animate-in fade-in slide-in-from-top-2">
                <div className="px-2 pb-2 mb-2 border-b border-[#EDE8DF] flex items-center justify-between">
                  <span className="text-[10px] font-bold text-[#C9A84C] uppercase tracking-widest">
                    CURATED COLLECTIONS ({collectionsDropdownItems.length})
                  </span>
                </div>

                <div className="space-y-1 max-h-80 overflow-y-auto pr-1">
                  {collectionsDropdownItems.map((col, idx) => (
                    <Link
                      key={idx}
                      href={col.href}
                      className="flex items-start gap-3 p-2.5 rounded-xl hover:bg-[#FAF8F4] transition-colors group"
                    >
                      <span className="text-xl flex-shrink-0 mt-0.5">{col.icon}</span>
                      <div>
                        <p className="font-bold text-xs text-[#2C2820] group-hover:text-[#C9A84C] transition-colors tracking-wide">
                          {col.name}
                        </p>
                        <p className="text-[10px] text-[#9B9591] font-medium tracking-tight">
                          {col.description}
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>

          <Link href="/shop?category=Build+Your+Candle" className="hover:text-[#C9A84C] transition-colors">
            Build Your Candle
          </Link>

          <Link href="/collections/gift-boxes" className="hover:text-[#C9A84C] transition-colors">
            Gift Boxes
          </Link>

          <Link href="/about" className="hover:text-[#C9A84C] transition-colors">
            About Us
          </Link>

          <Link href="/contact" className="hover:text-[#C9A84C] transition-colors">
            CONTACT
          </Link>
        </nav>

        {/* Right Search Input & Actions */}
        <div className="flex items-center gap-3">
          {/* Search Box with Voice Icon */}
          <div className="relative hidden md:block w-48 lg:w-56">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search candles..."
              className="w-full pl-9 pr-8 py-2 rounded-full bg-[#F5EFE0] border border-[#DDD5C4] text-xs focus:outline-none focus:bg-white focus:border-[#C9A84C] text-[#2C2820]"
            />
            <Search className="w-3.5 h-3.5 text-[#9B9591] absolute left-3 top-1/2 -translate-y-1/2" />
            <Mic className="w-3.5 h-3.5 text-[#9B9591] absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer hover:text-[#C9A84C]" />
          </div>

          {/* Wishlist Icon */}
          <Link href="/wishlist" className="relative p-2 text-[#2C2820] hover:text-[#C9A84C] transition-colors group">
            <Heart className="w-5 h-5 group-hover:fill-[#C9A84C] group-hover:text-[#C9A84C] transition-all" />
            <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-[#C9A84C] text-white text-[9px] font-bold flex items-center justify-center">
              3
            </span>
          </Link>

          {/* Cart Icon */}
          <button
            onClick={onOpenCart}
            className="p-2 text-[#2C2820] hover:text-[#C9A84C] transition-colors relative"
          >
            <ShoppingBag className="w-5 h-5" />
            {cartCount > 0 && (
              <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-[#2D7A4F] text-white text-[9px] font-bold flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </button>

          {/* Login / Sign Up Button */}
          <Link
            href="/login"
            className="hidden sm:inline-flex items-center gap-1.5 bg-[#C9A84C] text-white text-xs font-bold px-4 py-2 rounded-full hover:bg-[#A3863C] transition-colors shadow-sm"
          >
            <User className="w-3.5 h-3.5" />
            <span>Login / Sign Up</span>
          </Link>
        </div>
      </div>
    </header>
  );
}
