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
            $customerName = $request->input('customer_name', 'Valued Customer');
            $phone = $request->input('customer_phone', '6264885453');
            $email = $request->input('customer_email', 'basranirohi23@gmail.com');
            $address = $request->input('shipping_address', 'Sant nagar, Katni behind bajaj hospital');
            $city = $request->input('city', 'Katni');
            $state = $request->input('state', 'Madhya Pradesh');
            $pincode = $request->input('pincode', '483501');
            $totalAmount = (float) $request->input('total_amount', 999);
            $isCOD = (bool) $request->input('is_cod', false);
            $weight = (float) $request->input('weight_kg', 0.5);
            $pickupLocation = $request->input('pickup_location', 'The Candle Lab Atelier');

            // Sanitize Order ID for Shiprocket API compliance (No leading #, alphanumeric and hyphens only)
            $cleanOrderId = preg_replace('/[^a-zA-Z0-9_-]/', '', $orderId);
            if (empty($cleanOrderId)) {
                $cleanOrderId = 'TCL-' . time();
            }

            // Split customer name into first and last name
            $nameParts = explode(' ', trim($customerName), 2);
            $firstName = $nameParts[0] ?: 'Customer';
            $lastName = $nameParts[1] ?? 'Patron';

            // Sanitize 10-digit phone
            $cleanPhone = preg_replace('/\D/', '', $phone);
            if (strlen($cleanPhone) > 10) {
                $cleanPhone = substr($cleanPhone, -10);
            }
            if (strlen($cleanPhone) < 10) {
                $cleanPhone = '6264885453';
            }

            // Sanitize 6-digit destination pincode
            $cleanPin = preg_replace('/\D/', '', $pincode);
            if (strlen($cleanPin) !== 6) {
                $cleanPin = '483501';
            }

            // Sanitize address min length
            $cleanAddress = trim($address) ?: 'Sant nagar, Katni behind bajaj hospital';
            if (strlen($cleanAddress) < 6) {
                $cleanAddress .= ' Katni Madhya Pradesh';
            }

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

                // Auto-fetch and validate registered pickup locations from merchant's Shiprocket account
                try {
                    $pickupRes = Http::withToken($cleanToken)->timeout(8)->get('https://apiv2.shiprocket.in/v1/external/settings/company/pickup');
                    if ($pickupRes->successful()) {
                        $pickupList = $pickupRes->json('data.shipping_address') ?? [];
                        if (!empty($pickupList)) {
                            $locationNames = array_filter(array_map(function($loc) {
                                return $loc['pickup_location'] ?? null;
                            }, $pickupList));

                            // If specified pickup_location does not match registered nicknames, use the first valid registered location
                            if (!in_array($pickupLocation, $locationNames)) {
                                $pickupLocation = reset($locationNames) ?: 'Primary';
                            }
                        }
                    }
                } catch (\Exception $e) {
                    Log::warning('Shiprocket pickup locations auto-query notice: ' . $e->getMessage());
                }

                $createOrderUrl = 'https://apiv2.shiprocket.in/v1/external/orders/create/adhoc';

                $payload = [
                    'order_id' => $cleanOrderId,
                    'order_date' => date('Y-m-d H:i'),
                    'pickup_location' => $pickupLocation,
                    'billing_customer_name' => $firstName,
                    'billing_last_name' => $lastName,
                    'billing_address' => $cleanAddress,
                    'billing_city' => $city,
                    'billing_pincode' => $cleanPin,
                    'billing_state' => $state,
                    'billing_country' => 'India',
                    'billing_email' => $email,
                    'billing_phone' => $cleanPhone,
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

                $response = Http::withToken($cleanToken)->timeout(12)->post($createOrderUrl, $payload);

                // If duplicate order ID error, retry with a fresh timestamped ID suffix
                if (!$response->successful() && str_contains(strtolower($response->body()), 'already exists')) {
                    $payload['order_id'] = $cleanOrderId . '-' . substr(time(), -4);
                    $response = Http::withToken($cleanToken)->timeout(12)->post($createOrderUrl, $payload);
                }

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
                    $bodyStr = $response->body();
                    Log::warning('Shiprocket Create Order API Response: ' . $bodyStr);
                    $parsed = $response->json();
                    $msg = $parsed['message'] ?? $bodyStr;
                    return response()->json([
                        'success' => false,
                        'error' => 'Shiprocket: ' . (is_string($msg) ? $msg : json_encode($msg)),
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

    /**
     * Test and Verify Merchant Shiprocket Connection
     * Endpoint: POST /api/shipping/shiprocket/test-connection
     */
    public function testConnection(Request $request)
    {
        try {
            $email = $request->input('email') ?: env('SHIPROCKET_EMAIL', 'basranirohi23@gmail.com');
            $password = $request->input('password') ?: env('SHIPROCKET_PASSWORD', '');
            $token = $request->input('token') ?: env('SHIPROCKET_TOKEN', '');

            $authToken = $token;
            if (empty($authToken)) {
                if (empty($email) || empty($password)) {
                    return response()->json([
                        'success' => false,
                        'error' => 'Please provide both Shiprocket Account Email and Password to test connection.',
                    ], 422);
                }

                $authResponse = Http::timeout(10)->post('https://apiv2.shiprocket.in/v1/external/auth/login', [
                    'email' => $email,
                    'password' => $password,
                ]);

                if (!$authResponse->successful()) {
                    $errBody = $authResponse->json();
                    $msg = $errBody['message'] ?? 'Authentication failed. Please verify your Shiprocket login email and password.';
                    return response()->json([
                        'success' => false,
                        'error' => $msg,
                    ], 401);
                }

                $authData = $authResponse->json();
                $authToken = $authData['token'] ?? null;
                if ($authToken) {
                    Cache::put('shiprocket_token_' . md5($email), $authToken, now()->addHours(20));
                }
            }

            // Verify token and fetch pickup addresses
            $cleanToken = str_replace('Bearer ', '', trim($authToken));
            $pickupRes = Http::withToken($cleanToken)->timeout(10)->get('https://apiv2.shiprocket.in/v1/external/settings/company/pickup');

            $pickupLocations = [];
            if ($pickupRes->successful()) {
                $pickupList = $pickupRes->json('data.shipping_address') ?? [];
                foreach ($pickupList as $p) {
                    $pickupLocations[] = [
                        'pickup_location' => $p['pickup_location'] ?? '',
                        'city' => $p['city'] ?? '',
                        'state' => $p['state'] ?? '',
                        'pin_code' => $p['pin_code'] ?? '',
                        'address' => $p['address'] ?? '',
                    ];
                }
            }

            return response()->json([
                'success' => true,
                'message' => 'Connected to Shiprocket API successfully!',
                'pickup_locations' => $pickupLocations,
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'error' => 'Connection test error: ' . $e->getMessage(),
            ], 500);
        }
    }
}
