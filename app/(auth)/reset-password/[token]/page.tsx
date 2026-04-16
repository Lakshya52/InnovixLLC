"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { resetPassword } from "@/actions/auth";
import { ArrowRight, Eye, EyeOff, Loader2, CheckCircle2, AlertCircle, ShieldCheck } from "lucide-react";

export default function ResetPassword() {
  const params = useParams();
  const router = useRouter();
  const token = params.token as string;

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [formData, setFormData] = useState({
    password: "",
    cpass: "",
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

    try {
      const form = new FormData();
      form.append("token", token);
      form.append("password", formData.password);
      form.append("cpass", formData.cpass);

      const result = await resetPassword(form);

      if (result?.error) {
        setError(result.error);
        setLoading(false);
      } else {
        setSuccess(true);
        setLoading(false);
        // Automatically redirect after a few seconds
        setTimeout(() => {
          router.push("/login");
        }, 3000);
      }
    } catch (err) {
      setError("An unexpected error occurred");
      setLoading(false);
    }
  };

  const passwordMatch = formData.password && formData.cpass && formData.password === formData.cpass;
  const passwordValid = formData.password.length >= 8;

  return (
    <div className="relative w-full min-h-screen flex items-center justify-center overflow-hidden bg-(--bg-dark)">
      {/* Background blobs */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-[800px] aspect-square bg-(--accent)/5 blur-[120px] rounded-full" />
      </div>

      <div className="w-full max-w-[500px] px-6 relative z-10">
        <div className="bg-(--text-main)/[0.03] backdrop-blur-2xl border border-(--text-main)/10 p-8 md:p-10 rounded-[40px] shadow-2xl">
          
          {!success ? (
            <form onSubmit={handleSubmit} className="flex flex-col gap-6 font-inter">
              <div className="space-y-2">
                <div className="w-12 h-12 rounded-2xl bg-(--accent)/10 flex items-center justify-center text-(--accent) mb-4">
                  <ShieldCheck size={28} />
                </div>
                <h1 className="text-3xl font-bold text-(--text-main) font-grotesk">Secure Reset</h1>
                <p className="text-(--text-main)/40 text-sm">
                  Please enter your new password below.
                </p>
              </div>

              {error && (
                <div className="bg-red-500/10 border border-red-500/20 p-4 rounded-2xl flex items-center gap-3">
                  <AlertCircle className="text-red-500 shrink-0" size={20} />
                  <p className="text-red-500 text-sm font-medium">{error}</p>
                </div>
              )}

              <div className="space-y-4">
                {/* Password */}
                <div className="flex flex-col gap-2">
                  <label htmlFor="password" className="text-sm font-medium text-(--text-main)/60 ml-1">New Password</label>
                  <div className="relative">
                    <input 
                      required
                      className={`w-full rounded-2xl bg-(--text-main)/5 border ${passwordValid ? 'border-green-500/30' : 'border-(--text-main)/10'} text-(--text-main) p-4 pr-12 outline-none focus:border-(--accent)/50 focus:bg-(--text-main)/[0.08] transition-all placeholder:text-(--text-main)/20`}
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

                {/* Confirm Password */}
                <div className="flex flex-col gap-2">
                  <label htmlFor="cpass" className="text-sm font-medium text-(--text-main)/60 ml-1">Confirm New Password</label>
                  <div className="relative">
                    <input 
                      required
                      className={`w-full rounded-2xl bg-(--text-main)/5 border ${passwordMatch ? 'border-green-500/30' : 'border-(--text-main)/10'} text-(--text-main) p-4 pr-12 outline-none focus:border-(--accent)/50 focus:bg-(--text-main)/[0.08] transition-all placeholder:text-(--text-main)/20`}
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

                <div className="flex flex-col gap-1 px-1">
                  {formData.password && (
                    <div className="flex items-center gap-2">
                      <div className={`h-1 flex-1 rounded-full transition-all duration-500 ${passwordValid ? 'bg-green-500' : 'bg-red-500/40'}`} />
                      <span className="text-[10px] uppercase tracking-wider font-bold text-(--text-main)/40">
                        {passwordValid ? "Secure" : "Weak"}
                      </span>
                    </div>
                  )}
                  {formData.cpass && (
                    <p className={`text-[10px] items-center gap-1 flex ${passwordMatch ? 'text-(--accent)' : 'text-red-500'}`}>
                      {passwordMatch ? <><CheckCircle2 size={10} /> Passwords Match</> : "Passwords do not match"}
                    </p>
                  )}
                </div>
              </div>

              <button 
                type="submit" 
                disabled={loading}
                className="button-green w-full h-[60px] relative overflow-hidden group flex items-center justify-center gap-3 mt-4"
              >
                {loading ? (
                  <Loader2 className="animate-spin" />
                ) : (
                  <>
                    <span>Update Password</span>
                    <ArrowRight className="group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>
            </form>
          ) : (
            <div className="flex flex-col items-center text-center gap-6 py-4 animate-in fade-in zoom-in duration-500">
              <div className="w-20 h-20 rounded-full bg-green-500/20 flex items-center justify-center text-(--accent)">
                <CheckCircle2 size={40} />
              </div>
              <div className="space-y-2">
                <h2 className="text-2xl font-bold text-(--text-main)">Password Updated!</h2>
                <p className="text-(--text-main)/50 text-sm">
                  Your password has been successfully reset. Redirecting you to login...
                </p>
              </div>
              <Link href="/login" className="button-dark w-full justify-center">
                Sign In Now
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
