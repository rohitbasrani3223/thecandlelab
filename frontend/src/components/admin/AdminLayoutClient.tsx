"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  Users,
  FolderTree,
  BarChart3,
  Settings,
  Flame,
  Bell,
  Search,
  Menu,
  X,
  ExternalLink,
  ChevronRight,
  Tag,
  Image as ImageIcon,
  MessageSquare,
  CreditCard,
  FileText,
  RotateCcw,
  ShieldCheck,
  Boxes,
  Sparkles,
} from "lucide-react";

interface NavGroup {
  groupName: string;
  items: {
    href: string;
    label: string;
    icon: React.ReactNode;
    badge?: string;
  }[];
}

const NAV_GROUPS: NavGroup[] = [
  {
    groupName: "Main",
    items: [
      { href: "/admin", label: "Dashboard", icon: <LayoutDashboard size={18} /> },
      { href: "/admin/analytics", label: "Analytics & Reports", icon: <BarChart3 size={18} /> },
      { href: "/admin/alerts", label: "System Alerts", icon: <Bell size={18} />, badge: "2" },
    ],
  },
  {
    groupName: "Catalog & Stock",
    items: [
      { href: "/admin/products", label: "Products", icon: <Package size={18} /> },
      { href: "/admin/categories", label: "Categories & Sub-cats", icon: <FolderTree size={18} /> },
      { href: "/admin/inventory", label: "Inventory & Stock", icon: <Boxes size={18} />, badge: "Low" },
    ],
  },
  {
    groupName: "Sales & Operations",
    items: [
      { href: "/admin/orders", label: "Orders", icon: <ShoppingBag size={18} />, badge: "New" },
      { href: "/admin/payments", label: "Payments History", icon: <CreditCard size={18} /> },
      { href: "/admin/post-sales", label: "Returns & Refunds", icon: <RotateCcw size={18} /> },
      { href: "/admin/reports", label: "Sales Reports", icon: <FileText size={18} /> },
    ],
  },
  {
    groupName: "Customers & Marketing",
    items: [
      { href: "/admin/customers", label: "Customers Directory", icon: <Users size={18} /> },
      { href: "/admin/coupons", label: "Coupons & Discounts", icon: <Tag size={18} /> },
      { href: "/admin/hero-banners", label: "Hero Banners", icon: <ImageIcon size={18} /> },
      { href: "/admin/popup-banners", label: "Popup Banners", icon: <Sparkles size={18} /> },
      { href: "/admin/notifications", label: "Send Notifications", icon: <MessageSquare size={18} /> },
    ],
  },
  {
    groupName: "Administration",
    items: [
      { href: "/admin/users", label: "Admin Management", icon: <ShieldCheck size={18} /> },
      { href: "/admin/settings", label: "Store Settings", icon: <Settings size={18} /> },
    ],
  },
];

