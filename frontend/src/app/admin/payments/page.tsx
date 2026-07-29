"use client";

import { useState } from "react";
import { CreditCard, CheckCircle2, XCircle, Search } from "lucide-react";
import { formatPrice } from "@/lib/utils";

const MOCK_PAYMENTS = [
  { id: "PAY-1001", orderId: "TCL-9081", method: "Razorpay (UPI)", amount: 2998, status: "Success", date: "2025-02-24 14:32" },
  { id: "PAY-1002", orderId: "TCL-9080", method: "Razorpay (Card)", amount: 1499, status: "Success", date: "2025-02-24 13:50" },
  { id: "PAY-1003", orderId: "TCL-9079", method: "Cash on Delivery", amount: 4297, status: "Pending COD", date: "2025-02-24 11:15" },
  { id: "PAY-1004", orderId: "TCL-9077", method: "Razorpay (Card)", amount: 2498, status: "Failed", date: "2025-02-22 09:40" },
];

export default function AdminPaymentsPage() {
  const [search, setSearch] = useState("");

  const filtered = MOCK_PAYMENTS.filter((p) =>
    p.id.toLowerCase().includes(search.toLowerCase()) ||
    p.orderId.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-medium text-[#F5EFE4]" style={{ fontFamily: "Cormorant Garamond, Georgia, serif" }}>
          Payments & Transactions History
        </h1>
        <p className="text-xs text-[#8B7355] mt-1">Audit online payment logs, Razorpay webhooks, COD settlements, and transaction statuses.</p>
      </div>

      <div className="relative max-w-md">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8B7355]" />
        <input
          type="text"
          placeholder="Filter by Transaction ID or Order ID..."
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
                <th className="p-4 font-semibold">Payment ID</th>
                <th className="p-4 font-semibold">Order ID</th>
                <th className="p-4 font-semibold">Gateway / Method</th>
                <th className="p-4 font-semibold">Amount</th>
                <th className="p-4 font-semibold">Status</th>
                <th className="p-4 font-semibold">Timestamp</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#2A1D13] text-xs">
              {filtered.map((p) => (
                <tr key={p.id} className="hover:bg-[#1F140B] transition-colors">
                  <td className="p-4 font-mono font-semibold text-[#C4964A]">{p.id}</td>
                  <td className="p-4 font-mono text-[#F5EFE4]">{p.orderId}</td>
                  <td className="p-4 text-[#A08060]">{p.method}</td>
                  <td className="p-4 font-bold text-[#F5EFE4]">{formatPrice(p.amount)}</td>
                  <td className="p-4">
                    <span
                      className="px-2.5 py-1 rounded-full text-[10px] font-bold"
                      style={{
                        background:
                          p.status === "Success"
                            ? "rgba(34,197,94,0.15)"
                            : p.status === "Failed"
                            ? "rgba(239,68,68,0.15)"
                            : "rgba(245,158,11,0.15)",
                        color:
                          p.status === "Success"
                            ? "#4ADE80"
                            : p.status === "Failed"
                            ? "#F87171"
                            : "#FBBF24",
                      }}
                    >
                      {p.status}
                    </span>
                  </td>
                  <td className="p-4 text-[#8B7355]">{p.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
