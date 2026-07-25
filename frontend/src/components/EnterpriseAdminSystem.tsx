"use client";

import React, { useState, useEffect } from "react";
import { useStore } from "@/context/StoreContext";
import { AdminOverviewModule } from "@/components/modules/AdminOverviewModule";
import { OrderManagementModule } from "@/components/modules/OrderManagementModule";
import { ProductManagementModule } from "@/components/modules/ProductManagementModule";
import { CustomerCRMModule } from "@/components/modules/CustomerCRMModule";
import { SellerManagementModule } from "@/components/modules/SellerManagementModule";
import { CMSBuilderModule } from "@/components/modules/CMSBuilderModule";
import { MarketingModule } from "@/components/modules/MarketingModule";
import { AnalyticsHubModule } from "@/components/modules/AnalyticsHubModule";
import { OperationsModule } from "@/components/modules/OperationsModule";
import { SystemSettingsModule } from "@/components/modules/SystemSettingsModule";
import { SupportLiveChatModule } from "@/components/modules/SupportLiveChatModule";

import {
  LayoutDashboard,
  ShoppingBag,
  Package,
  Users,
  Store,
  Layout,
  Send,
  BarChart3,
  Truck,
  Settings,
  MessageSquare,
  Search,
  Bell,
  Command,
  Plus,
  ChevronDown,
  Sparkles,
  Sun,
  Moon,
  ExternalLink,
  X,
  Printer,
  Barcode,
  CheckCircle2,
  AlertCircle,
  Clock,
  Layers,
  Crown
} from "lucide-react";

interface EnterpriseAdminSystemProps {
  onOpenCollectionsModal?: () => void;
}

