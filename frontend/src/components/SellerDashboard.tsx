"use client";

import React, { useState } from "react";
import { useStore } from "@/context/StoreContext";
import {
  Store,
  DollarSign,
  Package,
  ShoppingBag,
  Plus,
  TrendingUp,
  CheckCircle2,
  AlertTriangle,
  FileCheck,
  Building,
  CreditCard,
  Crown
} from "lucide-react";

interface SellerDashboardProps {
  onOpenCollectionsModal?: () => void;
}

export const SellerDashboard: React.FC<SellerDashboardProps> = ({ onOpenCollectionsModal }) => {
  const { products, addProduct, currency, setActiveRole } = useStore();
  const [activeTab, setActiveTab] = useState<"overview" | "products" | "add-product">("overview");

  // Form for new product creation
  const [newProd, setNewProd] = useState({
    name: "",
    price: 899,
    category: "Luxury",
    stock: 50,
    sku: "SKU-SELLER-01",
    description: ""
  });

  const handleCreateProduct = (e: React.FormEvent) => {
    e.preventDefault();
    addProduct({
      name: newProd.name,
      slug: newProd.name.toLowerCase().replace(/\s+/g, "-"),
      tagline: "Seller handcrafted luxury candle",
      price: newProd.price,
      rating: 5.0,
      reviewsCount: 1,
      images: [
        "https://images.unsplash.com/photo-1603006905003-be475563bc59?auto=format&fit=crop&w=800&q=80"
      ],
      category: newProd.category,
      collections: ["scented-candles"],
      waxType: "Soy Wax",
      wickType: "Wooden Crackling Wick",
      burnTimeHours: 50,
      weightGrams: 250,
      fragranceNotes: { top: ["Amber"], middle: ["Oud"], base: ["Vanilla"] },
      fragranceStrength: 4,
      roomSize: "Medium (Living Room)",
      careInstructions: ["Trim wick before burn"],
      ingredients: ["Natural Soy Wax", "Essential Oils"],
      isVegan: true,
      isHandmade: true,
      isEcoFriendly: true,
      stock: newProd.stock,
      sku: newProd.sku,
      barcode: "8901234567890",
      brand: "The Candle Lab Atelier",
      status: "Active",
      sellerId: "s-1",
      sellerName: "The Candle Lab Atelier",
      description: newProd.description || "Handcrafted seller candle."
    });
    setActiveTab("products");
  };

  return (
    <div className="max-w-7xl mx-auto px-4 lg:px-8 py-8 space-y-6">
      {/* Seller Header */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 px-2.5 py-0.5 rounded-full text-xs font-bold flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" /> KYB VERIFIED VENDOR
            </span>
            <span className="text-xs text-slate-400 font-mono">GSTIN: 27AAATC1234F1Z5</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-slate-900 mt-1">The Candle Lab Atelier Storefront</h1>
        </div>

        <div className="flex gap-2 flex-wrap items-center">
          <button
            onClick={() => setActiveRole("admin")}
            className="bg-slate-900 text-white px-4 py-2.5 rounded-xl text-xs font-bold hover:bg-slate-800 transition-colors flex items-center gap-1.5 shadow"
          >
            <Crown className="w-3.5 h-3.5 text-amber-400" /> Switch to Master Admin
          </button>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <span className="text-xs font-medium text-slate-500">Gross Sales Revenue</span>
          <div className="text-2xl font-bold text-slate-900 mt-1">₹1,42,850</div>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <span className="text-xs font-medium text-slate-500">Platform Commission (12%)</span>
          <div className="text-2xl font-bold text-indigo-600 mt-1">₹17,142</div>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <span className="text-xs font-medium text-slate-500">Pending Payout</span>
          <div className="text-2xl font-bold text-emerald-600 mt-1">₹24,500</div>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <span className="text-xs font-medium text-slate-500">Active SKUs</span>
          <div className="text-2xl font-bold text-slate-900 mt-1">{products.length} Products</div>
        </div>
      </div>

      {/* Sub Tabs */}
      <div className="flex border-b border-slate-200 gap-6 text-xs font-bold">
        <button
          onClick={() => setActiveTab("overview")}
          className={`pb-2.5 transition-colors ${activeTab === "overview" ? "border-b-2 border-slate-900 text-slate-900" : "text-slate-500 hover:text-slate-900"}`}
        >
          Performance Overview
        </button>
        <button
          onClick={() => setActiveTab("products")}
          className={`pb-2.5 transition-colors ${activeTab === "products" ? "border-b-2 border-slate-900 text-slate-900" : "text-slate-500 hover:text-slate-900"}`}
        >
          My Product Catalog
        </button>
        <button
          onClick={() => setActiveTab("add-product")}
          className={`pb-2.5 transition-colors ${activeTab === "add-product" ? "border-b-2 border-slate-900 text-slate-900" : "text-slate-500 hover:text-slate-900"}`}
        >
          + Add New Candle SKU
        </button>
      </div>

      {/* Content */}
      {activeTab === "add-product" && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm max-w-xl space-y-4">
          <h3 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3">New Vendor Product Form</h3>
          <form onSubmit={handleCreateProduct} className="space-y-3 text-xs">
            <div>
              <label className="font-bold text-slate-700 block mb-1">Product Title</label>
              <input
                type="text"
                required
                value={newProd.name}
                onChange={(e) => setNewProd({ ...newProd, name: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-bold text-slate-900"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Price (₹)</label>
                <input
                  type="number"
                  required
                  value={newProd.price}
                  onChange={(e) => setNewProd({ ...newProd, price: Number(e.target.value) })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-bold text-slate-900"
                />
              </div>
              <div>
                <label className="font-bold text-slate-700 block mb-1">Stock Qty</label>
                <input
                  type="number"
                  required
                  value={newProd.stock}
                  onChange={(e) => setNewProd({ ...newProd, stock: Number(e.target.value) })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-bold text-slate-900"
                />
              </div>
            </div>
            <button type="submit" className="bg-slate-900 text-white font-bold px-4 py-2.5 rounded-xl text-xs shadow hover:bg-slate-800 transition-colors">
              Submit Product SKU
            </button>
          </form>
        </div>
      )}

      {activeTab === "products" && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
          <h3 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3">Active Catalog</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {products.map((p) => (
              <div key={p.id} className="p-4 rounded-xl border border-slate-200 bg-slate-50 flex items-center gap-3">
                <img src={p.images[0]} alt={p.name} className="w-12 h-12 rounded-xl object-cover border border-slate-200" />
                <div>
                  <h4 className="font-bold text-slate-900 text-xs">{p.name}</h4>
                  <span className="text-[11px] text-slate-600 font-bold block">₹{p.price} • {p.stock} in stock</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === "overview" && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
          <h3 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3">Vendor Settlement & Commission Breakdown</h3>
          <p className="text-xs text-slate-600">Standard platform commission of 12% is automatically deducted prior to bi-weekly payout dispatch.</p>
        </div>
      )}
    </div>
  );
};
