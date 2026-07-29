import { NextResponse } from "next/server";

const VALID_COUPONS: Record<string, { discountPercent: number; minCart: number }> = {
  FIRSTORDER: { discountPercent: 15, minCart: 999 },
  SAVE10: { discountPercent: 10, minCart: 499 },
  FESTIVE25: { discountPercent: 25, minCart: 1999 },
};

export async function POST(request: Request) {
  try {
    const { code, cartSubtotal } = await request.json();

    if (!code) {
      return NextResponse.json(
        { success: false, error: "Coupon code is required" },
        { status: 400 }
      );
    }

    const upperCode = code.toUpperCase().trim();
    const coupon = VALID_COUPONS[upperCode];

    if (!coupon) {
      return NextResponse.json(
        { success: false, error: "Invalid coupon code" },
        { status: 404 }
      );
    }

    if (cartSubtotal < coupon.minCart) {
      return NextResponse.json(
        {
          success: false,
          error: `Minimum cart value for code ${upperCode} is ₹${coupon.minCart}`,
        },
        { status: 400 }
      );
    }

    const discountAmount = Math.round((cartSubtotal * coupon.discountPercent) / 100);

    return NextResponse.json({
      success: true,
      message: `Coupon ${upperCode} applied! (${coupon.discountPercent}% OFF)`,
      data: {
        code: upperCode,
        discountPercent: coupon.discountPercent,
        discountAmount,
      },
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message },
      { status: 500 }
    );
  }
}
