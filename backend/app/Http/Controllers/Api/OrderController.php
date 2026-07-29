<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class OrderController extends Controller
{
    /**
     * Display a listing of orders (Admin or Customer).
     */
    public function index(Request $request)
    {
        $query = Order::with('items');

        if ($request->user() && $request->user()->role !== 'admin') {
            $query->where('user_id', $request->user()->id);
        }

        if ($request->has('status')) {
            $query->where('status', $request->status);
        }

        $orders = $query->orderBy('created_at', 'desc')->paginate(15);

        return response()->json([
            'success' => true,
            'data' => $orders,
        ]);
    }

    /**
     * Store a newly created order with database transaction & stock decrement.
     */
    public function store(Request $request)
    {
        $request->validate([
            'items' => 'required|array|min:1',
            'items.*.product_id' => 'required',
            'items.*.quantity' => 'required|integer|min:1',
            'shipping_address' => 'required|array',
            'shipping_address.fullName' => 'required|string',
            'shipping_address.pincode' => 'required|string',
            'payment_method' => 'required|string',
        ]);

        return DB::transaction(function () use ($request) {
            $orderNumber = 'TCL' . strtoupper(Str::random(8));
            $subtotal = 0;
            $orderItemsData = [];

            foreach ($request->items as $item) {
                $product = Product::findOrFail($item['product_id']);
                
                if ($product->stock < $item['quantity']) {
                    throw new \Exception("Insufficient stock for product: {$product->name}");
                }

                $itemSubtotal = $product->price * $item['quantity'];
                $subtotal += $itemSubtotal;

                // Decrement stock
                $product->decrement('stock', $item['quantity']);

                $orderItemsData[] = [
                    'product_id' => $product->id,
                    'product_name' => $product->name,
                    'product_sku' => $product->sku ?? 'TCL-CANDLE',
                    'price' => $product->price,
                    'quantity' => $item['quantity'],
                    'subtotal' => $itemSubtotal,
                ];
            }

            $shippingFee = $subtotal >= 999 ? 0 : 99;
            $discountAmount = 0;

            if ($request->coupon_code === 'FIRSTORDER') {
                $discountAmount = round($subtotal * 0.15, 2);
            }

            $totalAmount = $subtotal + $shippingFee - $discountAmount;

            $order = Order::create([
                'order_number' => $orderNumber,
                'user_id' => $request->user()?->id,
                'customer_name' => $request->shipping_address['fullName'],
                'customer_email' => $request->shipping_address['email'] ?? $request->user()?->email ?? 'guest@example.com',
                'customer_phone' => $request->shipping_address['phone'] ?? '9876543210',
                'subtotal' => $subtotal,
                'shipping_fee' => $shippingFee,
                'discount_amount' => $discountAmount,
                'total_amount' => $totalAmount,
                'status' => 'Processing',
                'payment_method' => $request->payment_method,
                'payment_status' => $request->payment_method === 'COD' ? 'Pending' : 'Paid',
                'shipping_address' => $request->shipping_address,
            ]);

            foreach ($orderItemsData as $itemData) {
                $order->items()->create($itemData);
            }

            return response()->json([
                'success' => true,
                'message' => 'Order placed successfully',
                'data' => $order->load('items'),
            ], 201);
        });
    }

    /**
     * Update order status (Admin).
     */
    public function updateStatus(Request $request, $id)
    {
        $request->validate([
            'status' => 'required|in:Processing,Shipped,Delivered,Cancelled',
        ]);

        $order = Order::findOrFail($id);
        $order->update(['status' => $request->status]);

        return response()->json([
            'success' => true,
            'message' => "Order status updated to {$request->status}",
            'data' => $order,
        ]);
    }
}
