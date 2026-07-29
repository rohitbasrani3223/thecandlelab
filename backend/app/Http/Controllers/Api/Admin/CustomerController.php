<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Customer;
use Illuminate\Http\Request;

class CustomerController extends Controller
{
    public function index(Request $request)
    {
        $size = $request->get('size', 50);
        $customers = Customer::latest()->paginate($size);

        return response()->json([
            'success' => true,
            'data' => $customers,
        ]);
    }

    public function show($id)
    {
        $customer = Customer::with('addresses')->findOrFail($id);

        return response()->json([
            'success' => true,
            'data' => $customer,
        ]);
    }
}
