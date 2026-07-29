"use client";

import React, { useState } from "react";
import { useStore, OrderRecord } from "@/context/StoreContext";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import {
  Search, Download, Truck, FileText, CheckSquare, Square,
  X, Clock, CheckCircle2, AlertCircle, Phone, MapPin,
  ChevronRight, DollarSign, Package, RefreshCw, Filter,
  MoreHorizontal, Eye, Printer
} from "lucide-react";

const FONT = { fontFamily: "Inter, system-ui, sans-serif" };

const STATUS_TABS = [
  { key: "ALL", label: "All Orders" },
  { key: "PENDING", label: "Pending" },
  { key: "PROCESSING", label: "Processing" },
  { key: "SHIPPED", label: "Shipped" },
  { key: "DELIVERED", label: "Delivered" },
  { key: "CANCELLED", label: "Cancelled" },
  { key: "REFUND", label: "Refunds" },
];

const STATUS_BADGE: Record<string, { variant: any; label: string }> = {
  Pending:    { variant: "warning",  label: "Pending" },
  Processing: { variant: "indigo",   label: "Processing" },
  Shipped:    { variant: "info",     label: "Shipped" },
  Delivered:  { variant: "success",  label: "Delivered" },
  Cancelled:  { variant: "danger",   label: "Cancelled" },
  Refund:     { variant: "warning",  label: "Refund" },
};

