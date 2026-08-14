<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\SubCategory;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class SubCategoryController extends Controller
{
    public function index()
    {
        $subCategories = SubCategory::with('mainCategory')->withCount('products')->orderBy('sort_order')->get();

        return response()->json([
            'success' => true,
            'data' => $subCategories,
        ]);
    }

    public function publicIndex()
    {
        $subCategories = SubCategory::with('mainCategory')
            ->where('is_active', true)
            ->orderBy('sort_order')
            ->get();

        return response()->json([
            'success' => true,
            'data' => $subCategories,
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'main_category_id' => 'required',
            'name' => 'required|string|max:200',
        ]);

        $subCategory = SubCategory::create([
            'main_category_id' => $request->main_category_id,
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
            'message' => 'Subcategory created successfully',
            'data' => $subCategory->load('mainCategory'),
        ], 201);
    }

    public function show($id)
    {
        $subCategory = SubCategory::with(['mainCategory', 'products'])->findOrFail($id);

        return response()->json([
            'success' => true,
            'data' => $subCategory,
        ]);
    }

    public function update(Request $request, $id)
    {
        $subCategory = SubCategory::findOrFail($id);

        $subCategory->update($request->only([
            'main_category_id',
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
            'message' => 'Subcategory updated successfully',
            'data' => $subCategory->load('mainCategory'),
        ]);
    }

    public function destroy($id)
    {
        $subCategory = SubCategory::findOrFail($id);

        $productCount = Product::where('sub_category_id', $id)->count();
        if ($productCount > 0) {
            return response()->json([
                'success' => false,
                'message' => "Cannot delete subcategory '{$subCategory->name}' because it contains {$productCount} product(s). Reassign products before deleting.",
            ], 422);
        }

        $subCategory->delete();

        return response()->json([
            'success' => true,
            'message' => 'Subcategory deleted successfully',
        ]);
    }
}
