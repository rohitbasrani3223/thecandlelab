"use client";

import { FileText, Download, Calendar } from "lucide-react";
import toast from "react-hot-toast";

export default function AdminReportsPage() {
  const handleExport = (type: string) => {
    toast.success(`${type} Report generated & downloading...`);
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-3xl font-medium text-[#F5EFE4]" style={{ fontFamily: "Cormorant Garamond, Georgia, serif" }}>
          Reports & Export Center
        </h1>
        <p className="text-xs text-[#8B7355] mt-1">Export detailed accounting, sales tax (GST), inventory valuation, and customer reports in CSV/PDF format.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        {[
          { title: "Monthly Sales Report", desc: "Complete breakdown of sales revenue, GST collected, and net profit per month.", type: "Sales" },
          { title: "GST & Tax Compliance", desc: "GST tax audit report formatted for CA and GST filing.", type: "GST Tax" },
          { title: "Inventory Valuation", desc: "Current warehouse stock valuation, cost prices, and projected retail value.", type: "Inventory" },
          { title: "Customer LTV Report", desc: "Top spending customer segments, repeat purchases, and lifetime value.", type: "Customer LTV" },
        ].map((r) => (
          <div key={r.title} className="p-5 rounded-2xl border border-[#2A1D13] flex flex-col justify-between space-y-4" style={{ background: "#140D07" }}>
            <div>
              <div className="w-10 h-10 rounded-xl bg-[#1F140B] border border-[#3A281A] flex items-center justify-center text-[#C4964A] mb-3">
                <FileText size={20} />
              </div>
              <h3 className="font-semibold text-[#F5EFE4] text-base">{r.title}</h3>
              <p className="text-xs text-[#8B7355] mt-1">{r.desc}</p>
            </div>
            <div className="flex gap-2 pt-2 border-t border-[#2A1D13]">
              <button onClick={() => handleExport(`${r.type} CSV`)} className="btn btn-outline btn-sm gap-1.5 flex-1 justify-center">
                <Download size={13} /> Export CSV
              </button>
              <button onClick={() => handleExport(`${r.type} PDF`)} className="btn btn-gold btn-sm gap-1.5 flex-1 justify-center">
                <Download size={13} /> Export PDF
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
