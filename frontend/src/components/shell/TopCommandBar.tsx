"use client";

import React, { useState } from "react";
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
  Crown,
  Store,
  Truck,
  Sparkles,
  Zap,
  Globe,
  Database,
  Layers,
  ShieldCheck
} from "lucide-react";

interface TopCommandBarProps {
  onOpenCmdK: () => void;
  onToggleNotifications: () => void;
  onQuickAction: (action: string) => void;
}

export const TopCommandBar: React.FC<TopCommandBarProps> = ({
  onOpenCmdK,
  onToggleNotifications,
  onQuickAction
}) => {
  const { activeRole, setActiveRole, theme, toggleTheme, showToast } = useStore();
  const [workspace, setWorkspace] = useState("Headquarters Mumbai");
  const [isWorkspaceDropdownOpen, setIsWorkspaceDropdownOpen] = useState(false);
  const [isQuickMenuOpen, setIsQuickMenuOpen] = useState(false);

  const workspaces = [
    "Headquarters Mumbai",
    "Atelier Delhi Hub",
    "Boutique Retail Store",
    "International Logistics Hub"
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-200/80 px-4 lg:px-6 py-2.5 flex items-center justify-between shadow-2xs select-none">
      {/* Left: Workspace Switcher & Context Mode Switcher */}
      <div className="flex items-center gap-3">
        {/* Workspace Switcher */}
        <div className="relative">
          <button
            onClick={() => setIsWorkspaceDropdownOpen((prev) => !prev)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200/80 text-slate-900 text-xs font-bold transition-all border border-slate-200/80"
          >
            <Building2 className="w-3.5 h-3.5 text-indigo-600" />
            <span>{workspace}</span>
            <ChevronDown className="w-3 h-3 text-slate-400" />
          </button>

          {isWorkspaceDropdownOpen && (
            <div className="absolute top-full left-0 mt-1.5 w-56 bg-white rounded-2xl border border-slate-200 shadow-xl p-2 z-50 text-xs space-y-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-2 py-1 block">Switch Workspace</span>
              {workspaces.map((ws) => (
                <button
                  key={ws}
                  onClick={() => {
                    setWorkspace(ws);
                    setIsWorkspaceDropdownOpen(false);
                    showToast(`Switched workspace to ${ws} 🏢`);
                  }}
                  className={`w-full text-left px-2.5 py-1.5 rounded-xl transition-colors font-medium flex items-center justify-between ${
                    workspace === ws ? "bg-slate-900 text-white font-bold" : "text-slate-700 hover:bg-slate-100"
                  }`}
                >
                  <span>{ws}</span>
                  {workspace === ws && <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="hidden sm:block h-4 w-[1px] bg-slate-200"></div>

        {/* Role Context Switcher */}
        <div className="hidden md:flex items-center gap-1 bg-slate-100 p-1 rounded-xl text-[11px] font-semibold border border-slate-200/60">
          <button
            onClick={() => setActiveRole("admin")}
            className={`px-2.5 py-1 rounded-lg transition-all flex items-center gap-1 ${
              activeRole === "admin" ? "bg-white text-slate-900 shadow-2xs font-bold" : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <Crown className="w-3 h-3 text-amber-500" /> Master Admin
          </button>
          <button
            onClick={() => setActiveRole("seller")}
            className={`px-2.5 py-1 rounded-lg transition-all flex items-center gap-1 ${
              activeRole === "seller" ? "bg-white text-slate-900 shadow-2xs font-bold" : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <Store className="w-3 h-3 text-emerald-500" /> Seller Portal
          </button>
        </div>
      </div>

      {/* Center: Raycast Command Palette Trigger */}
      <div className="flex-1 max-w-md mx-4">
        <button
          onClick={onOpenCmdK}
          className="w-full bg-slate-100 hover:bg-slate-200/60 border border-slate-200 text-slate-500 rounded-xl px-3.5 py-1.5 text-xs font-medium flex items-center justify-between transition-colors shadow-2xs"
        >
          <span className="flex items-center gap-2">
            <Search className="w-3.5 h-3.5 text-slate-400" />
            <span>Search products, orders, CRM, sellers...</span>
          </span>
          <kbd className="bg-white text-slate-600 border border-slate-200 rounded px-1.5 py-0.2 text-[10px] font-mono shadow-2xs">
            ⌘K
          </kbd>
        </button>
      </div>

      {/* Right: Quick Action Menu, Notifications, Theme, Storefront */}
      <div className="flex items-center gap-2">
        {/* Quick Action Dropdown */}
        <div className="relative">
          <button
            onClick={() => setIsQuickMenuOpen((prev) => !prev)}
            className="bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold px-3 py-1.5 rounded-xl flex items-center gap-1 shadow transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Action</span>
            <ChevronDown className="w-3 h-3" />
          </button>

          {isQuickMenuOpen && (
            <div className="absolute top-full right-0 mt-1.5 w-48 bg-white rounded-2xl border border-slate-200 shadow-xl p-2 z-50 text-xs space-y-1">
              <button
                onClick={() => { onQuickAction("new-product"); setIsQuickMenuOpen(false); }}
                className="w-full text-left px-2.5 py-1.5 rounded-xl hover:bg-slate-100 font-medium text-slate-800 flex items-center gap-2"
              >
                <Plus className="w-3.5 h-3.5 text-indigo-600" /> New Product SKU
              </button>
              <button
                onClick={() => { onQuickAction("new-coupon"); setIsQuickMenuOpen(false); }}
                className="w-full text-left px-2.5 py-1.5 rounded-xl hover:bg-slate-100 font-medium text-slate-800 flex items-center gap-2"
              >
                <Zap className="w-3.5 h-3.5 text-amber-500" /> Create Coupon
              </button>
              <button
                onClick={() => { onQuickAction("db-backup"); setIsQuickMenuOpen(false); }}
                className="w-full text-left px-2.5 py-1.5 rounded-xl hover:bg-slate-100 font-medium text-slate-800 flex items-center gap-2"
              >
                <Database className="w-3.5 h-3.5 text-emerald-600" /> Trigger DB Backup
              </button>
            </div>
          )}
        </div>

        {/* Notifications Trigger */}
        <button
          onClick={onToggleNotifications}
          className="relative p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
          title="Notifications Stream"
        >
          <Bell className="w-4 h-4" />
          <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-rose-500 animate-ping"></span>
          <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-rose-500"></span>
        </button>

        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
          title="Toggle Theme Mode"
        >
          {theme === "dark" ? <Sun className="w-4 h-4 text-amber-500" /> : <Moon className="w-4 h-4 text-slate-600" />}
        </button>

        {/* Storefront Link */}
        <button
          onClick={() => setActiveRole("customer")}
          className="bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 text-xs font-bold px-3 py-1.5 rounded-xl flex items-center gap-1 transition-colors"
        >
          <ExternalLink className="w-3.5 h-3.5" />
          <span className="hidden lg:inline">Storefront</span>
        </button>
      </div>
    </header>
  );
};
