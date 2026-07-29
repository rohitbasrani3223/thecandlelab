<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Customer;
use App\Models\Order;
use App\Models\Product;
use Illuminate\Http\Request;

class DashboardController extends Controller
{
    public function stats()
    {
        $totalOrders = Order::count();
        $totalRevenue = Order::where('payment_status', 'PAID')->sum('total_amount');
        $totalProducts = Product::count();
        $totalCustomers = Customer::count();

        return response()->json([
            'success' => true,
            'data' => [
                'totalOrders' => $totalOrders,
                'totalRevenue' => (float) $totalRevenue,
                'totalProducts' => $totalProducts,
                'totalCustomers' => $totalCustomers,
            ],
        ]);
    }

    public function revenue()
    {
        // Monthly or weekly aggregation mock / query
        return response()->json([
            'success' => true,
            'data' => [
                'labels' => ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
                'revenue' => [12000, 19000, 15000, 22000, 28000, 35000, 42000],
            ],
        ]);
    }
}
