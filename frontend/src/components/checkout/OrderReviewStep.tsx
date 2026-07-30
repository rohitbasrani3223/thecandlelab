import { Button, Badge, SparklesIcon, useToast } from '../../design-system';
import type { AddressData } from './AddressFormStep';
import type { ShippingOption } from './ShippingMethodStep';
import type { PaymentData } from './PaymentMethodStep';


export interface OrderReviewStepProps {
  addressData: AddressData;
  shippingOption: ShippingOption;
  paymentData: PaymentData;
  subtotal: number;
  discountAmount: number;
  onBack: () => void;
  onPlaceOrder: () => void;
}

export const OrderReviewStep: React.FC<OrderReviewStepProps> = ({
  addressData,
  shippingOption,
  paymentData,
  subtotal,
  discountAmount,
  onBack,
  onPlaceOrder,
}) => {
  const { toast } = useToast();
  const tax = (subtotal - discountAmount) * 0.07;
  const total = subtotal - discountAmount + shippingOption.price + tax;

  return (
    <div className="space-y-6 font-sans">
      <div className="flex items-center justify-between border-b border-[#E5D9C5] pb-4">
        <div>
          <Badge variant="gold" icon={<SparklesIcon size={12} />}>STEP 4 OF 4</Badge>
          <h2 className="text-2xl font-serif font-bold text-[#2A1E17] mt-1">
            Final Order Review & Place Order
          </h2>
        </div>
      </div>

      {/* Recap Boxes */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Shipping Address Recap */}
        <div className="p-4 bg-[#FAF6F0] border border-[#E5D9C5] rounded-md space-y-1 text-xs">
          <span className="font-bold text-[#D4AF37] uppercase tracking-wider block">Deliver To:</span>
          <strong className="text-[#2A1E17] block">{addressData.firstName} {addressData.lastName}</strong>
          <p className="text-[#69574A]">{addressData.street}, {addressData.city}, {addressData.state} {addressData.zip}</p>
          <span className="text-[#8C7A6B]">{addressData.email}</span>
        </div>

        {/* Shipping Method Recap */}
        <div className="p-4 bg-[#FAF6F0] border border-[#E5D9C5] rounded-md space-y-1 text-xs">
          <span className="font-bold text-[#D4AF37] uppercase tracking-wider block">Delivery Method:</span>
          <strong className="text-[#2A1E17] block">{shippingOption.name}</strong>
          <span className="text-[#2E6F40] font-semibold block">{shippingOption.timeframe}</span>
          <span className="text-[#8C7A6B]">{shippingOption.price === 0 ? 'FREE' : `$${shippingOption.price.toFixed(2)}`}</span>
        </div>

        {/* Payment Method Recap */}
        <div className="p-4 bg-[#FAF6F0] border border-[#E5D9C5] rounded-md space-y-1 text-xs">
          <span className="font-bold text-[#D4AF37] uppercase tracking-wider block">Payment Option:</span>
          <strong className="text-[#2A1E17] block">
            {paymentData.method === 'cod'
              ? 'Cash on Delivery (Pay at Doorstep)'
              : paymentData.method === 'upi'
              ? 'UPI Instant (GPay / PhonePe / Paytm)'
              : 'Razorpay Online (UPI, Cards, NetBanking)'}
          </strong>
          <span className="text-[#2E6F40] font-semibold block">
            {paymentData.method === 'cod' ? '✓ Pay Cash / UPI on Delivery' : '✓ Verified & Encrypted Gateway'}
          </span>
        </div>
      </div>

      {/* Item Summary Box */}
      <div className="p-5 bg-[#F4EFE6] border border-[#E5D9C5] rounded-md space-y-3">
        <h4 className="font-serif font-bold text-sm text-[#2A1E17]">Order Items Summary (2 Items)</h4>

        <div className="space-y-2 text-xs">
          <div className="flex items-center justify-between">
            <span className="text-[#2A1E17]">Velvet Rose & Smoked Amber (12 oz Glass)</span>
            <span className="font-bold text-[#2A1E17]">₹1,499.00</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-[#2A1E17]">French Bourbon Vanilla 3-Wick (16 oz Jar)</span>
            <span className="font-bold text-[#2A1E17]">₹1,299.00</span>
          </div>
        </div>

        <div className="pt-3 border-t border-[#E5D9C5] space-y-1 text-xs">
          <div className="flex justify-between text-[#8C7A6B]">
            <span>Subtotal</span>
            <span>₹{subtotal.toFixed(2)}</span>
          </div>
          {discountAmount > 0 && (
            <div className="flex justify-between text-[#2E6F40] font-semibold">
              <span>Promo Savings (LUXURY10)</span>
              <span>-₹{discountAmount.toFixed(2)}</span>
            </div>
          )}
          <div className="flex justify-between text-[#8C7A6B]">
            <span>Shipping</span>
            <span>{shippingOption.price === 0 ? 'FREE' : `₹${shippingOption.price.toFixed(2)}`}</span>
          </div>
          <div className="flex justify-between text-[#8C7A6B]">
            <span>GST / Taxes</span>
            <span>Included (₹0.00)</span>
          </div>
          <div className="flex justify-between text-base font-bold text-[#2A1E17] pt-2 border-t border-[#E5D9C5]">
            <span>Grand Total</span>
            <span className="text-xl font-serif text-[#D4AF37]">₹{Math.round(total).toLocaleString('en-IN')}.00</span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-4 pt-4">
        <Button type="button" variant="outline" size="lg" onClick={onBack}>
          ← Back to Payment
        </Button>
        <Button
          type="button"
          variant="gold"
          size="lg"
          fullWidth
          onClick={() => {
            toast({
              type: 'luxury',
              title: paymentData.method === 'cod' ? 'Confirming COD Order...' : 'Opening Razorpay Gateway...',
            });
            onPlaceOrder();
          }}
        >
          {paymentData.method === 'cod'
            ? `Place Cash on Delivery Order (₹${Math.round(total).toLocaleString('en-IN')}) →`
            : `Pay Securely with Razorpay (₹${Math.round(total).toLocaleString('en-IN')}) →`}
        </Button>
      </div>
    </div>
  );
};
