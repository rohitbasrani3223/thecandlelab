import { NextResponse } from "next/server";

// POST /api/payments/razorpay (Create Razorpay Order ID)
export async function POST(request: Request) {
  try {
    const { amount, currency = "INR", receipt } = await request.json();

    if (!amount) {
      return NextResponse.json(
        { success: false, error: "Amount is required" },
        { status: 400 }
      );
    }

    // Mock Razorpay Order Creation
    const razorpayOrder = {
      id: `order_rzp_${Date.now().toString().slice(-10)}`,
      entity: "order",
      amount: amount * 100, // Razorpay uses paise
      amount_paid: 0,
      amount_due: amount * 100,
      currency,
      receipt: receipt || `receipt_${Date.now()}`,
      status: "created",
      attempts: 0,
      created_at: Math.floor(Date.now() / 1000),
    };

    return NextResponse.json({
      success: true,
      data: razorpayOrder,
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message },
      { status: 500 }
    );
  }
}
