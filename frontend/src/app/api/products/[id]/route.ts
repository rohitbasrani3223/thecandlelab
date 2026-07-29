import { NextResponse } from "next/server";
import { PRODUCTS } from "@/data/mock";

interface Props {
  params: Promise<{ id: string }>;
}

// GET /api/products/[id]
export async function GET(request: Request, { params }: Props) {
  const { id } = await params;
  const product = PRODUCTS.find((p) => p.id === id || p.slug === id);

  if (!product) {
    return NextResponse.json(
      { success: false, error: "Product not found" },
      { status: 404 }
    );
  }

  return NextResponse.json({ success: true, data: product });
}

// PUT /api/products/[id] (Admin Edit)
export async function PUT(request: Request, { params }: Props) {
  const { id } = await params;
  try {
    const body = await request.json();
    const productIndex = PRODUCTS.findIndex((p) => p.id === id);

    if (productIndex === -1) {
      return NextResponse.json(
        { success: false, error: "Product not found" },
        { status: 404 }
      );
    }

    const updatedProduct = {
      ...PRODUCTS[productIndex],
      ...body,
      updatedAt: new Date().toISOString(),
    };

    return NextResponse.json({
      success: true,
      message: "Product updated successfully",
      data: updatedProduct,
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message },
      { status: 500 }
    );
  }
}

// DELETE /api/products/[id] (Admin Delete)
export async function DELETE(request: Request, { params }: Props) {
  const { id } = await params;
  const productIndex = PRODUCTS.findIndex((p) => p.id === id);

  if (productIndex === -1) {
    return NextResponse.json(
      { success: false, error: "Product not found" },
      { status: 404 }
    );
  }

  return NextResponse.json({
    success: true,
    message: `Product ${id} deleted successfully`,
  });
}
