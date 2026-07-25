"use client";

import React, { useState } from "react";
import { useStore } from "@/context/StoreContext";
import { Plug, X, Check, Download, Sparkles, ShieldCheck } from "lucide-react";

interface PluginStoreModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PluginStoreModal: React.FC<PluginStoreModalProps> = ({ isOpen, onClose }) => {
  const { showToast } = useStore();
  const [plugins, setPlugins] = useState([
    { id: "p-1", name: "WhatsApp Business Concierge", category: "Marketing", desc: "Automated WhatsApp order confirmation & cart recovery messages.", icon: "💬", isInstalled: true },
    { id: "p-2", name: "Shiprocket Auto-Sync Logistics", category: "Logistics", desc: "Auto-generate waybills and tracking links upon checkout.", icon: "🚚", isInstalled: true },
    { id: "p-3", name: "Instagram Shoppable Feed Widget", category: "Social", desc: "Embed luxury Instagram UGC feed on homepage.", icon: "📸", isInstalled: false },
    { id: "p-4", name: "GA4 & Meta Pixel Advanced Tracking", category: "Analytics", desc: "Server-side Conversion API events & Hotjar heatmaps.", icon: "📈", isInstalled: false }
  ]);

  if (!isOpen) return null;

  const toggleInstall = (id: string) => {
    setPlugins((prev) =>
      prev.map((p) => {
        if (p.id === id) {
          const nextState = !p.isInstalled;
          showToast(nextState ? `Installed "${p.name}" extension! 🔌` : `Uninstalled "${p.name}" extension.`);
          return { ...p, isInstalled: nextState };
        }
        return p;
      })
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/65 backdrop-blur-md">
      <div className="relative w-full max-w-3xl bg-brand-surface rounded-2xl border-2 border-brand-gold shadow-2xl p-6 md:p-8 max-h-[90vh] overflow-y-auto">
        
        <button onClick={onClose} className="absolute top-4 right-4 p-2 text-brand-charcoal hover:bg-brand-beige rounded-full">
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 border-b border-brand-beige pb-4 mb-6">
          <div className="w-10 h-10 rounded-full bg-brand-charcoal flex items-center justify-center text-brand-gold">
            <Plug className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-brand-gold uppercase tracking-widest">ECOSYSTEM APP MARKETPLACE</span>
            <h3 className="font-serif text-2xl font-bold text-brand-charcoal">PLUGIN EXTENSION STORE</h3>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {plugins.map((p) => (
            <div key={p.id} className="bg-white p-4 rounded-xl border border-brand-beige flex flex-col justify-between space-y-3 shadow-sm">
              <div className="flex items-start gap-3">
                <span className="text-3xl">{p.icon}</span>
                <div>
                  <h4 className="font-serif text-xs font-bold text-brand-charcoal">{p.name}</h4>
                  <span className="text-[9px] bg-brand-beige px-1.5 py-0.2 rounded font-mono text-brand-earth">{p.category}</span>
                  <p className="text-[11px] text-brand-earth mt-1 line-clamp-2">{p.desc}</p>
                </div>
              </div>

              <button
                onClick={() => toggleInstall(p.id)}
                className={`w-full py-2 rounded-lg font-bold text-xs transition-colors flex items-center justify-center gap-1 ${
                  p.isInstalled ? "bg-green-100 text-green-800" : "bg-brand-charcoal text-brand-gold hover:bg-brand-gold hover:text-brand-charcoal"
                }`}
              >
                {p.isInstalled ? <Check className="w-3.5 h-3.5" /> : <Download className="w-3.5 h-3.5" />}
                {p.isInstalled ? "Extension Active" : "Install App"}
              </button>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
};
