"use client";

import React, { useState, useEffect } from "react";
import { useStore } from "@/context/StoreContext";
import { AdminCMSPanel } from "@/components/AdminCMSPanel";
import { OperationsPanel } from "@/components/OperationsPanel";
import { POSBillingModal } from "@/components/POSBillingModal";
import { PluginStoreModal } from "@/components/PluginStoreModal";
import { EmptyState } from "@/components/EmptyState";
import {
  Crown,
  Users,
  Store,
  Layers,
  DollarSign,
  TrendingUp,
  Sliders,
  Truck,
  Plug,
  Printer,
  Package,
  ShoppingBag,
  Sparkles
} from "lucide-react";

interface AdminDashboardProps {
  onOpenCollectionsModal: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onOpenCollectionsModal }) => {
  const { collections, products, orders, currency } = useStore();
  const [adminTab, setAdminTab] = useState<"overview" | "cms" | "operations">("overview");

  const [isPosOpen, setIsPosOpen] = useState(false);
  const [isPluginStoreOpen, setIsPluginStoreOpen] = useState(false);

  const [analytics, setAnalytics] = useState<{
    total_revenue: number;
    today_revenue: number;
    total_orders: number;
    pending_orders: number;
    total_customers: number;
    total_sellers: number;
    total_products: number;
    low_stock_products: number;
    total_collections: number;
  }>({
    total_revenue: 0,
    today_revenue: 0,
    total_orders: 0,
    pending_orders: 0,
    total_customers: 0,
    total_sellers: 0,
    total_products: products.length,
    low_stock_products: 0,
    total_collections: collections.length,
  });

  useEffect(() => {
    async function fetchAnalytics() {
      try {
        const res = await fetch("/api/v1/admin/analytics/");
        if (res.ok) {
          const data = await res.json();
          setAnalytics(data);
        }
      } catch (err) {
        console.error("Failed to load analytics from Supabase API", err);
      }
    }
    fetchAnalytics();
  }, []);

  const [sellers, setSellers] = useState([
    { id: "s-1", name: "The Candle Lab Atelier", email: "atelier@candlelab.com", status: "VERIFIED", sales: "₹1,42,850" },
    { id: "s-2", name: "Artisan Wax Crafters", email: "artisan@wax.com", status: "VERIFIED", sales: "₹89,200" },
    { id: "s-3", name: "Botanical Aromas India", email: "botanical@aromas.in", status: "PENDING", sales: "₹0" }
  ]);

  const approveSeller = (id: string) => {
    setSellers((prev) =>
      prev.map((s) => (s.id === id ? { ...s, status: "VERIFIED" } : s))
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-4 lg:px-8 py-8 space-y-6">
      
      {/* Admin Executive Header */}
      <div className="bg-gradient-to-r from-brand-charcoal to-black text-brand-beige p-6 rounded-2xl border-2 border-brand-gold shadow-2xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <span className="text-xs font-bold text-brand-gold uppercase tracking-widest flex items-center gap-1.5">
            <Crown className="w-4 h-4 text-brand-gold" /> ENTERPRISE SAAS MASTER PLATFORM (V5.5 LIVE DB)
          </span>
          <h1 className="font-serif text-2xl md:text-3xl font-bold text-white mt-1">
            Admin Master Governance Dashboard
          </h1>
        </div>

        <div className="flex gap-2 flex-wrap">
          <button
            onClick={() => setIsPosOpen(true)}
            className="bg-white text-brand-charcoal px-3.5 py-2 rounded-xl text-xs font-bold hover:bg-brand-gold transition-colors flex items-center gap-1.5 shadow"
          >
            <Printer className="w-3.5 h-3.5 text-brand-gold" /> Boutique POS Billing
          </button>

          <button
            onClick={() => setIsPluginStoreOpen(true)}
            className="bg-brand-gold text-brand-charcoal px-3.5 py-2 rounded-xl text-xs font-bold hover:bg-brand-goldLight transition-colors flex items-center gap-1.5 shadow"
          >
            <Plug className="w-3.5 h-3.5" /> Plugin Store
          </button>

          <button
            onClick={onOpenCollectionsModal}
            className="bg-white/10 text-brand-beige border border-brand-beige/40 px-3.5 py-2 rounded-xl text-xs font-bold hover:bg-white/20 transition-colors flex items-center gap-1.5"
          >
            <Layers className="w-3.5 h-3.5" /> Collections
          </button>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex border-b border-brand-beige gap-6 text-xs font-serif font-bold">
        <button
          onClick={() => setAdminTab("overview")}
          className={`pb-2.5 ${adminTab === "overview" ? "border-b-2 border-brand-gold text-brand-charcoal" : "text-brand-earth"}`}
        >
          Executive Overview
        </button>
        <button
          onClick={() => setAdminTab("cms")}
          className={`pb-2.5 ${adminTab === "cms" ? "border-b-2 border-brand-gold text-brand-charcoal" : "text-brand-earth"}`}
        >
          🖥️ No-Code CMS Engine
        </button>
        <button
          onClick={() => setAdminTab("operations")}
          className={`pb-2.5 ${adminTab === "operations" ? "border-b-2 border-brand-gold text-brand-charcoal" : "text-brand-earth"}`}
        >
          📦 Warehouse & Shipping Ops
        </button>
      </div>

      {/* Overview Tab */}
      {adminTab === "overview" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div className="bg-white p-5 rounded-2xl border border-brand-beige shadow-sm">
              <span className="text-xs text-brand-earth uppercase font-bold tracking-wider">Gross Platform GMV</span>
              <p className="font-serif text-2xl font-bold text-brand-charcoal">
                {currency}{analytics.total_revenue > 0 ? analytics.total_revenue.toLocaleString() : "0"}
              </p>
              <span className="text-[11px] text-green-700 font-bold flex items-center gap-1">
                <TrendingUp className="w-3 h-3" /> Real SQL Query Data
              </span>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-brand-beige shadow-sm">
              <span className="text-xs text-brand-earth uppercase font-bold tracking-wider">Total Active Users</span>
              <p className="font-serif text-2xl font-bold text-brand-charcoal">{analytics.total_customers} Customers</p>
              <span className="text-[11px] text-brand-earth">Registered Accounts</span>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-brand-beige shadow-sm">
              <span className="text-xs text-brand-earth uppercase font-bold tracking-wider">Active Products SKU</span>
              <p className="font-serif text-2xl font-bold text-brand-charcoal">{products.length} SKUs</p>
              <span className="text-[11px] text-amber-700 font-bold">{analytics.low_stock_products} Low Stock</span>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-brand-beige shadow-sm">
              <span className="text-xs text-brand-earth uppercase font-bold tracking-wider">Active Collections</span>
              <p className="font-serif text-2xl font-bold text-brand-gold">{collections.length} Categories</p>
              <span className="text-[11px] text-green-700 font-bold">Synchronized Live DB</span>
            </div>
          </div>

          {/* Seller Governance Table or Empty State */}
          <div className="bg-white rounded-2xl border border-brand-beige p-6 space-y-4 shadow-sm">
            <div className="flex justify-between items-center border-b border-brand-beige pb-3">
              <h3 className="font-serif text-sm font-bold text-brand-charcoal flex items-center gap-2">
                <Store className="w-4 h-4 text-brand-gold" /> Seller Governance & Approvals
              </h3>
            </div>

            {sellers.length === 0 ? (
              <EmptyState
                icon={<Store className="w-6 h-6 text-brand-gold" />}
                title="No Seller Applications"
                description="There are currently no seller applications in the verification queue."
                actionLabel="Invite Seller"
                onAction={() => alert("Invite link copied to clipboard!")}
              />
            ) : (
              <table className="w-full text-xs text-left text-brand-charcoal">
                <thead className="bg-brand-surface font-serif uppercase tracking-wider text-[10px] border-b border-brand-beige">
                  <tr>
                    <th className="p-3">Seller Name</th>
                    <th className="p-3">Email</th>
                    <th className="p-3">Total Sales</th>
                    <th className="p-3">Status</th>
                    <th className="p-3">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-brand-beige">
                  {sellers.map((s) => (
                    <tr key={s.id} className="hover:bg-brand-beige/30">
                      <td className="p-3 font-bold">{s.name}</td>
                      <td className="p-3 text-gray-500">{s.email}</td>
                      <td className="p-3 font-mono font-bold">{s.sales}</td>
                      <td className="p-3">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${s.status === "VERIFIED" ? "bg-green-100 text-green-800" : "bg-amber-100 text-amber-800"}`}>
                          {s.status}
                        </span>
                      </td>
                      <td className="p-3">
                        {s.status === "PENDING" && (
                          <button
                            onClick={() => approveSeller(s.id)}
                            className="bg-brand-gold text-brand-charcoal px-3 py-1 rounded text-xs font-bold hover:bg-brand-goldLight"
                          >
                            Approve Seller
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      )}

      {/* CMS Tab */}
      {adminTab === "cms" && <AdminCMSPanel />}

      {/* Operations Tab */}
      {adminTab === "operations" && <OperationsPanel />}

      {/* Modals */}
      <POSBillingModal isOpen={isPosOpen} onClose={() => setIsPosOpen(false)} />
      <PluginStoreModal isOpen={isPluginStoreOpen} onClose={() => setIsPluginStoreOpen(false)} />

    </div>
  );
};
