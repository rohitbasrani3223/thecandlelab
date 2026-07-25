"use client";

import React, { useState } from "react";
import { useStore, CandleProduct } from "@/context/StoreContext";
import { Sparkles, MessageSquare, X, Send, Bot, ShoppingBag, Flame } from "lucide-react";

interface Message {
  sender: "bot" | "user";
  text: string;
  recommendedProducts?: CandleProduct[];
}

export const AIChatConcierge: React.FC = () => {
  const { products, addToCart, currency } = useStore();
  const [isOpen, setIsOpen] = useState(false);
  const [inputText, setInputText] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    {
      sender: "bot",
      text: "Greetings! I am your AI Scent Concierge. Tell me what mood, room, or fragrance notes you are seeking (e.g. 'I need a relaxing lavender candle for bedroom under ₹1000')."
    }
  ]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const userQuery = inputText;
    const userMsg: Message = { sender: "user", text: userQuery };
    setMessages((prev) => [...prev, userMsg]);
    setInputText("");

    // AI Natural Language Search Parser
    setTimeout(() => {
      const queryLower = userQuery.toLowerCase();

      let matched = products.filter((p) => {
        if (queryLower.includes("lavender") && (p.name.toLowerCase().includes("lavender") || p.fragranceNotes.top.some(n => n.toLowerCase().includes("lavender")))) return true;
        if (queryLower.includes("coffee") && p.category.toLowerCase().includes("gourmand")) return true;
        if (queryLower.includes("vanilla") && p.category.toLowerCase().includes("vanilla")) return true;
        if (queryLower.includes("oud") && p.name.toLowerCase().includes("oud")) return true;
        if (queryLower.includes("bedroom") && p.roomSize.includes("Small")) return true;
        if (queryLower.includes("under") || queryLower.includes("1000") || queryLower.includes("700")) {
          return p.price <= 1000;
        }
        return false;
      });

      if (matched.length === 0) matched = products.slice(0, 2);

      const botMsg: Message = {
        sender: "bot",
        text: `I found ${matched.length} luxury candle match${matched.length > 1 ? "es" : ""} tailored to your request:`,
        recommendedProducts: matched.slice(0, 2)
      };

      setMessages((prev) => [...prev, botMsg]);
    }, 600);
  };

  return (
    <div className="fixed bottom-6 right-6 z-40">
      
      {/* Floating Toggle Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="bg-brand-charcoal text-brand-gold hover:bg-brand-gold hover:text-brand-charcoal border-2 border-brand-gold p-3.5 rounded-full shadow-2xl transition-all hover:scale-110 flex items-center gap-2 group"
          title="AI Scent Concierge"
        >
          <Bot className="w-6 h-6 animate-pulse" />
          <span className="text-xs font-serif font-bold uppercase tracking-wider hidden sm:inline">AI Concierge</span>
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className="w-80 sm:w-96 bg-brand-surface rounded-2xl border-2 border-brand-gold shadow-2xl overflow-hidden flex flex-col h-[480px]">
          
          {/* Header */}
          <div className="bg-brand-charcoal text-brand-beige p-3.5 border-b border-brand-gold/40 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Bot className="w-5 h-5 text-brand-gold" />
              <div>
                <h4 className="font-serif text-xs font-bold text-white">AI SCENT CONCIERGE</h4>
                <p className="text-[9px] text-brand-gold font-mono">ONLINE • LIVE RECOMMENDATIONS</p>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="text-gray-400 hover:text-white">
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Messages Feed */}
          <div className="flex-1 overflow-y-auto p-3 space-y-3">
            {messages.map((m, idx) => (
              <div
                key={idx}
                className={`flex flex-col ${m.sender === "user" ? "items-end" : "items-start"}`}
              >
                <div
                  className={`max-w-[85%] p-3 rounded-xl text-xs ${
                    m.sender === "user"
                      ? "bg-brand-charcoal text-brand-gold font-medium rounded-br-none"
                      : "bg-white border border-brand-beige text-brand-charcoal rounded-bl-none shadow-sm"
                  }`}
                >
                  <p>{m.text}</p>
                </div>

                {/* Product Recommendation Cards inside chat */}
                {m.recommendedProducts && (
                  <div className="mt-2 space-y-2 w-full">
                    {m.recommendedProducts.map((p) => (
                      <div key={p.id} className="bg-white p-2.5 rounded-xl border border-brand-gold/40 flex items-center gap-2.5 shadow-sm">
                        <img src={p.images[0]} alt="" className="w-12 h-12 object-cover rounded-lg" />
                        <div className="flex-1">
                          <h5 className="font-serif text-xs font-bold text-brand-charcoal line-clamp-1">{p.name}</h5>
                          <p className="text-[9px] text-brand-earth">{p.waxType} • {p.burnTimeHours}h Burn</p>
                          <span className="text-xs font-bold text-brand-charcoal">{currency}{p.price}</span>
                        </div>
                        <button
                          onClick={() => addToCart(p)}
                          className="bg-brand-charcoal text-brand-gold p-2 rounded-lg text-xs font-bold hover:bg-brand-gold hover:text-brand-charcoal"
                        >
                          <ShoppingBag className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Input Bar */}
          <form onSubmit={handleSend} className="p-2 bg-white border-t border-brand-beige flex gap-1.5">
            <input
              type="text"
              placeholder="Ask AI Concierge..."
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              className="flex-1 text-xs px-3 py-2 rounded-lg border border-brand-beige focus:outline-none focus:ring-1 focus:ring-brand-gold"
            />
            <button
              type="submit"
              className="bg-brand-charcoal text-brand-gold p-2 rounded-lg hover:bg-brand-gold hover:text-brand-charcoal transition-colors"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>

        </div>
      )}

    </div>
  );
};