export const EnterpriseAdminSystem: React.FC<EnterpriseAdminSystemProps> = ({ onOpenCollectionsModal }) => {
  const { activeRole, setActiveRole, theme, toggleTheme, products, orders, customers, sellers, showToast } = useStore();
  const [activeModule, setActiveModule] = useState<
    "overview" | "orders" | "products" | "customers" | "sellers" | "cms" | "marketing" | "analytics" | "operations" | "settings" | "support"
  >("overview");

  // Modals / Drawers State
  const [isCmdKOpen, setIsCmdKOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [cmdSearchQuery, setCmdSearchQuery] = useState("");

  // Keyboard shortcut for Cmd/Ctrl + K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setIsCmdKOpen((prev) => !prev);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const navItems = [
    { id: "overview", label: "Dashboard Overview", icon: LayoutDashboard, badge: null },
    { id: "orders", label: "Orders & Shipping", icon: ShoppingBag, badge: orders.filter((o) => o.status === "Pending").length },
    { id: "products", label: "Product CMS & Catalog", icon: Package, badge: products.filter((p) => p.stock <= 10).length },
    { id: "customers", label: "Customers CRM", icon: Users, badge: null },
    { id: "sellers", label: "Sellers & Vendors", icon: Store, badge: sellers.filter((s) => s.status === "PENDING").length },
    { id: "cms", label: "Storefront CMS Builder", icon: Layout, badge: null },
    { id: "marketing", label: "Marketing & Coupons", icon: Send, badge: null },
    { id: "analytics", label: "Analytics & Insights", icon: BarChart3, badge: null },
    { id: "operations", label: "Warehouse Operations", icon: Truck, badge: null },
    { id: "support", label: "Support & Live Chat", icon: MessageSquare, badge: 1 },
    { id: "settings", label: "System Settings", icon: Settings, badge: null }
  ];

  // Cmd+K Search Filter Results
  const filteredCmdResults = cmdSearchQuery.trim()
    ? [
        ...products
          .filter((p) => p.name.toLowerCase().includes(cmdSearchQuery.toLowerCase()))
          .map((p) => ({ type: "Product", title: p.name, sub: `₹${p.price} • ${p.category}`, module: "products" as const })),
        ...orders
          .filter((o) => o.id.toLowerCase().includes(cmdSearchQuery.toLowerCase()) || o.customerName.toLowerCase().includes(cmdSearchQuery.toLowerCase()))
          .map((o) => ({ type: "Order", title: `${o.id} - ${o.customerName}`, sub: `₹${o.totalAmount} • ${o.status}`, module: "orders" as const })),
        ...customers
          .filter((c) => c.name.toLowerCase().includes(cmdSearchQuery.toLowerCase()) || c.email.toLowerCase().includes(cmdSearchQuery.toLowerCase()))
          .map((c) => ({ type: "Customer", title: c.name, sub: `${c.email} • ${c.loyaltyTier}`, module: "customers" as const }))
      ]
    : [];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans flex flex-col antialiased">
      {/* Global Top Navbar */}
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-200 px-4 lg:px-8 py-3 flex items-center justify-between shadow-xs">
        {/* Left: Brand Logo & Workspace Switcher */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2.5 cursor-pointer">
            <div className="w-9 h-9 rounded-xl bg-slate-900 text-white flex items-center justify-center font-bold text-sm shadow-md">
              🕯️
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-sm text-slate-900 tracking-tight">The Candle Lab</span>
                <span className="bg-amber-100 text-amber-900 text-[10px] font-bold px-1.5 py-0.2 rounded font-mono">
                  ENTERPRISE
                </span>
              </div>
              <p className="text-[11px] text-slate-500">Atelier Headquarters</p>
            </div>
          </div>

          <div className="hidden md:block h-5 w-[1px] bg-slate-200"></div>

          {/* Mode Context Switcher */}
          <div className="hidden sm:flex items-center gap-1 bg-slate-100 p-1 rounded-xl text-xs font-semibold">
            <button
              onClick={() => setActiveRole("admin")}
              className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
                activeRole === "admin" ? "bg-white text-slate-900 shadow-xs font-bold" : "text-slate-600 hover:text-slate-900"
              }`}
            >
              👑 Admin Master
            </button>
            <button
              onClick={() => setActiveRole("seller")}
              className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
                activeRole === "seller" ? "bg-white text-slate-900 shadow-xs font-bold" : "text-slate-600 hover:text-slate-900"
              }`}
            >
              🏪 Seller Portal
            </button>
            <button
              onClick={() => {
                setActiveRole("admin");
                setActiveModule("operations");
              }}
              className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
                activeRole === "admin" && activeModule === "operations" ? "bg-white text-slate-900 shadow-xs font-bold" : "text-slate-600 hover:text-slate-900"
              }`}
            >
              🚚 Warehouse Ops
            </button>
          </div>
        </div>

        {/* Center: Cmd+K Global Search Trigger */}
        <div className="hidden lg:flex items-center flex-1 max-w-md mx-8">
          <button
            onClick={() => setIsCmdKOpen(true)}
            className="w-full bg-slate-100 hover:bg-slate-200/70 border border-slate-200 text-slate-500 rounded-xl px-3.5 py-2 text-xs font-medium flex items-center justify-between transition-colors shadow-xs"
          >
            <span className="flex items-center gap-2">
              <Search className="w-3.5 h-3.5 text-slate-400" />
              Search products, orders, customers, sellers...
            </span>
            <kbd className="bg-white text-slate-600 border border-slate-200 rounded px-1.5 py-0.5 text-[10px] font-mono shadow-2xs">
              ⌘K
            </kbd>
          </button>
        </div>

        {/* Right: Actions, Notifications & Profile */}
        <div className="flex items-center gap-3">
          {/* Quick Action Button */}
          <button
            onClick={() => {
              setActiveModule("products");
              showToast("Redirected to Add Product 🛍️");
            }}
            className="hidden sm:flex bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold px-3.5 py-2 rounded-xl items-center gap-1.5 shadow transition-colors"
          >
            <Plus className="w-3.5 h-3.5" /> New Product
          </button>

          {/* Notifications Drawer Trigger */}
          <button
            onClick={() => setIsNotificationsOpen((prev) => !prev)}
            className="relative p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
            title="Notifications"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-rose-500 animate-ping"></span>
            <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-rose-500"></span>
          </button>

          {/* Theme Switcher */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
            title="Toggle Light/Dark Theme"
          >
            {theme === "dark" ? <Sun className="w-4 h-4 text-amber-500" /> : <Moon className="w-4 h-4 text-slate-600" />}
          </button>

          {/* Back to Customer Storefront button */}
          <button
            onClick={() => setActiveRole("customer")}
            className="bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 text-xs font-bold px-3 py-2 rounded-xl flex items-center gap-1.5 transition-colors"
          >
            <ExternalLink className="w-3.5 h-3.5" /> Storefront
          </button>
        </div>
      </header>

      {/* Main Body Shell */}
      <div className="flex-1 flex overflow-hidden max-w-[1600px] w-full mx-auto">
        {/* Sidebar Navigation (Inspired by Linear / Stripe) */}
        <aside className="w-64 bg-white border-r border-slate-200 flex flex-col justify-between shrink-0 hidden md:flex p-4">
          <div className="space-y-6">
            {/* Context Header Badge */}
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Context Mode</span>
                <span className="text-xs font-bold text-slate-900 flex items-center gap-1 mt-0.5">
                  <Crown className="w-3.5 h-3.5 text-amber-500" /> Enterprise Admin
                </span>
              </div>
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            </div>

            {/* Nav Menu */}
            <nav className="space-y-1 text-xs font-medium">
              <span className="px-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-2">Platform Management</span>
              {navItems.map((item) => {
                const IconComp = item.icon;
                const isActive = activeModule === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveModule(item.id as any)}
                    className={`w-full px-3 py-2.5 rounded-xl transition-all flex items-center justify-between ${
                      isActive
                        ? "bg-slate-900 text-white font-semibold shadow-xs"
                        : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <IconComp className={`w-4 h-4 ${isActive ? "text-white" : "text-slate-400"}`} />
                      <span>{item.label}</span>
                    </div>
                    {item.badge !== null && item.badge > 0 && (
                      <span
                        className={`text-[10px] font-bold px-1.5 py-0.2 rounded-full ${
                          isActive ? "bg-amber-400 text-slate-950" : "bg-slate-200 text-slate-700"
                        }`}
                      >
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Footer Info Box */}
          <div className="pt-4 border-t border-slate-100 text-[11px] text-slate-400 space-y-1">
            <div className="flex justify-between">
              <span>System Version:</span>
              <span className="font-mono font-bold text-slate-700">v3.4.0 Enterprise</span>
            </div>
            <div className="flex justify-between">
              <span>DB Connection:</span>
              <span className="text-emerald-600 font-bold">Healthy (2ms)</span>
            </div>
          </div>
        </aside>

        {/* Main Workspace Area */}
        <main className="flex-1 overflow-y-auto p-4 lg:p-8 space-y-8">
          {activeModule === "overview" && <AdminOverviewModule />}
          {activeModule === "orders" && <OrderManagementModule />}
          {activeModule === "products" && <ProductManagementModule />}
          {activeModule === "customers" && <CustomerCRMModule />}
          {activeModule === "sellers" && <SellerManagementModule />}
          {activeModule === "cms" && <CMSBuilderModule />}
          {activeModule === "marketing" && <MarketingModule />}
          {activeModule === "analytics" && <AnalyticsHubModule />}
          {activeModule === "operations" && <OperationsModule />}
          {activeModule === "settings" && <SystemSettingsModule />}
          {activeModule === "support" && <SupportLiveChatModule />}
        </main>
      </div>

      {/* Cmd+K Global Search Modal */}
      {isCmdKOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-start justify-center pt-20 p-4">
          <div className="bg-white rounded-2xl max-w-xl w-full p-4 shadow-2xl space-y-4 border border-slate-200">
            <div className="flex items-center gap-3 border-b border-slate-100 pb-3">
              <Search className="w-5 h-5 text-slate-400" />
              <input
                type="text"
                autoFocus
                placeholder="Type to search products, orders, customers..."
                value={cmdSearchQuery}
                onChange={(e) => setCmdSearchQuery(e.target.value)}
                className="w-full bg-transparent text-sm font-medium text-slate-900 focus:outline-none"
              />
              <button onClick={() => setIsCmdKOpen(false)} className="text-slate-400 hover:text-slate-600 text-xs font-mono border px-1.5 py-0.5 rounded">
                ESC
              </button>
            </div>

            <div className="max-h-80 overflow-y-auto space-y-2 text-xs">
              {filteredCmdResults.length === 0 ? (
                <p className="text-slate-400 text-center py-6">
                  {cmdSearchQuery.trim() ? "No results matching search query." : "Type a query to search across products, orders & CRM."}
                </p>
              ) : (
                filteredCmdResults.map((res, idx) => (
                  <div
                    key={idx}
                    onClick={() => {
                      setActiveModule(res.module);
                      setIsCmdKOpen(false);
                    }}
                    className="p-3 rounded-xl hover:bg-slate-100 cursor-pointer flex items-center justify-between border border-transparent hover:border-slate-200 transition-colors"
                  >
                    <div>
                      <span className="text-[10px] font-bold uppercase text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded mr-2">
                        {res.type}
                      </span>
                      <span className="font-bold text-slate-900">{res.title}</span>
                    </div>
                    <span className="text-slate-500 font-mono text-[11px]">{res.sub}</span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* Notifications Drawer */}
      {isNotificationsOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/30 backdrop-blur-xs flex justify-end">
          <div className="w-full max-w-sm bg-white h-full shadow-2xl p-6 space-y-4 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <Bell className="w-4 h-4 text-indigo-600" /> Notifications & Audit Stream
                </h3>
                <button onClick={() => setIsNotificationsOpen(false)} className="text-slate-400 hover:text-slate-600">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-3 text-xs">
                <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 space-y-1">
                  <div className="font-bold flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" /> New High-Value Order #ORD-94821
                  </div>
                  <p className="text-[11px]">Aarav Sharma placed an order for ₹1,798.</p>
                  <span className="text-[9px] text-emerald-700 font-mono">2 mins ago</span>
                </div>

                <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 space-y-1">
                  <div className="font-bold flex items-center gap-1.5">
                    <AlertCircle className="w-4 h-4 text-amber-600" /> Low Stock Alert
                  </div>
                  <p className="text-[11px]">Madagascar Vanilla has 4 units remaining.</p>
                  <span className="text-[9px] text-amber-700 font-mono">32 mins ago</span>
                </div>

                <div className="p-3 rounded-xl bg-indigo-50 border border-indigo-200 text-indigo-900 space-y-1">
                  <div className="font-bold flex items-center gap-1.5">
                    <Clock className="w-4 h-4 text-indigo-600" /> Seller Verification Pending
                  </div>
                  <p className="text-[11px]">Botanical Aromas India submitted GST documentation.</p>
                  <span className="text-[9px] text-indigo-700 font-mono">1 hour ago</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => setIsNotificationsOpen(false)}
              className="w-full bg-slate-100 hover:bg-slate-200 text-slate-800 py-2 rounded-xl text-xs font-bold transition-colors text-center"
            >
              Close Stream
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
