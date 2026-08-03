<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\ProductController;
use App\Http\Controllers\Api\OrderController;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\PaymentController;

/*
|--------------------------------------------------------------------------
| The Candle Lab REST API Routes (Laravel 11 / Sanctum API)
|--------------------------------------------------------------------------
*/

// Health Check Endpoint
Route::get('/health', function () {
    return response()->json([
        'status' => 'ok',
        'service' => 'The Candle Lab Laravel API',
        'database' => 'Supabase PostgreSQL',
        'timestamp' => now()->toIso8601String()
    ]);
});

// Razorpay Standard Checkout Endpoints
Route::post('/create-order', [PaymentController::class, 'createOrder']);
Route::post('/verify-payment', [PaymentController::class, 'verifyPayment']);
Route::post('/razorpay/create-order', [PaymentController::class, 'createOrder']);
Route::post('/razorpay/verify-payment', [PaymentController::class, 'verifyPayment']);

// Products API
Route::get('/products', [ProductController::class, 'index']);
Route::get('/products/{id}', [ProductController::class, 'show']);
Route::post('/products', [ProductController::class, 'store']);
Route::patch('/products/{id}', [ProductController::class, 'update']);
Route::put('/products/{id}', [ProductController::class, 'update']);
Route::delete('/products/{id}', [ProductController::class, 'destroy']);

// Categories & Collections API
Route::get('/categories', function () {
    return response()->json([
        'success' => true,
        'data' => [
            ['id' => 'cat-1', 'name' => 'Aromatherapy & Wellness', 'slug' => 'aromatherapy-wellness'],
            ['id' => 'cat-2', 'name' => 'Floral & Botanical', 'slug' => 'floral-botanical'],
            ['id' => 'cat-3', 'name' => 'Gourmand & Vanilla', 'slug' => 'gourmand-vanilla'],
            ['id' => 'cat-4', 'name' => 'Woody & Resinous Oud', 'slug' => 'woody-resinous-oud'],
        ]
    ]);
});

Route::get('/collections', function () {
    return response()->json([
        'success' => true,
        'data' => [
            ['id' => 'col-1', 'name' => 'Scented Candles', 'slug' => 'scented-candles', 'icon' => '🕯️'],
            ['id' => 'col-2', 'name' => 'Floral Collection', 'slug' => 'floral-collection', 'icon' => '🌸'],
            ['id' => 'col-3', 'name' => 'Vanilla Collection', 'slug' => 'vanilla-collection', 'icon' => '🍦'],
            ['id' => 'col-4', 'name' => 'Coffee Collection', 'slug' => 'coffee-collection', 'icon' => '☕'],
            ['id' => 'col-5', 'name' => 'Festive Collection', 'slug' => 'festive-collection', 'icon' => '🌲'],
            ['id' => 'col-6', 'name' => 'Gift Boxes', 'slug' => 'gift-boxes', 'icon' => '🎁'],
            ['id' => 'col-7', 'name' => 'Luxury Glass Jars', 'slug' => 'luxury-glass-jars', 'icon' => '🕯️'],
            ['id' => 'col-8', 'name' => 'Wax Melts', 'slug' => 'wax-melts', 'icon' => '⚡'],
        ]
    ]);
});

// Enterprise Admin Panel & Storefront CMS API
Route::get('/admin/cms', function () {
    return response()->json([
        'success' => true,
        'data' => [
            'store_name' => 'The Candle Lab',
            'currency' => 'INR (₹)',
            'free_shipping_threshold' => 1499,
            'announcement' => [
                'text' => 'FREE SHIPPING ON ORDERS OVER ₹1,499 • USE CODE',
                'code' => 'LUXURY20',
                'discount' => 'FOR 20% OFF'
            ],
            'hero' => [
                'title' => 'Crafted for Serenity, Poured for Elegance',
                'subtitle' => 'Handcrafted luxury candles designed to fill your home with warmth, fragrance, and elegance.'
            ]
        ]
    ]);
});

Route::post('/admin/cms', function (Request $request) {
    return response()->json([
        'success' => true,
        'message' => 'CMS Configuration updated live successfully.'
    ]);
});

// Authentication API
Route::post('/auth/register', [AuthController::class, 'register']);
Route::post('/auth/login', [AuthController::class, 'login']);

Route::post('/auth/forgot-password', [AuthController::class, 'forgotPassword']);
Route::post('/auth/reset-password', [AuthController::class, 'forgotPassword']);
Route::post('/auth/verify-email', [AuthController::class, 'verifyEmail']);
Route::post('/auth/send-otp', [AuthController::class, 'sendOtp']);
Route::post('/auth/verify-otp', [AuthController::class, 'verifyOtp']);

Route::post('/auth/social', function (Request $request) {
    $provider = $request->input('provider', 'google');
    $name = $request->input('name', "Valued User ($provider)");
    $email = $request->input('email', "user.$provider@thecandlelab.com");
    $avatar = $request->input('avatar', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80');

    return response()->json([
        'success' => true,
        'message' => "Authenticated via $provider",
        'user' => [
            'id' => "usr_{$provider}_" . time(),
            'name' => $name,
            'email' => $email,
            'avatar' => $avatar,
            'isEmailVerified' => true,
            'isPhoneVerified' => false,
            'role' => 'customer',
            'createdAt' => now()->toIso8601String()
        ],
        'token' => 'laravel_token_social_' . time()
    ]);
});

// Orders API
Route::get('/orders', [OrderController::class, 'index']);
Route::post('/orders', [OrderController::class, 'store']);
Route::patch('/orders/{id}/status', [OrderController::class, 'updateStatus']);

// User Profile & Address Book API
Route::get('/user/addresses', function (Request $request) {
    return response()->json([
        'success' => true,
        'data' => []
    ]);
});

Route::post('/user/addresses', function (Request $request) {
    return response()->json([
        'success' => true,
        'message' => 'Address saved successfully.',
        'data' => $request->all()
    ]);
});

Route::post('/user/profile', function (Request $request) {
    return response()->json([
        'success' => true,
        'message' => 'Profile updated successfully.',
        'data' => $request->all()
    ]);
});

// Authenticated Routes (Sanctum protected)
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/auth/me', [AuthController::class, 'me']);
    Route::post('/auth/logout', [AuthController::class, 'logout']);
    Route::get('/user/orders', [OrderController::class, 'index']);
});
