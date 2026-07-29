"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import NextImage from "next/image";
import {
  Search,
  ShoppingBag,
  Heart,
  User,
  Menu,
  X,
  ChevronDown,
  Flame,
} from "lucide-react";
import { useCartStore, useUIStore, useWishlistStore } from "@/store";
import { CATEGORIES } from "@/data/mock";
import { cn } from "@/lib/utils";

const NAV_LINKS = [
  { label: "Home", href: "/" },
  {
    label: "Shop",
    href: "/shop",
    children: [
      { label: "All Products", href: "/shop", desc: "Browse entire collection" },
      { label: "New Arrivals", href: "/shop?filter=new", desc: "Latest additions" },
      { label: "Best Sellers", href: "/shop?filter=bestsellers", desc: "Customer favourites" },
      { label: "Trending Now", href: "/shop?filter=trending", desc: "What's hot right now" },
    ],
  },
  {
    label: "Collections",
    href: "/collections",
    children: [
      { label: "Luxury Collection", href: "/collection/luxury-collection", desc: "Our most premium pieces" },
      { label: "Seasonal Favourites", href: "/collection/seasonal-collection", desc: "Season-inspired scents" },
      { label: "Gift Collection", href: "/collection/gift-collection", desc: "Perfect for every occasion" },
    ],
  },
  {
    label: "Categories",
    href: "/categories",
    children: CATEGORIES.map((c) => ({
      label: c.name,
      href: `/category/${c.slug}`,
      desc: c.description,
    })),
  },
  {
    label: "Atelier Studio",
    href: "#",
    children: [
      { label: "Build Your Candle 🕯️", action: "customizer", desc: "Custom jar, wax & scent notes" },
      { label: "Fragrance Finder Quiz 🧭", action: "quiz", desc: "Discover your scent profile" },
      { label: "Mix & Match Bundle 🎁", action: "bundle", desc: "Create custom gift sets" },
      { label: "Corporate Bulk Orders 💼", action: "corporate", desc: "B2B & Event Gifting" },
      { label: "Fragrance VIP Club 👑", action: "loyalty", desc: "Earn points & rewards" },
      { label: "Admin Portal ⚙️", href: "/admin", desc: "17-Module Admin Control Center" },
    ],
  },
  { label: "Journal", href: "/blogs/artisanal-candle-care-guide" },
  { label: "Contact", href: "/contact" },
];

