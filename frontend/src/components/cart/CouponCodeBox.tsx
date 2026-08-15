import React, { useState } from 'react';
import { Button, Badge, useToast } from '../../design-system';

export interface CouponCodeBoxProps {
  appliedCoupon: string | null;
  onApplyCoupon: (code: string) => void;
  onRemoveCoupon: () => void;
  discountPercentage: number;
}

export const CouponCodeBox: React.FC<CouponCodeBoxProps> = ({
  appliedCoupon,
  onApplyCoupon,
  onRemoveCoupon,
  discountPercentage,
}) => {
  const [inputCode, setInputCode] = useState('');
  const { toast } = useToast();

  const handleApply = () => {
    if (!inputCode.trim()) return;
    const clean = inputCode.trim().toUpperCase();
    if (clean === 'LUXURY10' || clean === 'CANDLE20' || clean === 'SAVE10') {
      onApplyCoupon(clean);
      setInputCode('');
      toast({
        type: 'luxury',
        title: 'Promo Code Applied!',
        description: `Code ${clean} unlocked ${discountPercentage || 10}% savings!`,
      });
    } else {
      toast({
        type: 'info',
        title: 'Invalid Coupon Code',
        description: 'Try code "SAVE10" for 10% off your sanctuary order.',
      });
    }
  };

  return (
    <div className="p-4 bg-[#FFFFFF] border border-[#F5E8EE] rounded-2xl space-y-3 font-sans shadow-xs">
      <span className="text-xs uppercase font-bold tracking-wider text-[#886C7B] block">
        Promo / Gift Voucher Code
      </span>

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
            className="text-xs text-[#BE123C] font-bold hover:underline"
          >
            Remove
          </button>
        </div>
      ) : (
        <div className="flex items-center gap-2">
          <input
            type="text"
            placeholder="Enter code (e.g. SAVE10)"
            value={inputCode}
            onChange={(e) => setInputCode(e.target.value)}
            className="flex-1 text-xs p-2.5 bg-[#FFF6F8] border border-[#F5E8EE] rounded-xl font-mono uppercase text-[#1C1217] outline-none focus:border-[#E87A96] focus:ring-2 focus:ring-[#F9B8CA]/40"
          />
          <Button variant="pink" size="sm" onClick={handleApply}>
            Apply
          </Button>
        </div>
      )}
    </div>
  );
};
