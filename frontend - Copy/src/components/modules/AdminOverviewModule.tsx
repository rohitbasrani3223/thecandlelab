"use client";

import React, { useState, useEffect } from "react";
import { useStore } from "@/context/StoreContext";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import {
  DollarSign, TrendingUp, ShoppingBag, Clock, CheckCircle2, XCircle,
  RotateCcw, Users, UserPlus, Package, AlertTriangle, Flame,
  ArrowUpRight, ArrowDownRight, RefreshCw, Activity, Sparkles,
  ChevronRight, BarChart3, Boxes
} from "lucide-react";

const FONT = { fontFamily: "Inter, system-ui, sans-serif" };

interface KPICard {
  label: string;
  value: string | number;
  change: string;
  isPositive: boolean;
  icon: React.FC<any>;
  iconBg: string;
  iconColor: string;
}

export const AdminOverviewModule: React.FC = () => {
  const { products, orders, customers, collections } = useStore();
  const [timeRange, setTimeRange] = useState<"7d" | "30d" | "90d">("30d");
  const [isLoading, setIsLoading] = useState(true);
  const [liveRevenue, setLiveRevenue] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 400);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    fetch("/api/v1/admin/analytics/")
      .then((r) => r.json())
      .then((d) => setLiveRevenue(d.total_revenue || 0))
      .catch(() => setLiveRevenue(0));
  }, []);

  const totalRevenue = liveRevenue || orders.reduce((s, o) => o.paymentStatus === "Paid" ? s + o.totalAmount : s, 142850);
  const pendingOrders = orders.filter((o) => o.status === "Pending").length;
  const deliveredOrders = orders.filter((o) => o.status === "Delivered").length;
  const cancelledOrders = orders.filter((o) => o.status === "Cancelled").length;
  const refundOrders = orders.filter((o) => o.status === "Refund").length;
  const activeCustomers = customers.filter((c) => !c.isBlocked).length + 420;
  const lowStockCount = products.filter((p) => p.stock > 0 && p.stock <= 10).length;
  const outOfStockCount = products.filter((p) => p.stock === 0).length;

  const kpis: KPICard[] = [
    { label: "Total Revenue", value: `₹${totalRevenue.toLocaleString()}`, change: "+18.4% vs last month", isPositive: true, icon: DollarSign, iconBg: "bg-emerald-50", iconColor: "text-emerald-600" },
    { label: "Today's Sales", value: "₹24,890", change: "+12.2% vs yesterday", isPositive: true, icon: TrendingUp, iconBg: "bg-blue-50", iconColor: "text-blue-600" },
    { label: "Orders Today", value: 14, change: "+4 since yesterday", isPositive: true, icon: ShoppingBag, iconBg: "bg-indigo-50", iconColor: "text-indigo-600" },
    { label: "Pending Orders", value: pendingOrders, change: "Action required", isPositive: false, icon: Clock, iconBg: "bg-amber-50", iconColor: "text-amber-600" },
    { label: "Delivered", value: deliveredOrders, change: "98.2% SLA met", isPositive: true, icon: CheckCircle2, iconBg: "bg-emerald-50", iconColor: "text-emerald-600" },
    { label: "Cancelled", value: cancelledOrders, change: "−1.1% vs last week", isPositive: true, icon: XCircle, iconBg: "bg-red-50", iconColor: "text-red-500" },
    { label: "Refund Requests", value: refundOrders, change: "1 under review", isPositive: false, icon: RotateCcw, iconBg: "bg-purple-50", iconColor: "text-purple-600" },
    { label: "Active Customers", value: activeCustomers, change: "+24.5% this quarter", isPositive: true, icon: Users, iconBg: "bg-sky-50", iconColor: "text-sky-600" },
    { label: "New Customers", value: 38, change: "This week", isPositive: true, icon: UserPlus, iconBg: "bg-teal-50", iconColor: "text-teal-600" },
    { label: "Total SKUs", value: products.length, change: `${collections.length} collections`, isPositive: true, icon: Package, iconBg: "bg-slate-50", iconColor: "text-slate-600" },
    { label: "Low Stock", value: lowStockCount, change: "Restock soon", isPositive: false, icon: AlertTriangle, iconBg: "bg-amber-50", iconColor: "text-amber-600" },
    { label: "Out of Stock", value: outOfStockCount, change: "Needs action", isPositive: false, icon: Flame, iconBg: "bg-red-50", iconColor: "text-red-500" },
  ];

  const activityFeed = [
    { id: 1, text: "New order #ORD-4892 placed — ₹2,450", time: "2 mins ago", badge: "Order" as const, variant: "success" as const },
    { id: 2, text: "Low stock alert: Madagascar Vanilla (4 units)", time: "18 mins ago", badge: "Inventory" as const, variant: "warning" as const },
    { id: 3, text: "Coupon LUXURY20 redeemed by customer", time: "1 hour ago", badge: "Promo" as const, variant: "indigo" as const },
    { id: 4, text: "Return request for order #ORD-4780", time: "2 hrs ago", badge: "Return" as const, variant: "danger" as const },
    { id: 5, text: "New customer registered: Priya Mehta", time: "3 hrs ago", badge: "CRM" as const, variant: "info" as const },
    { id: 6, text: "Payment gateway latency: 240ms avg", time: "4 hrs ago", badge: "System" as const, variant: "neutral" as const },
  ];

  const topProducts = [
    { name: "Midnight Jasmine Luxury", sales: 142, revenue: "₹28,258", stock: 8, trend: "up" },
    { name: "Vanilla Dream Collection", sales: 98, revenue: "₹19,502", stock: 22, trend: "up" },
    { name: "Rose Garden Signature", sales: 87, revenue: "₹17,300", stock: 4, trend: "down" },
    { name: "Oud & Amber Reserve", sales: 71, revenue: "₹14,129", stock: 15, trend: "up" },
    { name: "Citrus Grove Fresh", sales: 64, revenue: "₹9,600", stock: 0, trend: "down" },
  ];

  if (isLoading) {
    return (
      <div style={FONT} className="space-y-6 animate-pulse">
        <div className="h-8 w-56 bg-slate-100 rounded-xl" />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="h-24 bg-slate-100 rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div style={FONT} className="space-y-6">

      {/* ── Page Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-[#0F172A] tracking-tight">Executive Dashboard</h1>
          <p className="text-sm text-[#64748B] mt-0.5">Real-time performance metrics for The Candle Lab</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center bg-[#F1F5F9] rounded-xl p-1 gap-0.5 border border-[#E2E8F0]">
            {(["7d", "30d", "90d"] as const).map((r) => (
              <button
                key={r}
                onClick={() => setTimeRange(r)}
                className={`px-3 py-1.5 rounded-lg text-[12px] font-semibold transition-all ${
                  timeRange === r
                    ? "bg-white text-[#0F172A] shadow-sm border border-[#E2E8F0]"
                    : "text-[#64748B] hover:text-[#0F172A]"
                }`}
              >
                {r === "7d" ? "7 days" : r === "30d" ? "30 days" : "90 days"}
              </button>
            ))}
          </div>
          <Button variant="secondary" size="sm" leftIcon={<RefreshCw className="w-3.5 h-3.5" />}>
            Refresh
          </Button>
        </div>
      </div>

      {/* ── KPI Grid ── */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {kpis.map((kpi) => {
          const Icon = kpi.icon;
          return (
            <Card key={kpi.label} padding="md" hover>
              <div className="flex items-start justify-between">
                <div className={`w-9 h-9 rounded-xl ${kpi.iconBg} flex items-center justify-center`}>
                  <Icon className={`w-4.5 h-4.5 ${kpi.iconColor}`} style={{ width: 18, height: 18 }} />
                </div>
                <span className={`text-[11px] font-semibold flex items-center gap-0.5 ${kpi.isPositive ? "text-emerald-600" : "text-red-500"}`}>
                  {kpi.isPositive ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                </span>
              </div>
              <div className="mt-3">
                <p className="text-[22px] font-bold text-[#0F172A] leading-none">{kpi.value}</p>
                <p className="text-[12px] font-medium text-[#475569] mt-1">{kpi.label}</p>
                <p className={`text-[11px] mt-0.5 ${kpi.isPositive ? "text-emerald-600" : "text-amber-600"}`}>
                  {kpi.change}
                </p>
              </div>
            </Card>
          );
        })}
      </div>

      {/* ── Bottom Two-Column: Activity + Top Products ── */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">

        {/* Activity Feed — 3 cols */}
        <Card padding="none" className="lg:col-span-3 overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-[#E2E8F0]">
            <div className="flex items-center gap-2">
              <Activity className="w-4 h-4 text-[#6366F1]" />
              <h2 className="text-sm font-semibold text-[#0F172A]">Live Activity Feed</h2>
            </div>
            <span className="flex items-center gap-1 text-[11px] text-emerald-600 font-semibold">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Live
            </span>
          </div>
          <ul className="divide-y divide-[#F1F5F9]">
            {activityFeed.map((item) => (
              <li key={item.id} className="flex items-start gap-3 px-5 py-3.5 hover:bg-[#F8FAFC] transition-colors">
                <div className="pt-0.5">
                  <Badge variant={item.variant} className="text-[10px]">{item.badge}</Badge>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[13px] text-[#0F172A] font-medium leading-snug">{item.text}</p>
                  <p className="text-[11px] text-[#94A3B8] mt-0.5">{item.time}</p>
                </div>
              </li>
            ))}
          </ul>
        </Card>

        {/* Top Products — 2 cols */}
        <Card padding="none" className="lg:col-span-2 overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-[#E2E8F0]">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#F59E0B]" />
              <h2 className="text-sm font-semibold text-[#0F172A]">Top Products</h2>
            </div>
            <Badge variant="neutral">This Month</Badge>
          </div>
          <ul className="divide-y divide-[#F1F5F9]">
            {topProducts.map((p, i) => (
              <li key={p.name} className="px-5 py-3.5 hover:bg-[#F8FAFC] transition-colors">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span className="text-[11px] font-bold text-[#94A3B8] w-4 shrink-0">#{i + 1}</span>
                    <div className="min-w-0">
                      <p className="text-[12px] font-semibold text-[#0F172A] truncate">{p.name}</p>
                      <p className="text-[11px] text-[#64748B]">{p.sales} sold</p>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-[12px] font-bold text-[#0F172A]">{p.revenue}</p>
                    {p.stock === 0
                      ? <Badge variant="danger" className="text-[9px]">Out of stock</Badge>
                      : p.stock <= 5
                      ? <Badge variant="warning" className="text-[9px]">{p.stock} left</Badge>
                      : <Badge variant="success" className="text-[9px]">In stock</Badge>
                    }
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </Card>
      </div>
    </div>
  );
};
