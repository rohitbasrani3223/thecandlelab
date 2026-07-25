"use client";

import React from "react";
import { Sparkles, ArrowRight, Zap, RefreshCw } from "lucide-react";

export interface AIInsightBannerProps {
  title?: string;
  insight?: string;
  actionText?: string;
  onAction?: () => void;
  className?: string;
}

export const AIInsightBanner: React.FC<AIInsightBannerProps> = ({
  title = "AI Enterprise Intelligence Alert",
  insight = "Monsoon candles demand is projected to spike +28% this weekend. Recommend restocking Madagascar Vanilla SKU.",
  actionText = "Auto-Draft Reorder",
  onAction,
  className = ""
}) => {
  return (
    <div className={`bg-gradient-to-r from-indigo-900 via-slate-900 to-slate-950 text-white p-4 rounded-2xl border border-indigo-500/30 shadow-lg flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 ${className}`}>
      <div className="flex items-center gap-3">
        <div className="p-2.5 rounded-xl bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 shrink-0 animate-pulse">
          <Sparkles className="w-4 h-4 text-indigo-400" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono uppercase tracking-widest text-indigo-300 font-bold bg-indigo-500/20 px-2 py-0.2 rounded border border-indigo-500/30">
              AI FORECAST
            </span>
            <span className="text-xs font-bold text-white">{title}</span>
          </div>
          <p className="text-xs text-slate-300 mt-0.5">{insight}</p>
        </div>
      </div>

      {onAction && (
        <button
          onClick={onAction}
          className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs px-3.5 py-2 rounded-xl transition-all shadow flex items-center gap-1.5 shrink-0"
        >
          <Zap className="w-3.5 h-3.5 text-amber-300" /> {actionText}
        </button>
      )}
    </div>
  );
};