export function AdminLayoutClient({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen flex bg-[#0F0A06] text-[#F5EFE4]">
      {/* Sidebar (Desktop) */}
      <aside
        className="hidden lg:flex flex-col w-64 border-r border-[#2A1D13] flex-shrink-0 fixed inset-y-0 left-0 z-30"
        style={{ background: "#140D07" }}
      >
        {/* Brand */}
        <div className="p-5 border-b border-[#2A1D13] flex items-center justify-between">
          <Link href="/admin" className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#A87B32] via-[#C4964A] to-[#D4A96A] flex items-center justify-center shadow-lg shadow-[#C4964A]/20">
              <Flame size={18} className="text-white" strokeWidth={2} />
            </div>
            <div>
              <p
                className="text-base font-semibold text-[#F5EFE4] leading-tight"
                style={{ fontFamily: "Cormorant Garamond, Georgia, serif" }}
              >
                The Candle Lab
              </p>
              <span className="text-[9px] uppercase tracking-widest text-[#C4964A] font-bold">
                Enterprise Admin
              </span>
            </div>
          </Link>
        </div>

        {/* Navigation Links Grouped */}
        <nav className="flex-1 p-3 space-y-5 overflow-y-auto custom-scrollbar">
          {NAV_GROUPS.map((group) => (
            <div key={group.groupName} className="space-y-1">
              <p className="px-3 text-[10px] font-bold uppercase tracking-widest text-[#8B7355] mb-1.5">
                {group.groupName}
              </p>
              {group.items.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium transition-all group"
                    style={{
                      background: isActive
                        ? "linear-gradient(135deg, rgba(196,150,74,0.2) 0%, rgba(168,123,50,0.1) 100%)"
                        : "transparent",
                      color: isActive ? "#C4964A" : "#A08060",
                      border: isActive
                        ? "1px solid rgba(196,150,74,0.3)"
                        : "1px solid transparent",
                    }}
                    id={`admin-nav-${item.label.toLowerCase().replace(/[^a-z0-9]/g, "-")}`}
                  >
                    <span className={isActive ? "text-[#C4964A]" : "text-[#8B7355] group-hover:text-[#C4964A]"}>
                      {item.icon}
                    </span>
                    <span className="flex-1 truncate">{item.label}</span>
                    {item.badge && (
                      <span
                        className="px-1.5 py-0.5 rounded-full text-[9px] font-bold"
                        style={{
                          background: item.badge === "Low" ? "rgba(239,68,68,0.2)" : "rgba(196,150,74,0.2)",
                          color: item.badge === "Low" ? "#F87171" : "#C4964A",
                        }}
                      >
                        {item.badge}
                      </span>
                    )}
                    {isActive && <ChevronRight size={12} className="text-[#C4964A]" />}
                  </Link>
                );
              })}
            </div>
          ))}
        </nav>

        {/* Footer info & view store */}
        <div className="p-3 border-t border-[#2A1D13] space-y-2">
          <Link
            href="/"
            target="_blank"
            className="flex items-center justify-between px-3 py-2 rounded-xl text-xs text-[#A08060] hover:text-[#C4964A] hover:bg-[#1F140B] transition-all border border-[#2A1D13]"
            id="admin-view-store"
          >
            <span>View Live Store</span>
            <ExternalLink size={12} />
          </Link>

          <div className="flex items-center gap-2.5 px-2 py-1.5">
            <div className="w-7 h-7 rounded-full bg-[#A87B32] flex items-center justify-center font-bold text-white text-xs">
              A
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-[#F5EFE4] truncate">Administrator</p>
              <p className="text-[10px] text-[#8B7355] truncate">admin@thecandlelab.in</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content Container */}
      <div className="flex-1 lg:pl-64 flex flex-col min-w-0">
        {/* Topbar */}
        <header
          className="h-16 border-b border-[#2A1D13] flex items-center justify-between px-6 sticky top-0 z-20"
          style={{ background: "#140D07" }}
        >
          <button
            onClick={() => setMobileMenuOpen(true)}
            className="lg:hidden p-2 text-[#A08060] hover:text-white"
            id="admin-mobile-toggle"
          >
            <Menu size={20} />
          </button>

          <div className="relative hidden sm:block max-w-xs flex-1">
            <Search
              size={14}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8B7355]"
            />
            <input
              type="text"
              placeholder="Search products, orders, coupons, customers..."
              className="w-full pl-9 pr-4 py-1.5 rounded-xl text-xs bg-[#1F140B] border border-[#3A281A] text-[#F5EFE4] placeholder-[#8B7355] focus:outline-none focus:border-[#C4964A]"
            />
          </div>

          <div className="flex items-center gap-3 ml-auto">
            <button
              className="relative p-2 rounded-xl text-[#A08060] hover:text-[#C4964A] hover:bg-[#1F140B] transition-colors"
              aria-label="Notifications"
            >
              <Bell size={18} />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#C4964A]" />
            </button>
            <div className="h-5 w-px bg-[#2A1D13]" />
            <Link
              href="/"
              className="text-xs text-[#A08060] hover:text-[#C4964A] transition-colors"
            >
              Log out
            </Link>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-6 lg:p-8 overflow-y-auto">{children}</main>
      </div>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileMenuOpen(false)}
              className="fixed inset-0 bg-black/70 backdrop-blur-sm z-40 lg:hidden"
            />
            <motion.aside
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed inset-y-0 left-0 w-64 bg-[#140D07] z-50 flex flex-col lg:hidden border-r border-[#2A1D13]"
            >
              <div className="p-5 border-b border-[#2A1D13] flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Flame size={18} className="text-[#C4964A]" />
                  <span className="font-semibold text-white">Enterprise Admin</span>
                </div>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-1 text-[#8B7355] hover:text-white"
                >
                  <X size={20} />
                </button>
              </div>
              <nav className="flex-1 p-4 space-y-4 overflow-y-auto">
                {NAV_GROUPS.map((group) => (
                  <div key={group.groupName} className="space-y-1">
                    <p className="px-2 text-[10px] font-bold uppercase tracking-widest text-[#8B7355]">
                      {group.groupName}
                    </p>
                    {group.items.map((item) => (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => setMobileMenuOpen(false)}
                        className="flex items-center gap-3 px-3 py-2 rounded-xl text-xs text-[#A08060] hover:text-[#C4964A] hover:bg-[#1F140B]"
                      >
                        {item.icon}
                        {item.label}
                      </Link>
                    ))}
                  </div>
                ))}
              </nav>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
