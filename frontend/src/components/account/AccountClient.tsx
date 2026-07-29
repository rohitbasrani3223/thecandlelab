"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  User,
  Package,
  Heart,
  MapPin,
  Settings,
  LogOut,
  Edit3,
  ChevronRight,
  Star,
  Clock,
  CheckCircle2,
  Truck,
  XCircle,
} from "lucide-react";
import { useWishlistStore } from "@/store";
import { PRODUCTS } from "@/data/mock";
import { formatPrice } from "@/lib/utils";
import { ProductCard } from "@/components/product/ProductCard";
import toast from "react-hot-toast";

const TABS = [
  { id: "profile", label: "Profile", icon: <User size={16} /> },
  { id: "orders", label: "My Orders", icon: <Package size={16} /> },
  { id: "wishlist", label: "Wishlist", icon: <Heart size={16} /> },
  { id: "addresses", label: "Addresses", icon: <MapPin size={16} /> },
  { id: "settings", label: "Settings", icon: <Settings size={16} /> },
];

// Mock order data
const MOCK_ORDERS = [
  {
    id: "TCL91234567",
    date: "2025-01-15",
    status: "delivered",
    items: [PRODUCTS[0], PRODUCTS[1]],
    total: 2998,
  },
  {
    id: "TCL81234568",
    date: "2025-02-03",
    status: "shipped",
    items: [PRODUCTS[2]],
    total: 1499,
  },
  {
    id: "TCL71234569",
    date: "2025-02-20",
    status: "processing",
    items: [PRODUCTS[3], PRODUCTS[4]],
    total: 3599,
  },
];

const STATUS_CONFIG: Record<string, { label: string; color: string; bg: string; icon: React.ReactNode }> = {
  delivered: { label: "Delivered", color: "#22C55E", bg: "#F0FDF4", icon: <CheckCircle2 size={14} /> },
  shipped: { label: "Shipped", color: "#3B82F6", bg: "#EFF6FF", icon: <Truck size={14} /> },
  processing: { label: "Processing", color: "#F59E0B", bg: "#FFFBEB", icon: <Clock size={14} /> },
  cancelled: { label: "Cancelled", color: "#EF4444", bg: "#FEF2F2", icon: <XCircle size={14} /> },
};

