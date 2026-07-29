"use client";

import { useState } from "react";
import { MessageSquare, Send, Mail, Phone } from "lucide-react";
import toast from "react-hot-toast";

export default function AdminNotificationsPage() {
  const [channel, setChannel] = useState("email");
  const [targetAudience, setTargetAudience] = useState("all");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    await new Promise((r) => setTimeout(r, 1200));
    setSending(false);
    toast.success(`Broadcast notification queued via ${channel.toUpperCase()}!`);
    setSubject("");
    setMessage("");
  };

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="text-3xl font-medium text-[#F5EFE4]" style={{ fontFamily: "Cormorant Garamond, Georgia, serif" }}>
          Broadcast Notifications
        </h1>
        <p className="text-xs text-[#8B7355] mt-1">Send marketing announcements, drop alerts, and order updates via Email, SMS, or WhatsApp.</p>
      </div>

      <form onSubmit={handleSend} className="p-6 rounded-2xl border border-[#2A1D13] space-y-5" style={{ background: "#140D07" }}>
        <div className="grid grid-cols-3 gap-3">
          {[
            { id: "email", label: "Email Campaign", icon: <Mail size={16} /> },
            { id: "sms", label: "SMS Alert", icon: <Phone size={16} /> },
            { id: "whatsapp", label: "WhatsApp Drop", icon: <MessageSquare size={16} /> },
          ].map((ch) => (
            <button
              key={ch.id}
              type="button"
              onClick={() => setChannel(ch.id)}
              className="flex flex-col items-center justify-center p-3 rounded-xl border text-xs font-semibold gap-1.5 transition-all"
              style={{
                borderColor: channel === ch.id ? "#C4964A" : "#2A1D13",
                background: channel === ch.id ? "rgba(196,150,74,0.15)" : "#1F140B",
                color: channel === ch.id ? "#C4964A" : "#8B7355",
              }}
            >
              {ch.icon}
              {ch.label}
            </button>
          ))}
        </div>

        <div>
          <label className="block text-xs font-semibold text-[#A08060] mb-1">Target Audience</label>
          <select value={targetAudience} onChange={(e) => setTargetAudience(e.target.value)} className="w-full px-3 py-2 rounded-xl text-xs bg-[#1F140B] border border-[#3A281A] text-[#F5EFE4]">
            <option value="all">All Registered Customers (389)</option>
            <option value="repeat">Repeat Candle Buyers (84)</option>
            <option value="gold">Gold & Platinum VIP Members (42)</option>
          </select>
        </div>

        {channel === "email" && (
          <div>
            <label className="block text-xs font-semibold text-[#A08060] mb-1">Email Subject</label>
            <input type="text" value={subject} onChange={(e) => setSubject(e.target.value)} placeholder="✨ New Seasonal Scent Drop: Amber & Cashmere..." className="w-full px-3 py-2 rounded-xl text-xs bg-[#1F140B] border border-[#3A281A] text-[#F5EFE4]" />
          </div>
        )}

        <div>
          <label className="block text-xs font-semibold text-[#A08060] mb-1">Message Content</label>
          <textarea rows={4} value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Write your broadcast announcement..." className="w-full px-3 py-2 rounded-xl text-xs bg-[#1F140B] border border-[#3A281A] text-[#F5EFE4]" />
        </div>

        <button type="submit" disabled={sending} className="btn btn-gold gap-2 disabled:opacity-70">
          <Send size={16} />
          {sending ? "Sending Broadcast..." : "Send Broadcast Now"}
        </button>
      </form>
    </div>
  );
}
