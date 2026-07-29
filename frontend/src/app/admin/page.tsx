"use client";

import { motion } from "framer-motion";
import {
  TrendingUp,
  ShoppingBag,
  Package,
  Users,
  DollarSign,
  ArrowUpRight,
  ArrowDownRight,
  AlertTriangle,
  Flame,
  Plus,
  Eye,
  CheckCircle2,
  Clock,
  Truck,
} from "lucide-react";
import Link from "next/link";
import { PRODUCTS } from "@/data/mock";
import { formatPrice } from "@/lib/utils";

const STATS = [
  {
    title: "Total Revenue",
    value: "₹2,48,590",
    change: "+18.4%",
    isPositive: true,
    icon: <DollarSign size={20} className="text-[#C4964A]" />,
    subtext: "vs last month (₹2,09,800)",
  },
  {
    title: "Total Orders",
    value: "142",
    change: "+12.1%",
    isPositive: true,
    icon: <ShoppingBag size={20} className="text-[#C4964A]" />,
    subtext: "18 pending dispatch",
  },
  {
    title: "Total Products",
    value: PRODUCTS.length.toString(),
    change: "+2 new",
    isPositive: true,
    icon: <Package size={20} className="text-[#C4964A]" />,
    subtext: "2 low stock items",
  },
  {
    title: "Active Customers",
    value: "389",
    change: "+24.5%",
    isPositive: true,
    icon: <Users size={20} className="text-[#C4964A]" />,
    subtext: "84 repeat buyers",
  },
];

const RECENT_ORDERS = [
  {
    id: "TCL-9081",
    customer: "Ananya Roy",
    email: "ananya@example.com",
    product: "Amber & Sandalwood Candle",
    total: 1499,
    status: "Delivered",
    date: "10 mins ago",
  },
  {
    id: "TCL-9080",
    customer: "Vikram Malhotra",
    email: "vikram@example.com",
    product: "Vanilla Bourbon & Oak",
    total: 2998,
    status: "Processing",
    date: "45 mins ago",
  },
  {
    id: "TCL-9079",
    customer: "Neha Kapoor",
    email: "neha@example.com",
    product: "Lavender & Bergamot Soy Candle",
    total: 1299,
    status: "Shipped",
    date: "2 hours ago",
  },
  {
    id: "TCL-9078",
    customer: "Rohan Gupta",
    email: "rohan@example.com",
    product: "Midnight Jasmine Gift Set",
    total: 3599,
    status: "Delivered",
    date: "5 hours ago",
  },
];

