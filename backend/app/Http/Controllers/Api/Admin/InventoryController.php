<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Inventory;
use Illuminate\Http\Request;

class InventoryController extends Controller
{
    public function index(Request $request)
    {
        $size = $request->get('size', 50);
        $inventory = Inventory::with('variant.product')->latest()->paginate($size);

        return response()->json([
            'success' => true,
            'data' => $inventory,
        ]);
    }

    public function update(Request $request, $id)
    {
        $inventory = Inventory::findOrFail($id);
        $inventory->update($request->only([
            'quantity',
            'reserved_quantity',
            'low_stock_threshold',
            'is_backorder_allowed',
        ]));

        return response()->json([
            'success' => true,
            'message' => 'Inventory updated successfully',
            'data' => $inventory,
        ]);
    }

    public function adjust(Request $request, $id)
    {
        $inventory = Inventory::findOrFail($id);
        $inventory->quantity = ($inventory->quantity ?? 0) + ($request->quantity ?? 0);
        $inventory->save();

        return response()->json([
            'success' => true,
            'message' => 'Quantity adjusted successfully',
            'data' => $inventory,
        ]);
    }
}
