import React from 'react';

export interface ShopHeaderProps {
  totalProducts?: number;
  categoryName?: string;
}

export const ShopHeader: React.FC<ShopHeaderProps> = ({
  totalProducts = 36,
  categoryName = 'Shop All Luxury Artisanal Fragrances',
}) => {
  return (
    <section className="py-6 px-6 sm:px-12 font-sans max-w-7xl mx-auto">
      <div className="bg-[#FFFFFF] text-[#1C1217] rounded-3xl p-8 sm:p-12 shadow-card border border-[#F5E8EE] space-y-3 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-[#F9B8CA]/15 rounded-full blur-3xl pointer-events-none" />
        <span className="text-[11px] font-bold uppercase tracking-widest text-[#E87A96] block relative z-10">
          THE CANDLE LAB CATALOG
        </span>
        <h1 className="text-3xl sm:text-5xl font-serif font-bold text-[#1C1217] tracking-tight relative z-10">
          {categoryName}
        </h1>
        <p className="text-xs sm:text-sm text-[#624855] font-light tracking-wide relative z-10">
          100% Organic Soy Wax • Hand-Poured in Small Batches • Free Shipping On Orders Over ₹1,499 ({totalProducts} Formulations)
        </p>
      </div>
    </section>
  );
};