export default function AdminDashboardPage() {
  const lowStockProducts = PRODUCTS.filter((p) => p.stock <= 5);

  return (
    <div className="space-y-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1
            className="text-3xl font-medium text-[#F5EFE4]"
            style={{ fontFamily: "Cormorant Garamond, Georgia, serif" }}
          >
            Dashboard Overview
          </h1>
          <p className="text-xs text-[#8B7355] mt-1">
            Welcome back, Admin. Here is what is happening with The Candle Lab today.
          </p>
        </div>
        <div className="flex gap-3">
          <Link
            href="/admin/products?action=new"
            className="btn btn-gold btn-sm gap-1.5"
            id="admin-add-product-btn"
          >
            <Plus size={15} />
            Add New Candle
          </Link>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {STATS.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.08 }}
            className="p-5 rounded-2xl border border-[#2A1D13] relative overflow-hidden"
            style={{ background: "#140D07" }}
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs text-[#8B7355] font-semibold uppercase tracking-wider">
                {stat.title}
              </span>
              <div className="w-9 h-9 rounded-xl bg-[#1F140B] flex items-center justify-center border border-[#3A281A]">
                {stat.icon}
              </div>
            </div>
            <div className="flex items-baseline justify-between mb-1">
              <span className="text-2xl font-bold text-[#F5EFE4]">
                {stat.value}
              </span>
              <span
                className="flex items-center text-xs font-semibold px-2 py-0.5 rounded-full"
                style={{
                  background: stat.isPositive ? "rgba(34,197,94,0.15)" : "rgba(239,68,68,0.15)",
                  color: stat.isPositive ? "#4ADE80" : "#F87171",
                }}
              >
                {stat.isPositive ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
                {stat.change}
              </span>
            </div>
            <p className="text-[11px] text-[#8B7355]">{stat.subtext}</p>
          </motion.div>
        ))}
      </div>

      {/* Low Stock Alerts (if any) */}
      {lowStockProducts.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="p-4 rounded-2xl border border-[#D97706]/30 bg-[#7C2D12]/10 flex items-center justify-between flex-wrap gap-3"
        >
          <div className="flex items-center gap-3">
            <AlertTriangle className="text-[#F59E0B]" size={20} />
            <div>
              <p className="text-xs font-semibold text-[#FDE68A]">Low Stock Warning</p>
              <p className="text-xs text-[#D97706]">
                {lowStockProducts.map((p) => `${p.name} (${p.stock} left)`).join(" · ")}
              </p>
            </div>
          </div>
          <Link
            href="/admin/products?filter=lowstock"
            className="text-xs text-[#F59E0B] font-semibold hover:underline"
          >
            Restock Now →
          </Link>
        </motion.div>
      )}

      {/* Main Grid: Orders + Top Products */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left: Recent Orders Table */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-[#F5EFE4]">Recent Orders</h2>
            <Link
              href="/admin/orders"
              className="text-xs text-[#C4964A] hover:underline"
              id="admin-view-all-orders"
            >
              View All Orders →
            </Link>
          </div>

          <div className="rounded-2xl border border-[#2A1D13] overflow-hidden" style={{ background: "#140D07" }}>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-[#2A1D13] text-[11px] uppercase tracking-wider text-[#8B7355]" style={{ background: "#1A1208" }}>
                    <th className="p-4 font-semibold">Order ID</th>
                    <th className="p-4 font-semibold">Customer</th>
                    <th className="p-4 font-semibold">Product</th>
                    <th className="p-4 font-semibold">Total</th>
                    <th className="p-4 font-semibold">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#2A1D13] text-xs">
                  {RECENT_ORDERS.map((order) => (
                    <tr key={order.id} className="hover:bg-[#1F140B] transition-colors">
                      <td className="p-4 font-mono font-semibold text-[#C4964A]">{order.id}</td>
                      <td className="p-4">
                        <p className="font-medium text-[#F5EFE4]">{order.customer}</p>
                        <p className="text-[10px] text-[#8B7355]">{order.email}</p>
                      </td>
                      <td className="p-4 text-[#A08060] line-clamp-1 max-w-40">{order.product}</td>
                      <td className="p-4 font-semibold text-[#F5EFE4]">{formatPrice(order.total)}</td>
                      <td className="p-4">
                        <span
                          className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider"
                          style={{
                            background:
                              order.status === "Delivered"
                                ? "rgba(34,197,94,0.15)"
                                : order.status === "Shipped"
                                ? "rgba(59,130,246,0.15)"
                                : "rgba(245,158,11,0.15)",
                            color:
                              order.status === "Delivered"
                                ? "#4ADE80"
                                : order.status === "Shipped"
                                ? "#60A5FA"
                                : "#FBBF24",
                          }}
                        >
                          {order.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right Sidebar: Top Selling Products */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-[#F5EFE4]">Top Selling Candles</h2>
          <div className="rounded-2xl border border-[#2A1D13] p-4 space-y-3" style={{ background: "#140D07" }}>
            {PRODUCTS.slice(0, 4).map((product, i) => (
              <div key={product.id} className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-[#1F140B] transition-colors">
                <span className="text-xs font-bold text-[#8B7355] w-4 text-center">{i + 1}</span>
                <img src={product.thumbnail} alt={product.name} className="w-10 h-10 rounded-lg object-cover bg-[#2A1D13]" />
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-[#F5EFE4] truncate">{product.name}</p>
                  <p className="text-[10px] text-[#8B7355]">{product.reviewCount} sales · ⭐ {product.rating}</p>
                </div>
                <span className="text-xs font-semibold text-[#C4964A]">{formatPrice(product.price)}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
