import React, { useState } from 'react';
import { Button, Badge, useToast } from '../../design-system';
import { useCMS } from '../../context/CMSContext';

export interface CouponCodeBoxProps {
  appliedCoupon: string | null;
  onApplyCoupon: (code: string, discountPercent: number) => void;
  onRemoveCoupon: () => void;
  discountPercentage: number;
}

export const CouponCodeBox: React.FC<CouponCodeBoxProps> = ({
  appliedCoupon,
  onApplyCoupon,
  onRemoveCoupon,
  discountPercentage,
}) => {
  const { coupons } = useCMS();
  const [inputCode, setInputCode] = useState('');
  const [showOffers, setShowOffers] = useState(false);
  const { toast } = useToast();

  const activeCouponsList = [
    { code: 'SAVE10', discount: 10, title: '10% Flat Discount', desc: 'Valid on all handcrafted orders' },
    { code: 'FIRST15', discount: 15, title: '15% First Sanctuary Order', desc: 'Welcome perk for boutique customers' },
    { code: 'FESTIVE20', discount: 20, title: '20% Royal Reserve Offer', desc: 'Special celebration discount' },
    ...(coupons || []).map((c) => ({
      code: c.code,
      discount: c.discountPercent || 10,
      title: `${c.discountPercent || 10}% Off`,
      desc: c.description || 'Special store promotion',
    })),
  ];

  const handleApply = (codeToApply?: string) => {
    const raw = (codeToApply || inputCode).trim().toUpperCase();
    if (!raw) return;

    const matched = activeCouponsList.find((c) => c.code.toUpperCase() === raw);

    if (matched) {
      onApplyCoupon(matched.code, matched.discount);
      setInputCode('');
      setShowOffers(false);
      toast({
        type: 'luxury',
        title: 'Promo Code Applied!',
        description: `Code ${matched.code} unlocked ${matched.discount}% savings!`,
      });
    } else if (raw === 'SAVE10' || raw === 'LUXURY10' || raw === 'FIRST15') {
      const disc = raw === 'FIRST15' ? 15 : 10;
      onApplyCoupon(raw, disc);
      setInputCode('');
      setShowOffers(false);
      toast({
        type: 'luxury',
        title: 'Promo Code Applied!',
        description: `Code ${raw} unlocked ${disc}% savings!`,
      });
    } else {
      toast({
        type: 'info',
        title: 'Invalid Coupon Code',
        description: 'Please check the code or select one from "Available Offers".',
      });
    }
  };

  return (
    <div className="p-4 bg-[#FFFFFF] border border-[#F5E8EE] rounded-2xl space-y-3 font-sans shadow-xs">
      <div className="flex items-center justify-between">
        <span className="text-xs uppercase font-bold tracking-wider text-[#886C7B]">
          Promo / Voucher Code
        </span>
        <button
          type="button"
          onClick={() => setShowOffers(!showOffers)}
          className="text-xs font-bold text-[#E87A96] hover:underline cursor-pointer flex items-center gap-1"
        >
          <span>🏷️ {showOffers ? 'Hide Offers' : 'See All Offers'}</span>
        </button>
      </div>

      {appliedCoupon ? (
        <div className="flex items-center justify-between p-3 bg-[#FFF6F8] border border-[#F9B8CA] rounded-xl text-xs">
          <div className="flex items-center gap-2">
            <Badge variant="pink" size="sm">✓ APPLIED</Badge>
            <span className="font-bold text-[#1C1217]">{appliedCoupon}</span>
            <span className="text-[#15803D] font-semibold">({discountPercentage}% Off)</span>
          </div>
          <button
            onClick={() => {
              onRemoveCoupon();
              toast({ type: 'info', title: 'Coupon Removed' });
            }}
            className="text-xs text-[#BE123C] font-bold hover:underline cursor-pointer"
          >
            Remove
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <input
              type="text"
              placeholder="Enter code (e.g. SAVE10)"
              value={inputCode}
              onChange={(e) => setInputCode(e.target.value)}
              className="flex-1 text-xs p-2.5 bg-[#FFF6F8] border border-[#F5E8EE] rounded-xl font-mono uppercase text-[#1C1217] outline-none focus:border-[#E87A96] focus:ring-2 focus:ring-[#F9B8CA]/40"
            />
            <Button variant="pink" size="sm" onClick={() => handleApply()}>
              Apply
            </Button>
          </div>

          {/* Available Offers Accordion */}
          {showOffers && (
            <div className="p-3 bg-[#FFF6F8] border border-[#F9B8CA]/50 rounded-xl space-y-2 text-xs">
              <span className="text-[11px] font-bold text-[#C94C6D] uppercase block">
                ✨ Available Sanctuary Vouchers:
              </span>
              <div className="space-y-2">
                {activeCouponsList.slice(0, 3).map((cpn) => (
                  <div
                    key={cpn.code}
                    className="p-2.5 bg-[#FFFFFF] border border-[#F5E8EE] rounded-lg flex items-center justify-between gap-2"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-[#1C1217] bg-[#FFF6F8] px-2 py-0.5 rounded border border-[#F9B8CA]">
                          {cpn.code}
                        </span>
                        <span className="text-[11px] font-bold text-[#15803D]">
                          {cpn.discount}% OFF
                        </span>
                      </div>
                      <p className="text-[10px] text-[#886C7B] mt-0.5">{cpn.desc}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleApply(cpn.code)}
                      className="px-3 py-1 bg-[#E87A96] hover:bg-[#D45D7D] text-white text-[11px] font-bold rounded-full cursor-pointer shadow-xs"
                    >
                      Apply
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
