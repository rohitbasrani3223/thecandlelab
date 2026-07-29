import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { name, email, phone, password } = await request.json();

    if (!name || !email || !password) {
      return NextResponse.json(
        { success: false, error: "Name, email, and password are required" },
        { status: 400 }
      );
    }

    const newUser = {
      id: `user-${Date.now()}`,
      name,
      email,
      phone: phone || "",
      role: "customer",
      token: `tcl_jwt_${Date.now()}`,
    };

    return NextResponse.json(
      {
        success: true,
        message: "Account created successfully",
        data: newUser,
      },
      { status: 201 }
    );
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message },
      { status: 500 }
    );
  }
}
