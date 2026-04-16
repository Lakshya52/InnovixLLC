"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Trash2,
  Plus,
  Minus,
  ArrowRight,
  ShieldCheck,
  ShoppingCart,
  ArrowLeft,
  CreditCard,
  Target,
  Info,
  CheckCircle2,
  Lock,
  BadgeCheck
} from "lucide-react";
import { useCart } from "@/context/CartContext";
import { createCheckoutSession, createOrderDirect } from "@/actions/checkout";

export default function CartPage() {
  const { cart, removeFromCart, updateQuantity, cartTotal, cartCount } = useCart();
  const router = useRouter();

  const [paymentMethod, setPaymentMethod] = useState("stripe");
  const [showLoginMsg, setShowLoginMsg] = useState(false);
  const [countdown, setCountdown] = useState(3);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!showLoginMsg) return;

    if (countdown === 0) {
      router.push("/registration");
      return;
    }

    const timer = setTimeout(() => {
      setCountdown((prev) => prev - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [showLoginMsg, countdown, router]);

  const handleCheckout = async () => {
    setLoading(true);
    try {
      const items = cart.map(item => ({
        productId: item.product.id,
        quantity: 1 // For digital assets quantity is usually 1
      }));

      if (paymentMethod === "stripe") {
        const { url } = await createCheckoutSession(items);
        if (url) {
          window.location.href = url;
        } else {
          throw new Error("Failed to create checkout session");
        }
      } else {
        // Direct order / PayPal integration
        const res = await createOrderDirect(items);
        if (res?.url) {
          window.location.href = res.url;
        } else {
          throw new Error("Failed to initialize PayPal order");
        }
      }
    } catch (err: any) {
      console.error("Checkout error:", err);
      if (err.message.includes("log in") || err.message.includes("Unauthorized")) {
        setShowLoginMsg(true);
        setCountdown(3);
      } else {
        alert(err.message || "Checkout failed. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  if (cart.length === 0) {
    return (
      <div className="bg-(--bg-dark) min-h-screen text-(--text-main) pt-40 pb-20 w-full px-6 flex flex-col items-center justify-center text-center">
        <div className="w-24 h-24 bg-(--text-main)/[0.03] rounded-full flex items-center justify-center mb-8 border border-(--text-main)/5 animate-pulse">
          <ShoppingCart className="w-10 h-10 text-(--accent)" />
        </div>
        <h1 className="text-4xl font-bold font-grotesk mb-4">Your cart is empty</h1>
        <p className="text-gray-400 font-inter mb-10 max-w-md">
          Looks like you haven't added any premium digital solutions yet. Explore our products to find the perfect fit.
        </p>
        <Link
          href="/products"
          className="button-green py-4 px-10 rounded-full group"
        >
          Browse Products
          <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-(--bg-dark) min-h-screen text-(--text-main) pt-32 pb-20 px-6 lg:px-12 relative overflow-hidden">
      {/* Background blobs for premium feel */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-(--accent)/5 blur-[120px] rounded-full -z-10" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-(--accent)/5 blur-[100px] rounded-full -z-10" />

      <div className="w-full max-w-7xl mx-auto relative z-10">
        {/* Header Section */}
        <div className="mb-10 md:mb-16 text-center md:text-left">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold font-grotesk mb-4 tracking-tight">
            Secure <span className="text-(--accent)">Checkout</span>
          </h1>
          <p className="text-gray-400 font-inter text-md max-w-2xl leading-relaxed">
            Complete your order for InnovixLLC high-performance digital infrastructure. Your digital assets will be available immediately after verification.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">

          {/* Left: Your Cart Section */}
          <div className="lg:col-span-7">
            <div className="bg-(--text-main)/[0.03] border border-(--text-main)/10 rounded-[30px] md:rounded-[40px] p-5 sm:p-8 md:p-10 backdrop-blur-xl">
              <div className="flex items-center gap-3 mb-10">
                <ShoppingCart className="text-(--accent)" size={24} />
                <h2 className="text-2xl font-bold font-grotesk">Your Cart</h2>
              </div>

              <div className="space-y-6">
                {cart.map((item) => (
                  <div
                    key={item.product.id}
                    className="group bg-(--text-main)/[0.02] border border-(--text-main)/5 rounded-3xl p-4 sm:p-6 flex flex-col sm:flex-row items-center gap-4 sm:gap-6 transition-all hover:bg-(--text-main)/[0.05] hover:border-(--text-main)/10"
                  >
                    <div className="w-full sm:w-24 h-40 sm:h-24 rounded-2xl overflow-hidden bg-(--text-main)/5 p-4 sm:p-2 shrink-0">
                      <img
                        src={item.product.image}
                        alt={item.product.name}
                        className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-500"
                      />
                    </div>

                    <div className="flex-1 w-full text-center sm:text-left">
                      <h3 className="text-lg sm:text-xl font-bold font-grotesk text-(--text-main) group-hover:text-(--accent) transition-colors">
                        {item.product.name}
                      </h3>
                      <p className="text-gray-500 text-sm font-inter mt-1">
                        {item.product.subCategory}
                      </p>
                    </div>

                    <div className="flex items-center justify-between w-full sm:w-auto gap-4 sm:gap-6 pt-4 sm:pt-0 border-t border-(--text-main)/5 sm:border-0 mt-2 sm:mt-0">
                      <div className="text-xl font-bold font-grotesk whitespace-nowrap">
                        ${item.product.price}
                      </div>
                      <button
                        onClick={() => removeFromCart(item.product.id)}
                        className="w-10 h-10 flex items-center justify-center text-gray-600 hover:text-red-500 hover:bg-red-500/10 rounded-full transition-all"
                      >
                        <Trash2 size={20} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right: Order Summary Section */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-(--text-main)/[0.03] border border-(--text-main)/10 rounded-[30px] md:rounded-[50px] p-6 md:p-10 backdrop-blur-2xl relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-[1px] bg-linear-to-r from-transparent via-(--accent)/50 to-transparent" />

              <h2 className="text-2xl font-bold font-grotesk mb-10">Order Summary</h2>

              <div className="space-y-5 mb-10 border-b border-(--text-main)/5 pb-10">
                <div className="flex justify-between items-center text-gray-400 font-inter">
                  <span className="text-lg">Subtotal</span>
                  <span className="text-(--text-main) font-bold text-lg">${cartTotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center text-gray-400 font-inter">
                  <span className="text-lg">Digital Delivery</span>
                  <span className="text-(--accent) font-bold text-sm tracking-widest uppercase">FREE</span>
                </div>
                <div className="flex justify-between items-center text-gray-400 font-inter">
                  <span className="text-lg">Tax (0.00%)</span>
                  <span className="text-(--text-main) font-bold text-lg">$0.00</span>
                </div>
              </div>

              <div className="flex justify-between items-baseline mb-12">
                <span className="text-xl md:text-2xl font-bold font-grotesk">Total</span>
                <span className="text-4xl md:text-5xl font-bold font-grotesk text-(--accent) tracking-tight">
                  ${cartTotal.toFixed(2)}
                </span>
              </div>

              {/* Payment Method */}
              <div className="space-y-4 mb-10">
                <p className="text-sm font-medium text-gray-400 ml-1">Payment Method</p>
                <div className="space-y-3">
                  <label
                    className={`flex items-center justify-between p-5 rounded-2xl border cursor-pointer transition-all ${paymentMethod === "stripe"
                      ? "border-(--accent) bg-(--accent)/5"
                      : "border-(--text-main)/5 bg-(--text-main)/[0.02] hover:bg-(--text-main)/[0.05]"
                      }`}
                  >
                    <div className="flex items-center gap-4">
                      <CreditCard className={paymentMethod === "stripe" ? "text-(--accent)" : "text-gray-500"} size={20} />
                      <span className={`font-bold font-inter ${paymentMethod === "stripe" ? "text-(--text-main)" : "text-gray-400"}`}>Stripe</span>
                    </div>
                    <input
                      type="radio"
                      name="payment"
                      value="stripe"
                      checked={paymentMethod === "stripe"}
                      onChange={() => setPaymentMethod("stripe")}
                      className="peer hidden"
                    />
                    <div className={`w-5 h-5 rounded-full border-2 border-(--text-main)/10 flex items-center justify-center ${paymentMethod === "stripe" ? "border-(--accent)" : ""}`}>
                      {paymentMethod === "stripe" && <div className="w-2.5 h-2.5 rounded-full bg-(--accent)" />}
                    </div>
                  </label>

                  <label
                    className={`flex items-center justify-between p-5 rounded-2xl border cursor-pointer transition-all ${paymentMethod === "paypal"
                      ? "border-(--accent) bg-(--accent)/5"
                      : "border-(--text-main)/5 bg-(--text-main)/[0.02] hover:bg-(--text-main)/[0.05]"
                      }`}
                  >
                    <div className="flex items-center gap-4">
                      <Target className={paymentMethod === "paypal" ? "text-(--accent)" : "text-gray-500"} size={20} />
                      <span className={`font-bold font-inter ${paymentMethod === "paypal" ? "text-(--text-main)" : "text-gray-400"}`}>PayPal</span>
                    </div>
                    <input
                      type="radio"
                      name="payment"
                      value="paypal"
                      checked={paymentMethod === "paypal"}
                      onChange={() => setPaymentMethod("paypal")}
                      className="peer hidden"
                    />
                    <div className={`w-5 h-5 rounded-full border-2 border-(--text-main)/10 flex items-center justify-center ${paymentMethod === "paypal" ? "border-(--accent)" : ""}`}>
                      {paymentMethod === "paypal" && <div className="w-2.5 h-2.5 rounded-full bg-(--accent)" />}
                    </div>
                  </label>
                </div>
              </div>

              <button
                onClick={handleCheckout}
                disabled={loading}
                className={`w-full bg-(--accent) hover:bg-(--accent) text-(--bg-dark) font-bold py-6 rounded-3xl transition-all duration-300 shadow-[0_0_30px_rgba(110,221,134,0.4)] font-grotesk text-xl flex items-center justify-center gap-3 group relative overflow-hidden ${loading ? "opacity-70 cursor-not-allowed" : ""}`}
              >
                <span className="relative z-10">{loading ? "Processing..." : "Complete Purchase"}</span>
                {!loading && <ArrowRight className="w-6 h-6 relative z-10 transition-transform group-hover:translate-x-1" />}
              </button>

              {showLoginMsg && (
                <div className="mt-8 p-4 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-center gap-3 animate-in fade-in slide-in-from-top-2">
                  <Info className="text-red-500" size={20} />
                  <p className="text-red-400 font-bold text-sm font-inter">
                    Please login to continue. Redirecting in {countdown}...
                  </p>
                </div>
              )}

              {/* Trust Badges */}
              <div className="space-y-4 mt-12">
                <div className="bg-(--text-main)/[0.02] border border-(--text-main)/5 p-4 rounded-2xl flex items-center gap-4 group hover:bg-(--text-main)/[0.05] transition-colors">
                  <Lock className="text-(--accent)" size={20} />
                  <span className="text-[10px] font-bold font-inter tracking-[0.2em] uppercase text-gray-400">Secure SSL Encryption</span>
                </div>
                <div className="bg-(--text-main)/[0.02] border border-(--text-main)/5 p-4 rounded-2xl flex items-center gap-4 group hover:bg-(--text-main)/[0.05] transition-colors">
                  <BadgeCheck className="text-(--accent)" size={20} />
                  <span className="text-[10px] font-bold font-inter tracking-[0.2em] uppercase text-gray-400">Microsoft Certified Partner</span>
                </div>
              </div>
            </div>

            {/* Disclaimer Box */}
            <div className="bg-(--text-main)/[0.02] border border-(--text-main)/5 p-6 rounded-[30px] flex gap-4">
              <Info className="text-gray-500 shrink-0 mt-1" size={20} />
              <p className="text-[11px] text-gray-500 font-inter leading-relaxed uppercase tracking-wider">
                By clicking "Complete Purchase", you agree to our <Link href="/terms" className="text-(--text-main) hover:underline">Terms of Service</Link> and <Link href="/privacy" className="text-(--text-main) hover:underline">Refund Policy</Link>. Digital keys will be delivered to your registered email immediately after payment verification.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}