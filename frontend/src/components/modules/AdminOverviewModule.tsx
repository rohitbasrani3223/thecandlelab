"use client";

import React, { useState, useEffect } from "react";
import { useStore } from "@/context/StoreContext";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { Skeleton } from "@/components/ui/Skeleton";
import { AIInsightBanner } from "@/components/ui/AIInsightBanner";
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
  RefreshCw,
  Zap,
  Filter
} from "lucide-react";

export const AdminOverviewModule: React.FC = () => {
  const { products, orders, customers, sellers, collections, showToast } = useStore();
  const [timeRange, setTimeRange] = useState<"7d" | "30d" | "90d">("30d");
  const [isLoading, setIsLoading] = useState(true);

  // Skeleton loading simulation
  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 300);
    return () => clearTimeout(timer);
  }, []);

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
    { label: "Total Revenue", value: `₹${totalRevenue.toLocaleString()}`, change: "+18.4%", isPositive: true, icon: DollarSign, color: "text-emerald-600 bg-emerald-50 border-emerald-200" },
    { label: "Today's Sales", value: `₹${todaysSales.toLocaleString()}`, change: "+12.2%", isPositive: true, icon: TrendingUp, color: "text-blue-600 bg-blue-50 border-blue-200" },
    { label: "Orders Today", value: ordersToday, change: "+4 new", isPositive: true, icon: ShoppingBag, color: "text-indigo-600 bg-indigo-50 border-indigo-200" },
    { label: "Pending Orders", value: pendingOrders, change: "Action Required", isPositive: false, icon: Clock, color: "text-amber-600 bg-amber-50 border-amber-200" },
    { label: "Delivered Orders", value: deliveredOrders, change: "98.2% SLA", isPositive: true, icon: CheckCircle2, color: "text-emerald-600 bg-emerald-50 border-emerald-200" },
    { label: "Cancelled Orders", value: cancelledOrders, change: "-1.1%", isPositive: true, icon: XCircle, color: "text-rose-600 bg-rose-50 border-rose-200" },
    { label: "Refund Requests", value: refundRequests, change: "1 In Review", isPositive: false, icon: RotateCcw, color: "text-purple-600 bg-purple-50 border-purple-200" },
    { label: "Active Customers", value: activeCustomers, change: "+24.5%", isPositive: true, icon: Users, color: "text-sky-600 bg-sky-50 border-sky-200" },
    { label: "New Customers", value: newCustomersCount, change: "This Week", isPositive: true, icon: UserPlus, color: "text-teal-600 bg-teal-50 border-teal-200" },
    { label: "Active Sellers", value: activeSellersCount, change: "1 Pending", isPositive: true, icon: Store, color: "text-indigo-600 bg-indigo-50 border-indigo-200" },
    { label: "Total Products", value: totalProductsCount, change: "4 Collections", isPositive: true, icon: Package, color: "text-slate-600 bg-slate-50 border-slate-200" },
    { label: "Low Stock Products", value: lowStockProductsCount, change: "Restock Soon", isPositive: false, icon: AlertTriangle, color: "text-amber-600 bg-amber-50 border-amber-200" },
    { label: "Out of Stock Products", value: outOfStockProductsCount, change: "Needs Action", isPositive: false, icon: Flame, color: "text-rose-600 bg-rose-50 border-rose-200" }
  ];

  const recentActivityLogs = [
    { id: "act-1", text: "Order #ORD-94821 placed by Aarav Sharma", time: "2 mins ago", tag: "Order", variant: "emerald" as const },
    { id: "act-2", text: "Seller 'Botanical Aromas India' requested KYB verification", time: "14 mins ago", tag: "KYB", variant: "amber" as const },
    { id: "act-3", text: "Low stock alert: Madagascar Vanilla (4 units remaining)", time: "32 mins ago", tag: "Inventory", variant: "rose" as const },
    { id: "act-4", text: "Coupon code 'LUXURY20' redeemed by Priya Patel", time: "1 hour ago", tag: "Promo", variant: "indigo" as const },
    { id: "act-5", text: "Payout of ₹14,200 issued to Artisan Wax Crafters", time: "2 hours ago", tag: "Payout", variant: "purple" as const }
  ];

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Top AI Forecast & Intelligence Banner */}
      <AIInsightBanner
        onAction={() => showToast("Auto-draft reorder for 50 units generated 🚀")}
      />

      {/* Overview Top Header bar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs">
        <div>
          <div className="flex items-center gap-2">
            <Badge variant="emerald" pulse>Live OS Command Stream</Badge>
            <span className="text-xs text-slate-400 font-mono">NODE: HQ-MUMBAI-01</span>
          </div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight mt-1">Executive Command Center</h2>
          <p className="text-xs text-slate-500">Real-time financial metrics, inventory health, vendor approvals & conversion intelligence.</p>
        </div>

        <div className="flex items-center gap-2 self-stretch sm:self-auto">
          <div className="inline-flex rounded-xl bg-slate-100 p-1 border border-slate-200 text-xs font-medium">
            {(["7d", "30d", "90d"] as const).map((range) => (
              <button
                key={range}
                onClick={() => setTimeRange(range)}
                className={`px-3 py-1.5 rounded-lg transition-all ${
                  timeRange === range ? "bg-white text-slate-900 shadow-2xs font-bold" : "text-slate-600 hover:text-slate-900"
                }`}
              >
                {range === "7d" ? "7 Days" : range === "30d" ? "30 Days" : "90 Days"}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 13 KPI Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {isLoading
          ? Array.from({ length: 10 }).map((_, i) => (
              <Card key={i} padding="sm">
                <Skeleton height="h-3" width="w-24" />
                <Skeleton height="h-7" width="w-32" className="mt-3" />
                <Skeleton height="h-3" width="w-20" className="mt-2" />
              </Card>
            ))
          : kpiCards.map((kpi, idx) => {
              const IconComp = kpi.icon;
              return (
                <Card key={idx} padding="sm" className="flex flex-col justify-between group">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-slate-500">{kpi.label}</span>
                    <div className={`p-2 rounded-xl border ${kpi.color} group-hover:scale-105 transition-transform`}>
                      <IconComp className="w-4 h-4" />
                    </div>
                  </div>
                  <div className="mt-3">
                    <div className="text-2xl font-bold text-slate-900 tracking-tight">{kpi.value}</div>
                    <div className="flex items-center gap-1 mt-1 text-[11px] font-medium">
                      {kpi.isPositive ? (
                        <span className="text-emerald-600 flex items-center font-bold">
                          <ArrowUpRight className="w-3 h-3 mr-0.5" />
                          {kpi.change}
                        </span>
                      ) : (
                        <span className="text-amber-600 flex items-center font-bold">
                          <ArrowDownRight className="w-3 h-3 mr-0.5" />
                          {kpi.change}
                        </span>
                      )}
                      <span className="text-slate-400">vs prev period</span>
                    </div>
                  </div>
                </Card>
              );
            })}
      </div>

      {/* Charts Section: Monthly Revenue & Weekly Sales */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Monthly Revenue Graph */}
        <Card padding="md" className="lg:col-span-2 flex flex-col justify-between">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Activity className="w-4 h-4 text-emerald-600" /> Monthly Revenue Trend
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">Gross sales vs platform net commission over the fiscal quarter</p>
            </div>
            <div className="flex items-center gap-4 text-xs">
              <span className="flex items-center gap-1.5 font-medium text-slate-700">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span> Gross Revenue
              </span>
              <span className="flex items-center gap-1.5 font-medium text-slate-700">
                <span className="w-2.5 h-2.5 rounded-full bg-indigo-500"></span> Platform Net
              </span>
            </div>
          </div>

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
                      className="w-full bg-gradient-to-t from-emerald-600 to-emerald-400 rounded-lg transition-all relative shadow-xs"
                    >
                      <div
                        style={{ height: `${(bar.net / bar.gross) * 100}%` }}
                        className="w-full bg-indigo-600/80 rounded-b-lg absolute bottom-0"
                      ></div>
                    </div>
                  </div>
                  <span className="text-xs font-semibold text-slate-600 group-hover:text-slate-900">{bar.month}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>Highest Monthly Volume: <strong className="text-slate-900">₹1,42,850</strong></span>
            <span className="font-semibold text-emerald-600">+34.8% YoY Expansion</span>
          </div>
        </Card>

        {/* Weekly Sales Volume */}
        <Card padding="md" className="flex flex-col justify-between">
          <div className="border-b border-slate-100 pb-4">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Calendar className="w-4 h-4 text-indigo-600" /> Weekly Sales Volume
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">Order velocity distribution across weekdays</p>
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
            <span className="text-xs text-slate-500">Peak ordering window: <strong className="text-slate-900">7 PM – 10 PM IST</strong></span>
          </div>
        </Card>
      </div>

      {/* Grid Row: Top Selling Products & Customer Growth & Seller Performance */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card padding="md" className="space-y-4">
          <div className="flex justify-between items-center border-b border-slate-100 pb-3">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-500" /> Top Selling Candles
            </h3>
            <Badge variant="indigo">High Demand</Badge>
          </div>

          <div className="divide-y divide-slate-100">
            {products.slice(0, 4).map((p, idx) => (
              <div key={p.id} className="py-3 flex items-center gap-3 first:pt-0 last:pb-0">
                <span className="text-xs font-bold text-slate-400 w-4">#{idx + 1}</span>
                <img src={p.images[0]} alt={p.name} className="w-10 h-10 rounded-xl object-cover border border-slate-200 shrink-0" />
                <div className="flex-1 min-w-0">
                  <h4 className="text-xs font-bold text-slate-900 truncate">{p.name}</h4>
                  <p className="text-[11px] text-slate-500 truncate">{p.category} • {p.waxType}</p>
                </div>
                <div className="text-right shrink-0">
                  <span className="text-xs font-bold text-slate-900 block">₹{p.price}</span>
                  <span className="text-[10px] text-emerald-600 font-bold">{p.reviewsCount * 3} sold</span>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card padding="md" className="space-y-4">
          <div className="flex justify-between items-center border-b border-slate-100 pb-3">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Layers className="w-4 h-4 text-indigo-600" /> Featured Collections
            </h3>
            <span className="text-xs text-slate-400 font-medium">8 Total</span>
          </div>

          <div className="space-y-2.5">
            {collections.slice(0, 4).map((col) => (
              <div key={col.id} className="p-3 rounded-xl border border-slate-100 bg-slate-50/60 flex items-center justify-between hover:bg-slate-100 transition-colors">
                <div className="flex items-center gap-2.5">
                  <span className="text-lg">{col.iconSymbol}</span>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">{col.name}</h4>
                    <p className="text-[10px] text-slate-500 truncate max-w-[140px]">{col.description}</p>
                  </div>
                </div>
                <Badge variant={col.isFeatured ? "indigo" : "slate"}>
                  {col.isFeatured ? "Featured" : "Standard"}
                </Badge>
              </div>
            ))}
          </div>
        </Card>

        <Card padding="md" className="space-y-4">
          <div className="flex justify-between items-center border-b border-slate-100 pb-3">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Store className="w-4 h-4 text-emerald-600" /> Seller Performance
            </h3>
            <span className="text-xs text-slate-400 font-medium">12% Fee</span>
          </div>

          <div className="space-y-2.5">
            {sellers.map((s) => (
              <div key={s.id} className="p-3 rounded-xl border border-slate-100 flex items-center justify-between">
                <div className="min-w-0 flex-1 pr-2">
                  <div className="flex items-center gap-1.5">
                    <h4 className="text-xs font-bold text-slate-900 truncate">{s.storeName}</h4>
                    {s.status === "VERIFIED" ? (
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    ) : (
                      <Badge variant="amber" size="xs">Pending</Badge>
                    )}
                  </div>
                  <p className="text-[10px] text-slate-500">{s.email}</p>
                </div>
                <div className="text-right shrink-0">
                  <span className="text-xs font-bold text-slate-900 block">₹{s.totalSales.toLocaleString()}</span>
                  <span className="text-[10px] text-indigo-600 font-semibold">{s.productsCount} SKUs</span>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Bottom Grid: Recent Orders & Live Audit Stream */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card padding="md" className="space-y-4">
          <div className="flex justify-between items-center border-b border-slate-100 pb-3">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <ShoppingBag className="w-4 h-4 text-indigo-600" /> Recent Orders Timeline
            </h3>
            <Badge variant="slate">Live Sync</Badge>
          </div>

          <div className="space-y-3">
            {orders.slice(0, 4).map((ord) => (
              <div key={ord.id} className="p-3 rounded-xl border border-slate-100 bg-slate-50/50 flex items-center justify-between hover:bg-slate-100/80 transition-colors">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-indigo-600 font-mono">{ord.id}</span>
                    <span className="text-xs text-slate-900 font-bold">• {ord.customerName}</span>
                  </div>
                  <p className="text-[11px] text-slate-600 mt-0.5">{ord.itemsSummary}</p>
                  <span className="text-[10px] text-slate-400">{ord.date}</span>
                </div>
                <div className="text-right shrink-0">
                  <span className="text-xs font-bold text-slate-900 block">₹{ord.totalAmount}</span>
                  <Badge variant={ord.status === "Pending" ? "amber" : "emerald"}>{ord.status}</Badge>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card padding="md" className="space-y-4">
          <div className="flex justify-between items-center border-b border-slate-100 pb-3">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Activity className="w-4 h-4 text-emerald-600" /> Live Audit Stream
            </h3>
            <Badge variant="emerald" pulse>Streaming</Badge>
          </div>

          <div className="space-y-2.5">
            {recentActivityLogs.map((log) => (
              <div key={log.id} className="p-3 rounded-xl border border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <Badge variant={log.variant} size="xs">{log.tag}</Badge>
                  <p className="text-xs font-medium text-slate-800">{log.text}</p>
                </div>
                <span className="text-[10px] text-slate-400 font-mono shrink-0 ml-2">{log.time}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};
