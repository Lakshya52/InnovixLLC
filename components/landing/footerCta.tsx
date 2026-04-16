"use client";

import React from "react";
import Link from "next/link";
import { ShoppingCart, Headphones, Zap, ShieldCheck, Headset } from "lucide-react";

export default function FooterCTA() {
  return (
    <>
      <div className="flex items-center justify-center w-full overflow-hidden relative " >
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-(--accent)/5 rounded-full blur-[120px] pointer-events-none" />
        <section className=" w-[80dvw] py-24 px-4 md:px-8 ">
          {/* Decorative background effects */}

          <div className="max-w-5xl mx-auto relative z-10 text-center">
            {/* Optimized Badge */}
            <div className="inline-flex items-center px-4 py-1.5 rounded-full border border-(--accent)/30 bg-(--accent)/5 mb-10 transition-transform hover:scale-105 duration-300">
              <span className="text-(--accent) text-xs font-bold tracking-[0.2em] font-inter uppercase">
                Performance Optimized
              </span>
            </div>

            {/* Heading */}
            <h2 className="text-4xl md:text-7xl font-bold text-(--text-main) mb-8 leading-tight font-grotesk tracking-tight">
              Ready to Power Up Your <br />
              <span className="text-(--accent)">Digital Workspace?</span>
            </h2>

            {/* Subtitle */}
            <p className="text-gray-400 text-lg md:text-xl max-w-3xl mx-auto mb-12 font-inter leading-relaxed">
              Join thousands of satisfied users. Get instant license delivery, expert
              24/7 technical assistance, and the world's most powerful productivity tools.
            </p>

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mb-20">
              <Link href="/products" className="button-green" >
                Shop All Products
                <ShoppingCart className="w-5 h-5 transition-transform group-hover:translate-x-1" />
              </Link>

              <Link href="/chatbot" className="button-dark" >
                Live Technical Chat
                <Headset className="w-5 h-5 group-hover:scale-110 transition-transform" />
              </Link>
            </div>

            {/* Feature Icons */}
            <div className="flex flex-wrap items-center justify-center gap-x-12 gap-y-6 pt-10 border-t border-(--text-main)/5">
              <div className="flex items-center gap-2 text-gray-400 group hover:text-(--accent) transition-colors">
                <Zap className="w-5 h-5 text-(--accent)" />
                <span className="text-xs font-bold tracking-widest uppercase font-inter">60s Delivery</span>
              </div>

              <div className="hidden sm:block w-1.5 h-1.5 rounded-full bg-(--text-main)/10" />

              <div className="flex items-center gap-2 text-gray-400 group hover:text-(--accent) transition-colors">
                <ShieldCheck className="w-5 h-5 text-(--accent)" />
                <span className="text-xs font-bold tracking-widest uppercase font-inter">Secure Payments</span>
              </div>

              <div className="hidden sm:block w-1.5 h-1.5 rounded-full bg-(--text-main)/10" />

              <div className="flex items-center gap-2 text-gray-400 group hover:text-(--accent) transition-colors">
                <Headphones className="w-5 h-5 text-(--accent)" />
                <span className="text-xs font-bold tracking-widest uppercase font-inter">24/7 Support</span>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>

  );
}
