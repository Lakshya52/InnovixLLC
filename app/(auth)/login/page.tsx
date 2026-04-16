"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { login } from "@/actions/auth";
import { ArrowRight, Eye, EyeOff, Loader2, AlertCircle, LogIn } from "lucide-react";

export default function Login() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (error) setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const form = new FormData();
      form.append("email", formData.email);
      form.append("password", formData.password);

      const result = await login(form) as { error?: string } | undefined;

      if (result?.error) {
        setError(result.error);
        setLoading(false);
      } else {
        // Redirection is handled by the server action or router check
        // If login returns nothing but uses redirect, this might not execute
        // But in our updated actions pattern, we might want to handle it.
        // The current login action in actions/auth.ts uses redirect() directly.
      }
    } catch (err: any) {
      if (err.message && err.message !== "NEXT_REDIRECT") {
        setError("Invalid email or password");
      }
      setLoading(false);
    }
  };

  return (
    <div className="relative w-full min-h-screen flex items-center justify-center overflow-hidden bg-(--bg-dark)">
      {/* Dynamic Background Elements */}
      <div className="absolute inset-0 z-0">
        <div
          className="absolute top-[-10%] right-[-5%] w-[600px] h-[600px] bg-(--accent)/15 blur-[100px] rounded-full animate-float-slow"
          style={{ animationDuration: '15s' }}
        />
        <div
          className="absolute bottom-[-10%] left-[-5%] w-[500px] h-[500px] bg-(--accent)/10 blur-[80px] rounded-full animate-float-slow"
          style={{ animationDuration: '18s', animationDelay: '-5s' }}
        />
        <div
          className="absolute inset-0 opacity-[0.03] pointer-events-none"
          style={{
            backgroundImage: `radial-gradient(var(--accent) 1px, transparent 0)`,
            backgroundSize: '40px 40px'
          }}
        />
      </div>

      <style jsx global>{`
        @keyframes float-slow {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
        }
        .animate-float-slow {
          animation: float-slow linear infinite;
        }
      `}</style>

      <div className="flex flex-col lg:flex-row items-center justify-between w-[80dvw] py-12 relative z-10 gap-16">

        {/* Left Section: Branding */}
        <div className="w-full lg:w-1/2 flex flex-col gap-8">
          <div className="inline-flex items-center gap-2 bg-white/5 border border-white/10 py-2 px-4 rounded-full w-fit">
            <span className="w-2 h-2 rounded-full bg-(--accent) animate-ping" />
            <span className="text-(--accent) text-md font-medium tracking-widest uppercase">login</span>
          </div>

          <h1 className="text-(--text-main) font-grotesk text-6xl md:text-7xl font-bold leading-tight">
            Experience the<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-(--accent) to-[#a5f3bc]">Digital Kinetic</span>
          </h1>

          <p className="text-(--text-main)/70 font-inter text-xl max-w-lg leading-relaxed">
            High-performance solutions designed for the speed of modern business. Access your precision command center.
          </p>
        </div>

        {/* Right Section: Form */}
        <div className="w-full lg:w-1/2 ">
          <div className="bg-white/[0.03] backdrop-blur-2xl border border-white/10 p-8 md:p-10 rounded-[40px] shadow-2xl relative overflow-hidden group">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-(--accent)/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

            <form onSubmit={handleSubmit} className="flex flex-col gap-6 relative z-10 font-inter">
              <div className="space-y-1">
                {/* <h2 className="text-2xl font-bold text-(--text-main) flex items-center gap-2">
                  <LogIn className="text-(--accent)" size={24} /> Welcome Back
                </h2> */}
                <p className="text-(--text-main)/40 text-md">Login to your account to continue</p>
              </div>

              {error && (
                <div className="bg-red-500/10 border border-red-500/20 p-4 rounded-2xl flex items-center gap-3">
                  <AlertCircle className="text-red-500 shrink-0" size={20} />
                  <p className="text-red-500 text-md font-medium">{error}</p>
                </div>
              )}

              <div className="space-y-5">
                {/* Email */}
                <div className="flex flex-col gap-2">
                  <label htmlFor="email" className="text-md font-medium text-(--text-main)/60 ml-1">Email Address</label>
                  <input
                    required
                    className="w-full rounded-2xl bg-white/5 border border-white/10 text-(--text-main) p-4 outline-none focus:border-(--accent)/50 focus:bg-white/[0.08] transition-all placeholder:text-white/20"
                    type="email"
                    name="email"
                    id="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="john@example.com"
                  />
                </div>

                {/* Password */}
                <div className="flex flex-col gap-2">
                  <div className="flex items-center justify-between px-1">
                    <label htmlFor="password" className="text-md font-medium text-(--text-main)/60">Password</label>
                    <Link href="/forgot-password" className="text-md text-(--accent) hover:underline">
                      Forgot Password?
                    </Link>
                  </div>
                  <div className="relative">
                    <input
                      required
                      className="w-full rounded-2xl bg-white/5 border border-white/10 text-(--text-main) p-4 pr-12 outline-none focus:border-(--accent)/50 focus:bg-white/[0.08] transition-all placeholder:text-white/20"
                      type={showPassword ? "text" : "password"}
                      name="password"
                      id="password"
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="••••••••"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-white/30 hover:text-(--accent) transition-colors"
                    >
                      {showPassword ? <EyeOff size={20} className="cursor-pointer" /> : <Eye size={20} className="cursor-pointer" />}
                    </button>
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="button-green w-full h-[60px] relative overflow-hidden group/btn flex items-center justify-center gap-3 mt-4"
              >
                {loading ? (
                  <Loader2 className="animate-spin" />
                ) : (
                  <>
                    <span className="relative z-10">Sign In</span>
                    <ArrowRight className="relative z-10 group-hover/btn:translate-x-1 transition-transform" />
                  </>
                )}
              </button>

              <p className="w-full text-center text-md text-(--text-main)/40">
                New to InnovixLLC?{" "}
                <Link href="/registration" className="text-(--accent) font-semibold hover:underline">
                  Register Now
                </Link>
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
