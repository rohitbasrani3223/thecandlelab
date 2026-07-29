import { NextResponse } from "next/server";
import { PRODUCTS } from "@/data/mock";

// GET /api/products
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get("category");
  const search = searchParams.get("search");
  const sort = searchParams.get("sort");
  const filter = searchParams.get("filter");

  let products = [...PRODUCTS];

  if (filter === "new") products = products.filter((p) => p.isNewArrival);
  if (filter === "bestsellers") products = products.filter((p) => p.isBestSeller);
  if (filter === "trending") products = products.filter((p) => p.isTrending);

  if (category) {
    products = products.filter((p) => p.category.id === category || p.category.slug === category);
  }

  if (search) {
    const q = search.toLowerCase();
    products = products.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.fragrance?.toLowerCase().includes(q)
    );
  }

  if (sort === "price_asc") products.sort((a, b) => a.price - b.price);
  if (sort === "price_desc") products.sort((a, b) => b.price - a.price);
  if (sort === "rating") products.sort((a, b) => b.rating - a.rating);

  return NextResponse.json({
    success: true,
    count: products.length,
    data: products,
  });
}

// POST /api/products (Admin)
export async function POST(request: Request) {
  try {
    const body = await request.json();
    if (!body.name || !body.price) {
      return NextResponse.json(
        { success: false, error: "Product name and price are required" },
        { status: 400 }
      );
    }

    const newProduct = {
      id: `prod-${Date.now()}`,
      name: body.name,
      slug: body.name.toLowerCase().replace(/ /g, "-"),
      description: body.description || "",
      shortDescription: body.shortDescription || "",
      price: Number(body.price),
      originalPrice: Number(body.originalPrice || body.price),
      category: body.category || { id: "cat-1", name: "Single Candles", slug: "single-candles" },
      images: body.images || ["https://images.unsplash.com/photo-1603006905003-be475563bc59?w=800"],
      thumbnail: body.thumbnail || "https://images.unsplash.com/photo-1603006905003-be475563bc59?w=600",
      rating: 5.0,
      reviewCount: 0,
      stock: Number(body.stock || 10),
      isFeatured: Boolean(body.isFeatured),
      isBestSeller: Boolean(body.isBestSeller),
      isNewArrival: true,
      isTrending: false,
      fragrance: body.fragrance || "",
      burnTime: body.burnTime || "50 hours",
      waxType: body.waxType || "100% Natural Soy Wax",
      size: body.size || "250g",
      weight: Number(body.weight || 400),
      sku: body.sku || `TCL-${Date.now().toString().slice(-4)}`,
      tags: body.tags || ["candle", "luxury"],
      createdAt: new Date().toISOString(),
    };

    return NextResponse.json(
      { success: true, message: "Product created successfully", data: newProduct },
      { status: 201 }
    );
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || "Failed to create product" },
      { status: 500 }
    );
  }
}
