"use client";

import { useState } from "react";
import { Bell, AlertTriangle, Info, CheckCircle2, ShieldAlert } from "lucide-react";
import toast from "react-hot-toast";

const MOCK_ALERTS = [
  { id: "a1", type: "warning", title: "Low Stock Warning", message: "Rose & Oud Signature Candle stock dropped to 15 units.", time: "15 mins ago", read: false },
  { id: "a2", type: "info", title: "High Order Volume", message: "Received 14 orders in the last hour. Surge detected.", time: "1 hour ago", read: false },
  { id: "a3", type: "success", title: "Monthly Target Hit", message: "February sales crossed ₹2,40,000 threshold!", time: "1 day ago", read: true },
];

export default function AdminAlertsPage() {
  const [alerts, setAlerts] = useState(MOCK_ALERTS);

  const markAllRead = () => {
    setAlerts(alerts.map((a) => ({ ...a, read: true })));
    toast.success("All alerts marked as read");
  };

  return (
    <div className="space-y-6 max-w-3xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-medium text-[#F5EFE4]" style={{ fontFamily: "Cormorant Garamond, Georgia, serif" }}>
            System Alerts & Operational Warnings
          </h1>
          <p className="text-xs text-[#8B7355] mt-1">Real-time alerts for stock levels, payment failures, and high sales volume events.</p>
        </div>
        <button onClick={markAllRead} className="btn btn-outline btn-sm">Mark All Read</button>
      </div>

      <div className="space-y-3">
        {alerts.map((alert) => (
          <div key={alert.id} className="p-4 rounded-2xl border flex items-start gap-4"
            style={{
              background: "#140D07",
              borderColor: alert.read ? "#2A1D13" : "#C4964A",
            }}>
            <div className="p-2 rounded-xl bg-[#1F140B] border border-[#3A281A]">
              {alert.type === "warning" ? <AlertTriangle size={18} className="text-[#FBBF24]" /> : alert.type === "info" ? <Info size={18} className="text-[#60A5FA]" /> : <CheckCircle2 size={18} className="text-[#4ADE80]" />}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <p className="font-semibold text-sm text-[#F5EFE4]">{alert.title}</p>
                <span className="text-[10px] text-[#8B7355]">{alert.time}</span>
              </div>
              <p className="text-xs text-[#A08060] mt-1">{alert.message}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
