<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Collection;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class CollectionController extends Controller
{
    public function index()
    {
        $collections = Collection::orderBy('sort_order')->get();

        return response()->json([
            'success' => true,
            'data' => $collections,
        ]);
    }

    public function publicIndex()
    {
        $collections = Collection::where('status', 'ACTIVE')->orderBy('sort_order')->get();

        return response()->json([
            'success' => true,
            'data' => $collections,
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
            'image' => $request->image,
            'banner_desktop' => $request->banner_desktop,
            'banner_mobile' => $request->banner_mobile,
            'collection_type' => $request->collection_type ?? 'MANUAL',
            'meta_title' => $request->meta_title,
            'meta_description' => $request->meta_description,
            'sort_order' => $request->sort_order ?? 0,
            'status' => $request->status ?? 'ACTIVE',
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Collection created successfully',
            'data' => $collection,
        ], 201);
    }

    public function update(Request $request, $id)
    {
        $collection = Collection::findOrFail($id);

        $collection->update($request->only([
            'name',
            'slug',
            'description',
            'image',
            'banner_desktop',
            'banner_mobile',
            'collection_type',
            'meta_title',
            'meta_description',
            'sort_order',
            'status',
        ]));

        return response()->json([
            'success' => true,
            'message' => 'Collection updated successfully',
            'data' => $collection,
        ]);
    }

    public function destroy($id)
    {
        $collection = Collection::findOrFail($id);
        $collection->delete();

        return response()->json([
            'success' => true,
            'message' => 'Collection deleted successfully',
        ]);
    }
}
