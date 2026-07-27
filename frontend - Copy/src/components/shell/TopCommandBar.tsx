"use client";

import React, { useState, useRef, useEffect } from "react";
import { useStore } from "@/context/StoreContext";
import {
  Search,
  Bell,
  Sun,
  Moon,
  ExternalLink,
  Plus,
  ChevronDown,
  Building2,
  Package,
  Zap,
  Database,
  RefreshCw,
  X
} from "lucide-react";

interface TopCommandBarProps {
  onOpenCmdK: () => void;
  onToggleNotifications: () => void;
  onQuickAction: (action: string) => void;
}

export const TopCommandBar: React.FC<TopCommandBarProps> = ({
  onOpenCmdK,
  onToggleNotifications,
  onQuickAction,
}) => {
  const { theme, toggleTheme, showToast } = useStore();
  const [isQuickOpen, setIsQuickOpen] = useState(false);
  const quickRef = useRef<HTMLDivElement>(null);

  // Close dropdowns on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (quickRef.current && !quickRef.current.contains(e.target as Node)) setIsQuickOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <header
      style={{ fontFamily: "Inter, system-ui, sans-serif" }}
      className="sticky top-0 z-40 bg-white border-b border-[#E2E8F0] h-[52px] px-4 lg:px-6 flex items-center justify-between shadow-[0_1px_3px_rgba(15,23,42,0.06)] select-none"
    >
      {/* ── Left: Store Brand & Live Status ── */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          <span className="font-bold text-[13px] text-[#0F172A] tracking-tight">The Candle Lab</span>
          <span className="bg-[#EFF6FF] text-[#2563EB] border border-[#BFDBFE] text-[10px] font-bold px-2 py-0.5 rounded-full font-mono">
            V2.0 ADMIN
          </span>
        </div>

        {/* Divider */}
        <div className="hidden sm:block h-5 w-px bg-[#E2E8F0]" />

        {/* Environment Badge */}
        <span className="hidden md:flex items-center gap-1.5 text-[11px] font-semibold text-[#16A34A] bg-[#F0FDF4] border border-[#BBF7D0] px-2.5 py-0.5 rounded-full">
          <span className="w-1.5 h-1.5 rounded-full bg-[#16A34A] animate-pulse" />
          Live Storefront Connected
        </span>
      </div>

      {/* ── Center: Command Search ── */}
      <div className="flex-1 max-w-sm mx-4">
        <button
          onClick={onOpenCmdK}
          className="w-full flex items-center justify-between bg-[#F8FAFC] hover:bg-[#F1F5F9] border border-[#E2E8F0] rounded-xl px-3.5 py-[7px] text-[12px] text-[#94A3B8] transition-colors shadow-[0_1px_2px_rgba(15,23,42,0.04)]"
        >
          <span className="flex items-center gap-2">
            <Search className="w-3.5 h-3.5 text-[#94A3B8]" />
            <span>Search orders, products, customers...</span>
          </span>
          <kbd className="bg-white border border-[#E2E8F0] text-[#94A3B8] rounded-md px-1.5 py-0.5 text-[10px] font-mono shadow-[0_1px_2px_rgba(15,23,42,0.06)]">
            ⌘K
          </kbd>
        </button>
      </div>

      {/* ── Right: Actions ── */}
      <div className="flex items-center gap-2">

        {/* Quick Action button */}
        <div ref={quickRef} className="relative">
          <button
            onClick={() => setIsQuickOpen((p) => !p)}
            className="flex items-center gap-1.5 bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-[12px] font-semibold px-3 py-1.5 rounded-lg transition-colors shadow-sm"
          >
            <Plus className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">New</span>
            <ChevronDown className={`w-3 h-3 opacity-70 transition-transform ${isQuickOpen ? "rotate-180" : ""}`} />
          </button>

          {isQuickOpen && (
            <div className="absolute top-full right-0 mt-1.5 w-48 bg-white rounded-xl border border-[#E2E8F0] shadow-[0_4px_16px_rgba(15,23,42,0.12)] p-1.5 z-50">
              {[
                { label: "New Product SKU", icon: Package, color: "text-[#6366F1]", action: "new-product" },
                { label: "Create Coupon", icon: Zap, color: "text-[#F59E0B]", action: "new-coupon" },
                { label: "Trigger DB Backup", icon: Database, color: "text-[#10B981]", action: "db-backup" },
              ].map((item) => (
                <button
                  key={item.action}
                  onClick={() => { onQuickAction(item.action); setIsQuickOpen(false); }}
                  className="w-full text-left px-2.5 py-2 rounded-lg hover:bg-[#F8FAFC] text-[12px] font-medium text-[#475569] hover:text-[#0F172A] flex items-center gap-2.5 transition-colors"
                >
                  <item.icon className={`w-3.5 h-3.5 ${item.color}`} />
                  {item.label}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Notifications */}
        <button
          onClick={onToggleNotifications}
          title="Notifications"
          className="relative p-2 rounded-lg bg-[#F8FAFC] hover:bg-[#F1F5F9] border border-[#E2E8F0] text-[#475569] transition-colors"
        >
          <Bell className="w-4 h-4" />
          <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-[#EF4444]" />
        </button>

        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          title="Toggle theme"
          className="p-2 rounded-lg bg-[#F8FAFC] hover:bg-[#F1F5F9] border border-[#E2E8F0] text-[#475569] transition-colors"
        >
          {theme === "dark" ? <Sun className="w-4 h-4 text-[#F59E0B]" /> : <Moon className="w-4 h-4" />}
        </button>

        {/* View Storefront */}
        <a
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          className="hidden lg:flex items-center gap-1.5 text-[12px] font-semibold text-[#475569] hover:text-[#0F172A] bg-[#F8FAFC] hover:bg-[#F1F5F9] border border-[#E2E8F0] px-3 py-1.5 rounded-lg transition-colors"
        >
          <ExternalLink className="w-3.5 h-3.5" />
          Storefront
        </a>
      </div>
    </header>
  );
};
