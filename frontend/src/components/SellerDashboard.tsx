"use client";

import React, { useState } from "react";
import { useStore, CandleProduct } from "@/context/StoreContext";
import {
  Store,
  DollarSign,
  Package,
  ShoppingBag,
  Plus,
  Layers,
  Sparkles,
  TrendingUp,
  CheckCircle2,
  AlertTriangle
} from "lucide-react";

interface SellerDashboardProps {
  onOpenCollectionsModal: () => void;
}

export const SellerDashboard: React.FC<SellerDashboardProps> = ({ onOpenCollectionsModal }) => {
  const { products, addProduct, collections, currency } = useStore();
  const [activeTab, setActiveTab] = useState<"overview" | "products" | "add-product">("overview");

  // Form for new product creation
  const [newProd, setNewProd] = useState({
    name: "",
    slug: "",
    tagline: "",
    price: 699,
    category: "Luxury",
    collections: ["scented-candles"],
    waxType: "Soy Wax" as const,
    wickType: "Wooden Crackling Wick" as const,
    burnTimeHours: 50,
    weightGrams: 250,
    topNotes: "Bergamot, Lavender",
    middleNotes: "Amber, Oud Wood",
    baseNotes: "Vanilla, Sandalwood",
    fragranceStrength: 4 as const,
    roomSize: "Medium (Living Room)" as const,
    stock: 50,
    description: ""
  });

  const handleCreateProduct = (e: React.FormEvent) => {
    e.preventDefault();
    addProduct({
      name: newProd.name,
      slug: newProd.name.toLowerCase().replace(/\s+/g, "-"),
      tagline: newProd.tagline || "Handcrafted premium luxury candle",
      price: newProd.price,
      rating: 5.0,
      reviewsCount: 1,
      images: [
        "https://images.unsplash.com/photo-1603006905003-be475563bc59?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1572726729207-a78d6fea73a7?auto=format&fit=crop&w=800&q=80"
      ],
      category: newProd.category,
      collections: newProd.collections,
      waxType: newProd.waxType,
      wickType: newProd.wickType,
      burnTimeHours: newProd.burnTimeHours,
      weightGrams: newProd.weightGrams,
      fragranceNotes: {
        top: newProd.topNotes.split(",").map((s) => s.trim()),
        middle: newProd.middleNotes.split(",").map((s) => s.trim()),
        base: newProd.baseNotes.split(",").map((s) => s.trim())
      },
      fragranceStrength: newProd.fragranceStrength,
      roomSize: newProd.roomSize,
      careInstructions: ["Trim wick before each burn"],
      ingredients: ["Natural Wax", "Essential Oils"],
      isVegan: true,
      isHandmade: true,
      isEcoFriendly: true,
      stock: newProd.stock,
      sellerId: "seller-1",
      sellerName: "The Candle Lab Atelier",
      description: newProd.description || "Artisanal hand-poured candle."
    });

    setActiveTab("products");
  };

  return (
    <div className="max-w-7xl mx-auto px-4 lg:px-8 py-8 space-y-6">
      
      {/* Header Banner */}
      <div className="bg-brand-charcoal text-brand-beige p-6 rounded-2xl border border-brand-gold/40 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <span className="text-xs font-bold text-brand-gold uppercase tracking-wider flex items-center gap-1.5">
            <Store className="w-4 h-4" /> SELLER ATELIER PORTAL
          </span>
          <h1 className="font-serif text-2xl md:text-3xl font-bold text-white mt-1">
            The Candle Lab Atelier
          </h1>
        </div>

        <div className="flex gap-2">
          <button
            onClick={onOpenCollectionsModal}
            className="bg-brand-gold text-brand-charcoal px-4 py-2 rounded-xl text-xs font-bold hover:bg-brand-goldLight transition-colors flex items-center gap-1.5 shadow"
          >
            <Layers className="w-4 h-4" /> Manage Dynamic Collections
          </button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex border-b border-brand-beige gap-4 text-xs font-serif font-bold">
        <button
          onClick={() => setActiveTab("overview")}
          className={`pb-3 transition-colors ${
            activeTab === "overview" ? "border-b-2 border-brand-gold text-brand-charcoal" : "text-brand-earth"
          }`}
        >
          Overview Metrics
        </button>
        <button
          onClick={() => setActiveTab("products")}
          className={`pb-3 transition-colors ${
            activeTab === "products" ? "border-b-2 border-brand-gold text-brand-charcoal" : "text-brand-earth"
          }`}
        >
          Inventory Catalog ({products.length})
        </button>
        <button
          onClick={() => setActiveTab("add-product")}
          className={`pb-3 transition-colors ${
            activeTab === "add-product" ? "border-b-2 border-brand-gold text-brand-charcoal" : "text-brand-earth"
          }`}
        >
          + Add New Candle
        </button>
      </div>

      {/* Overview Tab */}
      {activeTab === "overview" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white p-5 rounded-2xl border border-brand-beige shadow-sm space-y-2">
              <span className="text-xs text-brand-earth uppercase font-bold tracking-wider">Total Sales Revenue</span>
              <p className="font-serif text-2xl font-bold text-brand-charcoal">{currency}1,42,850</p>
              <span className="text-[11px] text-green-700 font-bold flex items-center gap-1">
                <TrendingUp className="w-3 h-3" /> +18.4% this month
              </span>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-brand-beige shadow-sm space-y-2">
              <span className="text-xs text-brand-earth uppercase font-bold tracking-wider">Active Candles</span>
              <p className="font-serif text-2xl font-bold text-brand-charcoal">{products.length} Items</p>
              <span className="text-[11px] text-brand-earth">All listed & active</span>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-brand-beige shadow-sm space-y-2">
              <span className="text-xs text-brand-earth uppercase font-bold tracking-wider">Pending Orders</span>
              <p className="font-serif text-2xl font-bold text-brand-gold">12 Orders</p>
              <span className="text-[11px] text-amber-700 font-bold">Ready for wax sealing</span>
            </div>
          </div>
        </div>
      )}

      {/* Catalog Tab */}
      {activeTab === "products" && (
        <div className="bg-white rounded-2xl border border-brand-beige p-4 overflow-x-auto">
          <table className="w-full text-xs text-left text-brand-charcoal">
            <thead className="bg-brand-surface font-serif uppercase tracking-wider text-[10px] border-b border-brand-beige">
              <tr>
                <th className="p-3">Candle</th>
                <th className="p-3">Wax & Wick</th>
                <th className="p-3">Burn Time</th>
                <th className="p-3">Price</th>
                <th className="p-3">Stock</th>
                <th className="p-3">Collections</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-beige">
              {products.map((p) => (
                <tr key={p.id} className="hover:bg-brand-beige/30">
                  <td className="p-3 flex items-center gap-2">
                    <img src={p.images[0]} alt="" className="w-10 h-10 object-cover rounded-lg" />
                    <div>
                      <span className="font-bold block">{p.name}</span>
                      <span className="text-[10px] text-gray-400">{p.category}</span>
                    </div>
                  </td>
                  <td className="p-3">{p.waxType} / {p.wickType}</td>
                  <td className="p-3 font-bold">{p.burnTimeHours} Hours</td>
                  <td className="p-3 font-bold">{currency}{p.price}</td>
                  <td className="p-3">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${p.stock > 10 ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>
                      {p.stock} left
                    </span>
                  </td>
                  <td className="p-3">
                    <div className="flex flex-wrap gap-1">
                      {p.collections.map((c) => (
                        <span key={c} className="bg-brand-beige px-1.5 py-0.2 rounded text-[9px] font-mono">
                          {c}
                        </span>
                      ))}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Add Product Form Tab */}
      {activeTab === "add-product" && (
        <form onSubmit={handleCreateProduct} className="bg-white p-6 rounded-2xl border border-brand-beige space-y-4 max-w-3xl">
          <h3 className="font-serif text-lg font-bold text-brand-charcoal border-b border-brand-beige pb-2">
            Publish New Handmade Candle
          </h3>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[11px] font-bold text-brand-earth block mb-1">Candle Title *</label>
              <input
                type="text"
                placeholder="e.g. Imperial Jasmine & Rosewood"
                value={newProd.name}
                onChange={(e) => setNewProd({ ...newProd, name: e.target.value })}
                className="w-full text-xs p-2 rounded-lg border border-brand-beige"
                required
              />
            </div>
            <div>
              <label className="text-[11px] font-bold text-brand-earth block mb-1">Price ({currency}) *</label>
              <input
                type="number"
                value={newProd.price}
                onChange={(e) => setNewProd({ ...newProd, price: Number(e.target.value) })}
                className="w-full text-xs p-2 rounded-lg border border-brand-beige"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[11px] font-bold text-brand-earth block mb-1">Wax Type</label>
              <select
                value={newProd.waxType}
                onChange={(e) => setNewProd({ ...newProd, waxType: e.target.value as any })}
                className="w-full text-xs p-2 rounded-lg border border-brand-beige"
              >
                <option value="Soy Wax">Soy Wax</option>
                <option value="Beeswax">Beeswax</option>
                <option value="Coconut Wax">Coconut Wax</option>
                <option value="Paraffin Blend">Paraffin Blend</option>
              </select>
            </div>

            <div>
              <label className="text-[11px] font-bold text-brand-earth block mb-1">Wick Type</label>
              <select
                value={newProd.wickType}
                onChange={(e) => setNewProd({ ...newProd, wickType: e.target.value as any })}
                className="w-full text-xs p-2 rounded-lg border border-brand-beige"
              >
                <option value="Wooden Crackling Wick">Wooden Crackling Wick</option>
                <option value="Cotton Wick">Cotton Wick</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="text-[11px] font-bold text-brand-earth block mb-1">Top Notes</label>
              <input
                type="text"
                placeholder="Bergamot, Citrus"
                value={newProd.topNotes}
                onChange={(e) => setNewProd({ ...newProd, topNotes: e.target.value })}
                className="w-full text-xs p-2 rounded-lg border border-brand-beige"
              />
            </div>
            <div>
              <label className="text-[11px] font-bold text-brand-earth block mb-1">Middle Notes</label>
              <input
                type="text"
                placeholder="Amber, Oud"
                value={newProd.middleNotes}
                onChange={(e) => setNewProd({ ...newProd, middleNotes: e.target.value })}
                className="w-full text-xs p-2 rounded-lg border border-brand-beige"
              />
            </div>
            <div>
              <label className="text-[11px] font-bold text-brand-earth block mb-1">Base Notes</label>
              <input
                type="text"
                placeholder="Vanilla, Sandalwood"
                value={newProd.baseNotes}
                onChange={(e) => setNewProd({ ...newProd, baseNotes: e.target.value })}
                className="w-full text-xs p-2 rounded-lg border border-brand-beige"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-brand-charcoal text-brand-gold py-3 rounded-xl font-bold text-xs hover:bg-brand-gold hover:text-brand-charcoal transition-colors"
          >
            Publish Product 🔥
          </button>
        </form>
      )}

    </div>
  );
};
