"use client";

import React, { useState } from "react";
import { useStore, CandleProduct } from "@/context/StoreContext";
import { Compass, X, Sparkles, Flame, Check, RefreshCw } from "lucide-react";

interface FragranceQuizModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const FragranceQuizModal: React.FC<FragranceQuizModalProps> = ({ isOpen, onClose }) => {
  const { products, addToCart, currency } = useStore();
  const [step, setStep] = useState(1);
  const [answers, setAnswers] = useState({
    mood: "",
    scentFamily: "",
    roomSize: "",
    timeOfDay: ""
  });
  const [matchedProducts, setMatchedProducts] = useState<CandleProduct[]>([]);

  if (!isOpen) return null;

  const handleSelect = (key: string, val: string) => {
    setAnswers((prev) => ({ ...prev, [key]: val }));
  };

  const calculateResult = () => {
    // Simple AI Matching logic based on scent family & room size
    let matches = products.filter((p) => {
      if (answers.scentFamily && p.category.toLowerCase().includes(answers.scentFamily.toLowerCase())) return true;
      if (answers.roomSize && p.roomSize.includes(answers.roomSize)) return true;
      return true;
    });

    if (matches.length === 0) matches = products.slice(0, 3);
    setMatchedProducts(matches.slice(0, 3));
    setStep(4); // Results step
  };

  const resetQuiz = () => {
    setStep(1);
    setAnswers({ mood: "", scentFamily: "", roomSize: "", timeOfDay: "" });
    setMatchedProducts([]);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-2xl bg-brand-surface rounded-2xl border-2 border-brand-gold shadow-2xl p-6 md:p-8 overflow-hidden">
        
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full hover:bg-brand-beige text-brand-charcoal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-2 mb-6 border-b border-brand-beige pb-4">
          <div className="w-8 h-8 rounded-full bg-brand-charcoal flex items-center justify-center text-brand-gold">
            <Compass className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-serif text-xl font-bold text-brand-charcoal">CANDLE QUIZ: FIND YOUR MATCH</h3>
            <p className="text-xs text-brand-earth">AI Scent Recommendation Engine</p>
          </div>
        </div>

        {/* Quiz Steps */}
        {step === 1 && (
          <div className="space-y-6">
            <h4 className="text-sm font-semibold text-brand-charcoal uppercase tracking-wider">
              Step 1 of 3: What mood do you want to create in your space?
            </h4>
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: "Calm & Serene Spa", icon: "🧘‍♀️", key: "calm" },
                { label: "Cozy Fireside warmth", icon: "🪵", key: "cozy" },
                { label: "Energizing Coffee Morning", icon: "☕", key: "energy" },
                { label: "Romantic Floral Garden", icon: "🌸", key: "romantic" }
              ].map((item) => (
                <button
                  key={item.key}
                  onClick={() => {
                    handleSelect("mood", item.key);
                    setStep(2);
                  }}
                  className={`p-4 rounded-xl border text-left transition-all flex items-center gap-3 ${
                    answers.mood === item.key
                      ? "bg-brand-charcoal text-brand-gold border-brand-gold font-bold"
                      : "bg-white border-brand-beige hover:border-brand-gold text-brand-charcoal"
                  }`}
                >
                  <span className="text-2xl">{item.icon}</span>
                  <span className="text-xs">{item.label}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6">
            <h4 className="text-sm font-semibold text-brand-charcoal uppercase tracking-wider">
              Step 2 of 3: Which fragrance notes appeal to you most?
            </h4>
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: "Woody & Smoked Oud", key: "luxury" },
                { label: "French Lavender & Sage", key: "floral" },
                { label: "Madagascar Vanilla & Tonka", key: "vanilla" },
                { label: "Roasted Coffee & Caramel", key: "gourmand" }
              ].map((item) => (
                <button
                  key={item.key}
                  onClick={() => {
                    handleSelect("scentFamily", item.key);
                    setStep(3);
                  }}
                  className={`p-4 rounded-xl border text-left transition-all ${
                    answers.scentFamily === item.key
                      ? "bg-brand-charcoal text-brand-gold border-brand-gold font-bold"
                      : "bg-white border-brand-beige hover:border-brand-gold text-brand-charcoal"
                  }`}
                >
                  <span className="text-xs">{item.label}</span>
                </button>
              ))}
            </div>
            <button
              onClick={() => setStep(1)}
              className="text-xs text-brand-earth underline"
            >
              ← Back
            </button>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-6">
            <h4 className="text-sm font-semibold text-brand-charcoal uppercase tracking-wider">
              Step 3 of 3: Where will you be burning this candle?
            </h4>
            <div className="grid grid-cols-3 gap-3">
              {[
                { label: "Bedroom", key: "Small" },
                { label: "Living Room", key: "Medium" },
                { label: "Open Lounge", key: "Large" }
              ].map((item) => (
                <button
                  key={item.key}
                  onClick={() => {
                    handleSelect("roomSize", item.key);
                  }}
                  className={`p-4 rounded-xl border text-center transition-all ${
                    answers.roomSize === item.key
                      ? "bg-brand-charcoal text-brand-gold border-brand-gold font-bold"
                      : "bg-white border-brand-beige hover:border-brand-gold text-brand-charcoal"
                  }`}
                >
                  <span className="text-xs">{item.label}</span>
                </button>
              ))}
            </div>

            <div className="flex justify-between items-center pt-4">
              <button onClick={() => setStep(2)} className="text-xs text-brand-earth underline">
                ← Back
              </button>
              <button
                onClick={calculateResult}
                className="bg-brand-gold text-brand-charcoal px-6 py-2.5 rounded-xl font-bold text-xs hover:bg-brand-goldLight transition-colors flex items-center gap-1.5 shadow-lg"
              >
                <Sparkles className="w-4 h-4" /> Reveal My Fragrance Match
              </button>
            </div>
          </div>
        )}

        {/* Quiz Results Step */}
        {step === 4 && (
          <div className="space-y-6">
            <div className="bg-brand-charcoal text-brand-beige p-4 rounded-xl border border-brand-gold flex items-center justify-between">
              <div>
                <span className="text-xs uppercase tracking-wider text-brand-gold font-bold flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5" /> Your Personalized Scent Matches
                </span>
                <p className="text-xs text-gray-300 mt-1">Based on your mood preferences & room dimensions</p>
              </div>
              <button
                onClick={resetQuiz}
                className="text-xs text-brand-gold hover:underline flex items-center gap-1"
              >
                <RefreshCw className="w-3 h-3" /> Retake
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {matchedProducts.map((p) => (
                <div key={p.id} className="bg-white p-3 rounded-xl border border-brand-beige flex flex-col justify-between">
                  <img src={p.images[0]} alt={p.name} className="w-full h-28 object-cover rounded-lg mb-2" />
                  <div>
                    <h5 className="font-serif text-xs font-bold text-brand-charcoal line-clamp-1">{p.name}</h5>
                    <p className="text-[10px] text-brand-earth font-medium mt-0.5">{p.waxType} • {p.burnTimeHours}h Burn</p>
                    <p className="text-xs font-bold text-brand-charcoal mt-1">{currency}{p.price}</p>
                  </div>
                  <button
                    onClick={() => {
                      addToCart(p);
                      onClose();
                    }}
                    className="w-full mt-3 bg-brand-charcoal text-brand-beige py-1.5 rounded text-xs font-bold hover:bg-brand-gold hover:text-brand-charcoal transition-colors flex items-center justify-center gap-1"
                  >
                    <Check className="w-3 h-3" /> Select Match
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
