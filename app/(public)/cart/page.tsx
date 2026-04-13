"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Trash2,
  Plus,
  Minus,
  ArrowRight,
  Zap,
  ShieldCheck,
  CheckCircle,
  ShoppingCart,
  ArrowLeft,
  Monitor,
  Briefcase,
  Database,
  LayoutGrid
} from "lucide-react";
import { useCart } from "@/context/CartContext";

const categoryIcons: Record<string, React.ReactNode> = {
  "Windows": <Monitor className="w-10 h-10 text-[#6eDD86]" />,
  "Office Suite": <Briefcase className="w-10 h-10 text-[#6eDD86]" />,
  "Servers": <Database className="w-10 h-10 text-[#6eDD86]" />,
  "Developer Tools": <LayoutGrid className="w-10 h-10 text-[#6eDD86]" />
};

export default function CartPage() {
  const { cart, removeFromCart, updateQuantity, cartTotal, cartCount } = useCart();
  const router = useRouter();

  // 🔥 NEW: login message state
  const [showLoginMsg, setShowLoginMsg] = useState(false);
  const [countdown, setCountdown] = useState(3);

  useEffect(() => {
    if (!showLoginMsg) return;

    if (countdown === 0) {
      window.location.href = "/registration"; // redirect
      return;
    }

    const timer = setTimeout(() => {
      setCountdown((prev) => prev - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [showLoginMsg, countdown]);

  // 🔥 NEW: checkout handler
  const handleCheckout = () => {
    const isLoggedIn = document.cookie.includes("session=");

    if (!isLoggedIn) {
      setShowLoginMsg(true);
      setCountdown(3); // reset countdown every time
      // redirect after small delay (better UX)
      setTimeout(() => {
        router.push("/registration");
      }, 3000);

      return;
    }

    router.push("/checkout");
  };

  //   onClick = {() => {

  //     if (!isLoggedIn) {
  //       setShowLoginMsg(true);
  //       setCountdown(3); // reset countdown every time
  //       return;
  //     }

  //     // normal checkout logic here
  //   }
  // }



  if (cart.length === 0) {
    return (
      <div className="bg-(--bg-dark) min-h-screen text-white pt-40 pb-20 px-4 flex flex-col items-center justify-center text-center">
        <div className="w-24 h-24 bg-white/[0.03] rounded-full flex items-center justify-center mb-8 border border-white/5">
          <ShoppingCart className="w-10 h-10 text-gray-500" />
        </div>
        <h1 className="text-4xl font-bold font-grotesk mb-4">Your cart is empty</h1>
        <p className="text-gray-400 font-inter mb-10 max-w-md">
          Looks like you haven't added any premium digital solutions yet.
          Explore our products to find the perfect fit for your workspace.
        </p>
        <Link
          href="/products"
          className="bg-[#6eDD86] hover:bg-[#5dbb72] text-black font-bold py-4 px-10 rounded-full transition-all duration-300 font-grotesk flex items-center gap-2 group"
        >
          Browse Products
          <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-(--bg-dark) min-h-screen text-white pt-32 pb-20 px-4 md:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center gap-4 mb-12">
          <Link href="/products" className="text-gray-500 hover:text-white transition-colors">
            <ArrowLeft className="w-6 h-6" />
          </Link>
          <h1 className="text-4xl md:text-5xl font-bold font-grotesk tracking-tight">Your Cart</h1>
          <span className="bg-white/[0.05] border border-white/10 px-4 py-1 rounded-full text-xs font-bold text-gray-400 font-inter">
            {cartCount} Items
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Cart Items List */}
          <div className="lg:col-span-2 space-y-6">
            {cart.map((item) => (
              <div
                key={item.product.id}
                className="bg-white/[0.02] border border-white/5 rounded-[40px] p-6 md:p-8 flex flex-col md:flex-row items-center gap-8 transition-all hover:bg-white/[0.04]"
              >
                <div className="w-full md:w-32 h-32 bg-white/[0.03] rounded-3xl border border-white/5 flex items-center justify-center shrink-0">
                  {categoryIcons[item.product.category] || <Monitor className="w-10 h-10 text-white/20" />}
                </div>

                <div className="flex-1 text-center md:text-left">
                  <div className="flex flex-col gap-1 mb-4">
                    <span className="text-[#6eDD86] text-[10px] font-bold tracking-widest uppercase mb-1">
                      {item.product.subCategory}
                    </span>
                    <h3 className="text-2xl font-bold font-grotesk">{item.product.name}</h3>
                    <p className="text-gray-500 text-sm font-inter">60s Instant Delivery Guaranteed</p>
                  </div>

                  <div className="flex items-center justify-center md:justify-start gap-4">
                    <CheckCircle className="w-4 h-4 text-[#6eDD86]" />
                    <span className="text-xs text-gray-400 font-inter uppercase tracking-widest">Active License</span>
                  </div>
                </div>

                <div className="flex flex-col items-center md:items-end gap-6">
                  <div className="text-2xl font-bold font-grotesk">${item.product.price}</div>

                  <div className="flex items-center bg-black/40 border border-white/10 rounded-2xl p-1 shrink-0">
                    <button
                      onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                      className="w-10 h-10 flex items-center justify-center hover:bg-white/5 rounded-xl transition-colors"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="w-10 text-center font-bold font-grotesk">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                      className="w-10 h-10 flex items-center justify-center hover:bg-white/5 rounded-xl transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>

                  <button
                    onClick={() => removeFromCart(item.product.id)}
                    className="p-3 text-gray-600 hover:text-red-500 hover:bg-red-500/10 rounded-xl transition-all"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Checkout Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white/[0.02] border border-white/5 rounded-[50px] p-8 md:p-10 sticky top-32">
              <h2 className="text-2xl font-bold font-grotesk mb-8">Order Summary</h2>

              <div className="space-y-4 mb-10 pb-8 border-b border-white/5">
                <div className="flex justify-between items-center text-gray-400 font-inter">
                  <span>Subtotal</span>
                  <span className="text-white font-medium">${cartTotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center text-gray-400 font-inter">
                  <span>Service Fee</span>
                  <span className="text-[#6eDD86] font-medium">$0.00</span>
                </div>
              </div>

              <div className="flex justify-between items-center mb-10">
                <span className="text-xl font-bold font-grotesk">Total</span>
                <span className="text-4xl font-bold font-grotesk text-[#6eDD86] tracking-tight">
                  ${cartTotal.toFixed(2)}
                </span>
              </div>

              {/* 🔥 ONLY CHANGE HERE */}
              <button
                onClick={handleCheckout}
                className="w-full bg-[#6eDD86] hover:bg-[#5dbb72] text-black font-bold py-6 rounded-3xl transition-all duration-300 shadow-[0_0_20px_rgba(110,221,134,0.3)] font-grotesk text-xl flex items-center justify-center gap-3 group mb-2 px-5"
              >
                Proceed to Checkout
                <ArrowRight className="w-6 h-6 transition-transform group-hover:translate-x-1" />
              </button>
              {showLoginMsg && (
                <p className="text-red-500 font-bold text-lg font-inter mb-10" >
                  Please login to continue, Redirecting in <span>{countdown}</span>...
                </p>
              )}

              {/* Trust Section unchanged */}
              <div className="space-y-6">
                <div className="flex items-center gap-4 group">
                  <div className="w-10 h-10 rounded-xl bg-white/[0.03] flex items-center justify-center text-[#6eDD86]">
                    <Zap className="w-5 h-5" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-bold font-grotesk">Fast Delivery</span>
                    <span className="text-[10px] text-gray-500 font-inter uppercase tracking-widest">Digital Keys in Seconds</span>
                  </div>
                </div>

                <div className="flex items-center gap-4 group">
                  <div className="w-10 h-10 rounded-xl bg-white/[0.03] flex items-center justify-center text-[#6eDD86]">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-bold font-grotesk">Secure Payments</span>
                    <span className="text-[10px] text-gray-500 font-inter uppercase tracking-widest">AES-256 Encryption</span>
                  </div>
                </div>

                <div className="flex items-center gap-4 group">
                  <div className="w-10 h-10 rounded-xl bg-white/[0.03] flex items-center justify-center text-[#6eDD86]">
                    <CheckCircle className="w-5 h-5" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-bold font-grotesk">Official Partner</span>
                    <span className="text-[10px] text-gray-500 font-inter uppercase tracking-widest">Microsoft Certified</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 🔥 Login Toast */}
        {showLoginMsg && (
          <div className="fixed bottom-10 right-10 bg-red-500 text-white px-6 py-3 rounded-xl shadow-lg z-50">
            Please login to continue
          </div>
        )}
      </div>
    </div>
  );
}