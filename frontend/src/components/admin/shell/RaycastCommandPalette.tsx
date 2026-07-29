"use client";

import React, { useState, useEffect } from "react";
import { useStore } from "@/context/StoreContext";
import {
  Search,
  Package,
  ShoppingBag,
  Users,
  Store,
  Send,
  Truck,
  Settings,
  MessageSquare,
  BarChart3,
  Layout,
  X,
  ArrowRight,
  Command
} from "lucide-react";

interface RaycastCommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectModule: (module: string) => void;
}

export const RaycastCommandPalette: React.FC<RaycastCommandPaletteProps> = ({
  isOpen,
  onClose,
  onSelectModule
}) => {
  const { products, orders, customers, sellers } = useStore();
  const [query, setQuery] = useState("");

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const results = query.trim()
    ? [
        ...products
          .filter((p) => p.name.toLowerCase().includes(query.toLowerCase()) || (p.sku && p.sku.toLowerCase().includes(query.toLowerCase())))
          .map((p) => ({ type: "Product SKU", title: p.name, detail: `₹${p.price} • ${p.category} • SKU: ${p.sku || "N/A"}`, module: "products" })),
        ...orders
          .filter((o) => o.id.toLowerCase().includes(query.toLowerCase()) || o.customerName.toLowerCase().includes(query.toLowerCase()))
          .map((o) => ({ type: "Order Record", title: `${o.id} - ${o.customerName}`, detail: `₹${o.totalAmount} • Status: ${o.status}`, module: "orders" })),
        ...customers
          .filter((c) => c.name.toLowerCase().includes(query.toLowerCase()) || c.email.toLowerCase().includes(query.toLowerCase()))
          .map((c) => ({ type: "Customer CRM", title: c.name, detail: `${c.email} • Tier: ${c.loyaltyTier}`, module: "customers" })),
        ...sellers
          .filter((s) => s.storeName.toLowerCase().includes(query.toLowerCase()))
          .map((s) => ({ type: "Seller Store", title: s.storeName, detail: `${s.email} • KYB: ${s.status}`, module: "sellers" }))
      ]
    : [
        { type: "Quick Jump", title: "Executive Dashboard", detail: "Overview of revenue, sales & active metrics", module: "overview" },
        { type: "Quick Jump", title: "Orders & Shipping Table", detail: "Filter orders, print invoices & waybills", module: "orders" },
        { type: "Quick Jump", title: "Product Catalog CMS", detail: "Manage candle variants, barcodes & SEO", module: "products" },
        { type: "Quick Jump", title: "Customer CRM 360", detail: "Customer profiles, wallet balance & notes", module: "customers" },
        { type: "Quick Jump", title: "Warehouse Operations", detail: "Barcode scanner, packing station & stock", module: "operations" },
        { type: "Quick Jump", title: "System Governance Settings", detail: "Company profile, feature flags & DB backup", module: "settings" }
      ];

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/50 backdrop-blur-xs flex items-start justify-center pt-24 p-4 animate-fadeIn select-none">
      <div className="bg-white rounded-3xl max-w-2xl w-full p-4 shadow-2xl space-y-3 border border-slate-200 overflow-hidden">
        {/* Search Header Bar */}
        <div className="flex items-center gap-3 border-b border-slate-100 pb-3 px-2">
          <Search className="w-5 h-5 text-slate-400 shrink-0" />
          <input
            type="text"
            autoFocus
            placeholder="Type a command or search products, orders, customers..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full bg-transparent text-sm font-medium text-slate-900 focus:outline-none placeholder:text-slate-400"
          />
          <kbd onClick={onClose} className="text-[10px] font-mono text-slate-400 border border-slate-200 rounded px-2 py-0.5 cursor-pointer hover:bg-slate-100">
            ESC
          </kbd>
        </div>

        {/* Search Result Listing */}
        <div className="max-h-96 overflow-y-auto space-y-1 text-xs px-1">
          {results.map((res, idx) => (
            <div
              key={idx}
              onClick={() => {
                onSelectModule(res.module);
                onClose();
              }}
              className="p-3 rounded-2xl hover:bg-slate-100/90 cursor-pointer flex items-center justify-between group transition-colors border border-transparent hover:border-slate-200"
            >
              <div className="flex items-center gap-3 min-w-0">
                <span className="text-[10px] font-bold uppercase text-indigo-700 bg-indigo-50 border border-indigo-100 px-2 py-0.5 rounded-md shrink-0">
                  {res.type}
                </span>
                <span className="font-bold text-slate-900 truncate">{res.title}</span>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <span className="text-[11px] text-slate-500 font-mono hidden sm:inline">{res.detail}</span>
                <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-slate-900 group-hover:translate-x-0.5 transition-all" />
              </div>
            </div>
          ))}
        </div>

        {/* Footer shortcuts helper */}
        <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400 font-mono px-2">
          <span>Navigation: <strong className="text-slate-600">↑ ↓ Arrow Keys</strong></span>
          <span>Select: <strong className="text-slate-600">Enter↵</strong></span>
        </div>
      </div>
    </div>
  );
};
