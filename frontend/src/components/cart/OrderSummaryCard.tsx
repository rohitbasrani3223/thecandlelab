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
  const shippingFee = isFreeShipping ? 0 : 15.0;

  const estimatedTax = (subtotal - discountAmount) * 0.07;
  const grandTotal = Math.max(0, subtotal - discountAmount + shippingFee + estimatedTax);

  return (
    <div className="bg-[#FAF6F0] border border-[#D4AF37]/40 rounded-md p-6 shadow-goldGlow space-y-6 font-sans">
      <h3 className="font-serif font-bold text-xl text-[#2A1E17] border-b border-[#E5D9C5] pb-3">
        Order Summary
      </h3>

      <div className="space-y-3 text-xs">
        <div className="flex items-center justify-between text-[#2A1E17]">
          <span>Bag Subtotal</span>
          <span className="font-bold">${subtotal.toFixed(2)}</span>
        </div>

        {discountAmount > 0 && (
          <div className="flex items-center justify-between text-[#2E6F40] font-semibold">
            <span>Promo Code Savings</span>
            <span>-${discountAmount.toFixed(2)}</span>
          </div>
        )}

        <div className="flex items-center justify-between text-[#2A1E17]">
          <span>Gold Express Shipping</span>
          <span>
            {isFreeShipping ? (
              <strong className="text-[#2E6F40]">FREE</strong>
            ) : (
              `$${shippingFee.toFixed(2)}`
            )}
          </span>
        </div>

        <div className="flex items-center justify-between text-[#2A1E17]">
          <span>Estimated Sales Tax (7%)</span>
          <span>${estimatedTax.toFixed(2)}</span>
        </div>

        <div className="pt-3 border-t border-[#E5D9C5] flex items-baseline justify-between text-base">
          <span className="font-serif font-bold text-[#2A1E17]">Estimated Total</span>
          <span className="font-serif font-bold text-2xl text-[#2A1E17]">
            ${grandTotal.toFixed(2)}
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
            Accepts Apple Pay, Google Pay, Visa, Mastercard, AMEX
          </span>
        </div>
      </div>
    </div>
  );
};
