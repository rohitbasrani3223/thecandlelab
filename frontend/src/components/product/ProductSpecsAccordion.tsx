import React, { useState } from 'react';
import { type CMSProduct } from '../../context/CMSContext';

interface ProductSpecsAccordionProps {
  product: CMSProduct;
}

export const ProductSpecsAccordion: React.FC<ProductSpecsAccordionProps> = ({ product }) => {
  const [openSections, setOpenSections] = useState<string[]>(['description', 'specs', 'pyramid']);

  if (!product) return null;

  const toggleSection = (key: string) => {
    setOpenSections((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]
    );
  };

  // Build specs only from actual DB fields — no fallbacks
  const specsMap: Record<string, string> = {};

  if (product.productDetails) {
    Object.assign(specsMap, product.productDetails);
  } else {
    if (product.waxType) specsMap['Wax Type'] = product.waxType;
    if (product.burnTime) specsMap['Burn Time'] = product.burnTime;
    if (product.burnTimeHours) specsMap['Burn Duration'] = `${product.burnTimeHours} Hours`;
    if (product.wickType) specsMap['Wick'] = product.wickType;
    if (product.vesselDescription) specsMap['Vessel'] = product.vesselDescription;
    if (product.weightGrams) specsMap['Net Weight'] = `${product.weightGrams}g`;
  }

  const hasSpecs = Object.keys(specsMap).length > 0;

  // Build fragrance notes sections only when DB data exists
  const hasTopNotes = Boolean(product.topNotes?.trim());
  const hasHeartNotes = Boolean(product.heartNotes?.trim());
  const hasBaseNotes = Boolean(product.baseNotes?.trim());
  const hasPyramid = hasTopNotes || hasHeartNotes || hasBaseNotes;

  const hasDescription = Boolean(product.longDescription?.trim() || product.shortDescription?.trim());
  const hasCare = Boolean(product.howToUse?.trim() || product.safetyInstructions?.trim());
  const hasShipping = Boolean(product.whatsIncluded?.trim() || product.shippingReturns?.trim());

  const sections = [
    hasDescription && {
      id: 'description',
      title: 'Artisan Formulation & Olfactory Notes',
      icon: '🕯️',
      content: (
        <div className="space-y-4 text-xs text-[#5C5149] leading-relaxed font-light">
          <p>{product.longDescription || product.shortDescription}</p>
          {product.shortDescription && product.longDescription && (
            <p className="text-[#7D6F63] italic font-serif text-sm border-l-2 border-[#8B6F4E] pl-3 py-1">
              "{product.shortDescription}"
            </p>
          )}
        </div>
      ),
    },
    hasSpecs && {
      id: 'specs',
      title: 'Product Specifications & Vessel Details',
      icon: '📏',
      content: (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          {Object.entries(specsMap).map(([key, val]) => (
            <div key={key} className="p-3.5 rounded-2xl bg-[#FAF7F2] border border-[#EADDCB]">
              <span className="text-[10px] font-mono uppercase text-[#7D6F63] block mb-0.5">
                {key}
              </span>
              <span className="text-[#232323] font-medium">{String(val)}</span>
            </div>
          ))}
        </div>
      ),
    },
    hasPyramid && {
      id: 'pyramid',
      title: 'Fragrance Pyramid (Top, Heart, Base Notes)',
      icon: '🌸',
      content: (
        <div className="space-y-3 text-xs">
          {hasTopNotes && (
            <div className="p-3.5 rounded-2xl bg-[#FAF7F2] border border-[#EADDCB]">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-mono uppercase text-[#8B6F4E] font-semibold">Top Notes:</span>
                <span className="text-[10px] text-[#7D6F63]">(First 15-30 Minutes)</span>
              </div>
              <p className="text-[#5C5149]">{product.topNotes}</p>
            </div>
          )}
          {hasHeartNotes && (
            <div className="p-3.5 rounded-2xl bg-[#FAF7F2] border border-[#EADDCB]">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-mono uppercase text-[#8B6F4E] font-semibold">Heart Notes:</span>
                <span className="text-[10px] text-[#7D6F63]">(Core Scent Accord)</span>
              </div>
              <p className="text-[#5C5149]">{product.heartNotes}</p>
            </div>
          )}
          {hasBaseNotes && (
            <div className="p-3.5 rounded-2xl bg-[#FAF7F2] border border-[#EADDCB]">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-mono uppercase text-[#8B6F4E] font-semibold">Base Notes:</span>
                <span className="text-[10px] text-[#7D6F63]">(Lasting Warmth & Trail)</span>
              </div>
              <p className="text-[#5C5149]">{product.baseNotes}</p>
            </div>
          )}
        </div>
      ),
    },
    hasCare && {
      id: 'care',
      title: 'How to Use & Candle Care Ritual',
      icon: '🔥',
      content: (
        <div className="space-y-3 text-xs text-[#5C5149] leading-relaxed font-light">
          {product.howToUse && <p>{product.howToUse}</p>}
          {product.safetyInstructions && (
            <div className="p-3 rounded-2xl bg-[#FAF7F2] border border-[#EADDCB] text-[#C94C6D] text-[11px]">
              ⚠️ {product.safetyInstructions}
            </div>
          )}
        </div>
      ),
    },
    hasShipping && {
      id: 'shipping',
      title: "What's Included & Shipping Policy",
      icon: '📦',
      content: (
        <div className="space-y-2.5 text-xs text-[#5C5149]">
          {product.whatsIncluded && (
            <p><span className="text-[#7D6F63] font-medium">In the Box:</span> {product.whatsIncluded}</p>
          )}
          {product.shippingReturns && (
            <p><span className="text-[#7D6F63] font-medium">Shipping & Returns:</span> {product.shippingReturns}</p>
          )}
        </div>
      ),
    },
  ].filter(Boolean) as { id: string; title: string; icon: string; content: React.ReactNode }[];

  if (sections.length === 0) return null;

  return (
    <div className="space-y-3 pt-6 border-t border-[#EADDCB]">
      {sections.map((sec) => {
        const isOpen = openSections.includes(sec.id);
        return (
          <div key={sec.id} className="rounded-3xl bg-[#FFFFFF] border border-[#EADDCB] overflow-hidden transition-all shadow-xs">
            <button
              type="button"
              onClick={() => toggleSection(sec.id)}
              className="w-full p-4.5 flex items-center justify-between text-left hover:bg-[#FAF7F2] transition-colors"
            >
              <div className="flex items-center gap-3">
                <span className="text-base">{sec.icon}</span>
                <span className="font-serif text-sm font-medium text-[#232323]">{sec.title}</span>
              </div>
              <span className="text-xs font-mono text-[#7D6F63] transition-transform duration-200">
                {isOpen ? '−' : '+'}
              </span>
            </button>

            {isOpen && <div className="p-5 pt-1 border-t border-[#EADDCB]">{sec.content}</div>}
          </div>
        );
      })}
    </div>
  );
};
