"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Eye, EyeOff, Flame, ArrowRight, LogIn } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

const loginSchema = z.object({
  email: z.string().email("Enter a valid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

const registerSchema = z.object({
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Enter a valid email"),
  phone: z.string().regex(/^[6-9]\d{9}$/, "Enter valid 10-digit mobile"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  confirmPassword: z.string(),
}).refine((d) => d.password === d.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type LoginData = z.infer<typeof loginSchema>;
type RegisterData = z.infer<typeof registerSchema>;

export default function AuthPage() {
  const router = useRouter();
  const [mode, setMode] = useState<"login" | "register">("login");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const loginForm = useForm<LoginData>({ resolver: zodResolver(loginSchema) });
  const registerForm = useForm<RegisterData>({ resolver: zodResolver(registerSchema) });

  const handleLogin = async (data: LoginData) => {
    setIsLoading(true);
    await new Promise((r) => setTimeout(r, 1200));
    setIsLoading(false);
    toast.success("Welcome back!");
    router.push("/");
  };

  const handleRegister = async (data: RegisterData) => {
    setIsLoading(true);
    await new Promise((r) => setTimeout(r, 1500));
    setIsLoading(false);
    toast.success("Account created! Welcome to The Candle Lab ✨");
    router.push("/");
  };

  return (
    <div
      className="min-h-screen flex"
      style={{ background: "linear-gradient(135deg, #F5EFE4 0%, #FDFAF5 50%, #EDE4D4 100%)" }}
    >
      {/* Left: Decorative panel (hidden on mobile) */}
      <div
        className="hidden lg:flex flex-col justify-center items-center flex-1 p-12"
        style={{
          background: "linear-gradient(135deg, #1A1208 0%, #3D2010 100%)",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Decorative circles */}
        <div
          className="absolute w-96 h-96 rounded-full opacity-10"
          style={{
            background: "radial-gradient(circle, #C4964A, transparent)",
            top: "-8rem",
            left: "-8rem",
          }}
        />
        <div
          className="absolute w-64 h-64 rounded-full opacity-10"
          style={{
            background: "radial-gradient(circle, #C4964A, transparent)",
            bottom: "4rem",
            right: "-4rem",
          }}
        />

        <div className="relative text-center max-w-md">
          {/* Logo */}
          <div className="flex items-center justify-center gap-3 mb-8">
            <div className="w-14 h-14 rounded-full bg-gradient-to-br from-[#A87B32] via-[#C4964A] to-[#D4A96A] flex items-center justify-center">
              <Flame size={28} className="text-white" strokeWidth={1.5} />
            </div>
          </div>

          <h2
            className="text-4xl font-light mb-4"
            style={{
              fontFamily: "Cormorant Garamond, Georgia, serif",
              color: "#F5EFE4",
            }}
          >
            The Candle Lab
          </h2>
          <p className="text-base mb-8" style={{ color: "#A08060" }}>
            Illuminate your world with luxury handcrafted candles made with the
            finest natural ingredients.
          </p>

          {/* Features */}
          {[
            "✦ Free shipping on orders above ₹999",
            "✦ 7-day hassle-free returns",
            "✦ 100% natural soy wax candles",
            "✦ Earn reward points on every purchase",
          ].map((f) => (
            <p key={f} className="text-sm mb-2" style={{ color: "#8B7355" }}>
              {f}
            </p>
          ))}
        </div>
      </div>

      {/* Right: Auth Form */}
      <div className="flex-1 flex items-center justify-center p-6 lg:p-12">
        <motion.div
          key={mode}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="w-full max-w-md"
        >
          {/* Logo (mobile) */}
          <div className="flex items-center gap-2.5 mb-8 lg:hidden">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#A87B32] to-[#D4A96A] flex items-center justify-center">
              <Flame size={20} className="text-white" />
            </div>
            <span
              className="text-xl font-medium text-[#1A1208]"
              style={{ fontFamily: "Cormorant Garamond, Georgia, serif" }}
            >
              The Candle Lab
            </span>
          </div>

          <div
            className="bg-white rounded-3xl p-8"
            style={{ boxShadow: "0 20px 60px rgba(26,18,8,0.10)", border: "1px solid #EDE4D4" }}
          >
            {/* Tabs */}
            <div
              className="flex rounded-xl p-1 mb-7"
              style={{ background: "#F5EFE4" }}
            >
              {(["login", "register"] as const).map((m) => (
                <button
                  key={m}
                  onClick={() => setMode(m)}
                  className="flex-1 py-2.5 rounded-lg text-sm font-medium transition-all capitalize"
                  style={{
                    background: mode === m ? "#fff" : "transparent",
                    color: mode === m ? "#1A1208" : "#8B7355",
                    boxShadow: mode === m ? "0 2px 8px rgba(26,18,8,0.08)" : "none",
                  }}
                  id={`auth-tab-${m}`}
                >
                  {m === "login" ? "Sign In" : "Create Account"}
                </button>
              ))}
            </div>

            <h2
              className="text-2xl font-medium text-[#1A1208] mb-6"
              style={{ fontFamily: "Cormorant Garamond, Georgia, serif" }}
            >
              {mode === "login"
                ? "Welcome back"
                : "Join The Candle Lab"}
            </h2>

            {mode === "login" ? (
              <form
                onSubmit={loginForm.handleSubmit(handleLogin)}
                className="space-y-4"
              >
                <div>
                  <label className="block text-sm font-medium text-[#4A3728] mb-1.5">
                    Email Address
                  </label>
                  <input
                    {...loginForm.register("email")}
                    id="login-email"
                    type="email"
                    placeholder="you@example.com"
                    className="input"
                  />
                  {loginForm.formState.errors.email && (
                    <p className="text-xs text-[#B85450] mt-1">
                      {loginForm.formState.errors.email.message}
                    </p>
                  )}
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-sm font-medium text-[#4A3728]">
                      Password
                    </label>
                    <Link
                      href="/auth/forgot-password"
                      className="text-xs text-[#A87B32] hover:underline"
                    >
                      Forgot password?
                    </Link>
                  </div>
                  <div className="relative">
                    <input
                      {...loginForm.register("password")}
                      id="login-password"
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      className="input pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8B7355] hover:text-[#4A3728]"
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                  {loginForm.formState.errors.password && (
                    <p className="text-xs text-[#B85450] mt-1">
                      {loginForm.formState.errors.password.message}
                    </p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="btn btn-gold w-full justify-center mt-2 disabled:opacity-70"
                  id="login-submit"
                >
                  {isLoading ? (
                    <span className="flex items-center gap-2">
                      <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Signing in...
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      <LogIn size={16} />
                      Sign In
                    </span>
                  )}
                </button>
              </form>
            ) : (
              <form
                onSubmit={registerForm.handleSubmit(handleRegister)}
                className="space-y-4"
              >
                <div>
                  <label className="block text-sm font-medium text-[#4A3728] mb-1.5">Full Name</label>
                  <input {...registerForm.register("name")} id="reg-name" placeholder="Priya Sharma" className="input" />
                  {registerForm.formState.errors.name && (
                    <p className="text-xs text-[#B85450] mt-1">{registerForm.formState.errors.name.message}</p>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-[#4A3728] mb-1.5">Email</label>
                    <input {...registerForm.register("email")} id="reg-email" type="email" placeholder="you@example.com" className="input" />
                    {registerForm.formState.errors.email && (
                      <p className="text-xs text-[#B85450] mt-1">{registerForm.formState.errors.email.message}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#4A3728] mb-1.5">Phone</label>
                    <input {...registerForm.register("phone")} id="reg-phone" type="tel" placeholder="9876543210" className="input" />
                    {registerForm.formState.errors.phone && (
                      <p className="text-xs text-[#B85450] mt-1">{registerForm.formState.errors.phone.message}</p>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#4A3728] mb-1.5">Password</label>
                  <div className="relative">
                    <input {...registerForm.register("password")} id="reg-password" type={showPassword ? "text" : "password"} placeholder="Min. 8 characters" className="input pr-10" />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8B7355]">
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                  {registerForm.formState.errors.password && (
                    <p className="text-xs text-[#B85450] mt-1">{registerForm.formState.errors.password.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#4A3728] mb-1.5">Confirm Password</label>
                  <input {...registerForm.register("confirmPassword")} id="reg-confirm" type="password" placeholder="Repeat password" className="input" />
                  {registerForm.formState.errors.confirmPassword && (
                    <p className="text-xs text-[#B85450] mt-1">{registerForm.formState.errors.confirmPassword.message}</p>
                  )}
                </div>

                <button type="submit" disabled={isLoading} className="btn btn-gold w-full justify-center mt-2 disabled:opacity-70" id="register-submit">
                  {isLoading ? (
                    <span className="flex items-center gap-2">
                      <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Creating account...
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      <ArrowRight size={16} />
                      Create Account
                    </span>
                  )}
                </button>

                <p className="text-xs text-center text-[#8B7355]">
                  By creating an account, you agree to our{" "}
                  <Link href="/terms" className="text-[#A87B32] hover:underline">Terms</Link>{" "}
                  and{" "}
                  <Link href="/privacy" className="text-[#A87B32] hover:underline">Privacy Policy</Link>
                </p>
              </form>
            )}

            <p className="text-center text-sm text-[#8B7355] mt-6">
              {mode === "login" ? "Don't have an account? " : "Already have an account? "}
              <button
                onClick={() => setMode(mode === "login" ? "register" : "login")}
                className="text-[#A87B32] font-medium hover:underline"
              >
                {mode === "login" ? "Create one" : "Sign in"}
              </button>
            </p>
          </div>

          <p className="text-center mt-6">
            <Link href="/" className="text-sm text-[#8B7355] hover:text-[#A87B32] transition-colors">
              ← Continue as guest
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
