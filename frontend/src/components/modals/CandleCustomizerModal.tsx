"use client";

import React, { useState } from "react";
import { useStore, CustomCandleConfig, CandleProduct } from "@/context/StoreContext";
import { Sparkles, X, Check, Flame, Gift, ArrowRight, ArrowLeft, ShoppingBag, Sliders } from "lucide-react";

interface CandleCustomizerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const JARS = [
  { id: "jar-charcoal", name: "Signature Charcoal Crystal Glass", colorHex: "#2B2B2B", price: 499, bgClass: "bg-neutral-900 border-neutral-700" },
  { id: "jar-ivory", name: "Handmade Ivory Ceramic Vessel", colorHex: "#F8F5F0", price: 549, bgClass: "bg-[#F8F5F0] border-neutral-300" },
  { id: "jar-amber", name: "Warm Frosted Amber Vessel", colorHex: "#B45309", price: 449, bgClass: "bg-amber-900 border-amber-600" },
  { id: "jar-gold", name: "Royal Brass Gold Vessel", colorHex: "#C8A75A", price: 649, bgClass: "bg-amber-600 border-yellow-400" }
];

const WAXES = [
  { id: "wax-soy", name: "100% Organic Soy Wax", price: 200, desc: "Clean burning, biodegradable & slow melt" },
  { id: "wax-beeswax", name: "Pure Golden Beeswax", price: 250, desc: "Air-purifying natural honey aroma" },
  { id: "wax-coconut", name: "Tropical Coconut Wax", price: 220, desc: "Ultra-creamy melt pool with strong hot throw" }
];

const FRAGRANCES = [
  { id: "scent-oud", name: "Smoked Oud & Velvet Amber", top: "Golden Amber", middle: "Smoked Oud Wood", base: "Sandalwood" },
  { id: "scent-lavender", name: "French Lavender & Wild Sage", top: "Lavender", middle: "Clary Sage", base: "Musk" },
  { id: "scent-vanilla", name: "Madagascar Vanilla & Tonka", top: "Vanilla Orchid", middle: "Vanilla Pod", base: "Tonka Bean" },
  { id: "scent-coffee", name: "Roasted Arabica & Salted Caramel", top: "Espresso Beans", middle: "Caramel Swirl", base: "Bourbon" },
  { id: "scent-cinnamon", name: "Spiced Cinnamon & Star Anise", top: "Cinnamon Bark", middle: "Clove Bud", base: "Amber Glow" }
];

const COLORS = [
  { id: "col-cream", name: "Natural Ivory Cream", hex: "#FAF8F5" },
  { id: "col-black", name: "Midnight Onyx Black", hex: "#1C1917" },
  { id: "col-rose", name: "Rose Quartz Pink", hex: "#F472B6" },
  { id: "col-amber", name: "Golden Honey Amber", hex: "#F59E0B" }
];

const WICKS = [
  { id: "wick-wood", name: "Wooden Crackling Wick", price: 150, desc: "Fireside whisper crackle sound" },
  { id: "wick-cotton", name: "Unbleached Cotton Wick", price: 90, desc: "Silent steady flame" }
];

