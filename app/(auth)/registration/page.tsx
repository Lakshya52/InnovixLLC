"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { register } from "@/actions/auth";
import { ArrowRight, Eye, EyeOff, Loader2, CheckCircle2, AlertCircle } from "lucide-react";

export default function Registration() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    cpass: "",
    terms: false,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    // Clear error when user builds form
    if (error) setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Client-side quick checks
    if (formData.password !== formData.cpass) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

    if (formData.password.length < 8) {
      setError("Password must be at least 8 characters");
      setLoading(false);
      return;
    }

    if (!formData.terms) {
      setError("Please accept the terms and conditions");
      setLoading(false);
      return;
    }

    try {
      const form = new FormData();
      form.append("name", formData.name);
      form.append("email", formData.email);
      form.append("password", formData.password);
      form.append("cpass", formData.cpass);
      form.append("terms", formData.terms ? "on" : "");

      const result = await register(form);

      if (result?.error) {
        setError(result.error);
        setLoading(false);
      } else if (result?.success) {
        if (result.role === "ADMIN") {
          router.push("/admin/dashboard");
        } else {
          router.push("/dashboard");
        }
      }
    } catch (err) {
      setError("An unexpected error occurred. Please try again.");
      setLoading(false);
    }
  };

  const passwordMatch = formData.password && formData.cpass && formData.password === formData.cpass;
  const passwordValid = formData.password.length >= 8;

  return (
    <div className="relative w-full min-h-screen flex items-center justify-center overflow-hidden bg-(--bg-dark) mt-[10dvh]">
      {/* Dynamic Background Elements */}
      <div className="absolute inset-0 z-0">
        {/* Animated Blobs */}
        <div
          className="absolute top-[-10%] right-[-5%] w-[600px] h-[600px] bg-(--accent)/15 blur-[100px] rounded-full animate-float-slow"
          style={{ animationDuration: '15s' }}
        />
        <div
          className="absolute bottom-[-10%] left-[-5%] w-[500px] h-[500px] bg-(--accent)/10 blur-[80px] rounded-full animate-float-slow"
          style={{ animationDuration: '18s', animationDelay: '-5s' }}
        />

        {/* Subtle Grid Texture */}
        <div
          className="absolute inset-0 opacity-[0.03] pointer-events-none"
          style={{
            backgroundImage: `radial-gradient(var(--accent) 1px, transparent 0)`,
            backgroundSize: '40px 40px'
          }}
        />

        {/* Scanning Line Effect */}
        {/* <div className="absolute top-0 left-0 w-full h-[2px] bg-linear-to-r from-transparent via-(--accent)/20 to-transparent animate-scan" /> */}
      </div>

      <style jsx global>{`
        @keyframes float-slow {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
        }
        @keyframes scan {
          0% { transform: translateY(-100vh); }
          100% { transform: translateY(100vh); }
        }
        .animate-float-slow {
          animation: float-slow linear infinite;
        }
        .animate-scan {
          animation: scan 8s linear infinite;
        }
      `}</style>

      <div className="flex flex-col lg:flex-row items-center justify-between w-[80dvw] py-12 relative z-10 gap-16">

        {/* Left Section: Branding & Info */}
        <div className="w-full lg:w-1/2 flex flex-col  gap-4 ">
          <div className="inline-flex items-center gap-2 bg-(--text-main)/5 border border-(--text-main)/10 py-2 px-4 rounded-full w-fit">
            <span className="w-2 h-2 rounded-full bg-(--accent) animate-ping" />
            <span className="text-(--accent) text-sm font-medium tracking-widest uppercase">Registration</span>
          </div>

          <h1 className="text-(--text-main) font-grotesk text-4xl lg:text-5xl font-bold leading-tight">
            Join the
            <span className="text-transparent bg-clip-text bg-linear-to-r from-(--accent) to-[#a5f3bc]"> Matrix</span>
          </h1>

          <p className="text-(--text-main)/70 font-inter text-lg lg:text-xl max-w-lg leading-relaxed">
            Access the full suite of InnovixLLC digital solutions.
            High-performance precision starts with your global identity.
          </p>

          <div className="flex flex-col gap-6 mt-4 ">
            <div className="flex items-start gap-4 border border-(--text-main)/10 bg-(--bg-less-dark)/10 hover:bg-(--bg-less-dark) transition-all duration-300 backdrop-blur-2xl p-5 rounded-full ">
              <div className="w-12 h-12 rounded-full bg-(--text-main)/5 border border-(--text-main)/10 flex items-center justify-center text-(--accent)">
                <CheckCircle2 size={24} />
              </div>
              <div>
                <h3 className="text-(--text-main) font-semibold flex items-center gap-2">Secure Infrastructure</h3>
                <p className="text-(--text-main)/50 text-sm">Enterprise-grade encryption for all your data and assets.</p>
              </div>
            </div>
            <div className="flex items-start gap-4 border border-(--text-main)/10 bg-(--bg-less-dark)/10 hover:bg-(--bg-less-dark) transition-all duration-300 backdrop-blur-2xl p-5 rounded-full ">
              <div className="w-12 h-12 rounded-full bg-(--text-main)/5 border border-(--text-main)/10 flex items-center justify-center text-(--accent)">
                <ArrowRight size={24} />
              </div>
              <div>
                <h3 className="text-(--text-main) font-semibold">Immediate Support</h3>
                <p className="text-(--text-main)/50 text-sm">Live chat with or professional experts, always ready to help you </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Section: Form */}
        <div className="w-full lg:w-1/2">
          <div className="bg-(--text-main)/[0.03] backdrop-blur-2xl border border-(--text-main)/10 p-8 md:p-10 rounded-[40px] shadow-2xl relative overflow-hidden group">
            <div className="absolute top-0 left-0 w-full h-1 bg-linear-to-r from-transparent via-(--accent)/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

            <form onSubmit={handleSubmit} className="flex flex-col gap-6 relative z-10 font-inter">
              {/* <div className="space-y-1">
                <h2 className="text-2xl font-bold text-(--text-main)">Create Account</h2>
                <p className="text-(--text-main)/40 text-sm">Enter your details to get started</p>
              </div> */}

              {error && (
                <div className="bg-red-500/10 border border-red-500/20 p-4 rounded-2xl flex items-center gap-3 animate-in fade-in slide-in-from-top-2">
                  <AlertCircle className="text-red-500 shrink-0" size={20} />
                  <p className="text-red-500 text-sm font-medium">{error}</p>
                </div>
              )}

              <div className="space-y-4">
                {/* Full Name */}
                <div className="flex flex-col gap-2">
                  <label htmlFor="name" className="text-sm font-medium text-(--text-main)/60 ml-1">Full Name</label>
                  <input
                    required
                    className="w-full rounded-full bg-(--text-main)/5 border border-(--text-main)/10 text-(--text-main) p-4 outline-none focus:border-(--accent)/50 focus:bg-(--text-main)/[0.08] transition-all placeholder:text-(--text-main)/20"
                    type="text"
                    name="name"
                    id="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="John Doe"
                  />
                </div>

                {/* Email */}
                <div className="flex flex-col gap-2">
                  <label htmlFor="email" className="text-sm font-medium text-(--text-main)/60 ml-1">Email Address</label>
                  <input
                    required
                    className="w-full rounded-full bg-(--text-main)/5 border border-(--text-main)/10 text-(--text-main) p-4 outline-none focus:border-(--accent)/50 focus:bg-(--text-main)/[0.08] transition-all placeholder:text-(--text-main)/20"
                    type="email"
                    name="email"
                    id="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="john@example.com"
                  />
                </div>

                {/* Passwords */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-2">
                    <label htmlFor="password" className="text-sm font-medium text-(--text-main)/60 ml-1">Password</label>
                    <div className="relative">
                      <input
                        required
                        className={`w-full rounded-full bg-(--text-main)/5 border ${passwordValid ? 'border-green-500/30' : 'border-(--text-main)/10'} text-(--text-main) p-4 pr-12 outline-none focus:border-(--accent)/50 focus:bg-(--text-main)/[0.08] transition-all placeholder:text-(--text-main)/20`}
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
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-(--text-main)/30 hover:text-(--accent) transition-colors"
                      >
                        {showPassword ? <EyeOff size={20} className="cursor-pointer" /> : <Eye size={20} className="cursor-pointer" />}
                      </button>
                    </div>
                  </div>

                  <div className="flex flex-col gap-2">
                    <label htmlFor="cpass" className="text-sm font-medium text-(--text-main)/60 ml-1">Confirm</label>
                    <div className="relative">
                      <input
                        required
                        className={`w-full rounded-full bg-(--text-main)/5 border ${passwordMatch ? 'border-green-500/30' : 'border-(--text-main)/10'} text-(--text-main) p-4 pr-12 outline-none focus:border-(--accent)/50 focus:bg-(--text-main)/[0.08] transition-all placeholder:text-(--text-main)/20`}
                        type={showConfirmPassword ? "text" : "password"}
                        name="cpass"
                        id="cpass"
                        value={formData.cpass}
                        onChange={handleChange}
                        placeholder="••••••••"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-(--text-main)/30 hover:text-(--accent) transition-colors"
                      >
                        {showConfirmPassword ? <EyeOff size={20} className="cursor-pointer" /> : <Eye size={20} className="cursor-pointer" />}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Password strength/match info */}
                <div className="flex flex-col gap-1 px-1">
                  {formData.password && (
                    <div className="flex items-center gap-2">
                      <div className={`h-1 flex-1 rounded-full transition-all duration-500 ${passwordValid ? 'bg-green-500' : 'bg-red-500/40'}`} />
                      <span className="text-[10px] uppercase tracking-wider font-bold text-(--text-main)/40">
                        {passwordValid ? "Secure" : "Too Short"}
                      </span>
                    </div>
                  )}
                  {formData.cpass && (
                    <p className={`text-[10px] items-center gap-1 flex ${passwordMatch ? 'text-(--accent)' : 'text-red-500'}`}>
                      {passwordMatch ? <><CheckCircle2 size={10} /> Passwords Match</> : "Passwords do not match"}
                    </p>
                  )}
                </div>

                {/* Terms Acceptance */}
                <div className="flex items-center gap-3 group/terms px-1 py-2">
                  <div className="relative flex items-center justify-center">
                    <input
                      type="checkbox"
                      id="terms"
                      name="terms"
                      checked={formData.terms}
                      onChange={handleChange}
                      className="peer w-5 h-5 appearance-none border-2 border-(--text-main)/10 rounded-full checked:border-(--accent) checked:bg-(--accent) cursor-pointer transition-all hover:border-(--accent)/50"
                    />
                    {/* <CheckCircle2 size={12} className="absolute text-(--bg-dark) opacity-0 peer-checked:opacity-100 pointer-events-none transition-opacity" /> */}
                  </div>
                  <label htmlFor="terms" className="text-sm text-(--text-main)/60 cursor-pointer select-none group-hover/terms:text-(--text-main)/80 transition-colors">
                    I agree to the <Link href="/terms" className="text-(--accent) hover:underline font-medium">Terms of service</Link> and <Link href="/privacy" className="text-(--accent) hover:underline font-medium">Privacy Policy</Link>
                  </label>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="button-green w-full h-[60px] relative overflow-hidden group/btn flex items-center justify-center gap-3 mt-2"
              >
                {loading ? (
                  <Loader2 className="animate-spin" />
                ) : (
                  <>
                    <span className="relative z-10">Create Account</span>
                    <ArrowRight className="relative z-10 group-hover/btn:translate-x-1 transition-transform" />
                  </>
                )}
              </button>

              <p className="w-full text-center text-sm text-(--text-main)/40">
                Already have an account?{" "}
                <Link href="/login" className="text-(--accent) font-semibold hover:underline">
                  Login Here
                </Link>
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
