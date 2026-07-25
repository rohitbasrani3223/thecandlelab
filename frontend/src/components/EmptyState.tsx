"use client";

import React from "react";
import { Sparkles, Plus, Layers, Package, ShoppingBag, Layers3 } from "lucide-react";

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title,
  description,
  actionLabel,
  onAction,
}) => {
  return (
    <div className="bg-white/80 backdrop-blur-md rounded-2xl border-2 border-dashed border-brand-gold/30 p-8 md:p-12 text-center flex flex-col items-center justify-center space-y-4 max-w-md mx-auto my-6 shadow-sm">
      <div className="w-14 h-14 rounded-full bg-brand-surface border border-brand-gold/40 flex items-center justify-center text-brand-gold shadow-sm">
        {icon || <Sparkles className="w-7 h-7" />}
      </div>

      <div className="space-y-1">
        <h4 className="font-serif text-lg font-bold text-brand-charcoal">{title}</h4>
        <p className="text-xs text-brand-earth max-w-xs leading-relaxed">{description}</p>
      </div>

      {actionLabel && onAction && (
        <button
          onClick={onAction}
          className="mt-2 bg-brand-gold text-brand-charcoal px-5 py-2.5 rounded-xl font-bold text-xs hover:bg-brand-goldLight transition-all flex items-center gap-2 shadow-md active:scale-95"
        >
          <Plus className="w-4 h-4" /> {actionLabel}
        </button>
      )}
    </div>
  );
};
