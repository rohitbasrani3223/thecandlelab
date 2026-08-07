import React, { useState } from 'react';
import { ChevronDownIcon } from '../../design-system';

export interface ProductSpecsAccordionProps {
  product?: {
    name?: string;
    vesselDescription?: string;
    burnTime?: string;
  } | null;
}

export const ProductSpecsAccordion: React.FC<ProductSpecsAccordionProps> = ({ product }) => {
  const [openTab, setOpenTab] = useState<string | null>('story');

  const name = product?.name || 'Artisanal Soy Candle';
  const desc = product?.vesselDescription || 'Hand-poured in luxury glass jar.';
  const burnTime = product?.burnTime || '60 Hours';

  const tabs = [
    {
      id: 'story',
      title: 'Olfactory Inspiration & Details',
      content: `${name}: ${desc} Crafted in small batches by master candlemakers with clean ${burnTime} burn time performance.`,
    },
    {
      id: 'ingredients',
      title: 'Non-Toxic Ingredients & Wax Purity',
      content: 'Made with 100% pure organic soy wax, phthalate-free fragrance oils, and wild-harvested botanical essential oils. Contains 0% paraffin, 0% synthetic petroleum dyes, and 0% parabens. 100% non-toxic for pets and children.',
    },
    {
      id: 'shipping',
      title: 'Shipping & Free Returns Policy',
      content: 'Orders ship within 24 hours. Free Express Shipping on orders over ₹1,499. Protected in heavy luxury gift packaging with custom foam inserts. Backed by our 30-Day Guarantee.',
    },
    {
      id: 'care',
      title: 'Candle Care & Wick Trimming Instructions',
      content: 'Always trim the wood or cotton wick to 1/4 inch before relighting. Allow wax to melt fully to glass edges on first burn (2-3 hours) to prevent tunnelling. Do not burn for more than 4 consecutive hours.',
    },
  ];

  return (
    <div className="space-y-3 font-sans border-t border-[#E5D9C5] pt-8">
      <h3 className="text-xs uppercase font-bold tracking-widest text-[#D4AF37]">
        Product Specifications & Details
      </h3>

      <div className="space-y-2">
        {tabs.map((tab) => (
          <div key={tab.id} className="bg-[#FAF6F0] border border-[#E5D9C5] rounded-xl overflow-hidden transition-all">
            <button
              onClick={() => setOpenTab(openTab === tab.id ? null : tab.id)}
              className="w-full text-left p-4 font-serif font-bold text-sm text-[#2A1E17] hover:text-[#D4AF37] flex items-center justify-between gap-4 transition-colors cursor-pointer"
            >
              <span>{tab.title}</span>
              <ChevronDownIcon size={16} className={`shrink-0 transition-transform ${openTab === tab.id ? 'rotate-180 text-[#D4AF37]' : ''}`} />
            </button>

            {openTab === tab.id && (
              <div className="px-4 pb-4 text-xs text-[#69574A] leading-relaxed border-t border-[#F4EFE6] pt-3 animate-fade-in font-sans">
                {tab.content}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
