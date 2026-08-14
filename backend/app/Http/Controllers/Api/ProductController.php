<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Product;
use App\Models\ProductImage;
use App\Models\ProductVariant;
use App\Models\Inventory;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class ProductController extends Controller
{
    /**
     * Display a listing of products with filtering, search, and sorting.
     */
    public function index(Request $request)
    {
        $query = Product::with(['mainCategory', 'subCategory', 'collections', 'images', 'variants.inventory'])
            ->where('status', 'ACTIVE');

        // Filter by Main Category
        if ($request->filled('category')) {
            $cat = $request->category;
            $query->where(function ($q) use ($cat) {
                $q->where('main_category_id', $cat)
                  ->orWhereHas('mainCategory', function ($mq) use ($cat) {
                      $mq->where('slug', $cat)->orWhere('name', $cat);
                  });
            });
        }

        // Filter by Sub Category
        if ($request->filled('sub_category')) {
            $subCat = $request->sub_category;
            $query->where(function ($q) use ($subCat) {
                $q->where('sub_category_id', $subCat)
                  ->orWhereHas('subCategory', function ($sq) use ($subCat) {
                      $sq->where('slug', $subCat)->orWhere('name', $subCat);
                  });
            });
        }

        // Filter by Collection
        if ($request->filled('collection')) {
            $col = $request->collection;
            $query->whereHas('collections', function ($q) use ($col) {
                $q->where('collections.id', $col)
                  ->orWhere('collections.slug', $col)
                  ->orWhere('collections.name', $col);
            });
        }

        // Filter by Fragrance
        if ($request->filled('fragrance')) {
            $frag = $request->fragrance;
            $query->where(function ($q) use ($frag) {
                $q->where('scent_profile', 'ILIKE', "%{$frag}%")
                  ->orWhere('top_notes', 'ILIKE', "%{$frag}%")
                  ->orWhereHas('variants', function ($vq) use ($frag) {
                      $vq->where('fragrance_name', 'ILIKE', "%{$frag}%");
                  });
            });
        }

        // Filter by Size
        if ($request->filled('size')) {
            $size = $request->size;
            $query->whereHas('variants', function ($q) use ($size) {
                $q->where('size_name', 'ILIKE', "%{$size}%");
            });
        }

        // Filter by Color
        if ($request->filled('color')) {
            $color = $request->color;
            $query->whereHas('variants', function ($q) use ($color) {
                $q->where('color_name', 'ILIKE', "%{$color}%");
            });
        }

        // Price range filters
        if ($request->filled('price_min')) {
            $query->where('price', '>=', (float) $request->price_min);
        }
        if ($request->filled('price_max')) {
            $query->where('price', '<=', (float) $request->price_max);
        }

        // In-stock only filter
        if ($request->boolean('in_stock')) {
            $query->where('status', 'ACTIVE');
        }

        // Minimum Rating filter
        if ($request->filled('min_rating')) {
            $query->where('rating', '>=', (float) $request->min_rating);
        }

        // Global Search across name, short_description, tagline, top_notes, scent_profile, category, and tags
        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('name', 'ILIKE', "%{$search}%")
                  ->orWhere('short_description', 'ILIKE', "%{$search}%")
                  ->orWhere('tagline', 'ILIKE', "%{$search}%")
                  ->orWhere('scent_profile', 'ILIKE', "%{$search}%")
                  ->orWhere('top_notes', 'ILIKE', "%{$search}%")
                  ->orWhere('sku', 'ILIKE', "%{$search}%")
                  ->orWhereHas('mainCategory', function ($cq) use ($search) {
                      $cq->where('name', 'ILIKE', "%{$search}%");
                  })
                  ->orWhereHas('collections', function ($clq) use ($search) {
                      $clq->where('name', 'ILIKE', "%{$search}%");
                  });
            });
        }

        // Merchandising filter flags
        if ($request->filter === 'new' || $request->boolean('is_new')) {
            $query->where('is_new_arrival', true);
        } elseif ($request->filter === 'bestsellers' || $request->boolean('is_bestseller')) {
            $query->where('is_bestseller', true);
        } elseif ($request->filter === 'trending' || $request->boolean('is_trending')) {
            $query->where('is_trending', true);
        } elseif ($request->filter === 'featured' || $request->boolean('is_featured')) {
            $query->where('is_featured', true);
        }

        // Sorting
        $sort = $request->get('sort', 'featured');
        switch ($sort) {
            case 'price_asc':
            case 'price-asc':
                $query->orderBy('price', 'asc');
                break;
            case 'price_desc':
            case 'price-desc':
                $query->orderBy('price', 'desc');
                break;
            case 'rating':
                $query->orderBy('rating', 'desc');
                break;
            case 'newest':
                $query->latest();
                break;
            case 'bestselling':
                $query->orderBy('is_bestseller', 'desc')->orderBy('reviews_count', 'desc');
                break;
            default:
                $query->orderBy('is_featured', 'desc')->latest();
                break;
        }

        $perPage = (int) $request->get('per_page', 24);
        $products = $query->paginate($perPage);

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
        $product = Product::with(['mainCategory', 'subCategory', 'collections', 'images', 'variants.inventory'])
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

        $product = Product::create($request->all());

        // Sync Gallery Images
        if ($request->has('images') && is_array($request->images)) {
            foreach ($request->images as $index => $imgUrl) {
                if ($imgUrl) {
                    ProductImage::create([
                        'product_id' => $product->id,
                        'image_url' => $imgUrl,
                        'is_primary' => $index === 0,
                        'sort_order' => $index,
                        'alt_text' => $product->name,
                    ]);
                }
            }
        }

        // Sync Collections
        if ($request->has('collection_ids') && is_array($request->collection_ids)) {
            $product->collections()->sync($request->collection_ids);
        }

        // Sync Variants if provided
        if ($request->has('variants') && is_array($request->variants)) {
            foreach ($request->variants as $varData) {
                $variant = ProductVariant::create(array_merge($varData, ['product_id' => $product->id]));
                if (isset($varData['stock'])) {
                    Inventory::create([
                        'product_id' => $product->id,
                        'variant_id' => $variant->id,
                        'stock_quantity' => $varData['stock'],
                        'status' => $varData['stock'] > 0 ? 'IN_STOCK' : 'OUT_OF_STOCK',
                    ]);
                }
            }
        }

        return response()->json([
            'success' => true,
            'message' => 'Product created successfully',
            'data' => $product->load(['mainCategory', 'subCategory', 'collections', 'images', 'variants']),
        ], 201);
    }

    /**
     * Update the specified product (Admin).
     */
    public function update(Request $request, $id)
    {
        $product = Product::findOrFail($id);
        $product->update($request->all());

        // Sync Gallery Images if provided
        if ($request->has('images') && is_array($request->images)) {
            ProductImage::where('product_id', $product->id)->delete();
            foreach ($request->images as $index => $imgUrl) {
                if ($imgUrl) {
                    ProductImage::create([
                        'product_id' => $product->id,
                        'image_url' => $imgUrl,
                        'is_primary' => $index === 0,
                        'sort_order' => $index,
                        'alt_text' => $product->name,
                    ]);
                }
            }
        }

        // Sync Collections if provided
        if ($request->has('collection_ids') && is_array($request->collection_ids)) {
            $product->collections()->sync($request->collection_ids);
        }

        // Sync Variants if provided
        if ($request->has('variants') && is_array($request->variants)) {
            ProductVariant::where('product_id', $product->id)->delete();
            foreach ($request->variants as $varData) {
                $variant = ProductVariant::create(array_merge($varData, ['product_id' => $product->id]));
                if (isset($varData['stock'])) {
                    Inventory::updateOrCreate(
                        ['variant_id' => $variant->id],
                        [
                            'product_id' => $product->id,
                            'stock_quantity' => $varData['stock'],
                            'status' => $varData['stock'] > 0 ? 'IN_STOCK' : 'OUT_OF_STOCK',
                        ]
                    );
                }
            }
        }

        return response()->json([
            'success' => true,
            'message' => 'Product updated successfully',
            'data' => $product->fresh(['mainCategory', 'subCategory', 'collections', 'images', 'variants.inventory']),
        ]);
    }

    /**
     * Remove the specified product (Admin).
     */
    public function destroy($id)
    {
        $product = Product::findOrFail($id);
        $product->collections()->detach();
        $product->delete();

        return response()->json([
            'success' => true,
            'message' => 'Product deleted successfully',
        ]);
    }
}
