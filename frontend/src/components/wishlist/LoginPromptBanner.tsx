import React, { useState } from 'react';
import { Button, useToast } from '../../design-system';

export const LoginPromptBanner: React.FC = () => {
  const [isDismissed, setIsDismissed] = useState(false);
  const { toast } = useToast();

  if (isDismissed) return null;

  return (
    <div className="bg-gradient-to-r from-[#2A1E17] via-[#1C130E] to-[#2A1E17] text-[#FAF6F0] p-6 rounded-md border border-[#D4AF37]/40 shadow-card flex flex-col sm:flex-row items-center justify-between gap-4 font-sans relative overflow-hidden">
      <div className="space-y-1 text-center sm:text-left">
        <div className="flex items-center justify-center sm:justify-start gap-2">
          <span className="text-xs font-bold uppercase tracking-wider text-[#D4AF37]">
            🔒 Sync Across Devices
          </span>
        </div>
        <h4 className="font-serif font-bold text-base text-[#FAF6F0]">
          Sign in to save your wishlist permanently
        </h4>
        <p className="text-xs text-[#E5D9C5] max-w-lg leading-relaxed font-light">
          Your saved candle formulations are currently stored locally. Create a free account or sign in to access your wishlist on any device.
        </p>
      </div>

      <div className="flex items-center gap-3 shrink-0">
        <Button
          variant="gold"
          size="sm"
          onClick={() => toast({ type: 'luxury', title: 'Sign In Opened', description: 'Enter your email to sync your sanctuary.' })}
        >
          Sign In / Register
        </Button>
        <button
          onClick={() => setIsDismissed(true)}
          className="text-xs text-[#8C7A6B] hover:text-[#FAF6F0] p-1"
          aria-label="Dismiss banner"
        >
          ✕
        </button>
      </div>
    </div>
  );
};
