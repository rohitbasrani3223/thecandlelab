"use client";

import React, { useState } from "react";
import { useStore } from "@/context/StoreContext";
import { SlidersHorizontal, X, ShoppingBag, Check, Trash2, Scale } from "lucide-react";

export const CompareModal: React.FC = () => {
  const { compareList, toggleCompare, clearCompare, addToCart, currency } = useStore();
  const [isOpen, setIsOpen] = useState(false);

  if (compareList.length === 0) return null;

  return (
    <>
      {/* Sticky Bottom Comparison Bar */}
      <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-40 bg-brand-charcoal text-brand-beige border-2 border-brand-gold px-4 py-3 rounded-2xl shadow-2xl flex items-center gap-4 animate-bounce">
        <div className="flex items-center gap-2">
          <Scale className="w-5 h-5 text-brand-gold" />
          <span className="text-xs font-serif font-bold">Compare Candles ({compareList.length}/3)</span>
        </div>

        <div className="flex gap-2">
          {compareList.map((p) => (
            <div key={p.id} className="relative group">
              <img src={p.images[0]} alt="" className="w-8 h-8 object-cover rounded-md border border-brand-gold" />
              <button
                onClick={() => toggleCompare(p)}
                className="absolute -top-1 -right-1 bg-red-600 text-white rounded-full p-0.5 text-[8px]"
              >
                <X className="w-2.5 h-2.5" />
              </button>
            </div>
          ))}
        </div>

        <button
          onClick={() => setIsOpen(true)}
          className="bg-brand-gold text-brand-charcoal px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-brand-goldLight"
        >
          Compare Now ⚖️
        </button>

        <button onClick={clearCompare} className="text-xs text-gray-400 hover:text-white">
          Clear
        </button>
      </div>

      {/* Comparison Modal Table */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md">
          <div className="relative w-full max-w-4xl bg-brand-surface rounded-2xl border-2 border-brand-gold shadow-2xl p-6 max-h-[90vh] overflow-y-auto">
            
            <button onClick={() => setIsOpen(false)} className="absolute top-4 right-4 p-2 text-brand-charcoal hover:bg-brand-beige rounded-full">
              <X className="w-5 h-5" />
            </button>

            <h3 className="font-serif text-2xl font-bold text-brand-charcoal mb-6 border-b border-brand-beige pb-3">
              SIDE-BY-SIDE CANDLE COMPARISON
            </h3>

            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left border-collapse">
                <thead>
                  <tr className="border-b border-brand-beige">
                    <th className="p-3 bg-brand-beige/40 font-serif font-bold text-brand-charcoal w-36">Specs</th>
                    {compareList.map((p) => (
                      <th key={p.id} className="p-3 text-center border-l border-brand-beige">
                        <img src={p.images[0]} alt="" className="w-20 h-20 object-cover rounded-lg mx-auto mb-2" />
                        <h4 className="font-serif text-xs font-bold text-brand-charcoal line-clamp-1">{p.name}</h4>
                        <span className="text-xs font-bold text-brand-gold block">{currency}{p.price}</span>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-brand-beige text-brand-charcoal">
                  <tr>
                    <td className="p-3 font-bold bg-brand-beige/20">Burn Time</td>
                    {compareList.map((p) => (
                      <td key={p.id} className="p-3 text-center border-l border-brand-beige font-bold text-brand-gold">{p.burnTimeHours} Hours</td>
                    ))}
                  </tr>
                  <tr>
                    <td className="p-3 font-bold bg-brand-beige/20">Wax Blend</td>
                    {compareList.map((p) => (
                      <td key={p.id} className="p-3 text-center border-l border-brand-beige">{p.waxType}</td>
                    ))}
                  </tr>
                  <tr>
                    <td className="p-3 font-bold bg-brand-beige/20">Wick Type</td>
                    {compareList.map((p) => (
                      <td key={p.id} className="p-3 text-center border-l border-brand-beige">{p.wickType}</td>
                    ))}
                  </tr>
                  <tr>
                    <td className="p-3 font-bold bg-brand-beige/20">Weight</td>
                    {compareList.map((p) => (
                      <td key={p.id} className="p-3 text-center border-l border-brand-beige">{p.weightGrams}g</td>
                    ))}
                  </tr>
                  <tr>
                    <td className="p-3 font-bold bg-brand-beige/20">Top Notes</td>
                    {compareList.map((p) => (
                      <td key={p.id} className="p-3 text-center border-l border-brand-beige text-[11px]">{p.fragranceNotes.top.join(", ")}</td>
                    ))}
                  </tr>
                  <tr>
                    <td className="p-3 font-bold bg-brand-beige/20">Base Notes</td>
                    {compareList.map((p) => (
                      <td key={p.id} className="p-3 text-center border-l border-brand-beige text-[11px]">{p.fragranceNotes.base.join(", ")}</td>
                    ))}
                  </tr>
                  <tr>
                    <td className="p-3 font-bold bg-brand-beige/20">Action</td>
                    {compareList.map((p) => (
                      <td key={p.id} className="p-3 text-center border-l border-brand-beige">
                        <button
                          onClick={() => {
                            addToCart(p);
                            setIsOpen(false);
                          }}
                          className="bg-brand-charcoal text-brand-gold px-3 py-1.5 rounded-lg font-bold text-[11px] hover:bg-brand-gold hover:text-brand-charcoal transition-colors"
                        >
                          Add to Bag 🛒
                        </button>
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>

          </div>
        </div>
      )}
    </>
  );
};
