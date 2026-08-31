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
  cartItems?: any[];
  onBack: () => void;
  onPlaceOrder: () => void;
}

export const OrderReviewStep: React.FC<OrderReviewStepProps> = ({
  addressData,
  shippingOption,
  paymentData,
  subtotal,
  discountAmount,
  cartItems = [],
  onBack,
  onPlaceOrder,
}) => {
  const { toast } = useToast();
  const grandTotal = Math.max(0, Math.round(subtotal - discountAmount + shippingOption.price));

  return (
    <div className="space-y-6 font-sans">
      <div className="flex items-center justify-between border-b border-[#EADDCB] pb-4">
        <div>
          <Badge variant="pink" icon={<SparklesIcon size={12} />}>STEP 4 OF 4</Badge>
          <h2 className="text-2xl font-serif font-bold text-[#232323] mt-1">
            Final Order Review & Place Order
          </h2>
        </div>
      </div>

      {/* Recap Boxes */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Shipping Address Recap */}
        <div className="p-4 bg-[#FFFFFF] border border-[#EADDCB] rounded-2xl space-y-1 text-xs shadow-xs">
          <span className="font-bold text-[#8B6F4E] uppercase tracking-wider block">Deliver To:</span>
          <strong className="text-[#232323] block">{addressData.firstName} {addressData.lastName}</strong>
          <p className="text-[#5C5149]">{addressData.street}, {addressData.city}, {addressData.state} {addressData.zip}</p>
          <span className="text-[#7D6F63]">{addressData.email}</span>
        </div>

        {/* Shipping Method Recap */}
        <div className="p-4 bg-[#FFFFFF] border border-[#EADDCB] rounded-2xl space-y-1 text-xs shadow-xs">
          <span className="font-bold text-[#8B6F4E] uppercase tracking-wider block">Delivery Method:</span>
          <strong className="text-[#232323] block">{shippingOption.name}</strong>
          <span className="text-[#15803D] font-semibold block">{shippingOption.timeframe}</span>
          <span className="text-[#7D6F63]">{shippingOption.price === 0 ? 'FREE (Complimentary)' : `₹${shippingOption.price}`}</span>
        </div>

        {/* Payment Method Recap */}
        <div className="p-4 bg-[#FFFFFF] border border-[#EADDCB] rounded-2xl space-y-1 text-xs shadow-xs">
          <span className="font-bold text-[#8B6F4E] uppercase tracking-wider block">Payment Option:</span>
          <strong className="text-[#232323] block">
            {paymentData.method === 'cod'
              ? 'Cash on Delivery (Pay at Doorstep)'
              : paymentData.method === 'upi'
              ? 'UPI Instant (GPay / PhonePe / Paytm)'
              : 'Razorpay Online (UPI, Cards, NetBanking)'}
          </strong>
          <span className="text-[#15803D] font-semibold block">
            {paymentData.method === 'cod' ? '✓ Pay Cash / UPI on Delivery' : '✓ Verified & Encrypted Gateway'}
          </span>
        </div>
      </div>

      {/* Item Summary Box */}
      <div className="p-5 bg-[#FAF7F2] border border-[#EADDCB] rounded-3xl space-y-3">
        <h4 className="font-serif font-bold text-sm text-[#232323]">
          Order Items Summary ({cartItems.reduce((sum, i) => sum + (i.quantity || 1), 0)} Items)
        </h4>

        <div className="space-y-2 text-xs">
          {cartItems.length === 0 ? (
            <p className="text-[#7D6F63] italic">Your cart is empty.</p>
          ) : (
            cartItems.map((item, idx) => {
              const variantLabel = [item.fragrance, item.size, item.color].filter(Boolean).join(' • ');
              return (
                <div key={item.id || idx} className="flex items-center justify-between">
                  <span className="text-[#232323] font-medium">
                    {item.quantity || 1}x {item.name}{variantLabel ? ` (${variantLabel})` : ''}
                  </span>
                  <span className="font-bold text-[#232323]">
                    ₹{Math.round((item.price || 0) * (item.quantity || 1)).toLocaleString('en-IN')}
                  </span>
                </div>
              );
            })
          )}
        </div>

        <div className="pt-3 border-t border-[#EADDCB] space-y-1 text-xs">
          <div className="flex justify-between text-[#7D6F63]">
            <span>Subtotal</span>
            <span>₹{subtotal.toLocaleString('en-IN')}</span>
          </div>
          {discountAmount > 0 && (
            <div className="flex justify-between text-[#15803D] font-semibold">
              <span>Promo Savings</span>
              <span>-₹{discountAmount.toLocaleString('en-IN')}</span>
            </div>
          )}
          <div className="flex justify-between text-[#7D6F63]">
            <span>Shipping / Delivery</span>
            <span>{shippingOption.price === 0 ? 'FREE' : `₹${shippingOption.price}`}</span>
          </div>
          <div className="flex justify-between text-base font-bold text-[#232323] pt-2 border-t border-[#EADDCB]">
            <span>Grand Total</span>
            <span className="text-xl font-serif text-[#8B6F4E]">₹{grandTotal.toLocaleString('en-IN')}</span>
          </div>
        </div>
      </div>

      <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4 pt-4">
        <Button type="button" variant="outline" size="lg" onClick={onBack} className="w-full sm:w-auto">
          ← Back to Payment
        </Button>
        <Button
          type="button"
          variant="pink"
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
            ? `Place Cash on Delivery Order (₹${grandTotal.toLocaleString('en-IN')}) →`
            : `Pay Securely with Razorpay (₹${grandTotal.toLocaleString('en-IN')}) →`}
        </Button>
      </div>
    </div>
  );
};
