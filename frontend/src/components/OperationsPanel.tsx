"use client";

import React, { useState } from "react";
import { useStore } from "@/context/StoreContext";
import { Truck, Package, Printer, Barcode, CheckCircle, MapPin, Building, ShieldCheck } from "lucide-react";

export const OperationsPanel: React.FC = () => {
  const { showToast } = useStore();
  const [selectedCourier, setSelectedCourier] = useState("Shiprocket Express");
  const [waybill, setWaybill] = useState("SR-9482103859");

  const handlePrintLabel = () => {
    showToast("Generating PDF Packing Label with Barcode & Wax Seal... 🖨️");
  };

  return (
    <div className="bg-white rounded-2xl border border-brand-beige p-6 space-y-6 shadow-sm text-xs">
      
      <div className="flex items-center justify-between border-b border-brand-beige pb-4">
        <div>
          <span className="text-[10px] font-bold text-brand-gold uppercase tracking-widest flex items-center gap-1">
            <Truck className="w-3.5 h-3.5" /> WAREHOUSE & LOGISTICS OPERATIONS
          </span>
          <h3 className="font-serif text-xl font-bold text-brand-charcoal">Fulfillment & Courier Dispatch</h3>
        </div>

        <button
          onClick={handlePrintLabel}
          className="bg-brand-charcoal text-brand-gold px-4 py-2 rounded-xl font-bold hover:bg-brand-gold hover:text-brand-charcoal transition-colors flex items-center gap-1.5 shadow"
        >
          <Printer className="w-4 h-4" /> Print Packing Label
        </button>
      </div>

      {/* Warehouse Status Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="bg-brand-surface p-4 rounded-xl border border-brand-beige">
          <span className="text-[10px] font-bold text-brand-earth uppercase block">Primary Atelier Warehouse</span>
          <p className="font-serif text-base font-bold text-brand-charcoal mt-0.5">Mumbai Hub #1</p>
          <span className="text-[10px] text-green-700 font-bold">5,000 SKU Capacity (82% Available)</span>
        </div>

        <div className="bg-brand-surface p-4 rounded-xl border border-brand-beige">
          <span className="text-[10px] font-bold text-brand-earth uppercase block">Active Courier API</span>
          <p className="font-serif text-base font-bold text-brand-gold mt-0.5">{selectedCourier}</p>
          <span className="text-[10px] text-brand-earth">Live API Status: ONLINE</span>
        </div>

        <div className="bg-brand-surface p-4 rounded-xl border border-brand-beige">
          <span className="text-[10px] font-bold text-brand-earth uppercase block">Waybill Tracking</span>
          <p className="font-mono text-base font-bold text-brand-charcoal mt-0.5">{waybill}</p>
          <span className="text-[10px] text-green-700 font-bold">Label Barcode Validated</span>
        </div>
      </div>

      {/* Packing Label Preview Component */}
      <div className="border-2 border-dashed border-brand-gold/60 p-6 rounded-2xl bg-brand-surface max-w-xl mx-auto space-y-4">
        <div className="flex justify-between items-center border-b border-brand-beige pb-3">
          <div>
            <h4 className="font-serif text-sm font-bold text-brand-charcoal">THE CANDLE LAB ATELIER</h4>
            <p className="text-[10px] text-brand-earth">Return Address: Royal Palms, MG Road, Mumbai 400001</p>
          </div>
          <span className="text-xs font-bold text-brand-gold font-mono border border-brand-gold px-2 py-0.5 rounded">
            EXPRESS
          </span>
        </div>

        <div className="space-y-1">
          <span className="text-[10px] font-bold text-gray-500 uppercase block">Ship To:</span>
          <p className="font-bold text-brand-charcoal">Aarav Sharma (+91 98765 43210)</p>
          <p className="text-gray-600">Flat 402, Royal Palms, MG Road, Mumbai, Maharashtra 400001</p>
        </div>

        <div className="bg-white p-3 rounded-lg border border-brand-beige flex items-center justify-between">
          <div>
            <p className="font-bold text-brand-charcoal">Package Contents: Velvet Amber Oud (280g)</p>
            <p className="text-[10px] text-brand-earth">Gift Sealed: Yes • Gold Wax Stamp Applied</p>
          </div>
          <Barcode className="w-20 h-10 text-brand-charcoal" />
        </div>
      </div>

    </div>
  );
};
