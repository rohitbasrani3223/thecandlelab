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

    /**
     * Create / Push Order to Shiprocket for official courier pickup
     * Endpoint: POST /api/shipping/shiprocket/create-order
     */
    public function createShiprocketOrder(Request $request)
    {
        try {
            $orderId = $request->input('order_id', 'TCL-' . time());
            $customerName = $request->input('customer_name', 'Customer');
            $phone = $request->input('customer_phone', '6264885453');
            $email = $request->input('customer_email', 'support.thecandlelab@gmail.com');
            $address = $request->input('shipping_address', 'Sant nagar, Katni');
            $city = $request->input('city', 'Katni');
            $state = $request->input('state', 'Madhya Pradesh');
            $pincode = $request->input('pincode', '483501');
            $totalAmount = (float) $request->input('total_amount', 999);
            $isCOD = (bool) $request->input('is_cod', false);
            $weight = (float) $request->input('weight_kg', 0.5);
            $pickupLocation = $request->input('pickup_location', 'The Candle Lab Atelier');

            $authEmail = $request->input('auth_email') ?: env('SHIPROCKET_EMAIL', 'basranirohi23@gmail.com');
            $authPassword = $request->input('auth_password') ?: env('SHIPROCKET_PASSWORD', '');
            $authToken = $request->input('token') ?: env('SHIPROCKET_TOKEN', '');

            // Ensure Auth Token
            if (empty($authToken)) {
                $cacheKey = 'shiprocket_token_' . md5($authEmail);
                $authToken = Cache::get($cacheKey);

                if (empty($authToken) && !empty($authEmail) && !empty($authPassword)) {
                    $authResponse = Http::timeout(8)->post('https://apiv2.shiprocket.in/v1/external/auth/login', [
                        'email' => $authEmail,
                        'password' => $authPassword,
                    ]);

                    if ($authResponse->successful()) {
                        $authData = $authResponse->json();
                        $authToken = $authData['token'] ?? null;
                        if ($authToken) {
                            Cache::put($cacheKey, $authToken, now()->addHours(20));
                        }
                    }
                }
            }

            if (!empty($authToken)) {
                $cleanToken = str_replace('Bearer ', '', trim($authToken));
                $createOrderUrl = 'https://apiv2.shiprocket.in/v1/external/orders/create/adhoc';

                $payload = [
                    'order_id' => $orderId,
                    'order_date' => date('Y-m-d H:i'),
                    'pickup_location' => $pickupLocation,
                    'billing_customer_name' => $customerName,
                    'billing_last_name' => '',
                    'billing_address' => $address,
                    'billing_city' => $city,
                    'billing_pincode' => $pincode,
                    'billing_state' => $state,
                    'billing_country' => 'India',
                    'billing_email' => $email,
                    'billing_phone' => $phone,
                    'shipping_is_billing' => true,
                    'order_items' => [
                        [
                            'name' => 'Artisanal Soy Candles',
                            'sku' => 'TCL-CANDLE',
                            'units' => 1,
                            'selling_price' => $totalAmount,
                            'discount' => 0,
                            'tax' => 0,
                        ]
                    ],
                    'payment_method' => $isCOD ? 'COD' : 'Prepaid',
                    'sub_total' => $totalAmount,
                    'length' => 12,
                    'breadth' => 12,
                    'height' => 12,
                    'weight' => $weight,
                ];

                $response = Http::withToken($cleanToken)->timeout(10)->post($createOrderUrl, $payload);

                if ($response->successful()) {
                    $resData = $response->json();
                    return response()->json([
                        'success' => true,
                        'shiprocket_order_id' => $resData['order_id'] ?? null,
                        'shipment_id' => $resData['shipment_id'] ?? null,
                        'awb_code' => $resData['awb_code'] ?? null,
                        'courier_name' => $resData['courier_name'] ?? 'Shiprocket Express',
                        'data' => $resData,
                    ]);
                } else {
                    Log::warning('Shiprocket Create Order API Response: ' . $response->body());
                    return response()->json([
                        'success' => false,
                        'error' => 'Shiprocket API returned: ' . $response->body(),
                    ], 400);
                }
            }

            return response()->json([
                'success' => false,
                'error' => 'Authentication to Shiprocket failed. Please verify API email and password in Admin.',
            ], 401);

        } catch (\Exception $e) {
            Log::error('Create Shiprocket Order Error: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'error' => $e->getMessage(),
            ], 500);
        }
    }
    }
}