export const OrderManagementModule: React.FC = () => {
  const { orders, updateOrderStatus, showToast } = useStore();
  const [activeTab, setActiveTab] = useState("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [drawerOrder, setDrawerOrder] = useState<OrderRecord | null>(null);

  const filtered = orders.filter((o) => {
    if (activeTab !== "ALL" && o.status.toUpperCase() !== activeTab) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return o.id.toLowerCase().includes(q) || o.customerName.toLowerCase().includes(q) || o.customerPhone.includes(q);
    }
    return true;
  });

  const toggleAll = () =>
    setSelectedIds(selectedIds.length === filtered.length ? [] : filtered.map((o) => o.id));
  const toggleOne = (id: string) =>
    setSelectedIds((prev) => prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]);

  const handleBulkStatus = (status: string) => {
    selectedIds.forEach((id) => updateOrderStatus(id, status as any));
    showToast(`${selectedIds.length} orders marked as ${status}`);
    setSelectedIds([]);
  };

  const counts = {
    ALL: orders.length,
    PENDING: orders.filter((o) => o.status === "Pending").length,
    PROCESSING: orders.filter((o) => o.status === "Packed").length,
    SHIPPED: orders.filter((o) => o.status === "Shipped").length,
    DELIVERED: orders.filter((o) => o.status === "Delivered").length,
    CANCELLED: orders.filter((o) => o.status === "Cancelled").length,
    REFUND: orders.filter((o) => o.status === "Refund").length,
  };

  return (
    <div style={FONT} className="space-y-5">
      {/* ── Page Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-[#0F172A]">Orders & Shipping</h1>
          <p className="text-sm text-[#64748B] mt-0.5">{orders.length} total orders · {counts.PENDING} pending action</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="secondary" size="sm" leftIcon={<Download className="w-3.5 h-3.5" />}>Export CSV</Button>
          <Button variant="primary" size="sm" leftIcon={<Truck className="w-3.5 h-3.5" />}>Bulk Ship</Button>
        </div>
      </div>

      {/* ── Status Tabs ── */}
      <div className="flex items-center gap-1 overflow-x-auto pb-1 border-b border-[#E2E8F0]">
        {STATUS_TABS.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`flex items-center gap-1.5 px-3 py-2 text-[12px] font-semibold rounded-lg whitespace-nowrap transition-all ${
              activeTab === tab.key
                ? "bg-[#EEF2FF] text-[#4338CA]"
                : "text-[#64748B] hover:text-[#0F172A] hover:bg-[#F8FAFC]"
            }`}
          >
            {tab.label}
            <span className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold ${
              activeTab === tab.key ? "bg-[#6366F1] text-white" : "bg-[#F1F5F9] text-[#64748B]"
            }`}>
              {counts[tab.key as keyof typeof counts]}
            </span>
          </button>
        ))}
      </div>

      {/* ── Search + Bulk Actions ── */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#94A3B8]" />
          <input
            type="text"
            placeholder="Search by order ID, customer, phone..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-white border border-[#E2E8F0] rounded-xl text-[13px] text-[#0F172A] placeholder-[#94A3B8] focus:outline-none focus:border-[#6366F1] focus:ring-2 focus:ring-[#EEF2FF] transition-all"
          />
        </div>
        {selectedIds.length > 0 && (
          <div className="flex items-center gap-2 bg-[#EEF2FF] border border-[#C7D2FE] px-3 py-1.5 rounded-xl">
            <span className="text-[12px] font-semibold text-[#4338CA]">{selectedIds.length} selected</span>
            <button onClick={() => handleBulkStatus("Processing")} className="text-[11px] font-bold text-[#4338CA] hover:underline px-2">Mark Processing</button>
            <button onClick={() => handleBulkStatus("Shipped")} className="text-[11px] font-bold text-[#4338CA] hover:underline px-2">Mark Shipped</button>
            <button onClick={() => setSelectedIds([])} className="p-0.5 text-[#6366F1] hover:text-[#4338CA]"><X className="w-3.5 h-3.5" /></button>
          </div>
        )}
      </div>

      {/* ── Orders Table ── */}
      <Card padding="none" className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full" style={FONT}>
            <thead>
              <tr className="bg-[#F8FAFC] border-b border-[#E2E8F0]">
                <th className="px-4 py-3 text-left">
                  <button onClick={toggleAll} className="text-[#94A3B8] hover:text-[#6366F1]">
                    {selectedIds.length === filtered.length && filtered.length > 0
                      ? <CheckSquare className="w-4 h-4 text-[#6366F1]" />
                      : <Square className="w-4 h-4" />}
                  </button>
                </th>
                {["Order", "Customer", "Amount", "Items", "Status", "Courier", "Date", ""].map((h) => (
                  <th key={h} className="px-4 py-3 text-left text-[11px] font-semibold text-[#94A3B8] uppercase tracking-wider whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F1F5F9]">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={9} className="px-4 py-12 text-center text-[13px] text-[#94A3B8]">
                    No orders match current filters
                  </td>
                </tr>
              ) : filtered.map((o) => {
                const statusInfo = STATUS_BADGE[o.status] || { variant: "neutral", label: o.status };
                const isSelected = selectedIds.includes(o.id);
                return (
                  <tr
                    key={o.id}
                    className={`transition-colors ${isSelected ? "bg-[#EEF2FF]" : "hover:bg-[#F8FAFC]"}`}
                  >
                    <td className="px-4 py-3.5">
                      <button onClick={() => toggleOne(o.id)} className="text-[#94A3B8] hover:text-[#6366F1]">
                        {isSelected ? <CheckSquare className="w-4 h-4 text-[#6366F1]" /> : <Square className="w-4 h-4" />}
                      </button>
                    </td>
                    <td className="px-4 py-3.5">
                      <span className="text-[12px] font-bold text-[#6366F1] font-mono">{o.id}</span>
                    </td>
                    <td className="px-4 py-3.5">
                      <div>
                        <p className="text-[13px] font-semibold text-[#0F172A]">{o.customerName}</p>
                        <p className="text-[11px] text-[#94A3B8]">{o.customerPhone}</p>
                      </div>
                    </td>
                    <td className="px-4 py-3.5">
                      <span className="text-[13px] font-bold text-[#0F172A]">₹{o.totalAmount.toLocaleString()}</span>
                    </td>
                    <td className="px-4 py-3.5">
                      <span className="text-[12px] text-[#64748B]">{o.itemsCount} items</span>
                    </td>
                    <td className="px-4 py-3.5">
                      <Badge variant={statusInfo.variant} dot>{statusInfo.label}</Badge>
                    </td>
                    <td className="px-4 py-3.5">
                      <span className="text-[12px] text-[#64748B]">{o.courier}</span>
                    </td>
                    <td className="px-4 py-3.5">
                      <span className="text-[11px] text-[#94A3B8]">{o.date}</span>
                    </td>
                    <td className="px-4 py-3.5">
                      <button
                        onClick={() => setDrawerOrder(o)}
                        className="p-1.5 rounded-lg text-[#94A3B8] hover:text-[#6366F1] hover:bg-[#EEF2FF] transition-colors"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Pagination bar */}
        <div className="flex items-center justify-between px-4 py-3 border-t border-[#E2E8F0]">
          <p className="text-[12px] text-[#94A3B8]">
            Showing {filtered.length} of {orders.length} orders
          </p>
          <div className="flex items-center gap-1">
            {[1, 2, 3].map((p) => (
              <button key={p} className={`w-7 h-7 rounded-lg text-[12px] font-semibold transition-colors ${p === 1 ? "bg-[#6366F1] text-white" : "text-[#64748B] hover:bg-[#F1F5F9]"}`}>
                {p}
              </button>
            ))}
          </div>
        </div>
      </Card>

      {/* ── Order Detail Drawer ── */}
      {drawerOrder && (
        <div className="fixed inset-0 z-50 flex">
          <div className="flex-1 bg-black/40 backdrop-blur-sm" onClick={() => setDrawerOrder(null)} />
          <div style={FONT} className="w-full max-w-md bg-white h-full shadow-2xl overflow-y-auto">
            <div className="flex items-center justify-between px-5 py-4 border-b border-[#E2E8F0] sticky top-0 bg-white z-10">
              <div>
                <p className="text-[11px] text-[#94A3B8] font-semibold uppercase tracking-wider">Order Details</p>
                <h2 className="text-sm font-bold text-[#0F172A] font-mono">{drawerOrder.id}</h2>
              </div>
              <button onClick={() => setDrawerOrder(null)} className="p-2 rounded-xl hover:bg-[#F1F5F9] text-[#94A3B8]">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-5 space-y-5">
              {/* Status & Actions */}
              <div className="flex items-center justify-between">
                <Badge variant={(STATUS_BADGE[drawerOrder.status] || { variant: "neutral" }).variant} dot>
                  {drawerOrder.status}
                </Badge>
                <div className="flex gap-2">
                  <Button variant="secondary" size="xs" leftIcon={<Printer className="w-3 h-3" />}>Invoice</Button>
                  <Button variant="primary" size="xs" leftIcon={<Truck className="w-3 h-3" />}>Ship</Button>
                </div>
              </div>

              {/* Customer */}
              <div className="bg-[#F8FAFC] rounded-xl p-4 border border-[#E2E8F0] space-y-2">
                <p className="text-[11px] font-bold text-[#94A3B8] uppercase tracking-wider">Customer</p>
                <p className="text-[14px] font-bold text-[#0F172A]">{drawerOrder.customerName}</p>
                <p className="text-[12px] text-[#64748B] flex items-center gap-1.5"><Phone className="w-3.5 h-3.5" />{drawerOrder.customerPhone}</p>
                <p className="text-[12px] text-[#64748B] flex items-start gap-1.5"><MapPin className="w-3.5 h-3.5 mt-0.5 shrink-0" />{drawerOrder.shippingAddress}</p>
              </div>

              {/* Items */}
              <div>
                <p className="text-[11px] font-bold text-[#94A3B8] uppercase tracking-wider mb-2">Order Items</p>
                <div className="space-y-2">
                  <div className="flex items-center justify-between py-2 border-b border-[#F1F5F9]">
                    <div>
                      <p className="text-[13px] font-medium text-[#0F172A]">{drawerOrder.itemsSummary}</p>
                      <p className="text-[11px] text-[#94A3B8]">Qty: {drawerOrder.itemsCount}</p>
                    </div>
                    <p className="text-[13px] font-bold text-[#0F172A]">₹{drawerOrder.totalAmount.toLocaleString()}</p>
                  </div>
                </div>
              </div>

              {/* Total */}
              <div className="flex items-center justify-between pt-2 border-t border-[#E2E8F0]">
                <p className="text-[14px] font-bold text-[#0F172A]">Total</p>
                <p className="text-[18px] font-bold text-[#6366F1]">₹{drawerOrder.totalAmount.toLocaleString()}</p>
              </div>

              {/* Update Status */}
              <div>
                <p className="text-[11px] font-bold text-[#94A3B8] uppercase tracking-wider mb-2">Update Status</p>
                <div className="grid grid-cols-2 gap-2">
                  {(["Packed", "Shipped", "Delivered", "Cancelled"] as const).map((s) => (
                    <button
                      key={s}
                      onClick={() => {
                        updateOrderStatus(drawerOrder.id, s as any);
                        showToast(`Order ${drawerOrder.id} → ${s}`);
                        setDrawerOrder(null);
                      }}
                      className="px-3 py-2 text-[12px] font-semibold rounded-xl border border-[#E2E8F0] text-[#475569] hover:border-[#6366F1] hover:text-[#6366F1] hover:bg-[#EEF2FF] transition-all"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
