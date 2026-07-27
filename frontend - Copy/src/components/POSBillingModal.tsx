"use client";

import React, { useState } from "react";
import { useStore, CandleProduct } from "@/context/StoreContext";
import { Store, Barcode, Printer, QrCode, X, Plus, Minus, Trash2, CheckCircle2, ShieldCheck, Sparkles } from "lucide-react";

interface POSBillingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const POSBillingModal: React.FC<POSBillingModalProps> = ({ isOpen, onClose }) => {
  const { products, currency, showToast } = useStore();
  const [posCart, setPosCart] = useState<{ product: CandleProduct; quantity: number }[]>([
    { product: products[0], quantity: 1 }
  ]);
  const [customerPhone, setCustomerPhone] = useState("+91 98765 43210");
  const [paymentMode, setPaymentMode] = useState<"qr" | "cash" | "card">("qr");
  const [isReceiptGenerated, setIsReceiptGenerated] = useState(false);

  if (!isOpen) return null;

  const totalAmount = posCart.reduce((sum, i) => sum + i.product.price * i.quantity, 0);

  const handlePrintReceipt = () => {
    setIsReceiptGenerated(true);
    showToast("Thermal POS Receipt Sent to Printer 🖨️!");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md">
      <div className="relative w-full max-w-4xl bg-brand-surface rounded-2xl border-2 border-brand-gold shadow-2xl p-6 max-h-[90vh] overflow-y-auto">
        
        <button onClick={onClose} className="absolute top-4 right-4 p-2 text-brand-charcoal hover:bg-brand-beige rounded-full">
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 border-b border-brand-beige pb-4 mb-6">
          <div className="w-10 h-10 rounded-full bg-brand-charcoal flex items-center justify-center text-brand-gold">
            <Store className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-brand-gold uppercase tracking-widest">STORE POS TERMINAL</span>
            <h3 className="font-serif text-2xl font-bold text-brand-charcoal">ATELIER BOUTIQUE BILLING</h3>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          
          {/* Left: Product Selector */}
          <div className="md:col-span-7 space-y-4">
            <div className="flex gap-2">
              <div className="relative flex-1">
                <input
                  type="text"
                  placeholder="Scan Barcode or Search Candle..."
                  className="w-full text-xs pl-8 pr-3 py-2 rounded-xl border border-brand-beige bg-white"
                />
                <Barcode className="w-4 h-4 text-brand-earth absolute left-2.5 top-2.5" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 max-h-72 overflow-y-auto">
              {products.map((p) => (
                <div
                  key={p.id}
                  onClick={() => {
                    setPosCart((prev) => {
                      const existing = prev.find((i) => i.product.id === p.id);
                      if (existing) {
                        return prev.map((i) => (i.product.id === p.id ? { ...i, quantity: i.quantity + 1 } : i));
                      }
                      return [...prev, { product: p, quantity: 1 }];
                    });
                  }}
                  className="bg-white p-2.5 rounded-xl border border-brand-beige cursor-pointer hover:border-brand-gold flex items-center gap-2"
                >
                  <img src={p.images[0]} alt="" className="w-10 h-10 object-cover rounded-lg" />
                  <div className="flex-1">
                    <h5 className="font-serif text-xs font-bold line-clamp-1">{p.name}</h5>
                    <span className="text-xs font-bold text-brand-gold">{currency}{p.price}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Bill Summary & QR Payment */}
          <div className="md:col-span-5 bg-white p-4 rounded-2xl border border-brand-beige flex flex-col justify-between space-y-4">
            <div>
              <h4 className="font-serif text-xs font-bold uppercase tracking-wider text-brand-charcoal mb-2">
                Cart Items ({posCart.length})
              </h4>

              <div className="space-y-2 max-h-40 overflow-y-auto pr-1">
                {posCart.map((i) => (
                  <div key={i.product.id} className="flex items-center justify-between text-xs border-b border-brand-beige pb-2">
                    <span className="font-bold text-brand-charcoal line-clamp-1">{i.product.name}</span>
                    <span className="font-bold text-brand-gold">{currency}{i.product.price * i.quantity}</span>
                  </div>
                ))}
              </div>

              <div className="pt-3 border-t border-brand-beige space-y-2 text-xs">
                <div className="flex justify-between text-brand-earth">
                  <span>Customer Phone:</span>
                  <span className="font-bold text-brand-charcoal">{customerPhone}</span>
                </div>
                <div className="flex justify-between font-serif text-lg font-bold text-brand-charcoal">
                  <span>Total Bill:</span>
                  <span className="text-brand-gold">{currency}{totalAmount}</span>
                </div>
              </div>
            </div>

            {/* Payment Mode */}
            <div className="space-y-2">
              <span className="text-[10px] font-bold text-brand-earth uppercase block">Payment Method</span>
              <div className="grid grid-cols-3 gap-2">
                <button
                  onClick={() => setPaymentMode("qr")}
                  className={`p-2 rounded-lg text-xs font-bold ${paymentMode === "qr" ? "bg-brand-charcoal text-brand-gold" : "bg-brand-beige text-brand-charcoal"}`}
                >
                  UPI QR ⚡
                </button>
                <button
                  onClick={() => setPaymentMode("cash")}
                  className={`p-2 rounded-lg text-xs font-bold ${paymentMode === "cash" ? "bg-brand-charcoal text-brand-gold" : "bg-brand-beige text-brand-charcoal"}`}
                >
                  Cash 💵
                </button>
                <button
                  onClick={() => setPaymentMode("card")}
                  className={`p-2 rounded-lg text-xs font-bold ${paymentMode === "card" ? "bg-brand-charcoal text-brand-gold" : "bg-brand-beige text-brand-charcoal"}`}
                >
                  Card 💳
                </button>
              </div>

              {paymentMode === "qr" && (
                <div className="bg-brand-surface p-3 rounded-xl border border-brand-gold/40 text-center space-y-1">
                  <QrCode className="w-16 h-16 text-brand-charcoal mx-auto" />
                  <p className="text-[10px] text-brand-earth font-bold">Scan with GPay / PhonePe to Pay {currency}{totalAmount}</p>
                </div>
              )}

              <button
                onClick={handlePrintReceipt}
                className="w-full bg-brand-gold text-brand-charcoal py-3 rounded-xl font-bold text-xs hover:bg-brand-goldLight transition-colors flex items-center justify-center gap-2 shadow"
              >
                <Printer className="w-4 h-4" /> Print Thermal POS Receipt
              </button>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};
