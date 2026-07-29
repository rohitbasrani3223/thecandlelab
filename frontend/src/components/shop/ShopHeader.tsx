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
      <div className="bg-[#3D2B1F] text-[#FAF6F0] rounded-2xl p-8 sm:p-12 shadow-card border border-[#523A2B] space-y-3 relative overflow-hidden">
        <span className="text-[11px] font-bold uppercase tracking-widest text-[#B88B38] block">
          THE CANDLE LAB CATALOG
        </span>
        <h1 className="text-3xl sm:text-5xl font-serif font-bold text-[#FAF6F0] tracking-tight">
          {categoryName}
        </h1>
        <p className="text-xs sm:text-sm text-[#EFE8DB] font-light tracking-wide">
          100% Soy Wax • Hand-Poured • Free Shipping On Orders Over ₹1,499 ({totalProducts} Formulations)
        </p>
      </div>
    </section>
  );
};
