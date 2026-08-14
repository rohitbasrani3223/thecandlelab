<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Collection;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class CollectionController extends Controller
{
    public function index()
    {
        $collections = Collection::withCount('products')->orderBy('sort_order')->get();

        return response()->json([
            'success' => true,
            'data' => $collections,
        ]);
    }

    public function publicIndex()
    {
        $collections = Collection::with(['products' => function ($q) {
            $q->where('status', 'ACTIVE')->with(['images', 'variants']);
        }])
        ->where('is_active', true)
        ->orderBy('sort_order')
        ->get();

        return response()->json([
            'success' => true,
            'data' => $collections,
        ]);
    }

    public function show($id)
    {
        $collection = Collection::with(['products.images', 'products.variants'])->findOrFail($id);

        return response()->json([
            'success' => true,
            'data' => $collection,
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:200',
        ]);

        $collection = Collection::create([
            'name' => $request->name,
            'slug' => $request->slug ?? Str::slug($request->name),
            'description' => $request->description,
            'banner_image' => $request->banner_image,
            'image_url' => $request->image_url,
            'icon_symbol' => $request->icon_symbol ?? '✨',
            'collection_type' => $request->collection_type ?? 'MANUAL',
            'rule_conditions' => $request->rule_conditions,
            'meta_title' => $request->meta_title,
            'meta_description' => $request->meta_description,
            'is_featured' => $request->is_featured ?? true,
            'is_active' => $request->is_active ?? true,
            'sort_order' => $request->sort_order ?? 0,
        ]);

        if ($request->has('product_ids') && is_array($request->product_ids)) {
            $collection->products()->sync($request->product_ids);
        }

        return response()->json([
            'success' => true,
            'message' => 'Collection created successfully',
            'data' => $collection->load('products'),
        ], 201);
    }

    public function update(Request $request, $id)
    {
        $collection = Collection::findOrFail($id);

        $collection->update($request->only([
            'name',
            'slug',
            'description',
            'banner_image',
            'image_url',
            'icon_symbol',
            'collection_type',
            'rule_conditions',
            'meta_title',
            'meta_description',
            'is_featured',
            'is_active',
            'sort_order',
        ]));

        if ($request->has('product_ids') && is_array($request->product_ids)) {
            $collection->products()->sync($request->product_ids);
        }

        return response()->json([
            'success' => true,
            'message' => 'Collection updated successfully',
            'data' => $collection->load('products'),
        ]);
    }

    public function assignProducts(Request $request, $id)
    {
        $collection = Collection::findOrFail($id);
        $request->validate(['product_ids' => 'required|array']);

        $collection->products()->sync($request->product_ids);

        return response()->json([
            'success' => true,
            'message' => 'Products assigned to collection successfully',
            'data' => $collection->load('products'),
        ]);
    }

    public function destroy($id)
    {
        $collection = Collection::findOrFail($id);
        $collection->products()->detach();
        $collection->delete();

        return response()->json([
            'success' => true,
            'message' => 'Collection deleted successfully',
        ]);
    }
}
