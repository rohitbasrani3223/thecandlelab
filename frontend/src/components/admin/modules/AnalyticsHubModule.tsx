"use client";

import React, { useState } from "react";
import { useStore } from "@/context/StoreContext";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import {
  TrendingUp, TrendingDown, DollarSign, ShoppingBag, Users,
  BarChart3, ArrowUpRight, ArrowDownRight, RefreshCw, Download,
  Package, Star, Sparkles
} from "lucide-react";

const FONT = { fontFamily: "Inter, system-ui, sans-serif" };

export const AnalyticsHubModule: React.FC = () => {
  const { orders, products, customers } = useStore();
  const [period, setPeriod] = useState<"7d" | "30d" | "90d">("30d");

  const totalRevenue = orders.reduce((s, o) => o.paymentStatus === "Paid" ? s + o.totalAmount : s, 142850);
  const avgOrderValue = orders.length > 0 ? Math.round(totalRevenue / orders.length) : 0;
  const conversionRate = 3.2;
  const returnRate = 1.8;

  const kpis = [
    { label: "Total Revenue", value: `₹${totalRevenue.toLocaleString()}`, change: "+18.4%", positive: true, icon: DollarSign, color: "text-emerald-600", bg: "bg-emerald-50" },
    { label: "Total Orders", value: orders.length, change: "+12.1%", positive: true, icon: ShoppingBag, color: "text-indigo-600", bg: "bg-indigo-50" },
    { label: "Avg. Order Value", value: `₹${avgOrderValue.toLocaleString()}`, change: "+5.3%", positive: true, icon: BarChart3, color: "text-blue-600", bg: "bg-blue-50" },
    { label: "Active Customers", value: customers.filter(c => !c.isBlocked).length, change: "+24.5%", positive: true, icon: Users, color: "text-sky-600", bg: "bg-sky-50" },
    { label: "Conversion Rate", value: `${conversionRate}%`, change: "+0.4%", positive: true, icon: TrendingUp, color: "text-teal-600", bg: "bg-teal-50" },
    { label: "Return Rate", value: `${returnRate}%`, change: "-0.2%", positive: true, icon: TrendingDown, color: "text-amber-600", bg: "bg-amber-50" },
  ];

  const topProducts = products
    .sort((a, b) => (b.reviewsCount || 0) - (a.reviewsCount || 0))
    .slice(0, 5);

  const channelData = [
    { channel: "Organic Search", sessions: 8420, revenue: "₹52,800", conversion: "4.1%", share: 40 },
    { channel: "Direct / Brand", sessions: 5240, revenue: "₹38,200", conversion: "3.8%", share: 28 },
    { channel: "Instagram Ads", sessions: 3180, revenue: "₹24,100", conversion: "2.9%", share: 18 },
    { channel: "WhatsApp Campaign", sessions: 1890, revenue: "₹18,500", conversion: "5.2%", share: 10 },
    { channel: "Email Marketing", sessions: 720, revenue: "₹9,250", conversion: "6.1%", share: 4 },
  ];

  return (
    <div style={FONT} className="space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-[#0F172A]">Analytics & Business Intelligence</h1>
          <p className="text-sm text-[#64748B] mt-0.5">Performance metrics across all revenue channels</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center bg-[#F1F5F9] rounded-xl p-1 gap-0.5 border border-[#E2E8F0]">
            {(["7d", "30d", "90d"] as const).map((r) => (
              <button key={r} onClick={() => setPeriod(r)}
                className={`px-3 py-1.5 rounded-lg text-[12px] font-semibold transition-all ${period === r ? "bg-white text-[#0F172A] shadow-sm border border-[#E2E8F0]" : "text-[#64748B]"}`}>
                {r === "7d" ? "7 days" : r === "30d" ? "30 days" : "90 days"}
              </button>
            ))}
          </div>
          <Button variant="secondary" size="sm" leftIcon={<Download className="w-3.5 h-3.5" />}>Export</Button>
        </div>
      </div>

      {/* KPI Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        {kpis.map((k) => {
          const Icon = k.icon;
          return (
            <Card key={k.label} padding="md" hover>
              <div className="flex items-start justify-between">
                <div className={`w-9 h-9 rounded-xl ${k.bg} flex items-center justify-center`}>
                  <Icon className={`${k.color}`} style={{ width: 18, height: 18 }} />
                </div>
                <span className={`text-[11px] font-bold flex items-center gap-0.5 ${k.positive ? "text-emerald-600" : "text-red-500"}`}>
                  {k.positive ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                  {k.change}
                </span>
              </div>
              <p className="text-[22px] font-bold text-[#0F172A] mt-3 leading-none">{k.value}</p>
              <p className="text-[12px] font-medium text-[#475569] mt-1">{k.label}</p>
            </Card>
          );
        })}
      </div>

      {/* Revenue Chart Placeholder */}
      <Card padding="none" className="overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#E2E8F0]">
          <div className="flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-[#6366F1]" />
            <h2 className="text-sm font-semibold text-[#0F172A]">Revenue Trend</h2>
          </div>
          <Badge variant="indigo">Live Data</Badge>
        </div>
        <div className="p-5">
          {/* Bar Chart Visual */}
          <div className="flex items-end gap-2 h-36">
            {[65, 82, 45, 90, 72, 95, 88, 76, 83, 91, 78, 100].map((v, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-1">
                <div
                  style={{ height: `${v}%` }}
                  className={`w-full rounded-t-lg transition-all duration-500 ${i === 11 ? "bg-[#6366F1]" : "bg-[#EEF2FF] hover:bg-[#C7D2FE]"}`}
                />
                <span className="text-[9px] text-[#94A3B8] hidden sm:block">
                  {["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"][i]}
                </span>
              </div>
            ))}
          </div>
        </div>
      </Card>

      {/* Bottom: Traffic + Top Products */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">

        {/* Traffic Sources — 3 cols */}
        <Card padding="none" className="lg:col-span-3 overflow-hidden">
          <div className="px-5 py-4 border-b border-[#E2E8F0]">
            <h2 className="text-sm font-semibold text-[#0F172A]">Traffic Sources & Revenue</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full" style={FONT}>
              <thead>
                <tr className="bg-[#F8FAFC] border-b border-[#E2E8F0]">
                  {["Channel", "Sessions", "Revenue", "Conv. Rate", "Share"].map((h) => (
                    <th key={h} className="px-4 py-3 text-left text-[11px] font-semibold text-[#94A3B8] uppercase tracking-wider whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F1F5F9]">
                {channelData.map((row) => (
                  <tr key={row.channel} className="hover:bg-[#F8FAFC]">
                    <td className="px-4 py-3"><span className="text-[13px] font-semibold text-[#0F172A]">{row.channel}</span></td>
                    <td className="px-4 py-3"><span className="text-[12px] text-[#64748B]">{row.sessions.toLocaleString()}</span></td>
                    <td className="px-4 py-3"><span className="text-[12px] font-bold text-[#0F172A]">{row.revenue}</span></td>
                    <td className="px-4 py-3"><span className="text-[12px] text-emerald-600 font-bold">{row.conversion}</span></td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="flex-1 h-1.5 bg-[#F1F5F9] rounded-full overflow-hidden">
                          <div className="h-full bg-[#6366F1] rounded-full" style={{ width: `${row.share}%` }} />
                        </div>
                        <span className="text-[11px] text-[#94A3B8] w-8">{row.share}%</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        {/* Top Products — 2 cols */}
        <Card padding="none" className="lg:col-span-2 overflow-hidden">
          <div className="flex items-center gap-2 px-5 py-4 border-b border-[#E2E8F0]">
            <Sparkles className="w-4 h-4 text-[#F59E0B]" />
            <h2 className="text-sm font-semibold text-[#0F172A]">Top SKUs by Revenue</h2>
          </div>
          <ul className="divide-y divide-[#F1F5F9]">
            {topProducts.map((p, i) => (
              <li key={p.id} className="flex items-center gap-3 px-5 py-3.5 hover:bg-[#F8FAFC]">
                <span className="text-[11px] font-bold text-[#94A3B8] w-4 shrink-0">#{i + 1}</span>
                <div className="w-9 h-9 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] overflow-hidden shrink-0">
                  <img src={p.images[0]} alt={p.name} className="w-full h-full object-cover" onError={(e) => { (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1603006905003-be475563bc59?w=80"; }} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[12px] font-semibold text-[#0F172A] truncate">{p.name}</p>
                  <div className="flex items-center gap-1 mt-0.5">
                    <Star className="w-3 h-3 text-[#F59E0B] fill-[#F59E0B]" />
                    <span className="text-[11px] text-[#64748B]">{p.rating}</span>
                  </div>
                </div>
                <span className="text-[12px] font-bold text-[#0F172A] shrink-0">₹{p.price.toLocaleString()}</span>
              </li>
            ))}
          </ul>
        </Card>
      </div>
    </div>
  );
};
