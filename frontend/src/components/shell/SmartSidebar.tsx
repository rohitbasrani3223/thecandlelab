"use client";

import React, { useState, useEffect } from "react";
import { useStore } from "@/context/StoreContext";
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
  ChevronLeft,
  ChevronRight,
  Crown,
  Sparkles,
  Zap,
  CheckCircle2,
  Building,
  ShieldCheck
} from "lucide-react";

interface SmartSidebarProps {
  activeModule: string;
  setActiveModule: (mod: any) => void;
  isCollapsed: boolean;
  setIsCollapsed: (collapsed: boolean | ((prev: boolean) => boolean)) => void;
}

export const SmartSidebar: React.FC<SmartSidebarProps> = ({
  activeModule,
  setActiveModule,
  isCollapsed,
  setIsCollapsed
}) => {
  const { orders, products, sellers, supportTickets } = useStore();

  const pendingOrdersCount = orders.filter((o) => o.status === "Pending").length;
  const lowStockCount = products.filter((p) => p.stock <= 10).length;
  const pendingSellersCount = sellers.filter((s) => s.status === "PENDING").length;

  const sections = [
    {
      group: "Core Workspace",
      items: [
        { id: "overview", label: "Executive Dashboard", icon: LayoutDashboard, shortcut: "⌘1", badge: null },
        { id: "orders", label: "Orders & Shipping", icon: ShoppingBag, shortcut: "⌘2", badge: pendingOrdersCount },
        { id: "products", label: "Products Catalog CMS", icon: Package, shortcut: "⌘3", badge: lowStockCount },
        { id: "customers", label: "Customer CRM 360", icon: Users, shortcut: "⌘4", badge: null }
      ]
    },
    {
      group: "Operations & Commerce",
      items: [
        { id: "sellers", label: "Vendors & KYB Audit", icon: Store, shortcut: "⌘5", badge: pendingSellersCount },
        { id: "operations", label: "Warehouse Operations", icon: Truck, shortcut: "⌘6", badge: null },
        { id: "cms", label: "Storefront Studio CMS", icon: Layout, shortcut: "⌘7", badge: null },
        { id: "marketing", label: "Marketing Campaigns", icon: Send, shortcut: "⌘8", badge: null }
      ]
    },
    {
      group: "Governance & Intelligence",
      items: [
        { id: "analytics", label: "Analytics BI", icon: BarChart3, shortcut: "⌘9", badge: null },
        { id: "support", label: "Support & Helpdesk", icon: MessageSquare, shortcut: "⌘0", badge: 1 },
        { id: "settings", label: "System Governance", icon: Settings, shortcut: "⌘S", badge: null }
      ]
    }
  ];

  // Global Keyboard shortcuts ⌘1 - ⌘9
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && !e.shiftKey) {
        if (e.key === "b") {
          e.preventDefault();
          setIsCollapsed((prev) => !prev);
        }
        if (e.key === "1") { e.preventDefault(); setActiveModule("overview"); }
        if (e.key === "2") { e.preventDefault(); setActiveModule("orders"); }
        if (e.key === "3") { e.preventDefault(); setActiveModule("products"); }
        if (e.key === "4") { e.preventDefault(); setActiveModule("customers"); }
        if (e.key === "5") { e.preventDefault(); setActiveModule("sellers"); }
        if (e.key === "6") { e.preventDefault(); setActiveModule("operations"); }
        if (e.key === "7") { e.preventDefault(); setActiveModule("cms"); }
        if (e.key === "8") { e.preventDefault(); setActiveModule("marketing"); }
        if (e.key === "9") { e.preventDefault(); setActiveModule("analytics"); }
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [setActiveModule, setIsCollapsed]);

  return (
    <aside
      className={`bg-white border-r border-slate-200/80 flex flex-col justify-between shrink-0 transition-all duration-300 relative z-30 ${
        isCollapsed ? "w-20" : "w-64"
      } p-3.5 select-none`}
    >
      <div className="space-y-6">
        {/* Workspace Brand Box */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2.5 overflow-hidden">
            <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-slate-900 via-slate-800 to-indigo-900 text-white flex items-center justify-center font-bold text-sm shadow-md shrink-0">
              🕯️
            </div>
            {!isCollapsed && (
              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <h1 className="font-bold text-sm text-slate-900 tracking-tight truncate">The Candle Lab</h1>
                  <span className="bg-amber-100 text-amber-900 text-[9px] font-bold px-1.5 py-0.2 rounded font-mono">
                    PRO
                  </span>
                </div>
                <p className="text-[10px] text-slate-400 truncate">Atelier OS v3.4</p>
              </div>
            )}
          </div>

          <button
            onClick={() => setIsCollapsed((prev) => !prev)}
            className="p-1 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition-colors hidden md:block"
            title="Toggle Sidebar (⌘B)"
          >
            {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>

        {/* Grouped Navigation */}
        <nav className="space-y-5">
          {sections.map((sec, sIdx) => (
            <div key={sIdx} className="space-y-1">
              {!isCollapsed && (
                <span className="px-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1.5">
                  {sec.group}
                </span>
              )}
              {sec.items.map((item) => {
                const IconComp = item.icon;
                const isActive = activeModule === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveModule(item.id)}
                    title={isCollapsed ? item.label : undefined}
                    className={`w-full px-3 py-2.5 rounded-xl transition-all duration-150 flex items-center justify-between group relative ${
                      isActive
                        ? "bg-slate-900 text-white font-semibold shadow-xs"
                        : "text-slate-600 hover:bg-slate-100/80 hover:text-slate-900"
                    }`}
                  >
                    {/* Active Bar Indicator */}
                    {isActive && (
                      <span className="absolute left-0 top-2 bottom-2 w-1 bg-amber-400 rounded-r-full"></span>
                    )}

                    <div className="flex items-center gap-2.5 min-w-0">
                      <IconComp
                        className={`w-4 h-4 shrink-0 transition-transform group-hover:scale-110 ${
                          isActive ? "text-amber-400" : "text-slate-400"
                        }`}
                      />
                      {!isCollapsed && <span className="text-xs truncate">{item.label}</span>}
                    </div>

                    {!isCollapsed && (
                      <div className="flex items-center gap-1.5">
                        {item.badge !== null && item.badge > 0 && (
                          <span
                            className={`text-[10px] font-bold px-1.5 py-0.2 rounded-full ${
                              isActive ? "bg-amber-400 text-slate-950" : "bg-amber-100 text-amber-900 border border-amber-200"
                            }`}
                          >
                            {item.badge}
                          </span>
                        )}
                        <kbd
                          className={`text-[9px] font-mono px-1 rounded opacity-60 hidden group-hover:inline-block ${
                            isActive ? "bg-slate-800 text-slate-300" : "bg-slate-200 text-slate-600"
                          }`}
                        >
                          {item.shortcut}
                        </kbd>
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          ))}
        </nav>
      </div>

      {/* Footer Profile Box */}
      {!isCollapsed && (
        <div className="pt-3 border-t border-slate-100 space-y-2">
          <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2 min-w-0">
              <div className="w-7 h-7 rounded-full bg-slate-900 text-white font-bold flex items-center justify-center text-xs">
                AS
              </div>
              <div className="min-w-0">
                <p className="font-bold text-slate-900 truncate text-[11px]">Aarav Sharma</p>
                <p className="text-[10px] text-slate-400 truncate">HQ Master Admin</p>
              </div>
            </div>
            <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" title="System Online"></span>
          </div>
        </div>
      )}
    </aside>
  );
};
