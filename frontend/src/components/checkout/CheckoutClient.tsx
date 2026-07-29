"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronRight,
  CheckCircle2,
  Lock,
  MapPin,
  CreditCard,
  Smartphone,
  Truck,
  ArrowLeft,
  Package,
} from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useCartStore } from "@/store";
import { formatPrice } from "@/lib/utils";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

const addressSchema = z.object({
  fullName: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  phone: z.string().regex(/^[6-9]\d{9}$/, "Enter a valid 10-digit Indian mobile number"),
  addressLine1: z.string().min(5, "Address is required"),
  addressLine2: z.string().optional(),
  city: z.string().min(2, "City is required"),
  state: z.string().min(2, "State is required"),
  pincode: z.string().regex(/^\d{6}$/, "Enter a valid 6-digit pincode"),
});

type AddressFormData = z.infer<typeof addressSchema>;

const PAYMENT_METHODS = [
  { id: "upi", label: "UPI / PhonePe / GPay", icon: <Smartphone size={18} /> },
  { id: "card", label: "Credit / Debit Card", icon: <CreditCard size={18} /> },
  { id: "cod", label: "Cash on Delivery", icon: <Truck size={18} /> },
];

const STEPS = ["Address", "Payment", "Review"];

const INDIAN_STATES = [
  "Andhra Pradesh", "Assam", "Bihar", "Chhattisgarh", "Delhi", "Goa",
  "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka",
  "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya",
  "Mizoram", "Nagaland", "Odisha", "Punjab", "Rajasthan", "Sikkim",
  "Tamil Nadu", "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand",
  "West Bengal",
];

