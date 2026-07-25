"use client";

import React, { useState } from "react";
import { useStore, OrderRecord } from "@/context/StoreContext";
import {
  Search,
  Filter,
  Download,
  Printer,
  Truck,
  FileText,
  CheckSquare,
  Square,
  ChevronRight,
  X,
  Package,
  Clock,
  CheckCircle2,
  AlertCircle,
  Phone,
  Mail,
  MapPin,
  Barcode,
  ExternalLink,
  DollarSign
} from "lucide-react";

export const OrderManagementModule: React.FC = () => {
  const { orders, updateOrderStatus, showToast } = useStore();
  const [selectedFilter, setSelectedFilter] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedOrders, setSelectedOrders] = useState<string[]>([]);
  const [activeOrderDrawer, setActiveOrderDrawer] = useState<OrderRecord | null>(null);

  // Modals for Courier Assignment & Label Printing
  const [isCourierModalOpen, setIsCourierModalOpen] = useState(false);
  const [isInvoiceModalOpen, setIsInvoiceModalOpen] = useState(false);
  const [assigningCourier, setAssigningCourier] = useState("Bluedart Express");
  const [waybillInput, setWaybillInput] = useState("BD-" + Math.floor(100000 + Math.random() * 900000));

  // Filter logic
  const filteredOrders = orders.filter((o) => {
    if (selectedFilter !== "ALL" && o.status.toUpperCase() !== selectedFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        o.id.toLowerCase().includes(q) ||
        o.customerName.toLowerCase().includes(q) ||
        o.customerPhone.includes(q) ||
        o.courier.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const toggleSelectAll = () => {
    if (selectedOrders.length === filteredOrders.length) {
      setSelectedOrders([]);
    } else {
      setSelectedOrders(filteredOrders.map((o) => o.id));
    }
  };

  const toggleSelectOrder = (id: string) => {
    setSelectedOrders((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleBulkExportCSV = () => {
    showToast(`Exported ${selectedOrders.length || filteredOrders.length} orders to CSV format 📄`);
  };

  const handleBulkPrintInvoice = () => {
    setIsInvoiceModalOpen(true);
  };

  const handleBulkAssignCourier = () => {
    setIsCourierModalOpen(true);
  };

  const handleGenerateLabels = () => {
    showToast(`Generated Shipping Labels & Waybills for ${selectedOrders.length || filteredOrders.length} orders 🏷️`);
  };

  const handleConfirmCourierAssignment = () => {
    const targets = selectedOrders.length > 0 ? selectedOrders : activeOrderDrawer ? [activeOrderDrawer.id] : [];
    targets.forEach((id) => {
      updateOrderStatus(id, "Packed", assigningCourier, waybillInput);
    });
    setIsCourierModalOpen(false);
    showToast(`Assigned ${assigningCourier} to selected orders with Waybill #${waybillInput} 🚚`);
  };

  return (
    <div className="space-y-6">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Order Management Hub</h2>
          <p className="text-xs text-slate-500 mt-0.5">Filter, process fulfillment, generate shipping labels & manage courier logistics.</p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={handleBulkExportCSV}
            className="bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-300 px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors"
          >
            <Download className="w-3.5 h-3.5" /> Export CSV
          </button>
          <button
            onClick={handleBulkPrintInvoice}
            className="bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-300 px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors"
          >
            <Printer className="w-3.5 h-3.5" /> Print Invoice
          </button>
          <button
            onClick={handleBulkAssignCourier}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow transition-colors"
          >
            <Truck className="w-3.5 h-3.5" /> Assign Courier
          </button>
          <button
            onClick={handleGenerateLabels}
            className="bg-emerald-600 hover:bg-emerald-700 text-white px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow transition-colors"
          >
            <FileText className="w-3.5 h-3.5" /> Generate Labels
          </button>
        </div>
      </div>

      {/* Filter Tabs & Search Bar */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm space-y-4">
        <div className="flex flex-col lg:flex-row justify-between gap-4 items-stretch lg:items-center">
          {/* Status Tabs */}
          <div className="flex overflow-x-auto gap-1 border-b lg:border-none border-slate-200 pb-2 lg:pb-0 scrollbar-none text-xs font-medium">
            {["ALL", "PENDING", "PACKED", "SHIPPED", "DELIVERED", "CANCELLED", "REFUND", "RETURNED"].map((tab) => {
              const count = tab === "ALL" ? orders.length : orders.filter((o) => o.status.toUpperCase() === tab).length;
              return (
                <button
                  key={tab}
                  onClick={() => setSelectedFilter(tab)}
                  className={`px-3 py-2 rounded-xl font-semibold transition-all whitespace-nowrap flex items-center gap-1.5 ${
                    selectedFilter === tab
                      ? "bg-slate-900 text-white shadow"
                      : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                  }`}
                >
                  {tab.charAt(0) + tab.slice(1).toLowerCase()}
                  <span
                    className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                      selectedFilter === tab ? "bg-slate-700 text-white" : "bg-slate-200 text-slate-700"
                    }`}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Search Box */}
          <div className="relative w-full lg:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search by ID, name, phone..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-2 text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>

        {/* Selected count notification */}
        {selectedOrders.length > 0 && (
          <div className="bg-indigo-50 border border-indigo-100 p-2.5 rounded-xl flex items-center justify-between text-xs text-indigo-900 font-medium">
            <span>Selected {selectedOrders.length} orders for bulk processing.</span>
            <button
              onClick={() => setSelectedOrders([])}
              className="text-indigo-700 hover:underline font-semibold"
            >
              Clear selection
            </button>
          </div>
        )}
      </div>

      {/* Professional Order Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase tracking-wider font-semibold text-[11px]">
                <th className="p-4 w-10 text-center">
                  <button onClick={toggleSelectAll} className="text-slate-400 hover:text-slate-600">
                    {selectedOrders.length === filteredOrders.length && filteredOrders.length > 0 ? (
                      <CheckSquare className="w-4 h-4 text-indigo-600" />
                    ) : (
                      <Square className="w-4 h-4" />
                    )}
                  </button>
                </th>
                <th className="p-4">Order ID</th>
                <th className="p-4">Customer</th>
                <th className="p-4">Phone</th>
                <th className="p-4">Products</th>
                <th className="p-4">Amount</th>
                <th className="p-4">Payment</th>
                <th className="p-4">Status</th>
                <th className="p-4">Courier</th>
                <th className="p-4">Tracking</th>
                <th className="p-4">Date</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={12} className="text-center py-12 text-slate-400 font-normal">
                    No matching orders found in this category.
                  </td>
                </tr>
              ) : (
                filteredOrders.map((ord) => {
                  const isSelected = selectedOrders.includes(ord.id);
                  return (
                    <tr
                      key={ord.id}
                      className={`hover:bg-slate-50/80 transition-colors ${isSelected ? "bg-indigo-50/40" : ""}`}
                    >
                      <td className="p-4 text-center">
                        <button onClick={() => toggleSelectOrder(ord.id)} className="text-slate-400 hover:text-slate-600">
                          {isSelected ? (
                            <CheckSquare className="w-4 h-4 text-indigo-600" />
                          ) : (
                            <Square className="w-4 h-4" />
                          )}
                        </button>
                      </td>
                      <td className="p-4 font-bold text-indigo-600 font-mono">{ord.id}</td>
                      <td className="p-4">
                        <div className="font-bold text-slate-900">{ord.customerName}</div>
                        <div className="text-[10px] text-slate-400">{ord.customerEmail}</div>
                      </td>
                      <td className="p-4 text-slate-600 font-mono">{ord.customerPhone}</td>
                      <td className="p-4 text-slate-800 max-w-xs truncate" title={ord.itemsSummary}>
                        {ord.itemsSummary}
                      </td>
                      <td className="p-4 font-bold text-slate-900">₹{ord.totalAmount}</td>
                      <td className="p-4">
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-700">
                          {ord.paymentMethod} • {ord.paymentStatus}
                        </span>
                      </td>
                      <td className="p-4">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                            ord.status === "Pending"
                              ? "bg-amber-50 text-amber-700 border border-amber-200"
                              : ord.status === "Packed"
                              ? "bg-blue-50 text-blue-700 border border-blue-200"
                              : ord.status === "Shipped"
                              ? "bg-indigo-50 text-indigo-700 border border-indigo-200"
                              : ord.status === "Delivered"
                              ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                              : ord.status === "Cancelled"
                              ? "bg-rose-50 text-rose-700 border border-rose-200"
                              : "bg-purple-50 text-purple-700 border border-purple-200"
                          }`}
                        >
                          {ord.status}
                        </span>
                      </td>
                      <td className="p-4 text-slate-600">{ord.courier}</td>
                      <td className="p-4 text-slate-500 font-mono text-[11px]">{ord.trackingNumber}</td>
                      <td className="p-4 text-slate-400 text-[11px]">{ord.date}</td>
                      <td className="p-4 text-right">
                        <button
                          onClick={() => setActiveOrderDrawer(ord)}
                          className="bg-slate-100 hover:bg-slate-200 text-slate-800 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-colors"
                        >
                          View 360°
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Right Side Drawer Panel for Order Inspection */}
      {activeOrderDrawer && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex justify-end">
          <div className="w-full max-w-xl bg-white h-full shadow-2xl overflow-y-auto p-6 space-y-6 flex flex-col justify-between">
            <div className="space-y-6">
              {/* Drawer Header */}
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-indigo-600 font-mono">{activeOrderDrawer.id}</span>
                    <span className="bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded text-[10px] font-bold border border-emerald-200">
                      {activeOrderDrawer.status}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 mt-1">Order Summary & Tracking</h3>
                </div>
                <button
                  onClick={() => setActiveOrderDrawer(null)}
                  className="p-2 rounded-xl bg-slate-100 text-slate-500 hover:text-slate-900 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Customer Profile Box */}
              <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 space-y-2">
                <span className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">Customer Details</span>
                <div className="font-bold text-sm text-slate-900">{activeOrderDrawer.customerName}</div>
                <div className="text-xs text-slate-600 flex items-center gap-2">
                  <Mail className="w-3.5 h-3.5 text-slate-400" /> {activeOrderDrawer.customerEmail}
                </div>
                <div className="text-xs text-slate-600 flex items-center gap-2">
                  <Phone className="w-3.5 h-3.5 text-slate-400" /> {activeOrderDrawer.customerPhone}
                </div>
                <div className="text-xs text-slate-600 flex items-start gap-2 pt-1 border-t border-slate-200/60 mt-2">
                  <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                  <span>{activeOrderDrawer.shippingAddress}</span>
                </div>
              </div>

              {/* Items Summary */}
              <div className="space-y-3">
                <span className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">Order Line Items</span>
                <div className="bg-white rounded-xl border border-slate-200 p-4 space-y-3">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-bold text-slate-900">{activeOrderDrawer.itemsSummary}</span>
                    <span className="font-bold text-slate-900">₹{activeOrderDrawer.totalAmount}</span>
                  </div>
                  <div className="text-[11px] text-slate-500 flex justify-between border-t border-slate-100 pt-2">
                    <span>Payment Method: <strong>{activeOrderDrawer.paymentMethod}</strong></span>
                    <span>Status: <strong className="text-emerald-600">{activeOrderDrawer.paymentStatus}</strong></span>
                  </div>
                </div>
              </div>

              {/* Shipment Logistics */}
              <div className="space-y-3">
                <span className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">Courier & Dispatch Info</span>
                <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 space-y-3 text-xs">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Assigned Courier:</span>
                    <span className="font-bold text-slate-900">{activeOrderDrawer.courier}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Waybill Tracking:</span>
                    <span className="font-mono font-bold text-indigo-600">{activeOrderDrawer.trackingNumber}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Order Timestamp:</span>
                    <span className="text-slate-700">{activeOrderDrawer.date}</span>
                  </div>
                </div>
              </div>

              {/* Status Update Quick Buttons */}
              <div className="space-y-2">
                <span className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">Update Status</span>
                <div className="grid grid-cols-3 gap-2 text-xs font-semibold">
                  <button
                    onClick={() => updateOrderStatus(activeOrderDrawer.id, "Packed")}
                    className="p-2 rounded-xl bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200 transition-colors"
                  >
                    Mark Packed
                  </button>
                  <button
                    onClick={() => updateOrderStatus(activeOrderDrawer.id, "Shipped")}
                    className="p-2 rounded-xl bg-indigo-50 text-indigo-700 hover:bg-indigo-100 border border-indigo-200 transition-colors"
                  >
                    Mark Shipped
                  </button>
                  <button
                    onClick={() => updateOrderStatus(activeOrderDrawer.id, "Delivered")}
                    className="p-2 rounded-xl bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200 transition-colors"
                  >
                    Mark Delivered
                  </button>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 flex gap-3">
              <button
                onClick={() => setIsCourierModalOpen(true)}
                className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white py-2.5 rounded-xl text-xs font-bold transition-colors text-center"
              >
                Re-assign Courier
              </button>
              <button
                onClick={() => setIsInvoiceModalOpen(true)}
                className="bg-slate-100 hover:bg-slate-200 text-slate-900 py-2.5 px-4 rounded-xl text-xs font-bold transition-colors"
              >
                Print Invoice
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Courier Assignment Modal */}
      {isCourierModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4 border border-slate-200">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Truck className="w-4 h-4 text-indigo-600" /> Assign Logistics Courier
              </h3>
              <button onClick={() => setIsCourierModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Select Courier Partner</label>
                <select
                  value={assigningCourier}
                  onChange={(e) => setAssigningCourier(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="Bluedart Express">Bluedart Express</option>
                  <option value="Delhivery Courier">Delhivery Courier</option>
                  <option value="Shiprocket Air">Shiprocket Air</option>
                  <option value="FedEx Priority">FedEx Priority</option>
                  <option value="DHL Worldwide">DHL Worldwide</option>
                </select>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Waybill / Airway Bill (AWB)</label>
                <input
                  type="text"
                  value={waybillInput}
                  onChange={(e) => setWaybillInput(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-mono font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex justify-end gap-2 text-xs font-semibold">
              <button
                onClick={() => setIsCourierModalOpen(false)}
                className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmCourierAssignment}
                className="px-4 py-2 rounded-xl bg-indigo-600 text-white hover:bg-indigo-700 shadow transition-colors"
              >
                Confirm Assignment
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Invoice Modal Preview */}
      {isInvoiceModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4 border border-slate-200">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Printer className="w-4 h-4 text-indigo-600" /> Printable Tax Invoice
              </h3>
              <button onClick={() => setIsInvoiceModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="border border-slate-200 rounded-xl p-4 bg-slate-50 space-y-3 text-xs">
              <div className="flex justify-between items-start border-b border-slate-200 pb-3">
                <div>
                  <h4 className="font-bold text-slate-900">THE CANDLE LAB ATELIER</h4>
                  <p className="text-[10px] text-slate-500">GSTIN: 27AAATC1234F1Z5 • Mumbai, India</p>
                </div>
                <span className="text-[10px] bg-slate-900 text-white px-2 py-0.5 rounded font-bold font-mono">
                  TAX INVOICE
                </span>
              </div>

              <div className="space-y-1">
                <p className="font-bold text-slate-900">Billed To: Aarav Sharma</p>
                <p className="text-slate-600">Royal Palms, MG Road, Mumbai 400001</p>
              </div>

              <div className="bg-white p-2.5 rounded-lg border border-slate-200 flex justify-between font-mono font-bold">
                <span>TOTAL PAYABLE (INCL. 18% GST):</span>
                <span>₹1,798</span>
              </div>
            </div>

            <div className="pt-2 flex justify-end gap-2 text-xs font-semibold">
              <button
                onClick={() => setIsInvoiceModalOpen(false)}
                className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors"
              >
                Close
              </button>
              <button
                onClick={() => {
                  showToast("Invoice sent to printer / PDF download initiated 🖨️");
                  setIsInvoiceModalOpen(false);
                }}
                className="px-4 py-2 rounded-xl bg-emerald-600 text-white hover:bg-emerald-700 shadow transition-colors"
              >
                Print PDF Invoice
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
