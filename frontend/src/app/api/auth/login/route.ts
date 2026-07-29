import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { success: false, error: "Email and password are required" },
        { status: 400 }
      );
    }

    // Mock successful authentication
    const user = {
      id: "user-101",
      name: email.split("@")[0],
      email,
      role: email.includes("admin") ? "admin" : "customer",
      token: `tcl_jwt_${Date.now()}`,
    };

    return NextResponse.json({
      success: true,
      message: "Login successful",
      data: user,
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message },
      { status: 500 }
    );
  }
}
