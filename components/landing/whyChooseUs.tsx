"use client";

import { ShieldCheck, Headphones, Zap, Lock } from "lucide-react";

export default function WhyChooseUs() {
  return (
    <section className="relative w-full min-h-dvh bg-(--bg-dark) py-30 flex items-center justify-center overflow-hidden">

      {/* 🌟 Radial Glow Background */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-[700px] h-[700px] bg-[radial-gradient(circle,rgba(110,221,134,0.25)_0%,transparent_70%)] blur-3xl"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 w-[80dvw] flex flex-col items-center gap-16">

        {/* Heading */}
        <div className="text-center">
          <h1 className="text-4xl lg:text-5xl font-bold font-grotesk text-[var(--text-main)]">
            Why people choose <span className="text-[var(--accent)]">InnovixLLC</span>
          </h1>
          <p className="mt-4 text-xl text-[var(--text-main)]/60 font-inter">
            Superior service and unmatched reliability at every step of your digital journey.
          </p>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 w-full">

          {/* Card */}
          {[
            {
              icon: <ShieldCheck size={22} />,
              title: "Authentic Licenses",
              desc: "100% genuine Microsoft products with lifetime activation guarantees and full legal compliance.",
            },
            {
              icon: <Headphones size={22} />,
              title: "24/7 Expert Support",
              desc: "Get help from human experts any time of day or night. We don’t stop until your issue is resolved."
            },
            {
              icon: <Zap size={22} />,
              title: "Instant Delivery",
              desc: "No waiting. Receive your digital keys via email within 60 seconds of a successful checkout.",
            },
            {
              icon: <Lock size={22} />,
              title: "Secure Payments",
              desc: "Shop with confidence using enterprise-grade encrypted payment gateways including Stripe and PayPal.",
            },
          ].map((item, i) => (
            <div
              key={i}
              className={`group p-6 rounded-2xl transition-all duration-300 
              bg-[var(--bg-less-dark)]/60 backdrop-blur-md border  border-(--text-main)/5 hover:border-[var(--accent)]`}
            >
              {/* Icon */}
              <div className="w-15 h-15 flex items-center justify-center rounded-full bg-[var(--accent)]/10 text-[var(--accent)] mb-4">
                {item.icon}
              </div>

              {/* Title */}
              <h3 className="text-xl font-semibold text-[var(--text-main)] font-grotesk">
                {item.title}
              </h3>

              {/* Description */}
              <p className="mt-2 text-lg text-[var(--text-main)]/60 font-inter leading-relaxed">
                {item.desc}
              </p>
            </div>
          ))}

        </div>
      </div>
    </section>
  );
}