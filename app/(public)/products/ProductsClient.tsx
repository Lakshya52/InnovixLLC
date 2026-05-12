"use client";

import React, { useState } from "react";
import {
  Search,
  Zap,
  Headphones,
  ShieldCheck,
  CheckCircle,
  LayoutGrid,
  ListFilterPlus,
  Monitor,
  Briefcase,
  Database,
  Lock,
} from "lucide-react";
import { ProductCard } from "@/components/product-card";
import { useMemo, useEffect, useCallback } from "react";
import { Plus, Loader2 } from "lucide-react";
import { getProducts } from "@/app/actions/product-actions";

interface Product {
  id: string;
  name: string;
  description: string | null;
  category: string;
  price: number;
  status: string;
}

const categories = ["All", "Operating System", "Productivity", "RDS", "Security & Privacy"];

const categoryIcons: Record<string, React.ReactNode> = {
  "Operating System": <Monitor className="w-10 h-10 text-(--accent)" />,
  "Productivity": <Briefcase className="w-10 h-10 text-(--accent)" />,
  "RDS": <Database className="w-10 h-10 text-(--accent)" />,
  "Security & Privacy": <Lock className="w-10 h-10 text-(--accent)" />
};

export default function ProductsClient({ 
  initialProducts, 
  initialTotalCount 
}: { 
  initialProducts: Product[], 
  initialTotalCount: number 
}) {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [totalCount, setTotalCount] = useState(initialTotalCount);
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("Popular");
  const [isLoading, setIsLoading] = useState(false);
  const [isInitialLoading, setIsInitialLoading] = useState(false);

  const fetchProducts = useCallback(async (isInitial: boolean, currentSearch: string, currentCategory: string, currentSort: string) => {
    if (isInitial) setIsInitialLoading(true);
    else setIsLoading(true);

    const skip = isInitial ? 0 : products.length;
    const result = await getProducts({
      skip,
      limit: 5,
      search: currentSearch,
      category: currentCategory,
      sortBy: currentSort
    });

    if (isInitial) {
      setProducts(result.products);
    } else {
      setProducts(prev => [...prev, ...result.products]);
    }
    setTotalCount(result.totalCount);
    setIsInitialLoading(false);
    setIsLoading(false);
  }, [products.length]);

  // Debounced search and instant filter effect
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchProducts(true, searchQuery, activeCategory, sortBy);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchQuery, activeCategory, sortBy]);

  const handleLoadMore = () => {
    fetchProducts(false, searchQuery, activeCategory, sortBy);
  };

  return (
    <div className=" w-full min-h-screen text-(--text-main) py-20 mt-[15dvh]">
      <div className="w-[80dvw] mx-auto ">
        {/* Header Section */}
        <div className="mb-5">
          <h1 className=" text-4xl lg:text-5xl font-bold font-grotesk mb-8 tracking-tight">
            Premium <span className="text-(--accent)">Digital</span> Solutions
          </h1>
          <p className="text-(--text-main) text-lg lg:text-xl max-w-2xl font-inter leading-relaxed">
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
              className="w-full bg-(--bg-dark) border border-(--bg-dark) rounded-full py-6 pl-20 pr-10 text-xl focus:outline-none border-(--accent) border-1 focus:border-(--accent)/30 transition-all font-inter shadow-2xl"
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
                {/* <option value="Popular">Popularity</option> */}
                <option value="Price: Low to High">Price Low to High</option>
                <option value="Price: High to Low">Price High to Low</option>
                <option value="Name: A-Z">Name A-Z</option>
              </select>
            </div>
          </div>
        </div>

        {/* Product Grid */}
        {isInitialLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-8 mb-32">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="h-[400px] bg-(--bg-dark) border border-(--bg-dark) rounded-3xl animate-pulse" />
            ))}
          </div>
        ) : products.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-8 mb-12">
              {products.map((product) => (
              <ProductCard
                key={product.id}
                product={{
                  ...product,
                  price: product.price.toString(),
                  category: product.category,
                  isBestseller: false, // Placeholder for logic
                  features: (product as any).features || ["Lifetime Activation", "Direct Support", "256-bit Encryption"]
                } as any}
                categoryIcon={categoryIcons[product.category]}
              />
              ))}
            </div>

            {/* Load More Button */}
            {products.length < totalCount && (
              <div className="flex justify-center mb-32">
                <button
                  onClick={handleLoadMore}
                  disabled={isLoading}
                  className="group flex items-center gap-3 px-10 py-5 bg-(--bg-dark) border border-(--bg-dark) hover:border-(--accent)/50 rounded-2xl text-(--text-main) font-bold font-inter transition-all shadow-xl hover:shadow-(--accent)/10 disabled:opacity-50"
                >
                  {isLoading ? (
                    <Loader2 className="w-5 h-5 text-(--accent) animate-spin" />
                  ) : (
                    <Plus className="w-5 h-5 text-(--accent) group-hover:rotate-90 transition-transform duration-300" />
                  )}
                  {isLoading ? "Loading..." : "Load More Products"}
                  <span className="text-xs text-gray-500 ml-2">
                    ({products.length} of {totalCount})
                  </span>
                </button>
              </div>
            )}
          </>
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
