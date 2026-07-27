"use client";

import React, { useState } from "react";
import { useStore } from "@/context/StoreContext";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import {
  Search, Download, Mail, Phone, MapPin, UserCheck, UserX,
  Eye, ShoppingBag, Crown, Star, MoreHorizontal, Users, TrendingUp, Filter
} from "lucide-react";

const FONT = { fontFamily: "Inter, system-ui, sans-serif" };

export const CustomerCRMModule: React.FC = () => {
  const { customers, showToast } = useStore();
  const [search, setSearch] = useState("");
  const [segmentFilter, setSegmentFilter] = useState("all");
  const [drawerCustomer, setDrawerCustomer] = useState<any>(null);

  const filtered = customers.filter((c) => {
    const matchSearch = !search.trim() || c.name.toLowerCase().includes(search.toLowerCase()) || c.email.toLowerCase().includes(search.toLowerCase()) || c.phone.includes(search);
    const matchSeg = segmentFilter === "all" || (segmentFilter === "vip" && (c.totalOrders >= 5 || c.totalSpent >= 10000)) || (segmentFilter === "blocked" && c.isBlocked) || (segmentFilter === "active" && !c.isBlocked);
    return matchSearch && matchSeg;
  });

  const segments = [
    { key: "all", label: "All Customers", count: customers.length },
    { key: "active", label: "Active", count: customers.filter(c => !c.isBlocked).length },
    { key: "vip", label: "VIP / High Value", count: customers.filter(c => c.totalOrders >= 5 || c.totalSpent >= 10000).length },
    { key: "blocked", label: "Blocked", count: customers.filter(c => c.isBlocked).length },
  ];

  const stats = [
    { label: "Total Customers", value: customers.length, icon: Users, color: "text-indigo-600", bg: "bg-indigo-50" },
    { label: "Active", value: customers.filter(c => !c.isBlocked).length, icon: UserCheck, color: "text-emerald-600", bg: "bg-emerald-50" },
    { label: "VIP (₹10k+)", value: customers.filter(c => c.totalSpent >= 10000).length, icon: Crown, color: "text-amber-600", bg: "bg-amber-50" },
    { label: "Blocked", value: customers.filter(c => c.isBlocked).length, icon: UserX, color: "text-red-500", bg: "bg-red-50" },
  ];

  return (
    <div style={FONT} className="space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-[#0F172A]">Customer CRM 360°</h1>
          <p className="text-sm text-[#64748B] mt-0.5">{customers.length} customers · Full profile & order history</p>
        </div>
        <div className="flex gap-2">
          <Button variant="secondary" size="sm" leftIcon={<Download className="w-3.5 h-3.5" />}>Export CRM</Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {stats.map((s) => {
          const Icon = s.icon;
          return (
            <Card key={s.label} padding="sm" className="flex items-center gap-3">
              <div className={`w-9 h-9 rounded-xl ${s.bg} flex items-center justify-center shrink-0`}>
                <Icon className={`w-4.5 h-4.5 ${s.color}`} style={{ width: 18, height: 18 }} />
              </div>
              <div>
                <p className="text-xl font-bold text-[#0F172A] leading-none">{s.value}</p>
                <p className="text-[11px] text-[#94A3B8] mt-0.5">{s.label}</p>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Segments Tabs */}
      <div className="flex items-center gap-1 border-b border-[#E2E8F0]">
        {segments.map((seg) => (
          <button key={seg.key} onClick={() => setSegmentFilter(seg.key)}
            className={`flex items-center gap-1.5 px-3 py-2 text-[12px] font-semibold rounded-t-lg transition-all ${segmentFilter === seg.key ? "bg-[#EEF2FF] text-[#4338CA]" : "text-[#64748B] hover:text-[#0F172A]"}`}>
            {seg.label}
            <span className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold ${segmentFilter === seg.key ? "bg-[#6366F1] text-white" : "bg-[#F1F5F9] text-[#64748B]"}`}>{seg.count}</span>
          </button>
        ))}
      </div>

      {/* Search */}
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#94A3B8]" />
        <input type="text" placeholder="Search by name, email, phone..." value={search} onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-9 pr-4 py-2 bg-white border border-[#E2E8F0] rounded-xl text-[13px] placeholder-[#94A3B8] focus:outline-none focus:border-[#6366F1] focus:ring-2 focus:ring-[#EEF2FF] transition-all" />
      </div>

      {/* Table */}
      <Card padding="none" className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full" style={FONT}>
            <thead>
              <tr className="bg-[#F8FAFC] border-b border-[#E2E8F0]">
                {["Customer", "Contact", "Total Orders", "Total Spend", "Segment", "Status", ""].map((h) => (
                  <th key={h} className="px-4 py-3 text-left text-[11px] font-semibold text-[#94A3B8] uppercase tracking-wider whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F1F5F9]">
              {filtered.length === 0 ? (
                <tr><td colSpan={7} className="px-4 py-12 text-center text-[13px] text-[#94A3B8]">No customers found</td></tr>
              ) : filtered.map((c) => {
                const isVip = c.totalOrders >= 5 || c.totalSpent >= 10000;
                return (
                  <tr key={c.id} className="hover:bg-[#F8FAFC] transition-colors">
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 text-white font-bold flex items-center justify-center text-[12px] shrink-0">
                          {c.name.slice(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <p className="text-[13px] font-semibold text-[#0F172A] flex items-center gap-1">
                            {c.name}
                            {isVip && <Crown className="w-3 h-3 text-[#F59E0B]" />}
                          </p>
                          <p className="text-[11px] text-[#94A3B8]">Since {c.joinedDate || "2024"}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3.5">
                      <p className="text-[12px] text-[#475569] flex items-center gap-1"><Mail className="w-3 h-3" />{c.email}</p>
                      <p className="text-[12px] text-[#475569] flex items-center gap-1 mt-0.5"><Phone className="w-3 h-3" />{c.phone}</p>
                    </td>
                    <td className="px-4 py-3.5">
                      <span className="text-[13px] font-bold text-[#0F172A]">{c.totalOrders}</span>
                    </td>
                    <td className="px-4 py-3.5">
                      <span className="text-[13px] font-bold text-[#0F172A]">₹{c.totalSpent?.toLocaleString() || "0"}</span>
                    </td>
                    <td className="px-4 py-3.5">
                      {isVip ? <Badge variant="warning" dot>VIP</Badge> : <Badge variant="neutral" dot>Standard</Badge>}
                    </td>
                    <td className="px-4 py-3.5">
                      {c.isBlocked ? <Badge variant="danger" dot>Blocked</Badge> : <Badge variant="success" dot>Active</Badge>}
                    </td>
                    <td className="px-4 py-3.5">
                      <button onClick={() => setDrawerCustomer(c)}
                        className="p-1.5 rounded-lg text-[#94A3B8] hover:text-[#6366F1] hover:bg-[#EEF2FF] transition-colors">
                        <Eye className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <div className="px-4 py-3 border-t border-[#E2E8F0]">
          <p className="text-[12px] text-[#94A3B8]">Showing {filtered.length} of {customers.length} customers</p>
        </div>
      </Card>

      {/* Customer Detail Drawer */}
      {drawerCustomer && (
        <div className="fixed inset-0 z-50 flex">
          <div className="flex-1 bg-black/40 backdrop-blur-sm" onClick={() => setDrawerCustomer(null)} />
          <div style={FONT} className="w-full max-w-sm bg-white h-full shadow-2xl overflow-y-auto">
            <div className="flex items-center justify-between px-5 py-4 border-b border-[#E2E8F0]">
              <h2 className="text-sm font-bold text-[#0F172A]">Customer Profile</h2>
              <button onClick={() => setDrawerCustomer(null)} className="p-2 rounded-xl hover:bg-[#F1F5F9] text-[#94A3B8]">✕</button>
            </div>
            <div className="p-5 space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 text-white font-bold flex items-center justify-center text-lg">
                  {drawerCustomer.name.slice(0, 2).toUpperCase()}
                </div>
                <div>
                  <p className="text-[16px] font-bold text-[#0F172A]">{drawerCustomer.name}</p>
                  <p className="text-[12px] text-[#94A3B8]">{drawerCustomer.email}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-[#F8FAFC] rounded-xl p-3 border border-[#E2E8F0]">
                  <p className="text-[20px] font-bold text-[#6366F1]">{drawerCustomer.totalOrders}</p>
                  <p className="text-[11px] text-[#94A3B8]">Total Orders</p>
                </div>
                <div className="bg-[#F8FAFC] rounded-xl p-3 border border-[#E2E8F0]">
                    <p className="text-[20px] font-bold text-[#10B981]">₹{drawerCustomer.totalSpent?.toLocaleString() || 0}</p>
                  <p className="text-[11px] text-[#94A3B8]">Lifetime Spend</p>
                </div>
              </div>
              <div className="space-y-2">
                <p className="text-[11px] font-bold text-[#94A3B8] uppercase tracking-wider">Contact Info</p>
                <p className="text-[13px] text-[#475569] flex items-center gap-2"><Phone className="w-3.5 h-3.5" />{drawerCustomer.phone}</p>
                <p className="text-[13px] text-[#475569] flex items-center gap-2"><MapPin className="w-3.5 h-3.5" />{drawerCustomer.city || "Mumbai"}</p>
              </div>
              <div className="flex gap-2 pt-2">
                <Button variant="primary" size="sm" className="flex-1" leftIcon={<Mail className="w-3.5 h-3.5" />}>Email Customer</Button>
                {drawerCustomer.isBlocked
                  ? <Button variant="success" size="sm" onClick={() => showToast("Customer unblocked")}>Unblock</Button>
                  : <Button variant="danger" size="sm" onClick={() => showToast("Customer blocked")}>Block</Button>
                }
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
