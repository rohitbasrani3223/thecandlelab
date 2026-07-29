"use client";

import { motion } from "framer-motion";
import { TrendingUp, BarChart3, PieChart, Users, DollarSign, ArrowUpRight } from "lucide-react";
import { formatPrice } from "@/lib/utils";

const MONTHLY_REVENUE = [
  { month: "Sep", revenue: 120000 },
  { month: "Oct", revenue: 165000 },
  { month: "Nov", revenue: 210000 },
  { month: "Dec", revenue: 340000 },
  { month: "Jan", revenue: 209800 },
  { month: "Feb", revenue: 248590 },
];

const TOP_SCENTS = [
  { name: "Amber & Sandalwood", percentage: 34, color: "#C4964A" },
  { name: "Vanilla & Oak", percentage: 26, color: "#D4A96A" },
  { name: "Lavender & Bergamot", percentage: 22, color: "#A87B32" },
  { name: "Jasmine & Rose", percentage: 18, color: "#8B5E3C" },
];

export default function AdminAnalyticsPage() {
  const maxRevenue = Math.max(...MONTHLY_REVENUE.map((r) => r.revenue));

  return (
    <div className="space-y-8">
      <div>
        <h1
          className="text-3xl font-medium text-[#F5EFE4]"
          style={{ fontFamily: "Cormorant Garamond, Georgia, serif" }}
        >
          Analytics & Performance
        </h1>
        <p className="text-xs text-[#8B7355] mt-1">
          Detailed sales trends, fragrance preferences, and revenue insights.
        </p>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        {[
          { label: "Average Order Value (AOV)", value: "₹1,750", sub: "+8.2% this month" },
          { label: "Conversion Rate", value: "3.42%", sub: "+0.6% vs industry avg" },
          { label: "Customer Repeat Rate", value: "41.8%", sub: "84 repeat candle buyers" },
        ].map((m) => (
          <div
            key={m.label}
            className="p-5 rounded-2xl border border-[#2A1D13]"
            style={{ background: "#140D07" }}
          >
            <p className="text-xs text-[#8B7355] uppercase font-semibold tracking-wider">
              {m.label}
            </p>
            <p className="text-3xl font-bold text-[#F5EFE4] my-2">{m.value}</p>
            <p className="text-xs text-[#4ADE80] font-medium flex items-center gap-1">
              <ArrowUpRight size={12} />
              {m.sub}
            </p>
          </div>
        ))}
      </div>

      {/* Monthly Revenue Bar Chart */}
      <div
        className="p-6 rounded-2xl border border-[#2A1D13] space-y-6"
        style={{ background: "#140D07" }}
      >
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-[#F5EFE4]">Monthly Revenue Trend</h2>
            <p className="text-xs text-[#8B7355]">6-month sales growth history</p>
          </div>
          <span className="text-xs font-semibold text-[#C4964A] bg-[#C4964A]/10 px-3 py-1 rounded-full border border-[#C4964A]/20">
            Total: ₹12,93,390
          </span>
        </div>

        {/* Bars */}
        <div className="h-48 flex items-end justify-between gap-3 pt-6 border-b border-[#2A1D13]">
          {MONTHLY_REVENUE.map((item) => {
            const heightPercent = (item.revenue / maxRevenue) * 100;
            return (
              <div key={item.month} className="flex-1 flex flex-col items-center gap-2 group h-full justify-end">
                <span className="text-[10px] text-[#A08060] opacity-0 group-hover:opacity-100 transition-opacity">
                  {formatPrice(item.revenue)}
                </span>
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: `${heightPercent}%` }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                  className="w-full max-w-12 rounded-t-lg bg-gradient-to-t from-[#A87B32] to-[#C4964A] group-hover:to-[#E5B86C] transition-all"
                />
                <span className="text-xs text-[#8B7355] font-medium">{item.month}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Fragrance Share */}
      <div
        className="p-6 rounded-2xl border border-[#2A1D13] space-y-4"
        style={{ background: "#140D07" }}
      >
        <h2 className="text-lg font-semibold text-[#F5EFE4]">Best-Selling Scent Families</h2>
        <div className="space-y-3">
          {TOP_SCENTS.map((scent) => (
            <div key={scent.name} className="space-y-1">
              <div className="flex justify-between text-xs">
                <span className="text-[#F5EFE4] font-medium">{scent.name}</span>
                <span className="text-[#C4964A] font-semibold">{scent.percentage}%</span>
              </div>
              <div className="h-2 rounded-full bg-[#1F140B] overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${scent.percentage}%` }}
                  transition={{ duration: 0.6 }}
                  className="h-full rounded-full"
                  style={{ background: scent.color }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
