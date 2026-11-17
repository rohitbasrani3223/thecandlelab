<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Log;

class ShippingController extends Controller
{
    /**
     * Fetch Live Real-Time Courier Rates from Shiprocket API
     * Endpoint: POST /api/shipping/shiprocket/rate
     */
    public function getShiprocketRate(Request $request)
    {
        try {
            $deliveryPincode = preg_replace('/\D/', '', $request->input('delivery_pincode', ''));
            $pickupPincode = preg_replace('/\D/', '', $request->input('pickup_pincode', '483501'));
            $weight = (float) $request->input('weight', 0.5);
            $cod = (int) $request->input('cod', 0);

            if (strlen($deliveryPincode) !== 6) {
                return response()->json([
                    'success' => false,
                    'error' => 'Valid 6-digit destination pincode is required.'
                ], 400);
            }

            // Get Shiprocket credentials from request or backend .env
            $email = $request->input('email') ?: env('SHIPROCKET_EMAIL', 'basranirohi23@gmail.com');
            $password = $request->input('password') ?: env('SHIPROCKET_PASSWORD', '');
            $token = $request->input('token') ?: env('SHIPROCKET_TOKEN', '');

            // Step 1: Ensure Auth Token
            $authToken = $token;
            if (empty($authToken)) {
                $cacheKey = 'shiprocket_token_' . md5($email);
                $authToken = Cache::get($cacheKey);

                if (empty($authToken) && !empty($email) && !empty($password)) {
                    $authResponse = Http::timeout(8)->post('https://apiv2.shiprocket.in/v1/external/auth/login', [
                        'email' => $email,
                        'password' => $password,
                    ]);

                    if ($authResponse->successful()) {
                        $authData = $authResponse->json();
                        $authToken = $authData['token'] ?? null;
                        if ($authToken) {
                            Cache::put($cacheKey, $authToken, now()->addHours(20));
                        }
                    } else {
                        Log::warning('Shiprocket login failed: ' . $authResponse->body());
                    }
                }
            }

            // Step 2: Query Live Serviceability & Rates from Shiprocket
            if (!empty($authToken)) {
                $cleanToken = str_replace('Bearer ', '', trim($authToken));
                $serviceabilityUrl = 'https://apiv2.shiprocket.in/v1/external/courier/serviceability/';
                $rateResponse = Http::withToken($cleanToken)
                    ->timeout(8)
                    ->get($serviceabilityUrl, [
                        'pickup_postcode' => $pickupPincode,
                        'delivery_postcode' => $deliveryPincode,
                        'weight' => $weight,
                        'cod' => $cod,
                    ]);

                if ($rateResponse->successful()) {
                    $resJson = $rateResponse->json();
                    $couriers = $resJson['data']['available_courier_companies'] ?? [];

                    if (!empty($couriers)) {
                        // Extract real live couriers
                        $cleanedCouriers = array_map(function ($c) {
                            return [
                                'courier_company_id' => $c['courier_company_id'] ?? null,
                                'courier_name' => $c['courier_name'] ?? 'Express Courier',
                                'rate' => (float) ($c['rate'] ?? 0),
                                'freight_charge' => (float) ($c['freight_charge'] ?? 0),
                                'cod_charges' => (float) ($c['cod_charges'] ?? 0),
                                'estimated_delivery_days' => $c['estimated_delivery_days'] ?? $c['etd'] ?? '2-3 Days',
                                'cod_available' => (bool) ($c['cod'] ?? true),
                            ];
                        }, $couriers);

                        // Sort by lowest live rate
                        usort($cleanedCouriers, fn($a, $b) => $a['rate'] <=> $b['rate']);

                        $cheapest = $cleanedCouriers[0];

                        return response()->json([
                            'success' => true,
                            'source' => 'shiprocket_live_api',
                            'pickup_pincode' => $pickupPincode,
                            'delivery_pincode' => $deliveryPincode,
                            'rate' => round($cheapest['rate']),
                            'raw_rate' => $cheapest['rate'],
                            'courier_name' => $cheapest['courier_name'],
                            'estimated_days' => $cheapest['estimated_delivery_days'] . ' Days',
                            'available_couriers' => $cleanedCouriers,
                        ]);
                    }
                }
            }

            // If token or live query failed, return informative error
            return response()->json([
                'success' => false,
                'error' => 'Unable to fetch real-time rate from Shiprocket API. Check API credentials.',
            ], 502);

        } catch (\Exception $e) {
            Log::error('ShippingController Error: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'error' => 'Internal Shipping API error: ' . $e->getMessage()
            ], 500);
        }
    }
}
