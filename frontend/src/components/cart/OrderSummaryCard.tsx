import { Button } from '../../design-system';


export interface OrderSummaryCardProps {
  subtotal: number;
  discountAmount: number;
  isFreeShipping: boolean;
  onProceedToCheckout: () => void;
}

export const OrderSummaryCard: React.FC<OrderSummaryCardProps> = ({
  subtotal,
  discountAmount,
  isFreeShipping,
  onProceedToCheckout,
}) => {
  const shippingFee = isFreeShipping ? 0 : 99;
  const grandTotal = Math.max(0, Math.round(subtotal - discountAmount + shippingFee));

  return (
    <div className="bg-[#FAF6F0] border border-[#D4AF37]/40 rounded-md p-6 shadow-goldGlow space-y-6 font-sans">
      <h3 className="font-serif font-bold text-xl text-[#2A1E17] border-b border-[#E5D9C5] pb-3">
        Order Summary
      </h3>

      <div className="space-y-3 text-xs">
        <div className="flex items-center justify-between text-[#2A1E17]">
          <span>Bag Subtotal</span>
          <span className="font-bold">₹{Math.round(subtotal).toLocaleString('en-IN')}</span>
        </div>

        {discountAmount > 0 && (
          <div className="flex items-center justify-between text-[#2E6F40] font-semibold">
            <span>Promo Code Savings</span>
            <span>-₹{Math.round(discountAmount).toLocaleString('en-IN')}</span>
          </div>
        )}

        <div className="flex items-center justify-between text-[#2A1E17]">
          <span>Gold Express Shipping</span>
          <span>
            {isFreeShipping || shippingFee === 0 ? (
              <strong className="text-[#2E6F40]">FREE</strong>
            ) : (
              `₹${shippingFee}`
            )}
          </span>
        </div>

        <div className="flex items-center justify-between text-[#2A1E17]">
          <span>GST / Taxes</span>
          <span className="text-[#2E6F40] font-medium">Included in Price</span>
        </div>

        <div className="pt-3 border-t border-[#E5D9C5] flex items-baseline justify-between text-base">
          <span className="font-serif font-bold text-[#2A1E17]">Estimated Total</span>
          <span className="font-serif font-bold text-2xl text-[#2A1E17]">
            ₹{grandTotal.toLocaleString('en-IN')}
          </span>
        </div>
      </div>

      <div className="space-y-3 pt-2">
        <Button
          variant="gold"
          size="lg"
          fullWidth
          onClick={onProceedToCheckout}
        >
          Proceed to Secure Checkout →
        </Button>

        <div className="text-center space-y-1">
          <span className="text-[10px] text-[#8C7A6B] block">
            🔒 256-Bit SSL Encrypted & Guaranteed Safe Checkout
          </span>
          <span className="text-[10px] text-[#8C7A6B] block">
            Accepts UPI (GPay, PhonePe, Paytm), Cards, NetBanking & COD
          </span>
        </div>
      </div>
    </div>
  );
};
