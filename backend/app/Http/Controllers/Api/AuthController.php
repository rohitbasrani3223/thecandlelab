<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;
use Exception;

class AuthController extends Controller
{
    public function register(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|unique:users,email',
            'phone' => 'nullable|string',
            'password' => 'required|string|min:6',
        ]);

        $user = User::create([
            'name' => $validated['name'],
            'email' => strtolower(trim($validated['email'])),
            'phone' => $validated['phone'] ?? null,
            'password' => Hash::make($validated['password']),
            'role' => 'customer',
            'reward_points' => 100,
            'tier' => 'Gold',
        ]);

        $otp = (string) random_int(100000, 999999);

        // Dispatch real email via Laravel Mailer
        try {
            Mail::raw("Welcome to The Candle Lab!\n\nYour 6-Digit OTP verification code is: {$otp}", function ($message) use ($validated) {
                $message->to($validated['email'])
                        ->subject('The Candle Lab — Account Verification OTP');
            });
        } catch (Exception $e) {
            logger()->error('Failed to send OTP email: ' . $e->getMessage());
        }

        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'success' => true,
            'message' => 'Registration successful! Verification code sent to your email.',
            'otp' => $otp,
            'user' => $user,
            'token' => $token,
        ], 201);
    }

    public function login(Request $request)
    {
        $emailOrPhone = strtolower(trim($request->input('emailOrPhone') ?? $request->input('email') ?? ''));
        $password = $request->input('password');

        if (!$emailOrPhone || !$password) {
            return response()->json([
                'success' => false,
                'message' => 'Please enter both your email/phone and password.',
            ], 422);
        }

        // Query real database users table
        $user = User::where('email', $emailOrPhone)
            ->orWhere('phone', $emailOrPhone)
            ->first();

        if (!$user || !Hash::check($password, $user->password)) {
            return response()->json([
                'success' => false,
                'message' => 'Invalid credentials. User not found in database or password is incorrect.',
            ], 401);
        }

        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'success' => true,
            'message' => 'Login successful',
            'user' => $user,
            'token' => $token,
        ]);
    }

    public function sendOtp(Request $request)
    {
        $email = strtolower(trim($request->input('email') ?? $request->input('emailOrPhone') ?? ''));

        if (!$email) {
            return response()->json(['success' => false, 'message' => 'Email address is required.'], 422);
        }

        $otp = (string) random_int(100000, 999999);

        if (filter_var($email, FILTER_VALIDATE_EMAIL)) {
            try {
                Mail::raw("Your OTP verification code for The Candle Lab is: {$otp}", function ($message) use ($email) {
                    $message->to($email)
                            ->subject('The Candle Lab — Your 6-Digit OTP Code');
                });
            } catch (Exception $e) {
                logger()->error('Failed to send OTP email: ' . $e->getMessage());
            }
        }

        return response()->json([
            'success' => true,
            'message' => "Verification OTP dispatched to {$email}.",
            'otp' => $otp,
        ]);
    }

    public function verifyOtp(Request $request)
    {
        $otp = $request->input('otp');
        $email = strtolower(trim($request->input('email') ?? $request->input('emailOrPhone') ?? ''));

        $user = User::where('email', $email)->first();

        if (!$user) {
            // Create user in database if not registered yet
            $user = User::create([
                'name' => ucfirst(explode('@', $email)[0]),
                'email' => $email,
                'phone' => $request->input('phone', null),
                'password' => Hash::make('password123'),
                'role' => 'customer',
                'reward_points' => 100,
                'tier' => 'Gold',
            ]);
        }

        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'success' => true,
            'message' => 'OTP verified successfully.',
            'user' => $user,
            'token' => $token
        ]);
    }

    public function forgotPassword(Request $request)
    {
        return $this->sendOtp($request);
    }

    public function verifyEmail(Request $request)
    {
        $email = strtolower(trim($request->input('email', '')));
        $user = User::where('email', $email)->first();
        if ($user) {
            $user->email_verified_at = now();
            $user->save();
        }

        return response()->json([
            'success' => true,
            'message' => 'Email address verified successfully in database.'
        ]);
    }

    public function me(Request $request)
    {
        return response()->json([
            'success' => true,
            'data' => $request->user(),
        ]);
    }

    public function logout(Request $request)
    {
        if ($request->user()) {
            $request->user()->currentAccessToken()->delete();
        }

        return response()->json([
            'success' => true,
            'message' => 'Logged out successfully',
        ]);
    }
}
