"use client";

import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import ProductCard, { Product } from "@/components/ProductCard";
import CartDrawer, { CartItem } from "@/components/CartDrawer";
import Footer from "@/components/Footer";
import { Filter, Loader2, AlertTriangle } from "lucide-react";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8085/api";

export default function ShopPage() {
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("ALL");
  const [sortBy, setSortBy] = useState("FEATURED");

  const loadProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch(`${API_BASE}/admin/products?page=0&size=100`);
      if (!res.ok) throw new Error(`Status ${res.status}`);
      const json = await res.json();
      const list = json?.data?.content ?? json?.data ?? json ?? [];
      // Map backend Product entity to storefront Product interface
      const mapped: Product[] = (Array.isArray(list) ? list : [])
        .filter((p: any) => p.status === "ACTIVE")
        .map((p: any) => ({
          id: String(p.id),
          name: p.name,
          category: p.category?.name || p.subCategory?.name || "Candles",
          price: p.price,
          salePrice: p.salePrice || undefined,
          rating: p.rating || 4.8,
          reviewsCount: p.reviewsCount || 0,
          fragranceNotes: p.fragranceNotes || p.shortDescription || "",
          inStock: (p.stock ?? 1) > 0,
          imageUrl: p.imageUrl || undefined,
          imageBg: "bg-[#F5EFE0]",
        }));
      setAllProducts(mapped);
    } catch (e: any) {
      setError("Backend offline — start Spring Boot at port 8080 to see real products.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadProducts(); }, []);

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

  const categories = ["ALL", ...Array.from(new Set(allProducts.map((p) => p.category)))];

  let filtered = allProducts.filter((p) => {
    if (selectedCategory === "ALL") return true;
    return p.category === selectedCategory;
  });

  if (sortBy === "LOW_HIGH") {
    filtered = [...filtered].sort((a, b) => (a.salePrice || a.price) - (b.salePrice || b.price));
  } else if (sortBy === "HIGH_LOW") {
    filtered = [...filtered].sort((a, b) => (b.salePrice || b.price) - (a.salePrice || a.price));
  } else if (sortBy === "RATING") {
    filtered = [...filtered].sort((a, b) => b.rating - a.rating);
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF8F4] font-sans">
      <Navbar cartCount={totalCartCount} onOpenCart={() => setIsCartOpen(true)} />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full space-y-8">
        {/* Page Banner */}
        <div className="rounded-2xl bg-gradient-to-r from-[#2C2820] via-[#4A3425] to-[#2C2820] px-8 py-10 text-white relative overflow-hidden">
          <div className="absolute inset-0 opacity-10 bg-[url('/grid.svg')] bg-repeat" />
          <p className="text-[#C9A84C] text-xs font-bold uppercase tracking-widest mb-2">THE CANDLE LAB CATALOG</p>
          <h1 className="text-3xl md:text-4xl font-serif font-bold mb-2 leading-tight">
            Shop All Luxury Artisanal Fragrances
          </h1>
          <p className="text-[#DDD5C4] text-sm">
            100% Soy Wax • Hand-Poured • Free Shipping On Orders Over ₹1,499
          </p>
        </div>

        {/* Error Banner */}
        {error && (
          <div className="p-4 bg-[#FDECEA] border border-[#F5C6CB] rounded-xl flex items-center gap-3">
            <AlertTriangle className="w-5 h-5 text-[#C0392B] flex-shrink-0" />
            <div>
              <p className="text-sm font-bold text-[#C0392B]">Backend Offline</p>
              <p className="text-xs text-[#C0392B] mt-0.5">{error}</p>
            </div>
            <button onClick={loadProducts} className="ml-auto text-xs font-bold text-[#C0392B] underline">Retry</button>
          </div>
        )}

        {/* Filters */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-2 flex-wrap">
            <Filter className="w-4 h-4 text-[#9B9591]" />
            <span className="text-xs font-bold text-[#9B9591] uppercase tracking-wide">Category:</span>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`text-xs font-bold px-3 py-1.5 rounded-full border transition-all ${
                  selectedCategory === cat
                    ? "bg-[#C9A84C] text-white border-[#C9A84C]"
                    : "bg-white text-[#4A4540] border-[#DDD5C4] hover:border-[#C9A84C]"
                }`}
              >
                {cat === "ALL" ? "All Products" : cat}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-[#9B9591] uppercase tracking-wide">Sort:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="text-xs border border-[#DDD5C4] rounded-lg px-3 py-1.5 bg-white focus:outline-none focus:border-[#C9A84C]"
            >
              <option value="FEATURED">Featured Items</option>
              <option value="LOW_HIGH">Price: Low to High</option>
              <option value="HIGH_LOW">Price: High to Low</option>
              <option value="RATING">Highest Rated</option>
            </select>
          </div>
        </div>

        {/* Loading */}
        {loading && (
          <div className="flex items-center justify-center py-20 gap-3">
            <Loader2 className="w-8 h-8 text-[#C9A84C] animate-spin" />
            <span className="text-[#9B9591] font-medium">Loading products...</span>
          </div>
        )}

        {/* Products Grid */}
        {!loading && (
          <>
            {filtered.length === 0 ? (
              <div className="text-center py-20">
                <div className="text-5xl mb-4">🕯️</div>
                <h2 className="text-xl font-serif font-bold text-[#2C2820] mb-2">
                  {error ? "Backend is offline" : "No products yet"}
                </h2>
                <p className="text-[#9B9591] text-sm max-w-sm mx-auto">
                  {error
                    ? "Unable to connect to product service. Please check connection."
                    : "Add products from the Admin Panel and they will appear here automatically."}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filtered.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onAddToCart={handleAddToCart}
                  />
                ))}
              </div>
            )}
          </>
        )}
      </main>

      <Footer />

      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cart}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
      />
    </div>
  );
}
