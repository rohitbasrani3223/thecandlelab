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
    <div className="bg-[#FFFFFF] border border-[#EADDCB] rounded-3xl p-6 shadow-hover space-y-6 font-sans">
      <h3 className="font-serif font-bold text-xl text-[#232323] border-b border-[#EADDCB] pb-3">
        Order Summary
      </h3>

      <div className="space-y-3 text-xs">
        <div className="flex items-center justify-between text-[#232323]">
          <span>Bag Subtotal</span>
          <span className="font-bold">₹{Math.round(subtotal).toLocaleString('en-IN')}</span>
        </div>

        {discountAmount > 0 && (
          <div className="flex items-center justify-between text-[#15803D] font-semibold">
            <span>Promo Code Savings</span>
            <span>-₹{Math.round(discountAmount).toLocaleString('en-IN')}</span>
          </div>
        )}

        <div className="flex items-center justify-between text-[#232323]">
          <span>Atelier Express Shipping</span>
          <span>
            {isFreeShipping || shippingFee === 0 ? (
              <strong className="text-[#15803D]">FREE</strong>
            ) : (
              `₹${shippingFee}`
            )}
          </span>
        </div>

        <div className="flex items-center justify-between text-[#232323]">
          <span>GST / Taxes</span>
          <span className="text-[#15803D] font-medium">Included in Price</span>
        </div>

        <div className="pt-3 border-t border-[#EADDCB] flex items-baseline justify-between text-base">
          <span className="font-serif font-bold text-[#232323]">Estimated Total</span>
          <span className="font-serif font-bold text-2xl text-[#8B6F4E]">
            ₹{grandTotal.toLocaleString('en-IN')}
          </span>
        </div>
      </div>

      <div className="space-y-3 pt-2">
        <Button
          variant="pink"
          size="lg"
          fullWidth
          onClick={onProceedToCheckout}
        >
          Proceed to Secure Checkout →
        </Button>

        <div className="text-center space-y-1">
          <span className="text-[10px] text-[#7D6F63] block">
            🔒 256-Bit SSL Encrypted & Guaranteed Safe Checkout
          </span>
          <span className="text-[10px] text-[#7D6F63] block">
            Accepts UPI (GPay, PhonePe, Paytm), Cards, NetBanking & COD
          </span>
        </div>
      </div>
    </div>
  );
};
