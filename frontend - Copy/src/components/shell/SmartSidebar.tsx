"use client";

import React, { useEffect } from "react";
import { useStore } from "@/context/StoreContext";
import {
  LayoutDashboard,
  ShoppingBag,
  Package,
  FolderTree,
  Sparkles,
  Users,
  Tag,
  Zap,
  Image as ImageIcon,
  Star,
  Layout,
  BarChart3,
  Settings,
  AlertTriangle,
  ChevronLeft,
  ChevronRight,
  PanelLeftClose,
  PanelLeftOpen,
  Crown
} from "lucide-react";

interface SmartSidebarProps {
  activeModule: string;
  setActiveModule: (mod: string) => void;
  isCollapsed: boolean;
  setIsCollapsed: (collapsed: boolean | ((prev: boolean) => boolean)) => void;
}

const sections = [
  {
    group: "Catalog & Store",
    items: [
      { id: "overview",   label: "Dashboard",        icon: LayoutDashboard, shortcut: "⌘1" },
      { id: "products",   label: "Products Catalog",  icon: Package,         shortcut: "⌘2" },
      { id: "categories", label: "Categories",       icon: FolderTree,      shortcut: "⌘3" },
      { id: "collections",label: "Collections",      icon: Sparkles,        shortcut: "⌘4" },
      { id: "orders",     label: "Orders & Shipping",icon: ShoppingBag,     shortcut: "⌘5" },
      { id: "customers",  label: "Customer CRM",     icon: Users,           shortcut: "⌘6" },
    ],
  },
  {
    group: "Marketing & CMS",
    items: [
      { id: "coupons",    label: "Coupons & Discounts", icon: Tag,          shortcut: "⌘7" },
      { id: "offers",     label: "Offers & Flash Sales",icon: Zap,          shortcut: "⌘8" },
      { id: "banners",    label: "Banners & Media",     icon: ImageIcon,    shortcut: "⌘9" },
      { id: "reviews",    label: "Reviews & Ratings",   icon: Star,         shortcut: "⌘0" },
      { id: "cms",        label: "CMS & Storefront",    icon: Layout,       shortcut: "⌘M" },
    ],
  },
  {
    group: "Enterprise & Setup",
    items: [
      { id: "reports",    label: "Reports & Analytics", icon: BarChart3,    shortcut: "⌘R" },
      { id: "settings",   label: "Store Settings",      icon: Settings,     shortcut: "⌘S" },
      { id: "alerts",     label: "Alerts & Audit Logs",  icon: AlertTriangle,shortcut: "⌘A" },
    ],
  },
];

