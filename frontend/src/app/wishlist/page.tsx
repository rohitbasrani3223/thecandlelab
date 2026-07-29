"use client";

import { Navbar } from "@/components/layout/Navbar";
import { AnnouncementBar } from "@/components/layout/AnnouncementBar";
import { Footer } from "@/components/layout/Footer";
import { useWishlistStore } from "@/store";
import { PRODUCTS } from "@/data/mock";
import { ProductCard } from "@/components/product/ProductCard";
import Link from "next/link";
import { motion } from "framer-motion";
import { Heart, ShoppingBag } from "lucide-react";

export default function WishlistPage() {
  const { items: wishlistIds, clearWishlist } = useWishlistStore();
  const wishlistProducts = PRODUCTS.filter((p) => wishlistIds.includes(p.id));

  return (
    <>
      <AnnouncementBar />
      <Navbar />
      <main className="pt-20 min-h-screen" style={{ background: "#FDFAF5" }}>
        <div className="container py-10">
          <div className="flex items-center justify-between mb-8">
            <div>
              <span className="section-label">Your Favorites</span>
              <h1
                className="text-3xl font-medium text-[#1A1208] mt-1"
                style={{ fontFamily: "Cormorant Garamond, Georgia, serif" }}
              >
                Wishlist ({wishlistProducts.length})
              </h1>
            </div>
            {wishlistProducts.length > 0 && (
              <button
                onClick={clearWishlist}
                className="text-sm text-[#8B7355] hover:text-[#B85450] transition-colors"
                id="clear-wishlist-btn"
              >
                Clear All
              </button>
            )}
          </div>

          {wishlistProducts.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col items-center justify-center py-20 text-center"
            >
              <div
                className="w-20 h-20 rounded-full flex items-center justify-center text-3xl mb-4"
                style={{ background: "#F5EFE4" }}
              >
                🤍
              </div>
              <h2
                className="text-2xl font-medium text-[#1A1208] mb-2"
                style={{ fontFamily: "Cormorant Garamond, Georgia, serif" }}
              >
                Your wishlist is empty
              </h2>
              <p className="text-sm text-[#8B7355] mb-6 max-w-sm">
                Save candles you love by clicking the heart icon on any product.
              </p>
              <Link href="/shop" className="btn btn-gold gap-2" id="wishlist-shop-now">
                <ShoppingBag size={18} />
                Explore Collection
              </Link>
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {wishlistProducts.map((product, i) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <ProductCard product={product} />
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
