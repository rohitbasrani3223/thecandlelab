"use client";

import React, { useState } from "react";
import { useStore, SupportTicket } from "@/context/StoreContext";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import {
  MessageSquare, Search, CheckCircle2,
  Phone, Mail, RefreshCw, Send
} from "lucide-react";

const FONT = { fontFamily: "Inter, system-ui, sans-serif" };

export const SupportLiveChatModule: React.FC = () => {
  const { supportTickets, showToast } = useStore();
  const [filter, setFilter] = useState<string>("all");
  const [search, setSearch] = useState("");
  const [activeTicket, setActiveTicket] = useState<SupportTicket | null>(null);
  const [replyText, setReplyText] = useState("");

  const filtered = supportTickets.filter((t) => {
    const matchFilter = filter === "all" || t.status.toLowerCase() === filter.toLowerCase();
    const custName = t.customerName || "";
    const matchSearch = !search.trim() || custName.toLowerCase().includes(search.toLowerCase()) || t.subject.toLowerCase().includes(search.toLowerCase());
    return matchFilter && matchSearch;
  });

  const counts = {
    all: supportTickets.length,
    open: supportTickets.filter(t => t.status === "OPEN").length,
    in_progress: supportTickets.filter(t => t.status === "IN_PROGRESS").length,
    resolved: supportTickets.filter(t => t.status === "RESOLVED").length,
  };

  const tabs = [
    { key: "all", label: "All", count: counts.all },
    { key: "OPEN", label: "Open", count: counts.open },
    { key: "IN_PROGRESS", label: "In Progress", count: counts.in_progress },
    { key: "RESOLVED", label: "Resolved", count: counts.resolved },
  ];

  const handleReply = () => {
    if (!replyText.trim() || !activeTicket) return;
    showToast(`Reply sent to ${activeTicket.customerName || "Customer"}`);
    setReplyText("");
  };

  const getStatusBadge = (status: SupportTicket["status"]) => {
    if (status === "OPEN") return <Badge variant="danger" dot>Open</Badge>;
    if (status === "IN_PROGRESS") return <Badge variant="warning" dot>In Progress</Badge>;
    return <Badge variant="success" dot>Resolved</Badge>;
  };

  return (
    <div style={FONT} className="space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-[#0F172A]">Support & Helpdesk</h1>
          <p className="text-sm text-[#64748B] mt-0.5">{counts.open} open tickets · {counts.in_progress} in progress</p>
        </div>
        <Button variant="secondary" size="sm" leftIcon={<RefreshCw className="w-3.5 h-3.5" />}>Refresh</Button>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 border-b border-[#E2E8F0]">
        {tabs.map((tab) => (
          <button key={tab.key} onClick={() => setFilter(tab.key)}
            className={`flex items-center gap-1.5 px-3 py-2 text-[12px] font-semibold rounded-t-lg transition-all ${filter === tab.key ? "bg-[#EEF2FF] text-[#4338CA]" : "text-[#64748B] hover:text-[#0F172A]"}`}>
            {tab.label}
            <span className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold ${filter === tab.key ? "bg-[#6366F1] text-white" : "bg-[#F1F5F9] text-[#64748B]"}`}>{tab.count}</span>
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
        {/* Ticket List — 2 cols */}
        <div className="lg:col-span-2 space-y-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#94A3B8]" />
            <input type="text" placeholder="Search tickets..." value={search} onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-white border border-[#E2E8F0] rounded-xl text-[13px] placeholder-[#94A3B8] focus:outline-none focus:border-[#6366F1] focus:ring-2 focus:ring-[#EEF2FF] transition-all" />
          </div>

          <div className="space-y-2">
            {filtered.length === 0 ? (
              <Card padding="md" className="text-center text-[13px] text-[#94A3B8]">No tickets found</Card>
            ) : filtered.map((ticket) => (
              <Card
                key={ticket.id}
                padding="md"
                hover
                className={`cursor-pointer transition-all ${activeTicket?.id === ticket.id ? "border-[#6366F1] ring-2 ring-[#EEF2FF]" : ""}`}
                onClick={() => setActiveTicket(ticket)}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      {getStatusBadge(ticket.status)}
                      {ticket.priority && <Badge variant="neutral" className="text-[9px]">{ticket.priority}</Badge>}
                    </div>
                    <p className="text-[13px] font-semibold text-[#0F172A] truncate">{ticket.subject}</p>
                    <p className="text-[11px] text-[#94A3B8] mt-0.5">{ticket.customerName || "Customer"} · {ticket.date}</p>
                  </div>
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 text-white flex items-center justify-center text-[11px] font-bold shrink-0">
                    {(ticket.customerName || "C").slice(0, 2).toUpperCase()}
                  </div>
                </div>
                {ticket.messages && ticket.messages.length > 0 && (
                  <p className="text-[12px] text-[#64748B] mt-2 truncate">{ticket.messages[ticket.messages.length - 1]}</p>
                )}
              </Card>
            ))}
          </div>
        </div>

        {/* Ticket Detail — 3 cols */}
        <div className="lg:col-span-3">
          {activeTicket ? (
            <Card padding="none" className="h-full overflow-hidden flex flex-col">
              {/* Ticket Header */}
              <div className="flex items-start justify-between px-5 py-4 border-b border-[#E2E8F0]">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    {getStatusBadge(activeTicket.status)}
                    <span className="text-[11px] font-mono text-[#94A3B8]">#{activeTicket.id}</span>
                  </div>
                  <h2 className="text-[14px] font-bold text-[#0F172A]">{activeTicket.subject}</h2>
                </div>
                {activeTicket.status !== "RESOLVED" && (
                  <Button variant="success" size="xs"
                    onClick={() => { showToast("Ticket marked as resolved!"); setActiveTicket({ ...activeTicket, status: "RESOLVED" }); }}>
                    <CheckCircle2 className="w-3.5 h-3.5 mr-1" />Resolve
                  </Button>
                )}
              </div>

              {/* Customer Info */}
              <div className="flex items-center gap-3 px-5 py-3.5 bg-[#F8FAFC] border-b border-[#E2E8F0]">
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 text-white flex items-center justify-center text-[12px] font-bold shrink-0">
                  {(activeTicket.customerName || "C").slice(0, 2).toUpperCase()}
                </div>
                <div>
                  <p className="text-[13px] font-semibold text-[#0F172A]">{activeTicket.customerName || "Customer"}</p>
                  <p className="text-[11px] text-[#94A3B8]">{activeTicket.customerEmail || "customer@example.com"}</p>
                </div>
                <div className="ml-auto flex gap-1">
                  <button className="p-1.5 rounded-lg hover:bg-[#EEF2FF] text-[#94A3B8] hover:text-[#6366F1] transition-colors"><Phone className="w-4 h-4" /></button>
                  <button className="p-1.5 rounded-lg hover:bg-[#EEF2FF] text-[#94A3B8] hover:text-[#6366F1] transition-colors"><Mail className="w-4 h-4" /></button>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-5 space-y-4 min-h-[200px]">
                {activeTicket.messages && activeTicket.messages.map((msg, i) => (
                  <div key={i} className="flex gap-2">
                    <div className="w-7 h-7 rounded-full bg-[#F1F5F9] border border-[#E2E8F0] flex items-center justify-center shrink-0 text-[10px] font-bold text-[#64748B]">
                      {(activeTicket.customerName || "C").slice(0, 1)}
                    </div>
                    <div className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl rounded-tl-sm p-3 max-w-[85%]">
                      <p className="text-[13px] text-[#0F172A] leading-snug">{msg}</p>
                      <p className="text-[10px] text-[#94A3B8] mt-1.5">{activeTicket.date}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Reply Box */}
              <div className="border-t border-[#E2E8F0] p-4">
                <div className="flex gap-2">
                  <textarea
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    placeholder="Write your reply..."
                    rows={2}
                    className="flex-1 px-3 py-2.5 border border-[#E2E8F0] rounded-xl text-[13px] text-[#0F172A] placeholder-[#94A3B8] focus:outline-none focus:border-[#6366F1] focus:ring-2 focus:ring-[#EEF2FF] resize-none transition-all"
                  />
                  <Button variant="primary" size="sm" className="self-end" leftIcon={<Send className="w-3.5 h-3.5" />} onClick={handleReply}>
                    Send
                  </Button>
                </div>
              </div>
            </Card>
          ) : (
            <Card padding="lg" className="h-full flex flex-col items-center justify-center text-center min-h-[300px]">
              <MessageSquare className="w-10 h-10 text-[#CBD5E1] mx-auto mb-3" />
              <p className="text-[14px] font-semibold text-[#475569]">Select a ticket</p>
              <p className="text-[12px] text-[#94A3B8] mt-1">Click any ticket from the list to view details and reply</p>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};
