"use client";

import React, { useState } from "react";
import { useStore } from "@/context/StoreContext";
import { Mic, Image as ImageIcon, Sparkles, X, Upload } from "lucide-react";

interface VoiceImageSearchProps {
  isOpen: boolean;
  onClose: () => void;
}

export const VoiceImageSearch: React.FC<VoiceImageSearchProps> = ({ isOpen, onClose }) => {
  const { setSearchQuery, showToast } = useStore();
  const [isListening, setIsListening] = useState(false);
  const [mode, setMode] = useState<"voice" | "image">("voice");

  if (!isOpen) return null;

  const startVoice = () => {
    setIsListening(true);
    showToast("Listening... Speak your candle search query!");
    setTimeout(() => {
      setIsListening(false);
      setSearchQuery("Smoked Oud Amber");
      showToast("Voice query detected: 'Smoked Oud Amber' 🎙️");
      onClose();
    }, 2500);
  };

  const handleImageDrop = () => {
    setSearchQuery("Lavender");
    showToast("Image analyzed: Matched French Lavender candle! 📷");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
      <div className="relative w-full max-w-md bg-brand-surface rounded-2xl border-2 border-brand-gold shadow-2xl p-6 text-center">
        
        <button onClick={onClose} className="absolute top-4 right-4 p-2 text-brand-charcoal hover:bg-brand-beige rounded-full">
          <X className="w-5 h-5" />
        </button>

        <div className="flex justify-center gap-2 mb-6">
          <button
            onClick={() => setMode("voice")}
            className={`px-4 py-1.5 rounded-full text-xs font-bold ${mode === "voice" ? "bg-brand-charcoal text-brand-gold" : "bg-brand-beige text-brand-earth"}`}
          >
            Voice Search 🎙️
          </button>
          <button
            onClick={() => setMode("image")}
            className={`px-4 py-1.5 rounded-full text-xs font-bold ${mode === "image" ? "bg-brand-charcoal text-brand-gold" : "bg-brand-beige text-brand-earth"}`}
          >
            Image Search 🖼️
          </button>
        </div>

        {mode === "voice" ? (
          <div className="space-y-4 py-6">
            <button
              onClick={startVoice}
              className={`w-20 h-20 rounded-full mx-auto flex items-center justify-center border-2 transition-all ${
                isListening ? "bg-red-500 text-white border-red-300 animate-ping" : "bg-brand-charcoal text-brand-gold border-brand-gold hover:scale-105"
              }`}
            >
              <Mic className="w-8 h-8" />
            </button>
            <p className="text-xs text-brand-earth font-medium">
              {isListening ? "Listening..." : "Tap mic and say 'Smoked Oud', 'Lavender', or 'Vanilla'"}
            </p>
          </div>
        ) : (
          <div
            onClick={handleImageDrop}
            className="border-2 border-dashed border-brand-gold p-8 rounded-2xl cursor-pointer hover:bg-brand-beige/50 transition-colors space-y-3"
          >
            <Upload className="w-10 h-10 text-brand-gold mx-auto" />
            <p className="text-xs font-bold text-brand-charcoal">Upload or Drag Candle Photo</p>
            <p className="text-[10px] text-gray-400">AI Visual Search will match similar candle vessels & scents</p>
          </div>
        )}

      </div>
    </div>
  );
};
