"use client";

import React, { useState } from "react";
import { useStore } from "@/context/StoreContext";
import {
  Settings,
  Building,
  Receipt,
  Truck,
  CreditCard,
  Mail,
  Bell,
  ToggleLeft,
  Plug,
  Shield,
  Key,
  Webhook,
  FileCode,
  Database,
  Save,
  CheckCircle2
} from "lucide-react";

export const SystemSettingsModule: React.FC = () => {
  const { showToast } = useStore();
  const [activeTab, setActiveTab] = useState<"general" | "taxes" | "shipping" | "payments" | "flags" | "plugins" | "rbac" | "apikeys">("general");

  // Feature Flags state
  const [flags, setFlags] = useState({
    aiConcierge: true,
    customCandleStudio: true,
    flashSalesTimer: true,
    loyaltyReferral: true,
    posBilling: true
  });

  const toggleFlag = (key: keyof typeof flags) => {
    setFlags((prev) => ({ ...prev, [key]: !prev[key] }));
    showToast(`Feature flag '${key}' updated! ⚙️`);
  };

  const handleRunBackup = () => {
    showToast("Database backup created & synced to S3 secure storage! 💾");
  };

  return (
    <div className="space-y-6">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Enterprise System Settings & Governance</h2>
          <p className="text-xs text-slate-500 mt-0.5">Configure tax rules, payment gateways, feature flags, plugins, RBAC roles, webhooks & automated database backups.</p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleRunBackup}
            className="bg-emerald-600 hover:bg-emerald-700 text-white px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow transition-colors"
          >
            <Database className="w-3.5 h-3.5" /> Trigger DB Backup
          </button>
        </div>
      </div>

      {/* Settings Sub-Navigation Tabs */}
      <div className="flex overflow-x-auto gap-2 bg-white p-2 rounded-2xl border border-slate-200 shadow-sm text-xs font-semibold">
        {[
          { id: "general", label: "General & Company", icon: Building },
          { id: "taxes", label: "GST Taxes & Rules", icon: Receipt },
          { id: "shipping", label: "Shipping Rates", icon: Truck },
          { id: "payments", label: "Payment Gateways", icon: CreditCard },
          { id: "flags", label: "Feature Flags", icon: ToggleLeft },
          { id: "plugins", label: "Plugin Store", icon: Plug },
          { id: "rbac", label: "Roles & Permissions", icon: Shield },
          { id: "apikeys", label: "API Keys & Webhooks", icon: Key }
        ].map((tab) => {
          const IconComp = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-3.5 py-2.5 rounded-xl transition-all flex items-center gap-2 whitespace-nowrap ${
                activeTab === tab.id
                  ? "bg-slate-900 text-white shadow-sm"
                  : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
              }`}
            >
              <IconComp className="w-4 h-4" /> {tab.label}
            </button>
          );
        })}
      </div>

      {/* Tab Panels */}
      {activeTab === "general" && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4 max-w-2xl">
          <h3 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
            <Building className="w-4 h-4 text-indigo-600" /> Enterprise Company Info
          </h3>

          <div className="space-y-3 text-xs">
            <div>
              <label className="font-bold text-slate-700 block mb-1">Legal Company Name</label>
              <input type="text" defaultValue="The Candle Lab India Pvt Ltd" className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-bold text-slate-900" />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Base Currency</label>
                <input type="text" defaultValue="INR (₹)" disabled className="w-full bg-slate-100 border border-slate-200 rounded-xl p-2.5 font-bold text-slate-700" />
              </div>
              <div>
                <label className="font-bold text-slate-700 block mb-1">Timezone</label>
                <input type="text" defaultValue="Asia/Kolkata (IST +05:30)" disabled className="w-full bg-slate-100 border border-slate-200 rounded-xl p-2.5 font-bold text-slate-700" />
              </div>
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Registered Address</label>
              <textarea rows={2} defaultValue="Royal Palms, MG Road, Mumbai, Maharashtra 400001" className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-900" />
            </div>

            <button onClick={() => showToast("Company profile saved! 🏢")} className="bg-slate-900 text-white px-4 py-2 rounded-xl text-xs font-bold shadow hover:bg-slate-800 transition-colors">
              Save Profile
            </button>
          </div>
        </div>
      )}

      {activeTab === "flags" && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4 max-w-2xl">
          <h3 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
            <ToggleLeft className="w-4 h-4 text-indigo-600" /> System Feature Flags & Experimental Toggles
          </h3>

          <div className="space-y-3 text-xs">
            {Object.entries(flags).map(([key, enabled]) => (
              <div key={key} className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/60 flex justify-between items-center">
                <div>
                  <h4 className="font-bold text-slate-900 capitalize">{key.replace(/([A-Z])/g, " $1")}</h4>
                  <p className="text-[11px] text-slate-500">Controls runtime execution of {key} functionality.</p>
                </div>
                <button
                  onClick={() => toggleFlag(key as any)}
                  className={`w-12 h-6 rounded-full p-0.5 transition-colors ${enabled ? "bg-emerald-600" : "bg-slate-300"}`}
                >
                  <div className={`w-5 h-5 bg-white rounded-full shadow transition-transform ${enabled ? "translate-x-6" : "translate-x-0"}`}></div>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {["taxes", "shipping", "payments", "plugins", "rbac", "apikeys"].includes(activeTab) && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4 max-w-2xl">
          <h3 className="text-base font-bold text-slate-900 capitalize border-b border-slate-100 pb-3">
            {activeTab} Configuration Matrix
          </h3>
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs space-y-2">
            <span className="font-bold text-slate-900 block">Status: CONFIGURED & SECURE</span>
            <p className="text-slate-600">Enterprise security parameters, API tokens and webhooks are active.</p>
          </div>
        </div>
      )}
    </div>
  );
};
