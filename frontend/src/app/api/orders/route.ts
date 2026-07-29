import { NextResponse } from "next/server";

const MOCK_ORDERS_DB = [
  {
    id: "TCL91234567",
    customer: { name: "Priya Sharma", email: "priya@example.com", phone: "9876543210" },
    itemsCount: 2,
    subtotal: 2998,
    shippingFee: 0,
    discountAmount: 0,
    totalAmount: 2998,
    status: "Delivered",
    paymentMethod: "UPI",
    shippingAddress: {
      fullName: "Priya Sharma",
      addressLine1: "Flat 12B, Sunshine Apartments",
      city: "Mumbai",
      state: "Maharashtra",
      pincode: "400050",
    },
    createdAt: "2025-01-15T10:30:00Z",
  },
  {
    id: "TCL81234568",
    customer: { name: "Vikram Malhotra", email: "vikram@example.com", phone: "9812345678" },
    itemsCount: 1,
    subtotal: 1499,
    shippingFee: 99,
    discountAmount: 0,
    totalAmount: 1598,
    status: "Processing",
    paymentMethod: "Card",
    shippingAddress: {
      fullName: "Vikram Malhotra",
      addressLine1: "45 Golf Links",
      city: "Delhi",
      state: "Delhi",
      pincode: "110003",
    },
    createdAt: "2025-02-03T14:20:00Z",
  },
];

// GET /api/orders
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const status = searchParams.get("status");

  let orders = [...MOCK_ORDERS_DB];
  if (status) {
    orders = orders.filter((o) => o.status.toLowerCase() === status.toLowerCase());
  }

  return NextResponse.json({
    success: true,
    count: orders.length,
    data: orders,
  });
}

// POST /api/orders (Place Order)
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { items, shippingAddress, paymentMethod, couponCode } = body;

    if (!items || !items.length) {
      return NextResponse.json(
        { success: false, error: "Cart cannot be empty" },
        { status: 400 }
      );
    }

    if (!shippingAddress || !shippingAddress.fullName || !shippingAddress.pincode) {
      return NextResponse.json(
        { success: false, error: "Shipping address is incomplete" },
        { status: 400 }
      );
    }

    const orderId = `TCL${Date.now().toString().slice(-8)}`;
    const subtotal = items.reduce(
      (acc: number, item: any) => acc + (item.price || 1299) * (item.quantity || 1),
      0
    );
    const shippingFee = subtotal >= 999 ? 0 : 99;
    const discountAmount = couponCode === "FIRSTORDER" ? Math.round(subtotal * 0.15) : 0;
    const totalAmount = subtotal + shippingFee - discountAmount;

    const newOrder = {
      id: orderId,
      customer: {
        name: shippingAddress.fullName,
        email: shippingAddress.email || "guest@example.com",
        phone: shippingAddress.phone || "9876543210",
      },
      items,
      itemsCount: items.length,
      subtotal,
      shippingFee,
      discountAmount,
      totalAmount,
      status: "Processing",
      paymentMethod: paymentMethod || "UPI",
      shippingAddress,
      createdAt: new Date().toISOString(),
    };

    return NextResponse.json(
      {
        success: true,
        message: "Order placed successfully",
        data: newOrder,
      },
      { status: 201 }
    );
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || "Order placement failed" },
      { status: 500 }
    );
  }
}
