"use client";

import React, { useState } from "react";
import { useStore } from "@/context/StoreContext";
import {
  DollarSign,
  TrendingUp,
  ShoppingBag,
  Clock,
  CheckCircle2,
  XCircle,
  RotateCcw,
  Users,
  UserPlus,
  Store,
  Package,
  AlertTriangle,
  Flame,
  Layers,
  ArrowUpRight,
  ArrowDownRight,
  Activity,
  Calendar,
  Sparkles,
  Search,
  Filter
} from "lucide-react";

export const AdminOverviewModule: React.FC = () => {
  const { products, orders, customers, sellers, collections, currency } = useStore();
  const [timeRange, setTimeRange] = useState<"7d" | "30d" | "90d">("30d");

  // Calculate 13 metrics
  const totalRevenue = orders.reduce((sum, o) => (o.paymentStatus === "Paid" ? sum + o.totalAmount : sum), 142850);
  const todaysSales = 24890;
  const ordersToday = 14;
  const pendingOrders = orders.filter((o) => o.status === "Pending").length;
  const deliveredOrders = orders.filter((o) => o.status === "Delivered").length;
  const cancelledOrders = orders.filter((o) => o.status === "Cancelled").length;
  const refundRequests = orders.filter((o) => o.status === "Refund").length;
  const activeCustomers = customers.filter((c) => !c.isBlocked).length + 420;
  const newCustomersCount = 38;
  const activeSellersCount = sellers.filter((s) => s.status === "VERIFIED").length;
  const totalProductsCount = products.length;
  const lowStockProductsCount = products.filter((p) => p.stock > 0 && p.stock <= 10).length;
  const outOfStockProductsCount = products.filter((p) => p.stock === 0).length;

  const kpiCards = [
    { label: "Total Revenue", value: `₹${totalRevenue.toLocaleString()}`, change: "+18.4%", isPositive: true, icon: DollarSign, color: "text-emerald-600 bg-emerald-50 border-emerald-100" },
    { label: "Today's Sales", value: `₹${todaysSales.toLocaleString()}`, change: "+12.2%", isPositive: true, icon: TrendingUp, color: "text-blue-600 bg-blue-50 border-blue-100" },
    { label: "Orders Today", value: ordersToday, change: "+4 new", isPositive: true, icon: ShoppingBag, color: "text-indigo-600 bg-indigo-50 border-indigo-100" },
    { label: "Pending Orders", value: pendingOrders, change: "Action Required", isPositive: false, icon: Clock, color: "text-amber-600 bg-amber-50 border-amber-100" },
    { label: "Delivered Orders", value: deliveredOrders, change: "98.2% SLA", isPositive: true, icon: CheckCircle2, color: "text-emerald-600 bg-emerald-50 border-emerald-100" },
    { label: "Cancelled Orders", value: cancelledOrders, change: "-1.1%", isPositive: true, icon: XCircle, color: "text-rose-600 bg-rose-50 border-rose-100" },
    { label: "Refund Requests", value: refundRequests, change: "1 In Review", isPositive: false, icon: RotateCcw, color: "text-purple-600 bg-purple-50 border-purple-100" },
    { label: "Active Customers", value: activeCustomers, change: "+24.5%", isPositive: true, icon: Users, color: "text-sky-600 bg-sky-50 border-sky-100" },
    { label: "New Customers", value: newCustomersCount, change: "This Week", isPositive: true, icon: UserPlus, color: "text-teal-600 bg-teal-50 border-teal-100" },
    { label: "Active Sellers", value: activeSellersCount, change: "1 Pending", isPositive: true, icon: Store, color: "text-indigo-600 bg-indigo-50 border-indigo-100" },
    { label: "Total Products", value: totalProductsCount, change: "4 Collections", isPositive: true, icon: Package, color: "text-slate-600 bg-slate-50 border-slate-100" },
    { label: "Low Stock Products", value: lowStockProductsCount, change: "Restock Soon", isPositive: false, icon: AlertTriangle, color: "text-amber-600 bg-amber-50 border-amber-100" },
    { label: "Out of Stock Products", value: outOfStockProductsCount, change: "Needs Action", isPositive: false, icon: Flame, color: "text-rose-600 bg-rose-50 border-rose-100" }
  ];

  const recentActivityLogs = [
    { id: "act-1", text: "Order #ORD-94821 placed by Aarav Sharma", time: "2 mins ago", tag: "Order", color: "bg-emerald-50 text-emerald-700" },
    { id: "act-2", text: "Seller 'Botanical Aromas India' requested KYB verification", time: "14 mins ago", tag: "KYB", color: "bg-amber-50 text-amber-700" },
    { id: "act-3", text: "Low stock alert: Madagascar Vanilla (4 units remaining)", time: "32 mins ago", tag: "Inventory", color: "bg-rose-50 text-rose-700" },
    { id: "act-4", text: "Coupon code 'LUXURY20' redeemed by Priya Patel", time: "1 hour ago", tag: "Promo", color: "bg-indigo-50 text-indigo-700" },
    { id: "act-5", text: "Payout of ₹14,200 issued to Artisan Wax Crafters", time: "2 hours ago", tag: "Payout", color: "bg-purple-50 text-purple-700" }
  ];

  return (
    <div className="space-y-8">
      {/* Overview Top Header bar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-1.5 animate-pulse"></span>
              Live Enterprise Storefront
            </span>
            <span className="text-xs text-slate-400 font-mono">ID: HQ-MUMBAI-01</span>
          </div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight mt-1">Storefront Command Dashboard</h2>
          <p className="text-xs text-slate-500">Real-time revenue metrics, inventory health, customer growth & active seller performance.</p>
        </div>

        <div className="flex items-center gap-2 self-stretch sm:self-auto">
          <div className="inline-flex rounded-xl bg-slate-100 p-1 border border-slate-200 text-xs font-medium">
            <button
              onClick={() => setTimeRange("7d")}
              className={`px-3 py-1.5 rounded-lg transition-all ${timeRange === "7d" ? "bg-white text-slate-900 shadow-sm font-semibold" : "text-slate-600 hover:text-slate-900"}`}
            >
              7 Days
            </button>
            <button
              onClick={() => setTimeRange("30d")}
              className={`px-3 py-1.5 rounded-lg transition-all ${timeRange === "30d" ? "bg-white text-slate-900 shadow-sm font-semibold" : "text-slate-600 hover:text-slate-900"}`}
            >
              30 Days
            </button>
            <button
              onClick={() => setTimeRange("90d")}
              className={`px-3 py-1.5 rounded-lg transition-all ${timeRange === "90d" ? "bg-white text-slate-900 shadow-sm font-semibold" : "text-slate-600 hover:text-slate-900"}`}
            >
              90 Days
            </button>
          </div>
        </div>
      </div>

      {/* 13 KPI Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {kpiCards.map((kpi, idx) => {
          const IconComp = kpi.icon;
          return (
            <div
              key={idx}
              className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm hover:shadow-md transition-all flex flex-col justify-between group"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-slate-500 tracking-wide">{kpi.label}</span>
                <div className={`p-2 rounded-xl border ${kpi.color} group-hover:scale-105 transition-transform`}>
                  <IconComp className="w-4 h-4" />
                </div>
              </div>
              <div className="mt-3">
                <div className="text-2xl font-bold text-slate-900 tracking-tight">{kpi.value}</div>
                <div className="flex items-center gap-1 mt-1 text-[11px] font-medium">
                  {kpi.isPositive ? (
                    <span className="text-emerald-600 flex items-center">
                      <ArrowUpRight className="w-3 h-3 mr-0.5" />
                      {kpi.change}
                    </span>
                  ) : (
                    <span className="text-amber-600 flex items-center">
                      <ArrowDownRight className="w-3 h-3 mr-0.5" />
                      {kpi.change}
                    </span>
                  )}
                  <span className="text-slate-400">vs prev period</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Charts Section: Monthly Revenue & Weekly Sales */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Monthly Revenue Graph */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 p-6 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Activity className="w-4 h-4 text-emerald-600" /> Monthly Revenue Trend
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">Gross revenue vs platform net commission over the current fiscal quarter</p>
            </div>
            <div className="flex items-center gap-4 text-xs">
              <span className="flex items-center gap-1.5 font-medium text-slate-700">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span> Gross Revenue
              </span>
              <span className="flex items-center gap-1.5 font-medium text-slate-700">
                <span className="w-2.5 h-2.5 rounded-full bg-indigo-500"></span> Commission Net
              </span>
            </div>
          </div>

          {/* SVG Visual Area Chart */}
          <div className="py-6">
            <div className="h-56 w-full flex items-end justify-between gap-3 px-2">
              {[
                { month: "Jan", gross: 45, net: 20 },
                { month: "Feb", gross: 58, net: 26 },
                { month: "Mar", gross: 72, net: 34 },
                { month: "Apr", gross: 65, net: 30 },
                { month: "May", gross: 89, net: 42 },
                { month: "Jun", gross: 110, net: 55 },
                { month: "Jul", gross: 142, net: 70 }
              ].map((bar, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-2 group cursor-pointer">
                  <div className="w-full bg-slate-50 rounded-xl p-1 flex flex-col justify-end h-44 relative overflow-hidden group-hover:bg-slate-100 transition-colors">
                    <div
                      style={{ height: `${bar.gross}%` }}
                      className="w-full bg-gradient-to-t from-emerald-600 to-emerald-400 rounded-lg transition-all relative"
                    >
                      <div
                        style={{ height: `${(bar.net / bar.gross) * 100}%` }}
                        className="w-full bg-indigo-600/70 rounded-b-lg absolute bottom-0"
                      ></div>
                    </div>
                  </div>
                  <span className="text-xs font-semibold text-slate-600 group-hover:text-slate-900">{bar.month}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>Highest Revenue: ₹1,42,850 (July)</span>
            <span className="font-semibold text-emerald-600">+34.8% Year-over-Year Growth</span>
          </div>
        </div>

        {/* Weekly Sales Breakdown */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm flex flex-col justify-between">
          <div className="border-b border-slate-100 pb-4">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Calendar className="w-4 h-4 text-indigo-600" /> Weekly Sales Volume
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">Daily order distribution across key categories</p>
          </div>

          <div className="py-4 space-y-4">
            {[
              { day: "Monday", count: 48, percentage: 80, color: "bg-indigo-600" },
              { day: "Tuesday", count: 62, percentage: 95, color: "bg-emerald-600" },
              { day: "Wednesday", count: 39, percentage: 65, color: "bg-blue-600" },
              { day: "Thursday", count: 54, percentage: 85, color: "bg-purple-600" },
              { day: "Friday", count: 71, percentage: 100, color: "bg-amber-500" },
              { day: "Weekend", count: 88, percentage: 110, color: "bg-rose-500" }
            ].map((item, idx) => (
              <div key={idx} className="space-y-1">
                <div className="flex justify-between text-xs font-medium">
                  <span className="text-slate-700">{item.day}</span>
                  <span className="text-slate-900 font-bold">{item.count} orders</span>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div className={`h-full ${item.color} rounded-full transition-all`} style={{ width: `${item.percentage}%` }}></div>
                </div>
              </div>
            ))}
          </div>

          <div className="pt-4 border-t border-slate-100 text-center">
            <span className="text-xs text-slate-500">Peak ordering windows: <strong className="text-slate-900">7 PM – 10 PM IST</strong></span>
          </div>
        </div>
      </div>

      {/* Grid Row: Top Selling Products & Customer Growth & Seller Performance */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Top Selling Products */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
          <div className="flex justify-between items-center border-b border-slate-100 pb-3">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-500" /> Top Selling Candles
            </h3>
            <span className="text-xs font-semibold text-indigo-600 hover:underline cursor-pointer">View All Catalog</span>
          </div>

          <div className="divide-y divide-slate-100">
            {products.slice(0, 4).map((p, idx) => (
              <div key={p.id} className="py-3 flex items-center gap-3 first:pt-0 last:pb-0">
                <span className="text-xs font-bold text-slate-400 w-4">#{idx + 1}</span>
                <img src={p.images[0]} alt={p.name} className="w-10 h-10 rounded-xl object-cover border border-slate-200" />
                <div className="flex-1 min-w-0">
                  <h4 className="text-xs font-bold text-slate-900 truncate">{p.name}</h4>
                  <p className="text-[11px] text-slate-500 truncate">{p.category} • {p.waxType}</p>
                </div>
                <div className="text-right">
                  <span className="text-xs font-bold text-slate-900">₹{p.price}</span>
                  <span className="text-[10px] text-emerald-600 block font-semibold">{p.reviewsCount * 3} sold</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Best Collections & Customer Growth */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
          <div className="flex justify-between items-center border-b border-slate-100 pb-3">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Layers className="w-4 h-4 text-indigo-600" /> Best Collections
            </h3>
            <span className="text-xs font-semibold text-slate-500">8 Total</span>
          </div>

          <div className="space-y-3">
            {collections.slice(0, 4).map((col) => (
              <div key={col.id} className="p-3 rounded-xl border border-slate-100 bg-slate-50/50 flex items-center justify-between hover:bg-slate-100/80 transition-colors">
                <div className="flex items-center gap-3">
                  <span className="text-lg">{col.iconSymbol}</span>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">{col.name}</h4>
                    <p className="text-[10px] text-slate-500">{col.description.substring(0, 32)}...</p>
                  </div>
                </div>
                <span className="text-xs font-semibold text-indigo-700 bg-indigo-50 border border-indigo-100 px-2 py-1 rounded-lg">
                  {col.isFeatured ? "Featured" : "Standard"}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Seller Performance Table */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
          <div className="flex justify-between items-center border-b border-slate-100 pb-3">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Store className="w-4 h-4 text-emerald-600" /> Seller Performance
            </h3>
            <span className="text-xs font-semibold text-slate-500">Commission: 12%</span>
          </div>

          <div className="space-y-3">
            {sellers.map((s) => (
              <div key={s.id} className="p-3 rounded-xl border border-slate-100 flex items-center justify-between">
                <div className="min-w-0 flex-1 pr-2">
                  <div className="flex items-center gap-1.5">
                    <h4 className="text-xs font-bold text-slate-900 truncate">{s.storeName}</h4>
                    {s.status === "VERIFIED" ? (
                      <CheckCircle2 className="w-3 h-3 text-emerald-600 shrink-0" />
                    ) : (
                      <span className="text-[9px] bg-amber-100 text-amber-800 px-1.5 py-0.5 rounded font-bold">Pending</span>
                    )}
                  </div>
                  <p className="text-[10px] text-slate-500">{s.email}</p>
                </div>
                <div className="text-right">
                  <span className="text-xs font-bold text-slate-900 block">₹{s.totalSales.toLocaleString()}</span>
                  <span className="text-[10px] text-indigo-600 font-semibold">{s.productsCount} Products</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Grid: Recent Orders Timeline & Live Activity Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Orders Timeline */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
          <div className="flex justify-between items-center border-b border-slate-100 pb-3">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <ShoppingBag className="w-4 h-4 text-indigo-600" /> Recent Orders Timeline
            </h3>
            <span className="text-xs font-semibold text-slate-500">Live Sync</span>
          </div>

          <div className="space-y-4 relative before:absolute before:left-3.5 before:top-3 before:bottom-3 before:w-0.5 before:bg-slate-200">
            {orders.slice(0, 4).map((ord) => (
              <div key={ord.id} className="flex gap-4 relative">
                <div className="w-7 h-7 rounded-full bg-indigo-50 border border-indigo-200 flex items-center justify-center text-indigo-600 font-bold text-xs shrink-0 z-10">
                  📦
                </div>
                <div className="flex-1 bg-slate-50/70 p-3 rounded-xl border border-slate-100 flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-slate-900">{ord.id}</span>
                      <span className="text-[10px] text-slate-500">• {ord.customerName}</span>
                    </div>
                    <p className="text-[11px] text-slate-600 mt-0.5">{ord.itemsSummary}</p>
                    <span className="text-[10px] text-slate-400 mt-1 block">{ord.date}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-bold text-slate-900 block">₹{ord.totalAmount}</span>
                    <span className="text-[10px] bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded-full font-semibold">
                      {ord.status}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Live Activity Feed */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
          <div className="flex justify-between items-center border-b border-slate-100 pb-3">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Activity className="w-4 h-4 text-emerald-600" /> Live Audit & Activity Stream
            </h3>
            <span className="text-xs text-emerald-600 font-bold flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span> Streaming
            </span>
          </div>

          <div className="space-y-3">
            {recentActivityLogs.map((log) => (
              <div key={log.id} className="p-3 rounded-xl border border-slate-100 flex items-center justify-between hover:bg-slate-50 transition-colors">
                <div className="flex items-center gap-3">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md border ${log.color}`}>
                    {log.tag}
                  </span>
                  <p className="text-xs font-medium text-slate-800">{log.text}</p>
                </div>
                <span className="text-[10px] text-slate-400 font-mono shrink-0 ml-2">{log.time}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