export const SmartSidebar: React.FC<SmartSidebarProps> = ({
  activeModule,
  setActiveModule,
  isCollapsed,
  setIsCollapsed,
}) => {
  const { orders, products } = useStore();

  const pendingOrdersCount = orders.filter((o) => o.status === "Pending").length;
  const lowStockCount = products.filter((p) => p.stock <= 10).length;

  const getBadge = (id: string): number | null => {
    if (id === "orders") return pendingOrdersCount || null;
    if (id === "products") return lowStockCount || null;
    return null;
  };

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (!(e.metaKey || e.ctrlKey) || e.shiftKey) return;
      if (e.key === "b") {
        e.preventDefault();
        setIsCollapsed((p) => !p);
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [setIsCollapsed]);

  return (
    <aside
      style={{ fontFamily: "Inter, system-ui, sans-serif" }}
      className={`
        bg-[#18181B] text-[#F4F4F5] flex flex-col justify-between shrink-0
        transition-all duration-300 ease-in-out relative z-30 h-screen sticky top-0 border-r border-[#27272A]
        ${isCollapsed ? "w-[72px]" : "w-[250px]"}
      `}
    >
      {/* Brand Header */}
      <div>
        <div className={`flex items-center justify-between h-[60px] border-b border-[#27272A] ${isCollapsed ? "px-4" : "px-5"}`}>
          <div className="flex items-center gap-3 min-w-0 overflow-hidden">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#C8A75A] to-[#B89648] flex items-center justify-center text-[#1F1F1F] font-bold text-sm shrink-0 shadow-md">
              🕯️
            </div>
            {!isCollapsed && (
              <div className="min-w-0">
                <p className="text-[#F4F4F5] text-xs font-serif font-bold tracking-wide truncate leading-tight">
                  THE CANDLE LAB
                </p>
                <p className="text-[#C8A75A] text-[9px] font-bold tracking-widest uppercase truncate mt-0.5">
                  ATELIER ENTERPRISE
                </p>
              </div>
            )}
          </div>
          <button
            onClick={() => setIsCollapsed((p) => !p)}
            title="Toggle sidebar (⌘B)"
            className="p-1.5 rounded-lg text-[#A1A1AA] hover:text-white hover:bg-[#27272A] transition-colors hidden md:flex shrink-0"
          >
            {isCollapsed ? <PanelLeftOpen className="w-4 h-4" /> : <PanelLeftClose className="w-4 h-4" />}
          </button>
        </div>

        {/* Navigation */}
        <nav className="p-3 space-y-5 overflow-y-auto max-h-[calc(100vh-130px)]">
          {sections.map((sec) => (
            <div key={sec.group}>
              {!isCollapsed && (
                <p className="text-[10px] font-bold text-[#71717A] uppercase tracking-[0.15em] px-2 mb-2">
                  {sec.group}
                </p>
              )}
              <ul className="space-y-1">
                {sec.items.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeModule === item.id;
                  const badge = getBadge(item.id);
                  return (
                    <li key={item.id}>
                      <button
                        onClick={() => setActiveModule(item.id)}
                        title={isCollapsed ? item.label : undefined}
                        className={`
                          w-full flex items-center rounded-xl transition-all duration-150 group relative
                          ${isCollapsed ? "justify-center px-0 py-3" : "justify-between px-3 py-2.5"}
                          ${isActive
                            ? "bg-[#C8A75A] text-[#18181B] font-bold shadow-md"
                            : "text-[#A1A1AA] hover:bg-[#27272A] hover:text-white"
                          }
                        `}
                      >
                        <div className={`flex items-center ${isCollapsed ? "" : "gap-3"} min-w-0`}>
                          <Icon className={`w-4 h-4 shrink-0 ${isActive ? "text-[#18181B]" : "text-[#71717A] group-hover:text-[#C8A75A]"}`} />
                          {!isCollapsed && (
                            <span className="text-xs truncate font-medium">{item.label}</span>
                          )}
                        </div>

                        {!isCollapsed && (
                          <div className="flex items-center gap-1.5 shrink-0">
                            {badge !== null && badge > 0 && (
                              <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full text-center ${isActive ? "bg-[#18181B] text-[#C8A75A]" : "bg-red-600 text-white"}`}>
                                {badge}
                              </span>
                            )}
                          </div>
                        )}
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </nav>
      </div>

      {/* Footer Profile */}
      <div className={`border-t border-[#27272A] ${isCollapsed ? "p-3" : "p-3.5"}`}>
        {isCollapsed ? (
          <div className="w-8 h-8 rounded-full bg-[#C8A75A] text-[#18181B] font-bold flex items-center justify-center text-xs mx-auto shadow">
            CL
          </div>
        ) : (
          <div className="flex items-center gap-3 p-2 rounded-xl bg-[#27272A]/50 border border-[#3F3F46]">
            <div className="w-8 h-8 rounded-full bg-[#C8A75A] text-[#18181B] font-bold flex items-center justify-center text-xs shrink-0 shadow">
              CL
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-bold text-[#F4F4F5] truncate">Master Atelier Admin</p>
              <p className="text-[10px] text-[#A1A1AA] truncate">admin@candlelab.com</p>
            </div>
            <div className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" title="DB Connected" />
          </div>
        )}
      </div>
    </aside>
  );
};

