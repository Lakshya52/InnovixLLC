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
  "OS": <Monitor className="w-10 h-10 text-(--accent)" />,
  "Office": <Briefcase className="w-10 h-10 text-(--accent)" />,
  "Servers": <Database className="w-10 h-10 text-(--accent)" />,
  "Security": <LayoutGrid className="w-10 h-10 text-(--accent)" />
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
    <div className=" w-full min-h-screen text-(--text-main) pt-5 mt-[15dvh] pb-20">
      <div className="w-[80dvw] mx-auto ">
        {/* Header Section */}
        <div className="mb-5">
          <h1 className=" text-4xl lg:text-5xl font-bold font-grotesk mb-8 tracking-tight">
            Premium <span className="text-(--accent)">Digital</span> Solutions
          </h1>
          <p className="text-(--text-main) text-xl max-w-2xl font-inter leading-relaxed">
            High-performance Microsoft enterprise software and operating systems
            tailored for professional scale and reliability.
          </p>
        </div>

        {/* Search & Filter Bar */}
        <div className="flex flex-col gap-2 mb-20">
          <div className="relative group">
            <Search className="absolute left-8 top-1/2 -translate-y-1/2 w-6 h-6 text-gray-600 transition-colors group-focus-within:text-(--accent)" />
            <input
              type="text"
              placeholder="Search products, licenses, or packages..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-(--bg-dark) border border-(--bg-dark) rounded-full py-6 pl-20 pr-10 text-xl focus:outline-none focus:border-(--accent)/30 transition-all font-inter shadow-2xl"
            />
          </div>

          <div className="flex flex-wrap items-center justify-between gap-8 pt-5">
            <div className="flex flex-wrap gap-4">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-8 py-3 rounded-2xl text-sm font-bold transition-all duration-300 font-inter border ${activeCategory === cat
                    ? "bg-(--accent) text-(--bg-dark) border-(--accent)"
                    : "bg-(--bg-dark) text-gray-500 hover:text-(--text-main) border-(--bg-dark)"
                    }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-4 bg-(--bg-dark) px-6 py-3 rounded-2xl border border-(--bg-dark)">
              <span className="text-gray-500 text-xs font-bold flex items-center gap-2"> <ListFilterPlus size={16} /> SORT BY</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-transparent text-(--text-main) text-sm font-bold cursor-pointer outline-none"
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2 mb-32">
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
          <div className="flex flex-col items-center justify-center py-40 text-center bg-(--bg-dark)/30 border border-dashed border-(--bg-dark) rounded-[60px] mb-32">
            <h3 className="text-3xl font-bold font-grotesk mb-4 text-(--text-main)">No products found</h3>
            <p className="text-gray-500 font-inter max-w-md mx-auto mb-10">
              We couldn't find any software matching "<span className="text-(--accent)">{searchQuery}</span>"
            </p>
            <button
              onClick={() => { setSearchQuery(""); setActiveCategory("All"); }}
              className="text-(--accent) font-bold font-inter underline underline-offset-8 hover:text-(--accent) transition-colors"
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
            <div key={i} className="flex flex-col gap-4 p-8 bg-(--bg-dark) border border-(--bg-dark) rounded-3xl hover:border-(--accent)/30 transition-all group">
              <div className="w-12 h-12 rounded-2xl bg-(--bg-dark) border border-(--bg-dark) flex items-center justify-center text-(--accent) group-hover:scale-110 transition-all duration-300">
                {feature.icon}
              </div>
              <div className="space-y-1">
                <h4 className="font-bold font-grotesk text-(--text-main)">{feature.title}</h4>
                <p className="text-xs text-gray-500 font-inter uppercase tracking-widest">{feature.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
