<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Product;
use App\Models\ProductImage;
use App\Models\ProductVariant;
use App\Models\Inventory;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class ProductController extends Controller
{
    public function index(Request $request)
    {
        $size = $request->get('size', 50);
        $products = Product::with(['subCategory', 'collection', 'images', 'variants.inventory'])
            ->latest()
            ->paginate($size);

        return response()->json([
            'success' => true,
            'data' => $products,
        ]);
    }

    public function show($id)
    {
        $product = Product::with(['subCategory', 'collection', 'images', 'variants.inventory'])->findOrFail($id);

        return response()->json([
            'success' => true,
            'data' => $product,
        ]);
    }

    public function publicIndex(Request $request)
    {
        $products = Product::with(['subCategory', 'images', 'variants'])
            ->where('status', 'ACTIVE')
            ->latest()
            ->get();

        return response()->json([
            'success' => true,
            'data' => $products,
        ]);
    }

    public function publicShow($slug)
    {
        $product = Product::with(['subCategory', 'collection', 'images', 'variants'])
            ->where('slug', $slug)
            ->where('status', 'ACTIVE')
            ->firstOrFail();

        return response()->json([
            'success' => true,
            'data' => $product,
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:500',
        ]);

        $product = Product::create([
            'name' => $request->name,
            'slug' => $request->slug ?? Str::slug($request->name),
            'description' => $request->description,
            'short_description' => $request->short_description,
            'sub_category_id' => $request->sub_category_id,
            'collection_id' => $request->collection_id,
            'weight_grams' => $request->weight_grams ?? 1000,
            'is_featured' => $request->is_featured ?? false,
            'is_bestseller' => $request->is_bestseller ?? $request->is_best_seller ?? false,
            'is_new_arrival' => $request->is_new_arrival ?? false,
            'is_trending' => $request->is_trending ?? false,
            'meta_title' => $request->meta_title,
            'meta_description' => $request->meta_description,
            'status' => $request->status ?? 'ACTIVE',
        ]);

        // Default variant
        $variant = ProductVariant::create([
            'product_id' => $product->id,
            'sku' => $request->sku ?? 'SKU-' . strtoupper(Str::random(6)),
            'title' => 'Default',
            'mrp' => $request->mrp ?? 999.00,
            'selling_price' => $request->selling_price ?? 799.00,
            'is_default' => true,
        ]);

        // Default inventory
        Inventory::create([
            'variant_id' => $variant->id,
            'quantity' => $request->quantity ?? 100,
            'sku' => $variant->sku,
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Product created successfully',
            'data' => $product->load(['images', 'variants.inventory']),
        ], 201);
    }

    public function update(Request $request, $id)
    {
        $product = Product::findOrFail($id);

        $product->update($request->only([
            'name',
            'slug',
            'description',
            'short_description',
            'sub_category_id',
            'collection_id',
            'weight_grams',
            'is_featured',
            'is_bestseller',
            'is_new_arrival',
            'is_trending',
            'meta_title',
            'meta_description',
            'status',
        ]));

        return response()->json([
            'success' => true,
            'message' => 'Product updated successfully',
            'data' => $product,
        ]);
    }

    public function updateStatus(Request $request, $id)
    {
        $product = Product::findOrFail($id);
        $product->update(['status' => $request->status]);

        return response()->json([
            'success' => true,
            'message' => 'Status updated successfully',
            'data' => $product,
        ]);
    }

    public function destroy($id)
    {
        $product = Product::findOrFail($id);
        $product->delete();

        return response()->json([
            'success' => true,
            'message' => 'Product deleted successfully',
        ]);
    }
}
