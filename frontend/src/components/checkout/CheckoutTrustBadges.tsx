import React from 'react';

export const CheckoutTrustBadges: React.FC = () => {
  return (
    <div className="p-5 bg-[#FFFFFF] border border-[#EADDCB] rounded-2xl space-y-4 font-sans text-xs shadow-xs">
      <h4 className="font-serif font-bold text-sm text-[#232323] border-b border-[#EADDCB] pb-2 text-center">
        The Candle Lab Peace of Mind
      </h4>

      <div className="grid grid-cols-2 gap-3 text-center text-[11px] text-[#5C5149]">
        <div className="p-3 bg-[#FAF7F2] rounded-xl border border-[#EADDCB]">
          <span className="font-bold text-[#232323] block">🔒 256-Bit SSL</span>
          <span>Encrypted Checkout</span>
        </div>
        <div className="p-3 bg-[#FAF7F2] rounded-xl border border-[#EADDCB]">
          <span className="font-bold text-[#232323] block">🛡️ 30-Day Guarantee</span>
          <span>Serenity Returns</span>
        </div>
        <div className="p-3 bg-[#FAF7F2] rounded-xl border border-[#EADDCB]">
          <span className="font-bold text-[#232323] block">🌿 100% Non-Toxic</span>
          <span>Pure Organic Soy</span>
        </div>
        <div className="p-3 bg-[#FAF7F2] rounded-xl border border-[#EADDCB]">
          <span className="font-bold text-[#232323] block">💳 PCI-DSS Compliant</span>
          <span>Secure Merchant</span>
        </div>
      </div>
    </div>
  );
};
