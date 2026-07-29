<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class ProductController extends Controller
{
    /**
     * Display a listing of products with filtering, search, and sorting.
     */
    public function index(Request $request)
    {
        $query = Product::with(['mainCategory', 'images', 'inventory'])->where('status', 'ACTIVE');

        if ($request->has('category')) {
            $query->whereHas('mainCategory', function ($q) use ($request) {
                $q->where('slug', $request->category)->orWhere('id', $request->category);
            });
        }

        if ($request->has('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('name', 'ILIKE', "%{$search}%")
                  ->orWhere('short_description', 'ILIKE', "%{$search}%")
                  ->orWhere('tagline', 'ILIKE', "%{$search}%");
            });
        }

        if ($request->filter === 'new') {
            $query->where('is_new_arrival', true);
        } elseif ($request->filter === 'bestsellers') {
            $query->where('is_bestseller', true);
        } elseif ($request->filter === 'trending') {
            $query->where('is_trending', true);
        }

        if ($request->sort === 'price_asc') {
            $query->orderBy('price', 'asc');
        } elseif ($request->sort === 'price_desc') {
            $query->orderBy('price', 'desc');
        } elseif ($request->sort === 'rating') {
            $query->orderBy('rating', 'desc');
        } else {
            $query->orderBy('reviews_count', 'desc');
        }

        $products = $query->paginate($request->get('per_page', 12));

        return response()->json([
            'success' => true,
            'data' => $products,
        ]);
    }

    /**
     * Display the specified product.
     */
    public function show($id)
    {
        $product = Product::with(['mainCategory', 'subCategory', 'collection', 'images', 'inventory'])
            ->where('id', $id)
            ->orWhere('slug', $id)
            ->firstOrFail();

        return response()->json([
            'success' => true,
            'data' => $product,
        ]);
    }

    /**
     * Store a newly created product (Admin).
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'price' => 'required|numeric|min:0',
            'main_category_id' => 'nullable|uuid',
            'short_description' => 'nullable|string',
            'wax_type' => 'nullable|string',
            'burn_time_hours' => 'nullable|integer',
        ]);

        $validated['id'] = (string) Str::uuid();
        $validated['slug'] = Str::slug($validated['name']) . '-' . Str::random(5);
        $validated['status'] = 'ACTIVE';

        $product = Product::create($validated);

        return response()->json([
            'success' => true,
            'message' => 'Product created successfully',
            'data' => $product,
        ], 201);
    }

    /**
     * Update the specified product (Admin).
     */
    public function update(Request $request, $id)
    {
        $product = Product::findOrFail($id);
        $product->update($request->all());

        return response()->json([
            'success' => true,
            'message' => 'Product updated successfully',
            'data' => $product,
        ]);
    }

    /**
     * Remove the specified product (Admin).
     */
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
