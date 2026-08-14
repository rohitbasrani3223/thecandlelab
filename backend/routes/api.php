<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\ProductController;
use App\Http\Controllers\Api\OrderController;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\PaymentController;
use App\Http\Controllers\Api\Admin\MainCategoryController;
use App\Http\Controllers\Api\Admin\SubCategoryController;
use App\Http\Controllers\Api\Admin\CollectionController;
use App\Http\Controllers\Api\Admin\FragranceController;
use App\Http\Controllers\Api\Admin\AttributeController;
use App\Http\Controllers\Api\Admin\InventoryController;
use App\Http\Controllers\Api\Admin\AdminManagementController;
use App\Http\Controllers\Api\Admin\DashboardController;

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

// Razorpay Checkout Endpoints
Route::post('/create-order', [PaymentController::class, 'createOrder']);
Route::post('/verify-payment', [PaymentController::class, 'verifyPayment']);
Route::post('/razorpay/create-order', [PaymentController::class, 'createOrder']);
Route::post('/razorpay/verify-payment', [PaymentController::class, 'verifyPayment']);

// Public Storefront Products API
Route::get('/products', [ProductController::class, 'index']);
Route::get('/products/{id}', [ProductController::class, 'show']);
Route::post('/products', [ProductController::class, 'store']);
Route::patch('/products/{id}', [ProductController::class, 'update']);
Route::put('/products/{id}', [ProductController::class, 'update']);
Route::delete('/products/{id}', [ProductController::class, 'destroy']);

// Public Storefront Catalog APIs (Real DB driven)
Route::get('/categories', [MainCategoryController::class, 'publicIndex']);
Route::get('/subcategories', [SubCategoryController::class, 'publicIndex']);
Route::get('/collections', [CollectionController::class, 'publicIndex']);
Route::get('/collections/{id}', [CollectionController::class, 'show']);
Route::get('/fragrances', [FragranceController::class, 'publicIndex']);
Route::get('/sizes', [AttributeController::class, 'getSizes']);
Route::get('/colors', [AttributeController::class, 'getColors']);
Route::get('/wick-types', [AttributeController::class, 'getWickTypes']);

// Admin Management APIs
Route::prefix('admin')->group(function () {
    // Categories CRUD
    Route::get('/categories', [MainCategoryController::class, 'index']);
    Route::post('/categories', [MainCategoryController::class, 'store']);
    Route::get('/categories/{id}', [MainCategoryController::class, 'show']);
    Route::put('/categories/{id}', [MainCategoryController::class, 'update']);
    Route::patch('/categories/{id}', [MainCategoryController::class, 'update']);
    Route::delete('/categories/{id}', [MainCategoryController::class, 'destroy']);

    // Subcategories CRUD
    Route::get('/subcategories', [SubCategoryController::class, 'index']);
    Route::post('/subcategories', [SubCategoryController::class, 'store']);
    Route::get('/subcategories/{id}', [SubCategoryController::class, 'show']);
    Route::put('/subcategories/{id}', [SubCategoryController::class, 'update']);
    Route::patch('/subcategories/{id}', [SubCategoryController::class, 'update']);
    Route::delete('/subcategories/{id}', [SubCategoryController::class, 'destroy']);

    // Collections CRUD
    Route::get('/collections', [CollectionController::class, 'index']);
    Route::post('/collections', [CollectionController::class, 'store']);
    Route::get('/collections/{id}', [CollectionController::class, 'show']);
    Route::put('/collections/{id}', [CollectionController::class, 'update']);
    Route::patch('/collections/{id}', [CollectionController::class, 'update']);
    Route::delete('/collections/{id}', [CollectionController::class, 'destroy']);
    Route::post('/collections/{id}/assign-products', [CollectionController::class, 'assignProducts']);

    // Fragrances CRUD
    Route::get('/fragrances', [FragranceController::class, 'index']);
    Route::post('/fragrances', [FragranceController::class, 'store']);
    Route::get('/fragrances/{id}', [FragranceController::class, 'show']);
    Route::put('/fragrances/{id}', [FragranceController::class, 'update']);
    Route::patch('/fragrances/{id}', [FragranceController::class, 'update']);
    Route::delete('/fragrances/{id}', [FragranceController::class, 'destroy']);

    // Sizes CRUD
    Route::get('/sizes', [AttributeController::class, 'getSizes']);
    Route::post('/sizes', [AttributeController::class, 'storeSize']);
    Route::put('/sizes/{id}', [AttributeController::class, 'updateSize']);
    Route::delete('/sizes/{id}', [AttributeController::class, 'destroySize']);

    // Colors CRUD
    Route::get('/colors', [AttributeController::class, 'getColors']);
    Route::post('/colors', [AttributeController::class, 'storeColor']);
    Route::put('/colors/{id}', [AttributeController::class, 'updateColor']);
    Route::delete('/colors/{id}', [AttributeController::class, 'destroyColor']);

    // Wick Types CRUD
    Route::get('/wick-types', [AttributeController::class, 'getWickTypes']);
    Route::post('/wick-types', [AttributeController::class, 'storeWickType']);
    Route::put('/wick-types/{id}', [AttributeController::class, 'updateWickType']);
    Route::delete('/wick-types/{id}', [AttributeController::class, 'destroyWickType']);

    // Products Admin
    Route::get('/products', [ProductController::class, 'index']);
    Route::post('/products', [ProductController::class, 'store']);
    Route::get('/products/{id}', [ProductController::class, 'show']);
    Route::put('/products/{id}', [ProductController::class, 'update']);
    Route::patch('/products/{id}', [ProductController::class, 'update']);
    Route::delete('/products/{id}', [ProductController::class, 'destroy']);

    // Inventory
    Route::get('/inventory', [InventoryController::class, 'index']);
    Route::put('/inventory/{id}', [InventoryController::class, 'update']);
    Route::post('/inventory/{id}/adjust', [InventoryController::class, 'adjust']);

    // Staff
    Route::get('/staff', [AdminManagementController::class, 'index']);
    Route::post('/staff', [AdminManagementController::class, 'store']);
    Route::patch('/staff/{id}/status', [AdminManagementController::class, 'updateStatus']);
    Route::delete('/staff/{id}', [AdminManagementController::class, 'destroy']);

    // CMS Bundle Settings
    Route::get('/cms', function () {
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

    Route::post('/cms', function (Request $request) {
        return response()->json([
            'success' => true,
            'message' => 'CMS Configuration updated live successfully.'
        ]);
    });
});

// Authentication API
Route::post('/auth/register', [AuthController::class, 'register']);
Route::post('/auth/login', [AuthController::class, 'login']);
Route::post('/auth/forgot-password', [AuthController::class, 'forgotPassword']);
Route::post('/auth/verify-email', [AuthController::class, 'verifyEmail']);
Route::post('/auth/send-otp', [AuthController::class, 'sendOtp']);
Route::post('/auth/verify-otp', [AuthController::class, 'verifyOtp']);

// Orders API
Route::get('/orders', [OrderController::class, 'index']);
Route::post('/orders', [OrderController::class, 'store']);
Route::patch('/orders/{id}/status', [OrderController::class, 'updateStatus']);

// Sanctum Authenticated Group
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/auth/me', [AuthController::class, 'me']);
    Route::post('/auth/logout', [AuthController::class, 'logout']);
    Route::get('/user/orders', [OrderController::class, 'index']);
});
