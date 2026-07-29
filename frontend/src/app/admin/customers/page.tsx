"use client";

import { useState } from "react";
import { Users, Search, Mail, Phone, MapPin } from "lucide-react";
import { formatPrice } from "@/lib/utils";

const MOCK_CUSTOMERS = [
  { id: "CUST-01", name: "Ananya Roy", email: "ananya@example.com", phone: "+91 98765 12345", ordersCount: 5, totalSpent: 7495, city: "Mumbai", tier: "Gold Member" },
  { id: "CUST-02", name: "Vikram Malhotra", email: "vikram@example.com", phone: "+91 98123 45678", ordersCount: 3, totalSpent: 4497, city: "Delhi", tier: "Silver Member" },
  { id: "CUST-03", name: "Neha Kapoor", email: "neha@example.com", phone: "+91 97654 32109", ordersCount: 8, totalSpent: 12890, city: "Bengaluru", tier: "Platinum Member" },
  { id: "CUST-04", name: "Rohan Gupta", email: "rohan@example.com", phone: "+91 99887 76655", ordersCount: 2, totalSpent: 5098, city: "Pune", tier: "Silver Member" },
  { id: "CUST-05", name: "Priya Sharma", email: "priya@example.com", phone: "+91 98765 43210", ordersCount: 12, totalSpent: 18490, city: "Mumbai", tier: "Gold Member" },
];

export default function AdminCustomersPage() {
  const [search, setSearch] = useState("");

  const filtered = MOCK_CUSTOMERS.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.email.toLowerCase().includes(search.toLowerCase()) ||
    c.city.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-medium text-[#F5EFE4]" style={{ fontFamily: "Cormorant Garamond, Georgia, serif" }}>
          Customers List
        </h1>
        <p className="text-xs text-[#8B7355] mt-1">Manage registered buyers, order histories, and membership tiers.</p>
      </div>

      <div className="relative max-w-md">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8B7355]" />
        <input
          type="text"
          placeholder="Search by name, email, or city..."
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
                <th className="p-4 font-semibold">Customer</th>
                <th className="p-4 font-semibold">Contact</th>
                <th className="p-4 font-semibold">City</th>
                <th className="p-4 font-semibold">Orders</th>
                <th className="p-4 font-semibold">Lifetime Value</th>
                <th className="p-4 font-semibold">Tier</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#2A1D13] text-xs">
              {filtered.map((c) => (
                <tr key={c.id} className="hover:bg-[#1F140B] transition-colors">
                  <td className="p-4">
                    <p className="font-semibold text-[#F5EFE4]">{c.name}</p>
                    <p className="text-[10px] text-[#8B7355]">{c.id}</p>
                  </td>
                  <td className="p-4">
                    <p className="text-[#A08060]">{c.email}</p>
                    <p className="text-[10px] text-[#8B7355]">{c.phone}</p>
                  </td>
                  <td className="p-4 text-[#A08060]">{c.city}</td>
                  <td className="p-4 font-semibold text-[#F5EFE4]">{c.ordersCount} orders</td>
                  <td className="p-4 font-bold text-[#C4964A]">{formatPrice(c.totalSpent)}</td>
                  <td className="p-4">
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-[#C4964A]/15 text-[#C4964A]">
                      {c.tier}
                    </span>
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
