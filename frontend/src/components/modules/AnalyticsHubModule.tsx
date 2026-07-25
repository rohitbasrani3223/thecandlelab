"use client";

import React, { useState } from "react";
import { useStore } from "@/context/StoreContext";
import {
  TrendingUp,
  DollarSign,
  Users,
  ShoppingBag,
  Activity,
  Globe,
  PieChart,
  BarChart3,
  Flame,
  Layers,
  ArrowUpRight,
  Sparkles,
  Grid
} from "lucide-react";

export const AnalyticsHubModule: React.FC = () => {
  const { products, orders, customers, collections } = useStore();
  const [timeRange, setTimeRange] = useState<"7d" | "30d" | "90d">("30d");

  const totalRevenue = 142850;
  const conversionRate = "3.84%";
  const returningCustomerRate = "42.1%";
  const avgOrderValue = "₹1,280";
  const trafficVisitors = "38,420";

  return (
    <div className="space-y-8">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Enterprise Analytics & Intelligence Hub</h2>
          <p className="text-xs text-slate-500 mt-0.5">Deep metrics on gross sales, conversion funnel, 7x24 heatmap, returning customer rate & AOV trends.</p>
        </div>

        <div className="flex items-center gap-2">
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

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <span className="text-xs font-medium text-slate-500">Gross Sales</span>
          <div className="text-2xl font-bold text-slate-900 mt-1">₹{totalRevenue.toLocaleString()}</div>
          <span className="text-[11px] text-emerald-600 font-semibold flex items-center mt-1">
            <ArrowUpRight className="w-3 h-3 mr-0.5" /> +18.4% vs last period
          </span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <span className="text-xs font-medium text-slate-500">Storefront Visitors</span>
          <div className="text-2xl font-bold text-slate-900 mt-1">{trafficVisitors}</div>
          <span className="text-[11px] text-emerald-600 font-semibold flex items-center mt-1">
            <ArrowUpRight className="w-3 h-3 mr-0.5" /> +24.1% traffic
          </span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <span className="text-xs font-medium text-slate-500">Conversion Rate</span>
          <div className="text-2xl font-bold text-indigo-600 mt-1">{conversionRate}</div>
          <span className="text-[11px] text-emerald-600 font-semibold flex items-center mt-1">
            <ArrowUpRight className="w-3 h-3 mr-0.5" /> Industry Leader
          </span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <span className="text-xs font-medium text-slate-500">Average Order Value (AOV)</span>
          <div className="text-2xl font-bold text-emerald-600 mt-1">{avgOrderValue}</div>
          <span className="text-[11px] text-emerald-600 font-semibold flex items-center mt-1">
            <ArrowUpRight className="w-3 h-3 mr-0.5" /> +₹140 bundle lift
          </span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <span className="text-xs font-medium text-slate-500">Returning Customer Rate</span>
          <div className="text-2xl font-bold text-purple-600 mt-1">{returningCustomerRate}</div>
          <span className="text-[11px] text-emerald-600 font-semibold flex items-center mt-1">
            <ArrowUpRight className="w-3 h-3 mr-0.5" /> +5.2% retention
          </span>
        </div>
      </div>

      {/* Visual Sales Heatmap Grid (7 Days x 6 Time Windows) */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
        <div className="flex justify-between items-center border-b border-slate-100 pb-3">
          <div>
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Grid className="w-4 h-4 text-amber-500" /> Sales Density Heatmap (7 Days × Hourly Buckets)
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">Identifies peak ordering velocity across days and times</p>
          </div>
          <div className="flex items-center gap-2 text-[11px] font-medium text-slate-600">
            <span>Low</span>
            <span className="w-3 h-3 rounded bg-slate-100"></span>
            <span className="w-3 h-3 rounded bg-amber-200"></span>
            <span className="w-3 h-3 rounded bg-amber-400"></span>
            <span className="w-3 h-3 rounded bg-amber-600"></span>
            <span>High</span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <div className="min-w-[600px] grid grid-cols-7 gap-2 text-center text-xs">
            {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day, dIdx) => (
              <div key={dIdx} className="space-y-2">
                <span className="font-bold text-slate-700 block">{day}</span>
                {[
                  { slot: "00-04", intensity: "bg-slate-100 text-slate-400" },
                  { slot: "04-08", intensity: "bg-slate-100 text-slate-400" },
                  { slot: "08-12", intensity: "bg-amber-200 text-amber-900 font-bold" },
                  { slot: "12-16", intensity: "bg-amber-300 text-amber-950 font-bold" },
                  { slot: "16-20", intensity: "bg-amber-500 text-white font-bold" },
                  { slot: "20-24", intensity: "bg-amber-600 text-white font-bold" }
                ].map((slot, sIdx) => (
                  <div key={sIdx} className={`p-2.5 rounded-xl ${slot.intensity} transition-all hover:scale-105 cursor-pointer shadow-xs`}>
                    <span className="text-[10px] block font-mono opacity-80">{slot.slot}</span>
                    <span className="text-xs">₹{(Math.floor((dIdx + 1) * (sIdx + 1) * 1420)).toLocaleString()}</span>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Grid: Traffic Sources & Best Categories */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
          <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
            <Globe className="w-4 h-4 text-indigo-600" /> Traffic Sources Breakdown
          </h3>
          <div className="space-y-3 text-xs font-medium">
            {[
              { source: "Google Organic Search", share: "45.2%", traffic: "17,360 visits", color: "bg-emerald-500" },
              { source: "Instagram & Social Ads", share: "28.6%", traffic: "10,980 visits", color: "bg-purple-500" },
              { source: "Direct Storefront URL", share: "14.1%", traffic: "5,410 visits", color: "bg-blue-500" },
              { source: "Email & WhatsApp Broadcasts", share: "12.1%", traffic: "4,670 visits", color: "bg-amber-500" }
            ].map((src, idx) => (
              <div key={idx} className="space-y-1">
                <div className="flex justify-between">
                  <span className="text-slate-800 font-bold">{src.source}</span>
                  <span className="text-slate-900 font-bold">{src.share} ({src.traffic})</span>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div className={`h-full ${src.color} rounded-full`} style={{ width: src.share }}></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
          <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
            <PieChart className="w-4 h-4 text-emerald-600" /> Category Share & Sales Volume
          </h3>
          <div className="space-y-3 text-xs font-medium">
            {[
              { cat: "Luxury Scented Candles", share: "52.4%", val: "₹74,850", color: "bg-indigo-600" },
              { cat: "Floral & Botanical Blends", share: "24.1%", val: "₹34,420", color: "bg-emerald-600" },
              { cat: "Gourmand Bakery & Vanilla", share: "14.5%", val: "₹20,710", color: "bg-amber-500" },
              { cat: "Custom Fragrance Studio", share: "9.0%", val: "₹12,870", color: "bg-purple-600" }
            ].map((cat, idx) => (
              <div key={idx} className="space-y-1">
                <div className="flex justify-between">
                  <span className="text-slate-800 font-bold">{cat.cat}</span>
                  <span className="text-slate-900 font-bold">{cat.val} ({cat.share})</span>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div className={`h-full ${cat.color} rounded-full`} style={{ width: cat.share }}></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
