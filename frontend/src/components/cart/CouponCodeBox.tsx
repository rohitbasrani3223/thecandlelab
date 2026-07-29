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
    if (clean === 'LUXURY10' || clean === 'CANDLE20') {
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
        description: 'Try code "LUXURY10" for 10% off your sanctuary order.',
      });
    }
  };

  return (
    <div className="p-4 bg-[#FAF6F0] border border-[#E5D9C5] rounded-md space-y-3 font-sans">
      <span className="text-xs uppercase font-bold tracking-wider text-[#8C7A6B] block">
        Promo / Gift Voucher Code
      </span>

      {appliedCoupon ? (
        <div className="flex items-center justify-between p-2.5 bg-[#F4EFE6] border border-[#D4AF37] rounded-sm text-xs">
          <div className="flex items-center gap-2">
            <Badge variant="gold" size="sm">✓ APPLIED</Badge>
            <span className="font-bold text-[#2A1E17]">{appliedCoupon}</span>
            <span className="text-[#2E6F40] font-semibold">({discountPercentage}% Off)</span>
          </div>
          <button
            onClick={() => {
              onRemoveCoupon();
              toast({ type: 'info', title: 'Coupon Removed' });
            }}
            className="text-xs text-[#B33A3A] font-bold hover:underline"
          >
            Remove
          </button>
        </div>
      ) : (
        <div className="flex items-center gap-2">
          <input
            type="text"
            placeholder="Enter code (e.g. LUXURY10)"
            value={inputCode}
            onChange={(e) => setInputCode(e.target.value)}
            className="flex-1 text-xs p-2 bg-[#F4EFE6] border border-[#E5D9C5] rounded-xs font-mono uppercase text-[#2A1E17] outline-none focus:border-[#D4AF37]"
          />
          <Button variant="gold" size="sm" onClick={handleApply}>
            Apply
          </Button>
        </div>
      )}
    </div>
  );
};
