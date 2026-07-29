import React from 'react';

export const CheckoutTrustBadges: React.FC = () => {
  return (
    <div className="p-5 bg-[#FAF6F0] border border-[#E5D9C5] rounded-md space-y-4 font-sans text-xs">
      <h4 className="font-serif font-bold text-sm text-[#2A1E17] border-b border-[#E5D9C5] pb-2 text-center">
        The Candle Lab Peace of Mind
      </h4>

      <div className="grid grid-cols-2 gap-3 text-center text-[11px] text-[#69574A]">
        <div className="p-2.5 bg-[#F4EFE6] rounded-xs border border-[#E5D9C5]">
          <span className="font-bold text-[#2A1E17] block">🔒 256-Bit SSL</span>
          <span>Encrypted Checkout</span>
        </div>
        <div className="p-2.5 bg-[#F4EFE6] rounded-xs border border-[#E5D9C5]">
          <span className="font-bold text-[#2A1E17] block">🛡️ 30-Day Guarantee</span>
          <span>Serenity Returns</span>
        </div>
        <div className="p-2.5 bg-[#F4EFE6] rounded-xs border border-[#E5D9C5]">
          <span className="font-bold text-[#2A1E17] block">🌿 100% Non-Toxic</span>
          <span>Pure Organic Soy</span>
        </div>
        <div className="p-2.5 bg-[#F4EFE6] rounded-xs border border-[#E5D9C5]">
          <span className="font-bold text-[#2A1E17] block">💳 PCI-DSS Compliant</span>
          <span>Secure Merchant</span>
        </div>
      </div>
    </div>
  );
};
