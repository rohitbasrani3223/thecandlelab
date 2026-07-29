"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Scale, X, ShoppingBag } from "lucide-react";
import { useCartStore, useCompareStore } from "@/store";
import { formatPrice } from "@/lib/utils";
import toast from "react-hot-toast";

export function CompareModal() {
  const { items: compareList, toggleCompare, clearCompare } = useCompareStore();
  const { addItem } = useCartStore();
  const [isOpen, setIsOpen] = useState(false);

  if (!compareList || compareList.length === 0) return null;

  return (
    <>
      {/* Floating Bottom Comparison Trigger Bar */}
      <motion.div
        initial={{ y: 80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 80, opacity: 0 }}
        className="fixed bottom-5 left-1/2 -translate-x-1/2 z-[250] px-4 py-2.5 rounded-2xl flex items-center gap-3 shadow-2xl"
        style={{
          background: "rgba(26,18,8,0.92)",
          backdropFilter: "blur(16px)",
          border: "1.5px solid #C4964A",
          boxShadow: "0 12px 36px rgba(26,18,8,0.40), 0 0 20px rgba(196,150,74,0.25)",
        }}
      >
        <div className="flex items-center gap-2 text-[#FDFAF5]">
          <Scale className="w-4 h-4 text-[#C4964A]" />
          <span className="text-xs font-semibold" style={{ fontFamily: "Cormorant Garamond, Georgia, serif" }}>
            Compare ({compareList.length}/3)
          </span>
        </div>

        <div className="flex gap-1.5">
          {compareList.map((p) => (
            <div key={p.id} className="relative group">
              <div className="w-7 h-7 rounded-md overflow-hidden relative border border-[#C4964A]">
                <Image src={p.thumbnail || p.images[0]} alt={p.name} fill className="object-cover" />
              </div>
              <button
                onClick={() => {
                  toggleCompare(p);
                  toast("Removed from compare");
                }}
                className="absolute -top-1 -right-1 bg-[#B85450] text-white rounded-full p-0.5 shadow transition-transform hover:scale-110"
                aria-label={`Remove ${p.name}`}
              >
                <X className="w-2.5 h-2.5" />
              </button>
            </div>
          ))}
        </div>

        <button
          onClick={() => setIsOpen(true)}
          className="px-3 py-1 rounded-xl text-xs font-bold uppercase tracking-wider transition-all hover:scale-105"
          style={{ background: "#C4964A", color: "#1A1208" }}
        >
          Compare ⚖️
        </button>

        <button
          onClick={() => {
            clearCompare();
            toast("Cleared compare list");
          }}
          className="text-[11px] text-[#A08060] hover:text-[#FDFAF5] transition-colors"
        >
          Clear
        </button>
      </motion.div>

      {/* Comparison Table Modal */}
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-[400] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-[#1A1208]/70 backdrop-blur-md"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="relative w-full max-w-4xl bg-[#FDFAF5] rounded-3xl border-2 border-[#C4964A] shadow-2xl p-6 z-10 max-h-[90vh] overflow-y-auto"
            >
              <button
                onClick={() => setIsOpen(false)}
                className="absolute top-5 right-5 p-2 text-[#8B7355] hover:text-[#1A1208] hover:bg-[#F5EFE4] rounded-full transition-colors"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="mb-6 pb-3 border-b border-[#EDE4D4]">
                <span className="text-[10px] font-bold text-[#A87B32] uppercase tracking-widest">
                  Side-by-Side Analysis
                </span>
                <h3
                  className="text-2xl font-normal text-[#1A1208]"
                  style={{ fontFamily: "Cormorant Garamond, Georgia, serif" }}
                >
                  Candle Specs Comparison
                </h3>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left border-collapse">
                  <thead>
                    <tr className="border-b border-[#EDE4D4]">
                      <th className="p-3 bg-[#F5EFE4] font-bold text-[#1A1208] w-32 uppercase tracking-wider text-[10px]">
                        Attribute
                      </th>
                      {compareList.map((p) => (
                        <th key={p.id} className="p-3 text-center border-l border-[#EDE4D4] min-w-[180px]">
                          <div className="relative w-20 h-20 mx-auto mb-2 rounded-xl overflow-hidden bg-[#F5EFE4] border border-[#E0D0B8]">
                            <Image src={p.thumbnail || p.images[0]} alt={p.name} fill className="object-cover" />
                          </div>
                          <h4
                            className="font-medium text-sm text-[#1A1208] line-clamp-1"
                            style={{ fontFamily: "Cormorant Garamond, Georgia, serif" }}
                          >
                            {p.name}
                          </h4>
                          <span className="text-xs font-bold text-[#A87B32] block mt-0.5">
                            {formatPrice(p.price)}
                          </span>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#EDE4D4] text-[#4A3728]">
                    <tr>
                      <td className="p-3 font-semibold bg-[#F5EFE4]/50">Category</td>
                      {compareList.map((p) => (
                        <td key={p.id} className="p-3 text-center border-l border-[#EDE4D4]">
                          {p.category.name}
                        </td>
                      ))}
                    </tr>
                    <tr>
                      <td className="p-3 font-semibold bg-[#F5EFE4]/50">Wax Type</td>
                      {compareList.map((p) => (
                        <td key={p.id} className="p-3 text-center border-l border-[#EDE4D4] font-medium text-[#A87B32]">
                          {p.waxType || "Natural Soy Wax"}
                        </td>
                      ))}
                    </tr>
                    <tr>
                      <td className="p-3 font-semibold bg-[#F5EFE4]/50">Burn Time</td>
                      {compareList.map((p) => (
                        <td key={p.id} className="p-3 text-center border-l border-[#EDE4D4] font-bold text-[#1A1208]">
                          {p.burnTime || "45-50 hours"}
                        </td>
                      ))}
                    </tr>
                    <tr>
                      <td className="p-3 font-semibold bg-[#F5EFE4]/50">Fragrance / Notes</td>
                      {compareList.map((p) => (
                        <td key={p.id} className="p-3 text-center border-l border-[#EDE4D4] text-[11px] text-[#8B7355]">
                          {p.fragrance || "Signature Blend"}
                        </td>
                      ))}
                    </tr>
                    <tr>
                      <td className="p-3 font-semibold bg-[#F5EFE4]/50">Rating</td>
                      {compareList.map((p) => (
                        <td key={p.id} className="p-3 text-center border-l border-[#EDE4D4]">
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-[#388E3C] text-white text-[10px] font-bold">
                            {p.rating} ★
                          </span>
                        </td>
                      ))}
                    </tr>
                    <tr>
                      <td className="p-3 font-semibold bg-[#F5EFE4]/50">Stock</td>
                      {compareList.map((p) => (
                        <td key={p.id} className="p-3 text-center border-l border-[#EDE4D4]">
                          {p.stock > 0 ? (
                            <span className="text-green-700 font-semibold">In Stock ({p.stock})</span>
                          ) : (
                            <span className="text-red-600 font-semibold">Sold Out</span>
                          )}
                        </td>
                      ))}
                    </tr>
                    <tr>
                      <td className="p-3 font-semibold bg-[#F5EFE4]/50">Action</td>
                      {compareList.map((p) => (
                        <td key={p.id} className="p-3 text-center border-l border-[#EDE4D4]">
                          <button
                            onClick={() => {
                              addItem(p);
                              toast.success(`Added ${p.name} to cart!`);
                            }}
                            disabled={p.stock === 0}
                            className="px-3 py-1.5 rounded-xl font-bold text-[11px] uppercase tracking-wider transition-all flex items-center justify-center gap-1 mx-auto disabled:opacity-40"
                            style={{ background: "#1A1208", color: "#FDFAF5" }}
                          >
                            <ShoppingBag className="w-3 h-3 text-[#C4964A]" /> Add to Bag
                          </button>
                        </td>
                      ))}
                    </tr>
                  </tbody>
                </table>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
