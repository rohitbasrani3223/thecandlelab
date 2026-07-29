<?php

use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return response()->json([
        'app' => 'The Candle Lab Backend API (Laravel 11)',
        'status' => 'ONLINE',
        'timestamp' => now()->toIso8601String(),
    ]);
});
