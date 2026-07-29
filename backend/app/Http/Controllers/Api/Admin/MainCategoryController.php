<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\MainCategory;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class MainCategoryController extends Controller
{
    public function index()
    {
        $categories = MainCategory::with('subCategories')->orderBy('sort_order')->get();

        return response()->json([
            'success' => true,
            'data' => $categories,
        ]);
    }

    public function publicIndex()
    {
        $categories = MainCategory::where('status', 'ACTIVE')->orderBy('sort_order')->get();

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
            'image' => $request->image,
            'icon' => $request->icon,
            'banner_desktop' => $request->banner_desktop,
            'banner_mobile' => $request->banner_mobile,
            'meta_title' => $request->meta_title,
            'meta_description' => $request->meta_description,
            'sort_order' => $request->sort_order ?? 0,
            'status' => $request->status ?? 'ACTIVE',
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Main category created successfully',
            'data' => $category,
        ], 201);
    }

    public function update(Request $request, $id)
    {
        $category = MainCategory::findOrFail($id);

        $category->update($request->only([
            'name',
            'slug',
            'image',
            'icon',
            'banner_desktop',
            'banner_mobile',
            'meta_title',
            'meta_description',
            'sort_order',
            'status',
        ]));

        return response()->json([
            'success' => true,
            'message' => 'Main category updated successfully',
            'data' => $category,
        ]);
    }

    public function updateStatus(Request $request, $id)
    {
        $category = MainCategory::findOrFail($id);
        $category->update(['status' => $request->status]);

        return response()->json([
            'success' => true,
            'message' => 'Status updated successfully',
            'data' => $category,
        ]);
    }

    public function destroy($id)
    {
        $category = MainCategory::findOrFail($id);
        $category->delete();

        return response()->json([
            'success' => true,
            'message' => 'Main category deleted successfully',
        ]);
    }
}
