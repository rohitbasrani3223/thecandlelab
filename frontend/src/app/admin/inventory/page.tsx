"use client";

import { useState } from "react";
import { Boxes, AlertTriangle, RefreshCw, Plus, Search } from "lucide-react";
import { PRODUCTS } from "@/data/mock";
import { formatPrice } from "@/lib/utils";
import toast from "react-hot-toast";

export default function AdminInventoryPage() {
  const [stockList, setStockList] = useState(PRODUCTS);
  const [search, setSearch] = useState("");

  const filtered = stockList.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.sku?.toLowerCase().includes(search.toLowerCase())
  );

  const handleUpdateStock = (id: string, delta: number) => {
    setStockList(
      stockList.map((p) =>
        p.id === id ? { ...p, stock: Math.max(0, p.stock + delta) } : p
      )
    );
    toast.success("Stock updated!");
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-medium text-[#F5EFE4]" style={{ fontFamily: "Cormorant Garamond, Georgia, serif" }}>
            Inventory & Stock Manager
          </h1>
          <p className="text-xs text-[#8B7355] mt-1">
            Real-time stock monitoring, restock threshold warnings, and instant inventory adjustments.
          </p>
        </div>
      </div>

      <div className="relative max-w-md">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8B7355]" />
        <input
          type="text"
          placeholder="Filter by product name or SKU..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-9 pr-4 py-2 rounded-xl text-xs bg-[#140D07] border border-[#2A1D13] text-[#F5EFE4] placeholder-[#8B7355] focus:outline-none focus:border-[#C4964A]"
        />
      </div>

      <div className="rounded-2xl border border-[#2A1D13] overflow-hidden" style={{ background: "#140D07" }}>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[#2A1D13] text-[11px] uppercase tracking-wider text-[#8B7355]" style={{ background: "#1A1208" }}>
                <th className="p-4 font-semibold">Product</th>
                <th className="p-4 font-semibold">SKU</th>
                <th className="p-4 font-semibold">Current Stock</th>
                <th className="p-4 font-semibold">Status</th>
                <th className="p-4 font-semibold text-right">Adjust Stock</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#2A1D13] text-xs">
              {filtered.map((item) => (
                <tr key={item.id} className="hover:bg-[#1F140B] transition-colors">
                  <td className="p-4 font-semibold text-[#F5EFE4] flex items-center gap-3">
                    <img src={item.thumbnail} alt={item.name} className="w-10 h-10 rounded-lg object-cover bg-[#2A1D13]" />
                    {item.name}
                  </td>
                  <td className="p-4 text-[#A08060] font-mono">{item.sku}</td>
                  <td className="p-4 font-bold text-[#F5EFE4] text-sm">{item.stock} units</td>
                  <td className="p-4">
                    <span
                      className="px-2.5 py-1 rounded-full text-[10px] font-bold"
                      style={{
                        background:
                          item.stock === 0
                            ? "rgba(239,68,68,0.15)"
                            : item.stock <= 5
                            ? "rgba(245,158,11,0.15)"
                            : "rgba(34,197,94,0.15)",
                        color:
                          item.stock === 0
                            ? "#F87171"
                            : item.stock <= 5
                            ? "#FBBF24"
                            : "#4ADE80",
                      }}
                    >
                      {item.stock === 0 ? "Out of Stock" : item.stock <= 5 ? "Low Stock Warning" : "Optimal"}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => handleUpdateStock(item.id, -5)}
                        className="px-2 py-1 rounded bg-[#1F140B] border border-[#3A281A] text-[#F87171] hover:bg-red-950/30 text-xs font-bold"
                      >
                        -5
                      </button>
                      <button
                        onClick={() => handleUpdateStock(item.id, -1)}
                        className="px-2 py-1 rounded bg-[#1F140B] border border-[#3A281A] text-[#F5EFE4] hover:bg-[#2A1D13] text-xs font-bold"
                      >
                        -1
                      </button>
                      <button
                        onClick={() => handleUpdateStock(item.id, 1)}
                        className="px-2 py-1 rounded bg-[#1F140B] border border-[#3A281A] text-[#F5EFE4] hover:bg-[#2A1D13] text-xs font-bold"
                      >
                        +1
                      </button>
                      <button
                        onClick={() => handleUpdateStock(item.id, 10)}
                        className="px-2 py-1 rounded bg-[#1F140B] border border-[#3A281A] text-[#4ADE80] hover:bg-green-950/30 text-xs font-bold"
                      >
                        +10
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
