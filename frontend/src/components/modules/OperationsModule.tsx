"use client";

import React, { useState } from "react";
import { useStore } from "@/context/StoreContext";
import {
  Truck,
  Package,
  Barcode,
  Printer,
  RotateCcw,
  Building,
  CheckCircle2,
  AlertTriangle,
  FileText,
  Search,
  Scan,
  RefreshCw,
  Box,
  MapPin
} from "lucide-react";

export const OperationsModule: React.FC = () => {
  const { warehouseItems, updateWarehouseStock, orders, showToast } = useStore();
  const [barcodeInput, setBarcodeInput] = useState("");
  const [scannedResult, setScannedResult] = useState<string | null>(null);

  const handleScanBarcode = (e: React.FormEvent) => {
    e.preventDefault();
    if (!barcodeInput) return;
    const match = warehouseItems.find((w) => w.barcode === barcodeInput || w.sku === barcodeInput);
    if (match) {
      setScannedResult(`SUCCESS: Found ${match.name} (Stock: ${match.totalStock}) in ${match.location}`);
      showToast(`Scanned SKU #${match.sku} - Stock Validated ✅`);
    } else {
      setScannedResult(`FAILED: Barcode #${barcodeInput} not recognized in warehouse inventory.`);
      showToast(`Barcode not recognized ⚠️`);
    }
  };

  const handlePrintPackingSlip = (orderId: string) => {
    showToast(`Packing Slip for Order #${orderId} printed 🖨️`);
  };

  return (
    <div className="space-y-6">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Warehouse Operations & Logistics Suite</h2>
          <p className="text-xs text-slate-500 mt-0.5">Manage stock allocation, barcode scanning, packing queues, courier labels & return processing.</p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => showToast("Barcode Scanner hardware sync active 📲")}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow transition-colors"
          >
            <Scan className="w-3.5 h-3.5" /> Hardware Scanner Live
          </button>
        </div>
      </div>

      {/* Barcode Scanner Simulator */}
      <div className="bg-slate-900 text-white p-6 rounded-2xl shadow-md border border-slate-800 space-y-4">
        <div className="flex justify-between items-center border-b border-slate-800 pb-3">
          <h3 className="text-sm font-bold flex items-center gap-2 text-amber-400">
            <Barcode className="w-4 h-4" /> Barcode SKU Scanner & Rapid Verification
          </h3>
          <span className="text-[10px] font-mono text-emerald-400">Status: READY TO SCAN</span>
        </div>

        <form onSubmit={handleScanBarcode} className="flex gap-2">
          <input
            type="text"
            placeholder="Scan barcode or type SKU (e.g. 8901234567890 or SKU-AMB-001)..."
            value={barcodeInput}
            onChange={(e) => setBarcodeInput(e.target.value)}
            className="flex-1 bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-xs font-mono text-white focus:outline-none focus:ring-2 focus:ring-amber-400"
          />
          <button
            type="submit"
            className="bg-amber-400 hover:bg-amber-500 text-slate-950 px-5 py-2.5 rounded-xl text-xs font-bold transition-colors"
          >
            Verify SKU
          </button>
        </form>

        {scannedResult && (
          <div className="p-3 rounded-xl bg-slate-800 border border-slate-700 text-xs font-mono text-amber-300">
            {scannedResult}
          </div>
        )}
      </div>

      {/* Warehouse Locations & Stock */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
        <div className="flex justify-between items-center border-b border-slate-100 pb-3">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <Box className="w-4 h-4 text-indigo-600" /> Primary Warehouse Hub (Mumbai Central #1)
          </h3>
          <span className="text-xs text-slate-500 font-semibold">Capacity: 5,000 Units (82% Available)</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {warehouseItems.map((item) => (
            <div key={item.id} className="p-4 rounded-xl border border-slate-200 bg-slate-50/70 flex justify-between items-center text-xs">
              <div>
                <h4 className="font-bold text-slate-900">{item.name}</h4>
                <p className="text-[10px] text-slate-500 font-mono mt-0.5">SKU: {item.sku} • Barcode: {item.barcode}</p>
                <div className="flex items-center gap-1 text-[11px] text-slate-600 mt-1">
                  <MapPin className="w-3 h-3 text-slate-400" /> {item.location}
                </div>
              </div>
              <div className="text-right">
                <span className="text-base font-bold text-slate-900 block">{item.totalStock} units</span>
                <span className="text-[10px] text-indigo-600 font-semibold">{item.reservedStock} reserved</span>
                <button
                  onClick={() => updateWarehouseStock(item.id, 50)}
                  className="mt-2 bg-slate-900 text-white px-2.5 py-1 rounded text-[10px] font-bold hover:bg-slate-800 transition-colors"
                >
                  + Restock 50
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Packing Station Queue */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
        <div className="flex justify-between items-center border-b border-slate-100 pb-3">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <Package className="w-4 h-4 text-emerald-600" /> Packing Station Fulfillment Queue
          </h3>
          <span className="text-xs font-semibold text-emerald-600">3 Orders Waiting</span>
        </div>

        <div className="space-y-3">
          {orders.slice(0, 3).map((ord) => (
            <div key={ord.id} className="p-4 rounded-xl border border-slate-200 bg-white flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 text-xs">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-indigo-600 font-mono">{ord.id}</span>
                  <span className="text-slate-900 font-bold">{ord.customerName}</span>
                </div>
                <p className="text-slate-600 mt-0.5">{ord.itemsSummary}</p>
                <span className="text-[10px] text-slate-400">{ord.shippingAddress}</span>
              </div>

              <div className="flex items-center gap-2 self-end sm:self-auto">
                <button
                  onClick={() => handlePrintPackingSlip(ord.id)}
                  className="bg-slate-100 hover:bg-slate-200 text-slate-900 px-3 py-1.5 rounded-lg font-bold flex items-center gap-1 transition-colors"
                >
                  <Printer className="w-3.5 h-3.5" /> Packing Slip
                </button>
                <button
                  onClick={() => showToast(`Label PDF printed for Order #${ord.id} 🏷️`)}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-1.5 rounded-lg font-bold transition-colors"
                >
                  Print Label
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
