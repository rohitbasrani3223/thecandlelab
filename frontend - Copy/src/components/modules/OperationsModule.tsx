"use client";

import React, { useState } from "react";
import { useStore } from "@/context/StoreContext";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import {
  Truck, Package, AlertTriangle, CheckCircle2, Clock, Boxes,
  MapPin, RefreshCw, BarChart3, Warehouse
} from "lucide-react";

const FONT = { fontFamily: "Inter, system-ui, sans-serif" };

export const OperationsModule: React.FC = () => {
  const { products, orders, showToast } = useStore();

  const lowStock = products.filter((p) => p.stock > 0 && p.stock <= 10);
  const outOfStock = products.filter((p) => p.stock === 0);
  const inTransit = orders.filter((o) => o.status === "Shipped").length;
  const readyToShip = orders.filter((o) => o.status === "Packed").length;

  const stats = [
    { label: "In Transit", value: inTransit, icon: Truck, color: "text-blue-600", bg: "bg-blue-50" },
    { label: "Ready to Ship", value: readyToShip, icon: Package, color: "text-indigo-600", bg: "bg-indigo-50" },
    { label: "Low Stock SKUs", value: lowStock.length, icon: AlertTriangle, color: "text-amber-600", bg: "bg-amber-50" },
    { label: "Out of Stock", value: outOfStock.length, icon: Boxes, color: "text-red-500", bg: "bg-red-50" },
  ];

  const couriers = [
    { name: "Bluedart Express", active: 12, delivered: 348, onTime: "98.2%", status: "Operational" },
    { name: "Delhivery Premium", active: 8, delivered: 221, onTime: "96.7%", status: "Operational" },
    { name: "Shiprocket Surface", active: 4, delivered: 89, onTime: "91.4%", status: "Delayed" },
    { name: "DTDC Standard", active: 2, delivered: 45, onTime: "88.9%", status: "Operational" },
  ];

  return (
    <div style={FONT} className="space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-[#0F172A]">Warehouse & Operations</h1>
          <p className="text-sm text-[#64748B] mt-0.5">Inventory, shipping, and fulfillment management</p>
        </div>
        <Button variant="secondary" size="sm" leftIcon={<RefreshCw className="w-3.5 h-3.5" />} onClick={() => showToast("Inventory synced!")}>
          Sync Inventory
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {stats.map((s) => {
          const Icon = s.icon;
          return (
            <Card key={s.label} padding="sm" className="flex items-center gap-3">
              <div className={`w-9 h-9 rounded-xl ${s.bg} flex items-center justify-center shrink-0`}>
                <Icon className={s.color} style={{ width: 18, height: 18 }} />
              </div>
              <div>
                <p className="text-xl font-bold text-[#0F172A] leading-none">{s.value}</p>
                <p className="text-[11px] text-[#94A3B8] mt-0.5">{s.label}</p>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Low Stock Alert Table */}
      <Card padding="none" className="overflow-hidden">
        <div className="flex items-center gap-2 px-5 py-4 border-b border-[#E2E8F0]">
          <AlertTriangle className="w-4 h-4 text-amber-500" />
          <h2 className="text-sm font-semibold text-[#0F172A]">Low & Out-of-Stock Alerts</h2>
          <Badge variant="warning">{lowStock.length + outOfStock.length} SKUs</Badge>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full" style={FONT}>
            <thead>
              <tr className="bg-[#F8FAFC] border-b border-[#E2E8F0]">
                {["Product", "SKU", "Current Stock", "Status", "Action"].map((h) => (
                  <th key={h} className="px-4 py-3 text-left text-[11px] font-semibold text-[#94A3B8] uppercase tracking-wider whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F1F5F9]">
              {[...outOfStock, ...lowStock].length === 0 ? (
                <tr><td colSpan={5} className="px-4 py-8 text-center text-[13px] text-emerald-600 font-semibold flex-col">
                  <CheckCircle2 className="w-6 h-6 mx-auto mb-1" />All SKUs are well stocked!
                </td></tr>
              ) : [...outOfStock, ...lowStock].map((p) => (
                <tr key={p.id} className="hover:bg-[#F8FAFC] transition-colors">
                  <td className="px-4 py-3.5">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] overflow-hidden shrink-0">
                        <img src={p.images[0]} alt={p.name} className="w-full h-full object-cover" onError={(e) => { (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1603006905003-be475563bc59?w=80"; }} />
                      </div>
                      <p className="text-[13px] font-semibold text-[#0F172A] max-w-[180px] truncate">{p.name}</p>
                    </div>
                  </td>
                  <td className="px-4 py-3.5"><span className="text-[11px] font-mono text-[#94A3B8]">{p.sku || "—"}</span></td>
                  <td className="px-4 py-3.5"><span className="text-[14px] font-bold text-[#0F172A]">{p.stock}</span></td>
                  <td className="px-4 py-3.5">
                    {p.stock === 0 ? <Badge variant="danger" dot>Out of Stock</Badge> : <Badge variant="warning" dot>Low ({p.stock} left)</Badge>}
                  </td>
                  <td className="px-4 py-3.5">
                    <Button variant="secondary" size="xs" onClick={() => showToast(`Restock order placed for ${p.name}`)}>
                      Restock
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Courier Performance */}
      <Card padding="none" className="overflow-hidden">
        <div className="flex items-center gap-2 px-5 py-4 border-b border-[#E2E8F0]">
          <Truck className="w-4 h-4 text-[#6366F1]" />
          <h2 className="text-sm font-semibold text-[#0F172A]">Courier Performance</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full" style={FONT}>
            <thead>
              <tr className="bg-[#F8FAFC] border-b border-[#E2E8F0]">
                {["Courier Partner", "Active Shipments", "Total Delivered", "On-Time %", "Status"].map((h) => (
                  <th key={h} className="px-4 py-3 text-left text-[11px] font-semibold text-[#94A3B8] uppercase tracking-wider whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F1F5F9]">
              {couriers.map((c) => (
                <tr key={c.name} className="hover:bg-[#F8FAFC]">
                  <td className="px-4 py-3.5"><p className="text-[13px] font-semibold text-[#0F172A]">{c.name}</p></td>
                  <td className="px-4 py-3.5"><span className="text-[13px] font-bold text-indigo-600">{c.active}</span></td>
                  <td className="px-4 py-3.5"><span className="text-[13px] text-[#64748B]">{c.delivered}</span></td>
                  <td className="px-4 py-3.5">
                    <span className={`text-[13px] font-bold ${parseFloat(c.onTime) >= 95 ? "text-emerald-600" : "text-amber-600"}`}>{c.onTime}</span>
                  </td>
                  <td className="px-4 py-3.5">
                    <Badge variant={c.status === "Operational" ? "success" : "warning"} dot>{c.status}</Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};
