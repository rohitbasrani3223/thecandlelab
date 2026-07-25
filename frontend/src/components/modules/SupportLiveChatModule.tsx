"use client";

import React, { useState } from "react";
import { useStore } from "@/context/StoreContext";
import {
  MessageSquare,
  Ticket,
  HelpCircle,
  Bot,
  Send,
  CheckCircle2,
  Clock,
  User,
  Sparkles,
  PhoneCall
} from "lucide-react";

export const SupportLiveChatModule: React.FC = () => {
  const { supportTickets, showToast } = useStore();
  const [activeTab, setActiveTab] = useState<"tickets" | "livechat" | "bot" | "faqs">("tickets");
  const [chatInput, setChatInput] = useState("");
  const [liveChatMessages, setLiveChatMessages] = useState([
    { sender: "customer", text: "Hi, I ordered Order #ORD-94821. Can I add custom gift ribbon?", time: "14:12" },
    { sender: "agent", text: "Hello Aarav! Yes, we have attached gold velvet gift ribbon to your order.", time: "14:14" }
  ]);

  const handleSendChatMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;
    setLiveChatMessages((prev) => [...prev, { sender: "agent", text: chatInput, time: "14:20" }]);
    setChatInput("");
    showToast("Reply sent to customer live chat 💬");
  };

  return (
    <div className="space-y-6">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Customer Support & Live Agent Helpdesk</h2>
          <p className="text-xs text-slate-500 mt-0.5">Manage support tickets, live chat customer inquiries, AI concierge overrides & FAQ repository.</p>
        </div>

        <div className="flex items-center gap-2">
          <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5">
            <Bot className="w-4 h-4 text-emerald-600" /> AI Support Bot: ACTIVE
          </span>
        </div>
      </div>

      {/* Sub-Navigation Tabs */}
      <div className="flex overflow-x-auto gap-2 bg-white p-2 rounded-2xl border border-slate-200 shadow-sm text-xs font-semibold">
        {[
          { id: "tickets", label: "Support Tickets", icon: Ticket },
          { id: "livechat", label: "Live Customer Chat", icon: MessageSquare },
          { id: "bot", label: "AI Concierge Bot", icon: Bot },
          { id: "faqs", label: "FAQs Database", icon: HelpCircle }
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

      {/* Tickets Tab */}
      {activeTab === "tickets" && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase tracking-wider font-semibold text-[11px]">
                  <th className="p-4">Ticket ID</th>
                  <th className="p-4">Subject</th>
                  <th className="p-4">Priority</th>
                  <th className="p-4">Status</th>
                  <th className="p-4">Date</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {supportTickets.map((t) => (
                  <tr key={t.id} className="hover:bg-slate-50 transition-colors">
                    <td className="p-4 font-mono font-bold text-indigo-600">{t.id}</td>
                    <td className="p-4 font-bold text-slate-900">{t.subject}</td>
                    <td className="p-4">
                      <span className="bg-rose-50 text-rose-700 border border-rose-200 px-2 py-0.5 rounded text-[10px] font-bold">
                        {t.priority || "High"}
                      </span>
                    </td>
                    <td className="p-4">
                      <span className="bg-amber-50 text-amber-700 border border-amber-200 px-2 py-0.5 rounded text-[10px] font-bold">
                        {t.status}
                      </span>
                    </td>
                    <td className="p-4 text-slate-500">{t.date}</td>
                    <td className="p-4 text-right">
                      <button
                        onClick={() => showToast(`Opening Ticket ${t.id} details... 💬`)}
                        className="bg-slate-100 hover:bg-slate-200 text-slate-900 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors"
                      >
                        Respond
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Live Chat Tab */}
      {activeTab === "livechat" && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4 max-w-2xl">
          <div className="flex justify-between items-center border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
              <h3 className="text-base font-bold text-slate-900">Active Chat with Aarav Sharma</h3>
            </div>
            <span className="text-xs font-mono text-slate-400">Order #ORD-94821</span>
          </div>

          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 h-64 overflow-y-auto space-y-3 text-xs">
            {liveChatMessages.map((msg, idx) => (
              <div key={idx} className={`flex ${msg.sender === "agent" ? "justify-end" : "justify-start"}`}>
                <div className={`p-3 rounded-2xl max-w-xs ${msg.sender === "agent" ? "bg-slate-900 text-white" : "bg-white text-slate-900 border border-slate-200 shadow-xs"}`}>
                  <p>{msg.text}</p>
                  <span className="text-[9px] opacity-70 block text-right mt-1 font-mono">{msg.time}</span>
                </div>
              </div>
            ))}
          </div>

          <form onSubmit={handleSendChatMessage} className="flex gap-2">
            <input
              type="text"
              placeholder="Type customer reply..."
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-900 focus:outline-none"
            />
            <button type="submit" className="bg-indigo-600 text-white px-4 py-2.5 rounded-xl text-xs font-bold shadow hover:bg-indigo-700 transition-colors">
              Send Reply
            </button>
          </form>
        </div>
      )}

      {["bot", "faqs"].includes(activeTab) && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4 max-w-xl">
          <h3 className="text-base font-bold text-slate-900 capitalize border-b border-slate-100 pb-3">
            {activeTab} Management
          </h3>
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs space-y-2">
            <span className="font-bold text-emerald-700 block">AI Concierge Model: GPT-4o / Claude 3.5 Sonnet</span>
            <p className="text-slate-600">Bot automatically resolves product recommendations, burn time advice & shipping inquiries.</p>
          </div>
        </div>
      )}
    </div>
  );
};
