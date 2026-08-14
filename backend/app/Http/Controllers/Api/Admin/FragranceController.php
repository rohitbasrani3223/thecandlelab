<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Fragrance;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class FragranceController extends Controller
{
    public function index()
    {
        $fragrances = Fragrance::orderBy('sort_order')->latest()->get();

        return response()->json([
            'success' => true,
            'data' => $fragrances,
        ]);
    }

    public function publicIndex()
    {
        $fragrances = Fragrance::where('is_active', true)->orderBy('sort_order')->get();

        return response()->json([
            'success' => true,
            'data' => $fragrances,
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
        ]);

        $fragrance = Fragrance::create([
            'name' => $request->name,
            'slug' => $request->slug ?? Str::slug($request->name),
            'image_url' => $request->image_url,
            'short_description' => $request->short_description,
            'scent_profile' => $request->scent_profile,
            'top_notes' => $request->top_notes,
            'heart_notes' => $request->heart_notes,
            'base_notes' => $request->base_notes,
            'scent_family' => $request->scent_family ?? 'Floral',
            'intensity' => $request->intensity ?? 'Medium',
            'is_active' => $request->is_active ?? true,
            'sort_order' => $request->sort_order ?? 0,
            'meta_title' => $request->meta_title,
            'meta_description' => $request->meta_description,
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Fragrance created successfully',
            'data' => $fragrance,
        ], 201);
    }

    public function show($id)
    {
        $fragrance = Fragrance::findOrFail($id);

        return response()->json([
            'success' => true,
            'data' => $fragrance,
        ]);
    }

    public function update(Request $request, $id)
    {
        $fragrance = Fragrance::findOrFail($id);

        $fragrance->update($request->only([
            'name',
            'slug',
            'image_url',
            'short_description',
            'scent_profile',
            'top_notes',
            'heart_notes',
            'base_notes',
            'scent_family',
            'intensity',
            'is_active',
            'sort_order',
            'meta_title',
            'meta_description',
        ]));

        return response()->json([
            'success' => true,
            'message' => 'Fragrance updated successfully',
            'data' => $fragrance,
        ]);
    }

    public function destroy($id)
    {
        $fragrance = Fragrance::findOrFail($id);
        $fragrance->delete();

        return response()->json([
            'success' => true,
            'message' => 'Fragrance deleted successfully',
        ]);
    }
}
