"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { CheckCircle2, ArrowRight, Package, Download, ShieldCheck } from "lucide-react";
import { useCart } from "@/context/CartContext";

export default function OrderSuccessPage() {
  const { clearCart } = useCart();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    clearCart();
  }, []);

  if (!mounted) return null;

  return (
    <div className="h-full  text-white  px-6 flex flex-col items-center justify-center text-center">
      <div className="absolute inset-0 bg-[#6eDD86]/5 blur-[120px] rounded-full -z-10" />
      
      <div className=" flex items-center justify-center relative ">
        <div className="w-24 h-24 bg-[#6eDD86]/10 rounded-full flex items-center justify-center  border border-[#6eDD86]/20 animate-in zoom-in duration-500">
          <CheckCircle2 className="w-12 h-12 text-[#6eDD86] absolute" />
        </div>
        <div className="  w-30 h-30 bg-[#6eDD86] rounded-full animate-ping opacity-20 absolute" />
      </div>

      <h1 className="text-5xl md:text-6xl font-bold font-grotesk mb-6 tracking-tight mt-8">
        Payment <span className="text-[#6eDD86]">Successful!</span>
      </h1>
      
      <p className="text-gray-400 font-inter text-lg max-w-2xl leading-relaxed mb-12">
        Thank you for choosing InnovixLLC. Your order has been processed successfully. Your digital keys have been generated and are now available in your dashboard.
      </p>

      {/* <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-4xl mb-16">
        {[
          { icon: <Package className="text-[#6eDD86]" size={24} />, title: "Instant Access", desc: "Digital keys generated" },
          { icon: <Download className="text-[#6eDD86]" size={24} />, title: "Ready for Use", desc: "Download available" },
          { icon: <ShieldCheck className="text-[#6eDD86]" size={24} />, title: "Secure Order", desc: "Verified & Encrypted" }
        ].map((item, i) => (
          <div key={i} className="bg-white/[0.03] border border-white/5 p-6 rounded-3xl backdrop-blur-sm">
            <div className="w-12 h-12 bg-black/40 rounded-2xl flex items-center justify-center mb-4 mx-auto border border-white/5">
              {item.icon}
            </div>
            <h3 className="font-bold font-grotesk text-white mb-2">{item.title}</h3>
            <p className="text-xs text-gray-500 font-inter uppercase tracking-wider">{item.desc}</p>
          </div>
        ))}
      </div> */}

      <div className="flex flex-col sm:flex-row items-center gap-6">
        <Link
          href="/keys"
          className="bg-[#6eDD86] hover:bg-[#5dbb72] text-black font-bold py-4 px-10 rounded-2xl transition-all duration-300 shadow-[0_0_30px_rgba(110,221,134,0.4)] flex items-center gap-2 group"
        >
          View My Keys
          <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
        </Link>
        <Link
          href="/products"
          className="bg-white/[0.05] hover:bg-white/[0.1] text-white font-bold py-4 px-10 rounded-2xl transition-all duration-300 border border-white/10"
        >
          Continue Shopping
        </Link>
      </div>
    </div>
  );
}
