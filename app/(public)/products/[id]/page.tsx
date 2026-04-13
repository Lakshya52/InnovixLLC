"use client";

import React, { useState, use } from "react";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import {
  ChevronRight,
  Star,
  ShieldCheck,
  Zap,
  Headphones,
  Globe,
  ArrowLeft,
  ShoppingCart,
  Zap as ZapIcon,
  Shield,
  Cpu,
  Lock,
  Briefcase,
  Database,
  Terminal,
  Server,
  Monitor,
  LayoutGrid,
  Plus,
  Minus,
  Check
} from "lucide-react";
import { products } from "@/lib/products";
import { notFound, useRouter } from "next/navigation";

// Map icons from strings to components
const iconMap: Record<string, React.ReactNode> = {
  Shield: <Shield className="w-10 h-10 text-(--accent)" />,
  Zap: <ZapIcon className="w-10 h-10 text-(--accent)" />,
  Cpu: <Cpu className="w-10 h-10 text-(--accent)" />,
  Globe: <Globe className="w-10 h-10 text-(--accent)" />,
  Lock: <Lock className="w-10 h-10 text-(--accent)" />,
  Briefcase: <Briefcase className="w-10 h-10 text-(--accent)" />,
  Database: <Database className="w-10 h-10 text-(--accent)" />,
  Terminal: <Terminal className="w-10 h-10 text-(--accent)" />,
  Server: <Server className="w-10 h-10 text-(--accent)" />,
  Monitor: <Monitor className="w-10 h-10 text-(--accent)" />,
  LayoutGrid: <LayoutGrid className="w-10 h-10 text-(--accent)" />
};