export function Navbar() {
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { getItemCount, openCart } = useCartStore();
  const { items: wishlistItems } = useWishlistStore();
  const {
    isMobileMenuOpen,
    openMobileMenu,
    closeMobileMenu,
    openSearch,
    openCustomizer,
    openFragranceQuiz,
    openBundleBuilder,
    openCorporateOrders,
    openLoyalty,
    toggleAIChat,
  } = useUIStore();

  const handleChildAction = (action?: string) => {
    setActiveDropdown(null);
    if (action === "customizer") openCustomizer();
    else if (action === "quiz") openFragranceQuiz();
    else if (action === "bundle") openBundleBuilder();
    else if (action === "corporate") openCorporateOrders();
    else if (action === "loyalty") openLoyalty();
  };

  const cartCount = getItemCount();
  const wishlistCount = wishlistItems.length;

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    closeMobileMenu();
    setActiveDropdown(null);
  }, [pathname]);

  return (
    <>
      {/* Main Navbar */}
      <motion.header
        initial={false}
        animate={{
          boxShadow: isScrolled ? "0 4px 32px rgba(26,18,8,0.10)" : "0 2px 10px rgba(26,18,8,0.04)",
          backgroundColor: "rgba(253,250,245,0.96)",
        }}
        transition={{ duration: 0.3 }}
        className="sticky top-0 left-0 right-0 z-[300] backdrop-blur-md border-b border-[#E8E0D2]"
      >
        <nav className="container">
          <div className="flex items-center justify-between h-18 py-3 gap-4">
            {/* Mobile Menu Button */}
            <button
              id="mobile-menu-btn"
              className="btn btn-ghost btn-icon hide-desktop"
              onClick={isMobileMenuOpen ? closeMobileMenu : openMobileMenu}
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>

            {/* Logo */}
            <Link href="/" className="flex items-center gap-2.5 flex-shrink-0">
              <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-[#C4964A] shadow-md relative bg-[#1A1208]">
                <NextImage src="/logo.jpeg" alt="The Candle Lab Logo" fill sizes="40px" className="object-cover" />
              </div>
              <div className="flex flex-col leading-none">
                <span
                  className="text-xs font-semibold tracking-[0.18em] uppercase text-[#8B5E3C]"
                  style={{ fontFamily: "Inter, sans-serif" }}
                >
                  The
                </span>
                <span
                  className="text-lg font-medium tracking-[0.06em] text-[#1A1208]"
                  style={{ fontFamily: "Cormorant Garamond, Georgia, serif" }}
                >
                  Candle Lab
                </span>
              </div>
            </Link>

            {/* Desktop Nav Links */}
            <div
              className="hidden md:flex items-center gap-5 lg:gap-7"
              ref={dropdownRef}
            >
              {NAV_LINKS.map((link) => (
                <div
                  key={link.label}
                  className="relative"
                  onMouseEnter={() =>
                    link.children && setActiveDropdown(link.label)
                  }
                  onMouseLeave={() => setActiveDropdown(null)}
                >
                  <Link
                    href={link.href}
                    className={cn(
                      "flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-sm font-medium transition-all duration-200 tracking-wide",
                      pathname === link.href
                        ? "text-[#A87B32] bg-[#F5EFE4]"
                        : "text-[#4A3728] hover:text-[#1A1208] hover:bg-[#F5EFE4]"
                    )}
                  >
                    {link.label}
                    {link.children && (
                      <ChevronDown
                        size={14}
                        className={cn(
                          "transition-transform duration-200",
                          activeDropdown === link.label && "rotate-180"
                        )}
                      />
                    )}
                  </Link>

                  {/* Mega Dropdown */}
                  <AnimatePresence>
                    {link.children && activeDropdown === link.label && (
                      <motion.div
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 8 }}
                        transition={{ duration: 0.2 }}
                        className="absolute top-full left-0 mt-1 w-72 rounded-xl overflow-hidden z-50"
                        style={{
                          background: "rgba(253,250,245,0.98)",
                          backdropFilter: "blur(20px)",
                          border: "1px solid rgba(224,208,184,0.7)",
                          boxShadow: "0 16px 48px rgba(26,18,8,0.12)",
                        }}
                      >
                        <div className="p-2">
                          {link.children.map((child) => (
                            <Link
                              key={child.label}
                              href={child.href || "#"}
                              onClick={() => {
                                if (child.action) handleChildAction(child.action);
                                else setActiveDropdown(null);
                              }}
                              className="flex flex-col px-4 py-3 rounded-lg hover:bg-[#F5EFE4] transition-colors group"
                            >
                              <span className="text-sm font-medium text-[#1A1208] group-hover:text-[#A87B32] transition-colors">
                                {child.label}
                              </span>
                              <span className="text-xs text-[#8B7355] mt-0.5">
                                {child.desc}
                              </span>
                            </Link>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </div>

            {/* Right Actions */}
            <div className="flex items-center gap-1">
              {/* Search */}
              <button
                id="nav-search-btn"
                className="btn btn-ghost btn-icon"
                onClick={openSearch}
                aria-label="Search"
                suppressHydrationWarning
              >
                <Search size={20} strokeWidth={1.8} />
              </button>

              {/* Wishlist */}
              <Link
                href="/wishlist"
                id="nav-wishlist-btn"
                className="btn btn-ghost btn-icon relative"
                aria-label="Wishlist"
              >
                <Heart size={20} strokeWidth={1.8} />
                {wishlistCount > 0 && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-1 -right-1 w-4.5 h-4.5 rounded-full bg-[#C4964A] text-white text-[9px] font-bold flex items-center justify-center"
                    style={{ width: "1.1rem", height: "1.1rem" }}
                  >
                    {wishlistCount}
                  </motion.span>
                )}
              </Link>

              {/* Account */}
              <Link
                href="/account"
                id="nav-account-btn"
                className="btn btn-ghost btn-icon hidden sm:flex"
                aria-label="Account"
              >
                <User size={20} strokeWidth={1.8} />
              </Link>

              {/* Cart */}
              <button
                id="nav-cart-btn"
                className="btn btn-ghost btn-icon relative"
                onClick={openCart}
                aria-label="Shopping cart"
                suppressHydrationWarning
              >
                <ShoppingBag size={20} strokeWidth={1.8} />
                {cartCount > 0 && (
                  <motion.span
                    key={cartCount}
                    initial={{ scale: 0.5 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 400, damping: 20 }}
                    className="absolute -top-1 -right-1 rounded-full bg-[#C4964A] text-white text-[9px] font-bold flex items-center justify-center"
                    style={{ width: "1.1rem", height: "1.1rem", minWidth: "1.1rem" }}
                  >
                    {cartCount > 9 ? "9+" : cartCount}
                  </motion.span>
                )}
              </button>
            </div>
          </div>
        </nav>
      </motion.header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeMobileMenu}
              className="fixed inset-0 bg-[#1A1208]/50 backdrop-blur-sm z-[290]"
            />
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", stiffness: 300, damping: 35 }}
              className="fixed left-0 top-0 bottom-0 w-80 bg-[#FDFAF5] z-[295] overflow-y-auto"
              style={{ boxShadow: "4px 0 32px rgba(26,18,8,0.12)" }}
            >
              {/* Mobile Header */}
              <div className="flex items-center justify-between p-5 border-b border-[#E0D0B8]">
                <Link href="/" onClick={closeMobileMenu} className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#A87B32] to-[#D4A96A] flex items-center justify-center">
                    <Flame size={15} className="text-white" />
                  </div>
                  <span
                    className="text-lg font-medium text-[#1A1208]"
                    style={{ fontFamily: "Cormorant Garamond, Georgia, serif" }}
                  >
                    The Candle Lab
                  </span>
                </Link>
                <button onClick={closeMobileMenu} className="btn btn-ghost btn-icon">
                  <X size={20} />
                </button>
              </div>

              {/* Mobile Links */}
              <div className="p-4 flex flex-col gap-1">
                {NAV_LINKS.map((link, i) => (
                  <motion.div
                    key={link.label}
                    initial={{ opacity: 0, x: -16 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.06 }}
                  >
                    <Link
                      href={link.href}
                      onClick={closeMobileMenu}
                      className={cn(
                        "flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium transition-colors",
                        pathname === link.href
                          ? "bg-[#F5EFE4] text-[#A87B32]"
                          : "text-[#4A3728] hover:bg-[#F5EFE4] hover:text-[#1A1208]"
                      )}
                    >
                      {link.label}
                    </Link>
                    {link.children && (
                      <div className="ml-4 mt-1 flex flex-col gap-0.5">
                        {link.children.map((child) => (
                          <Link
                            key={child.label}
                            href={child.href || "#"}
                            onClick={() => {
                              closeMobileMenu();
                              if (child.action) handleChildAction(child.action);
                            }}
                            className="px-4 py-2 rounded-lg text-xs text-[#8B7355] hover:text-[#1A1208] hover:bg-[#F5EFE4] transition-colors"
                          >
                            {child.label}
                          </Link>
                        ))}
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>

              {/* Mobile Footer */}
              <div className="absolute bottom-0 left-0 right-0 p-5 border-t border-[#E0D0B8] bg-[#F5EFE4]">
                <div className="flex gap-3">
                  <Link href="/account" onClick={closeMobileMenu} className="btn btn-outline btn-sm flex-1">
                    <User size={15} />
                    Account
                  </Link>
                  <Link href="/wishlist" onClick={closeMobileMenu} className="btn btn-outline btn-sm flex-1">
                    <Heart size={15} />
                    Wishlist {wishlistCount > 0 && `(${wishlistCount})`}
                  </Link>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
