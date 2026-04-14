"use client";

import React, { useState } from "react";
import {
  Search,
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
import { ProductCard } from "@/components/product-card";

interface Product {
    id: string;
    name: string;
    description: string | null;
    category: string;
    price: number;
    status: string;
}

const categories = ["All", "OS", "Office", "Servers", "Security"];

const categoryIcons: Record<string, React.ReactNode> = {
  "OS": <Monitor className="w-10 h-10 text-[#6eDD86]" />,
  "Office": <Briefcase className="w-10 h-10 text-[#6eDD86]" />,
  "Servers": <Database className="w-10 h-10 text-[#6eDD86]" />,
  "Security": <LayoutGrid className="w-10 h-10 text-[#6eDD86]" />
};

export default function ProductsClient({ initialProducts }: { initialProducts: Product[] }) {
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("Popular");

  const filteredProducts = initialProducts
    .filter(product => {
      const matchesCategory = activeCategory === "All" || product.category === activeCategory;
      const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    })
    .sort((a, b) => {
      if (sortBy === "Price: Low to High") return a.price - b.price;
      if (sortBy === "Price: High to Low") return b.price - a.price;
      if (sortBy === "Name: A-Z") return a.name.localeCompare(b.name);
      return 0;
    });

  return (
    <div className="bg-[#0b0b0b] w-full min-h-screen text-white pt-40 pb-20">
      <div className="w-[85dvw] mx-auto max-w-[1400px]">
        {/* Header Section */}
        <div className="mb-12">
          <h1 className="text-6xl md:text-8xl font-bold font-grotesk mb-8 tracking-tight">
            Premium <span className="text-[#6eDD86]">Digital</span> Solutions
          </h1>
          <p className="text-[#a0a0a0] text-xl max-w-2xl font-inter leading-relaxed">
            High-performance Microsoft enterprise software and operating systems
            tailored for professional scale and reliability.
          </p>
        </div>

        {/* Search & Filter Bar */}
        <div className="flex flex-col gap-10 mb-20">
          <div className="relative group">
            <Search className="absolute left-8 top-1/2 -translate-y-1/2 w-6 h-6 text-gray-600 transition-colors group-focus-within:text-[#6eDD86]" />
            <input
              type="text"
              placeholder="Search products, licenses, or packages..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#121212] border border-[#1f1f1f] rounded-full py-6 pl-20 pr-10 text-xl focus:outline-none focus:border-[#6eDD86]/30 transition-all font-inter shadow-2xl"
            />
          </div>

          <div className="flex flex-wrap items-center justify-between gap-8 border-t border-[#1f1f1f] pt-10">
            <div className="flex flex-wrap gap-4">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-8 py-3 rounded-2xl text-sm font-bold transition-all duration-300 font-inter border ${activeCategory === cat
                    ? "bg-[#6eDD86] text-black border-[#6eDD86]"
                    : "bg-[#121212] text-gray-500 hover:text-white border-[#1f1f1f]"
                    }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-4 bg-[#121212] px-6 py-3 rounded-2xl border border-[#1f1f1f]">
              <span className="text-gray-500 text-xs font-bold flex items-center gap-2"> <ListFilterPlus size={16} /> SORT BY</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-transparent text-[#e2e2e2] text-sm font-bold cursor-pointer outline-none"
              >
                <option value="Popular">Popularity</option>
                <option value="Price: Low to High">Price Min</option>
                <option value="Price: High to Low">Price Max</option>
                <option value="Name: A-Z">Name A-Z</option>
              </select>
            </div>
          </div>
        </div>

        {/* Product Grid */}
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10 mb-32">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={{
                  ...product,
                  price: product.price.toString(),
                  category: product.category,
                  isBestseller: false, // Placeholder for logic
                  features: ["Lifetime Activation", "Direct Support", "256-bit Encryption"]
                } as any}
                categoryIcon={categoryIcons[product.category]}
              />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-40 text-center bg-[#121212]/30 border border-dashed border-[#1f1f1f] rounded-[60px] mb-32">
            <h3 className="text-3xl font-bold font-grotesk mb-4 text-white">No products found</h3>
            <p className="text-gray-500 font-inter max-w-md mx-auto mb-10">
              We couldn't find any software matching "<span className="text-[#6eDD86]">{searchQuery}</span>"
            </p>
            <button
              onClick={() => { setSearchQuery(""); setActiveCategory("All"); }}
              className="text-[#6eDD86] font-bold font-inter underline underline-offset-8 hover:text-[#5dbb72] transition-colors"
            >
              Clear all filters
            </button>
          </div>
        )}

        {/* Footer Features */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {[
            { icon: <Zap className="w-6 h-6" />, title: "Instant Delivery", desc: "Your keys delivered in seconds" },
            { icon: <Headphones className="w-6 h-6" />, title: "24/7 Expert Support", desc: "Expert help always available" },
            { icon: <ShieldCheck className="w-6 h-6" />, title: "Secure Payments", desc: "100% AES-256 Encryption" },
            { icon: <CheckCircle className="w-6 h-6" />, title: "Official Partner", desc: "Microsoft Certified Partner" }
          ].map((feature, i) => (
            <div key={i} className="flex flex-col gap-4 p-8 bg-[#121212] border border-[#1f1f1f] rounded-3xl hover:border-[#6eDD86]/30 transition-all group">
              <div className="w-12 h-12 rounded-2xl bg-[#0d0d0d] border border-[#1f1f1f] flex items-center justify-center text-[#6eDD86] group-hover:scale-110 transition-all duration-300">
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
