"use client";

import { useState } from "react";
import { ShoppingBag, Search, Filter, Eye, CheckCircle2, Clock, Truck, XCircle, Printer } from "lucide-react";
import { formatPrice } from "@/lib/utils";
import toast from "react-hot-toast";

const MOCK_ADMIN_ORDERS = [
  {
    id: "TCL-9081",
    customer: "Ananya Roy",
    email: "ananya@example.com",
    phone: "+91 98765 12345",
    itemsCount: 2,
    total: 2998,
    status: "Delivered",
    paymentMethod: "UPI",
    date: "2025-02-24 14:32",
    city: "Mumbai",
  },
  {
    id: "TCL-9080",
    customer: "Vikram Malhotra",
    email: "vikram@example.com",
    phone: "+91 98123 45678",
    itemsCount: 1,
    total: 1499,
    status: "Processing",
    paymentMethod: "Card",
    date: "2025-02-24 13:50",
    city: "Delhi",
  },
  {
    id: "TCL-9079",
    customer: "Neha Kapoor",
    email: "neha@example.com",
    phone: "+91 97654 32109",
    itemsCount: 3,
    total: 4297,
    status: "Shipped",
    paymentMethod: "COD",
    date: "2025-02-24 11:15",
    city: "Bengaluru",
  },
  {
    id: "TCL-9078",
    customer: "Rohan Gupta",
    email: "rohan@example.com",
    phone: "+91 99887 76655",
    itemsCount: 1,
    total: 3599,
    status: "Delivered",
    paymentMethod: "UPI",
    date: "2025-02-23 18:20",
    city: "Pune",
  },
  {
    id: "TCL-9077",
    customer: "Siddharth Verma",
    email: "sid@example.com",
    phone: "+91 91234 56789",
    itemsCount: 2,
    total: 2498,
    status: "Cancelled",
    paymentMethod: "Card",
    date: "2025-02-22 09:40",
    city: "Hyderabad",
  },
];

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState(MOCK_ADMIN_ORDERS);
  const [statusFilter, setStatusFilter] = useState("");
  const [search, setSearch] = useState("");

  const filtered = orders.filter((o) => {
    const matchesStatus = statusFilter ? o.status === statusFilter : true;
    const matchesSearch =
      o.id.toLowerCase().includes(search.toLowerCase()) ||
      o.customer.toLowerCase().includes(search.toLowerCase()) ||
      o.city.toLowerCase().includes(search.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const handleUpdateStatus = (id: string, newStatus: string) => {
    setOrders(
      orders.map((o) => (o.id === id ? { ...o, status: newStatus } : o))
    );
    toast.success(`Order ${id} updated to ${newStatus}`);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1
            className="text-3xl font-medium text-[#F5EFE4]"
            style={{ fontFamily: "Cormorant Garamond, Georgia, serif" }}
          >
            Orders Management
          </h1>
          <p className="text-xs text-[#8B7355] mt-1">
            Track and process customer orders across all states. ({filtered.length} total)
          </p>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8B7355]"
          />
          <input
            type="text"
            placeholder="Search by Order ID, customer, city..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl text-xs bg-[#140D07] border border-[#2A1D13] text-[#F5EFE4] placeholder-[#8B7355] focus:outline-none focus:border-[#C4964A]"
            id="admin-order-search"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-3 py-2 rounded-xl text-xs bg-[#140D07] border border-[#2A1D13] text-[#F5EFE4] focus:outline-none focus:border-[#C4964A]"
          id="admin-order-status-filter"
        >
          <option value="">All Statuses</option>
          <option value="Processing">Processing</option>
          <option value="Shipped">Shipped</option>
          <option value="Delivered">Delivered</option>
          <option value="Cancelled">Cancelled</option>
        </select>
      </div>

      {/* Orders Table */}
      <div
        className="rounded-2xl border border-[#2A1D13] overflow-hidden"
        style={{ background: "#140D07" }}
      >
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr
                className="border-b border-[#2A1D13] text-[11px] uppercase tracking-wider text-[#8B7355]"
                style={{ background: "#1A1208" }}
              >
                <th className="p-4 font-semibold">Order ID</th>
                 <th className="p-4 font-semibold">Customer</th>
                 <th className="p-4 font-semibold">Payment</th>
                 <th className="p-4 font-semibold">Total</th>
                 <th className="p-4 font-semibold">Status</th>
                 <th className="p-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#2A1D13] text-xs">
              {filtered.map((order) => (
                <tr key={order.id} className="hover:bg-[#1F140B] transition-colors">
                  <td className="p-4 font-mono font-semibold text-[#C4964A]">{order.id}</td>
                  <td className="p-4">
                    <p className="font-medium text-[#F5EFE4]">{order.customer}</p>
                    <p className="text-[10px] text-[#8B7355]">{order.phone}</p>
                  </td>
                  <td className="p-4 text-[#A08060]">{order.paymentMethod}</td>
                  <td className="p-4 font-semibold text-[#F5EFE4]">
                    {formatPrice(order.total)}
                  </td>
                  <td className="p-4">
                    <select
                      value={order.status}
                      onChange={(e) => handleUpdateStatus(order.id, e.target.value)}
                      className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-[#1F140B] border border-[#3A281A] focus:outline-none"
                      style={{
                        color:
                          order.status === "Delivered"
                            ? "#4ADE80"
                            : order.status === "Shipped"
                            ? "#60A5FA"
                            : order.status === "Cancelled"
                            ? "#F87171"
                            : "#FBBF24",
                      }}
                      id={`order-status-select-${order.id}`}
                    >
                      <option value="Processing">Processing</option>
                      <option value="Shipped">Shipped</option>
                      <option value="Delivered">Delivered</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => toast.success(`Invoice generated for ${order.id}`)}
                        className="p-1.5 rounded-lg text-[#8B7355] hover:text-[#C4964A] hover:bg-[#2A1D13]"
                        title="Print Invoice"
                      >
                        <Printer size={14} />
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
