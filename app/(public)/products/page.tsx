"use client";

import React, { useState } from "react";
import {
  Search,
  ArrowUpRight,
  Zap,
  Headphones,
  ShieldCheck,
  CheckCircle,
  Monitor,
  Briefcase,
  Database,
  LayoutGrid,
  ListFilterPlus,
} from "lucide-react";
import { products } from "@/lib/products";
import { ProductCard } from "@/components/product-card";

const categories = ["All", "Windows", "Office Suite", "Servers", "Developer Tools"];

const categoryIcons: Record<string, React.ReactNode> = {
  "Windows": <Monitor className="w-10 h-10 text-[#6eDD86]" />,
  "Office Suite": <Briefcase className="w-10 h-10 text-[#6eDD86]" />,
  "Servers": <Database className="w-10 h-10 text-[#6eDD86]" />,
  "Developer Tools": <LayoutGrid className="w-10 h-10 text-[#6eDD86]" />
};

export default function ProductsPage() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("Popular");

  const filteredProducts = products
    .filter(product => {
      const matchesCategory = activeCategory === "All" || product.category === activeCategory;
      const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    })
    .sort((a, b) => {
      if (sortBy === "Price: Low to High") {
        return parseFloat(a.price) - parseFloat(b.price);
      }
      if (sortBy === "Price: High to Low") {
        return parseFloat(b.price) - parseFloat(a.price);
      }
      if (sortBy === "Name: A-Z") {
        return a.name.localeCompare(b.name);
      }
      if (sortBy === "Popular") {
        return (b.isBestseller ? 1 : 0) - (a.isBestseller ? 1 : 0);
      }
      return 0;
    });

  return (
    <div className="bg-(--bg-dark) w-full min-h-screen text-white pt-32 pb-20 ">
      <div className=" w-[80dvw] mx-auto">
        {/* Header Section */}
        <div className="mb-10">
          <h1 className="text-5xl md:text-7xl font-bold font-grotesk mb-6">
            Premium <span className="text-[#6eDD86]">Digital</span> Solutions
          </h1>
          <p className="text-gray-400 text-xl max-w-2xl font-inter leading-relaxed">
            High-performance Microsoft enterprise software and operating systems
            tailored for professional scale and reliability.
          </p>
        </div>

        {/* Search & Filter Bar */}
        <div className="flex flex-col gap-8 mb-16">
          <div className="relative group ">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 transition-colors group-focus-within:text-[#6eDD86]" />
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white/[0.03] border border-white/10 rounded-full py-5 pl-16 pr-8 text-lg focus:outline-none focus:border-[#6eDD86]/50 transition-all font-inter"
            />
          </div>

          <div className="flex flex-wrap items-center justify-between gap-6">
            <div className="flex flex-wrap gap-3">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-6 py-2.5 rounded-full text-lg font-bold transition-all duration-300 font-inter ${activeCategory === cat
                    ? "bg-[#6eDD86] text-black"
                    : "bg-white/[0.05] text-gray-400 hover:bg-white/[0.1] hover:text-white border border-white/5"
                    }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2 py-2">
              <span className="text-lg font-inter flex items-center justify-center gap-2 "> <ListFilterPlus size={18} /> Sort by</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="text-white text-lg font-bold cursor-pointer w-[100px]"
              >
                <option className="bg-[#1b1b1b]" value="Popular">Popular</option>
                <option className="bg-[#1b1b1b]" value="Price: Low to High">Price: Low to High</option>
                <option className="bg-[#1b1b1b]" value="Price: High to Low">Price: High to Low</option>
                <option className="bg-[#1b1b1b]" value="Name: A-Z">Name: A-Z</option>
              </select>
            </div>
          </div>
        </div>

        {/* Product Grid */}
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-8 mb-16">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                categoryIcon={categoryIcons[product.category]}
              />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-40 text-center bg-white/[0.01] border border-dashed border-white/10 rounded-[60px] mb-32">
            <h3 className="text-3xl font-bold font-grotesk mb-4 text-white">No products found</h3>
            <p className="text-gray-400 font-inter max-w-md mx-auto mb-10">
              We couldn't find any software matching "<span className="text-[#6eDD86]">{searchQuery}</span>" in the <span className="text-white">{activeCategory}</span> category.
            </p>
            <button
              onClick={() => { setSearchQuery(""); setActiveCategory("All"); }}
              className="text-[#6eDD86] font-bold font-inter underline underline-offset-8 hover:text-[#5dbb72] transition-colors"
            >
              Clear all filters
            </button>
          </div>
        )}

        {/* Volume Licensing Section */}
        <div className="relative z-0 group rounded-[50px] overflow-hidden p-8 md:p-16 mb-32">

          {/* 🔥 Rotated Background */}
          <div
            className="absolute inset-0 -z-10"
            style={{
              backgroundImage: "url('/BlogsGradient.png')",
              backgroundSize: "cover",
              backgroundPosition: "center",
              transform: "rotate(180deg)"
            }}
          />

          {/* Noise Layer */}
          <div className="absolute inset-0 opacity-10 mix-blend-soft-light pointer-events-none">
            <svg className="w-full h-full">
              <filter id="noiseFilter">
                <feTurbulence
                  type="fractalNoise"
                  baseFrequency="1"
                  numOctaves="10"
                  stitchTiles="stitch"
                />
              </filter>
              <rect width="100%" height="100%" filter="url(#noiseFilter)" />
            </svg>
          </div>

          {/* Glow Effect */}
          <div className="absolute top-1/2 right-0 -translate-y-1/2 w-[500px] h-[500px] bg-[#6edd86]/5 rounded-full blur-[100px] transition-transform duration-1000 group-hover:scale-125" />

          {/* Content */}
          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-12">

            <div className="max-w-3/5 text-center md:text-left">
              <h2 className="text-4xl md:text-6xl font-bold font-grotesk mb-6 leading-tight text-white">
                Need Volume Licensing?
              </h2>
              <p className="text-white text-lg md:text-xl font-inter leading-relaxed">
                InnovixLLC provides custom enterprise solutions for businesses of all sizes.
                Get exclusive pricing on bulk digital assets and dedicated support from our expert team.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-6">
              <button className="bg-[#6eDD86] hover:bg-[#5dbb72] text-black font-bold py-5 px-10 rounded-full transition-all duration-300 shadow-[0_0_20px_rgba(110,221,134,0.3)] font-grotesk text-lg">
                Contact Us
              </button>
              <button className="bg-white/[0.05] hover:bg-white/[0.1] text-white font-bold py-5 px-10 rounded-full transition-all duration-300 border border-white/10 font-grotesk text-lg">
                About Us
              </button>
            </div>

          </div>
        </div>

        {/* Footer Features */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {[
            { icon: <Zap className="w-6 h-6" />, title: "Instant Delivery", desc: "Your keys delivered in seconds" },
            { icon: <Headphones className="w-6 h-6" />, title: "24/7 Expert Support", desc: "Expert help always available" },
            { icon: <ShieldCheck className="w-6 h-6" />, title: "Secure Payments", desc: "100% AES-256 Encryption" },
            { icon: <CheckCircle className="w-6 h-6" />, title: "Official Partner", desc: "Microsoft Certified Partner" }
          ].map((feature, i) => (
            <div key={i} className="flex flex-col gap-4 group">
              <div className="w-12 h-12 rounded-2xl bg-white/[0.03] border border-white/5 flex items-center justify-center text-[#6eDD86] group-hover:bg-[#6eDD86]/10 group-hover:scale-110 transition-all duration-300">
                {feature.icon}
              </div>
              <div className="space-y-1">
                <h4 className="font-bold font-grotesk text-white">{feature.title}</h4>
                <p className="text-xs text-gray-500 font-inter uppercase tracking-widest">{feature.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
