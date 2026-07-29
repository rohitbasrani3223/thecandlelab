"use client";

import { useState } from "react";
import { RotateCcw, CheckCircle2, XCircle, Clock } from "lucide-react";
import { formatPrice } from "@/lib/utils";
import toast from "react-hot-toast";

const MOCK_RETURNS = [
  { id: "RET-501", orderId: "TCL-9077", customer: "Siddharth Verma", reason: "Damaged in transit", refundAmount: 2498, status: "Requested", date: "2025-02-23" },
  { id: "RET-500", orderId: "TCL-8890", customer: "Ankit Jain", reason: "Wrong fragrance received", refundAmount: 1499, status: "Approved", date: "2025-02-18" },
];

export default function AdminPostSalesPage() {
  const [returns, setReturns] = useState(MOCK_RETURNS);

  const handleAction = (id: string, newStatus: string) => {
    setReturns(returns.map((r) => (r.id === id ? { ...r, status: newStatus } : r)));
    toast.success(`Return request ${id} ${newStatus.toLowerCase()}!`);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-medium text-[#F5EFE4]" style={{ fontFamily: "Cormorant Garamond, Georgia, serif" }}>
          Returns, Refunds & Post-Sales Support
        </h1>
        <p className="text-xs text-[#8B7355] mt-1">Review customer return requests, damaged candle replacements, and refund approvals.</p>
      </div>

      <div className="rounded-2xl border border-[#2A1D13] overflow-hidden" style={{ background: "#140D07" }}>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[#2A1D13] text-[11px] uppercase tracking-wider text-[#8B7355]" style={{ background: "#1A1208" }}>
                <th className="p-4 font-semibold">Return ID</th>
                <th className="p-4 font-semibold">Order ID</th>
                <th className="p-4 font-semibold">Customer</th>
                <th className="p-4 font-semibold">Reason</th>
                <th className="p-4 font-semibold">Refund Amount</th>
                <th className="p-4 font-semibold">Status</th>
                <th className="p-4 font-semibold text-right">Approve / Reject</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#2A1D13] text-xs">
              {returns.map((r) => (
                <tr key={r.id} className="hover:bg-[#1F140B] transition-colors">
                  <td className="p-4 font-mono font-semibold text-[#C4964A]">{r.id}</td>
                  <td className="p-4 font-mono text-[#F5EFE4]">{r.orderId}</td>
                  <td className="p-4 text-[#F5EFE4]">{r.customer}</td>
                  <td className="p-4 text-[#A08060]">{r.reason}</td>
                  <td className="p-4 font-bold text-[#F5EFE4]">{formatPrice(r.refundAmount)}</td>
                  <td className="p-4">
                    <span
                      className="px-2.5 py-1 rounded-full text-[10px] font-bold"
                      style={{
                        background:
                          r.status === "Approved"
                            ? "rgba(34,197,94,0.15)"
                            : r.status === "Rejected"
                            ? "rgba(239,68,68,0.15)"
                            : "rgba(245,158,11,0.15)",
                        color:
                          r.status === "Approved"
                            ? "#4ADE80"
                            : r.status === "Rejected"
                            ? "#F87171"
                            : "#FBBF24",
                      }}
                    >
                      {r.status}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    {r.status === "Requested" && (
                      <div className="flex items-center justify-end gap-2">
                        <button onClick={() => handleAction(r.id, "Approved")} className="px-2.5 py-1 rounded bg-green-950/40 border border-green-800 text-[#4ADE80] text-xs font-semibold">
                          Approve
                        </button>
                        <button onClick={() => handleAction(r.id, "Rejected")} className="px-2.5 py-1 rounded bg-red-950/40 border border-red-800 text-[#F87171] text-xs font-semibold">
                          Reject
                        </button>
                      </div>
                    )}
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