export const CandleCustomizerModal: React.FC<CandleCustomizerModalProps> = ({ isOpen, onClose }) => {
  const { addToCart, currency, showToast } = useStore();
  const [step, setStep] = useState(1);

  const [selectedJar, setSelectedJar] = useState(JARS[0]);
  const [selectedWax, setSelectedWax] = useState(WAXES[0]);
  const [selectedFragrance, setSelectedFragrance] = useState(FRAGRANCES[0]);
  const [selectedColor, setSelectedColor] = useState(COLORS[0]);
  const [selectedWick, setSelectedWick] = useState(WICKS[0]);
  const [customLabel, setCustomLabel] = useState("Handcrafted Scented Candle");
  const [isGiftBox, setIsGiftBox] = useState(true);

  if (!isOpen) return null;

  const totalPrice = selectedJar.price + selectedWax.price + selectedWick.price + (isGiftBox ? 150 : 0);

  const handleAddToCart = () => {
    const config: CustomCandleConfig = {
      jarVessel: selectedJar,
      waxType: selectedWax,
      fragranceOil: selectedFragrance,
      waxColor: selectedColor,
      wickType: selectedWick,
      customLabelText: customLabel || "Bespoke Candle",
      giftBox: isGiftBox,
      totalPrice
    };

    const customProduct: CandleProduct = {
      id: `custom-${Date.now()}`,
      name: `Bespoke Candle: ${customLabel || selectedFragrance.name}`,
      slug: `bespoke-${Date.now()}`,
      tagline: `Custom ${selectedJar.name} with ${selectedFragrance.name}`,
      price: totalPrice,
      rating: 5.0,
      reviewsCount: 1,
      images: [
        "https://images.unsplash.com/photo-1603006905003-be475563bc59?auto=format&fit=crop&w=800&q=80"
      ],
      category: "Bespoke",
      collections: ["scented-candles", "luxury-collection"],
      waxType: selectedWax.name as any,
      wickType: selectedWick.name as any,
      burnTimeHours: 60,
      weightGrams: 300,
      fragranceNotes: {
        top: [selectedFragrance.top],
        middle: [selectedFragrance.middle],
        base: [selectedFragrance.base]
      },
      fragranceStrength: 5,
      roomSize: "Medium (Living Room)",
      careInstructions: ["Trim wick to 1/4 inch before lighting"],
      ingredients: [selectedWax.name, selectedFragrance.name, selectedWick.name],
      isVegan: true,
      isHandmade: true,
      isEcoFriendly: true,
      stock: 99,
      sellerId: "seller-1",
      sellerName: "The Candle Lab Atelier",
      description: `Bespoke handcrafted candle with laser-engraved label "${customLabel}".`
    };

    addToCart(customProduct, 1, isGiftBox, `Bespoke Custom Label: ${customLabel}`, config);
    showToast("Added your Custom Bespoke Candle to Bag! 🕯️✨");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md">
      <div className="relative w-full max-w-5xl bg-brand-surface rounded-2xl border-2 border-brand-gold shadow-2xl p-6 md:p-8 max-h-[90vh] overflow-y-auto">
        
        {/* Close Button */}
        <button onClick={onClose} className="absolute top-4 right-4 p-2 rounded-full hover:bg-brand-beige text-brand-charcoal">
          <X className="w-5 h-5" />
        </button>

        {/* Title */}
        <div className="flex items-center gap-3 border-b border-brand-beige pb-4 mb-6">
          <div className="w-10 h-10 rounded-full bg-brand-charcoal flex items-center justify-center text-brand-gold">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-brand-gold uppercase tracking-widest">3D BESPOKE ATELIER</span>
            <h2 className="font-serif text-2xl font-bold text-brand-charcoal">CANDLE CUSTOMIZER (STEP {step} OF 7)</h2>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column: 3D Visual Vessel Interactive Canvas Preview */}
          <div className="lg:col-span-5 flex flex-col items-center justify-center bg-brand-charcoal text-brand-beige p-6 rounded-2xl border border-brand-gold/40 shadow-xl space-y-6 relative overflow-hidden">
            <div className="text-center">
              <span className="text-[10px] uppercase font-mono tracking-widest text-brand-gold">LIVE 3D ATELIER PREVIEW</span>
              <h4 className="font-serif text-base font-bold text-white mt-1">{selectedJar.name}</h4>
            </div>

            {/* Visual Jar Simulation Container */}
            <div className="relative w-48 h-56 flex flex-col items-center justify-end shadow-2xl rounded-b-3xl border-2 border-brand-gold/60 p-2 overflow-hidden transition-all duration-500" style={{ backgroundColor: selectedJar.colorHex }}>
              
              {/* Flame Glow */}
              <div className="absolute top-3 flex flex-col items-center">
                <Flame className="w-8 h-8 text-amber-500 fill-amber-500 animate-flame-glow filter drop-shadow-[0_0_12px_rgba(245,158,11,0.8)]" />
                <div className="w-1 h-4 bg-yellow-200 mt-0.5 rounded-full" />
              </div>

              {/* Wax Pool Color */}
              <div className="w-full h-32 rounded-b-2xl flex items-center justify-center p-3 text-center border-t border-white/20 shadow-inner" style={{ backgroundColor: selectedColor.hex }}>
                
                {/* Custom Laser Engraved Label Simulation */}
                <div className="bg-white/90 backdrop-blur-md px-3 py-2 rounded border border-brand-gold shadow-md text-brand-charcoal max-w-[140px]">
                  <p className="font-serif text-[10px] font-bold line-clamp-1 uppercase tracking-wider">{customLabel || "THE CANDLE LAB"}</p>
                  <p className="text-[8px] text-brand-earth mt-0.5">{selectedFragrance.name}</p>
                </div>

              </div>
            </div>

            {/* Specs Summary Box */}
            <div className="w-full bg-white/5 p-3 rounded-xl border border-white/10 text-xs space-y-1.5 text-gray-300">
              <div className="flex justify-between">
                <span>Fragrance:</span>
                <span className="font-bold text-brand-gold">{selectedFragrance.name}</span>
              </div>
              <div className="flex justify-between">
                <span>Wax & Wick:</span>
                <span className="font-bold text-white">{selectedWax.name} • {selectedWick.name}</span>
              </div>
              <div className="flex justify-between pt-2 border-t border-white/10 font-serif text-sm font-bold text-white">
                <span>Bespoke Total:</span>
                <span className="text-brand-gold">{currency}{totalPrice}</span>
              </div>
            </div>
          </div>

          {/* Right Column: Step Controls */}
          <div className="lg:col-span-7 flex flex-col justify-between space-y-6">
            
            {/* Step 1: Vessel */}
            {step === 1 && (
              <div className="space-y-4">
                <h3 className="text-xs font-serif font-bold uppercase tracking-wider text-brand-charcoal">Step 1: Choose Luxury Jar Vessel</h3>
                <div className="grid grid-cols-2 gap-3">
                  {JARS.map((jar) => (
                    <button
                      key={jar.id}
                      onClick={() => setSelectedJar(jar)}
                      className={`p-4 rounded-xl border text-left transition-all ${
                        selectedJar.id === jar.id
                          ? "bg-brand-charcoal text-brand-gold border-brand-gold font-bold shadow-md"
                          : "bg-white border-brand-beige text-brand-charcoal hover:border-brand-gold"
                      }`}
                    >
                      <div className="w-6 h-6 rounded-full border border-gray-300 mb-2 shadow" style={{ backgroundColor: jar.colorHex }} />
                      <h4 className="text-xs font-bold">{jar.name}</h4>
                      <p className="text-[10px] text-brand-earth mt-0.5">+{currency}{jar.price}</p>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Step 2: Wax */}
            {step === 2 && (
              <div className="space-y-4">
                <h3 className="text-xs font-serif font-bold uppercase tracking-wider text-brand-charcoal">Step 2: Choose Natural Wax Blend</h3>
                <div className="space-y-3">
                  {WAXES.map((wax) => (
                    <button
                      key={wax.id}
                      onClick={() => setSelectedWax(wax)}
                      className={`w-full p-4 rounded-xl border text-left transition-all flex items-center justify-between ${
                        selectedWax.id === wax.id
                          ? "bg-brand-charcoal text-brand-gold border-brand-gold font-bold shadow-md"
                          : "bg-white border-brand-beige text-brand-charcoal hover:border-brand-gold"
                      }`}
                    >
                      <div>
                        <h4 className="text-xs font-bold">{wax.name}</h4>
                        <p className="text-[10px] text-brand-earth">{wax.desc}</p>
                      </div>
                      <span className="text-xs font-bold">+{currency}{wax.price}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Step 3: Fragrance */}
            {step === 3 && (
              <div className="space-y-4">
                <h3 className="text-xs font-serif font-bold uppercase tracking-wider text-brand-charcoal">Step 3: Choose Botanical Essential Oil Scent</h3>
                <div className="space-y-2">
                  {FRAGRANCES.map((scent) => (
                    <button
                      key={scent.id}
                      onClick={() => setSelectedFragrance(scent)}
                      className={`w-full p-3 rounded-xl border text-left transition-all ${
                        selectedFragrance.id === scent.id
                          ? "bg-brand-charcoal text-brand-gold border-brand-gold font-bold shadow-md"
                          : "bg-white border-brand-beige text-brand-charcoal hover:border-brand-gold"
                      }`}
                    >
                      <h4 className="text-xs font-bold">{scent.name}</h4>
                      <p className="text-[10px] text-brand-earth mt-0.5">Top: {scent.top} • Middle: {scent.middle} • Base: {scent.base}</p>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Step 4: Color */}
            {step === 4 && (
              <div className="space-y-4">
                <h3 className="text-xs font-serif font-bold uppercase tracking-wider text-brand-charcoal">Step 4: Choose Wax Tint Hue</h3>
                <div className="grid grid-cols-2 gap-3">
                  {COLORS.map((c) => (
                    <button
                      key={c.id}
                      onClick={() => setSelectedColor(c)}
                      className={`p-3 rounded-xl border text-left transition-all flex items-center gap-3 ${
                        selectedColor.id === c.id
                          ? "bg-brand-charcoal text-brand-gold border-brand-gold font-bold shadow-md"
                          : "bg-white border-brand-beige text-brand-charcoal hover:border-brand-gold"
                      }`}
                    >
                      <div className="w-6 h-6 rounded-full border border-gray-300 shadow" style={{ backgroundColor: c.hex }} />
                      <span className="text-xs font-bold">{c.name}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Step 5: Wick */}
            {step === 5 && (
              <div className="space-y-4">
                <h3 className="text-xs font-serif font-bold uppercase tracking-wider text-brand-charcoal">Step 5: Choose Wick Type</h3>
                <div className="space-y-3">
                  {WICKS.map((wk) => (
                    <button
                      key={wk.id}
                      onClick={() => setSelectedWick(wk)}
                      className={`w-full p-4 rounded-xl border text-left transition-all flex items-center justify-between ${
                        selectedWick.id === wk.id
                          ? "bg-brand-charcoal text-brand-gold border-brand-gold font-bold shadow-md"
                          : "bg-white border-brand-beige text-brand-charcoal hover:border-brand-gold"
                      }`}
                    >
                      <div>
                        <h4 className="text-xs font-bold">{wk.name}</h4>
                        <p className="text-[10px] text-brand-earth">{wk.desc}</p>
                      </div>
                      <span className="text-xs font-bold">+{currency}{wk.price}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Step 6: Label Engraving */}
            {step === 6 && (
              <div className="space-y-4">
                <h3 className="text-xs font-serif font-bold uppercase tracking-wider text-brand-charcoal">Step 6: Laser Engraved Custom Label Text</h3>
                <div className="bg-white p-4 rounded-xl border border-brand-gold/30 space-y-3">
                  <label className="text-[11px] font-semibold text-brand-earth block">Engrave Your Name or Custom Message:</label>
                  <input
                    type="text"
                    maxLength={30}
                    placeholder="e.g. Serene Sanctuary or Warm Home Scent"
                    value={customLabel}
                    onChange={(e) => setCustomLabel(e.target.value)}
                    className="w-full text-sm p-3 rounded-lg border border-brand-beige focus:outline-none focus:ring-1 focus:ring-brand-gold font-serif"
                  />
                  <p className="text-[10px] text-gray-400">Max 30 characters. Engraved in gold foil on signature label.</p>
                </div>
              </div>
            )}

            {/* Step 7: Packaging */}
            {step === 7 && (
              <div className="space-y-4">
                <h3 className="text-xs font-serif font-bold uppercase tracking-wider text-brand-charcoal">Step 7: Luxury Gift Presentation</h3>
                <div className="bg-white p-4 rounded-xl border border-brand-beige space-y-3">
                  <label className="flex items-center gap-3 text-xs font-bold text-brand-charcoal cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isGiftBox}
                      onChange={(e) => setIsGiftBox(e.target.checked)}
                      className="rounded text-brand-gold focus:ring-brand-gold"
                    />
                    <Gift className="w-5 h-5 text-brand-gold" />
                    Include Handcrafted Gold Foil Box with Wax Seal Stamp (+{currency}150)
                  </label>
                </div>
              </div>
            )}

            {/* Step Navigation Controls */}
            <div className="flex justify-between items-center pt-4 border-t border-brand-beige">
              <button
                disabled={step === 1}
                onClick={() => setStep(step - 1)}
                className="text-xs font-bold text-brand-earth hover:text-brand-charcoal disabled:opacity-30 flex items-center gap-1"
              >
                <ArrowLeft className="w-4 h-4" /> Previous
              </button>

              {step < 7 ? (
                <button
                  onClick={() => setStep(step + 1)}
                  className="bg-brand-charcoal text-brand-gold px-6 py-2.5 rounded-xl font-bold text-xs hover:bg-brand-gold hover:text-brand-charcoal transition-colors flex items-center gap-1 shadow"
                >
                  Next Step <ArrowRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  onClick={handleAddToCart}
                  className="bg-brand-gold text-brand-charcoal px-8 py-3 rounded-xl font-bold text-xs hover:bg-brand-goldLight transition-colors flex items-center gap-2 shadow-xl"
                >
                  <ShoppingBag className="w-4 h-4" /> Add Bespoke Candle to Bag ({currency}{totalPrice})
                </button>
              )}
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};
