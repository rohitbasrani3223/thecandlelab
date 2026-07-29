<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\SubCategory;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class SubCategoryController extends Controller
{
    public function index()
    {
        $subCategories = SubCategory::with('mainCategory')->orderBy('sort_order')->get();

        return response()->json([
            'success' => true,
            'data' => $subCategories,
        ]);
    }

    public function publicIndex()
    {
        $subCategories = SubCategory::where('status', 'ACTIVE')->orderBy('sort_order')->get();

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
            'image' => $request->image,
            'banner_desktop' => $request->banner_desktop,
            'banner_mobile' => $request->banner_mobile,
            'meta_title' => $request->meta_title,
            'meta_description' => $request->meta_description,
            'sort_order' => $request->sort_order ?? 0,
            'status' => $request->status ?? 'ACTIVE',
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Subcategory created successfully',
            'data' => $subCategory,
        ], 201);
    }

    public function update(Request $request, $id)
    {
        $subCategory = SubCategory::findOrFail($id);

        $subCategory->update($request->only([
            'main_category_id',
            'name',
            'slug',
            'image',
            'banner_desktop',
            'banner_mobile',
            'meta_title',
            'meta_description',
            'sort_order',
            'status',
        ]));

        return response()->json([
            'success' => true,
            'message' => 'Subcategory updated successfully',
            'data' => $subCategory,
        ]);
    }

    public function updateStatus(Request $request, $id)
    {
        $subCategory = SubCategory::findOrFail($id);
        $subCategory->update(['status' => $request->status]);

        return response()->json([
            'success' => true,
            'message' => 'Status updated successfully',
            'data' => $subCategory,
        ]);
    }

    public function destroy($id)
    {
        $subCategory = SubCategory::findOrFail($id);
        $subCategory->delete();

        return response()->json([
            'success' => true,
            'message' => 'Subcategory deleted successfully',
        ]);
    }
}
