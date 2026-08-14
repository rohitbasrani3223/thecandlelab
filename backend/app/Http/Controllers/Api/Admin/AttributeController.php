<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\ProductSize;
use App\Models\ProductColor;
use App\Models\WickType;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class AttributeController extends Controller
{
    // Sizes
    public function getSizes()
    {
        return response()->json([
            'success' => true,
            'data' => ProductSize::orderBy('sort_order')->get(),
        ]);
    }

    public function storeSize(Request $request)
    {
        $request->validate(['name' => 'required|string|max:100']);
        $size = ProductSize::create([
            'name' => $request->name,
            'slug' => $request->slug ?? Str::slug($request->name),
            'unit' => $request->unit ?? 'g',
            'value' => $request->value ?? 100,
            'is_active' => $request->is_active ?? true,
            'sort_order' => $request->sort_order ?? 0,
        ]);
        return response()->json(['success' => true, 'message' => 'Size created', 'data' => $size], 201);
    }

    public function updateSize(Request $request, $id)
    {
        $size = ProductSize::findOrFail($id);
        $size->update($request->only(['name', 'slug', 'unit', 'value', 'is_active', 'sort_order']));
        return response()->json(['success' => true, 'message' => 'Size updated', 'data' => $size]);
    }

    public function destroySize($id)
    {
        $size = ProductSize::findOrFail($id);
        $size->delete();
        return response()->json(['success' => true, 'message' => 'Size deleted']);
    }

    // Colors
    public function getColors()
    {
        return response()->json([
            'success' => true,
            'data' => ProductColor::orderBy('sort_order')->get(),
        ]);
    }

    public function storeColor(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:100',
            'hex_code' => 'required|string|max:20',
        ]);
        $color = ProductColor::create([
            'name' => $request->name,
            'hex_code' => $request->hex_code,
            'swatch_image' => $request->swatch_image,
            'is_active' => $request->is_active ?? true,
            'sort_order' => $request->sort_order ?? 0,
        ]);
        return response()->json(['success' => true, 'message' => 'Color created', 'data' => $color], 201);
    }

    public function updateColor(Request $request, $id)
    {
        $color = ProductColor::findOrFail($id);
        $color->update($request->only(['name', 'hex_code', 'swatch_image', 'is_active', 'sort_order']));
        return response()->json(['success' => true, 'message' => 'Color updated', 'data' => $color]);
    }

    public function destroyColor($id)
    {
        $color = ProductColor::findOrFail($id);
        $color->delete();
        return response()->json(['success' => true, 'message' => 'Color deleted']);
    }

    // Wick Types
    public function getWickTypes()
    {
        return response()->json([
            'success' => true,
            'data' => WickType::orderBy('sort_order')->get(),
        ]);
    }

    public function storeWickType(Request $request)
    {
        $request->validate(['name' => 'required|string|max:100']);
        $wick = WickType::create([
            'name' => $request->name,
            'description' => $request->description,
            'additional_price' => $request->additional_price ?? 0.00,
            'is_active' => $request->is_active ?? true,
            'sort_order' => $request->sort_order ?? 0,
        ]);
        return response()->json(['success' => true, 'message' => 'Wick type created', 'data' => $wick], 201);
    }

    public function updateWickType(Request $request, $id)
    {
        $wick = WickType::findOrFail($id);
        $wick->update($request->only(['name', 'description', 'additional_price', 'is_active', 'sort_order']));
        return response()->json(['success' => true, 'message' => 'Wick type updated', 'data' => $wick]);
    }

    public function destroyWickType($id)
    {
        $wick = WickType::findOrFail($id);
        $wick->delete();
        return response()->json(['success' => true, 'message' => 'Wick type deleted']);
    }
}
