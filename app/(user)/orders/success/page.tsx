"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { CheckCircle2, ArrowRight, Package, Download, ShieldCheck, Loader2, AlertCircle, Key as KeyIcon } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { verifyOrderFulfillment } from "@/actions/fulfill";

export default function OrderSuccessPage() {
  const { clearCart } = useCart();
  const searchParams = useSearchParams();
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [fulfillmentStatus, setFulfillmentStatus] = useState<string | null>(null);
  const [assignedKey, setAssignedKey] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const sessionId = searchParams.get("session_id");
  const orderId = searchParams.get("orderId");

  useEffect(() => {
    setMounted(true);
    clearCart();

    const verify = async () => {
      try {
        const result = await verifyOrderFulfillment({ 
          sessionId: sessionId || undefined, 
          orderId: orderId || undefined 
        });

        if (result.success) {
          setFulfillmentStatus(result.status || "Fulfilled");
          setAssignedKey((result as any).productKey);
        } else {
          setError(result.error || "Something went wrong verifying your payment.");
        }
      } catch (err) {
        setError("Connection error. Please check your dashboard later.");
      } finally {
        setLoading(false);
      }
    };

    verify();
  }, []);

  if (!mounted) return null;

  return (
    <div className="min-h-[80vh] text-white px-6 flex flex-col items-center justify-center text-center">
      <div className="absolute inset-0 bg-[#6eDD86]/5 blur-[120px] rounded-full -z-10" />
      
      {loading ? (
        <div className="flex flex-col items-center gap-6">
          <Loader2 className="w-16 h-16 text-[#6eDD86] animate-spin" />
          <h2 className="text-2xl font-bold font-grotesk">Verifying your payment...</h2>
          <p className="text-gray-400">Please don't close this page. We are preparing your digital keys.</p>
        </div>
      ) : error ? (
        <div className="flex flex-col items-center gap-6 max-w-lg">
          <div className="w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center border border-red-500/20">
            <AlertCircle className="w-10 h-10 text-red-500" />
          </div>
          <h2 className="text-3xl font-bold font-grotesk text-red-500">Verification Pending</h2>
          <p className="text-gray-400">
            We couldn't verify your payment instantly. Don't worry, your order is being processed. 
            Please check your email and dashboard in a few minutes.
          </p>
          <Link href="/orders" className="bg-white/10 hover:bg-white/20 py-3 px-8 rounded-xl font-bold transition-all">
            Go to My Orders
          </Link>
        </div>
      ) : (
        <>
          <div className="flex items-center justify-center relative">
            <div className="w-24 h-24 bg-[#6eDD86]/10 rounded-full flex items-center justify-center border border-[#6eDD86]/20">
              <CheckCircle2 className="w-12 h-12 text-[#6eDD86]" />
            </div>
            <div className="w-30 h-30 bg-[#6eDD86] rounded-full animate-ping opacity-20 absolute" />
          </div>

          <h1 className="text-5xl md:text-6xl font-bold font-grotesk mb-6 tracking-tight mt-8">
            Payment <span className="text-[#6eDD86]">Successful!</span>
          </h1>
          
          <p className="text-gray-400 font-inter text-lg max-w-2xl leading-relaxed mb-8">
            {fulfillmentStatus === "Awaiting_Stock" 
              ? "Your order is confirmed! We are currently restocking keys for this product. You will receive an email as soon as your key is ready."
              : "Thank you for choosing InnovixLLC. Your digital keys have been generated and are now available below and in your dashboard."}
          </p>

          {assignedKey && (
            <div className="bg-white/[0.03] border border-[#6eDD86]/30 p-8 rounded-[30px] w-full max-w-xl mb-12 backdrop-blur-sm relative overflow-hidden group">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#6eDD86]/40 to-transparent" />
              <div className="flex items-center gap-3 mb-4 justify-center">
                <KeyIcon size={18} className="text-[#6eDD86]" />
                <span className="text-xs font-bold uppercase tracking-widest text-[#6eDD86]">Your Digital Key</span>
              </div>
              <p className="text-3xl font-mono font-bold text-white tracking-wider break-all">
                {assignedKey}
              </p>
              <p className="text-[10px] text-gray-500 mt-4 uppercase tracking-[0.2em]">
                Copy this key for activation or find it in your vault
              </p>
            </div>
          )}

          <div className="flex flex-col sm:flex-row items-center gap-6">
            <Link
              href="/keys"
              className="bg-[#6eDD86] hover:bg-[#5dbb72] text-black font-bold py-4 px-10 rounded-2xl transition-all duration-300 shadow-[0_0_30px_rgba(110,221,134,0.4)] flex items-center gap-2 group"
            >
              View My Vault
              <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
            </Link>
            <Link
              href="/products"
              className="bg-white/[0.05] hover:bg-white/[0.1] text-white font-bold py-4 px-10 rounded-2xl transition-all duration-300 border border-white/10"
            >
              Continue Shopping
            </Link>
          </div>
        </>
      )}
    </div>
  );
}