export default function ProductDetails({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const router = useRouter();
  const product = products.find((p) => p.id === resolvedParams.id);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState("Overview");
  const { addToCart, cart } = useCart();
  const [isAdded, setIsAdded] = useState(false);

  if (!product) {
    notFound();
  }

  const handleAddToCart = () => {
    addToCart(product, quantity);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000);
  };

  const handleBuyNow = () => {
    const isInCart = cart.some(item => item.product.id === product.id);
    if (!isInCart) {
      addToCart(product, quantity);
    }
    router.push("/cart");
  };

  return (
    <div className=" min-h-screen text-white pt-28 w-full pb-20 px-4 md:px-8 mt-20 relative">
      {/* background gradient */}
      <div className="absolute inset-0 bg-(--accent)/20 top-0 rotate-135 w-1/5 left-0 blur-3xl h-1/5 rounded-full shadow-[10px_10px_100px_var(--accent)] z-[-10]" />
      <div className="w-[80dvw] mx-auto">
        {/* Breadcrumbs */}
        {/* Main Product Section */}
        <div className="flex items-center justify-between h-[70dvh] gap-20">
          {/* Left: Product Info */}
          <div className="flex flex-col">

            <h1 className="text-4xl max-w-xl md:text-6xl font-bold font-grotesk mb-6 leading-tight">
              {product.name}
            </h1>

            <p className="text-gray-400 text-lg md:text-xl font-inter leading-relaxed mb-8">
              {product.description}
            </p>

            <div className="flex items-baseline gap-4 mb-10">
              <span className="text-5xl font-bold font-grotesk">${product.price}</span>
              <span className="text-gray-500 text-lg line-through font-inter">${(parseFloat(product.price) * 1.5).toFixed(2)}</span>
            </div>

            {/* Quantity and Actions */}
            <div className="flex flex-col sm:flex-row items-center gap-6 mb-12">
              <div className="flex items-center bg-white/[0.03] border border-white/10 rounded-2xl p-2 h-16">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-12 h-12 flex items-center justify-center hover:bg-white/5 rounded-xl transition-colors"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="w-12 text-center font-bold text-xl font-grotesk">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-12 h-12 flex items-center justify-center hover:bg-white/5 rounded-xl transition-colors"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>

              <button
                onClick={handleAddToCart}
                className={`flex-1 w-full font-bold h-16 rounded-2xl transition-all duration-300 shadow-[0_0_20px_rgba(110,221,134,0.3)] flex items-center justify-center gap-3 font-grotesk text-lg group ${isAdded ? "bg-white text-black" : "bg-[#6eDD86] hover:bg-[#5dbb72] text-black"
                  }`}
              >
                {isAdded ? "Added!" : "Add to Cart"}
                {!isAdded && <ShoppingCart className="w-5 h-5 transition-transform group-hover:scale-110" />}
              </button>

              <button
                onClick={handleBuyNow}
                className="flex-1 w-full bg-white/[0.05] hover:bg-white/[0.1] text-white font-bold h-16 rounded-2xl transition-all duration-300 border border-white/10 flex items-center justify-center gap-3 font-grotesk text-lg"
              >
                Buy Now
              </button>
            </div>

            {/* Features List */}
            {/* <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {product.features.map((feature, i) => (
                <div key={i} className="flex items-center gap-3 text-gray-400 font-inter py-2 border-b border-white/[0.03]">
                  <Check className="w-4 h-4 text-[#6eDD86]" />
                  <span>{feature}</span>
                </div>
              ))}
            </div> */}
          </div>
          {/* product image */}
          <img src={product.image} alt={`${product.name} product image`} className="w-1/2 h-[70dvh] rounded-[40px] shadow-2xl shadow-[10px_10px_100px_var(--accent)] hover:shadow-[10px_10px_300px_var(--accent)] transition-all duration-300" />
        </div>

        {/* Details & Specs Section */}
        <div className="border-t border-white/5 pt-20">
          <div className="flex items-center gap-8 mb-12 border-b border-white/5">
            {["Overview", "Technical Info", "Reviews"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`pb-4 text-lg font-bold font-grotesk transition-all relative ${activeTab === tab ? "text-white" : "text-gray-500 hover:text-white/70"
                  }`}
              >
                {tab}
                {activeTab === tab && (
                  <div className="absolute bottom-0 left-0 w-full h-1 bg-[#6eDD86] rounded-full" />
                )}
              </button>
            ))}
          </div>

          {activeTab === "Overview" && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
              <div className="lg:col-span-2 space-y-12">
                <div>
                  <h2 className="text-3xl font-bold font-grotesk mb-6">Product Overview</h2>
                  <p className="text-gray-400 text-lg leading-relaxed font-inter">
                    {product.longPara1}
                  </p>
                  <br />
                  <p className="text-gray-400 text-lg leading-relaxed font-inter">
                    {product.longPara2}
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {product.keyFeatures.map((kf, i) => (
                    <div key={i} className="bg-white/[0.02] border border-white/5 p-8 rounded-[40px] hover:bg-white/[0.04] transition-all">
                      <div className="min-w-20 max-w-20 min-h-20 max-h-20 rounded-2xl bg-[#6eDD86]/10 flex items-center justify-center mb-6">
                        {iconMap[kf.icon] || <ZapIcon className="w-6 h-6 text-[#6eDD86]" />}
                        <h3 className="text-xl font-bold font-grotesk mb-4">{kf.title}</h3>
                      </div>
                      <p className="text-gray-500 font-inter text-sm leading-relaxed">{kf.description}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white/[0.02] border border-white/5 p-8 rounded-[40px] h-fit sticky top-32">
                <h2 className="text-xl font-bold font-grotesk mb-8 flex items-center gap-3">
                  <ShieldCheck className="w-5 h-5 text-[#6eDD86]" />
                  Product Details
                </h2>
                <div className="space-y-6">
                  {product.specs.map((spec, i) => (
                    <div key={i} className="flex items-center justify-between py-4 border-b border-white/[0.03]">
                      <span className="text-gray-500 text-sm font-inter">{spec.label}</span>
                      <span className="font-bold text-sm font-grotesk">{spec.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
