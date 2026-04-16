"use client";

import { useState } from "react";
import Link from "next/link";
import { forgotPassword } from "@/actions/auth";
import { ArrowLeft, Send, Loader2, CheckCircle2, AlertCircle } from "lucide-react";

export default function ForgotPassword() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [email, setEmail] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const form = new FormData();
      form.append("email", email);
      
      const result = await forgotPassword(form);

      if (result?.error) {
        setError(result.error);
        setLoading(false);
      } else {
        setSuccess(true);
        setLoading(false);
      }
    } catch (err) {
      setError("An unexpected error occurred");
      setLoading(false);
    }
  };

  return (
    <div className="relative w-full min-h-screen flex items-center justify-center overflow-hidden bg-(--bg-dark)">
      {/* Background blobs to match the auth theme */}
      <div className="absolute inset-0 z-0 text-(--accent)">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-[800px] aspect-square bg-(--text-main)/5 blur-[120px] rounded-full" />
      </div>

      <div className="w-full max-w-[450px] px-6 relative z-10">
        <div className="bg-(--text-main)/[0.03] backdrop-blur-2xl border border-(--text-main)/10 p-8 md:p-10 rounded-[40px] shadow-2xl">
          
          <Link href="/login" className="inline-flex items-center gap-2 text-(--text-main)/40 hover:text-(--accent) transition-colors text-sm mb-8 group">
            <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
            Back to Login
          </Link>

          {!success ? (
            <form onSubmit={handleSubmit} className="flex flex-col gap-6 font-inter">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold text-(--text-main) font-grotesk">Reset Password</h1>
                <p className="text-(--text-main)/40 text-sm">
                  Enter your email address and we'll send you instructions to reset your password.
                </p>
              </div>

              {error && (
                <div className="bg-red-500/10 border border-red-500/20 p-4 rounded-2xl flex items-center gap-3">
                  <AlertCircle className="text-red-500 shrink-0" size={20} />
                  <p className="text-red-500 text-sm">{error}</p>
                </div>
              )}

              <div className="flex flex-col gap-2">
                <label htmlFor="email" className="text-sm font-medium text-(--text-main)/60 ml-1">Email Address</label>
                <input 
                  required
                  className="w-full rounded-2xl bg-(--text-main)/5 border border-(--text-main)/10 text-(--text-main) p-4 outline-none focus:border-(--accent)/50 focus:bg-(--text-main)/[0.08] transition-all placeholder:text-(--text-main)/20" 
                  type="email" 
                  name="email" 
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="john@example.com" 
                />
              </div>

              <button 
                type="submit" 
                disabled={loading}
                className="button-green w-full h-[60px] relative overflow-hidden group flex items-center justify-center gap-3"
              >
                {loading ? (
                  <Loader2 className="animate-spin" />
                ) : (
                  <>
                    <span>Send Reset Link</span>
                    <Send size={18} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                  </>
                )}
              </button>
            </form>
          ) : (
            <div className="flex flex-col items-center text-center gap-6 py-4 animate-in fade-in zoom-in duration-500">
              <div className="w-20 h-20 rounded-full bg-(--accent)/20 flex items-center justify-center text-(--accent)">
                <CheckCircle2 size={40} />
              </div>
              <div className="space-y-2">
                <h2 className="text-2xl font-bold text-(--text-main)">Email Sent!</h2>
                <p className="text-(--text-main)/50 text-sm">
                  If an account exists for <span className="text-(--text-main)">{email}</span>, you will receive a password reset link shortly.
                </p>
              </div>
              <Link href="/login" className="button-dark w-full justify-center">
                Return to Login
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
