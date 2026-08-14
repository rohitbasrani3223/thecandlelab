<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\MainCategory;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class MainCategoryController extends Controller
{
    public function index()
    {
        $categories = MainCategory::with(['subCategories'])->withCount('products')->orderBy('sort_order')->get();

        return response()->json([
            'success' => true,
            'data' => $categories,
        ]);
    }

    public function publicIndex()
    {
        $categories = MainCategory::with(['subCategories' => function ($q) {
            $q->where('is_active', true)->orderBy('sort_order');
        }])
        ->withCount(['products' => function ($q) {
            $q->where('status', 'ACTIVE');
        }])
        ->where('is_active', true)
        ->orderBy('sort_order')
        ->get();

        return response()->json([
            'success' => true,
            'data' => $categories,
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:200',
        ]);

        $category = MainCategory::create([
            'name' => $request->name,
            'slug' => $request->slug ?? Str::slug($request->name),
            'description' => $request->description,
            'image_url' => $request->image_url,
            'banner_desktop' => $request->banner_desktop,
            'banner_mobile' => $request->banner_mobile,
            'meta_title' => $request->meta_title,
            'meta_description' => $request->meta_description,
            'sort_order' => $request->sort_order ?? 0,
            'is_active' => $request->is_active ?? true,
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Main category created successfully',
            'data' => $category->load('subCategories'),
        ], 201);
    }

    public function show($id)
    {
        $category = MainCategory::with(['subCategories', 'products'])->findOrFail($id);

        return response()->json([
            'success' => true,
            'data' => $category,
        ]);
    }

    public function update(Request $request, $id)
    {
        $category = MainCategory::findOrFail($id);

        $category->update($request->only([
            'name',
            'slug',
            'description',
            'image_url',
            'banner_desktop',
            'banner_mobile',
            'meta_title',
            'meta_description',
            'sort_order',
            'is_active',
        ]));

        return response()->json([
            'success' => true,
            'message' => 'Main category updated successfully',
            'data' => $category->load('subCategories'),
        ]);
    }

    public function destroy($id)
    {
        $category = MainCategory::findOrFail($id);

        $productCount = Product::where('main_category_id', $id)->count();
        if ($productCount > 0) {
            return response()->json([
                'success' => false,
                'message' => "Cannot delete category '{$category->name}' because it contains {$productCount} product(s). Reassign products before deleting.",
            ], 422);
        }

        $category->delete();

        return response()->json([
            'success' => true,
            'message' => 'Main category deleted successfully',
        ]);
    }
}
