<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Product;
use App\Models\ProductImage;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Str;

class ProductController extends Controller
{
    private array $productColumns = [
        'name',
        'slug',
        'tagline',
        'sku',
        'price',
        'original_price',
        'image_url',
        'thumbnail',
        'short_description',
        'long_description',
        'description',
        'wax_type',
        'wick_type',
        'burn_time',
        'burn_time_hours',
        'weight',
        'weight_grams',
        'fragrance',
        'rating',
        'review_count',
        'reviews_count',
        'stock',
        'status',
        'is_active',
        'is_featured',
        'is_bestseller',
        'is_new_arrival',
        'is_trending',
        'top_notes',
        'heart_notes',
        'base_notes',
    ];

    private function productPayload(Request $request): array
    {
        return collect($request->only($this->productColumns))
            ->filter(fn ($value, $key) => Schema::hasColumn('products', $key))
            ->all();
    }

    private function imageUrlsFromRequest(Request $request): array
    {
        $urls = [];

        if ($request->filled('image_url')) {
            $urls[] = $request->input('image_url');
        }

        if ($request->filled('thumbnail')) {
            $urls[] = $request->input('thumbnail');
        }

        if (is_array($request->input('images'))) {
            $urls = array_merge($urls, $request->input('images'));
        }

        return collect($urls)
            ->filter(fn ($url) => is_string($url) && trim($url) !== '')
            ->unique()
            ->values()
            ->all();
    }

    private function syncProductImages(Product $product, array $imageUrls): void
    {
        if (count($imageUrls) === 0 || !Schema::hasTable('product_images')) {
            return;
        }

        ProductImage::where('product_id', $product->id)->delete();

        foreach ($imageUrls as $index => $imageUrl) {
            ProductImage::create([
                'product_id' => $product->id,
                'image_url' => $imageUrl,
                'alt_text' => $product->name,
                'sort_order' => $index + 1,
                'is_primary' => $index === 0,
            ]);
        }
    }

    private function productWithImages(Product $product): Product
    {
        return Schema::hasTable('product_images') ? $product->load('images') : $product;
    }

    private function freshProductWithImages(Product $product): Product
    {
        $freshProduct = $product->fresh();
        return $freshProduct ? $this->productWithImages($freshProduct) : $product;
    }

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
        ]);

        $payload = array_merge($validated, $this->productPayload($request));

        if (Schema::hasColumn('products', 'id') && !in_array(Schema::getColumnType('products', 'id'), ['integer', 'bigint'], true)) {
            $payload['id'] = $payload['id'] ?? (string) Str::uuid();
        }

        if (Schema::hasColumn('products', 'slug')) {
            $payload['slug'] = $payload['slug'] ?? Str::slug($validated['name']) . '-' . Str::random(5);
        }

        if (Schema::hasColumn('products', 'status')) {
            $payload['status'] = $payload['status'] ?? 'ACTIVE';
        }

        if (Schema::hasColumn('products', 'is_active')) {
            $payload['is_active'] = $payload['is_active'] ?? true;
        }

        $product = Product::create($payload);
        $this->syncProductImages($product, $this->imageUrlsFromRequest($request));

        return response()->json([
            'success' => true,
            'message' => 'Product created successfully',
            'data' => $this->productWithImages($product),
        ], 201);
    }

    /**
     * Update the specified product (Admin).
     */
    public function update(Request $request, $id)
    {
        $product = Product::findOrFail($id);
        $payload = $this->productPayload($request);

        if (!empty($payload)) {
            $product->update($payload);
        }

        $this->syncProductImages($product, $this->imageUrlsFromRequest($request));

        return response()->json([
            'success' => true,
            'message' => 'Product updated successfully',
            'data' => $this->freshProductWithImages($product),
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