export default function AccountClient() {
  const [activeTab, setActiveTab] = useState("profile");
  const { items: wishlistIds } = useWishlistStore();
  const wishlistProducts = PRODUCTS.filter((p) => wishlistIds.includes(p.id));

  return (
    <div className="min-h-screen" style={{ background: "#FDFAF5" }}>
      {/* Header */}
      <div
        className="py-8 px-6"
        style={{
          background: "linear-gradient(180deg, #F5EFE4 0%, #FDFAF5 100%)",
          borderBottom: "1px solid #EDE4D4",
        }}
      >
        <div className="container">
          <div className="flex items-center gap-5">
            {/* Avatar */}
            <div
              className="w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold text-white"
              style={{
                background: "linear-gradient(135deg, #A87B32, #D4A96A)",
                boxShadow: "0 4px 16px rgba(196,150,74,0.4)",
              }}
            >
              P
            </div>
            <div>
              <h1
                className="text-2xl font-medium text-[#1A1208]"
                style={{ fontFamily: "Cormorant Garamond, Georgia, serif" }}
              >
                Priya Sharma
              </h1>
              <p className="text-sm text-[#8B7355]">priya@example.com · Member since Jan 2025</p>
              <div className="flex items-center gap-2 mt-1">
                <span
                  className="text-xs font-semibold px-2 py-0.5 rounded-full"
                  style={{ background: "rgba(196,150,74,0.15)", color: "#A87B32" }}
                >
                  ✦ Gold Member
                </span>
                <span className="text-xs text-[#8B7355]">320 reward points</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <div className="lg:w-60 flex-shrink-0">
            <div
              className="rounded-2xl p-2 sticky top-24"
              style={{ background: "#fff", border: "1px solid #EDE4D4" }}
            >
              {TABS.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all text-left"
                  style={{
                    background: activeTab === tab.id ? "#F5EFE4" : "transparent",
                    color: activeTab === tab.id ? "#A87B32" : "#4A3728",
                  }}
                  id={`account-tab-${tab.id}`}
                >
                  <span className={activeTab === tab.id ? "text-[#A87B32]" : "text-[#8B7355]"}>
                    {tab.icon}
                  </span>
                  {tab.label}
                  {tab.id === "wishlist" && wishlistProducts.length > 0 && (
                    <span
                      className="ml-auto text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center text-white"
                      style={{ background: "#C4964A" }}
                    >
                      {wishlistProducts.length}
                    </span>
                  )}
                </button>
              ))}

              <div className="mt-2 pt-2" style={{ borderTop: "1px solid #EDE4D4" }}>
                <Link
                  href="/"
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-[#B85450] hover:bg-red-50 transition-colors"
                  id="account-logout"
                >
                  <LogOut size={16} />
                  Log Out
                </Link>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            <AnimatePresence mode="wait">
              {/* Profile Tab */}
              {activeTab === "profile" && (
                <motion.div key="profile" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                  <div className="p-6 rounded-2xl" style={{ background: "#fff", border: "1px solid #EDE4D4" }}>
                    <div className="flex items-center justify-between mb-6">
                      <h2 className="text-xl font-semibold text-[#1A1208]">Personal Information</h2>
                      <button className="btn btn-outline btn-sm gap-1.5" id="edit-profile-btn">
                        <Edit3 size={14} />
                        Edit
                      </button>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      {[
                        { label: "Full Name", value: "Priya Sharma" },
                        { label: "Email Address", value: "priya@example.com" },
                        { label: "Mobile Number", value: "+91 98765 43210" },
                        { label: "Date of Birth", value: "15 March 1995" },
                        { label: "Gender", value: "Female" },
                        { label: "Member Since", value: "January 2025" },
                      ].map((field) => (
                        <div key={field.label}>
                          <p className="text-xs text-[#8B7355] font-medium uppercase tracking-wide mb-1">
                            {field.label}
                          </p>
                          <p className="text-sm font-medium text-[#1A1208]">{field.value}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="grid grid-cols-3 gap-4 mt-5">
                    {[
                      { label: "Total Orders", value: "12" },
                      { label: "Total Spent", value: "₹18,490" },
                      { label: "Reward Points", value: "320 pts" },
                    ].map((stat) => (
                      <div
                        key={stat.label}
                        className="p-4 rounded-2xl text-center"
                        style={{ background: "#fff", border: "1px solid #EDE4D4" }}
                      >
                        <p className="text-2xl font-semibold text-[#1A1208]"
                          style={{ fontFamily: "Cormorant Garamond, Georgia, serif" }}>
                          {stat.value}
                        </p>
                        <p className="text-xs text-[#8B7355] mt-1">{stat.label}</p>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Orders Tab */}
              {activeTab === "orders" && (
                <motion.div key="orders" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-4">
                  <h2 className="text-xl font-semibold text-[#1A1208]">My Orders</h2>
                  {MOCK_ORDERS.map((order) => {
                    const statusConf = STATUS_CONFIG[order.status];
                    return (
                      <div
                        key={order.id}
                        className="p-5 rounded-2xl"
                        style={{ background: "#fff", border: "1px solid #EDE4D4" }}
                      >
                        <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
                          <div>
                            <p className="text-sm font-semibold text-[#1A1208]">Order #{order.id}</p>
                            <p className="text-xs text-[#8B7355]">
                              {new Date(order.date).toLocaleDateString("en-IN", {
                                day: "numeric", month: "long", year: "numeric",
                              })}
                            </p>
                          </div>
                          <div className="flex items-center gap-3">
                            <span
                              className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full"
                              style={{ background: statusConf.bg, color: statusConf.color }}
                            >
                              {statusConf.icon}
                              {statusConf.label}
                            </span>
                            <span className="font-semibold text-[#1A1208] text-sm">
                              {formatPrice(order.total)}
                            </span>
                          </div>
                        </div>

                        <div className="flex gap-3 flex-wrap">
                          {order.items.map((product) => (
                            <div key={product.id} className="flex items-center gap-2">
                              <div className="w-12 h-12 rounded-lg overflow-hidden bg-[#F5EFE4]">
                                <Image src={product.thumbnail} alt={product.name} width={48} height={48} className="w-full h-full object-cover" />
                              </div>
                              <p className="text-xs text-[#4A3728] max-w-28 line-clamp-2">{product.name}</p>
                            </div>
                          ))}
                        </div>

                        <div className="flex gap-3 mt-4">
                          <Link href={`/account/orders/${order.id}`} className="btn btn-outline btn-sm gap-1.5" id={`view-order-${order.id}`}>
                            View Details <ChevronRight size={14} />
                          </Link>
                          {order.status === "delivered" && (
                            <button className="btn btn-sm gap-1.5" style={{ background: "#F5EFE4", color: "#A87B32" }}>
                              <Star size={13} />
                              Write Review
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </motion.div>
              )}

              {/* Wishlist Tab */}
              {activeTab === "wishlist" && (
                <motion.div key="wishlist" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                  <h2 className="text-xl font-semibold text-[#1A1208] mb-5">
                    My Wishlist
                    <span className="text-sm font-normal text-[#8B7355] ml-2">
                      ({wishlistProducts.length} items)
                    </span>
                  </h2>
                  {wishlistProducts.length === 0 ? (
                    <div className="text-center py-16">
                      <div className="text-5xl mb-4">🤍</div>
                      <p className="text-[#8B7355] mb-4">Your wishlist is empty.</p>
                      <Link href="/shop" className="btn btn-gold">Browse Candles</Link>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                      {wishlistProducts.map((p) => (
                        <ProductCard key={p.id} product={p} />
                      ))}
                    </div>
                  )}
                </motion.div>
              )}

              {/* Addresses Tab */}
              {activeTab === "addresses" && (
                <motion.div key="addresses" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                  <div className="flex items-center justify-between mb-5">
                    <h2 className="text-xl font-semibold text-[#1A1208]">Saved Addresses</h2>
                    <button className="btn btn-gold btn-sm" id="add-address-btn">+ Add New</button>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {[
                      { type: "Home", name: "Priya Sharma", addr: "Flat 12B, Sunshine Apartments, Linking Road, Bandra West, Mumbai - 400050", phone: "+91 98765 43210", isDefault: true },
                      { type: "Work", name: "Priya Sharma", addr: "3rd Floor, WeWork, BKC, Bandra Kurla Complex, Mumbai - 400051", phone: "+91 98765 43210", isDefault: false },
                    ].map((address) => (
                      <div key={address.type} className="p-5 rounded-2xl relative" style={{ background: "#fff", border: `1.5px solid ${address.isDefault ? "#C4964A" : "#EDE4D4"}` }}>
                        <div className="flex items-center justify-between mb-3">
                          <span className="text-xs font-bold uppercase tracking-wider px-2.5 py-1 rounded-full"
                            style={{ background: "#F5EFE4", color: "#A87B32" }}>
                            {address.type}
                          </span>
                          {address.isDefault && (
                            <span className="text-xs text-[#C4964A] font-semibold">Default</span>
                          )}
                        </div>
                        <p className="font-medium text-sm text-[#1A1208] mb-1">{address.name}</p>
                        <p className="text-sm text-[#8B7355] leading-relaxed mb-2">{address.addr}</p>
                        <p className="text-xs text-[#8B7355]">{address.phone}</p>
                        <div className="flex gap-3 mt-4">
                          <button className="text-xs text-[#A87B32] hover:underline">Edit</button>
                          <button className="text-xs text-[#B85450] hover:underline">Delete</button>
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Settings Tab */}
              {activeTab === "settings" && (
                <motion.div key="settings" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                  <h2 className="text-xl font-semibold text-[#1A1208] mb-5">Settings</h2>
                  <div className="space-y-4">
                    {[
                      { title: "Email Notifications", desc: "Receive emails for orders, offers & newsletters", enabled: true },
                      { title: "SMS Alerts", desc: "Get SMS for order updates and delivery status", enabled: true },
                      { title: "WhatsApp Updates", desc: "Receive WhatsApp messages for order tracking", enabled: false },
                      { title: "Marketing Emails", desc: "Hear about new arrivals and exclusive deals", enabled: false },
                    ].map((setting) => (
                      <div key={setting.title} className="flex items-center justify-between p-5 rounded-2xl"
                        style={{ background: "#fff", border: "1px solid #EDE4D4" }}>
                        <div>
                          <p className="font-medium text-sm text-[#1A1208]">{setting.title}</p>
                          <p className="text-xs text-[#8B7355] mt-0.5">{setting.desc}</p>
                        </div>
                        <button
                          className="w-11 h-6 rounded-full relative transition-all"
                          style={{ background: setting.enabled ? "#C4964A" : "#E0D0B8" }}
                          onClick={() => toast.success("Setting updated")}
                          id={`setting-${setting.title.toLowerCase().replace(/ /g, "-")}`}
                        >
                          <span
                            className="absolute top-0.5 w-5 h-5 bg-white rounded-full shadow-sm transition-all"
                            style={{ left: setting.enabled ? "22px" : "2px" }}
                          />
                        </button>
                      </div>
                    ))}

                    <div className="pt-2">
                      <button className="btn btn-sm text-[#B85450]"
                        style={{ background: "#FEF2F2", border: "1px solid #FECACA" }}
                        id="delete-account-btn">
                        Delete Account
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