export function CheckoutClient() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedPayment, setSelectedPayment] = useState("upi");
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [orderNumber, setOrderNumber] = useState("");

  const { items, getSubtotal, clearCart } = useCartStore();
  const subtotal = getSubtotal();
  const shipping = subtotal >= 999 ? 0 : 99;
  const total = subtotal + shipping;

  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues,
  } = useForm<AddressFormData>({
    resolver: zodResolver(addressSchema),
  });

  const onAddressSubmit = (data: AddressFormData) => {
    setCurrentStep(1);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handlePlaceOrder = async () => {
    setIsPlacingOrder(true);
    // Simulate order API call
    await new Promise((r) => setTimeout(r, 2000));
    const orderNum = `TCL${Date.now().toString().slice(-8)}`;
    setOrderNumber(orderNum);
    clearCart();
    setIsPlacingOrder(false);
    setOrderPlaced(true);
  };

  if (items.length === 0 && !orderPlaced) {
    return (
      <div className="container py-20 text-center">
        <p className="text-[#8B7355] mb-4">Your cart is empty.</p>
        <Link href="/shop" className="btn btn-gold">
          Shop Now
        </Link>
      </div>
    );
  }

  // Order Success Screen
  if (orderPlaced) {
    return (
      <div className="container py-20 flex flex-col items-center justify-center gap-6 text-center max-w-lg mx-auto">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 20 }}
          className="w-24 h-24 rounded-full flex items-center justify-center"
          style={{ background: "rgba(196,150,74,0.15)", border: "2px solid #C4964A" }}
        >
          <CheckCircle2 size={48} className="text-[#C4964A]" />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <h1
            className="text-3xl font-medium text-[#1A1208] mb-3"
            style={{ fontFamily: "Cormorant Garamond, Georgia, serif" }}
          >
            Order Placed Successfully!
          </h1>
          <p className="text-[#8B7355] mb-2">
            Thank you for your order. We'll send a confirmation to your email.
          </p>
          <p className="text-sm font-semibold text-[#A87B32]">
            Order #{orderNumber}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="flex gap-3"
        >
          <Link href="/" className="btn btn-outline">
            Back to Home
          </Link>
          <Link href="/account/orders" className="btn btn-gold">
            Track Order
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="container py-10">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-xs text-[#8B7355] mb-8">
        <Link href="/" className="hover:text-[#A87B32]">Home</Link>
        <ChevronRight size={12} />
        <Link href="/cart" className="hover:text-[#A87B32]">Cart</Link>
        <ChevronRight size={12} />
        <span className="text-[#1A1208]">Checkout</span>
      </div>

      {/* Step Indicator */}
      <div className="flex items-center justify-center mb-10 gap-0">
        {STEPS.map((step, i) => (
          <div key={step} className="flex items-center">
            <div className="flex flex-col items-center gap-1.5">
              <motion.div
                animate={
                  i < currentStep
                    ? { background: "#C4964A", color: "#fff", scale: 1 }
                    : i === currentStep
                    ? { background: "#1A1208", color: "#F5EFE4", scale: 1.1 }
                    : { background: "#EDE4D4", color: "#8B7355", scale: 1 }
                }
                className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold"
              >
                {i < currentStep ? <CheckCircle2 size={18} /> : i + 1}
              </motion.div>
              <span
                className="text-xs font-medium hidden sm:block"
                style={{
                  color:
                    i === currentStep
                      ? "#1A1208"
                      : i < currentStep
                      ? "#C4964A"
                      : "#C9B99A",
                }}
              >
                {step}
              </span>
            </div>
            {i < STEPS.length - 1 && (
              <div
                className="w-16 sm:w-24 h-0.5 mx-2"
                style={{
                  background:
                    i < currentStep
                      ? "linear-gradient(90deg, #C4964A, #D4A96A)"
                      : "#EDE4D4",
                }}
              />
            )}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2">
          <AnimatePresence mode="wait">
            {/* ---- STEP 0: Address ---- */}
            {currentStep === 0 && (
              <motion.div
                key="address"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <div
                  className="p-6 rounded-2xl"
                  style={{ background: "#fff", border: "1px solid #EDE4D4" }}
                >
                  <h2 className="flex items-center gap-2 text-lg font-semibold text-[#1A1208] mb-6">
                    <MapPin size={18} className="text-[#A87B32]" />
                    Delivery Address
                  </h2>

                  <form
                    onSubmit={handleSubmit(onAddressSubmit)}
                    className="space-y-4"
                  >
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {/* Full Name */}
                      <div>
                        <label className="block text-sm font-medium text-[#4A3728] mb-1.5">
                          Full Name *
                        </label>
                        <input
                          {...register("fullName")}
                          id="checkout-name"
                          placeholder="Priya Sharma"
                          className="input"
                        />
                        {errors.fullName && (
                          <p className="text-xs text-[#B85450] mt-1">
                            {errors.fullName.message}
                          </p>
                        )}
                      </div>

                      {/* Phone */}
                      <div>
                        <label className="block text-sm font-medium text-[#4A3728] mb-1.5">
                          Mobile Number *
                        </label>
                        <input
                          {...register("phone")}
                          id="checkout-phone"
                          placeholder="9876543210"
                          type="tel"
                          className="input"
                        />
                        {errors.phone && (
                          <p className="text-xs text-[#B85450] mt-1">
                            {errors.phone.message}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Email */}
                    <div>
                      <label className="block text-sm font-medium text-[#4A3728] mb-1.5">
                        Email Address *
                      </label>
                      <input
                        {...register("email")}
                        id="checkout-email"
                        placeholder="priya@example.com"
                        type="email"
                        className="input"
                      />
                      {errors.email && (
                        <p className="text-xs text-[#B85450] mt-1">
                          {errors.email.message}
                        </p>
                      )}
                    </div>

                    {/* Address Line 1 */}
                    <div>
                      <label className="block text-sm font-medium text-[#4A3728] mb-1.5">
                        Address Line 1 *
                      </label>
                      <input
                        {...register("addressLine1")}
                        id="checkout-addr1"
                        placeholder="Flat / House No., Building, Street"
                        className="input"
                      />
                      {errors.addressLine1 && (
                        <p className="text-xs text-[#B85450] mt-1">
                          {errors.addressLine1.message}
                        </p>
                      )}
                    </div>

                    {/* Address Line 2 */}
                    <div>
                      <label className="block text-sm font-medium text-[#4A3728] mb-1.5">
                        Address Line 2 (Optional)
                      </label>
                      <input
                        {...register("addressLine2")}
                        id="checkout-addr2"
                        placeholder="Landmark, Area"
                        className="input"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      {/* City */}
                      <div>
                        <label className="block text-sm font-medium text-[#4A3728] mb-1.5">
                          City *
                        </label>
                        <input
                          {...register("city")}
                          id="checkout-city"
                          placeholder="Mumbai"
                          className="input"
                        />
                        {errors.city && (
                          <p className="text-xs text-[#B85450] mt-1">
                            {errors.city.message}
                          </p>
                        )}
                      </div>

                      {/* State */}
                      <div>
                        <label className="block text-sm font-medium text-[#4A3728] mb-1.5">
                          State *
                        </label>
                        <select
                          {...register("state")}
                          id="checkout-state"
                          className="input"
                          style={{ cursor: "pointer" }}
                        >
                          <option value="">Select State</option>
                          {INDIAN_STATES.map((s) => (
                            <option key={s} value={s}>{s}</option>
                          ))}
                        </select>
                        {errors.state && (
                          <p className="text-xs text-[#B85450] mt-1">
                            {errors.state.message}
                          </p>
                        )}
                      </div>

                      {/* Pincode */}
                      <div>
                        <label className="block text-sm font-medium text-[#4A3728] mb-1.5">
                          Pincode *
                        </label>
                        <input
                          {...register("pincode")}
                          id="checkout-pincode"
                          placeholder="400001"
                          maxLength={6}
                          className="input"
                        />
                        {errors.pincode && (
                          <p className="text-xs text-[#B85450] mt-1">
                            {errors.pincode.message}
                          </p>
                        )}
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="btn btn-gold w-full justify-center mt-2"
                      id="checkout-continue-btn"
                    >
                      Continue to Payment
                      <ChevronRight size={18} />
                    </button>
                  </form>
                </div>
              </motion.div>
            )}

            {/* ---- STEP 1: Payment ---- */}
            {currentStep === 1 && (
              <motion.div
                key="payment"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <div
                  className="p-6 rounded-2xl"
                  style={{ background: "#fff", border: "1px solid #EDE4D4" }}
                >
                  <h2 className="flex items-center gap-2 text-lg font-semibold text-[#1A1208] mb-6">
                    <CreditCard size={18} className="text-[#A87B32]" />
                    Payment Method
                  </h2>

                  <div className="space-y-3">
                    {PAYMENT_METHODS.map((method) => (
                      <button
                        key={method.id}
                        onClick={() => setSelectedPayment(method.id)}
                        className="w-full flex items-center gap-4 p-4 rounded-xl transition-all text-left"
                        style={{
                          border:
                            selectedPayment === method.id
                              ? "2px solid #C4964A"
                              : "1.5px solid #EDE4D4",
                          background:
                            selectedPayment === method.id
                              ? "rgba(196,150,74,0.06)"
                              : "#fff",
                        }}
                        id={`payment-${method.id}`}
                      >
                        <div
                          className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                          style={{
                            background:
                              selectedPayment === method.id
                                ? "rgba(196,150,74,0.15)"
                                : "#F5EFE4",
                            color:
                              selectedPayment === method.id
                                ? "#A87B32"
                                : "#8B7355",
                          }}
                        >
                          {method.icon}
                        </div>
                        <span className="font-medium text-[#1A1208]">
                          {method.label}
                        </span>
                        <div
                          className="ml-auto w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0"
                          style={{
                            borderColor:
                              selectedPayment === method.id
                                ? "#C4964A"
                                : "#C9B99A",
                          }}
                        >
                          {selectedPayment === method.id && (
                            <div
                              className="w-2.5 h-2.5 rounded-full"
                              style={{ background: "#C4964A" }}
                            />
                          )}
                        </div>
                      </button>
                    ))}
                  </div>

                  {selectedPayment === "card" && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      className="mt-4 space-y-3"
                    >
                      <input
                        type="text"
                        placeholder="Card Number"
                        className="input"
                        id="card-number"
                        maxLength={19}
                      />
                      <div className="grid grid-cols-2 gap-3">
                        <input
                          type="text"
                          placeholder="MM / YY"
                          className="input"
                          id="card-expiry"
                          maxLength={7}
                        />
                        <input
                          type="text"
                          placeholder="CVV"
                          className="input"
                          id="card-cvv"
                          maxLength={4}
                        />
                      </div>
                      <input
                        type="text"
                        placeholder="Cardholder Name"
                        className="input"
                        id="card-name"
                      />
                    </motion.div>
                  )}

                  {selectedPayment === "upi" && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      className="mt-4"
                    >
                      <input
                        type="text"
                        placeholder="Enter UPI ID (e.g. name@upi)"
                        className="input"
                        id="upi-id"
                      />
                    </motion.div>
                  )}

                  <div className="flex gap-3 mt-6">
                    <button
                      onClick={() => setCurrentStep(0)}
                      className="btn btn-outline gap-2"
                      id="checkout-back-btn"
                    >
                      <ArrowLeft size={16} />
                      Back
                    </button>
                    <button
                      onClick={() => {
                        setCurrentStep(2);
                        window.scrollTo({ top: 0, behavior: "smooth" });
                      }}
                      className="btn btn-gold flex-1 justify-center"
                      id="checkout-review-btn"
                    >
                      Review Order
                      <ChevronRight size={18} />
                    </button>
                  </div>
                </div>
              </motion.div>
            )}

            {/* ---- STEP 2: Review ---- */}
            {currentStep === 2 && (
              <motion.div
                key="review"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="space-y-4"
              >
                {/* Address Summary */}
                <div className="p-5 rounded-2xl" style={{ background: "#fff", border: "1px solid #EDE4D4" }}>
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-semibold text-[#1A1208] flex items-center gap-2">
                      <MapPin size={15} className="text-[#A87B32]" />
                      Delivery Address
                    </h3>
                    <button onClick={() => setCurrentStep(0)} className="text-xs text-[#A87B32] hover:underline">Edit</button>
                  </div>
                  <div className="text-sm text-[#4A3728] space-y-0.5">
                    <p className="font-medium">{getValues("fullName")}</p>
                    <p>{getValues("addressLine1")}</p>
                    {getValues("addressLine2") && <p>{getValues("addressLine2")}</p>}
                    <p>{getValues("city")}, {getValues("state")} - {getValues("pincode")}</p>
                    <p className="text-[#8B7355]">{getValues("phone")}</p>
                  </div>
                </div>

                {/* Payment Summary */}
                <div className="p-5 rounded-2xl" style={{ background: "#fff", border: "1px solid #EDE4D4" }}>
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold text-[#1A1208] flex items-center gap-2">
                      <CreditCard size={15} className="text-[#A87B32]" />
                      Payment Method
                    </h3>
                    <button onClick={() => setCurrentStep(1)} className="text-xs text-[#A87B32] hover:underline">Edit</button>
                  </div>
                  <p className="text-sm text-[#4A3728]">
                    {PAYMENT_METHODS.find(m => m.id === selectedPayment)?.label}
                  </p>
                </div>

                {/* Items */}
                <div className="p-5 rounded-2xl" style={{ background: "#fff", border: "1px solid #EDE4D4" }}>
                  <h3 className="font-semibold text-[#1A1208] mb-3 flex items-center gap-2">
                    <Package size={15} className="text-[#A87B32]" />
                    Order Items ({items.length})
                  </h3>
                  <div className="space-y-3">
                    {items.map((item) => (
                      <div key={item.id} className="flex gap-3 items-center">
                        <div className="w-12 h-12 rounded-lg overflow-hidden bg-[#F5EFE4] flex-shrink-0">
                          <Image src={item.product.thumbnail} alt={item.product.name} width={48} height={48} className="w-full h-full object-cover" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-[#1A1208] line-clamp-1">{item.product.name}</p>
                          <p className="text-xs text-[#8B7355]">Qty: {item.quantity}</p>
                        </div>
                        <p className="text-sm font-semibold text-[#1A1208]">{formatPrice(item.price * item.quantity)}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex gap-3">
                  <button onClick={() => setCurrentStep(1)} className="btn btn-outline gap-2">
                    <ArrowLeft size={16} />
                    Back
                  </button>
                  <motion.button
                    whileTap={{ scale: 0.98 }}
                    onClick={handlePlaceOrder}
                    disabled={isPlacingOrder}
                    className="btn btn-gold flex-1 justify-center text-base disabled:opacity-70"
                    id="place-order-btn"
                  >
                    {isPlacingOrder ? (
                      <span className="flex items-center gap-2">
                        <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Placing Order...
                      </span>
                    ) : (
                      <span className="flex items-center gap-2">
                        <Lock size={16} />
                        Place Order · {formatPrice(total)}
                      </span>
                    )}
                  </motion.button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Order Summary Sidebar */}
        <div className="space-y-4">
          <div className="p-5 rounded-2xl sticky top-24"
            style={{ background: "#fff", border: "1px solid #EDE4D4" }}>
            <h3 className="font-semibold text-[#1A1208] mb-4">Order Summary</h3>
            <div className="space-y-3 mb-4">
              {items.map((item) => (
                <div key={item.id} className="flex gap-2 items-center">
                  <div className="w-10 h-10 rounded-lg overflow-hidden bg-[#F5EFE4] flex-shrink-0 relative">
                    <Image src={item.product.thumbnail} alt={item.product.name} fill className="object-cover" />
                    <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#C4964A] text-white text-[9px] font-bold flex items-center justify-center">
                      {item.quantity}
                    </span>
                  </div>
                  <p className="text-xs text-[#4A3728] flex-1 line-clamp-1">{item.product.name}</p>
                  <p className="text-xs font-semibold text-[#1A1208]">{formatPrice(item.price * item.quantity)}</p>
                </div>
              ))}
            </div>
            <div className="space-y-2 text-sm pt-3" style={{ borderTop: "1px solid #EDE4D4" }}>
              <div className="flex justify-between">
                <span className="text-[#8B7355]">Subtotal</span>
                <span>{formatPrice(subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#8B7355]">Shipping</span>
                <span className={shipping === 0 ? "text-green-600 font-medium" : ""}>
                  {shipping === 0 ? "FREE" : formatPrice(shipping)}
                </span>
              </div>
              <div className="flex justify-between font-bold text-base pt-2" style={{ borderTop: "1px solid #EDE4D4" }}>
                <span>Total</span>
                <span>{formatPrice(total)}</span>
              </div>
            </div>
            <div className="flex items-center gap-1.5 mt-4 text-xs text-[#8B7355] justify-center">
              <Lock size={11} />
              Secured with SSL encryption
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
