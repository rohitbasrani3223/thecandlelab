"use client";

import React, { useState } from "react";
import { useStore, CandleProduct } from "@/context/StoreContext";
import { X, Send, Bot, ShoppingBag } from "lucide-react";

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
    <div className="fixed bottom-6 right-6 z-50">
      
      {/* Floating Circle Button with Gold Glow & Intercom Style Tag */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="w-14 h-14 rounded-full bg-[#C8A75A] text-white shadow-luxury-hero flex items-center justify-center hover:scale-105 transition-all hover:bg-[#D4B46A] relative group border border-white/40"
          style={{ boxShadow: '0 8px 25px rgba(200, 167, 90, 0.45)' }}
          title="AI Scent Concierge"
        >
          <Bot className="w-6 h-6 text-white" />
          <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-[#5F8A5D] border-2 border-white dark:border-[#151515] rounded-full" />
        </button>
      )}

      {/* Chat Window Drawer */}
      {isOpen && (
        <div className="w-80 sm:w-96 bg-white dark:bg-[#1E1E1E] rounded-3xl border border-[#E6DFD3] dark:border-[#C8A75A]/50 shadow-2xl overflow-hidden flex flex-col h-[490px]">
          
          {/* Header */}
          <div className="bg-[#FAF7F2] dark:bg-[#151515] text-[#1F1F1F] dark:text-[#F8F5F0] p-4 border-b border-[#E6DFD3] dark:border-[#383838] flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-[#C8A75A]/20 flex items-center justify-center border border-[#C8A75A]/40">
                <Bot className="w-4 h-4 text-[#C8A75A]" />
              </div>
              <div>
                <h4 className="font-serif text-xs font-bold text-[#1F1F1F] dark:text-[#F8F5F0]">AI SCENT CONCIERGE</h4>
                <p className="text-[9px] text-[#C8A75A] font-mono tracking-wider">ONLINE • LIVE RECOMMENDATIONS</p>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="text-[#666666] dark:text-[#A8A29E] hover:text-[#1F1F1F] dark:hover:text-[#F8F5F0]">
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Messages Feed */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3.5 bg-[#FAF7F2]/50 dark:bg-[#1E1E1E]">
            {messages.map((m, idx) => (
              <div
                key={idx}
                className={`flex flex-col ${m.sender === "user" ? "items-end" : "items-start"}`}
              >
                <div
                  className={`max-w-[85%] p-3 rounded-2xl text-xs leading-relaxed ${
                    m.sender === "user"
                      ? "bg-[#C8A75A] text-white font-medium rounded-br-none shadow-sm"
                      : "bg-white dark:bg-[#151515] border border-[#E6DFD3] dark:border-[#383838] text-[#1F1F1F] dark:text-[#F8F5F0] rounded-bl-none shadow-sm font-light"
                  }`}
                >
                  <p>{m.text}</p>
                </div>

                {/* Product Recommendation Cards */}
                {m.recommendedProducts && (
                  <div className="mt-2 space-y-2 w-full">
                    {m.recommendedProducts.map((p) => (
                      <div key={p.id} className="bg-white dark:bg-[#151515] p-2.5 rounded-2xl border border-[#E6DFD3] dark:border-[#383838] flex items-center gap-2.5 shadow-sm">
                        <img src={p.images[0]} alt="" className="w-12 h-12 object-cover rounded-xl border border-[#E6DFD3] dark:border-[#383838]" />
                        <div className="flex-1">
                          <h5 className="font-serif text-xs font-bold text-[#1F1F1F] dark:text-[#F8F5F0] line-clamp-1">{p.name}</h5>
                          <p className="text-[9px] text-[#666666] dark:text-[#A8A29E]">{p.waxType} • {p.burnTimeHours}h Burn</p>
                          <span className="text-xs font-bold text-[#C8A75A]">{currency}{p.price}</span>
                        </div>
                        <button
                          onClick={() => addToCart(p)}
                          className="bg-[#C8A75A] text-white p-2 rounded-xl text-xs font-bold hover:bg-[#D4B46A] transition-colors"
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
          <form onSubmit={handleSend} className="p-2.5 bg-white dark:bg-[#151515] border-t border-[#E6DFD3] dark:border-[#383838] flex gap-2">
            <input
              type="text"
              placeholder="Ask AI Concierge..."
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              className="flex-1 text-xs px-3.5 py-2.5 rounded-xl border border-[#E6DFD3] dark:border-[#383838] bg-[#FAF7F2] dark:bg-[#1E1E1E] focus:outline-none focus:border-[#C8A75A] text-[#1F1F1F] dark:text-[#F8F5F0] placeholder-[#666666] dark:placeholder-[#A8A29E]"
            />
            <button
              type="submit"
              className="bg-[#C8A75A] text-white px-3 rounded-xl hover:bg-[#D4B46A] transition-colors font-bold"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>

        </div>
      )}

    </div>
  );
};
